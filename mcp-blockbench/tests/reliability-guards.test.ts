import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const read = (path: string) => readFileSync(path, "utf8");
const json = (path: string) =>
  JSON.parse(read(path)) as Record<string, any>;

describe("Ponytail-scoped MCP reliability guards", () => {
  test("uses one composite write-lease capability in every exact profile", () => {
    const profiles = json("../engines/shared/profiles/tool-profiles.json");
    expect(profiles.core_tools).toContain("manage_project_write_lease");
    expect(
      profiles.forbidden_in_normal_profiles.includes(
        "manage_project_write_lease"
      )
    ).toBe(false);
  });

  test("passes the transport session identity into tool execution", () => {
    const source = read("src/lib/factories.ts");
    expect(source).toContain("sessionId: string | null");
    expect(source).toContain("toolContextFromExtra(extra)");
    expect(source).toContain("sessionManager.get(sessionId)");
  });

  test("binds mutations to owner, project, stage, state, profile, and session root", () => {
    const source = read("src/lib/writeLease.ts");
    for (const marker of [
      "WRITE_LEASE_OWNER_MISMATCH",
      "WRITE_LEASE_PROJECT_CHANGED",
      "WRITE_LEASE_STATE_STALE",
      "WRITE_LEASE_STAGE_STALE",
      "WRITE_LEASE_PROFILE_STALE",
      "WRITE_LEASE_ROOT_MISMATCH",
      "assertInsideRoot(path, lease.sessionRoot)",
    ]) {
      expect(source).toContain(marker);
    }
  });

  test("enforces leases and releases both generic and guarded stage completion", () => {
    const source = read("src/lib/toolProfiles.ts");
    expect(source).toContain("assertToolMutationAllowed");
    expect(source).toContain('"complete_stage"');
    expect(source).toContain('"complete_geometry_stage"');
    expect(source).toContain('name === "activate_tool_profile"');
    expect(source).toContain("profileChanged");
    expect(source).toContain("releaseProjectWriteLease");
    expect(source).toContain("canEnterBootstrapWithoutProject");
  });

  test("standard evidence delegates to clean rotation-aware capture", () => {
    const camera = read("src/server/tools/camera.ts");
    const feedback = read("src/server/tools/geometry-feedback.ts");
    expect(camera).toContain("capture_visual_feedback");
    expect(camera).toContain("front_left_3_4");
    expect(camera).toContain('"perspective"');
    expect(feedback).toContain("writeFileAtomically(fs, outputPath, data)");
    expect(feedback).toContain("sha256: sha256(data)");
    expect(feedback).toContain("withCleanSelection");
  });

  test("records real checkpoint and export integrity hashes", () => {
    const source = read("src/server/tools/export.ts");
    expect(source).toContain("bbmodel_sha256: sha256(model.data)");
    expect(source).toContain("reference_manifest_sha256");
    expect(source).toContain("metadata_payload_sha256");
    expect(source).toContain("writeFileAtomically(fs, path, output.data)");
    expect(source).toContain("serialized ?? String(value)");
  });

  test("aligns transport timeout with the 30-minute contract", () => {
    const source = read("src/lib/sessions.ts");
    expect(source).toContain("30 * 60 * 1000");
    expect(source).toContain("write lease has its own expiry");
  });

  test("allows concurrent inspection sessions while the lease remains the sole writer authority", () => {
    const runtime = read("src/server/tools/runtime.ts");
    const lease = read("src/lib/writeLease.ts");
    const identity = read("src/server/tools/project-identity.ts");

    expect(runtime).toContain("single_writer_enforced_by_lease: true");
    expect(runtime).toContain("inspection_or_idle");
    expect(runtime).not.toContain("MULTIPLE_MCP_WRITE_SESSIONS");
    expect(lease).toContain("WRITE_LEASE_OWNED");
    expect(lease).toContain("WRITE_LEASE_OWNER_MISMATCH");
    expect(identity).toContain("PROJECT_IDENTITY_LEASE_ACTIVE");
    expect(identity).toContain("writeJsonFilesAtomically");
  });
});
