/// <reference types="three" />
/// <reference types="blockbench-types" />

import { z } from "zod";
import {
  getAllToolDefinitions,
  invalidateToolRegistrationRuntimeCaches,
} from "@/lib/factories";
import { resolveCoreAnimation, resolveCoreGroup } from "@/lib/coreIdentity";
import {
  animationIdOptionalSchema,
  loopModeEnum,
} from "@/lib/zodObjects";
import {
  analyzeAnimationMolangExpressions,
  type AnimationMolangExpressionInput,
} from "@/lib/animationMolangSemantics";
import {
  analyzeAnimationMotionDynamics,
  type AnimationMotionTrackInput,
} from "@/lib/animationMotionDynamics";
import {
  normalizeControllerBlendCurve,
  wouldCreateControllerCompositionCycle,
} from "@/lib/animationControllerComposition";

type JsonRecord = Record<string, unknown>;
type RuntimeAnimationItem = _Animation | AnimationController;
type RuntimeControllerLink = {
  uuid: string;
  key: string;
  animation: string;
  blend_value: string | number;
};
type RuntimeControllerState = AnimationControllerState & {
  animations: RuntimeControllerLink[];
  blend_transition_curve?: Record<string, number>;
};

const authoredMolangValueSchema = z.union([
  z.number().finite(),
  z
    .string()
    .refine((value) => value.trim().replace(/\n/g, "").length > 0, {
      message: "Molang text must contain a non-whitespace authored value.",
    }),
  z.null(),
]);

const controllerBlendValueSchema = z.union([
  z.number().finite(),
  z.string().refine((value) => value.trim().length > 0, {
    message: "Controller blend value must contain non-whitespace authored Molang.",
  }),
  z.null(),
]);

const rotationSpaceSchema = z
  .object({
    bone_name: z.string().min(1).describe("Group UUID or unique Group name."),
    relative_to: z
      .enum(["parent", "entity"])
      .describe("Bedrock rotation space. entity exports relative_to.rotation=entity."),
  })
  .strict();

const controllerBlendCurvePointSchema = z
  .object({
    time: z.number().finite().min(0).max(1),
    value: z.number().finite(),
  })
  .strict();

const controllerNativeOperationSchema = z.discriminatedUnion("op", [
  z
    .object({
      op: z.literal("set_state_blend"),
      state: z.string().min(1),
      blend_transition: z.number().finite().min(0).max(10000).optional(),
      blend_via_shortest_path: z.boolean().optional(),
      blend_curve: z
        .union([
          z.array(controllerBlendCurvePointSchema).min(2).max(16),
          z.null(),
        ])
        .optional()
        .describe("Normalized 0..1 time/value curve points; null clears the curve."),
    })
    .strict()
    .superRefine((value, ctx) => {
      if (
        value.blend_transition === undefined &&
        value.blend_via_shortest_path === undefined &&
        value.blend_curve === undefined
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "set_state_blend requires at least one authored blend field.",
        });
      }
    }),
  z
    .object({
      op: z.literal("add_animation_item"),
      state: z.string().min(1),
      item: z.string().min(1).describe("Animation or AnimationController UUID/name."),
      blend_value: controllerBlendValueSchema.optional(),
    })
    .strict(),
  z
    .object({
      op: z.literal("update_animation_item"),
      state: z.string().min(1),
      id: z.string().min(1).describe("Existing animation-link UUID."),
      item: z.string().min(1).optional().describe("Animation or AnimationController UUID/name."),
      blend_value: controllerBlendValueSchema.optional(),
    })
    .strict()
    .superRefine((value, ctx) => {
      if (value.item === undefined && value.blend_value === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "update_animation_item requires item and/or blend_value.",
        });
      }
    }),
  z
    .object({
      op: z.literal("remove_animation_item"),
      state: z.string().min(1),
      id: z.string().min(1).describe("Existing animation-link UUID."),
    })
    .strict(),
]);

export const animationControllerNativeParameters = z
  .object({
    controller_id: z.string().min(1),
    native_operations: z
      .array(controllerNativeOperationSchema)
      .min(1)
      .max(32)
      .describe("Bounded native controller composition/blend mutations."),
  })
  .strict();

