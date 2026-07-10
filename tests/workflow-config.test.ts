import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { toolManifest } from "../build/docs-manifest";

function readJson(path: string) {
  return JSON.parse(readFileSync(path, "utf8")) as Record<string, any>;
}

const registeredToolNames = new Set(
  toolManifest.flatMap((category) => category.tools.map((tool) => tool.name))
);

describe("Codex local workflow configuration", () => {
  test("state template starts reference-ready with canonical connection and Geometry profile", () => {
    const state = readJson("Engine/codex/state.template.json");

    expect(state.schema_version).toBe("2.1");
    expect(state.workflow.state).toBe("REFERENCE_READY");
    expect(state.workflow.active_stage).toBe("GEOMETRY");
    expect(state.workflow.next_action).toBe("RUN_CONNECTION_SYNC_AND_PREFLIGHT");
    expect(state.workflow.stage_records.GEOMETRY.status).toBe("NOT_STARTED");
    expect(state.workflow.stage_records.TEXTURE.status).toBe("LOCKED");
    expect(state.validation.status).toBe("PENDING_BUILD");
    expect(state.mcp.server_key).toBe("blockbench");
    expect(state.mcp.canonical_url).toBe("http://localhost:3000/bb-mcp");
    expect(state.mcp.connection_status).toBe("NOT_RUN");
    expect(state.mcp.active_tool_profile).toBe("BEDROCK_CUBOID_GEOMETRY");
    expect(state.checkpoints.geometry_approved).toBeNull();
  });

  test("canonical connection profile forbids discovery drift and requires profile controls", () => {
    const profile = readJson("Engine/codex/connection-profile.json");

    expect(profile.connection_id).toBe("blockbench");
    expect(profile.canonical_url).toBe("http://localhost:3000/bb-mcp");
    expect(profile.strict_endpoint).toBe(true);
    expect(profile.allow_port_scan).toBe(false);
    expect(profile.codex.server_key).toBe("blockbench");
    expect(profile.blockbench.required_settings.mcp_auto_port).toBe(false);
    expect(profile.blockbench.required_settings.mcp_session_timeout_minutes).toBe(30);
    expect(profile.required_common_tools).toContain("get_runtime_status");
    expect(profile.required_common_tools).toContain("get_tool_profile");
    expect(profile.required_common_tools).toContain("activate_tool_profile");
    expect(profile.default_tool_profile).toBe("BEDROCK_CUBOID_GEOMETRY");
  });

  test("Blockbench source enforces the canonical runtime endpoint", () => {
    const index = readFileSync("src/index.ts", "utf8");
    const settings = readFileSync("src/ui/settings.ts", "utf8");
    const ui = readFileSync("src/ui/index.ts", "utf8");

    expect(index).toContain("const CANONICAL_MCP_PORT = 3000");
    expect(index).toContain('const CANONICAL_MCP_ENDPOINT = "/bb-mcp"');
    expect(index).toContain("const autoPort = false");
    expect(index).toContain("MINIMUM_SESSION_TIMEOUT_MINUTES = 30");
    expect(settings).toContain('new Setting("mcp_auto_port"');
    expect(settings).toContain("value: false");
    expect(settings).toContain('new Setting("mcp_session_timeout"');
    expect(settings).toContain("value: 30");
    expect(ui).toContain("[mcp_servers.blockbench]");
    expect(ui).toContain('serverKey(): string {\n          return "blockbench";');
  });

  test("runtime readiness and tool profile controls are registered for MCP and docs", () => {
    const runtime = readFileSync("src/server/tools/runtime.ts", "utf8");
    const registry = readFileSync("src/server/tools.ts", "utf8");
    const docsManifest = readFileSync("build/docs-manifest.ts", "utf8");
    const profileRuntime = readFileSync("src/lib/toolProfiles.ts", "utf8");

    expect(runtime).toContain('name: "get_runtime_status"');
    expect(runtime).toContain('name: "get_tool_profile"');
    expect(runtime).toContain('name: "activate_tool_profile"');
    expect(runtime).toContain("tool_profile: toolProfile");
    expect(runtime).toContain("structuredContent");
    expect(registry).toContain("registerRuntimeTools");
    expect(registry).toContain("initializeToolProfiles");
    expect(profileRuntime).toContain("TOOL_PROFILE_BLOCKED");
    expect(profileRuntime).toContain("applyToolExposure");
    expect(docsManifest).toContain("runtimeToolDocs");
    expect(docsManifest).toContain('category: "Runtime"');
  });

  test("exact tool profiles reference registered tools and keep normal profiles compact", () => {
    const config = readJson("Engine/codex/tool-profiles.json");
    const core = config.core_tools as string[];

    expect(config.default_profile).toBe("BEDROCK_CUBOID_GEOMETRY");
    expect(core).toEqual([
      "get_runtime_status",
      "get_project_info",
      "get_tool_profile",
      "activate_tool_profile",
    ]);

    for (const toolName of core) {
      expect(registeredToolNames.has(toolName)).toBe(true);
    }

    for (const [profileId, profile] of Object.entries(config.profiles) as Array<
      [string, { allowed_tools?: string[]; include_all?: boolean }]
    >) {
      if (profile.include_all) continue;
      const exposed = new Set([...core, ...(profile.allowed_tools ?? [])]);
      expect(exposed.size, `${profileId} should stay compact`).toBeLessThanOrEqual(30);
      for (const toolName of exposed) {
        expect(
          registeredToolNames.has(toolName),
          `${profileId} references missing tool ${toolName}`
        ).toBe(true);
      }
      for (const forbidden of config.forbidden_in_normal_profiles as string[]) {
        expect(exposed.has(forbidden), `${profileId} exposes ${forbidden}`).toBe(false);
      }
    }
  });

  test("Bedrock cuboid profiles exclude PBR, mesh UV, armatures, Hytale, UI automation, and eval", () => {
    const config = readJson("Engine/codex/tool-profiles.json");
    const normalProfileIds = [
      "BEDROCK_CUBOID_GEOMETRY",
      "BEDROCK_CUBOID_TEXTURE",
      "BEDROCK_CUBOID_ANIMATION",
      "FINAL_VALIDATION_READONLY",
      "GEOMETRY_LOCAL_REPAIR",
      "TEXTURE_LOCAL_REPAIR",
      "ANIMATION_LOCAL_REPAIR",
    ];
    const forbidden = new Set(config.forbidden_in_normal_profiles as string[]);

    for (const profileId of normalProfileIds) {
      const names = new Set([
        ...(config.core_tools as string[]),
        ...(config.profiles[profileId].allowed_tools as string[]),
      ]);
      for (const toolName of forbidden) {
        expect(names.has(toolName), `${profileId} exposes ${toolName}`).toBe(false);
      }
    }

    const texture = new Set(config.profiles.BEDROCK_CUBOID_TEXTURE.allowed_tools);
    expect(texture.has("set_cube_face_uv")).toBe(true);
    expect(texture.has("get_uv_layout")).toBe(true);
    expect(texture.has("set_mesh_uv")).toBe(false);
    expect(texture.has("gradient_tool")).toBe(false);
    expect(texture.has("create_pbr_material")).toBe(false);

    const animation = new Set(config.profiles.BEDROCK_CUBOID_ANIMATION.allowed_tools);
    expect(animation.has("bone_rigging")).toBe(true);
    expect(animation.has("add_armature")).toBe(false);
    expect(animation.has("set_vertex_weight")).toBe(false);
  });

  test("stage profiles map to exact stage and repair tool profiles", () => {
    const stageConfig = readJson("Engine/codex/stage-profiles.json");
    const toolConfig = readJson("Engine/codex/tool-profiles.json");
    const profiles = stageConfig.profiles;

    expect(stageConfig.schema_version).toBe("2.1");
    expect(Object.keys(profiles).sort()).toEqual(
      ["ANIMATION", "FINAL_VALIDATION", "GEOMETRY", "TEXTURE"].sort()
    );
    expect(profiles.GEOMETRY.tool_profile_id).toBe("BEDROCK_CUBOID_GEOMETRY");
    expect(profiles.TEXTURE.tool_profile_id).toBe("BEDROCK_CUBOID_TEXTURE");
    expect(profiles.ANIMATION.tool_profile_id).toBe("BEDROCK_CUBOID_ANIMATION");
    expect(profiles.FINAL_VALIDATION.tool_profile_id).toBe("FINAL_VALIDATION_READONLY");
    expect(profiles.GEOMETRY.repair_tool_profile_id).toBe("GEOMETRY_LOCAL_REPAIR");
    expect(profiles.TEXTURE.repair_tool_profile_id).toBe("TEXTURE_LOCAL_REPAIR");
    expect(profiles.ANIMATION.repair_tool_profile_id).toBe("ANIMATION_LOCAL_REPAIR");

    for (const profile of Object.values(profiles) as Array<Record<string, string>>) {
      expect(toolConfig.profiles[profile.tool_profile_id]).toBeDefined();
      if (profile.repair_tool_profile_id) {
        expect(toolConfig.profiles[profile.repair_tool_profile_id]).toBeDefined();
      }
    }
  });

  test("bootstrap uses one readiness script before asset preflight", () => {
    const bootstrap = readFileSync("Engine/codex/BOOTSTRAP.md", "utf8");
    const contract = readFileSync("Engine/codex/CONNECTION_CONTRACT.md", "utf8");
    const script = readFileSync(
      "Engine/codex/scripts/sync-local-stack.ps1",
      "utf8"
    );

    expect(bootstrap).toContain("sync-local-stack.ps1");
    expect(bootstrap).toContain("reports/connection.json");
    expect(bootstrap).toContain("Do not scan ports");
    expect(contract).toContain("http://localhost:3000/bb-mcp");
    expect(contract).toContain("get_runtime_status");
    expect(script).toContain("mcp_servers.$Key");
    expect(script).toContain('method = "tools/list"');
    expect(script).toContain('name = "get_runtime_status"');
    expect(script).toContain('Method = "Delete"');
  });

  test("Geometry uses stable five-view evidence filenames", () => {
    const geometry = readJson(
      "Engine/codex/stage-profiles.json"
    ).profiles.GEOMETRY;

    expect(geometry.required_evidence).toEqual({
      front: "evidence/geometry/geometry_front.png",
      left_side: "evidence/geometry/geometry_left.png",
      back: "evidence/geometry/geometry_back.png",
      top_footprint: "evidence/geometry/geometry_top.png",
      front_left_3_4: "evidence/geometry/geometry_front_left_3_4.png",
      report: "evidence/geometry/geometry_report.json",
    });
    expect(geometry.review_checkpoint).toBe(
      "checkpoints/10_geometry_review.bbmodel"
    );
    expect(geometry.approved_checkpoint).toBe(
      "checkpoints/20_geometry_approved.bbmodel"
    );
  });

  test("bootstrap defines one review after each user-visible stage", () => {
    const bootstrap = readFileSync("Engine/codex/BOOTSTRAP.md", "utf8");

    expect(bootstrap).toContain("GEOMETRY_REVIEW");
    expect(bootstrap).toContain("TEXTURE_REVIEW");
    expect(bootstrap).toContain("ANIMATION_REVIEW");
    expect(bootstrap).toContain("FINAL_REVIEW");
    expect(bootstrap).toContain("one-issue rule applies to revisions");
    expect(bootstrap).toContain("save_project_checkpoint");
    expect(bootstrap).toContain("capture_standard_views");
  });

  test("state, evidence, recovery, and profile contracts are linked", () => {
    const bootstrap = readFileSync("Engine/codex/BOOTSTRAP.md", "utf8");
    const stateMachine = readFileSync("Engine/codex/STATE_MACHINE.md", "utf8");
    const evidence = readFileSync("Engine/codex/EVIDENCE_CONTRACT.md", "utf8");
    const checkpoint = readFileSync("Engine/codex/CHECKPOINT_RECOVERY.md", "utf8");
    const profileContract = readFileSync("Engine/codex/TOOL_PROFILE_CONTRACT.md", "utf8");

    expect(bootstrap).toContain("STATE_MACHINE.md");
    expect(bootstrap).toContain("EVIDENCE_CONTRACT.md");
    expect(bootstrap).toContain("CHECKPOINT_RECOVERY.md");
    expect(stateMachine).toContain("accepted areas are immutable by default");
    expect(evidence).toContain("geometry_front.png");
    expect(checkpoint).toContain("80_validation_pass.bbmodel");
    expect(profileContract).toContain("activate_tool_profile");
    expect(profileContract).toContain("TOOL_PROFILE_BLOCKED");
  });

  test("new reference package does not require numbered sheets", () => {
    const checklist = readFileSync(
      "SourceDocument/modeling/reference-package-pass-fail-checklist.md",
      "utf8"
    );

    expect(checklist).toContain("PRODUCTION_CONTEXT.md");
    expect(checklist).toContain("<asset>_reference_visual.png");
    expect(checklist).toContain("Legacy numbered reference sheets are not required");
  });

  test("source exposes persistent checkpoint and standard capture tools", () => {
    const exportTools = readFileSync("src/server/tools/export.ts", "utf8");
    const cameraTools = readFileSync("src/server/tools/camera.ts", "utf8");

    expect(exportTools).toContain('name: "save_project_checkpoint"');
    expect(exportTools).toContain("expected_project_uuid");
    expect(cameraTools).toContain('name: "capture_standard_views"');
    expect(cameraTools).toContain("front_left_3_4");
  });
});
