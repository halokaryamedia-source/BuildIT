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

describe("authoring stage MCP surface", () => {
  test("stage setting remains backward compatible and defaults to Geometry focus", () => {
    expect(DEFAULT_MCP_AUTHORING_PHASE).toBe("geometry");
    expect(resolveMcpAuthoringPhase(undefined)).toBe("geometry");
    expect(resolveMcpAuthoringPhase(null)).toBe("geometry");
    expect(resolveMcpAuthoringPhase("texturing")).toBe("texturing");
    expect(resolveMcpAuthoringPhase("animation")).toBe("animation");
    expect(() => resolveMcpAuthoringPhase("texturingg")).toThrow("Invalid MCP Authoring Phase");
  });

  test("Geometry and Texturing startup stages expose one shared AUTHORING surface", () => {
    const geometry = phaseSurface("geometry");
    const texturing = phaseSurface("texturing");
    expect([...geometry].sort()).toEqual([...texturing].sort());
    expect(geometry.size).toBeGreaterThan(35);

    for (const tool of [
      "manage_cubes",
      "add_group",
      "manage_geometry_reference",
      "bone_rigging",
      "create_texture",
      "paint_with_brush",
      "manage_material",
      "manage_material_instances",
      "switch_authoring_phase",
    ]) {
      expect(geometry.has(tool), tool).toBe(true);
    }
    expect(geometry.has("create_animation")).toBe(false);

    const animation = phaseSurface("animation");
    expect(animation.size).toBe(19);
    expect(animation.has("create_animation")).toBe(true);
    expect(animation.has("manage_cubes")).toBe(false);
    expect(animation.has("create_texture")).toBe(false);
  });

  test("applying a stage surface controls the exact production definitions", () => {
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

  test("runtime contract describes shared AUTHORING and bounded Animation handoff", () => {
    for (const phase of MCP_AUTHORING_PHASES) {
      const expected = getMcpSurfaceToolNames("bedrock_entity", phase);
      const header = buildMcpPhasePromptHeader(phase, expected);
      expect(header).toContain(`Allowed tools (${expected.length}):`);
      expect(header).toContain("Gateway");
      expect(header).not.toContain("Reconnect the client to refresh tools/list");
      if (phase === "animation") expect(header).toContain("ANIMATION tools available");
      else expect(header).toContain("AUTHORING tools available");
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

  test("every retained callable tool has exactly one semantic ownership category", () => {
    for (const toolName of Object.keys(tools)) {
      if (!isCatalogToolEnabled(toolName)) continue;
      const family = getToolRegistrationFamily(toolName);
      expect(family, `${toolName} family`).toBeDefined();
      expect(classifyMcpToolPhase(toolName, family!), `${toolName} category`).not.toBeNull();
    }
  });

  test("initialize instructions keep only Animation as a foreign runtime surface", () => {
    for (const phase of MCP_AUTHORING_PHASES) {
      const instructions = buildMcpServerInstructions(phase);
      expect(instructions).toContain(`ACTIVE STAGE: ${phase.toUpperCase()}`);
      expect(instructions).toContain("MCP CORE");
      expect(instructions).toContain(MCP_HANDOFF_REQUIRED);
      expect(instructions).toContain("switch_authoring_phase");
      expect(instructions).toContain("Gateway");
      expect(instructions).toContain("Do not search for, emulate, rename, or substitute foreign tools");
      expect(instructions).not.toContain("Reconnect the client to refresh tools/list");
      expect(instructions.length).toBeLessThan(700);
    }
  });

  test("runtime workflow renders full Authoring guidance for Geometry and Texturing focus", async () => {
    const workflow = await source("prompts/bedrock_entity_workflow.md");
    const geometry = selectMcpPhaseWorkflowBody(workflow, "geometry");
    const texturing = selectMcpPhaseWorkflowBody(workflow, "texturing");
    const animation = selectMcpPhaseWorkflowBody(workflow, "animation");

    for (const authoring of [geometry, texturing]) {
      expect(authoring).toContain("## Geometry / Visual Gate");
      expect(authoring).toContain("## Texture Atlas");
      expect(authoring).toContain("manage_cubes");
      expect(authoring).toContain("create_texture");
      expect(authoring).not.toContain("create_animation");
    }
    expect(animation).toContain("## Animation Workflow");
    expect(animation).toContain("create_animation");
    expect(animation).not.toContain("manage_cubes");
    expect(animation).not.toContain("create_texture");
  });

  test("handoff is reserved for AUTHORING and Animation boundary", () => {
    expect(getMcpPhaseReadinessSummary("geometry")).toContain("geometry=PASS");
    expect(getMcpPhaseReadinessSummary("geometry")).toContain("uv_layout=PASS");
    expect(getMcpPhaseReadinessSummary("texturing")).toContain("texture_verify=PASS");

    for (const phase of ["geometry", "texturing"] as const) {
      const contract = buildMcpPhaseHandoffContract(phase);
      expect(contract).toContain("does not require HANDOFF_REQUIRED");
      expect(contract).toContain("AUTHORING↔ANIMATION");
      expect(contract).toContain("switch_authoring_phase");
      expect(contract).toContain("same task/chat");
    }

    const animation = buildMcpPhaseHandoffContract("animation");
    for (const key of ["target_phase", "reason", "readiness", "resume_from"]) expect(animation).toContain(key);
    expect(animation).toContain("STOP Animation mutation routes");
    expect(animation).toContain("shared AUTHORING surface");
  });

  test("specialist routing uses shared Authoring corrections and current consolidated tools", async () => {
    const [orchestrator, texturing, animation] = await Promise.all([
      source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md"),
      source("../.agents/skills/blockit-bedrock-texturing/SKILL.md"),
      source("../.agents/skills/blockit-bedrock-animation/SKILL.md"),
    ]);

    for (const owner of [orchestrator, texturing, animation]) {
      expect(owner).toContain(MCP_HANDOFF_REQUIRED);
      expect(owner).toContain("switch_authoring_phase");
      expect(owner).toContain("Gateway");
      expect(owner).toMatch(/same task|same task\/chat/i);
      expect(owner).not.toContain("action: set MCP Authoring Phase=");
      expect(owner).not.toContain("reload BlockIT MCP");
    }

    expect(orchestrator).toContain("Geometry and Texturing share one AUTHORING Runtime surface");
    expect(texturing).toContain("No Geometry↔Texturing phase switch");
    expect(texturing).toContain("manage_material");
    expect(animation).toContain("manage_animation_timeline");
  });

  test("plugin setting is a startup focus while Gateway owns Animation boundary", async () => {
    const [indexSource, settingsSource] = await Promise.all([
      Bun.file("index.ts").text(),
      Bun.file("ui/settings.ts").text(),
    ]);
    expect(indexSource).toContain("resolveMcpAuthoringPhase");
    expect(indexSource).toContain("applyMcpToolSurface(registrationProfile, authoringPhase)");
    expect(settingsSource).toContain('name: "Default Authoring Stage"');
    expect(settingsSource).toContain("shared AUTHORING tool surface");
    expect(settingsSource).toContain("switch_authoring_phase");
    expect(settingsSource).toContain("requires_restart: true");
  });
});