export const animationNativePropertiesParameters = z
  .object({
    operation: z.literal("properties"),
    animation_id: animationIdOptionalSchema,
    length: z.number().finite().min(0).max(10000).optional(),
    fps: z.number().finite().min(10).max(500).optional(),
    loop_mode: loopModeEnum.optional(),
    anim_time_update: authoredMolangValueSchema.optional(),
    blend_weight: authoredMolangValueSchema.optional(),
    start_delay: authoredMolangValueSchema.optional(),
    loop_delay: authoredMolangValueSchema.optional(),
    override_previous_animation: z.boolean().optional(),
    rotation_spaces: z
      .array(rotationSpaceSchema)
      .min(1)
      .max(32)
      .optional()
      .describe("Bounded per-bone Bedrock rotation-space updates."),
  })
  .strict()
  .superRefine((value, ctx) => {
    const hasChange =
      value.length !== undefined ||
      value.fps !== undefined ||
      value.loop_mode !== undefined ||
      value.anim_time_update !== undefined ||
      value.blend_weight !== undefined ||
      value.start_delay !== undefined ||
      value.loop_delay !== undefined ||
      value.override_previous_animation !== undefined ||
      value.rotation_spaces !== undefined;
    if (!hasChange) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "properties requires at least one authored property change.",
      });
    }
  });

let animationNativeIntelligenceWired = false;

function objectRecord(value: unknown): JsonRecord | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as JsonRecord)
    : null;
}

function runtimeDefinition(name: string) {
  const definition = getAllToolDefinitions()[name];
  if (!definition) {
    throw new Error(`Animation runtime augmentation requires ${name}.`);
  }
  return definition;
}

function isAnimationControllerRuntime(
  item: RuntimeAnimationItem
): item is AnimationController {
  return (
    typeof AnimationController !== "undefined" &&
    item instanceof AnimationController
  );
}

function animationItems(): RuntimeAnimationItem[] {
  return ((AnimationItem.all ?? []) as unknown as RuntimeAnimationItem[]).slice();
}

function controllers(): AnimationController[] {
  return animationItems().filter(isAnimationControllerRuntime);
}

function resolveUniqueByReference<T extends { uuid: string; name: string }>(
  items: readonly T[],
  reference: string,
  kind: string
): T {
  const uuid = items.find((item) => item.uuid === reference);
  if (uuid) return uuid;
  const matches = items.filter((item) => item.name === reference);
  if (matches.length === 1) return matches[0];
  if (matches.length > 1) {
    throw new Error(
      `${kind} name "${reference}" is ambiguous. Use an exact UUID. Candidates: ${matches
        .map((item) => `${item.name} (${item.uuid})`)
        .join(", ")}`
    );
  }
  throw new Error(`${kind} "${reference}" was not found.`);
}

function resolveControllerRuntime(reference: string): AnimationController {
  return resolveUniqueByReference(controllers(), reference, "AnimationController");
}

function resolveControllerStateRuntime(
  controller: AnimationController,
  reference: string
): RuntimeControllerState {
  return resolveUniqueByReference(
    controller.states as RuntimeControllerState[],
    reference,
    "AnimationController state"
  );
}

function resolveAnimationItemRuntime(
  reference: string,
  ownerControllerUuid: string
): RuntimeAnimationItem {
  const item = resolveUniqueByReference(
    animationItems(),
    reference,
    "Animation/AnimationController"
  );
  if (item.uuid === ownerControllerUuid) {
    throw new Error("An AnimationController cannot link itself as a state animation item.");
  }
  return item;
}

function getAnimationItemShortName(item: RuntimeAnimationItem): string {
  const name = (item as RuntimeAnimationItem & { getShortName?: () => string }).getShortName?.();
  if (!name || !name.trim()) {
    throw new Error(`Animation item "${item.name}" has no usable Bedrock short name.`);
  }
  return name;
}

function normalizeControllerBlendValue(
  value: string | number | null | undefined
): string {
  if (value === undefined || value === null) return "";
  return typeof value === "number" ? String(value) : value.trim().replace(/\n/g, "");
}

function controllerCompositionGraph(): Record<string, string[]> {
  const allControllers = controllers();
  const byUuid = new Map(allControllers.map((controller) => [controller.uuid, controller]));
  const byShortName = new Map<string, string[]>();
  for (const controller of allControllers) {
    const shortName = getAnimationItemShortName(controller);
    const bucket = byShortName.get(shortName) ?? [];
    bucket.push(controller.uuid);
    byShortName.set(shortName, bucket);
  }
  return Object.fromEntries(
    allControllers.map((controller) => {
      const nested = new Set<string>();
      for (const state of controller.states as RuntimeControllerState[]) {
        for (const link of state.animations) {
          if (byUuid.has(link.animation)) nested.add(link.animation);
          for (const match of byShortName.get(link.key) ?? []) {
            if (match !== controller.uuid) nested.add(match);
          }
        }
      }
      return [controller.uuid, [...nested]];
    })
  );
}

