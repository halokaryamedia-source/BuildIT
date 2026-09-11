import {
  PARTICLE_PREFLIGHT_DIAGNOSTIC_CODES,
  type ExperimentalParticleDiagnostic,
} from "./diagnostics";
import { evaluateMotionEnvelope } from "./motionPreflight";
import type {
  MotionEnvelope,
  MotionSimulationResult,
  ParticleIntentContract,
  ParticleIntentMotionTarget,
} from "./types";

function validRange(range: { min?: number; max?: number } | undefined): boolean {
  if (!range) return true;
  if (range.min !== undefined && !Number.isFinite(range.min)) return false;
  if (range.max !== undefined && !Number.isFinite(range.max)) return false;
  if (range.min !== undefined && range.max !== undefined && range.min > range.max) {
    return false;
  }
  return true;
}

function validEnvelope(envelope: MotionEnvelope): boolean {
  return validRange(envelope.apex_y) && validRange(envelope.horizontal_distance);
}

/**
 * Validates only the small acceptance contract needed by the experimental
 * preflight. It is not an authoring planner and never rewrites particle data.
 */
export function validateParticleIntentContract(
  intent: ParticleIntentContract
): ExperimentalParticleDiagnostic[] {
  const diagnostics: ExperimentalParticleDiagnostic[] = [];

  if (!intent.effect_name.trim()) {
    diagnostics.push({
      severity: "error",
      code: PARTICLE_PREFLIGHT_DIAGNOSTIC_CODES.invalidParticleIntentContract,
      path: "intent.effect_name",
      message: "effect_name must be non-empty.",
    });
  }
  if (
    intent.view_distance_blocks !== undefined &&
    (!Number.isFinite(intent.view_distance_blocks) || intent.view_distance_blocks <= 0)
  ) {
    diagnostics.push({
      severity: "error",
      code: PARTICLE_PREFLIGHT_DIAGNOSTIC_CODES.invalidParticleIntentContract,
      path: "intent.view_distance_blocks",
      message: "view_distance_blocks must be a positive finite number when provided.",
    });
  }
  if (
    intent.total_duration_seconds !== undefined &&
    (!Number.isFinite(intent.total_duration_seconds) || intent.total_duration_seconds <= 0)
  ) {
    diagnostics.push({
      severity: "error",
      code: PARTICLE_PREFLIGHT_DIAGNOSTIC_CODES.invalidParticleIntentContract,
      path: "intent.total_duration_seconds",
      message: "total_duration_seconds must be a positive finite number when provided.",
    });
  }

  const seen = new Set<string>();
  for (const target of intent.motion_targets ?? []) {
    if (!target.id.trim() || !validEnvelope(target.envelope)) {
      diagnostics.push({
        severity: "error",
        code: PARTICLE_PREFLIGHT_DIAGNOSTIC_CODES.invalidParticleIntentContract,
        path: `intent.motion_targets.${target.id || "<empty>"}`,
        message:
          "Each motion target requires a non-empty id and finite min/max ranges where min does not exceed max.",
      });
      continue;
    }
    if (seen.has(target.id)) {
      diagnostics.push({
        severity: "error",
        code: PARTICLE_PREFLIGHT_DIAGNOSTIC_CODES.duplicateParticleIntentTarget,
        path: `intent.motion_targets.${target.id}`,
        message: `Duplicate motion target id ${target.id}.`,
      });
    }
    seen.add(target.id);
  }

  return diagnostics;
}

export function evaluateMotionAgainstIntentTarget(
  result: MotionSimulationResult,
  target: ParticleIntentMotionTarget
): ExperimentalParticleDiagnostic[] {
  return evaluateMotionEnvelope(result, target.envelope);
}
