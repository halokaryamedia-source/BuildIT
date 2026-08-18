import { describe, expect, test } from "bun:test";
import { DEFAULT_BEDROCK_UV_RESOLUTION } from "@/server/tools/project";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("professional texture production discipline", () => {
  test("new Bedrock projects use the simple 128 logical UV baseline", async () => {
    expect(DEFAULT_BEDROCK_UV_RESOLUTION).toBe(128);

    const project = await source("server/tools/project.ts");
    expect(project).toContain(
      "Project!.texture_width = DEFAULT_BEDROCK_UV_RESOLUTION"
    );
    expect(project).toContain(
      "Project!.texture_height = DEFAULT_BEDROCK_UV_RESOLUTION"
    );
    expect(project).toContain("resolution: {");
  });

  test("active guidance owns one production color atlas and simple canvas scale", async () => {
    const [skill, workflow, policy] = await Promise.all([
      source("../.agents/skills/blockit-bedrock-texturing/SKILL.md"),
      source("prompts/bedrock_entity_workflow.md"),
      source("../docs/foundation/06-texture-standard.md"),
    ]);

    for (const text of [skill, workflow, policy]) {
      const lower = text.toLowerCase();
      expect(lower).toContain("color atlas");
      expect(lower).toContain("128");
      expect(lower).toContain("body part");
      expect(text).toContain("PBR");
    }

    expect(skill).toContain("one color atlas PNG");
    expect(workflow).toContain("one color atlas PNG");
    expect(skill).toContain("list_textures");
    expect(workflow).toContain("list_textures");
    expect(policy).toContain("Single Color Atlas");
  });

  test("production texture requires material ramps, form shading, identity, and detail", async () => {
    const [skill, workflow, policy] = await Promise.all([
      source("../.agents/skills/blockit-bedrock-texturing/SKILL.md"),
      source("prompts/bedrock_entity_workflow.md"),
      source("../docs/foundation/06-texture-standard.md"),
    ]);

    for (const text of [skill, workflow, policy]) {
      const lower = text.toLowerCase();
      expect(lower).toContain("palette ramp");
      expect(lower).toContain("flat base color");
      expect(lower).toContain("face-aware");
      expect(lower).toContain("identity");
      expect(lower).toContain("detail");
      expect(lower).toContain("noise");
    }

    for (const stage of [
      "BASE PASS",
      "VALUE / FORM PASS",
      "IDENTITY PASS",
      "SECONDARY DETAIL PASS",
      "VERIFY",
    ]) {
      expect(skill).toContain(stage);
      expect(workflow).toContain(stage);
    }
  });

  test("UV mapping is gated before production pixels and convergence reviews structure first", async () => {
    const [skill, workflow] = await Promise.all([
      source("../.agents/skills/blockit-bedrock-texturing/SKILL.md"),
      source("prompts/bedrock_entity_workflow.md"),
    ]);

    for (const text of [skill, workflow]) {
      expect(text).toContain("UV / Atlas Gate");
      expect(text).toContain("uv_offset");
      expect(text).toContain("mirror_uv");
      expect(text).toContain("autouv");
      expect(text).toContain("accidental overlap");
      expect(text).toContain("seam-critical");
      expect(text).toContain("UV/region placement");
      expect(text).toContain("palette/material separation");
      expect(text).toContain("value/form shading");
    }
  });
});
