import { describe, expect, test } from "bun:test";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("peer-inspired authoring efficiency routing", () => {
  test("Geometry reuses fresh cohort state and batches deterministic corrections", async () => {
    const router = await source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md");
    expect(router).toMatch(/Known Cubes sharing one deterministic TRANSLATE\/RESIZE intent/i);
    expect(router).toMatch(/derive absolute targets once from fresh state/i);
    expect(router).toContain("modify_cubes_batch");
    expect(router).toMatch(/never loop inspect→modify per Cube/i);
    expect(router).toMatch(/reasoning-layer arithmetic/i);
    expect(router).toMatch(/absolute\/fail-closed/i);
  });

  test("Texturing keeps atlas lifecycle idempotent and avoids the provisional blank default", async () => {
    const skill = await source("../.agents/skills/blockit-bedrock-texturing/SKILL.md");
    expect(skill).toMatch(/blank atlas resolution unknown\s+→ get_project_info once/i);
    expect(skill).toMatch(/Existing base-color atlas → reuse its UUID/i);
    expect(skill).toContain("must therefore **not omit blank Atlas size**");
    expect(skill).toContain("smallest bounded causal correction");
    expect(skill).toContain("fresh affected evidence");
  });

  test("Animation uses one coherent batch transform instead of per-key loops", async () => {
    const skill = await source("../.agents/skills/blockit-bedrock-animation/SKILL.md");
    expect(skill).toMatch(/coherent time\/value cohort transform\s+→ batch_keyframe_operations/i);
    expect(skill).toMatch(/do not loop `manage_keyframes` per key/i);
    expect(skill).toMatch(/Controller\/effect\/graph\/copy-paste tools are conditional/i);
  });
});
