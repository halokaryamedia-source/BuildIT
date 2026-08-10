/// <reference types="three" />
/// <reference types="blockbench-types" />
import { z } from "zod";
import { createTool, type ToolSpec } from "@/lib/factories";
import { STATUS_EXPERIMENTAL } from "@/lib/constants";
import { animationIdOptionalSchema } from "@/lib/zodObjects";

export const inspectAnimationParameters = z.object({
  animation_id: animationIdOptionalSchema.describe(
    "Exact Animation UUID or exact unique Animation name. If omitted, uses the currently selected Animation."
  ),
  bone: z
    .string()
    .min(1)
    .optional()
    .describe(
      "Optional Group UUID or unique exact name. Omit for animation/bone summaries; provide for detailed authored keyframes."
    ),
});

export const animationInspectionToolDocs: ToolSpec[] = [
  {
    name: "inspect_animation",
    description:
      "Returns read-only authored Animation state: identity/settings, existing bone-animator and particle summaries, plus detailed transform keyframes when `bone` is supplied. UUID is preferred; explicit names must be unique. It does not change selection/timeline or create animators.",
    annotations: {
      title: "Inspect Authored Animation",
      readOnlyHint: true,
    },
    parameters: inspectAnimationParameters,
    status: STATUS_EXPERIMENTAL,
  },
];

type TransformChannel = "rotation" | "position" | "scale";
type ParticleDataPoint = KeyframeDataPoint & {
  effect?: string;
  locator?: string;
  bind_to_actor?: boolean;
  script?: string;
};

function resolveAnimation(reference?: string): _Animation {
  if (reference === undefined) {
    const selected = AnimationItem.selected;
    if (!selected) {
      throw new Error(
        "No animation selected. Pass an exact Animation UUID or exact unique Animation name."
      );
    }
    return selected;
  }

  const uuidMatch = AnimationItem.all.find(
    (animation) => animation.uuid === reference
  );
  if (uuidMatch) return uuidMatch;

  const nameMatches = AnimationItem.all.filter(
    (animation) => animation.name === reference
  );
  if (nameMatches.length === 1) return nameMatches[0];
  if (nameMatches.length > 1) {
    throw new Error(
      `Animation name "${reference}" is ambiguous. Use an exact UUID. Candidates: ${nameMatches
        .map((animation) => `${animation.name} (${animation.uuid})`)
        .join(", ")}`
    );
  }

  throw new Error(
    `Animation "${reference}" not found. Pass an exact Animation UUID or exact unique Animation name.`
  );
}

