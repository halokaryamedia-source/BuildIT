import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const read = (path: string) => readFileSync(path, "utf8");

describe("stable production tool surface", () => {
  test("keeps a stable normal-production union instead of the full internal library", () => {
    const source = read("src/server/stable-tool-surface.ts");
    expect(source).toContain("STABLE_PRODUCTION_UNION");
    expect(source).toContain("stableProductionToolNames");
    expect(source).toContain("metadata.enabled = publicTools.has(name)");
    expect(source).toContain('"manage_project_write_lease"');
    expect(source).toContain('"rebind_active_project_identity"');
    expect(source).toContain('"activate_tool_profile"');
    expect(source).not.toContain("metadata.enabled = true");
  });

  test("texture and animation skills do not instruct manual coordination", () => {
    for (const path of [
      "../engines/shared/skills/blockbench-texture/SKILL.md",
      "../engines/shared/skills/blockbench-animation/SKILL.md",
    ]) {
      const skill = read(path);
      expect(skill).toContain("write ownership are automatic");
      expect(skill).toContain("Never call identity, profile, or lease management");
      expect(skill).not.toContain("→ identity/lease");
      expect(skill).not.toContain("fresh Texture lease");
      expect(skill).not.toContain("fresh Animation lease");
    }
  });
});
