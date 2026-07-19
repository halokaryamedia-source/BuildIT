/// <reference types="three" />
/// <reference types="blockbench-types" />

export type Vec3 = [number, number, number];

export interface Bounds3 {
  min: Vec3;
  max: Vec3;
  center: Vec3;
  size: Vec3;
  maxExtent: number;
  source: "render_mesh" | "manual_transform" | "mixed";
}

export interface RotationPolicy {
  preferredAxisCount: number;
  maximumAxisCount: number;
  maxAbsDegrees: number;
  pivotMarginRatio: number;
}

export interface RotationIssue {
  code:
    | "COMPOUND_CUBE_ROTATION"
    | "ROTATION_ANGLE_EXCEEDS_POLICY"
    | "ROTATION_PIVOT_TOO_FAR"
    | "NON_FINITE_ROTATION"
    | "DEGENERATE_CUBE";
  severity: "WARNING" | "REVISION_REQUIRED";
  cube: { name: string; uuid: string };
  message: string;
}

export interface RotationAudit {
  status: "PASS" | "WARNING" | "REVISION_REQUIRED";
  rotated_cubes: number;
  compound_rotations: number;
  issues: RotationIssue[];
}

export const DEFAULT_ROTATION_POLICY: RotationPolicy = {
  preferredAxisCount: 1,
  maximumAxisCount: 1,
  maxAbsDegrees: 45,
  pivotMarginRatio: 1,
};

const EPSILON = 1e-6;

function finiteVector(value: unknown, fallback: Vec3 = [0, 0, 0]): Vec3 {
  if (!Array.isArray(value) || value.length < 3) return [...fallback];
  const result: Vec3 = [Number(value[0]), Number(value[1]), Number(value[2])];
  return result.every(Number.isFinite) ? result : [...fallback];
}

function radians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Deterministic fallback for non-rendered environments. Blockbench runtime
 * geometry prefers the actual scene matrix through renderedCubeWorldCorners.
 */
export function rotatePointAroundOrigin(
  point: Vec3,
  origin: Vec3,
  rotationDegrees: Vec3
): Vec3 {
  let x = point[0] - origin[0];
  let y = point[1] - origin[1];
  let z = point[2] - origin[2];

  const rx = radians(rotationDegrees[0]);
  const ry = radians(rotationDegrees[1]);
  const rz = radians(rotationDegrees[2]);

  if (Math.abs(rx) > EPSILON) {
    const cosine = Math.cos(rx);
    const sine = Math.sin(rx);
    const nextY = y * cosine - z * sine;
    const nextZ = y * sine + z * cosine;
    y = nextY;
    z = nextZ;
  }

  if (Math.abs(ry) > EPSILON) {
    const cosine = Math.cos(ry);
    const sine = Math.sin(ry);
    const nextX = x * cosine + z * sine;
    const nextZ = -x * sine + z * cosine;
    x = nextX;
    z = nextZ;
  }

  if (Math.abs(rz) > EPSILON) {
    const cosine = Math.cos(rz);
    const sine = Math.sin(rz);
    const nextX = x * cosine - y * sine;
    const nextY = x * sine + y * cosine;
    x = nextX;
    y = nextY;
  }

  return [x + origin[0], y + origin[1], z + origin[2]];
}

export function cubeCorners(
  fromValue: Vec3,
  toValue: Vec3,
  inflate = 0
): Vec3[] {
  const min: Vec3 = [
    Math.min(fromValue[0], toValue[0]) - inflate,
    Math.min(fromValue[1], toValue[1]) - inflate,
    Math.min(fromValue[2], toValue[2]) - inflate,
  ];
  const max: Vec3 = [
    Math.max(fromValue[0], toValue[0]) + inflate,
    Math.max(fromValue[1], toValue[1]) + inflate,
    Math.max(fromValue[2], toValue[2]) + inflate,
  ];

  return [
    [min[0], min[1], min[2]],
    [min[0], min[1], max[2]],
    [min[0], max[1], min[2]],
    [min[0], max[1], max[2]],
    [max[0], min[1], min[2]],
    [max[0], min[1], max[2]],
    [max[0], max[1], min[2]],
    [max[0], max[1], max[2]],
  ];
}

interface TransformNodeLike {
  origin?: number[];
  rotation?: number[];
  parent?: TransformNodeLike | "root" | null;
}

interface CubeLike extends TransformNodeLike {
  name?: string;
  uuid?: string;
  from?: number[];
  to?: number[];
  inflate?: number;
  mesh?: unknown;
}

