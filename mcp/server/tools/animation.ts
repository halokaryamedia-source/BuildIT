/// <reference types="three" />
/// <reference types="blockbench-types" />
import { z } from "zod";
import { createTool, type ToolSpec } from "@/lib/factories";
import { STATUS_EXPERIMENTAL, STATUS_STABLE } from "@/lib/constants";
import { resolveCoreAnimation, resolveCoreGroup } from "@/lib/coreIdentity";
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

const bedrockParticleEffectSchema = z.object({
  effect: z
    .string()
    .min(1)
    .describe("Bedrock particle effect identifier."),
  locator: z
    .string()
    .min(1)
    .optional()
    .describe("Optional Locator name for the particle."),
  bind_to_actor: z
    .boolean()
    .optional()
    .describe(
      "Optional actor-binding flag; omit for native default."
    ),
  pre_effect_script: z
    .string()
    .optional()
    .describe("Optional pre-effect Molang script."),
});

const bedrockParticleEffectsSchema = z
  .record(
    z.union([
      bedrockParticleEffectSchema,
      z.array(bedrockParticleEffectSchema).min(1),
    ])
  )
  .superRefine((particleEffects, ctx) => {
    const effectiveTimes = new Map<number, string>();

    Object.keys(particleEffects).forEach((timestamp) => {
      const normalizedTimestamp = timestamp.trim();
      const numericTime = Number(normalizedTimestamp);
      const codecTime = Number.parseFloat(normalizedTimestamp);

      if (
        normalizedTimestamp.length === 0 ||
        !Number.isFinite(numericTime) ||
        !Number.isFinite(codecTime) ||
        numericTime !== codecTime
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [timestamp],
          message: `Particle timestamp "${timestamp}" must be a complete finite numeric value.`,
        });
        return;
      }

      if (numericTime < 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [timestamp],
          message: `Particle timestamp "${timestamp}" must be greater than or equal to 0.`,
        });
        return;
      }

      const previousTimestamp = effectiveTimes.get(numericTime);
      if (previousTimestamp !== undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [timestamp],
          message: `Particle timestamps "${previousTimestamp}" and "${timestamp}" resolve to the same effective time ${numericTime}. Use one timestamp per effective time.`,
        });
        return;
      }

      effectiveTimes.set(numericTime, timestamp);
    });
  })
  .describe(
    "Particle effects keyed by unique finite non-negative timestamps; each value is one effect or a non-empty effect array."
  );

const finiteCreateAnimationVector3Schema = z
  .array(z.number().finite())
  .length(3);

const bedrockBoneKeyframeSchema = z.object({
  time: z
    .number()
    .finite()
    .min(0)
    .describe("Finite keyframe time in seconds (>=0)."),
  position: finiteCreateAnimationVector3Schema
    .optional()
    .describe(
      "Authored Blockbench position [x,y,z]; converted internally to Bedrock file space."
    ),
  rotation: finiteCreateAnimationVector3Schema
    .optional()
    .describe(
      "Authored Blockbench rotation [x,y,z]; converted internally to Bedrock file space."
    ),
  scale: z
    .union([finiteCreateAnimationVector3Schema, z.number().finite()])
    .optional()
    .describe(
      "Finite scale [x,y,z] or uniform scalar."
    ),
});

const bedrockBoneKeyframesSchema = z
  .array(bedrockBoneKeyframeSchema)
  .superRefine((keyframes, ctx) => {
    const channelTimes = {
      position: new Map<number, number>(),
      rotation: new Map<number, number>(),
      scale: new Map<number, number>(),
    };
    const channels = ["position", "rotation", "scale"] as const;

    keyframes.forEach((keyframe, index) => {
      channels.forEach((channel) => {
        if (keyframe[channel] === undefined) return;

        const previousIndex = channelTimes[channel].get(keyframe.time);
        if (previousIndex !== undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [index, "time"],
            message: `Bone keyframe entries ${previousIndex} and ${index} both define ${channel} at time ${keyframe.time}. Use one ${channel} value per effective time.`,
          });
          return;
        }

        channelTimes[channel].set(keyframe.time, index);
      });
    });
  })
  .describe(
    "Transform keyframes at finite non-negative times; one value per channel per time."
  );

export const createAnimationParameters = z.object({
  name: z.string().describe("Name of the animation"),
  loop: z
    .boolean()
    .default(false)
    .describe("Whether the animation should loop"),
  animation_length: z
    .number()
    .finite()
    .min(0)
    .max(10000)
    .optional()
    .describe(
      "Optional finite animation length in seconds (0..10000)."
    ),
  bones: z
    .record(bedrockBoneKeyframesSchema)
    .describe(
      "Bone keyframes keyed by Group UUID or case-insensitively unique Group name; transform values use Blockbench authored space."
    ),
  particle_effects: bedrockParticleEffectsSchema.optional(),
});

const manageKeyframeDataSchema = keyframeDataSchema.extend({
  bezier_handles: z
    .object({
      left_time: vector3Schema.optional(),
      left_value: vector3Schema.optional(),
      right_time: vector3Schema.optional(),
      right_value: vector3Schema.optional(),
    })
    .optional()
    .describe(
      "Per-axis Bezier handle offsets [x,y,z] matching Blockbench keyframe vectors."
    ),
});

