import { describe, expect, test } from "bun:test";
import { buildNavigatorPacket, resolveDevelopmentIntent } from "@/gateway/navigator";
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

describe("BlockIT Navigator development intent", () => {
  test("animation quality wording routes directly to animation owners", () => {
    const result = resolveDevelopmentIntent("animasi keyframe terlalu kaku");
    expect(result).toMatchObject({
      task_class: "MCP_DEVELOPMENT",
      domain: "ANIMATION",
      confidence: "STRONG",
    });
    expect(result.source_owners.some((entry) => entry.source === "mcp/server/tools/animation-controller.ts")).toBe(true);
    expect(result.required_context_paths).toContain(".agents/skills/blockit-bedrock-animation/SKILL.md");
  });

  test("build sync wording stays out of authoring owners", () => {
    const result = resolveDevelopmentIntent("dev:sync stale build setelah plugin reload");
    expect(result.domain).toBe("BUILD_SYNC");
    expect(result.source_owners.map((entry) => entry.source)).toEqual([
      "mcp/build/index.ts",
      "mcp/build/watch-policy.ts",
      "mcp/scripts/deploy-local.ts",
    ]);
    expect(result.required_context_paths).not.toContain(".agents/skills/blockbench-bedrock-modelling/SKILL.md");
  });

  test("ambiguous equal-score wording refuses to invent a single domain", () => {
    const result = resolveDevelopmentIntent("geometry texture");
    expect(result.domain).toBe("UNRESOLVED");
    expect(result.confidence).toBe("AMBIGUOUS");
    expect(result.source_owners.length).toBeGreaterThan(0);
  });

  test("unknown development wording stays unresolved and bounded", () => {
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

  test("development packet skips workspace parsing and authoring Skill retransmission", async () => {
    const packet = await buildNavigatorPacket(status, {
      taskMode: "MCP_DEVELOPMENT",
      taskIntent: "gateway capability catalog bermasalah",
      knownContextIds: ["ctx:skill/blockit-bedrock-entity-mcp@old"],
      workspacePath: "/path/that/must/not/be/read",
    });

    expect(packet.mode).toBe("MCP_DEVELOPMENT");
    expect(packet.development?.domain).toBe("GATEWAY");
    expect(packet.workspace.available).toBe(false);
    expect(packet.context.required).toEqual([]);
    expect(packet.context.optional).toEqual([]);
    expect(packet.context.invalidated_ids).toEqual([]);
    expect(packet.task_context_id).toMatch(/^task:[a-f0-9]{20}$/);
    expect(JSON.stringify(packet).length).toBeLessThan(6000);
  });
});
