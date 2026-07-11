/// <reference types="three" />
/// <reference types="blockbench-types" />

import { z } from "zod";
import { createTool, type ToolSpec } from "@/lib/factories";
import { STATUS_EXPERIMENTAL } from "@/lib/constants";
import {
  assertInsideRoot,
  readJsonFile,
  type NativeFsLike,
} from "@/lib/atomicFiles";
import { auditProjectRotations, DEFAULT_ROTATION_POLICY } from "@/lib/worldBounds";
import { readGeometryRuntimeContext } from "@/lib/geometryRuntime";

const verifyGeometryReviewReadyParameters = z.object({
  session_root: z.string().min(1),
  expected_project_uuid: z.string().optional(),
  require_standard_views: z.boolean().optional().default(true),
});

export const geometryReviewGateToolDocs: ToolSpec[] = [
  {
    name: "verify_geometry_review_ready",
    description:
      "Verifies final Geometry runtime phase, complete five-view fixed-scale metrics, Codex multimodal review, evidence freshness, actual Reference Visual identity, standard views, and cube-rotation safety before user review or approval.",
    annotations: {
      title: "Verify Geometry Review Ready",
      readOnlyHint: true,
      openWorldHint: true,
    },
    parameters: verifyGeometryReviewReadyParameters,
    status: STATUS_EXPERIMENTAL,
  },
];

const REQUIRED_VIEWS = [
  "front",
  "left_side",
  "back",
  "top_footprint",
  "front_left_3_4",
] as const;

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

function sha256(data: string | Buffer): string {
  // @ts-ignore - Blockbench runtime permission API.
  const cryptoModule = requireNativeModule("crypto", {
    message: "Geometry review readiness requires integrity verification.",
    optional: false,
  }) as {
    createHash: (algorithm: string) => {
      update: (value: string | Buffer) => { digest: (encoding: string) => string };
    };
  };
  if (!cryptoModule) throw new Error("Crypto access was denied.");
  return cryptoModule.createHash("sha256").update(data).digest("hex");
}

function geometryFingerprint(): string {
  const cubes = (Cube.all ?? [])
    .map((cube) => ({
      uuid: cube.uuid,
      name: cube.name,
      from: [...cube.from],
      to: [...cube.to],
      origin: [...cube.origin],
      rotation: [...cube.rotation],
      inflate: cube.inflate,
      parent: typeof cube.parent === "string" ? cube.parent : cube.parent?.uuid,
    }))
    .sort((a, b) => String(a.uuid).localeCompare(String(b.uuid)));
  return sha256(JSON.stringify(cubes));
}

function asBuffer(value: Buffer | string): Buffer {
  return Buffer.isBuffer(value) ? value : Buffer.from(value);
}

