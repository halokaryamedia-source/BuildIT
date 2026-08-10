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
    expect(modelling).toContain("Tool Lane Discipline");
    expect(modelling).toContain("If no current decision requires a branch, stay in the geometry lane");
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

  test("next work remains problem-driven and advances to sequencing", async () => {
    const next = await source("../docs/knowledge/next-action.md");
    expect(next).toContain("MCP_MODEL_EFFECTIVENESS_TOOL_ROUTING_HARDENING_SOURCE_COMPLETE_LOCAL_PROOF_REQUIRED");
    expect(next).toContain("P2 — texture and animation sequencing");
  });
});
