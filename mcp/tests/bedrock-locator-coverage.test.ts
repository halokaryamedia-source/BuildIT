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
    for (const marker of [
      "const removedRoot = elementContinuationState(element);",
      "const deleteElements: OutlinerElement[] = [];",
      "const deleteGroups: Group[] = [];",
      "element.forEachChild",
      "animations: deleteAnimations",
      "removed_root: removedRoot",
      "removed_counts: deletionCounts",
      "affected_animations: affectedAnimationCount",
      "structuredContent: result",
    ]) expect(block).toContain(marker);
  });

  test("inspect_element exposes authored Locator and Null Object state", async () => {
    const inspection = await source("server/tools/element-inspection.ts");
    expect(inspection).toContain("...Locator.all");
    expect(inspection).toContain("...NullObject.all");
    expect(inspection).toContain('type: "locator" as const');
    expect(inspection).toContain('type: "null_object" as const');
    expect(inspection).toContain("ik_source: element.ik_source || null");
  });

  test("Null Object creation rejects duplicate exported keys before Undo", async () => {
    const locatorSource = await source("server/tools/locators.ts");
    expect(locatorSource).toContain(
      'assertLocatorExportKeyAvailable(parent, "null_object", args.name)'
    );
    expect(locatorSource).toContain(
      "Locator keys must be unique within each parent bone."
    );
  });

  test("Null Object geometry round-trip distinction is documented", async () => {
    const locatorSource = await source("server/tools/locators.ts");
    expect(locatorSource).toContain("`_null_` locator entry");
    expect(locatorSource).toContain("IK fields remain Blockbench editor/animation state");
  });

  test("current owners keep Locator coverage mapped while protected gaps remain explicit", async () => {
    const [orchestrator, implementation] = await Promise.all([
      source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md"),
      source("../docs/knowledge/implementation-map.md"),
    ]);
    expect(orchestrator).toContain("list_locator_elements");
    expect(orchestrator).toContain("manage_locator / manage_null_object");
    expect(orchestrator).toContain("Do not automatically re-read fresh mutation targets with `inspect_element`");
    expect(implementation).toContain("mcp/tests/bedrock-locator-coverage.test.ts");
    expect(implementation).toContain("TextureMesh direct authoring/inspection");
    expect(implementation).toContain("controller blend-curve mutation");
  });
});
