import { describe, expect, test } from "bun:test";

async function text(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("adaptive cuboid budget policy", () => {
  test("geometry standard preserves minimum sufficient geometry instead of a hard Cube cap", async () => {
    const standard = await text("../docs/03-authoring/modelling/standard.md");

    expect(standard).toContain("Adaptive Cuboid Budget");
    expect(standard).toContain("There is **no universal Cube-count cap**");
    expect(standard).toContain("Marginal Geometry Value");
    expect(standard).toContain("REDUNDANT_GEOMETRY");
    expect(standard).toContain("Representation Ladder");
    expect(standard).toContain("Segmented Curve Rule");
    expect(standard).toContain("Merge / Remove Challenge");
    expect(standard).toContain("minimum sufficient geometry");
  });

  test("dense segmentation must be evidence-backed and Texture remains a valid cheaper representation", async () => {
    const standard = await text("../docs/03-authoring/modelling/standard.md");

    expect(standard).toContain("TEXTURE / alpha detail");
    expect(standard).toContain("denser segmented approximation only after lower levels visibly fail");
    expect(standard).toContain("micro-segments whose removal is visually immaterial");
    expect(standard).toContain("unit-Cube staircasing used as generic smoothing");
    expect(standard).toContain("Before adding a dense cohort (`>= 4` new Cuboids for one local feature)");
  });

  test("anti-overcube policy does not prohibit complexity required by articulation or identity", async () => {
    const standard = await text("../docs/03-authoring/modelling/standard.md");

    expect(standard).toContain("Complexity budget is earned by visible or functional need");
    expect(standard).toContain("MOTION");
    expect(standard).toContain("TRANSFORM");
    expect(standard).toContain("reference-critical identity landmark");
    expect(standard).toMatch(/do not merge across a required joint/i);
  });
});
