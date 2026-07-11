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

const verifyGeometryReviewReadyParameters = z.object({
  session_root: z.string().min(1),
  expected_project_uuid: z.string().optional(),
  require_standard_views: z.boolean().optional().default(true),
});

export const geometryReviewGateToolDocs: ToolSpec[] = [
  {
    name: "verify_geometry_review_ready",
    description:
      "Verifies deterministic metrics, Codex multimodal review, evidence freshness, Reference Visual identity, standard views, and cube-rotation safety before Geometry may enter user review or approval.",
    annotations: { title: "Verify Geometry Review Ready", readOnlyHint: true, openWorldHint: true },
    parameters: verifyGeometryReviewReadyParameters,
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

function sha256(data: string): string {
  // @ts-ignore - Blockbench runtime permission API.
  const cryptoModule = requireNativeModule("crypto", {
    message: "Geometry review readiness requires model fingerprint verification.",
    optional: false,
  }) as { createHash: (algorithm: string) => { update: (value: string) => any; digest: (encoding: string) => string } };
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

        const fs = nativeFs("MCP Geometry review gate needs evidence read access.");
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
        const requiredViews = [
          "geometry_front.png",
          "geometry_left.png",
          "geometry_back.png",
          "geometry_top.png",
          "geometry_front_left_3_4.png",
        ].map((filename) => joinPath(session_root, `evidence/geometry/${filename}`));

        const issues: Array<{
          code: string;
          severity: "BLOCKER" | "REVISION_REQUIRED";
          message: string;
        }> = [];

        for (const path of [visualReportPath, metricsPath, diffPath]) {
          assertInsideRoot(path, session_root);
          if (!fs.existsSync(path)) {
            issues.push({
              code: "GEOMETRY_VISUAL_EVIDENCE_MISSING",
              severity: "BLOCKER",
              message: `Missing required Geometry visual evidence: ${path}`,
            });
          }
        }
        if (require_standard_views) {
          for (const path of requiredViews) {
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

        const currentFingerprint = geometryFingerprint();
        const visualReport = fs.existsSync(visualReportPath)
          ? readJsonFile<Record<string, any>>(fs, visualReportPath)
          : null;
        const metrics = fs.existsSync(metricsPath)
          ? readJsonFile<Record<string, any>>(fs, metricsPath)
          : null;

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
              message: `Deterministic visual comparison failed: ${failingViews || "unknown"}.`,
            });
          }
          if (metrics.project?.uuid !== Project.uuid) {
            issues.push({
              code: "GEOMETRY_METRICS_PROJECT_MISMATCH",
              severity: "BLOCKER",
              message: "Deterministic metrics belong to a different project UUID.",
            });
          }
          if (metrics.geometry_fingerprint !== currentFingerprint) {
            issues.push({
              code: "GEOMETRY_VISUAL_METRICS_STALE",
              severity: "BLOCKER",
              message: "Geometry changed after deterministic comparison.",
            });
          }
        }

        const reportReference = visualReport?.reference_visual?.sha256;
        const metricsReference = metrics?.reference_visual?.sha256;
        if (
          visualReport &&
          metrics &&
          (!reportReference || !metricsReference || reportReference !== metricsReference)
        ) {
          issues.push({
            code: "GEOMETRY_REFERENCE_VISUAL_EVIDENCE_MISMATCH",
            severity: "BLOCKER",
            message: "Multimodal and deterministic evidence use different Reference Visual hashes.",
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
            multimodal_status: visualReport?.result ?? "MISSING",
            deterministic_status: metrics?.result ?? "MISSING",
            reference_sha256: reportReference ?? metricsReference ?? null,
            rotation_status: rotationAudit.status,
            evidence_status: issues.some((issue) => issue.code.includes("MISSING") || issue.code.includes("STALE"))
              ? "INVALID"
              : "CURRENT",
            rotation_audit: rotationAudit,
            issues,
            paths: {
              visual_report: visualReportPath,
              visual_metrics: metricsPath,
              visual_diff: diffPath,
              standard_views: requiredViews,
            },
          },
        };
      },
    },
    geometryReviewGateToolDocs[0].status
  );
}
