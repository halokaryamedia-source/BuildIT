import type { CapabilitySummary } from "../contract";
import {
  authoringDomainForCapability,
  sourceOwnerForCapability,
} from "./registry";
import type {
  NavigatorAuthoringDomain,
  NavigatorCapabilitySummary,
} from "./types";

export function decorateCapabilities(
  capabilities: readonly CapabilitySummary[],
  currentDomain: NavigatorAuthoringDomain | null
): NavigatorCapabilitySummary[] {
  return capabilities.map((capability) => {
    const authoringDomain = authoringDomainForCapability(capability.capability_id);
    const current = authoringDomain === "CORE" || authoringDomain === currentDomain;
    return {
      ...capability,
      navigation: {
        authoring_domain: authoringDomain,
        current_domain: current,
        eligibility: current
          ? authoringDomain === "CORE"
            ? "AVAILABLE"
            : "RECOMMENDED"
          : "FOREIGN_PHASE",
        source_owner: sourceOwnerForCapability(capability.capability_id),
      },
    };
  });
}
