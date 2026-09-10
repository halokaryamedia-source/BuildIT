import type { CapabilitySummary } from "../contract";
import { ownerForCapability, sourceOwnerForCapability } from "./registry";
import type { NavigatorCapabilitySummary, NavigatorOwner } from "./types";

export function decorateCapabilities(
  capabilities: readonly CapabilitySummary[],
  currentOwner: NavigatorOwner | null
): NavigatorCapabilitySummary[] {
  return capabilities.map((capability) => {
    const owner = ownerForCapability(capability.capability_id);
    const current = owner === "CORE" || owner === currentOwner;
    return {
      ...capability,
      navigation: {
        owner,
        current_owner: current,
        eligibility: current
          ? owner === "CORE"
            ? "AVAILABLE"
            : "RECOMMENDED"
          : "FOREIGN_PHASE",
        source_owner: sourceOwnerForCapability(capability.capability_id),
      },
    };
  });
}
