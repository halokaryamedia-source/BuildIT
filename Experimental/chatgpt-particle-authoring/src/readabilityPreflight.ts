import {
  PARTICLE_PREFLIGHT_DIAGNOSTIC_CODES,
  type ExperimentalParticleDiagnostic,
} from "./diagnostics";
import type {
  ViewDistanceReadabilityInput,
  ViewDistanceReadabilityResult,
} from "./types";

/**
 * Small-angle readability heuristic expressed as angular size. This is only a
 * static legibility signal; it does not model FOV, display resolution,
 * transparency, contrast, motion blur, or visual salience.
 */
export function evaluateViewDistanceReadability(
  input: ViewDistanceReadabilityInput
): ViewDistanceReadabilityResult {
  if (!Number.isFinite(input.size_blocks) || input.size_blocks <= 0) {
    throw new Error("size_blocks must be a positive finite number.");
  }
  if (!Number.isFinite(input.distance_blocks) || input.distance_blocks <= 0) {
    throw new Error("distance_blocks must be a positive finite number.");
  }

  const minimum = input.minimum_angular_degrees ?? 0.2;
  if (!Number.isFinite(minimum) || minimum <= 0) {
    throw new Error("minimum_angular_degrees must be a positive finite number.");
  }

  const angular =
    2 *
    Math.atan(input.size_blocks / (2 * input.distance_blocks)) *
    (180 / Math.PI);

  const diagnostics: ExperimentalParticleDiagnostic[] = [];
  if (angular < minimum) {
    diagnostics.push({
      severity: "warning",
      code: PARTICLE_PREFLIGHT_DIAGNOSTIC_CODES.readabilityBelowTarget,
      message: `${input.label ?? "Particle"} subtends ${angular.toFixed(3)}°, below the authored ${minimum.toFixed(3)}° readability threshold at ${input.distance_blocks} blocks.`,
    });
  }

  return {
    angular_size_degrees: angular,
    minimum_angular_degrees: minimum,
    diagnostics,
  };
}
