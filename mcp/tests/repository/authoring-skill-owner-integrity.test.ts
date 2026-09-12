import { describe, expect, test } from "bun:test";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("canonical authoring Skill ownership", () => {
  test("authoring phase regressions use current LazyDesigner specialist paths", async () => {
    const phaseSurface = await source("tests/authoring-phase-surface.test.ts");

    for (const canonical of [
      ".agents/skills/lazydesigner-modelling/SKILL.md",
      ".agents/skills/lazydesigner-texturing/SKILL.md",
      ".agents/skills/lazydesigner-animation/SKILL.md",
    ]) {
      expect(phaseSurface).toContain(canonical);
    }

    for (const retired of [
      ".agents/skills/blockit-bedrock-entity-mcp/SKILL.md",
      ".agents/skills/blockbench-bedrock-modelling/SKILL.md",
      ".agents/skills/blockit-bedrock-texturing/SKILL.md",
      ".agents/skills/blockit-bedrock-animation/SKILL.md",
    ]) {
      expect(phaseSurface).not.toContain(retired);
    }
  });

  test("particle authoring remains a bounded Animation specialist route", async () => {
    const [registration, animation] = await Promise.all([
      source("server/runtime/registration.ts"),
      source("../.agents/skills/lazydesigner-animation/SKILL.md"),
    ]);

    expect(registration).toContain("registerParticleTools()");
    expect(registration).toContain("registerParticleResources()");
    expect(animation).toContain("inspect_particle / manage_particle");
    expect(animation).toContain("Particle is asset-only");
  });
});
