import { describe, expect, test } from "bun:test";
import {
  BEDROCK_AUTHORING_COORDINATE_CONTRACT,
  MCP_AUTHORING_PHASES,
  buildMcpPhaseRuntimeContract,
} from "@/lib/authoringPhase";
import { buildMcpServerInstructions } from "@/server/server";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("Codex Bedrock agent legibility contract", () => {
  test("initialize exposes units/axes and Gateway-aware phase semantics without embedding routed tools", () => {
    expect(BEDROCK_AUTHORING_COORDINATE_CONTRACT).toContain(
      "16 Blockbench units=1 Minecraft block"
    );
    for (const term of ["x=width", "y=height", "z=length", "+Y=up"]) {
      expect(BEDROCK_AUTHORING_COORDINATE_CONTRACT).toContain(term);
    }

    for (const phase of MCP_AUTHORING_PHASES) {
      const runtime = buildMcpPhaseRuntimeContract(phase);
      const instructions = buildMcpServerInstructions(phase);
      expect(runtime).toContain(BEDROCK_AUTHORING_COORDINATE_CONTRACT);
      expect(instructions).toContain(BEDROCK_AUTHORING_COORDINATE_CONTRACT);
      expect(instructions).toContain(
        "Do not search for, emulate, rename, or substitute foreign tools"
      );
      expect(instructions).toContain("HANDOFF_REQUIRED");
      expect(instructions).toContain("switch_authoring_phase");
      expect(instructions).toContain("Gateway");
      expect(instructions.length).toBeLessThan(700);
      for (const routedTool of [
        "add_group=",
        "bone_rigging=",
        "create_texture=",
        "create_animation=",
      ]) expect(instructions).not.toContain(routedTool);
    }
  });

  test("root authoring boot deterministically loads router and matching current-worktree specialist", async () => {
    const [agents, router, modelling, texturing, animation] = await Promise.all([
      source("../AGENTS.md"),
      source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md"),
      source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md"),
      source("../.agents/skills/blockit-bedrock-texturing/SKILL.md"),
      source("../.agents/skills/blockit-bedrock-animation/SKILL.md"),
    ]);

    for (const path of [
      ".agents/skills/blockit-bedrock-entity-mcp/SKILL.md",
      ".agents/skills/blockbench-bedrock-modelling/SKILL.md",
      ".agents/skills/blockit-bedrock-texturing/SKILL.md",
      ".agents/skills/blockit-bedrock-animation/SKILL.md",
    ]) expect(agents).toContain(path);

    expect(agents).toContain("No authoring mutation is allowed until the router + matching specialist are loaded from the current worktree");
    expect(router).toContain("## Mandatory Authoring Latch");
    expect(router).toContain("Any `NO` → **DO NOT MUTATE**");
    expect(router).toContain("current worktree");
    expect(router).toContain("Geometry APPROVED + UV Layout PASS");

    expect(router).toMatch(/description: Mandatory router for every BlockIT Minecraft Bedrock Entity asset-authoring task/);
    expect(modelling).toMatch(/description: Mandatory BlockIT Bedrock Geometry and UV Layout specialist/);
    expect(texturing).toMatch(/description: Mandatory BlockIT Bedrock Texture specialist/);
    expect(animation).toMatch(/description: Minecraft Bedrock Entity animation specialist/);
  });

  test("asset router makes common Geometry choices and first-call rules explicit", async () => {
    const router = await source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md");

    expect(router).toContain("1 Minecraft block = 16 Blockbench units");
    expect(router).toContain("front_direction");
    expect(router).toContain("create normal bone/Group       → add_group");
    expect(router).toContain("Group/bone parent move         → reparent_element");
    expect(router).toContain("Group pivot/rotation/visible   → modify_group");
    expect(router).toContain("rig IK/mirror                  → bone_rigging");
    expect(router).toContain("pass name OR groups, never both");
    expect(router).toContain("manage_cubes update       → id + at least one authored field change");
    expect(router).toContain("`describe_capability` once before mutation");
    expect(router).toContain("repairs arguments for the **same capability**");
  });

  test("Texturing exposes hard entry gate, UV gate, Painter intent, and blank-atlas guard", async () => {
    const texturing = await source("../.agents/skills/blockit-bedrock-texturing/SKILL.md");

    expect(texturing).toContain("Geometry APPROVED + UV Layout PASS");
    expect(texturing).toContain("Do not start Painter/PBR mutation if the entry gate is not satisfied");
    expect(texturing).toContain("`uv_audit.production_gate`");
    expect(texturing).toContain("provisional **16×16** blank default");
    expect(texturing).toContain("must therefore **not omit blank Atlas size**");
    expect(texturing).toContain("128×128 default, 256×256 opt-in");
    expect(texturing).toContain(
      "`gradient_tool` is only for reference-supported continuous transition"
    );
  });

  test("persistent workspace preserves resume-critical UV gate, scale, and front orientation", async () => {
    const workspace = await source("../workspace/README.md");
    expect(workspace).toContain("UV Layout:");
    expect(workspace).toContain("NOT_STARTED | IN_PROGRESS | PASS | INVALIDATED | BLOCKED");
    expect(workspace).toContain("Texturing cannot enter `IN_PROGRESS` until `UV Layout: PASS`");
    expect(workspace).toContain("current-worktree BlockIT asset router");
    expect(workspace).toContain("current-worktree active specialist");
    expect(workspace).toContain(
      "Material handoff constraints (scale/front_direction/pose override when material)"
    );
    expect(workspace).toContain(
      "front_direction` means the canonical object front used by `capture_model_views`"
    );
    expect(workspace).toContain("1 block = 16 Blockbench units");
  });
});