function requireSafeControllerTarget(
  owner: AnimationController,
  item: RuntimeAnimationItem
): void {
  if (!isAnimationControllerRuntime(item)) return;
  if (
    wouldCreateControllerCompositionCycle(
      controllerCompositionGraph(),
      owner.uuid,
      item.uuid
    )
  ) {
    throw new Error(
      `Linking controller "${owner.name}" to "${item.name}" would create a controller composition cycle.`
    );
  }
}

function resolveRotationSpaces(
  animation: _Animation,
  updates: readonly z.infer<typeof rotationSpaceSchema>[]
) {
  const seen = new Set<string>();
  return updates.map((update) => {
    const group = resolveCoreGroup(
      update.bone_name,
      "Use inspect_elements(mode=outline) to confirm the intended Group UUID."
    );
    if (seen.has(group.uuid)) {
      throw new Error(
        `rotation_spaces resolves more than one entry to Group "${group.name}" (${group.uuid}).`
      );
    }
    seen.add(group.uuid);
    const animator = animation.animators[group.uuid];
    if (!(animator instanceof BoneAnimator)) {
      throw new Error(
        `Animation "${animation.name}" has no BoneAnimator for "${group.name}" (${group.uuid}); author at least one channel for that bone before setting rotation space.`
      );
    }
    return { update, group, animator };
  });
}

async function executeNativeProperties(
  request: z.infer<typeof animationNativePropertiesParameters>
) {
  const animation = resolveCoreAnimation(request.animation_id, {
    allowSelected: true,
    notFoundHint: "Pass an exact Animation UUID or unique exact Animation name.",
  });
  const native = animation as _Animation & {
    anim_time_update?: string | number;
    blend_weight?: string | number;
    start_delay?: string | number;
    loop_delay?: string | number;
    override?: boolean;
  };
  const rotationUpdates = resolveRotationSpaces(
    animation,
    request.rotation_spaces ?? []
  );
  const changedFields: string[] = [];
  const nextMolang: Partial<
    Record<
      "anim_time_update" | "blend_weight" | "start_delay" | "loop_delay",
      string
    >
  > = {};

  for (const property of [
    "anim_time_update",
    "blend_weight",
    "start_delay",
    "loop_delay",
  ] as const) {
    if (request[property] === undefined) continue;
    const next = normalizeMolangStorage(request[property]);
    nextMolang[property] = next;
    if (normalizeMolangStorage(native[property]) !== next) {
      changedFields.push(property);
    }
  }

  if (request.length !== undefined && request.length !== animation.length) {
    changedFields.push("length");
  }
  if (request.fps !== undefined && request.fps !== animation.snapping) {
    changedFields.push("fps");
  }
  if (request.loop_mode !== undefined && request.loop_mode !== animation.loop) {
    changedFields.push("loop_mode");
  }
  if (
    request.override_previous_animation !== undefined &&
    request.override_previous_animation !== Boolean(native.override)
  ) {
    changedFields.push("override_previous_animation");
  }

  for (const { update, group, animator } of rotationUpdates) {
    const next = update.relative_to === "entity";
    if (
      Boolean(
        (animator as BoneAnimator & { rotation_global?: boolean }).rotation_global
      ) !== next
    ) {
      changedFields.push(`rotation_space:${group.name}`);
    }
  }

  if (changedFields.length === 0) {
    throw new Error(
      `properties would not change animation "${animation.name}".`
    );
  }

  Undo.initEdit({ animations: [animation] });
  try {
    if (request.length !== undefined && request.length !== animation.length) {
      animation.setLength(request.length);
    }
    if (request.fps !== undefined && request.fps !== animation.snapping) {
      animation.extend({ snapping: request.fps });
      Timeline.setTimecode(Timeline.time);
    }
    if (
      request.loop_mode !== undefined &&
      request.loop_mode !== animation.loop
    ) {
      animation.setLoop(request.loop_mode, false);
    }
    for (const [property, value] of Object.entries(nextMolang)) {
      animation.extend({ [property]: value });
    }
    if (request.override_previous_animation !== undefined) {
      animation.extend({ override: request.override_previous_animation });
    }
    for (const { update, animator } of rotationUpdates) {
      (animator as BoneAnimator & { rotation_global?: boolean }).rotation_global =
        update.relative_to === "entity";
    }
    Undo.finishEdit("Change Bedrock animation properties");
  } catch (error) {
    Undo.cancelEdit(true);
    Animator.preview();
    throw error;
  }

  Animator.preview();

  const entityRelativeBones = rotationUpdates
    .filter(({ animator }) =>
      Boolean(
        (animator as BoneAnimator & { rotation_global?: boolean }).rotation_global
      )
    )
    .map(({ group }) => ({ uuid: group.uuid, name: group.name }));

  return {
    content: [
      {
        type: "text" as const,
        text: `Updated ${changedFields.length} Bedrock animation property field(s) for "${animation.name}".`,
      },
    ],
    structuredContent: {
      action: "properties" as const,
      animation: { uuid: animation.uuid, name: animation.name },
      changed_fields: changedFields,
      native_properties: {
        length: animation.length,
        snapping: animation.snapping,
        loop: animation.loop,
        anim_time_update: normalizeMolangStorage(native.anim_time_update) || null,
        blend_weight: normalizeMolangStorage(native.blend_weight) || null,
        start_delay: normalizeMolangStorage(native.start_delay) || null,
        loop_delay: normalizeMolangStorage(native.loop_delay) || null,
        override_previous_animation: Boolean(native.override),
        entity_relative_rotation_bones: entityRelativeBones,
      },
    },
  };
}

