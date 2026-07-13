import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const read = (path: string) => readFileSync(path, "utf8");

describe("Reference Studio canonical handoff", () => {
  test("uses the current one-visual review submission tools", () => {
    const skill = read("../engines/chatgpt/skills/blockbench-reference-studio/SKILL.md");
    const handoff = read(
      "../engines/chatgpt/skills/blockbench-reference-studio/templates/CODEX_REFERENCE_HANDOFF.template.md"
    );
    for (const source of [skill, handoff]) {
      expect(source).toContain("inspect_reference_visual_preview");
      expect(source).toContain("record_geometry_visual_decision");
      expect(source).toContain("submit_geometry_for_review");
      expect(source).not.toContain("record_geometry_visual_result");
      expect(source).not.toContain("GEOMETRY_LOCAL_REPAIR");
      expect(source).not.toContain("GEOMETRY_VISUAL_REBUILD");
    }
    expect(handoff).not.toContain("01_<asset_id>");
    expect(handoff).not.toContain("Sheet 01");
  });
});
