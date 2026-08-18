import { describe, expect, test } from "bun:test";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("texture visual convergence contract", () => {
  test("active guidance requires fresh atlas and model-view evidence", async () => {
    const [skill, workflow, texture, camera] = await Promise.all([
      source("../.agents/skills/blockit-bedrock-texturing/SKILL.md"),
      source("prompts/bedrock_entity_workflow.md"),
      source("server/tools/texture.ts"),
      source("server/tools/camera.ts"),
    ]);

    for (const text of [skill, workflow]) {
      expect(text).toContain("Texture Difference Table");
      expect(text).toContain("get_texture");
      expect(text).toContain("capture_model_views");
      expect(text.toLowerCase()).toContain("stale");
      for (const verdict of ["FAIL", "UNVERIFIED", "PASS"]) expect(text).toContain(verdict);
    }

    const getTextureStart = texture.indexOf("createTool(textureToolDocs[4].name");
    const getTextureEnd = texture.indexOf("createTool(textureToolDocs[5].name", getTextureStart);
    const getTexture = texture.slice(getTextureStart, getTextureEnd);
    expect(getTexture).toContain("imageContent");
    expect(getTexture).toContain("getDataURL()");

    const captureStart = camera.indexOf("createTool(cameraToolDocs[3].name");
    const capture = camera.slice(captureStart);
    expect(capture).toContain("VIEW ${view}");
    expect(capture).toContain("content.push(image)");
    expect(capture).toContain("structuredContent");
  });

  test("local texture correction proves qualitative direction instead of mutation activity", async () => {
    const [skill, workflow, validation] = await Promise.all([
      source("../.agents/skills/blockit-bedrock-texturing/SKILL.md"),
      source("prompts/bedrock_entity_workflow.md"),
      source("../docs/foundation/07-visual-validation.md"),
    ]);

    for (const text of [skill, workflow]) {
      expect(text).toContain("smallest bounded correction");
      expect(text).toContain("retain pre-evidence");
      expect(text).toContain("IMPROVED | UNCHANGED | REGRESSED");
      expect(text).toContain("Same causal correction direction failing twice without new evidence");
      expect(text).toContain("BLOCKED");
    }

    expect(validation).toContain("IMPROVED | UNCHANGED | REGRESSED");
    expect(validation).toContain("same causal correction direction fails twice without new evidence");
    expect(validation).toContain("qualitative difference-first delta");
  });

  test("T5 stays on existing evidence and bounded-authoring surfaces", async () => {
    const [profile, skill, workflow] = await Promise.all([
      source("lib/registrationProfile.ts"),
      source("../.agents/skills/blockit-bedrock-texturing/SKILL.md"),
      source("prompts/bedrock_entity_workflow.md"),
    ]);

    expect(profile).toContain('export type McpRegistrationProfile = "bedrock_entity" | "extended";');
    for (const forbidden of ["texture_convergence_profile", "auto_texture_generator", "texture_quality_score"]) {
      expect(profile).not.toContain(forbidden);
      expect(workflow).not.toContain(forbidden);
    }
    expect(skill).toContain("T3 mutate");
    expect(workflow).toContain("T3 mutate");
  });
});
