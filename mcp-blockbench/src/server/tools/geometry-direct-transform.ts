/// <reference types="three" />
/// <reference types="blockbench-types" />

import { z } from "zod";
import {
  createTool,
  getAllToolDefinitions,
  type ToolContext,
  type ToolSpec,
} from "@/lib/factories";
import { STATUS_STABLE } from "@/lib/constants";
import {
  rotatePointAroundOrigin,
  transformedCubeCorners,
  type Vec3,
} from "@/lib/worldBounds";
import { assertGeometryMutationPhase } from "@/lib/geometryRuntime";

const finiteNumber = z.number().finite();
const vec3 = z.tuple([finiteNumber, finiteNumber, finiteNumber]);
const anchorValue = z.enum(["min", "center", "max"]);
const anchor3 = z.tuple([anchorValue, anchorValue, anchorValue]);
const standardView = z.enum([
  "front",
  "left_side",
  "right_side",
  "back",
  "top_footprint",
  "front_left_3_4",
]);

const transformSpec = z.object({
  cube: z.string().min(1),
  from: vec3.optional(),
  to: vec3.optional(),
  origin: vec3.optional(),
  pivot_anchor: anchor3.optional().default(["center", "center", "center"]),
  rotation: vec3,
  connection_target: z.string().min(1).optional(),
  target_anchor: anchor3.optional().default(["center", "center", "center"]),
  target_world_point: vec3.optional(),
  snap_to_target: z.boolean().optional(),
  maximum_connection_gap: z.number().min(0).max(16).optional().default(0.25),
});

const parameters = z.object({
  session_root: z.string().min(1),
  transforms: z.array(transformSpec).min(1).max(32),
  analysis_views: z.array(standardView).max(6).optional().default([]),
  require_render_mesh: z.boolean().optional().default(false),
});

type Anchor = z.infer<typeof anchorValue>;
type TransformItem = z.output<typeof transformSpec>;
type DirectTransformInput = z.output<typeof parameters>;

interface TransformNodeLike {
  origin?: number[];
  rotation?: number[];
  parent?: TransformNodeLike | "root" | null;
}

interface RenderedGeometry {
  corners: Vec3[];
  pivot: Vec3;
  source: "render_mesh" | "manual_transform";
}

interface ResolvedTransform {
  item: TransformItem;
  cube: Cube;
  target: Cube | null;
}

export const geometryDirectTransformToolDocs: ToolSpec[] = [
  {
    name: "apply_cube_transforms",
    description:
      "Applies one bounded batch of explicit reference-driven cuboid transforms without requiring a manifest rotation contract. It updates from/to/origin/rotation together, can snap each pivot to a target using the rendered Blockbench world matrix, validates the final rendered pivot and connection gap, and optionally runs one affected-view analysis after the full batch. Use this when a contract is missing, inaccurate, or less direct than the approved visual reference.",
    annotations: {
      title: "Apply Reference-Driven Cube Transforms",
      destructiveHint: true,
      openWorldHint: true,
    },
    parameters,
    status: STATUS_STABLE,
  },
];

function finiteVec3(value: unknown, fallback: Vec3 = [0, 0, 0]): Vec3 {
  if (!Array.isArray(value) || value.length < 3) return [...fallback];
  const result: Vec3 = [Number(value[0]), Number(value[1]), Number(value[2])];
  if (!result.every(Number.isFinite)) {
    throw new Error("DIRECT_TRANSFORM_NON_FINITE_VECTOR");
  }
  return result;
}

