/// <reference types="three" />
/// <reference types="blockbench-types" />
import { z } from "zod";
import { createTool, type ToolSpec } from "@/lib/factories";
import { findGroupOrThrow } from "@/lib/util";
import { STATUS_EXPERIMENTAL, STATUS_STABLE } from "@/lib/constants";
import {
  vector3Schema,
  animationIdOptionalSchema,
  animationChannelEnum,
  interpolationEnum,
  axisEnum,
  axisWithAllEnum,
  timeRangeSchema,
  boneNameSchema,
  loopModeEnum,
  keyframeDataSchema,
} from "@/lib/zodObjects";

export const createAnimationParameters = z.object({
  name: z.string().describe("Name of the animation"),
  loop: z
    .boolean()
    .default(false)
    .describe("Whether the animation should loop"),
  animation_length: z
    .number()
    .optional()
    .describe("Length of the animation in seconds"),
  bones: z
    .record(
      z.array(
        z.object({
          time: z.number(),
          position: vector3Schema.optional(),
          rotation: vector3Schema.optional(),
          scale: z.union([vector3Schema, z.number()]).optional(),
        })
      )
    )
    .describe("Keyframes for each bone"),
  particle_effects: z
    .record(z.string().describe("Effect name"))
    .optional()
    .describe("Particle effects with timestamps as keys"),
});

export const manageKeyframesParameters = z.object({
  animation_id: animationIdOptionalSchema,
  action: z
    .enum(["create", "delete", "edit", "select"])
    .describe("Action to perform on keyframes."),
  bone_name: boneNameSchema.describe("Name of the bone/group to manage keyframes for."),
  channel: animationChannelEnum.describe("Animation channel to modify."),
  keyframes: z
    .array(keyframeDataSchema)
    .describe("Keyframe data for the action."),
});

export const animationGraphEditorParameters = z.object({
  animation_id: animationIdOptionalSchema,
  bone_name: boneNameSchema.describe("Name of the bone/group to modify curves for."),
  channel: animationChannelEnum.describe("Animation channel to modify."),
  axis: axisWithAllEnum.default("all").describe("Axis to modify curves for."),
  action: z
    .enum([
      "smooth",
      "linear",
      "ease_in",
      "ease_out",
      "ease_in_out",
      "stepped",
      "custom",
    ])
    .describe("Type of curve modification to apply."),
  keyframe_range: timeRangeSchema
    .optional()
    .describe(
      "Time range to apply the curve modification. If not provided, applies to all keyframes."
    ),
  custom_curve: z
    .object({
      control_point_1: z
        .array(z.number())
        .length(2)
        .describe("First control point [time, value]."),
      control_point_2: z
        .array(z.number())
        .length(2)
        .describe("Second control point [time, value]."),
    })
    .optional()
    .describe(
      "Custom bezier curve control points (only for 'custom' action)."
    ),
});

export const boneRiggingParameters = z.object({
  action: z
    .enum([
      "create",
      "parent",
      "unparent",
      "delete",
      "rename",
      "set_pivot",
      "set_ik",
      "mirror",
    ])
    .describe("Action to perform on the bone structure."),
  bone_data: z
    .object({
      name: z
        .string()
        .min(1)
        .describe(
          "For create: new unique bone name. For all other actions: exact Group UUID or exact unique Group name; UUID is preferred."
        ),
      new_name: z
        .string()
        .min(1)
        .optional()
        .describe("New unique bone name required by the rename action."),
      parent: z
        .string()
        .optional()
        .describe(
          "Exact parent Group UUID or exact unique Group name. Required by parent; optional on create (omitted means intentional root)."
        ),
      origin: vector3Schema
        .optional()
        .describe(
          "Pivot/origin. Required by set_pivot. On create, omit unless a real joint, attachment, or transform center justifies a non-zero pivot."
        ),
      rotation: vector3Schema
        .optional()
        .describe(
          "Initial bone rotation for create only. Omit for neutral zero rotation; do not invent an angle without a model/reference reason."
        ),
      children: z
        .array(z.string())
        .optional()
        .describe(
          "For create only: exact Outliner element UUIDs or exact unique names to reparent into the new bone. Every child is preflighted before mutation."
        ),
      ik_enabled: z
        .boolean()
        .optional()
        .describe("Enable inverse kinematics for this bone."),
      ik_target: z
        .string()
        .optional()
        .describe("Existing target Group UUID or exact unique name for IK."),
      mirror_axis: axisEnum
        .optional()
        .describe("Axis required by mirror; no implicit mirror axis is assumed."),
    })
    .describe("Bone configuration data."),
});

