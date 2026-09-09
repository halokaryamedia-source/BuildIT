import { z } from "zod";
import {
  getAllToolDefinitions,
  invalidateToolRegistrationRuntimeCaches,
} from "@/lib/factories";

/**
 * This shape is also parsed by the SDK BEFORE parameterSchema. Presentation
 * budgets must never reject input accepted by the canonical branch schema.
 * Keep the existing compact catalog during the generator-coupled description
 * closure, but leave batch limits to the original strict parameterSchema.
 */
const compactOperations = z
  .array(z.record(z.unknown()))
  .min(1)
  .optional()
  .describe("Operation entries and branch-specific limits are validated on invocation.");

const compactMolangValue = z
  .union([z.string(), z.number().finite(), z.null()])
  .optional();

const compactRotationSpaces = z
  .array(z.record(z.unknown()))
  .min(1)
  .optional()
  .describe("Bone rotation-space entries and limits are validated on invocation.");

let wired = false;

export function wireAnimationSchemaBudget(): void {
  if (wired) return;
  const tools = getAllToolDefinitions();
  const controller = tools.manage_animation_controller;
  const timeline = tools.manage_animation_timeline;
  if (!controller || !timeline) {
    throw new Error(
      "Animation schema budget requires manage_animation_controller and manage_animation_timeline."
    );
  }

  controller.inputSchema = {
    ...controller.inputSchema,
    operations: compactOperations,
    native_operations: compactOperations,
    resource_operations: compactOperations,
  };

  timeline.inputSchema = {
    ...timeline.inputSchema,
    keyframes: compactOperations,
    anim_time_update: compactMolangValue,
    blend_weight: compactMolangValue,
    start_delay: compactMolangValue,
    loop_delay: compactMolangValue,
    rotation_spaces: compactRotationSpaces,
  };

  wired = true;
  invalidateToolRegistrationRuntimeCaches();
}
