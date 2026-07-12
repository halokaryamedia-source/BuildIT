import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import {
  classifyViewStatus,
  diagnosticThresholds,
} from "../src/server/tools/geometry-analyzer";

describe("Geometry diagnostic authority", () => {
  test("blocking extent overrides a high weighted score", () => {
    expect(classifyViewStatus({ score: 0.9, minimumScore: 0.6, criticalRegionFailed: false, blockingDiagnostics: 1 }).final_view_result).toBe("REVISION_REQUIRED");
  });

  test("blocking ground mismatch overrides a high weighted score", () => {
    expect(classifyViewStatus({ score: 0.8, minimumScore: 0.6, criticalRegionFailed: false, blockingDiagnostics: 1 }).final_view_result).toBe("REVISION_REQUIRED");
  });

  test("a warning does not fail an otherwise passing view", () => {
    expect(classifyViewStatus({ score: 0.8, minimumScore: 0.6, criticalRegionFailed: false, blockingDiagnostics: 0 }).final_view_result).toBe("PASS");
  });

  test("preserved Black Rhinoceros measurements fail Left, Top, and 3/4", () => {
    const cases = [
      ["left_side", 0.709, 0.74, 6, 0],
      ["top_footprint", 0.628, 0.68, 8.16, 0],
      ["front_left_3_4", 0.716, 0.62, 10.73, 2.62],
    ] as const;
    for (const [view, score, minimum, extent, ground] of cases) {
      const threshold = diagnosticThresholds(view);
      const blocking = Number(extent > threshold.extent) + Number(ground > threshold.ground);
      expect(classifyViewStatus({ score, minimumScore: minimum, criticalRegionFailed: false, blockingDiagnostics: blocking }).final_view_result, view).toBe("REVISION_REQUIRED");
    }
  });
});

describe("Geometry session-safety source contracts", () => {
  test("identity rebind is bootstrap-only, guarded, and coordinated", () => {
    const source = readFileSync("src/server/tools/project-identity.ts", "utf8");
    for (const marker of ["PROJECT_IDENTITY_RUNTIME_MISMATCH", "PROJECT_IDENTITY_FINGERPRINT_MISMATCH", "PROJECT_IDENTITY_REFERENCE_MISMATCH", "PROJECT_IDENTITY_SAVE_PATH_MISMATCH", "PROJECT_IDENTITY_LEASE_ACTIVE", "STATE_REVISION_MISMATCH", "writeJsonFilesAtomically"]) expect(source).toContain(marker);
  });

  test("major rebuild transitions main state and runtime together", () => {
    const source = readFileSync("src/server/tools/geometry-rebuild.ts", "utf8");
    for (const marker of ["GEOMETRY_VISUAL_REBUILD", "GEOMETRY_REBUILD_MAJOR_DIAGNOSIS_REQUIRED", "GEOMETRY_REBUILD_DIAGNOSIS_STALE", "GEOMETRY_IN_PROGRESS", "START_GEOMETRY_REBUILD", "writeJsonFilesAtomically", "updateProjectWriteLeaseWorkflow"]) expect(source).toContain(marker);
  });
});
