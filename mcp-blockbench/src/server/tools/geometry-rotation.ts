/// <reference types="three" />
/// <reference types="blockbench-types" />

import { z } from "zod";
import {
  createTool,
  getAllToolDefinitions,
  type ToolContext,
  type ToolSpec,
} from "@/lib/factories";
import { STATUS_EXPERIMENTAL } from "@/lib/constants";
import {
  assertInsideRoot,
  readJsonFile,
  writeJsonAtomically,
  type NativeFsLike,
} from "@/lib/atomicFiles";
import {
  mergeGeometryReferenceProfile,
  type AnchorSelector,
  type GeometryAxis,
  type GeometryPartConstraint,
  type GeometryRotationContract,
  type StandardGeometryView,
  type Vec3,
} from "@/lib/geometryReferenceProfiles";
import { rotatePointAroundOrigin } from "@/lib/worldBounds";

const rotateCubeAboutAttachmentParameters = z.object({
  session_root: z.string().min(1),
  cube: z.string().min(1),
  contract_id: z.string().min(1).optional(),
  angle_degrees: z.number().finite().optional(),
  connection_target: z.string().min(1).optional(),
  smart_fit: z.boolean().optional().default(true),
  size_strategy: z
    .enum(["CONSTRAINT_MIDPOINT", "PRESERVE_WITHIN_CONSTRAINT"])
    .optional(),
  snap_to_connection: z.boolean().optional().default(true),
  reject_visual_regression: z.boolean().optional().default(true),
  maximum_score_regression: z.number().min(0).max(0.2).optional().default(0.01),
});

export const geometryRotationToolDocs: ToolSpec[] = [
  {
    name: "rotate_cube_about_attachment",
    description:
      "Smart-fits one cuboid from a machine-readable attachment contract. By default it resolves a contract-sized cuboid, derives the best one-axis angle, places an explicit end-face pivot, snaps that pivot to the connected part, translates from/to/origin together, validates direction and connection, compares affected views, and writes pivot/rotation evidence. Pass angle_degrees only to override the automatic solver.",
    annotations: {
      title: "Smart-Fit Rotated Cuboid",
      destructiveHint: true,
      openWorldHint: true,
    },
    parameters: rotateCubeAboutAttachmentParameters,
    status: STATUS_EXPERIMENTAL,
  },
];

interface ManifestLike {
  reference_visual_lock?: { sha256?: string };
  visual_grounding?: Record<string, any>;
  geometry?: Record<string, any>;
}

interface TransformParent {
  origin?: number[];
  rotation?: number[];
  parent?: TransformParent | "root";
}

interface AttachmentFitSnapshot {
  from: Vec3;
  to: Vec3;
  origin: Vec3;
  rotation: Vec3;
  size: Vec3;
}

const AXES: GeometryAxis[] = ["x", "y", "z"];

function joinPath(root: string, relative: string): string {
  const separator = root.includes("\\") && !root.includes("/") ? "\\" : "/";
  return `${root.replace(/[\\/]$/, "")}${separator}${relative.replace(/^[\\/]/, "")}`;
}

function nativeFs(message: string): NativeFsLike {
  // @ts-ignore - Blockbench runtime permission API.
  const fs = requireNativeModule("fs", { message, optional: false });
  if (!fs) throw new Error("Filesystem access was denied.");
  return fs as NativeFsLike;
}

function axisIndex(axis: GeometryAxis): 0 | 1 | 2 {
  return axis === "y" ? 1 : axis === "z" ? 2 : 0;
}

function vec(value: number[]): Vec3 {
  return [Number(value[0]), Number(value[1]), Number(value[2])];
}

