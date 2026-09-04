import { z } from "zod";

export const THREE_D_ASSISTED_STATE_SCHEMA_VERSION = 1 as const;
export const THREE_D_ASSISTED_DECOMPOSITION_SCHEMA_VERSION = 1 as const;
export const THREE_D_ASSISTED_UNITS_PER_BLOCK = 16 as const;
export const THREE_D_ASSISTED_MAX_PRIMITIVES = 256 as const;

export const THREE_D_ASSISTED_HUNYUAN_V1 = {
  pipeline: "hunyuan3d-2mv",
  upstream_source_commit: "f8db63096c8282cb27354314d896feba5ba6ff8a",
  model_id: "tencent/Hunyuan3D-2mv",
  model_revision: "3a761b539b29fe4ff64714813aa9560fd66f5de0",
  model_subfolder: "hunyuan3d-dit-v2-mv",
  variant: "fp16",
  inference_steps: 50,
  guidance_scale: 5,
  octree_resolution: 256,
  num_chunks: 20_000,
  seed: 12_345,
  texture: false,
} as const;

export const THREE_D_ASSISTED_PRIMITIVEANYTHING_V1 = {
  source_commit: "50586e55702cc91a81f205c3e1ea78853ce318b1",
  method: "primitiveanything-mixed-primitives-to-oriented-cuboids",
} as const;

const sha256Schema = z
  .string()
  .regex(/^[0-9a-f]{64}$/, "Expected lower-case SHA-256 hex.");

const finiteVec3Schema = z.tuple([
  z.number().finite(),
  z.number().finite(),
  z.number().finite(),
]);

const positiveVec3Schema = z.tuple([
  z.number().finite().positive(),
  z.number().finite().positive(),
  z.number().finite().positive(),
]);

const dimensionsBlocksSchema = z
  .object({
    width: z.number().finite().positive(),
    height: z.number().finite().positive(),
    length: z.number().finite().positive(),
  })
  .strict();

export type ThreeDAssistedDimensionsBlocks = {
  width: number;
  height: number;
  length: number;
};

export function parseThreeDAssistedWorkspaceReadme(readme: string): {
  strategy: "3D_ASSISTED";
  requested_dimensions_blocks: ThreeDAssistedDimensionsBlocks;
} {
  if (!/Geometry Strategy:\s*3D_ASSISTED\b/i.test(readme)) {
    throw new Error(
      "Active Workspace README must contain `Geometry Strategy: 3D_ASSISTED`."
    );
  }
  const match = readme.match(
    /Requested Dimensions:\s*width\s*=\s*([0-9]+(?:\.[0-9]+)?)\s+height\s*=\s*([0-9]+(?:\.[0-9]+)?)\s+length\s*=\s*([0-9]+(?:\.[0-9]+)?)\s+blocks\b/i
  );
  if (!match) {
    throw new Error(
      "Active Workspace README must contain `Requested Dimensions: width=<n> height=<n> length=<n> blocks`."
    );
  }
  const dimensions = dimensionsBlocksSchema.parse({
    width: Number(match[1]),
    height: Number(match[2]),
    length: Number(match[3]),
  });
  return {
    strategy: "3D_ASSISTED",
    requested_dimensions_blocks: dimensions,
  };
}

export function sameThreeDAssistedDimensions(
  left: ThreeDAssistedDimensionsBlocks,
  right: ThreeDAssistedDimensionsBlocks
): boolean {
  return (
    Math.abs(left.width - right.width) <= 1e-9 &&
    Math.abs(left.height - right.height) <= 1e-9 &&
    Math.abs(left.length - right.length) <= 1e-9
  );
}

const viewHashesSchema = z
  .object({
    left: sha256Schema,
    front: sha256Schema,
    back: sha256Schema,
  })
  .strict();

const hunyuanImplementationSchema = z
  .object({
    pipeline: z.literal(THREE_D_ASSISTED_HUNYUAN_V1.pipeline),
    upstream_source_commit: z.literal(
      THREE_D_ASSISTED_HUNYUAN_V1.upstream_source_commit
    ),
    model_id: z.literal(THREE_D_ASSISTED_HUNYUAN_V1.model_id),
    model_revision: z.literal(THREE_D_ASSISTED_HUNYUAN_V1.model_revision),
    model_subfolder: z.literal(THREE_D_ASSISTED_HUNYUAN_V1.model_subfolder),
    variant: z.literal(THREE_D_ASSISTED_HUNYUAN_V1.variant),
    inference_steps: z.literal(50),
    guidance_scale: z.literal(5),
    octree_resolution: z.literal(256),
    num_chunks: z.literal(20_000),
    seed: z.literal(12_345),
    texture: z.literal(false),
  })
  .strict();

