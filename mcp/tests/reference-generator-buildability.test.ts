import { describe, expect, test } from "bun:test";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

function plain(text: string): string {
  return text.replaceAll("**", "").replace(/\s+/g, " ").trim().toLowerCase();
}

describe("reference generator buildability contract", () => {
  test("intake stays simple, assisted, and bounded", async () => {
    const skill = plain(await source("../.agents/skills/blockbench-reference-generator/SKILL.md"));
    expect(skill).toContain("upload a usable source image");
    expect(skill).toContain("zero clarification");
    expect(skill).toContain("one compact round");
    expect(skill).toContain("three material items");
    expect(skill).toContain("leave optional unknowns unset");
    expect(skill).toContain("never infer numeric dimensions/scale from pixels");
    expect(skill).toContain("needs review");
  });

  test("generation cannot substitute for unresolved understanding", async () => {
    const [skill, guide, flow] = await Promise.all([
      source("../.agents/skills/blockbench-reference-generator/SKILL.md"),
      source("../docs/foundation/04-reference-guide.md"),
      source("../docs/knowledge/flow.md"),
    ]);
    for (const text of [plain(skill), plain(guide)]) {
      expect(text).toContain("generation is output, not discovery");
      expect(text).toContain("pre-generation readiness gate");
      expect(text).toContain("no unresolved material ambiguity");
      expect(text).toContain("concrete visual defect");
      expect(text).toContain("missing pre-generation understanding");
    }
    expect(plain(flow)).toContain("still material? needs review; do not generate");
  });

  test("construction guidance is buildable but not an exhaustive taxonomy or preset", async () => {
    const skill = plain(await source("../.agents/skills/blockbench-reference-generator/SKILL.md"));
    expect(skill).toContain("simplest blockbench-buildable representation");
    expect(skill).toContain("reasoning examples, not exhaustive categories, presets, or asset-class rules");
    expect(skill).toContain("plane_like_cube");
    expect(skill).toContain("layered_or_inflated_form");
    expect(skill).toContain("linked_segments");
    expect(skill).toContain("never lazy-voxelize");
    expect(skill).toContain("few large meaningful segments");
    expect(skill).toContain("never one smooth primitive or unit-cube staircase");
    expect(skill).not.toContain("every visible form resolves to");
    expect(skill).not.toContain("golden sample");
  });

  test("source interpretation does not hallucinate hidden form or articulation", async () => {
    const skill = plain(await source("../.agents/skills/blockbench-reference-generator/SKILL.md"));
    expect(skill).toContain("ignore hands, stands, scenery, shadows, supports");
    expect(skill).toContain("normalize perspective; lens distortion is not geometry");
    expect(skill).toContain("highlights/reflections/shadows/ao are not markings");
    expect(skill).toContain("do not mirror/invent side-specific");
    expect(skill).toContain("hidden joint precision");
    expect(skill).toContain("do not blend conflicting sources");
  });

  test("pose defaults to readability rather than universal standing", async () => {
    const [skill, guide] = await Promise.all([
      source("../.agents/skills/blockbench-reference-generator/SKILL.md"),
      source("../docs/foundation/04-reference-guide.md"),
    ]);
    for (const text of [plain(skill), plain(guide)]) {
      expect(text).toContain("most structurally readable stable pose");
      expect(text).toContain("grounded load-bearing subjects");
      expect(text).toContain("stable natural neutral stance");
      expect(text).toContain("does not automatically become the modelling pose");
      expect(text).toContain("requested/observable pose state");
      expect(text).toContain("do not invent hidden joint precision");
    }
  });

  test("limb integrity stays relational instead of becoming an anatomy preset", async () => {
    const [skill, guide] = await Promise.all([
      source("../.agents/skills/blockbench-reference-generator/SKILL.md"),
      source("../docs/foundation/04-reference-guide.md"),
    ]);
    for (const text of [plain(skill), plain(guide)]) {
      expect(text).toContain("plausible attachment");
      expect(text).toContain("near/far limbs");
      expect(text).toContain("coherent ground plane");
      expect(text).toContain("duplicated");
      expect(text).toContain("missing");
      expect(text).toContain("merged");
      expect(text).toContain("floating");
      expect(text).toContain("orthographic views own structural pose truth");
      expect(text).toContain("must not redesign");
    }
    expect(plain(guide)).toContain("not a quadruped/humanoid anatomy template");
  });

  test("view rules distinguish side/front/back baseline from top footprint", async () => {
    const skill = plain(await source("../.agents/skills/blockbench-reference-generator/SKILL.md"));
    expect(skill).toContain("side/front/back keep comparable scale, center, and one coherent ground baseline");
    expect(skill).toContain("true top-down orthographic same 3d model, not flat diagram");
    expect(skill).toContain("preserve footprint, center, proportions");
    expect(skill).toContain("rather than inventing a ground baseline");
    expect(skill).toContain("near-orthographic/weak perspective, no wide-angle");
    expect(skill).toContain("do not redesign panels independently");
  });

  test("nonvisual user constraints stay outside the image without a new package layer", async () => {
    const [skill, guide, flow, requirements] = await Promise.all([
      source("../.agents/skills/blockbench-reference-generator/SKILL.md"),
      source("../docs/foundation/04-reference-guide.md"),
      source("../docs/knowledge/flow.md"),
      source("../docs/foundation/02-product-requirements.md"),
    ]);
    for (const text of [plain(skill), plain(guide)]) {
      expect(text).toContain("outside the image");
      expect(text).toContain("only view labels may appear");
    }
    expect(plain(guide)).toContain("not a zip/manifest/package");
    expect(plain(flow)).toContain("nonvisual handoff constraints");
    expect(plain(requirements)).toContain("outside the image");
  });

  test("visual gate and output budget remain bounded", async () => {
    const skill = plain(await source("../.agents/skills/blockbench-reference-generator/SKILL.md"));
    expect(skill).toContain("actual generated board");
    expect(skill).toContain("not ready / needs review");
    expect(skill).toContain("do not average conflicting shapes");
    expect(skill).toContain("do not produce numeric buildability/fidelity/view scores");
    expect(skill).toContain("first draft = maximum 1");
    expect(skill).toContain("targeted correction = maximum 1");
    expect(skill).toContain("automatic variants = 0");
    expect(skill).toContain("one image only");
    expect(skill).toContain("user review / approval");
    expect(skill).toContain("actual approved image");
    expect(skill).toContain("do not generate zips");
  });
});
