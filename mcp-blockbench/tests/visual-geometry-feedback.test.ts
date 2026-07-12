import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { toolManifest } from "../scripts/docs-manifest";
import {
  cubeCorners,
  rotatePointAroundOrigin,
  transformedCubeCorners,
} from "../src/lib/worldBounds";
import {
  createProjectionFrame,
  maskBounds,
  type BinaryMask,
} from "../src/lib/geometryProjection";

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
  test("registers diagnosis, guarded mutation, rotation, validation, review, and approval tools", () => {
    for (const name of [
      "get_stage_context",
      "inspect_reference_visual",
      "capture_visual_feedback",
      "analyze_geometry_views",
      "place_cubes_safe",
      "modify_cubes",
      "rotate_cube_about_attachment",
      "prepare_geometry_visual_rebuild",
      "validate_geometry_contract",
      "record_geometry_visual_decision",
      "verify_geometry_review_ready",
      "complete_geometry_stage",
    ]) {
      expect(toolNames.has(name), name).toBe(true);
    }
  });

  test("every Geometry profile exposes the same guarded quality tools", () => {
    for (const profileId of [
      "BEDROCK_CUBOID_GEOMETRY",
      "GEOMETRY_LOCAL_REPAIR",
      "GEOMETRY_VISUAL_REBUILD",
    ]) {
      const allowed = new Set(profiles.profiles[profileId].allowed_tools);
      for (const name of [
        "place_cubes_safe",
        "modify_cubes",
        "rotate_cube_about_attachment",
        "capture_visual_feedback",
        "analyze_geometry_views",
        "validate_geometry_contract",
        "record_geometry_visual_decision",
        "verify_geometry_review_ready",
      ]) {
        expect(allowed.has(name), `${profileId}: ${name}`).toBe(true);
      }
      expect(allowed.has("place_cube"), profileId).toBe(false);
      expect(allowed.has("modify_cube"), profileId).toBe(false);
      expect(allowed.has("validate_reference_contract"), profileId).toBe(false);
      expect(allowed.has("compare_reference_views"), profileId).toBe(false);
    }
    expect(
      profiles.profiles.GEOMETRY_VISUAL_REBUILD.allowed_tools
    ).toContain("prepare_geometry_visual_rebuild");
  });

  test("Geometry completion cannot bypass fixed-scale, multimodal, structural, or rotation gates", () => {
    const allowed = new Set(
      profiles.profiles.BEDROCK_CUBOID_GEOMETRY.allowed_tools
    );
    expect(allowed.has("complete_geometry_stage")).toBe(true);
    expect(allowed.has("complete_stage")).toBe(false);
    expect(stages.profiles.GEOMETRY.diagnostic_visual_tool).toBe(
      "analyze_geometry_views"
    );
    expect(stages.profiles.GEOMETRY.visual_decision_tool).toBe(
      "record_geometry_visual_decision"
    );
    expect(stages.profiles.GEOMETRY.compact_validation_tool).toBe(
      "validate_geometry_contract"
    );
    expect(stages.profiles.GEOMETRY.safe_rotation_tool).toBe(
      "rotate_cube_about_attachment"
    );
    expect(stages.profiles.GEOMETRY.review_readiness_tool).toBe(
      "verify_geometry_review_ready"
    );
    expect(stages.geometry_visual_policy.record_tool).toBe(
      "record_geometry_visual_decision"
    );
    expect(stages.geometry_visual_policy.fixed_scale_required).toBe(true);
    expect(stages.geometry_visual_policy.free_rescale_forbidden).toBe(true);
    expect(stages.geometry_rotation_policy.automatic_visual_regression_rollback).toBe(
      true
    );
  });

  test("compact stage context is core and normal profiles remain bounded", () => {
    expect(profiles.core_tools).toContain("get_stage_context");
    for (const [profileId, profile] of Object.entries<Record<string, any>>(
      profiles.profiles
    )) {
      if (profile.include_all) continue;
      const exposed = new Set([
        ...profiles.core_tools,
        ...(profile.allowed_tools ?? []),
      ]);
      expect(exposed.size, profileId).toBeLessThanOrEqual(30);
    }
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

describe("fixed approved projection frame", () => {
  test("uses the approved envelope rather than current silhouette bounds", () => {
    const frame = createProjectionFrame({
      view: "left_side",
      envelope: {
        x_min: -13.6,
        x_max: 13.6,
        y_min: 0,
        y_max: 40,
        z_min: -30,
        z_max: 22.8,
      },
      front_axis: "-z",
      width: 256,
      height: 256,
      margin: 18,
    });
    expect(frame.ground_pixel_y).not.toBeNull();
    expect(frame.scale).toBeGreaterThan(0);
    expect(frame.projected_envelope_height).toBeCloseTo(40, 3);
  });

  test("mask bounds preserve exact pixel placement without normalization", () => {
    const mask: BinaryMask = {
      width: 16,
      height: 16,
      data: new Uint8Array(16 * 16),
    };
    mask.data[3 * 16 + 2] = 1;
    mask.data[8 * 16 + 10] = 1;
    expect(maskBounds(mask)).toMatchObject({
      min_x: 2,
      min_y: 3,
      max_x: 10,
      max_y: 8,
    });
  });
});

describe("source-level safety contracts", () => {
  test("enforces phases, actionable diagnosis, contract rotation, and non-nested completion", () => {
    const runtime = readFileSync("src/lib/geometryRuntime.ts", "utf8");
    const analyzer = readFileSync(
      "src/server/tools/geometry-analyzer.ts",
      "utf8"
    );
    const decision = readFileSync(
      "src/server/tools/geometry-decision.ts",
      "utf8"
    );
    const rotation = readFileSync(
      "src/server/tools/geometry-rotation.ts",
      "utf8"
    );
    const validator = readFileSync(
      "src/server/tools/geometry-validator.ts",
      "utf8"
    );
    const reviewGate = readFileSync(
      "src/server/tools/geometry-review-gate.ts",
      "utf8"
    );
    const completion = readFileSync(
      "src/server/tools/geometry-completion.ts",
      "utf8"
    );
    expect(runtime).toContain("GEOMETRY_PRIMARY_FORM_GATE");
    expect(runtime).toContain("VISUAL_CONVERGENCE_FAILED");
    expect(runtime).toContain("ROTATION_CONTRACT_TOOL_REQUIRED");
    expect(analyzer).toContain("free_rescale_used: false");
    expect(analyzer).toContain("actionable_issues");
    expect(analyzer).toContain("geometry_projection_region_v2");
    expect(decision).toContain("GEOMETRY_DIAGNOSIS_NOT_PASS");
    expect(decision).toContain("GEOMETRY_VISUAL_METRICS_STALE");
    expect(rotation).toContain("ROTATION_VISUAL_REGRESSION");
    expect(rotation).toContain("ROTATION_DIRECTION_REJECTED");
    expect(rotation).toContain("ROTATION_CONNECTION_REJECTED");
    expect(validator).toContain("computeProjectWorldBounds");
    expect(validator).toContain("geometry_report.json");
    expect(reviewGate).toContain("GEOMETRY_MULTIMODAL_VIEWS_INCOMPLETE");
    expect(reviewGate).toContain("GEOMETRY_DETERMINISTIC_VIEWS_INCOMPLETE");
    expect(completion).toContain("validate_geometry_contract");
    expect(completion).not.toContain('getAllToolDefinitions()["complete_stage"]');
  });
});
