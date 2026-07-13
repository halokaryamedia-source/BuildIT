import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { workflowToolDocs } from "../src/server/tools/workflow";
import {
  assertInsideRoot,
  normalizePathForCompare,
} from "../src/lib/atomicFiles";

const readJson = (path: string) =>
  JSON.parse(readFileSync(path, "utf8")) as Record<string, any>;

describe("compact workflow tools", () => {
  test("keeps the generic workflow surface compact", () => {
    expect(workflowToolDocs.map((tool) => tool.name)).toEqual([
      "validate_reference_contract",
      "save_texture_evidence",
      "complete_stage",
    ]);
  });

  test("exposes one canonical profile per stage with automatic review and revision", () => {
    const config = readJson("../engines/shared/profiles/tool-profiles.json");
    const geometry = config.profiles.BEDROCK_CUBOID_GEOMETRY.allowed_tools;
    expect(geometry).toContain("complete_geometry_stage");
    expect(geometry).not.toContain("complete_stage");
    expect(geometry).toContain("rebind_active_project_identity");
    expect(geometry).toContain("prepare_geometry_visual_rebuild");
    expect(geometry).toContain("submit_geometry_for_review");

    for (const profileId of [
      "BEDROCK_CUBOID_TEXTURE",
      "BEDROCK_CUBOID_ANIMATION",
      "FINAL_VALIDATION_READONLY",
    ]) {
      const allowed = config.profiles[profileId].allowed_tools;
      expect(allowed, profileId).toContain("rebind_active_project_identity");
      expect(allowed, profileId).toContain("prepare_stage_revision");
      expect(allowed, profileId).toContain("reopen_stage_for_revision");
      expect(allowed, profileId).toContain("record_stage_review_report");
      expect(allowed, profileId).toContain("submit_stage_for_review");
      expect(allowed, profileId).toContain("complete_stage");
    }

    for (const removed of [
      "GEOMETRY_LOCAL_REPAIR",
      "GEOMETRY_VISUAL_REBUILD",
      "TEXTURE_LOCAL_REPAIR",
      "ANIMATION_LOCAL_REPAIR",
    ]) {
      expect(config.profiles[removed]).toBeUndefined();
    }
  });

  test("normal profiles remain within the 30-tool budget", () => {
    const config = readJson("../engines/shared/profiles/tool-profiles.json");
    for (const [profileId, profile] of Object.entries<Record<string, any>>(
      config.profiles
    )) {
      if (profile.include_all) continue;
      const exposed = new Set([
        ...config.core_tools,
        ...(profile.allowed_tools ?? []),
      ]);
      expect(exposed.size, profileId).toBeLessThanOrEqual(30);
    }
  });

  test("workflow writes are atomic and state-revision guarded", () => {
    const source = readFileSync("src/server/tools/workflow.ts", "utf8");
    expect(source).toContain("writeJsonAtomically(fs, statePath, state)");
    expect(source).toContain("STATE_REVISION_MISMATCH");
    expect(source).toContain("STAGE_EVIDENCE_MISSING");
    expect(source).toContain("analyzeTexturePixels");
    expect(source).toContain("evaluateAnimationQuality");
    expect(source).not.toContain('GEOMETRY: "GEOMETRY_LOCAL_REPAIR"');
  });

  test("path authorization collapses traversal", () => {
    expect(
      normalizePathForCompare(
        "C:\\repo\\session\\evidence\\..\\..\\outside.png"
      )
    ).toBe("c:/repo/outside.png");
    expect(() =>
      assertInsideRoot("C:\\repo\\outside.png", "C:\\repo\\session")
    ).toThrow("outside approved root");
  });
});
