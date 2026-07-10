/// <reference types="three" />
/// <reference types="blockbench-types" />
import { z } from "zod";
import { createTool, type ToolSpec } from "@/lib/factories";
import { findElementOrThrow } from "@/lib/util";
import { STATUS_STABLE } from "@/lib/constants";
import {
  elementIdSchema,
  faceUvRectSchema,
} from "@/lib/zodObjects";

export const setCubeFaceUvParameters = z.object({
  id: elementIdSchema
    .optional()
    .describe(
      "Cube ID or name. Defaults to all selected cubes if omitted."
    ),
  faces: z
    .array(faceUvRectSchema)
    .min(1)
    .describe("Face UV rectangles to apply."),
});

export const getUvLayoutParameters = z.object({
  cube_ids: z
    .array(z.string())
    .optional()
    .describe(
      "Optional list of cube IDs or names. When omitted, exports all cubes."
    ),
});

export const cubeUvToolDocs: ToolSpec[] = [
  {
    name: "set_cube_face_uv",
    description:
      "Sets per-face UV rectangles on one or more cubes. Disables auto UV on affected cubes.",
    annotations: {
      title: "Set Cube Face UV",
      destructiveHint: true,
    },
    parameters: setCubeFaceUvParameters,
    status: STATUS_STABLE,
  },
  {
    name: "get_uv_layout",
    description:
      "Returns all cube face UV rectangles and texture references for the active project. Use before painting textures.",
    annotations: {
      title: "Get UV Layout",
      readOnlyHint: true,
    },
    parameters: getUvLayoutParameters,
    status: STATUS_STABLE,
  },
];

function resolveTextureName(index: number): string | null {
  const tex = Texture.all[index];
  return tex?.name ?? tex?.uuid ?? null;
}

function applyFaceRects(cube: Cube, faces: z.infer<typeof faceUvRectSchema>[]): void {
  faces.forEach(({ face, uv, texture, rotation }) => {
    const faceData = cube.faces[face];
    if (!faceData) {
      throw new Error(`Face "${face}" not found on cube "${cube.name}".`);
    }
    faceData.extend({
      uv: uv as [number, number, number, number],
      ...(texture !== undefined ? { texture } : {}),
      ...(rotation !== undefined ? { rotation: Number(rotation) } : {}),
    });
  });
  cube.autouv = 0;
}

function exportCubeUv(cube: Cube) {
  const faces: Record<
    string,
    { uv: number[]; texture: string | null; rotation: number }
  > = {};

  (Object.keys(cube.faces) as Array<keyof typeof cube.faces>).forEach((key) => {
    const face = cube.faces[key];
    if (!face) return;
    faces[String(key)] = {
      uv: [...face.uv],
      texture: resolveTextureName(face.texture),
      rotation: face.rotation ?? 0,
    };
  });

  return {
    name: cube.name,
    uuid: cube.uuid,
    box_uv: cube.box_uv,
    uv_offset: cube.box_uv ? [...cube.uv_offset] : undefined,
    faces,
  };
}

export function registerCubeUvTools() {
  createTool(
    cubeUvToolDocs[0].name,
    {
      ...cubeUvToolDocs[0],
      async execute({ id, faces }) {
        let cubes: Cube[];
        if (id) {
          const cube = findElementOrThrow(id);
          if (!(cube instanceof Cube)) {
            throw new Error(`Element "${id}" is not a cube.`);
          }
          cubes = [cube];
        } else {
          cubes = Cube.selected;
          if (!cubes.length) {
            throw new Error(
              "No cube selected and no id provided. Select a cube or provide an id."
            );
          }
        }

        Undo.initEdit({
          elements: cubes,
          uv_only: true,
        });

        cubes.forEach((cube) => applyFaceRects(cube, faces));

        cubes.forEach((cube) => {
          cube.preview_controller?.updateUV(cube);
        });
        if (typeof UVEditor !== "undefined") {
          UVEditor.loadData();
        }

        Undo.finishEdit("Set cube face UV");
        Canvas.updateView({
          elements: cubes,
          element_aspects: { uv: true, faces: true },
        });

        return `Set UV on ${faces.length} face(s) for ${cubes.length} cube(s).`;
      },
    },
    cubeUvToolDocs[0].status
  );

  createTool(
    cubeUvToolDocs[1].name,
    {
      ...cubeUvToolDocs[1],
      async execute({ cube_ids }) {
        if (!Project) {
          throw new Error("No project is open.");
        }

        let cubes = Cube.all;
        if (cube_ids && cube_ids.length > 0) {
          cubes = cube_ids.map((cubeId) => {
            const el = findElementOrThrow(cubeId);
            if (!(el instanceof Cube)) {
              throw new Error(`Element "${cubeId}" is not a cube.`);
            }
            return el;
          });
        }

        return JSON.stringify(
          {
            uv_mode: Project.box_uv ? "box" : "per_face",
            texture_size: [Project.texture_width, Project.texture_height],
            elements: cubes.map(exportCubeUv),
          },
          null,
          2
        );
      },
    },
    cubeUvToolDocs[1].status
  );
}
