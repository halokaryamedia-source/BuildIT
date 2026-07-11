/// <reference types="blockbench-types" />

import { z } from "zod";
import { createTool, type ToolSpec } from "@/lib/factories";
import { STATUS_EXPERIMENTAL } from "@/lib/constants";
import {
  assertInsideRoot,
  readJsonFile,
  writeJsonAtomically,
  type NativeFsLike,
} from "@/lib/atomicFiles";
import { auditProjectRotations, DEFAULT_ROTATION_POLICY } from "@/lib/worldBounds";

const standardViewEnum = z.enum([
  "front",
  "left_side",
  "back",
  "top_footprint",
  "front_left_3_4",
]);

const visualIssueSchema = z.object({
  code: z.string().regex(/^[A-Z0-9_]+$/),
  message: z.string().min(1),
  views: z.array(standardViewEnum).min(1).max(5),
  parts: z.array(z.string().min(1)).max(16).optional().default([]),
});

const recordGeometryVisualDecisionParameters = z.object({
  session_root: z.string().min(1),
  result: z.enum(["PASS", "REVISION_REQUIRED"]),
  scope: z.enum(["LOCAL_REPAIR", "MAJOR_FORM_REVISION"]),
  summary: z.string().min(1),
  compared_views: z.array(standardViewEnum).min(1).max(5),
  issues: z.array(visualIssueSchema).max(12).optional().default([]),
  reference_sha256: z.string().regex(/^[a-f0-9]{64}$/i).optional(),
});

