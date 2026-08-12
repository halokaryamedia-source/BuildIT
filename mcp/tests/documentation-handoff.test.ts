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
    expect(activation).toContain("Hot-Path Defect Index");
    expect(skillMap).toContain("exact-name deferred spec loading");
    expect(skillMap).not.toContain("exactly six canonical skills");
    expect(developmentBrief).not.toContain("`grilling`");
    expect(developmentBrief).not.toContain("`code-review`");
  });

  test("current documentation holds the measured GitHub-only baseline without starting local", async () => {
    const [next, runbook, dashboard, operations, sourceMap, implementation, reviewGraph] = await Promise.all([
      text("../docs/knowledge/next-action.md"),
      text("../docs/knowledge/operations/local-acceptance-runbook.md"),
      text("../docs/knowledge/index.md"),
      text("../docs/knowledge/operations/README.md"),
      text("../docs/knowledge/sources/source-map.md"),
      text("../docs/knowledge/implementation-map.md"),
      text("../docs/knowledge/reviews/review-graph.md"),
    ]);

    expect(next.length).toBeLessThan(7_000);
    expect(next).toContain("PRE_LOCAL_EFFICIENCY_CLEANUP_COMPLETE");
    expect(next).toContain("does **not** want another local Codex/Blockbench run yet");
    expect(next).toContain("GitHub-Only Pretest Hardening");
    expect(next).toContain("Native Deferred MCP Discovery");
    expect(next).toContain("386 characters");
    expect(next).toContain("74,996 tools/list response characters");
    expect(next).toContain("51,810 input-schema characters");
    expect(next).toContain("10,885 description characters");
    expect(next).toContain("Post-P4 Current-State Synchronization");
    expect(next).toContain("do not run local until the user explicitly requests testing");
    expect(next).not.toContain("LOCAL — run one fresh Codex efficiency trace");
    expect(next).not.toContain("LOCAL — follow operations/local-acceptance-runbook.md");

    expect(runbook).toContain("Active only when `docs/knowledge/next-action.md` points here");
    expect(dashboard).toContain("Static pre-local efficiency cleanup is complete");
    expect(dashboard).toContain("P0–P4 follow-up hardening is also complete");
    expect(dashboard).toContain("Another Codex/Blockbench run is **not active**");
    expect(operations).toContain("The first local acceptance pass is complete");
    expect(operations).not.toContain("mcp-reduction-stabilization-plan.md");
    expect(operations).not.toContain("roadmap.md");
    expect(sourceMap).toContain("completed local procedure");
    expect(sourceMap).toContain("mcp/prompts/bedrock_entity_workflow.md");
    expect(sourceMap).toContain("Hot-Path Defect Index");
    expect(sourceMap).toContain("Audit-time helper names are lineage");
    expect(implementation).toContain("Fresh GitHub/CI serialized measurement");
    expect(implementation).toContain("Deferred MCP Discovery Ownership");
    expect(implementation).toContain("Authoring Decision / Recovery Ownership");
    expect(implementation).toContain("initialize instructions: 386 characters");
    expect(implementation).toContain("74,996 tools/list response characters");
    expect(implementation).toContain("### MCP result representation");
    expect(implementation).toContain("identity/type/parent discovery only");
    expect(implementation).toContain("active skill references regression-checked");
    expect(implementation).toContain("No new local run is active");
    expect(reviewGraph).toContain("current-state documentation synchronization COMPLETE");
    expect(reviewGraph).not.toContain("non-local source/contract/CI cleanup COMPLETE");

    for (const currentDoc of [next, dashboard, sourceMap, implementation]) {
      expect(currentDoc).not.toContain("mcp/prompts/bedrock.md");
    }
  });

  test("named MCP-tool defects have a bounded source and primary-test index", async () => {
    const [root, implementation] = await Promise.all([
      text("../AGENTS.md"),
      text("../docs/knowledge/implementation-map.md"),
    ]);

    expect(root).toContain("Hot-Path Defect Index");
    expect(root).toContain("docs/knowledge/implementation-map.md");
    expect(implementation).toContain("## Hot-Path Defect Index");
    expect(implementation).toContain("first-stop index, not exhaustive ownership");
    expect(implementation).toContain("Do not load every listed test");
    expect(implementation).toContain("`undo`/`redo` remain source-owned");

    const mappings = [
      { tools: ["create_project"], source: "server/tools/project.ts", test: "tests/p1-core-ownership.test.ts" },
      { tools: ["get_project_info"], source: "server/tools/project.ts", test: "tests/static-efficiency-budget.test.ts" },
      { tools: ["inspect_model_bounds"], source: "server/tools/project.ts", test: "tests/rendered-model-bounds-numeric-safety.test.ts" },
      { tools: ["place_cube", "modify_cube", "modify_cubes_batch"], source: "server/tools/cubes.ts", test: "tests/model-effectiveness-correction-accuracy.test.ts" },
      { tools: ["add_group"], source: "server/tools/element.ts", test: "tests/p1-core-ownership.test.ts" },
      { tools: ["list_outline", "find_elements_by_criteria"], source: "server/tools/element.ts", test: "tests/context-payload-cleanup.test.ts" },
      { tools: ["inspect_element"], source: "server/tools/element-inspection.ts", test: "tests/model-effectiveness-correction-accuracy.test.ts" },
      { tools: ["capture_model_views"], source: "server/tools/camera.ts", test: "tests/camera-framing-contract.test.ts" },
      { tools: ["list_locator_elements", "manage_locator", "manage_null_object"], source: "server/tools/locators.ts", test: "tests/bedrock-locator-coverage.test.ts" },
      { tools: ["create_texture", "list_textures", "get_texture", "activate_texture"], source: "server/tools/texture.ts", test: "tests/context-payload-cleanup.test.ts" },
      { tools: ["create_pbr_material", "configure_material", "assign_texture_channel"], source: "server/tools/texture.ts", test: "tests/pbr-channel-contract.test.ts" },
      { tools: ["create_animation"], source: "server/tools/animation.ts", test: "tests/create-animation-contract.test.ts" },
      { tools: ["manage_keyframes", "animation_graph_editor", "bone_rigging", "animation_timeline", "batch_keyframe_operations", "animation_copy_paste"], source: "server/tools/animation.ts", test: "tests/animation-mutation-contract.test.ts" },
      { tools: ["inspect_animation"], source: "server/tools/animation-inspection.ts", test: "tests/context-payload-cleanup.test.ts" },
      { tools: ["get_undo_stack"], source: "server/tools/history.ts", test: "tests/static-efficiency-budget.test.ts" },
      { tools: ["export_model"], source: "server/tools/export.ts", test: "tests/prelocal-generic-semantics.test.ts" },
    ];

    for (const mapping of mappings) {
      const repoSource = `mcp/${mapping.source}`;
      const repoTest = `mcp/${mapping.test}`;
      const row = implementation
        .split("\n")
        .find((line) => mapping.tools.every((tool) => line.includes(`\`${tool}\``)));
      expect(row).toBeDefined();
      expect(row).toContain(`\`${repoSource}\``);
      expect(row).toContain(`\`${repoTest}\``);
      expect(await Bun.file(mapping.source).exists()).toBe(true);
      expect(await Bun.file(mapping.test).exists()).toBe(true);
      const sourceText = await text(mapping.source);
      for (const tool of mapping.tools) expect(sourceText).toContain(tool);
    }
  });

  test("proof docs separate accepted live evidence from current deferred-search architecture", async () => {
    const [validation, next, context, implementation] = await Promise.all([
      text("../docs/foundation/validation-report.md"),
      text("../docs/knowledge/next-action.md"),
      text("../CONTEXT.md"),
      text("../docs/knowledge/implementation-map.md"),
    ]);

    expect(validation).toContain("LOCAL_ACCEPTANCE_COMPLETE");
    expect(validation).toContain("Fresh GitHub-Only Serialized Surface Proof");
    expect(validation).toContain("Native Deferred MCP Discovery Compatibility");
    expect(validation).toContain("Current P0–P4 Static Efficiency Proof");
    expect(validation).toContain("OFFICIALLY VERIFIED");
    expect(validation).toContain("initialize instructions: 386 characters");
    expect(validation).toContain("74,996 tools/list response characters");
    expect(validation).toContain("51,810 input-schema characters");
    expect(validation).toContain("10,885 description characters");
    expect(validation).toContain("not evidence of overall token/context savings");
    expect(validation).toContain("`action` is top-level-required");
    expect(validation).toContain("active routing references resolve");
    expect(validation).toContain("LOCAL PROOF REQUIRED");

    expect(next).toContain("PRE_LOCAL_EFFICIENCY_CLEANUP_COMPLETE");
    expect(next).toContain("native deferred MCP tool search exists");
    expect(context).toContain("first bounded Codex + Blockbench local acceptance pass completed");
    expect(context).not.toContain("The next authoritative stage is **Codex + Blockbench local acceptance**");
    expect(implementation).toContain("Source-provable cleanup and GitHub-only pretest hardening are complete");
  });
});