const primitiveAnythingImplementationSchema = z
  .object({
    source_commit: z.literal(
      THREE_D_ASSISTED_PRIMITIVEANYTHING_V1.source_commit
    ),
    method: z.literal(THREE_D_ASSISTED_PRIMITIVEANYTHING_V1.method),
  })
  .strict();

const shapeStageSchema = z
  .object({
    status: z.enum(["pending", "awaiting_gate", "passed"]),
    implementation: hunyuanImplementationSchema,
    candidate_sha256: sha256Schema.optional(),
    artifact: z.literal("shape.glb").optional(),
    sha256: sha256Schema.optional(),
  })
  .strict()
  .superRefine((value, ctx) => {
    const candidate = value.status === "awaiting_gate";
    const accepted = value.status === "passed";
    if (candidate !== (value.candidate_sha256 !== undefined)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Shape candidate SHA must exist exactly while Shape GLB Gate is awaiting review.",
      });
    }
    if (accepted !== (value.artifact !== undefined && value.sha256 !== undefined)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Shape artifact + SHA must exist exactly when Shape GLB Gate status is passed.",
      });
    }
  });

const decompositionStageSchema = z
  .object({
    status: z.enum(["pending", "awaiting_gate", "passed"]),
    implementation: primitiveAnythingImplementationSchema,
    candidate_sha256: sha256Schema.optional(),
    preview_sha256: sha256Schema.optional(),
    candidate_dimensions_blocks: dimensionsBlocksSchema.optional(),
    artifact: z.literal("primitive-decomposition.json").optional(),
    sha256: sha256Schema.optional(),
  })
  .strict()
  .superRefine((value, ctx) => {
    const candidate = value.status === "awaiting_gate";
    const accepted = value.status === "passed";
    if (
      candidate !==
      (
        value.candidate_sha256 !== undefined &&
        value.preview_sha256 !== undefined &&
        value.candidate_dimensions_blocks !== undefined
      )
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Decomposition candidate + preview SHAs must exist exactly while the gate is awaiting review.",
      });
    }
    if (accepted !== (value.artifact !== undefined && value.sha256 !== undefined)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Decomposition artifact + SHA must exist exactly when Primitive Decomposition Gate status is passed.",
      });
    }
  });

export const threeDAssistedStateSchema = z
  .object({
    schema_version: z.literal(THREE_D_ASSISTED_STATE_SCHEMA_VERSION),
    strategy: z.literal("3D_ASSISTED"),
    reference: z
      .object({
        path: z.literal("references/approved-reference.png"),
        sha256: sha256Schema,
      })
      .strict(),
    view_extraction: z
      .object({
        status: z.enum(["pending", "passed"]),
        reference_sha256: sha256Schema.optional(),
        hashes: viewHashesSchema.optional(),
      })
      .strict()
      .superRefine((value, ctx) => {
        const passed = value.status === "passed";
        if (
          passed !==
          (value.reference_sha256 !== undefined && value.hashes !== undefined)
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "View hashes + source reference SHA must exist exactly when extraction status is passed.",
          });
        }
      }),
    shape_reconstruction: shapeStageSchema,
    primitive_decomposition: decompositionStageSchema,
    last_valid_external_resume_point: z.enum([
      "reference",
      "views",
      "shape",
      "decomposition",
    ]),
  })
  .strict()
  .superRefine((value, ctx) => {
    if (
      value.shape_reconstruction.status !== "passed" &&
      value.primitive_decomposition.status !== "pending"
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["primitive_decomposition", "status"],
        message:
          "Primitive decomposition cannot advance until Shape GLB Gate has passed.",
      });
    }
    if (
      value.primitive_decomposition.status === "passed" &&
      value.last_valid_external_resume_point !== "decomposition"
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["last_valid_external_resume_point"],
        message:
          "Passed decomposition requires decomposition as the last valid external resume point.",
      });
    }
  });

export type ThreeDAssistedState = z.infer<typeof threeDAssistedStateSchema>;

export function freshThreeDAssistedState(
  referenceSha256: string
): ThreeDAssistedState {
  return threeDAssistedStateSchema.parse({
    schema_version: THREE_D_ASSISTED_STATE_SCHEMA_VERSION,
    strategy: "3D_ASSISTED",
    reference: {
      path: "references/approved-reference.png",
      sha256: referenceSha256,
    },
    view_extraction: { status: "pending" },
    shape_reconstruction: {
      status: "pending",
      implementation: THREE_D_ASSISTED_HUNYUAN_V1,
    },
    primitive_decomposition: {
      status: "pending",
      implementation: THREE_D_ASSISTED_PRIMITIVEANYTHING_V1,
    },
    last_valid_external_resume_point: "reference",
  });
}

