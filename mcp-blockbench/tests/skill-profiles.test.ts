import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";

const root = "..";
const config = JSON.parse(
  readFileSync(`${root}/engines/shared/skills/skill-profiles.json`, "utf8")
) as Record<string, any>;
const productionSkills = [
  "blockbench-production",
  "blockbench-geometry",
  "blockbench-texture",
  "blockbench-animation",
  "blockbench-validation",
];

const hash = (path: string) =>
  createHash("sha256").update(readFileSync(path)).digest("hex");

describe("production skill orchestration", () => {
  test("uses five canonical production skills and at most two per stage", () => {
    expect(config.production_skills).toEqual(productionSkills);
    expect(config.max_production_skills_loaded).toBe(2);

    for (const [profileId, profile] of Object.entries(config.profiles) as Array<
      [string, any]
    >) {
      expect(profile.required.length, profileId).toBeLessThanOrEqual(2);
      expect(profile.max_loaded, profileId).toBeLessThanOrEqual(2);
      expect(profile.required).toContain("blockbench-production");
    }
  });

  test("maps every production stage to exactly one stage skill", () => {
    expect(config.profiles.GEOMETRY.required).toEqual([
      "blockbench-production",
      "blockbench-geometry",
    ]);
    expect(config.profiles.TEXTURE.required).toEqual([
      "blockbench-production",
      "blockbench-texture",
    ]);
    expect(config.profiles.ANIMATION.required).toEqual([
      "blockbench-production",
      "blockbench-animation",
    ]);
    expect(config.profiles.FINAL_VALIDATION.required).toEqual([
      "blockbench-production",
      "blockbench-validation",
    ]);
  });

  test("skips Animation skill when animation is not required", () => {
    expect(config.state_map.TEXTURE_APPROVED).toBe(
      "ANIMATION_OR_FINAL_VALIDATION"
    );
    expect(config.conditional_profiles.ANIMATION_OR_FINAL_VALIDATION).toEqual({
      condition: "workflow.animation_required",
      when_true: "ANIMATION",
      when_false: "FINAL_VALIDATION",
    });
    expect(config.state_map.ANIMATION_SKIPPED).toBe("FINAL_VALIDATION");
  });

  test("canonical skills exist and host adapters match", () => {
    for (const name of productionSkills) {
      const canonical = `${root}/engines/shared/skills/${name}/SKILL.md`;
      expect(existsSync(canonical), canonical).toBe(true);
      for (const adapterRoot of [".agents/skills", ".codex/skills"]) {
        const adapter = `${root}/${adapterRoot}/${name}/SKILL.md`;
        expect(existsSync(adapter), adapter).toBe(true);
        expect(hash(adapter), adapter).toBe(hash(canonical));
      }
    }
  });

  test("deprecated production skill folders are removed", () => {
    for (const name of config.deprecated_skill_names) {
      expect(existsSync(`${root}/.agents/skills/${name}`), name).toBe(false);
      expect(existsSync(`${root}/.codex/skills/${name}`), name).toBe(false);
    }
  });

  test("repository development excludes production skills", () => {
    expect(config.repository_development.forbidden_production_skills).toEqual(
      productionSkills
    );
  });
});
