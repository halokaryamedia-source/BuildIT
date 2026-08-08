/// <reference types="three" />
/// <reference types="blockbench-types" />
import { z } from "zod";
import { createTool, type ToolSpec } from "@/lib/factories";
import { cubeSchema } from "@/lib/zodObjects";
import { STATUS_STABLE } from "@/lib/constants";
import { getProjectTexture } from "@/lib/util";

const finiteVec3Schema = z.tuple([
  z.number().finite(),
  z.number().finite(),
  z.number().finite(),
]);

function hasNonZeroRotation(rotation?: readonly number[]): boolean {
  return rotation?.some((value) => value !== 0) ?? false;
}

const placeCubeElementSchema = cubeSchema
  .extend({
    from: finiteVec3Schema.describe(
      "Explicit authored Cube start coordinates. Required for initial placement; place_cube never supplies a default geometry extent."
    ),
    to: finiteVec3Schema.describe(
      "Explicit authored Cube end coordinates. Required for initial placement; place_cube never supplies a default geometry extent."
    ),
    origin: finiteVec3Schema
      .optional()
      .describe(
        "Intentional Cube pivot/origin. May be omitted for an unrotated Cube. A Cube with any non-zero rotation must provide origin explicitly."
      ),
    rotation: finiteVec3Schema
      .optional()
      .default([0, 0, 0])
      .describe(
        "Cube rotation in degrees. Non-zero rotation requires an explicit evidence-backed origin/pivot."
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
  );

const cubeCorrectionUpdateSchema = z
  .object({
    id: z
      .string()
      .min(1)
      .describe(
        "Exact Cube UUID. Names and selection are intentionally unsupported so a multi-Cube correction cannot silently target the wrong element."
      ),
    origin: finiteVec3Schema
      .optional()
      .describe(
        "New Cube pivot/origin. When origin is the only transform field in this update, the tool treats it as a pivot-only correction and preserves the Cube's visual position. When combined with from/to/rotation, it is treated as part of an authored geometry rewrite."
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
        "New authored Cube rotation in degrees. If the target Cube is currently unrotated and this activates a non-zero rotation, origin must be supplied explicitly in the same update. A Cube that is already rotated may adjust rotation while reusing its existing pivot."
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
      "Array of Cubes to place. Every Cube requires explicit finite from/to extents. Unrotated Cubes may omit origin; every Cube with non-zero rotation must provide an explicit origin/pivot."
    ),
  texture: z
    .string()
    .optional()
    .describe("Texture ID or name to apply to the cube."),
  group: z
    .string()
    .optional()
    .describe(
      "Exact Group UUID or exact unique name. Omit this field (or pass `root`) only when root placement is intentional."
    ),
  faces: z
    .union([
      z
        .array(z.enum(["north", "south", "east", "west", "up", "down"]))
        .describe("Array of faces to apply the texture to."),
      z
        .boolean()
        .optional()
        .describe(
          "Whether to apply the texture to all faces. Set to `true` to enable auto UV mapping."
        ),
      z
        .array(
          z.object({
            face: z
              .enum(["north", "south", "east", "west", "up", "down"])
              .describe("Face to apply the texture to."),
            uv: z
              .array(z.number()).length(4)
              .describe("Custom UV mapping for the face."),
          })
        )
        .describe("Array of faces with custom UV mapping."),
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
    .optional()
    .describe(
      "Exact Cube UUID or exact unique name. UUID is preferred. If omitted, the legacy selected-Cube fallback is used."
    ),
  name: z.string().optional().describe("New name of the cube."),
  origin: z
    .array(z.number()).length(3)
    .optional()
    .describe(
      "Cube pivot/origin. If supplied without from/to/rotation, this is a pivot-only correction and visual position is preserved. If combined with from/to/rotation, origin is applied as part of the authored geometry rewrite."
    ),
  from: z
    .array(z.number()).length(3)
    .optional()
    .describe("Starting point of the cube."),
  to: z
    .array(z.number()).length(3)
    .optional()
    .describe("Ending point of the cube."),
  rotation: z
    .array(z.number()).length(3)
    .optional()
    .describe(
      "Rotation of the Cube. If the target is currently unrotated and this activates a non-zero rotation, provide origin explicitly in the same request. Later rotation adjustments on an already-rotated Cube may reuse its existing pivot."
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
      "One to 32 explicit per-Cube authored transform/visibility updates applied as one recoverable Undo unit."
    ),
});

export const cubeToolDocs: ToolSpec[] = [
  {
    name: "place_cube",
    description:
      "Places one or more Cubes. Every new Cube must provide explicit finite from/to geometry extents; place_cube does not create a default [0,0,0]→[1,1,1] Cube when geometry was omitted. Unrotated Cubes may omit origin and use the neutral [0,0,0] value; any Cube with non-zero rotation must provide an explicit origin/pivot so a missing pivot cannot silently become [0,0,0]. If `group` is omitted or explicitly `root`, placement is at root. Any other supplied group must resolve by exact UUID or exact unique name before mutation; missing or ambiguous groups fail instead of silently falling back to root.",
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
      "Modifies one exact Cube when `id` is provided: UUID is resolved first, otherwise an exact name must be unique. Ambiguous names fail instead of modifying multiple Cubes. Omitting `id` retains the legacy selected-Cube fallback. An origin-only transform change uses Blockbench Cube.transferOrigin so pivot movement preserves visual position; origin combined with from/to/rotation is treated as an authored geometry rewrite. Activating non-zero rotation on a currently unrotated Cube requires explicit origin in the same request; later rotation adjustments may reuse the existing pivot. Auto UV setting: 0 = disabled, 1 = enabled, 2 = relative auto UV.",
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
      "Applies one coherent correction across several explicitly identified Cubes in a single recoverable Undo unit. Every target must be an exact Cube UUID and all targets are preflighted before mutation. Each Cube may receive different from/to/origin/rotation/visibility values. Per update, origin without from/to/rotation is a pivot-only transfer that preserves visual position; origin combined with geometry transform fields is an authored rewrite. Activating non-zero rotation on a currently unrotated target requires explicit origin in that update; already-rotated targets may adjust rotation while reusing their existing pivots. If any target fails preflight, the batch does not open Undo. If mutation fails after Undo starts, the edit is cancelled with changes reverted. This tool performs no visual judgement, planning, reparenting, UV work, or automatic correction.",
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
  return {
    uuid: cube.uuid,
    name: cube.name,
    from: [...cube.from] as [number, number, number],
    to: [...cube.to] as [number, number, number],
    size: [
      cube.to[0] - cube.from[0],
      cube.to[1] - cube.from[1],
      cube.to[2] - cube.from[2],
    ] as [number, number, number],
    origin: [...cube.origin] as [number, number, number],
    rotation: [...cube.rotation] as [number, number, number],
    visibility: cube.visibility !== false,
  };
}

function resolveUniqueCube(reference: string): Cube {
  const uuidMatch = (Cube.all ?? []).find(
    (cube: Cube) => cube.uuid === reference
  );
  if (uuidMatch) return uuidMatch;

  const nameMatches = (Cube.all ?? []).filter(
    (cube: Cube) => cube.name === reference
  );
  if (nameMatches.length === 1) return nameMatches[0];

  if (nameMatches.length > 1) {
    throw new Error(
      `Cube name "${reference}" is ambiguous. Use an exact UUID. Candidates: ${nameMatches
        .map((cube: Cube) => `${cube.name} (${cube.uuid})`)
        .join(", ")}`
    );
  }

  throw new Error(
    `Cube "${reference}" not found. Use list_outline or find_elements_by_criteria, then inspect_element to confirm the intended UUID.`
  );
}

function resolvePlacementGroup(reference?: string): Group | "root" {
  if (reference === undefined || reference === "root") return "root";

  const uuidMatch = Group.all.find((group: Group) => group.uuid === reference);
  if (uuidMatch) return uuidMatch;

  const nameMatches = Group.all.filter(
    (group: Group) => group.name === reference
  );
  if (nameMatches.length === 1) return nameMatches[0];

  if (nameMatches.length > 1) {
    throw new Error(
      `Group name "${reference}" is ambiguous. Use an exact UUID. Candidates: ${nameMatches
        .map((group: Group) => `${group.name} (${group.uuid})`)
        .join(", ")}`
    );
  }

  throw new Error(
    `Group "${reference}" not found. Use list_outline to confirm the intended Group UUID. Omit group or pass "root" only when root placement is intentional.`
  );
}

export function registerCubesTools() {
createTool(cubeToolDocs[0].name, {
  ...cubeToolDocs[0],
  async execute({ elements, texture, faces, group }) {
    const projectTexture = texture
      ? getProjectTexture(texture)
      : Texture.getDefault();

    if (texture && !projectTexture) {
      throw new Error(`No texture found for "${texture}".`);
    }

    // Resolve an explicitly requested hierarchy target before opening Undo.
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
    return await Promise.resolve(
      JSON.stringify(
        cubes.map((cube: Cube) => `Added cube ${cube.name} with ID ${cube.uuid}`)
      )
    );
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
    let cubes: Cube[];
    if (id) {
      // Explicit target means exactly one Cube. UUID wins; exact-name compatibility
      // is retained only when the name is unique.
      cubes = [resolveUniqueCube(id)];
    } else {
      cubes = [...Cube.selected];
      if (!cubes.length) {
        throw new Error("No cube selected and no id provided. Select a cube or provide an exact Cube UUID.");
      }
    }

    cubes.forEach((cube) =>
      requireIntentionalRotationActivation(cube, rotation, origin)
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
    return `Modified cubes ${cubes
      .map((cube) => cube.name)
      .join(", ")} with IDs ${cubes.map((cube) => cube.uuid).join(", ")}`;
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
    }> = updates.map((update) => {
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

      const pivotOnly = isPivotOnlyCorrection(update);
      if (pivotOnly) {
        requirePivotTransferMesh(cube);
      }

      return { cube, update, pivotOnly };
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

      Undo.finishEdit("Agent corrected multiple cubes");
    } catch (error) {
      Undo.cancelEdit(true);
      Canvas.updateAll();
      throw error;
    }

    Canvas.updateAll();
    const result = {
      modified: targets.length,
      cubes: targets.map(({ cube }) => finalCubeState(cube)),
    };

    return {
      content: [
        {
          type: "text" as const,
          text: `Corrected ${targets.length} Cubes in one Undo unit.`,
        },
      ],
      structuredContent: result,
    };
  },
}, cubeToolDocs[2].status);
}