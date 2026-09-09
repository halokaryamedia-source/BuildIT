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
    expect(geometry).toContain("layered surface");
    expect(geometry).toContain("linked meaningful segments");
    expect(geometry).toContain("unit-Cube staircasing");
    expect(geometry).toContain("Locator intent");
    expect(geometry).toContain("positive-only or fixed-value rule");
  });

  test("representation stays 3D-need-first while the small-detail threshold remains a guardrail", async () => {
    const [modelling, geometry, flow] = await Promise.all([
      source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md"),
      source("../docs/foundation/05-geometry-standard.md"),
      source("../docs/knowledge/flow.md"),
    ]);

    for (const text of [modelling, geometry, flow]) {
      expect(text).toContain("PLANAR_CUTOUT_CARRIER");
      expect(lower(text)).toContain("representation");
      expect(lower(text)).toContain("guardrail");
      expect(lower(text)).toContain("not a classifier");
    }

    expect(geometry).toContain("minimum geometry required to preserve correct 3D form");
    expect(geometry).toContain("PrimitiveAnything output is an editable scaffold");
    expect(flow).toContain("Primitive count is not final Cube authority");
  });

  test("surface integrity distinguishes required closure from intentional openings and intersections", async () => {
    const [orchestrator, modelling, geometry, flow] = await Promise.all([
      source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md"),
      source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md"),
      source("../docs/foundation/05-geometry-standard.md"),
      source("../docs/knowledge/flow.md"),
    ]);

    for (const relation of [
      "CLOSED_BOUNDARY",
      "INTENTIONAL_OPENING",
      "LAYERED_OFFSET",
      "INTENTIONAL_INTERSECTION",
      "CUTOUT_CARRIER",
    ]) {
      expect(modelling).toContain(relation);
      expect(geometry).toContain(relation);
      expect(flow).toContain(relation);
    }

    expect(orchestrator).toContain("bounded surface/contact review");
    expect(orchestrator).toContain("diagnosed bounded surface/contact integrity question");
    expect(orchestrator).not.toContain(
      "`inspect_model_bounds` only for envelope/scale/ground/displacement."
    );
    expect(modelling).toContain("do not force universal watertight geometry");
    expect(geometry).toContain("not that every model is universally watertight");
    expect(flow).toContain("surface_quality_summary");
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
