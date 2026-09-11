import {
  getCapabilityMetadata,
  type CapabilityEffects,
} from "../lib/capabilityMetadata";
import {
  normalizeAuthoringPhaseAffinity,
  type BlockitAuthoringPhaseAffinity,
} from "./projectAffinity";
import type { JsonRecord } from "./contract";

export type GatewayEffectApplication = {
  effects: CapabilityEffects;
  projectUuid: string | null;
  authoringPhase: BlockitAuthoringPhaseAffinity | null;
  surfaceChanged: boolean | null;
};

function isRecord(value: unknown): value is JsonRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function createdProjectUuid(value: unknown): string | null {
  if (!isRecord(value) || !isRecord(value.project)) return null;
  const uuid = value.project.uuid;
  return typeof uuid === "string" && uuid.trim() ? uuid.trim() : null;
}

function resultAuthoringPhase(value: unknown): BlockitAuthoringPhaseAffinity | null {
  if (!isRecord(value)) return null;
  try {
    return normalizeAuthoringPhaseAffinity(value.phase);
  } catch {
    return null;
  }
}

export function resolveGatewayCapabilityEffects(
  capability: string,
  structuredContent: unknown,
  previousPhase: BlockitAuthoringPhaseAffinity | null
): GatewayEffectApplication {
  const effects = getCapabilityMetadata(capability).effects;
  const projectUuid = effects.projectAffinity === "adopt_created_project"
    ? createdProjectUuid(structuredContent)
    : null;
  const authoringPhase = effects.phaseAffinity === "update_from_result"
    ? resultAuthoringPhase(structuredContent)
    : null;
  const surfaceChanged = authoringPhase
    ? previousPhase === null
      ? isRecord(structuredContent) && structuredContent.surface_changed === true
      : (previousPhase === "animation") !== (authoringPhase === "animation")
    : null;

  return {
    effects,
    projectUuid,
    authoringPhase,
    surfaceChanged,
  };
}
