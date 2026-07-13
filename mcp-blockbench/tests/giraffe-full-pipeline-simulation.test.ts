import { describe, expect, test } from "bun:test";
import {
  evaluateAnimationContractQuality,
  evaluateTextureContractQuality,
  rootMotionAllowedFromPolicy,
  simulateApprovedPipeline,
} from "../src/lib/pipelineAcceptance";
import {
  analyzeTexturePixels,
  evaluateAnimationQuality,
} from "../src/lib/stageQuality";
import {
  centerlineAnchorFromBounds,
  inferLongAxisFromSize,
  solveSingleAxisAttachmentAngle,
} from "../src/server/tools/geometry-rotation";
import { resolveApprovedStageTransition } from "../src/server/tools/workflow";

const neckContracts = [
  {
    id: "neck_base_rise",
    minimum: -32,
    maximum: -12,
    expected: [0, 0.78, -0.62] as [number, number, number],
  },
  {
    id: "neck_mid_01_rise",
    minimum: -38,
    maximum: -18,
    expected: [0, 0.72, -0.69] as [number, number, number],
  },
  {
    id: "neck_mid_02_rise",
    minimum: -42,
    maximum: -20,
    expected: [0, 0.68, -0.73] as [number, number, number],
  },
  {
    id: "neck_upper_rise",
    minimum: -36,
    maximum: -16,
    expected: [0, 0.75, -0.66] as [number, number, number],
  },
];

function giraffePixels() {
  const width = 128;
  const height = 128;
  const data = new Uint8ClampedArray(width * height * 4);
  const palette = [
    [90, 54, 31],
    [139, 82, 41],
    [175, 110, 53],
    [200, 138, 76],
    [213, 195, 159],
    [239, 226, 195],
    [230, 221, 203],
    [212, 185, 137],
    [99, 58, 32],
    [44, 35, 29],
    [24, 21, 18],
  ];
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const offset = (y * width + x) * 4;
      const cell = Math.floor(x / 12) + Math.floor(y / 10);
      const color = palette[cell % 7];
      data[offset] = color[0];
      data[offset + 1] = color[1];
      data[offset + 2] = color[2];
      data[offset + 3] = 255;
    }
  }
  return { width, height, data };
}

