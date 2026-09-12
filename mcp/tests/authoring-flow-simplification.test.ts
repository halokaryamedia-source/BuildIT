import { describe, expect, test } from "bun:test";
import { getCapabilityMetadata } from "@/lib/capabilityMetadata";

async function text(path: string): Promise<string> {
  return Bun.file(new URL(path, import.meta.url)).text();
}

describe("single-owner authoring flow", () => {
  test("shared authoring-stage policy is conditional rather than duplicate hot-path context", async () => {
    const loading = await text("../../docs/04-system/ai-context-loading.md");

    expect(loading).toContain("Normal hot path does not load this document as an additional payload");
    expect(loading).toContain("cross-stage / approval / evidence-freshness / convergence / handoff ambiguity");
    expect(loading).toContain("one primary specialist is active");

    for (const requiredBlock of [
      "GEOMETRY_CONTEXT projection\n.agents/skills/lazydesigner-modelling/SKILL.md",
      "TEXTURE_CONTEXT projection\n.agents/skills/lazydesigner-texturing/SKILL.md",
      "ANIMATION_CONTEXT projection\n.agents/skills/lazydesigner-animation/SKILL.md",
    ]) {
      expect(loading).toContain(requiredBlock);
    }
  });

  test("Control projection remains a compact envelope instead of a second semantic database", async () => {
    const projection = await text("../../docs/04-system/control/context-projection.md");

    expect(projection).toContain("Stage Context: Source-Owned Shape");
    expect(projection).toContain("does **not** duplicate the complete semantic contents");
    expect(projection).toContain("one active stage context is selected");
    expect(projection).toContain("per-Cube / per-pixel / per-keyframe plan");
  });

  test("Runtime phase tool applies the phase before returning its Gateway receipt", async () => {
    const phaseControl = await text("../server/runtime/phaseControl.ts");

    expect(phaseControl).toContain("requestMcpPhaseSwitch(target_phase);");
    expect(phaseControl).toContain("Geometry↔Texturing stays on the shared AUTHORING surface");
    expect(phaseControl.indexOf("requestMcpPhaseSwitch(target_phase);")).toBeLessThan(
      phaseControl.indexOf("return {")
    );
  });

  test("phase metadata does not force catalog invalidation for every focus change", () => {
    const effects = getCapabilityMetadata("switch_authoring_phase").effects;
    expect(effects.phaseAffinity).toBe("update_from_result");
    expect(effects.invalidateCatalog).toBe(false);
  });
});
