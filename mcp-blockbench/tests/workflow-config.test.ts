import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const readJson = (path: string) =>
  JSON.parse(readFileSync(path, "utf8")) as Record<string, any>;

describe("workflow configuration", () => {
  test("state starts reference-ready for automatic project creation in one session", () => {
    const state = readJson("../engines/shared/templates/state.template.json");
    expect(state.schema_version).toBe("2.4");
    expect(state.workflow.state).toBe("REFERENCE_READY");
    expect(state.workflow.active_stage).toBe("GEOMETRY");
    expect(state.workflow.next_action).toBe("CREATE_PROJECT");
    expect(state.mcp.active_tool_profile).toBe("BEDROCK_CUBOID_GEOMETRY");
    expect(state.mcp.profile_reconnect_required).toBe(false);
    expect(state.mcp.stable_tool_surface).toBe(true);
    expect(state.mcp.registered_tool_surface).toBe("STABLE_PRODUCTION_UNION");
    expect(state.mcp.execution_surface).toBe("ACTIVE_PROFILE_GUARDED");
    expect(state.mcp.automatic_identity_reconciliation).toBe(true);
    expect(state.mcp.automatic_write_ownership).toBe(true);
    expect(state.mcp.manual_identity_sync_required).toBe(false);
    expect(state.mcp.manual_profile_activation_required).toBe(false);
    expect(state.mcp.manual_write_lease_required).toBe(false);
    expect(state.reference.path).toContain("workspace/active/<asset_id>/mcp/");
    expect(state.project.save_path).toBe(
      "workspace/active/<asset_id>/blockbench/<asset_id>.bbmodel"
    );
  });

  test("connection keeps the fixed endpoint while setup and coordination are automatic", () => {
    const profile = readJson("../engines/codex/connection-profile.json");
    expect(profile.canonical_url).toBe("http://localhost:3000/bb-mcp");
    expect(profile.allow_port_scan).toBe(false);
    expect(profile.codex.server_key).toBe("blockbench");
    expect(profile.required_common_tools).toEqual([
      "get_runtime_status",
      "get_project_info",
      "get_stage_context",
      "create_project",
    ]);
    expect(profile.diagnostic_only_tools).toContain(
      "manage_project_write_lease"
    );
    expect(profile.normal_workflow).toMatchObject({
      manual_workspace_setup_required: false,
      manual_identity_sync_required: false,
      manual_profile_activation_required: false,
      manual_write_lease_required: false,
      registered_surface: "STABLE_PRODUCTION_UNION",
    });
    expect(profile.workspace.bootstrap_source).toContain(
      "ChatGPT Reference Studio"
    );
    expect(profile.tool_profile_contract).toBe(
      "engines/shared/profiles/tool-profiles.json"
    );
    expect(profile.workspace.index).toBe("workspace/workspace.json");
    expect(profile.workspace.blockbench_files).toContain("/blockbench/");
    expect(profile.workspace.mcp_files).toContain("/mcp/");
  });

  test("four user-visible stage profiles remain singular and one-session", () => {
    const config = readJson(
      "../engines/shared/profiles/stage-profiles.json"
    );
    expect(config.schema_version).toBe("3.6");
    expect(Object.keys(config.profiles).sort()).toEqual(
      ["ANIMATION", "FINAL_VALIDATION", "GEOMETRY", "TEXTURE"].sort()
    );
    expect(config.global.skill_profile_contract).toBe(
      "engines/shared/skills/skill-profiles.json"
    );
    expect(config.global.max_loaded_production_skills).toBe(2);
    expect(config.global.registered_tool_surface_policy).toBe(
      "stable_production_union_profile_guarded"
    );
    expect(config.global.profile_transition_policy).toBe(
      "automatic_stage_transition_same_session"
    );
    expect(config.global.stage_transition_reconnect_required).toBe(false);
    expect(config.global.codex_session_restart_required).toBe(false);
    for (const stage of Object.keys(config.profiles)) {
      expect(config.profiles[stage].skill_profile_id).toBe(stage);
      expect(config.profiles[stage].identity_reconciliation).toBe(
        "AUTOMATIC_ON_NEXT_MUTATION"
      );
    }
  });
});
