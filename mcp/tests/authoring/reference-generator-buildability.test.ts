import { describe, expect, test } from "bun:test";

async function read(path: string) {
  return (await Bun.file(path).text()).replaceAll("**", "").replace(/\s+/g, " ").toLowerCase();
}

describe("reference Minecraft-first coverage", () => {
  test("execution consent stays bounded at the ChatGPT reference owner", async () => {
    const [skill, flow] = await Promise.all([
      read("../.agents/skills/blockbench-reference-generator/SKILL.md"),
      read("../docs/knowledge/flow.md"),
    ]);
    expect(skill).toContain("zero clarification");
    expect(skill).toContain("generation is output, not discovery");
    expect(skill).toContain("readiness is not permission to generate");
    expect(skill).toContain("fresh explicit user instruction");
    expect(flow).toContain("chatgpt generates one fixed five-preview board");
    expect(flow).toContain("user approves");
  });

  test("original source image is accepted for DIRECT while 3D_ASSISTED keeps deterministic board input", async () => {
    const [agents, skill, guide, product, flow, panel, templates] = await Promise.all([
      read("../AGENTS.md"),
      read("../.agents/skills/blockbench-reference-generator/SKILL.md"),
      read("../docs/foundation/04-reference-guide.md"),
      read("../docs/foundation/02-product-requirements.md"),
      read("../docs/knowledge/flow.md"),
      read("ui/panel.html"),
      read("ui/userGuide.ts"),
    ]);

    expect(agents).toContain("actual source image");
    for (const text of [guide, product, flow]) {
      expect(text).toContain("original source image");
    }
    for (const text of [agents, guide, product, flow]) {
      expect(text).toContain("direct");
      expect(text).toContain("3d_assisted");
    }
    expect(agents).toContain("do not force board generation");
    expect(guide).toContain("accept the user's actual image first");
    expect(product).toContain("do not require board generation");
    expect(flow).toContain("do not force board generation for direct");
    expect(skill).toContain("canonical board is optional for `direct`");
    expect(panel).toContain("use the original image directly");
    expect(panel).toContain("create a reference board");
    expect(panel).toContain("required for 3d_assisted");
    expect(templates).toContain("reference_board");
  });

  test("multiple source images are first-class evidence without adding mandatory intake", async () => {
    const [skill, guide, templates] = await Promise.all([
      read("../.agents/skills/blockbench-reference-generator/SKILL.md"),
      read("../docs/foundation/04-reference-guide.md"),
      read("ui/userGuide.ts"),
    ]);

    expect(skill).toContain("one or more source images are enough");
    expect(skill).toContain("use each only for evidence it visibly supports");
    expect(skill).toContain("do not average conflicting views into invented structure");
    expect(guide).toContain("multiple source images");
    expect(guide).toContain("consume that evidence before asking for another image");
    expect(templates).toContain("source image(s)");
    expect(templates).toContain("use every useful image as evidence");
  });

  test("default generated board has five fixed broad preview positions", async () => {
    const [skill, guide, flow] = await Promise.all([
      read("../.agents/skills/blockbench-reference-generator/SKILL.md"),
      read("../docs/foundation/04-reference-guide.md"),
      read("../docs/knowledge/flow.md"),
    ]);
    for (const text of [skill, guide, flow]) {
      expect(text).toContain("left | front | back");
      expect(text).toContain("top | front-left 3/4");
    }
    expect(skill).toContain("five-preview");
    expect(flow).toContain("five-preview");
    expect(skill).toContain("source-nearest orthographic anchor");
    expect(guide).toContain("not five exact engineering drawings");
  });

  test("goal is recognizable Blockbench geometry plus Minecraft-readable texture", async () => {
    const [skill, guide, texturing] = await Promise.all([
      read("../.agents/skills/blockbench-reference-generator/SKILL.md"),
      read("../docs/foundation/04-reference-guide.md"),
      read("../.agents/skills/blockit-bedrock-texturing/SKILL.md"),
    ]);
    for (const text of [skill, guide]) {
      expect(text).toContain("minecraft-first");
      expect(text).toContain("geometry");
      expect(text).toContain("texture");
    }
    expect(skill).toContain("simplest blockbench-buildable representation");
    expect(skill).toContain("never lazy-voxelize");
    expect(guide).toContain("does not need to be 100% identical");
    expect(texturing).toContain("palette roles");
    expect(texturing).toMatch(/identity pass/i);
  });

  test("minor drift uses one consistent interpretation; material conflict still blocks", async () => {
    const [guide, flow, modelling, texturing] = await Promise.all([
      read("../docs/foundation/04-reference-guide.md"),
      read("../docs/knowledge/flow.md"),
      read("../.agents/skills/blockbench-bedrock-modelling/SKILL.md"),
      read("../.agents/skills/blockit-bedrock-texturing/SKILL.md"),
    ]);
    for (const text of [guide, flow, modelling]) {
      expect(text).toContain("minor");
      expect(text).toContain("material");
    }
    expect(modelling).toContain("do not average drift");
    expect(modelling).toContain("simplest recognizable blockbench-buildable interpretation");
    expect(texturing).toContain("improved | unchanged | regressed");
    expect(texturing).toContain("blocked");
  });

  test("correction uses the smallest coherent edit and reserves full regeneration for global failure", async () => {
    const [skill, guide] = await Promise.all([
      read("../.agents/skills/blockbench-reference-generator/SKILL.md"),
      read("../docs/foundation/04-reference-guide.md"),
    ]);

    for (const text of [skill, guide]) {
      expect(text).toContain("delta-first");
      expect(text).toContain("smallest coherent");
      expect(text).toContain("structural defect affecting multiple views");
      expect(text).toContain("global identity / pose / layout / cross-view coherence failure");
      expect(text).toContain("regenerate the full board");
    }
    expect(skill).toContain("do not repeat the full generation specification");
    expect(guide).toContain("full-board regeneration is a fallback");
  });

  test("pose, presentation and automatic budget stay bounded while user-directed corrections remain possible", async () => {
    const [skill, guide] = await Promise.all([
      read("../.agents/skills/blockbench-reference-generator/SKILL.md"),
      read("../docs/foundation/04-reference-guide.md"),
    ]);
    expect(skill).toContain("stable natural neutral stance");
    expect(skill).toContain("bilateral alignment");
    expect(skill).toContain("direction/bend");
    expect(skill).toContain("no panel borders, grid lines, dividers, labels");
    expect(guide).toContain("outside the image");
    expect(skill).toContain("first draft = maximum 1");
    expect(skill).toContain("targeted correction = maximum 1");
    expect(skill).toContain("automatic variants = 0");
    expect(skill).toContain("fresh explicit user-directed correction");
    expect(skill).toContain("new user-led review cycle");
    expect(guide).toContain("user-directed correction");
    expect(guide).toContain("new user-led review cycle");
    expect(skill).toContain("return one image only");
  });
});