function resolveGroup(reference: string): Group {
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

function inspectKeyframe(keyframe: _Keyframe) {
  return {
    uuid: keyframe.uuid,
    time: keyframe.time,
    values: keyframe.data_points.map((_, index) => keyframe.getArray(index)),
    uniform: keyframe.uniform,
    interpolation: keyframe.interpolation,
    bezier:
      keyframe.interpolation === "bezier"
        ? {
            linked: keyframe.bezier_linked,
            left_time: [...keyframe.bezier_left_time],
            left_value: [...keyframe.bezier_left_value],
            right_time: [...keyframe.bezier_right_time],
            right_value: [...keyframe.bezier_right_value],
          }
        : null,
  };
}

function inspectChannel(animator: BoneAnimator, channel: TransformChannel) {
  const keyframes = ((animator[channel] as _Keyframe[] | undefined) ?? [])
    .slice()
    .sort((a, b) => a.time - b.time || a.uuid.localeCompare(b.uuid));

  return {
    keyframe_count: keyframes.length,
    keyframes: keyframes.map(inspectKeyframe),
  };
}

function normalizePreEffectScript(script: string | undefined): string | null {
  if (!script || !script.replace(/[\n\s;.]+/g, "")) return null;
  return script.match(/;$/) ? script : `${script};`;
}

function inspectParticleEffects(animation: _Animation) {
  const existingEffects = animation.animators.effects;
  if (!existingEffects) {
    return {
      has_animator: false,
      animator: null,
      particle: {
        keyframe_count: 0,
        particle_count: 0,
        keyframes: [],
      },
    };
  }
  if (!(existingEffects instanceof EffectAnimator)) {
    throw new Error(
      `Animation "${animation.name}" has a non-EffectAnimator stored at animation.animators.effects.`
    );
  }

  const keyframes = ((existingEffects.particle as _Keyframe[] | undefined) ?? [])
    .slice()
    .sort((a, b) => a.time - b.time || a.uuid.localeCompare(b.uuid));
  const inspectedKeyframes = keyframes.map((keyframe) => ({
    uuid: keyframe.uuid,
    time: keyframe.time,
    particles: keyframe.data_points.map((dataPoint) => {
      const particle = dataPoint as ParticleDataPoint;
      return {
        effect: particle.effect || null,
        locator: particle.locator || null,
        bind_to_actor: particle.bind_to_actor === false ? false : null,
        pre_effect_script: normalizePreEffectScript(particle.script),
      };
    }),
  }));

  return {
    has_animator: true,
    animator: {
      uuid: existingEffects.uuid,
      name: existingEffects.name,
    },
    particle: {
      keyframe_count: inspectedKeyframes.length,
      particle_count: inspectedKeyframes.reduce(
        (count, keyframe) => count + keyframe.particles.length,
        0
      ),
      keyframes: inspectedKeyframes,
    },
  };
}

function summarizeBoneAnimators(animation: _Animation) {
  return Object.values(animation.animators)
    .filter((animator): animator is BoneAnimator => animator instanceof BoneAnimator)
    .map((animator) => {
      const group = Group.all.find((candidate: Group) => candidate.uuid === animator.uuid);
      return {
        animator: {
          uuid: animator.uuid,
          name: animator.name,
        },
        group: group
          ? {
              uuid: group.uuid,
              name: group.name,
            }
          : null,
        channels: {
          rotation: ((animator.rotation as _Keyframe[] | undefined) ?? []).length,
          position: ((animator.position as _Keyframe[] | undefined) ?? []).length,
          scale: ((animator.scale as _Keyframe[] | undefined) ?? []).length,
        },
      };
    })
    .sort((a, b) => {
      const aName = a.group?.name ?? a.animator.name;
      const bName = b.group?.name ?? b.animator.name;
      return aName.localeCompare(bName) || a.animator.uuid.localeCompare(b.animator.uuid);
    });
}

export function registerAnimationInspectionTools() {
  createTool(
    animationInspectionToolDocs[0].name,
    {
      ...animationInspectionToolDocs[0],
      async execute({ animation_id, bone }) {
        const animation = resolveAnimation(animation_id);
        const boneAnimators = summarizeBoneAnimators(animation);
        const effects = inspectParticleEffects(animation);

        let focusedBone = null;
        if (bone !== undefined) {
          const group = resolveGroup(bone);
          const existingAnimator = animation.animators[group.uuid];
          if (existingAnimator && !(existingAnimator instanceof BoneAnimator)) {
            throw new Error(
              `Animator stored for Group "${group.name}" (${group.uuid}) is not a BoneAnimator.`
            );
          }

          const animator = existingAnimator as BoneAnimator | undefined;
          focusedBone = {
            group: {
              uuid: group.uuid,
              name: group.name,
            },
            has_animator: !!animator,
            animator: animator
              ? {
                  uuid: animator.uuid,
                  name: animator.name,
                }
              : null,
            channels: animator
              ? {
                  rotation: inspectChannel(animator, "rotation"),
                  position: inspectChannel(animator, "position"),
                  scale: inspectChannel(animator, "scale"),
                }
              : {
                  rotation: { keyframe_count: 0, keyframes: [] },
                  position: { keyframe_count: 0, keyframes: [] },
                  scale: { keyframe_count: 0, keyframes: [] },
                },
          };
        }

        const result = {
          authored_space: "blockbench_animation" as const,
          animation: {
            uuid: animation.uuid,
            name: animation.name,
            loop: animation.loop,
            length: animation.length,
            snapping: animation.snapping,
          },
          bone_animator_count: boneAnimators.length,
          bone_animators: boneAnimators,
          effects,
          focused_bone: focusedBone,
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
    },
    animationInspectionToolDocs[0].status
  );
}
