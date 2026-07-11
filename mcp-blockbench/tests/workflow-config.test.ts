import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const readJson = (path: string) =>
  JSON.parse(readFileSync(path, "utf8")) as Record<string, any>;

describe("workflow configuration", () => {
  test("state starts reference-ready with canonical paths", () => {
    const state = readJson("../engines/shared/templates/state.template.json");
    expect(state.workflow.state).toBe("REFERENCE_READY");
    expect(state.workflow.active_stage).toBe("GEOMETRY");
    expect(state.mcp.active_tool_profile).toBe("BEDROCK_CUBOID_GEOMETRY");
    expect(state.reference.path).toContain("workspace/sessions/");
  });

  test("connection uses one fixed endpoint", () => {
    const profile = readJson("../engines/codex/connection-profile.json");
    expect(profile.canonical_url).toBe("http://localhost:3000/bb-mcp");
    expect(profile.allow_port_scan).toBe(false);
    expect(profile.codex.server_key).toBe("blockbench");
    expect(profile.tool_profile_contract).toBe(
      "engines/shared/profiles/tool-profiles.json"
    );
  });

  test("four user-visible stage profiles remain singular", () => {
    const stages = readJson(
      "../engines/shared/profiles/stage-profiles.json"
    ).profiles;
    expect(Object.keys(stages).sort()).toEqual(
      ["ANIMATION", "FINAL_VALIDATION", "GEOMETRY", "TEXTURE"].sort()
    );
  });
});
