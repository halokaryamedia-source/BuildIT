/// <reference types="three" />
/// <reference types="blockbench-types" />

import {
  rotatePointAroundOrigin,
  transformedCubeCorners,
  type Vec3,
} from "@/lib/worldBounds";

export type GeometryTransformSource = "render_mesh" | "manual_transform";
export type AnchorSelector = "min" | "center" | "max";

export interface ResolvedCubeWorldGeometry {
  corners: Vec3[];
  pivot: Vec3;
  source: GeometryTransformSource;
}

interface TransformNodeLike {
  origin?: number[];
  rotation?: number[];
  parent?: TransformNodeLike | "root" | null;
}

interface RuntimeCubeLike extends TransformNodeLike {
  uuid?: string;
  from?: number[];
  to?: number[];
  inflate?: number;
  mesh?: unknown;
}

const EPSILON = 1e-7;

function finiteVec3(value: unknown, fallback: Vec3 = [0, 0, 0]): Vec3 {
  if (!Array.isArray(value) || value.length < 3) return [...fallback];
  const result: Vec3 = [Number(value[0]), Number(value[1]), Number(value[2])];
  return result.every(Number.isFinite) ? result : [...fallback];
}

function canvasMesh(cube: RuntimeCubeLike): any | null {
  const runtime = globalThis as unknown as {
    Canvas?: { meshes?: Record<string, any> };
  };
  return (
    runtime.Canvas?.meshes?.[String(cube.uuid ?? "")] ??
    (cube as { mesh?: unknown }).mesh ??
    null
  );
}

function vectorTemplate(mesh: any): any | null {
  for (const candidate of [
    mesh?.position,
    mesh?.geometry?.boundingBox?.min,
    mesh?.geometry?.boundingBox?.max,
  ]) {
    if (!candidate?.clone) continue;
    const value = candidate.clone();
    if (value?.set) return value;
  }
  return null;
}

function meshBoundingBox(mesh: any): any | null {
  const geometry = mesh?.geometry;
  if (!mesh || !geometry || !mesh.matrixWorld) return null;
  try {
    mesh.updateMatrixWorld?.(true);
    geometry.computeBoundingBox?.();
    const box = geometry.boundingBox;
    return box?.min && box?.max ? box : null;
  } catch {
    return null;
  }
}

function transformMeshPoint(mesh: any, point: Vec3): Vec3 | null {
  const vector = vectorTemplate(mesh);
  if (!vector?.applyMatrix4) return null;
  try {
    vector.set(point[0], point[1], point[2]);
    vector.applyMatrix4(mesh.matrixWorld);
    const result: Vec3 = [
      Number(vector.x),
      Number(vector.y),
      Number(vector.z),
    ];
    return result.every(Number.isFinite) ? result : null;
  } catch {
    return null;
  }
}

function renderedCorners(cube: RuntimeCubeLike): Vec3[] | null {
  const mesh = canvasMesh(cube);
  const box = meshBoundingBox(mesh);
  if (!mesh || !box) return null;
  const axes = [
    [Number(box.min.x), Number(box.max.x)],
    [Number(box.min.y), Number(box.max.y)],
    [Number(box.min.z), Number(box.max.z)],
  ];
  const points: Vec3[] = [];
  for (const x of axes[0]) {
    for (const y of axes[1]) {
      for (const z of axes[2]) {
        const point = transformMeshPoint(mesh, [x, y, z]);
        if (!point) return null;
        points.push(point);
      }
    }
  }
  return points.length === 8 ? points : null;
}

function renderedPivot(cube: RuntimeCubeLike): Vec3 | null {
  const mesh = canvasMesh(cube);
  if (!mesh?.matrixWorld) return null;
  mesh.updateMatrixWorld?.(true);
  return transformMeshPoint(mesh, [0, 0, 0]);
}

function manualTransformPoint(pointValue: Vec3, cube: RuntimeCubeLike): Vec3 {
  let point = rotatePointAroundOrigin(
    pointValue,
    finiteVec3(cube.origin),
    finiteVec3(cube.rotation)
  );
  let parent = cube.parent;
  const visited = new Set<unknown>();
  while (parent && parent !== "root" && !visited.has(parent)) {
    visited.add(parent);
    point = rotatePointAroundOrigin(
      point,
      finiteVec3(parent.origin),
      finiteVec3(parent.rotation)
    );
    parent = parent.parent ?? "root";
  }
  return point;
}

