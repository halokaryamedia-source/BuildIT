import { describe, expect, test } from "bun:test";

describe("Geometry mutation preflight ordering", () => {
  test("add_group resolves all names and parent targets before opening Undo", async () => {
    const source = await Bun.file("server/tools/element.ts").text();
    const start = source.indexOf("createTool(elementToolDocs[1].name");
    const end = source.indexOf("createTool(elementToolDocs[2].name", start);
    const block = source.slice(start, end);

    const names = block.indexOf("assertBatchGroupNamesAvailable(batch)");
    const parents = block.indexOf("const parentPlan = planGroupBatchParents(batch)");
    const undo = block.indexOf("Undo.initEdit");
    expect(names).toBeGreaterThan(-1);
    expect(parents).toBeGreaterThan(names);
    expect(undo).toBeGreaterThan(parents);
    expect(block).toContain("created[plannedParent]");
  });

  test("duplicate_element completes deterministic preflight before Undo", async () => {
    const source = await Bun.file("server/tools/element.ts").text();
    const start = source.indexOf("createTool(elementToolDocs[3].name");
    const end = source.indexOf("createTool(elementToolDocs[4].name", start);
    const block = source.slice(start, end);

    const preflight = block.indexOf(
      "preflightFaithfulDuplicate(element, offset, newName)"
    );
    const undo = block.indexOf("Undo.initEdit");
    const mutation = block.indexOf("duplicateFaithfully(element, offset, newName)");
    expect(preflight).toBeGreaterThan(-1);
    expect(undo).toBeGreaterThan(preflight);
    expect(mutation).toBeGreaterThan(undo);
  });

  test("Group pivot transfer fails closed before Undo when mesh is unavailable", async () => {
    const source = await Bun.file("server/tools/element.ts").text();
    const start = source.indexOf('createTool("modify_group"');
    const end = source.indexOf('createTool("reparent_element"', start);
    const block = source.slice(start, end);

    const meshGuard = block.indexOf("!group.mesh");
    const undo = block.indexOf("Undo.initEdit");
    expect(meshGuard).toBeGreaterThan(-1);
    expect(undo).toBeGreaterThan(meshGuard);
    expect(block).toContain("pivot readback did not match the requested origin");
  });

  test("duplicate runtime helper no longer hides preflight after Undo", async () => {
    const source = await Bun.file("server/tools/element.ts").text();
    const helperStart = source.indexOf("function duplicateFaithfully(");
    const helperEnd = source.indexOf("function vector3Equals", helperStart);
    const helper = source.slice(helperStart, helperEnd);
    expect(helper).not.toContain("preflightDuplicateTranslation");
    expect(helper).not.toContain("preflightDuplicateGroupNames");
  });
});
