/// <reference types="three" />
/// <reference types="blockbench-types" />
import { z } from "zod";
import { createTool, type ToolSpec } from "@/lib/factories";
import { findElementOrThrow } from "@/lib/util";
import { STATUS_STABLE } from "@/lib/constants";
import { elementIdSchema, faceUvRectSchema } from "@/lib/zodObjects";

export const setCubeFaceUvParameters = z.object({
  id: elementIdSchema.describe("Explicit cube UUID or name."),
  faces: z.array(faceUvRectSchema).min(1).describe("Face UV rectangles to apply."),
});

export const getUvLayoutParameters = z.object({
  cube_ids: z
    .array(z.string())
    .optional()
    .describe("Optional explicit cube IDs or names. When omitted, inspects all cubes."),
});

export const cubeUvToolDocs: ToolSpec[] = [
  {
    name: "set_cube_face_uv",
    description:
      "Sets per-face UV rectangles on one explicitly identified cube and disables auto UV for that cube.",
    annotations: { title: "Set Cube Face UV", destructiveHint: true },
    parameters: setCubeFaceUvParameters,
    status: STATUS_STABLE,
  },
  {
    name: "get_uv_layout",
    description:
      "Returns one compact structured cube UV layout with texture references and atlas dimensions.",
    annotations: { title: "Get UV Layout", readOnlyHint: true },
    parameters: getUvLayoutParameters,
    status: STATUS_STABLE,
  },
];

function resolveTextureName(reference: string | false | undefined): string | null {
  if (!reference) return null;
  const texture = Texture.all.find(({ uuid }) => uuid === reference);
  return texture?.name ?? reference;
}

function applyFaceRects(cube: Cube, faces: z.infer<typeof faceUvRectSchema>[]): void {
  faces.forEach(({ face, uv, texture, rotation }) => {
    const faceData = cube.faces[face];
    if (!faceData) throw new Error(`Face "${face}" not found on cube "${cube.name}".`);
    const textureReference = texture === undefined ? undefined : Texture.all[texture]?.uuid;
    if (texture !== undefined && !textureReference) {
      throw new Error(`Texture index ${texture} not found.`);
    }
    faceData.extend({
      uv: uv as [number, number, number, number],
      ...(textureReference !== undefined ? { texture: textureReference } : {}),
      ...(rotation !== undefined ? { rotation: Number(rotation) } : {}),
    });
  });
  cube.autouv = 0;
}

function exportCubeUv(cube: Cube) {
  const faces: Record<string, { uv: number[]; texture: string | null; rotation: number }> = {};
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
        const element = findElementOrThrow(id);
        if (!(element instanceof Cube)) throw new Error(`Element "${id}" is not a cube.`);

        Undo.initEdit({ elements: [element], uv_only: true });
        try {
          applyFaceRects(element, faces);
          element.preview_controller?.updateUV(element);
          if (typeof UVEditor !== "undefined") UVEditor.loadData();
          Undo.finishEdit("Set cube face UV");
        } catch (error) {
          (Undo as unknown as { cancelEdit?: (amend?: boolean) => void }).cancelEdit?.(false);
          throw error;
        }

        Canvas.updateView({
          elements: [element],
          element_aspects: { uv: true, faces: true },
        });

        return {
          content: [{
            type: "text" as const,
            text: `Set ${faces.length} UV face(s) on cube ${element.name}.`,
          }],
          structuredContent: {
            status: "PASS",
            cube: exportCubeUv(element),
            changed_face_count: faces.length,
          },
        };
      },
    },
    cubeUvToolDocs[0].status
  );

  createTool(
    cubeUvToolDocs[1].name,
    {
      ...cubeUvToolDocs[1],
      async execute({ cube_ids }) {
        if (!Project) throw new Error("No project is open.");
        const cubes = cube_ids?.length
          ? cube_ids.map((cubeId: string) => {
              const element = findElementOrThrow(cubeId);
              if (!(element instanceof Cube)) throw new Error(`Element "${cubeId}" is not a cube.`);
              return element;
            })
          : Cube.all;

        const layout = {
          uv_mode: Project.box_uv ? "box" : "per_face",
          texture_size: [Project.texture_width, Project.texture_height],
          element_count: cubes.length,
          elements: cubes.map(exportCubeUv),
        };
        return {
          content: [{
            type: "text" as const,
            text: `Inspected UV layout for ${cubes.length} cube(s) at ${Project.texture_width}x${Project.texture_height}.`,
          }],
          structuredContent: { status: "PASS", ...layout },
        };
      },
    },
    cubeUvToolDocs[1].status
  );
}
