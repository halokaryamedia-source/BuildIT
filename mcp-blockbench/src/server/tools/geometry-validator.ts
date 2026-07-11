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
  auditProjectRotations,
  computeProjectWorldBounds,
  transformedCubeCorners,
  DEFAULT_ROTATION_POLICY,
} from "@/lib/worldBounds";

const validateGeometryContractParameters = z.object({
  session_root: z.string().min(1),
  expected_project_uuid: z.string().optional(),
  dimension_tolerance_units: z.number().min(0).max(16).optional().default(1),
  require_visual_evidence: z.boolean().optional().default(true),
});

export const geometryValidatorToolDocs: ToolSpec[] = [
  {
    name: "validate_geometry_contract",
    description:
      "Validates Geometry with transformed world bounds, cube-count range, hierarchy, ground contacts, mesh/animation restrictions, rotation audit, and current unified visual readiness. Writes geometry_report.json with structural, multimodal, deterministic, rotation, evidence, and final statuses.",
    annotations: {
      title: "Validate Geometry Contract",
      destructiveHint: false,
      openWorldHint: true,
    },
    parameters: validateGeometryContractParameters,
    status: STATUS_EXPERIMENTAL,
  },
];

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

function belongsToGroup(cube: Cube, groupName: string): boolean {
  let parent = cube.parent;
  const visited = new Set<unknown>();
  while (parent && parent !== "root" && !visited.has(parent)) {
    visited.add(parent);
    if (parent.name === groupName || parent.uuid === groupName) return true;
    parent = parent.parent;
  }
  return false;
}

function groupMinimumWorldY(groupName: string): number | null {
  const values: number[] = [];
  for (const cube of Cube.all ?? []) {
    if (!belongsToGroup(cube, groupName)) continue;
    values.push(...transformedCubeCorners(cube).map((point) => point[1]));
  }
  return values.length > 0 ? Math.min(...values) : null;
}

function animationCount(): number {
  return (
    (globalThis as unknown as {
      Animation?: { all?: Array<{ name: string }> };
    }).Animation?.all?.length ?? 0
  );
}

