import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const readJson = (path: string) =>
  JSON.parse(readFileSync(path, "utf8")) as Record<string, any>;

describe("workflow configuration", () => {
  test("state starts reference-ready with canonical paths", () => {
    const state = readJson("../engines/shared/templates/state.template.json");
    expect(state.workflow.state).toBe("REFERENCE_READY");
    expect(state.workflow.active_stage).toBe("GEOMETRY");
    expect(state.workflow.next_action).toContain("ACQUIRE_WRITE_LEASE");
    expect(state.mcp.active_tool_profile).toBe("BEDROCK_CUBOID_GEOMETRY");
    expect(state.reference.path).toContain("workspace/sessions/");
  });

  test("connection uses one fixed endpoint and one write-lease capability", () => {
    const profile = readJson("../engines/codex/connection-profile.json");
    expect(profile.canonical_url).toBe("http://localhost:3000/bb-mcp");
    expect(profile.allow_port_scan).toBe(false);
    expect(profile.codex.server_key).toBe("blockbench");
    expect(profile.required_common_tools).toContain("manage_project_write_lease");
    expect(profile.tool_profile_contract).toBe(
      "engines/shared/profiles/tool-profiles.json"
    );
  });

  test("four user-visible stage profiles remain singular", () => {
    const config = readJson(
      "../engines/shared/profiles/stage-profiles.json"
    );
    expect(Object.keys(config.profiles).sort()).toEqual(
      ["ANIMATION", "FINAL_VALIDATION", "GEOMETRY", "TEXTURE"].sort()
    );
    expect(config.global.skill_profile_contract).toBe(
      "engines/shared/skills/skill-profiles.json"
    );
    expect(config.global.max_loaded_production_skills).toBe(2);
    for (const stage of Object.keys(config.profiles)) {
      expect(config.profiles[stage].skill_profile_id).toBe(stage);
    }
  });
});
