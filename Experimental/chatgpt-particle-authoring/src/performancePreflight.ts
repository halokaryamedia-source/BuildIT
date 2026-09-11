import {
  PARTICLE_PREFLIGHT_DIAGNOSTIC_CODES,
  type ExperimentalParticleDiagnostic,
} from "./diagnostics";
import type {
  ParticleEmitterBudgetInput,
  ParticlePerformanceBudget,
  ParticlePerformanceEstimate,
} from "./types";

function positiveOrZero(value: number, label: string): number {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${label} must be a finite non-negative number.`);
  }
  return value;
}

/**
 * Conservative steady-state peak estimate: spawn_rate * average_lifetime,
 * capped by max_particles per emitter. It intentionally does not model
 * staggered timelines or GPU fill-rate.
 */
export function estimateParticlePerformanceBudget(
  emitters: readonly ParticleEmitterBudgetInput[],
  budget: ParticlePerformanceBudget
): ParticlePerformanceEstimate {
  positiveOrZero(budget.max_visible_particles, "max_visible_particles");

  const estimates = emitters.map((emitter) => {
    positiveOrZero(emitter.spawn_rate, `${emitter.name}.spawn_rate`);
    positiveOrZero(
      emitter.average_lifetime,
      `${emitter.name}.average_lifetime`
    );
    positiveOrZero(emitter.max_particles, `${emitter.name}.max_particles`);

    return {
      name: emitter.name,
      estimated_peak_visible: Math.min(
        emitter.max_particles,
        emitter.spawn_rate * emitter.average_lifetime
      ),
    };
  });

  const total = estimates.reduce(
    (sum, emitter) => sum + emitter.estimated_peak_visible,
    0
  );
  const diagnostics: ExperimentalParticleDiagnostic[] = [];
  if (total > budget.max_visible_particles) {
    diagnostics.push({
      severity: "warning",
      code: PARTICLE_PREFLIGHT_DIAGNOSTIC_CODES.performanceBudgetExceeded,
      message: `Estimated peak visible particle load ${total.toFixed(1)} exceeds the authored budget ${budget.max_visible_particles.toFixed(1)}.`,
    });
  }

  return {
    emitters: estimates,
    estimated_peak_visible: total,
    budget,
    diagnostics,
  };
}
