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
import { assertGeometryMutationPhase } from "@/lib/geometryRuntime";
import {
  anchorPointFromBounds,
  inverseParentRotationVector,
  resolveCubeWorldAnchor,
  resolveCubeWorldGeometry,
  worldVectorToCubeParentLocal,
  type AnchorSelector,
  type GeometryTransformSource,
  type ResolvedCubeWorldGeometry,
} from "@/lib/renderedGeometry";
import type { Vec3 } from "@/lib/worldBounds";

export { anchorPointFromBounds, inverseParentRotationVector } from "@/lib/renderedGeometry";

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

type TransformItem = z.output<typeof transformSpec>;
type DirectTransformInput = z.output<typeof parameters>;

interface ResolvedTransform {
  item: TransformItem;
  cube: Cube;
  target: Cube | null;
}

interface TargetResolution {
  point: Vec3 | null;
  source: GeometryTransformSource | "explicit_world_point" | null;
}

interface SnapResolution {
  world_translation: Vec3;
  local_translation: Vec3;
  translation_source: GeometryTransformSource;
  target_source: TargetResolution["source"];
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

function targetPoint(item: TransformItem, target: Cube | null): TargetResolution {
  if (item.target_world_point) {
    return {
      point: finiteVec3(item.target_world_point),
      source: "explicit_world_point",
    };
  }
  if (!target) return { point: null, source: null };
  const resolved = resolveCubeWorldAnchor(
    target,
    item.target_anchor as [AnchorSelector, AnchorSelector, AnchorSelector]
  );
  return { point: resolved.point, source: resolved.source };
}

function maxCornerDisplacement(
  before: ResolvedCubeWorldGeometry,
  after: ResolvedCubeWorldGeometry
): number {
  if (before.corners.length !== after.corners.length) {
    return Number.POSITIVE_INFINITY;
  }
  return Math.max(
    ...before.corners.map((point: Vec3, index: number) =>
      distance(point, after.corners[index])
    )
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

        // Reuse the established Geometry mutation boundary. This invalidates
        // final-review evidence without introducing another stage or profile.
        assertGeometryMutationPhase(
          "rotate_cube_about_attachment",
          {},
          "BEDROCK_CUBOID_GEOMETRY"
        );

        const resolved = resolveTransforms(transforms);
        if (
          new Set(
            resolved.map(({ cube }: ResolvedTransform) => cube.uuid)
          ).size !== resolved.length
        ) {
          throw new Error("DIRECT_TRANSFORM_DUPLICATE_CUBE_IN_BATCH");
        }

        const before = new Map<string, ResolvedCubeWorldGeometry>(
          resolved.map(({ cube }: ResolvedTransform) => [
            cube.uuid,
            resolveCubeWorldGeometry(cube),
          ])
        );
        const snaps = new Map<string, SnapResolution>();

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
                : anchorPointFromBounds(
                    from,
                    to,
                    item.pivot_anchor as [
                      AnchorSelector,
                      AnchorSelector,
                      AnchorSelector,
                    ]
                  ),
              rotation: finiteVec3(item.rotation),
            });
          }
          Canvas.updateAll();

          for (const { item, cube, target } of resolved) {
            const destination = targetPoint(item, target);
            const shouldSnap = item.snap_to_target ?? Boolean(destination.point);
            if (!shouldSnap) continue;
            if (!destination.point) {
              throw new Error(
                `DIRECT_TRANSFORM_TARGET_REQUIRED: ${cube.name} requested snapping without a target.`
              );
            }
            const current = resolveCubeWorldGeometry(cube);
            const worldTranslation = subtract(destination.point, current.pivot);
            const local = worldVectorToCubeParentLocal(cube, worldTranslation);
            cube.extend({
              from: add(finiteVec3(cube.from), local.vector),
              to: add(finiteVec3(cube.to), local.vector),
              origin: add(finiteVec3(cube.origin), local.vector),
              rotation: finiteVec3(cube.rotation),
            });
            snaps.set(cube.uuid, {
              world_translation: worldTranslation,
              local_translation: local.vector,
              translation_source: local.source,
              target_source: destination.source,
            });
          }
          Canvas.updateAll();

          output = resolved.map(
            ({ item, cube, target }: ResolvedTransform): Record<string, unknown> => {
              const current = resolveCubeWorldGeometry(cube);
              if (require_render_mesh && current.source !== "render_mesh") {
                throw new Error(
                  `DIRECT_TRANSFORM_RENDER_MESH_REQUIRED: ${cube.name} used deterministic fallback.`
                );
              }
              const destination = targetPoint(item, target);
              const gap = destination.point
                ? distance(current.pivot, destination.point)
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
              const snap = snaps.get(cube.uuid) ?? null;
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
                target_anchor_source: destination.source,
                connection_gap_units: gap,
                maximum_connection_gap: item.maximum_connection_gap,
                world_translation: snap?.world_translation ?? null,
                local_translation: snap?.local_translation ?? null,
                translation_source: snap?.translation_source ?? null,
                maximum_rendered_corner_displacement: maxCornerDisplacement(
                  previous,
                  current
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
