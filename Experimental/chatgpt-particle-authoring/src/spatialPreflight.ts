import {
  PARTICLE_PREFLIGHT_DIAGNOSTIC_CODES,
  type ExperimentalParticleDiagnostic,
} from "./diagnostics";
import type {
  KeepOutCylinder,
  SpatialPoint,
  SpatialPreflightResult,
} from "./types";

function finiteNonNegative(value: number, label: string): number {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${label} must be a finite non-negative number.`);
  }
  return value;
}

function pointInsideCylinder(
  point: SpatialPoint,
  volume: KeepOutCylinder
): boolean {
  const centerX = volume.center_x ?? 0;
  const centerZ = volume.center_z ?? 0;
  const dx = point[0] - centerX;
  const dz = point[2] - centerZ;
  const horizontal = Math.hypot(dx, dz);
  return (
    horizontal < volume.radius &&
    point[1] >= volume.min_y &&
    point[1] <= volume.max_y
  );
}

/**
 * Bounded geometric preflight for known spawn/trajectory samples against a
 * declared cylindrical keep-out volume. This is not collision or visibility
 * simulation; it only measures authored sample overlap.
 */
export function evaluateKeepOutSamples(
  samples: readonly SpatialPoint[],
  volume: KeepOutCylinder,
  warning_fraction = 0.25
): SpatialPreflightResult {
  finiteNonNegative(volume.radius, "keep-out radius");
  finiteNonNegative(warning_fraction, "warning_fraction");
  if (warning_fraction > 1) {
    throw new Error("warning_fraction must be between 0 and 1.");
  }
  if (!Number.isFinite(volume.min_y) || !Number.isFinite(volume.max_y)) {
    throw new Error("keep-out Y bounds must be finite.");
  }
  if (volume.max_y < volume.min_y) {
    throw new Error("keep-out max_y must be greater than or equal to min_y.");
  }

  let inside = 0;
  for (const sample of samples) {
    if (sample.length !== 3 || sample.some((value) => !Number.isFinite(value))) {
      throw new Error("spatial samples must be finite vec3 values.");
    }
    if (pointInsideCylinder(sample, volume)) inside += 1;
  }

  const overlapFraction = samples.length === 0 ? 0 : inside / samples.length;
  const diagnostics: ExperimentalParticleDiagnostic[] = [];
  if (overlapFraction >= warning_fraction && samples.length > 0) {
    diagnostics.push({
      severity: "warning",
      code: PARTICLE_PREFLIGHT_DIAGNOSTIC_CODES.keepOutOverlap,
      message: `${(overlapFraction * 100).toFixed(1)}% of supplied spatial samples fall inside the declared keep-out volume.`,
    });
  }

  return {
    sample_count: samples.length,
    inside_keep_out_count: inside,
    overlap_fraction: overlapFraction,
    diagnostics,
  };
}
