/// <reference types="blockbench-types" />

import { z } from "zod";
import { createTool, type ToolSpec } from "@/lib/factories";
import { STATUS_STABLE } from "@/lib/constants";
import {
  assertInsideRoot,
  readJsonFile,
  type NativeFsLike,
} from "@/lib/atomicFiles";
import {
  evaluateGeometryBlueprint,
  type BlueprintElement,
} from "@/lib/geometryBlueprint";
import { markPrimaryFormReady } from "@/lib/geometryRuntime";
import {
  mergeGeometryReferenceProfile,
  type GeometryAxis,
  type GeometryPartConstraint,
  type GeometryRotationContract,
  type Vec3,
} from "@/lib/geometryReferenceProfiles";
import {
  evaluateAttachmentFit,
  inferLongAxisFromSize,
} from "./geometry-rotation";
import { transformedCubeCorners } from "@/lib/worldBounds";

const parameters = z.object({
  session_root: z.string().min(1),
  expected_project_uuid: z.string().min(1),
});

export const geometryPrimaryGateToolDocs: ToolSpec[] = [
  {
    name: "verify_primary_form_ready",
    description:
      "Verifies that manifest PRIMARY_MASS and PROVISIONAL_SUPPORT geometry, smart-fit attachment rotations with explicit pivots and evidence, ground contacts, cube budget, and left/front/top fixed-scale scores are ready before structural detail is allowed. This is an internal phase gate, not a user review.",
    annotations: {
      title: "Verify Primary Form Ready",
      readOnlyHint: false,
      openWorldHint: true,
    },
    parameters,
    status: STATUS_STABLE,
  },
];

function joinPath(root: string, relative: string): string {
  const separator = root.includes("\\") && !root.includes("/") ? "\\" : "/";
  return `${root.replace(/[\\/]$/, "")}${separator}${relative.replace(/^[\\/]/, "")}`;
}

function nativeFs(): NativeFsLike {
  // @ts-ignore Blockbench runtime permission API.
  const fs = requireNativeModule("fs", {
    message: "Primary-form verification needs manifest and Geometry metrics access.",
    optional: false,
  });
  if (!fs) throw new Error("Filesystem access was denied.");
  return fs as NativeFsLike;
}

function normalized(value: unknown): string {
  return String(value ?? "").toLowerCase();
}

function matches(name: string, patterns: unknown): boolean {
  return (
    Array.isArray(patterns) &&
    patterns.some((pattern) => normalized(name).includes(normalized(pattern)))
  );
}

function parentName(cube: Cube): string | null {
  const parent = cube.parent as unknown as { name?: string } | "root";
  return parent && parent !== "root" ? parent.name ?? null : "root";
}

function currentElements(): BlueprintElement[] {
  return (Cube.all ?? []).map((cube) => ({
    name: cube.name,
    parent_name: parentName(cube),
    visibility: cube.visibility,
    export: cube.export,
    world_corners: transformedCubeCorners(cube as any),
  }));
}

function cubeMinimumY(cube: Cube): number {
  return Math.min(...transformedCubeCorners(cube as any).map((point) => point[1]));
}

function sizeOfCube(cube: Cube): Vec3 {
  return [
    Math.abs(Number(cube.to[0]) - Number(cube.from[0])),
    Math.abs(Number(cube.to[1]) - Number(cube.from[1])),
    Math.abs(Number(cube.to[2]) - Number(cube.from[2])),
  ];
}

function matchingConstraint(
  constraints: GeometryPartConstraint[],
  cube: Cube,
  contract: GeometryRotationContract
): GeometryPartConstraint | null {
  const candidates = constraints.filter((constraint) =>
    constraint.name_patterns.some((pattern) =>
      cube.name.toLowerCase().includes(pattern.toLowerCase())
    )
  );
  return (
    candidates.find((constraint) => constraint.rotation_contract === contract.id) ??
    candidates[0] ??
    null
  );
}

function midpointConstraintSize(
  constraint: GeometryPartConstraint | null,
  cube: Cube
): Vec3 {
  if (!constraint?.size_range_units) return sizeOfCube(cube);
  return constraint.size_range_units.min.map(
    (minimum, index) =>
      (Number(minimum) + Number(constraint.size_range_units!.max[index])) / 2
  ) as Vec3;
}

