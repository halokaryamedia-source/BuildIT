/// <reference types="three" />
/// <reference types="blockbench-types" />
import { z } from "zod";
import { createTool, type ToolSpec } from "@/lib/factories";
import { STATUS_STABLE } from "@/lib/constants";
import { readRenderedModelBounds } from "@/lib/renderedModelBounds";

export const createProjectParameters = z.object({
  name: z.string(),
  format: z
    .literal("bedrock")
    .optional()
    .default("bedrock")
    .describe(
      "BlockIT creates Minecraft Bedrock Entity projects only. The accepted format ID is `bedrock`; other Blockbench formats are outside the normal product surface."
    ),
});

export const getProjectInfoParameters = z.object({});
export const inspectModelBoundsParameters = z.object({});

export const projectToolDocs: ToolSpec[] = [
  {
    name: "create_project",
    description:
      "Creates a new Minecraft Bedrock Entity project. The format is fixed to Blockbench's native `bedrock` ModelFormat; arbitrary Blockbench project formats are intentionally outside this product tool.",
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
      "Returns read-only project orientation: format id and display name, project name/UUID, texture resolution, Cube/Group/texture counts, and a summary of top-level groups. Prefer this over `risky_eval` for first-look inspection — no JavaScript execution required.",
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
      "Returns raw rendered-current-pose bounds for visible Cube geometry in the active project: min/max/center, width-height-length, XZ footprint, Cube counts, and pose context. Uses Blockbench global Cube vertices so active Cube/group transforms are reflected. This is structural observation only: it does not compare against a target, score resemblance, recommend corrections, or return PASS/FAIL.",
    annotations: {
      title: "Inspect Model Bounds",
      readOnlyHint: true,
    },
    parameters: inspectModelBoundsParameters,
    status: STATUS_STABLE,
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

export function registerProjectTools() {
  createTool(projectToolDocs[0].name, {
    ...projectToolDocs[0],
    async execute({ name, format }) {
      const created = newProject(Formats.bedrock);

      if (!created) {
        throw new Error("Failed to create project.");
      }

      Project!.name = name;

      return `Created project with name "${name}" (UUID: ${Project?.uuid}) and format "${format}".`;
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

      const format = Format as { id?: string; name?: string; display_name?: string } | undefined;

      const rootGroups = Outliner.root
        .filter((n): n is Group => n instanceof Group)
        .map((g) => ({
          name: g.name,
          uuid: g.uuid,
          children: g.children?.length ?? 0,
        }));

      return JSON.stringify(
        {
          project: {
            name: Project.name,
            uuid: Project.uuid,
            save_path: (Project as { save_path?: string }).save_path ?? null,
          },
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
          },
          root_groups: rootGroups,
        },
        null,
        2
      );
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
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result, null, 2),
          },
        ],
        structuredContent: result,
      };
    },
  }, projectToolDocs[2].status);
}
