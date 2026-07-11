import { getExecutionProfileState } from "@/lib/executionState";
import { sessionManager } from "@/lib/sessions";
import type { MutationExecutionContext } from "@/lib/writeLease";

const TRANSIENT_CLIENT_NAMES = new Set([
  "buildit-readiness",
  "buildit-readiness-smoke",
  "buildit-profile-sync",
]);

function explicitIdentity(raw: unknown): {
  sessionId: string | null;
  clientName: string | null;
  requestId: string | number | null;
} {
  if (!raw || typeof raw !== "object") {
    return { sessionId: null, clientName: null, requestId: null };
  }
  const value = raw as {
    sessionId?: unknown;
    clientName?: unknown;
    requestId?: unknown;
  };
  return {
    sessionId: typeof value.sessionId === "string" ? value.sessionId : null,
    clientName: typeof value.clientName === "string" ? value.clientName : null,
    requestId:
      typeof value.requestId === "string" || typeof value.requestId === "number"
        ? value.requestId
        : null,
  };
}

export function resolveMutationExecutionContext(
  rawContext?: unknown
): MutationExecutionContext {
  const explicit = explicitIdentity(rawContext);
  let sessionId = explicit.sessionId;
  let clientName = explicit.clientName;

  if (!sessionId) {
    const candidates = sessionManager
      .getAll()
      .filter(
        (session) =>
          !session.clientName || !TRANSIENT_CLIENT_NAMES.has(session.clientName)
      );
    if (candidates.length === 1) {
      sessionId = candidates[0].id;
      clientName = candidates[0].clientName ?? null;
    } else if (candidates.length > 1) {
      throw new Error(
        `WRITE_LEASE_SESSION_AMBIGUOUS: ${candidates.length} non-transient MCP sessions are active.`
      );
    }
  }

  const profile = getExecutionProfileState();
  return {
    sessionId,
    clientName,
    requestId: explicit.requestId,
    profileId: profile.profileId,
    profileRevision: profile.profileRevision,
    profileHash: profile.profileHash,
  };
}