function cloneControllerLinks(
  links: readonly RuntimeControllerLink[]
): RuntimeControllerLink[] {
  return links.map((link) => ({
    uuid: link.uuid,
    key: link.key,
    animation: link.animation,
    blend_value:
      typeof link.blend_value === "number"
        ? link.blend_value
        : String(link.blend_value ?? ""),
  }));
}

async function executeControllerNativeOperations(
  request: z.infer<typeof animationControllerNativeParameters>
) {
  const controller = resolveControllerRuntime(request.controller_id);
  const simulated = (controller.states as RuntimeControllerState[]).map((state) => ({
    uuid: state.uuid,
    name: state.name,
    animations: cloneControllerLinks(state.animations),
    blend_transition: state.blend_transition || 0,
    blend_via_shortest_path: Boolean(state.blend_via_shortest_path),
    blend_transition_curve: state.blend_transition_curve
      ? { ...state.blend_transition_curve }
      : undefined,
  }));
  const changedStates = new Set<string>();
  const createdLinks: Array<{
    uuid: string;
    state_uuid: string;
    key: string;
    target_uuid: string;
    target_kind: "animation" | "controller";
  }> = [];
  const removedLinks: string[] = [];

  const findState = (reference: string) =>
    resolveUniqueByReference(simulated, reference, "AnimationController state");

  for (const operation of request.native_operations) {
    const state = findState(operation.state);

    if (operation.op === "set_state_blend") {
      const nextTransition =
        operation.blend_transition ?? state.blend_transition;
      const nextShortest =
        operation.blend_via_shortest_path ?? state.blend_via_shortest_path;
      const nextCurve =
        operation.blend_curve === undefined
          ? state.blend_transition_curve
          : operation.blend_curve === null
            ? undefined
            : normalizeControllerBlendCurve(operation.blend_curve);

      if (nextTransition <= 0 && nextCurve && Object.keys(nextCurve).length) {
        throw new Error(
          `State "${state.name}" cannot retain a blend curve when blend_transition is 0; clear the curve in the same operation.`
        );
      }
      if (nextTransition <= 0 && nextShortest) {
        throw new Error(
          `State "${state.name}" cannot enable blend_via_shortest_path when blend_transition is 0.`
        );
      }
      if (
        nextTransition === state.blend_transition &&
        nextShortest === state.blend_via_shortest_path &&
        JSON.stringify(nextCurve ?? null) ===
          JSON.stringify(state.blend_transition_curve ?? null)
      ) {
        throw new Error(
          `set_state_blend would not change state "${state.name}".`
        );
      }
      state.blend_transition = nextTransition;
      state.blend_via_shortest_path = nextShortest;
      state.blend_transition_curve = nextCurve;
      changedStates.add(state.uuid);
      continue;
    }

    const findLink = (uuid: string) => {
      const link = state.animations.find((candidate) => candidate.uuid === uuid);
      if (!link) {
        throw new Error(
          `Animation item link "${uuid}" was not found in state "${state.name}".`
        );
      }
      return link;
    };

    if (operation.op === "remove_animation_item") {
      const link = findLink(operation.id);
      state.animations = state.animations.filter(
        (candidate) => candidate.uuid !== link.uuid
      );
      removedLinks.push(link.uuid);
      changedStates.add(state.uuid);
      continue;
    }

    if (operation.op === "add_animation_item") {
      const item = resolveAnimationItemRuntime(operation.item, controller.uuid);
      requireSafeControllerTarget(controller, item);
      const key = getAnimationItemShortName(item);
      if (
        state.animations.some(
          (candidate) =>
            candidate.key === key || candidate.animation === item.uuid
        )
      ) {
        throw new Error(
          `State "${state.name}" already links animation item "${key}".`
        );
      }
      const link: RuntimeControllerLink = {
        uuid: guid(),
        key,
        animation: item.uuid,
        blend_value: normalizeControllerBlendValue(operation.blend_value),
      };
      state.animations.push(link);
      createdLinks.push({
        uuid: link.uuid,
        state_uuid: state.uuid,
        key,
        target_uuid: item.uuid,
        target_kind: isAnimationControllerRuntime(item)
          ? "controller"
          : "animation",
      });
      changedStates.add(state.uuid);
      continue;
    }

    const link = findLink(operation.id);
    let nextKey = link.key;
    let nextAnimation = link.animation;
    if (operation.item !== undefined) {
      const item = resolveAnimationItemRuntime(operation.item, controller.uuid);
      requireSafeControllerTarget(controller, item);
      nextKey = getAnimationItemShortName(item);
      nextAnimation = item.uuid;
    }
    const nextBlend =
      operation.blend_value === undefined
        ? String(link.blend_value ?? "")
        : normalizeControllerBlendValue(operation.blend_value);
    if (
      nextKey === link.key &&
      nextAnimation === link.animation &&
      nextBlend === String(link.blend_value ?? "")
    ) {
      throw new Error(
        `update_animation_item would not change link "${link.uuid}".`
      );
    }
    if (
      state.animations.some(
        (candidate) =>
          candidate.uuid !== link.uuid &&
          (candidate.key === nextKey || candidate.animation === nextAnimation)
      )
    ) {
      throw new Error(
        `State "${state.name}" already links animation item "${nextKey}".`
      );
    }
    link.key = nextKey;
    link.animation = nextAnimation;
    link.blend_value = nextBlend;
    changedStates.add(state.uuid);
  }

  Undo.initEdit({ animation_controllers: [controller] });
  try {
    for (const statePlan of simulated) {
      const state = resolveControllerStateRuntime(controller, statePlan.uuid);
      state.animations = cloneControllerLinks(statePlan.animations);
      state.blend_transition = statePlan.blend_transition;
      state.blend_via_shortest_path = statePlan.blend_via_shortest_path;
      state.blend_transition_curve = statePlan.blend_transition_curve
        ? { ...statePlan.blend_transition_curve }
        : undefined;
    }
    Undo.finishEdit("Change native animation controller composition");
  } catch (error) {
    Undo.cancelEdit(true);
    Animator.preview();
    throw error;
  }
  Animator.preview();

  return {
    content: [
      {
        type: "text" as const,
        text: `Applied ${request.native_operations.length} native controller operation(s) to "${controller.name}" across ${changedStates.size} state(s).`,
      },
    ],
    structuredContent: {
      execution: "applied" as const,
      action: "native_operations" as const,
      controller: { uuid: controller.uuid, name: controller.name },
      operation_count: request.native_operations.length,
      affected_state_uuids: [...changedStates],
      created_links: createdLinks,
      removed_links: removedLinks,
    },
  };
}