export const manageKeyframesParameters = z.object({
  animation_id: animationIdOptionalSchema,
  action: z
    .enum(["create", "delete", "edit", "select"])
    .describe("Action to perform on keyframes."),
  bone_name: boneNameSchema.describe("Exact Group UUID or exact unique Group name to manage keyframes for."),
  channel: animationChannelEnum.describe("Animation channel to modify."),
  keyframes: z
    .array(manageKeyframeDataSchema)
    .min(1)
    .describe("One or more keyframes for the action; empty mutation/selection requests are rejected."),
});

export const animationGraphEditorParameters = z.object({
  animation_id: animationIdOptionalSchema,
  bone_name: boneNameSchema.describe("Exact Group UUID or exact unique Group name to modify curves for."),
  channel: animationChannelEnum.describe("Animation channel to modify."),
  axis: axisWithAllEnum
    .default("all")
    .describe(
      "Bezier-handle axis to modify. 'all' applies the same handle change to x, y, and z; interpolation mode itself remains keyframe-level."
    ),
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
        .describe("Left Bezier handle offset [time, value]; time must be <= 0."),
      control_point_2: z
        .array(z.number())
        .length(2)
        .describe("Right Bezier handle offset [time, value]; time must be >= 0."),
    })
    .optional()
    .describe(
      "Custom Bezier left/right handle offsets for the requested axis or all axes (only for 'custom' action)."
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
          "Create: new unique name. Other actions: Group UUID or unique exact name."
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
          "Parent Group UUID or unique exact name; required by parent, optional on create."
        ),
      origin: vector3Schema
        .optional()
        .describe(
          "Pivot/origin; required by set_pivot. Omit on create unless a real joint/attachment needs it."
        ),
      rotation: vector3Schema
        .optional()
        .describe(
          "Initial create rotation; omit for neutral zero rotation."
        ),
      children: z
        .array(z.string())
        .optional()
        .describe(
          "Create-only child UUIDs or unique exact names; all are preflighted."
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

const animationTimelineRangeSchema = z
  .object({
    start: z
      .number()
      .finite()
      .min(0)
      .describe("Finite non-negative start time in seconds."),
    end: z
      .number()
      .finite()
      .min(0)
      .describe("Finite non-negative end time in seconds."),
  })
  .refine((range) => range.start <= range.end, {
    message: "Timeline selection range start must be less than or equal to end.",
    path: ["end"],
  })
  .describe(
    "Inclusive finite non-negative timeline selection range with start less than or equal to end."
  );

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
    .finite()
    .min(0)
    .max(1000)
    .optional()
    .describe(
      "Time in seconds for set_time. Must be finite and within Blockbench Timeline.setTime() range 0..1000; it is not clamped to animation.length."
    ),
  length: z
    .number()
    .finite()
    .min(0)
    .max(10000)
    .optional()
    .describe(
      "Length in seconds for set_length. Must be finite and within Blockbench's 0..10000 input range; Animation.setLength() may raise the resulting length to the authored keyframe floor."
    ),
  fps: z
    .number()
    .min(10)
    .max(500)
    .optional()
    .describe(
      "Animation snapping rate in frames per second for set_fps; Blockbench supports 10 to 500."
    ),
  loop_mode: loopModeEnum.optional().describe("Loop mode for the animation."),
  range: animationTimelineRangeSchema
    .optional()
    .describe("Inclusive time range for select_range."),
}).refine(
  (params) => params.action !== "loop" || params.loop_mode !== undefined,
  {
    message: "loop_mode is required for the loop action.",
    path: ["loop_mode"],
  }
);

export const batchKeyframeOperationsParameters = z
  .object({
    selection: z
      .enum(["all", "selected", "range", "pattern"])
      .default("selected")
      .describe("Which keyframes to operate on."),
    range: timeRangeSchema.optional().describe("Time range for keyframe selection."),
    pattern: z
      .object({
        interval: z
          .number()
          .finite()
          .positive()
          .describe("Finite positive time interval between keyframes."),
        offset: z
          .number()
          .finite()
          .optional()
          .default(0)
          .describe("Finite time offset for the pattern."),
      })
      .optional()
      .describe("Pattern-based selection."),
    operation: z
      .enum(["offset", "scale", "reverse", "mirror", "smooth", "bake"])
      .describe("Operation to perform on keyframes."),
    parameters: z
      .object({
        offset_time: z.number().finite().optional().describe("Finite time offset to apply."),
        offset_values: finiteCreateAnimationVector3Schema
          .optional()
          .describe("Finite value offset [x,y,z] to apply."),
        scale_factor: z
          .number()
          .finite()
          .optional()
          .describe("Finite scale factor for keyframe time."),
        scale_pivot: z
          .number()
          .finite()
          .optional()
          .describe("Finite pivot point for scaling."),
        mirror_axis: axisEnum.optional().describe("Axis to mirror values across."),
        bake_interval: z
          .number()
          .finite()
          .positive()
          .optional()
          .describe("Strictly positive finite interval in seconds for baking keyframes."),
      })
      .optional()
      .describe("Operation-specific parameters."),
  })
  .superRefine((params, ctx) => {
    if (params.selection === "range" && params.range === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["range"],
        message: "range is required when selection=range."
      });
    }
    if (params.selection === "pattern" && params.pattern === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["pattern"],
        message: "pattern is required when selection=pattern."
      });
    }

    const operationParameters = params.parameters;
    if (params.operation === "mirror" && operationParameters?.mirror_axis === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["parameters", "mirror_axis"],
        message: "mirror_axis is required for the mirror operation."
      });
    }

    if (params.operation === "offset") {
      const timeDelta = operationParameters?.offset_time ?? 0;
      const valueDelta = operationParameters?.offset_values ?? [0, 0, 0];
      if (timeDelta === 0 && valueDelta.every((value) => value === 0)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["parameters"],
          message: "offset requires a non-zero offset_time or offset_values change."
        });
      }
    }

    if (params.operation === "scale") {
      const factor = operationParameters?.scale_factor;
      if (factor === undefined || factor === 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["parameters", "scale_factor"],
          message: "scale requires an explicit scale_factor other than 1."
        });
      }
    }
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
      bone: z.string().describe("Exact source Group UUID or exact unique Group name."),
      channels: z
        .array(animationChannelEnum)
        .min(1)
        .optional()
        .default(["rotation", "position", "scale"])
        .describe("One or more animation channels to copy."),
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
      bone: z.string().describe("Exact target Group UUID or exact unique Group name."),
      time_offset: z
        .number()
        .finite()
        .optional()
        .default(0)
        .describe("Finite time offset for pasted keyframes."),
      mirror_axis: axisEnum.optional().describe("Axis to mirror across for mirror_paste."),
    })
    .optional()
    .describe("Target data for paste operation."),
});