export function registerGeometryValidatorTools(): void {
  createTool(
    geometryValidatorToolDocs[0].name,
    {
      ...geometryValidatorToolDocs[0],
      async execute(
        {
          session_root,
          expected_project_uuid,
          dimension_tolerance_units,
          require_visual_evidence,
        },
        context?: ToolContext
      ) {
        if (!Project) throw new Error("No Blockbench project is open.");
        if (expected_project_uuid && Project.uuid !== expected_project_uuid) {
          throw new Error(
            `PROJECT_UUID_MISMATCH: active ${Project.uuid}, expected ${expected_project_uuid}.`
          );
        }
        const fs = nativeFs(
          "Geometry contract validation needs reference, evidence, and report write access."
        );
        const manifestPath = joinPath(
          session_root,
          "references/reference_manifest.json"
        );
        assertInsideRoot(manifestPath, session_root);
        const manifest = readJsonFile<Record<string, any>>(fs, manifestPath);
        const issues: Array<{
          code: string;
          severity: "BLOCKER" | "REVISION_REQUIRED" | "WARNING";
          message: string;
        }> = [];
        const bounds = computeProjectWorldBounds();
        const unitsPerBlock =
          manifest.main_format?.blockbench_units_per_block ?? 16;
        const expected = [
          manifest.main_format?.width_units ??
            manifest.main_format?.width_blocks * unitsPerBlock,
          manifest.main_format?.height_units ??
            manifest.main_format?.height_blocks * unitsPerBlock,
          manifest.main_format?.depth_units ??
            manifest.main_format?.depth_blocks * unitsPerBlock,
        ];
        const labels = ["WIDTH", "HEIGHT", "DEPTH"];
        for (let axis = 0; axis < 3; axis += 1) {
          if (!Number.isFinite(Number(expected[axis]))) continue;
          const delta = Math.abs(bounds.size[axis] - Number(expected[axis]));
          if (delta > dimension_tolerance_units) {
            issues.push({
              code: `DIMENSION_${labels[axis]}_MISMATCH`,
              severity: "REVISION_REQUIRED",
              message: `${labels[axis].toLowerCase()} is ${bounds.size[
                axis
              ].toFixed(3)}u; expected ${Number(expected[axis]).toFixed(
                3
              )} ± ${dimension_tolerance_units}u using transformed world bounds.`,
            });
          }
        }

        const expectedCount = manifest.geometry?.expected_cube_count ?? {};
        const minimum = Number(expectedCount.minimum ?? 0);
        const maximum = Number(expectedCount.maximum ?? Number.POSITIVE_INFINITY);
        if (Cube.all.length < minimum || Cube.all.length > maximum) {
          issues.push({
            code: "CUBE_COUNT_OUT_OF_RANGE",
            severity: "REVISION_REQUIRED",
            message: `Geometry has ${Cube.all.length} cubes; expected ${minimum}..${maximum}.`,
          });
        }
        if (Mesh.all.length > 0 || manifest.geometry?.mesh_allowed === false && Mesh.all.length > 0) {
          issues.push({
            code: "MESH_PRESENT",
            severity: "BLOCKER",
            message: `${Mesh.all.length} mesh element(s) exist in a cuboid-only Geometry stage.`,
          });
        }
        const animations = animationCount();
        if (animations > 0) {
          issues.push({
            code: "ANIMATION_PRESENT_DURING_GEOMETRY",
            severity: "REVISION_REQUIRED",
            message: `${animations} animation(s) exist before Geometry approval.`,
          });
        }

        const groupNames = new Set((Group.all ?? []).map((group) => group.name));
        for (const groupName of Object.keys(manifest.geometry?.hierarchy ?? {})) {
          if (!groupNames.has(groupName)) {
            issues.push({
              code: "REQUIRED_GROUP_MISSING",
              severity: "REVISION_REQUIRED",
              message: `Required group is missing: ${groupName}.`,
            });
          }
        }

        const groundY = Number(manifest.main_format?.ground_plane_y ?? 0);
        const groundContacts: Array<{
          group: string;
          minimum_world_y: number | null;
          delta: number | null;
          result: "PASS" | "REVISION_REQUIRED";
        }> = [];
        for (const group of manifest.geometry?.ground_contacts ?? []) {
          const minimumY = groupMinimumWorldY(String(group));
          const delta = minimumY === null ? null : minimumY - groundY;
          const passed = delta !== null && Math.abs(delta) <= 0.05;
          groundContacts.push({
            group: String(group),
            minimum_world_y: minimumY,
            delta,
            result: passed ? "PASS" : "REVISION_REQUIRED",
          });
          if (!passed) {
            issues.push({
              code: "GROUND_CONTACT_MISMATCH",
              severity: "REVISION_REQUIRED",
              message:
                minimumY === null
                  ? `Ground-contact group ${group} has no cube descendants.`
                  : `Ground-contact group ${group} reaches Y=${minimumY.toFixed(
                      3
                    )}; expected ${groundY.toFixed(3)}.`,
            });
          }
        }

        const rotationAudit = auditProjectRotations(DEFAULT_ROTATION_POLICY);
        for (const issue of rotationAudit.issues) {
          issues.push({
            code: issue.code,
            severity: issue.severity,
            message: issue.message,
          });
        }

        let reviewGate: any = null;
        if (require_visual_evidence) {
          const gate = getAllToolDefinitions()[
            "verify_geometry_review_ready"
          ] as unknown as {
            execute?: (
              args: Record<string, unknown>,
              context?: ToolContext
            ) => Promise<any>;
          };
          if (!gate?.execute) {
            throw new Error("verify_geometry_review_ready is unavailable.");
          }
          reviewGate = await gate.execute(
            {
              session_root,
              expected_project_uuid: Project.uuid,
              require_standard_views: true,
            },
            context
          );
          for (const issue of reviewGate?.structuredContent?.issues ?? []) {
            issues.push({
              code: String(issue.code ?? "GEOMETRY_REVIEW_GATE_ISSUE"),
              severity:
                issue.severity === "BLOCKER" ? "BLOCKER" : "REVISION_REQUIRED",
              message: String(issue.message ?? "Geometry review gate failed."),
            });
          }
        }

        const structuralStatus = issues.some(
          (issue) =>
            !issue.code.includes("VISUAL") &&
            !issue.code.includes("REFERENCE") &&
            issue.severity !== "WARNING"
        )
          ? "REVISION_REQUIRED"
          : "PASS";
        const visualStatus = require_visual_evidence
          ? reviewGate?.structuredContent?.multimodal_status === "PASS"
            ? "PASS"
            : "REVISION_REQUIRED"
          : "NOT_RUN";
        const deterministicVisualStatus = require_visual_evidence
          ? reviewGate?.structuredContent?.deterministic_status === "PASS"
            ? "PASS"
            : "REVISION_REQUIRED"
          : "NOT_RUN";
        const evidenceStatus = require_visual_evidence
          ? reviewGate?.structuredContent?.evidence_status === "CURRENT"
            ? "PASS"
            : "REVISION_REQUIRED"
          : "NOT_RUN";
        const rotationStatus = rotationAudit.status;
        const result = issues.some((issue) => issue.severity === "BLOCKER")
          ? "BLOCKER"
          : structuralStatus === "PASS" &&
              (!require_visual_evidence ||
                (visualStatus === "PASS" &&
                  deterministicVisualStatus === "PASS" &&
                  evidenceStatus === "PASS")) &&
              rotationStatus !== "REVISION_REQUIRED"
            ? "PASS"
            : "REVISION_REQUIRED";

        const reportPath = joinPath(
          session_root,
          "evidence/geometry/geometry_report.json"
        );
        assertInsideRoot(reportPath, session_root);
        const report = {
          schema_version: "2.0",
          asset_id: manifest.asset?.id ?? null,
          stage: "GEOMETRY",
          project_uuid: Project.uuid,
          structural_status: structuralStatus,
          visual_status: visualStatus,
          deterministic_visual_status: deterministicVisualStatus,
          rotation_status: rotationStatus,
          evidence_status: evidenceStatus,
          result,
          world_bounds: bounds,
          counts: {
            cubes: Cube.all.length,
            meshes: Mesh.all.length,
            groups: Group.all.length,
            textures: Texture.all.length,
            animations,
          },
          ground_contacts: groundContacts,
          rotation_audit: rotationAudit,
          review_gate: reviewGate?.structuredContent ?? null,
          issues,
          created_at: new Date().toISOString(),
        };
        writeJsonAtomically(fs, reportPath, report);
        return {
          content: [
            {
              type: "text",
              text: `Geometry contract validation: ${result}. Structural ${structuralStatus}; multimodal ${visualStatus}; deterministic ${deterministicVisualStatus}; rotation ${rotationStatus}; evidence ${evidenceStatus}.`,
            },
          ],
          structuredContent: {
            ...report,
            report_path: reportPath,
          },
        };
      },
    },
    geometryValidatorToolDocs[0].status
  );
}
