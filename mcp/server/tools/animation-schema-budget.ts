import { z } from "zod";
import {
  getAllToolDefinitions,
  invalidateToolRegistrationRuntimeCaches,
} from "@/lib/factories";

/**
 * Keeps tools/list cheap while exact parameterSchema remains the execution
 * authority. Complex operation payloads are described by the routed skill and
 * validated by their strict branch schema when invoked.
 */
const compactControllerOperations = z
  .array(z.record(z.unknown()))
  .min(1)
  .max(32)
  .optional()
  .describe("Bounded controller operation batch; exact branch schema is validated on invocation.");

const compactMolangValue = z
  .union([z.string(), z.number().finite(), z.null()])
  .optional();

const compactRotationSpaces = z
  .array(z.record(z.unknown()))
  .min(1)
  .max(32)
  .optional()
  .describe("Bounded bone rotation-space updates; exact entries are validated on invocation.");

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
    operations: compactControllerOperations,
    native_operations: compactControllerOperations,
    resource_operations: compactControllerOperations,
  };

  timeline.inputSchema = {
    ...timeline.inputSchema,
    anim_time_update: compactMolangValue,
    blend_weight: compactMolangValue,
    start_delay: compactMolangValue,
    loop_delay: compactMolangValue,
    rotation_spaces: compactRotationSpaces,
  };

  wired = true;
  invalidateToolRegistrationRuntimeCaches();
}
