import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { mergeGeometryReferenceProfile } from "../src/lib/geometryReferenceProfiles";

const read = (path: string) => readFileSync(path, "utf8");
const json = (path: string) => JSON.parse(read(path)) as Record<string, any>;

const baseViews = [
  "front",
  "left_side",
  "back",
  "top_footprint",
  "front_left_3_4",
] as const;

describe("Reference Studio and Golden Sample synchronization", () => {
  test("defines a candidate-first ChatGPT workflow and canonical handoff", () => {
    const skill = read("../engines/chatgpt/skills/blockbench-reference-studio/SKILL.md");
    const handoff = read(
      "../engines/chatgpt/skills/blockbench-reference-studio/templates/CODEX_REFERENCE_HANDOFF.template.md"
    );
    for (const marker of [
      "reference_candidate",
      "golden_sample",
      "candidate_not_promoted",
      "Reference Studio contract `3.3`",
      "submit_geometry_for_review",
      "final required-view diagnosis",
      "same Codex and MCP session",
    ]) {
      expect(`${skill}\n${handoff}`, marker).toContain(marker);
    }
    expect(skill).not.toContain("record_geometry_visual_result");
    expect(handoff).not.toContain("GEOMETRY_LOCAL_REPAIR");
    expect(handoff).not.toContain("stage-transition reconnect");
  });

  test("keeps the generic manifest template on the executable 3.3 contract", () => {
    const manifest = json(
      "../engines/chatgpt/skills/blockbench-reference-studio/templates/reference_manifest.template.json"
    );
    expect(manifest.schema_version).toBe("3.3");
    expect(manifest.sample_type).toBe("<reference_candidate_or_golden_sample>");
    expect(manifest.contract).toMatchObject({
      reference_studio: "3.3",
      mcp_blockbench_minimum: "1.7.0",
      workflow: "single_reference_visual_one_session",
    });
    expect(manifest.geometry.symmetry_policy).toBe("<BILATERAL_or_ASYMMETRIC>");
    expect(manifest.reference_visual_lock.conditional_required_panels.ASYMMETRIC).toEqual([
      "right_side",
    ]);
    expect(manifest.visual_grounding.review_submission_tool).toBe(
      "submit_geometry_for_review"
    );
    expect(manifest.validation.base_required_views).toEqual(baseViews);
    expect(manifest.validation.conditional_required_views.ASYMMETRIC).toEqual([
      "right_side",
    ]);
    expect(manifest.texturing.quality_contract).toMatchObject({
      anti_aliasing_allowed: false,
      maximum_partial_alpha_ratio: 0,
    });
  });

  test("promotes the Black Rhinoceros package to a complete manifest-backed Golden Sample", () => {
    const manifest = json(
      "../docs/reference/golden-samples/black_rhinoceros/reference_manifest.json"
    );
    expect(manifest.schema_version).toBe("3.3");
    expect(manifest.sample_type).toBe("golden_sample");
    expect(manifest.workflow.promotion_status).toBe("promoted_golden_sample");
    expect(manifest.golden_sample).toMatchObject({
      promotion_status: "PROMOTED",
      prebuilt_model_in_reference_package: false,
      local_mcp_acceptance_status: "PENDING",
    });
    expect(manifest.geometry.symmetry_policy).toBe("BILATERAL");
    expect(Object.keys(manifest.geometry.rotation_contracts)).toHaveLength(8);
    expect(manifest.geometry.part_constraints.length).toBeGreaterThanOrEqual(12);
    expect(manifest.visual_grounding.final_views).toEqual(baseViews);
    expect(manifest.visual_grounding.conditional_final_views.ASYMMETRIC).toEqual([
      "right_side",
    ]);
    for (const view of baseViews) {
      const panel = manifest.visual_grounding.panels[view];
      expect(panel, view).toBeDefined();
      expect(panel.crop_normalized[2], view).toBeGreaterThan(0);
      expect(panel.crop_normalized[3], view).toBeGreaterThan(0);
      expect(panel.regions.length, view).toBeGreaterThan(0);
    }
    expect(manifest.texturing.quality_contract.palette_hex.length).toBeGreaterThan(0);
    expect(manifest.validation.base_required_views).toEqual(baseViews);
  });

  test("uses the manifest as the only executable Golden Sample geometry authority", () => {
    const manifest = json(
      "../docs/reference/golden-samples/black_rhinoceros/reference_manifest.json"
    );
    const profile = mergeGeometryReferenceProfile({
      referenceSha256: manifest.reference_visual_lock.sha256,
      visualGrounding: manifest.visual_grounding,
      geometry: manifest.geometry,
    });
    expect(profile).not.toBeNull();
    expect(Object.keys(profile!.panels).sort()).toEqual(baseViews.slice().sort());
    expect(Object.keys(profile!.rotation_contracts).sort()).toEqual(
      Object.keys(manifest.geometry.rotation_contracts).sort()
    );
    expect(profile!.part_constraints.map((part) => part.id)).toEqual(
      manifest.geometry.part_constraints.map((part: any) => part.id)
    );

    const source = read("src/lib/geometryReferenceProfiles.ts");
    expect(source).not.toContain("BLACK_RHINO_PROFILE");
    expect(source).not.toContain("GOLDEN_SAMPLE_SHA");
    expect(source).not.toContain("builtInGeometryProfile");
  });

  test("removes the final stale reconnect instruction from production skills", () => {
    const validation = read("../engines/shared/skills/blockbench-validation/SKILL.md");
    const production = read("../engines/shared/skills/blockbench-production/SKILL.md");
    const geometry = read("../engines/shared/skills/blockbench-geometry/SKILL.md");
    expect(validation).not.toContain("requires one canonical stage-transition reconnect");
    expect(validation).toContain("continues in the same Codex and MCP session");
    expect(production).toContain("all manifest-required views");
    expect(geometry).toContain("final required-view capture/analyze");
  });
});
