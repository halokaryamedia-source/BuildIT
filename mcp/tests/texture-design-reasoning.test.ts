import { describe, expect, test } from "bun:test";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("texture design reasoning contract", () => {
  test("active guidance defines production Texture Styling decisions without a separate design ceremony", async () => {
    const [skill, workflow, policy] = await Promise.all([
      source("../.agents/skills/blockit-bedrock-texturing/SKILL.md"),
      source("prompts/bedrock_entity_workflow.md"),
      source("../docs/foundation/06-texture-standard.md"),
    ]);

    for (const text of [skill, workflow, policy]) {
      const lower = text.toLowerCase();
      for (const term of [
        "palette",
        "material",
        "value",
        "face",
        "seam",
        "identity",
        "detail",
      ]) expect(lower).toContain(term);
      expect(text).toContain("Texture Styling");
    }

    expect(skill).toContain("material_instance");
    expect(skill).toContain("pixels per UV unit");
    expect(policy).toContain("Material-Family Palette Ramps");
    expect(policy).toContain("VALUE / FORM PASS");
  });

  test("texturing routes mapped-state reads to existing inspection and Painter tools", async () => {
    const [skill, workflow] = await Promise.all([
      source("../.agents/skills/blockit-bedrock-texturing/SKILL.md"),
      source("prompts/bedrock_entity_workflow.md"),
    ]);

    for (const text of [skill, workflow]) {
      for (const term of [
        "inspect_element",
        "draw_shape_tool",
        "paint_with_brush",
        "BASE PASS",
        "VALUE / FORM PASS",
        "IDENTITY PASS",
        "SECONDARY DETAIL PASS",
        "VERIFY",
      ]) expect(text).toContain(term);
    }

    expect(skill).toContain("box_uv_region");
    expect(skill).toContain("face-specific mapping");
    expect(skill).toContain("must not borrow Cube mutation");
  });

  test("guidance rejects noise-first painting and requires atlas plus mapped-model evidence", async () => {
    const [skill, workflow] = await Promise.all([
      source("../.agents/skills/blockit-bedrock-texturing/SKILL.md"),
      source("prompts/bedrock_entity_workflow.md"),
    ]);

    for (const text of [skill, workflow]) {
      expect(text.toLowerCase()).toContain("random high-contrast noise");
      expect(text.toLowerCase()).toContain("atlas");
      expect(text.toLowerCase()).toContain("visual");
      expect(text).toContain("get_texture");
      expect(text).toContain("capture_model_views");
      expect(text).toContain("FAIL");
      expect(text).toContain("UNVERIFIED");
      expect(text).toContain("PASS");
    }
  });

  test("committed runtime prompt manifest matches the canonical full workflow source", async () => {
    const manifest = JSON.parse(await source("prompts/manifest.json")) as {
      prompts: Record<string, string>;
    };
    const workflow = await source("prompts/bedrock_entity_workflow.md");
    const runtime = await source("server/prompts.ts");

    expect(manifest.prompts.bedrock_entity_workflow).toBe(workflow);
    expect(workflow).toContain("## Texture Styling");
    expect(runtime).toContain("selectMcpPhaseWorkflowBody");
    expect(runtime).toContain('texturing: [');
    expect(runtime).toContain('"Texture Styling"');
  });
});
