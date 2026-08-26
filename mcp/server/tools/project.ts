/// <reference types="three" />
/// <reference types="blockbench-types" />
import { z } from "zod";
import { createTool, type ToolSpec } from "@/lib/factories";
import { STATUS_STABLE } from "@/lib/constants";
import { readRenderedModelBounds } from "@/lib/renderedModelBounds";
import {
  clearActiveGeometryPlan,
  createGeometryPlan,
  getBoundGeometryRole,
  requirePlanForOpenProject,
  prepareGeometryPlanParameters,
} from "@/lib/geometryPlan";
import { compileGeometrySpec, compileGeometrySpecParameters, correctGeometryFromReportParameters, worldPosition } from "@/lib/geometryCompiler";

export const DEFAULT_BEDROCK_UV_RESOLUTION = 128;

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
      "Returns project lifecycle, format, logical UV resolution, and element counts. Use list_outline only when hierarchy detail is needed.",
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
    name: "prepare_geometry_plan",
    description:
      "Legacy Geometry planning tool. Not part of the default Geometry flow while the reference-grounded pipeline is being retired. Prefer the basic Group/Cube authoring tools for direct, explicit construction.",
    annotations: { title: "Prepare Geometry Plan", destructiveHint: false },
    parameters: prepareGeometryPlanParameters,
    status: STATUS_STABLE,
  },
  {
    name: "compile_geometry_spec",
    description:
      "Legacy Geometry compiler. Not part of the default Geometry flow while the reference-grounded pipeline is being retired. Prefer explicit Group/Cube authoring and capture the result for visual review.",
    annotations: { title: "Compile Geometry Spec", destructiveHint: true },
    parameters: compileGeometrySpecParameters,
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

      if (!created) {
        throw new Error("Failed to create project.");
      }

      clearActiveGeometryPlan();

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
        content: [
          {
            type: "text" as const,
            text: `Created Bedrock project "${result.project.name}" (${result.project.uuid}) with ${result.resolution.texture_width}×${result.resolution.texture_height} logical UV canvas.`,
          },
        ],
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
        content: [
          {
            type: "text" as const,
            text: `Project ${result.project.name}: ${result.counts.cubes} Cubes, ${result.counts.groups} Groups, ${result.counts.textures} Textures.`,
          },
        ],
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
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result),
          },
        ],
        structuredContent: result,
      };
    },
  }, projectToolDocs[2].status);

  createTool(projectToolDocs[3].name, {
    ...projectToolDocs[3],
    async execute(args) {
      if (!Project) {
        throw new Error("No project is open. Create or open the intended Bedrock project before preparing Geometry.");
      }
      const formatId = (Format as { id?: string } | undefined)?.id;
      if (formatId !== "bedrock") {
        throw new Error(`Geometry planning requires the Bedrock format; current format is ${formatId ?? "unknown"}.`);
      }
      if (Cube.all.length > 0 || Group.all.length > 0) {
        throw new Error(
          "prepare_geometry_plan requires an empty Bedrock project. Create a new project before starting Geometry from zero."
        );
      }
      const plan = createGeometryPlan(Project.uuid, args);
      return {
        content: [
          {
            type: "text" as const,
            text: `Geometry plan prepared (${plan.plan_id}) for ${plan.reference_identity}; ${plan.group_roles.length + plan.geometry_roles.length} roles and ${plan.rotation_parts.length} rotation parts declared.`,
          },
        ],
        structuredContent: {
          plan_id: plan.plan_id,
          project_uuid: plan.project_uuid,
          revision: plan.revision,
          status: plan.status,
          reference_identity: plan.reference_identity,
          scale: {
            basis: plan.scale.basis,
            player_height_blocks: plan.scale.player_height_blocks,
            target_height_blocks: plan.scale.target_height_blocks,
            player_height_units: plan.scale_units.player_height_units,
            target_height_units: plan.scale_units.target_height_units,
            ground_contact: plan.scale.ground_contact,
          },
          envelope: plan.envelope,
          proportion_target_count: plan.proportion_targets.length,
          group_role_count: plan.group_roles.length,
          geometry_role_count: plan.geometry_roles.length,
          landmark_count: plan.landmarks.length,
          attachment_count: plan.attachments.length,
          rotation_part_count: plan.rotation_parts.length,
        },
      };
    },
  }, projectToolDocs[3].status);

  createTool(projectToolDocs[4].name, {
    ...projectToolDocs[4],
    async execute(args) {
      const result = compileGeometrySpec(args);
      return {
        content: [
          {
            type: "text" as const,
            text: `Compiled Geometry Spec: ${result.groups_created} Group(s), ${result.cubes_created} Cube(s). Visual fidelity was not evaluated.`,
          },
        ],
        structuredContent: result,
      };
    },
  }, projectToolDocs[4].status);

  createTool("correct_geometry_from_report", {
    description: "Applies up to eight explicit role corrections from a bounded visual report in one Undo unit; it never invents corrections or changes hierarchy.",
    annotations: { title: "Correct Geometry from Report", destructiveHint: true },
    parameters: correctGeometryFromReportParameters,
    async execute(args) {
      if (!Project) throw new Error("No project is open.");
      const plan = requirePlanForOpenProject(args.plan_id);
      const updates = args.corrections.map((correction) => {
        const binding = getBoundGeometryRole(plan, correction.role);
        if (binding.type !== "cube") throw new Error(`Correction role "${correction.role}" is not a Cube role.`);
        const cube = Cube.all.find((item) => item.uuid === binding.uuid);
        if (!cube) throw new Error(`Bound Cube for role "${correction.role}" is missing.`);
        const from = worldPosition(plan, correction.min_normalized);
        const to = worldPosition(plan, correction.max_normalized);
        if (to.some((value, index) => value <= from[index])) throw new Error(`Correction target for "${correction.role}" is empty.`);
        return { cube, from, to };
      });
      Undo.initEdit({ elements: updates.map((item) => item.cube), outliner: false, collections: [] });
      try {
        updates.forEach(({ cube, from, to }) => cube.extend({ from, to }));
        Undo.finishEdit("Correct Geometry from Report", { elements: updates.map((item) => item.cube) });
      } catch (error) {
        Undo.cancelEdit(true);
        Canvas.updateAll();
        throw error;
      }
      Canvas.updateAll();
      return {
        content: [{ type: "text" as const, text: `Applied ${updates.length} bounded geometry correction(s). Visual fidelity was not evaluated.` }],
        structuredContent: { execution: "applied", visual_verdict: "not_evaluated", corrected_roles: updates.map((item) => item.cube.name) },
      };
    },
  }, "stable");
}