function sanitized(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function resolveRotationCube(
  contract: GeometryRotationContract
): Cube | null {
  return (
    (Cube.all ?? []).find((cube) => matches(cube.name, contract.cube_patterns)) ??
    null
  );
}

function resolveConnectionTarget(
  cube: Cube,
  contract: GeometryRotationContract
): Cube | null {
  if (!contract.connect_to_patterns?.length) return null;
  return (
    (Cube.all ?? []).find(
      (candidate) =>
        candidate.uuid !== cube.uuid &&
        matches(candidate.name, contract.connect_to_patterns)
    ) ?? null
  );
}

function evidenceMatchesCurrentCube(
  report: Record<string, any>,
  cube: Cube,
  contract: GeometryRotationContract
): boolean {
  const after = report.after ?? {};
  const numbersEqual = (a: unknown, b: unknown): boolean =>
    Number.isFinite(Number(a)) &&
    Number.isFinite(Number(b)) &&
    Math.abs(Number(a) - Number(b)) <= 1e-5;
  const vectorsEqual = (a: unknown, b: unknown): boolean =>
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length >= 3 &&
    b.length >= 3 &&
    [0, 1, 2].every((index) => numbersEqual(a[index], b[index]));
  return (
    report.status === "PASS" &&
    report.project_uuid === Project?.uuid &&
    report.cube?.uuid === cube.uuid &&
    report.contract === contract.id &&
    report.fit_mode === "SNAP_RESIZE_ROTATE" &&
    vectorsEqual(after.from, cube.from) &&
    vectorsEqual(after.to, cube.to) &&
    vectorsEqual(after.origin, cube.origin) &&
    vectorsEqual(after.rotation, cube.rotation)
  );
}

function evaluateRequiredRotation(input: {
  fs: NativeFsLike;
  sessionRoot: string;
  contract: GeometryRotationContract;
  constraints: GeometryPartConstraint[];
  profile: NonNullable<ReturnType<typeof mergeGeometryReferenceProfile>>;
}): Array<Record<string, unknown>> {
  const issues: Array<Record<string, unknown>> = [];
  const cube = resolveRotationCube(input.contract);
  if (!cube) {
    return [{ code: "PRIMARY_ROTATION_NOT_APPLIED", contract: input.contract.id }];
  }
  const constraint = matchingConstraint(input.constraints, cube, input.contract);
  const longAxis = inferLongAxisFromSize(
    midpointConstraintSize(constraint, cube),
    input.contract.long_axis as GeometryAxis | undefined
  );
  const target = resolveConnectionTarget(cube, input.contract);
  if (input.contract.connect_to_patterns?.length && !target) {
    issues.push({
      code: "PRIMARY_ROTATION_CONNECTION_TARGET_MISSING",
      contract: input.contract.id,
      cube: cube.name,
    });
  }
  const fit = evaluateAttachmentFit({
    cube,
    target,
    contract: input.contract,
    profile: input.profile,
    longAxis,
  });
  if (!fit.angle_in_range || !fit.compound_rotation_free) {
    issues.push({
      code: "PRIMARY_ROTATION_NOT_APPLIED",
      contract: input.contract.id,
      cube: cube.name,
      fit,
    });
  }
  if (fit.pivot_error_units > 1e-4) {
    issues.push({
      code: "PRIMARY_ROTATION_PIVOT_NOT_APPLIED",
      contract: input.contract.id,
      cube: cube.name,
      pivot_error_units: fit.pivot_error_units,
    });
  }
  if (fit.direction_alignment < input.contract.minimum_direction_dot) {
    issues.push({
      code: "PRIMARY_ROTATION_DIRECTION_FAILED",
      contract: input.contract.id,
      cube: cube.name,
      direction_alignment: fit.direction_alignment,
      minimum_direction_dot: input.contract.minimum_direction_dot,
    });
  }
  if (
    fit.connection_gap_units !== null &&
    fit.connection_gap_units > input.contract.connection_tolerance_units
  ) {
    issues.push({
      code: "PRIMARY_ROTATION_CONNECTION_FAILED",
      contract: input.contract.id,
      cube: cube.name,
      connection_gap_units: fit.connection_gap_units,
      tolerance_units: input.contract.connection_tolerance_units,
    });
  }

  const evidencePath = joinPath(
    input.sessionRoot,
    `evidence/geometry/rotation_checks/${sanitized(cube.name)}/attachment_fit.json`
  );
  assertInsideRoot(evidencePath, input.sessionRoot);
  if (!input.fs.existsSync(evidencePath)) {
    issues.push({
      code: "PRIMARY_ROTATION_EVIDENCE_MISSING",
      contract: input.contract.id,
      cube: cube.name,
      path: evidencePath,
    });
  } else {
    const evidence = readJsonFile<Record<string, any>>(input.fs, evidencePath);
    if (!evidenceMatchesCurrentCube(evidence, cube, input.contract)) {
      issues.push({
        code: "PRIMARY_ROTATION_EVIDENCE_STALE",
        contract: input.contract.id,
        cube: cube.name,
        path: evidencePath,
      });
    }
  }
  return issues;
}

export function registerGeometryPrimaryGateTools(): void {
  createTool(
    geometryPrimaryGateToolDocs[0].name,
    {
      ...geometryPrimaryGateToolDocs[0],
      async execute({ session_root, expected_project_uuid }) {
        if (!Project) throw new Error("No Blockbench project is open.");
        if (Project.uuid !== expected_project_uuid) {
          throw new Error(
            `PROJECT_UUID_MISMATCH: active ${Project.uuid}, expected ${expected_project_uuid}.`
          );
        }

        const fs = nativeFs();
        const manifestPath = joinPath(
          session_root,
          "references/reference_manifest.json"
        );
        const metricsPath = joinPath(
          session_root,
          "evidence/geometry/geometry_visual_metrics.json"
        );
        for (const path of [manifestPath, metricsPath]) {
          assertInsideRoot(path, session_root);
        }
        if (!fs.existsSync(metricsPath)) {
          throw new Error(
            "GEOMETRY_PRIMARY_FORM_DIAGNOSIS_MISSING: analyze left_side, front, and top_footprint first."
          );
        }

        const manifest = readJsonFile<Record<string, any>>(fs, manifestPath);
        const metrics = readJsonFile<Record<string, any>>(fs, metricsPath);
        const profile = mergeGeometryReferenceProfile({
          referenceSha256: manifest.reference_visual_lock?.sha256,
          visualGrounding: manifest.visual_grounding,
          geometry: manifest.geometry,
        });
        if (!profile) throw new Error("GEOMETRY_REFERENCE_PROFILE_MISSING");
        const gate = manifest.geometry?.primary_form_gate ?? {};
        const allConstraints: GeometryPartConstraint[] = Array.isArray(
          manifest.geometry?.part_constraints
        )
          ? manifest.geometry.part_constraints
          : [];
        const primaryConstraints = allConstraints.filter((constraint) =>
          ["PRIMARY_MASS", "PROVISIONAL_SUPPORT"].includes(
            String(constraint?.role ?? "")
          )
        );
        const blueprint = evaluateGeometryBlueprint(
          currentElements(),
          primaryConstraints
        );
        const issues: Array<Record<string, unknown>> = blueprint.issues.map(
          (issue) => ({ ...issue, source: "PRIMARY_BLUEPRINT" })
        );

        const maximumCubes = Number.isFinite(Number(gate.maximum_cubes))
          ? Number(gate.maximum_cubes)
          : 28;
        if (Cube.all.length > maximumCubes) {
          issues.push({
            code: "GEOMETRY_PRIMARY_FORM_CUBE_BUDGET_EXCEEDED",
            actual: Cube.all.length,
            maximum: maximumCubes,
          });
        }

        const requiredViews: string[] = Array.isArray(gate.required_views)
          ? gate.required_views.map(String)
          : ["left_side", "front", "top_footprint"];
        const minimumScore = Number.isFinite(Number(gate.minimum_view_score))
          ? Number(gate.minimum_view_score)
          : 0.48;
        const maximumExtentDelta = Number.isFinite(
          Number(gate.maximum_extent_delta_units)
        )
          ? Number(gate.maximum_extent_delta_units)
          : 5;
        const measured = new Map<string, any>(
          (Array.isArray(metrics.views) ? metrics.views : []).map((view: any) => [
            String(view?.view ?? ""),
            view,
          ])
        );
        for (const view of requiredViews) {
          const metric = measured.get(view);
          if (!metric) {
            issues.push({ code: "PRIMARY_VIEW_MISSING", view });
            continue;
          }
          if (Number(metric.score ?? 0) < minimumScore) {
            issues.push({
              code: "PRIMARY_VIEW_SCORE_LOW",
              view,
              score: Number(metric.score ?? 0),
              minimum: minimumScore,
            });
          }
          for (const direction of ["width", "height"] as const) {
            const delta = Math.abs(
              Number(metric.edge_delta_units?.[direction] ?? 0)
            );
            if (delta > maximumExtentDelta) {
              issues.push({
                code: "PRIMARY_VIEW_EXTENT_MISMATCH",
                view,
                direction,
                delta_units: delta,
                maximum_units: maximumExtentDelta,
              });
            }
          }
          if (metric.foreground_result === "REVISION_REQUIRED") {
            issues.push({ code: "PRIMARY_VIEW_FOREGROUND_FAILED", view });
          }
        }

        const contracts = manifest.geometry?.rotation_contracts ?? {};
        const explicitRequired: string[] = Array.isArray(
          gate.required_rotation_contracts
        )
          ? gate.required_rotation_contracts.map(String)
          : [];
        const inferredRequired = primaryConstraints
          .map((constraint) => String(constraint.rotation_contract ?? ""))
          .filter(Boolean)
          .filter((id) => {
            const contract = contracts[id];
            return (
              contract &&
              !(
                Number(contract.minimum_degrees) <= 0 &&
                Number(contract.maximum_degrees) >= 0
              )
            );
          });
        const requiredContracts = Array.from(
          new Set([...explicitRequired, ...inferredRequired])
        );
        for (const id of requiredContracts) {
          const contract = contracts[id] as GeometryRotationContract | undefined;
          if (!contract) {
            issues.push({ code: "PRIMARY_ROTATION_CONTRACT_MISSING", contract: id });
            continue;
          }
          issues.push(
            ...evaluateRequiredRotation({
              fs,
              sessionRoot: session_root,
              contract,
              constraints: allConstraints,
              profile,
            })
          );
        }

        const groundTolerance = Number.isFinite(
          Number(gate.ground_tolerance_units)
        )
          ? Number(gate.ground_tolerance_units)
          : 0.25;
        for (const name of manifest.geometry?.ground_contacts ?? []) {
          const cube = (Cube.all ?? []).find((candidate) => candidate.name === name);
          if (!cube) {
            issues.push({ code: "PRIMARY_GROUND_CONTACT_MISSING", part: name });
            continue;
          }
          const minimumY = cubeMinimumY(cube);
          if (Math.abs(minimumY) > groundTolerance) {
            issues.push({
              code: "PRIMARY_GROUND_CONTACT_FAILED",
              part: name,
              minimum_y: minimumY,
              tolerance: groundTolerance,
            });
          }
        }

        const result = issues.length === 0 ? "PASS" : "REVISION_REQUIRED";
        const runtime =
          result === "PASS"
            ? markPrimaryFormReady(session_root, {
                verified_at: new Date().toISOString(),
                required_views: requiredViews,
                minimum_view_score: minimumScore,
                required_rotation_contracts: requiredContracts,
                cube_count: Cube.all.length,
                attachment_fit_evidence_required: true,
              })
            : null;

        return {
          content: [
            {
              type: "text",
              text:
                result === "PASS"
                  ? "Primary form passed with smart pivots, attachment fits, and visible rotations. Structural detail is now allowed."
                  : `Primary form needs revision: ${issues
                      .map((issue) => issue.code)
                      .join(", ")}.`,
            },
          ],
          structuredContent: {
            status: result,
            result,
            primary_blueprint: blueprint,
            required_views: requiredViews,
            minimum_view_score: minimumScore,
            required_rotation_contracts: requiredContracts,
            attachment_fit_evidence_required: true,
            issues,
            runtime,
            next_action:
              result === "PASS"
                ? "BUILD_STRUCTURAL_DETAIL"
                : "REPAIR_PRIMARY_FORM_AND_SMART_FITS_ONLY",
          },
        };
      },
    },
    geometryPrimaryGateToolDocs[0].status
  );
}
