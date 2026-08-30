import { describe, expect, test } from "bun:test";

type ActionRef = {
  action: string;
  revision: string;
  note: string;
};

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

function actionRefs(workflow: string): ActionRef[] {
  return [...workflow.matchAll(/^\s*uses:\s+([^@\s]+)@([^\s#]+)(?:\s+#\s*(.+))?$/gm)].map(
    (match) => ({
      action: match[1],
      revision: match[2],
      note: (match[3] ?? "").trim(),
    })
  );
}

function expectImmutableActions(workflow: string, expectedActions: string[]): void {
  const refs = actionRefs(workflow);
  expect(refs.map((entry) => entry.action).sort()).toEqual([...expectedActions].sort());
  for (const ref of refs) {
    expect(ref.revision).toMatch(/^[0-9a-f]{40}$/);
    expect(ref.note).toMatch(/^v\d+$/);
  }
  expect(workflow).not.toMatch(/^\s*uses:\s+[^\s]+@(main|master|latest|v\d+)\s*$/gm);
}

describe("repository workflow supply chain", () => {
  test("verification and experimental workflows pin trusted Actions to immutable revisions", async () => {
    const [repository, authoring, mcp, release, experimental] = await Promise.all([
      source("../.github/workflows/repository-verify.yml"),
      source("../.github/workflows/authoring-policy-verify.yml"),
      source("../.github/workflows/mcp-verify.yml"),
      source("../.github/workflows/release-verify.yml"),
      source("../.github/workflows/blockbench-web-poc.yml"),
    ]);

    for (const workflow of [repository, authoring, mcp, release]) {
      expectImmutableActions(workflow, ["actions/checkout", "oven-sh/setup-bun"]);
    }
    expectImmutableActions(experimental, [
      "actions/checkout",
      "actions/setup-node",
      "actions/upload-artifact",
    ]);
  });

  test("verification workflows install only the dependency surface they execute", async () => {
    const [mcpWorkflow, repositoryWorkflow, authoringWorkflow, releaseWorkflow, bunVersion] = await Promise.all([
      source("../.github/workflows/mcp-verify.yml"),
      source("../.github/workflows/repository-verify.yml"),
      source("../.github/workflows/authoring-policy-verify.yml"),
      source("../.github/workflows/release-verify.yml"),
      source("../.bun-version"),
    ]);

    expect(bunVersion.trim()).toMatch(/^\d+\.\d+\.\d+$/);
    expect(await Bun.file("bun.lock").exists()).toBe(true);

    for (const workflow of [mcpWorkflow, repositoryWorkflow, authoringWorkflow, releaseWorkflow]) {
      expect(workflow).toContain('bun-version-file: ".bun-version"');
      expect(workflow).toContain("contents: read");
      expect(workflow).toContain("persist-credentials: false");
    }

    expect(repositoryWorkflow).toContain("timeout-minutes: 5");
    expect(authoringWorkflow).toContain("timeout-minutes: 5");
    expect(mcpWorkflow).toContain("timeout-minutes: 10");
    expect(releaseWorkflow).toContain("timeout-minutes: 10");

    expect(mcpWorkflow).toContain("bun install --frozen-lockfile");
    expect(releaseWorkflow).toContain("bun install --frozen-lockfile");
    expect(authoringWorkflow).toContain("bun install --frozen-lockfile --production");
    expect(repositoryWorkflow).not.toContain("bun install");
  });

  test("developer-facing static docs route to repository verification rather than the full MCP gate", async () => {
    const [repositoryWorkflow, mcpWorkflow] = await Promise.all([
      source("../.github/workflows/repository-verify.yml"),
      source("../.github/workflows/mcp-verify.yml"),
    ]);

    expect(repositoryWorkflow).toContain('"docs/knowledge/flow.md"');
    expect(repositoryWorkflow).toContain('"mcp/llms.txt"');
    expect(mcpWorkflow).toContain('"!mcp/llms.txt"');
  });

  test("repository hygiene owners are present and routed to static verification", async () => {
    const repositoryWorkflow = await source("../.github/workflows/repository-verify.yml");

    expect(repositoryWorkflow).toContain('".editorconfig"');
    expect(repositoryWorkflow).toContain('"SECURITY.md"');
    expect(await Bun.file("../.editorconfig").exists()).toBe(true);
    expect(await Bun.file("../SECURITY.md").exists()).toBe(true);
  });

  test("supply-chain policy retains least-privilege and pinned-action boundaries", async () => {
    const rules = await source("../GITHUB_RULES.md");
    expect(rules).toMatch(/least-privilege/i);
    expect(rules).toMatch(/pinned\/trusted action versions/i);
    expect(rules).toMatch(/event-derived strings as untrusted input/i);
    expect(rules).toMatch(/pull_request_target/);
  });
});
