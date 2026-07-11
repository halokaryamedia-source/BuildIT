/// <reference types="three" />
/// <reference types="blockbench-types" />
import { z } from "zod";
import { createTool, type ToolSpec } from "@/lib/factories";
import { cubeSchema, faceUvRectSchema } from "@/lib/zodObjects";
import { STATUS_STABLE } from "@/lib/constants";
import { getProjectTexture } from "@/lib/util";

export const placeCubeParameters = z.object({
  elements: z.array(cubeSchema).min(1).describe("Array of cubes to place in one bounded transaction."),
  texture: z
    .string()
    .optional()
    .describe("Texture ID or name to apply to the cubes."),
  group: z
    .string()
    .optional()
    .describe("Existing group/bone name or UUID. Omit to place at root."),
  strict_group: z
    .boolean()
    .optional()
    .default(true)
    .describe("When true, a provided missing group is an error instead of silently falling back to root."),
  allow_untextured: z
    .boolean()
    .optional()
    .default(true)
    .describe("Allow geometry placement when no project/default texture exists. Useful during Geometry stage."),
  faces: z
    .union([
      z
        .array(z.enum(["north", "south", "east", "west", "up", "down"]))
        .describe("Array of faces to apply the texture to."),
      z
        .boolean()
        .optional()
        .describe(
          "Whether to apply the texture to all faces. Set to true to enable auto UV mapping."
        ),
      z
        .array(
          z.object({
            face: z
              .enum(["north", "south", "east", "west", "up", "down"])
              .describe("Face to apply custom UV to."),
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
      "Faces to apply the texture to. Set to true to enable auto UV mapping."
    ),
});

export const modifyCubeParameters = z.object({
  id: z
    .string()
    .optional()
    .describe(
      "Explicit UUID or name of the cube to modify. Required by default for agent safety."
    ),
  allow_selected: z
    .boolean()
    .optional()
    .default(false)
    .describe(
      "Allow modifying the current Blockbench selection when id is omitted. Keep false for precise agent edits."
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
  faces: z
    .array(faceUvRectSchema)
    .optional()
    .describe("Per-face UV rectangles to apply. Disables auto UV on the cube."),
});

export const cubeToolDocs: ToolSpec[] = [
  {
    name: "place_cube",
    description:
      "Places one bounded cube batch. A provided missing group fails by default, and untextured geometry is allowed for Geometry stage.",
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
      "Modifies an explicitly identified cube. Selection-based editing is disabled unless allow_selected is true.",
    annotations: {
      title: "Modify Cube",
      destructiveHint: true,
    },
    parameters: modifyCubeParameters,
    status: STATUS_STABLE,
  },
];

export function registerCubesTools() {
  createTool(cubeToolDocs[0].name, {
    ...cubeToolDocs[0],
    async execute({
      elements,
      texture,
      faces,
      group,
      strict_group,
      allow_untextured,
    }) {
      const projectTexture = texture
        ? getProjectTexture(texture)
        : Texture.getDefault();

      if (!projectTexture && !allow_untextured) {
        throw new Error(
          texture
            ? `No texture found for "${texture}".`
            : "No default texture exists and allow_untextured is false."
        );
      }

      // @ts-expect-error Blockbench global utility available at runtime
      const groups = getAllGroups() as Group[];
      let outlinerGroup: Group | "root" = "root";

      if (group && group !== "root") {
        const matchedGroup = groups.find(
          (candidate) => candidate.name === group || candidate.uuid === group
        );

        if (!matchedGroup && strict_group) {
          throw new Error(
            `Group "${group}" was not found. Refusing silent root fallback. Use list_outline or pass strict_group: false explicitly.`
          );
        }

        outlinerGroup = matchedGroup ?? "root";
      }

      const autouv =
        faces === true ||
        (Array.isArray(faces) &&
          faces.every((face) => typeof face === "string"));

      const hasExplicitFaceUv =
        Array.isArray(faces) &&
        faces.length > 0 &&
        typeof faces[0] === "object" &&
        "uv" in faces[0];

      Undo.initEdit({
        elements: [],
        outliner: true,
        collections: [],
      });

      try {
        const cubes = elements.map((element: Cube) => {
          const cube = new Cube({
            autouv: autouv ? 1 : 0,
            name: element.name,
            from: element.from as [number, number, number],
            to: element.to as [number, number, number],
            origin: element.origin as [number, number, number],
            rotation: element.rotation as [number, number, number],
          }).init();

          cube.addTo(outlinerGroup);

          if (hasExplicitFaceUv) {
            (faces as Array<{ face: keyof Cube["faces"]; uv: number[] }>).forEach(
              ({ face, uv }) => {
                cube.faces[face].extend({
                  uv: uv as [number, number, number, number],
                });
              }
            );
          } else if (projectTexture) {
            cube.applyTexture(
              projectTexture,
              faces !== false ? faces : undefined
            );
            if (autouv) {
              cube.mapAutoUV();
            }
          }

          return cube;
        });

        Undo.finishEdit("Agent placed bounded cube batch");
        Canvas.updateAll();

        return {
          content: [
            {
              type: "text" as const,
              text: `Placed ${cubes.length} cube(s) in ${outlinerGroup === "root" ? "root" : outlinerGroup.name}.`,
            },
          ],
          structuredContent: {
            status: "PASS",
            count: cubes.length,
            group: outlinerGroup === "root" ? "root" : {
              name: outlinerGroup.name,
              uuid: outlinerGroup.uuid,
            },
            textured: Boolean(projectTexture),
            cubes: cubes.map((cube) => ({
              name: cube.name,
              uuid: cube.uuid,
            })),
          },
        };
      } catch (error) {
        Undo.cancelEdit();
        throw error;
      }
    },
  }, cubeToolDocs[0].status);

  createTool(cubeToolDocs[1].name, {
    ...cubeToolDocs[1],
    async execute({
      id,
      allow_selected,
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
      faces: faceRects,
    }) {
      let cubes: Cube[];

      if (id) {
        cubes = (Cube.all ?? []).filter(
          (element: Cube) => element.uuid === id || element.name === id
        );
        if (!cubes.length) {
          throw new Error(
            `Cube with ID "${id}" not found. Use list_outline to inspect available cubes.`
          );
        }
      } else {
        if (!allow_selected) {
          throw new Error(
            "Explicit cube id is required. Pass allow_selected: true only when selection-based editing is intentional."
          );
        }
        cubes = Cube.selected;
        if (!cubes.length) {
          throw new Error("No cube is selected.");
        }
      }

      Undo.initEdit({
        elements: cubes,
        outliner: true,
        collections: [],
      });

      try {
        cubes.forEach((cube) => {
          const cubeOrigin = (origin ?? cube.origin) as [number, number, number];
          const cubeFrom = (from ?? cube.from) as [number, number, number];
          const cubeTo = (to ?? cube.to) as [number, number, number];
          const cubeRotation = (rotation ?? cube.rotation) as [number, number, number];
          const cubeUVOffset = (uv_offset ?? cube.uv_offset) as [number, number];

          cube.extend({
            name: name ?? cube.name,
            origin: cubeOrigin,
            from: cubeFrom,
            to: cubeTo,
            rotation: cubeRotation,
            uv_offset: cubeUVOffset,
            autouv: autouv !== undefined
              ? (Number(autouv) as 0 | 1 | 2)
              : cube.autouv,
            mirror_uv: Boolean(mirror_uv ?? cube.mirror_uv),
            inflate: inflate ?? cube.inflate,
            color: color ?? cube.color,
            visibility: visibility ?? cube.visibility,
            shade: shade ?? cube.shade,
          });

          if (faceRects && faceRects.length > 0) {
            faceRects.forEach(({ face, uv, texture, rotation: faceRotation }) => {
              cube.faces[face].extend({
                uv: uv as [number, number, number, number],
                ...(texture !== undefined ? { texture } : {}),
                ...(faceRotation !== undefined
                  ? { rotation: Number(faceRotation) }
                  : {}),
              });
            });
            cube.autouv = 0;
          }
        });

        Undo.finishEdit("Agent modified explicit cubes");
        Canvas.updateAll();

        return {
          content: [
            {
              type: "text" as const,
              text: `Modified ${cubes.length} cube(s): ${cubes.map((cube) => cube.name).join(", ")}.`,
            },
          ],
          structuredContent: {
            status: "PASS",
            count: cubes.length,
            cubes: cubes.map((cube) => ({
              name: cube.name,
              uuid: cube.uuid,
            })),
          },
        };
      } catch (error) {
        Undo.cancelEdit();
        throw error;
      }
    },
  }, cubeToolDocs[1].status);
}
