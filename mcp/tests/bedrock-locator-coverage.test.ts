import { describe, expect, test } from "bun:test";
import { manageLocatorParameters, manageNullObjectParameters } from "@/server/tools/locators";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("Bedrock Locator / Null Object direct coverage", () => {
  test("Locator create defaults only native authored fields", () => {
    expect(manageLocatorParameters.parse({ action: "create", name: "muzzle", parent: "bone-uuid" })).toEqual({
      action: "create", name: "muzzle", parent: "bone-uuid", position: [0, 0, 0], rotation: [0, 0, 0], ignore_inherited_scale: false,
    });
    expect(manageLocatorParameters.safeParse({ action: "update", id: "locator-uuid" }).success).toBe(false);
  });

  test("Locator and Null Object transforms reject non-finite authored coordinates", async () => {
    expect(manageLocatorParameters.safeParse({ action: "create", name: "muzzle", parent: "bone", position: [Infinity, 0, 0] }).success).toBe(false);
    expect(manageLocatorParameters.safeParse({ action: "update", id: "loc", rotation: [0, -Infinity, 0] }).success).toBe(false);
    expect(manageNullObjectParameters.safeParse({ action: "update", id: "null", position: [0, 0, Infinity] }).success).toBe(false);
    const locatorSource = await source("server/tools/locators.ts");
    expect(locatorSource).toContain("finiteAuthoredVector3(");
    expect(locatorSource).toContain("locator.position,");
    expect(locatorSource).toContain("locator.rotation,");
    expect(locatorSource).toContain("element.position,");
    expect(locatorSource).not.toContain("vector3Schema");
  });

  test("Null Object base mutation does not invent rotation or IK mutation", () => {
    expect(manageNullObjectParameters.parse({ action: "create", name: "ik_helper", parent: "bone-uuid" })).toEqual({
      action: "create", name: "ik_helper", parent: "bone-uuid", position: [0, 0, 0],
    });
    expect(manageNullObjectParameters.safeParse({ action: "update", id: "null-uuid", rotation: [0, 45, 0] }).success).toBe(false);
    expect(manageNullObjectParameters.safeParse({ action: "update", id: "null-uuid", ik_target: "locator-uuid" }).success).toBe(false);
  });

  test("Locator tools stay inside the existing elements family", async () => {
    const toolsRoot = await source("server/tools.ts");
    expect(toolsRoot).toContain('import { registerLocatorTools } from "./tools/locators"');
    expect(toolsRoot).toContain("registerElementTools();\n  registerLocatorTools();");
    expect(toolsRoot).toContain("elements: registerElementFamilyTools");
  });

  test("explicit parent targets are resolved before Undo and failures can roll back", async () => {
    const locatorSource = await source("server/tools/locators.ts");
    const parent = locatorSource.indexOf("const parent = resolveParent(args.parent);");
    const undo = locatorSource.indexOf("Undo.initEdit({ elements: edited, outliner: true });");
    expect(parent).toBeGreaterThan(-1);
    expect(undo).toBeGreaterThan(parent);
    expect(locatorSource).toContain("Undo.cancelEdit(true)");
    expect(locatorSource).toContain('formatId !== "bedrock"');
  });

  test("generic remove_element snapshots recursive deletion state and returns a compact receipt", async () => {
    const elementSource = await source("server/tools/element.ts");
    const start = elementSource.indexOf("createTool(elementToolDocs[0].name");
    const end = elementSource.indexOf("createTool(elementToolDocs[1].name", start);
    const block = elementSource.slice(start, end);
    expect(block).toContain("const removedRoot = elementContinuationState(element);");
    expect(block).toContain("const deleteElements: OutlinerElement[] = [];");
    expect(block).toContain("const deleteGroups: Group[] = [];");
    expect(block).toContain("element.forEachChild");
    expect(block).toContain("animations: deleteAnimations");
    expect(block).toContain("const deletionCounts = {");
    expect(block).toContain("total_nodes: deleteGroups.length + deleteElements.length");
    expect(block).toContain("const affectedAnimationCount = deleteAnimations.length;");
    expect(block.indexOf("const deleteAnimations")).toBeLessThan(block.indexOf("Undo.initEdit({"));
    expect(block.indexOf("const deletionCounts")).toBeLessThan(block.indexOf("Undo.initEdit({"));
    expect(block).toContain("removed_root: removedRoot");
    expect(block).toContain("removed_counts: deletionCounts");
    expect(block).toContain("affected_animations: affectedAnimationCount");
    expect(block).toContain("structuredContent: result");
  });

  test("inspect_element exposes authored Locator and Null Object state", async () => {
    const inspection = await source("server/tools/element-inspection.ts");
    expect(inspection).toContain("...Locator.all");
    expect(inspection).toContain("...NullObject.all");
    expect(inspection).toContain('type: "locator" as const');
    expect(inspection).toContain('type: "null_object" as const');
    expect(inspection).toContain("ik_source: element.ik_source || null");
  });

  test("Null Object creation rejects duplicate exact names before Undo", async () => {
    const locatorSource = await source("server/tools/locators.ts");
    const block = locatorSource.slice(locatorSource.indexOf("locatorToolDocs[2].name"));
    expect(block.indexOf("NullObject.all.some")).toBeGreaterThan(-1);
    expect(block.indexOf("Undo.initEdit")).toBeGreaterThan(block.indexOf("NullObject.all.some"));
    expect(block).toContain("must remain unique for deterministic references");
  });

  test("Null Object geometry round-trip distinction is documented", async () => {
    const locatorSource = await source("server/tools/locators.ts");
    expect(locatorSource).toContain("`_null_` locator entry");
    expect(locatorSource).toContain("IK fields remain Blockbench editor/animation state");
  });

  test("current owners keep Locator coverage mapped while remaining native gaps stay protected", async () => {
    // The runtime prompt compaction moved Locator routing/continuation
    // guidance to the orchestrator skill; the validation report keeps the
    // capability/gap ledger.
    const orchestrator = await source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md");
    const validation = await source("../docs/foundation/validation-report.md");
    expect(orchestrator).toContain("list_locator_elements");
    expect(orchestrator).toContain("manage_locator / manage_null_object");
    expect(orchestrator).toContain(
      "Do not automatically re-read them with `inspect_element`"
    );
    expect(validation).toContain("## Locator / Null Object");
    expect(validation).toContain("TextureMesh direct authoring/inspection");
    expect(validation).toContain("AnimationController blend-curve mutation");
  });
});
