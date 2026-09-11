import {
  PARTICLE_PREFLIGHT_DIAGNOSTIC_CODES,
  type ExperimentalParticleDiagnostic,
} from "./diagnostics";
import type {
  MotionEnvelope,
  MotionSimulationInput,
  MotionSimulationResult,
  MotionVector,
} from "./types";

const MAX_SIMULATION_STEPS = 120_000;

function finiteNumber(value: number, label: string): number {
  if (!Number.isFinite(value)) throw new Error(`${label} must be finite.`);
  return value;
}

function normalizedDirection(direction: MotionVector): [number, number, number] {
  const values = direction.map((value, index) =>
    finiteNumber(value, `direction[${index}]`)
  ) as [number, number, number];
  const magnitude = Math.hypot(values[0], values[1], values[2]);
  if (magnitude <= 0) throw new Error("direction must have non-zero magnitude.");
  return [values[0] / magnitude, values[1] / magnitude, values[2] / magnitude];
}

/**
 * Bounded diagnostic approximation of Wintersky dynamic motion for constant
 * numeric inputs. It intentionally does not evaluate Molang, collision, local
 * space, events, inherited velocity, or parametric motion.
 */
export function simulateWinterskyDynamicMotion(
  input: MotionSimulationInput
): MotionSimulationResult {
  const tickRate = input.tick_rate ?? 60;
  if (!Number.isFinite(tickRate) || tickRate <= 0) {
    throw new Error("tick_rate must be a positive finite number.");
  }
  if (!Number.isFinite(input.lifetime) || input.lifetime < 0) {
    throw new Error("lifetime must be a finite non-negative number.");
  }
  if (
    !Number.isFinite(input.linear_drag_coefficient) ||
    input.linear_drag_coefficient < 0
  ) {
    throw new Error(
      "linear_drag_coefficient must be a finite non-negative number."
    );
  }

  const direction = normalizedDirection(input.direction);
  const speedMagnitude = finiteNumber(input.initial_speed, "initial_speed");
  const acceleration = input.acceleration.map((value, index) =>
    finiteNumber(value, `acceleration[${index}]`)
  ) as [number, number, number];

  const initialVelocity: [number, number, number] = [
    direction[0] * speedMagnitude,
    direction[1] * speedMagnitude,
    direction[2] * speedMagnitude,
  ];
  const velocity: [number, number, number] = [
    initialVelocity[0],
    initialVelocity[1],
    initialVelocity[2],
  ];
  const position: [number, number, number] = [0, 0, 0];
  const step = 1 / tickRate;
  const steps = Math.ceil(input.lifetime * tickRate);

  if (steps > MAX_SIMULATION_STEPS) {
    throw new Error(
      `motion simulation exceeds bounded step limit (${MAX_SIMULATION_STEPS}).`
    );
  }

  let apexY = 0;
  let timeToApex = 0;
  let maximumHorizontalDistance = 0;

  for (let index = 0; index < steps; index += 1) {
    const effectiveAcceleration: [number, number, number] = [
      acceleration[0] - velocity[0] * input.linear_drag_coefficient,
      acceleration[1] - velocity[1] * input.linear_drag_coefficient,
      acceleration[2] - velocity[2] * input.linear_drag_coefficient,
    ];

    velocity[0] += effectiveAcceleration[0] * step;
    velocity[1] += effectiveAcceleration[1] * step;
    velocity[2] += effectiveAcceleration[2] * step;

    position[0] += velocity[0] * step;
    position[1] += velocity[1] * step;
    position[2] += velocity[2] * step;

    const currentTime = (index + 1) * step;
    if (position[1] > apexY) {
      apexY = position[1];
      timeToApex = currentTime;
    }
    maximumHorizontalDistance = Math.max(
      maximumHorizontalDistance,
      Math.hypot(position[0], position[2])
    );
  }

  return {
    initial_velocity: [
      initialVelocity[0],
      initialVelocity[1],
      initialVelocity[2],
    ],
    final_velocity: [velocity[0], velocity[1], velocity[2]],
    final_position: [position[0], position[1], position[2]],
    apex_y: apexY,
    time_to_apex: timeToApex,
    maximum_horizontal_distance: maximumHorizontalDistance,
    steps,
    simulated_duration: steps * step,
  };
}

function outsideRange(
  value: number,
  range: { min?: number; max?: number }
): "below" | "above" | null {
  if (range.min !== undefined && value < range.min) return "below";
  if (range.max !== undefined && value > range.max) return "above";
  return null;
}

export function evaluateMotionEnvelope(
  result: MotionSimulationResult,
  envelope: MotionEnvelope
): ExperimentalParticleDiagnostic[] {
  const diagnostics: ExperimentalParticleDiagnostic[] = [];

  if (envelope.apex_y) {
    const relation = outsideRange(result.apex_y, envelope.apex_y);
    if (relation) {
      diagnostics.push({
        severity: "warning",
        code: PARTICLE_PREFLIGHT_DIAGNOSTIC_CODES.motionApexOutsideTarget,
        message: `Simulated apex ${result.apex_y.toFixed(2)} is ${relation} the authored target envelope.`,
      });
    }
  }

  if (envelope.horizontal_distance) {
    const relation = outsideRange(
      result.maximum_horizontal_distance,
      envelope.horizontal_distance
    );
    if (relation) {
      diagnostics.push({
        severity: "warning",
        code: PARTICLE_PREFLIGHT_DIAGNOSTIC_CODES.motionHorizontalDistanceOutsideTarget,
        message: `Simulated horizontal distance ${result.maximum_horizontal_distance.toFixed(2)} is ${relation} the authored target envelope.`,
      });
    }
  }

  return diagnostics;
}
