import { describe, expect, test } from "bun:test";

async function read(path: string) {
  return (await Bun.file(path).text()).replaceAll("**", "").replace(/\s+/g, " ").toLowerCase();
}

describe("reference Minecraft-first coverage", () => {
  test("execution consent stays bounded", async () => {
    const [skill, flow, next] = await Promise.all([
      read("../.agents/skills/blockbench-reference-generator/SKILL.md"),
      read("../docs/knowledge/flow.md"),
      read("../docs/knowledge/next-action.md"),
    ]);
    expect(skill).toContain("zero clarification");
    expect(skill).toContain("generation is output, not discovery");
    expect(skill).toContain("readiness is not permission to generate");
    expect(skill).toContain("fresh explicit user instruction");
    expect(flow).toContain("execution consent gate");
    expect(next).toContain("wait for fresh explicit user generation command");
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
    for (const text of [skill, guide, texturing]) {
      expect(text).toContain("base palette");
      expect(text).toContain("identity-critical markings");
    }
  });

  test("minor drift uses one canonical interpretation; material conflict still blocks", async () => {
    const [guide, flow, modelling, texturing, workflow] = await Promise.all([
      read("../docs/foundation/04-reference-guide.md"),
      read("../docs/knowledge/flow.md"),
      read("../.agents/skills/blockbench-bedrock-modelling/SKILL.md"),
      read("../.agents/skills/blockit-bedrock-texturing/SKILL.md"),
      read("prompts/bedrock_entity_workflow.md"),
    ]);
    for (const text of [guide, flow, modelling, texturing, workflow]) {
      expect(text).toContain("minor");
      expect(text).toContain("material");
      expect(text).toContain("canonical");
    }
    expect(guide).toContain("minor drift is not `blocked`");
    expect(modelling).toContain("minor reference discrepancy alone is not a blocker");
    expect(modelling).toContain("do not average drift");
    expect(texturing).toContain("do not average conflicting material evidence");
    expect(workflow).toContain("only unresolved material conflict");
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
