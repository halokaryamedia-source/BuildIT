import { describe, expect, test } from "bun:test";
import { DEFAULT_BEDROCK_UV_RESOLUTION } from "@/server/tools/project";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("professional texture production discipline", () => {
  test("new Bedrock projects default to the 128 logical UV baseline with an explicit 256 opt-in", async () => {
    expect(DEFAULT_BEDROCK_UV_RESOLUTION).toBe(128);
    const project = await source("server/tools/project.ts");
    expect(project).toContain("Project!.texture_width = resolution ?? DEFAULT_BEDROCK_UV_RESOLUTION");
    expect(project).toContain("Project!.texture_height = resolution ?? DEFAULT_BEDROCK_UV_RESOLUTION");
    expect(project).toContain('z.literal(128), z.literal(256)');
  });

  test("canonical vocabulary separates UV Layout, Texture Atlas, Styling, and Verify", async () => {
    const [context, skill, workflow, policy, flow] = await Promise.all([
      source("../CONTEXT.md"),
      source("../.agents/skills/blockit-bedrock-texturing/SKILL.md"),
      source("prompts/bedrock_entity_workflow.md"),
      source("../docs/foundation/06-texture-standard.md"),
      source("../docs/knowledge/flow.md"),
    ]);

    for (const owner of [context, skill, workflow, policy, flow]) {
      for (const term of ["UV Layout", "Texture Atlas", "Texture Styling", "Texture Verify"]) {
        expect(owner.toLowerCase()).toContain(term.toLowerCase());
      }
    }
    for (const owner of [context, skill, workflow, policy]) {
      expect(owner).toContain("create_texture");
      expect(owner.toLowerCase()).toContain("texture atlas");
    }
  });

  test("active guidance owns one production base-color atlas and explicit atlas identity", async () => {
    const [skill, workflow, policy] = await Promise.all([
      source("../.agents/skills/blockit-bedrock-texturing/SKILL.md"),
      source("prompts/bedrock_entity_workflow.md"),
      source("../docs/foundation/06-texture-standard.md"),
    ]);

    for (const text of [skill, workflow, policy]) {
      const lower = text.toLowerCase();
      expect(lower).toContain("base-color atlas");
      expect(lower).toContain("128");
      expect(lower).toContain("body part");
      expect(lower).toContain("texture_id");
      expect(lower).toContain("pbr");
    }
    expect(policy).toContain("Single Base-Color Atlas");
  });

  test("production styling requires texel scale plus material/form/detail hierarchy", async () => {
    const [skill, workflow, policy] = await Promise.all([
      source("../.agents/skills/blockit-bedrock-texturing/SKILL.md"),
      source("prompts/bedrock_entity_workflow.md"),
      source("../docs/foundation/06-texture-standard.md"),
    ]);

    for (const text of [skill, workflow, policy]) {
      const lower = text.toLowerCase();
      for (const invariant of [
        "palette", "ramp", "pixels per uv unit", "flat", "face", "contact",
        "occlusion", "edge", "hue", "identity", "detail", "noise", "alpha",
      ]) expect(lower).toContain(invariant);
    }
    for (const stage of ["BASE PASS", "VALUE / FORM PASS", "IDENTITY PASS", "SECONDARY DETAIL PASS", "VERIFY"]) {
      expect(skill).toContain(stage);
      expect(workflow).toContain(stage);
    }
  });

  test("Texturing routes only current-phase tools and hands UV mutation back to Geometry", async () => {
    const skill = await source("../.agents/skills/blockit-bedrock-texturing/SKILL.md");
    for (const tool of [
      "create_texture", "list_textures", "activate_texture", "get_texture",
      "paint_fill_tool", "draw_shape_tool", "gradient_tool", "paint_with_brush",
      "create_pbr_material", "configure_material", "assign_texture_channel",
    ]) expect(skill).toContain(tool);

    expect(skill).toContain("connect_strokes=false");
    expect(skill).toContain("box_uv_region");
    expect(skill).toContain("autouv=0");
    expect(skill).toContain("HANDOFF_REQUIRED(geometry)");
    expect(skill).toContain("Never `tool_search` for `modify_cube`, `modify_cubes_batch`, `bone_rigging`");
  });

  test("UV Layout lock/audit remains Geometry-owned before Texture Styling", async () => {
    const [skill, workflow, policy] = await Promise.all([
      source("../.agents/skills/blockit-bedrock-texturing/SKILL.md"),
      source("prompts/bedrock_entity_workflow.md"),
      source("../docs/foundation/06-texture-standard.md"),
    ]);

    expect(skill.toLowerCase()).toContain("final box uv is locked with `autouv=0`");
    expect(skill).toContain("list_textures");
    expect(skill).toContain("must not borrow Cube mutation");

    for (const text of [workflow, policy]) {
      const lower = text.toLowerCase();
      expect(lower).toContain("autouv=0");
      expect(lower).toContain("integer");
      expect(lower).toContain("out-of-bounds");
      expect(lower).toContain("partial overlap");
      expect(lower).toContain("exact reuse");
      expect(lower).toContain("seam");
    }
  });

  test("Texture Verify reviews mapped structure and identity before microdetail", async () => {
    const [skill, workflow, policy] = await Promise.all([
      source("../.agents/skills/blockit-bedrock-texturing/SKILL.md"),
      source("prompts/bedrock_entity_workflow.md"),
      source("../docs/foundation/06-texture-standard.md"),
    ]);

    for (const text of [skill, workflow, policy]) {
      const lower = text.toLowerCase();
      for (const term of ["uv", "material", "form", "identity", "microdetail"]) {
        expect(lower).toContain(term);
      }
      expect(text).toContain("Texture Verify");
    }
    expect(skill).toContain("Texture Verify / Visual Convergence");
  });
});
