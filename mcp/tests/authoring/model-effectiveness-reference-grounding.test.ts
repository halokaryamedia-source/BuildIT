import { describe, expect, test } from "bun:test";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

function normalized(text: string): string {
  return text.replace(/\s+/g, " ").trim().toLowerCase();
}

describe("model creation effectiveness — actual reference grounding", () => {
  test("actual approved image is required; path, prose and memory cannot substitute", async () => {
    const [reference, modelling, workflow, validation] = await Promise.all([
      source("../docs/foundation/04-reference-guide.md"),
      source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md"),
      source("prompts/bedrock_entity_workflow.md"),
      source("../docs/foundation/07-visual-validation.md"),
    ]);
    for (const text of [reference, modelling, validation]) {
      const lower = normalized(text);
      expect(lower).toContain("actual approved reference image");
      expect(lower).toContain("path");
      expect(lower).toContain("memory");
    }
    expect(normalized(modelling)).toContain("active multimodal context");
    expect(normalized(modelling)).toContain("context, not visual evidence");
    expect(normalized(workflow)).toContain("actual approved image in active multimodal context");
    expect(normalized(workflow)).toContain("path/memory is not image evidence");
    expect(normalized(validation)).toContain("difference-first");
  });

  test("material semantic decisions retain explicit evidence states without mandatory evidence-map ceremony", async () => {
    const [reference, modelling] = await Promise.all([
      source("../docs/foundation/04-reference-guide.md"),
      source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md"),
    ]);
    for (const state of ["SUPPORTED", "PROVISIONAL", "CONFLICTING", "UNAVAILABLE"]) {
      expect(reference).toContain(state);
      expect(modelling).toContain(state);
    }
    expect(modelling).toContain("Use a View Pair Map only to resolve materially ambiguous");
    expect(modelling).toContain("do not turn analysis ceremony into the work");
    expect(normalized(modelling)).toContain("semantic label never authorizes coordinates");
  });

  test("view pairing is conditional on material ambiguity rather than a universal ritual", async () => {
    const [reference, modelling, validation] = await Promise.all([
      source("../docs/foundation/04-reference-guide.md"),
      source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md"),
      source("../docs/foundation/07-visual-validation.md"),
    ]);
    expect(reference).toContain("View Pair Map");
    expect(modelling).toContain("View Pair Map");
    expect(normalized(modelling)).toContain("only to resolve materially ambiguous front/back");
    expect(normalized(validation)).toContain("do not silently compare the closest-looking view");
  });

  test("visual PASS requires actual reference plus fresh current model evidence", async () => {
    const [modelling, validation, camera] = await Promise.all([
      source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md"),
      source("../docs/foundation/07-visual-validation.md"),
      source("server/tools/camera.ts"),
    ]);
    for (const text of [modelling, validation]) {
      const lower = normalized(text);
      expect(lower).toContain("actual approved reference image");
      expect(lower).toContain("fresh current-revision model");
      expect(text).toContain("FAIL");
      expect(text).toContain("UNVERIFIED");
      expect(text).toContain("PASS");
      expect(lower).toContain("difference-first");
      expect(lower).toContain("stale");
    }
    expect(camera).toContain("VIEW ${view}");
    expect(camera).toContain("this tool does not judge resemblance");
  });

  test("grounding does not add automatic similarity authority or runtime framework", async () => {
    const [modelling, validation, profile, cubes] = await Promise.all([
      source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md"),
      source("../docs/foundation/07-visual-validation.md"),
      source("lib/registrationProfile.ts"),
      source("server/tools/cubes.ts"),
    ]);
    expect(normalized(modelling)).toContain("similarity scores cannot justify `pass`");
    expect(normalized(validation)).toContain("none of these proves resemblance by itself");
    expect(profile).not.toContain("reference_grounding");
    expect(profile).not.toContain("vision_gate");
    expect(cubes).not.toContain("reference_score");
    expect(cubes).not.toContain("similarity_threshold");
  });
});
