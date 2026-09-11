export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export type JsonObject = { [key: string]: JsonValue };

export type MotionVector = readonly [number, number, number];
export type SpatialPoint = readonly [number, number, number];

export type MotionSimulationInput = {
  direction: MotionVector;
  initial_speed: number;
  acceleration: MotionVector;
  linear_drag_coefficient: number;
  lifetime: number;
  tick_rate?: number;
};

export type MotionSimulationResult = {
  initial_velocity: [number, number, number];
  final_velocity: [number, number, number];
  final_position: [number, number, number];
  apex_y: number;
  time_to_apex: number;
  maximum_horizontal_distance: number;
  steps: number;
  simulated_duration: number;
};

export type MotionEnvelope = {
  apex_y?: { min?: number; max?: number };
  horizontal_distance?: { min?: number; max?: number };
};

export type ParticleBundleEntry = {
  identifier: string;
  document: JsonObject;
};

export type ParticleBundleValidationInput = {
  entries: readonly ParticleBundleEntry[];
  root_identifier?: string;
  available_texture_paths?: readonly string[];
};

export type TextureAtlasGrid = {
  columns: number;
  rows: number;
  min_gutter?: number;
  require_unique_cells?: boolean;
};

export type TextureAtlasInput = {
  width: number;
  height: number;
  rgba: Uint8Array;
  grid: TextureAtlasGrid;
  alpha_threshold?: number;
  neutral_white_threshold?: number;
};

export type TextureAtlasSummary = {
  width: number;
  height: number;
  columns: number;
  rows: number;
  cell_width: number;
  cell_height: number;
  transparent_pixels: number;
  visible_white_pixels: number;
  minimum_gutter: number | null;
  unique_cells: number;
  total_cells: number;
};

export type ParticleIntentMotionTarget = {
  id: string;
  envelope: MotionEnvelope;
};

export type ParticleIntentContract = {
  effect_name: string;
  target_runtime: "bedrock" | "snowstorm";
  view_distance_blocks?: number;
  total_duration_seconds?: number;
  motion_targets?: readonly ParticleIntentMotionTarget[];
};

export type KeepOutCylinder = {
  radius: number;
  min_y: number;
  max_y: number;
  center_x?: number;
  center_z?: number;
};

export type SpatialPreflightResult = {
  sample_count: number;
  inside_keep_out_count: number;
  overlap_fraction: number;
  diagnostics: import("./diagnostics").ExperimentalParticleDiagnostic[];
};

export type ViewDistanceReadabilityInput = {
  size_blocks: number;
  distance_blocks: number;
  minimum_angular_degrees?: number;
  label?: string;
};

export type ViewDistanceReadabilityResult = {
  angular_size_degrees: number;
  minimum_angular_degrees: number;
  diagnostics: import("./diagnostics").ExperimentalParticleDiagnostic[];
};

export type ParticleEmitterBudgetInput = {
  name: string;
  spawn_rate: number;
  average_lifetime: number;
  max_particles: number;
};

export type ParticlePerformanceBudget = {
  max_visible_particles: number;
};

export type ParticlePerformanceEstimate = {
  emitters: { name: string; estimated_peak_visible: number }[];
  estimated_peak_visible: number;
  budget: ParticlePerformanceBudget;
  diagnostics: import("./diagnostics").ExperimentalParticleDiagnostic[];
};