describe("reticulated giraffe MCP full-pipeline simulation", () => {
  test("Geometry smart-fit produces visible one-axis neck rotations and end-face pivots", () => {
    const size: [number, number, number] = [7, 12, 6];
    expect(inferLongAxisFromSize(size, "y")).toBe("y");
    expect(
      centerlineAnchorFromBounds({
        from: [-3.5, 0, -3],
        to: [3.5, 12, 3],
        longAxis: "y",
        end: "min",
      })
    ).toEqual([0, 0, 0]);

    for (const contract of neckContracts) {
      const solved = solveSingleAxisAttachmentAngle({
        baseDirection: [0, 1, 0],
        expectedDirection: contract.expected,
        allowedAxis: "x",
        minimumDegrees: contract.minimum,
        maximumDegrees: contract.maximum,
        stepDegrees: 0.25,
      });
      expect(solved.angle_degrees, contract.id).toBeGreaterThanOrEqual(
        contract.minimum
      );
      expect(solved.angle_degrees, contract.id).toBeLessThanOrEqual(
        contract.maximum
      );
      expect(Math.abs(solved.angle_degrees), contract.id).toBeGreaterThan(1);
      expect(solved.alignment, contract.id).toBeGreaterThan(0.98);
      expect(Math.abs(solved.direction[2]), contract.id).toBeGreaterThan(0.2);
    }
  });

  test("Coloring passes fixed atlas, palette, pixel, and eye-face UV contracts", () => {
    const pixels = giraffePixels();
    const pixelQuality = analyzeTexturePixels({
      ...pixels,
      contract: {
        anti_aliasing_allowed: false,
        maximum_partial_alpha_ratio: 0,
        minimum_opaque_ratio: 0.005,
        maximum_unique_colors: 64,
        palette_hex: [
          "#5A361F",
          "#8B5229",
          "#AF6E35",
          "#C88A4C",
          "#D5C39F",
          "#EFE2C3",
          "#E6DDCB",
          "#D4B989",
          "#633A20",
          "#2C231D",
          "#181512",
        ],
        maximum_palette_distance: 68,
        maximum_palette_outlier_ratio: 0.16,
      },
    });
    expect(pixelQuality.status).toBe("PASS");
    expect(pixelQuality.metrics.unique_colors).toBeLessThanOrEqual(64);
    expect(pixelQuality.metrics.partial_alpha_ratio).toBe(0);

    const detailQuality = evaluateTextureContractQuality({
      atlasWidth: 128,
      atlasHeight: 128,
      selectedAtlas: "128x128",
      minimumAtlas: "128x128",
      downgradeAllowed: false,
      eyeContract: {
        minimum_eye_face_width_pixels: 4,
        minimum_eye_face_height_pixels: 3,
        directional_uv_required: true,
      },
      eyeFaces: [
        { cube: "head", face: "east", uv: [4, 4, 12, 10], mirror_uv: false },
        { cube: "head", face: "west", uv: [14, 4, 22, 10], mirror_uv: false },
      ],
    });
    expect(detailQuality.status).toBe("PASS");
    expect(detailQuality.issues).toHaveLength(0);
  });

  test("Animation passes exact clips, loop modes, zero root motion, keyframes, and neutral recovery", () => {
    const snapshots = [
      {
        name: "animation.reticulated_giraffe.idle",
        length: 4,
        loop: true,
        animator_count: 8,
        keyframe_count: 32,
        root_position_channels: 0,
        scale_keyframe_count: 0,
        neutral_recovery_max_delta: 0,
      },
      {
        name: "animation.reticulated_giraffe.walk",
        length: 1.2,
        loop: true,
        animator_count: 15,
        keyframe_count: 72,
        root_position_channels: 0,
        scale_keyframe_count: 0,
        neutral_recovery_max_delta: 0,
      },
      {
        name: "animation.reticulated_giraffe.head_look",
        length: 2,
        loop: false,
        animator_count: 3,
        keyframe_count: 12,
        root_position_channels: 0,
        scale_keyframe_count: 0,
        neutral_recovery_max_delta: 0,
      },
    ];

    expect(rootMotionAllowedFromPolicy("in_place_zero_root_translation")).toBe(
      false
    );

    const base = evaluateAnimationQuality({
      snapshots,
      requiredClips: snapshots.map((snapshot) => snapshot.name),
      existingGroups: [
        "body",
        "neck_base",
        "neck_mid_01",
        "neck_mid_02",
        "neck_upper",
        "head",
      ],
      movingGroups: ["body", "neck_base", "neck_mid_01", "neck_mid_02", "neck_upper", "head"],
      staticGroups: [],
      rootMotionAllowed: false,
      minimumClipLength: 0.05,
      maximumClipLength: 30,
      requireAnimators: true,
      requireKeyframes: true,
    });
    expect(base.status).toBe("PASS");

    const detailed = evaluateAnimationContractQuality({
      snapshots,
      requiredClips: snapshots.map((snapshot) => snapshot.name),
      forbiddenClips: ["run", "gallop", "attack", "bite", "hurt", "death", "jaw", "rider", "special"],
      requiredClipCount: 3,
      clipContracts: {
        "animation.reticulated_giraffe.idle": { length_seconds: 4, loop: true },
        "animation.reticulated_giraffe.walk": { length_seconds: 1.2, loop: true },
        "animation.reticulated_giraffe.head_look": {
          length_seconds: 2,
          loop: false,
          return_to_neutral: true,
        },
      },
      rootMotionPolicy: "in_place_zero_root_translation",
      scaleKeyframesAllowed: false,
      neutralRecoveryRequired: true,
    });
    expect(detailed.status).toBe("PASS");
    expect(detailed.root_motion_allowed).toBe(false);
  });

  test("Stage routing remains in one session and reaches DONE in order", () => {
    const trace = simulateApprovedPipeline(true);
    expect(trace.map((entry) => entry.state)).toEqual([
      "GEOMETRY_IN_PROGRESS",
      "GEOMETRY_REVIEW",
      "TEXTURE_IN_PROGRESS",
      "TEXTURE_REVIEW",
      "ANIMATION_IN_PROGRESS",
      "ANIMATION_REVIEW",
      "FINAL_VALIDATION",
      "FINAL_REVIEW",
      "DONE",
    ]);
    expect(trace.at(-1)?.done).toBe(true);
    expect(trace.every((entry, index) => entry.revision === index)).toBe(true);

    const geometryTransition = resolveApprovedStageTransition("GEOMETRY", true);
    expect(geometryTransition).toMatchObject({
      nextState: "TEXTURE_IN_PROGRESS",
      nextStage: "TEXTURE",
      nextProfile: "BEDROCK_CUBOID_TEXTURE",
    });
    expect("reconnect_required" in geometryTransition).toBe(false);
    expect(resolveApprovedStageTransition("TEXTURE", true)).toMatchObject({
      nextState: "ANIMATION_IN_PROGRESS",
      nextStage: "ANIMATION",
    });
    expect(resolveApprovedStageTransition("ANIMATION", true)).toMatchObject({
      nextState: "FINAL_VALIDATION",
      nextStage: "FINAL_VALIDATION",
    });
    expect(resolveApprovedStageTransition("FINAL_VALIDATION", true)).toMatchObject({
      nextState: "DONE",
    });
  });

  test("bad Geometry, Coloring, and Animation outcomes are rejected", () => {
    const axisAligned = solveSingleAxisAttachmentAngle({
      baseDirection: [0, 1, 0],
      expectedDirection: [0, 1, 0],
      allowedAxis: "x",
      minimumDegrees: 0,
      maximumDegrees: 0,
    });
    expect(axisAligned.angle_degrees).toBe(0);
    expect(Math.abs(axisAligned.direction[2])).toBe(0);

    const badTexture = evaluateTextureContractQuality({
      atlasWidth: 64,
      atlasHeight: 64,
      selectedAtlas: "128x128",
      minimumAtlas: "128x128",
      downgradeAllowed: false,
      eyeContract: {
        minimum_eye_face_width_pixels: 4,
        minimum_eye_face_height_pixels: 3,
        directional_uv_required: true,
      },
      eyeFaces: [
        { cube: "head", face: "east", uv: [0, 0, 2, 2], mirror_uv: true },
        { cube: "head", face: "west", uv: [0, 0, 2, 2], mirror_uv: true },
      ],
    });
    expect(badTexture.status).toBe("REVISION_REQUIRED");
    expect(new Set(badTexture.issues.map((issue) => issue.code))).toEqual(
      new Set([
        "ATLAS_SIZE_MISMATCH",
        "ATLAS_DOWNGRADE_FORBIDDEN",
        "EYE_UV_BUDGET_INSUFFICIENT",
        "FACIAL_DETAIL_ORIENTATION_FAILED",
      ])
    );

    const badAnimation = evaluateAnimationContractQuality({
      snapshots: [
        {
          name: "animation.reticulated_giraffe.walk",
          length: 0.4,
          loop: false,
          animator_count: 1,
          keyframe_count: 1,
          root_position_channels: 3,
          scale_keyframe_count: 2,
          neutral_recovery_max_delta: 4,
        },
        {
          name: "animation.reticulated_giraffe.gallop",
          length: 1,
          loop: true,
          animator_count: 1,
          keyframe_count: 1,
          root_position_channels: 0,
          scale_keyframe_count: 0,
          neutral_recovery_max_delta: 0,
        },
      ],
      requiredClips: [
        "animation.reticulated_giraffe.idle",
        "animation.reticulated_giraffe.walk",
        "animation.reticulated_giraffe.head_look",
      ],
      forbiddenClips: ["gallop"],
      requiredClipCount: 3,
      clipContracts: {
        "animation.reticulated_giraffe.walk": { length_seconds: 1.2, loop: true },
      },
      rootMotionPolicy: "in_place_zero_root_translation",
      scaleKeyframesAllowed: false,
      neutralRecoveryRequired: true,
    });
    expect(badAnimation.status).toBe("REVISION_REQUIRED");
    const animationCodes = new Set(badAnimation.issues.map((issue) => issue.code));
    for (const code of [
      "ANIMATION_CLIP_COUNT_MISMATCH",
      "FORBIDDEN_ANIMATION_PRESENT",
      "ANIMATION_SCALE_KEYFRAMES_FORBIDDEN",
      "ANIMATION_ROOT_MOTION_FORBIDDEN",
      "ANIMATION_CONTRACT_LENGTH_MISMATCH",
      "ANIMATION_LOOP_MODE_MISMATCH",
      "ANIMATION_NEUTRAL_RECOVERY_FAILED",
    ]) {
      expect(animationCodes.has(code), code).toBe(true);
    }
  });
});
