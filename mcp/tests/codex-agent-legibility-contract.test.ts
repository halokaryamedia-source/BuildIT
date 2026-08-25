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
  test("initialize exposes units, axes, and deterministic phase routing", () => {
    expect(BEDROCK_AUTHORING_COORDINATE_CONTRACT).toContain(
      "16 Blockbench units=1 Minecraft block"
    );
    expect(BEDROCK_AUTHORING_COORDINATE_CONTRACT).toContain("x=width");
    expect(BEDROCK_AUTHORING_COORDINATE_CONTRACT).toContain("y=height");
    expect(BEDROCK_AUTHORING_COORDINATE_CONTRACT).toContain("z=length");
    expect(BEDROCK_AUTHORING_COORDINATE_CONTRACT).toContain("+Y=up");

    for (const phase of MCP_AUTHORING_PHASES) {
      const runtime = buildMcpPhaseRuntimeContract(phase);
      const instructions = buildMcpServerInstructions(phase);
      expect(runtime).toContain(BEDROCK_AUTHORING_COORDINATE_CONTRACT);
      expect(instructions).toContain(BEDROCK_AUTHORING_COORDINATE_CONTRACT);
      expect(instructions).toContain("Do not tool_search");
      expect(instructions).toContain("HANDOFF_REQUIRED");
      expect(instructions.length).toBeLessThan(700);
    }

    const geometry = buildMcpServerInstructions("geometry");
    expect(geometry).toContain("add_group=new bone");
    expect(geometry).toContain("bone_rigging=parent/pivot/IK/mirror");
    expect(geometry).toContain("remove_element/rename_element=delete/rename");
    expect(geometry).toContain("list_textures=UV gate");

    const texturing = buildMcpServerInstructions("texturing");
    expect(texturing).toContain("list_textures=UV/atlas gate");
    expect(texturing).toContain("create_texture=Atlas");
    expect(texturing).toContain("Painter=Styling");
    expect(texturing).toContain("blank Atlas=project UV 128/256");

    const animation = buildMcpServerInstructions("animation");
    expect(animation).toContain("create_animation=new clip");
    expect(animation).toContain("manage_keyframes=bone/channel keys");
    expect(animation).toContain("rig defect=>Geometry");
  });

  test("asset router prevents first-call guessing on common Geometry contracts", async () => {
    const router = await source(
      "../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md"
    );

    expect(router).toContain("1 Minecraft block = 16 Blockbench units");
    expect(router).toContain("front_direction");
    expect(router).toContain("create normal bone/Group      → add_group");
    expect(router).toContain("rig parent/pivot/IK/mirror    → bone_rigging");
    expect(router).toContain("pass name OR groups, never both");
    expect(router).toContain("modify_cube                     → id + at least one authored field change");
    expect(router).toContain("load **that exact active-phase spec once** before mutation");
    expect(router).toContain(
      "A validation failure repairs arguments for the **same routed tool**"
    );
  });

  test("Texturing exposes UV gate, Painter intent, and the current blank-atlas guard", async () => {
    const texturing = await source(
      "../.agents/skills/blockit-bedrock-texturing/SKILL.md"
    );

    expect(texturing).toContain("`uv_audit.production_gate`");
    expect(texturing).toContain("list_textures` is not merely a texture list");
    expect(texturing).toContain("provisional **16×16** blank default");
    expect(texturing).toContain("must therefore **not omit blank Atlas size**");
    expect(texturing).toContain("128×128 default, 256×256 opt-in");
    expect(texturing).toContain("gradient_tool` is for a reference-supported continuous transition");
  });

  test("persistent workspace preserves scale/front orientation instead of re-guessing", async () => {
    const workspace = await source("../workspace/README.md");
    expect(workspace).toContain(
      "Material handoff constraints (scale/front_direction/pose override when material)"
    );
    expect(workspace).toContain(
      "front_direction` means the canonical object front used by `capture_model_views`"
    );
    expect(workspace).toContain("1 block = 16 Blockbench units");
  });
});
