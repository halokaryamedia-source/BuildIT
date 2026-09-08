import { describe, expect, test } from "bun:test";
import {
  applyParticleBindingOperations,
  inspectParticleBindings,
  parseClientEntityDocument,
  validateParticleEffectReferences,
} from "../lib/bedrockParticleBinding";

describe("Bedrock client-entity particle binding", () => {
  test("adds and removes shortname mappings without disturbing other client-entity state", () => {
    const source = parseClientEntityDocument(JSON.stringify({
      format_version: "1.10.0",
      future_root: { keep: false },
      "minecraft:client_entity": {
        description: {
          identifier: "blockit:test_entity",
          materials: { default: "entity_alphatest" },
          textures: { default: "textures/entity/test" },
          geometry: { default: "geometry.test" },
          particle_effects: { old: "blockit:old_particle" },
          future_description: { zero: 0 },
        },
      },
    }));

    const next = applyParticleBindingOperations(source, [
      { op: "set", shortname: "engine_smoke", effect: "blockit:engine_smoke" },
      { op: "remove", shortname: "old" },
    ]);
    const summary = inspectParticleBindings(next);
    const description = (next["minecraft:client_entity"] as any).description;

    expect(summary.bindings).toEqual([
      { shortname: "engine_smoke", effect: "blockit:engine_smoke" },
    ]);
    expect(description.materials).toEqual({ default: "entity_alphatest" });
    expect(description.future_description).toEqual({ zero: 0 });
    expect((next.future_root as any).keep).toBe(false);
  });

  test("validates animation/controller references against shortnames rather than full particle identifiers", () => {
    const source = parseClientEntityDocument(JSON.stringify({
      format_version: "1.10.0",
      "minecraft:client_entity": {
        description: {
          identifier: "blockit:test_entity",
          particle_effects: {
            smoke: "blockit:engine_smoke",
            spark: "blockit:spark",
          },
        },
      },
    }));

    expect(validateParticleEffectReferences(source, ["smoke", "spark"])).toEqual([]);
    expect(validateParticleEffectReferences(source, ["blockit:engine_smoke"]))
      .toEqual([
        expect.objectContaining({ code: "unbound_particle_shortname" }),
      ]);
  });

  test("fails closed on duplicate batch targets and invalid new identifiers", () => {
    const source = parseClientEntityDocument(JSON.stringify({
      "minecraft:client_entity": { description: { identifier: "blockit:test" } },
    }));

    expect(() => applyParticleBindingOperations(source, [
      { op: "set", shortname: "smoke", effect: "blockit:smoke" },
      { op: "remove", shortname: "smoke" },
    ])).toThrow(/more than once/);

    expect(() => applyParticleBindingOperations(source, [
      { op: "set", shortname: "smoke", effect: "Bad Namespace:Smoke" },
    ])).toThrow(/namespace:path/);
  });
});
