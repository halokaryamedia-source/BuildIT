import { describe, expect, test } from "bun:test";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("model creation effectiveness — tool routing", () => {
  test("normal geometry lane is explicit and specialist tools are stage-gated", async () => {
    const orchestrator = await source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md");
    const modelling = await source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md");
    const workflow = await source("prompts/bedrock_entity_workflow.md");

    for (const text of [orchestrator, workflow]) {
      expect(text).toContain("get_project_info");
      expect(text).toContain("place_cube");
      expect(text).toContain("capture_model_views");
      expect(text).toContain("inspect_element");
      expect(text).toContain("modify_cube");
      expect(text).toContain("export_model");
      expect(text.toLowerCase()).toContain("stage");
    }
    expect(orchestrator).toContain(
      "Skip `get_project_info` after create/export unless required"
    );
    expect(workflow).toContain("Do not immediately call `get_project_info`");
    expect(workflow).not.toContain("get_project_info → place_cube/Group build");
    expect(workflow).toContain("project unknown/absent → get_project_info or create_project");
    expect(modelling).toContain("Tool Lane Discipline");
    expect(modelling).toContain("If no current decision requires a branch, stay in the geometry lane");
  });

  test("specialists reuse known state instead of forcing lifecycle and discovery rereads", async () => {
    const animation = await source("../.agents/skills/blockit-bedrock-animation/SKILL.md");
    const texturing = await source("../.agents/skills/blockit-bedrock-texturing/SKILL.md");
    const normalizedAnimation = animation.toLowerCase().replaceAll("`", "");

    // Animation compaction states reuse discipline as one contract sentence.
    expect(normalizedAnimation).toContain("reuse fresh uuid/state");
    expect(normalizedAnimation).toContain(
      "must not fall back to broad hierarchy discovery or confirmation reads"
    );
    expect(animation).not.toContain("Confirm the active project format is `bedrock` with `get_project_info`");
    expect(texturing).toContain("Reuse fresh identity/metadata.");
    expect(texturing).toContain("do not re-list/re-read it only for confirmation");
    expect(texturing).toContain(
      "Pin the color atlas UUID and pass `texture_id` when multiple textures are loaded"
    );
  });

  test("convenience tools explain their branch-only role instead of competing with geometry identity/evidence", async () => {
    const [camera, elements, history] = await Promise.all([
      source("server/tools/camera.ts"),
      source("server/tools/element.ts"),
      source("server/tools/history.ts"),
    ]);

    expect(camera).toContain("branch-only observation helper");
    expect(elements).toContain("duplication is not a shortcut for deciding primary geometry");
    expect(elements).toContain("not a normal geometry-targeting path");
    expect(elements).toContain("Normal geometry inspection and mutation should prefer explicit UUIDs");
    expect(history).toContain("should not be polled between successful bounded edits");
    expect(history).toContain("Do not create a checkpoint after every Cube/edit");
  });

  test("routing hardening preserves the Bedrock registration families instead of adding a new profile/gating framework", async () => {
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
