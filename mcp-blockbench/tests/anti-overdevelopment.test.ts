import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { mergeGeometryReferenceProfile } from "../src/lib/geometryReferenceProfiles";

const read = (path: string) => readFileSync(path, "utf8");
const json = (path: string) => JSON.parse(read(path)) as Record<string, any>;

describe("anti-overdevelopment invariants", () => {
  test("uses manifest-only geometry contracts without an asset-specific fallback", () => {
    const source = read("src/lib/geometryReferenceProfiles.ts");
    expect(source).not.toContain("BLACK_RHINO_PROFILE");
    expect(source).not.toContain("GOLDEN_SAMPLE_SHA");
    expect(source).not.toContain("builtInGeometryProfile");

    const manifest = json(
      "../docs/reference/golden-samples/black_rhinoceros/reference_manifest.json"
    );
    const profile = mergeGeometryReferenceProfile({
      referenceSha256: manifest.reference_visual_lock.sha256,
      visualGrounding: manifest.visual_grounding,
      geometry: manifest.geometry,
    });
    expect(profile).not.toBeNull();
    expect(Object.keys(profile!.panels).length).toBe(5);
    expect(profile!.part_constraints.length).toBeGreaterThan(0);
    expect(Object.keys(profile!.rotation_contracts).length).toBeGreaterThan(0);
  });

  test("does not duplicate the full visual grounding manifest in stage context", () => {
    const source = read("src/server/tools/stage-context.ts");
    expect(source).not.toContain("...(manifest.visual_grounding ?? {})");
    expect(source).toContain('contract_source: "references/reference_manifest.json"');
    expect(source).toContain("base_required_views");
    expect(source).toContain("conditional_required_views");
    expect(source).toContain('conflict_code: "LEGACY_SKILL_CONFLICT"');
    expect(source).not.toContain("01_<asset_id>_form_scale_reference.png");
  });

  test("freezes speculative pre-local expansion until measured runtime evidence exists", () => {
    const ponytail = read(
      "../openspec/changes/codex-local-workflow-rework/PONYTAIL_EXECUTION.md"
    );
    const tasks = read(
      "../openspec/changes/codex-local-workflow-rework/tasks.md"
    );
    expect(ponytail).toContain("Pre-local optimization freeze");
    expect(ponytail).toContain("measured local acceptance evidence");
    expect(tasks).toContain("Optional role discovery is non-blocking");
  });
});
