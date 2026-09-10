import type { CapabilitySummary, JsonRecord } from "../contract";
import type { BlockitAuthoringPhaseAffinity } from "../projectAffinity";

export type NavigatorAuthoringDomain = "GEOMETRY" | "TEXTURING" | "ANIMATION" | "CORE";

export type NavigatorContextHandle = {
  id: string;
  path: string;
  sha256: string;
};

export type NavigatorSourceOwner = {
  source: string;
  specialist: string | null;
  test_owner: string | null;
};

export type NavigatorSystemState = "READY" | "DEGRADED" | "OFFLINE";

export type NavigatorSnapshot = {
  protocol: "blockit-navigator-v1";
  system: NavigatorSystemState;
  mode: "ASSET_AUTHORING";
  project: {
    affinity_uuid: string | null;
    active_uuid: string | null;
    open_project_count: number | null;
    binding: "BOUND" | "UNBOUND" | "LOST" | "UNKNOWN";
  };
  authoring: {
    phase: BlockitAuthoringPhaseAffinity | null;
    domain: NavigatorAuthoringDomain | null;
    next_intent: string;
  };
  runtime: {
    online: boolean;
    build_identity: string | null;
    runtime_signature: string | null;
    catalog_count: number;
    catalog_stale: boolean;
  };
  context: {
    required: NavigatorContextHandle[];
    optional: NavigatorContextHandle[];
  };
  blockers: string[];
};

export type NavigatorCapabilitySummary = CapabilitySummary & {
  navigation: {
    authoring_domain: NavigatorAuthoringDomain;
    current_domain: boolean;
    eligibility: "RECOMMENDED" | "AVAILABLE" | "FOREIGN_PHASE";
    source_owner: NavigatorSourceOwner;
  };
};

export type NavigatorDelta = {
  protocol: "blockit-navigator-v1";
  capability: string;
  authoring_domain: NavigatorAuthoringDomain;
  source_owner: NavigatorSourceOwner;
  phase_before: BlockitAuthoringPhaseAffinity | null;
  phase_after: BlockitAuthoringPhaseAffinity | null;
  project_uuid: string | null;
  changed: string[];
  next_intent: string;
  requires_status_refresh: boolean;
};

export type RuntimeHealthLike = JsonRecord & {
  build_identity?: unknown;
  exposed_tool_count?: unknown;
  product?: unknown;
  project_context?: unknown;
};
