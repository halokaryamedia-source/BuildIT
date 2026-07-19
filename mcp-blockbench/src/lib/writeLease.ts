/// <reference types="blockbench-types" />
import {
  assertInsideRoot,
  normalizePathForCompare,
  readJsonFile,
  type NativeFsLike,
} from "@/lib/atomicFiles";

const DEFAULT_LEASE_TTL_MS = 30 * 60 * 1000;
const READINESS_CLIENT_NAMES = new Set([
  "buildit-readiness",
  "buildit-readiness-smoke",
]);

export interface MutationExecutionContext {
  sessionId: string | null;
  clientName: string | null;
  requestId: string | number | null;
  profileId: string;
  profileRevision: number;
  profileHash: string;
}

export interface ProjectWriteLeaseSnapshot {
  status: "UNCLAIMED" | "ACTIVE" | "EXPIRED";
  project_uuid: string | null;
  asset_id: string | null;
  owner_session_id: string | null;
  owner_client: string | null;
  session_root: string | null;
  stage: string | null;
  state_revision: number | null;
  profile_id: string | null;
  profile_revision: number | null;
  profile_hash: string | null;
  acquired_at: string | null;
  renewed_at: string | null;
  expires_at: string | null;
}

export interface EnsureProjectWriteLeaseResult {
  action: "ACQUIRED" | "REFRESHED";
  lease: ProjectWriteLeaseSnapshot;
}

interface ProjectWriteLease {
  projectUuid: string;
  assetId: string;
  ownerSessionId: string;
  ownerClient: string | null;
  sessionRoot: string;
  stage: string;
  stateRevision: number;
  profileId: string;
  profileRevision: number;
  profileHash: string;
  acquiredAtMs: number;
  renewedAtMs: number;
  expiresAtMs: number;
}

interface WorkflowStateFile {
  state_revision?: number;
  asset?: { id?: string };
  project?: { uuid?: string | null };
  workflow?: { active_stage?: string; state?: string };
  mcp?: { active_tool_profile?: string; tool_profile_revision?: number | null };
}

let activeLease: ProjectWriteLease | null = null;
let lastLeaseExpired = false;

function nativeFs(): NativeFsLike {
  // @ts-ignore - Blockbench runtime permission API.
  const fs = requireNativeModule("fs", {
    message: "MCP project write ownership needs access to the active asset state file.",
    optional: false,
  });
  if (!fs) throw new Error("Filesystem access was denied for project write ownership.");
  return fs as NativeFsLike;
}

function statePath(sessionRoot: string): string {
  return `${sessionRoot.replace(/[\\/]$/, "")}/state.json`;
}

function currentProjectUuid(): string | null {
  return typeof Project !== "undefined" && Project ? Project.uuid : null;
}

function activeOrNull(now = Date.now()): ProjectWriteLease | null {
  if (!activeLease) return null;
  if (activeLease.expiresAtMs <= now) {
    activeLease = null;
    lastLeaseExpired = true;
    return null;
  }
  return activeLease;
}

function iso(value: number | null): string | null {
  return value === null ? null : new Date(value).toISOString();
}

function readState(sessionRoot: string): WorkflowStateFile {
  const path = statePath(sessionRoot);
  assertInsideRoot(path, sessionRoot);
  return readJsonFile<WorkflowStateFile>(nativeFs(), path);
}

function assertCaller(context: MutationExecutionContext): string {
  if (!context.sessionId) {
    throw new Error("WRITE_LEASE_SESSION_REQUIRED: MCP session identity is unavailable.");
  }
  if (context.clientName && READINESS_CLIENT_NAMES.has(context.clientName)) {
    throw new Error("WRITE_LEASE_READINESS_FORBIDDEN: transient readiness sessions cannot own project writes.");
  }
  return context.sessionId;
}

function stateRevision(state: WorkflowStateFile): number {
  const revision = Number(state.state_revision);
  if (!Number.isInteger(revision) || revision < 0) {
    throw new Error("WRITE_LEASE_STATE_INVALID: state_revision is missing or invalid.");
  }
  return revision;
}

function stateStage(state: WorkflowStateFile): string {
  const stage = state.workflow?.active_stage;
  if (!stage) {
    throw new Error("WRITE_LEASE_STAGE_INVALID: active workflow stage is missing.");
  }
  return stage;
}

function assertProfileState(
  state: WorkflowStateFile,
  context: MutationExecutionContext
): void {
  if (
    state.mcp?.active_tool_profile &&
    state.mcp.active_tool_profile !== context.profileId
  ) {
    throw new Error(
      `WRITE_LEASE_PROFILE_MISMATCH: state expects ${state.mcp.active_tool_profile}, runtime is ${context.profileId}.`
    );
  }
}

