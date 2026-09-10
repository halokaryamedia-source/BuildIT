import { createHash } from "node:crypto";
import type { GatewayRuntimeStatus } from "../backend";
import { resolveDevelopmentIntent, type NavigatorDevelopmentResolution } from "./developmentIntent";
import { NAVIGATOR_ROUTING_POLICY, type NavigatorRoutingPolicy } from "./routingPolicy";
import { buildNavigatorSnapshot } from "./snapshot";
import { readWorkspaceProjection, type NavigatorWorkspaceProjection } from "./workspace";
import type {
  NavigatorContextHandle,
  NavigatorReadiness,
  NavigatorSnapshot,
} from "./types";

export type NavigatorTaskMode = "ASSET_AUTHORING" | "MCP_DEVELOPMENT";

export type NavigatorContextDelivery = {
  required: NavigatorContextHandle[];
  optional: NavigatorContextHandle[];
  cached_ids: string[];
  invalidated_ids: string[];
};

export type NavigatorPacket = Omit<NavigatorSnapshot, "context" | "mode"> & {
  mode: NavigatorTaskMode;
  task_context_id: string;
  readiness: NavigatorReadiness;
  routing: NavigatorRoutingPolicy;
  workspace: NavigatorWorkspaceProjection;
  development: NavigatorDevelopmentResolution | null;
  context: NavigatorContextDelivery;
};

function emptyWorkspace(): NavigatorWorkspaceProjection {
  return {
    available: false,
    source_path: null,
    fingerprint: null,
    asset: null,
    current_stage: null,
    gates: { geometry: null, uv_layout: null, texturing: null, animation: null },
    next_step: null,
    blockers: [],
    unavailable_reason: "PROJECT_PATH_UNAVAILABLE",
  };
}

function runtimeContextIdentity(snapshot: NavigatorSnapshot): string {
  return snapshot.runtime.build_identity ?? snapshot.runtime.runtime_signature ?? "offline";
}

function taskContextId(
  snapshot: NavigatorSnapshot,
  workspace: NavigatorWorkspaceProjection,
  mode: NavigatorTaskMode,
  development: NavigatorDevelopmentResolution | null
): string {
  const payload = mode === "MCP_DEVELOPMENT"
    ? [
        mode,
        runtimeContextIdentity(snapshot),
        development?.domain ?? "no-development-domain",
        development?.intent ?? "no-development-intent",
      ]
    : [
        mode,
        snapshot.project.affinity_uuid ?? "unbound",
        snapshot.authoring.phase ?? "unknown",
        runtimeContextIdentity(snapshot),
        workspace.fingerprint ?? "no-workspace-state",
      ];
  return `task:${createHash("sha256").update(payload.join("|")).digest("hex").slice(0, 20)}`;
}

function contextFamily(id: string): string {
  const at = id.lastIndexOf("@");
  return at > 0 ? id.slice(0, at) : id;
}

function filterContext(
  snapshot: NavigatorSnapshot,
  knownContextIds: readonly string[],
  mode: NavigatorTaskMode
): NavigatorContextDelivery {
  if (mode === "MCP_DEVELOPMENT") {
    return { required: [], optional: [], cached_ids: [], invalidated_ids: [] };
  }

  const known = new Set(knownContextIds);
  const current = [...snapshot.context.required, ...snapshot.context.optional];
  const currentIds = new Set(current.map((handle) => handle.id));
  const currentFamilies = new Set(current.map((handle) => contextFamily(handle.id)));

  return {
    required: snapshot.context.required.filter((handle) => !known.has(handle.id)),
    optional: snapshot.context.optional.filter((handle) => !known.has(handle.id)),
    cached_ids: current.filter((handle) => known.has(handle.id)).map((handle) => handle.id),
    invalidated_ids: knownContextIds.filter(
      (id) => !currentIds.has(id) && currentFamilies.has(contextFamily(id))
    ),
  };
}

function buildReadiness(
  snapshot: NavigatorSnapshot,
  workspace: NavigatorWorkspaceProjection,
  mode: NavigatorTaskMode
): NavigatorReadiness {
  if (mode === "MCP_DEVELOPMENT") {
    return {
      modelling_start: "NEEDS_ORIENTATION",
      runtime_ready: snapshot.runtime.online && !snapshot.runtime.catalog_stale,
      project_ready: false,
      domain_ready: false,
      context_ready: true,
      workspace_state: "NOT_REQUIRED",
      reasons: ["MCP_DEVELOPMENT_MODE"],
    };
  }

  const runtimeReady = snapshot.runtime.online && !snapshot.runtime.catalog_stale;
  const projectReady = snapshot.project.binding === "BOUND";
  const domainReady = snapshot.authoring.domain !== null;
  const contextReady = snapshot.context.required.length > 0;
  const reasons: string[] = [];

  if (!snapshot.runtime.online) reasons.push("RUNTIME_OFFLINE");
  if (snapshot.runtime.catalog_stale) reasons.push("CATALOG_STALE");
  if (!projectReady) reasons.push("PROJECT_NOT_BOUND");
  if (!domainReady) reasons.push("AUTHORING_DOMAIN_UNRESOLVED");
  if (!contextReady) reasons.push("REQUIRED_CONTEXT_UNRESOLVED");

  const blocked = !runtimeReady || snapshot.project.binding === "LOST";
  return {
    modelling_start: blocked
      ? "BLOCKED"
      : projectReady && domainReady && contextReady
        ? "READY"
        : "NEEDS_ORIENTATION",
    runtime_ready: runtimeReady,
    project_ready: projectReady,
    domain_ready: domainReady,
    context_ready: contextReady,
    workspace_state: workspace.available ? "AVAILABLE" : "UNAVAILABLE",
    reasons,
  };
}

export async function buildNavigatorPacket(
  status: GatewayRuntimeStatus,
  options: {
    knownContextIds?: readonly string[];
    workspacePath?: string | null;
    taskMode?: NavigatorTaskMode;
    taskIntent?: string | null;
  } = {}
): Promise<NavigatorPacket> {
  const snapshot = buildNavigatorSnapshot(status);
  const mode = options.taskMode ?? "ASSET_AUTHORING";
  const development = mode === "MCP_DEVELOPMENT"
    ? resolveDevelopmentIntent(options.taskIntent ?? "")
    : null;
  const workspace = mode === "ASSET_AUTHORING"
    ? await readWorkspaceProjection(status, options.workspacePath)
    : emptyWorkspace();
  const workspaceBlockers = mode === "ASSET_AUTHORING"
    ? workspace.blockers.map((_, index) => `WORKSPACE_BLOCKER_${index + 1}`)
    : [];
  const blockers = [...snapshot.blockers, ...workspaceBlockers];

  return {
    ...snapshot,
    mode,
    system: snapshot.system === "READY" && workspaceBlockers.length > 0 ? "DEGRADED" : snapshot.system,
    task_context_id: taskContextId(snapshot, workspace, mode, development),
    readiness: buildReadiness(snapshot, workspace, mode),
    routing: NAVIGATOR_ROUTING_POLICY,
    workspace,
    development,
    context: filterContext(snapshot, options.knownContextIds ?? [], mode),
    blockers,
  };
}