export const geometryDecisionToolDocs: ToolSpec[] = [
  {
    name: "record_geometry_visual_decision",
    description:
      "Records Codex multimodal Geometry judgment only when it is bound to the current fixed-scale diagnosis, Geometry fingerprint, Reference Visual hash, and compared views. A multimodal PASS cannot override failed deterministic metrics.",
    annotations: {
      title: "Record Geometry Visual Decision",
      destructiveHint: true,
      openWorldHint: true,
    },
    parameters: recordGeometryVisualDecisionParameters,
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

function sha256(data: string | Buffer): string {
  // @ts-ignore - Blockbench runtime permission API.
  const cryptoModule = requireNativeModule("crypto", {
    message: "Geometry visual decision requires integrity verification.",
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

function buffer(value: string | Buffer): Buffer {
  return Buffer.isBuffer(value) ? value : Buffer.from(value);
}

export function registerGeometryDecisionTools(): void {
  createTool(
    geometryDecisionToolDocs[0].name,
    {
      ...geometryDecisionToolDocs[0],
      async execute({
        session_root,
        result,
        scope,
        summary,
        compared_views,
        issues,
        reference_sha256,
      }) {
        if (!Project) throw new Error("No Blockbench project is open.");
        const fs = nativeFs(
          "Geometry visual decision needs reference, metrics, and evidence write access."
        );
        const manifestPath = joinPath(
          session_root,
          "references/reference_manifest.json"
        );
        const metricsPath = joinPath(
          session_root,
          "evidence/geometry/geometry_visual_metrics.json"
        );
        const reportPath = joinPath(
          session_root,
          "evidence/geometry/geometry_visual_report.json"
        );
        for (const path of [manifestPath, metricsPath, reportPath]) {
          assertInsideRoot(path, session_root);
        }
        if (!fs.existsSync(metricsPath)) {
          throw new Error(`GEOMETRY_VISUAL_METRICS_MISSING: ${metricsPath}`);
        }
        const manifest = readJsonFile<Record<string, any>>(fs, manifestPath);
        const metrics = readJsonFile<Record<string, any>>(fs, metricsPath);
        const currentFingerprint = geometryFingerprint();
        if (metrics.project?.uuid !== Project.uuid) {
          throw new Error("GEOMETRY_METRICS_PROJECT_MISMATCH");
        }
        if (metrics.geometry_fingerprint !== currentFingerprint) {
          throw new Error(
            "GEOMETRY_VISUAL_METRICS_STALE: Geometry changed after diagnosis."
          );
        }
        if (metrics.analyzer !== "geometry_projection_region_v2") {
          throw new Error(
            `GEOMETRY_ANALYZER_LEGACY: ${metrics.analyzer ?? "unknown"}`
          );
        }
        if (
          metrics.coordinate_policy?.fixed_approved_scale !== true ||
          metrics.coordinate_policy?.free_rescale_current_model !== false
        ) {
          throw new Error("GEOMETRY_FIXED_SCALE_POLICY_MISSING");
        }

        const referenceFilename =
          manifest.reference_visual_lock?.filename ??
          manifest.package?.reference_visual ??
          (manifest.asset?.id
            ? `${manifest.asset.id}_reference_visual.png`
            : null);
        if (!referenceFilename) throw new Error("REFERENCE_VISUAL_PATH_MISSING");
        const referencePath = joinPath(
          session_root,
          `references/${referenceFilename}`
        );
        assertInsideRoot(referencePath, session_root);
        if (!fs.existsSync(referencePath)) {
          throw new Error(`REFERENCE_VISUAL_MISSING: ${referencePath}`);
        }
        const actualReferenceHash = sha256(buffer(fs.readFileSync(referencePath)));
        const expectedReferenceHash = String(
          manifest.reference_visual_lock?.sha256 ?? ""
        ).toLowerCase();
        if (
          expectedReferenceHash &&
          actualReferenceHash !== expectedReferenceHash
        ) {
          throw new Error(
            `REFERENCE_VISUAL_HASH_MISMATCH: ${actualReferenceHash}; expected ${expectedReferenceHash}.`
          );
        }
        if (metrics.reference_visual?.sha256 !== actualReferenceHash) {
          throw new Error("GEOMETRY_METRICS_REFERENCE_MISMATCH");
        }
        if (
          reference_sha256 &&
          reference_sha256.toLowerCase() !== actualReferenceHash
        ) {
          throw new Error(
            `REFERENCE_VISUAL_HASH_MISMATCH: ${actualReferenceHash}; expected ${reference_sha256.toLowerCase()}.`
          );
        }

        const measuredViews = new Set<string>(
          Array.isArray(metrics.views)
            ? metrics.views.map((view: any) => String(view?.view ?? ""))
            : []
        );
        const missingViews = compared_views.filter(
          (view) => !measuredViews.has(view)
        );
        if (missingViews.length > 0) {
          throw new Error(
            `GEOMETRY_DECISION_VIEWS_NOT_DIAGNOSED: ${missingViews.join(", ")}.`
          );
        }
        if (result === "PASS" && metrics.result !== "PASS") {
          const failing = Array.isArray(metrics.views)
            ? metrics.views
                .filter((view: any) => view?.result !== "PASS")
                .map((view: any) => view?.view)
                .filter(Boolean)
                .join(", ")
            : "unknown";
          throw new Error(
            `GEOMETRY_DIAGNOSIS_NOT_PASS: multimodal PASS cannot override failing fixed-scale views ${failing}.`
          );
        }
        if (result === "PASS" && issues.length > 0) {
          throw new Error(
            "VISUAL_RESULT_CONFLICT: PASS cannot include unresolved visual issues."
          );
        }

        const rotationAudit = auditProjectRotations(DEFAULT_ROTATION_POLICY);
        const effectiveIssues = [...issues];
        let effectiveResult = result;
        if (rotationAudit.status === "REVISION_REQUIRED") {
          effectiveResult = "REVISION_REQUIRED";
          effectiveIssues.push({
            code: "ROTATION_SAFETY_FAILED",
            message:
              "One or more cube rotations or pivots violate the Geometry rotation policy.",
            views: compared_views,
            parts: rotationAudit.issues.map((issue) => issue.cube.name),
          });
        }

        const report = {
          schema_version: "2.0",
          stage: "GEOMETRY",
          result: effectiveResult,
          requested_result: result,
          scope,
          summary,
          compared_views,
          issues: effectiveIssues,
          project: { name: Project.name, uuid: Project.uuid },
          geometry_fingerprint: currentFingerprint,
          reference_visual: {
            filename: referenceFilename,
            sha256: actualReferenceHash,
            width: manifest.reference_visual_lock?.width_px ?? null,
            height: manifest.reference_visual_lock?.height_px ?? null,
          },
          deterministic_metrics: {
            path: metricsPath,
            result: metrics.result,
            analyzer: metrics.analyzer,
            geometry_fingerprint: metrics.geometry_fingerprint,
            compared_views: [...measuredViews],
          },
          rotation_audit: rotationAudit,
          created_at: new Date().toISOString(),
        };
        writeJsonAtomically(fs, reportPath, report);
        return {
          content: [
            {
              type: "text",
              text: `Geometry visual decision recorded as ${effectiveResult} (${scope}) and bound to current fixed-scale metrics.`,
            },
          ],
          structuredContent: {
            status: effectiveResult,
            report_path: reportPath,
            report,
          },
        };
      },
    },
    geometryDecisionToolDocs[0].status
  );
}