function add(a: Vec3, b: Vec3): Vec3 {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function subtract(a: Vec3, b: Vec3): Vec3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function multiply(value: Vec3, scalar: number): Vec3 {
  return [value[0] * scalar, value[1] * scalar, value[2] * scalar];
}

function magnitude(value: Vec3): number {
  return Math.hypot(value[0], value[1], value[2]);
}

function normalize(value: Vec3): Vec3 {
  const length = magnitude(value);
  if (length <= 1e-8) return [0, 0, 0];
  return [value[0] / length, value[1] / length, value[2] / length];
}

function dot(a: Vec3, b: Vec3): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function distance(a: Vec3, b: Vec3): number {
  return magnitude(subtract(a, b));
}

function midpoint(a: Vec3, b: Vec3): Vec3 {
  return multiply(add(a, b), 0.5);
}

function sizeOf(from: Vec3, to: Vec3): Vec3 {
  return [
    Math.abs(to[0] - from[0]),
    Math.abs(to[1] - from[1]),
    Math.abs(to[2] - from[2]),
  ];
}

function boundsFromCenter(center: Vec3, size: Vec3): { from: Vec3; to: Vec3 } {
  const half = multiply(size, 0.5);
  return {
    from: subtract(center, half),
    to: add(center, half),
  };
}

function anchorCoordinate(
  minimum: number,
  maximum: number,
  selector: AnchorSelector
): number {
  if (selector === "min") return Math.min(minimum, maximum);
  if (selector === "max") return Math.max(minimum, maximum);
  return (minimum + maximum) / 2;
}

function anchorPointFromBounds(
  from: Vec3,
  to: Vec3,
  selector: [AnchorSelector, AnchorSelector, AnchorSelector]
): Vec3 {
  return [
    anchorCoordinate(from[0], to[0], selector[0]),
    anchorCoordinate(from[1], to[1], selector[1]),
    anchorCoordinate(from[2], to[2], selector[2]),
  ];
}

function anchorPoint(
  cube: Cube,
  selector: [AnchorSelector, AnchorSelector, AnchorSelector]
): Vec3 {
  return anchorPointFromBounds(vec(cube.from), vec(cube.to), selector);
}

export function centerlineAnchorFromBounds(input: {
  from: Vec3;
  to: Vec3;
  longAxis: GeometryAxis;
  end: AnchorSelector;
}): Vec3 {
  const selector: [AnchorSelector, AnchorSelector, AnchorSelector] = [
    "center",
    "center",
    "center",
  ];
  selector[axisIndex(input.longAxis)] = input.end;
  return anchorPointFromBounds(input.from, input.to, selector);
}

function parentChain(cube: Cube): TransformParent[] {
  const result: TransformParent[] = [];
  let parent = cube.parent as unknown as TransformParent | "root";
  const visited = new Set<unknown>();
  while (parent && parent !== "root" && !visited.has(parent)) {
    visited.add(parent);
    result.push(parent);
    parent = parent.parent ?? "root";
  }
  return result;
}

function transformPointForCube(point: Vec3, cube: Cube): Vec3 {
  let transformed = rotatePointAroundOrigin(
    point,
    vec(cube.origin),
    vec(cube.rotation)
  );
  for (const parent of parentChain(cube)) {
    const origin = Array.isArray(parent.origin) ? vec(parent.origin) : [0, 0, 0];
    const rotation = Array.isArray(parent.rotation)
      ? vec(parent.rotation)
      : [0, 0, 0];
    transformed = rotatePointAroundOrigin(transformed, origin, rotation);
  }
  return transformed;
}

function transformVectorForParents(vector: Vec3, cube: Cube): Vec3 {
  let transformed = vector;
  for (const parent of parentChain(cube)) {
    const rotation = Array.isArray(parent.rotation)
      ? vec(parent.rotation)
      : [0, 0, 0];
    transformed = rotatePointAroundOrigin(transformed, [0, 0, 0], rotation);
  }
  return transformed;
}

function worldVectorToParentLocal(vector: Vec3, cube: Cube): Vec3 {
  let transformed = vector;
  const parents = parentChain(cube);
  for (let index = parents.length - 1; index >= 0; index -= 1) {
    const rotation = Array.isArray(parents[index].rotation)
      ? vec(parents[index].rotation as number[])
      : [0, 0, 0];
    transformed = rotatePointAroundOrigin(
      transformed,
      [0, 0, 0],
      [-rotation[0], -rotation[1], -rotation[2]]
    );
  }
  return transformed;
}

function nameMatches(name: string, patterns: string[]): boolean {
  const normalized = name.toLowerCase();
  return patterns.some((pattern) => normalized.includes(pattern.toLowerCase()));
}

function resolveContract(
  profile: NonNullable<ReturnType<typeof mergeGeometryReferenceProfile>>,
  cube: Cube,
  contractId?: string
): GeometryRotationContract {
  if (contractId) {
    const contract = profile.rotation_contracts[contractId];
    if (!contract) throw new Error(`ROTATION_CONTRACT_MISSING: ${contractId}`);
    if (!nameMatches(cube.name, contract.cube_patterns)) {
      throw new Error(
        `ROTATION_CONTRACT_CUBE_MISMATCH: ${cube.name} does not match ${contractId}.`
      );
    }
    return contract;
  }
  const matches = Object.values(profile.rotation_contracts).filter((contract) =>
    nameMatches(cube.name, contract.cube_patterns)
  );
  if (matches.length === 0) {
    throw new Error(
      `ROTATION_CONTRACT_MISSING: no contract matches cube ${cube.name}.`
    );
  }
  if (matches.length > 1) {
    throw new Error(
      `ROTATION_CONTRACT_AMBIGUOUS: ${cube.name} matches ${matches
        .map((contract) => contract.id)
        .join(", ")}. Pass contract_id explicitly.`
    );
  }
  return matches[0];
}

function matchingConstraint(
  profile: NonNullable<ReturnType<typeof mergeGeometryReferenceProfile>>,
  cube: Cube,
  contract: GeometryRotationContract
): GeometryPartConstraint | null {
  const matches = profile.part_constraints.filter((constraint) =>
    constraint.name_patterns.some((pattern) =>
      cube.name.toLowerCase().includes(pattern.toLowerCase())
    )
  );
  return (
    matches.find((constraint) => constraint.rotation_contract === contract.id) ??
    matches[0] ??
    null
  );
}

export function inferLongAxisFromSize(
  size: Vec3,
  explicit?: GeometryAxis
): GeometryAxis {
  if (explicit) return explicit;
  let largest: 0 | 1 | 2 = 0;
  if (size[1] > size[largest]) largest = 1;
  if (size[2] > size[largest]) largest = 2;
  return AXES[largest];
}

function constraintMidpointSize(
  cube: Cube,
  constraint: GeometryPartConstraint | null,
  strategy: "CONSTRAINT_MIDPOINT" | "PRESERVE_WITHIN_CONSTRAINT"
): Vec3 {
  const actual = sizeOf(vec(cube.from), vec(cube.to));
  const range = constraint?.size_range_units;
  if (!range) return actual;
  return actual.map((value, index) => {
    const minimum = Number(range.min[index]);
    const maximum = Number(range.max[index]);
    if (
      strategy === "PRESERVE_WITHIN_CONSTRAINT" &&
      value >= minimum &&
      value <= maximum
    ) {
      return value;
    }
    return (minimum + maximum) / 2;
  }) as Vec3;
}

function centerlineAnchorForCube(
  cube: Cube,
  longAxis: GeometryAxis,
  selector: [AnchorSelector, AnchorSelector, AnchorSelector]
): Vec3 {
  return centerlineAnchorFromBounds({
    from: vec(cube.from),
    to: vec(cube.to),
    longAxis,
    end: selector[axisIndex(longAxis)],
  });
}

function averageScore(result: any): number | null {
  const metrics = result?.structuredContent?.metrics;
  if (!Array.isArray(metrics) || metrics.length === 0) return null;
  const scores = metrics
    .map((metric: any) => Number(metric?.score))
    .filter(Number.isFinite);
  if (!scores.length) return null;
  return scores.reduce((sum: number, score: number) => sum + score, 0) /
    scores.length;
}

function recoverableVisualAnalysisError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return [
    "REFERENCE_FOREGROUND_NOT_FOUND",
    "REFERENCE_FOREGROUND_RATIO_INVALID",
    "REFERENCE_FOREGROUND_ADAPTIVE_FAILED",
    "VISUAL_ANALYSIS_IMAGE_API_UNAVAILABLE",
    "VISUAL_ANALYSIS_IMAGE_LOAD_FAILED",
    "VISUAL_ANALYSIS_CANVAS_UNAVAILABLE",
    "VISUAL_ANALYSIS_CONTEXT_UNAVAILABLE",
  ].some((code) => message.includes(code));
}

