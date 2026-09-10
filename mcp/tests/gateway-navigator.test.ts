import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import {
  buildNavigatorDelta,
  buildNavigatorSnapshot,
  decorateCapabilities,
  NAVIGATOR_CONTEXT_HANDLES,
  ownerForCapability,
} from "@/gateway/navigator";
import type { GatewayRuntimeStatus } from "@/gateway/backend";

const onlineStatus: GatewayRuntimeStatus = {
  gateway: "ready",
  affinity: { project_uuid: "project-a", authoring_phase: "geometry" },
  runtime: {
    online: true,
    endpoint: "http://127.0.0.1:3000/bb-mcp",
    mcp_client_ready: true,
    catalog_stale: false,
    runtime_signature: "runtime-a",
    connected_signature: "runtime-a",
    catalog_count: 47,
    health: {
      build_identity: "sha256:build-a",
      product: { authoring_phase: "geometry" },
      project_context: {
        active_project_uuid: "project-a",
        requested_project_uuid: "project-a",
        requested_project_available: true,
        open_project_count: 1,
      },
    },
  },
  operations: { active: 0, queued: 0, max_queue_depth: 8, completed: 2, failed: 0, timed_out: 0, rejected_busy: 0 },
  last_error: null,
};

describe("BlockIT Navigator", () => {
  test("L0 snapshot is compact, deterministic and derived from live Gateway/Runtime state", () => {
    const nav = buildNavigatorSnapshot(onlineStatus);
    expect(nav.protocol).toBe("blockit-navigator-v1");
    expect(nav.system).toBe("READY");
    expect(nav.project).toMatchObject({ affinity_uuid: "project-a", binding: "BOUND" });
    expect(nav.authoring).toMatchObject({ phase: "geometry", owner: "GEOMETRY" });
    expect(nav.runtime.build_identity).toBe("sha256:build-a");
    expect(nav.context.required.map((entry) => entry.path)).toEqual([
      ".agents/skills/blockit-bedrock-entity-mcp/SKILL.md",
      ".agents/skills/blockbench-bedrock-modelling/SKILL.md",
    ]);
  });

  test("offline state fails closed in navigation", () => {
    const offline = buildNavigatorSnapshot({
      ...onlineStatus,
      affinity: { project_uuid: null, authoring_phase: "geometry" },
      runtime: {
        ...onlineStatus.runtime,
        online: false,
        health: null,
        runtime_signature: null,
        mcp_client_ready: false,
      },
    });
    expect(offline.system).toBe("OFFLINE");
    expect(offline.blockers).toContain("RUNTIME_OFFLINE");
  });

  test("capability ownership decorates search results without duplicating schemas", () => {
    expect(ownerForCapability("manage_cubes")).toBe("GEOMETRY");
    expect(ownerForCapability("paint_with_brush")).toBe("TEXTURING");
    expect(ownerForCapability("manage_animation_timeline")).toBe("ANIMATION");
    expect(ownerForCapability("get_project_info")).toBe("CORE");

    const decorated = decorateCapabilities([
      { capability_id: "manage_cubes", description: "", tier: "primary", read_only: false, destructive: true, idempotent: false },
      { capability_id: "paint_with_brush", description: "", tier: "primary", read_only: false, destructive: true, idempotent: false },
    ], "GEOMETRY");
    expect(decorated[0]?.navigation.eligibility).toBe("RECOMMENDED");
    expect(decorated[1]?.navigation.eligibility).toBe("FOREIGN_PHASE");
  });

  test("mutation continuation emits delta instead of requiring a full status packet", () => {
    const delta = buildNavigatorDelta({ capability: "manage_cubes", phaseBefore: "geometry", phaseAfter: "geometry", projectUuid: "project-a", succeeded: true });
    expect(delta.requires_status_refresh).toBe(false);
    expect(delta.changed).toEqual([]);
    expect(delta.next_intent).toBe("VERIFY_OR_CONTINUE_GEOMETRY");

    const handoff = buildNavigatorDelta({ capability: "switch_authoring_phase", phaseBefore: "texturing", phaseAfter: "animation", projectUuid: "project-a", succeeded: true });
    expect(handoff.requires_status_refresh).toBe(true);
    expect(handoff.changed).toContain("authoring_phase");
  });

  test("context handles are content-addressed and fail stale when canonical content changes", async () => {
    for (const handle of Object.values(NAVIGATOR_CONTEXT_HANDLES)) {
      const bytes = await readFile(new URL(`../../${handle.path}`, import.meta.url));
      const digest = createHash("sha256").update(bytes).digest("hex");
      expect(digest, handle.path).toBe(handle.sha256);
      expect(handle.id).toContain(handle.sha256.slice(0, 12));
    }
  });
});
