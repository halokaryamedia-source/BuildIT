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
import { transformedCubeCorners } from "@/lib/worldBounds";

const parameters = z.object({
  session_root: z.string().min(1),
  expected_project_uuid: z.string().min(1),
});

export const geometryPrimaryGateToolDocs: ToolSpec[] = [
  {
    name: "verify_primary_form_ready",
    description:
      "Verifies that manifest PRIMARY_MASS and PROVISIONAL_SUPPORT geometry, required primary rotations, ground contacts, cube budget, and left/front/top fixed-scale scores are ready before structural detail is allowed. This is an internal phase gate, not a user review.",
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
  return Array.isArray(patterns) &&
    patterns.some((pattern) => normalized(name).includes(normalized(pattern)));
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

function cubeHasContractRotation(cube: Cube, contract: Record<string, any>): boolean {
  if (!matches(cube.name, contract.cube_patterns)) return false;
  const axis = String(contract.allowed_axis ?? "x");
  const index = axis === "y" ? 1 : axis === "z" ? 2 : 0;
  const angle = Number(cube.rotation?.[index] ?? 0);
  const otherAxes = [0, 1, 2].filter((candidate) => candidate !== index);
  return (
    Number.isFinite(angle) &&
    angle >= Number(contract.minimum_degrees) &&
    angle <= Number(contract.maximum_degrees) &&
    otherAxes.every((candidate) => Math.abs(Number(cube.rotation?.[candidate] ?? 0)) <= 1e-6)
  );
}

function cubeMinimumY(cube: Cube): number {
  return Math.min(...transformedCubeCorners(cube as any).map((point) => point[1]));
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
        const gate = manifest.geometry?.primary_form_gate ?? {};
        const allConstraints = Array.isArray(manifest.geometry?.part_constraints)
          ? manifest.geometry.part_constraints
          : [];
        const primaryConstraints = allConstraints.filter((constraint: any) =>
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
          .map((constraint: any) => String(constraint.rotation_contract ?? ""))
          .filter(Boolean)
          .filter((id: string) => {
            const contract = contracts[id];
            return (
              contract &&
              !(Number(contract.minimum_degrees) <= 0 &&
                Number(contract.maximum_degrees) >= 0)
            );
          });
        const requiredContracts = Array.from(
          new Set([...explicitRequired, ...inferredRequired])
        );
        for (const id of requiredContracts) {
          const contract = contracts[id];
          if (!contract) {
            issues.push({ code: "PRIMARY_ROTATION_CONTRACT_MISSING", contract: id });
            continue;
          }
          if (!(Cube.all ?? []).some((cube) => cubeHasContractRotation(cube, contract))) {
            issues.push({ code: "PRIMARY_ROTATION_NOT_APPLIED", contract: id });
          }
        }

        const groundTolerance = Number.isFinite(Number(gate.ground_tolerance_units))
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
              })
            : null;

        return {
          content: [
            {
              type: "text",
              text:
                result === "PASS"
                  ? "Primary form passed. Structural detail is now allowed."
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
            issues,
            runtime,
            next_action:
              result === "PASS"
                ? "BUILD_STRUCTURAL_DETAIL"
                : "REPAIR_PRIMARY_FORM_ONLY",
          },
        };
      },
    },
    geometryPrimaryGateToolDocs[0].status
  );
}
