import { describe, expect, test } from "bun:test";
import {
  PARTICLE_REFERENCE_IDS,
  getParticleReferencePayload,
} from "../server/resources/particle";

describe("Bedrock particle reference coverage", () => {
  test("includes the base and specialized Vanilla particle materials", () => {
    expect(PARTICLE_REFERENCE_IDS).toContain("materials");
    const payload = getParticleReferencePayload("materials") as {
      materials: Record<string, string>;
      rules: string[];
    };
    for (const material of [
      "particles_base",
      "particles_opaque",
      "particles_alpha",
      "particles_blend",
      "particles_add",
    ]) {
      expect(payload.materials[material]).toBeTruthy();
    }
    expect(payload.rules.join("\n")).toContain("Unknown/custom material strings are preserved");
  });
});
