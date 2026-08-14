/// <reference types="blockbench-types" />
import { z } from "zod";
import { createTool, type ToolSpec } from "@/lib/factories";
import { STATUS_EXPERIMENTAL } from "@/lib/constants";
import { resolveUuidOrUniqueName } from "@/lib/coreIdentity";

const nonEmptyAuthoredString = z
  .string()
  .refine((value) => value.trim().length > 0, {
    message: "Value must contain non-whitespace authored text.",
  });

const controllerBlendValueSchema = z.union([
  z.number().finite(),
  nonEmptyAuthoredString,
]);

const controllerOperationSchema = z
  .object({
    op: z
      .enum([
        "rename_controller",
        "add_state",
        "update_state",
        "remove_state",
        "set_initial_state",
        "add_transition",
        "update_transition",
        "remove_transition",
        "add_animation",
        "update_animation",
        "remove_animation",
      ])
      .describe("Controller mutation to apply."),
    state: z
      .string()
      .min(1)
      .optional()
      .describe("Exact state UUID or unique exact state name."),
    id: z
      .string()
      .min(1)
      .optional()
      .describe("Exact transition or animation-link UUID."),
    name: z
      .string()
      .min(1)
      .optional()
      .describe("Controller/state name for rename or add_state."),
    target: z
      .string()
      .min(1)
      .optional()
      .describe("Exact transition target state UUID/name."),
    animation: z
      .string()
      .min(1)
      .optional()
      .describe("Exact authored Animation UUID/name."),
    condition: nonEmptyAuthoredString
      .optional()
      .describe("Non-empty authored transition Molang condition."),
    blend_value: controllerBlendValueSchema
      .optional()
      .describe("Finite number or authored Molang blend value."),
    on_entry: z.string().optional().describe("State on_entry script; empty clears."),
    on_exit: z.string().optional().describe("State on_exit script; empty clears."),
    blend_transition: z
      .number()
      .finite()
      .min(0)
      .max(10000)
      .optional()
      .describe("State blend duration in seconds."),
    blend_via_shortest_path: z
      .boolean()
      .optional()
      .describe("State shortest-path blend flag."),
  })
  .strict()
  .superRefine((operation, ctx) => {
    const present = new Set(
      Object.entries(operation)
        .filter(([, value]) => value !== undefined)
        .map(([key]) => key)
    );
    const require = (...fields: string[]) => {
      for (const field of fields) {
        if (!present.has(field)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [field],
            message: `${field} is required when op=${operation.op}.`,
          });
        }
      }
    };
    const allow = (...fields: string[]) => {
      const allowed = new Set(["op", ...fields]);
      for (const field of present) {
        if (!allowed.has(field)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [field],
            message: `${field} is not used when op=${operation.op}.`,
          });
        }
      }
    };

    switch (operation.op) {
      case "rename_controller":
        require("name");
        allow("name");
        break;
      case "add_state":
        require("name");
        allow(
          "name",
          "on_entry",
          "on_exit",
          "blend_transition",
          "blend_via_shortest_path"
        );
        break;
      case "update_state": {
        require("state");
        allow(
          "state",
          "name",
          "on_entry",
          "on_exit",
          "blend_transition",
          "blend_via_shortest_path"
        );
        if (
          operation.name === undefined &&
          operation.on_entry === undefined &&
          operation.on_exit === undefined &&
          operation.blend_transition === undefined &&
          operation.blend_via_shortest_path === undefined
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "update_state requires at least one authored field.",
          });
        }
        break;
      }
      case "remove_state":
      case "set_initial_state":
        require("state");
        allow("state");
        break;
      case "add_transition":
        require("state", "target", "condition");
        allow("state", "target", "condition");
        break;
      case "update_transition":
        require("state", "id");
        allow("state", "id", "target", "condition");
        if (operation.target === undefined && operation.condition === undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "update_transition requires target and/or condition.",
          });
        }
        break;
      case "remove_transition":
        require("state", "id");
        allow("state", "id");
        break;
      case "add_animation":
        require("state", "animation");
        allow("state", "animation", "blend_value");
        break;
      case "update_animation":
        require("state", "id");
        allow("state", "id", "animation", "blend_value");
        if (
          operation.animation === undefined &&
          operation.blend_value === undefined
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "update_animation requires animation and/or blend_value.",
          });
        }
        break;
      case "remove_animation":
        require("state", "id");
        allow("state", "id");
        break;
    }
  });

