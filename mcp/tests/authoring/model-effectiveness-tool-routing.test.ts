import { describe, expect, test } from "bun:test";
import { selectMcpPhaseWorkflowBody } from "@/server/prompts";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("model creation effectiveness — tool routing", () => {
  test("Geometry lane is explicit and runtime prompt excludes later-phase tools", async () => {
    const [orchestrator, modelling, workflow] = await Promise.all([
      source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md"),
      source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md"),
      source("prompts/bedrock_entity_workflow.md"),
    ]);
    const geometryRuntime = selectMcpPhaseWorkflowBody(workflow, "geometry");

    for (const tool of ["get_project_info", "place_cube", "capture_model_views", "inspect_element", "modify_cube", "export_model"]) {
      expect(orchestrator).toContain(tool);
    }
    for (const tool of ["place_cube", "inspect_element", "modify_cube"]) {
      expect(geometryRuntime).toContain(tool);
    }
    expect(geometryRuntime).toContain("fresh model views");
    expect(geometryRuntime).not.toContain("create_texture");
    expect(geometryRuntime).not.toContain("create_animation");
    expect(orchestrator).toMatch(/Skip `get_project_info` after create\/export unless .*lifecycle state.*unknown\/stale/i);
    expect(modelling).toContain("Stay in the geometry lane unless a current decision requires another branch");
  });

  test("specialists reuse known state instead of forcing lifecycle/discovery rereads", async () => {
    const [animation, texturing] = await Promise.all([
      source("../.agents/skills/blockit-bedrock-animation/SKILL.md"),
      source("../.agents/skills/blockit-bedrock-texturing/SKILL.md"),
    ]);
    const normalizedAnimation = animation.toLowerCase().replaceAll("`", "");

    expect(normalizedAnimation).toContain("reuse fresh uuid/state");
    expect(normalizedAnimation).toContain("must not fall back to broad hierarchy discovery or confirmation reads");
    expect(texturing.toLowerCase()).toContain("reuse fresh state");
    expect(texturing).toContain("do not re-list/re-read it only for confirmation");
    expect(texturing).toContain("Pin atlas UUID and pass `texture_id` when multiple textures are loaded");
  });

  test("convenience tools retain branch-only roles", async () => {
    const [camera, elements, history, orchestrator] = await Promise.all([
      source("server/tools/camera.ts"),
      source("server/tools/element.ts"),
      source("server/tools/history.ts"),
      source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md"),
    ]);

    expect(camera).toContain("cameraToolDocs[1].status, false");
    expect(camera).toContain("cameraToolDocs[2].status, false");

    const duplicateStart = elements.indexOf('name: "duplicate_element"');
    const duplicateEnd = elements.indexOf('name: "rename_element"', duplicateStart);
    const duplicateDoc = elements.slice(duplicateStart, duplicateEnd);
    expect(duplicateStart).toBeGreaterThan(-1);
    expect(duplicateDoc).toContain("status: STATUS_EXPERIMENTAL");
    expect(orchestrator).not.toContain("duplicate_element");

    expect(history).toContain('name: "get_undo_stack"');
    expect(orchestrator).not.toContain("get_undo_stack");
  });

  test("routing hardening preserves the existing Bedrock registration profile", async () => {
    const profile = await source("lib/registrationProfile.ts");
    expect(profile).toContain('export type McpRegistrationProfile = "bedrock_entity" | "extended";');
    expect(profile).toContain('"animation"');
    expect(profile).toContain('"paint"');
    expect(profile).toContain('"material_instances"');
    expect(profile).toContain('"textures"');
    expect(profile).not.toContain("geometry_only");
    expect(profile).not.toContain("tool_lane_profile");
  });
});
