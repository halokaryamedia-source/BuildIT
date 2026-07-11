import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { evaluateGeometryBlueprint } from "../src/lib/geometryBlueprint";
import { builtInGeometryProfile } from "../src/lib/geometryReferenceProfiles";

const GOLDEN_SAMPLE_SHA =
  "fc46201d38fa1b357d285dd0450becfef1f88c65f39b179dfa41ea27ba182d5f";

function profile() {
  const value = builtInGeometryProfile(GOLDEN_SAMPLE_SHA);
  if (!value) throw new Error("Black Rhinoceros built-in profile is missing.");
  return value;
}

describe("Black Rhinoceros Geometry blueprint", () => {
  test("rejects the preserved failed Geometry checkpoint with actionable part deltas", () => {
    const model = JSON.parse(
      readFileSync(
        "../workspace/active/black_rhinoceros/mcp/checkpoints/11_geometry_revision_01.bbmodel",
        "utf8"
      )
    ) as { elements?: Array<Record<string, unknown>> };
    const result = evaluateGeometryBlueprint(
      model.elements ?? [],
      profile().part_constraints
    );

    expect(result.result).toBe("REVISION_REQUIRED");
    expect(result.failed_parts).toBeGreaterThan(0);
    expect(result.issues.length).toBeGreaterThan(0);
    expect(
      result.issues.some((issue) =>
        ["torso_core", "shoulder_mass", "rear_mass"].includes(issue.part)
      )
    ).toBe(true);
    expect(
      result.issues.every(
        (issue) =>
          issue.views.length > 0 &&
          typeof issue.message === "string" &&
          Number.isFinite(issue.nearest_correction_units)
      )
    ).toBe(true);
  });

  test("accepts a synthetic primary-mass blueprint inside all numeric ranges", () => {
    const elements = [
      {
        name: "shoulder_main",
        from: [-12.5, 13, -10],
        to: [12.5, 36, 3],
      },
      {
        name: "torso_main",
        from: [-11.5, 12, -4],
        to: [11.5, 32, 22],
      },
      {
        name: "rear_main",
        from: [-9.5, 13, 12],
        to: [9.5, 30, 23],
      },
    ];
    const result = evaluateGeometryBlueprint(
      elements,
      profile().part_constraints
    );

    expect(result.result).toBe("PASS");
    expect(result.failed_parts).toBe(0);
    expect(result.evaluated_parts).toBeGreaterThanOrEqual(3);
  });

  test("built-in profile has five non-zero crops, critical regions, and rotation contracts", () => {
    const value = profile();
    const views = [
      "front",
      "left_side",
      "back",
      "top_footprint",
      "front_left_3_4",
    ] as const;
    for (const view of views) {
      const panel = value.panels[view];
      expect(panel.crop_normalized[2]).toBeGreaterThan(0);
      expect(panel.crop_normalized[3]).toBeGreaterThan(0);
      expect(panel.regions.length).toBeGreaterThan(0);
      expect(panel.regions.some((region) => region.critical)).toBe(true);
    }
    expect(Object.keys(value.rotation_contracts).length).toBeGreaterThanOrEqual(6);
    expect(
      Object.values(value.rotation_contracts).every(
        (contract) =>
          contract.affected_views.length > 0 &&
          contract.minimum_degrees <= contract.maximum_degrees &&
          contract.minimum_direction_dot > 0
      )
    ).toBe(true);
  });
});
