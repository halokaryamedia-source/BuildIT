/// <reference types="three" />
/// <reference types="blockbench-types" />
import { z } from "zod";
import { createTool, type ToolSpec } from "@/lib/factories";
import { STATUS_EXPERIMENTAL, STATUS_STABLE } from "@/lib/constants";
import { readRenderedModelBounds } from "@/lib/renderedModelBounds";
import { isAbsoluteFilesystemPath } from "@/lib/util";

export const DEFAULT_BEDROCK_UV_RESOLUTION = 128;

// Compatibility-only schema retained until the next LOCAL_CODE docs generation.
// The capability is retired and never exposed by the active phase surface.
const retiredLocalGlbPathSchema = z
  .string()
  .min(1)
  .refine(isAbsoluteFilesystemPath, {
    message:
      "3D-Assisted Evidence reference path must be an absolute local filesystem path.",
  })
  .refine((path) => /\.glb$/i.test(path), {
    message: "3D-Assisted Evidence supports local .glb files only.",
  });

const retiredReferenceVec3Schema = z.tuple([
  z.number().finite(),
  z.number().finite(),
  z.number().finite(),
]);

const retiredFrontDirectionSchema = z.enum(["+z", "-z"]);

export const createProjectParameters = z
  .object({
    name: z.string().min(1).describe("Non-empty project name."),
    discard_unsaved: z
      .boolean()
      .optional()
      .describe(
        "Discard unsaved changes in the open project; required when it currently has unsaved work."
      ),
    resolution: z
      .union([z.literal(128), z.literal(256)])
      .optional()
      .describe("Logical UV canvas edge; 128 (default) or 256."),
  })
  .strict();

export const getProjectInfoParameters = z.object({});
export const inspectModelBoundsParameters = z.object({});

export const manageGeometryReferenceParameters = z
  .object({
    action: z
      .enum(["load", "update", "remove"])
      .describe("3D-Assisted Evidence reference lifecycle action."),
    path: retiredLocalGlbPathSchema
      .optional()
      .describe("Absolute local .glb path; required only for load."),
    id: z
      .string()
      .min(1)
      .optional()
      .describe(
        "Tool-owned 3D-Assisted Evidence reference UUID or unique exact name; required for update/remove."
      ),
    source_front_direction: retiredFrontDirectionSchema
      .optional()
      .describe(
        "Required load-time front direction encoded by the approved 3D-Assisted Evidence GLB."
      ),
    origin: retiredReferenceVec3Schema
      .optional()
      .describe("Reference origin [x,y,z]. Load default is [0,0,0]."),
    uniform_scale: z
      .number()
      .finite()
      .positive()
      .optional()
      .describe(
        "Uniform scale multiplier. Load default is 1; non-uniform scaling is unsupported."
      ),
    visibility: z
      .boolean()
      .optional()
      .describe("Reference visibility. Load default is true."),
    wireframe: z
      .boolean()
      .optional()
      .describe("Reference wireframe mode. Load default is false."),
  })
  .strict()
  .superRefine((value, ctx) => {
    const reject = (key: keyof typeof value, message: string) => {
      if (value[key] !== undefined) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: [key], message });
      }
    };

    if (value.action === "load") {
      if (!value.path) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["path"],
          message: "load requires path.",
        });
      }
      if (!value.source_front_direction) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["source_front_direction"],
          message: "load requires source_front_direction.",
        });
      }
      reject(
        "id",
        "load does not accept id; v1 supports one active 3D-Assisted Evidence reference."
      );
      return;
    }

    if (!value.id) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["id"],
        message: `${value.action} requires id.`,
      });
    }
    reject(
      "path",
      `${value.action} does not change the GLB source; remove and reload instead.`
    );
    reject(
      "source_front_direction",
      `${value.action} does not change source orientation; remove and reload instead.`
    );

    if (value.action === "remove") {
      reject("origin", "remove accepts only action and id.");
      reject("uniform_scale", "remove accepts only action and id.");
      reject("visibility", "remove accepts only action and id.");
      reject("wireframe", "remove accepts only action and id.");
    } else if (
      value.origin === undefined &&
      value.uniform_scale === undefined &&
      value.visibility === undefined &&
      value.wireframe === undefined
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["action"],
        message: "update requires an actual transform or display change.",
      });
    }
  });

export const projectToolDocs: ToolSpec[] = [
  {
    name: "create_project",
    description:
      "Creates a new Minecraft Bedrock Entity project in Blockbench's native `bedrock` format; refuses unsaved work without `discard_unsaved`.",
    annotations: {
      title: "Create Project",
      destructiveHint: true,
      openWorldHint: true,
    },
    parameters: createProjectParameters,
    status: STATUS_STABLE,
  },
  {
    name: "get_project_info",
    description:
      "Returns project lifecycle, format, logical UV resolution, and element counts. Use inspect_elements(mode=outline) only when hierarchy detail is needed.",
    annotations: {
      title: "Get Project Info",
      readOnlyHint: true,
    },
    parameters: getProjectInfoParameters,
    status: STATUS_STABLE,
  },
  {
    name: "inspect_model_bounds",
    description:
      "Returns rendered-current-pose Cube bounds, visibility counts, and pose context. Observation only; no visual PASS/FAIL.",
    annotations: {
      title: "Inspect Model Bounds",
      readOnlyHint: true,
    },
    parameters: inspectModelBoundsParameters,
    status: STATUS_STABLE,
  },
  {
    name: "manage_geometry_reference",
    description:
      "Loads, updates, or removes one approved local 3D-Assisted Evidence .glb through Blockbench Reference Models. It never converts mesh triangles to Bedrock geometry.",
    annotations: {
      title: "Manage 3D-Assisted Evidence Reference",
      destructiveHint: true,
      openWorldHint: true,
    },
    parameters: manageGeometryReferenceParameters,
    status: STATUS_EXPERIMENTAL,
  },
];