export function resetThreeDAssistedAfterReferenceChange(
  referenceSha256: string
): ThreeDAssistedState {
  return freshThreeDAssistedState(referenceSha256);
}

const primitiveAnythingCandidateObjectSchema = z
  .object({
    schema_version: z.literal(1),
    method: z.literal(THREE_D_ASSISTED_PRIMITIVEANYTHING_V1.method),
    primitiveanything_source_commit: z.literal(
      THREE_D_ASSISTED_PRIMITIVEANYTHING_V1.source_commit
    ),
    source_json: z.string().min(1),
    coordinate_conversion: z
      .object({
        description: z.string().min(1),
        matrix: z
          .array(z.array(z.number().finite()).length(3))
          .length(3),
      })
      .strict(),
    uniform_scale: z.number().finite().positive(),
    raw_bounds: z.tuple([finiteVec3Schema, finiteVec3Schema]),
    final_bounds: z.tuple([finiteVec3Schema, finiteVec3Schema]),
    cuboids: z
      .array(
        z
          .object({
            name: z.string().regex(/^pa_\d{3,}$/),
            source_type: z.enum(["CubeBevel", "SphereSharp", "CylinderSharp"]),
            source_type_id: z.union([
              z.literal(1101002001034001),
              z.literal(1101002001034010),
              z.literal(1101002001034002),
            ]),
            center: finiteVec3Schema,
            size: positiveVec3Schema,
            rotation_xyz: finiteVec3Schema,
            pivot: finiteVec3Schema,
          })
          .strict()
      )
      .min(1)
      .max(THREE_D_ASSISTED_MAX_PRIMITIVES),
  })
  .strict();

export const primitiveAnythingCandidateSchema =
  primitiveAnythingCandidateObjectSchema.superRefine((value, ctx) => {
    const expectedMatrix = [
      [1, 0, 0],
      [0, 0, 1],
      [0, -1, 0],
    ];
    value.coordinate_conversion.matrix.forEach((row, rowIndex) => {
      row.forEach((entry, columnIndex) => {
        if (entry !== expectedMatrix[rowIndex][columnIndex]) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["coordinate_conversion", "matrix", rowIndex, columnIndex],
            message:
              "PrimitiveAnything coordinate conversion must stay x'=x, y'=z, z'=-y.",
          });
        }
      });
    });

    const names = new Set<string>();
    for (const [index, cuboid] of value.cuboids.entries()) {
      if (names.has(cuboid.name)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["cuboids", index, "name"],
          message: "Primitive names must be unique.",
        });
      }
      names.add(cuboid.name);
      const expectedTypeId = {
        CubeBevel: 1101002001034001,
        SphereSharp: 1101002001034010,
        CylinderSharp: 1101002001034002,
      }[cuboid.source_type];
      if (cuboid.source_type_id !== expectedTypeId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["cuboids", index, "source_type_id"],
          message: "Primitive type and type ID must match the pinned PrimitiveAnything v1 mapping.",
        });
      }
      if (cuboid.rotation_xyz.some((entry) => entry < -180 || entry > 180)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["cuboids", index, "rotation_xyz"],
          message: "v1 Cuboid rotations must be normalized to [-180, 180] degrees.",
        });
      }
      if (
        cuboid.pivot.some(
          (entry, axis) => Math.abs(entry - cuboid.center[axis]) > 1e-6
        )
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["cuboids", index, "pivot"],
          message:
            "v1 decomposition requires each primitive pivot to equal its oriented Cuboid center.",
        });
      }
    }
  });

const threeDAssistedDecompositionObjectSchema = z
  .object({
    schema_version: z.literal(THREE_D_ASSISTED_DECOMPOSITION_SCHEMA_VERSION),
    method: z.literal(THREE_D_ASSISTED_PRIMITIVEANYTHING_V1.method),
    primitiveanything_source_commit: z.literal(
      THREE_D_ASSISTED_PRIMITIVEANYTHING_V1.source_commit
    ),
    reference_sha256: sha256Schema,
    shape_sha256: sha256Schema,
    blockbench_units_per_block: z.literal(THREE_D_ASSISTED_UNITS_PER_BLOCK),
    requested_dimensions_blocks: dimensionsBlocksSchema,
    requested_dimensions_blockbench_units: z
      .object({
        width: z.number().finite().positive(),
        height: z.number().finite().positive(),
        depth: z.number().finite().positive(),
      })
      .strict(),
    coordinate_conversion:
      primitiveAnythingCandidateObjectSchema.shape.coordinate_conversion,
    uniform_scale: z.number().finite().positive(),
    final_bounds: z.tuple([finiteVec3Schema, finiteVec3Schema]),
    cuboids: primitiveAnythingCandidateObjectSchema.shape.cuboids,
  })
  .strict();

