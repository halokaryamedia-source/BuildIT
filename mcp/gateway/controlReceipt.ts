import { getCapabilityMetadata } from "../lib/capabilityMetadata";
import { resolveGatewayCapabilityEffects } from "./capabilityEffects";
import type { BlockitAuthoringPhaseAffinity } from "./projectAffinity";

export function capabilityNeedsPhaseSnapshot(capability: string): boolean {
  return getCapabilityMetadata(capability).effects.phaseAffinity === "update_from_result";
}

export function deriveControlReceipt(
  capability: string,
  structuredContent: unknown,
  succeeded: boolean,
  phaseBefore: BlockitAuthoringPhaseAffinity | null
) {
  const application = resolveGatewayCapabilityEffects(
    capability,
    structuredContent,
    phaseBefore
  );

  return {
    phaseBefore,
    phaseAfter:
      succeeded && application.effects.phaseAffinity === "update_from_result"
        ? application.authoringPhase
        : phaseBefore,
    projectUuid: succeeded ? application.projectUuid : null,
  };
}
