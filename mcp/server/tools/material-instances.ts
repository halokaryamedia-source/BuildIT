/// <reference types="three" />
/// <reference types="blockbench-types" />
import { z } from "zod";
import { createTool, type ToolSpec } from "@/lib/factories";
import { resolveCoreCube } from "@/lib/coreIdentity";
import { STATUS_EXPERIMENTAL, STATUS_STABLE } from "@/lib/constants";
import { faceEnum, cubeIdOptionalSchema, cubeIdSchema } from "@/lib/zodObjects";

// ============================================================================
// Material Instance Parameter Schemas
// ============================================================================

/** Parameters for bounded material-instance discovery */
export const listMaterialInstancesParametersSchema = z.object({
  include_usages: z
    .boolean()
    .optional()
    .default(false)
    .describe("Include Cube/face usage locations. Keep false for summary-only discovery."),
  usage_limit_per_instance: z
    .number()
    .int()
    .min(1)
    .max(1000)
    .optional()
    .default(100)
    .describe("Maximum usage locations returned per material instance when include_usages=true."),
});

/** Faces array with default to all faces */
export const facesArrayWithDefaultSchema = z
  .array(faceEnum)
  .min(1)
  .optional()
  .default(faceEnum.options)
  .describe("Faces to set the material instance on. Defaults to all faces.");

/** Faces array optional */
export const facesArrayOptionalSchema = z
  .array(faceEnum)
  .min(1)
  .optional()
  .describe("Specific non-empty face set to get/clear. If omitted, uses all faces.");

/** Parameters for getting face material instances */
export const getFaceMaterialInstancesParametersSchema = z.object({
  cube_id: cubeIdOptionalSchema.describe(
    "Exact Cube UUID or exact unique Cube name. If omitted, uses the first selected Cube."
  ),
  faces: facesArrayOptionalSchema,
});

/** Parameters for setting face material instance */
export const setFaceMaterialInstanceParametersSchema = z.object({
  cube_id: cubeIdOptionalSchema.describe(
    "Exact Cube UUID or exact unique Cube name. If omitted, applies to all selected Cubes."
  ),
  material_name: z
    .string()
    .describe(
      "The material instance name to assign. Use empty string to clear the material instance."
    ),
  faces: facesArrayWithDefaultSchema,
});

/** Single material instance assignment */
export const materialInstanceAssignmentSchema = z.object({
  cube_id: cubeIdSchema,
  faces: z
    .array(faceEnum)
    .min(1)
    .describe("Non-empty faces to set the material instance on."),
  material_name: z.string().describe("Material instance name to assign."),
});

/** Parameters for bulk setting material instances */
export const bulkSetMaterialInstancesParametersSchema = z.object({
  assignments: z
    .array(materialInstanceAssignmentSchema)
    .min(1)
    .describe("Array of material instance assignments."),
});

/** Parameters for clearing material instances */
export const clearMaterialInstancesParametersSchema = z.object({
  cube_id: cubeIdOptionalSchema.describe(
    "Exact Cube UUID or exact unique Cube name. If omitted, clears from all selected Cubes."
  ),
  faces: facesArrayOptionalSchema.describe(
    "Specific faces to clear. If not provided, clears all faces."
  ),
  all_cubes: z
    .boolean()
    .optional()
    .default(false)
    .describe(
      "If true, clears material instances from all cubes in the project."
    ),
});

/**
 * Helper to find a cube by ID or name
 */
function findCubeOrThrow(id: string): Cube {
  return resolveCoreCube(
    id,
    "Use list_outline or find_elements_by_criteria to confirm the intended Cube UUID before changing material instances."
  );
}

// ============================================================================
// Material Instance Tool Docs
// ============================================================================

