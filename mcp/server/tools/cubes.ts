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
      .describe("New authored Cube pivot/origin."),
    from: finiteVec3Schema
      .optional()
      .describe("New authored Cube from coordinates."),
    to: finiteVec3Schema
      .optional()
      .describe("New authored Cube to coordinates."),
    rotation: finiteVec3Schema
      .optional()
      .describe("New authored Cube rotation in degrees."),
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
  elements: z.array(cubeSchema).min(1).describe("Array of cubes to place."),
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
    .describe("Pivot point of the cube."),
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
    .describe("Rotation of the cube."),
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
      "Places one or more Cubes. If `group` is omitted or explicitly `root`, placement is at root. Any other supplied group must resolve by exact UUID or exact unique name before mutation; missing or ambiguous groups fail instead of silently falling back to root.",
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
      "Modifies one exact Cube when `id` is provided: UUID is resolved first, otherwise an exact name must be unique. Ambiguous names fail instead of modifying multiple Cubes. Omitting `id` retains the legacy selected-Cube fallback. Auto UV setting: 0 = disabled, 1 = enabled, 2 = relative auto UV.",
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
      "Applies one coherent correction across several explicitly identified Cubes in a single recoverable Undo unit. Every target must be an exact Cube UUID and all targets are preflighted before mutation. Each Cube may receive different from/to/origin/rotation/visibility values. If mutation fails after Undo starts, the edit is cancelled with changes reverted. This tool performs no visual judgement, planning, reparenting, UV work, or automatic correction.",
    annotations: {
      title: "Modify Cubes Batch",
      destructiveHint: true,
    },
    parameters: modifyCubesBatchParameters,
    status: STATUS_STABLE,
  },
];

type BatchUpdate = z.infer<typeof cubeCorrectionUpdateSchema>;

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
      cubes = elements.map((element: Cube) => {
        const cube = new Cube({
          autouv: autouv ? 1 : 0,
          name: element.name,
          from: element.from as [number, number, number],
          to: element.to as [number, number, number],
          origin: element.origin as [number, number, number],
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

    Undo.initEdit({
      elements: cubes,
      outliner: true,
      collections: [],
    });

    try {
      cubes.forEach((cube) => {
        const cubeOrigin: [number, number, number] = (origin ?? cube.origin) as [number, number, number];
        const cubeFrom: [number, number, number] = (from ?? cube.from) as [number, number, number];
        const cubeTo: [number, number, number] = (to ?? cube.to) as [number, number, number];
        const cubeRotation: [number, number, number] = (rotation ?? cube.rotation) as [number, number, number];
        const cubeUVOffset: [number, number] = (uv_offset ?? cube.uv_offset) as [number, number];

        cube.extend({
          name: name ?? cube.name,
          origin: cubeOrigin,
          from: cubeFrom,
          to: cubeTo,
          rotation: cubeRotation,
          uv_offset: cubeUVOffset,
          autouv: autouv ? (Number(autouv) as 0 | 1 | 2) : cube.autouv,
          mirror_uv: Boolean(mirror_uv ?? cube.mirror_uv),
          inflate: inflate ?? cube.inflate,
          color: color ?? cube.color,
          visibility: visibility ?? cube.visibility,
          shade: shade ?? cube.shade,
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

    const targets: Array<{ cube: Cube; update: BatchUpdate }> = updates.map(
      (update) => {
        const cube = (Cube.all ?? []).find(
          (candidate: Cube) => candidate.uuid === update.id
        );
        if (!cube) {
          throw new Error(
            `Cube UUID "${update.id}" not found. Use list_outline/find_elements_by_criteria, then inspect_element to confirm the exact target UUID before retrying the correction.`
          );
        }
        return { cube, update };
      }
    );

    Undo.initEdit({
      elements: targets.map(({ cube }) => cube),
      outliner: true,
      collections: [],
    });

    try {
      for (const { cube, update } of targets) {
        cube.extend({
          origin: (update.origin ?? cube.origin) as [number, number, number],
          from: (update.from ?? cube.from) as [number, number, number],
          to: (update.to ?? cube.to) as [number, number, number],
          rotation: (update.rotation ?? cube.rotation) as [number, number, number],
          visibility: update.visibility ?? cube.visibility,
        });
      }

      Undo.finishEdit("Agent corrected multiple cubes");
      Canvas.updateAll();
    } catch (error) {
      Undo.cancelEdit(true);
      Canvas.updateAll();
      throw error;
    }

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
