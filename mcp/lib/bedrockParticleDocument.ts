export {
  BEDROCK_PARTICLE_FORMAT_VERSION,
  BEDROCK_PARTICLE_PRESETS,
  BEDROCK_PARTICLE_COMPONENT_REFERENCE,
  BEDROCK_PARTICLE_CURVE_REFERENCE,
  BEDROCK_PARTICLE_EVENT_REFERENCE,
  BEDROCK_PARTICLE_PRESET_REFERENCE,
  isBedrockParticleIdentifier,
  assertJsonValue,
  cloneJsonValue,
  createParticleDocument,
  parseParticleDocument,
  applyParticleOperations,
  serializeParticleDocument,
} from "./bedrockParticleDocumentCore";
export type {
  JsonValue,
  JsonObject,
  BedrockParticlePreset,
  ParticleDiagnostic,
  ParticleMutationOperation,
  ParticleDocumentSummary,
} from "./bedrockParticleDocumentCore";

import {
  inspectParticleDocument as inspectParticleDocumentCore,
  type JsonObject,
  type ParticleDocumentSummary,
} from "./bedrockParticleDocumentCore";
import { analyzeBedrockParticleSemantics } from "./bedrockParticleSemantics";

/**
 * Canonical compact particle inspection. The lossless document core owns
 * structural/Bedrock component validation; advanced semantics adds bounded
 * Molang, parametric-motion, curve, flipbook, event-fanout and cost diagnostics.
 * Neither layer evaluates gameplay truth or rewrites authored expressions.
 */
export function inspectParticleDocument(
  document: JsonObject
): ParticleDocumentSummary {
  const summary = inspectParticleDocumentCore(document);
  const advanced = analyzeBedrockParticleSemantics(document);
  if (advanced.length === 0) return summary;
  return {
    ...summary,
    diagnostics: [...summary.diagnostics, ...advanced],
  };
}

export const particleDocumentIsValid = (document: JsonObject): boolean =>
  !inspectParticleDocument(document).diagnostics.some(
    (entry) => entry.severity === "error"
  );
