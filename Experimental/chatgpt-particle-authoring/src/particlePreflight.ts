export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export type JsonObject = { [key: string]: JsonValue };

export type ExperimentalParticleDiagnostic = {
  severity: "warning" | "error";
  code: string;
  message: string;
  path?: string;
};

export type MotionVector = readonly [number, number, number];

export type MotionSimulationInput = {
  direction: MotionVector;
  initial_speed: number;
  acceleration: MotionVector;
  linear_drag_coefficient: number;
  lifetime: number;
  tick_rate?: number;
};

export type MotionSimulationResult = {
  final_position: [number, number, number];
  apex_y: number;
  maximum_horizontal_distance: number;
  steps: number;
};

export type MotionEnvelope = {
  apex_y?: { min?: number; max?: number };
  horizontal_distance?: { min?: number; max?: number };
};

export type ParticleBundleEntry = {
  identifier: string;
  document: JsonObject;
};

const PER_FRAME_PARTICLE_COMPONENTS = [
  "minecraft:particle_motion_dynamic",
  "minecraft:particle_appearance_billboard",
  "minecraft:particle_appearance_tinting",
] as const;

function objectOf(value: JsonValue | undefined): JsonObject | null {
  return value !== undefined && value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as JsonObject)
    : null;
}

function componentMap(document: JsonObject): JsonObject {
  const effect = objectOf(document.particle_effect);
  return objectOf(effect?.components) ?? {};
}

function containsEmitterAge(value: JsonValue): boolean {
  if (typeof value === "string") {
    return /\b(?:variable|v)\.emitter_age\b/i.test(value);
  }
  if (Array.isArray(value)) return value.some((entry) => containsEmitterAge(entry));
  const current = objectOf(value);
  if (!current) return false;
  return Object.values(current).some((entry) => containsEmitterAge(entry));
}

export function analyzeSnowstormCompatibility(
  document: JsonObject
): ExperimentalParticleDiagnostic[] {
  const diagnostics: ExperimentalParticleDiagnostic[] = [];
  const components = componentMap(document);
  const initialSpeed = components["minecraft:particle_initial_speed"];

  if (Array.isArray(initialSpeed) && initialSpeed.length === 3) {
    diagnostics.push({
      severity: "warning",
      code: "snowstorm_initial_speed_vector_normalized",
      path: "particle_effect.components.minecraft:particle_initial_speed",
      message:
        "Snowstorm/Wintersky treats vector particle_initial_speed as a direction, normalizes it, and previews with linear speed 1. When authored magnitude matters, put the launch vector in the emitter shape direction and use scalar particle_initial_speed.",
    });
  }

  for (const componentName of PER_FRAME_PARTICLE_COMPONENTS) {
    const component = components[componentName];
    if (component !== undefined && containsEmitterAge(component)) {
      diagnostics.push({
        severity: "warning",
        code: "unstable_emitter_age_particle_property",
        path: `particle_effect.components.${componentName}`,
        message:
          "This living-particle property references variable.emitter_age. If the expression changes class, motion, UV, size, or opacity at an emitter threshold, existing particles can pop or change behavior mid-life. Prefer particle_random/particle_age/particle_lifetime for stable particle-owned behavior.",
      });
    }
  }

  return diagnostics;
}

function finiteNumber(value: number, label: string): number {
  if (!Number.isFinite(value)) throw new Error(`${label} must be finite.`);
  return value;
}

function normalizedDirection(direction: MotionVector): [number, number, number] {
  const [x, y, z] = direction.map((value, index) =>
    finiteNumber(value, `direction[${index}]`)
  ) as [number, number, number];
  const magnitude = Math.hypot(x, y, z);
  if (magnitude <= 0) throw new Error("direction must have non-zero magnitude.");
  return [x / magnitude, y / magnitude, z / magnitude];
}

/**
 * Bounded diagnostic approximation of Wintersky dynamic motion for constant
 * numeric inputs. It intentionally does not evaluate Molang, collision, local
 * space, events, or parametric motion.
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
  if (!Number.isFinite(input.linear_drag_coefficient) || input.linear_drag_coefficient < 0) {
    throw new Error("linear_drag_coefficient must be a finite non-negative number.");
  }

  const direction = normalizedDirection(input.direction);
  const speedMagnitude = finiteNumber(input.initial_speed, "initial_speed");
  const acceleration = input.acceleration.map((value, index) =>
    finiteNumber(value, `acceleration[${index}]`)
  ) as [number, number, number];

  const velocity = direction.map((value) => value * speedMagnitude) as [number, number, number];
  const position: [number, number, number] = [0, 0, 0];
  let apexY = 0;
  let maximumHorizontalDistance = 0;
  const step = 1 / tickRate;
  const steps = Math.ceil(input.lifetime * tickRate);

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

    apexY = Math.max(apexY, position[1]);
    maximumHorizontalDistance = Math.max(
      maximumHorizontalDistance,
      Math.hypot(position[0], position[2])
    );
  }

  return {
    final_position: position,
    apex_y: apexY,
    maximum_horizontal_distance: maximumHorizontalDistance,
    steps,
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
        code: "motion_apex_outside_target",
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
        code: "motion_horizontal_distance_outside_target",
        message: `Simulated horizontal distance ${result.maximum_horizontal_distance.toFixed(2)} is ${relation} the authored target envelope.`,
      });
    }
  }

  return diagnostics;
}

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
  const identifiers = new Set(entries.map((entry) => entry.identifier));

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
          code: "missing_particle_bundle_reference",
          path: `bundle.${entry.identifier}.events`,
          message: `Particle effect ${entry.identifier} references missing child effect ${identifier}.`,
        });
      }
    }
  }

  return diagnostics;
}
