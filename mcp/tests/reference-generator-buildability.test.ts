import { describe, expect, test } from "bun:test";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

function normalized(text: string): string {
  return text.replace(/\s+/g, " ").trim().toLowerCase();
}

describe("reference generator buildability contract", () => {
  test("simple user input is enriched without technical intake", async () => {
    const skill = normalized(await source("../.agents/skills/blockbench-reference-generator/SKILL.md"));
    expect(skill).toContain("simple user contract");
    expect(skill).toContain("upload a usable source image");
    expect(skill).toContain("extra facts are optional");
    expect(skill).toContain("do not expose a long questionnaire");
    expect(skill).toContain("automatic internal generation brief");
    expect(skill).toContain("generate directly when the source is usable");
  });

  test("AI resolves unknowns before asking and keeps clarification bounded", async () => {
    const [skill, guide] = await Promise.all([
      source("../.agents/skills/blockbench-reference-generator/SKILL.md"),
      source("../docs/foundation/04-reference-guide.md"),
    ]);
    const lowerSkill = normalized(skill);
    const lowerGuide = normalized(guide);

    for (const text of [lowerSkill, lowerGuide]) {
      expect(text).toContain("ai-assisted intake resolution");
      expect(text).toContain("zero clarification");
      expect(text).toContain("do not repeat");
      expect(text).toContain("one compact round");
      expect(text).toContain("use your recommendation");
      expect(text).toContain("working interpretation");
      expect(text).toContain("not a user-provided fact");
    }

    expect(lowerSkill).toContain("leave optional unknowns unset");
    expect(lowerSkill).toContain("at most **three material items**");
    expect(lowerSkill).toContain("never infer numeric dimensions/scale from pixels");
    expect(lowerSkill).toContain("never invent hidden features, unseen asymmetry, unseen attachments");
    expect(lowerSkill).toContain("needs review");

    expect(lowerGuide).toContain("assistive, not form-filling");
    expect(lowerGuide).toContain("optional unknowns remain unset");
    expect(lowerGuide).toContain("at most three material items");
    expect(lowerGuide).toContain("explain unfamiliar concepts in plain language");
  });

  test("Blockbench grammar prevents voxel-stack and smooth-primitive shortcuts", async () => {
    const raw = await source("../.agents/skills/blockbench-reference-generator/SKILL.md");
    for (const primitive of [
      "CUBOID",
      "ROTATED_CUBOID",
      "STEPPED_CUBOIDS",
      "MULTI_CUBOID_MASS",
      "TEXTURE_ONLY",
    ]) expect(raw).toContain(primitive);

    const skill = normalized(raw);
    expect(skill).toContain("hard constraints");
    expect(skill).toContain("buildable cuboid construction");
    expect(skill).toContain("not world blocks/equal voxels");
    expect(skill).toContain("never lazy-voxelize");
    expect(skill).toContain("few large meaningful segments");
    expect(skill).toContain("never one smooth primitive or unit-cube staircase");
    expect(skill).toContain("not fake seam lines");
    expect(skill).not.toContain("geometry standard wins");
    expect(skill).not.toContain("golden sample");
  });

  test("source interpretation excludes photographic and hidden-detail hallucination", async () => {
    const skill = normalized(await source("../.agents/skills/blockbench-reference-generator/SKILL.md"));
    expect(skill).toContain("ignore hands, stands, scenery, shadows, supports");
    expect(skill).toContain("normalize perspective; lens distortion is not geometry");
    expect(skill).toContain("highlights/reflections/shadows/ao are not markings");
    expect(skill).toContain("do not mirror/invent side-specific");
    expect(skill).toContain("do not blend conflicting sources");
    expect(skill).toContain("never infer numeric scale from pixels");
  });

  test("all views stay one model at comparable presentation scale", async () => {
    const skill = normalized(await source("../.agents/skills/blockbench-reference-generator/SKILL.md"));
    expect(skill).toContain("single-model cross-view lock");
    expect(skill).toContain("all panels show that same model");
    expect(skill).toContain("do not redesign panels independently");
    expect(skill).toContain("same scale, center, and ground/baseline");
    expect(skill).toContain("true top-down orthographic same 3d model, not flat diagram");
    expect(skill).toContain("near-orthographic/weak perspective, no wide-angle");
  });

  test("default view board may change only when the actual object requires it", async () => {
    const [skill, guide] = await Promise.all([
      source("../.agents/skills/blockbench-reference-generator/SKILL.md"),
      source("../docs/foundation/04-reference-guide.md"),
    ]);
    const lowerSkill = normalized(skill);
    const lowerGuide = normalized(guide);

    expect(lowerSkill).toContain("default board");
    expect(lowerSkill).toContain("different view set only when the actual object's geometry/asymmetry requires it");
    expect(lowerSkill).toContain("do not add views for completeness");
    expect(lowerGuide).toContain("a different view set is allowed when the actual object requires it");
    expect(lowerGuide).toContain("do not add views for completeness");
  });

  test("presentation and visual gate reject image-generator artifacts", async () => {
    const skill = normalized(await source("../.agents/skills/blockbench-reference-generator/SKILL.md"));
    expect(skill).toContain("blockbench ui/gizmos/grid/wireframe/bounds");
    expect(skill).toContain("random speckle/dithering");
    expect(skill).toContain("only view labels may appear");
    expect(skill).toContain("actual generated board");
    expect(skill).toContain("not ready / needs review");
    expect(skill).toContain("do not average conflicting shapes");
    expect(skill).toContain("if not inspectable, do not claim the visual gate passed");
    expect(skill).toContain("do not produce numeric buildability/fidelity/view scores");
  });

  test("draft stops for user approval before modelling handoff", async () => {
    const [skill, guide] = await Promise.all([
      source("../.agents/skills/blockbench-reference-generator/SKILL.md"),
      source("../docs/foundation/04-reference-guide.md"),
    ]);
    const lowerSkill = normalized(skill);
    const lowerGuide = normalized(guide);

    expect(lowerSkill).toContain("modelling brief draft");
    expect(lowerSkill).toContain("stop for user review / approval");
    expect(lowerSkill).toContain("only after user approval");
    expect(lowerSkill).toContain("actual approved image");
    expect(lowerGuide).toContain("user has approved the image for modelling");
  });

  test("hardening remains image-only and bounded", async () => {
    const skill = normalized(await source("../.agents/skills/blockbench-reference-generator/SKILL.md"));
    expect(skill).toContain("return **one image only**");
    expect(skill).toContain("automatic variants = 0");
    expect(skill).toContain("do not generate zips");
    expect(skill).not.toContain("place_cube");
    expect(skill).not.toContain("cube coordinates");
  });
});
