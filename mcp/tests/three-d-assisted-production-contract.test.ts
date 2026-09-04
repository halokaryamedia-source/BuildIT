import { describe, expect, test } from "bun:test";
import {
  THREE_D_ASSISTED_PRIMITIVEANYTHING_V1,
  THREE_D_ASSISTED_UNITS_PER_BLOCK,
  buildThreeDAssistedMaterializationPlan,
  canonicalizePrimitiveAnythingCandidate,
  freshThreeDAssistedState,
  parseThreeDAssistedWorkspaceReadme,
  primitiveAnythingCandidateSchema,
  threeDAssistedStateSchema,
} from "@/lib/threeDAssistedProduction";

const SHA_A = "a".repeat(64);
const SHA_B = "b".repeat(64);
const SHA_C = "c".repeat(64);

function candidate() {
  return {
    schema_version: 1,
    method: THREE_D_ASSISTED_PRIMITIVEANYTHING_V1.method,
    primitiveanything_source_commit:
      THREE_D_ASSISTED_PRIMITIVEANYTHING_V1.source_commit,
    source_json: "output_shape.json",
    coordinate_conversion: {
      description: "matches upstream demo.py vertex conversion: x'=x, y'=z, z'=-y",
      matrix: [
        [1, 0, 0],
        [0, 0, 1],
        [0, -1, 0],
      ],
    },
    uniform_scale: 1,
    raw_bounds: [
      [-2, 0, -3],
      [2, 8, 3],
    ],
    final_bounds: [
      [-2, 0, -3],
      [2, 8, 3],
    ],
    cuboids: [
      {
        name: "pa_000",
        source_type: "CubeBevel",
        source_type_id: 1101002001034001,
        center: [0, 4, 0],
        size: [4, 8, 6],
        rotation_xyz: [0, 45, 0],
        pivot: [0, 4, 0],
      },
    ],
  };
}