export function registerGeometryReviewGateTools(): void {
  createTool(
    geometryReviewGateToolDocs[0].name,
    {
      ...geometryReviewGateToolDocs[0],
      async execute({ session_root, expected_project_uuid, require_standard_views }) {
        if (!Project) throw new Error("No Blockbench project is open.");
        if (expected_project_uuid && Project.uuid !== expected_project_uuid) {
          throw new Error(
            `PROJECT_UUID_MISMATCH: active ${Project.uuid}, expected ${expected_project_uuid}.`
          );
        }

        const fs = nativeFs(
          "MCP Geometry review gate needs reference and evidence read access."
        );
        const manifestPath = joinPath(
          session_root,
          "references/reference_manifest.json"
        );
        const visualReportPath = joinPath(
          session_root,
          "evidence/geometry/geometry_visual_report.json"
        );
        const metricsPath = joinPath(
          session_root,
          "evidence/geometry/geometry_visual_metrics.json"
        );
        const diffPath = joinPath(
          session_root,
          "evidence/geometry/geometry_visual_diff.png"
        );
        const requiredViewPaths = [
          "geometry_front.png",
          "geometry_left.png",
          "geometry_back.png",
          "geometry_top.png",
          "geometry_front_left_3_4.png",
        ].map((filename) =>
          joinPath(session_root, `evidence/geometry/${filename}`)
        );

        const issues: Array<{
          code: string;
          severity: "BLOCKER" | "REVISION_REQUIRED";
          message: string;
        }> = [];

        for (const path of [manifestPath, visualReportPath, metricsPath, diffPath]) {
          assertInsideRoot(path, session_root);
          if (!fs.existsSync(path)) {
            issues.push({
              code:
                path === manifestPath
                  ? "REFERENCE_MANIFEST_MISSING"
                  : "GEOMETRY_VISUAL_EVIDENCE_MISSING",
              severity: "BLOCKER",
              message: `Missing required Geometry review input: ${path}`,
            });
          }
        }
        if (require_standard_views) {
          for (const path of requiredViewPaths) {
            assertInsideRoot(path, session_root);
            if (!fs.existsSync(path)) {
              issues.push({
                code: "GEOMETRY_STANDARD_VIEW_MISSING",
                severity: "BLOCKER",
                message: `Missing required standard view: ${path}`,
              });
            }
          }
        }

        const runtime = readGeometryRuntimeContext(session_root);
        if (runtime.phase !== "FINAL_REVIEW_READY") {
          issues.push({
            code:
              runtime.phase === "VISUAL_CONVERGENCE_FAILED"
                ? "VISUAL_CONVERGENCE_FAILED"
                : "GEOMETRY_RUNTIME_PHASE_NOT_READY",
            severity:
              runtime.phase === "VISUAL_CONVERGENCE_FAILED"
                ? "BLOCKER"
                : "REVISION_REQUIRED",
            message: `Geometry runtime phase is ${runtime.phase}; final review requires FINAL_REVIEW_READY.`,
          });
        }

        const manifest = fs.existsSync(manifestPath)
          ? readJsonFile<Record<string, any>>(fs, manifestPath)
          : null;
        const visualReport = fs.existsSync(visualReportPath)
          ? readJsonFile<Record<string, any>>(fs, visualReportPath)
          : null;
        const metrics = fs.existsSync(metricsPath)
          ? readJsonFile<Record<string, any>>(fs, metricsPath)
          : null;
        const currentFingerprint = geometryFingerprint();

        const referenceFilename =
          manifest?.reference_visual_lock?.filename ??
          manifest?.package?.reference_visual ??
          (manifest?.asset?.id
            ? `${manifest.asset.id}_reference_visual.png`
            : null);
        const expectedReferenceHash = String(
          manifest?.reference_visual_lock?.sha256 ?? ""
        ).toLowerCase();
        let actualReferenceHash: string | null = null;
        let referencePath: string | null = null;
        if (!referenceFilename) {
          issues.push({
            code: "REFERENCE_VISUAL_PATH_MISSING",
            severity: "BLOCKER",
            message: "Manifest does not identify the approved Reference Visual.",
          });
        } else {
          referencePath = joinPath(
            session_root,
            `references/${referenceFilename}`
          );
          assertInsideRoot(referencePath, session_root);
          if (!fs.existsSync(referencePath)) {
            issues.push({
              code: "REFERENCE_VISUAL_MISSING",
              severity: "BLOCKER",
              message: `Approved Reference Visual is missing: ${referencePath}`,
            });
          } else {
            actualReferenceHash = sha256(
              asBuffer(fs.readFileSync(referencePath))
            );
            if (
              expectedReferenceHash &&
              actualReferenceHash !== expectedReferenceHash
            ) {
              issues.push({
                code: "REFERENCE_VISUAL_HASH_MISMATCH",
                severity: "BLOCKER",
                message: `Reference Visual hash ${actualReferenceHash} differs from manifest ${expectedReferenceHash}.`,
              });
            }
          }
        }

        if (visualReport) {
          if (visualReport.result !== "PASS") {
            issues.push({
              code: "GEOMETRY_MULTIMODAL_VISUAL_NOT_PASS",
              severity: "REVISION_REQUIRED",
              message: `Codex visual report is ${visualReport.result ?? "UNKNOWN"}.`,
            });
          }
          if (visualReport.project?.uuid !== Project.uuid) {
            issues.push({
              code: "GEOMETRY_VISUAL_PROJECT_MISMATCH",
              severity: "BLOCKER",
              message: "Codex visual report belongs to a different project UUID.",
            });
          }
          if (visualReport.geometry_fingerprint !== currentFingerprint) {
            issues.push({
              code: "GEOMETRY_VISUAL_REPORT_STALE",
              severity: "BLOCKER",
              message: "Geometry changed after Codex visual inspection.",
            });
          }
          const compared = new Set<string>(
            Array.isArray(visualReport.compared_views)
              ? visualReport.compared_views.map(String)
              : []
          );
          const missing = REQUIRED_VIEWS.filter((view) => !compared.has(view));
          if (missing.length > 0) {
            issues.push({
              code: "GEOMETRY_MULTIMODAL_VIEWS_INCOMPLETE",
              severity: "BLOCKER",
              message: `Codex visual report did not inspect all final views: ${missing.join(", ")}.`,
            });
          }
        }

        if (metrics) {
          if (metrics.result !== "PASS") {
            const failingViews = Array.isArray(metrics.views)
              ? metrics.views
                  .filter((view: any) => view?.result !== "PASS")
                  .map((view: any) => view?.view)
                  .filter(Boolean)
                  .join(", ")
              : "unknown";
            issues.push({
              code: "GEOMETRY_DETERMINISTIC_VISUAL_NOT_PASS",
              severity: "REVISION_REQUIRED",
              message: `Fixed-scale Geometry diagnosis failed: ${
                failingViews || "unknown"
              }.`,
            });
          }
          if (metrics.project?.uuid !== Project.uuid) {
            issues.push({
              code: "GEOMETRY_METRICS_PROJECT_MISMATCH",
              severity: "BLOCKER",
              message: "Geometry metrics belong to a different project UUID.",
            });
          }
          if (metrics.geometry_fingerprint !== currentFingerprint) {
            issues.push({
              code: "GEOMETRY_VISUAL_METRICS_STALE",
              severity: "BLOCKER",
              message: "Geometry changed after fixed-scale diagnosis.",
            });
          }
          const measured = new Map<string, any>(
            Array.isArray(metrics.views)
              ? metrics.views.map((view: any) => [String(view?.view ?? ""), view])
              : []
          );
          const missing = REQUIRED_VIEWS.filter((view) => !measured.has(view));
          if (missing.length > 0) {
            issues.push({
              code: "GEOMETRY_DETERMINISTIC_VIEWS_INCOMPLETE",
              severity: "BLOCKER",
              message: `Fixed-scale diagnosis did not include all final views: ${missing.join(", ")}.`,
            });
          }
          for (const view of REQUIRED_VIEWS) {
            const metric = measured.get(view);
            if (metric && metric.result !== "PASS") {
              issues.push({
                code: String(
                  metric.issue_code ?? "GEOMETRY_VIEW_SILHOUETTE_MISMATCH"
                ),
                severity: "REVISION_REQUIRED",
                message: `${view} score ${Number(metric.score ?? 0).toFixed(
                  3
                )} is below ${Number(metric.minimum_score ?? 0).toFixed(3)}.`,
              });
            }
          }
          if (metrics.analyzer !== "geometry_projection_region_v2") {
            issues.push({
              code: "GEOMETRY_ANALYZER_LEGACY",
              severity: "BLOCKER",
              message: `Geometry metrics were produced by unsupported analyzer ${
                metrics.analyzer ?? "unknown"
              }.`,
            });
          }
          if (
            metrics.coordinate_policy?.fixed_approved_scale !== true ||
            metrics.coordinate_policy?.free_rescale_current_model !== false
          ) {
            issues.push({
              code: "GEOMETRY_FIXED_SCALE_POLICY_MISSING",
              severity: "BLOCKER",
              message:
                "Geometry metrics do not prove fixed approved scale with current-model free rescale disabled.",
            });
          }
        }

        const reportReference = String(
          visualReport?.reference_visual?.sha256 ?? ""
        ).toLowerCase();
        const metricsReference = String(
          metrics?.reference_visual?.sha256 ?? ""
        ).toLowerCase();
        if (
          visualReport &&
          metrics &&
          (!reportReference ||
            !metricsReference ||
            reportReference !== metricsReference)
        ) {
          issues.push({
            code: "GEOMETRY_REFERENCE_VISUAL_EVIDENCE_MISMATCH",
            severity: "BLOCKER",
            message:
              "Multimodal and fixed-scale evidence use different Reference Visual hashes.",
          });
        }
        if (
          actualReferenceHash &&
          ((reportReference && reportReference !== actualReferenceHash) ||
            (metricsReference && metricsReference !== actualReferenceHash))
        ) {
          issues.push({
            code: "GEOMETRY_EVIDENCE_REFERENCE_STALE",
            severity: "BLOCKER",
            message:
              "Visual evidence was produced from a different Reference Visual than the current approved file.",
          });
        }

        const rotationAudit = auditProjectRotations(DEFAULT_ROTATION_POLICY);
        if (rotationAudit.status === "REVISION_REQUIRED") {
          issues.push({
            code: "GEOMETRY_ROTATION_NOT_SAFE",
            severity: "REVISION_REQUIRED",
            message: rotationAudit.issues.map((issue) => issue.message).join(" "),
          });
        }

        const result = issues.some((issue) => issue.severity === "BLOCKER")
          ? "BLOCKER"
          : issues.length > 0
            ? "REVISION_REQUIRED"
            : "PASS";
        return {
          content: [
            {
              type: "text",
              text: `Geometry review readiness: ${result}. ${issues.length} issue(s).`,
            },
          ],
          structuredContent: {
            result,
            project_uuid: Project.uuid,
            geometry_fingerprint: currentFingerprint,
            runtime_phase: runtime.phase,
            multimodal_status: visualReport?.result ?? "MISSING",
            deterministic_status: metrics?.result ?? "MISSING",
            reference_sha256: actualReferenceHash,
            expected_reference_sha256: expectedReferenceHash || null,
            rotation_status: rotationAudit.status,
            evidence_status: issues.some(
              (issue) =>
                issue.code.includes("MISSING") ||
                issue.code.includes("STALE") ||
                issue.code.includes("INCOMPLETE") ||
                issue.code.includes("MISMATCH") ||
                issue.code.includes("LEGACY") ||
                issue.code.includes("POLICY")
            )
              ? "INVALID"
              : "CURRENT",
            rotation_audit: rotationAudit,
            issues,
            paths: {
              manifest: manifestPath,
              reference_visual: referencePath,
              visual_report: visualReportPath,
              visual_metrics: metricsPath,
              visual_diff: diffPath,
              standard_views: requiredViewPaths,
            },
          },
        };
      },
    },
    geometryReviewGateToolDocs[0].status
  );
}
