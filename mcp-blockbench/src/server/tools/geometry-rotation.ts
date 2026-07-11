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
  type NativeFsLike,
} from "@/lib/atomicFiles";
import {
  mergeGeometryReferenceProfile,
  type AnchorSelector,
  type GeometryRotationContract,
  type StandardGeometryView,
  type Vec3,
} from "@/lib/geometryReferenceProfiles";
import { rotatePointAroundOrigin } from "@/lib/worldBounds";

const rotateCubeAboutAttachmentParameters = z.object({
  session_root: z.string().min(1),
  cube: z.string().min(1),
  contract_id: z.string().min(1).optional(),
  angle_degrees: z.number().finite(),
  reject_visual_regression: z.boolean().optional().default(true),
  maximum_score_regression: z.number().min(0).max(0.2).optional().default(0.01),
});

export const geometryRotationToolDocs: ToolSpec[] = [
  {
    name: "rotate_cube_about_attachment",
    description:
      "Rotates one cube from a machine-readable attachment contract. The tool derives the pivot, enforces axis/sign/range, checks expected direction and segment connection, compares affected views before and after, and automatically rolls back a visual regression.",
    annotations: {
      title: "Rotate Cube About Attachment",
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

function anchorCoordinate(
  minimum: number,
  maximum: number,
  selector: AnchorSelector
): number {
  if (selector === "min") return Math.min(minimum, maximum);
  if (selector === "max") return Math.max(minimum, maximum);
  return (minimum + maximum) / 2;
}

function anchorPoint(
  cube: Cube,
  selector: [AnchorSelector, AnchorSelector, AnchorSelector]
): Vec3 {
  return [
    anchorCoordinate(cube.from[0], cube.to[0], selector[0]),
    anchorCoordinate(cube.from[1], cube.to[1], selector[1]),
    anchorCoordinate(cube.from[2], cube.to[2], selector[2]),
  ];
}

function transformPointForCube(point: Vec3, cube: Cube): Vec3 {
  let transformed = rotatePointAroundOrigin(
    point,
    cube.origin as Vec3,
    cube.rotation as Vec3
  );
  let parent = cube.parent;
  const visited = new Set<unknown>();
  while (parent && parent !== "root" && !visited.has(parent)) {
    visited.add(parent);
    const origin = Array.isArray(parent.origin)
      ? (parent.origin as Vec3)
      : ([0, 0, 0] as Vec3);
    const rotation = Array.isArray(parent.rotation)
      ? (parent.rotation as Vec3)
      : ([0, 0, 0] as Vec3);
    transformed = rotatePointAroundOrigin(transformed, origin, rotation);
    parent = parent.parent;
  }
  return transformed;
}

function subtract(a: Vec3, b: Vec3): Vec3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function normalize(value: Vec3): Vec3 {
  const length = Math.hypot(value[0], value[1], value[2]);
  if (length <= 1e-8) return [0, 0, 0];
  return [value[0] / length, value[1] / length, value[2] / length];
}

function dot(a: Vec3, b: Vec3): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function distance(a: Vec3, b: Vec3): number {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
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
    if (!contract) {
      throw new Error(`ROTATION_CONTRACT_MISSING: ${contractId}`);
    }
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

function sanitized(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9_]+/g, "_").replace(/^_+|_+$/g, "");
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
          "Contract-driven Geometry rotation needs reference and evidence access."
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
        if (!profile) {
          throw new Error("GEOMETRY_REFERENCE_PROFILE_MISSING");
        }
        const contract = resolveContract(profile, cube, contract_id);
        if (
          angle_degrees < contract.minimum_degrees ||
          angle_degrees > contract.maximum_degrees
        ) {
          throw new Error(
            `ROTATION_ANGLE_OUTSIDE_CONTRACT: ${angle_degrees}° is outside ${contract.minimum_degrees}..${contract.maximum_degrees} for ${contract.id}.`
          );
        }

        const analyzer = getAllToolDefinitions()["analyze_geometry_views"] as unknown as {
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
        const beforeResult = await analyzer.execute(
          {
            session_root,
            expected_project_uuid: Project.uuid,
            views: contract.affected_views,
            output_dir: joinPath(scratchRoot, "before"),
            return_diff_image: false,
          },
          context
        );
        const beforeScore = averageScore(beforeResult);

        const pivot = anchorPoint(cube, contract.pivot_anchor);
        const tip = anchorPoint(cube, contract.tip_anchor);
        const rotation: Vec3 = [0, 0, 0];
        rotation[contract.allowed_axis === "x" ? 0 : contract.allowed_axis === "y" ? 1 : 2] =
          angle_degrees;

        Undo.initEdit({ elements: [cube], outliner: true, collections: [] });
        try {
          cube.extend({ origin: pivot, rotation });
          Canvas.updateAll();

          const pivotWorld = transformPointForCube(pivot, cube);
          const tipWorld = transformPointForCube(tip, cube);
          const direction = normalize(subtract(tipWorld, pivotWorld));
          const alignment = dot(direction, normalize(contract.expected_direction));
          if (alignment < contract.minimum_direction_dot) {
            throw new Error(
              `ROTATION_DIRECTION_REJECTED: ${cube.name} alignment ${alignment.toFixed(
                3
              )} is below ${contract.minimum_direction_dot}; expected ${contract.expected_direction.join(
                ","
              )}.`
            );
          }

          let connectionGap: number | null = null;
          if (
            contract.connect_to_patterns?.length &&
            contract.connect_to_anchor
          ) {
            const target = Cube.all.find(
              (candidate) =>
                candidate.uuid !== cube.uuid &&
                nameMatches(candidate.name, contract.connect_to_patterns ?? [])
            );
            if (!target) {
              throw new Error(
                `ROTATION_CONNECTION_TARGET_MISSING: ${contract.connect_to_patterns.join(
                  ","
                )}.`
              );
            }
            const targetPoint = transformPointForCube(
              anchorPoint(target, contract.connect_to_anchor),
              target
            );
            connectionGap = distance(pivotWorld, targetPoint);
            if (connectionGap > contract.connection_tolerance_units) {
              throw new Error(
                `ROTATION_CONNECTION_REJECTED: ${cube.name} attachment gap ${connectionGap.toFixed(
                  3
                )}u exceeds ${contract.connection_tolerance_units}u.`
              );
            }
          }

          const afterResult = await analyzer.execute(
            {
              session_root,
              expected_project_uuid: Project.uuid,
              views: contract.affected_views,
              output_dir: joinPath(scratchRoot, "after"),
              return_diff_image: false,
            },
            context
          );
          const afterScore = averageScore(afterResult);
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

          Undo.finishEdit(`Rotate ${cube.name} using ${contract.id}`);
          return {
            content: [
              {
                type: "text",
                text: `Rotated ${cube.name} by ${angle_degrees}° around ${contract.allowed_axis.toUpperCase()} using ${contract.id}. Direction, connection, and affected-view score passed.`,
              },
            ],
            structuredContent: {
              status: "PASS",
              cube: { name: cube.name, uuid: cube.uuid },
              contract: contract.id,
              axis: contract.allowed_axis,
              angle_degrees,
              pivot,
              direction_alignment: alignment,
              connection_gap_units: connectionGap,
              affected_views: contract.affected_views,
              before_score: beforeScore,
              after_score: afterScore,
              before_report: beforeResult?.structuredContent?.report_path ?? null,
              after_report: afterResult?.structuredContent?.report_path ?? null,
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
