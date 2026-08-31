import { describe, expect, test } from "bun:test";
import {
  hasCaseInsensitiveGroupNameCollision,
  requireFiniteTranslatedElementVector3,
} from "@/server/tools/element";

describe("Geometry identity and duplication hardening", () => {
  test("Group/bone collision guard is case-insensitive and supports exclusion", () => {
    const groups = [
      { uuid: "a", name: "Arm_Left" },
      { uuid: "b", name: "body" },
    ];
    expect(hasCaseInsensitiveGroupNameCollision(groups, "arm_left")).toBe(true);
    expect(hasCaseInsensitiveGroupNameCollision(groups, "ARM_LEFT", "a")).toBe(false);
    expect(hasCaseInsensitiveGroupNameCollision(groups, "head")).toBe(false);
  });

  test("duplicate translation guard rejects non-finite authored results", () => {
    expect(
      requireFiniteTranslatedElementVector3([1, 2, 3], [4, 5, 6], "fixture")
    ).toEqual([5, 7, 9]);
    expect(() =>
      requireFiniteTranslatedElementVector3(
        [Number.MAX_VALUE, 0, 0],
        [Number.MAX_VALUE, 0, 0],
        "fixture"
      )
    ).toThrow("non-finite authored coordinate");
  });

  test("duplicate_element delegates property fidelity to native duplication and supports anchors", async () => {
    const source = await Bun.file("server/tools/element.ts").text();
    const start = source.indexOf("createTool(elementToolDocs[3].name");
    const end = source.indexOf("createTool(elementToolDocs[4].name", start);
    const block = source.slice(start, end);

    expect(source).toContain("const duplicated = element.duplicate();");
    expect(source).toContain("child instanceof Locator");
    expect(source).toContain("child instanceof NullObject");
    expect(source).toContain("translateDuplicatedSubtree");
    expect(source).toContain("applyDuplicateNames");
    expect(block).toContain("duplicateFaithfully(element, offset, newName)");
    expect(block).not.toContain("function cloneCube");
    expect(block).not.toContain("function cloneGroup");
  });

  test("Group creation and rename preflight export-safe names before Undo", async () => {
    const source = await Bun.file("server/tools/element.ts").text();

    const addStart = source.indexOf("createTool(elementToolDocs[1].name");
    const addEnd = source.indexOf("createTool(elementToolDocs[2].name", addStart);
    const addBlock = source.slice(addStart, addEnd);
    expect(addBlock.indexOf("assertBatchGroupNamesAvailable(batch)")).toBeGreaterThan(-1);
    expect(addBlock.indexOf("assertBatchGroupNamesAvailable(batch)")).toBeLessThan(
      addBlock.indexOf("Undo.initEdit")
    );

    const renameStart = source.indexOf("createTool(elementToolDocs[4].name");
    const renameEnd = source.indexOf("createTool(elementToolDocs[5].name", renameStart);
    const renameBlock = source.slice(renameStart, renameEnd);
    expect(renameBlock).toContain("assertGroupNameAvailable(new_name, element.uuid)");
    expect(renameBlock).toContain("assertAnchorRenameAvailable(element, new_name)");
    expect(renameBlock.indexOf("assertGroupNameAvailable")).toBeLessThan(
      renameBlock.indexOf("Undo.initEdit")
    );
  });

  test("public duplicate schema remains unchanged while runtime fidelity is hardened", async () => {
    const source = await Bun.file("server/tools/element.ts").text();
    const schemaStart = source.indexOf("export const duplicateElementParameters");
    const schemaEnd = source.indexOf("export const renameElementParameters", schemaStart);
    const schema = source.slice(schemaStart, schemaEnd);
    expect(schema).toContain("id: elementIdSchema");
    expect(schema).toContain("offset: finiteElementVector3Schema.optional().default([0, 0, 0])");
    expect(schema).toContain("newName:");
    expect(schema).not.toContain("mirror:");
  });
});