export const materialInstanceToolDocs: ToolSpec[] = [
  {
    name: "get_face_material_instances",
    description:
      "Gets material-instance metadata from Bedrock cube faces. Blockbench's Bedrock geometry codec preserves this field on per-face UV data.",
    annotations: {
      title: "Get Face Material Instances",
      readOnlyHint: true,
    },
    parameters: getFaceMaterialInstancesParametersSchema,
    status: STATUS_STABLE,
  },
  {
    name: "set_face_material_instance",
    description:
      "Sets material-instance metadata on one or more Bedrock cube faces using the face field preserved by Blockbench's Bedrock geometry codec.",
    annotations: {
      title: "Set Face Material Instance",
      destructiveHint: true,
    },
    parameters: setFaceMaterialInstanceParametersSchema,
    status: STATUS_EXPERIMENTAL,
  },
  {
    name: "list_material_instances",
    description:
      "Lists unique material-instance names and usage counts. Cube/face locations are opt-in with `include_usages=true` and bounded per instance to avoid dumping all face assignments by default.",
    annotations: {
      title: "List Material Instances",
      readOnlyHint: true,
    },
    parameters: listMaterialInstancesParametersSchema,
    status: STATUS_STABLE,
  },
  {
    name: "bulk_set_material_instances",
    description:
      "Sets material instance names on multiple cubes at once. Useful for assigning different material instances to different faces across the project.",
    annotations: {
      title: "Bulk Set Material Instances",
      destructiveHint: true,
    },
    parameters: bulkSetMaterialInstancesParametersSchema,
    status: STATUS_EXPERIMENTAL,
  },
  {
    name: "clear_material_instances",
    description:
      "Clears (removes) material instance names from cube faces. Useful for resetting material assignments.",
    annotations: {
      title: "Clear Material Instances",
      destructiveHint: true,
    },
    parameters: clearMaterialInstancesParametersSchema,
    status: STATUS_EXPERIMENTAL,
  },
];

