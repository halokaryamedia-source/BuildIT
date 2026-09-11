import { describe, expect, test } from "bun:test";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("peer-inspired authoring efficiency routing", () => {
  test("Geometry reuses fresh cohort state and batches deterministic corrections", async () => {
    const modelling = await source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md");
    expect(modelling).toMatch(/deterministic.*TRANSLATE|TRANSLATE.*deterministic/i);
    expect(modelling).toMatch(/fresh state/i);
    expect(modelling).toContain("manage_cubes");
    expect(modelling).toMatch(/batch|cohort/i);
    expect(modelling).toMatch(/absolute|fail-closed/i);
  });

  test("Texturing keeps atlas lifecycle idempotent and avoids the provisional blank default", async () => {
    const skill = await source("../.agents/skills/blockit-bedrock-texturing/SKILL.md");
    expect(skill).toMatch(/blank atlas resolution unknown\s+→ get_project_info once/i);
    expect(skill).toMatch(/Pin atlas UUID[^\n]*texture_id/i);
    expect(skill).toMatch(/\breuse (?:existing atlas|its) UUID\b/i);
    expect(skill).toContain("not omit blank Atlas size");
    expect(skill).toContain("smallest bounded causal correction");
    expect(skill).toContain("fresh affected evidence");
  });

  test("Animation uses one coherent batch transform instead of per-key loops", async () => {
    const skill = await source("../.agents/skills/blockit-bedrock-animation/SKILL.md");
    expect(skill).toMatch(/manage_animation_timeline \(operation: keyframes\|graph\|timeline\|batch\|copy_paste\)/i);
    expect(skill).toMatch(/`batch`.*coherent cohort.*not loops per key/i);
    expect(skill).toMatch(/Controller\/effect\/graph\/copy-paste.*conditional/i);
  });
});
