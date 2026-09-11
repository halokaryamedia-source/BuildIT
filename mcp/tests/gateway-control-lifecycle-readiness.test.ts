import { describe, expect, test } from "bun:test";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { buildControlPacket } from "@/gateway/control";
import type { GatewayRuntimeStatus } from "@/gateway/backend";

function status(phase: "geometry" | "texturing" | "animation"): GatewayRuntimeStatus {
  return {
    gateway: "ready",
    affinity: { project_uuid: "project-a", authoring_phase: phase },
    runtime: {
      online: true,
      endpoint: "http://127.0.0.1:3000/bb-mcp",
      mcp_client_ready: true,
      catalog_stale: false,
      runtime_signature: `runtime-${phase}`,
      connected_signature: `runtime-${phase}`,
      catalog_count: phase === "animation" ? 20 : 47,
      health: {
        build_identity: "sha256:build-a",
        product: { authoring_phase: phase },
        project_context: {
          active_project_uuid: "project-a",
          requested_project_uuid: "project-a",
          requested_project_available: true,
          open_project_count: 1,
        },
      },
    },
    operations: { active: 0, queued: 0, max_queue_depth: 8, completed: 0, failed: 0, timed_out: 0, rejected_busy: 0 },
    last_error: null,
  };
}

async function workspace(gates: {
  geometry: string;
  uv: string;
  texturing: string;
  animation?: string;
}): Promise<string> {
  const directory = await mkdtemp(join(tmpdir(), "lazydesigner-lifecycle-"));
  await writeFile(join(directory, "README.md"), `# Lifecycle Fixture\n\nCurrent Stage: TEXTURING\n\nGeometry: ${gates.geometry}\n\nUV Layout: ${gates.uv}\n\nTexturing: ${gates.texturing}\n\nAnimation: ${gates.animation ?? "NOT_STARTED"}\n\nCurrent next step: Continue current stage\n\nKnown blocker(s): None\n`);
  return directory;
}

describe("LazyDesigner Control lifecycle readiness", () => {
  test("Geometry does not require downstream workspace gates", async () => {
    const packet = await buildControlPacket(status("geometry"));
    expect(packet.readiness.reasons).not.toContain("GEOMETRY_APPROVAL_REQUIRED");
    expect(packet.readiness.reasons).not.toContain("UV_LAYOUT_PASS_REQUIRED");
  });

  test("Texturing blocks when Geometry approval or UV Layout PASS is missing", async () => {
    const directory = await workspace({ geometry: "IN_PROGRESS", uv: "NOT_STARTED", texturing: "NOT_STARTED" });
    const packet = await buildControlPacket(status("texturing"), { workspacePath: directory });

    expect(packet.readiness.modelling_start).toBe("BLOCKED");
    expect(packet.readiness.reasons).toContain("GEOMETRY_APPROVAL_REQUIRED");
    expect(packet.readiness.reasons).toContain("UV_LAYOUT_PASS_REQUIRED");
    expect(packet.blockers).toContain("GEOMETRY_APPROVAL_REQUIRED");
    expect(packet.blockers).toContain("UV_LAYOUT_PASS_REQUIRED");
  });

  test("Texturing becomes legal after Geometry APPROVED and UV Layout PASS", async () => {
    const directory = await workspace({ geometry: "APPROVED", uv: "PASS", texturing: "IN_PROGRESS" });
    const packet = await buildControlPacket(status("texturing"), { workspacePath: directory });

    expect(packet.readiness.modelling_start).toBe("READY");
    expect(packet.readiness.reasons).not.toContain("GEOMETRY_APPROVAL_REQUIRED");
    expect(packet.readiness.reasons).not.toContain("UV_LAYOUT_PASS_REQUIRED");
  });

  test("Animation additionally requires Texturing APPROVED", async () => {
    const directory = await workspace({ geometry: "APPROVED", uv: "PASS", texturing: "READY_FOR_USER_REVIEW" });
    const packet = await buildControlPacket(status("animation"), { workspacePath: directory });

    expect(packet.readiness.modelling_start).toBe("BLOCKED");
    expect(packet.readiness.reasons).toContain("TEXTURE_APPROVAL_REQUIRED");
  });

  test("Animation is lifecycle-ready when upstream persisted gates are approved", async () => {
    const directory = await workspace({ geometry: "APPROVED", uv: "PASS", texturing: "APPROVED", animation: "IN_PROGRESS" });
    const packet = await buildControlPacket(status("animation"), { workspacePath: directory });

    expect(packet.readiness.modelling_start).toBe("READY");
    expect(packet.readiness.reasons).not.toContain("TEXTURE_APPROVAL_REQUIRED");
  });

  test("missing Workspace asks for orientation instead of inventing downstream failure", async () => {
    const packet = await buildControlPacket(status("texturing"));
    expect(packet.readiness.modelling_start).toBe("NEEDS_ORIENTATION");
    expect(packet.readiness.reasons).toContain("WORKSPACE_LIFECYCLE_UNAVAILABLE");
    expect(packet.blockers).not.toContain("GEOMETRY_APPROVAL_REQUIRED");
  });
});
