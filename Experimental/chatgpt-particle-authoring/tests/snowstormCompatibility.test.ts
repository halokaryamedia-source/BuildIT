import { describe, expect, test } from "bun:test";
import {
  PARTICLE_PREFLIGHT_DIAGNOSTIC_CODES,
  analyzeSnowstormCompatibility,
} from "../src";
import { particle } from "./helpers";

describe("experimental Snowstorm compatibility preflight", () => {
  test("warns when vector initial speed would lose authored magnitude in Wintersky", () => {
    const diagnostics = analyzeSnowstormCompatibility(
      particle({
        "minecraft:particle_initial_speed": [2, 20, 12],
      })
    );

    expect(diagnostics.map((entry) => entry.code)).toContain(
      PARTICLE_PREFLIGHT_DIAGNOSTIC_CODES.snowstormInitialSpeedVectorNormalized
    );
  });

  test("reports exact living-particle paths controlled by emitter age", () => {
    const diagnostics = analyzeSnowstormCompatibility(
      particle({
        "minecraft:particle_motion_dynamic": {
          linear_acceleration: [
            0,
            "variable.emitter_age < 3 ? 2 : 0",
            0,
          ],
          linear_drag_coefficient: 0.1,
        },
        "minecraft:particle_appearance_billboard": {
          size: ["v.emitter_age < 3 ? 1 : 4", 1],
        },
      })
    );

    const unstable = diagnostics.filter(
      (entry) =>
        entry.code ===
        PARTICLE_PREFLIGHT_DIAGNOSTIC_CODES.unstableEmitterAgeParticleProperty
    );
    expect(unstable).toHaveLength(2);
    expect(unstable.map((entry) => entry.path)).toEqual([
      "particle_effect.components.minecraft:particle_motion_dynamic.linear_acceleration[1]",
      "particle_effect.components.minecraft:particle_appearance_billboard.size[0]",
    ]);
  });

  test("does not flag emitter-age use that remains emitter-owned", () => {
    const diagnostics = analyzeSnowstormCompatibility(
      particle({
        "minecraft:emitter_rate_steady": {
          spawn_rate: "variable.emitter_age < 3 ? 20 : 5",
          max_particles: 100,
        },
        "minecraft:particle_initial_speed": 8,
      })
    );

    expect(diagnostics).toEqual([]);
  });

  test("keeps stable particle-owned expressions clean", () => {
    const diagnostics = analyzeSnowstormCompatibility(
      particle({
        "minecraft:particle_initial_speed": 17,
        "minecraft:particle_motion_dynamic": {
          linear_acceleration: [0, -6, 0],
          linear_drag_coefficient:
            "0.04 + variable.particle_random_1 * 0.02",
        },
        "minecraft:particle_appearance_billboard": {
          size: [
            "1 + variable.particle_age * 0.2",
            "1 + variable.particle_age * 0.2",
          ],
        },
      })
    );

    expect(diagnostics).toEqual([]);
  });
});
