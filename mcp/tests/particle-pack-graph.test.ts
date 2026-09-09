import { describe, expect, test } from "bun:test";
import {
  applyParticleOperations,
  createParticleDocument,
} from "../lib/bedrockParticleDocument";
import { parseClientEntityDocument } from "../lib/bedrockParticleBinding";
import { analyzeBedrockParticlePack } from "../lib/bedrockParticlePackGraph";

function nestedParticle(identifier: string, target?: string) {
  let document = createParticleDocument({ identifier, preset: "burst" });
  if (target) {
    document = applyParticleOperations(document, [
      {
        op: "set_event",
        name: "chain",
        value: {
          particle_effect: {
            effect: target,
            type: "emitter",
          },
        },
      },
      {
        op: "set_component",
        component: "minecraft:particle_lifetime_events",
        value: { expiration_event: "chain" },
      },
    ]);
  }
  return document;
}

describe("Bedrock particle pack dependency analysis", () => {
  test("builds deterministic nested dependency edges for a resolved pack", () => {
    const a = nestedParticle("blockit:a", "blockit:b");
    const b = nestedParticle("blockit:b", "blockit:c");
    const c = nestedParticle("blockit:c");
    const result = analyzeBedrockParticlePack({ particles: [c, a, b].map((document) => ({ document })) });

    expect(result.identifiers).toEqual(["blockit:a", "blockit:b", "blockit:c"]);
    expect(result.dependency_edges).toEqual([
      { from: "blockit:a", to: "blockit:b" },
      { from: "blockit:b", to: "blockit:c" },
    ]);
    expect(result.dependency_cycles).toEqual([]);
    expect(result.valid).toBe(true);
  });

  test("detects cross-file dependency cycles without treating them as structural invalidity", () => {
    const result = analyzeBedrockParticlePack({
      particles: [
        { document: nestedParticle("blockit:a", "blockit:b") },
        { document: nestedParticle("blockit:b", "blockit:c") },
        { document: nestedParticle("blockit:c", "blockit:a") },
      ],
    });

    expect(result.dependency_cycles).toEqual([["blockit:a", "blockit:b", "blockit:c"]]);
    expect(result.diagnostics.map((entry) => entry.code)).toContain("particle_dependency_cycle");
    expect(result.valid).toBe(true);
  });

  test("duplicate identifiers are blocking pack errors", () => {
    const result = analyzeBedrockParticlePack({
      particles: [
        { document: nestedParticle("blockit:same"), source_path: "/rp/particles/a.particle.json" },
        { document: nestedParticle("blockit:same"), source_path: "/rp/particles/b.particle.json" },
      ],
    });

    expect(result.diagnostics.map((entry) => entry.code)).toContain("duplicate_particle_identifier");
    expect(result.valid).toBe(false);
  });

  test("reports unresolved nested particles and unresolved client-entity targets separately", () => {
    const client = parseClientEntityDocument(`{
      "minecraft:client_entity": {
        "description": {
          "identifier": "blockit:test",
          "particle_effects": {
            "known": "blockit:a",
            "missing": "blockit:not_here"
          }
        }
      }
    }`);
    const result = analyzeBedrockParticlePack({
      particles: [{ document: nestedParticle("blockit:a", "blockit:nested_missing") }],
      client_entities: [{ document: client, source_path: "/rp/entity/test.entity.json" }],
    });

    expect(result.diagnostics.map((entry) => entry.code)).toContain("unresolved_nested_particle");
    expect(result.diagnostics.map((entry) => entry.code)).toContain("unresolved_client_entity_particle");
    expect(result.valid).toBe(false);
  });

  test("checks texture and sound dependencies only when inventories are supplied", () => {
    let document = nestedParticle("blockit:deps");
    document = applyParticleOperations(document, [
      {
        op: "set_event",
        name: "sound",
        value: { sound_effect: { event_name: "blockit.particle.pop" } },
      },
    ]);

    const withoutInventory = analyzeBedrockParticlePack({ particles: [{ document }] });
    expect(withoutInventory.diagnostics.map((entry) => entry.code)).not.toContain("unresolved_particle_texture");
    expect(withoutInventory.diagnostics.map((entry) => entry.code)).not.toContain("unresolved_particle_sound_event");

    const missingInventory = analyzeBedrockParticlePack({
      particles: [{ document }],
      available_textures: [],
      available_sound_events: [],
    });
    expect(missingInventory.texture_dependencies).toContain("textures/particle/particles");
    expect(missingInventory.sound_dependencies).toContain("blockit.particle.pop");
    expect(missingInventory.diagnostics.map((entry) => entry.code)).toContain("unresolved_particle_texture");
    expect(missingInventory.diagnostics.map((entry) => entry.code)).toContain("unresolved_particle_sound_event");
  });

  test("accepts resolved texture, sound and client-entity dependencies", () => {
    const client = parseClientEntityDocument(`{
      "minecraft:client_entity": {
        "description": {
          "identifier": "blockit:test",
          "particle_effects": { "fx": "blockit:a" }
        }
      }
    }`);
    let document = nestedParticle("blockit:a");
    document = applyParticleOperations(document, [
      {
        op: "set_event",
        name: "sound",
        value: { sound_effect: { event_name: "blockit.particle.pop" } },
      },
    ]);
    const result = analyzeBedrockParticlePack({
      particles: [{ document }],
      client_entities: [{ document: client }],
      available_textures: ["textures/particle/particles"],
      available_sound_events: ["blockit.particle.pop"],
    });

    expect(result.valid).toBe(true);
    expect(result.diagnostics.filter((entry) => entry.severity === "error")).toEqual([]);
  });
});
