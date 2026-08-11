import { describe, expect, test } from "bun:test";
import {
  manageLocatorParameters,
  manageNullObjectParameters,
} from "@/server/tools/locators";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("Bedrock Locator / Null Object direct coverage", () => {
  test("Locator create defaults only native authored fields", () => {
    expect(
      manageLocatorParameters.parse({
        action: "create",
        name: "muzzle",
        parent: "bone-uuid",
      })
    ).toEqual({
      action: "create",
      name: "muzzle",
      parent: "bone-uuid",
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      ignore_inherited_scale: false,
    });

    expect(
      manageLocatorParameters.safeParse({
        action: "update",
        id: "locator-uuid",
      }).success
    ).toBe(false);
  });

  test("Null Object base mutation does not invent rotation or IK mutation", () => {
    expect(
      manageNullObjectParameters.parse({
        action: "create",
        name: "ik_helper",
        parent: "bone-uuid",
      })
    ).toEqual({
      action: "create",
      name: "ik_helper",
      parent: "bone-uuid",
      position: [0, 0, 0],
    });

    expect(
      manageNullObjectParameters.safeParse({
        action: "update",
        id: "null-uuid",
        rotation: [0, 45, 0],
      }).success
    ).toBe(false);

    expect(
      manageNullObjectParameters.safeParse({
        action: "update",
        id: "null-uuid",
        ik_target: "locator-uuid",
      }).success
    ).toBe(false);
  });

  test("Locator tools stay inside the existing elements family", async () => {
    const toolsRoot = await source("server/tools.ts");
    expect(toolsRoot).toContain('import { registerLocatorTools } from "./tools/locators"');
    expect(toolsRoot).toContain("registerElementTools();\n  registerLocatorTools();");
    expect(toolsRoot).toContain("elements: registerElementFamilyTools");
  });

  test("explicit parent targets are resolved before Undo and failures can roll back", async () => {
    const locatorSource = await source("server/tools/locators.ts");
    const firstCreateParent = locatorSource.indexOf("const parent = resolveParent(args.parent);");
    const firstCreateUndo = locatorSource.indexOf("Undo.initEdit({ elements: edited, outliner: true });");

    expect(firstCreateParent).toBeGreaterThan(-1);
    expect(firstCreateUndo).toBeGreaterThan(firstCreateParent);
    expect(locatorSource).toContain("Undo.cancelEdit(true)");
    expect(locatorSource).toContain('formatId !== "bedrock"');
  });

  test("generic remove_element snapshots direct or recursive deletion state before Undo", async () => {
    const elementSource = await source("server/tools/element.ts");
    const start = elementSource.indexOf("createTool(elementToolDocs[0].name");
    const end = elementSource.indexOf("createTool(elementToolDocs[1].name", start);
    expect(start).toBeGreaterThan(-1);
    expect(end).toBeGreaterThan(start);
    const removeBlock = elementSource.slice(start, end);

    expect(removeBlock).toContain("const deleteElements: OutlinerElement[] = [];");
    expect(removeBlock).toContain("const deleteGroups: Group[] = [];");
    expect(removeBlock).toContain("element.forEachChild");
    expect(removeBlock).toContain("const deletedNodeUuids = new Set");
    expect(removeBlock).toContain("animations: deleteAnimations");
    expect(removeBlock).toContain("selection: true");
    expect(removeBlock).toContain("element.remove(false)");
    expect(removeBlock).toContain("deleteGroups.length = 0");
    expect(removeBlock).toContain("deleteElements.length = 0");
    expect(removeBlock.indexOf("const deleteAnimations")).toBeLessThan(
      removeBlock.indexOf("Undo.initEdit({")
    );
  });

  test("inspect_element exposes authored Locator and Null Object state", async () => {
    const inspection = await source("server/tools/element-inspection.ts");
    expect(inspection).toContain("...Locator.all");
    expect(inspection).toContain("...NullObject.all");
    expect(inspection).toContain('type: "locator" as const');
    expect(inspection).toContain("ignore_inherited_scale: locator.ignore_inherited_scale");
    expect(inspection).toContain('type: "null_object" as const');
    expect(inspection).toContain("ik_source: element.ik_source || null");
  });

  test("Null Object geometry round-trip distinction is documented", async () => {
    const locatorSource = await source("server/tools/locators.ts");
    expect(locatorSource).toContain("`_null_` locator entry");
    expect(locatorSource).toContain("IK fields remain Blockbench editor/animation state");
  });

  test("canonical workflow moves Locator coverage out of the protected-gap list", async () => {
    const prompt = await source("prompts/bedrock_entity_workflow.md");
    const matrix = await source("../docs/knowledge/reviews/bedrock-entity-capability-surface-matrix.md");

    expect(prompt).toContain("## Locator / Null Object authored state");
    expect(prompt).toContain("`manage_locator`");
    expect(prompt).toContain("`manage_null_object`");
    expect(matrix).toContain("**Mapped / local proof required**");
    expect(matrix).toContain("**Mapped base state / IK mutation deferred**");
    expect(matrix).toContain("TextureMesh");
    expect(matrix).toContain("**MCP GAP — protected**");
  });
});