function manualPivot(cube: RuntimeCubeLike): Vec3 {
  let point = finiteVec3(cube.origin);
  let parent = cube.parent;
  const visited = new Set<unknown>();
  while (parent && parent !== "root" && !visited.has(parent)) {
    visited.add(parent);
    point = rotatePointAroundOrigin(
      point,
      finiteVec3(parent.origin),
      finiteVec3(parent.rotation)
    );
    parent = parent.parent ?? "root";
  }
  return point;
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

export function anchorPointFromBounds(
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

export function resolveCubeWorldAnchor(
  cube: RuntimeCubeLike,
  selector: [AnchorSelector, AnchorSelector, AnchorSelector]
): { point: Vec3; source: GeometryTransformSource } {
  const mesh = canvasMesh(cube);
  const box = meshBoundingBox(mesh);
  if (mesh && box) {
    const local = anchorPointFromBounds(
      [Number(box.min.x), Number(box.min.y), Number(box.min.z)],
      [Number(box.max.x), Number(box.max.y), Number(box.max.z)],
      selector
    );
    const world = transformMeshPoint(mesh, local);
    if (world) return { point: world, source: "render_mesh" };
  }

  const local = anchorPointFromBounds(
    finiteVec3(cube.from),
    finiteVec3(cube.to, [1, 1, 1]),
    selector
  );
  return {
    point: manualTransformPoint(local, cube),
    source: "manual_transform",
  };
}

export function resolveCubeWorldGeometry(
  cube: RuntimeCubeLike
): ResolvedCubeWorldGeometry {
  const corners = renderedCorners(cube);
  const pivot = renderedPivot(cube);
  if (corners && pivot) {
    return { corners, pivot, source: "render_mesh" };
  }
  return {
    corners: transformedCubeCorners(cube),
    pivot: manualPivot(cube),
    source: "manual_transform",
  };
}

function parentRotations(cube: RuntimeCubeLike): Vec3[] {
  const rotations: Vec3[] = [];
  let parent = cube.parent;
  const visited = new Set<unknown>();
  while (parent && parent !== "root" && !visited.has(parent)) {
    visited.add(parent);
    rotations.push(finiteVec3(parent.rotation));
    parent = parent.parent ?? "root";
  }
  return rotations;
}

export function inverseParentRotationVector(
  vector: Vec3,
  rotations: Vec3[]
): Vec3 {
  let result = vector;
  for (let index = rotations.length - 1; index >= 0; index -= 1) {
    const rotation = rotations[index];
    result = rotatePointAroundOrigin(result, [0, 0, 0], [
      -rotation[0],
      -rotation[1],
      -rotation[2],
    ]);
  }
  return result;
}

export function worldVectorToCubeParentLocal(
  cube: RuntimeCubeLike,
  vector: Vec3
): { vector: Vec3; source: GeometryTransformSource } {
  const mesh = canvasMesh(cube);
  const parent = mesh?.parent;
  if (parent?.worldToLocal) {
    try {
      parent.updateMatrixWorld?.(true);
      const start = vectorTemplate(mesh);
      const end = vectorTemplate(mesh);
      if (start && end) {
        start.set(0, 0, 0);
        end.set(vector[0], vector[1], vector[2]);
        parent.worldToLocal(start);
        parent.worldToLocal(end);
        const result: Vec3 = [
          Number(end.x) - Number(start.x),
          Number(end.y) - Number(start.y),
          Number(end.z) - Number(start.z),
        ];
        if (
          result.every(Number.isFinite) &&
          Math.hypot(result[0], result[1], result[2]) > EPSILON
        ) {
          return { vector: result, source: "render_mesh" };
        }
      }
    } catch {
      // Deterministic fallback below.
    }
  }
  return {
    vector: inverseParentRotationVector(vector, parentRotations(cube)),
    source: "manual_transform",
  };
}
