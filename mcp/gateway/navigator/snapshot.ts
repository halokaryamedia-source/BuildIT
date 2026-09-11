import type { GatewayRuntimeStatus } from "../backend";
import type { JsonRecord } from "../contract";
import { readRuntimeProjectHealth } from "../projectAffinity";
import type {
  NavigatorAuthoringDomain,
  NavigatorSnapshot,
  RuntimeHealthLike,
} from "./types";

function record(value: unknown): JsonRecord | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as JsonRecord)
    : null;
}

function stringValue(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function authoringDomainForPhase(
  phase: GatewayRuntimeStatus["affinity"]["authoring_phase"]
): NavigatorAuthoringDomain | null {
  if (phase === "geometry") return "GEOMETRY";
  if (phase === "texturing") return "TEXTURING";
  if (phase === "animation") return "ANIMATION";
  return null;
}

function nextIntent(domain: NavigatorAuthoringDomain | null, online: boolean): string {
  if (!online) return "RESTORE_RUNTIME";
  if (domain === "GEOMETRY") return "CONTINUE_GEOMETRY_OR_UV";
  if (domain === "TEXTURING") return "CONTINUE_TEXTURE_AUTHORING";
  if (domain === "ANIMATION") return "CONTINUE_ANIMATION";
  return "RESOLVE_ACTIVE_AUTHORING_DOMAIN";
}

export function buildNavigatorSnapshot(status: GatewayRuntimeStatus): NavigatorSnapshot {
  const health = record(status.runtime.health) as RuntimeHealthLike | null;
  const project = health ? readRuntimeProjectHealth(health) : null;
  const phase = status.affinity.authoring_phase;
  const domain = authoringDomainForPhase(phase);
  const blockers: string[] = [];

  let binding: NavigatorSnapshot["project"]["binding"] = "UNKNOWN";
  if (status.affinity.project_uuid) {
    binding = project?.requested_project_available === false ? "LOST" : "BOUND";
  } else if (project) {
    binding = "UNBOUND";
  }

  if (!status.runtime.online) blockers.push("RUNTIME_OFFLINE");
  if (status.runtime.catalog_stale) blockers.push("CATALOG_STALE");
  if (binding === "LOST") blockers.push("PROJECT_CONTEXT_LOST");
  if (binding === "UNBOUND" && (project?.open_project_count ?? 0) > 1) {
    blockers.push("PROJECT_BIND_REQUIRED");
  }

  const system: NavigatorSnapshot["system"] = !status.runtime.online
    ? "OFFLINE"
    : blockers.length > 0
      ? "DEGRADED"
      : "READY";

  return {
    protocol: "lazydesigner-control-v1",
    system,
    mode: "ASSET_AUTHORING",
    project: {
      affinity_uuid: status.affinity.project_uuid,
      active_uuid: project?.active_project_uuid ?? null,
      open_project_count: project?.open_project_count ?? null,
      binding,
    },
    authoring: {
      phase,
      domain,
      next_intent: nextIntent(domain, status.runtime.online),
    },
    runtime: {
      online: status.runtime.online,
      build_identity: health ? stringValue(health.build_identity) : null,
      runtime_signature: status.runtime.runtime_signature,
      catalog_count: status.runtime.catalog_count,
      catalog_stale: status.runtime.catalog_stale,
    },
    // Runtime orientation stays pure. Stage-specific file context is resolved later,
    // after Reference Package/profile information is available to Control.
    context: { required: [], optional: [] },
    blockers,
  };
}