/**
 * Automatically acquires or refreshes the current-session write lease from the
 * authoritative workspace state. Normal Codex production should rely on this
 * path instead of manually calling manage_project_write_lease.
 */
export function ensureProjectWriteLease(
  input: {
    sessionRoot: string;
    assetId?: string;
    expectedProjectUuid?: string;
    expectedStage?: string;
    ttlMinutes?: number;
  },
  context: MutationExecutionContext
): EnsureProjectWriteLeaseResult {
  const ownerSessionId = assertCaller(context);
  const projectUuid = currentProjectUuid();
  if (!projectUuid) throw new Error("WRITE_LEASE_NO_PROJECT: no Blockbench project is open.");
  if (input.expectedProjectUuid && projectUuid !== input.expectedProjectUuid) {
    throw new Error(
      `WRITE_LEASE_PROJECT_MISMATCH: active ${projectUuid}, expected ${input.expectedProjectUuid}.`
    );
  }

  const root = normalizePathForCompare(input.sessionRoot);
  if (!root) throw new Error("WRITE_LEASE_ROOT_INVALID: session root is empty.");
  const state = readState(input.sessionRoot);
  const assetId = input.assetId ?? state.asset?.id;
  if (!assetId) {
    throw new Error("WRITE_LEASE_ASSET_INVALID: active state has no asset id.");
  }
  if (state.asset?.id !== assetId) {
    throw new Error(
      `WRITE_LEASE_ASSET_MISMATCH: state has ${state.asset?.id ?? "unknown"}, expected ${assetId}.`
    );
  }

  const revision = stateRevision(state);
  const stage = stateStage(state);
  if (input.expectedStage && stage !== input.expectedStage) {
    throw new Error(
      `WRITE_LEASE_STAGE_MISMATCH: state is ${stage}, expected ${input.expectedStage}.`
    );
  }
  assertProfileState(state, context);

  const existing = activeOrNull();
  if (existing && existing.ownerSessionId !== ownerSessionId) {
    throw new Error(
      `WRITE_LEASE_OWNED: project ${existing.projectUuid} is owned by ${existing.ownerClient ?? existing.ownerSessionId}.`
    );
  }

  const sameLease = Boolean(
    existing &&
      existing.ownerSessionId === ownerSessionId &&
      existing.projectUuid === projectUuid &&
      existing.sessionRoot === root
  );
  const now = Date.now();
  const ttlMinutes = Math.min(Math.max(input.ttlMinutes ?? 30, 5), 120);
  activeLease = {
    projectUuid,
    assetId,
    ownerSessionId,
    ownerClient: context.clientName,
    sessionRoot: root,
    stage,
    stateRevision: revision,
    profileId: context.profileId,
    profileRevision: context.profileRevision,
    profileHash: context.profileHash,
    acquiredAtMs: sameLease && existing ? existing.acquiredAtMs : now,
    renewedAtMs: now,
    expiresAtMs: now + ttlMinutes * 60 * 1000,
  };
  lastLeaseExpired = false;
  return {
    action: sameLease ? "REFRESHED" : "ACQUIRED",
    lease: getProjectWriteLeaseSnapshot(),
  };
}

