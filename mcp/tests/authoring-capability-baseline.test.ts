import { describe, expect, test } from "bun:test";
import "@/server/tools";
import { getAllToolDefinitions } from "@/lib/factories";

const REQUIRED_AUTHORING_CAPABILITIES = {
  geometry: [
    "manage_cubes",
    "add_group",
    "modify_group",
    "reparent_element",
    "remove_element",
    "rename_element",
    "manage_locator",
    "manage_null_object",
    "bone_rigging",
    "inspect_elements",
  ],
  texture: [
    "create_texture",
    "list_textures",
    "get_texture",
    "activate_texture",
    "apply_texture",
    "paint_fill_tool",
    "draw_shape_tool",
    "paint_with_brush",
    "eraser_tool",
    "paint_texture_transaction",
    "manage_material",
    "manage_material_instances",
    "manage_render_profile",
  ],
  animation: [
    "create_animation",
    "inspect_animation",
    "manage_animation_timeline",
    "manage_animation_effects",
    "manage_animation_controller",
  ],
  particle: [
    "inspect_particle",
    "manage_particle",
  ],
} as const;

describe("authoring capability baseline", () => {
  const definitions = getAllToolDefinitions();

  for (const [family, capabilities] of Object.entries(REQUIRED_AUTHORING_CAPABILITIES)) {
    test(`${family} retains every required canonical capability`, () => {
      for (const capability of capabilities) {
        expect(definitions[capability], `${family}:${capability}`).toBeDefined();
      }
    });
  }

  test("baseline is additive: extra capabilities are allowed", () => {
    const required = Object.values(REQUIRED_AUTHORING_CAPABILITIES).flat();
    expect(Object.keys(definitions).length).toBeGreaterThanOrEqual(required.length);
  });
});