function applyNodeRotation(points: Vec3[], node: TransformNodeLike): Vec3[] {
  const origin = finiteVector(node.origin);
  const rotation = finiteVector(node.rotation);
  if (rotation.every((value) => Math.abs(value) <= EPSILON)) return points;
  return points.map((point) => rotatePointAroundOrigin(point, origin, rotation));
}

function vectorTemplate(mesh: any): any | null {
  for (const candidate of [
    mesh?.position,
    mesh?.geometry?.boundingBox?.min,
    mesh?.geometry?.boundingBox?.max,
  ]) {
    if (!candidate?.clone) continue;
    const vector = candidate.clone();
    if (vector?.set) return vector;
  }
  return null;
}

/**
 * Returns the actual eight rendered cube corners from Blockbench's scene graph.
 * This is the runtime authority for projection, bounds, ground contact, and
 * freshness. It returns null in pure tests or before the render mesh exists.
 */
export function renderedCubeWorldCorners(cube: CubeLike): Vec3[] | null {
  const runtime = globalThis as unknown as {
    Canvas?: { meshes?: Record<string, any> };
  };
  const mesh =
    runtime.Canvas?.meshes?.[String(cube.uuid ?? "")] ??
    (cube as { mesh?: unknown }).mesh;
  const geometry = (mesh as any)?.geometry;
  if (!mesh || !geometry || !(mesh as any).matrixWorld) return null;

  try {
    (mesh as any).updateMatrixWorld?.(true);
    geometry.computeBoundingBox?.();
    const box = geometry.boundingBox;
    if (!box?.min || !box?.max) return null;
    const axes = [
      [Number(box.min.x), Number(box.max.x)],
      [Number(box.min.y), Number(box.max.y)],
      [Number(box.min.z), Number(box.max.z)],
    ];
    const points: Vec3[] = [];
    for (const x of axes[0]) {
      for (const y of axes[1]) {
        for (const z of axes[2]) {
          const vector = vectorTemplate(mesh);
          if (!vector?.applyMatrix4) return null;
          vector.set(x, y, z);
          vector.applyMatrix4((mesh as any).matrixWorld);
          const point: Vec3 = [
            Number(vector.x),
            Number(vector.y),
            Number(vector.z),
          ];
          if (!point.every(Number.isFinite)) return null;
          points.push(point);
        }
      }
    }
    return points.length === 8 ? points : null;
  } catch {
    return null;
  }
}

function manuallyTransformedCubeCorners(cube: CubeLike): Vec3[] {
  const from = finiteVector(cube.from);
  const to = finiteVector(cube.to, [1, 1, 1]);
  let points = cubeCorners(from, to, Number(cube.inflate ?? 0));
  points = applyNodeRotation(points, cube);

  let parent = cube.parent;
  const visited = new Set<unknown>();
  while (parent && parent !== "root" && !visited.has(parent)) {
    visited.add(parent);
    points = applyNodeRotation(points, parent);
    parent = parent.parent;
  }
  return points;
}

/**
 * Runtime callers receive actual Blockbench rendered world corners. Pure tests,
 * unopened meshes, and recovery paths use the deterministic Euler fallback.
 */
export function transformedCubeCorners(cube: CubeLike): Vec3[] {
  return renderedCubeWorldCorners(cube) ?? manuallyTransformedCubeCorners(cube);
}

function aggregateBounds(points: Vec3[], source: Bounds3["source"]): Bounds3 {
  if (!points.length) {
    throw new Error("No cube geometry exists to calculate world bounds.");
  }
  const min: Vec3 = [Infinity, Infinity, Infinity];
  const max: Vec3 = [-Infinity, -Infinity, -Infinity];
  for (const point of points) {
    for (let axis = 0; axis < 3; axis += 1) {
      min[axis] = Math.min(min[axis], point[axis]);
      max[axis] = Math.max(max[axis], point[axis]);
    }
  }
  const size: Vec3 = [
    max[0] - min[0],
    max[1] - min[1],
    max[2] - min[2],
  ];
  const center: Vec3 = [
    (min[0] + max[0]) / 2,
    (min[1] + max[1]) / 2,
    (min[2] + max[2]) / 2,
  ];
  return {
    min,
    max,
    center,
    size,
    maxExtent: Math.max(...size, 1),
    source,
  };
}

