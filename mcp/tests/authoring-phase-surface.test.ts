import { describe, expect, test } from "bun:test";
import {
  DEFAULT_MCP_AUTHORING_PHASE,
  MCP_AUTHORING_PHASES,
  MCP_HANDOFF_REQUIRED,
  classifyMcpToolPhase,
  resolveMcpAuthoringPhase,
} from "@/lib/authoringPhase";
import { buildMcpServerInstructions } from "@/server/server";
import {
  getMcpSurfaceToolNames,
  getToolRegistrationFamily,
  isCatalogToolEnabled,
  tools,
} from "@/server/tools";

const phaseSurface = (phase: (typeof MCP_AUTHORING_PHASES)[number]) =>
  new Set(getMcpSurfaceToolNames("bedrock_entity", phase));

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

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
      "list_outline",
      "find_elements_by_criteria",
      "select_all_of_type",
      "get_selection",
      "inspect_element",
      "capture_model_views",
      "export_model",
      "list_locator_elements",
      "list_textures",
    ]) {
      expect(geometry.has(coreTool), coreTool).toBe(true);
    }

    for (const geometryTool of [
      "place_cube",
      "modify_cube",
      "modify_cubes_batch",
      "add_group",
      "duplicate_element",
      "remove_element",
      "rename_element",
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

  test("Core stays read/recovery oriented while structural mutation stays Geometry", () => {
    const geometry = phaseSurface("geometry");
    const texturing = phaseSurface("texturing");
    const animation = phaseSurface("animation");

    for (const coreTool of [
      "undo",
      "list_outline",
      "find_elements_by_criteria",
      "select_all_of_type",
      "get_selection",
      "inspect_element",
      "capture_model_views",
      "export_model",
      "list_locator_elements",
      "list_textures",
    ]) {
      expect(geometry.has(coreTool), `geometry:${coreTool}`).toBe(true);
      expect(texturing.has(coreTool), `texturing:${coreTool}`).toBe(true);
      expect(animation.has(coreTool), `animation:${coreTool}`).toBe(true);
    }

    for (const structuralTool of [
      "place_cube",
      "modify_cubes_batch",
      "add_group",
      "remove_element",
      "rename_element",
      "manage_locator",
      "bone_rigging",
    ]) {
      expect(geometry.has(structuralTool), structuralTool).toBe(true);
      expect(texturing.has(structuralTool), structuralTool).toBe(false);
      expect(animation.has(structuralTool), structuralTool).toBe(false);
    }

    for (const tool of [
      "create_texture",
      "paint_with_brush",
      "create_pbr_material",
      "set_face_material_instance",
    ]) {
      expect(texturing.has(tool), tool).toBe(true);
      expect(geometry.has(tool), tool).toBe(false);
      expect(animation.has(tool), tool).toBe(false);
    }

    for (const tool of [
      "create_animation",
      "manage_keyframes",
      "manage_animation_effects",
      "manage_animation_controller",
      "inspect_animation",
    ]) {
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

  test("initialize instructions make the active phase and handoff stop explicit", () => {
    for (const phase of MCP_AUTHORING_PHASES) {
      const instructions = buildMcpServerInstructions(phase);
      expect(instructions).toContain(`ACTIVE PHASE: ${phase.toUpperCase()}`);
      expect(instructions).toContain("MCP CORE");
      expect(instructions).toContain(MCP_HANDOFF_REQUIRED);
      expect(instructions).toContain("Do not tool_search");
      expect(instructions).toContain("then STOP");
      expect(instructions.length).toBeLessThan(700);
    }

    const texturing = buildMcpServerInstructions("texturing");
    expect(texturing).toContain("Texture Atlas");
    expect(texturing).not.toContain("Cube/Group/rig/Locator/Null mutation");

    const animation = buildMcpServerInstructions("animation");
    expect(animation).toContain("controllers");
  });

  test("specialist routes never direct-call a foreign-phase mutation", async () => {
    const [orchestrator, texturing, animation, runtimePrompts] =
      await Promise.all([
        source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md"),
        source("../.agents/skills/blockit-bedrock-texturing/SKILL.md"),
        source("../.agents/skills/blockit-bedrock-animation/SKILL.md"),
        source("server/prompts.ts"),
      ]);

    for (const owner of [orchestrator, texturing, animation]) {
      expect(owner).toContain(MCP_HANDOFF_REQUIRED);
      expect(owner).toContain("target_phase");
      expect(owner).toContain("reload BlockIT MCP");
    }

    expect(orchestrator).toContain(
      "Tool absence caused by phase scoping is **not** a discovery failure"
    );
    expect(orchestrator).toContain(
      "A known foreign-phase tool must never enter this search path"
    );
    expect(orchestrator).toContain(
      "geometry/rig/UV judgement → `blockbench-bedrock-modelling`"
    );

    expect(texturing).toContain(
      "unlocked/invalid UV        → HANDOFF_REQUIRED(geometry)"
    );
    expect(texturing).not.toContain(
      "final Box-UV lock        → modify_cubes_batch"
    );
    expect(texturing).toContain(
      "Never `tool_search` for `modify_cube`, `modify_cubes_batch`, `bone_rigging`"
    );

    expect(animation).not.toContain(
      "bone/pivot/IK                         → bone_rigging"
    );
    expect(animation).toContain(
      "Do not `tool_search` for `bone_rigging` while Animation is active"
    );

    expect(runtimePrompts).toContain("buildMcpPhasePromptHeader");
    expect(runtimePrompts).toContain("getActiveMcpAuthoringPhase");
  });

  test("plugin startup wires the phase setting before MCP server exposure", async () => {
    const [indexSource, settingsSource] = await Promise.all([
      Bun.file("index.ts").text(),
      Bun.file("ui/settings.ts").text(),
    ]);

    expect(indexSource).toContain("resolveMcpAuthoringPhase");
    expect(indexSource).toContain(
      "applyMcpToolSurface(registrationProfile, authoringPhase)"
    );
    expect(settingsSource).toContain("MCP_AUTHORING_PHASE_SETTING_ID");
    expect(settingsSource).toContain('type: "select"');
    expect(settingsSource).toContain(
      'geometry: "Geometry + Rig + UV Layout"'
    );
    expect(settingsSource).toContain('texturing: "Texturing"');
    expect(settingsSource).toContain('animation: "Animation"');
    expect(settingsSource).toContain("requires_restart: true");
  });
});
