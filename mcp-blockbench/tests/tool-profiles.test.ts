import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { toolManifest } from "../build/docs-manifest";

const config = JSON.parse(readFileSync("engines/shared/profiles/tool-profiles.json", "utf8"));
const registered = new Set(toolManifest.flatMap((group) => group.tools.map((tool) => tool.name)));

describe("exact MCP tool profiles", () => {
  test("all normal profile tools exist and stay compact", () => {
    for (const [profileId, profile] of Object.entries(config.profiles) as Array<[string, any]>) {
      if (profile.include_all) continue;
      const exposed = new Set([...config.core_tools, ...(profile.allowed_tools ?? [])]);
      expect(exposed.size, profileId).toBeLessThanOrEqual(30);
      for (const tool of exposed) expect(registered.has(tool), `${profileId}: ${tool}`).toBe(true);
    }
  });

  test("normal profiles hide unsafe or unrelated capabilities", () => {
    for (const [profileId, profile] of Object.entries(config.profiles) as Array<[string, any]>) {
      if (profile.include_all) continue;
      const exposed = new Set([...config.core_tools, ...(profile.allowed_tools ?? [])]);
      for (const blocked of config.forbidden_in_normal_profiles) {
        expect(exposed.has(blocked), `${profileId} exposes ${blocked}`).toBe(false);
      }
    }
  });
});