export function computeProjectWorldBounds(): Bounds3 {
  const runtimeCubes =
    (globalThis as unknown as { Cube?: { all?: CubeLike[] } }).Cube?.all ?? [];
  const points: Vec3[] = [];
  let renderedCount = 0;
  let manualCount = 0;

  for (const cube of runtimeCubes) {
    const rendered = renderedCubeWorldCorners(cube);
    if (rendered) {
      renderedCount += 1;
      points.push(...rendered);
    } else {
      manualCount += 1;
      points.push(...manuallyTransformedCubeCorners(cube));
    }
  }

  const source: Bounds3["source"] =
    renderedCount > 0 && manualCount === 0
      ? "render_mesh"
      : renderedCount > 0
        ? "mixed"
        : "manual_transform";
  return aggregateBounds(points, source);
}

function distanceOutsideAabb(point: Vec3, from: Vec3, to: Vec3): number {
  let squared = 0;
  for (let axis = 0; axis < 3; axis += 1) {
    const min = Math.min(from[axis], to[axis]);
    const max = Math.max(from[axis], to[axis]);
    const delta =
      point[axis] < min
        ? min - point[axis]
        : point[axis] > max
          ? point[axis] - max
          : 0;
    squared += delta * delta;
  }
  return Math.sqrt(squared);
}

export function auditProjectRotations(
  policy: RotationPolicy = DEFAULT_ROTATION_POLICY
): RotationAudit {
  const runtimeCubes =
    (globalThis as unknown as { Cube?: { all?: CubeLike[] } }).Cube?.all ?? [];
  const issues: RotationIssue[] = [];
  let rotatedCubes = 0;
  let compoundRotations = 0;

  for (const cube of runtimeCubes) {
    const cubeRef = {
      name: String(cube.name ?? "unnamed"),
      uuid: String(cube.uuid ?? ""),
    };
    const rotation = finiteVector(cube.rotation, [
      Number.NaN,
      Number.NaN,
      Number.NaN,
    ]);
    const from = finiteVector(cube.from);
    const to = finiteVector(cube.to, [1, 1, 1]);
    const origin = finiteVector(cube.origin);

    if (![...rotation].every(Number.isFinite)) {
      issues.push({
        code: "NON_FINITE_ROTATION",
        severity: "REVISION_REQUIRED",
        cube: cubeRef,
        message: `${cubeRef.name} has a non-finite rotation value.`,
      });
      continue;
    }

    const dimensions = [
      Math.abs(to[0] - from[0]),
      Math.abs(to[1] - from[1]),
      Math.abs(to[2] - from[2]),
    ];
    if (dimensions.some((value) => value <= EPSILON)) {
      issues.push({
        code: "DEGENERATE_CUBE",
        severity: "REVISION_REQUIRED",
        cube: cubeRef,
        message: `${cubeRef.name} has a zero-size axis and cannot be rotated safely.`,
      });
    }

    const nonZeroAxes = rotation.filter(
      (value) => Math.abs(value) > EPSILON
    ).length;
    if (nonZeroAxes === 0) continue;
    rotatedCubes += 1;

    if (nonZeroAxes > policy.preferredAxisCount) {
      compoundRotations += 1;
      issues.push({
        code: "COMPOUND_CUBE_ROTATION",
        severity:
          nonZeroAxes > policy.maximumAxisCount ? "REVISION_REQUIRED" : "WARNING",
        cube: cubeRef,
        message: `${cubeRef.name} rotates on ${nonZeroAxes} axes; geometry production prefers one local axis per cube.`,
      });
    }

    const maxAngle = Math.max(...rotation.map((value) => Math.abs(value)));
    if (maxAngle > policy.maxAbsDegrees + EPSILON) {
      issues.push({
        code: "ROTATION_ANGLE_EXCEEDS_POLICY",
        severity: "REVISION_REQUIRED",
        cube: cubeRef,
        message: `${cubeRef.name} uses ${maxAngle}°, above the ${policy.maxAbsDegrees}° Geometry policy.`,
      });
    }

    const maxDimension = Math.max(...dimensions, 1);
    const pivotDistance = distanceOutsideAabb(origin, from, to);
    if (pivotDistance > maxDimension * policy.pivotMarginRatio) {
      issues.push({
        code: "ROTATION_PIVOT_TOO_FAR",
        severity: "REVISION_REQUIRED",
        cube: cubeRef,
        message: `${cubeRef.name} pivot is ${pivotDistance.toFixed(
          2
        )}u outside its cube bounds; verify the intended attachment pivot before rotating.`,
      });
    }
  }

  const status = issues.some(
    (issue) => issue.severity === "REVISION_REQUIRED"
  )
    ? "REVISION_REQUIRED"
    : issues.length > 0
      ? "WARNING"
      : "PASS";
  return {
    status,
    rotated_cubes: rotatedCubes,
    compound_rotations: compoundRotations,
    issues,
  };
}