describe("3D-Assisted production contract", () => {
  test("workspace intake is explicit user strategy plus labelled block dimensions", () => {
    const parsed = parseThreeDAssistedWorkspaceReadme(`
Geometry Strategy: 3D_ASSISTED
Requested Dimensions: width=2 height=3 length=4 blocks
`);
    expect(parsed).toEqual({
      strategy: "3D_ASSISTED",
      requested_dimensions_blocks: { width: 2, height: 3, length: 4 },
    });
    expect(() =>
      parseThreeDAssistedWorkspaceReadme(`
Geometry Strategy: DIRECT
Requested Dimensions: width=2 height=3 length=4 blocks
`)
    ).toThrow();
    expect(() =>
      parseThreeDAssistedWorkspaceReadme(`
Geometry Strategy: 3D_ASSISTED
Requested Dimensions: 2 x 3 x 4 blocks
`)
    ).toThrow();
  });

  test("external state is resumable but cannot claim passed gates without canonical hashes", () => {
    const state = freshThreeDAssistedState(SHA_A);
    expect(state.last_valid_external_resume_point).toBe("reference");
    expect(state.shape_reconstruction.status).toBe("pending");

    expect(
      threeDAssistedStateSchema.safeParse({
        ...state,
        shape_reconstruction: {
          ...state.shape_reconstruction,
          status: "awaiting_gate",
        },
      }).success
    ).toBe(false);

    const shapePassed = threeDAssistedStateSchema.parse({
      ...state,
      shape_reconstruction: {
        ...state.shape_reconstruction,
        status: "passed",
        artifact: "shape.glb",
        sha256: SHA_B,
      },
      last_valid_external_resume_point: "shape",
    });
    expect(
      threeDAssistedStateSchema.safeParse({
        ...shapePassed,
        primitive_decomposition: {
          ...shapePassed.primitive_decomposition,
          status: "awaiting_gate",
          candidate_sha256: SHA_C,
          preview_sha256: SHA_C,
        },
      }).success
    ).toBe(false);
  });

  test("PrimitiveAnything candidate is strict deterministic data only", () => {
    expect(primitiveAnythingCandidateSchema.parse(candidate()).cuboids).toHaveLength(1);

    const wrongMatrix = candidate();
    wrongMatrix.coordinate_conversion.matrix[1][1] = 1;
    expect(primitiveAnythingCandidateSchema.safeParse(wrongMatrix).success).toBe(false);

    const wrongPivot = candidate();
    wrongPivot.cuboids[0].pivot = [1, 4, 0];
    expect(primitiveAnythingCandidateSchema.safeParse(wrongPivot).success).toBe(false);

    const wrongTypeId = candidate();
    wrongTypeId.cuboids[0].source_type_id = 1101002001034010;
    expect(primitiveAnythingCandidateSchema.safeParse(wrongTypeId).success).toBe(false);

    expect(
      primitiveAnythingCandidateSchema.safeParse({
        ...candidate(),
        command: "from_geo_json",
      }).success
    ).toBe(false);
  });

  test("canonical decomposition pins provenance and requested dimensions", () => {
    const canonical = canonicalizePrimitiveAnythingCandidate({
      candidate: candidate(),
      reference_sha256: SHA_A,
      shape_sha256: SHA_B,
      requested_dimensions_blocks: { width: 1, height: 1, length: 1 },
    });
    expect(canonical.reference_sha256).toBe(SHA_A);
    expect(canonical.shape_sha256).toBe(SHA_B);
    expect(canonical.blockbench_units_per_block).toBe(
      THREE_D_ASSISTED_UNITS_PER_BLOCK
    );
    expect(canonical.requested_dimensions_blockbench_units).toEqual({
      width: 16,
      height: 16,
      depth: 16,
    });
  });

  test("materialization plan preserves one primitive as one rotated Group plus one native Cube", () => {
    const canonical = canonicalizePrimitiveAnythingCandidate({
      candidate: candidate(),
      reference_sha256: SHA_A,
      shape_sha256: SHA_B,
      requested_dimensions_blocks: { width: 1, height: 1, length: 1 },
    });
    expect(buildThreeDAssistedMaterializationPlan(canonical)).toEqual([
      {
        group_name: "pa_000",
        group_origin: [0, 4, 0],
        group_rotation: [0, 45, 0],
        cube_name: "pa_000_cube",
        cube_from: [-2, 0, -3],
        cube_to: [2, 8, 3],
      },
    ]);
  });

  test("production orchestration pauses at visual gates and materializer stays fail-closed", async () => {
    const [orchestrator, materializer, packageText, paRunner, extractor] =
      await Promise.all([
        Bun.file("scripts/three-d-assisted-run.ts").text(),
        Bun.file("server/threeDAssistedMaterializer.ts").text(),
        Bun.file("package.json").text(),
        Bun.file("../Experimental/primitiveanything-poc/run_production.sh").text(),
        Bun.file("scripts/three-d-assisted/extract_reference_views.py").text(),
      ]);

    expect(orchestrator).toContain("AWAITING_SHAPE_GATE");
    expect(orchestrator).toContain("AWAITING_DECOMPOSITION_GATE");
    expect(orchestrator).toContain("accept-shape");
    expect(orchestrator).toContain("accept-decomposition");
    expect(orchestrator).toContain("candidate_sha256");
    expect(orchestrator).toContain("references");
    expect(orchestrator).toContain("approved-reference.png");
    expect(orchestrator).not.toContain("from_geo_json");

    const preflight = materializer.indexOf("assertScaffoldNamesAvailable(plan)");
    const undo = materializer.indexOf("Undo.initEdit({");
    expect(preflight).toBeGreaterThan(-1);
    expect(undo).toBeGreaterThan(preflight);
    expect(materializer).toContain("Undo.cancelEdit(true)");
    expect(materializer).toContain("assertMaterializedScaffold(plan, groups, cubes)");
    expect(materializer).toContain("new Group({");
    expect(materializer).toContain("new Cube({");
    expect(materializer).toContain("primitive-decomposition.json");
    expect(materializer).not.toContain("from_geo_json");
    expect(materializer).not.toContain("primitive_array");

    expect(JSON.parse(packageText).scripts["three-d-assisted:run"]).toContain(
      "three-d-assisted-run.ts"
    );
    expect(paRunner).toContain('PA_COMMIT="50586e55702cc91a81f205c3e1ea78853ce318b1"');
    expect(paRunner).toContain('git -C "$PA_ROOT" rev-parse HEAD');
    expect(paRunner).toContain("Checkpoint SHA-256 mismatch");
    expect(paRunner).toContain("--target-width");
    expect(paRunner).toContain("--target-height");
    expect(paRunner).toContain("--target-depth");
    expect(extractor).toContain('"left": crop_box');
    expect(extractor).toContain('"front": crop_box');
    expect(extractor).toContain('"back": crop_box');
  });
});
