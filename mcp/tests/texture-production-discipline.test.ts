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

  test("active guidance owns one production color atlas and explicit atlas identity", async () => {
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
      expect(lower).toContain("texture_id");
      expect(text).toContain("PBR");
    }

    expect(skill).toContain("one base-color atlas PNG");
    expect(workflow).toContain("one base-color atlas PNG");
    expect(skill).toContain("list_textures");
    expect(workflow).toContain("list_textures");
    expect(policy).toContain("Single Base-Color Atlas");
  });

  test("production texture requires texel scale plus material/form/detail hierarchy", async () => {
    const [skill, workflow, policy] = await Promise.all([
      source("../.agents/skills/blockit-bedrock-texturing/SKILL.md"),
      source("prompts/bedrock_entity_workflow.md"),
      source("../docs/foundation/06-texture-standard.md"),
    ]);

    for (const text of [skill, workflow, policy]) {
      const lower = text.toLowerCase();
      for (const invariant of [
        "palette",
        "ramp",
        "pixels per uv unit",
        "flat",
        "face",
        "contact",
        "occlusion",
        "edge",
        "hue",
        "identity",
        "detail",
        "noise",
        "alpha",
      ]) {
        expect(lower).toContain(invariant);
      }
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

  test("UV mapping is globally audited and locked before production pixels", async () => {
    const [skill, workflow, policy] = await Promise.all([
      source("../.agents/skills/blockit-bedrock-texturing/SKILL.md"),
      source("prompts/bedrock_entity_workflow.md"),
      source("../docs/foundation/06-texture-standard.md"),
    ]);

    for (const text of [skill, workflow, policy]) {
      const lower = text.toLowerCase();
      expect(lower).toContain("autouv=0");
      expect(lower).toContain("integer");
      expect(lower).toContain("out-of-bounds");
      expect(lower).toContain("partial overlap");
      expect(lower).toContain("exact reuse");
      expect(lower).toContain("seam");
    }

    expect(skill).toContain("UV / Atlas Gate");
    expect(workflow).toContain("UV / Atlas Gate");
  });

  test("convergence reviews structure and identity before microdetail", async () => {
    const [skill, workflow, policy] = await Promise.all([
      source("../.agents/skills/blockit-bedrock-texturing/SKILL.md"),
      source("prompts/bedrock_entity_workflow.md"),
      source("../docs/foundation/06-texture-standard.md"),
    ]);

    for (const text of [skill, workflow, policy]) {
      const lower = text.toLowerCase();
      expect(lower).toContain("uv");
      expect(lower).toContain("material");
      expect(lower).toContain("form");
      expect(lower).toContain("identity");
      expect(lower).toContain("microdetail");
    }

    expect(skill).toContain("Texture Difference Table");
    expect(workflow).toContain("Texture Difference Table");
  });
});
