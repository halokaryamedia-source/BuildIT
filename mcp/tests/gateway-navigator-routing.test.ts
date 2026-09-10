import { describe, expect, test } from "bun:test";
import {
  buildNavigatorPacket,
  decorateCapabilities,
  sourceOwnerForCapability,
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

describe("BlockIT Navigator routing", () => {
  test("known capabilities expose deterministic source, specialist and test owners", async () => {
    expect(sourceOwnerForCapability("manage_cubes")).toEqual({
      source: "mcp/server/tools/cubes.ts",
      specialist: ".agents/skills/blockbench-bedrock-modelling/SKILL.md",
      test_owner: "mcp/tests/model-effectiveness-correction-accuracy.test.ts",
    });
    expect(sourceOwnerForCapability("paint_with_brush").source).toBe(
      "mcp/server/tools/paint.ts"
    );
    expect(sourceOwnerForCapability("manage_animation_controller").source).toBe(
      "mcp/server/tools/animation-controller.ts"
    );

    for (const capability of [
      "manage_cubes",
      "paint_with_brush",
      "manage_animation_controller",
      "switch_authoring_phase",
    ]) {
      const owner = sourceOwnerForCapability(capability);
      expect(await Bun.file(new URL(`../../${owner.source}`, import.meta.url)).exists(), owner.source).toBe(true);
      if (owner.specialist) {
        expect(await Bun.file(new URL(`../../${owner.specialist}`, import.meta.url)).exists(), owner.specialist).toBe(true);
      }
      if (owner.test_owner) {
        expect(await Bun.file(new URL(`../../${owner.test_owner}`, import.meta.url)).exists(), owner.test_owner).toBe(true);
      }
    }
  });

  test("capability search projection carries source ownership without schema duplication", () => {
    const [result] = decorateCapabilities(
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
    expect(result.navigation.source_owner.source).toBe("mcp/server/tools/cubes.ts");
    expect(result.navigation.source_owner.specialist).toContain("blockbench-bedrock-modelling");
    expect(result).not.toHaveProperty("inputSchema");
  });

  test("stale hashes from a still-required context family are explicitly invalidated", async () => {
    const packet = await buildNavigatorPacket(status, {
      knownContextIds: ["ctx:skill/blockit-bedrock-entity-mcp@deadbeef0000"],
    });
    expect(packet.context.invalidated_ids).toEqual([
      "ctx:skill/blockit-bedrock-entity-mcp@deadbeef0000",
    ]);
    expect(packet.context.required.some((entry) => entry.id.startsWith("ctx:skill/blockit-bedrock-entity-mcp@"))).toBe(true);
  });

  test("unrelated historical context does not create false invalidation noise", async () => {
    const packet = await buildNavigatorPacket(status, {
      knownContextIds: ["ctx:skill/unrelated@deadbeef0000"],
    });
    expect(packet.context.invalidated_ids).toEqual([]);
  });
});
