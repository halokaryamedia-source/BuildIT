/// <reference types="three" />
/// <reference types="blockbench-types" />
import { z } from "zod";
import { createTool, type ToolSpec } from "@/lib/factories";
import { STATUS_STABLE } from "@/lib/constants";

export const createProjectParameters = z.object({
  name: z.string(),
  format: z
    .string()
    .default("bedrock_block")
    .describe("Project format ID from Blockbench's Formats registry."),
  box_uv: z
    .boolean()
    .optional()
    .describe(
      "Default UV mode. false = per-face UV (recommended for custom texture atlases). When omitted, uses the format default."
    ),
  texture_width: z
    .number()
    .int()
    .min(1)
    .max(4096)
    .optional()
    .describe("Texture atlas width in pixels."),
  texture_height: z
    .number()
    .int()
    .min(1)
    .max(4096)
    .optional()
    .describe("Texture atlas height in pixels."),
});

export const configureProjectParameters = z.object({
  name: z.string().optional().describe("Rename the project."),
  box_uv: z
    .boolean()
    .optional()
    .describe(
      "Switch UV mode. false = per-face UV, true = box UV. Requires format support."
    ),
  texture_width: z
    .number()
    .int()
    .min(1)
    .max(4096)
    .optional()
    .describe("Texture atlas width in pixels."),
  texture_height: z
    .number()
    .int()
    .min(1)
    .max(4096)
    .optional()
    .describe("Texture atlas height in pixels."),
});

export const getProjectInfoParameters = z.object({});

function getUvInfo() {
  const format = Format as { box_uv?: boolean } | undefined;
  return {
    mode: Project!.box_uv ? ("box" as const) : ("per_face" as const),
    box_uv: Project!.box_uv,
    texture_width: Project!.texture_width ?? null,
    texture_height: Project!.texture_height ?? null,
    format_supports_box_uv: format?.box_uv ?? false,
  };
}

export const projectToolDocs: ToolSpec[] = [
  {
    name: "create_project",
    description:
      "Creates a new project with the given name and project type. For custom texture atlases, set box_uv to false (per-face UV) and specify texture_width/height.",
    annotations: {
      title: "Create Project",
      destructiveHint: true,
      openWorldHint: true,
    },
    parameters: createProjectParameters,
    status: STATUS_STABLE,
  },
  {
    name: "configure_project",
    description:
      "Updates project settings: name, UV mode (box vs per-face), and texture resolution.",
    annotations: {
      title: "Configure Project",
      destructiveHint: true,
    },
    parameters: configureProjectParameters,
    status: STATUS_STABLE,
  },
  {
    name: "get_project_info",
    description:
      "Returns read-only project orientation: format id and display name, project name/UUID, UV mode, texture resolution (texture_width/height), element counts, and a summary of top-level groups. Prefer this over `risky_eval` for first-look inspection — no JavaScript execution required.",
    annotations: {
      title: "Get Project Info",
      readOnlyHint: true,
    },
    parameters: getProjectInfoParameters,
    status: STATUS_STABLE,
  },
];

export function registerProjectTools() {
  createTool(
    projectToolDocs[0].name,
    {
      ...projectToolDocs[0],
      async execute({ name, format, box_uv, texture_width, texture_height }) {
        const formatDef = Formats[format];
        if (!formatDef) {
          throw new Error(
            `Unknown format "${format}". Use a valid format ID from Blockbench's Formats registry.`
          );
        }

        const created = newProject(formatDef);
        if (!created) {
          throw new Error("Failed to create project.");
        }

        Project!.name = name;

        if (box_uv !== undefined) {
          if (box_uv && !formatDef.box_uv) {
            throw new Error(
              `Format "${format}" does not support box UV mode.`
            );
          }
          Project!.box_uv = box_uv;
        }

        if (texture_width !== undefined) {
          Project!.texture_width = texture_width;
        }
        if (texture_height !== undefined) {
          Project!.texture_height = texture_height;
        }

        const uvMode = Project!.box_uv ? "box" : "per_face";
        return `Created project "${name}" (UUID: ${Project?.uuid}) with format "${format}" and UV mode "${uvMode}".`;
      },
    },
    projectToolDocs[0].status
  );

  createTool(
    projectToolDocs[1].name,
    {
      ...projectToolDocs[1],
      async execute({ name, box_uv, texture_width, texture_height }) {
        if (!Project) {
          throw new Error(
            "No project is open. Use create_project to start a new one."
          );
        }

        const format = Format as { box_uv?: boolean } | undefined;

        if (box_uv !== undefined) {
          if (box_uv && !format?.box_uv) {
            throw new Error("Current format does not support box UV mode.");
          }
        }

        Undo.initEdit({});

        if (name !== undefined) {
          Project.name = name;
        }
        if (box_uv !== undefined) {
          Project.box_uv = box_uv;
        }
        if (texture_width !== undefined) {
          Project.texture_width = texture_width;
        }
        if (texture_height !== undefined) {
          Project.texture_height = texture_height;
        }

        Undo.finishEdit("Configure project");
        Canvas.updateAll();
        if (typeof UVEditor !== "undefined") {
          UVEditor.loadData();
        }

        const uv = getUvInfo();
        return `Project configured: name="${Project.name}", UV mode="${uv.mode}", resolution=${uv.texture_width}x${uv.texture_height}.`;
      },
    },
    projectToolDocs[1].status
  );

  createTool(
    projectToolDocs[2].name,
    {
      ...projectToolDocs[2],
      async execute() {
        if (!Project) {
          throw new Error(
            "No project is open. Use create_project to start a new one, or open an existing file in Blockbench."
          );
        }

        const format = Format as {
          id?: string;
          name?: string;
          display_name?: string;
          box_uv?: boolean;
        } | undefined;

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
            uv: getUvInfo(),
            resolution: {
              texture_width: Project.texture_width ?? null,
              texture_height: Project.texture_height ?? null,
            },
            counts: {
              cubes: Cube.all.length,
              meshes: Mesh.all.length,
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
    },
    projectToolDocs[2].status
  );
}
