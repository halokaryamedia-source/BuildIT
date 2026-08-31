import { describe, expect, test } from "bun:test";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("texturing hot-path routing", () => {
  test("advanced editor-state tools stay conditional instead of entering normal routing", async () => {
    const skill = await source("../.agents/skills/blockit-bedrock-texturing/SKILL.md");
    const supportStart = skill.indexOf("## Conditional Support — Not Default Routing");
    const supportEnd = skill.indexOf("## First-Call Invariants", supportStart);
    const support = skill.slice(supportStart, supportEnd);

    expect(supportStart).toBeGreaterThan(-1);
    expect(support).toMatch(/must not enter the normal hot path/i);
    expect(support).toMatch(/current user intent specifically requires/i);

    for (const tool of [
      "color_picker_tool",
      "copy_brush_tool",
      "eraser_tool",
      "paint_settings",
      "create_brush_preset",
      "load_brush_preset",
      "texture_selection",
      "texture_layer_management",
      "add_texture_group",
      "import_texture_set",
      "assign_texture_channel",
      "save_material_config",
    ]) {
      expect(support).toContain(tool);
    }

    for (const direct of [
      "create_pbr_material",
      "configure_material",
      "draw_shape_tool",
      "paint_fill_tool",
      "gradient_tool",
      "paint_with_brush",
    ]) {
      expect(support).toContain(direct);
    }
    expect(support).toMatch(/Support tools do not justify extra discovery\/readback/i);
  });
});
