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
import { mergeGeometryReferenceProfile } from "@/lib/geometryReferenceProfiles";
import { evaluateGeometryBlueprint } from "@/lib/geometryBlueprint";
import { evaluateGeometrySymmetry } from "@/lib/stageQuality";

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
      "Validates Geometry with transformed world bounds, machine-readable part ranges, cube-count range, hierarchy, true ground contacts, mesh/animation restrictions, rotation audit, and current unified visual readiness. Writes strict geometry_report.json statuses.",
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

function numeric(value: unknown): number | null {
  const result = Number(value);
  return Number.isFinite(result) ? result : null;
}

function expectedUnits(
  unitsValue: unknown,
  blocksValue: unknown,
  unitsPerBlock: number
): number | null {
  const explicit = numeric(unitsValue);
  if (explicit !== null) return explicit;
  const blocks = numeric(blocksValue);
  return blocks === null ? null : blocks * unitsPerBlock;
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
          numeric(manifest.main_format?.blockbench_units_per_block) ?? 16;
        const expected = [
          expectedUnits(
            manifest.main_format?.width_units,
            manifest.main_format?.width_blocks,
            unitsPerBlock
          ),
          expectedUnits(
            manifest.main_format?.height_units,
            manifest.main_format?.height_blocks,
            unitsPerBlock
          ),
          expectedUnits(
            manifest.main_format?.depth_units,
            manifest.main_format?.depth_blocks,
            unitsPerBlock
          ),
        ];
        const labels = ["WIDTH", "HEIGHT", "DEPTH"];
        for (let axis = 0; axis < 3; axis += 1) {
          if (expected[axis] === null) continue;
          const target = expected[axis] as number;
          const delta = Math.abs(bounds.size[axis] - target);
          if (delta > dimension_tolerance_units) {
            issues.push({
              code: `DIMENSION_${labels[axis]}_MISMATCH`,
              severity: "REVISION_REQUIRED",
              message: `${labels[axis].toLowerCase()} is ${bounds.size[
                axis
              ].toFixed(3)}u; expected ${target.toFixed(
                3
              )} ± ${dimension_tolerance_units}u using transformed world bounds.`,
            });
          }
        }

        const expectedCount = manifest.geometry?.expected_cube_count ?? {};
        const minimum = numeric(expectedCount.minimum) ?? 0;
        const maximum =
          numeric(expectedCount.maximum) ?? Number.POSITIVE_INFINITY;
        if (Cube.all.length < minimum || Cube.all.length > maximum) {
          issues.push({
            code: "CUBE_COUNT_OUT_OF_RANGE",
            severity: "REVISION_REQUIRED",
            message: `Geometry has ${Cube.all.length} cubes; expected ${minimum}..${maximum}.`,
          });
        }
        if (Mesh.all.length > 0) {
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

        const profile = mergeGeometryReferenceProfile({
          referenceSha256: manifest.reference_visual_lock?.sha256,
          visualGrounding: manifest.visual_grounding,
          geometry: manifest.geometry,
        });
        const geometryElements = (Cube.all ?? []).map((cube) => {
          const corners = transformedCubeCorners(cube);
          const minimum = [0, 1, 2].map((axis) =>
            Math.min(...corners.map((point) => point[axis]))
          ) as [number, number, number];
          const maximum = [0, 1, 2].map((axis) =>
            Math.max(...corners.map((point) => point[axis]))
          ) as [number, number, number];
          const parentName =
            typeof cube.parent === "string"
              ? cube.parent
              : (cube.parent as unknown as { name?: string })?.name ?? null;
          return {
            name: cube.name,
            from: [...cube.from],
            to: [...cube.to],
            visibility: cube.visibility,
            export: (cube as unknown as { export?: boolean }).export,
            parent_name: parentName,
            world_corners: corners,
            center: [
              (minimum[0] + maximum[0]) / 2,
              (minimum[1] + maximum[1]) / 2,
              (minimum[2] + maximum[2]) / 2,
            ] as [number, number, number],
            size: [
              maximum[0] - minimum[0],
              maximum[1] - minimum[1],
              maximum[2] - minimum[2],
            ] as [number, number, number],
          };
        });
        const blueprint = profile
          ? evaluateGeometryBlueprint(geometryElements, profile.part_constraints)
          : null;
        for (const issue of blueprint?.issues ?? []) {
          issues.push({
            code: issue.code,
            severity: "REVISION_REQUIRED",
            message: issue.message,
          });
        }
        const symmetry = evaluateGeometrySymmetry({
          policy: manifest.geometry?.symmetry_policy,
          toleranceUnits: numeric(manifest.geometry?.symmetry_tolerance_units) ?? 0.35,
          pairs: manifest.geometry?.symmetry_pairs ?? [],
          asymmetryContracts: manifest.geometry?.asymmetry_contracts ?? [],
          elements: geometryElements.map((element) => ({
            name: element.name,
            center: element.center,
            size: element.size,
          })),
        });
        for (const issue of symmetry.issues) {
          issues.push({
            code: issue.code,
            severity: issue.severity,
            message: issue.message,
          });
        }

        const groundY = numeric(manifest.main_format?.ground_plane_y) ?? 0;
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
                issue.severity === "BLOCKER"
                  ? "BLOCKER"
                  : "REVISION_REQUIRED",
              message: String(issue.message ?? "Geometry review gate failed."),
            });
          }
        }

        const visualIssueCodes = [
          "VISUAL",
          "REFERENCE",
          "MULTIMODAL",
          "DETERMINISTIC",
          "ANALYZER",
        ];
        const structuralStatus = issues.some(
          (issue) =>
            !visualIssueCodes.some((marker) => issue.code.includes(marker)) &&
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
          schema_version: "2.1",
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
          blueprint,
          symmetry,
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
