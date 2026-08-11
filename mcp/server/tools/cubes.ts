/// <reference types="three" />
/// <reference types="blockbench-types" />
import { z } from "zod";
import { createTool, type ToolSpec } from "@/lib/factories";
import { cubeSchema, faceEnum } from "@/lib/zodObjects";
import { STATUS_STABLE } from "@/lib/constants";
import { resolveCoreCube, resolveCoreGroup, resolveCoreTexture } from "@/lib/coreIdentity";

const finiteVec3Schema = z.tuple([
  z.number().finite(),
  z.number().finite(),
  z.number().finite(),
]);
function hasFiniteCubeSpan(
  from: readonly number[],
  to: readonly number[]
): boolean {
  return (
    from.length === 3 &&
    to.length === 3 &&
    from.every(Number.isFinite) &&
    to.every(Number.isFinite) &&
    to.every((entry, axis) => Number.isFinite(entry - from[axis]))
  );
}

function requireFiniteCubeSpan(
  from: readonly number[],
  to: readonly number[],
  context: string
): void {
  if (!hasFiniteCubeSpan(from, to)) {
    throw new Error(
      `${context} would produce a non-finite Cube size. Use finite from/to coordinates whose per-axis difference is also finite.`
    );
  }
}

function hasNonZeroRotation(rotation?: readonly number[]): boolean {
  return rotation?.some((value) => value !== 0) ?? false;
}

const placeCubeElementSchema = cubeSchema
  .extend({
    from: finiteVec3Schema.describe(
      "Required finite Cube start coordinates [x,y,z]."
    ),
    to: finiteVec3Schema.describe(
      "Required finite Cube end coordinates [x,y,z]."
    ),
    origin: finiteVec3Schema
      .optional()
      .describe(
        "Cube pivot [x,y,z]. Required for non-zero rotation; optional otherwise."
      ),
    rotation: finiteVec3Schema
      .optional()
      .default([0, 0, 0])
      .describe(
        "Cube rotation in degrees [x,y,z]; non-zero rotation requires origin."
      ),
  })
  .refine(
    (element) =>
      !hasNonZeroRotation(element.rotation) || element.origin !== undefined,
    {
      message:
        "A rotated Cube requires an explicit origin/pivot. Do not rely on an automatic [0,0,0] pivot for non-zero rotation.",
      path: ["origin"],
    }
  )
  .refine((element) => hasFiniteCubeSpan(element.from, element.to), {
    message:
      "Cube from/to must produce a finite per-axis size; finite endpoints that overflow during subtraction are rejected.",
    path: ["to"],
  });

const cubeCorrectionUpdateSchema = z
  .object({
    id: z
      .string()
      .min(1)
      .describe(
        "Exact Cube UUID; names and selection are not accepted for batch correction."
      ),
    origin: finiteVec3Schema
      .optional()
      .describe(
        "New pivot. Origin-only preserves visual position; with from/to/rotation it is an authored transform rewrite."
      ),
    from: finiteVec3Schema
      .optional()
      .describe("New authored Cube from coordinates."),
    to: finiteVec3Schema
      .optional()
      .describe("New authored Cube to coordinates."),
    rotation: finiteVec3Schema
      .optional()
      .describe(
        "New rotation in degrees. Activating non-zero rotation requires origin; an already-rotated Cube may reuse its pivot."
      ),
    visibility: z
      .boolean()
      .optional()
      .describe("New Cube visibility."),
  })
  .refine(
    (update) =>
      update.origin !== undefined ||
      update.from !== undefined ||
      update.to !== undefined ||
      update.rotation !== undefined ||
      update.visibility !== undefined,
    {
      message:
        "Each update must change at least one authored field: origin, from, to, rotation, or visibility.",
    }
  );