export const animationTimelineParameters = z.object({
  action: z
    .enum([
      "play",
      "pause",
      "stop",
      "set_time",
      "set_length",
      "set_fps",
      "loop",
      "select_range",
    ])
    .describe("Timeline action to perform."),
  time: z
    .number()
    .optional()
    .describe("Time in seconds (for set_time action)."),
  length: z
    .number()
    .optional()
    .describe("Animation length in seconds (for set_length action)."),
  fps: z
    .number()
    .min(1)
    .max(120)
    .optional()
    .describe("Frames per second (for set_fps action)."),
  loop_mode: loopModeEnum.optional().describe("Loop mode for the animation."),
  range: timeRangeSchema.optional().describe("Time range for selection."),
});

export const batchKeyframeOperationsParameters = z.object({
  selection: z
    .enum(["all", "selected", "range", "pattern"])
    .default("selected")
    .describe("Which keyframes to operate on."),
  range: timeRangeSchema.optional().describe("Time range for keyframe selection."),
  pattern: z
    .object({
      interval: z.number().describe("Time interval between keyframes."),
      offset: z
        .number()
        .optional()
        .default(0)
        .describe("Time offset for the pattern."),
    })
    .optional()
    .describe("Pattern-based selection."),
  operation: z
    .enum(["offset", "scale", "reverse", "mirror", "smooth", "bake"])
    .describe("Operation to perform on keyframes."),
  parameters: z
    .object({
      offset_time: z.number().optional().describe("Time offset to apply."),
      offset_values: vector3Schema.optional().describe("Value offset to apply."),
      scale_factor: z
        .number()
        .optional()
        .describe("Scale factor for time or values."),
      scale_pivot: z
        .number()
        .optional()
        .describe("Pivot point for scaling."),
      mirror_axis: axisEnum.optional().describe("Axis to mirror values across."),
      bake_interval: z
        .number()
        .optional()
        .describe("Interval for baking keyframes."),
    })
    .optional()
    .describe("Operation-specific parameters."),
});

export const animationCopyPasteParameters = z.object({
  action: z
    .enum(["copy", "paste", "mirror_paste"])
    .describe("Copy or paste action."),
  source: z
    .object({
      animation: z
        .string()
        .optional()
        .describe("Source animation name or UUID."),
      bone: z.string().describe("Source bone name."),
      channels: z
        .array(animationChannelEnum)
        .optional()
        .default(["rotation", "position", "scale"])
        .describe("Channels to copy."),
      time_range: timeRangeSchema
        .optional()
        .describe(
          "Time range to copy. If not provided, copies all keyframes."
        ),
    })
    .optional()
    .describe("Source data for copy operation."),
  target: z
    .object({
      animation: z
        .string()
        .optional()
        .describe("Target animation name or UUID."),
      bone: z.string().describe("Target bone name."),
      time_offset: z
        .number()
        .optional()
        .default(0)
        .describe("Time offset for pasted keyframes."),
      mirror_axis: axisEnum.optional().describe("Axis to mirror across for mirror_paste."),
    })
    .optional()
    .describe("Target data for paste operation."),
});