function pushExpression(
  target: AnimationMolangExpressionInput[],
  source: string,
  value: unknown,
  expectsValue = true
): void {
  if (typeof value !== "string" || !value.trim()) return;
  target.push({ source, expression: value, expects_value: expectsValue });
}

function collectAnimationExpressions(
  item: RuntimeAnimationItem
): AnimationMolangExpressionInput[] {
  const expressions: AnimationMolangExpressionInput[] = [];

  if (isAnimationControllerRuntime(item)) {
    for (const state of item.states) {
      pushExpression(expressions, `state:${state.name}:on_entry`, state.on_entry, false);
      pushExpression(expressions, `state:${state.name}:on_exit`, state.on_exit, false);
      for (const transition of state.transitions) {
        pushExpression(
          expressions,
          `state:${state.name}:transition`,
          transition.condition,
          true
        );
      }
      for (const link of state.animations) {
        pushExpression(
          expressions,
          `state:${state.name}:blend`,
          link.blend_value,
          true
        );
      }
      for (const particle of state.particles) {
        pushExpression(
          expressions,
          `state:${state.name}:particle`,
          particle.pre_effect_script,
          false
        );
      }
    }
    return expressions;
  }

  const native = item as _Animation & {
    anim_time_update?: string | number;
    blend_weight?: string | number;
    start_delay?: string | number;
    loop_delay?: string | number;
  };
  for (const property of [
    "anim_time_update",
    "blend_weight",
    "start_delay",
    "loop_delay",
  ] as const) {
    pushExpression(expressions, `animation:${property}`, native[property], true);
  }

  for (const animator of Object.values(item.animators ?? {})) {
    if (animator instanceof BoneAnimator) {
      for (const channel of ["rotation", "position", "scale"] as const) {
        for (const keyframe of ((animator[channel] as _Keyframe[] | undefined) ?? [])) {
          keyframe.data_points.forEach((_, pointIndex) => {
            for (const value of keyframe.getArray(pointIndex)) {
              pushExpression(
                expressions,
                `${animator.name}:${channel}@${keyframe.time}`,
                value,
                true
              );
            }
          });
        }
      }
      continue;
    }

    if (
      typeof EffectAnimator !== "undefined" &&
      animator instanceof EffectAnimator
    ) {
      for (const channel of ["particle", "timeline"] as const) {
        for (const keyframe of ((animator[channel] as _Keyframe[] | undefined) ?? [])) {
          for (const point of keyframe.data_points) {
            pushExpression(
              expressions,
              `effect:${channel}@${keyframe.time}`,
              (point as KeyframeDataPoint & { script?: string }).script,
              false
            );
          }
        }
      }
    }
  }
  return expressions;
}

