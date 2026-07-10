import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

function readJson(path: string) {
  return JSON.parse(readFileSync(path, "utf8")) as Record<string, any>;
}

describe("Codex local workflow configuration", () => {
  test("state template starts reference-ready with canonical connection state", () => {
    const state = readJson("Engine/codex/state.template.json");

    expect(state.schema_version).toBe("2.1");
    expect(state.workflow.state).toBe("REFERENCE_READY");
    expect(state.workflow.active_stage).toBe("GEOMETRY");
    expect(state.workflow.next_action).toBe("SYNC_LOCAL_STACK");
    expect(state.workflow.stage_records.GEOMETRY.status).toBe("NOT_STARTED");
    expect(state.workflow.stage_records.TEXTURE.status).toBe("LOCKED");
    expect(state.validation.status).toBe("PENDING_BUILD");
    expect(state.mcp.server_key).toBe("blockbench");
    expect(state.mcp.canonical_url).toBe("http://localhost:3000/bb-mcp");
    expect(state.mcp.connection_status).toBe("UNVERIFIED");
    expect(state.checkpoints.geometry_approved).toBeNull();
  });

  test("canonical connection profile forbids discovery drift", () => {
    const profile = readJson("Engine/codex/connection-profile.json");

    expect(profile.connection_id).toBe("blockbench");
    expect(profile.canonical_url).toBe("http://localhost:3000/bb-mcp");
    expect(profile.strict_endpoint).toBe(true);
    expect(profile.allow_port_scan).toBe(false);
    expect(profile.codex.server_key).toBe("blockbench");
    expect(profile.blockbench.required_settings.mcp_auto_port).toBe(false);
    expect(profile.blockbench.required_settings.mcp_session_timeout_minutes).toBe(30);
    expect(profile.required_common_tools).toContain("get_runtime_status");
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

  test("runtime readiness tool is registered for MCP and docs", () => {
    const runtime = readFileSync("src/server/tools/runtime.ts", "utf8");
    const registry = readFileSync("src/server/tools.ts", "utf8");
    const docsManifest = readFileSync("build/docs-manifest.ts", "utf8");

    expect(runtime).toContain('name: "get_runtime_status"');
    expect(runtime).toContain("structuredContent");
    expect(runtime).toContain("CANONICAL_URL");
    expect(registry).toContain("registerRuntimeTools");
    expect(docsManifest).toContain("runtimeToolDocs");
    expect(docsManifest).toContain('category: "Runtime"');
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

  test("all four user-visible stage profiles exist", () => {
    const config = readJson("Engine/codex/stage-profiles.json");
    const profiles = config.profiles;

    expect(config.schema_version).toBe("2.0");
    expect(Object.keys(profiles).sort()).toEqual(
      ["ANIMATION", "FINAL_VALIDATION", "GEOMETRY", "TEXTURE"].sort()
    );
    expect(profiles.ANIMATION.optional).toBe(true);
    expect(profiles.FINAL_VALIDATION.automatic_local_fix_limit).toBe(2);
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
    expect(bootstrap).toContain("One-issue-per-cycle applies only to revisions");
    expect(bootstrap).toContain("save_project_checkpoint");
    expect(bootstrap).toContain("capture_standard_views");
  });

  test("state, evidence, and recovery contracts are linked", () => {
    const bootstrap = readFileSync("Engine/codex/BOOTSTRAP.md", "utf8");
    const stateMachine = readFileSync("Engine/codex/STATE_MACHINE.md", "utf8");
    const evidence = readFileSync("Engine/codex/EVIDENCE_CONTRACT.md", "utf8");
    const checkpoint = readFileSync("Engine/codex/CHECKPOINT_RECOVERY.md", "utf8");

    expect(bootstrap).toContain("STATE_MACHINE.md");
    expect(bootstrap).toContain("EVIDENCE_CONTRACT.md");
    expect(bootstrap).toContain("CHECKPOINT_RECOVERY.md");
    expect(stateMachine).toContain("accepted areas are immutable by default");
    expect(evidence).toContain("geometry_front.png");
    expect(checkpoint).toContain("80_validation_pass.bbmodel");
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