export function acquireProjectWriteLease(
  input: {
    assetId: string;
    sessionRoot: string;
    expectedProjectUuid: string;
    expectedStateRevision: number;
    expectedStage: string;
    ttlMinutes?: number;
  },
  context: MutationExecutionContext
): ProjectWriteLeaseSnapshot {
  const ownerSessionId = assertCaller(context);
  const projectUuid = currentProjectUuid();
  if (!projectUuid) throw new Error("WRITE_LEASE_NO_PROJECT: no Blockbench project is open.");
  if (projectUuid !== input.expectedProjectUuid) {
    throw new Error(
      `WRITE_LEASE_PROJECT_MISMATCH: active ${projectUuid}, expected ${input.expectedProjectUuid}.`
    );
  }

  const root = normalizePathForCompare(input.sessionRoot);
  if (!root) throw new Error("WRITE_LEASE_ROOT_INVALID: session root is empty.");
  const state = readState(input.sessionRoot);
  if (state.asset?.id !== input.assetId) {
    throw new Error(
      `WRITE_LEASE_ASSET_MISMATCH: state has ${state.asset?.id ?? "unknown"}, expected ${input.assetId}.`
    );
  }
  if (state.state_revision !== input.expectedStateRevision) {
    throw new Error(
      `WRITE_LEASE_STATE_STALE: state is ${state.state_revision ?? "unknown"}, expected ${input.expectedStateRevision}.`
    );
  }
  if (state.workflow?.active_stage !== input.expectedStage) {
    throw new Error(
      `WRITE_LEASE_STAGE_MISMATCH: state is ${state.workflow?.active_stage ?? "unknown"}, expected ${input.expectedStage}.`
    );
  }
  assertProfileState(state, context);

  const existing = activeOrNull();
  if (existing && existing.ownerSessionId !== ownerSessionId) {
    throw new Error(
      `WRITE_LEASE_OWNED: project ${existing.projectUuid} is owned by ${existing.ownerClient ?? existing.ownerSessionId}.`
    );
  }
  if (existing && existing.projectUuid !== projectUuid) {
    throw new Error(
      `WRITE_LEASE_PROJECT_OWNED: session already owns project ${existing.projectUuid}; release it before acquiring ${projectUuid}.`
    );
  }

  const now = Date.now();
  const ttlMinutes = Math.min(Math.max(input.ttlMinutes ?? 30, 5), 120);
  activeLease = {
    projectUuid,
    assetId: input.assetId,
    ownerSessionId,
    ownerClient: context.clientName,
    sessionRoot: root,
    stage: input.expectedStage,
    stateRevision: input.expectedStateRevision,
    profileId: context.profileId,
    profileRevision: context.profileRevision,
    profileHash: context.profileHash,
    acquiredAtMs: existing?.acquiredAtMs ?? now,
    renewedAtMs: now,
    expiresAtMs: now + ttlMinutes * 60 * 1000,
  };
  lastLeaseExpired = false;
  return getProjectWriteLeaseSnapshot();
}

export function renewProjectWriteLease(
  context: MutationExecutionContext,
  ttlMinutes = 30
): ProjectWriteLeaseSnapshot {
  const ownerSessionId = assertCaller(context);
  const lease = activeOrNull();
  if (!lease) throw new Error("WRITE_LEASE_REQUIRED: no active project write lease.");
  if (lease.ownerSessionId !== ownerSessionId) {
    throw new Error("WRITE_LEASE_OWNER_MISMATCH: this session does not own the project lease.");
  }
  const now = Date.now();
  lease.renewedAtMs = now;
  lease.expiresAtMs = now + Math.min(Math.max(ttlMinutes, 5), 120) * 60 * 1000;
  lastLeaseExpired = false;
  return getProjectWriteLeaseSnapshot();
}

export function releaseProjectWriteLease(
  context: MutationExecutionContext,
  force = false
): ProjectWriteLeaseSnapshot {
  const lease = activeOrNull();
  if (!lease) return getProjectWriteLeaseSnapshot();
  if (!force) {
    const ownerSessionId = assertCaller(context);
    if (lease.ownerSessionId !== ownerSessionId) {
      throw new Error("WRITE_LEASE_OWNER_MISMATCH: this session cannot release another owner's lease.");
    }
  }
  activeLease = null;
  lastLeaseExpired = false;
  return getProjectWriteLeaseSnapshot();
}

export function releaseProjectWriteLeaseForSession(sessionId: string): void {
  if (activeLease?.ownerSessionId === sessionId) activeLease = null;
}

export function clearProjectWriteLease(): void {
  activeLease = null;
  lastLeaseExpired = false;
}

export function updateProjectWriteLeaseWorkflow(
  sessionId: string | null,
  update: {
    stage: string;
    stateRevision: number;
    profileId: string;
    profileRevision: number;
    profileHash: string;
  }
): void {
  const lease = activeOrNull();
  if (!lease) throw new Error("WRITE_LEASE_REQUIRED: stage transition has no active write lease.");
  if (!sessionId || lease.ownerSessionId !== sessionId) {
    throw new Error("WRITE_LEASE_OWNER_MISMATCH: stage transition caller does not own the lease.");
  }
  lease.stage = update.stage;
  lease.stateRevision = update.stateRevision;
  lease.profileId = update.profileId;
  lease.profileRevision = update.profileRevision;
  lease.profileHash = update.profileHash;
  lease.renewedAtMs = Date.now();
  lease.expiresAtMs = lease.renewedAtMs + DEFAULT_LEASE_TTL_MS;
  lastLeaseExpired = false;
}