export const manageAnimationControllerParameters = z
  .object({
    controller_id: z
      .string()
      .min(1)
      .optional()
      .describe("Existing AnimationController UUID or unique exact name."),
    create_name: z
      .string()
      .min(1)
      .optional()
      .describe("New AnimationController name; use instead of controller_id."),
    operations: z
      .array(controllerOperationSchema)
      .min(1)
      .max(32)
      .describe("One to 32 ordered controller/state-machine mutations."),
  })
  .strict()
  .superRefine((value, ctx) => {
    if ((value.controller_id === undefined) === (value.create_name === undefined)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Provide exactly one of controller_id or create_name.",
      });
    }
  });

export const animationControllerToolDocs: ToolSpec[] = [
  {
    name: "manage_animation_controller",
    description:
      "Creates or coherently mutates one Bedrock AnimationController in one Undo unit. Supports states, initial state, transitions, animation links, scripts, and scalar blend settings; returns affected authored state so immediate readback is unnecessary.",
    annotations: {
      title: "Manage Animation Controller",
      destructiveHint: true,
    },
    parameters: manageAnimationControllerParameters,
    status: STATUS_EXPERIMENTAL,
  },
];

type ControllerAnimationLink = {
  uuid: string;
  key: string;
  animation: string;
  blend_value: string | number;
};

type ControllerTransition = {
  uuid: string;
  target: string;
  condition: string;
};

type ControllerStatePlan = {
  uuid: string;
  name: string;
  animations: ControllerAnimationLink[];
  transitions: ControllerTransition[];
  sounds: unknown[];
  particles: unknown[];
  on_entry: string;
  on_exit: string;
  blend_transition: number;
  blend_transition_curve?: Record<string, number>;
  blend_via_shortest_path: boolean;
};

type ControllerPlan = {
  uuid?: string;
  name: string;
  path: string;
  initial_state: string;
  states: ControllerStatePlan[];
};

type ControllerMutationOperation = z.infer<typeof controllerOperationSchema>;

function requireBedrockControllerProject(): void {
  if (!Project) {
    throw new Error(
      "No project is open. Open the intended Minecraft Bedrock Entity project first."
    );
  }
  const format = Format as { id?: string; animation_controllers?: boolean } | undefined;
  if (format?.id !== "bedrock" || !format.animation_controllers) {
    throw new Error(
      `manage_animation_controller requires a Bedrock Entity project with animation controllers; current format is ${format?.id ?? "unknown"}.`
    );
  }
}

function isAnimationControllerItem(
  item: _Animation | AnimationController
): item is AnimationController {
  return (
    typeof AnimationController !== "undefined" &&
    item instanceof AnimationController
  );
}

function currentControllers(): AnimationController[] {
  return ((AnimationItem.all ?? []) as Array<_Animation | AnimationController>).filter(
    isAnimationControllerItem
  );
}

function resolveController(reference: string): AnimationController {
  return resolveUuidOrUniqueName(currentControllers(), reference, {
    kind: "AnimationController",
    notFoundHint:
      "Use inspect_animation to confirm the intended controller UUID.",
  });
}

function resolveControllerState(
  states: readonly ControllerStatePlan[],
  reference: string
): ControllerStatePlan {
  return resolveUuidOrUniqueName(states, reference, {
    kind: "AnimationController state",
    notFoundHint: "Use inspect_animation state detail to confirm the intended state UUID.",
  });
}