function resolveRuntimeItem(
  structuredContent: JsonRecord
): RuntimeAnimationItem | null {
  if (typeof AnimationItem === "undefined") return null;
  const info =
    objectRecord(structuredContent.animation) ??
    objectRecord(structuredContent.controller);
  const uuid = typeof info?.uuid === "string" ? info.uuid : null;
  if (!uuid) return null;
  return animationItems().find((item) => item.uuid === uuid) ?? null;
}

function nativePropertySummary(item: RuntimeAnimationItem) {
  if (isAnimationControllerRuntime(item)) {
    return {
      state: "not_applicable" as const,
      reason: "animation_controller" as const,
    };
  }

  const native = item as _Animation & {
    anim_time_update?: string | number;
    blend_weight?: string | number;
    start_delay?: string | number;
    loop_delay?: string | number;
    override?: boolean;
  };
  const entityRelative: Array<{ uuid: string; name: string }> = [];
  for (const animator of Object.values(item.animators ?? {})) {
    if (!(animator instanceof BoneAnimator)) continue;
    if (
      !(animator as BoneAnimator & { rotation_global?: boolean }).rotation_global
    ) {
      continue;
    }
    const group =
      typeof Group !== "undefined"
        ? Group.all.find((candidate: Group) => candidate.uuid === animator.uuid)
        : undefined;
    entityRelative.push({
      uuid: animator.uuid,
      name: group?.name ?? animator.name,
    });
  }

  return {
    state: "available" as const,
    loop: item.loop,
    length: item.length,
    snapping: item.snapping,
    anim_time_update: normalizeMolangStorage(native.anim_time_update) || null,
    blend_weight: normalizeMolangStorage(native.blend_weight) || null,
    start_delay: normalizeMolangStorage(native.start_delay) || null,
    loop_delay: normalizeMolangStorage(native.loop_delay) || null,
    override_previous_animation: Boolean(native.override),
    entity_relative_rotation_count: entityRelative.length,
    entity_relative_rotation_bones: entityRelative.slice(0, 8),
    entity_relative_rotation_bones_truncated: entityRelative.length > 8,
  };
}

function controllerCompositionRuntime(item: RuntimeAnimationItem) {
  if (!isAnimationControllerRuntime(item)) {
    return {
      state: "not_applicable" as const,
      reason: "authored_animation" as const,
    };
  }
  const controllerByUuid = new Map(controllers().map((entry) => [entry.uuid, entry]));
  const controllerByShort = new Map<string, AnimationController[]>();
  for (const controller of controllers()) {
    const short = getAnimationItemShortName(controller);
    const bucket = controllerByShort.get(short) ?? [];
    bucket.push(controller);
    controllerByShort.set(short, bucket);
  }
  const nested: Array<{
    state: string;
    key: string;
    target_uuid: string | null;
  }> = [];
  let unresolved = 0;
  let curveStates = 0;
  for (const state of item.states as RuntimeControllerState[]) {
    if (state.blend_transition_curve && Object.keys(state.blend_transition_curve).length) {
      curveStates += 1;
    }
    for (const link of state.animations) {
      const direct = controllerByUuid.get(link.animation);
      const byKey = controllerByShort.get(link.key) ?? [];
      const target = direct ?? (byKey.length === 1 ? byKey[0] : undefined);
      if (target) {
        nested.push({ state: state.name, key: link.key, target_uuid: target.uuid });
      } else if (!animationItems().some((candidate) => candidate.uuid === link.animation)) {
        unresolved += 1;
      }
    }
  }
  return {
    state: "available" as const,
    nested_controller_link_count: nested.length,
    blend_curve_state_count: curveStates,
    unresolved_link_count: unresolved,
    cycle_from_current_controller: wouldCreateControllerCompositionCycle(
      controllerCompositionGraph(),
      item.uuid,
      item.uuid
    ),
    nested_controller_examples: nested.slice(0, 8),
    examples_truncated: nested.length > 8,
  };
}

