import { createHash } from "node:crypto";
import type { GatewayRuntimeStatus } from "../backend";
import { buildNavigatorSnapshot } from "./snapshot";
import { readWorkspaceProjection, type NavigatorWorkspaceProjection } from "./workspace";
import type { NavigatorContextHandle, NavigatorSnapshot } from "./types";

export type NavigatorContextDelivery = {
  required: NavigatorContextHandle[];
  optional: NavigatorContextHandle[];
  cached_ids: string[];
  invalidated_ids: string[];
};

export type NavigatorPacket = Omit<NavigatorSnapshot, "context"> & {
  task_context_id: string;
  workspace: NavigatorWorkspaceProjection;
  context: NavigatorContextDelivery;
};

function taskContextId(
  snapshot: NavigatorSnapshot,
  workspace: NavigatorWorkspaceProjection
): string {
  const payload = [
    snapshot.project.affinity_uuid ?? "unbound",
    snapshot.authoring.phase ?? "unknown",
    snapshot.runtime.build_identity ?? snapshot.runtime.runtime_signature ?? "offline",
    workspace.fingerprint ?? "no-workspace-state",
  ].join("|");
  return `task:${createHash("sha256").update(payload).digest("hex").slice(0, 20)}`;
}

function contextFamily(id: string): string {
  const at = id.lastIndexOf("@");
  return at > 0 ? id.slice(0, at) : id;
}

function filterContext(
  snapshot: NavigatorSnapshot,
  knownContextIds: readonly string[]
): NavigatorContextDelivery {
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

export async function buildNavigatorPacket(
  status: GatewayRuntimeStatus,
  options: {
    knownContextIds?: readonly string[];
    workspacePath?: string | null;
  } = {}
): Promise<NavigatorPacket> {
  const snapshot = buildNavigatorSnapshot(status);
  const workspace = await readWorkspaceProjection(status, options.workspacePath);
  const workspaceBlockers = workspace.blockers.map((_, index) => `WORKSPACE_BLOCKER_${index + 1}`);
  const blockers = [...snapshot.blockers, ...workspaceBlockers];
  return {
    ...snapshot,
    system: snapshot.system === "READY" && workspaceBlockers.length > 0 ? "DEGRADED" : snapshot.system,
    task_context_id: taskContextId(snapshot, workspace),
    workspace,
    context: filterContext(snapshot, options.knownContextIds ?? []),
    blockers,
  };
}
