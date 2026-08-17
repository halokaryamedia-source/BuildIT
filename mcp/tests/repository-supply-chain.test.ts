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

  test("active Bun runtime and package resolution remain reproducible", async () => {
    const [mcpWorkflow, repositoryWorkflow, bunVersion] = await Promise.all([
      source("../.github/workflows/mcp-verify.yml"),
      source("../.github/workflows/repository-verify.yml"),
      source("../.bun-version"),
    ]);

    expect(bunVersion.trim()).toMatch(/^\d+\.\d+\.\d+$/);
    expect(await Bun.file("bun.lock").exists()).toBe(true);

    for (const workflow of [mcpWorkflow, repositoryWorkflow]) {
      expect(workflow).toContain('bun-version-file: ".bun-version"');
      expect(workflow).toContain("bun install --frozen-lockfile");
      expect(workflow).toContain("contents: read");
    }
  });

  test("supply-chain policy retains trusted-source and immutable-revision boundaries", async () => {
    const rules = await source("../GITHUB_RULES.md");
    expect(rules).toContain("trusted sources");
    expect(rules).toContain("immutable/pinned revisions");
    expect(rules).toContain("never move to `latest`, `main`, or `master`");
    expect(rules).toContain("Do not widen permissions");
  });
});