function motionDynamicsRuntime(item: RuntimeAnimationItem) {
  if (
    isAnimationControllerRuntime(item) ||
    typeof BoneAnimator === "undefined" ||
    typeof Group === "undefined"
  ) {
    return {
      state: "unavailable" as const,
      reason: isAnimationControllerRuntime(item)
        ? ("animation_controller" as const)
        : ("authored_animation_runtime_unavailable" as const),
    };
  }

  const tracks: AnimationMotionTrackInput[] = [];
  for (const animator of Object.values(item.animators ?? {})) {
    if (!(animator instanceof BoneAnimator)) continue;
    const group = Group.all.find(
      (candidate: Group) => candidate.uuid === animator.uuid
    );
    for (const channel of ["position", "rotation", "scale"] as const) {
      const keyframes = ((animator[channel] as _Keyframe[] | undefined) ?? []).map(
        (keyframe) => ({
          time: keyframe.time,
          value: keyframe.getArray(0) as unknown[],
        })
      );
      if (!keyframes.length) continue;
      tracks.push({
        group_uuid: animator.uuid,
        group_name: group?.name ?? animator.name,
        channel,
        keyframes,
      });
    }
  }
  return analyzeAnimationMotionDynamics({
    loop_mode: String(item.loop),
    tracks,
  });
}

function clientEntityWiringRuntime(
  item: RuntimeAnimationItem,
  variableDependencies: readonly string[]
) {
  if (typeof Project === "undefined") {
    return {
      state: "unavailable" as const,
      reason: "blockbench_project_runtime_unavailable" as const,
    };
  }

  const manager = (
    Project as unknown as {
      BedrockEntityManager?: {
        client_entity?: unknown;
      };
    }
  ).BedrockEntityManager;
  const clientEntity = objectRecord(manager?.client_entity);
  const description = objectRecord(clientEntity?.description);
  if (!description) {
    return {
      state: "unavailable" as const,
      reason: "client_entity_not_loaded" as const,
    };
  }

  const mappings = objectRecord(description.animations) ?? {};
  const aliases = Object.entries(mappings)
    .filter(([, value]) => value === item.name)
    .map(([key]) => key)
    .sort();

  const scripts = objectRecord(description.scripts) ?? {};
  const animate = Array.isArray(scripts.animate) ? scripts.animate : [];
  const rootRefs = animate.flatMap((entry) => {
    if (typeof entry === "string") return [entry];
    const record = objectRecord(entry);
    return record ? Object.keys(record) : [];
  });
  const preAnimation = Array.isArray(scripts.pre_animation)
    ? scripts.pre_animation.filter(
        (entry): entry is string => typeof entry === "string"
      )
    : typeof scripts.pre_animation === "string"
      ? [scripts.pre_animation]
      : [];

  const assigned = new Set<string>();
  const assignmentPattern = /\b(v|variable)\.([a-z_][a-z0-9_]*)\s*=/gi;
  for (const line of preAnimation) {
    for (const match of line.matchAll(assignmentPattern)) {
      assigned.add(`variable.${match[2].toLowerCase()}`);
    }
  }

  const directRoot = aliases.filter((alias) => rootRefs.includes(alias));
  const unresolvedVariableCandidates = variableDependencies
    .filter((name) => !assigned.has(name))
    .slice(0, 12);

  return {
    state: "available" as const,
    mapping_aliases: aliases.slice(0, 12),
    mapping_aliases_truncated: aliases.length > 12,
    scripts_animate_count: animate.length,
    direct_root_matches: directRoot.slice(0, 12),
    pre_animation_statement_count: preAnimation.length,
    pre_animation_assigned_variables: [...assigned].sort().slice(0, 12),
    unresolved_variable_candidates: unresolvedVariableCandidates,
    note:
      "This is loaded client-entity wiring evidence only. A clip can be valid when reached indirectly through a controller; variables may also be authored outside pre_animation.",
  };
}

