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
} as const);

export type ParticlePreflightDiagnosticCode =
  (typeof PARTICLE_PREFLIGHT_DIAGNOSTIC_CODES)[keyof typeof PARTICLE_PREFLIGHT_DIAGNOSTIC_CODES];

export type ExperimentalParticleDiagnostic = {
  severity: "warning" | "error";
  code: ParticlePreflightDiagnosticCode;
  message: string;
  path?: string;
};
