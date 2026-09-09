import { describe, expect, test } from "bun:test";
import {
  applyRenderControllerMaterialAssignment,
  bindEntityRenderProfile,
  inspectEntityRenderProfileBindings,
  parseRenderControllerDocument,
  removeRenderControllerMaterialAssignment,
} from "@/lib/bedrockEntityRenderProfileBinding";
import { parseClientEntityDocument } from "@/lib/bedrockParticleBinding";

const client = `{
  "format_version": "1.10.0",
  "minecraft:client_entity": {
    "description": {
      "identifier": "test:fixture",
      "materials": { "default": "entity" },
      "textures": { "default": "textures/entity/fixture" },
      "geometry": { "default": "geometry.fixture" },
      "render_controllers": ["controller.render.fixture"]
    }
  }
}`;

const controller = `{
  "format_version": "1.8.0",
  "render_controllers": {
    "controller.render.fixture": {
      "geometry": "Geometry.default",
      "materials": [{ "*": "Material.default" }],
      "textures": ["Texture.default"]
    }
  }
}`;

describe("Minecraft entity render profile binding", () => {
  test("binds client material slot and ordered bone override together", () => {
    const result = bindEntityRenderProfile(
      parseClientEntityDocument(client),
      parseRenderControllerDocument(controller),
      {
        slot: "glass",
        render_profile: "translucent",
        render_controller: "controller.render.fixture",
        bone_pattern: "window*",
      }
    );
    const summary = inspectEntityRenderProfileBindings(
      result.client_entity,
      result.render_controller,
      "controller.render.fixture"
    );

    expect(result.binding.minecraft_material_code).toBe("entity_alphablend");
    expect(summary.slots.find((item) => item.slot === "glass")?.contract?.render_profile).toBe("translucent");
    expect(summary.assignments.map((item) => [item.bone_pattern, item.expression])).toEqual([
      ["*", "Material.default"],
      ["window*", "Material.glass"],
    ]);
    expect(summary.diagnostics.filter((item) => item.severity === "error")).toEqual([]);
  });

  test("exact selector update stays in place instead of reordering other material rules", () => {
    const source = parseRenderControllerDocument(`{
      "render_controllers": {
        "controller.render.fixture": {
          "materials": [
            {"*":"Material.default"},
            {"window*":"Material.old"},
            {"lamp*":"Material.lamp"}
          ]
        }
      }
    }`);
    const next = applyRenderControllerMaterialAssignment(
      source,
      "controller.render.fixture",
      "window*",
      "glass"
    );
    const summary = inspectEntityRenderProfileBindings(
      parseClientEntityDocument(`{
        "minecraft:client_entity":{"description":{"materials":{"default":"entity","glass":"entity_alphablend","lamp":"entity_emissive"}}}
      }`),
      next,
      "controller.render.fixture"
    );
    expect(summary.assignments.map((item) => item.bone_pattern)).toEqual([
      "*",
      "window*",
      "lamp*",
    ]);
    expect(summary.assignments[1].expression).toBe("Material.glass");
  });

  test("unassignment removes only the exact selector and exposes broader ordered fallback", () => {
    const source = applyRenderControllerMaterialAssignment(
      parseRenderControllerDocument(controller),
      "controller.render.fixture",
      "window*",
      "glass"
    );
    const next = removeRenderControllerMaterialAssignment(
      source,
      "controller.render.fixture",
      "window*"
    );
    const summary = inspectEntityRenderProfileBindings(
      parseClientEntityDocument(client),
      next,
      "controller.render.fixture"
    );
    expect(summary.assignments).toHaveLength(1);
    expect(summary.assignments[0].bone_pattern).toBe("*");
  });

  test("missing client material aliases are reported as blocking binding diagnostics", () => {
    const render = applyRenderControllerMaterialAssignment(
      parseRenderControllerDocument(controller),
      "controller.render.fixture",
      "window*",
      "glass"
    );
    const summary = inspectEntityRenderProfileBindings(
      parseClientEntityDocument(client),
      render,
      "controller.render.fixture"
    );
    expect(summary.diagnostics.map((item) => item.code)).toContain(
      "UNBOUND_RENDER_MATERIAL_SLOT"
    );
  });
});
