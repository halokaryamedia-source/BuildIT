import { describe, expect, test } from "bun:test";
import { readdir } from "node:fs/promises";

async function text(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("Codex documentation handoff", () => {
  test("current repository-owned skill inventory is documented without stale routing", async () => {
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

    const [context, skillMap, activation, developmentBrief] = await Promise.all([
      text("../CONTEXT.md"),
      text("../docs/knowledge/skills/skill-map.md"),
      text("../docs/knowledge/skills/activation-matrix.md"),
      text("../.agents/skills/development-brief/SKILL.md"),
    ]);

    for (const name of dirs) expect(skillMap).toContain(name);
    expect(context).toContain("nine repository-owned skill packages");
    expect(activation).toContain("Asset Authoring Route");
    expect(activation).toContain("Repository / Plugin Development Route");
    expect(activation).toContain("Local Acceptance Route — Only When Reactivated");
    expect(skillMap).not.toContain("exactly six canonical skills");
    expect(developmentBrief).not.toContain("`grilling`");
    expect(developmentBrief).not.toContain("`code-review`");
  });

  test("current documentation holds a compact cleaned baseline without starting local", async () => {
    const [next, runbook, dashboard, operations, sourceMap, implementation] = await Promise.all([
      text("../docs/knowledge/next-action.md"),
      text("../docs/knowledge/operations/local-acceptance-runbook.md"),
      text("../docs/knowledge/index.md"),
      text("../docs/knowledge/operations/README.md"),
      text("../docs/knowledge/sources/source-map.md"),
      text("../docs/knowledge/implementation-map.md"),
    ]);

    expect(next.length).toBeLessThan(4_500);
    expect(next).toContain("PRE_LOCAL_EFFICIENCY_CLEANUP_COMPLETE");
    expect(next).toContain("do not run local until the user explicitly requests testing");
    expect(next).toContain("`list_locator_elements` is identity/type/parent discovery only");
    expect(next).toContain("repository-development instructions are also split by owner");
    expect(next).not.toContain("LOCAL — run one fresh Codex efficiency trace");
    expect(next).not.toContain("LOCAL — follow operations/local-acceptance-runbook.md");

    expect(runbook).toContain("Active only when `docs/knowledge/next-action.md` points here");
    expect(dashboard).toContain("Static pre-local efficiency cleanup is complete");
    expect(dashboard).toContain("Another Codex/Blockbench run is **not active**");
    expect(operations).toContain("The first local acceptance pass is complete");
    expect(operations).not.toContain("mcp-reduction-stabilization-plan.md");
    expect(operations).not.toContain("roadmap.md");
    expect(sourceMap).toContain("completed local procedure");
    expect(sourceMap).toContain("mcp/prompts/bedrock_entity_workflow.md");
    expect(implementation).toContain("62 enabled tools");
    expect(implementation).toContain("### MCP result representation");
    expect(implementation).toContain("## Completed Static Efficiency Hardening");
    expect(implementation).toContain("identity/type/parent discovery only");
    expect(implementation).toContain("repository-development context");
    expect(implementation).toContain("No new local run is active");

    for (const currentDoc of [next, dashboard, sourceMap, implementation]) {
      expect(currentDoc).not.toContain("mcp/prompts/bedrock.md");
    }
  });

  test("proof docs distinguish accepted live evidence from completed static hardening", async () => {
    const [validation, next, context, implementation] = await Promise.all([
      text("../docs/foundation/validation-report.md"),
      text("../docs/knowledge/next-action.md"),
      text("../CONTEXT.md"),
      text("../docs/knowledge/implementation-map.md"),
    ]);

    expect(validation).toContain("LOCAL_ACCEPTANCE_COMPLETE");
    expect(validation).toContain("source/contract/CI hardening complete");
    expect(validation).toContain("62 enabled tools");
    expect(validation).toContain("UNKNOWN");
    expect(validation).toContain("`list_locator_elements` now returns identity/type/parent discovery only");
    expect(validation).toContain("stale references to non-existent escalation skills were removed");
    expect(next).toContain("PRE_LOCAL_EFFICIENCY_CLEANUP_COMPLETE");
    expect(next).toContain("does **not** want another local Codex/Blockbench run yet");
    expect(context).toContain("first bounded Codex + Blockbench local acceptance pass completed");
    expect(context).not.toContain("The next authoritative stage is **Codex + Blockbench local acceptance**");
    expect(implementation).toContain("Source-provable cleanup is complete");
  });
});
