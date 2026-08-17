import { describe, expect, test } from "bun:test";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("texture design reasoning contract", () => {
  test("active guidance requires a Texture Design Contract before production pixels", async () => {
    const [skill, workflow, policy] = await Promise.all([
      source("../.agents/skills/blockit-bedrock-texturing/SKILL.md"),
      source("prompts/bedrock_entity_workflow.md"),
      source("../docs/foundation/06-texture-standard.md"),
    ]);

    for (const text of [skill, workflow]) {
      for (const term of [
        "Texture Design Contract",
        "palette roles",
        "material zones",
        "value hierarchy",
        "face-aware",
        "seam",
        "detail budget",
        "material_instance",
      ]) expect(text).toContain(term);
    }

    expect(policy).toContain("Base Texture");
    expect(policy).toContain("Material Readability");
    expect(policy).toContain("Lighting / Shading Consistency");
    expect(policy).toContain("Geometry Alignment");
  });

  test("T4 routes design through T2 mapped state and T3 bounded authoring", async () => {
    const [skill, workflow] = await Promise.all([
      source("../.agents/skills/blockit-bedrock-texturing/SKILL.md"),
      source("prompts/bedrock_entity_workflow.md"),
    ]);

    for (const text of [skill, workflow]) {
      for (const term of [
        "inspect_element",
        "mapping_state",
        "paintable",
        "texture_pixels.rect",
        "flip_u",
        "flip_v",
        "draw_shape_tool",
        "BASE PASS",
        "VALUE / FORM PASS",
        "IDENTITY PASS",
        "SECONDARY DETAIL PASS",
        "VERIFY",
      ]) expect(text).toContain(term);
    }

    expect(skill).toContain("paint_with_brush exact-pixel path");
    expect(skill).toContain("Do not mentally re-derive atlas coordinates");
  });

  test("guidance rejects noise-first painting and requires atlas plus model evidence", async () => {
    const [skill, workflow] = await Promise.all([
      source("../.agents/skills/blockit-bedrock-texturing/SKILL.md"),
      source("prompts/bedrock_entity_workflow.md"),
    ]);

    for (const text of [skill, workflow]) {
      expect(text.toLowerCase()).toContain("random high-contrast noise");
      expect(text).toContain("atlas");
      expect(text).toContain("model-view");
      expect(text).toContain("Tool success");
      expect(text).toContain("visual");
    }

    for (const cause of [
      "REGION_PLACEMENT",
      "PALETTE_VALUE",
      "MATERIAL_READABILITY",
      "UV_ORIENTATION",
      "SEAM_CONTINUITY",
      "IDENTITY_MARK",
      "DETAIL_DENSITY",
    ]) expect(skill).toContain(cause);
  });

  test("committed runtime prompt manifest matches the active workflow prompt", async () => {
    const manifest = JSON.parse(await source("prompts/manifest.json")) as {
      prompts: Record<string, string>;
    };
    const workflow = await source("prompts/bedrock_entity_workflow.md");

    expect(manifest.prompts.bedrock_entity_workflow).toBe(workflow);
    expect(manifest.prompts.bedrock_entity_workflow).toContain("Texture Design Contract");
  });
});
