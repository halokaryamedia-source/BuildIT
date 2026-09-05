import { describe, expect, test } from "bun:test";
import { consolidatedInspectionToolDocs, consolidatedMaterialToolDocs } from "@/server/tools";
import { textureToolDocs } from "@/server/tools/texture";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("texture production discipline", () => {
  test("texture creation requires explicit production canvas size and routes mapping to Geometry", async () => {
    const [textureSource, standard] = await Promise.all([
      source("server/tools/texture.ts"),
      source("../docs/foundation/06-texture-standard.md"),
    ]);
    const create = textureToolDocs.find((tool) => tool.name === "create_texture");
    const shape = textureToolDocs.find((tool) => tool.name === "draw_shape_tool");
    const brush = textureToolDocs.find((tool) => tool.name === "paint_with_brush");
    expect(create).toBeDefined();
    expect(create?.description).toContain("blank default is 16×16");
    expect(create?.description).toContain("pass width+height explicitly for production");
    expect(create?.description).toContain("does not assign UVs");
    expect(create?.description).toContain("mapping belongs to Geometry/UV Layout");
    expect(shape?.description).toContain("Texture Styling only");
    expect(brush?.description).toContain("Texture Styling only");
    expect(textureSource).not.toContain("apply_texture");
    expect(standard).toContain("create_texture` creates a **Texture Atlas**");
    expect(standard).toContain("does not create UV Layout");
  });

  test("production standard owns one base atlas and 128-based canvases", async () => {
    const standard = await source("../docs/foundation/06-texture-standard.md");
    expect(standard).toContain("logical UV remains **128×128** for production");
    expect(standard).toContain("128×128");
    expect(standard).toContain("256×256");
    expect(standard).toContain("384×384");
    expect(standard).toContain("512×512");
    expect(standard).toContain("one base-color atlas PNG for the whole model");
    expect(standard).toContain("Do not optimize atlas occupancy as a quality score");
  });

  test("Texture Styling cannot be completed by technical state or placeholder fill", async () => {
    const [standard, skill] = await Promise.all([
      source("../docs/foundation/06-texture-standard.md"),
      source("../.agents/skills/blockit-bedrock-texturing/SKILL.md"),
    ]);
    expect(standard).toContain("A placeholder/flat fill may make geometry readable early");
    expect(standard).toContain("is not production completion");
    expect(standard).toContain("Creating an atlas, clearing it, or filling it with one color is **not Texture Styling completion**");
    expect(standard).toContain("Material-Family Palette Ramps");
    expect(standard).toContain("value and hue");
    expect(standard).toContain("Texture Verify asks whether the atlas pixels");
    expect(standard).toContain("fresh Texture Atlas image");
    expect(standard).toContain("fresh affected model view(s)");
    expect(skill).toContain("flat rectangles");
    expect(skill).toContain("generic palette");
    expect(skill).toContain("copied unrelated texture");
    expect(skill).toContain("mapped model-view evidence");
  });

  test("global UV audit is exposed on list_textures instead of deprecated inspection aliases", () => {
    const sourceText = consolidatedInspectionToolDocs.description;
    const list = textureToolDocs.find((tool) => tool.name === "list_textures");
    expect(list).toBeDefined();
    expect(list?.description).toContain("global UV audit");
    expect(sourceText).toContain("Bedrock elements");
    expect(sourceText).not.toContain("global UV audit");
  });

  test("global UV audit owns explicit production gate semantics", async () => {
    const sourceText = await source("server/tools/texture.ts");
    for (const term of [
      "production_gate",
      "partial_overlap_candidates",
      "partial-overlap review blockers",
      "invalid/non-finite UV coordinates",
      "out-of-bounds faces",
      "unlocked Box-UV Cubes",
      "fractional UV candidates",
      "recommendation",
    ]) expect(sourceText).toContain(term);
    expect(sourceText).toContain("blocking_issues.length === 0 ? \"PASS\" : \"FAIL\"");
  });

  test("texturing skill routes global audit first and face inspection conditionally", async () => {
    const skill = await source("../.agents/skills/blockit-bedrock-texturing/SKILL.md");
    expect(skill).toMatch(/global UV\/atlas readiness\s+→ list_textures/i);
    expect(skill).toMatch(/face-specific mapping\s+→ inspect_elements\(mode=detail\) only when needed/i);
    expect(skill).toContain("final Box UV locked with `autouv=0`");
    expect(skill).toContain("no invalid/out-of-bounds/partial-overlap blocker");
  });

  test("texturing uses consolidated material facade instead of public primitive aliases", async () => {
    const [skill, docs] = await Promise.all([
      source("../.agents/skills/blockit-bedrock-texturing/SKILL.md"),
      source("docs/api.json"),
    ]);
    expect(skill).toContain("manage_material");
    expect(skill).not.toContain("create_pbr_material / configure_material / assign_texture_channel");
    expect(skill).not.toContain("save_material_config");
    expect(consolidatedMaterialToolDocs.name).toBe("manage_material");
    expect(consolidatedMaterialToolDocs.description).toContain("PBR material");
    expect(docs).toContain('"name": "manage_material"');
    expect(docs).not.toContain('"name": "create_pbr_material"');
  });

  test("Texturing keeps semantic ownership while using shared AUTHORING capabilities for upstream correction", async () => {
    const skill = await source("../.agents/skills/blockit-bedrock-texturing/SKILL.md");
    expect(skill).toContain("Geometry/UV capabilities remain callable for bounded upstream correction");
    expect(skill).toContain("must not borrow Cube mutation");
    expect(skill).toContain("No Geometry↔Texturing phase switch");
    expect(skill).toContain("HANDOFF_REQUIRED");
    expect(skill).toContain("switch_authoring_phase");
    expect(skill).toContain("AUTHORING↔Animation");
    expect(skill).not.toContain("target_phase: geometry");
  });
});
