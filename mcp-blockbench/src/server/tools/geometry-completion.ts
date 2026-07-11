/// <reference types="three" />
/// <reference types="blockbench-types" />

import { z } from "zod";
import { createTool, getAllToolDefinitions, type ToolSpec } from "@/lib/factories";
import { STATUS_EXPERIMENTAL } from "@/lib/constants";
import {
  assertInsideRoot,
  readJsonFile,
  type NativeFsLike,
} from "@/lib/atomicFiles";
import { auditProjectRotations, DEFAULT_ROTATION_POLICY } from "@/lib/worldBounds";

const completeGeometryStageParameters = z.object({
  asset_id: z.string().regex(/^[a-z0-9_]+$/),
  session_root: z.string().min(1),
  expected_state_revision: z.number().int().min(0),
  expected_project_uuid: z.string().min(1),
  approval_ref: z.string().min(1),
  accepted_areas: z.array(z.string()).min(1),
});

export const geometryCompletionToolDocs: ToolSpec[] = [
  {
    name: "complete_geometry_stage",
    description:
      "Completes Geometry only after the current visual report is PASS, non-stale, reference-matched, and rotation-safe; then delegates to the guarded stage transition.",
    annotations: { title: "Complete Geometry Stage", destructiveHint: true, openWorldHint: true },
    parameters: completeGeometryStageParameters,
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
    message: "Geometry completion requires model fingerprint verification.",
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

export function registerGeometryCompletionTools(): void {
  createTool(
    geometryCompletionToolDocs[0].name,
    {
      ...geometryCompletionToolDocs[0],
      async execute({
        asset_id,
        session_root,
        expected_state_revision,
        expected_project_uuid,
        approval_ref,
        accepted_areas,
      }) {
        if (!Project) throw new Error("No Blockbench project is open.");
        if (Project.uuid !== expected_project_uuid) {
          throw new Error(
            `PROJECT_UUID_MISMATCH: active ${Project.uuid}, expected ${expected_project_uuid}.`
          );
        }

        const fs = nativeFs("MCP Geometry completion needs visual evidence access.");
        const visualReportPath = joinPath(
          session_root,
          "evidence/geometry/geometry_visual_report.json"
        );
        assertInsideRoot(visualReportPath, session_root);
        if (!fs.existsSync(visualReportPath)) {
          throw new Error(`GEOMETRY_VISUAL_REPORT_MISSING: ${visualReportPath}`);
        }
        const visualReport = readJsonFile<Record<string, any>>(fs, visualReportPath);
        if (visualReport.result !== "PASS") {
          throw new Error(
            `GEOMETRY_VISUAL_NOT_PASS: report result is ${visualReport.result ?? "UNKNOWN"}.`
          );
        }
        if (visualReport.project?.uuid !== Project.uuid) {
          throw new Error("GEOMETRY_VISUAL_PROJECT_MISMATCH");
        }
        const currentFingerprint = geometryFingerprint();
        if (visualReport.geometry_fingerprint !== currentFingerprint) {
          throw new Error("GEOMETRY_VISUAL_REPORT_STALE: Geometry changed after visual inspection.");
        }
        const rotationAudit = auditProjectRotations(DEFAULT_ROTATION_POLICY);
        if (rotationAudit.status === "REVISION_REQUIRED") {
          throw new Error(
            `GEOMETRY_ROTATION_NOT_SAFE: ${rotationAudit.issues.map((issue) => issue.message).join(" ")}`
          );
        }

        const completeStage = getAllToolDefinitions()["complete_stage"] as unknown as {
          execute?: (args: Record<string, unknown>) => Promise<unknown>;
        };
        if (!completeStage?.execute) {
          throw new Error("complete_stage is unavailable.");
        }
        const delegated = await completeStage.execute({
          asset_id,
          session_root,
          stage: "GEOMETRY",
          expected_state_revision,
          expected_project_uuid,
          approval_ref,
          accepted_areas,
        });

        return {
          content: [
            {
              type: "text",
              text: "Geometry visual, fingerprint, and rotation gates passed; Geometry stage completion delegated successfully.",
            },
          ],
          structuredContent: {
            status: "PASS",
            visual_report_path: visualReportPath,
            geometry_fingerprint: currentFingerprint,
            rotation_audit: rotationAudit,
            delegated_result: delegated,
          },
        };
      },
    },
    geometryCompletionToolDocs[0].status
  );
}
