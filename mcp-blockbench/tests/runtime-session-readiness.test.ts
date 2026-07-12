import { describe, expect, test } from "bun:test";
import { summarizeRuntimeSessions } from "../src/server/tools/runtime";

const session = (id: string) => ({
  id,
  connectedAt: new Date(),
  lastActivity: new Date(),
  failedPings: 0,
});

const unclaimedLease = {
  status: "UNCLAIMED" as const,
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

describe("runtime session readiness", () => {
  test("keeps several inspection sessions blocker-free until a lease is acquired", () => {
    expect(summarizeRuntimeSessions([session("one"), session("two")], unclaimedLease)).toEqual({
      total: 2,
      readiness: 0,
      inspection_or_idle: 2,
      active_write_owner_session: null,
    });
  });

  test("reports the one explicit writer from the lease, not connected-session count", () => {
    expect(
      summarizeRuntimeSessions([session("owner"), session("reader")], {
        ...unclaimedLease,
        status: "ACTIVE",
        owner_session_id: "owner",
      })
    ).toMatchObject({
      total: 2,
      inspection_or_idle: 2,
      active_write_owner_session: "owner",
    });
  });
});
