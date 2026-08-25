import { describe, expect, test } from "bun:test";

async function read(path: string) {
  return (await Bun.file(path).text()).replaceAll("**", "").replace(/\s+/g, " ").toLowerCase();
}

describe("reference Minecraft-first coverage", () => {
  test("execution consent stays bounded in the reference owners", async () => {
    const [skill, flow] = await Promise.all([
      read("../.agents/skills/blockbench-reference-generator/SKILL.md"),
      read("../docs/knowledge/flow.md"),
    ]);
    expect(skill).toContain("zero clarification");
    expect(skill).toContain("generation is output, not discovery");
    expect(skill).toContain("readiness is not permission to generate");
    expect(skill).toContain("fresh explicit user instruction");
    expect(flow).toContain("execution consent gate");
    expect(flow).toContain("fresh instruction");
  });

  test("default board has five broad preview positions", async () => {
    const [skill, guide, flow] = await Promise.all([
      read("../.agents/skills/blockbench-reference-generator/SKILL.md"),
      read("../docs/foundation/04-reference-guide.md"),
      read("../docs/knowledge/flow.md"),
    ]);
    for (const text of [skill, guide, flow]) {
      expect(text).toContain("five-preview");
      expect(text).toContain("side | front | back");
      expect(text).toContain("top / footprint | front-side 3/4");
    }
    expect(skill).toContain("source-nearest orthographic anchor");
    expect(guide).toContain("not five exact technical drawings");
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
    expect(texturing).toContain("identity marks");
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

  test("pose, presentation and budget stay bounded", async () => {
    const [skill, guide] = await Promise.all([
      read("../.agents/skills/blockbench-reference-generator/SKILL.md"),
      read("../docs/foundation/04-reference-guide.md"),
    ]);
    expect(skill).toContain("stable natural neutral stance");
    expect(skill).toContain("bilateral alignment");
    expect(skill).toContain("direction/bend");
    expect(skill).toContain("only panel/view labels may appear by default");
    expect(guide).toContain("outside the image");
    expect(skill).toContain("first draft = maximum 1");
    expect(skill).toContain("targeted correction = maximum 1");
    expect(skill).toContain("automatic variants = 0");
    expect(skill).toContain("return one image only");
  });
});
