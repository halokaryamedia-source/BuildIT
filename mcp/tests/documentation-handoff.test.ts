import { describe, expect, test } from "bun:test";
import { readdir } from "node:fs/promises";

async function text(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("Codex documentation handoff", () => {
  test("current repository-owned skill inventory resolves directly from canonical packages", async () => {
    const dirs = (await readdir("../.agents/skills", { withFileTypes: true }))
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort();

    expect(dirs).toEqual([
      "blockbench-bedrock-modelling",
      "blockbench-reference-generator",
      "blockbench-runtime-development",
      "blockit-bedrock-animation",
      "blockit-bedrock-entity-mcp",
      "blockit-bedrock-texturing",
      "bun-tooling",
      "development-brief",
      "mcp-server-development",
      "typescript-type-safety",
    ]);

    for (const name of dirs) {
      expect(await Bun.file(`../.agents/skills/${name}/SKILL.md`).exists()).toBe(true);
    }

    const [context, root, developmentBrief, referenceGenerator] = await Promise.all([
      text("../CONTEXT.md"),
      text("../AGENTS.md"),
      text("../.agents/skills/development-brief/SKILL.md"),
      text("../.agents/skills/blockbench-reference-generator/SKILL.md"),
    ]);
    expect(context).toContain("ten repository-owned skill packages");
    expect(root).toContain("### Reference Preparation");
    expect(root).toContain("### Asset Authoring");
    expect(root).toContain("### Repository / Plugin Work");
    expect(root).toContain("Hot-Path Defect Index");
    expect(referenceGenerator).toContain("Return **one image only**");
    expect(referenceGenerator).toContain("automatic variants   = 0");
    expect(referenceGenerator).toContain("Do not generate ZIPs");
    expect(developmentBrief).not.toContain("`grilling`");
    expect(developmentBrief).not.toContain("`code-review`");
  });

  test("current continuation stays bounded and keeps local acceptance explicitly deferred", async () => {
    const [next, runbook, implementation] = await Promise.all([
      text("../docs/knowledge/next-action.md"),
      text("../docs/knowledge/operations/local-acceptance-runbook.md"),
      text("../docs/knowledge/implementation-map.md"),
    ]);

    expect(next.length).toBeLessThan(7_000);
    expect(next).toContain("Working branch: **`Local` only**");
    expect(next).toMatch(/PRO-1(?:–PRO-8|[^\n]*PRO-2)/);
    expect(next).toContain("PRELOCAL_OPTIMIZATION_COMPLETE");
    expect(next).toContain("## Next Step");
    expect(next).toContain("NO LOCAL RUN ACTIVE");
    expect(next).toContain("LOCAL ACCEPTANCE DEFERRED");
    expect(next).toContain("LOCAL PROOF REQUIRED");
    expect(next).not.toContain("execute runbook sections 3–4");
    expect(next).toContain("Do not claim live Blockbench/model-quality or runtime-usage improvement without actual runtime proof");
    expect(runbook).toContain("Active only when `docs/knowledge/next-action.md` points here");
    expect(implementation).toContain("## Hot-Path Defect Index");
    expect(implementation).toContain("62 enabled tools");
    expect(implementation).toContain("No local run is active");
  });

  test("status owners stay synchronized", async () => {
    const [rootReadme, mcpReadme, next, validation] = await Promise.all([
      text("../README.md"),
      text("README.md"),
      text("../docs/knowledge/next-action.md"),
      text("../docs/foundation/validation-report.md"),
    ]);
    for (const owner of [rootReadme, mcpReadme, next, validation]) {
      expect(owner).toContain("PRELOCAL_OPTIMIZATION_COMPLETE");
    }
    expect(rootReadme).toContain("Local Acceptance — Deferred");
    expect(mcpReadme).toContain("Local Acceptance — Inactive");
    expect(validation).toContain("LOCAL ACCEPTANCE:                   DEFERRED");
  });

  test("historical review and decision residue is absent from active knowledge", async () => {
    const dirs = (await readdir("../docs/knowledge", { withFileTypes: true }))
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);
    expect(dirs).not.toContain("reviews");
    expect(dirs).not.toContain("decisions");
    expect(await Bun.file("../docs/knowledge/reviews/bedrock-entity-capability-surface-matrix.md").exists()).toBe(false);
    expect(await Bun.file("../docs/knowledge/decisions/reference-fidelity-loop.md").exists()).toBe(false);
  });

  test("named MCP-tool defects have a bounded source and primary-test index", async () => {
    const [root, implementation] = await Promise.all([
      text("../AGENTS.md"),
      text("../docs/knowledge/implementation-map.md"),
    ]);

    expect(root).toContain("Hot-Path Defect Index");
    expect(root).toContain("docs/knowledge/implementation-map.md");
    expect(implementation).toContain("## Hot-Path Defect Index");
    expect(implementation).toContain("source owner + primary regression owner first");
    expect(implementation).toContain("Expand only if that pair cannot explain the defect");
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
      { tools: ["create_animation"], source: "server/tools/animation.ts", test: "tests/create-animation-contract.test.ts" },
      { tools: ["inspect_animation"], source: "server/tools/animation-inspection.ts", test: "tests/context-payload-cleanup.test.ts" },
      { tools: ["get_undo_stack"], source: "server/tools/history.ts", test: "tests/static-efficiency-budget.test.ts" },
      { tools: ["export_model"], source: "server/tools/export.ts", test: "tests/prelocal-generic-semantics.test.ts" },
    ];

    for (const mapping of mappings) {
      const row = implementation.split("\n").find((line) => mapping.tools.every((tool) => line.includes(`\`${tool}\``)));
      expect(row).toBeDefined();
      expect(row).toContain(`\`mcp/${mapping.source}\``);
      expect(row).toContain(`\`mcp/${mapping.test}\``);
      expect(await Bun.file(mapping.source).exists()).toBe(true);
      expect(await Bun.file(mapping.test).exists()).toBe(true);
    }
  });

  test("proof docs separate accepted live baseline from current static/model-facing evidence", async () => {
    const [validation, context, implementation] = await Promise.all([
      text("../docs/foundation/validation-report.md"),
      text("../CONTEXT.md"),
      text("../docs/knowledge/implementation-map.md"),
    ]);

    expect(validation).toContain("LOCAL_ACCEPTANCE_COMPLETE");
    expect(validation).toContain("Fresh GitHub-Only Serialized Surface Proof");
    expect(validation).toContain("Native Deferred MCP Discovery Compatibility");
    expect(validation).toContain("P0–P4 Static Efficiency / Decision Proof");
    expect(validation).toContain("Static Pre-local Optimization Closure");
    expect(validation).toContain("OFFICIALLY VERIFIED");
    expect(validation).toContain("LOCAL PROOF REQUIRED");
    expect(context).toContain("first bounded Codex + Blockbench local acceptance pass completed");
    expect(implementation).toContain("Deferred MCP Discovery Ownership");
    expect(implementation).toContain("Authoring Decision / Recovery Ownership");
  });
});