function resolveAuthoredAnimation(reference: string): _Animation {
  const items = (AnimationItem.all ?? []) as Array<_Animation | AnimationController>;
  const animations = items.filter(
    (item): item is _Animation => !isAnimationControllerItem(item)
  );
  return resolveUuidOrUniqueName(animations, reference, {
    kind: "Animation",
    notFoundHint:
      "Pass an exact authored Animation UUID or unique exact Animation name; controller targets are not animation links.",
  });
}

function cloneJsonArray<T>(value: readonly T[]): T[] {
  return JSON.parse(JSON.stringify(value)) as T[];
}

function snapshotController(controller: AnimationController): ControllerPlan {
  return {
    uuid: controller.uuid,
    name: controller.name,
    path: controller.path || "",
    initial_state: controller.initial_state || "",
    states: controller.states.map((state) => {
      const view = state as AnimationControllerState & {
        animations: ControllerAnimationLink[];
        transitions: ControllerTransition[];
        sounds: unknown[];
        particles: unknown[];
        blend_transition_curve?: Record<string, number>;
      };
      return {
        uuid: view.uuid,
        name: view.name,
        animations: view.animations.map((link) => ({
          ...link,
          blend_value: String(link.blend_value ?? ""),
        })),
        transitions: cloneJsonArray(view.transitions),
        sounds: cloneJsonArray(view.sounds),
        particles: cloneJsonArray(view.particles),
        on_entry: view.on_entry || "",
        on_exit: view.on_exit || "",
        blend_transition: view.blend_transition || 0,
        blend_transition_curve: view.blend_transition_curve
          ? { ...view.blend_transition_curve }
          : undefined,
        blend_via_shortest_path: Boolean(view.blend_via_shortest_path),
      };
    }),
  };
}

function ensureControllerNameAvailable(
  requestedName: string,
  path: string,
  excludeUuid?: string
): void {
  const collision = currentControllers().find(
    (candidate) =>
      candidate.uuid !== excludeUuid &&
      (candidate.path || "") === path &&
      candidate.name === requestedName
  );
  if (collision) {
    throw new Error(
      `AnimationController name "${requestedName}" already exists for the same file scope (${collision.uuid}). Use a unique exact name.`
    );
  }
}

function requireUniqueStateName(
  states: readonly ControllerStatePlan[],
  requestedName: string,
  excludeUuid?: string
): void {
  const collision = states.find(
    (state) => state.uuid !== excludeUuid && state.name === requestedName
  );
  if (collision) {
    throw new Error(
      `AnimationController state name "${requestedName}" already exists (${collision.uuid}). Use a unique exact name.`
    );
  }
}

function findTransition(
  state: ControllerStatePlan,
  uuid: string
): ControllerTransition {
  const transition = state.transitions.find((candidate) => candidate.uuid === uuid);
  if (!transition) {
    throw new Error(
      `Transition "${uuid}" not found in state "${state.name}". Use inspect_animation state detail to confirm the transition UUID.`
    );
  }
  return transition;
}

function findAnimationLink(
  state: ControllerStatePlan,
  uuid: string
): ControllerAnimationLink {
  const link = state.animations.find((candidate) => candidate.uuid === uuid);
  if (!link) {
    throw new Error(
      `Animation link "${uuid}" not found in state "${state.name}". Use inspect_animation state detail to confirm the link UUID.`
    );
  }
  return link;
}

function normalizeBlendValue(value: string | number | undefined): string {
  if (value === undefined) return "";
  return typeof value === "number" ? String(value) : value;
}

function summarizeState(state: ControllerStatePlan) {
  return {
    uuid: state.uuid,
    name: state.name,
    animation_count: state.animations.length,
    transition_count: state.transitions.length,
    on_entry: state.on_entry || null,
    on_exit: state.on_exit || null,
    blend_transition: state.blend_transition || 0,
    blend_via_shortest_path: state.blend_via_shortest_path,
  };
}

