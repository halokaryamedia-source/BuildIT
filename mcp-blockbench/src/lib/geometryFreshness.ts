/// <reference types="blockbench-types" />

import { resolveCubeWorldGeometry } from "@/lib/renderedGeometry";
import { transformedCubeCorners, type Vec3 } from "@/lib/worldBounds";

interface ParentLike {
  uuid?: string;
  origin?: number[];
  rotation?: number[];
  parent?: ParentLike | "root" | null;
}

interface CubeLike {
  uuid?: string;
  name?: string;
  from?: number[];
  to?: number[];
  origin?: number[];
  rotation?: number[];
  inflate?: number;
  visibility?: boolean;
  parent?: ParentLike | "root" | null;
  world_corners?: Vec3[];
  world_transform_source?: "render_mesh" | "manual_transform";
}

interface GroupLike extends ParentLike {
  name?: string;
  visibility?: boolean;
}

interface MeshLike extends GroupLike {
  vertices?: Record<string, number[]>;
  faces?: Record<string, { vertices?: string[] }>;
}

export interface GeometryFreshnessInput {
  cubes?: CubeLike[];
  groups?: GroupLike[];
  meshes?: MeshLike[];
}

function parentId(parent: ParentLike | "root" | null | undefined): string {
  if (!parent || parent === "root") return "root";
  return String(parent.uuid ?? "root");
}

function finite(value: unknown): number {
  const number = Number(value);
  return Number.isFinite(number)
    ? Math.round(number * 1_000_000) / 1_000_000
    : 0;
}

function vector(value: unknown): Vec3 {
  if (!Array.isArray(value)) return [0, 0, 0];
  return [finite(value[0]), finite(value[1]), finite(value[2])];
}

function points(value: Vec3[]): Vec3[] {
  return value.map((point) => vector(point));
}

function meshVertices(mesh: MeshLike): Array<{ id: string; position: Vec3 }> {
  return Object.entries(mesh.vertices ?? {})
    .map(([id, position]) => ({ id, position: vector(position) }))
    .sort((a, b) => a.id.localeCompare(b.id));
}

function meshFaces(mesh: MeshLike): Array<{ id: string; vertices: string[] }> {
  return Object.entries(mesh.faces ?? {})
    .map(([id, face]) => ({
      id,
      vertices: [...(face?.vertices ?? [])].map(String),
    }))
    .sort((a, b) => a.id.localeCompare(b.id));
}

/**
 * Pure canonical payload used by runtime hashing and regression tests.
 * Runtime callers provide actual rendered world-space corners when Blockbench
 * exposes them. Pure fixtures continue through deterministic parent transforms.
 */
export function geometryFreshnessPayload(
  input: GeometryFreshnessInput
): Record<string, unknown> {
  const cubes = [...(input.cubes ?? [])]
    .map((cube) => ({
      uuid: String(cube.uuid ?? ""),
      name: String(cube.name ?? ""),
      parent: parentId(cube.parent),
      from: vector(cube.from),
      to: vector(cube.to),
      origin: vector(cube.origin),
      rotation: vector(cube.rotation),
      inflate: finite(cube.inflate),
      visibility: cube.visibility !== false,
      world_transform_source:
        cube.world_transform_source ?? "manual_transform",
      transformed_corners: points(
        cube.world_corners ?? transformedCubeCorners(cube)
      ),
    }))
    .sort((a, b) => a.uuid.localeCompare(b.uuid));

  const groups = [...(input.groups ?? [])]
    .map((group) => ({
      uuid: String(group.uuid ?? ""),
      name: String(group.name ?? ""),
      parent: parentId(group.parent),
      origin: vector(group.origin),
      rotation: vector(group.rotation),
      visibility: group.visibility !== false,
    }))
    .sort((a, b) => a.uuid.localeCompare(b.uuid));

  const meshes = [...(input.meshes ?? [])]
    .map((mesh) => ({
      uuid: String(mesh.uuid ?? ""),
      name: String(mesh.name ?? ""),
      parent: parentId(mesh.parent),
      origin: vector(mesh.origin),
      rotation: vector(mesh.rotation),
      visibility: mesh.visibility !== false,
      vertices: meshVertices(mesh),
      faces: meshFaces(mesh),
    }))
    .sort((a, b) => a.uuid.localeCompare(b.uuid));

  return {
    schema_version: "1.1",
    cubes,
    groups,
    meshes,
  };
}

function runtimeInput(): GeometryFreshnessInput {
  const runtime = globalThis as unknown as {
    Cube?: { all?: CubeLike[] };
    Group?: { all?: GroupLike[] };
    Mesh?: { all?: MeshLike[] };
  };
  return {
    cubes: (runtime.Cube?.all ?? []).map((cube) => {
      const resolved = resolveCubeWorldGeometry(cube);
      return {
        ...cube,
        world_corners: resolved.corners,
        world_transform_source: resolved.source,
      };
    }),
    groups: runtime.Group?.all ?? [],
    meshes: runtime.Mesh?.all ?? [],
  };
}

function sha256(value: string): string {
  // @ts-ignore Blockbench runtime permission API.
  const crypto = requireNativeModule("crypto", {
    message: "Geometry freshness verification needs SHA-256 hashing.",
    optional: false,
  }) as {
    createHash(name: string): {
      update(value: string): { digest(encoding: string): string };
    };
  };
  if (!crypto) throw new Error("Crypto access was denied.");
  return crypto.createHash("sha256").update(value).digest("hex");
}

export function computeGeometryWorldSignature(): string {
  return sha256(JSON.stringify(geometryFreshnessPayload(runtimeInput())));
}
