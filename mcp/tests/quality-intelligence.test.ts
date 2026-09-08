import { describe, expect, test } from "bun:test";
import { analyzeGeometryHygiene } from "@/lib/geometryQuality";
import { analyzeTextureColorProfile } from "@/lib/textureColorProfile";
import {
  analyzeRootMotionTrack,
  analyzeRootMotionTracks,
} from "@/lib/rootMotionAnalysis";
import {
  analyzeProjectedEnvelopeFidelity,
  analyzeRigGraph,
  summarizeSurfaceQualityWarnings,
} from "@/lib/modelQuality";

describe("bounded authoring quality intelligence", () => {
  test("geometry hygiene exposes precision corrections and duplicate bone identity without mutating", () => {
    const result = analyzeGeometryHygiene(
      [
        {
          uuid: "cube-a",
          name: "body",
          from: [0.0000004, 0, 0],
          to: [16, 16, 16],
          origin: [8, 8, 8],
          rotation: [0, 0, 0],
          inflate: 0,
        },
        {
          uuid: "cube-b",
          name: "flat",
          from: [0, 0, 0],
          to: [0, 2, 2],
        },
      ],
      [
        { uuid: "bone-a", name: "arm" },
        { uuid: "bone-b", name: "arm" },
        { uuid: "bone-c", name: "body" },
      ]
    );

    expect(result.state).toBe("review_required");
    expect(result.precision.drift_count).toBe(1);
    expect(result.precision.examples[0]).toMatchObject({
      cube_uuid: "cube-a",
      field: "from",
      axis: "x",
      suggested: 0,
    });
    expect(result.degenerate_cubes.count).toBe(1);
    expect(result.duplicate_bone_names.name_count).toBe(1);
    expect(result.duplicate_bone_names.examples[0].count).toBe(2);
  });

  test("clean geometry stays compact", () => {
    const result = analyzeGeometryHygiene(
      [
        {
          uuid: "cube",
          name: "cube",
          from: [0, 0, 0],
          to: [16, 16, 16],
          origin: [8, 8, 8],
          rotation: [0, 0, 0],
        },
      ],
      [{ uuid: "root", name: "root" }]
    );
    expect(result.state).toBe("clean");
    expect(result.precision.drift_count).toBe(0);
    expect(result.degenerate_cubes.count).toBe(0);
    expect(result.duplicate_bone_names.name_count).toBe(0);
  });

  test("projected reference fidelity identifies the weakest coarse view without claiming silhouette PASS", () => {
    const result = analyzeProjectedEnvelopeFidelity({
      model_bounds: { min: [0, 0, 0], max: [16, 16, 8] },
      reference_bounds: { min: [0, 0, 0], max: [16, 16, 16] },
    });

    expect(result.state).toBe("available");
    if (result.state !== "available") throw new Error("expected reference fidelity");
    expect(result.silhouette_fidelity).toBe(false);
    expect(result.visual_verdict).toBe("not_evaluated");
    expect(result.views.front.iou).toBe(1);
    expect(result.views.side.iou).toBe(0.5);
    expect(result.views.side.source_coverage).toBe(0.5);
    expect(result.views.side.model_precision).toBe(1);
    expect(result.views.top.iou).toBe(0.5);
    expect(result.average_iou).toBe(0.6667);
    expect(result.worst_view).toBe("side");
    expect(result.review_order).toEqual(["side", "top", "front"]);
    expect(result.volume_envelope.dimension_ratio.length).toBe(0.5);
  });

  test("surface warnings become a compact machine-readable risk summary", () => {
    const result = summarizeSurfaceQualityWarnings([
      "1 hidden/non-rendered Cube(s) were excluded from rendered bounds.",
      "Possible z-fighting: Cube A and Cube B expose overlapping surfaces.",
      "Possible micro-gap: Cube C and Cube D have a narrow seam.",
      "Surface-quality diagnostics stopped after 20000 nearby Cube pair(s); absence of further warnings is not a clean-surface claim.",
      "3 additional surface-quality warning(s) were omitted from this bounded diagnostic.",
    ]);

    expect(result.state).toBe("review_required");
    expect(result.counts.z_fighting).toBe(1);
    expect(result.counts.micro_gap).toBe(1);
    expect(result.categorized_risk_count).toBe(2);
    expect(result.additional_warnings_omitted).toBe(3);
    expect(result.scan_complete).toBe(false);
    expect(result.details_complete).toBe(false);
  });

  test("rig graph reports hierarchy and bounded pivot review hints without inventing a failure", () => {
    const result = analyzeRigGraph([
      { uuid: "root", name: "root", origin: [0, 0, 0], parent_uuid: null },
      { uuid: "arm", name: "arm", origin: [0, 0, 0], parent_uuid: "root" },
      { uuid: "hand", name: "hand", origin: [1, 0, 0], parent_uuid: "root" },
    ]);

    expect(result.state).toBe("valid_graph");
    if (result.state !== "valid_graph") throw new Error("expected valid rig graph");
    expect(result.group_count).toBe(3);
    expect(result.root_count).toBe(1);
    expect(result.leaf_count).toBe(2);
    expect(result.branch_group_count).toBe(1);
    expect(result.max_depth).toBe(1);
    expect(result.pivot_edges.measured_count).toBe(2);
    expect(result.pivot_edges.coincident_count).toBe(1);
    expect(result.pivot_edges.max).toBe(1);
    expect(result.review_hints).toContain("COINCIDENT_PARENT_CHILD_PIVOT");
  });

  test("rig graph fails closed on unresolved parent identity", () => {
    const result = analyzeRigGraph([
      { uuid: "arm", name: "arm", origin: [0, 0, 0], parent_uuid: "missing" },
    ]);
    expect(result.state).toBe("invalid_graph");
    expect(result.unresolved_parent_count).toBe(1);
  });

  test("texture color profile is deterministic, sampled, and palette-bounded", () => {
    const pixels = new Uint8ClampedArray([
      255, 0, 0, 255,
      255, 0, 0, 255,
      0, 0, 255, 255,
      0, 0, 0, 0,
    ]);
    const first = analyzeTextureColorProfile(pixels, 2, 2, {
      maxSamples: 4,
      paletteSize: 2,
    });
    const second = analyzeTextureColorProfile(pixels, 2, 2, {
      maxSamples: 4,
      paletteSize: 2,
    });

    expect(first).toEqual(second);
    expect(first.sampling.sampled_pixels).toBe(4);
    expect(first.alpha.visible_coverage).toBe(0.75);
    expect(first.palette).toHaveLength(2);
    expect(first.palette[0].hex).toBe("#ff0000");
    expect(first.palette[0].visible_ratio).toBe(0.6667);
    expect(first.luma?.span).toBeGreaterThan(0);
  });

  test("root motion reports Bedrock-scale displacement and stable velocity", () => {
    const result = analyzeRootMotionTrack({
      uuid: "root",
      name: "root",
      keyframes: [
        { time: 0, value: [0, 0, 0] },
        { time: 0.5, value: [8, 0, 0] },
        { time: 1, value: [16, 0, 0] },
      ],
    });

    expect(result.state).toBe("available");
    if (result.state !== "available") throw new Error("expected root motion");
    expect(result.displacement_blocks).toEqual([1, 0, 0]);
    expect(result.horizontal_speed_blocks_per_second).toBe(1);
    expect(result.dominant_axis).toBe("x");
    expect(result.speed_consistency.state).toBe("stable");
  });

  test("root motion chooses the strongest horizontal root and ignores Molang-only tracks", () => {
    const result = analyzeRootMotionTracks([
      {
        uuid: "molang",
        name: "molang",
        keyframes: [
          { time: 0, value: ["query.foo", 0, 0] },
          { time: 1, value: ["query.foo", 0, 0] },
        ],
      },
      {
        uuid: "slow",
        name: "slow",
        keyframes: [
          { time: 0, value: [0, 0, 0] },
          { time: 1, value: [8, 0, 0] },
        ],
      },
      {
        uuid: "fast",
        name: "fast",
        keyframes: [
          { time: 0, value: [0, 0, 0] },
          { time: 1, value: [32, 0, 0] },
        ],
      },
    ]);

    expect(result.state).toBe("available");
    if (result.state !== "available") throw new Error("expected root motion summary");
    expect(result.primary.track.uuid).toBe("fast");
    expect(result.primary.horizontal_distance_blocks).toBe(2);
  });
});
