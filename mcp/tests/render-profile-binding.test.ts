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

const request = {
  slot: "glass",
  render_profile: "translucent" as const,
  render_controller: "controller.render.fixture",
  bone_pattern: "window*",
};

describe("Minecraft entity render profile binding", () => {
  test("binds client material slot and ordered bone override together", () => {
    const result = bindEntityRenderProfile(
      parseClientEntityDocument(client),
      parseRenderControllerDocument(controller),
      request
    );
    const summary = inspectEntityRenderProfileBindings(
      result.client_entity,
      result.render_controller,
      "controller.render.fixture"
    );

    expect(result.binding.minecraft_material_code).toBe("entity_alphablend");
    expect(result.binding.changed).toEqual({
      client_entity_slot: true,
      render_controller_assignment: true,
    });
    expect(summary.slots.find((item) => item.slot === "glass")?.contract?.render_profile).toBe("translucent");
    expect(summary.assignments.map((item) => [item.bone_pattern, item.expression])).toEqual([
      ["*", "Material.default"],
      ["window*", "Material.glass"],
    ]);
    expect(summary.diagnostics.filter((item) => item.severity === "error")).toEqual([]);
  });

  test("combined bind reuses an already-correct client slot and changes only the controller side", () => {
    const preboundClient = parseClientEntityDocument(`{
      "minecraft:client_entity":{"description":{"materials":{"default":"entity","glass":"entity_alphablend"}}}
    }`);
    const result = bindEntityRenderProfile(
      preboundClient,
      parseRenderControllerDocument(controller),
      request
    );
    expect(result.binding.changed).toEqual({
      client_entity_slot: false,
      render_controller_assignment: true,
    });
    expect(
      inspectEntityRenderProfileBindings(result.client_entity).slots.find(
        (item) => item.slot === "glass"
      )?.minecraft_material_code
    ).toBe("entity_alphablend");
  });

  test("combined bind reuses an already-correct controller assignment and changes only the client side", () => {
    const preboundController = applyRenderControllerMaterialAssignment(
      parseRenderControllerDocument(controller),
      "controller.render.fixture",
      "window*",
      "glass"
    );
    const result = bindEntityRenderProfile(
      parseClientEntityDocument(client),
      preboundController,
      request
    );
    expect(result.binding.changed).toEqual({
      client_entity_slot: true,
      render_controller_assignment: false,
    });
  });

  test("combined bind rejects only when both sides are already exact", () => {
    const first = bindEntityRenderProfile(
      parseClientEntityDocument(client),
      parseRenderControllerDocument(controller),
      request
    );
    expect(() =>
      bindEntityRenderProfile(first.client_entity, first.render_controller, request)
    ).toThrow("already unchanged");
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
