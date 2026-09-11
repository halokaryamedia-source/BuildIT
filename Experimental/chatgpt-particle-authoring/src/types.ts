export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export type JsonObject = { [key: string]: JsonValue };

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
