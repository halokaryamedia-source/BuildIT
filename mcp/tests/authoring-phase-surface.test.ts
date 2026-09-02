import { describe, expect, test } from "bun:test";
import {
  DEFAULT_MCP_AUTHORING_PHASE,
  MCP_AUTHORING_PHASES,
  MCP_HANDOFF_REQUIRED,
  buildMcpPhaseHandoffContract,
  buildMcpPhasePromptHeader,
  classifyMcpToolPhase,
  getMcpPhaseReadinessSummary,
  resolveMcpAuthoringPhase,
} from "@/lib/authoringPhase";
import { getEnabledToolDefinitions } from "@/lib/factories";
import { buildMcpServerInstructions } from "@/server/server";
import { selectMcpPhaseWorkflowBody } from "@/server/prompts";
import {
  applyMcpToolSurface,
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
  test("phase setting defaults only when absent and rejects explicit invalid values", () => {
    expect(DEFAULT_MCP_AUTHORING_PHASE).toBe("geometry");
    expect(resolveMcpAuthoringPhase(undefined)).toBe("geometry");
    expect(resolveMcpAuthoringPhase(null)).toBe("geometry");
    expect(resolveMcpAuthoringPhase("texturing")).toBe("texturing");
    expect(resolveMcpAuthoringPhase("animation")).toBe("animation");
    expect(() => resolveMcpAuthoringPhase("texturingg")).toThrow(
      "Invalid MCP Authoring Phase"
    );
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
      "manage_cubes",
      "add_group",
      "duplicate_element",
      "remove_element",
      "rename_element",
      "manage_locator",
      "manage_null_object",
      "manage_geometry_reference",
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

  test("applying a phase surface controls the exact production definitions used by request-owned MCP servers", () => {
    try {
      for (const phase of MCP_AUTHORING_PHASES) {
        applyMcpToolSurface("bedrock_entity", phase);
        const enabledProductionTools = Object.keys(getEnabledToolDefinitions())
          .filter((toolName) => getToolRegistrationFamily(toolName) !== undefined)
          .sort();
        expect(enabledProductionTools).toEqual([...phaseSurface(phase)].sort());
      }
    } finally {
      applyMcpToolSurface("bedrock_entity", DEFAULT_MCP_AUTHORING_PHASE);
    }
  });

  test("runtime phase contract header includes exact allowed-tools list", () => {
    for (const phase of MCP_AUTHORING_PHASES) {
      const expected = getMcpSurfaceToolNames("bedrock_entity", phase);
      const header = buildMcpPhasePromptHeader(phase, expected);
      expect(header).toContain(`Allowed tools (${expected.length}):`);
      for (const toolName of expected.slice(0, 3)) {
        expect(header).toContain(toolName);
      }
    }
  });

  test("legacy-risk tools stay maintenance-only and never enter active surface", () => {
    const legacyRiskTools = [
      "from_geo_json",
      "risky_eval",
      "filter_by_material",
      "capture_app_screenshot",
      "set_camera_angle",
      "apply_texture",
    ];

    try {
      for (const profile of ["bedrock_entity", "extended"] as const) {
        for (const phase of MCP_AUTHORING_PHASES) {
          applyMcpToolSurface(profile, phase);
          const exposed = getMcpSurfaceToolNames(profile, phase);
          for (const legacyTool of legacyRiskTools) {
            expect(exposed).not.toContain(legacyTool);
          }
        }
      }
    } finally {
      applyMcpToolSurface("bedrock_entity", DEFAULT_MCP_AUTHORING_PHASE);
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
      "manage_cubes",
      "add_group",
      "remove_element",
      "rename_element",
      "manage_locator",
      "manage_geometry_reference",
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

  test("initialize instructions make active phase, foreign-tool absence, and handoff stop explicit", () => {
    for (const phase of MCP_AUTHORING_PHASES) {
      const instructions = buildMcpServerInstructions(phase);
      expect(instructions).toContain(`ACTIVE PHASE: ${phase.toUpperCase()}`);
      expect(instructions).toContain("MCP CORE");
      expect(instructions).toContain(MCP_HANDOFF_REQUIRED);
      expect(instructions).toContain("Do not tool_search");
      expect(instructions).toContain("readiness");
      expect(instructions).toContain("then STOP");
      expect(instructions.length).toBeLessThan(700);
    }

    const texturing = buildMcpServerInstructions("texturing");
    expect(texturing).toContain("Texture Atlas");
    expect(texturing).not.toContain("Cube/Group/rig/Locator/Null mutation");

    const animation = buildMcpServerInstructions("animation");
    expect(animation).toContain("controllers");
  });

  test("runtime workflow renders only the active phase plus shared evidence guidance", async () => {
    const workflow = await source("prompts/bedrock_entity_workflow.md");
    const geometry = selectMcpPhaseWorkflowBody(workflow, "geometry");
    const texturing = selectMcpPhaseWorkflowBody(workflow, "texturing");
    const animation = selectMcpPhaseWorkflowBody(workflow, "animation");

    expect(geometry).toContain("## Geometry / Visual Gate");
    expect(geometry).toContain("## UV Layout");
    expect(geometry).not.toContain("## Texture Atlas");
    expect(geometry).not.toContain("create_texture");
    expect(geometry).not.toContain("create_animation");

    expect(texturing).toContain("## Texture Atlas");
    expect(texturing).toContain("## Texture Styling");
    expect(texturing).toContain("## Texture Verify");
    expect(texturing).not.toContain("## Geometry / Visual Gate");
    expect(texturing).not.toContain("manage_cubes");
    expect(texturing).not.toContain("create_animation");

    expect(animation).toContain("## Animation Workflow");
    expect(animation).toContain("create_animation");
    expect(animation).toContain("manage_keyframes");
    expect(animation).toContain("manage_animation_controller");
    expect(animation).not.toContain("manage_cubes");
    expect(animation).not.toContain("create_texture");
  });

  test("handoff contract preserves compact readiness and resume-critical state", () => {
    expect(getMcpPhaseReadinessSummary("geometry")).toContain("geometry=PASS");
    expect(getMcpPhaseReadinessSummary("geometry")).toContain("uv_layout=PASS");
    expect(getMcpPhaseReadinessSummary("texturing")).toContain(
      "texture_verify=PASS"
    );

    for (const phase of MCP_AUTHORING_PHASES) {
      const contract = buildMcpPhaseHandoffContract(phase);
      expect(contract).toContain("target_phase");
      expect(contract).toContain("reason");
      expect(contract).toContain("readiness");
      expect(contract).toContain("resume_from");
      expect(contract).toContain("exact UUID only when the next mutation needs it");
      expect(contract).toContain("Do not create a persistent UUID registry");
      expect(contract).toContain(`${MCP_HANDOFF_REQUIRED} means STOP`);
    }
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
      expect(owner).toMatch(/reload BlockIT MCP|phase switch\/reload action/);
    }

    expect(orchestrator).toContain("phase absence is not discovery failure");
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
      "final Box-UV lock        → manage_cubes(operation=batch_update)"
    );
    expect(texturing).toContain(
      "Never `tool_search` for `manage_cubes`, `bone_rigging`"
    );

    expect(animation).not.toContain(
      "bone/pivot/IK                         → bone_rigging"
    );
    expect(animation).toContain(
      "Do not `tool_search` for `bone_rigging` while Animation is active"
    );

    expect(runtimePrompts).toContain("selectMcpPhaseWorkflowBody");
    expect(runtimePrompts).toContain("buildMcpPhaseHandoffContract");
    expect(runtimePrompts).not.toContain("`${phaseHeader}\\n\\n${workflow}`");
  });

  test("root/workspace routing loads only the active specialist and preserves compact handoff state", async () => {
    const [root, workspace] = await Promise.all([
      source("../AGENTS.md"),
      source("../workspace/README.md"),
    ]);

    expect(root).toMatch(/ACTIVE PHASE[\s\S]*active specialist only/i);
    expect(root).toMatch(/Do (?:\*\*)?not(?:\*\*)? preload later-phase specialists/i);
    expect(root).toContain("HANDOFF_REQUIRED");
    expect(workspace).toContain("Current handoff state");
    expect(workspace).toContain("completed_gate(s)");
    expect(workspace).toContain("resume_target");
    expect(workspace).toContain("exact UUID only when the immediate next mutation requires it");
    expect(workspace).toContain("do not guess or broad-search tools");
  });

  test("plugin startup rejects invalid explicit phase before MCP exposure", async () => {
    const [indexSource, settingsSource] = await Promise.all([
      Bun.file("index.ts").text(),
      Bun.file("ui/settings.ts").text(),
    ]);

    expect(indexSource).toContain("resolveMcpAuthoringPhase");
    expect(indexSource).toContain("Invalid authoring phase setting");
    expect(indexSource).toContain(
      "applyMcpToolSurface(registrationProfile, authoringPhase)"
    );
    expect(indexSource).toContain("phase: authoringPhase");
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