export const threeDAssistedDecompositionSchema =
  threeDAssistedDecompositionObjectSchema.superRefine((value, ctx) => {
    const expectedUnits = {
      width:
        value.requested_dimensions_blocks.width *
        THREE_D_ASSISTED_UNITS_PER_BLOCK,
      height:
        value.requested_dimensions_blocks.height *
        THREE_D_ASSISTED_UNITS_PER_BLOCK,
      depth:
        value.requested_dimensions_blocks.length *
        THREE_D_ASSISTED_UNITS_PER_BLOCK,
    };
    for (const key of ["width", "height", "depth"] as const) {
      if (
        Math.abs(value.requested_dimensions_blockbench_units[key] - expectedUnits[key]) >
        1e-6
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["requested_dimensions_blockbench_units", key],
          message: `Expected ${expectedUnits[key]} Blockbench units from the stored block dimensions.`,
        });
      }
    }

    const [min, max] = value.final_bounds;
    const extent = [max[0] - min[0], max[1] - min[1], max[2] - min[2]];
    const limits = [expectedUnits.width, expectedUnits.height, expectedUnits.depth];
    extent.forEach((entry, axis) => {
      if (!Number.isFinite(entry) || entry <= 0 || entry > limits[axis] + 1e-5) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["final_bounds"],
          message:
            "Final Cuboid bounds must be positive, finite, and fit inside requested dimensions.",
        });
      }
    });
  });

export type ThreeDAssistedDecomposition = z.infer<
  typeof threeDAssistedDecompositionSchema
>;

export type ThreeDAssistedMaterializationItem = {
  group_name: string;
  group_origin: [number, number, number];
  group_rotation: [number, number, number];
  cube_name: string;
  cube_from: [number, number, number];
  cube_to: [number, number, number];
};

function finiteVec3(values: number[]): [number, number, number] {
  if (
    values.length !== 3 ||
    values.some((value) => !Number.isFinite(value))
  ) {
    throw new Error("Materialization produced a non-finite 3D vector.");
  }
  return [values[0], values[1], values[2]];
}

export function buildThreeDAssistedMaterializationPlan(
  raw: unknown
): ThreeDAssistedMaterializationItem[] {
  const decomposition = threeDAssistedDecompositionSchema.parse(raw);
  return decomposition.cuboids.map((cuboid) => {
    const half = cuboid.size.map((entry) => entry / 2);
    const from = cuboid.center.map((entry, axis) => entry - half[axis]);
    const to = cuboid.center.map((entry, axis) => entry + half[axis]);
    return {
      group_name: cuboid.name,
      group_origin: finiteVec3([...cuboid.pivot]),
      group_rotation: finiteVec3([...cuboid.rotation_xyz]),
      cube_name: `${cuboid.name}_cube`,
      cube_from: finiteVec3(from),
      cube_to: finiteVec3(to),
    };
  });
}

export function canonicalizePrimitiveAnythingCandidate(input: {
  candidate: unknown;
  reference_sha256: string;
  shape_sha256: string;
  requested_dimensions_blocks: {
    width: number;
    height: number;
    length: number;
  };
}): ThreeDAssistedDecomposition {
  const candidate = primitiveAnythingCandidateSchema.parse(input.candidate);
  const dimensions = dimensionsBlocksSchema.parse(input.requested_dimensions_blocks);
  return threeDAssistedDecompositionSchema.parse({
    schema_version: THREE_D_ASSISTED_DECOMPOSITION_SCHEMA_VERSION,
    method: candidate.method,
    primitiveanything_source_commit: candidate.primitiveanything_source_commit,
    reference_sha256: input.reference_sha256,
    shape_sha256: input.shape_sha256,
    blockbench_units_per_block: THREE_D_ASSISTED_UNITS_PER_BLOCK,
    requested_dimensions_blocks: dimensions,
    requested_dimensions_blockbench_units: {
      width: dimensions.width * THREE_D_ASSISTED_UNITS_PER_BLOCK,
      height: dimensions.height * THREE_D_ASSISTED_UNITS_PER_BLOCK,
      depth: dimensions.length * THREE_D_ASSISTED_UNITS_PER_BLOCK,
    },
    coordinate_conversion: candidate.coordinate_conversion,
    uniform_scale: candidate.uniform_scale,
    final_bounds: candidate.final_bounds,
    cuboids: candidate.cuboids,
  });
}
