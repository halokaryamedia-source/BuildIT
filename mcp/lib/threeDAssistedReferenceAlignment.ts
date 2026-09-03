export type ThreeDAssistedVec3 = [number, number, number];

export type ThreeDAssistedWorldBounds = {
  min: ThreeDAssistedVec3;
  max: ThreeDAssistedVec3;
};

export type ThreeDAssistedTargetDimensionsBlocks = {
  width: number;
  height: number;
  length: number;
};

export type ThreeDAssistedAxis = "width" | "height" | "length";

export type ThreeDAssistedFitEnvelopePlan = {
  policy: "fit_envelope";
  blockbench_units_per_block: number;
  current_uniform_scale: number;
  scale_multiplier: number;
  next_uniform_scale: number;
  observed_dimensions_units: ThreeDAssistedTargetDimensionsBlocks;
  target_dimensions_blocks: ThreeDAssistedTargetDimensionsBlocks;
  target_dimensions_units: ThreeDAssistedTargetDimensionsBlocks;
  aligned_dimensions_units: ThreeDAssistedTargetDimensionsBlocks;
  coverage_ratio: ThreeDAssistedTargetDimensionsBlocks;
  limiting_axes: ThreeDAssistedAxis[];
};

export type ThreeDAssistedCenterGroundPlan = {
  policy: "center_xz_ground_y";
  current_origin: ThreeDAssistedVec3;
  target_anchor: {
    center_x: number;
    ground_y: number;
    center_z: number;
  };
  translation_delta: ThreeDAssistedVec3;
  next_origin: ThreeDAssistedVec3;
  expected_bounds: ThreeDAssistedWorldBounds;
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

function requireBounds(bounds: ThreeDAssistedWorldBounds): void {
  requireFiniteVec3(bounds.min, "3D-Assisted bounds min");
  requireFiniteVec3(bounds.max, "3D-Assisted bounds max");
  for (let axis = 0; axis < 3; axis += 1) {
    if (bounds.max[axis] <= bounds.min[axis]) {
      throw new Error(
        `3D-Assisted bounds max[${axis}] must be greater than min[${axis}].`
      );
    }
  }
}

function boundsDimensions(
  bounds: ThreeDAssistedWorldBounds
): ThreeDAssistedTargetDimensionsBlocks {
  requireBounds(bounds);
  return {
    width: bounds.max[0] - bounds.min[0],
    height: bounds.max[1] - bounds.min[1],
    length: bounds.max[2] - bounds.min[2],
  };
}

function requireDimensions(
  dimensions: ThreeDAssistedTargetDimensionsBlocks,
  label: string
): void {
  requirePositiveFinite(dimensions.width, `${label}.width`);
  requirePositiveFinite(dimensions.height, `${label}.height`);
  requirePositiveFinite(dimensions.length, `${label}.length`);
}

function scaleDimensions(
  dimensions: ThreeDAssistedTargetDimensionsBlocks,
  multiplier: number
): ThreeDAssistedTargetDimensionsBlocks {
  return {
    width: dimensions.width * multiplier,
    height: dimensions.height * multiplier,
    length: dimensions.length * multiplier,
  };
}

export function planThreeDAssistedFitEnvelopeScale(input: {
  observed_bounds: ThreeDAssistedWorldBounds;
  target_dimensions_blocks: ThreeDAssistedTargetDimensionsBlocks;
  blockbench_units_per_block: number;
  current_uniform_scale?: number;
}): ThreeDAssistedFitEnvelopePlan {
  const observed = boundsDimensions(input.observed_bounds);
  requireDimensions(input.target_dimensions_blocks, "3D-Assisted target dimensions");
  requirePositiveFinite(
    input.blockbench_units_per_block,
    "3D-Assisted blockbench_units_per_block"
  );

  const currentUniformScale = input.current_uniform_scale ?? 1;
  requirePositiveFinite(currentUniformScale, "3D-Assisted current_uniform_scale");

  const targetUnits = scaleDimensions(
    input.target_dimensions_blocks,
    input.blockbench_units_per_block
  );
  const ratios: Record<ThreeDAssistedAxis, number> = {
    width: targetUnits.width / observed.width,
    height: targetUnits.height / observed.height,
    length: targetUnits.length / observed.length,
  };
  const scaleMultiplier = Math.min(
    ratios.width,
    ratios.height,
    ratios.length
  );
  requirePositiveFinite(scaleMultiplier, "3D-Assisted fit-envelope scale multiplier");

  const aligned = scaleDimensions(observed, scaleMultiplier);
  const coverage = {
    width: aligned.width / targetUnits.width,
    height: aligned.height / targetUnits.height,
    length: aligned.length / targetUnits.length,
  };
  const tolerance = Math.max(1, Math.abs(scaleMultiplier)) * 1e-9;
  const limitingAxes = (Object.keys(ratios) as ThreeDAssistedAxis[]).filter(
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

export function planThreeDAssistedCenterGroundTranslation(input: {
  observed_bounds_after_scale: ThreeDAssistedWorldBounds;
  current_origin: ThreeDAssistedVec3;
  target_center_x?: number;
  target_ground_y?: number;
  target_center_z?: number;
}): ThreeDAssistedCenterGroundPlan {
  requireBounds(input.observed_bounds_after_scale);
  requireFiniteVec3(input.current_origin, "3D-Assisted current_origin");

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
      throw new Error(`3D-Assisted ${label} must be finite.`);
    }
  }

  const translationDelta: ThreeDAssistedVec3 = [
    targetCenterX - centerX,
    targetGroundY - input.observed_bounds_after_scale.min[1],
    targetCenterZ - centerZ,
  ];
  const nextOrigin: ThreeDAssistedVec3 = [
    input.current_origin[0] + translationDelta[0],
    input.current_origin[1] + translationDelta[1],
    input.current_origin[2] + translationDelta[2],
  ];
  const expectedBounds: ThreeDAssistedWorldBounds = {
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
    current_origin: [...input.current_origin] as ThreeDAssistedVec3,
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
