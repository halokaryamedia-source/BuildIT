import { describe, expect, test } from "bun:test";
import {
  DEFAULT_MCP_AUTHORING_PHASE,
  MCP_AUTHORING_PHASES,
  classifyMcpToolPhase,
  resolveMcpAuthoringPhase,
} from "@/lib/authoringPhase";
import {
  getMcpSurfaceToolNames,
  getToolRegistrationFamily,
  isCatalogToolEnabled,
  tools,
} from "@/server/tools";

const phaseSurface = (phase: (typeof MCP_AUTHORING_PHASES)[number]) =>
  new Set(getMcpSurfaceToolNames("bedrock_entity", phase));

describe("authoring phase MCP surface", () => {
  test("phase setting fails closed to Geometry", () => {
    expect(DEFAULT_MCP_AUTHORING_PHASE).toBe("geometry");
    expect(resolveMcpAuthoringPhase(undefined)).toBe("geometry");
    expect(resolveMcpAuthoringPhase("texturing")).toBe("texturing");
    expect(resolveMcpAuthoringPhase("animation")).toBe("animation");
    expect(resolveMcpAuthoringPhase("texturingg")).toBe("geometry");
  });

  test("default Geometry surface is Core plus Geometry only", () => {
    const geometry = phaseSurface("geometry");
    expect(geometry.size).toBe(27);

    for (const coreTool of [
      "create_project",
      "undo",
      "redo",
      "remove_element",
      "list_outline",
      "find_elements_by_criteria",
      "select_all_of_type",
      "get_selection",
      "inspect_element",
      "capture_model_views",
      "export_model",
      "list_locator_elements",
    ]) {
      expect(geometry.has(coreTool), coreTool).toBe(true);
    }

    for (const geometryTool of [
      "place_cube",
      "modify_cube",
      "modify_cubes_batch",
      "add_group",
      "duplicate_element",
      "manage_locator",
      "manage_null_object",
      "bone_rigging",
    ]) {
      expect(geometry.has(geometryTool), geometryTool).toBe(true);
    }

    for (const foreignTool of [
      "create_texture",
      "paint_with_brush",
      "create_pbr_material",
      "set_face_material_instance",
      "create_animation",
      "manage_keyframes",
      "manage_animation_controller",
      "inspect_animation",
    ]) {
      expect(geometry.has(foreignTool), foreignTool).toBe(false);
    }
  });

  test("Core stays shared while phase-owned tools do not overlap", () => {
    const geometry = phaseSurface("geometry");
    const texturing = phaseSurface("texturing");
    const animation = phaseSurface("animation");

    for (const coreTool of [
      "undo",
      "remove_element",
      "rename_element",
      "select_all_of_type",
      "inspect_element",
      "capture_model_views",
      "export_model",
    ]) {
      expect(geometry.has(coreTool), `geometry:${coreTool}`).toBe(true);
      expect(texturing.has(coreTool), `texturing:${coreTool}`).toBe(true);
      expect(animation.has(coreTool), `animation:${coreTool}`).toBe(true);
    }

    for (const tool of ["place_cube", "modify_cubes_batch", "add_group", "manage_locator", "bone_rigging"]) {
      expect(geometry.has(tool), tool).toBe(true);
      expect(texturing.has(tool), tool).toBe(false);
      expect(animation.has(tool), tool).toBe(false);
    }

    for (const tool of ["create_texture", "list_textures", "paint_with_brush", "create_pbr_material", "set_face_material_instance"]) {
      expect(texturing.has(tool), tool).toBe(true);
      expect(geometry.has(tool), tool).toBe(false);
      expect(animation.has(tool), tool).toBe(false);
    }

    for (const tool of ["create_animation", "manage_keyframes", "manage_animation_effects", "manage_animation_controller", "inspect_animation"]) {
      expect(animation.has(tool), tool).toBe(true);
      expect(geometry.has(tool), tool).toBe(false);
      expect(texturing.has(tool), tool).toBe(false);
    }
  });

  test("every retained Bedrock callable tool has exactly one ownership category", () => {
    for (const toolName of Object.keys(tools)) {
      if (!isCatalogToolEnabled(toolName)) continue;
      const family = getToolRegistrationFamily(toolName);
      expect(family, `${toolName} family`).toBeDefined();
      const category = classifyMcpToolPhase(toolName, family!);
      expect(category, `${toolName} category`).not.toBeNull();
    }
  });

  test("plugin startup wires the phase setting before MCP server exposure", async () => {
    const [indexSource, settingsSource] = await Promise.all([
      Bun.file("index.ts").text(),
      Bun.file("ui/settings.ts").text(),
    ]);

    expect(indexSource).toContain("resolveMcpAuthoringPhase");
    expect(indexSource).toContain("applyMcpToolSurface(registrationProfile, authoringPhase)");
    expect(settingsSource).toContain("MCP_AUTHORING_PHASE_SETTING_ID");
    expect(settingsSource).toContain('type: "select"');
    expect(settingsSource).toContain('geometry: "Geometry + Rig + UV Layout"');
    expect(settingsSource).toContain('texturing: "Texturing"');
    expect(settingsSource).toContain('animation: "Animation"');
    expect(settingsSource).toContain("requires_restart: true");
  });
});