function sanitized(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export function solveSingleAxisAttachmentAngle(input: {
  baseDirection: Vec3;
  expectedDirection: Vec3;
  allowedAxis: GeometryAxis;
  minimumDegrees: number;
  maximumDegrees: number;
  stepDegrees?: number;
  parentRotations?: Vec3[];
}): { angle_degrees: number; alignment: number; direction: Vec3 } {
  const step = Math.max(0.1, input.stepDegrees ?? 0.25);
  const base = normalize(input.baseDirection);
  const expected = normalize(input.expectedDirection);
  let best = {
    angle_degrees: input.minimumDegrees,
    alignment: -Infinity,
    direction: base,
  };
  const count = Math.max(
    1,
    Math.ceil((input.maximumDegrees - input.minimumDegrees) / step)
  );
  for (let index = 0; index <= count; index += 1) {
    const angle = Math.min(
      input.maximumDegrees,
      input.minimumDegrees + index * step
    );
    const rotation: Vec3 = [0, 0, 0];
    rotation[axisIndex(input.allowedAxis)] = angle;
    let direction = rotatePointAroundOrigin(base, [0, 0, 0], rotation);
    for (const parentRotation of input.parentRotations ?? []) {
      direction = rotatePointAroundOrigin(
        direction,
        [0, 0, 0],
        parentRotation
      );
    }
    direction = normalize(direction);
    const alignment = dot(direction, expected);
    if (alignment > best.alignment) {
      best = { angle_degrees: angle, alignment, direction };
    }
  }
  return best;
}

function parentRotations(cube: Cube): Vec3[] {
  return parentChain(cube).map((parent) =>
    Array.isArray(parent.rotation) ? vec(parent.rotation) : [0, 0, 0]
  );
}

function resolveTarget(
  cube: Cube,
  contract: GeometryRotationContract,
  profile: NonNullable<ReturnType<typeof mergeGeometryReferenceProfile>>,
  explicitTarget: string | undefined,
  currentPivotWorld: Vec3
): Cube | null {
  if (!contract.connect_to_patterns?.length && !explicitTarget) return null;
  const candidates = (Cube.all ?? []).filter((candidate) => {
    if (candidate.uuid === cube.uuid) return false;
    if (explicitTarget) {
      return candidate.uuid === explicitTarget || candidate.name === explicitTarget;
    }
    return nameMatches(candidate.name, contract.connect_to_patterns ?? []);
  });
  if (candidates.length === 0) {
    throw new Error(
      `ROTATION_CONNECTION_TARGET_MISSING: ${
        explicitTarget ?? contract.connect_to_patterns?.join(",") ?? "unknown"
      }.`
    );
  }
  if (candidates.length === 1) return candidates[0];
  const selector = contract.connect_to_anchor ?? ["center", "center", "center"];
  return candidates
    .map((candidate) => ({
      candidate,
      distance: distance(
        transformPointForCube(
          smartTargetAnchor(candidate, selector, profile),
          candidate
        ),
        currentPivotWorld
      ),
    }))
    .sort((a, b) => a.distance - b.distance)[0].candidate;
}

function smartTargetAnchor(
  target: Cube,
  selector: [AnchorSelector, AnchorSelector, AnchorSelector],
  profile: NonNullable<ReturnType<typeof mergeGeometryReferenceProfile>>
): Vec3 {
  const targetContract = Object.values(profile.rotation_contracts).find(
    (contract) => nameMatches(target.name, contract.cube_patterns)
  );
  if (!targetContract || targetContract.centerline_anchors === false) {
    return anchorPoint(target, selector);
  }
  const targetConstraint = matchingConstraint(profile, target, targetContract);
  const targetSize = targetConstraint?.size_range_units
    ? (targetConstraint.size_range_units.min.map(
        (minimum, index) =>
          (Number(minimum) + Number(targetConstraint.size_range_units!.max[index])) /
          2
      ) as Vec3)
    : sizeOf(vec(target.from), vec(target.to));
  const longAxis = inferLongAxisFromSize(targetSize, targetContract.long_axis);
  return centerlineAnchorForCube(target, longAxis, selector);
}

function snapshot(cube: Cube): AttachmentFitSnapshot {
  const from = vec(cube.from);
  const to = vec(cube.to);
  return {
    from,
    to,
    origin: vec(cube.origin),
    rotation: vec(cube.rotation),
    size: sizeOf(from, to),
  };
}

export function evaluateAttachmentFit(input: {
  cube: Cube;
  target: Cube | null;
  contract: GeometryRotationContract;
  profile: NonNullable<ReturnType<typeof mergeGeometryReferenceProfile>>;
  longAxis: GeometryAxis;
}): {
  angle_in_range: boolean;
  compound_rotation_free: boolean;
  pivot_error_units: number;
  connection_gap_units: number | null;
  direction_alignment: number;
  status: "PASS" | "REVISION_REQUIRED";
} {
  const axis = axisIndex(input.contract.allowed_axis);
  const angle = Number(input.cube.rotation?.[axis] ?? 0);
  const otherAxes = [0, 1, 2].filter((index) => index !== axis);
  const expectedPivot = centerlineAnchorForCube(
    input.cube,
    input.longAxis,
    input.contract.pivot_anchor
  );
  const expectedTip = centerlineAnchorForCube(
    input.cube,
    input.longAxis,
    input.contract.tip_anchor
  );
  const pivotError = distance(vec(input.cube.origin), expectedPivot);
  const pivotWorld = transformPointForCube(expectedPivot, input.cube);
  const tipWorld = transformPointForCube(expectedTip, input.cube);
  const alignment = dot(
    normalize(subtract(tipWorld, pivotWorld)),
    normalize(input.contract.expected_direction)
  );
  let connectionGap: number | null = null;
  if (input.target && input.contract.connect_to_anchor) {
    connectionGap = distance(
      pivotWorld,
      transformPointForCube(
        smartTargetAnchor(
          input.target,
          input.contract.connect_to_anchor,
          input.profile
        ),
        input.target
      )
    );
  }
  const angleInRange =
    Number.isFinite(angle) &&
    angle >= input.contract.minimum_degrees &&
    angle <= input.contract.maximum_degrees;
  const compoundFree = otherAxes.every(
    (index) => Math.abs(Number(input.cube.rotation?.[index] ?? 0)) <= 1e-6
  );
  const passed =
    angleInRange &&
    compoundFree &&
    pivotError <= 1e-4 &&
    alignment >= input.contract.minimum_direction_dot &&
    (connectionGap === null ||
      connectionGap <= input.contract.connection_tolerance_units);
  return {
    angle_in_range: angleInRange,
    compound_rotation_free: compoundFree,
    pivot_error_units: pivotError,
    connection_gap_units: connectionGap,
    direction_alignment: alignment,
    status: passed ? "PASS" : "REVISION_REQUIRED",
  };
}

export function registerGeometryRotationTools(): void {
  createTool(
    geometryRotationToolDocs[0].name,
    {
      ...geometryRotationToolDocs[0],
      async execute(
        {
          session_root,
          cube: cubeRef,
          contract_id,
          angle_degrees,
          connection_target,
          smart_fit,
          size_strategy,
          snap_to_connection,
          reject_visual_regression,
          maximum_score_regression,
        },
        context?: ToolContext
      ) {
        if (!Project) throw new Error("No Blockbench project is open.");
        const cube = Cube.all.find(
          (candidate) => candidate.uuid === cubeRef || candidate.name === cubeRef
        );
        if (!cube) throw new Error(`Cube "${cubeRef}" was not found.`);

        const fs = nativeFs(
          "Smart attachment fitting needs reference, manifest, and evidence access."
        );
        const manifestPath = joinPath(
          session_root,
          "references/reference_manifest.json"
        );
        assertInsideRoot(manifestPath, session_root);
        const manifest = readJsonFile<ManifestLike>(fs, manifestPath);
        const profile = mergeGeometryReferenceProfile({
          referenceSha256: manifest.reference_visual_lock?.sha256,
          visualGrounding: manifest.visual_grounding as any,
          geometry: manifest.geometry as any,
        });
        if (!profile) throw new Error("GEOMETRY_REFERENCE_PROFILE_MISSING");

        const contract = resolveContract(profile, cube, contract_id);
        const constraint = matchingConstraint(profile, cube, contract);
        const resolvedStrategy =
          size_strategy ?? contract.size_strategy ?? "CONSTRAINT_MIDPOINT";
        const useSmartFit = smart_fit && contract.fit_mode !== "ROTATE_ONLY";
        const resolvedSize = useSmartFit
          ? constraintMidpointSize(cube, constraint, resolvedStrategy)
          : sizeOf(vec(cube.from), vec(cube.to));
        const longAxis = inferLongAxisFromSize(resolvedSize, contract.long_axis);

        const currentPivotLocal =
          useSmartFit && contract.centerline_anchors !== false
            ? centerlineAnchorForCube(cube, longAxis, contract.pivot_anchor)
            : anchorPoint(cube, contract.pivot_anchor);
        const currentPivotWorld = transformPointForCube(currentPivotLocal, cube);
        const target = resolveTarget(
          cube,
          contract,
          profile,
          connection_target,
          currentPivotWorld
        );
        const targetWorld =
          target && contract.connect_to_anchor
            ? transformPointForCube(
                smartTargetAnchor(target, contract.connect_to_anchor, profile),
                target
              )
            : null;

        const analyzer = getAllToolDefinitions()[
          "analyze_geometry_views"
        ] as unknown as {
          execute?: (
            args: Record<string, unknown>,
            context?: ToolContext
          ) => Promise<any>;
        };
        if (!analyzer?.execute) {
          throw new Error("analyze_geometry_views is unavailable.");
        }
        const scratchRoot = joinPath(
          session_root,
          `evidence/geometry/rotation_checks/${sanitized(cube.name)}`
        );
        let beforeResult: any = null;
        let beforeScore: number | null = null;
        const visualWarnings: string[] = [];
        try {
          beforeResult = await analyzer.execute(
            {
              session_root,
              expected_project_uuid: Project.uuid,
              views: contract.affected_views,
              output_dir: joinPath(scratchRoot, "before"),
              return_diff_image: false,
              write_diff_image: false,
            },
            context
          );
          beforeScore = averageScore(beforeResult);
        } catch (error) {
          if (!recoverableVisualAnalysisError(error)) throw error;
          visualWarnings.push(
            `ROTATION_VISUAL_PRECHECK_UNAVAILABLE: ${
              error instanceof Error ? error.message : String(error)
            }`
          );
        }

        const before = snapshot(cube);
        const center = midpoint(vec(cube.from), vec(cube.to));
        const resized = useSmartFit
          ? boundsFromCenter(center, resolvedSize)
          : { from: vec(cube.from), to: vec(cube.to) };
        const pivot =
          useSmartFit && contract.centerline_anchors !== false
            ? centerlineAnchorFromBounds({
                from: resized.from,
                to: resized.to,
                longAxis,
                end: contract.pivot_anchor[axisIndex(longAxis)],
              })
            : anchorPointFromBounds(
                resized.from,
                resized.to,
                contract.pivot_anchor
              );
        const tip =
          useSmartFit && contract.centerline_anchors !== false
            ? centerlineAnchorFromBounds({
                from: resized.from,
                to: resized.to,
                longAxis,
                end: contract.tip_anchor[axisIndex(longAxis)],
              })
            : anchorPointFromBounds(resized.from, resized.to, contract.tip_anchor);
        const baseDirection = subtract(tip, pivot);
        const solved = solveSingleAxisAttachmentAngle({
          baseDirection,
          expectedDirection: contract.expected_direction,
          allowedAxis: contract.allowed_axis,
          minimumDegrees: contract.minimum_degrees,
          maximumDegrees: contract.maximum_degrees,
          parentRotations: parentRotations(cube),
        });
        const resolvedAngle = angle_degrees ?? solved.angle_degrees;
        if (
          resolvedAngle < contract.minimum_degrees ||
          resolvedAngle > contract.maximum_degrees
        ) {
          throw new Error(
            `ROTATION_ANGLE_OUTSIDE_CONTRACT: ${resolvedAngle}° is outside ${contract.minimum_degrees}..${contract.maximum_degrees} for ${contract.id}.`
          );
        }
        const minimumVisible =
          contract.minimum_visible_rotation_degrees ??
          (contract.minimum_degrees > 0 || contract.maximum_degrees < 0 ? 1 : 0);
        if (Math.abs(resolvedAngle) < minimumVisible) {
          throw new Error(
            `ROTATION_NOT_VISIBLE: ${contract.id} resolved ${resolvedAngle}°, below ${minimumVisible}°.`
          );
        }
        const rotation: Vec3 = [0, 0, 0];
        rotation[axisIndex(contract.allowed_axis)] = resolvedAngle;

        Undo.initEdit({ elements: [cube], outliner: true, collections: [] });
        try {
          cube.extend({
            from: resized.from,
            to: resized.to,
            origin: pivot,
            rotation,
          });
          Canvas.updateAll();

          let translationWorld: Vec3 = [0, 0, 0];
          let translationLocal: Vec3 = [0, 0, 0];
          if (useSmartFit && snap_to_connection && targetWorld) {
            const pivotWorldBeforeSnap = transformPointForCube(
              vec(cube.origin),
              cube
            );
            translationWorld = subtract(targetWorld, pivotWorldBeforeSnap);
            translationLocal = worldVectorToParentLocal(translationWorld, cube);
            cube.extend({
              from: add(vec(cube.from), translationLocal),
              to: add(vec(cube.to), translationLocal),
              origin: add(vec(cube.origin), translationLocal),
              rotation,
            });
            Canvas.updateAll();
          }

          const fit = evaluateAttachmentFit({
            cube,
            target,
            contract,
            profile,
            longAxis,
          });
          if (!fit.angle_in_range) {
            throw new Error(`ROTATION_ANGLE_OUTSIDE_CONTRACT: ${resolvedAngle}°.`);
          }
          if (!fit.compound_rotation_free) {
            throw new Error("ROTATION_COMPOUND_AXIS_REJECTED");
          }
          if (fit.pivot_error_units > 1e-4) {
            throw new Error(
              `ROTATION_PIVOT_REJECTED: ${fit.pivot_error_units.toFixed(5)}u.`
            );
          }
          if (fit.direction_alignment < contract.minimum_direction_dot) {
            throw new Error(
              `ROTATION_DIRECTION_REJECTED: ${cube.name} alignment ${fit.direction_alignment.toFixed(
                3
              )} is below ${contract.minimum_direction_dot}.`
            );
          }
          if (
            fit.connection_gap_units !== null &&
            fit.connection_gap_units > contract.connection_tolerance_units
          ) {
            throw new Error(
              `ROTATION_CONNECTION_REJECTED: ${cube.name} attachment gap ${fit.connection_gap_units.toFixed(
                3
              )}u exceeds ${contract.connection_tolerance_units}u.`
            );
          }

          let afterResult: any = null;
          let afterScore: number | null = null;
          try {
            afterResult = await analyzer.execute(
              {
                session_root,
                expected_project_uuid: Project.uuid,
                views: contract.affected_views,
                output_dir: joinPath(scratchRoot, "after"),
                return_diff_image: false,
                write_diff_image: false,
              },
              context
            );
            afterScore = averageScore(afterResult);
          } catch (error) {
            if (!recoverableVisualAnalysisError(error)) throw error;
            visualWarnings.push(
              `ROTATION_VISUAL_POSTCHECK_UNAVAILABLE: ${
                error instanceof Error ? error.message : String(error)
              }`
            );
          }
          if (
            reject_visual_regression &&
            beforeScore !== null &&
            afterScore !== null &&
            afterScore < beforeScore - maximum_score_regression
          ) {
            throw new Error(
              `ROTATION_VISUAL_REGRESSION: affected-view score changed from ${beforeScore.toFixed(
                3
              )} to ${afterScore.toFixed(3)}.`
            );
          }

          const after = snapshot(cube);
          const pivotWorld = transformPointForCube(vec(cube.origin), cube);
          const tipLocal =
            contract.centerline_anchors === false
              ? anchorPoint(cube, contract.tip_anchor)
              : centerlineAnchorForCube(cube, longAxis, contract.tip_anchor);
          const tipWorld = transformPointForCube(tipLocal, cube);
          const report = {
            schema_version: "2.0",
            status: "PASS",
            project_uuid: Project.uuid,
            cube: { name: cube.name, uuid: cube.uuid },
            target: target ? { name: target.name, uuid: target.uuid } : null,
            contract: contract.id,
            fit_mode: useSmartFit ? "SNAP_RESIZE_ROTATE" : "ROTATE_ONLY",
            size_strategy: resolvedStrategy,
            long_axis: longAxis,
            axis: contract.allowed_axis,
            requested_angle_degrees: angle_degrees ?? null,
            resolved_angle_degrees: resolvedAngle,
            automatic_angle_solver: angle_degrees === undefined,
            expected_direction: contract.expected_direction,
            direction_alignment: fit.direction_alignment,
            connection_gap_units: fit.connection_gap_units,
            pivot_error_units: fit.pivot_error_units,
            pivot_local: vec(cube.origin),
            pivot_world: pivotWorld,
            tip_world: tipWorld,
            translation_world: translationWorld,
            translation_local: translationLocal,
            before,
            after,
            affected_views: contract.affected_views,
            before_score: beforeScore,
            after_score: afterScore,
            before_report: beforeResult?.structuredContent?.report_path ?? null,
            after_report: afterResult?.structuredContent?.report_path ?? null,
            visual_score_status:
              visualWarnings.length === 0
                ? "PASS"
                : "UNAVAILABLE_STRUCTURAL_FALLBACK",
            warnings: visualWarnings,
            created_at: new Date().toISOString(),
          };
          const reportPath = joinPath(scratchRoot, "attachment_fit.json");
          assertInsideRoot(reportPath, session_root);
          writeJsonAtomically(fs, reportPath, report);

          Undo.finishEdit(`Smart-fit ${cube.name} using ${contract.id}`);
          return {
            content: [
              {
                type: "text",
                text:
                  `Smart-fit ${cube.name}: ${resolvedAngle.toFixed(2)}° around ${contract.allowed_axis.toUpperCase()}, ` +
                  `explicit pivot ${vec(cube.origin).map((value) => value.toFixed(2)).join(",")}, ` +
                  `connection gap ${(fit.connection_gap_units ?? 0).toFixed(3)}u.`,
              },
            ],
            structuredContent: {
              status: "PASS",
              fit,
              report_path: reportPath,
              report,
            },
          };
        } catch (error) {
          Undo.cancelEdit();
          Canvas.updateAll();
          throw error;
        }
      },
    },
    geometryRotationToolDocs[0].status
  );
}