export const placeCubeParameters = z.object({
  elements: z
    .array(placeCubeElementSchema)
    .min(1)
    .describe(
      "Cubes to place. Each requires finite from/to; rotated Cubes also require origin."
    ),
  texture: z
    .string()
    .optional()
    .describe(
      "Optional Texture UUID, exact ID, or unique exact name; unresolved/ambiguous references fail."
    ),
  group: z
    .string()
    .optional()
    .describe(
      "Optional Group UUID or unique exact name; omit/use `root` only for intentional root placement."
    ),
  faces: z
    .union([
      z
        .array(faceEnum)
        .max(6)
        .refine((faces) => new Set(faces).size === faces.length, {
          message: "Each Cube face may appear at most once.",
        })
        .describe("Unique Cube faces to apply the texture to."),
      z
        .boolean()
        .optional()
        .describe(
          "Whether to apply the texture to all faces. Set to `true` to enable auto UV mapping."
        ),
      z
        .array(
          z.object({
            face: faceEnum.describe("Face to apply the texture to."),
            uv: z
              .array(z.number()).length(4)
              .describe("Custom UV mapping for the face."),
          })
        )
        .max(6)
        .refine(
          (entries) => new Set(entries.map((entry) => entry.face)).size === entries.length,
          { message: "Each custom-UV Cube face may appear at most once." }
        )
        .describe("Unique Cube faces with custom UV mapping."),
    ])
    .optional()
    .default(true)
    .describe(
      "Faces to apply the texture to. Set to `true` to enable auto UV mapping."
    ),
});

export const modifyCubeParameters = z.object({
  id: z
    .string()
    .min(1)
    .describe(
      "Required Cube UUID or unique exact name; selection is never an implicit target."
    ),
  name: z.string().min(1).optional().describe("New non-empty Cube name."),
  origin: finiteVec3Schema
    .optional()
    .describe(
      "Cube pivot. Origin-only preserves visual position; with from/to/rotation it rewrites the authored transform."
    ),
  from: finiteVec3Schema
    .optional()
    .describe("Starting point of the cube."),
  to: finiteVec3Schema
    .optional()
    .describe("Ending point of the cube."),
  rotation: finiteVec3Schema
    .optional()
    .describe(
      "Cube rotation. Activating non-zero rotation requires origin; an already-rotated Cube may reuse its pivot."
    ),
  autouv: z
    .enum(["0", "1", "2"])
    .optional()
    .describe(
      "Auto UV setting. 0 = disabled, 1 = enabled, 2 = relative auto UV."
    ),
  uv_offset: z
    .array(z.number()).length(2)
    .optional()
    .describe("UV offset for the texture."),
  mirror_uv: z.boolean().optional().describe("Whether to mirror the UVs."),
  shade: z
    .boolean()
    .optional()
    .describe("Whether to apply shading to the cube."),
  inflate: z.number().optional().describe("Inflation amount for the cube."),
  color: z
    .number()
    .optional()
    .describe("Single digit to represent a color from a palette."),
  visibility: z
    .boolean()
    .optional()
    .describe("Whether the cube is visible or not."),
}).refine(
  (update) =>
    Object.entries(update).some(
      ([key, value]) => key !== "id" && value !== undefined
    ),
  {
    message:
      "modify_cube requires at least one authored field change in addition to id. Inspect the target and send the intended correction; an id-only request is not progress.",
  }
)
.superRefine((update, ctx) => {
  if (
    update.from !== undefined &&
    update.to !== undefined &&
    !hasFiniteCubeSpan(update.from, update.to)
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message:
        "Cube from/to must produce a finite per-axis size; finite endpoints that overflow during subtraction are rejected.",
      path: ["to"],
    });
  }
});

export const modifyCubesBatchParameters = z.object({
  updates: z
    .array(cubeCorrectionUpdateSchema)
    .min(1)
    .max(32)
    .refine(
      (updates) => new Set(updates.map((update) => update.id)).size === updates.length,
      {
        message: "Each Cube UUID may appear only once in a batch correction.",
      }
    )
    .describe(
      "1-32 explicit Cube transform/visibility updates applied in one Undo unit."
    ),
});

export const cubeToolDocs: ToolSpec[] = [
  {
    name: "place_cube",
    description:
      "Places Cubes with explicit finite from/to. Non-zero rotation requires an explicit pivot. Supplied Group/Texture references must resolve uniquely before mutation. Success applies authored state only; visual/reference fidelity is not evaluated.",
    annotations: {
      title: "Place Cube",
      destructiveHint: true,
    },
    parameters: placeCubeParameters,
    status: STATUS_STABLE,
  },
  {
    name: "modify_cube",
    description:
      "Modifies one explicit Cube. UUID is preferred; an exact name must be unique and selection is never implicit. Origin-only uses pivot-transfer semantics; activating non-zero rotation requires origin. Returns before/after authored state and `geometry_effect`; visual/reference fidelity is not evaluated.",
    annotations: {
      title: "Modify Cube",
      destructiveHint: true,
    },
    parameters: modifyCubeParameters,
    status: STATUS_STABLE,
  },
  {
    name: "modify_cubes_batch",
    description:
      "Applies 1-32 explicit UUID-targeted Cube corrections in one recoverable Undo unit after full preflight. Origin-only preserves visual position; activating non-zero rotation requires origin. Returns per-Cube before/after state and `geometry_effect`. It performs no planning or visual judgement; success does not mean the geometry was corrected visually.",
    annotations: {
      title: "Modify Cubes Batch",
      destructiveHint: true,
    },
    parameters: modifyCubesBatchParameters,
    status: STATUS_STABLE,
  },
];

