export type Route1Vec3 = [number, number, number];

export type Route1WorldBounds = {
  min: Route1Vec3;
  max: Route1Vec3;
};

export type Route1TargetDimensionsBlocks = {
  width: number;
  height: number;
  length: number;
};

export type Route1Axis = "width" | "height" | "length";

export type Route1FitEnvelopePlan = {
  policy: "fit_envelope";
  blockbench_units_per_block: number;
  current_uniform_scale: number;
  scale_multiplier: number;
  next_uniform_scale: number;
  observed_dimensions_units: Route1TargetDimensionsBlocks;
  target_dimensions_blocks: Route1TargetDimensionsBlocks;
  target_dimensions_units: Route1TargetDimensionsBlocks;
  aligned_dimensions_units: Route1TargetDimensionsBlocks;
  coverage_ratio: Route1TargetDimensionsBlocks;
  limiting_axes: Route1Axis[];
};

export type Route1CenterGroundPlan = {
  policy: "center_xz_ground_y";
  current_origin: Route1Vec3;
  target_anchor: {
    center_x: number;
    ground_y: number;
    center_z: number;
  };
  translation_delta: Route1Vec3;
  next_origin: Route1Vec3;
  expected_bounds: Route1WorldBounds;
};

function requirePositiveFinite(value: number, label: string): void {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${label} must be finite and positive.`);
  }
}

function requireFiniteVec3(value: readonly number[], label: string): void {
  if (
    value.length < 3 ||
    !value.slice(0, 3).every((component) => Number.isFinite(component))
  ) {
    throw new Error(`${label} must contain three finite values.`);
  }
}

function requireBounds(bounds: Route1WorldBounds): void {
  requireFiniteVec3(bounds.min, "Route 1 bounds min");
  requireFiniteVec3(bounds.max, "Route 1 bounds max");
  for (let axis = 0; axis < 3; axis += 1) {
    if (bounds.max[axis] <= bounds.min[axis]) {
      throw new Error(
        `Route 1 bounds max[${axis}] must be greater than min[${axis}].`
      );
    }
  }
}

function boundsDimensions(
  bounds: Route1WorldBounds
): Route1TargetDimensionsBlocks {
  requireBounds(bounds);
  return {
    width: bounds.max[0] - bounds.min[0],
    height: bounds.max[1] - bounds.min[1],
    length: bounds.max[2] - bounds.min[2],
  };
}

function requireDimensions(
  dimensions: Route1TargetDimensionsBlocks,
  label: string
): void {
  requirePositiveFinite(dimensions.width, `${label}.width`);
  requirePositiveFinite(dimensions.height, `${label}.height`);
  requirePositiveFinite(dimensions.length, `${label}.length`);
}

function scaleDimensions(
  dimensions: Route1TargetDimensionsBlocks,
  multiplier: number
): Route1TargetDimensionsBlocks {
  return {
    width: dimensions.width * multiplier,
    height: dimensions.height * multiplier,
    length: dimensions.length * multiplier,
  };
}

export function planRoute1FitEnvelopeScale(input: {
  observed_bounds: Route1WorldBounds;
  target_dimensions_blocks: Route1TargetDimensionsBlocks;
  blockbench_units_per_block: number;
  current_uniform_scale?: number;
}): Route1FitEnvelopePlan {
  const observed = boundsDimensions(input.observed_bounds);
  requireDimensions(input.target_dimensions_blocks, "Route 1 target dimensions");
  requirePositiveFinite(
    input.blockbench_units_per_block,
    "Route 1 blockbench_units_per_block"
  );

  const currentUniformScale = input.current_uniform_scale ?? 1;
  requirePositiveFinite(currentUniformScale, "Route 1 current_uniform_scale");

  const targetUnits = scaleDimensions(
    input.target_dimensions_blocks,
    input.blockbench_units_per_block
  );
  const ratios: Record<Route1Axis, number> = {
    width: targetUnits.width / observed.width,
    height: targetUnits.height / observed.height,
    length: targetUnits.length / observed.length,
  };
  const scaleMultiplier = Math.min(
    ratios.width,
    ratios.height,
    ratios.length
  );
  requirePositiveFinite(scaleMultiplier, "Route 1 fit-envelope scale multiplier");

  const aligned = scaleDimensions(observed, scaleMultiplier);
  const coverage = {
    width: aligned.width / targetUnits.width,
    height: aligned.height / targetUnits.height,
    length: aligned.length / targetUnits.length,
  };
  const tolerance = Math.max(1, Math.abs(scaleMultiplier)) * 1e-9;
  const limitingAxes = (Object.keys(ratios) as Route1Axis[]).filter(
    (axis) => Math.abs(ratios[axis] - scaleMultiplier) <= tolerance
  );

  return {
    policy: "fit_envelope",
    blockbench_units_per_block: input.blockbench_units_per_block,
    current_uniform_scale: currentUniformScale,
    scale_multiplier: scaleMultiplier,
    next_uniform_scale: currentUniformScale * scaleMultiplier,
    observed_dimensions_units: observed,
    target_dimensions_blocks: { ...input.target_dimensions_blocks },
    target_dimensions_units: targetUnits,
    aligned_dimensions_units: aligned,
    coverage_ratio: coverage,
    limiting_axes: limitingAxes,
  };
}

export function planRoute1CenterGroundTranslation(input: {
  observed_bounds_after_scale: Route1WorldBounds;
  current_origin: Route1Vec3;
  target_center_x?: number;
  target_ground_y?: number;
  target_center_z?: number;
}): Route1CenterGroundPlan {
  requireBounds(input.observed_bounds_after_scale);
  requireFiniteVec3(input.current_origin, "Route 1 current_origin");

  const centerX =
    (input.observed_bounds_after_scale.min[0] +
      input.observed_bounds_after_scale.max[0]) /
    2;
  const centerZ =
    (input.observed_bounds_after_scale.min[2] +
      input.observed_bounds_after_scale.max[2]) /
    2;
  const targetCenterX = input.target_center_x ?? 0;
  const targetGroundY = input.target_ground_y ?? 0;
  const targetCenterZ = input.target_center_z ?? 0;

  for (const [label, value] of [
    ["target_center_x", targetCenterX],
    ["target_ground_y", targetGroundY],
    ["target_center_z", targetCenterZ],
  ] as const) {
    if (!Number.isFinite(value)) {
      throw new Error(`Route 1 ${label} must be finite.`);
    }
  }

  const translationDelta: Route1Vec3 = [
    targetCenterX - centerX,
    targetGroundY - input.observed_bounds_after_scale.min[1],
    targetCenterZ - centerZ,
  ];
  const nextOrigin: Route1Vec3 = [
    input.current_origin[0] + translationDelta[0],
    input.current_origin[1] + translationDelta[1],
    input.current_origin[2] + translationDelta[2],
  ];
  const expectedBounds: Route1WorldBounds = {
    min: [
      input.observed_bounds_after_scale.min[0] + translationDelta[0],
      input.observed_bounds_after_scale.min[1] + translationDelta[1],
      input.observed_bounds_after_scale.min[2] + translationDelta[2],
    ],
    max: [
      input.observed_bounds_after_scale.max[0] + translationDelta[0],
      input.observed_bounds_after_scale.max[1] + translationDelta[1],
      input.observed_bounds_after_scale.max[2] + translationDelta[2],
    ],
  };

  return {
    policy: "center_xz_ground_y",
    current_origin: [...input.current_origin] as Route1Vec3,
    target_anchor: {
      center_x: targetCenterX,
      ground_y: targetGroundY,
      center_z: targetCenterZ,
    },
    translation_delta: translationDelta,
    next_origin: nextOrigin,
    expected_bounds: expectedBounds,
  };
}