export const animationToolDocs: ToolSpec[] = [
  {
    name: "create_animation",
    description:
      "Creates a new animation from Blockbench-authored transform values using the current Bedrock AnimationCodec.",
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
      "Creates or edits Group bones with preflighted explicit targets. `set_pivot` requires origin and preserves visual contents; `mirror` requires an axis. Missing/ambiguous targets fail before mutation. The tool does not infer joints, pivots, rotation, or hierarchy from appearance.",
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
    description: "Performs bounded batch keyframe operations and rejects incomplete or effective no-op offset/scale requests before mutation.",
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
      "Copies and pastes animation data between bones or animations. Copy requires at least one matching keyframe and paste rejects an empty clipboard before Undo.",
    annotations: {
      title: "Animation Copy/Paste",
      destructiveHint: true,
    },
    parameters: animationCopyPasteParameters,
    status: STATUS_EXPERIMENTAL,
  },
];

function toArrayVector3(values: readonly number[]): ArrayVector3 {
  if (values.length !== 3) {
    throw new Error(`Expected exactly 3 vector components, got ${values.length}.`);
  }
  return [values[0], values[1], values[2]];
}

function resolveAnimation(reference?: string) {
  return resolveCoreAnimation(reference, {
    allowSelected: true,
    notFoundHint: "Pass an exact Animation UUID or exact unique Animation name.",
  });
}

