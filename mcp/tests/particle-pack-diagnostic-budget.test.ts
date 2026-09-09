import { describe, expect, test } from "bun:test";
import {
  createParticleDocument,
  type JsonObject,
} from "../lib/bedrockParticleDocument";
import { analyzeBedrockParticlePack } from "../lib/bedrockParticlePackGraph";

describe("particle pack diagnostic budget", () => {
  test("keeps validity blocking even when the first error occurs beyond the returned diagnostic window", () => {
    const client_entities = Array.from({ length: 130 }, (_, index) => ({
      document: {
        "minecraft:client_entity": {
          description: {
            particle_effects: { fx: "blockit:a" },
          },
        },
      } as JsonObject,
      source_path: `/rp/entity/warning_${index}.entity.json`,
    }));
    client_entities.push({
      document: {
        "minecraft:client_entity": {
          description: {
            identifier: "blockit:broken",
            particle_effects: { broken: 12 },
          },
        },
      } as JsonObject,
      source_path: "/rp/entity/error.entity.json",
    });

    const result = analyzeBedrockParticlePack({
      particles: [
        { document: createParticleDocument({ identifier: "blockit:a" }) },
      ],
      client_entities,
    });

    expect(result.valid).toBe(false);
    expect(result.diagnostics.length).toBeLessThanOrEqual(128);
    expect(result.diagnostics.at(-1)?.code).toBe(
      "particle_pack_diagnostics_truncated"
    );
  });
});
