import { describe, expect, test } from "bun:test";
import {
  buildNavigatorDelta,
  buildNavigatorSnapshot,
  decorateCapabilities,
  resolveDevelopmentIntent,
} from "@/gateway/navigator";
import type { GatewayRuntimeStatus } from "@/gateway/backend";

const status: GatewayRuntimeStatus = {
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
  operations: {
    active: 0,
    queued: 0,
    max_queue_depth: 8,
    completed: 0,
    failed: 0,
    timed_out: 0,
    rejected_busy: 0,
  },
  last_error: null,
};

describe("BlockIT Navigator active naming contract", () => {
  test("authoring domain and source owner are distinct canonical concepts", () => {
    const snapshot = buildNavigatorSnapshot(status);
    expect(snapshot.authoring.domain).toBe("GEOMETRY");
    expect(snapshot.authoring).not.toHaveProperty("owner");

    const [capability] = decorateCapabilities(
      [
        {
          capability_id: "manage_cubes",
          description: "Create or update Bedrock cubes.",
          tier: "primary",
          read_only: false,
          destructive: true,
          idempotent: false,
        },
      ],
      "GEOMETRY"
    );

    expect(capability.navigation.authoring_domain).toBe("GEOMETRY");
    expect(capability.navigation.current_domain).toBe(true);
    expect(capability.navigation.source_owner.source).toBe("mcp/server/tools/cubes.ts");
    expect(capability.navigation).not.toHaveProperty("owner");
    expect(capability.navigation).not.toHaveProperty("current_owner");

    const delta = buildNavigatorDelta({
      capability: "manage_cubes",
      phaseBefore: "geometry",
      phaseAfter: "geometry",
      projectUuid: "project-a",
      succeeded: true,
    });
    expect(delta.authoring_domain).toBe("GEOMETRY");
    expect(delta).not.toHaveProperty("owner");
  });

  test("unresolved development routing remains bounded and fail-closed", () => {
    const result = resolveDevelopmentIntent("something unusual elsewhere");
    expect(result.domain).toBe("UNRESOLVED");
    expect(result.confidence).toBe("UNRESOLVED");
    expect(result.source_owners).toEqual([]);
    expect(result.required_context_paths).toEqual([
      "AGENTS.md",
      "mcp/AGENTS.md",
      ".agents/skills/development-brief/SKILL.md",
    ]);
  });
});
