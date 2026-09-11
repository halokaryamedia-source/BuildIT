import {
  PARTICLE_PREFLIGHT_DIAGNOSTIC_CODES,
  type ExperimentalParticleDiagnostic,
} from "./diagnostics";
import { objectOf } from "./json";
import type {
  JsonValue,
  ParticleBundleEntry,
  ParticleBundleValidationInput,
} from "./types";

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

function authoredIdentifier(entry: ParticleBundleEntry): string | null {
  const effect = objectOf(entry.document.particle_effect);
  const description = objectOf(effect?.description);
  return typeof description?.identifier === "string" ? description.identifier : null;
}

function authoredTexture(entry: ParticleBundleEntry): string | null {
  const effect = objectOf(entry.document.particle_effect);
  const description = objectOf(effect?.description);
  const render = objectOf(description?.basic_render_parameters);
  return typeof render?.texture === "string" ? render.texture : null;
}

function referencesFor(entry: ParticleBundleEntry): string[] {
  const effect = objectOf(entry.document.particle_effect);
  const events = objectOf(effect?.events);
  if (!events) return [];
  const references: string[] = [];
  collectNestedParticleEffects(events, references);
  return [...new Set(references)];
}

export function validateParticleBundle(
  input: ParticleBundleValidationInput
): ExperimentalParticleDiagnostic[] {
  const diagnostics: ExperimentalParticleDiagnostic[] = [];
  const counts = new Map<string, number>();
  const entriesById = new Map<string, ParticleBundleEntry>();

  for (const entry of input.entries) {
    counts.set(entry.identifier, (counts.get(entry.identifier) ?? 0) + 1);
    if (!entriesById.has(entry.identifier)) entriesById.set(entry.identifier, entry);

    const documentIdentifier = authoredIdentifier(entry);
    if (documentIdentifier && documentIdentifier !== entry.identifier) {
      diagnostics.push({
        severity: "error",
        code: PARTICLE_PREFLIGHT_DIAGNOSTIC_CODES.particleBundleIdentifierMismatch,
        path: `bundle.${entry.identifier}.description.identifier`,
        message: `Bundle entry ${entry.identifier} contains document identifier ${documentIdentifier}.`,
      });
    }
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
  const graph = new Map<string, string[]>();
  for (const entry of input.entries) {
    const referenced = referencesFor(entry);
    graph.set(entry.identifier, referenced.filter((id) => identifiers.has(id)));
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

  if (input.available_texture_paths) {
    const available = new Set(input.available_texture_paths);
    for (const entry of input.entries) {
      const texture = authoredTexture(entry);
      if (texture && !available.has(texture)) {
        diagnostics.push({
          severity: "error",
          code: PARTICLE_PREFLIGHT_DIAGNOSTIC_CODES.missingParticleTextureReference,
          path: `bundle.${entry.identifier}.description.basic_render_parameters.texture`,
          message: `Particle effect ${entry.identifier} references unavailable texture ${texture}.`,
        });
      }
    }
  }

  const visiting = new Set<string>();
  const visited = new Set<string>();
  const cycleReported = new Set<string>();
  const visit = (identifier: string, trail: string[]): void => {
    if (visiting.has(identifier)) {
      const start = trail.indexOf(identifier);
      const cycle = [...trail.slice(Math.max(0, start)), identifier];
      const key = cycle.join(" -> ");
      if (!cycleReported.has(key)) {
        cycleReported.add(key);
        diagnostics.push({
          severity: "error",
          code: PARTICLE_PREFLIGHT_DIAGNOSTIC_CODES.circularParticleBundleReference,
          path: `bundle.${identifier}.events`,
          message: `Particle bundle contains a circular child-effect chain: ${key}.`,
        });
      }
      return;
    }
    if (visited.has(identifier)) return;
    visiting.add(identifier);
    for (const child of graph.get(identifier) ?? []) visit(child, [...trail, identifier]);
    visiting.delete(identifier);
    visited.add(identifier);
  };
  for (const identifier of identifiers) visit(identifier, []);

  if (input.root_identifier && identifiers.has(input.root_identifier)) {
    const reachable = new Set<string>();
    const walk = (identifier: string): void => {
      if (reachable.has(identifier)) return;
      reachable.add(identifier);
      for (const child of graph.get(identifier) ?? []) walk(child);
    };
    walk(input.root_identifier);
    for (const identifier of identifiers) {
      if (!reachable.has(identifier)) {
        diagnostics.push({
          severity: "warning",
          code: PARTICLE_PREFLIGHT_DIAGNOSTIC_CODES.orphanParticleBundleEntry,
          path: `bundle.${identifier}`,
          message: `Particle effect ${identifier} is not reachable from declared root ${input.root_identifier}.`,
        });
      }
    }
  }

  return diagnostics;
}

export function validateParticleBundleReferences(
  entries: readonly ParticleBundleEntry[]
): ExperimentalParticleDiagnostic[] {
  return validateParticleBundle({ entries });
}
