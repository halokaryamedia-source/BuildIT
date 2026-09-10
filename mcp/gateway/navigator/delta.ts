import {
  authoringDomainForCapability,
  sourceOwnerForCapability,
} from "./registry";
import type { NavigatorDelta } from "./types";
import type { BlockitAuthoringPhaseAffinity } from "../projectAffinity";

export function buildNavigatorDelta(input: {
  capability: string;
  phaseBefore: BlockitAuthoringPhaseAffinity | null;
  phaseAfter: BlockitAuthoringPhaseAffinity | null;
  projectUuid: string | null;
  succeeded: boolean;
}): NavigatorDelta {
  const changed: string[] = [];
  if (input.phaseBefore !== input.phaseAfter) changed.push("authoring_phase");
  if (input.capability === "create_project" && input.succeeded) changed.push("project_affinity");

  const authoringDomain = authoringDomainForCapability(input.capability);
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
    protocol: "blockit-navigator-v1",
    capability: input.capability,
    authoring_domain: authoringDomain,
    source_owner: sourceOwnerForCapability(input.capability),
    phase_before: input.phaseBefore,
    phase_after: input.phaseAfter,
    project_uuid: input.projectUuid,
    changed,
    next_intent: nextIntent,
    requires_status_refresh: changed.length > 0,
  };
}
