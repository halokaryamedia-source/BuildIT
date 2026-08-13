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
    expect(guide).toMatch(/not execution consent|do not authorize generation/);
  });

  test("anchor is orthographic while original source keeps camera-angle authority", async () => {
    const [skill, guide, flow] = await Promise.all([
      read("../.agents/skills/blockbench-reference-generator/SKILL.md"),
      read("../docs/foundation/04-reference-guide.md"),
      read("../docs/knowledge/flow.md"),
    ]);
    for (const text of [skill, guide, flow]) expect(text).toContain("source-nearest orthographic anchor");
    for (const text of [skill, guide]) {
      expect(text).toContain("source image remains");
      expect(text).toContain("3/4");
      expect(text).toMatch(/normalizes (?:camera )?projection|normalize[s]? perspective/);
    }
  });

  test("orthographic core is minimal but cannot become materially underconstrained", async () => {
    const [skill, guide, flow] = await Promise.all([
      read("../.agents/skills/blockbench-reference-generator/SKILL.md"),
      read("../docs/foundation/04-reference-guide.md"),
      read("../docs/knowledge/flow.md"),
    ]);
    expect(skill).toContain("smallest orthographic core");
    expect(skill).toContain("not a fixed five-panel turnaround");
    expect(guide).toMatch(/smallest orthographic core|smallest mutually compatible orthographic view set/);
    for (const text of [skill, guide, flow]) {
      expect(text).toContain("sufficiently constrained");
      expect(text).toContain("needs review");
    }
  });

  test("pose normalization preserves identity rather than source gait silhouette", async () => {
    const [skill, guide, flow] = await Promise.all([
      read("../.agents/skills/blockbench-reference-generator/SKILL.md"),
      read("../docs/foundation/04-reference-guide.md"),
      read("../docs/knowledge/flow.md"),
    ]);
    for (const text of [skill, guide, flow]) {
      expect(text).toContain("identity-bearing silhouette");
      expect(text).toContain("gait");
    }
    for (const text of [skill, guide]) {
      expect(text).toContain("stable natural neutral stance");
      expect(text).toContain("bilateral alignment");
      expect(text).toContain("hidden joint precision");
    }
  });

  test("generated 3/4 is diagnostic without demoting a 3/4 source image", async () => {
    const [skill, guide, flow] = await Promise.all([
      read("../.agents/skills/blockbench-reference-generator/SKILL.md"),
      read("../docs/foundation/04-reference-guide.md"),
      read("../docs/knowledge/flow.md"),
    ]);
    for (const text of [skill, guide]) {
      expect(text).toContain("3/4 is not part of the default initial core");
      expect(text).toContain("generated");
      expect(text).toContain("diagnostic");
      expect(text).toContain("never structural authority");
      expect(text).toContain("source image");
    }
    expect(flow).toContain("original source image photographed from 3/4 remains visual authority");
  });

  test("articulated feature state and visual gate remain relational", async () => {
    const [skill, guide] = await Promise.all([
      read("../.agents/skills/blockbench-reference-generator/SKILL.md"),
      read("../docs/foundation/04-reference-guide.md"),
    ]);
    for (const text of [skill, guide]) {
      expect(text).toContain("identity-critical articulated");
      expect(text).toContain("direction/bend");
      expect(text).toContain("terminal");
      expect(text).toContain("anchor fidelity");
      expect(text).toContain("orthographic coherence");
      expect(text).toContain("articulation lock");
      expect(text).toContain("naturalness");
      expect(text).toContain("not ready / needs review");
    }
  });

  test("one correction stays board-level and cannot hide missing required evidence", async () => {
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
  });

  test("generation budget is per unchanged brief cycle and never auto-retries", async () => {
    const [skill, guide, flow] = await Promise.all([
      read("../.agents/skills/blockbench-reference-generator/SKILL.md"),
      read("../docs/foundation/04-reference-guide.md"),
      read("../docs/knowledge/flow.md"),
    ]);
    for (const text of [skill, guide, flow]) {
      expect(text).toContain("unchanged internal generation brief / review cycle");
      expect(text).toMatch(/new cycle|starts a new cycle|begins a new review cycle/);
      expect(text).toMatch(/never start one automatically|must not open a new cycle automatically|do not start a new cycle automatically/);
    }
    expect(skill).toContain("first draft = maximum 1");
    expect(skill).toContain("targeted correction = maximum 1");
    expect(skill).toContain("automatic variants = 0");
  });

  test("presentation and construction remain bounded", async () => {
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
  });
});