export const animationToolDocs: ToolSpec[] = [
  {
    name: "create_animation",
    description: "Creates a new animation with keyframes for bones.",
    annotations: {
      title: "Create Animation",
      destructiveHint: true,
    },
    parameters: createAnimationParameters,
    status: STATUS_STABLE,
  },
  {
    name: "manage_keyframes",
    description:
      "Creates, deletes, or edits keyframes in the animation timeline for specific bones and channels.",
    annotations: {
      title: "Manage Keyframes",
      destructiveHint: true,
    },
    parameters: manageKeyframesParameters,
    status: STATUS_EXPERIMENTAL,
  },
  {
    name: "animation_graph_editor",
    description:
      "Controls animation curves in the graph editor for fine-tuning animations.",
    annotations: {
      title: "Animation Graph Editor",
      destructiveHint: true,
    },
    parameters: animationGraphEditorParameters,
    status: STATUS_EXPERIMENTAL,
  },
  {
    name: "bone_rigging",
    description:
      "Creates/manipulates Group bones with action-specific preflight. Existing bone/parent/child targets use UUID-first or exact-unique-name resolution; missing/ambiguous targets fail before Undo. set_pivot requires an explicit origin and uses Blockbench pivot transfer semantics so the pivot changes without intentionally moving the group's visual contents. mirror requires an explicit axis. Mutation failure cancels/reverts the opened edit. This tool does not infer joints, pivots, rotations, or hierarchy from visual appearance.",
    annotations: {
      title: "Bone Rigging",
      destructiveHint: true,
    },
    parameters: boneRiggingParameters,
    status: STATUS_EXPERIMENTAL,
  },
  {
    name: "animation_timeline",
    description:
      "Controls the animation timeline, including playback, time scrubbing, and timeline settings.",
    annotations: {
      title: "Animation Timeline",
      destructiveHint: true,
    },
    parameters: animationTimelineParameters,
    status: STATUS_EXPERIMENTAL,
  },
  {
    name: "batch_keyframe_operations",
    description: "Performs batch operations on multiple keyframes at once.",
    annotations: {
      title: "Batch Keyframe Operations",
      destructiveHint: true,
    },
    parameters: batchKeyframeOperationsParameters,
    status: STATUS_EXPERIMENTAL,
  },
  {
    name: "animation_copy_paste",
    description:
      "Copies and pastes animation data between bones or animations.",
    annotations: {
      title: "Animation Copy/Paste",
      destructiveHint: true,
    },
    parameters: animationCopyPasteParameters,
    status: STATUS_EXPERIMENTAL,
  },
];

function resolveRigGroup(reference: string): Group {
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
    `Group "${reference}" not found. Use list_outline to confirm the intended Group UUID.`
  );
}

function resolveRigElement(reference: string): OutlinerElement {
  const uuidMatch = Outliner.elements.find(
    (element: OutlinerElement) => element.uuid === reference
  );
  if (uuidMatch) return uuidMatch;

  const nameMatches = Outliner.elements.filter(
    (element: OutlinerElement) => element.name === reference
  );
  if (nameMatches.length === 1) return nameMatches[0];
  if (nameMatches.length > 1) {
    throw new Error(
      `Outliner element name "${reference}" is ambiguous. Use an exact UUID. Candidates: ${nameMatches
        .map((element: OutlinerElement) => `${element.name} (${element.uuid})`)
        .join(", ")}`
    );
  }

  throw new Error(
    `Outliner element "${reference}" not found. Use list_outline to confirm the intended child UUID.`
  );
}