function applyOperationToPlan(
  plan: ControllerPlan,
  operation: ControllerMutationOperation,
  affectedStateUuids: Set<string>,
  created: {
    states: Array<{ uuid: string; name: string }>;
    transitions: Array<{ uuid: string; state_uuid: string; target_uuid: string }>;
    animation_links: Array<{ uuid: string; state_uuid: string; animation_key: string; animation_uuid: string | null }>;
  },
  removed: {
    states: Array<{ uuid: string; name: string }>;
    transitions: string[];
    animation_links: string[];
  }
): void {
  switch (operation.op) {
    case "rename_controller": {
      if (operation.name === plan.name) {
        throw new Error("rename_controller would not change the controller name.");
      }
      ensureControllerNameAvailable(operation.name!, plan.path, plan.uuid);
      plan.name = operation.name!;
      return;
    }
    case "add_state": {
      requireUniqueStateName(plan.states, operation.name!);
      const state: ControllerStatePlan = {
        uuid: guid(),
        name: operation.name!,
        animations: [],
        transitions: [],
        sounds: [],
        particles: [],
        on_entry: operation.on_entry ?? "",
        on_exit: operation.on_exit ?? "",
        blend_transition: operation.blend_transition ?? 0,
        blend_via_shortest_path: operation.blend_via_shortest_path ?? false,
      };
      plan.states.push(state);
      if (!plan.initial_state) plan.initial_state = state.uuid;
      affectedStateUuids.add(state.uuid);
      created.states.push({ uuid: state.uuid, name: state.name });
      return;
    }
    case "update_state": {
      const state = resolveControllerState(plan.states, operation.state!);
      const nextName = operation.name ?? state.name;
      if (nextName !== state.name) {
        requireUniqueStateName(plan.states, nextName, state.uuid);
      }
      const next = {
        name: nextName,
        on_entry: operation.on_entry ?? state.on_entry,
        on_exit: operation.on_exit ?? state.on_exit,
        blend_transition:
          operation.blend_transition ?? state.blend_transition,
        blend_via_shortest_path:
          operation.blend_via_shortest_path ?? state.blend_via_shortest_path,
      };
      if (
        next.name === state.name &&
        next.on_entry === state.on_entry &&
        next.on_exit === state.on_exit &&
        next.blend_transition === state.blend_transition &&
        next.blend_via_shortest_path === state.blend_via_shortest_path
      ) {
        throw new Error(`update_state would not change state "${state.name}".`);
      }
      Object.assign(state, next);
      affectedStateUuids.add(state.uuid);
      return;
    }
    case "remove_state": {
      const state = resolveControllerState(plan.states, operation.state!);
      if (plan.states.length <= 1) {
        throw new Error("remove_state cannot remove the final controller state.");
      }
      if (plan.initial_state === state.uuid) {
        throw new Error(
          `State "${state.name}" is the current initial state. Set another initial state earlier in the same operations batch before removing it.`
        );
      }
      const inbound = plan.states
        .filter((candidate) => candidate.uuid !== state.uuid)
        .flatMap((candidate) =>
          candidate.transitions
            .filter((transition) => transition.target === state.uuid)
            .map((transition) => `${candidate.name}:${transition.uuid}`)
        );
      if (inbound.length) {
        throw new Error(
          `State "${state.name}" still has inbound transition(s): ${inbound.join(", ")}. Remove or retarget them earlier in the same batch.`
        );
      }
      plan.states = plan.states.filter((candidate) => candidate.uuid !== state.uuid);
      removed.states.push({ uuid: state.uuid, name: state.name });
      return;
    }
    case "set_initial_state": {
      const state = resolveControllerState(plan.states, operation.state!);
      if (plan.initial_state === state.uuid) {
        throw new Error(`State "${state.name}" is already the initial state.`);
      }
      plan.initial_state = state.uuid;
      affectedStateUuids.add(state.uuid);
      return;
    }
    case "add_transition": {
      const state = resolveControllerState(plan.states, operation.state!);
      const target = resolveControllerState(plan.states, operation.target!);
      if (state.uuid === target.uuid) {
        throw new Error("A controller transition cannot target its own source state.");
      }
      if (state.transitions.some((item) => item.target === target.uuid)) {
        throw new Error(
          `State "${state.name}" already has a transition to "${target.name}".`
        );
      }
      const transition = {
        uuid: guid(),
        target: target.uuid,
        condition: operation.condition!,
      };
      state.transitions.push(transition);
      affectedStateUuids.add(state.uuid);
      created.transitions.push({ uuid: transition.uuid, state_uuid: state.uuid, target_uuid: target.uuid });
      return;
    }
    case "update_transition": {
      const state = resolveControllerState(plan.states, operation.state!);
      const transition = findTransition(state, operation.id!);
      const target = operation.target
        ? resolveControllerState(plan.states, operation.target)
        : resolveControllerState(plan.states, transition.target);
      if (state.uuid === target.uuid) {
        throw new Error("A controller transition cannot target its own source state.");
      }
      if (
        target.uuid !== transition.target &&
        state.transitions.some(
          (candidate) =>
            candidate.uuid !== transition.uuid && candidate.target === target.uuid
        )
      ) {
        throw new Error(
          `State "${state.name}" already has a transition to "${target.name}".`
        );
      }
      const nextCondition = operation.condition ?? transition.condition;
      if (
        target.uuid === transition.target &&
        nextCondition === transition.condition
      ) {
        throw new Error(
          `update_transition would not change transition "${transition.uuid}".`
        );
      }
      transition.target = target.uuid;
      transition.condition = nextCondition;
      affectedStateUuids.add(state.uuid);
      return;
    }
    case "remove_transition": {
      const state = resolveControllerState(plan.states, operation.state!);
      const transition = findTransition(state, operation.id!);
      state.transitions = state.transitions.filter(
        (candidate) => candidate.uuid !== transition.uuid
      );
      affectedStateUuids.add(state.uuid);
      removed.transitions.push(transition.uuid);
      return;
    }
    case "add_animation": {
      const state = resolveControllerState(plan.states, operation.state!);
      const animation = resolveAuthoredAnimation(operation.animation!);
      const link = {
        uuid: guid(),
        key: animation.getShortName(),
        animation: animation.uuid,
        blend_value: normalizeBlendValue(operation.blend_value),
      };
      state.animations.push(link);
      affectedStateUuids.add(state.uuid);
      created.animation_links.push({ uuid: link.uuid, state_uuid: state.uuid, animation_key: link.key, animation_uuid: link.animation || null });
      return;
    }
    case "update_animation": {
      const state = resolveControllerState(plan.states, operation.state!);
      const link = findAnimationLink(state, operation.id!);
      let nextAnimationUuid = link.animation;
      let nextKey = link.key;
      if (operation.animation !== undefined) {
        const animation = resolveAuthoredAnimation(operation.animation);
        nextAnimationUuid = animation.uuid;
        nextKey = animation.getShortName();
      }
      const nextBlendValue =
        operation.blend_value === undefined
          ? String(link.blend_value ?? "")
          : normalizeBlendValue(operation.blend_value);
      if (
        nextAnimationUuid === link.animation &&
        nextKey === link.key &&
        nextBlendValue === String(link.blend_value ?? "")
      ) {
        throw new Error(
          `update_animation would not change animation link "${link.uuid}".`
        );
      }
      link.animation = nextAnimationUuid;
      link.key = nextKey;
      link.blend_value = nextBlendValue;
      affectedStateUuids.add(state.uuid);
      return;
    }
    case "remove_animation": {
      const state = resolveControllerState(plan.states, operation.state!);
      const link = findAnimationLink(state, operation.id!);
      state.animations = state.animations.filter(
        (candidate) => candidate.uuid !== link.uuid
      );
      affectedStateUuids.add(state.uuid);
      removed.animation_links.push(link.uuid);
      return;
    }
  }
}