type PlaceCubeElement = z.infer<typeof placeCubeElementSchema>;
type BatchUpdate = z.infer<typeof cubeCorrectionUpdateSchema>;

type CubeTransformIntent = {
  origin?: readonly number[];
  from?: readonly number[];
  to?: readonly number[];
  rotation?: readonly number[];
};

function isPivotOnlyCorrection(update: CubeTransformIntent): boolean {
  return (
    update.origin !== undefined &&
    update.from === undefined &&
    update.to === undefined &&
    update.rotation === undefined
  );
}

function requireIntentionalRotationActivation(
  cube: Cube,
  requestedRotation?: readonly number[],
  requestedOrigin?: readonly number[]
): void {
  if (
    requestedRotation === undefined ||
    !hasNonZeroRotation(requestedRotation) ||
    hasNonZeroRotation(cube.rotation) ||
    requestedOrigin !== undefined
  ) {
    return;
  }

  throw new Error(
    `Cube "${cube.name}" (${cube.uuid}) is currently unrotated. Activating a non-zero rotation requires an explicit origin/pivot in the same update. Inspect the Cube and provide the intended origin; do not silently reuse the existing origin ${JSON.stringify(cube.origin)}.`
  );
}

function requirePivotTransferMesh(cube: Cube): void {
  if (!cube.mesh) {
    throw new Error(
      `Cube "${cube.name}" (${cube.uuid}) has no preview mesh, so a pivot-only transfer cannot safely preserve its visual position. Use inspect_element/canonical views and retry only when the Cube is present in the active rendered project.`
    );
  }
}

function finalCubeState(cube: Cube) {
  const from = [...cube.from] as [number, number, number];
  const to = [...cube.to] as [number, number, number];
  requireFiniteCubeSpan(from, to, `Cube ${cube.name} (${cube.uuid})`);
  const size = [
    to[0] - from[0],
    to[1] - from[1],
    to[2] - from[2],
  ] as [number, number, number];

  return {
    uuid: cube.uuid,
    name: cube.name,
    from,
    to,
    size,
    origin: [...cube.origin] as [number, number, number],
    rotation: [...cube.rotation] as [number, number, number],
    visibility: cube.visibility !== false,
  };
}


type CubeAuthoredState = ReturnType<typeof finalCubeState>;

function vec3Delta(
  after: readonly number[],
  before: readonly number[]
): [number, number, number] {
  return [
    after[0] - before[0],
    after[1] - before[1],
    after[2] - before[2],
  ];
}

function vec3Equal(a: readonly number[], b: readonly number[]): boolean {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}

function cubeStateCenter(state: CubeAuthoredState): [number, number, number] {
  return [
    state.from[0] + state.size[0] / 2,
    state.from[1] + state.size[1] / 2,
    state.from[2] + state.size[2] / 2,
  ];
}

function cubeGeometryEffect(before: CubeAuthoredState, after: CubeAuthoredState) {
  const changedFields: string[] = [];
  if (!vec3Equal(before.from, after.from)) changedFields.push("from");
  if (!vec3Equal(before.to, after.to)) changedFields.push("to");
  if (!vec3Equal(before.origin, after.origin)) changedFields.push("origin");
  if (!vec3Equal(before.rotation, after.rotation)) changedFields.push("rotation");
  if (before.visibility !== after.visibility) changedFields.push("visibility");

  return {
    changed_fields: changedFields,
    center_delta: vec3Delta(cubeStateCenter(after), cubeStateCenter(before)),
    size_delta: vec3Delta(after.size, before.size),
    origin_delta: vec3Delta(after.origin, before.origin),
    rotation_delta: vec3Delta(after.rotation, before.rotation),
    visibility_changed: before.visibility !== after.visibility,
  };
}

function resolveUniqueCube(reference: string): Cube {
  return resolveCoreCube(
    reference,
    "Use list_outline or find_elements_by_criteria, then inspect_element to confirm the intended UUID."
  );
}