function getPoseContext(): {
  animation: { uuid: string; name: string } | null;
  timeline_time: number | null;
} {
  const selectedAnimation =
    typeof AnimationItem !== "undefined" ? AnimationItem.selected : null;

  let timelineTime: number | null = null;
  if (
    selectedAnimation &&
    typeof Timeline !== "undefined" &&
    typeof Timeline.time === "number" &&
    Number.isFinite(Timeline.time)
  ) {
    timelineTime = Timeline.time;
  }

  return {
    animation: selectedAnimation
      ? { uuid: selectedAnimation.uuid, name: selectedAnimation.name }
      : null,
    timeline_time: timelineTime,
  };
}

function currentProjectLifecycle() {
  if (!Project) {
    throw new Error("No project is open.");
  }

  return {
    name: Project.name,
    uuid: Project.uuid,
    save_path: Project.save_path ?? null,
    export_path: Project.export_path ?? null,
    export_codec: Project.export_codec ?? null,
    saved: Project.saved === true,
  };
}

export function registerProjectTools() {
  createTool(projectToolDocs[0].name, {
    ...projectToolDocs[0],
    async execute({ name, discard_unsaved, resolution }) {
      if (Project && Project.saved === false && discard_unsaved !== true) {
        throw new Error(
          `The open project "${Project.name}" has unsaved changes. Save it first, or pass discard_unsaved: true to abandon them.`
        );
      }

      const created = newProject(Formats.bedrock);
      if (!created) throw new Error("Failed to create project.");

      Project!.name = name;
      Project!.texture_width = resolution ?? DEFAULT_BEDROCK_UV_RESOLUTION;
      Project!.texture_height = resolution ?? DEFAULT_BEDROCK_UV_RESOLUTION;

      const result = {
        project: currentProjectLifecycle(),
        format: { id: "bedrock" as const },
        resolution: {
          texture_width: Project!.texture_width ?? null,
          texture_height: Project!.texture_height ?? null,
        },
      };

      return {
        content: [{
          type: "text" as const,
          text: `Created Bedrock project "${result.project.name}" (${result.project.uuid}) with ${result.resolution.texture_width}×${result.resolution.texture_height} logical UV canvas.`,
        }],
        structuredContent: result,
      };
    },
  }, projectToolDocs[0].status);

  createTool(projectToolDocs[1].name, {
    ...projectToolDocs[1],
    async execute() {
      if (!Project) {
        throw new Error(
          "No project is open. Use create_project to start a new one, or open an existing file in Blockbench."
        );
      }

      const format = Format as
        | { id?: string; name?: string; display_name?: string }
        | undefined;
      const rootGroupCount = Outliner.root.reduce(
        (count, node) => count + (node instanceof Group ? 1 : 0),
        0
      );

      const result = {
        project: currentProjectLifecycle(),
        format: {
          id: format?.id ?? null,
          name: format?.display_name ?? format?.name ?? null,
        },
        resolution: {
          texture_width: Project.texture_width ?? null,
          texture_height: Project.texture_height ?? null,
        },
        counts: {
          cubes: Cube.all.length,
          groups: Group.all.length,
          textures: Texture.all.length,
          outliner_elements: Outliner.elements.length,
          root_groups: rootGroupCount,
        },
      };

      return {
        content: [{
          type: "text" as const,
          text: `Project ${result.project.name}: ${result.counts.cubes} Cubes, ${result.counts.groups} Groups, ${result.counts.textures} Textures.`,
        }],
        structuredContent: result,
      };
    },
  }, projectToolDocs[1].status);

  createTool(projectToolDocs[2].name, {
    ...projectToolDocs[2],
    async execute() {
      if (!Project) {
        throw new Error(
          "No project is open. Open or create the intended Bedrock project before inspecting model bounds."
        );
      }

      const observed = readRenderedModelBounds();
      const format = Format as { id?: string } | undefined;
      const result = {
        project: {
          uuid: Project.uuid,
          name: Project.name,
          format: format?.id ?? null,
        },
        has_geometry: observed.rendered_cube_count > 0,
        cube_count: observed.total_cube_count,
        rendered_cube_count: observed.rendered_cube_count,
        hidden_cube_count: observed.hidden_cube_count,
        bounds_basis: "rendered_current_pose" as const,
        coordinate_axes: {
          width: "x" as const,
          height: "y" as const,
          length: "z" as const,
        },
        bounds: observed.bounds,
        pose_context: getPoseContext(),
        warnings: observed.warnings,
      };

      return {
        content: [{ type: "text" as const, text: JSON.stringify(result) }],
        structuredContent: result,
      };
    },
  }, projectToolDocs[2].status);

  // Retained only as a generated-doc compatibility descriptor until the next
  // LOCAL_CODE generator pass. It is excluded from every active phase surface.
  createTool(projectToolDocs[3].name, {
    ...projectToolDocs[3],
    parameters: manageGeometryReferenceParameters,
    async execute() {
      throw new Error(
        "manage_geometry_reference is retired. Use the normal native BlockIT Geometry path."
      );
    },
  }, projectToolDocs[3].status);
}