function validateFinalPlan(plan: ControllerPlan): void {
  if (!plan.states.length) {
    throw new Error("AnimationController must contain at least one state.");
  }
  const initial = plan.states.find((state) => state.uuid === plan.initial_state);
  if (!initial) {
    throw new Error(
      "AnimationController initial_state does not resolve to a retained state. Add/set an initial state in the same batch."
    );
  }
  for (const state of plan.states) {
    for (const transition of state.transitions) {
      if (!plan.states.some((target) => target.uuid === transition.target)) {
        throw new Error(
          `Transition "${transition.uuid}" in state "${state.name}" targets a missing state.`
        );
      }
    }
  }
}

export function registerAnimationControllerTools(): void {
  createTool(
    animationControllerToolDocs[0].name,
    {
      ...animationControllerToolDocs[0],
      parameters: manageAnimationControllerParameters,
      async execute({ controller_id, create_name, operations }) {
        requireBedrockControllerProject();

        const creating = create_name !== undefined;
        const existingController = controller_id
          ? resolveController(controller_id)
          : undefined;
        if (create_name) {
          ensureControllerNameAvailable(create_name, "");
        }

        const plan: ControllerPlan = existingController
          ? snapshotController(existingController)
          : {
              uuid: undefined,
              name: create_name!,
              path: "",
              initial_state: "",
              states: [],
            };
        const affectedStateUuids = new Set<string>();
        const created = {
          states: [] as Array<{ uuid: string; name: string }>,
          transitions: [] as Array<{ uuid: string; state_uuid: string; target_uuid: string }>,
          animation_links: [] as Array<{ uuid: string; state_uuid: string; animation_key: string; animation_uuid: string | null }>,
        };
        const removed = {
          states: [] as Array<{ uuid: string; name: string }>,
          transitions: [] as string[],
          animation_links: [] as string[],
        };

        for (const operation of operations) {
          applyOperationToPlan(
            plan,
            operation,
            affectedStateUuids,
            created,
            removed
          );
        }
        validateFinalPlan(plan);

        const controller =
          existingController ?? new AnimationController({ name: plan.name });

        let editOpen = false;
        try {
          if (creating) {
            Undo.initEdit({ animation_controllers: [] });
          } else {
            Undo.initEdit({ animation_controllers: [controller] });
          }
          editOpen = true;

          (
            controller.extend as (data: {
              name?: string;
              states?: ControllerStatePlan[];
              initial_state?: string;
            }) => AnimationController
          )({
            name: plan.name,
            states: plan.states,
            initial_state: plan.initial_state,
          });
          if (
            controller.selected_state &&
            !plan.states.some(
              (state) => state.uuid === controller.selected_state?.uuid
            )
          ) {
            controller.selected_state = null;
          }
          if (creating) {
            controller.saved = false;
            controller.add(false);
            Undo.finishEdit("Create animation controller", {
              animation_controllers: [controller],
            });
          } else {
            Undo.finishEdit("Manage animation controller");
          }
          editOpen = false;
        } catch (error) {
          if (editOpen) Undo.cancelEdit(true);
          throw error;
        }

        const finalPlan = snapshotController(controller);
        const initial = finalPlan.states.find(
          (state) => state.uuid === finalPlan.initial_state
        );
        const result = {
          execution: "applied" as const,
          action: creating ? ("created" as const) : ("updated" as const),
          operation_count: operations.length,
          controller: {
            uuid: controller.uuid,
            name: controller.name,
            initial_state: initial
              ? { uuid: initial.uuid, name: initial.name }
              : null,
            state_count: finalPlan.states.length,
          },
          affected_states: finalPlan.states
            .filter((state) => affectedStateUuids.has(state.uuid))
            .map(summarizeState),
          created,
          removed,
        };

        return {
          content: [{ type: "text" as const, text: JSON.stringify(result) }],
          structuredContent: result,
        };
      },
    },
    animationControllerToolDocs[0].status
  );
}