function add(a: Vec3, b: Vec3): Vec3 {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function subtract(a: Vec3, b: Vec3): Vec3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function distance(a: Vec3, b: Vec3): number {
  const delta = subtract(a, b);
  return Math.hypot(delta[0], delta[1], delta[2]);
}

function axisAnchor(minimum: number, maximum: number, anchor: Anchor): number {
  if (anchor === "min") return Math.min(minimum, maximum);
  if (anchor === "max") return Math.max(minimum, maximum);
  return (minimum + maximum) / 2;
}

export function anchorPointFromBounds(
  from: Vec3,
  to: Vec3,
  anchor: [Anchor, Anchor, Anchor]
): Vec3 {
  return [
    axisAnchor(from[0], to[0], anchor[0]),
    axisAnchor(from[1], to[1], anchor[1]),
    axisAnchor(from[2], to[2], anchor[2]),
  ];
}

function boundsFromCorners(corners: Vec3[]): { min: Vec3; max: Vec3 } {
  if (!corners.length) {
    throw new Error("DIRECT_TRANSFORM_RENDERED_CORNERS_MISSING");
  }
  const min: Vec3 = [Infinity, Infinity, Infinity];
  const max: Vec3 = [-Infinity, -Infinity, -Infinity];
  for (const corner of corners) {
    for (let axis = 0; axis < 3; axis += 1) {
      min[axis] = Math.min(min[axis], corner[axis]);
      max[axis] = Math.max(max[axis], corner[axis]);
    }
  }
  if (![...min, ...max].every(Number.isFinite)) {
    throw new Error("DIRECT_TRANSFORM_RENDERED_BOUNDS_INVALID");
  }
  return { min, max };
}

function canvasMesh(cube: Cube): any | null {
  const runtime = globalThis as unknown as {
    Canvas?: { meshes?: Record<string, any> };
  };
  return runtime.Canvas?.meshes?.[cube.uuid] ?? (cube as any).mesh ?? null;
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

function renderedCorners(cube: Cube): Vec3[] | null {
  const mesh = canvasMesh(cube);
  const geometry = mesh?.geometry;
  if (!mesh || !geometry || !mesh.matrixWorld) return null;

  try {
    mesh.updateMatrixWorld?.(true);
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
        for (const zValue of axes[2]) {
          const point = vectorTemplate(mesh);
          if (!point?.applyMatrix4) return null;
          point.set(x, y, zValue);
          point.applyMatrix4(mesh.matrixWorld);
          const result: Vec3 = [Number(point.x), Number(point.y), Number(point.z)];
          if (!result.every(Number.isFinite)) return null;
          points.push(result);
        }
      }
    }
    return points.length === 8 ? points : null;
  } catch {
    return null;
  }
}

function manualPivotWorld(cube: Cube): Vec3 {
  let point = finiteVec3(cube.origin);
  let parent = cube.parent as unknown as TransformNodeLike | "root";
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

function renderedPivot(cube: Cube): Vec3 | null {
  const mesh = canvasMesh(cube);
  if (!mesh?.matrixWorld) return null;
  try {
    mesh.updateMatrixWorld?.(true);
    const point = vectorTemplate(mesh);
    if (!point?.applyMatrix4) return null;
    point.set(0, 0, 0);
    point.applyMatrix4(mesh.matrixWorld);
    const result: Vec3 = [Number(point.x), Number(point.y), Number(point.z)];
    return result.every(Number.isFinite) ? result : null;
  } catch {
    return null;
  }
}

function renderedGeometry(cube: Cube): RenderedGeometry {
  const corners = renderedCorners(cube);
  const pivot = renderedPivot(cube);
  if (corners && pivot) {
    return { corners, pivot, source: "render_mesh" };
  }
  return {
    corners: transformedCubeCorners(cube),
    pivot: manualPivotWorld(cube),
    source: "manual_transform",
  };
}

function parentChain(cube: Cube): TransformNodeLike[] {
  const result: TransformNodeLike[] = [];
  let parent = cube.parent as unknown as TransformNodeLike | "root";
  const visited = new Set<unknown>();
  while (parent && parent !== "root" && !visited.has(parent)) {
    visited.add(parent);
    result.push(parent);
    parent = parent.parent ?? "root";
  }
  return result;
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

function worldVectorToParentLocal(cube: Cube, vector: Vec3): Vec3 {
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
        if (result.every(Number.isFinite)) return result;
      }
    } catch {
      // Deterministic fallback below.
    }
  }
  return inverseParentRotationVector(
    vector,
    parentChain(cube).map((node) => finiteVec3(node.rotation))
  );
}

