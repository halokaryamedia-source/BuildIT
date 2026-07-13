export type AcceptanceSeverity = "REVISION_REQUIRED" | "WARNING";

export interface AcceptanceIssue {
  code: string;
  severity: AcceptanceSeverity;
  message: string;
}

export function rootMotionAllowedFromPolicy(policy: unknown): boolean {
  const normalized = String(policy ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
  if (!normalized) return true;
  return !(
    normalized === "none" ||
    normalized.startsWith("none_") ||
    normalized.includes("no_root") ||
    normalized.includes("zero_root") ||
    normalized.includes("in_place") ||
    normalized.includes("root_translation_zero")
  );
}

function parseAtlas(value: unknown): [number, number] | null {
  if (typeof value !== "string") return null;
  const match = value.match(/^(\d+)\s*x\s*(\d+)$/i);
  return match ? [Number(match[1]), Number(match[2])] : null;
}

export interface FaceUvSnapshot {
  cube: string;
  face: string;
  uv: [number, number, number, number];
  mirror_uv?: boolean;
}

export function evaluateTextureContractQuality(input: {
  atlasWidth: number;
  atlasHeight: number;
  selectedAtlas?: string;
  minimumAtlas?: string;
  downgradeAllowed?: boolean;
  eyeContract?: {
    minimum_eye_face_width_pixels?: number;
    minimum_eye_face_height_pixels?: number;
    directional_uv_required?: boolean;
  };
  eyeFaces?: FaceUvSnapshot[];
}) {
  const issues: AcceptanceIssue[] = [];
  const selected = parseAtlas(input.selectedAtlas);
  const minimum = parseAtlas(input.minimumAtlas);
  if (
    selected &&
    (input.atlasWidth !== selected[0] || input.atlasHeight !== selected[1])
  ) {
    issues.push({
      code: "ATLAS_SIZE_MISMATCH",
      severity: "REVISION_REQUIRED",
      message: `Atlas is ${input.atlasWidth}x${input.atlasHeight}; selected contract is ${selected[0]}x${selected[1]}.`,
    });
  }
  if (
    minimum &&
    (input.atlasWidth < minimum[0] || input.atlasHeight < minimum[1]) &&
    input.downgradeAllowed !== true
  ) {
    issues.push({
      code: "ATLAS_DOWNGRADE_FORBIDDEN",
      severity: "REVISION_REQUIRED",
      message: `Atlas ${input.atlasWidth}x${input.atlasHeight} is below fixed minimum ${minimum[0]}x${minimum[1]}.`,
    });
  }

  const eyeContract = input.eyeContract;
  const eyeFaces = input.eyeFaces ?? [];
  if (eyeContract) {
    const minimumWidth = eyeContract.minimum_eye_face_width_pixels ?? 4;
    const minimumHeight = eyeContract.minimum_eye_face_height_pixels ?? 3;
    if (eyeFaces.length < 2) {
      issues.push({
        code: "EYE_UV_BUDGET_INSUFFICIENT",
        severity: "REVISION_REQUIRED",
        message: `Expected two lateral eye-bearing face UVs; found ${eyeFaces.length}.`,
      });
    }
    for (const face of eyeFaces) {
      const width = Math.abs(face.uv[2] - face.uv[0]);
      const height = Math.abs(face.uv[3] - face.uv[1]);
      if (width < minimumWidth || height < minimumHeight) {
        issues.push({
          code: "EYE_UV_BUDGET_INSUFFICIENT",
          severity: "REVISION_REQUIRED",
          message: `${face.cube}.${face.face} has ${width}x${height} usable texels; minimum is ${minimumWidth}x${minimumHeight}.`,
        });
      }
      if (face.mirror_uv === true && eyeContract.directional_uv_required) {
        issues.push({
          code: "FACIAL_DETAIL_ORIENTATION_FAILED",
          severity: "REVISION_REQUIRED",
          message: `${face.cube}.${face.face} mirrors a directional eye UV.`,
        });
      }
    }
    if (eyeContract.directional_uv_required && eyeFaces.length >= 2) {
      const normalized = eyeFaces.slice(0, 2).map((face) =>
        face.uv.map((value) => Number(value).toFixed(4)).join(",")
      );
      if (normalized[0] === normalized[1]) {
        issues.push({
          code: "FACIAL_DETAIL_ORIENTATION_FAILED",
          severity: "REVISION_REQUIRED",
          message: "Left and right eye-bearing faces reuse an identical directional UV rectangle.",
        });
      }
    }
  }

  return {
    status: issues.some((issue) => issue.severity === "REVISION_REQUIRED")
      ? ("REVISION_REQUIRED" as const)
      : ("PASS" as const),
    issues,
  };
}

export interface DetailedAnimationSnapshot {
  name: string;
  length: number;
  loop?: boolean;
  animator_count: number;
  keyframe_count: number;
  root_position_channels: number;
  scale_keyframe_count?: number;
  neutral_recovery_max_delta?: number | null;
}

export function evaluateAnimationContractQuality(input: {
  snapshots: DetailedAnimationSnapshot[];
  requiredClips: string[];
  forbiddenClips?: string[];
  requiredClipCount?: number;
  clipContracts?: Record<
    string,
    {
      length_seconds?: number;
      loop?: boolean;
      return_to_neutral?: boolean;
      root_translation_max_units?: number;
    }
  >;
  rootMotionPolicy?: string;
  scaleKeyframesAllowed?: boolean;
  neutralRecoveryRequired?: boolean;
  lengthToleranceSeconds?: number;
}) {
  const issues: AcceptanceIssue[] = [];
  const byName = new Map(input.snapshots.map((snapshot) => [snapshot.name, snapshot]));
  const tolerance = input.lengthToleranceSeconds ?? 0.025;
  const rootMotionAllowed = rootMotionAllowedFromPolicy(input.rootMotionPolicy);

  if (
    typeof input.requiredClipCount === "number" &&
    input.snapshots.length !== input.requiredClipCount
  ) {
    issues.push({
      code: "ANIMATION_CLIP_COUNT_MISMATCH",
      severity: "REVISION_REQUIRED",
      message: `Project has ${input.snapshots.length} animations; required count is ${input.requiredClipCount}.`,
    });
  }

  const forbidden = (input.forbiddenClips ?? []).map((value) => value.toLowerCase());
  for (const snapshot of input.snapshots) {
    const tail = snapshot.name.toLowerCase().split(".").pop() ?? "";
    if (forbidden.includes(tail)) {
      issues.push({
        code: "FORBIDDEN_ANIMATION_PRESENT",
        severity: "REVISION_REQUIRED",
        message: `Unapproved animation exists: ${snapshot.name}.`,
      });
    }
    if (input.scaleKeyframesAllowed === false && (snapshot.scale_keyframe_count ?? 0) > 0) {
      issues.push({
        code: "ANIMATION_SCALE_KEYFRAMES_FORBIDDEN",
        severity: "REVISION_REQUIRED",
        message: `${snapshot.name} contains ${snapshot.scale_keyframe_count} scale keyframe(s).`,
      });
    }
    if (!rootMotionAllowed && snapshot.root_position_channels > 0) {
      issues.push({
        code: "ANIMATION_ROOT_MOTION_FORBIDDEN",
        severity: "REVISION_REQUIRED",
        message: `${snapshot.name} contains root position channels under ${input.rootMotionPolicy}.`,
      });
    }
  }

  for (const name of input.requiredClips) {
    const snapshot = byName.get(name);
    if (!snapshot) continue;
    const contract = input.clipContracts?.[name];
    if (
      typeof contract?.length_seconds === "number" &&
      Math.abs(snapshot.length - contract.length_seconds) > tolerance
    ) {
      issues.push({
        code: "ANIMATION_CONTRACT_LENGTH_MISMATCH",
        severity: "REVISION_REQUIRED",
        message: `${name} length ${snapshot.length}s differs from ${contract.length_seconds}s.`,
      });
    }
    if (typeof contract?.loop === "boolean" && snapshot.loop !== contract.loop) {
      issues.push({
        code: "ANIMATION_LOOP_MODE_MISMATCH",
        severity: "REVISION_REQUIRED",
        message: `${name} loop=${String(snapshot.loop)}; expected ${contract.loop}.`,
      });
    }
    const recoveryRequired =
      contract?.return_to_neutral === true || input.neutralRecoveryRequired === true;
    if (
      recoveryRequired &&
      typeof snapshot.neutral_recovery_max_delta === "number" &&
      snapshot.neutral_recovery_max_delta > 0.05
    ) {
      issues.push({
        code: "ANIMATION_NEUTRAL_RECOVERY_FAILED",
        severity: "REVISION_REQUIRED",
        message: `${name} first/last transform delta is ${snapshot.neutral_recovery_max_delta}.`,
      });
    }
  }

  return {
    status: issues.some((issue) => issue.severity === "REVISION_REQUIRED")
      ? ("REVISION_REQUIRED" as const)
      : ("PASS" as const),
    root_motion_allowed: rootMotionAllowed,
    issues,
  };
}

export type PipelineStage =
  | "GEOMETRY"
  | "TEXTURE"
  | "ANIMATION"
  | "FINAL_VALIDATION";

export interface PipelineSimulationState {
  stage: PipelineStage;
  state: string;
  profile: string;
  revision: number;
  done: boolean;
}

export function simulateApprovedPipeline(animationRequired: boolean) {
  const trace: PipelineSimulationState[] = [];
  let revision = 0;
  const push = (stage: PipelineStage, state: string, profile: string, done = false) => {
    trace.push({ stage, state, profile, revision, done });
  };

  push("GEOMETRY", "GEOMETRY_IN_PROGRESS", "BEDROCK_CUBOID_GEOMETRY");
  revision += 1;
  push("GEOMETRY", "GEOMETRY_REVIEW", "BEDROCK_CUBOID_GEOMETRY");
  revision += 1;
  push("TEXTURE", "TEXTURE_IN_PROGRESS", "BEDROCK_CUBOID_TEXTURE");
  revision += 1;
  push("TEXTURE", "TEXTURE_REVIEW", "BEDROCK_CUBOID_TEXTURE");
  revision += 1;

  if (animationRequired) {
    push("ANIMATION", "ANIMATION_IN_PROGRESS", "BEDROCK_CUBOID_ANIMATION");
    revision += 1;
    push("ANIMATION", "ANIMATION_REVIEW", "BEDROCK_CUBOID_ANIMATION");
    revision += 1;
  }

  push("FINAL_VALIDATION", "FINAL_VALIDATION", "FINAL_VALIDATION_READONLY");
  revision += 1;
  push("FINAL_VALIDATION", "FINAL_REVIEW", "FINAL_VALIDATION_READONLY");
  revision += 1;
  push("FINAL_VALIDATION", "DONE", "FINAL_VALIDATION_READONLY", true);

  return trace;
}
