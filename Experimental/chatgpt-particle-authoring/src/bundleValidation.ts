import {
  PARTICLE_PREFLIGHT_DIAGNOSTIC_CODES,
  type ExperimentalParticleDiagnostic,
} from "./diagnostics";
import { objectOf } from "./json";
import type { JsonValue, ParticleBundleEntry } from "./types";

function collectNestedParticleEffects(value: JsonValue, output: string[]): void {
  if (Array.isArray(value)) {
    value.forEach((entry) => collectNestedParticleEffects(entry, output));
    return;
  }
  const current = objectOf(value);
  if (!current) return;

  const particleEffect = objectOf(current.particle_effect);
  if (particleEffect && typeof particleEffect.effect === "string") {
    output.push(particleEffect.effect);
  }

  for (const child of Object.values(current)) {
    collectNestedParticleEffects(child, output);
  }
}

export function validateParticleBundleReferences(
  entries: readonly ParticleBundleEntry[]
): ExperimentalParticleDiagnostic[] {
  const diagnostics: ExperimentalParticleDiagnostic[] = [];
  const counts = new Map<string, number>();

  for (const entry of entries) {
    counts.set(entry.identifier, (counts.get(entry.identifier) ?? 0) + 1);
  }

  for (const [identifier, count] of counts) {
    if (count > 1) {
      diagnostics.push({
        severity: "error",
        code: PARTICLE_PREFLIGHT_DIAGNOSTIC_CODES.duplicateParticleBundleIdentifier,
        path: `bundle.${identifier}`,
        message: `Particle bundle contains ${count} entries with duplicate identifier ${identifier}.`,
      });
    }
  }

  const identifiers = new Set(counts.keys());
  for (const entry of entries) {
    const effect = objectOf(entry.document.particle_effect);
    const events = objectOf(effect?.events);
    if (!events) continue;

    const referenced: string[] = [];
    collectNestedParticleEffects(events, referenced);
    for (const identifier of referenced) {
      if (!identifiers.has(identifier)) {
        diagnostics.push({
          severity: "error",
          code: PARTICLE_PREFLIGHT_DIAGNOSTIC_CODES.missingParticleBundleReference,
          path: `bundle.${entry.identifier}.events`,
          message: `Particle effect ${entry.identifier} references missing child effect ${identifier}.`,
        });
      }
    }
  }

  return diagnostics;
}