export function registerMaterialInstanceTools() {
  createTool(
    materialInstanceToolDocs[0].name,
    {
      ...materialInstanceToolDocs[0],
      async execute({ cube_id, faces }) {
        const cube: Cube | undefined = cube_id ? findCubeOrThrow(cube_id) : Cube.selected.at(0);

        if (!cube) {
          throw new Error("No cube found to get material instances from.");
        }

        const facesToCheck = faces || faceEnum.options;
        const result: Record<string, { material_name: string; texture: string | null }> = {};

        for (const faceDir of facesToCheck) {
          const face = cube.faces[faceDir];
          if (face) {
            const faceTexture = face.getTexture();
            result[faceDir] = {
              material_name: face.material_name || "",
              texture: face.texture
                ? (faceTexture ? faceTexture.name : face.texture.toString())
                : null,
            };
          }
        }

        const read = {
          cube: {
            name: cube.name,
            uuid: cube.uuid,
          },
          faces: result,
        };
        const faceCount = Object.keys(result).length;
        return {
          content: [
            {
              type: "text" as const,
              text: `Read material-instance metadata for ${faceCount} face(s) on ${cube.name} (${cube.uuid}).`,
            },
          ],
          structuredContent: read,
        };
      },
    },
    materialInstanceToolDocs[0].status
  );

  createTool(
    materialInstanceToolDocs[1].name,
    {
      ...materialInstanceToolDocs[1],
      async execute({ cube_id, material_name, faces }) {
        let cubes: Cube[];

        if (cube_id) {
          cubes = [findCubeOrThrow(cube_id)];
        } else {
          if (!Cube.selected.length) {
            throw new Error(
              "No cube specified and no cubes selected. Provide a cube_id or select cubes."
            );
          }
          cubes = Cube.selected;
        }

        Undo.initEdit({
          elements: cubes,
          uv_only: true,
        });

        let modifiedCount = 0;

        for (const cube of cubes) {
          for (const faceDir of faces) {
            const face = cube.faces[faceDir];
            if (face) {
              face.extend({ material_name });
              modifiedCount++;
            }
          }
        }

        Undo.finishEdit("Set material instances");
        Canvas.updateAll();

        return `Set material instance "${material_name}" on ${modifiedCount} face(s) across ${cubes.length} cube(s).`;
      },
    },
    materialInstanceToolDocs[1].status
  );

  createTool(
    materialInstanceToolDocs[2].name,
    {
      ...materialInstanceToolDocs[2],
      async execute({ include_usages, usage_limit_per_instance }) {
        type MaterialUsage = { cube_name: string; cube_uuid: string; face: string };
        const materialMap: Record<
          string,
          { usage_count: number; usages: MaterialUsage[] }
        > = {};

        for (const cube of Cube.all) {
          for (const faceDir of faceEnum.options) {
            const face = cube.faces[faceDir];
            if (face && face.material_name) {
              if (!materialMap[face.material_name]) {
                materialMap[face.material_name] = { usage_count: 0, usages: [] };
              }
              const entry = materialMap[face.material_name];
              entry.usage_count += 1;
              if (include_usages && entry.usages.length < usage_limit_per_instance) {
                entry.usages.push({
                  cube_name: cube.name,
                  cube_uuid: cube.uuid,
                  face: faceDir,
                });
              }
            }
          }
        }

        const materialInstances = Object.entries(materialMap).map(
          ([name, entry]) => ({
            name,
            usage_count: entry.usage_count,
            ...(include_usages
              ? {
                  usages: entry.usages,
                  usages_truncated: entry.usage_count > entry.usages.length,
                }
              : {}),
          })
        );

        const read = {
          total_unique_instances: materialInstances.length,
          material_instances: materialInstances,
        };
        return {
          content: [
            {
              type: "text" as const,
              text: `Found ${materialInstances.length} unique material instance(s).`,
            },
          ],
          structuredContent: read,
        };
      },
    },
    materialInstanceToolDocs[2].status
  );

  createTool(
    materialInstanceToolDocs[3].name,
    {
      ...materialInstanceToolDocs[3],
      async execute({ assignments }) {
        const cubeCache: Record<string, Cube> = {};
        const cubesToEdit: Cube[] = [];

        // Validate and cache cubes
        for (const assignment of assignments) {
          if (!cubeCache[assignment.cube_id]) {
            const cube = findCubeOrThrow(assignment.cube_id);
            cubeCache[assignment.cube_id] = cube;
            cubesToEdit.push(cube);
          }
        }

        Undo.initEdit({
          elements: cubesToEdit,
          uv_only: true,
        });

        let totalModified = 0;

        for (const assignment of assignments) {
          const cube = cubeCache[assignment.cube_id];
          for (const faceDir of assignment.faces) {
            const face = cube.faces[faceDir];
            if (face) {
              face.extend({ material_name: assignment.material_name });
              totalModified++;
            }
          }
        }

        Undo.finishEdit("Bulk set material instances");
        Canvas.updateAll();

        return `Applied ${assignments.length} material instance assignment(s) affecting ${totalModified} face(s) on ${cubesToEdit.length} cube(s).`;
      },
    },
    materialInstanceToolDocs[3].status
  );

  createTool(
    materialInstanceToolDocs[4].name,
    {
      ...materialInstanceToolDocs[4],
      async execute({ cube_id, faces, all_cubes }) {
        let cubes: Cube[];

        if (all_cubes) {
          cubes = Cube.all;
        } else if (cube_id) {
          cubes = [findCubeOrThrow(cube_id)];
        } else {
          if (!Cube.selected.length) {
            throw new Error(
              "No cube specified and no cubes selected. Provide a cube_id, select cubes, or set all_cubes=true."
            );
          }
          cubes = Cube.selected;
        }

        if (cubes.length === 0) {
          return "No cubes to process.";
        }

        Undo.initEdit({
          elements: cubes,
          uv_only: true,
        });

        const facesToClear = faces || faceEnum.options;
        let clearedCount = 0;

        for (const cube of cubes) {
          for (const faceDir of facesToClear) {
            const face = cube.faces[faceDir];
            if (face && face.material_name) {
              face.extend({ material_name: "" });
              clearedCount++;
            }
          }
        }

        Undo.finishEdit("Clear material instances");
        Canvas.updateAll();

        return `Cleared material instances from ${clearedCount} face(s) across ${cubes.length} cube(s).`;
      },
    },
    materialInstanceToolDocs[4].status
  );
}
