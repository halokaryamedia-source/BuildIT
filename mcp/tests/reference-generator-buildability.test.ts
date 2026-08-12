import { describe, expect, test } from "bun:test";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

function normalized(text: string): string {
  return text.replace(/\s+/g, " ").trim().toLowerCase();
}

describe("reference generator buildability contract", () => {
  test("reference generation uses an explicit Blockbench construction grammar", async () => {
    const skill = await source("../.agents/skills/blockbench-reference-generator/SKILL.md");
    for (const primitive of [
      "CUBOID",
      "ROTATED_CUBOID",
      "STEPPED_CUBOIDS",
      "MULTI_CUBOID_MASS",
      "TEXTURE_ONLY",
    ]) expect(skill).toContain(primitive);

    const lower = normalized(skill);
    for (const unsupported of ["cone", "wedge", "sphere", "smooth bevel"]) {
      expect(lower).toContain(unsupported);
    }
    expect(lower).toContain("geometry standard wins");
    expect(lower).toContain("simplify it while preserving identity");
  });

  test("all generated views are locked to one conceptual model", async () => {
    const skill = normalized(
      await source("../.agents/skills/blockbench-reference-generator/SKILL.md")
    );
    expect(skill).toContain("single-model cross-view lock");
    expect(skill).toContain("all panels show that same model");
    expect(skill).toContain("do not redesign panels independently");
    expect(skill).toContain("major segmentation");
    expect(skill).toContain("important negative spaces");
  });

  test("buildability gate fails closed instead of using visual plausibility or scores", async () => {
    const skill = normalized(
      await source("../.agents/skills/blockbench-reference-generator/SKILL.md")
    );
    expect(skill).toContain("buildability visual gate");
    expect(skill).toContain("visibly segmented, not smooth solids");
    expect(skill).toContain("rotated parts are simple, purposeful, visibly attached");
    expect(skill).toContain("unsupported primitive");
    expect(skill).toContain("not ready");
    expect(skill).toContain("do not produce numeric buildability/fidelity/view scores");
  });

  test("hardening remains image-only and does not become a geometry planner", async () => {
    const skill = normalized(
      await source("../.agents/skills/blockbench-reference-generator/SKILL.md")
    );
    expect(skill).toContain("return **one image only**");
    expect(skill).toContain("automatic variants = 0");
    expect(skill).toContain("do not generate zips");
    expect(skill).not.toContain("place_cube");
    expect(skill).not.toContain("[x,y,z]");
    expect(skill).not.toContain("cube coordinates");
  });
});
