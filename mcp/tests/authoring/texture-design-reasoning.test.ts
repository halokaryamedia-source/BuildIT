import { describe, expect, test } from "bun:test";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("texture design reasoning", () => {
  test("foundation separates UV Layout, Texture Atlas, Texture Styling, and Texture Verify", async () => {
    const standard = await source("../docs/foundation/06-texture-standard.md");
    const modelling = await source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md");
    const texturing = await source("../.agents/skills/blockit-bedrock-texturing/SKILL.md");

    for (const term of [
      "UV LAYOUT",
      "TEXTURE ATLAS",
      "TEXTURE STYLING",
      "TEXTURE VERIFY",
      "material",
      "form",
      "contact",
      "edge",
      "identity",
    ]) expect(standard.toUpperCase()).toContain(term.toUpperCase());

    expect(standard).toContain("Texture Styling supports geometry; it does not repair geometry");
    expect(modelling).toContain("Use texture for surface information");
    expect(texturing).toContain("Texture Atlas");
    expect(texturing).toContain("Texture Styling");
  });

  test("texture workflow requires staged material and form reasoning rather than a flat color fill", async () => {
    const texturing = await source("../.agents/skills/blockit-bedrock-texturing/SKILL.md");

    for (const term of [
      "palette",
      "ramp",
      "material",
      "face",
      "form",
      "contact",
      "occlusion",
      "edge",
      "hue",
      "identity",
      "detail",
      "noise",
      "alpha",
    ]) expect(texturing.toLowerCase()).toContain(term);

    expect(texturing).toContain("BASE PASS");
    expect(texturing).toContain("VALUE / FORM PASS");
    expect(texturing).toContain("IDENTITY PASS");
    expect(texturing).toContain("SECONDARY DETAIL PASS");
    expect(texturing).toContain("VERIFY");
  });

  test("workflow prompt contains texture material and form stages", async () => {
    const [workflow, contract] = await Promise.all([
      source("prompts/bedrock_entity_workflow.md"),
      source("lib/promptContract.ts"),
    ]);

    expect(workflow).toContain("## Texture Styling");
    expect(workflow).toContain("BASE → FORM/MATERIAL → IDENTITY → DETAIL → VERIFY");
    expect(workflow).toContain("palette/material regions");
    expect(workflow).toContain("face/form shading");
    expect(workflow).toContain("contact/edge information");
    expect(workflow).toContain("identity-critical marks");
    expect(contract).toContain("texturing: AUTHORING_WORKFLOW_SECTIONS");
  });

  test("texture foundation keeps crisp pixel-art alpha intentional", async () => {
    const standard = await source("../docs/foundation/06-texture-standard.md");
    expect(standard).toContain("default authored alpha intent is **0 or 255**");
    expect(standard).toContain("Intermediate alpha is valid only when material behavior requires translucency/blending");
  });
});
