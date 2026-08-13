import { describe, expect, test } from "bun:test";

async function read(path: string) {
  return (await Bun.file(path).text()).replaceAll("**", "").replace(/\s+/g, " ").toLowerCase();
}

describe("reference generator orthographic-core contract", () => {
  test("intake, readiness and execution consent stay bounded", async () => {
    const [skill, guide, flow, next] = await Promise.all([
      read("../.agents/skills/blockbench-reference-generator/SKILL.md"),
      read("../docs/foundation/04-reference-guide.md"),
      read("../docs/knowledge/flow.md"),
      read("../docs/knowledge/next-action.md"),
    ]);
    expect(skill).toContain("zero clarification");
    expect(skill).toContain("three material items");
    expect(skill).toContain("generation is output, not discovery");
    expect(skill).toContain("readiness is not permission to generate");
    expect(skill).toContain("fresh explicit user instruction");
    expect(flow).toContain("execution consent gate");
    expect(next).toContain("wait for fresh explicit user generation command");
    expect(guide).toContain("not execution consent");
  });

  test("generation uses a source-nearest anchor and smallest orthographic core", async () => {
    const [skill, guide, flow] = await Promise.all([
      read("../.agents/skills/blockbench-reference-generator/SKILL.md"),
      read("../docs/foundation/04-reference-guide.md"),
      read("../docs/knowledge/flow.md"),
    ]);

    expect(skill).toContain("source-nearest anchor");
    expect(skill).toContain("smallest orthographic core");
    expect(skill).toContain("not a fixed five-panel turnaround");

    expect(guide).toContain("source-nearest anchor");
    expect(guide).toMatch(/smallest orthographic core|smallest mutually compatible orthographic view set/);
    expect(guide).toContain("not a fixed five-panel turnaround");

    for (const text of [skill, guide]) {
      expect(text).toContain("omit that view");
      expect(text).toContain("invent");
    }

    expect(flow).toContain("source-nearest anchor orientation");
    expect(flow).toContain("smallest orthographic core");
  });

  test("TOP and BACK are conditional while 3/4 is not default structural authority", async () => {
    const [skill, guide, flow] = await Promise.all([
      read("../.agents/skills/blockbench-reference-generator/SKILL.md"),
      read("../docs/foundation/04-reference-guide.md"),
      read("../docs/knowledge/flow.md"),
    ]);
    for (const text of [skill, guide]) {
      expect(text).toContain("top only when");
      expect(text).toContain("back only when");
      expect(text).toContain("3/4 is not part of the default initial core");
      expect(text).toContain("diagnostic");
      expect(text).toContain("never structural authority");
    }
    expect(flow).toContain("top/back are conditional");
    expect(flow).toContain("3/4 is diagnostic");
  });

  test("pose and articulated-feature state remain relational across shown views", async () => {
    const [skill, guide] = await Promise.all([
      read("../.agents/skills/blockbench-reference-generator/SKILL.md"),
      read("../docs/foundation/04-reference-guide.md"),
    ]);
    for (const text of [skill, guide]) {
      expect(text).toContain("stable natural neutral stance");
      expect(text).toContain("bilateral alignment");
      expect(text).toContain("hidden joint precision");
      expect(text).toContain("identity-critical articulated");
      expect(text).toContain("direction/bend");
      expect(text).toContain("terminal");
      expect(text).toContain("duplicated");
      expect(text).toContain("floating");
    }
  });

  test("visual gate prioritizes anchor fidelity before cross-view coherence", async () => {
    const [skill, guide] = await Promise.all([
      read("../.agents/skills/blockbench-reference-generator/SKILL.md"),
      read("../docs/foundation/04-reference-guide.md"),
    ]);
    for (const text of [skill, guide]) {
      expect(text).toContain("anchor fidelity");
      expect(text).toContain("orthographic coherence");
      expect(text).toContain("articulation lock");
      expect(text).toContain("naturalness");
      expect(text).toContain("not ready / needs review");
    }
  });

  test("one correction remains board-level but may remove an unjustified view", async () => {
    const [skill, guide, flow] = await Promise.all([
      read("../.agents/skills/blockbench-reference-generator/SKILL.md"),
      read("../docs/foundation/04-reference-guide.md"),
      read("../docs/knowledge/flow.md"),
    ]);
    for (const text of [skill, guide]) {
      expect(text).toContain("board-level defect");
      expect(text).toContain("defect evidence");
      expect(text).toContain("not geometry authority");
      expect(text).toContain("whole shown");
      expect(text).toContain("remove an unnecessary problematic view");
    }
    expect(flow).toContain("regenerate whole shown core");
    expect(flow).toContain("remove unnecessary conflicting view");
  });

  test("presentation, construction and generation budget remain bounded", async () => {
    const [skill, guide] = await Promise.all([
      read("../.agents/skills/blockbench-reference-generator/SKILL.md"),
      read("../docs/foundation/04-reference-guide.md"),
    ]);
    expect(skill).toContain("simplest blockbench-buildable representation");
    expect(skill).toContain("never lazy-voxelize");
    for (const text of [skill, guide]) {
      expect(text).toContain("only panel/view labels may appear by default");
      expect(text).toContain("outside the image");
    }
    expect(skill).toContain("first draft = maximum 1");
    expect(skill).toContain("targeted correction = maximum 1");
    expect(skill).toContain("automatic variants = 0");
  });
});
