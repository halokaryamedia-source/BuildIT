import { describe, expect, test } from "bun:test";
import { readdir } from "node:fs/promises";

async function text(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("pre-local Codex documentation handoff", () => {
  test("current repository-owned skill inventory is documented without stale six-skill routing", async () => {
    const dirs = (await readdir("../.agents/skills", { withFileTypes: true }))
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort();

    expect(dirs).toEqual([
      "blockbench-bedrock-modelling",
      "blockbench-runtime-development",
      "blockit-bedrock-animation",
      "blockit-bedrock-entity-mcp",
      "blockit-bedrock-texturing",
      "bun-tooling",
      "development-brief",
      "mcp-server-development",
      "typescript-type-safety",
    ]);

    const [context, skillMap, activation] = await Promise.all([
      text("../CONTEXT.md"),
      text("../docs/knowledge/skills/skill-map.md"),
      text("../docs/knowledge/skills/activation-matrix.md"),
    ]);

    for (const name of dirs) {
      expect(skillMap).toContain(name);
    }
    expect(context).toContain("nine repository-owned skill packages");
    expect(activation).toContain("Asset Authoring Route");
    expect(activation).toContain("Repository / Plugin Development Route");
    expect(skillMap).not.toContain("exactly six canonical skills");
  });

  test("current documentation routes repository continuation to one local acceptance runbook", async () => {
    const [next, runbook, dashboard, operations, sourceMap, implementation] = await Promise.all([
      text("../docs/knowledge/next-action.md"),
      text("../docs/knowledge/operations/local-acceptance-runbook.md"),
      text("../docs/knowledge/index.md"),
      text("../docs/knowledge/operations/README.md"),
      text("../docs/knowledge/sources/source-map.md"),
      text("../docs/knowledge/implementation-map.md"),
    ]);

    expect(next).toContain("LOCAL — follow operations/local-acceptance-runbook.md");
    expect(runbook).toContain("Do not edit source while establishing the baseline");
    expect(runbook).toContain("Failure Classification Before Fix");
    expect(dashboard).toContain("Local Acceptance Runbook");
    expect(operations).toContain("historical implementation → Git history / reviews/");
    expect(operations).not.toContain("mcp-reduction-stabilization-plan.md");
    expect(operations).not.toContain("roadmap.md");
    expect(sourceMap).toContain("mcp/prompts/bedrock_entity_workflow.md");
    expect(implementation).toContain("62 enabled tools");

    for (const currentDoc of [next, dashboard, sourceMap, implementation]) {
      expect(currentDoc).not.toContain("mcp/prompts/bedrock.md");
    }
  });

  test("current proof docs agree that runtime behavior is still local acceptance work", async () => {
    const [validation, next, runbook] = await Promise.all([
      text("../docs/foundation/validation-report.md"),
      text("../docs/knowledge/next-action.md"),
      text("../docs/knowledge/operations/local-acceptance-runbook.md"),
    ]);

    expect(validation).toContain("NON_LOCAL_PRELOCAL_READINESS_COMPLETE_LOCAL_ACCEPTANCE_REQUIRED");
    expect(validation).toContain("62 enabled tools");
    expect(validation).toContain("LOCAL PROOF REQUIRED");
    expect(next).toContain("Do not start another GitHub-only cleanup/reduction slice");
    expect(runbook).toContain("Do not modify source until the failure is reproducible");
  });
});
