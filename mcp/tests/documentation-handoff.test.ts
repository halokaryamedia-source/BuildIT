import { describe, expect, test } from "bun:test";
import { readdir } from "node:fs/promises";

async function text(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("Codex documentation handoff", () => {
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

  test("current documentation treats local acceptance as completed history rather than default boot", async () => {
    const [next, runbook, dashboard, operations, sourceMap, implementation] = await Promise.all([
      text("../docs/knowledge/next-action.md"),
      text("../docs/knowledge/operations/local-acceptance-runbook.md"),
      text("../docs/knowledge/index.md"),
      text("../docs/knowledge/operations/README.md"),
      text("../docs/knowledge/sources/source-map.md"),
      text("../docs/knowledge/implementation-map.md"),
    ]);

    expect(next).toContain("LOCAL — run one fresh Codex efficiency trace");
    expect(next).toContain("completed procedure/history reference");
    expect(next).not.toContain("LOCAL — follow operations/local-acceptance-runbook.md");
    expect(runbook).toContain("Do not edit source while establishing the baseline");
    expect(runbook).toContain("Failure Classification Before Fix");
    expect(dashboard).toContain("Local Acceptance Runbook");
    expect(dashboard).toContain("Current continuation is **efficiency evidence**");
    expect(operations).toContain("historical implementation → Git history / reviews/");
    expect(operations).toContain("The first local acceptance pass is complete");
    expect(operations).not.toContain("mcp-reduction-stabilization-plan.md");
    expect(operations).not.toContain("roadmap.md");
    expect(sourceMap).toContain("mcp/prompts/bedrock_entity_workflow.md");
    expect(implementation).toContain("62 enabled tools");
    expect(implementation).toContain("### MCP result representation");
    expect(implementation).toContain("fresh Codex trace");

    for (const currentDoc of [next, dashboard, sourceMap, implementation]) {
      expect(currentDoc).not.toContain("mcp/prompts/bedrock.md");
    }
  });

  test("current proof docs agree that functional acceptance is complete while efficiency remains evidence-driven", async () => {
    const [validation, next, context, runbook] = await Promise.all([
      text("../docs/foundation/validation-report.md"),
      text("../docs/knowledge/next-action.md"),
      text("../CONTEXT.md"),
      text("../docs/knowledge/operations/local-acceptance-runbook.md"),
    ]);

    expect(validation).toContain("LOCAL_ACCEPTANCE_COMPLETE");
    expect(validation).toContain("62 enabled tools");
    expect(validation).toContain("UNKNOWN");
    expect(next).toContain("Functional local acceptance is complete");
    expect(next).toContain("fresh Codex efficiency trace");
    expect(context).toContain("first bounded Codex + Blockbench local acceptance pass completed");
    expect(context).not.toContain("The next authoritative stage is **Codex + Blockbench local acceptance**");
    expect(runbook).toContain("Active only when `docs/knowledge/next-action.md` points here");
  });
});
