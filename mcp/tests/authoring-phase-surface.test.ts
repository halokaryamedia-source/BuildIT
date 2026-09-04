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
    expect(() => resolveMcpAuthoringPhase("texturingg")).toThrow("Invalid MCP Authoring Phase");
  });

  test("native phase surfaces stay bounded and preserve Geometry ownership", () => {
    expect(phaseSurface("geometry").size).toBe(25);
    expect(phaseSurface("texturing").size).toBe(35);
    expect(phaseSurface("animation").size).toBe(19);

    const geometry = phaseSurface("geometry");
    for (const tool of ["manage_cubes", "add_group", "manage_geometry_reference", "bone_rigging", "switch_authoring_phase"]) {
      expect(geometry.has(tool), tool).toBe(true);
    }
    for (const foreign of ["create_texture", "create_animation"]) {
      expect(geometry.has(foreign), foreign).toBe(false);
    }
  });

  test("applying a phase surface controls the exact production definitions", () => {
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

  test("runtime phase contract includes exact allowed tools and Gateway-aware handoff", () => {
    for (const phase of MCP_AUTHORING_PHASES) {
      const expected = getMcpSurfaceToolNames("bedrock_entity", phase);
      const header = buildMcpPhasePromptHeader(phase, expected);
      expect(header).toContain(`Allowed tools (${expected.length}):`);
      expect(header).toContain("Gateway");
      expect(header).toContain("same task/chat continues");
      expect(header).not.toContain("Reconnect the client to refresh tools/list");
    }
  });

  test("legacy-risk tools stay outside active authoring surfaces", () => {
    const legacyRiskTools = ["from_geo_json", "risky_eval", "filter_by_material", "capture_app_screenshot", "set_camera_angle", "apply_texture"];
    try {
      for (const profile of ["bedrock_entity", "extended"] as const) {
        for (const phase of MCP_AUTHORING_PHASES) {
          applyMcpToolSurface(profile, phase);
          const exposed = getMcpSurfaceToolNames(profile, phase);
          for (const tool of legacyRiskTools) expect(exposed).not.toContain(tool);
        }
      }
    } finally {
      applyMcpToolSurface("bedrock_entity", DEFAULT_MCP_AUTHORING_PHASE);
    }
  });

  test("every retained callable tool has exactly one phase ownership category", () => {
    for (const toolName of Object.keys(tools)) {
      if (!isCatalogToolEnabled(toolName)) continue;
      const family = getToolRegistrationFamily(toolName);
      expect(family, `${toolName} family`).toBeDefined();
      expect(classifyMcpToolPhase(toolName, family!), `${toolName} category`).not.toBeNull();
    }
  });

  test("initialize instructions keep foreign tools unavailable until Gateway handoff", () => {
    for (const phase of MCP_AUTHORING_PHASES) {
      const instructions = buildMcpServerInstructions(phase);
      expect(instructions).toContain(`ACTIVE PHASE: ${phase.toUpperCase()}`);
      expect(instructions).toContain("MCP CORE");
      expect(instructions).toContain(MCP_HANDOFF_REQUIRED);
      expect(instructions).toContain("switch_authoring_phase");
      expect(instructions).toContain("Gateway");
      expect(instructions).not.toContain("Reconnect the client to refresh tools/list");
      expect(instructions.length).toBeLessThan(700);
    }
  });

  test("runtime workflow renders only the active specialist body", async () => {
    const workflow = await source("prompts/bedrock_entity_workflow.md");
    const geometry = selectMcpPhaseWorkflowBody(workflow, "geometry");
    const texturing = selectMcpPhaseWorkflowBody(workflow, "texturing");
    const animation = selectMcpPhaseWorkflowBody(workflow, "animation");

    expect(geometry).toContain("## Geometry / Visual Gate");
    expect(geometry).not.toContain("create_texture");
    expect(geometry).not.toContain("create_animation");
    expect(texturing).toContain("## Texture Atlas");
    expect(texturing).not.toContain("manage_cubes");
    expect(texturing).not.toContain("create_animation");
    expect(animation).toContain("## Animation Workflow");
    expect(animation).toContain("create_animation");
    expect(animation).not.toContain("manage_cubes");
    expect(animation).not.toContain("create_texture");
  });

  test("handoff preserves compact resume state without terminating the whole task", () => {
    expect(getMcpPhaseReadinessSummary("geometry")).toContain("geometry=PASS");
    expect(getMcpPhaseReadinessSummary("texturing")).toContain("texture_verify=PASS");

    for (const phase of MCP_AUTHORING_PHASES) {
      const contract = buildMcpPhaseHandoffContract(phase);
      for (const key of ["target_phase", "reason", "readiness", "resume_from"]) expect(contract).toContain(key);
      expect(contract).toContain("STOP using current-phase mutation routes");
      expect(contract).toContain("continue the same task");
      expect(contract).toContain("Gateway");
      expect(contract).not.toContain("Reconnect the client to refresh tools/list");
    }
  });

  test("specialist routing is Gateway-aware and uses current consolidated tools", async () => {
    const [orchestrator, texturing, animation] = await Promise.all([
      source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md"),
      source("../.agents/skills/blockit-bedrock-texturing/SKILL.md"),
      source("../.agents/skills/blockit-bedrock-animation/SKILL.md"),
    ]);

    for (const owner of [orchestrator, texturing, animation]) {
      expect(owner).toContain(MCP_HANDOFF_REQUIRED);
      expect(owner).toContain("switch_authoring_phase");
      expect(owner).toContain("Gateway");
      expect(owner).toContain("same task");
      expect(owner).not.toContain("action: set MCP Authoring Phase=");
      expect(owner).not.toContain("reload BlockIT MCP");
    }

    expect(orchestrator).toContain("3D_ASSISTED");
    expect(orchestrator).toContain("manage_geometry_reference");
    expect(orchestrator).not.toContain("optional 3D Evidence");
    expect(orchestrator).not.toContain("3D-Assisted Route");
    expect(texturing).toContain("manage_material");
    expect(texturing).not.toContain("create_pbr_material / configure_material / assign_texture_channel");
    expect(animation).toContain("manage_animation_timeline");
  });

  test("plugin setting is startup default while Gateway owns live handoff", async () => {
    const [indexSource, settingsSource] = await Promise.all([
      Bun.file("index.ts").text(),
      Bun.file("ui/settings.ts").text(),
    ]);
    expect(indexSource).toContain("resolveMcpAuthoringPhase");
    expect(indexSource).toContain("applyMcpToolSurface(registrationProfile, authoringPhase)");
    expect(settingsSource).toContain('name: "Default MCP Authoring Phase"');
    expect(settingsSource).toContain("switch_authoring_phase");
    expect(settingsSource).toContain("requires_restart: true");
  });
});
