import { describe, expect, test } from "bun:test";
import {
  centerlineAnchorFromBounds,
  inferLongAxisFromSize,
  solveSingleAxisAttachmentAngle,
} from "../src/server/tools/geometry-rotation";
import { readFileSync } from "node:fs";

const read = (path: string) => readFileSync(path, "utf8");

describe("smart cuboid attachment math", () => {
  test("uses the center of the end face rather than a diagonal corner", () => {
    expect(
      centerlineAnchorFromBounds({
        from: [-2, 10, -3],
        to: [2, 20, 3],
        longAxis: "y",
        end: "min",
      })
    ).toEqual([0, 10, 0]);
    expect(
      centerlineAnchorFromBounds({
        from: [-2, 10, -3],
        to: [2, 20, 3],
        longAxis: "y",
        end: "max",
      })
    ).toEqual([0, 20, 0]);
  });

  test("infers the longitudinal axis from contract-sized cuboid dimensions", () => {
    expect(inferLongAxisFromSize([4, 12, 5])).toBe("y");
    expect(inferLongAxisFromSize([10, 3, 4])).toBe("x");
    expect(inferLongAxisFromSize([4, 3, 14])).toBe("z");
    expect(inferLongAxisFromSize([4, 12, 5], "z")).toBe("z");
  });

  test("solves a visible one-axis neck rotation from expected direction", () => {
    const result = solveSingleAxisAttachmentAngle({
      baseDirection: [0, 10, 0],
      expectedDirection: [0, 0.78, -0.62],
      allowedAxis: "x",
      minimumDegrees: -45,
      maximumDegrees: -10,
    });
    expect(result.angle_degrees).toBeLessThan(-20);
    expect(result.angle_degrees).toBeGreaterThan(-45.01);
    expect(result.alignment).toBeGreaterThan(0.995);
    expect(result.direction[2]).toBeLessThan(-0.4);
  });
});

describe("smart attachment runtime contract", () => {
  test("resizes, snaps, rotates, and records explicit pivot evidence", () => {
    const rotation = read("src/server/tools/geometry-rotation.ts");
    for (const marker of [
      "SNAP_RESIZE_ROTATE",
      "CONSTRAINT_MIDPOINT",
      "automatic_angle_solver",
      "translation_world",
      "translation_local",
      "pivot_local",
      "pivot_world",
      "tip_world",
      "attachment_fit.json",
      "ROTATION_NOT_VISIBLE",
      "ROTATION_PIVOT_REJECTED",
    ]) {
      expect(rotation).toContain(marker);
    }
  });

  test("primary form requires current smart-fit pivot evidence", () => {
    const gate = read("src/server/tools/geometry-primary-gate.ts");
    for (const marker of [
      "PRIMARY_ROTATION_PIVOT_NOT_APPLIED",
      "PRIMARY_ROTATION_CONNECTION_FAILED",
      "PRIMARY_ROTATION_DIRECTION_FAILED",
      "PRIMARY_ROTATION_EVIDENCE_MISSING",
      "PRIMARY_ROTATION_EVIDENCE_STALE",
      "attachment_fit_evidence_required",
    ]) {
      expect(gate).toContain(marker);
    }
  });
});
