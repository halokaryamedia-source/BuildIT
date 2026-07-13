export interface QualityIssue {
  code: string;
  message: string;
  severity: "REVISION_REQUIRED" | "WARNING";
}

export interface TextureQualityContract {
  anti_aliasing_allowed?: boolean;
  maximum_partial_alpha_ratio?: number;
  minimum_opaque_ratio?: number;
  maximum_unique_colors?: number;
  palette_hex?: string[];
  maximum_palette_distance?: number;
  maximum_palette_outlier_ratio?: number;
}

function parseHex(value: string): [number, number, number] | null {
  const normalized = value.trim().replace(/^#/, "");
  if (!/^[a-f0-9]{6}$/i.test(normalized)) return null;
  return [
    Number.parseInt(normalized.slice(0, 2), 16),
    Number.parseInt(normalized.slice(2, 4), 16),
    Number.parseInt(normalized.slice(4, 6), 16),
  ];
}

function colorDistance(
  red: number,
  green: number,
  blue: number,
  palette: Array<[number, number, number]>
): number {
  if (!palette.length) return 0;
  return Math.min(
    ...palette.map((color) =>
      Math.hypot(red - color[0], green - color[1], blue - color[2])
    )
  );
}

export function analyzeTexturePixels(input: {
  width: number;
  height: number;
  data: ArrayLike<number>;
  contract?: TextureQualityContract;
}) {
  const contract = input.contract ?? {};
  const total = Math.max(1, input.width * input.height);
  const colors = new Set<string>();
  const palette = (contract.palette_hex ?? [])
    .map(parseHex)
    .filter((value): value is [number, number, number] => Boolean(value));
  let opaque = 0;
  let partialAlpha = 0;
  let paletteOutliers = 0;
  const maximumPaletteDistance = contract.maximum_palette_distance ?? 72;

  for (let pixel = 0; pixel < total; pixel += 1) {
    const offset = pixel * 4;
    const red = Number(input.data[offset] ?? 0);
    const green = Number(input.data[offset + 1] ?? 0);
    const blue = Number(input.data[offset + 2] ?? 0);
    const alpha = Number(input.data[offset + 3] ?? 0);
    if (alpha <= 0) continue;
    opaque += 1;
    if (alpha < 255) partialAlpha += 1;
    colors.add(`${red},${green},${blue},${alpha}`);
    if (
      palette.length > 0 &&
      colorDistance(red, green, blue, palette) > maximumPaletteDistance
    ) {
      paletteOutliers += 1;
    }
  }

  const opaqueRatio = opaque / total;
  const partialAlphaRatio = partialAlpha / Math.max(1, opaque);
  const paletteOutlierRatio = paletteOutliers / Math.max(1, opaque);
  const issues: QualityIssue[] = [];
  const minimumOpaqueRatio = contract.minimum_opaque_ratio ?? 0.005;
  if (opaqueRatio < minimumOpaqueRatio) {
    issues.push({
      code: "TEXTURE_EFFECTIVELY_BLANK",
      severity: "REVISION_REQUIRED",
      message: `Only ${(opaqueRatio * 100).toFixed(2)}% of atlas pixels are visible.`,
    });
  }
  if (
    contract.anti_aliasing_allowed === false &&
    partialAlphaRatio > (contract.maximum_partial_alpha_ratio ?? 0)
  ) {
    issues.push({
      code: "TEXTURE_PARTIAL_ALPHA_FORBIDDEN",
      severity: "REVISION_REQUIRED",
      message: `${partialAlpha} partially transparent pixel(s) violate the sharp-pixel contract.`,
    });
  }
  if (
    typeof contract.maximum_unique_colors === "number" &&
    colors.size > contract.maximum_unique_colors
  ) {
    issues.push({
      code: "TEXTURE_COLOR_BUDGET_EXCEEDED",
      severity: "REVISION_REQUIRED",
      message: `Atlas uses ${colors.size} colors; maximum is ${contract.maximum_unique_colors}.`,
    });
  }
  if (
    palette.length > 0 &&
    paletteOutlierRatio > (contract.maximum_palette_outlier_ratio ?? 0.2)
  ) {
    issues.push({
      code: "TEXTURE_PALETTE_DRIFT",
      severity: "REVISION_REQUIRED",
      message: `${(paletteOutlierRatio * 100).toFixed(2)}% of visible pixels are outside the approved palette tolerance.`,
    });
  }

  return {
    status: issues.some((issue) => issue.severity === "REVISION_REQUIRED")
      ? ("REVISION_REQUIRED" as const)
      : ("PASS" as const),
    metrics: {
      width: input.width,
      height: input.height,
      opaque_ratio: opaqueRatio,
      partial_alpha_ratio: partialAlphaRatio,
      unique_colors: colors.size,
      palette_outlier_ratio: paletteOutlierRatio,
    },
    issues,
  };
}

export interface AnimationSnapshot {
  name: string;
  length: number;
  animator_count: number;
  keyframe_count: number;
  root_position_channels: number;
}

export function evaluateAnimationQuality(input: {
  snapshots: AnimationSnapshot[];
  requiredClips: string[];
  existingGroups: string[];
  movingGroups?: string[];
  staticGroups?: string[];
  rootMotionAllowed?: boolean;
  minimumClipLength?: number;
  maximumClipLength?: number;
  requireAnimators?: boolean;
  requireKeyframes?: boolean;
}) {
  const issues: QualityIssue[] = [];
  const byName = new Map(input.snapshots.map((snapshot) => [snapshot.name, snapshot]));
  const groups = new Set(input.existingGroups);
  for (const name of input.requiredClips) {
    const clip = byName.get(name);
    if (!clip) {
      issues.push({
        code: "REQUIRED_ANIMATION_MISSING",
        severity: "REVISION_REQUIRED",
        message: `Required animation is missing: ${name}.`,
      });
      continue;
    }
    const minimum = input.minimumClipLength ?? 0.05;
    if (!Number.isFinite(clip.length) || clip.length < minimum) {
      issues.push({
        code: "ANIMATION_LENGTH_INVALID",
        severity: "REVISION_REQUIRED",
        message: `${name} length ${clip.length} is below ${minimum}.`,
      });
    }
    if (
      typeof input.maximumClipLength === "number" &&
      clip.length > input.maximumClipLength
    ) {
      issues.push({
        code: "ANIMATION_LENGTH_EXCESS",
        severity: "REVISION_REQUIRED",
        message: `${name} length ${clip.length} exceeds ${input.maximumClipLength}.`,
      });
    }
    if (input.requireAnimators !== false && clip.animator_count === 0) {
      issues.push({
        code: "ANIMATION_HAS_NO_ANIMATORS",
        severity: "REVISION_REQUIRED",
        message: `${name} has no animators.`,
      });
    }
    if (input.requireKeyframes !== false && clip.keyframe_count === 0) {
      issues.push({
        code: "ANIMATION_HAS_NO_KEYFRAMES",
        severity: "REVISION_REQUIRED",
        message: `${name} has no keyframes.`,
      });
    }
    if (input.rootMotionAllowed === false && clip.root_position_channels > 0) {
      issues.push({
        code: "ANIMATION_ROOT_MOTION_FORBIDDEN",
        severity: "REVISION_REQUIRED",
        message: `${name} contains root position motion while root motion is forbidden.`,
      });
    }
  }
  for (const group of [...(input.movingGroups ?? []), ...(input.staticGroups ?? [])]) {
    if (!groups.has(group)) {
      issues.push({
        code: "ANIMATION_GROUP_MISSING",
        severity: "REVISION_REQUIRED",
        message: `Animation contract references missing group: ${group}.`,
      });
    }
  }
  return {
    status: issues.some((issue) => issue.severity === "REVISION_REQUIRED")
      ? ("REVISION_REQUIRED" as const)
      : ("PASS" as const),
    snapshots: input.snapshots,
    issues,
  };
}

export interface SymmetryElement {
  name: string;
  center: [number, number, number];
  size: [number, number, number];
}

export interface SymmetryPairContract {
  id: string;
  left_patterns: string[];
  right_patterns: string[];
}

function includesPattern(name: string, patterns: string[]): boolean {
  const normalized = name.toLowerCase();
  return patterns.some((pattern) => normalized.includes(pattern.toLowerCase()));
}

function aggregateSymmetry(elements: SymmetryElement[]) {
  if (!elements.length) return null;
  const min: [number, number, number] = [Infinity, Infinity, Infinity];
  const max: [number, number, number] = [-Infinity, -Infinity, -Infinity];
  for (const element of elements) {
    for (let axis = 0; axis < 3; axis += 1) {
      min[axis] = Math.min(min[axis], element.center[axis] - element.size[axis] / 2);
      max[axis] = Math.max(max[axis], element.center[axis] + element.size[axis] / 2);
    }
  }
  return {
    center: [
      (min[0] + max[0]) / 2,
      (min[1] + max[1]) / 2,
      (min[2] + max[2]) / 2,
    ] as [number, number, number],
    size: [max[0] - min[0], max[1] - min[1], max[2] - min[2]] as [number, number, number],
  };
}

export function evaluateGeometrySymmetry(input: {
  policy?: string;
  elements: SymmetryElement[];
  pairs?: SymmetryPairContract[];
  asymmetryContracts?: Array<{ id: string; patterns: string[] }>;
  toleranceUnits?: number;
}) {
  const issues: QualityIssue[] = [];
  const policy = String(input.policy ?? "").toUpperCase();
  const tolerance = input.toleranceUnits ?? 0.35;
  if (!policy) {
    issues.push({
      code: "SYMMETRY_POLICY_MISSING",
      severity: "REVISION_REQUIRED",
      message: "Geometry manifest must declare BILATERAL or ASYMMETRIC symmetry policy.",
    });
  } else if (policy === "BILATERAL") {
    if (!(input.pairs?.length)) {
      issues.push({
        code: "SYMMETRY_PAIRS_MISSING",
        severity: "REVISION_REQUIRED",
        message: "BILATERAL geometry requires machine-readable left/right pair contracts.",
      });
    }
    for (const pair of input.pairs ?? []) {
      const left = aggregateSymmetry(
        input.elements.filter((element) => includesPattern(element.name, pair.left_patterns))
      );
      const right = aggregateSymmetry(
        input.elements.filter((element) => includesPattern(element.name, pair.right_patterns))
      );
      if (!left || !right) {
        issues.push({
          code: "SYMMETRY_PAIR_MISSING",
          severity: "REVISION_REQUIRED",
          message: `${pair.id} is missing its left or right Geometry counterpart.`,
        });
        continue;
      }
      const deltas = [
        Math.abs(left.center[0] + right.center[0]),
        Math.abs(left.center[1] - right.center[1]),
        Math.abs(left.center[2] - right.center[2]),
        ...left.size.map((value, axis) => Math.abs(value - right.size[axis])),
      ];
      if (Math.max(...deltas) > tolerance) {
        issues.push({
          code: "SYMMETRY_PAIR_MISMATCH",
          severity: "REVISION_REQUIRED",
          message: `${pair.id} exceeds bilateral tolerance ${tolerance}u (max delta ${Math.max(...deltas).toFixed(3)}u).`,
        });
      }
    }
  } else if (policy === "ASYMMETRIC") {
    if (!(input.asymmetryContracts?.length)) {
      issues.push({
        code: "ASYMMETRY_CONTRACT_MISSING",
        severity: "REVISION_REQUIRED",
        message: "ASYMMETRIC geometry requires explicit affected-part contracts.",
      });
    }
    for (const contract of input.asymmetryContracts ?? []) {
      if (!input.elements.some((element) => includesPattern(element.name, contract.patterns))) {
        issues.push({
          code: "ASYMMETRY_PART_MISSING",
          severity: "REVISION_REQUIRED",
          message: `Asymmetry contract ${contract.id} does not match current Geometry.`,
        });
      }
    }
  } else if (policy) {
    issues.push({
      code: "SYMMETRY_POLICY_INVALID",
      severity: "REVISION_REQUIRED",
      message: `Unsupported symmetry policy: ${policy}.`,
    });
  }
  return {
    status: issues.some((issue) => issue.severity === "REVISION_REQUIRED")
      ? ("REVISION_REQUIRED" as const)
      : ("PASS" as const),
    policy: policy || null,
    tolerance_units: tolerance,
    issues,
  };
}
