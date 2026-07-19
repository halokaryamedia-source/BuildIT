import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { tools } from "../src/lib/factories";
import {
  normalizeContinuityProfileSnapshot,
  normalizeSessionContinuityPayload,
  SESSION_CONTINUITY_TOOLS,
} from "../src/server/session-continuity-guards";
import { enforceStableToolSurface } from "../src/server/stable-tool-surface";

const read = (path: string) => readFileSync(path, "utf8");

describe("single-session production contract", () => {
  test("keeps a stable production union while profiles remain logical guards", () => {
    tools.__continuity_fixture = {
      name: "__continuity_fixture",
      description: "fixture",
      enabled: true,
      status: "stable",
    };
    enforceStableToolSurface();
    expect(tools.__continuity_fixture.enabled).toBe(false);
    delete tools.__continuity_fixture;

    const stable = read("src/server/stable-tool-surface.ts");
    const profiles = read("src/lib/toolProfiles.ts");
    expect(stable).toContain("STABLE_PRODUCTION_UNION");
    expect(stable).toContain("stableProductionToolNames");
    expect(stable).toContain("metadata.enabled = publicTools.has(name)");
    expect(profiles).toContain("isToolAllowed(name)");
    expect(profiles).toContain("TOOL_PROFILE_BLOCKED");
  });

  test("normalizes runtime and profile snapshots to no-reconnect semantics", () => {
    const profile: Record<string, any> = {
      reconnect_required_after_change: true,
    };
    normalizeContinuityProfileSnapshot(profile);
    expect(profile).toEqual({
      reconnect_required_after_change: false,
      registered_tool_surface: "STABLE_FULL_LIBRARY",
      execution_surface: "ACTIVE_PROFILE_GUARDED",
    });

    const runtime: Record<string, any> = {
      tool_profile: { reconnect_required_after_change: true },
      contract: {},
    };
    normalizeSessionContinuityPayload("get_runtime_status", runtime);
    expect(runtime.tool_profile.reconnect_required_after_change).toBe(false);
    expect(runtime.contract).toMatchObject({
      stable_tool_surface: true,
      profile_changes_require_reconnect: false,
    });
  });

  test("keeps profile activation and every stage transition in the current session", () => {
    const activation: Record<string, any> = {
      changed: true,
      active_profile: "BEDROCK_CUBOID_TEXTURE",
      reconnect_required: true,
    };
    normalizeSessionContinuityPayload("activate_tool_profile", activation);
    expect(activation).toMatchObject({
      reconnect_required: false,
      current_session_continues: true,
      stable_tool_surface: true,
      write_lease_reacquire_required: true,
    });
    expect(activation.next_action).toContain("current MCP session");

    for (const tool of [
      "complete_geometry_stage",
      "complete_stage",
      "reopen_stage_for_revision",
    ]) {
      const transition: Record<string, any> = {
        reconnect_required: true,
        next_action: "Reconnect MCP",
      };
      normalizeSessionContinuityPayload(tool, transition, "START_TEXTURE");
      expect(transition, tool).toMatchObject({
        reconnect_required: false,
        current_session_continues: true,
        stable_tool_surface: true,
        next_action: "START_TEXTURE",
      });
    }
  });

  test("installs continuity after logical profile and context routing guards", () => {
    const source = read("src/server/tools.ts");
    const profiles = source.indexOf("initializeToolProfiles();");
    const stable = source.indexOf("installStableToolSurface();");
    const context = source.indexOf("installStageContextRoutingGuards();");
    const continuity = source.indexOf("installSessionContinuityGuards();");
    expect(stable).toBeGreaterThan(profiles);
    expect(context).toBeGreaterThan(stable);
    expect(continuity).toBeGreaterThan(context);
    for (const tool of SESSION_CONTINUITY_TOOLS) {
      expect(source).toContain("installSessionContinuityGuards");
      expect(typeof tool).toBe("string");
    }
  });

  test("documents one plugin load, one Codex session, and one user acceptance test", () => {
    const agents = read("../AGENTS.md");
    const bootstrap = read("../engines/codex/BOOTSTRAP.md");
    const contract = read("../engines/shared/workflow/TOOL_PROFILE_CONTRACT.md");
    const acceptance = read("../engines/codex/FINAL_ACCEPTANCE_TEST.md");

    for (const source of [agents, bootstrap, contract]) {
      expect(source).toContain("same MCP session");
      expect(source).toContain("same Codex session");
    }
    expect(acceptance).toContain("one final end-to-end test");
    expect(acceptance).toContain("Load the final `mcp-blockbench/dist/mcp.js` once");
    expect(acceptance).toContain("Start one Codex session");
    expect(acceptance).toContain("Create a new Black Rhinoceros model from zero");
    expect(acceptance).toContain("prebuilt_model_copied: false");
  });

  test("failed transition reconciliation never requests a reconnect", () => {
    const reconciliation = read(
      "src/server/profile-state-reconciliation-guards.ts"
    );
    expect(reconciliation).toContain(
      "state.mcp.profile_reconnect_required = false"
    );
    expect(reconciliation).toContain("STABLE_FULL_LIBRARY");
    expect(reconciliation).not.toContain(
      "state.mcp.profile_reconnect_required = true"
    );
  });
});
