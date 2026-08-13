import { describe, expect, test } from "bun:test";

async function read(path: string) {
  return (await Bun.file(path).text()).replaceAll("**", "").replace(/\s+/g, " ").toLowerCase();
}

describe("reference generator projection contract", () => {
  test("intake and readiness stay bounded", async () => {
    const skill = await read("../.agents/skills/blockbench-reference-generator/SKILL.md");
    expect(skill).toContain("usable source image");
    expect(skill).toContain("zero clarification");
    expect(skill).toContain("three material items");
    expect(skill).toContain("generation is output, not discovery");
    expect(skill).toContain("internal generation brief");
    expect(skill).toContain("needs review");
  });

  test("hardening and readiness never imply image execution consent", async () => {
    const [skill, guide, flow, next] = await Promise.all([
      read("../.agents/skills/blockbench-reference-generator/SKILL.md"),
      read("../docs/foundation/04-reference-guide.md"),
      read("../docs/knowledge/flow.md"),
      read("../docs/knowledge/next-action.md"),
    ]);
    for (const text of [skill, guide]) {
      expect(text).toContain("fresh explicit user instruction");
      expect(text).toContain("hardening");
      expect(text).toMatch(/does not authorize|never authorizes/);
    }
    expect(skill).toContain("readiness is not permission to generate");
    expect(flow).toContain("execution consent gate");
    expect(flow).toContain("stop; wait for user");
    expect(next).toContain("reference_execution_waiting_explicit_user_command");
    expect(next).toContain("wait — do not generate");
  });

  test("pose stays natural without forced symmetry", async () => {
    const [skill, guide] = await Promise.all([
      read("../.agents/skills/blockbench-reference-generator/SKILL.md"),
      read("../docs/foundation/04-reference-guide.md"),
    ]);
    for (const text of [skill, guide]) {
      expect(text).toContain("most structurally readable stable pose");
      expect(text).toContain("stable natural neutral stance");
      expect(text).toContain("bilateral alignment");
      expect(text).toContain("hidden joint precision");
    }
  });

  test("articulated features keep one state across views", async () => {
    const [skill, guide] = await Promise.all([
      read("../.agents/skills/blockbench-reference-generator/SKILL.md"),
      read("../docs/foundation/04-reference-guide.md"),
    ]);
    for (const text of [skill, guide]) {
      expect(text).toContain("identity-critical articulated");
      expect(text).toContain("direction/bend");
      expect(text).toContain("terminal");
      expect(text).toContain("duplicated");
      expect(text).toContain("floating");
    }
  });

  test("board is several projections of one locked structure", async () => {
    const [skill, guide, flow] = await Promise.all([
      read("../.agents/skills/blockbench-reference-generator/SKILL.md"),
      read("../docs/foundation/04-reference-guide.md"),
      read("../docs/knowledge/flow.md"),
    ]);
    expect(skill).toContain("do not design five images independently");
    expect(skill).toContain("five projections of one locked structural interpretation");
    expect(guide).toContain("one structural interpretation shown from several views");
    expect(flow).toContain("single-model projection lock");
  });

  test("TOP is a real projection rather than an independent panel", async () => {
    const [skill, guide] = await Promise.all([
      read("../.agents/skills/blockbench-reference-generator/SKILL.md"),
      read("../docs/foundation/04-reference-guide.md"),
    ]);
    for (const text of [skill, guide]) {
      expect(text).toContain("top-down projection");
      expect(text).toContain("same locked structure");
      expect(text).toContain("appendage roots");
      expect(text).toContain("limb locations");
      expect(text).toContain("negative spaces");
    }
    expect(guide).toContain("top mismatch");
  });

  test("visual review catches projection, articulation and robotic stance", async () => {
    const [skill, guide] = await Promise.all([
      read("../.agents/skills/blockbench-reference-generator/SKILL.md"),
      read("../docs/foundation/04-reference-guide.md"),
    ]);
    for (const text of [skill, guide]) {
      expect(text).toContain("projection coherence");
      expect(text).toContain("articulation lock");
      expect(text).toContain("naturalness");
      expect(text).toContain("forced robotic symmetry");
      expect(text).toContain("not ready / needs review");
    }
  });

  test("one correction is board-level and source-anchored", async () => {
    const [skill, guide, flow] = await Promise.all([
      read("../.agents/skills/blockbench-reference-generator/SKILL.md"),
      read("../docs/foundation/04-reference-guide.md"),
      read("../docs/knowledge/flow.md"),
    ]);
    for (const text of [skill, guide]) {
      expect(text).toContain("board-level defect");
      expect(text).toContain("source image");
      expect(text).toContain("internal generation brief");
      expect(text).toContain("defect evidence");
      expect(text).toContain("not geometry authority");
      expect(text).toContain("whole board");
      expect(text).toContain("relationships that already passed");
    }
    expect(flow).toContain("board-level targeted correction");
    expect(flow).toContain("regenerate the whole board");
  });

  test("presentation remains clean and user facts stay outside image pixels", async () => {
    const [skill, guide] = await Promise.all([
      read("../.agents/skills/blockbench-reference-generator/SKILL.md"),
      read("../docs/foundation/04-reference-guide.md"),
    ]);
    for (const text of [skill, guide]) {
      expect(text).toContain("only panel/view labels may appear by default");
      expect(text).toMatch(/no (?:board )?title/);
      expect(text).toContain("header");
      expect(text).toContain("subtitle");
      expect(text).toContain("outside the image");
    }
  });

  test("construction, handoff and generation budget remain bounded", async () => {
    const [skill, guide] = await Promise.all([
      read("../.agents/skills/blockbench-reference-generator/SKILL.md"),
      read("../docs/foundation/04-reference-guide.md"),
    ]);
    expect(skill).toContain("simplest blockbench-buildable representation");
    expect(skill).toContain("never lazy-voxelize");
    expect(skill).toContain("first draft = maximum 1");
    expect(skill).toContain("targeted correction = maximum 1");
    expect(skill).toContain("automatic variants = 0");
    expect(skill).toContain("one image only");
    expect(guide).toContain("generation budget");
  });
});
