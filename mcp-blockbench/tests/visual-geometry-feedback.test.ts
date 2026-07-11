import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { toolManifest } from "../scripts/docs-manifest";
import {
  cubeCorners,
  rotatePointAroundOrigin,
  transformedCubeCorners,
} from "../src/lib/worldBounds";

const toolNames = new Set(
  toolManifest.flatMap((group) => group.tools.map((tool) => tool.name))
);
const profiles = JSON.parse(
  readFileSync("../engines/shared/profiles/tool-profiles.json", "utf8")
) as Record<string, any>;
const stages = JSON.parse(
  readFileSync("../engines/shared/profiles/stage-profiles.json", "utf8")
) as Record<string, any>;

describe("visual-grounded Geometry workflow", () => {
  test("registers the required visual and guarded mutation tools", () => {
    for (const name of [
      "inspect_reference_visual",
      "capture_visual_feedback",
      "place_cubes_safe",
      "modify_cubes",
      "record_geometry_visual_result",
      "verify_geometry_visual_gate",
      "complete_geometry_stage",
    ]) {
      expect(toolNames.has(name), name).toBe(true);
    }
  });

  test("Geometry profiles expose safe tools instead of legacy single-cube mutation", () => {
    for (const profileId of [
      "BEDROCK_CUBOID_GEOMETRY",
      "GEOMETRY_LOCAL_REPAIR",
      "GEOMETRY_VISUAL_REBUILD",
    ]) {
      const allowed = new Set(profiles.profiles[profileId].allowed_tools);
      expect(allowed.has("place_cubes_safe"), profileId).toBe(true);
      expect(allowed.has("modify_cubes"), profileId).toBe(true);
      expect(allowed.has("capture_visual_feedback"), profileId).toBe(true);
      expect(allowed.has("place_cube"), profileId).toBe(false);
      expect(allowed.has("modify_cube"), profileId).toBe(false);
    }
  });

  test("Geometry completion cannot bypass the visual gate", () => {
    const allowed = new Set(
      profiles.profiles.BEDROCK_CUBOID_GEOMETRY.allowed_tools
    );
    expect(allowed.has("complete_geometry_stage")).toBe(true);
    expect(allowed.has("complete_stage")).toBe(false);
    expect(stages.profiles.GEOMETRY.visual_validation_tool).toBe(
      "verify_geometry_visual_gate"
    );
    expect(stages.geometry_rotation_policy.explicit_origin_required_when_rotating).toBe(
      true
    );
  });
});

describe("rotation-aware bounds primitives", () => {
  test("rotates a point around an explicit pivot", () => {
    const result = rotatePointAroundOrigin([2, 0, 0], [0, 0, 0], [0, 0, 90]);
    expect(result[0]).toBeCloseTo(0, 6);
    expect(result[1]).toBeCloseTo(2, 6);
    expect(result[2]).toBeCloseTo(0, 6);
  });

  test("rotated cube corners differ from raw axis-aligned corners", () => {
    const raw = cubeCorners([0, 0, 0], [4, 2, 2]);
    const rotated = transformedCubeCorners({
      name: "test",
      uuid: "test",
      from: [0, 0, 0],
      to: [4, 2, 2],
      origin: [0, 0, 0],
      rotation: [0, 0, 90],
      parent: "root",
    });
    expect(rotated).not.toEqual(raw);
    expect(Math.min(...rotated.map((point) => point[0]))).toBeCloseTo(-2, 6);
    expect(Math.max(...rotated.map((point) => point[1]))).toBeCloseTo(4, 6);
  });

  test("parent rotation is applied after cube rotation", () => {
    const parent = {
      origin: [0, 0, 0],
      rotation: [0, 90, 0],
      parent: "root" as const,
    };
    const rotated = transformedCubeCorners({
      name: "child",
      uuid: "child",
      from: [0, 0, 0],
      to: [2, 2, 4],
      origin: [0, 0, 0],
      rotation: [0, 0, 0],
      parent,
    });
    expect(Math.max(...rotated.map((point) => point[0]))).toBeCloseTo(4, 6);
    expect(Math.min(...rotated.map((point) => point[2]))).toBeCloseTo(-2, 6);
  });
});

describe("source-level safety contracts", () => {
  test("requires explicit rotation origins and stale visual protection", () => {
    const feedback = readFileSync(
      "src/server/tools/geometry-feedback.ts",
      "utf8"
    );
    const completion = readFileSync(
      "src/server/tools/geometry-completion.ts",
      "utf8"
    );
    expect(feedback).toContain("ROTATION_ORIGIN_REQUIRED");
    expect(feedback).toContain("COMPOUND_ROTATION_REJECTED");
    expect(feedback).toContain("VISUAL_REPORT_STALE");
    expect(completion).toContain("GEOMETRY_VISUAL_REPORT_STALE");
    expect(completion).toContain("GEOMETRY_ROTATION_NOT_SAFE");
  });
});