export function getProjectWriteLeaseSnapshot(): ProjectWriteLeaseSnapshot {
  const now = Date.now();
  const lease = activeOrNull(now);
  if (!lease) {
    return {
      status: lastLeaseExpired ? "EXPIRED" : "UNCLAIMED",
      project_uuid: null,
      asset_id: null,
      owner_session_id: null,
      owner_client: null,
      session_root: null,
      stage: null,
      state_revision: null,
      profile_id: null,
      profile_revision: null,
      profile_hash: null,
      acquired_at: null,
      renewed_at: null,
      expires_at: null,
    };
  }
  return {
    status: "ACTIVE",
    project_uuid: lease.projectUuid,
    asset_id: lease.assetId,
    owner_session_id: lease.ownerSessionId,
    owner_client: lease.ownerClient,
    session_root: lease.sessionRoot,
    stage: lease.stage,
    state_revision: lease.stateRevision,
    profile_id: lease.profileId,
    profile_revision: lease.profileRevision,
    profile_hash: lease.profileHash,
    acquired_at: iso(lease.acquiredAtMs),
    renewed_at: iso(lease.renewedAtMs),
    expires_at: iso(lease.expiresAtMs),
  };
}

function pathValues(args: Record<string, unknown>): string[] {
  const values: string[] = [];
  for (const key of ["path", "metadata_path", "output_dir"]) {
    const value = args[key];
    if (typeof value === "string" && value.length > 0) values.push(value);
  }
  return values;
}

function requiresLease(
  toolName: string,
  _args: Record<string, unknown>,
  readOnlyHint: boolean | undefined
): boolean {
  if (toolName === "manage_project_write_lease") return false;
  if (toolName === "rebind_active_project_identity") return false;
  if (toolName === "create_project" && !currentProjectUuid()) return false;
  // Read-only tools may inspect workspace paths without owning project writes.
  // Tools that persist evidence must declare readOnlyHint=false.
  if (readOnlyHint === true) return false;
  return true;
}

export function assertToolMutationAllowed(
  toolName: string,
  args: Record<string, unknown>,
  context: MutationExecutionContext,
  readOnlyHint?: boolean
): void {
  if (!requiresLease(toolName, args, readOnlyHint)) return;
  const ownerSessionId = assertCaller(context);
  const declaredRoot =
    typeof args.session_root === "string" && args.session_root.length > 0
      ? args.session_root
      : null;

  let lease = activeOrNull();
  if (!lease && declaredRoot) {
    ensureProjectWriteLease(
      {
        sessionRoot: declaredRoot,
        assetId: typeof args.asset_id === "string" ? args.asset_id : undefined,
        expectedProjectUuid:
          typeof args.expected_project_uuid === "string"
            ? args.expected_project_uuid
            : undefined,
        expectedStage:
          typeof args.stage === "string" ? args.stage : undefined,
      },
      context
    );
    lease = activeOrNull();
  }

  if (!lease) {
    throw new Error(
      `WRITE_LEASE_REQUIRED: ${toolName} has no session_root for automatic preparation. Call get_stage_context once for the active asset, then retry.`
    );
  }
  if (lease.ownerSessionId !== ownerSessionId) {
    throw new Error(`WRITE_LEASE_OWNER_MISMATCH: ${toolName} was called by a non-owner session.`);
  }

  if (currentProjectUuid() !== lease.projectUuid) {
    if (declaredRoot) {
      ensureProjectWriteLease(
        {
          sessionRoot: declaredRoot,
          assetId: typeof args.asset_id === "string" ? args.asset_id : undefined,
          expectedProjectUuid:
            typeof args.expected_project_uuid === "string"
              ? args.expected_project_uuid
              : undefined,
          expectedStage:
            typeof args.stage === "string" ? args.stage : undefined,
        },
        context
      );
      lease = activeOrNull();
    }
    if (!lease || currentProjectUuid() !== lease.projectUuid) {
      throw new Error(
        `WRITE_LEASE_PROJECT_CHANGED: active project ${currentProjectUuid() ?? "none"} differs from leased project ${lease?.projectUuid ?? "none"}.`
      );
    }
  }

  const state = readState(lease.sessionRoot);
  assertProfileState(state, context);

  // State/profile revisions commonly change during an automatic stage transition.
  // Refresh the same owner's in-memory lease instead of blocking the next safe call.
  lease.stateRevision = stateRevision(state);
  lease.stage = stateStage(state);
  lease.profileId = context.profileId;
  lease.profileRevision = context.profileRevision;
  lease.profileHash = context.profileHash;

  if (declaredRoot && normalizePathForCompare(declaredRoot) !== lease.sessionRoot) {
    throw new Error("WRITE_LEASE_ROOT_MISMATCH: tool session_root differs from the leased session root.");
  }
  for (const path of pathValues(args)) assertInsideRoot(path, lease.sessionRoot);

  lease.renewedAtMs = Date.now();
  lease.expiresAtMs = lease.renewedAtMs + DEFAULT_LEASE_TTL_MS;
  lastLeaseExpired = false;
}
