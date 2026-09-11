import type {
  KeepOutCylinder,
  MotionEnvelope,
  MotionSimulationInput,
  ParticleEmitterBudgetInput,
  ParticleIntentContract,
  SpatialPoint,
} from "../../src";

export const VOLCANO_GOLDEN_INTENT: ParticleIntentContract = {
  effect_name: "mivubi:volcano_eruption",
  target_runtime: "snowstorm",
  view_distance_blocks: 100,
  total_duration_seconds: 30,
  motion_targets: [
    {
      id: "heavy_bomb",
      envelope: {
        apex_y: { min: 15, max: 23 },
        horizontal_distance: { min: 28, max: 40 },
      },
    },
    {
      id: "plume_rise",
      envelope: {
        apex_y: { min: 22, max: 34 },
      },
    },
  ],
};

export const VOLCANO_HEAVY_BOMB_MOTION: MotionSimulationInput = {
  direction: [-0.1, 0.94, 0.45],
  initial_speed: 17,
  acceleration: [0, -6, 0],
  linear_drag_coefficient: 0.06,
  lifetime: 6,
};

export const VOLCANO_HEAVY_BOMB_ENVELOPE: MotionEnvelope = {
  apex_y: { min: 15, max: 23 },
  horizontal_distance: { min: 28, max: 40 },
};

export const VOLCANO_KEEP_OUT: KeepOutCylinder = {
  radius: 3,
  min_y: 0,
  max_y: 20,
};

export const VOLCANO_RING_SAMPLES: SpatialPoint[] = [
  [4.5, 1, 0],
  [-4.5, 1, 0],
  [0, 1, 4.5],
  [0, 1, -4.5],
];

export const VOLCANO_EFFECTIVE_EMITTER_BUDGET: ParticleEmitterBudgetInput[] = [
  { name: "core", spawn_rate: 18, average_lifetime: 1.4, max_particles: 30 },
  { name: "bombs", spawn_rate: 7.5, average_lifetime: 3.2, max_particles: 32 },
  { name: "plume_rise", spawn_rate: 8.5, average_lifetime: 5, max_particles: 52 },
  { name: "plume_crown", spawn_rate: 5, average_lifetime: 4, max_particles: 42 },
];