function resolveRigGroup(reference: string): Group {
  return resolveCoreGroup(
    reference,
    "Use list_outline to confirm the intended Group UUID."
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

export function countAnimationClipboardKeyframes(
  channels: Record<string, readonly unknown[]>
): number {
  return Object.values(channels).reduce(
    (count, keyframes) => count + keyframes.length,
    0
  );
}
export function registerAnimationTools() {
createTool(
  animationToolDocs[0].name,
  {
    ...animationToolDocs[0],
    parameters: createAnimationParameters,
    async execute({ name, loop, animation_length, bones, particle_effects }) {
      if (!Project) {
        throw new Error(
          "No project is open. Open or create the intended Bedrock Entity project before creating an animation."
        );
      }

      type BedrockAnimationCodec = {
        id: string;
        loadFile?: (
          file: { content: string; path?: string },
          animationFilter?: string[]
        ) => _Animation[];
      };
      const animationCodecApi = (
        globalThis as typeof globalThis & {
          AnimationCodec?: {
            getCodec(animation?: _Animation): BedrockAnimationCodec | undefined;
          };
        }
      ).AnimationCodec;
      const codec = animationCodecApi?.getCodec();
      if (!codec || codec.id !== "bedrock" || typeof codec.loadFile !== "function") {
        throw new Error(
          "create_animation requires the current Bedrock AnimationCodec. Open a Bedrock Entity project before creating an animation."
        );
      }

      const seenGroupReferences = new Map<string, string>();
      const resolvedBoneEntries = Object.entries(bones).map(
        ([boneReference, keyframes]) => {
          const uuidMatch = Group.all.find(
            (group: Group) => group.uuid === boneReference
          );
          let group: Group;

          if (uuidMatch) {
            group = uuidMatch;
          } else {
            const normalizedReference = boneReference.toLowerCase();
            const nameMatches = Group.all.filter(
              (candidate: Group) =>
                candidate.name.toLowerCase() === normalizedReference
            );
            if (nameMatches.length === 1) {
              group = nameMatches[0];
            } else if (nameMatches.length > 1) {
              throw new Error(
                `Group name "${boneReference}" is ambiguous under Bedrock animation matching. Rename colliding Groups or target one after names are unique. Candidates: ${nameMatches
                  .map((candidate: Group) => `${candidate.name} (${candidate.uuid})`)
                  .join(", ")}`
              );
            } else {
              throw new Error(
                `Group "${boneReference}" not found. Every create_animation bone must target an existing Group UUID or unique Group name.`
              );
            }
          }

          const codecNameMatches = Group.all.filter(
            (candidate: Group) =>
              candidate.name.toLowerCase() === group.name.toLowerCase()
          );
          if (
            codecNameMatches.length !== 1 ||
            codecNameMatches[0].uuid !== group.uuid
          ) {
            throw new Error(
              `Group "${group.name}" (${group.uuid}) cannot be targeted deterministically by create_animation because Bedrock animation import matches bone names case-insensitively. Rename colliding Groups first. Candidates: ${codecNameMatches
                .map((candidate: Group) => `${candidate.name} (${candidate.uuid})`)
                .join(", ")}`
            );
          }

          const previousReference = seenGroupReferences.get(group.uuid);
          if (previousReference !== undefined) {
            throw new Error(
              `create_animation bones "${previousReference}" and "${boneReference}" resolve to the same Group "${group.name}" (${group.uuid}). Provide each Group only once.`
            );
          }
          seenGroupReferences.set(group.uuid, boneReference);

          return {
            requestedReference: boneReference,
            group,
            keyframes,
          };
        }
      );

      const animationData = {
        loop,
        ...(animation_length !== undefined && { animation_length }),
        bones: Object.fromEntries(
          resolvedBoneEntries.map(({ group, keyframes }) => {
            const boneData: Record<
              string,
              Record<string, number | number[]>
            > = keyframes.reduce((acc, keyframe) => {
              const timeKey = keyframe.time.toString();
              if (keyframe.position) {
                const [x, y, z] = keyframe.position;
                (acc.position ??= {})[timeKey] = [-x, y, z];
              }
              if (keyframe.rotation) {
                const [x, y, z] = keyframe.rotation;
                (acc.rotation ??= {})[timeKey] = [-x, -y, z];
              }
              if (keyframe.scale !== undefined) {
                (acc.scale ??= {})[timeKey] = keyframe.scale;
              }
              return acc;
            }, {} as Record<string, Record<string, number | number[]>>);

            return [group.name, boneData];
          })
        ),
        ...(particle_effects && { particle_effects }),
      };

      const requestedAnimationName = `animation.${name}`;
      const fileContent = JSON.stringify({
        format_version: "1.8.0",
        animations: {
          [requestedAnimationName]: animationData,
        },
      });
      const animationUuidsBefore = new Set(
        AnimationItem.all.map((animation) => animation.uuid)
      );
      let editStarted = false;

      try {
        Undo.initEdit({ animations: [] });
        editStarted = true;

        const codecCreatedAnimations = codec.loadFile(
          { content: fileContent },
          [requestedAnimationName]
        );
        const createdAnimations = codecCreatedAnimations.filter(
          (animation) =>
            !animationUuidsBefore.has(animation.uuid) &&
            AnimationItem.all.includes(animation)
        );
        if (createdAnimations.length !== 1) {
          throw new Error(
            `Bedrock AnimationCodec created ${createdAnimations.length} new animations; expected exactly 1.`
          );
        }

        const [createdAnimation] = createdAnimations;
        resolvedBoneEntries.forEach(({ requestedReference, group }) => {
          const animator = createdAnimation.animators[group.uuid];
          if (!(animator instanceof BoneAnimator)) {
            throw new Error(
              `Created animation "${createdAnimation.name}" did not bind requested bone "${requestedReference}" to Group "${group.name}" (${group.uuid}).`
            );
          }
        });

        Undo.finishEdit("Create animation", {
          animations: createdAnimations,
        });
        editStarted = false;

        const requestedParticleEffectCount = particle_effects
          ? Object.values(particle_effects).reduce(
              (count, particleOrParticles) =>
                count +
                (Array.isArray(particleOrParticles)
                  ? particleOrParticles.length
                  : 1),
              0
            )
          : 0;
        const result = {
          animation: {
            uuid: createdAnimation.uuid,
            name: createdAnimation.name,
            loop: createdAnimation.loop,
            length: createdAnimation.length,
            snapping: createdAnimation.snapping,
          },
          requested_name: requestedAnimationName,
          requested_bone_count: Object.keys(bones).length,
          requested_particle_effect_count: requestedParticleEffectCount,
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
      } catch (error) {
        const createdDuringAttempt = AnimationItem.all.filter(
          (animation) => !animationUuidsBefore.has(animation.uuid)
        );
        createdDuringAttempt.forEach((animation) => {
          animation.remove(false, false);
        });
        if (editStarted) {
          Undo.cancelEdit(true);
        }
        throw error;
      }
    },
  },
  animationToolDocs[0].status
);

createTool(
  animationToolDocs[1].name,
  {
    ...animationToolDocs[1],
    parameters: manageKeyframesParameters,
    async execute({ animation_id, action, bone_name, channel, keyframes }) {
      const animation = resolveAnimation(animation_id);
      const group = resolveRigGroup(bone_name);
      const existingAnimator = animation.animators[group.uuid] as BoneAnimator | undefined;

      const applyValues = (
        keyframe: _Keyframe,
        values: number | number[] | undefined
      ) => {
        if (values === undefined) return;
        if (typeof values === "number") {
          keyframe.uniform = true;
          keyframe.set("x", values);
        } else {
          keyframe.uniform = false;
          keyframe.set("x", values[0]);
          keyframe.set("y", values[1]);
          keyframe.set("z", values[2]);
        }
      };

      if (action === "select") {
        if (animation !== AnimationItem.selected) {
          throw new Error(
            `Cannot select keyframes from animation "${animation.name}" because it is not the selected Blockbench animation.`
          );
        }
        if (!existingAnimator || !existingAnimator[channel]?.length) {
          throw new Error(`No keyframes found for ${group.name}.${channel}`);
        }

        Undo.initSelection({ timeline: true });
        try {
          Timeline.unselect();
          existingAnimator.select();
          keyframes.forEach((kf) => {
            const keyframe = existingAnimator[channel]?.find(
              (candidate: _Keyframe) => Math.abs(candidate.time - kf.time) < 0.001
            );
            if (keyframe) {
              keyframe.selected = true;
              if (!Timeline.selected.includes(keyframe)) {
                Timeline.selected.push(keyframe);
              }
            }
          });
          updateKeyframeSelection();
          Undo.finishSelection("Select keyframes");
        } catch (error) {
          Undo.cancelSelection(true);
          updateKeyframeSelection();
          throw error;
        }

        Animator.preview();
        return `Successfully performed ${action} on ${keyframes.length} keyframes for ${bone_name}.${channel}`;
      }

      if (action !== "create" && (!existingAnimator || !existingAnimator[channel]?.length)) {
        throw new Error(`No keyframes found for ${group.name}.${channel}`);
      }

      Undo.initEdit({
        animations: [animation],
      });

      try {
        let animator = existingAnimator;
        if (!animator) {
          const createdAnimator = animation.getBoneAnimator(group);
          if (!createdAnimator) {
            throw new Error(
              `Cannot create animation data for Group "${group.name}" in animation "${animation.name}".`
            );
          }
          animator = createdAnimator;
        }

        switch (action) {
          case "create":
            keyframes.forEach((kf) => {
              const keyframe = animator!.addKeyframe({
                channel,
                data_points: [{}],
                time: Timeline.snapTime(kf.time, animation),
                interpolation: kf.interpolation,
              });
              if (!keyframe) {
                throw new Error(`Channel "${channel}" is unavailable for ${group.name}.`);
              }
              applyValues(keyframe, kf.values);
              keyframe.replaceOthers([]);

              if (kf.interpolation === "bezier" && kf.bezier_handles) {
                // @ts-ignore
                if (kf.bezier_handles.left_time !== undefined)
                  keyframe.bezier_left_time = toArrayVector3(kf.bezier_handles.left_time);
                // @ts-ignore
                if (kf.bezier_handles.left_value)
                  keyframe.bezier_left_value = toArrayVector3(kf.bezier_handles.left_value);
                // @ts-ignore
                if (kf.bezier_handles.right_time !== undefined)
                  keyframe.bezier_right_time = toArrayVector3(kf.bezier_handles.right_time);
                // @ts-ignore
                if (kf.bezier_handles.right_value)
                  keyframe.bezier_right_value = toArrayVector3(kf.bezier_handles.right_value);
              }
            });
            animation.setLength();
            break;

          case "delete":
            keyframes.forEach((kf) => {
              const keyframe = animator![channel]?.find(
                (candidate: _Keyframe) => Math.abs(candidate.time - kf.time) < 0.001
              );
              if (keyframe) {
                keyframe.remove();
              }
            });
            break;

          case "edit":
            keyframes.forEach((kf) => {
              const keyframe = animator![channel]?.find(
                (candidate: _Keyframe) => Math.abs(candidate.time - kf.time) < 0.001
              );
              if (keyframe) {
                applyValues(keyframe, kf.values);
                if (kf.interpolation) {
                  keyframe.interpolation = kf.interpolation;
                }
                if (kf.interpolation === "bezier" && kf.bezier_handles) {
                  // @ts-ignore
                  if (kf.bezier_handles.left_time !== undefined)
                    keyframe.bezier_left_time = toArrayVector3(kf.bezier_handles.left_time);
                  // @ts-ignore
                  if (kf.bezier_handles.left_value)
                    keyframe.bezier_left_value = toArrayVector3(kf.bezier_handles.left_value);
                  // @ts-ignore
                  if (kf.bezier_handles.right_time !== undefined)
                    keyframe.bezier_right_time = toArrayVector3(kf.bezier_handles.right_time);
                  // @ts-ignore
                  if (kf.bezier_handles.right_value)
                    keyframe.bezier_right_value = toArrayVector3(kf.bezier_handles.right_value);
                }
              }
            });
            break;
        }

        Undo.finishEdit(`${action} keyframes`);
      } catch (error) {
        Undo.cancelEdit(true);
        Animator.preview();
        updateKeyframeSelection();
        throw error;
      }

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
    parameters: animationGraphEditorParameters,
    async execute({
      animation_id,
      bone_name,
      channel,
      axis,
      action,
      keyframe_range,
      custom_curve,
    }) {
      const animation = resolveAnimation(animation_id);
      const group = resolveRigGroup(bone_name);

      const animator = animation.animators[group.uuid];
      if (!animator || !animator[channel]?.length) {
        throw new Error(`No keyframes found for ${group.name}.${channel}`);
      }
      if (action === "custom") {
        if (!custom_curve) {
          throw new Error("custom_curve is required for 'custom' action.");
        }
        if (custom_curve.control_point_1[0] > 0) {
          throw new Error(
            "custom_curve.control_point_1 is the left Bezier handle and its time offset must be <= 0."
          );
        }
        if (custom_curve.control_point_2[0] < 0) {
          throw new Error(
            "custom_curve.control_point_2 is the right Bezier handle and its time offset must be >= 0."
          );
        }
      }

      const keyframes = (animator[channel] as _Keyframe[]).filter((kf: _Keyframe) => {
        if (!keyframe_range) return true;
        return kf.time >= keyframe_range.start && kf.time <= keyframe_range.end;
      });
      if (!keyframes.length) {
        throw new Error(`No keyframes found for ${group.name}.${channel} in the requested range.`);
      }

      const axisIndexes =
        axis === "all"
          ? [0, 1, 2]
          : [axis === "x" ? 0 : axis === "y" ? 1 : 2];
      const setBezierComponents = (
        keyframe: _Keyframe,
        property:
          | "bezier_left_time"
          | "bezier_left_value"
          | "bezier_right_time"
          | "bezier_right_value",
        value: number
      ) => {
        const handle = keyframe[property] as number[];
        axisIndexes.forEach((axisIndex) => {
          handle[axisIndex] = value;
        });
      };

      Undo.initEdit({
        animations: [animation],
      });

      try {
        keyframes.forEach((kf: _Keyframe, index: number) => {
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
            case "ease_in_out": {
              kf.interpolation = "bezier";
              const next = keyframes[index + 1];
              if (!next) break;

              const duration = next.time - kf.time;
              setBezierComponents(kf, "bezier_left_time", 0);
              setBezierComponents(kf, "bezier_right_time", duration);

              if (action === "ease_in") {
                setBezierComponents(
                  kf,
                  "bezier_right_time",
                  duration * 0.6
                );
              } else if (action === "ease_out") {
                setBezierComponents(
                  kf,
                  "bezier_left_time",
                  -duration * 0.4
                );
              } else {
                setBezierComponents(
                  kf,
                  "bezier_left_time",
                  -duration * 0.3
                );
                setBezierComponents(
                  kf,
                  "bezier_right_time",
                  duration * 0.7
                );
              }
              break;
            }

            case "custom":
              kf.interpolation = "bezier";
              setBezierComponents(
                kf,
                "bezier_left_time",
                custom_curve!.control_point_1[0]
              );
              setBezierComponents(
                kf,
                "bezier_left_value",
                custom_curve!.control_point_1[1]
              );
              setBezierComponents(
                kf,
                "bezier_right_time",
                custom_curve!.control_point_2[0]
              );
              setBezierComponents(
                kf,
                "bezier_right_value",
                custom_curve!.control_point_2[1]
              );
              break;
          }
        });

        Undo.finishEdit("Modify animation curves");
      } catch (error) {
        Undo.cancelEdit(true);
        Animator.preview();
        updateKeyframeSelection();
        throw error;
      }

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
    parameters: boneRiggingParameters,
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
              origin: bone_data.origin ? toArrayVector3(bone_data.origin) : [0, 0, 0],
              rotation: bone_data.rotation ? toArrayVector3(bone_data.rotation) : [0, 0, 0],
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
            targetBone!.transferOrigin(toArrayVector3(bone_data.origin!));
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
    parameters: animationTimelineParameters,
    async execute({ action, time, length, fps, loop_mode, range }) {
      const animation = AnimationItem.selected;
      if (!animation) {
        throw new Error("No animation selected.");
      }

      const runPersistentAnimationEdit = (
        label: string,
        mutate: () => void
      ) => {
        Undo.initEdit({ animations: [animation] });
        try {
          mutate();
          Undo.finishEdit(label);
        } catch (error) {
          Undo.cancelEdit(true);
          Animator.preview();
          throw error;
        }
      };

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
          runPersistentAnimationEdit("Change animation length", () => {
            animation.setLength(length);
          });
          result = `Set animation length to ${animation.length} seconds`;
          break;

        case "set_fps":
          if (fps === undefined) {
            throw new Error("FPS parameter required for set_fps action.");
          }
          runPersistentAnimationEdit("Change animation snapping", () => {
            animation.extend({ snapping: fps });
          });
          Timeline.setTimecode(Timeline.time);
          result = `Set animation FPS to ${animation.snapping}`;
          break;

        case "loop":
          if (loop_mode === undefined) {
            throw new Error("Loop mode parameter required for loop action.");
          }
          if (loop_mode !== animation.loop) {
            runPersistentAnimationEdit("Change animation loop mode", () => {
              animation.setLoop(loop_mode, false);
            });
          }
          result = `Set loop mode to ${animation.loop}`;
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
    parameters: batchKeyframeOperationsParameters,
    async execute({ selection, range, pattern, operation, parameters = {} }) {
      if (!AnimationItem.selected) {
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

      if (operation === "mirror" && !parameters.mirror_axis) {
        throw new Error("Mirror axis required for mirror operation.");
      }

      if (operation === "offset" || operation === "mirror") {
        Undo.initEdit({
          keyframes,
        });

        try {
          if (operation === "offset") {
            keyframes.forEach((kf: _Keyframe) => {
              if (parameters.offset_time !== undefined) {
                kf.time += parameters.offset_time;
              }

              if (parameters.offset_values && kf.transform) {
                const [offsetX, offsetY, offsetZ] = parameters.offset_values;
                const offsetsMatch = offsetX === offsetY && offsetX === offsetZ;

                if (kf.uniform && !offsetsMatch) {
                  kf.uniform = false;
                }

                if (kf.uniform) {
                  kf.offset("x", offsetX);
                } else {
                  kf.offset("x", offsetX);
                  kf.offset("y", offsetY);
                  kf.offset("z", offsetZ);
                }
              }
            });
          } else {
            const mirrorAxis = parameters.mirror_axis;
  if (!mirrorAxis) {
    throw new Error("Mirror axis required for mirror operation.");
  }
  keyframes.forEach((kf: _Keyframe) => {
    kf.flip(mirrorAxis);
  });
          }

          Undo.finishEdit(`Batch keyframe operation: ${operation}`);
        } catch (error) {
          Undo.cancelEdit(true);
          Animator.preview();
          updateKeyframeSelection();
          throw error;
        }

        Animator.preview();
        return `Performed ${operation} on ${keyframes.length} keyframes`;
      }

      if (operation === "bake") {
        const animation = AnimationItem.selected;
        const interval =
          parameters.bake_interval ?? 1 / animation.snapping;
        if (!Number.isFinite(interval) || interval <= 0) {
          throw new Error(
            "Bake interval must be a finite number greater than 0."
          );
        }

        const originalTimelineTime = Timeline.time;
        const animators = new Set(keyframes.map((kf) => kf.animator));
        const bakeSamples: Array<{
          animator: any;
          channel: string;
          time: number;
          values: any[];
        }> = [];
        let editStarted = false;

        try {
          animators.forEach((animator: any) => {
            const channels = ["rotation", "position", "scale"];
            channels.forEach((channel) => {
              const channelKfs = animator[channel];
              if (!channelKfs || channelKfs.length < 2) return;

              const startTime = Math.min(...channelKfs.map((kf: _Keyframe) => kf.time));
              const endTime = Math.max(...channelKfs.map((kf: _Keyframe) => kf.time));

              for (let time = startTime; time <= endTime; time += interval) {
                const targetTime = Timeline.snapTime(time, animation);
                const alreadyExists = channelKfs.some(
                  (kf: _Keyframe) => Math.abs(kf.time - targetTime) < 0.001
                );
                const alreadyPlanned = bakeSamples.some(
                  (sample) =>
                    sample.animator === animator &&
                    sample.channel === channel &&
                    Math.abs(sample.time - targetTime) < 0.001
                );
                if (alreadyExists || alreadyPlanned) continue;

                Timeline.time = targetTime;
                const values = animator.interpolate(channel, true);
                if (!Array.isArray(values) || values.length < 3) {
                  throw new Error(
                    `Could not sample ${channel} values while baking animation.`
                  );
                }
                bakeSamples.push({
                  animator,
                  channel,
                  time: targetTime,
                  values: [...values],
                });
              }
            });
          });

          Timeline.time = originalTimelineTime;

          if (bakeSamples.length) {
            Undo.initEdit({
              animations: [animation],
            });
            editStarted = true;

            bakeSamples.forEach((sample) => {
              const keyframe = sample.animator.addKeyframe({
                channel: sample.channel,
                time: sample.time,
                interpolation: settings.default_keyframe_interpolation.value,
                data_points: [
                  {
                    x: sample.values[0],
                    y: sample.values[1],
                    z: sample.values[2],
                  },
                ],
              });
              if (!keyframe) {
                throw new Error(
                  `Channel "${sample.channel}" is unavailable while baking animation.`
                );
              }
            });

            animation.setLength();
            Undo.finishEdit("Batch keyframe operation: bake");
            editStarted = false;
          }
        } catch (error) {
          if (editStarted) {
            Undo.cancelEdit(true);
          }
          throw error;
        } finally {
          Timeline.time = originalTimelineTime;
          Animator.preview();
          updateKeyframeSelection();
        }

        return `Performed ${operation} on ${keyframes.length} keyframes`;
      }

      if (operation === "scale") {
        const animation = AnimationItem.selected;
        const pivot = parameters.scale_pivot ?? 0;
        const factor = parameters.scale_factor ?? 1;
        if (!Number.isFinite(pivot)) {
          throw new Error("Scale pivot must be a finite number.");
        }
        if (!Number.isFinite(factor)) {
          throw new Error("Scale factor must be a finite number.");
        }

        const stretchStates = keyframes.map((keyframe: _Keyframe) => ({
          keyframe,
          time: keyframe.time,
          bezierLeftTime:
            keyframe.interpolation === "bezier"
              ? [...keyframe.bezier_left_time]
              : undefined,
          bezierRightTime:
            keyframe.interpolation === "bezier"
              ? [...keyframe.bezier_right_time]
              : undefined,
        }));

        Undo.initEdit({
          animations: [animation],
        });

        try {
          stretchStates.forEach(
            ({ keyframe, time, bezierLeftTime, bezierRightTime }) => {
              keyframe.time = Timeline.snapTime(
                pivot + (time - pivot) * factor,
                animation
              );

              if (bezierLeftTime && bezierRightTime) {
                for (let axisIndex = 0; axisIndex < 3; axisIndex++) {
                  keyframe.bezier_left_time[axisIndex] =
                    bezierLeftTime[axisIndex] * factor;
                  keyframe.bezier_right_time[axisIndex] =
                    bezierRightTime[axisIndex] * factor;
                }
              }
            }
          );

          const replacedKeyframes: _Keyframe[] = [];
          stretchStates.forEach(({ keyframe }) => {
            keyframe.replaceOthers(replacedKeyframes);
          });

          animation.setLength();
          Undo.finishEdit("Batch keyframe operation: scale");
        } catch (error) {
          Undo.cancelEdit(true);
          Animator.preview();
          updateKeyframeSelection();
          throw error;
        }

        Animator.preview();
        updateKeyframeSelection();
        return `Performed ${operation} on ${keyframes.length} keyframes`;
      }

      if (operation === "reverse") {
        const times = keyframes.map((kf: _Keyframe) => kf.time);
        const startTime = Math.min(...times);
        const endTime = Math.max(...times);

        Undo.initEdit({
          keyframes,
        });

        try {
          keyframes.forEach((kf: _Keyframe) => {
            kf.time = endTime + startTime - kf.time;

            if (kf.transform && kf.data_points.length > 1) {
              kf.data_points.reverse();
            }

            if (kf.interpolation === "bezier") {
              const rightTime = [...kf.bezier_right_time];
              const rightValue = [...kf.bezier_right_value];
              const leftTime = [...kf.bezier_left_time];
              const leftValue = [...kf.bezier_left_value];

              for (let axisIndex = 0; axisIndex < 3; axisIndex++) {
                kf.bezier_right_time[axisIndex] = -leftTime[axisIndex];
                kf.bezier_right_value[axisIndex] = leftValue[axisIndex];
                kf.bezier_left_time[axisIndex] = -rightTime[axisIndex];
                kf.bezier_left_value[axisIndex] = rightValue[axisIndex];
              }
            }
          });

          Undo.finishEdit("Batch keyframe operation: reverse");
        } catch (error) {
          Undo.cancelEdit(true);
          Animator.preview();
          updateKeyframeSelection();
          throw error;
        }

        Animator.preview();
        updateKeyframeSelection();
        return `Performed ${operation} on ${keyframes.length} keyframes`;
      }

      if (operation === "smooth") {
        const transformKeyframes = keyframes.filter(
          (kf: _Keyframe) => kf.transform
        );
        if (!transformKeyframes.length) {
          throw new Error(
            "No transform keyframes found matching selection criteria for smooth."
          );
        }

        Undo.initEdit({
          keyframes: transformKeyframes,
        });

        try {
          transformKeyframes.forEach((kf: _Keyframe) => {
            kf.interpolation = "catmullrom";
          });
          Undo.finishEdit("Batch keyframe operation: smooth");
        } catch (error) {
          Undo.cancelEdit(true);
          Animator.preview();
          updateKeyframeSelection();
          throw error;
        }

        Animator.preview();
        updateKeyframeSelection();
        return `Performed ${operation} on ${transformKeyframes.length} transform keyframes`;
      }

      throw new Error(`Unsupported batch keyframe operation: ${operation}`);
    },
  },
  animationToolDocs[5].status
);

createTool(
  animationToolDocs[6].name,
  {
    ...animationToolDocs[6],
    parameters: animationCopyPasteParameters,
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

          const srcAnimation = resolveAnimation(source.animation);
          const srcBone = resolveRigGroup(source.bone);

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

            let keyframes = animator[channel] as _Keyframe[];
            const timeRange = source.time_range;
            if (timeRange) {
              keyframes = keyframes.filter(
                (kf: _Keyframe) =>
                  kf.time >= timeRange.start &&
                  kf.time <= timeRange.end
              );
            }

            copiedData.channels[channel] = keyframes.map((kf: _Keyframe) => ({
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

          const copiedKeyframeCount = countAnimationClipboardKeyframes(
            copiedData.channels
          );
          if (copiedKeyframeCount === 0) {
            throw new Error(
              `No keyframes matched the requested channels/time range for "${source.bone}". Clipboard was not changed.`
            );
          }

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

          const tgtAnimation = resolveAnimation(target.animation);
          const tgtBone = resolveRigGroup(target.bone);
          const existingAnimator = tgtAnimation.animators[tgtBone.uuid] as BoneAnimator | undefined;

          // @ts-ignore
          const clipboardData = global.animationClipboard;
          if (countAnimationClipboardKeyframes(clipboardData.channels) === 0) {
            throw new Error(
              "Animation clipboard contains no keyframe data. Copy a non-empty animation range first."
            );
          }
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
          const timeOffset = target.time_offset ?? 0;

          Undo.initEdit({
            animations: [tgtAnimation],
          });

          try {
            let animator = existingAnimator;
            if (!animator) {
              const createdAnimator = tgtAnimation.getBoneAnimator(tgtBone);
              if (!createdAnimator) {
                throw new Error(
                  `Cannot paste animation data into Group "${tgtBone.name}" in animation "${tgtAnimation.name}".`
                );
              }
              animator = createdAnimator;
            }

            Object.entries(clipboardData.channels as Record<string, any[]>).forEach(
              ([channel, keyframes]: [string, any[]]) => {
                keyframes.forEach((kfData) => {
                  const values = [...kfData.values];

                  if (
                    mirrorAxis &&
                    (channel === "rotation" || channel === "position")
                  ) {
                    values[axisIndex] *= -1;
                  }

                  const targetTime = Timeline.snapTime(
                    kfData.time + timeOffset,
                    tgtAnimation
                  );
                  const keyframe = animator!.addKeyframe({
                    channel,
                    data_points: [
                      {
                        x: values[0],
                        y: values[1],
                        z: values[2],
                      },
                    ],
                    time: targetTime,
                    interpolation: kfData.interpolation,
                  });
                  if (!keyframe) {
                    throw new Error(
                      `Channel "${channel}" is unavailable for ${tgtBone.name}.`
                    );
                  }
                  keyframe.replaceOthers([]);

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

            tgtAnimation.setLength();
            Undo.finishEdit(`${action} animation data`);
          } catch (error) {
            Undo.cancelEdit(true);
            Animator.preview();
            updateKeyframeSelection();
            throw error;
          }

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