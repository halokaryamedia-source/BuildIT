import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const read = (path: string) => readFileSync(path, "utf8");
const json = (path: string) => JSON.parse(read(path)) as Record<string, any>;

describe("single-Reference-Visual authority", () => {
  test("repository and bootstrap reject legacy four-sheet workflow context", () => {
    for (const path of ["../AGENTS.md", "../engines/codex/BOOTSTRAP.md"]) {
      const source = read(path);
      expect(source).toContain("LEGACY_SKILL_CONFLICT");
      expect(source).toContain("four");
      expect(source).toContain("three approval");
    }
  });

  test("reference template requires diagnostic, rotation, and strict validation tools", () => {
    const manifest = json(
      "../engines/chatgpt/skills/blockbench-reference-studio/templates/reference_manifest.template.json"
    );
    expect(manifest.schema_version).toBe("3.3");
    expect(manifest.workflow.normal_image_generations).toBe(1);
    expect(manifest.workflow.post_visual_image_generations).toBe(0);
    expect(manifest.visual_grounding.diagnosis_tool).toBe(
      "analyze_geometry_views"
    );
    expect(manifest.visual_grounding.safe_rotation_tool).toBe(
      "rotate_cube_about_attachment"
    );
    expect(manifest.visual_grounding.structural_validation_tool).toBe(
      "validate_geometry_contract"
    );
    expect(manifest.visual_grounding.gate_tool).toBe(
      "verify_geometry_review_ready"
    );
    expect(manifest.visual_grounding.free_rescale_forbidden).toBe(true);
    for (const panel of Object.values<Record<string, any>>(
      manifest.visual_grounding.panels
    )) {
      expect(panel.crop_normalized[2]).not.toBe(0);
      expect(panel.crop_normalized[3]).not.toBe(0);
    }
  });

  test("canonical skills use final Geometry diagnosis flow and adapters match", () => {
    for (const skill of ["blockbench-production", "blockbench-geometry"]) {
      const canonical = read(`../engines/shared/skills/${skill}/SKILL.md`);
      const agent = read(`../.agents/skills/${skill}/SKILL.md`);
      const codex = read(`../.codex/skills/${skill}/SKILL.md`);
      expect(agent).toBe(canonical);
      expect(codex).toBe(canonical);
      expect(canonical).toContain("analyze_geometry_views");
      expect(canonical).toContain("rotate_cube_about_attachment");
      expect(canonical).toContain("validate_geometry_contract");
    }
  });
});