export function registerAnimationTools() {
createTool(
  animationToolDocs[0].name,
  {
    ...animationToolDocs[0],
    async execute({ name, loop, animation_length, bones, particle_effects }) {
      const animationData = {
        loop,
        ...(animation_length && { animation_length }),
        bones: Object.fromEntries(
          Object.entries(bones).map(([boneName, keyframes]) => {
            const boneData: Record<
              string,
              Record<string, number | number[]>
            > = keyframes.reduce((acc, keyframe) => {
              const timeKey = keyframe.time.toString();
              if (keyframe.position) {
                (acc.position ??= {})[timeKey] = keyframe.position;
              }
              if (keyframe.rotation) {
                (acc.rotation ??= {})[timeKey] = keyframe.rotation;
              }
              if (keyframe.scale) {
                (acc.scale ??= {})[timeKey] = keyframe.scale;
              }
              return acc;
            }, {} as Record<string, Record<string, number | number[]>>);

            return [boneName, boneData];
          })
        ),
        ...(particle_effects && { particle_effects }),
      };

      Animator.loadFile({
        content: JSON.stringify({
          format_version: "1.8.0",
          animations: {
            [`animation.${name}`]: animationData,
          },
        }),
      });

      return `Created animation "${name}" with keyframes for ${
        Object.keys(bones).length
      } bones${
        particle_effects
          ? ` and ${Object.keys(particle_effects).length} particle effects`
          : ""
      }`;
    },
  },
  animationToolDocs[0].status
);

createTool(
  animationToolDocs[1].name,
  {
    ...animationToolDocs[1],
    async execute({ animation_id, action, bone_name, channel, keyframes }) {
      // Find or select animation
      const animation = animation_id
        ? Animation.all.find(
            (a) => a.uuid === animation_id || a.name === animation_id
          )
        : Animation.selected;

      if (!animation) {
        throw new Error("No animation found or selected.");
      }

      // Find the bone
      const group = findGroupOrThrow(bone_name);

      // Get or create animator
      let animator = animation.animators[group.uuid];
      if (!animator) {
        animator = new BoneAnimator(group.uuid, animation, bone_name);
        animation.animators[group.uuid] = animator;
      }

      Undo.initEdit({
        animations: [animation],
        keyframes: [],
      });

      switch (action) {
        case "create":
          keyframes.forEach((kf) => {
            const keyframe = animator.createKeyframe(
              {
                time: kf.time,
                channel,
                values: kf.values,
                interpolation: kf.interpolation,
              },
              kf.time,
              channel,
              false
            );

            if (kf.interpolation === "bezier" && kf.bezier_handles) {
              // @ts-ignore
              if (kf.bezier_handles.left_time !== undefined)
                keyframe.bezier_left_time = kf.bezier_handles.left_time;
              // @ts-ignore
              if (kf.bezier_handles.left_value)
                keyframe.bezier_left_value = kf.bezier_handles.left_value;
              // @ts-ignore
              if (kf.bezier_handles.right_time !== undefined)
                keyframe.bezier_right_time = kf.bezier_handles.right_time;
              // @ts-ignore
              if (kf.bezier_handles.right_value)
                keyframe.bezier_right_value = kf.bezier_handles.right_value;
            }
          });
          break;

        case "delete":
          keyframes.forEach((kf) => {
            const keyframe = animator[channel]?.find(
              (k) => Math.abs(k.time - kf.time) < 0.001
            );
            if (keyframe) {
              keyframe.remove();
            }
          });
          break;

        case "edit":
          keyframes.forEach((kf) => {
            const keyframe = animator[channel]?.find(
              (k) => Math.abs(k.time - kf.time) < 0.001
            );
            if (keyframe) {
              if (kf.values) {
                keyframe.set("values", kf.values);
              }
              if (kf.interpolation) {
                keyframe.interpolation = kf.interpolation;
              }
              if (kf.interpolation === "bezier" && kf.bezier_handles) {
                // @ts-ignore
                if (kf.bezier_handles.left_time !== undefined)
                  keyframe.bezier_left_time = kf.bezier_handles.left_time;
                // @ts-ignore
                if (kf.bezier_handles.left_value)
                  keyframe.bezier_left_value = kf.bezier_handles.left_value;
                // @ts-ignore
                if (kf.bezier_handles.right_time !== undefined)
                  keyframe.bezier_right_time = kf.bezier_handles.right_time;
                // @ts-ignore
                if (kf.bezier_handles.right_value)
                  keyframe.bezier_right_value = kf.bezier_handles.right_value;
              }
            }
          });
          break;

        case "select":
          Timeline.selected.empty();
          keyframes.forEach((kf) => {
            const keyframe = animator[channel]?.find(
              (k) => Math.abs(k.time - kf.time) < 0.001
            );
            if (keyframe) {
              keyframe.select();
            }
          });
          break;
      }

      Undo.finishEdit(`${action} keyframes`);
      Animator.preview();

      return `Successfully performed ${action} on ${keyframes.length} keyframes for ${bone_name}.${channel}`;
    },
  },
  animationToolDocs[1].status
);

createTool(
  animationToolDocs[2].name,
  {
    ...animationToolDocs[2],
    async execute({
      animation_id,
      bone_name,
      channel,
      axis,
      action,
      keyframe_range,
      custom_curve,
    }) {
      const animation = animation_id
        ? Animation.all.find(
            (a) => a.uuid === animation_id || a.name === animation_id
          )
        : Animation.selected;

      if (!animation) {
        throw new Error("No animation found or selected.");
      }

      const group = findGroupOrThrow(bone_name);

      const animator = animation.animators[group.uuid];
      if (!animator || !animator[channel]) {
        throw new Error(`No keyframes found for ${bone_name}.${channel}`);
      }

      Undo.initEdit({
        animations: [animation],
        keyframes: animator[channel],
      });

      const keyframes = animator[channel].filter((kf) => {
        if (!keyframe_range) return true;
        return kf.time >= keyframe_range.start && kf.time <= keyframe_range.end;
      });

      keyframes.forEach((kf, index) => {
        switch (action) {
          case "linear":
            kf.interpolation = "linear";
            break;

          case "stepped":
            kf.interpolation = "step";
            break;

          case "smooth":
            kf.interpolation = "catmullrom";
            break;

          case "ease_in":
          case "ease_out":
          case "ease_in_out":
            kf.interpolation = "bezier";
            const next = keyframes[index + 1];
            if (next) {
              const duration = next.time - kf.time;
              // @ts-ignore
              kf.bezier_left_time = 0;
              // @ts-ignore
              kf.bezier_right_time = duration;

              if (action === "ease_in") {
                // @ts-ignore
                kf.bezier_right_time = duration * 0.6;
              } else if (action === "ease_out") {
                // @ts-ignore
                kf.bezier_left_time = duration * 0.4;
              } else {
                // @ts-ignore
                kf.bezier_left_time = duration * 0.3;
                // @ts-ignore
                kf.bezier_right_time = duration * 0.7;
              }
            }
            break;

          case "custom":
            if (!custom_curve) {
              throw new Error("custom_curve is required for 'custom' action.");
            }
            kf.interpolation = "bezier";
            // @ts-ignore
            kf.bezier_left_time = custom_curve.control_point_1[0];
            // @ts-ignore
            kf.bezier_left_value = [
              custom_curve.control_point_1[1],
              custom_curve.control_point_1[1],
              custom_curve.control_point_1[1],
            ];
            // @ts-ignore
            kf.bezier_right_time = custom_curve.control_point_2[0];
            // @ts-ignore
            kf.bezier_right_value = [
              custom_curve.control_point_2[1],
              custom_curve.control_point_2[1],
              custom_curve.control_point_2[1],
            ];
            break;
        }
      });

      Undo.finishEdit("Modify animation curves");
      Animator.preview();
      updateKeyframeSelection();

      return `Applied ${action} curve to ${keyframes.length} keyframes in ${bone_name}.${channel}`;
    },
  },
  animationToolDocs[2].status
);

createTool(
  animationToolDocs[3].name,
  {
    ...animationToolDocs[3],
    async execute({ action, bone_data }) {
      let targetBone: Group | undefined;
      let parentBone: Group | "root" | undefined;
      let childElements: OutlinerElement[] = [];
      let ikTarget: Group | undefined;

      switch (action) {
        case "create":
          if (Group.all.some((group: Group) => group.name === bone_data.name)) {
            throw new Error(
              `Bone name "${bone_data.name}" already exists. Use a unique bone name so future animation/rig targets stay unambiguous.`
            );
          }
          parentBone = bone_data.parent
            ? resolveRigGroup(bone_data.parent)
            : "root";
          childElements = (bone_data.children ?? []).map(resolveRigElement);
          if (
            new Set(childElements.map((element) => element.uuid)).size !==
            childElements.length
          ) {
            throw new Error("children contains the same Outliner element more than once.");
          }
          if (bone_data.ik_enabled) {
            if (!bone_data.ik_target) {
              throw new Error(
                "ik_target is required when creating a bone with ik_enabled=true."
              );
            }
            ikTarget = resolveRigGroup(bone_data.ik_target);
          }
          break;

        case "parent":
          targetBone = resolveRigGroup(bone_data.name);
          if (!bone_data.parent) {
            throw new Error(
              "parent is required for the parent action. Use unparent to move a bone to root."
            );
          }
          parentBone = resolveRigGroup(bone_data.parent);
          if (targetBone === parentBone) {
            throw new Error("A bone cannot be parented to itself.");
          }
          break;

        case "unparent":
        case "delete":
          targetBone = resolveRigGroup(bone_data.name);
          break;

        case "rename":
          targetBone = resolveRigGroup(bone_data.name);
          if (!bone_data.new_name) {
            throw new Error("new_name is required for the rename action.");
          }
          if (
            Group.all.some(
              (group: Group) =>
                group !== targetBone && group.name === bone_data.new_name
            )
          ) {
            throw new Error(
              `Bone name "${bone_data.new_name}" already exists. Choose a unique name.`
            );
          }
          break;

        case "set_pivot":
          targetBone = resolveRigGroup(bone_data.name);
          if (!bone_data.origin) {
            throw new Error(
              "origin is required for set_pivot. Inspect the Group and provide the evidence-backed joint/attachment transform center explicitly."
            );
          }
          break;

        case "set_ik":
          targetBone = resolveRigGroup(bone_data.name);
          if (bone_data.ik_enabled === true && !bone_data.ik_target) {
            throw new Error("ik_target is required when ik_enabled=true.");
          }
          if (bone_data.ik_target) {
            ikTarget = resolveRigGroup(bone_data.ik_target);
          }
          break;

        case "mirror":
          targetBone = resolveRigGroup(bone_data.name);
          if (!bone_data.mirror_axis) {
            throw new Error(
              "mirror_axis is required for mirror. No implicit axis is assumed."
            );
          }
          break;
      }

      Undo.initEdit({
        outliner: true,
        elements: childElements,
        groups: targetBone ? [targetBone] : [],
      });

      let result = "";
      let createdGroup: Group | undefined;
      try {
        switch (action) {
          case "create": {
            const group = new Group({
              name: bone_data.name,
              origin: bone_data.origin ?? [0, 0, 0],
              rotation: bone_data.rotation ?? [0, 0, 0],
            }).init();
            createdGroup = group;

            group.addTo(parentBone ?? "root");
            childElements.forEach((element) => element.addTo(group));

            if (bone_data.ik_enabled && ikTarget) {
              group.ik_enabled = true;
              (group as Group & { ik_target?: string }).ik_target = ikTarget.uuid;
            }

            result = `Created bone "${group.name}" with UUID ${group.uuid}`;
            break;
          }

          case "parent": {
            targetBone!.addTo(parentBone as Group);
            result = `Parented "${targetBone!.name}" to "${(parentBone as Group).name}"`;
            break;
          }

          case "unparent": {
            targetBone!.addTo("root");
            result = `Unparented "${targetBone!.name}"`;
            break;
          }

          case "delete": {
            targetBone!.remove();
            result = `Deleted bone "${targetBone!.name}"`;
            break;
          }

          case "rename": {
            targetBone!.name = bone_data.new_name!;
            result = `Renamed bone to "${bone_data.new_name}"`;
            break;
          }

          case "set_pivot": {
            targetBone!.transferOrigin(bone_data.origin!);
            result = `Set pivot point for "${targetBone!.name}"`;
            break;
          }

          case "set_ik": {
            targetBone!.ik_enabled = bone_data.ik_enabled ?? false;
            if (ikTarget) {
              (targetBone! as Group & { ik_target?: string }).ik_target = ikTarget.uuid;
            }
            result = `Updated IK settings for "${targetBone!.name}"`;
            break;
          }

          case "mirror": {
            const axis = bone_data.mirror_axis!;
            const mirroredBone = targetBone!.duplicate();
            createdGroup = mirroredBone;
            const axisIndex = axis === "x" ? 0 : axis === "y" ? 1 : 2;
            mirroredBone.origin[axisIndex] *= -1;
            mirroredBone.name = targetBone!.name.includes("left")
              ? targetBone!.name.replace("left", "right")
              : targetBone!.name.includes("right")
              ? targetBone!.name.replace("right", "left")
              : targetBone!.name + "_mirrored";
            result = `Mirrored bone "${targetBone!.name}" across ${axis} axis`;
            break;
          }
        }

        Undo.finishEdit(
          `Bone rigging: ${action}`,
          createdGroup
            ? { outliner: true, groups: [createdGroup], elements: childElements }
            : undefined
        );
      } catch (error) {
        Undo.cancelEdit(true);
        Canvas.updateAll();
        throw error;
      }

      Canvas.updateAll();
      return result;
    },
  },
  animationToolDocs[3].status
);

createTool(
  animationToolDocs[4].name,
  {
    ...animationToolDocs[4],
    async execute({ action, time, length, fps, loop_mode, range }) {
      if (!Animation.selected) {
        throw new Error("No animation selected.");
      }

      let result = "";

      switch (action) {
        case "play":
          Timeline.start();
          result = "Started animation playback";
          break;

        case "pause":
          Timeline.pause();
          result = "Paused animation playback";
          break;

        case "stop":
          Timeline.setTime(0);
          Timeline.pause();
          result = "Stopped animation playback";
          break;

        case "set_time":
          if (time === undefined) {
            throw new Error("Time parameter required for set_time action.");
          }
          Timeline.setTime(time);
          result = `Set timeline to ${time} seconds`;
          break;

        case "set_length":
          if (length === undefined) {
            throw new Error("Length parameter required for set_length action.");
          }
          Animation.selected.length = length;
          result = `Set animation length to ${length} seconds`;
          break;

        case "set_fps":
          if (fps === undefined) {
            throw new Error("FPS parameter required for set_fps action.");
          }
          Animation.selected.snapping = fps;
          result = `Set animation FPS to ${fps}`;
          break;

        case "loop":
          if (loop_mode) {
            Animation.selected.loop = loop_mode;
          }
          result = `Set loop mode to ${loop_mode || Animation.selected.loop}`;
          break;

        case "select_range":
          if (!range) {
            throw new Error(
              "Range parameter required for select_range action."
            );
          }
          Timeline.keyframes.forEach((kf) => {
            if (kf.time >= range.start && kf.time <= range.end) {
              kf.select();
            } else {
              kf.selected = false;
            }
          });
          result = `Selected keyframes between ${range.start} and ${range.end} seconds`;
          break;
      }

      Animator.preview();

      return result;
    },
  },
  animationToolDocs[4].status
);

createTool(
  animationToolDocs[5].name,
  {
    ...animationToolDocs[5],
    async execute({ selection, range, pattern, operation, parameters = {} }) {
      if (!Animation.selected) {
        throw new Error("No animation selected.");
      }

      let keyframes: any[] = [];

      switch (selection) {
        case "all":
          keyframes = Timeline.keyframes;
          break;

        case "selected":
          keyframes = Timeline.selected;
          break;

        case "range":
          if (!range) {
            throw new Error("Range required for range selection.");
          }
          keyframes = Timeline.keyframes.filter(
            (kf) => kf.time >= range.start && kf.time <= range.end
          );
          break;

        case "pattern":
          if (!pattern) {
            throw new Error("Pattern required for pattern selection.");
          }
          keyframes = Timeline.keyframes.filter((kf) => {
            const relativeTime = kf.time - pattern.offset;
            return Math.abs(relativeTime % pattern.interval) < 0.001;
          });
          break;
      }

      if (keyframes.length === 0) {
        throw new Error("No keyframes found matching selection criteria.");
      }

      Undo.initEdit({
        keyframes: keyframes,
      });

      switch (operation) {
        case "offset":
          keyframes.forEach((kf) => {
            if (parameters.offset_time !== undefined) {
              kf.time += parameters.offset_time;
            }
            if (parameters.offset_values) {
              const values = kf.getArray();
              kf.set("values", [
                values[0] + parameters.offset_values[0],
                values[1] + parameters.offset_values[1],
                values[2] + parameters.offset_values[2],
              ]);
            }
          });
          break;

        case "scale":
          const pivot = parameters.scale_pivot || 0;
          const factor = parameters.scale_factor || 1;
          keyframes.forEach((kf) => {
            kf.time = pivot + (kf.time - pivot) * factor;
          });
          break;

        case "reverse":
          const times = keyframes.map((kf) => kf.time);
          const minTime = Math.min(...times);
          const maxTime = Math.max(...times);
          keyframes.forEach((kf) => {
            kf.time = maxTime - (kf.time - minTime);
          });
          break;

        case "mirror":
          if (!parameters.mirror_axis) {
            throw new Error("Mirror axis required for mirror operation.");
          }
          const axisIndex =
            parameters.mirror_axis === "x"
              ? 0
              : parameters.mirror_axis === "y"
              ? 1
              : 2;
          keyframes.forEach((kf) => {
            const values = kf.getArray();
            values[axisIndex] *= -1;
            kf.set("values", values);
          });
          break;

        case "smooth":
          keyframes.forEach((kf) => {
            kf.interpolation = "catmullrom";
          });
          break;

        case "bake":
          const interval =
            parameters.bake_interval || 1 / Animation.selected.snapping;
          const animators = new Set(keyframes.map((kf) => kf.animator));

          animators.forEach((animator) => {
            const channels = ["rotation", "position", "scale"];
            channels.forEach((channel) => {
              const channelKfs = animator[channel];
              if (!channelKfs || channelKfs.length < 2) return;

              const startTime = Math.min(...channelKfs.map((kf) => kf.time));
              const endTime = Math.max(...channelKfs.map((kf) => kf.time));

              for (let time = startTime; time <= endTime; time += interval) {
                if (
                  !channelKfs.find((kf) => Math.abs(kf.time - time) < 0.001)
                ) {
                  Timeline.time = time;
                  animator.fillValues(
                    animator.createKeyframe(
                      {
                        time,
                        channel,
                        values: animator.interpolate(channel, true),
                      },
                      time,
                      channel,
                      false
                    ),
                    null,
                    false
                  );
                }
              }
            });
          });
          break;
      }

      Undo.finishEdit(`Batch keyframe operation: ${operation}`);
      Animator.preview();

      return `Performed ${operation} on ${keyframes.length} keyframes`;
    },
  },
  animationToolDocs[5].status
);

createTool(
  animationToolDocs[6].name,
  {
    ...animationToolDocs[6],
    async execute({ action, source, target }) {
      // @ts-ignore
      if (!global.animationClipboard) {
        // @ts-ignore
        global.animationClipboard = null;
      }

      switch (action) {
        case "copy": {
          if (!source) {
            throw new Error("Source data required for copy operation.");
          }

          const srcAnimation = source.animation
            ? Animation.all.find(
                (a) =>
                  a.uuid === source.animation || a.name === source.animation
              )
            : Animation.selected;

          if (!srcAnimation) {
            throw new Error("Source animation not found.");
          }

          const srcBone = findGroupOrThrow(source.bone);

          const animator = srcAnimation.animators[srcBone.uuid];
          if (!animator) {
            throw new Error(`No animation data for bone "${source.bone}".`);
          }

          const copiedData: any = {
            bone_name: source.bone,
            channels: {},
          };

          source.channels.forEach((channel) => {
            if (!animator[channel]) return;

            let keyframes = animator[channel];
            if (source.time_range) {
              keyframes = keyframes.filter(
                (kf) =>
                  kf.time >= source.time_range.start &&
                  kf.time <= source.time_range.end
              );
            }

            copiedData.channels[channel] = keyframes.map((kf) => ({
              time: kf.time,
              values: kf.getArray(),
              interpolation: kf.interpolation,
              // @ts-ignore
              bezier_left_time: kf.bezier_left_time,
              // @ts-ignore
              bezier_left_value: kf.bezier_left_value,
              // @ts-ignore
              bezier_right_time: kf.bezier_right_time,
              // @ts-ignore
              bezier_right_value: kf.bezier_right_value,
            }));
          });

          // @ts-ignore
          global.animationClipboard = copiedData;

          return `Copied animation data from "${source.bone}" (${Object.keys(
            copiedData.channels
          ).join(", ")})`;
        }

        case "paste":
        case "mirror_paste": {
          if (!target) {
            throw new Error("Target data required for paste operation.");
          }

          // @ts-ignore
          if (!global.animationClipboard) {
            throw new Error("No animation data in clipboard. Copy first.");
          }

          const tgtAnimation = target.animation
            ? Animation.all.find(
                (a) =>
                  a.uuid === target.animation || a.name === target.animation
              )
            : Animation.selected;

          if (!tgtAnimation) {
            throw new Error("Target animation not found.");
          }

          const tgtBone = findGroupOrThrow(target.bone);

          let animator = tgtAnimation.animators[tgtBone.uuid];
          if (!animator) {
            animator = new BoneAnimator(
              tgtBone.uuid,
              tgtAnimation,
              target.bone
            );
            tgtAnimation.animators[tgtBone.uuid] = animator;
          }

          Undo.initEdit({
            animations: [tgtAnimation],
            keyframes: [],
          });

          // @ts-ignore
          const clipboardData = global.animationClipboard;
          const mirrorAxis =
            action === "mirror_paste" ? target.mirror_axis || "x" : null;
          const axisIndex =
            mirrorAxis === "x"
              ? 0
              : mirrorAxis === "y"
              ? 1
              : mirrorAxis === "z"
              ? 2
              : -1;

          Object.entries(clipboardData.channels).forEach(
            ([channel, keyframes]: [string, any[]]) => {
              keyframes.forEach((kfData) => {
                const values = [...kfData.values];

                if (
                  mirrorAxis &&
                  (channel === "rotation" || channel === "position")
                ) {
                  values[axisIndex] *= -1;
                }

                const keyframe = animator.createKeyframe(
                  {
                    time: kfData.time + (target.time_offset || 0),
                    channel,
                    values,
                    interpolation: kfData.interpolation,
                  },
                  kfData.time + (target.time_offset || 0),
                  channel,
                  false
                );

                if (kfData.interpolation === "bezier") {
                  // @ts-ignore
                  if (kfData.bezier_left_time !== undefined)
                    keyframe.bezier_left_time = kfData.bezier_left_time;
                  // @ts-ignore
                  if (kfData.bezier_left_value)
                    keyframe.bezier_left_value = kfData.bezier_left_value;
                  // @ts-ignore
                  if (kfData.bezier_right_time !== undefined)
                    keyframe.bezier_right_time = kfData.bezier_right_time;
                  // @ts-ignore
                  if (kfData.bezier_right_value)
                    keyframe.bezier_right_value = kfData.bezier_right_value;
                }
              });
            }
          );

          Undo.finishEdit(`${action} animation data`);
          Animator.preview();

          return `Pasted animation data to "${target.bone}"${
            mirrorAxis ? ` (mirrored on ${mirrorAxis} axis)` : ""
          }`;
        }
      }
    },
  },
  animationToolDocs[6].status
);
}
