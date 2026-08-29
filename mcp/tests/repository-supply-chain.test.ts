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

describe("repository workflow supply chain", () => {
  test("active verification workflows pin trusted Actions to immutable revisions", async () => {
    const workflows = await Promise.all([
      source("../.github/workflows/repository-verify.yml"),
      source("../.github/workflows/authoring-policy-verify.yml"),
      source("../.github/workflows/mcp-verify.yml"),
    ]);

    for (const workflow of workflows) {
      const refs = actionRefs(workflow);
      expect(refs).toHaveLength(2);
      expect(refs.map((entry) => entry.action).sort()).toEqual([
        "actions/checkout",
        "oven-sh/setup-bun",
      ]);

      for (const ref of refs) {
        expect(ref.revision).toMatch(/^[0-9a-f]{40}$/);
        expect(ref.note).toMatch(/^v\d+$/);
      }

      expect(workflow).not.toMatch(/^\s*uses:\s+[^\s]+@(main|master|latest|v\d+)\s*$/gm);
    }
  });

  test("verification workflows install only the dependency surface they execute", async () => {
    const [mcpWorkflow, repositoryWorkflow, authoringWorkflow, bunVersion] = await Promise.all([
      source("../.github/workflows/mcp-verify.yml"),
      source("../.github/workflows/repository-verify.yml"),
      source("../.github/workflows/authoring-policy-verify.yml"),
      source("../.bun-version"),
    ]);

    expect(bunVersion.trim()).toMatch(/^\d+\.\d+\.\d+$/);
    expect(await Bun.file("bun.lock").exists()).toBe(true);

    for (const workflow of [mcpWorkflow, repositoryWorkflow, authoringWorkflow]) {
      expect(workflow).toContain('bun-version-file: ".bun-version"');
      expect(workflow).toContain("contents: read");
    }

    expect(mcpWorkflow).toContain("bun install --frozen-lockfile");
    expect(mcpWorkflow).not.toContain("bun install --frozen-lockfile --production");

    expect(authoringWorkflow).toContain("bun install --frozen-lockfile --production");

    expect(repositoryWorkflow).not.toContain("bun install");
  });

  test("supply-chain policy retains least-privilege and pinned-action boundaries", async () => {
    const rules = await source("../GITHUB_RULES.md");
    expect(rules).toMatch(/least-privilege/i);
    expect(rules).toMatch(/pinned\/trusted action versions/i);
    expect(rules).toMatch(/event-derived strings as untrusted input/i);
    expect(rules).toMatch(/pull_request_target/);
  });
});
