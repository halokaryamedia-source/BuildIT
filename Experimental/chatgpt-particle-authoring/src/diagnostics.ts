export const PARTICLE_PREFLIGHT_DIAGNOSTIC_CODES = Object.freeze({
  snowstormInitialSpeedVectorNormalized:
    "snowstorm_initial_speed_vector_normalized",
  unstableEmitterAgeParticleProperty:
    "unstable_emitter_age_particle_property",
  motionApexOutsideTarget: "motion_apex_outside_target",
  motionHorizontalDistanceOutsideTarget:
    "motion_horizontal_distance_outside_target",
  duplicateParticleBundleIdentifier: "duplicate_particle_bundle_identifier",
  missingParticleBundleReference: "missing_particle_bundle_reference",
  particleBundleIdentifierMismatch: "particle_bundle_identifier_mismatch",
  circularParticleBundleReference: "circular_particle_bundle_reference",
  orphanParticleBundleEntry: "orphan_particle_bundle_entry",
  missingParticleTextureReference: "missing_particle_texture_reference",
  invalidTextureAtlasBuffer: "invalid_texture_atlas_buffer",
  textureAtlasGridMismatch: "texture_atlas_grid_mismatch",
  textureAtlasMissingTransparency: "texture_atlas_missing_transparency",
  textureAtlasVisibleWhiteMatte: "texture_atlas_visible_white_matte",
  textureAtlasUnsafeGutter: "texture_atlas_unsafe_gutter",
  textureAtlasDuplicateCell: "texture_atlas_duplicate_cell",
  invalidParticleIntentContract: "invalid_particle_intent_contract",
  duplicateParticleIntentTarget: "duplicate_particle_intent_target",
} as const);

export type ParticlePreflightDiagnosticCode =
  (typeof PARTICLE_PREFLIGHT_DIAGNOSTIC_CODES)[keyof typeof PARTICLE_PREFLIGHT_DIAGNOSTIC_CODES];

export type ExperimentalParticleDiagnostic = {
  severity: "warning" | "error";
  code: ParticlePreflightDiagnosticCode;
  message: string;
  path?: string;
};
