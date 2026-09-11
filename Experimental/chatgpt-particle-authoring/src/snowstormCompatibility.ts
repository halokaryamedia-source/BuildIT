import {
  PARTICLE_PREFLIGHT_DIAGNOSTIC_CODES,
  type ExperimentalParticleDiagnostic,
} from "./diagnostics";
import { collectMatchingStringPaths, componentMap } from "./json";
import type { JsonObject, JsonValue } from "./types";

const PER_FRAME_PARTICLE_COMPONENTS = [
  "minecraft:particle_motion_dynamic",
  "minecraft:particle_appearance_billboard",
  "minecraft:particle_appearance_tinting",
] as const;

const EMITTER_AGE = /\b(?:variable|v)\.emitter_age\b/i;

function emitterAgePaths(value: JsonValue, rootPath: string): string[] {
  const paths: string[] = [];
  collectMatchingStringPaths(
    value,
    rootPath,
    (expression) => EMITTER_AGE.test(expression),
    paths
  );
  return paths;
}

/**
 * Target-specific compatibility diagnostics for Snowstorm/Wintersky.
 * These are warnings about preview/runtime semantics, not Bedrock syntax errors.
 */
export function analyzeSnowstormCompatibility(
  document: JsonObject
): ExperimentalParticleDiagnostic[] {
  const diagnostics: ExperimentalParticleDiagnostic[] = [];
  const components = componentMap(document);
  const initialSpeed = components["minecraft:particle_initial_speed"];

  if (Array.isArray(initialSpeed) && initialSpeed.length === 3) {
    diagnostics.push({
      severity: "warning",
      code: PARTICLE_PREFLIGHT_DIAGNOSTIC_CODES.snowstormInitialSpeedVectorNormalized,
      path: "particle_effect.components.minecraft:particle_initial_speed",
      message:
        "Snowstorm/Wintersky treats vector particle_initial_speed as a direction, normalizes it, and previews with linear speed 1. When authored magnitude matters, put the launch vector in the emitter shape direction and use scalar particle_initial_speed.",
    });
  }

  for (const componentName of PER_FRAME_PARTICLE_COMPONENTS) {
    const component = components[componentName];
    if (component === undefined) continue;

    const componentPath = `particle_effect.components.${componentName}`;
    for (const path of emitterAgePaths(component, componentPath)) {
      diagnostics.push({
        severity: "warning",
        code: PARTICLE_PREFLIGHT_DIAGNOSTIC_CODES.unstableEmitterAgeParticleProperty,
        path,
        message:
          "A living-particle property references variable.emitter_age. Threshold changes can make existing particles pop, flicker, or switch motion/appearance class mid-life. Prefer particle_random, particle_age, or particle_lifetime for particle-owned behavior; keep emitter_age for emitter-level timing.",
      });
    }
  }

  return diagnostics;
}
