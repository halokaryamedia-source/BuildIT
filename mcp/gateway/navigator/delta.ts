import {
  authoringDomainForCapability,
  sourceOwnerForCapability,
} from "./registry";
import type { NavigatorAuthoringDomain, NavigatorDelta } from "./types";
import type { BlockitAuthoringPhaseAffinity } from "../projectAffinity";

const STATE_MUTATIONS = new Set([
  "manage_cubes",
  "add_group",
  "modify_group",
  "reparent_element",
  "remove_element",
  "rename_element",
  "manage_locator",
  "manage_null_object",
  "bone_rigging",
  "create_texture",
  "activate_texture",
  "paint_fill_tool",
  "draw_shape_tool",
  "paint_with_brush",
  "eraser_tool",
  "paint_texture_transaction",
  "manage_material",
  "manage_material_instances",
  "manage_render_profile",
  "create_animation",
  "manage_animation_timeline",
  "manage_animation_effects",
  "manage_animation_controller",
]);

function mutationInvalidation(
  capability: string,
  domain: NavigatorAuthoringDomain,
  succeeded: boolean
): NavigatorDelta["invalidates"] {
  const mutates = succeeded && STATE_MUTATIONS.has(capability);
  const affectedDomains: NavigatorAuthoringDomain[] = [];

  if (mutates) {
    affectedDomains.push(domain);
    if (domain === "GEOMETRY") affectedDomains.push("TEXTURING", "ANIMATION");
    else if (domain === "TEXTURING") affectedDomains.push("ANIMATION");
  }

  return {
    authoring_domains: [...new Set(affectedDomains)],
    workspace_projection: mutates,
    acceptance_gates: mutates,
  };
}

export function buildNavigatorDelta(input: {
  capability: string;
  phaseBefore: BlockitAuthoringPhaseAffinity | null;
  phaseAfter: BlockitAuthoringPhaseAffinity | null;
  projectUuid: string | null;
  succeeded: boolean;
}): NavigatorDelta {
  const changed: string[] = [];
  if (input.succeeded && input.phaseBefore !== input.phaseAfter) {
    changed.push("authoring_phase");
  }
  if (input.capability === "create_project" && input.succeeded) {
    changed.push("project_affinity");
  }

  const authoringDomain = authoringDomainForCapability(input.capability);
  const invalidates = mutationInvalidation(
    input.capability,
    authoringDomain,
    input.succeeded
  );
  const nextIntent = !input.succeeded
    ? "RECOVER_CURRENT_OPERATION"
    : input.capability === "switch_authoring_phase"
      ? "CONTINUE_NEW_AUTHORING_PHASE"
      : authoringDomain === "GEOMETRY"
        ? "VERIFY_OR_CONTINUE_GEOMETRY"
        : authoringDomain === "TEXTURING"
          ? "VERIFY_OR_CONTINUE_TEXTURING"
          : authoringDomain === "ANIMATION"
            ? "VERIFY_OR_CONTINUE_ANIMATION"
            : "CONTINUE_CURRENT_TASK";

  return {
    protocol: "lazydesigner-control-v1",
    capability: input.capability,
    authoring_domain: authoringDomain,
    source_owner: sourceOwnerForCapability(input.capability),
    phase_before: input.phaseBefore,
    phase_after: input.phaseAfter,
    project_uuid: input.projectUuid,
    changed,
    invalidates,
    next_intent: nextIntent,
    requires_status_refresh: changed.length > 0,
  };
}
