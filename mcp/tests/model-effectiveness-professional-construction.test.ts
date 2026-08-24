import { describe, expect, test } from "bun:test";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

function lower(text: string): string {
  return text.toLowerCase();
}

describe("model creation effectiveness — professional construction without presets", () => {
  test("professional construction stays reasoning-based rather than preset-based", async () => {
    const [modelling, workflow, geometry, flow] = await Promise.all([
      source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md"),
      source("prompts/bedrock_entity_workflow.md"),
      source("../docs/foundation/05-geometry-standard.md"),
      source("../docs/knowledge/flow.md"),
    ]);

    for (const text of [modelling, workflow, geometry, flow]) {
      expect(lower(text)).toContain("not presets");
      expect(lower(text)).toContain("transform ownership");
      expect(lower(text)).toContain("primary blockout");
      expect(lower(text)).toContain("identity-weighted");
    }

    expect(geometry).toContain("thin or zero-thickness plane-like Cube");
    expect(geometry).toContain("layered/inflated shell");
    expect(geometry).toContain("linked meaningful segments");
    expect(geometry).toContain("unit-Cube staircasing");
    expect(geometry).toContain("Locator intent");
    expect(geometry).toContain("positive-only or fixed-value rule");
  });

  test("transform ownership distinguishes local Cube transforms from shared Group/Bone transforms", async () => {
    const [modelling, workflow, geometry] = await Promise.all([
      source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md"),
      source("prompts/bedrock_entity_workflow.md"),
      source("../docs/foundation/05-geometry-standard.md"),
    ]);

    expect(modelling).toContain("Group/Bone-owned");
    for (const text of [workflow, geometry]) {
      expect(text).toContain("Cube-owned");
      expect(text).toContain("Group/Bone");
    }
    expect(geometry).toContain("Group/Bone-owned transform");
    expect(geometry).toContain("Do not create hierarchy solely to increase depth or node count");
  });

  test("form-defining hierarchy may be primary while neutral organization remains downstream", async () => {
    const [modelling, workflow, geometry, flow] = await Promise.all([
      source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md"),
      source("prompts/bedrock_entity_workflow.md"),
      source("../docs/foundation/05-geometry-standard.md"),
      source("../docs/knowledge/flow.md"),
    ]);

    for (const text of [modelling, workflow, geometry, flow]) {
      const normalized = lower(text);
      expect(normalized).toContain("primary");
      expect(normalized).toContain("hierarchy");
      expect(normalized).toContain("form");
      expect(normalized).toContain("contact");
      expect(normalized).toContain("articulation");
    }

    expect(geometry).toContain("Primary hierarchy timing");
    expect(flow).toContain("REQUIRED PRIMARY GROUPS/PIVOTS");
    expect(lower(flow)).toContain("neutral organization");
  });

  test("marketplace-grade construction patterns stay in modelling judgement", async () => {
    const modelling = await source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md");

    expect(modelling).toContain("Marketplace-Grade Construction Patterns");
    expect(modelling).toContain("zero-span axis is valid");
    expect(modelling).toContain("Inflate layering");
    expect(modelling).toContain("negative inflate");
    expect(modelling).toContain("small per-link rotation");
    expect(modelling).toContain("never unit-Cube staircasing");
    expect(modelling).toContain("mirror the Cube with `mirror_uv=true`");
    expect(modelling).toContain("Locators** own non-visible anchors");
    expect(modelling).toContain("Rig depth follows articulation need");
  });

  test("professional samples never become callable presets, profiles, or fixture anatomy", async () => {
    const [profile, cubes, element, modelling, workflow] = await Promise.all([
      source("lib/registrationProfile.ts"),
      source("server/tools/cubes.ts"),
      source("server/tools/element.ts"),
      source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md"),
      source("prompts/bedrock_entity_workflow.md"),
    ]);

    const runtime = `${profile}\n${cubes}\n${element}`;
    for (const forbidden of [
      "professional_preset",
      "construction_preset",
      "asset_class_profile",
      "detail_density_profile",
      "professional_planner",
    ]) {
      expect(runtime).not.toContain(forbidden);
    }

    const activeReasoning = lower(`${modelling}\n${workflow}`);
    for (const fixture of [
      "weapon_katana",
      "armor_dragon_helmet",
      "skeleton_spinosaurus",
      "sample_samurai",
      "dragon_boss",
    ]) {
      expect(activeReasoning).not.toContain(fixture);
    }
  });
});
