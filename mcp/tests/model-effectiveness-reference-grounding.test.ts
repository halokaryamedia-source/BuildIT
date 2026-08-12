import { describe, expect, test } from "bun:test";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

function normalized(text: string): string {
  return text.replace(/\s+/g, " ").trim().toLowerCase();
}

describe("model creation effectiveness — actual reference grounding", () => {
  test("historical false-review failures are explicit design evidence", async () => {
    const audit = await source("../docs/knowledge/reviews/mcp-geometry-ai-slop-audit.md");
    for (const id of ["G-06", "G-17", "G-21", "G-22", "G-23"]) expect(audit).toContain(id);
    const lower = normalized(audit);
    expect(lower).toContain("visual gate validated the shape of the written review");
    expect(lower).toContain("explicit paired comparison layout");
    expect(lower).toContain("free-form prose");
    expect(lower).toContain("actual semantic items inspected");
  });

  test("actual approved image is required; path, prose and memory cannot substitute", async () => {
    const [reference, modelling, workflow, validation] = await Promise.all([
      source("../docs/foundation/04-reference-guide.md"),
      source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md"),
      source("prompts/bedrock_entity_workflow.md"),
      source("../docs/foundation/07-visual-validation.md"),
    ]);

    for (const text of [reference, modelling, workflow, validation]) {
      const lower = normalized(text);
      expect(lower).toContain("actual approved reference image");
      expect(lower).toContain("path");
      expect(lower).toContain("memory");
      expect(lower).toContain("blocked");
    }
    expect(normalized(reference)).toContain("multimodal input");
    expect(normalized(reference)).toContain("path itself is not visual evidence");
    expect(normalized(modelling)).toContain("active multimodal context");
    expect(normalized(modelling)).toContain("context, not visual evidence");
    expect(normalized(workflow)).toContain("active multimodal context");
    expect(normalized(workflow)).toContain("is not image evidence");
    expect(normalized(validation)).toContain("is not a substitute for those images");
  });

  test("material semantic decisions trace to image-grounded claim ids", async () => {
    const [reference, modelling, workflow] = await Promise.all([
      source("../docs/foundation/04-reference-guide.md"),
      source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md"),
      source("prompts/bedrock_entity_workflow.md"),
    ]);

    for (const text of [reference, modelling, workflow]) {
      expect(text).toContain("Reference Evidence Map");
      expect(text).toContain("claim_id");
      expect(text).toContain("supporting reference view(s)");
      for (const state of ["SUPPORTED", "PROVISIONAL", "CONFLICTING", "UNAVAILABLE"]) expect(text).toContain(state);
    }
    expect(modelling).toContain("Semantic Form Contract before choosing `from/to/origin/rotation`");
    expect(normalized(modelling)).toContain("semantic label never authorizes coordinates");
    expect(normalized(reference)).toContain("claim text describes what is visible");
  });

  test("view pairing is explicit before a reference can approve a model view", async () => {
    const [reference, modelling, workflow, validation] = await Promise.all([
      source("../docs/foundation/04-reference-guide.md"),
      source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md"),
      source("prompts/bedrock_entity_workflow.md"),
      source("../docs/foundation/07-visual-validation.md"),
    ]);

    for (const text of [reference, modelling, workflow, validation]) {
      const lower = normalized(text);
      expect(text).toContain("View Pair Map");
      expect(lower).toMatch(/ambiguous[^.]{0,160}front\/back|front\/back[^.]{0,160}ambiguous/);
      expect(lower).toContain("unverified");
    }
    expect(validation).toContain("REFERENCE FRONT ↔ MODEL front");
    expect(normalized(validation)).toContain("do not silently compare the closest-looking view");
  });

  test("visual PASS is claim-locked to actual reference plus fresh current model evidence", async () => {
    const [modelling, workflow, validation, camera] = await Promise.all([
      source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md"),
      source("prompts/bedrock_entity_workflow.md"),
      source("../docs/foundation/07-visual-validation.md"),
      source("server/tools/camera.ts"),
    ]);

    for (const text of [modelling, workflow, validation]) {
      const lower = normalized(text);
      expect(lower).toContain("actual approved reference image");
      expect(lower).toContain("fresh current-revision model");
      expect(text).toContain("claim_id");
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

    expect(normalized(modelling)).toContain("similarity/iou/projection scores");
    expect(normalized(modelling)).toContain("cannot justify pass");
    expect(normalized(validation)).toContain("numeric similarity/iou/projection scores");
    expect(normalized(validation)).toContain("none of these proves resemblance by itself");
    expect(profile).not.toContain("reference_grounding");
    expect(profile).not.toContain("vision_gate");
    expect(cubes).not.toContain("reference_score");
    expect(cubes).not.toContain("similarity_threshold");
    expect(cubes).not.toContain("claim_id");
  });
});