function wireTimelineNativeProperties(): void {
  const definition = runtimeDefinition("manage_animation_timeline");
  const originalSchema = definition.parameterSchema;
  const originalExecute = definition.execute.bind(definition);
  definition.parameterSchema = z.union([
    originalSchema,
    animationNativePropertiesParameters,
  ] as [z.ZodTypeAny, z.ZodTypeAny]);
  definition.inputSchema = {
    ...definition.inputSchema,
    operation: z
      .enum([
        "keyframes",
        "graph",
        "timeline",
        "batch",
        "copy_paste",
        "properties",
      ])
      .describe("Animation timeline/native-property branch."),
    anim_time_update: authoredMolangValueSchema.optional(),
    blend_weight: authoredMolangValueSchema.optional(),
    start_delay: authoredMolangValueSchema.optional(),
    loop_delay: authoredMolangValueSchema.optional(),
    override_previous_animation: z.boolean().optional(),
    rotation_spaces: z.array(rotationSpaceSchema).min(1).max(32).optional(),
  };
  definition.description =
    "Authors one Bedrock Animation through keyframes, graph/easing, timeline, coherent batch/copy operations, or a one-call native property cohort.";
  definition.execute = async (args, context) => {
    if (args.operation === "properties") {
      return executeNativeProperties(
        animationNativePropertiesParameters.parse(args)
      );
    }
    return originalExecute(args, context);
  };
}

function wireControllerNativeOperations(): void {
  const definition = runtimeDefinition("manage_animation_controller");
  const originalSchema = definition.parameterSchema;
  const originalExecute = definition.execute.bind(definition);
  const originalOperations = definition.inputSchema.operations as
    | z.ZodTypeAny
    | undefined;
  definition.parameterSchema = z.union([
    originalSchema,
    animationControllerNativeParameters,
  ] as [z.ZodTypeAny, z.ZodTypeAny]);
  definition.inputSchema = {
    ...definition.inputSchema,
    ...(originalOperations
      ? { operations: originalOperations.optional() }
      : {}),
    native_operations: z
      .array(controllerNativeOperationSchema)
      .min(1)
      .max(32)
      .optional()
      .describe(
        "Optional native controller composition/blend branch; use instead of operations."
      ),
  };
  definition.description =
    "Creates/updates Bedrock AnimationControllers; also supports bounded native nested-controller links and blend-transition curves without adding another MCP tool.";
  definition.execute = async (args, context) => {
    if (args.native_operations !== undefined) {
      return executeControllerNativeOperations(
        animationControllerNativeParameters.parse(args)
      );
    }
    return originalExecute(args, context);
  };
}

function wireInspectDiagnostics(): void {
  const definition = runtimeDefinition("inspect_animation");
  const originalExecute = definition.execute.bind(definition);
  definition.execute = async (args, context) => {
    const result = await originalExecute(args, context);
    if (args.diagnostics !== true) return result;

    const record = objectRecord(result);
    const structured = record ? objectRecord(record.structuredContent) : null;
    if (!record || !structured) return result;

    const item = resolveRuntimeItem(structured);
    if (!item) return result;

    const molang = analyzeAnimationMolangExpressions(
      collectAnimationExpressions(item)
    );
    return {
      ...record,
      structuredContent: {
        ...structured,
        native_properties: nativePropertySummary(item),
        controller_composition: controllerCompositionRuntime(item),
        molang_analysis: molang,
        motion_dynamics: motionDynamicsRuntime(item),
        client_entity_wiring: clientEntityWiringRuntime(
          item,
          molang.dependencies.variable
        ),
        diagnostics_cost: {
          extra_tool_calls: 0,
          catalog_expansion: 0,
        },
      },
    } as typeof result;
  };
}

/**
 * Extends the existing Animation surface without adding MCP tools.
 * Native properties/controller composition use bounded batched Undo operations;
 * rich analysis is piggy-backed only on inspect_animation(diagnostics=true).
 */
export function wireAnimationNativeIntelligence(): void {
  if (animationNativeIntelligenceWired) return;
  wireTimelineNativeProperties();
  wireControllerNativeOperations();
  wireInspectDiagnostics();
  animationNativeIntelligenceWired = true;
  invalidateToolRegistrationRuntimeCaches();
}