function resolvePlacementGroup(reference?: string): Group | "root" {
  if (reference === undefined || reference === "root") return "root";
  return resolveCoreGroup(
    reference,
    'Use list_outline to confirm the intended Group UUID. Omit group or pass "root" only when root placement is intentional.'
  );
}

function resolvePlacementTexture(reference?: string): Texture | null {
  if (reference === undefined) return Texture.getDefault() ?? null;
  return resolveCoreTexture(
    reference,
    "Use list_textures to confirm the intended UUID or texture ID before placing Cubes."
  );
}

export function registerCubesTools() {
createTool(cubeToolDocs[0].name, {
  ...cubeToolDocs[0],
  async execute({ elements, texture, faces, group }) {
    // Resolve explicitly requested texture/hierarchy targets before opening Undo.
    const projectTexture = resolvePlacementTexture(texture);

    // Omitted group (or explicit "root") is the only intentional root fallback.
    const outlinerGroup = resolvePlacementGroup(group);

    const autouv =
      faces === true ||
      (Array.isArray(faces) &&
        faces.every((face) => typeof face === "string"));

    Undo.initEdit({
      elements: [],
      outliner: true,
      collections: [],
    });

    let cubes: Cube[];
    try {
      cubes = elements.map((element: PlaceCubeElement) => {
        const cube = new Cube({
          autouv: autouv ? 1 : 0,
          name: element.name,
          from: element.from as [number, number, number],
          to: element.to as [number, number, number],
          origin: (element.origin ?? [0, 0, 0]) as [number, number, number],
          rotation: element.rotation as [number, number, number],
        }).init();

        cube.addTo(outlinerGroup);

        if (!autouv && Array.isArray(faces)) {
          faces.forEach(({ face, uv }) => {
            cube.faces[face].extend({
              uv: uv as [number, number, number, number],
            });
          });
        } else if (projectTexture) {
          cube.applyTexture(
            projectTexture,
            faces !== false ? faces : undefined
          );
          cube.mapAutoUV();
        }

        return cube;
      });

      Undo.finishEdit("Agent placed cubes", { elements: cubes });
    } catch (error) {
      Undo.cancelEdit(true);
      Canvas.updateAll();
      throw error;
    }

    Canvas.updateAll();
    const result = {
      execution: "applied" as const,
      visual_verdict: "not_evaluated" as const,
      added: cubes.length,
      cubes: cubes.map((cube: Cube) => finalCubeState(cube)),
    };
    return {
      content: [
        {
type: "text" as const,
text: `Placed ${cubes.length} Cube${cubes.length === 1 ? "" : "s"}. Execution succeeded; reference fidelity was not evaluated.`,
        },
      ],
      structuredContent: result,
    };
  },
}, cubeToolDocs[0].status);

createTool(cubeToolDocs[1].name, {
  ...cubeToolDocs[1],
  async execute({
    id,
    name,
    origin,
    from,
    to,
    rotation,
    uv_offset,
    autouv,
    mirror_uv,
    shade,
    inflate,
    color,
    visibility,
  }) {
    const cubes = [resolveUniqueCube(id)];
    const before = finalCubeState(cubes[0]);

    cubes.forEach((cube) =>
      requireIntentionalRotationActivation(cube, rotation, origin)
    );
    requireFiniteCubeSpan(
      from ?? cubes[0].from,
      to ?? cubes[0].to,
      `Cube ${cubes[0].name} (${cubes[0].uuid}) update`
    );

    const pivotOnly = isPivotOnlyCorrection({ origin, from, to, rotation });
    if (pivotOnly) {
      cubes.forEach(requirePivotTransferMesh);
    }

    Undo.initEdit({
      elements: cubes,
      outliner: true,
      collections: [],
    });

    try {
      cubes.forEach((cube) => {
        if (pivotOnly) {
          cube.transferOrigin(origin as [number, number, number]);
        }

        cube.extend({
          ...(name !== undefined ? { name } : {}),
          ...(!pivotOnly && origin !== undefined
            ? { origin: origin as [number, number, number] }
            : {}),
          ...(from !== undefined ? { from: from as [number, number, number] } : {}),
          ...(to !== undefined ? { to: to as [number, number, number] } : {}),
          ...(rotation !== undefined
            ? { rotation: rotation as [number, number, number] }
            : {}),
          ...(uv_offset !== undefined
            ? { uv_offset: uv_offset as [number, number] }
            : {}),
          ...(autouv !== undefined
            ? { autouv: Number(autouv) as 0 | 1 | 2 }
            : {}),
          ...(mirror_uv !== undefined ? { mirror_uv } : {}),
          ...(inflate !== undefined ? { inflate } : {}),
          ...(color !== undefined ? { color } : {}),
          ...(visibility !== undefined ? { visibility } : {}),
          ...(shade !== undefined ? { shade } : {}),
        });
      });

      Undo.finishEdit("Agent modified cubes");
    } catch (error) {
      Undo.cancelEdit(true);
      Canvas.updateAll();
      throw error;
    }

    Canvas.updateAll();
    const after = finalCubeState(cubes[0]);
    const geometryEffect = cubeGeometryEffect(before, after);
    const result = {
      execution: "applied" as const,
      visual_verdict: "not_evaluated" as const,
      modified: cubes.length,
      before,
      after,
      geometry_effect: geometryEffect,
    };
    return {
      content: [
        {
          type: "text" as const,
          text:
            geometryEffect.changed_fields.length === 0
              ? `Applied request to Cube ${cubes[0].name} (${cubes[0].uuid}), but no geometry/visibility field changed. This is not evidence of correction; reference fidelity was not evaluated.`
              : `Applied authored update to Cube ${cubes[0].name} (${cubes[0].uuid}). Structural effect recorded; reference fidelity was not evaluated.`,
        },
      ],
      structuredContent: result,
    };
  },
}, cubeToolDocs[1].status);

createTool(cubeToolDocs[2].name, {
  ...cubeToolDocs[2],
  async execute({ updates }) {
    if (!Project) {
      throw new Error(
        "No project is open. Open or create the intended Bedrock project before modifying Cubes."
      );
    }

    const targets: Array<{
      cube: Cube;
      update: BatchUpdate;
      pivotOnly: boolean;
      before: CubeAuthoredState;
    }> = updates.map((update: BatchUpdate) => {
      const cube = (Cube.all ?? []).find(
        (candidate: Cube) => candidate.uuid === update.id
      );
      if (!cube) {
        throw new Error(
          `Cube UUID "${update.id}" not found. Use list_outline/find_elements_by_criteria, then inspect_element to confirm the exact target UUID before retrying the correction.`
        );
      }

      requireIntentionalRotationActivation(
        cube,
        update.rotation,
        update.origin
      );
      requireFiniteCubeSpan(
        update.from ?? cube.from,
        update.to ?? cube.to,
        `Cube ${cube.name} (${cube.uuid}) batch update`
      );

      const pivotOnly = isPivotOnlyCorrection(update);
      if (pivotOnly) {
        requirePivotTransferMesh(cube);
      }

      return { cube, update, pivotOnly, before: finalCubeState(cube) };
    });

    Undo.initEdit({
      elements: targets.map(({ cube }) => cube),
      outliner: true,
      collections: [],
    });

    try {
      for (const { cube, update, pivotOnly } of targets) {
        if (pivotOnly) {
          cube.transferOrigin(update.origin as [number, number, number]);
        }

        cube.extend({
          ...(!pivotOnly && update.origin !== undefined
            ? { origin: update.origin }
            : {}),
          ...(update.from !== undefined ? { from: update.from } : {}),
          ...(update.to !== undefined ? { to: update.to } : {}),
          ...(update.rotation !== undefined ? { rotation: update.rotation } : {}),
          ...(update.visibility !== undefined
            ? { visibility: update.visibility }
            : {}),
        });
      }

      Undo.finishEdit("Agent modified multiple cubes");
    } catch (error) {
      Undo.cancelEdit(true);
      Canvas.updateAll();
      throw error;
    }

    Canvas.updateAll();
    const effects = targets.map(({ cube, before }) => {
      const after = finalCubeState(cube);
      return {
        uuid: cube.uuid,
        name: cube.name,
        before,
        after,
        geometry_effect: cubeGeometryEffect(before, after),
      };
    });
    const effectiveGeometryTargets = effects.filter(
      ({ geometry_effect }) => geometry_effect.changed_fields.length > 0
    ).length;
    const result = {
      execution: "applied" as const,
      visual_verdict: "not_evaluated" as const,
      modified: targets.length,
      effective_geometry_targets: effectiveGeometryTargets,
      effects,
    };

    return {
      content: [
        {
          type: "text" as const,
          text: `Applied authored updates to ${targets.length} Cubes in one Undo unit; ${effectiveGeometryTargets} target(s) changed geometry/visibility. Structural effects recorded; reference fidelity was not evaluated.`,
        },
      ],
      structuredContent: result,
    };
  },
}, cubeToolDocs[2].status);
}
