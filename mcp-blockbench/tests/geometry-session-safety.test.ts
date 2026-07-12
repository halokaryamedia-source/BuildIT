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
  test("normal Geometry exposes identity sync and major revision preparation", () => {
    const profiles = json("../engines/shared/profiles/tool-profiles.json");
    const geometry = new Set(
      profiles.profiles.BEDROCK_CUBOID_GEOMETRY.allowed_tools
    );
    expect(geometry.has("rebind_active_project_identity")).toBe(true);
    expect(geometry.has("prepare_geometry_visual_rebuild")).toBe(true);
    expect(profiles.profiles.GEOMETRY_LOCAL_REPAIR).toBeUndefined();
    expect(profiles.profiles.GEOMETRY_VISUAL_REBUILD).toBeUndefined();
  });

  test("identity synchronization is lease-exempt but strictly guarded", () => {
    const identity = read("src/server/tools/project-identity.ts");
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
    expect(lease).toContain(
      'if (toolName === "rebind_active_project_identity") return false;'
    );
  });

  test("major revision remains inside the normal Geometry profile and is non-destructive by default", () => {
    const source = read("src/server/tools/geometry-rebuild.ts");
    for (const marker of [
      "GEOMETRY_MAJOR_DIAGNOSIS_REQUIRED",
      "GEOMETRY_DIAGNOSIS_STALE",
      "GEOMETRY_IN_PROGRESS",
      "CONTINUE_GEOMETRY",
      "revision_mode: \"MAJOR_FORM_REVISION\"",
      "profile_switch_required: false",
      "reconnect_required: false",
      "writeJsonFilesAtomically",
      "updateProjectWriteLeaseWorkflow",
      "remove_structural_detail: z.boolean().optional().default(false)",
    ]) {
      expect(source).toContain(marker);
    }
    expect(source).not.toContain("GEOMETRY_REBUILD_PROFILE_REQUIRED");
  });

  test("internal progress markers do not hard-lock normal editing", () => {
    const runtime = read("src/lib/geometryRuntime.ts");
    expect(runtime).toContain("internal progress markers, not user-facing gates");
    expect(runtime).not.toContain("GEOMETRY_PRIMARY_FORM_GATE");
    expect(runtime).not.toContain("VISUAL_CONVERGENCE_FAILED:");
    expect(runtime).toContain("attention_required");
    expect(runtime).toContain("ROTATION_CONTRACT_TOOL_REQUIRED");
  });
});