function findCube(reference: string): Cube {
  const cube = (Cube.all ?? []).find(
    (candidate: Cube) =>
      candidate.uuid === reference || candidate.name === reference
  );
  if (!cube) throw new Error(`DIRECT_TRANSFORM_CUBE_MISSING: ${reference}`);
  return cube;
}

function resolveTransforms(transforms: TransformItem[]): ResolvedTransform[] {
  return transforms.map(
    (item: TransformItem): ResolvedTransform => ({
      item,
      cube: findCube(item.cube),
      target: item.connection_target
        ? findCube(item.connection_target)
        : null,
    })
  );
}

function targetPoint(item: TransformItem, target: Cube | null): Vec3 | null {
  if (item.target_world_point) return finiteVec3(item.target_world_point);
  if (!target) return null;
  const bounds = boundsFromCorners(renderedGeometry(target).corners);
  return anchorPointFromBounds(bounds.min, bounds.max, item.target_anchor);
}

function maxCornerDisplacement(before: Vec3[], after: Vec3[]): number {
  if (before.length !== after.length) return Number.POSITIVE_INFINITY;
  return Math.max(
    ...before.map((point: Vec3, index: number) => distance(point, after[index]))
  );
}

async function runAffectedViewAnalysis(
  sessionRoot: string,
  views: DirectTransformInput["analysis_views"],
  context?: ToolContext
): Promise<{ result: any; warning: string | null }> {
  if (views.length === 0) return { result: null, warning: null };
  const analyzer = getAllToolDefinitions()["analyze_geometry_views"] as unknown as {
    execute?: (
      args: Record<string, unknown>,
      context?: ToolContext
    ) => Promise<any>;
  };
  if (!analyzer?.execute) {
    return { result: null, warning: "DIRECT_TRANSFORM_ANALYZER_UNAVAILABLE" };
  }
  try {
    return {
      result: await analyzer.execute(
        {
          session_root: sessionRoot,
          expected_project_uuid: Project!.uuid,
          views,
          return_diff_image: false,
          write_diff_image: true,
        },
        context
      ),
      warning: null,
    };
  } catch (error) {
    return {
      result: null,
      warning: `DIRECT_TRANSFORM_ANALYSIS_FAILED: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}

export function registerGeometryDirectTransformTools(): void {
  createTool(
    geometryDirectTransformToolDocs[0].name,
    {
      ...geometryDirectTransformToolDocs[0],
      async execute(input: DirectTransformInput, context?: ToolContext) {
        if (!Project) throw new Error("No Blockbench project is open.");
        const { session_root, transforms, analysis_views, require_render_mesh } =
          input;

        // Reuse the existing Geometry mutation boundary so final review evidence
        // becomes stale without adding another workflow phase or profile.
        assertGeometryMutationPhase(
          "rotate_cube_about_attachment",
          {},
          "BEDROCK_CUBOID_GEOMETRY"
        );

        const resolved = resolveTransforms(transforms);
        if (new Set(resolved.map(({ cube }: ResolvedTransform) => cube.uuid)).size !== resolved.length) {
          throw new Error("DIRECT_TRANSFORM_DUPLICATE_CUBE_IN_BATCH");
        }
        const before = new Map<string, RenderedGeometry>(
          resolved.map(({ cube }: ResolvedTransform) => [
            cube.uuid,
            renderedGeometry(cube),
          ])
        );

        Undo.initEdit({
          elements: resolved.map(({ cube }: ResolvedTransform) => cube),
          outliner: true,
          collections: [],
        });

        let output: Array<Record<string, unknown>>;
        try {
          for (const { item, cube } of resolved) {
            const from = item.from ? finiteVec3(item.from) : finiteVec3(cube.from);
            const to = item.to ? finiteVec3(item.to) : finiteVec3(cube.to);
            cube.extend({
              from,
              to,
              origin: item.origin
                ? finiteVec3(item.origin)
                : anchorPointFromBounds(from, to, item.pivot_anchor),
              rotation: finiteVec3(item.rotation),
            });
          }
          Canvas.updateAll();

          for (const { item, cube, target } of resolved) {
            const destination = targetPoint(item, target);
            const shouldSnap =
              item.snap_to_target ?? Boolean(destination);
            if (!shouldSnap) continue;
            if (!destination) {
              throw new Error(
                `DIRECT_TRANSFORM_TARGET_REQUIRED: ${cube.name} requested snapping without a target.`
              );
            }
            const translation = worldVectorToParentLocal(
              cube,
              subtract(destination, renderedGeometry(cube).pivot)
            );
            cube.extend({
              from: add(finiteVec3(cube.from), translation),
              to: add(finiteVec3(cube.to), translation),
              origin: add(finiteVec3(cube.origin), translation),
              rotation: finiteVec3(cube.rotation),
            });
          }
          Canvas.updateAll();

          output = resolved.map(
            ({ item, cube, target }: ResolvedTransform): Record<string, unknown> => {
              const current = renderedGeometry(cube);
              if (require_render_mesh && current.source !== "render_mesh") {
                throw new Error(
                  `DIRECT_TRANSFORM_RENDER_MESH_REQUIRED: ${cube.name} used deterministic fallback.`
                );
              }
              const destination = targetPoint(item, target);
              const gap = destination
                ? distance(current.pivot, destination)
                : null;
              if (
                gap !== null &&
                (item.snap_to_target ?? true) &&
                gap > item.maximum_connection_gap
              ) {
                throw new Error(
                  `DIRECT_TRANSFORM_CONNECTION_REJECTED: ${cube.name} pivot gap ${gap.toFixed(
                    4
                  )}u exceeds ${item.maximum_connection_gap}u.`
                );
              }
              const previous = before.get(cube.uuid);
              if (!previous) {
                throw new Error("DIRECT_TRANSFORM_BEFORE_STATE_MISSING");
              }
              return {
                cube: { name: cube.name, uuid: cube.uuid },
                target: target
                  ? { name: target.name, uuid: target.uuid }
                  : null,
                from: [...cube.from],
                to: [...cube.to],
                origin: [...cube.origin],
                rotation: [...cube.rotation],
                rendered_pivot_world: current.pivot,
                rendered_transform_source: current.source,
                connection_gap_units: gap,
                maximum_connection_gap: item.maximum_connection_gap,
                maximum_rendered_corner_displacement: maxCornerDisplacement(
                  previous.corners,
                  current.corners
                ),
              };
            }
          );

          Undo.finishEdit(
            `Apply ${resolved.length} reference-driven cube transform(s)`
          );
        } catch (error) {
          Undo.cancelEdit();
          Canvas.updateAll();
          throw error;
        }

        const analysis = await runAffectedViewAnalysis(
          session_root,
          analysis_views,
          context
        );
        const visualResult =
          analysis.result?.structuredContent?.result ??
          analysis.result?.structuredContent?.status ??
          null;

        return {
          content: [
            {
              type: "text" as const,
              text:
                `Applied ${output.length} reference-driven transform(s). ` +
                (visualResult
                  ? `Affected-view analysis: ${visualResult}.`
                  : "Run affected-view analysis before Geometry review."),
            },
          ],
          structuredContent: {
            status: "PASS",
            transform_count: output.length,
            transforms: output,
            analysis_views,
            visual_result: visualResult,
            visual_report_path:
              analysis.result?.structuredContent?.report_path ?? null,
            visual_warning: analysis.warning,
            visual_analysis_required_before_review: visualResult !== "PASS",
            manifest_rotation_contract_required: false,
            next_action:
              visualResult === "REVISION_REQUIRED"
                ? "APPLY_TARGETED_GEOMETRY_CORRECTION"
                : visualResult === "PASS"
                  ? "CONTINUE_GEOMETRY"
                  : "ANALYZE_AFFECTED_VIEWS",
          },
        };
      },
    },
    geometryDirectTransformToolDocs[0].status
  );
}
