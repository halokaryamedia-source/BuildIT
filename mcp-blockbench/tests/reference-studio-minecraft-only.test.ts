import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const read = (path: string) => readFileSync(path, "utf8");

const studioRoot = "../engines/chatgpt/skills/blockbench-reference-studio";

describe("Minecraft-only Reference Studio", () => {
  test("has no visual-style branch and always applies the cuboid construction lock", () => {
    const skill = read(`${studioRoot}/SKILL.md`);
    const flow = read(`${studioRoot}/references/FLOW.md`);
    const proposal = read("../openspec/changes/codex-local-workflow-rework/proposal.md");
    const ponytail = read(
      "../openspec/changes/codex-local-workflow-rework/PONYTAIL_EXECUTION.md"
    );

    for (const source of [skill, flow, proposal, ponytail]) {
      expect(source).toContain("Minecraft");
      expect(source).toContain("cuboid");
      expect(source).toContain("Golden Sample");
    }

    expect(skill).toContain("Do not ask the user to choose a visual style");
    expect(flow).toContain("There is no style-selection branch");
    expect(proposal).toContain("The user SHALL NOT be asked to select realistic versus Minecraft style");
    expect(ponytail).toContain("visual-style classification question: zero");
  });

  test("requires actual Blockbench construction rather than pixel texture or naive cube stacking", () => {
    const skill = read(`${studioRoot}/SKILL.md`);
    const qa = read(`${studioRoot}/references/QA_AND_REVISION_PROTOCOL.md`);
    const prompt = read(`${studioRoot}/templates/TURNAROUND_PROMPT.md`);
    const specifications = read(`${studioRoot}/references/SHEET_SPECIFICATIONS.md`);
    const combined = `${skill}\n${qa}\n${prompt}\n${specifications}`;

    for (const marker of [
      "actual Minecraft",
      "varied cuboid",
      "stepped",
      "limited purposeful one-axis rotations",
      "PIXEL_TEXTURE_ONLY",
      "UNPLANNED_CUBE_STACKING",
      "INSUFFICIENT_CUBOID_VARIATION",
      "MISSING_REQUIRED_ANGLED_FORM",
      "EXCESSIVE_ROTATION_NOISE",
      "NON_BLOCKBENCH_BUILDABLE_FORM",
      "GOLDEN_SAMPLE_CONSTRUCTION_DRIFT",
    ]) {
      expect(combined, marker).toContain(marker);
    }

    expect(prompt).toContain("Do **not** render the source subject directly in its realistic style");
    expect(prompt).toContain("Pixel texture alone is not Minecraft Geometry");
    expect(qa).toContain("Pixelated texture does not make a realistic render valid");
    expect(skill).toContain("`cuboid-first` does not mean uniform cube stacking");
  });

  test("locks the Golden Sample panel positions and facing directions", () => {
    const camera = read(`${studioRoot}/references/CAMERA_AND_RENDER_LOCK.md`);
    const prompt = read(`${studioRoot}/templates/TURNAROUND_PROMPT.md`);
    const flow = read(`${studioRoot}/references/FLOW.md`);

    for (const source of [camera, prompt]) {
      expect(source).toContain("UPPER: LEFT SIDE | FRONT | BACK");
      expect(source).toContain("LOWER: TOP / FOOTPRINT | FRONT-LEFT 3/4");
      expect(source).toContain("facing left");
      expect(source).toContain("head/front");
      expect(source).toContain("Front-left 3/4");
    }

    expect(camera).toContain("Top / Footprint is true top-down");
    expect(flow).toContain("Golden Sample panel layout, camera position, facing direction");
  });

  test("keeps a single bounded image path and never exposes a failed draft for approval", () => {
    const skill = read(`${studioRoot}/SKILL.md`);
    const flow = read(`${studioRoot}/references/FLOW.md`);
    const qa = read(`${studioRoot}/references/QA_AND_REVISION_PROTOCOL.md`);
    const ponytail = read(
      "../openspec/changes/codex-local-workflow-rework/PONYTAIL_EXECUTION.md"
    );

    expect(skill).toContain("Exactly one normal generated image");
    expect(skill).toContain("Maximum one targeted edit");
    expect(skill).toContain("Never show a failed draft to the user for approval");
    expect(flow).toContain("A failed draft is never shown to the user as approval-ready");
    expect(qa).toContain("Only a QA-passing visual may be labeled approval-ready");
    expect(ponytail).toContain("failed draft shown to user: zero");
    expect(ponytail).toContain("alternate-style generation: zero");
    expect(ponytail).toContain("optional polish iteration: zero");
  });

  test("records the observed giraffe failure as a P0 correction without changing downstream Geometry", () => {
    const proposal = read("../openspec/changes/codex-local-workflow-rework/proposal.md");
    const ponytail = read(
      "../openspec/changes/codex-local-workflow-rework/PONYTAIL_EXECUTION.md"
    );
    const tasks = read("../openspec/changes/codex-local-workflow-rework/tasks.md");

    expect(proposal).toContain("failed giraffe simulation");
    expect(proposal).toContain("reproducible upstream P0");
    expect(ponytail).toContain("preserving all existing Geometry, rotation, manifest, Codex, and MCP rules");
    expect(tasks).toContain("Minecraft-only Reference Studio P0 correction");
    expect(tasks).toContain("Preserve the existing Geometry, rotation-contract, manifest, Codex, and MCP implementation unchanged");
  });
});
