import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import {
  classifyViewStatus,
  diagnosticThresholds,
} from "../src/server/tools/geometry-analyzer";

const read = (path: string) => readFileSync(path, "utf8");
const json = (path: string) => JSON.parse(read(path)) as Record<string, any>;

describe("Geometry diagnostic authority", () => {
  test("blocking extent overrides a high weighted score", () => {
    expect(
      classifyViewStatus({
        score: 0.9,
        minimumScore: 0.6,
        criticalRegionFailed: false,
        blockingDiagnostics: 1,
      }).final_view_result
    ).toBe("REVISION_REQUIRED");
  });

  test("blocking ground mismatch overrides a high weighted score", () => {
    expect(
      classifyViewStatus({
        score: 0.8,
        minimumScore: 0.6,
        criticalRegionFailed: false,
        blockingDiagnostics: 1,
      }).final_view_result
    ).toBe("REVISION_REQUIRED");
  });

  test("a warning does not fail an otherwise passing view", () => {
    expect(
      classifyViewStatus({
        score: 0.8,
        minimumScore: 0.6,
        criticalRegionFailed: false,
        blockingDiagnostics: 0,
      }).final_view_result
    ).toBe("PASS");
  });

  test("preserved Black Rhinoceros measurements fail Left, Top, and 3/4", () => {
    const cases = [
      ["left_side", 0.709, 0.74, 6, 0],
      ["top_footprint", 0.628, 0.68, 8.16, 0],
      ["front_left_3_4", 0.716, 0.62, 10.73, 2.62],
    ] as const;
    for (const [view, score, minimum, extent, ground] of cases) {
      const threshold = diagnosticThresholds(view);
      const blocking =
        Number(extent > threshold.extent) +
        Number(ground > threshold.ground);
      expect(
        classifyViewStatus({
          score,
          minimumScore: minimum,
          criticalRegionFailed: false,
          blockingDiagnostics: blocking,
        }).final_view_result,
        view
      ).toBe("REVISION_REQUIRED");
    }
  });
});

describe("single-session Geometry workflow", () => {
  test("normal Geometry exposes identity recovery and revision preparation", () => {
    const profiles = json("../engines/shared/profiles/tool-profiles.json");
    const geometry = new Set(
      profiles.profiles.BEDROCK_CUBOID_GEOMETRY.allowed_tools
    );
    expect(geometry.has("rebind_active_project_identity")).toBe(true);
    expect(geometry.has("prepare_geometry_visual_rebuild")).toBe(true);
    expect(geometry.has("create_project")).toBe(true);
    expect(profiles.profiles.GEOMETRY_LOCAL_REPAIR).toBeUndefined();
    expect(profiles.profiles.GEOMETRY_VISUAL_REBUILD).toBeUndefined();
  });

  test("canonical creation bootstraps workspace and auto-synchronizes identity", () => {
    const identity = read("src/server/tools/project-identity.ts");
    const project = read("src/server/tools/project.ts");
    const bootstrap = read("src/lib/workspaceBootstrap.ts");
    const lease = read("src/lib/writeLease.ts");
    for (const marker of [
      "PROJECT_IDENTITY_RUNTIME_MISMATCH",
      "PROJECT_IDENTITY_FINGERPRINT_MISMATCH",
      "PROJECT_IDENTITY_REFERENCE_MISMATCH",
      "PROJECT_IDENTITY_SAVE_PATH_MISMATCH",
      "PROJECT_IDENTITY_LEASE_ACTIVE",
      "STATE_REVISION_MISMATCH",
      "writeJsonFilesAtomically",
      "reconnect_required: false",
    ]) {
      expect(identity).toContain(marker);
    }
    expect(identity).not.toContain("PROJECT_IDENTITY_BOOTSTRAP_REQUIRED");
    expect(identity).toContain("expected_previous_project_uuid: z.string().min(1).nullable()");
    expect(project).toContain("canonicalProjectPath(resolvedSessionRoot, resolvedAssetId)");
    expect(project).toContain('operation: "create_project_auto_sync"');
    expect(project).toContain("prepareWorkspaceFromReferencePackage");
    expect(project).toContain("manual_workspace_setup_required: false");
    expect(project).toContain("manual_identity_sync_required: false");
    expect(project).toContain("manual_write_lease_required: false");
    expect(project).toContain("ensureProjectWriteLease");
    expect(bootstrap).toContain("CHATGPT_REFERENCE_PACKAGE");
    expect(lease).toContain(
      'if (toolName === "rebind_active_project_identity") return false;'
    );
  });

  test("local and major revision remain in the normal Geometry profile", () => {
    const source = read("src/server/tools/geometry-rebuild.ts");
    for (const marker of [
      "LOCAL_REPAIR",
      "MAJOR_FORM_REVISION",
      "DETERMINISTIC_METRICS",
      "MULTIMODAL_DECISION",
      "GEOMETRY_REVISION_DIAGNOSIS_REQUIRED",
      "GEOMETRY_REVISION_EVIDENCE_STALE",
      "GEOMETRY_DIAGNOSIS_STALE",
      "GEOMETRY_IN_PROGRESS",
      "GEOMETRY_REVIEW",
      "CONTINUE_GEOMETRY",
      "profile_switch_required: false",
      "reconnect_required: false",
      "writeJsonFilesAtomically",
      "updateProjectWriteLeaseWorkflow",
      "remove_structural_detail: z.boolean().optional().default(false)",
      "GEOMETRY_LOCAL_REPAIR_CANNOT_REMOVE_STRUCTURAL_DETAIL",
    ]) {
      expect(source).toContain(marker);
    }
    expect(source).not.toContain("GEOMETRY_REBUILD_PROFILE_REQUIRED");
  });

  test("primary form is an internal gate without adding a user review or profile", () => {
    const runtime = read("src/lib/geometryRuntime.ts");
    const geometrySkill = read("../engines/shared/skills/blockbench-geometry/SKILL.md");
    expect(runtime).toContain("PRIMARY_FORM is nevertheless a deterministic mutation boundary");
    expect(runtime).toContain("GEOMETRY_PRIMARY_FORM_NOT_READY");
    expect(runtime).toContain("GEOMETRY_PRIMARY_FORM_UNCLASSIFIED_PART");
    expect(runtime).toContain("attention_required");
    expect(runtime).toContain("ROTATION_CONTRACT_TOOL_REQUIRED");
    expect(geometrySkill).toContain("not extra user reviews or profiles");
    expect(geometrySkill).toContain("verify_primary_form_ready");
  });
});
