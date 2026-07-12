/// <reference types="blockbench-types" />

import { z } from "zod";
import { createTool, type ToolSpec } from "@/lib/factories";
import { STATUS_EXPERIMENTAL } from "@/lib/constants";
import { writeJsonAtomically } from "@/lib/atomicFiles";
import {
  currentStageEvidence,
  type EvidenceStage,
  type ExtendedFs,
} from "@/lib/stageEvidence";

const reportStage = z.enum(["TEXTURE", "ANIMATION", "FINAL_VALIDATION"]);

const parameters = z
  .object({
    session_root: z.string().min(1),
    expected_project_uuid: z.string().min(1),
    stage: reportStage,
    result: z.enum(["PASS", "REVISION_REQUIRED"]),
    summary: z.string().min(1).max(2000),
    issues: z.array(z.string().min(1).max(500)).max(20).optional().default([]),
    details: z.record(z.unknown()).optional().default({}),
  })
  .superRefine((value, context) => {
    if (value.result === "REVISION_REQUIRED" && value.issues.length === 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["issues"],
        message: "REVISION_REQUIRED needs at least one actionable issue.",
      });
    }
    if (value.result === "PASS" && value.issues.length > 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["issues"],
        message: "PASS cannot contain unresolved issues.",
      });
    }
  });

export const stageReportToolDocs: ToolSpec[] = [
  {
    name: "record_stage_review_report",
    description:
      "Writes the canonical Texture, Animation, or Final Validation report and binds it to the current project serialization plus SHA-256 hashes of every required evidence file/directory. The report becomes stale after any project or evidence change.",
    annotations: {
      title: "Record Current Stage Review Report",
      destructiveHint: false,
      openWorldHint: true,
    },
    parameters,
    status: STATUS_EXPERIMENTAL,
  },
];

function nativeFs(): ExtendedFs {
  // @ts-ignore Blockbench runtime permission API.
  const fs = requireNativeModule("fs", {
    message: "Stage report integrity needs current evidence read/write access.",
    optional: false,
  });
  if (!fs) throw new Error("Filesystem access was denied.");
  return fs as ExtendedFs;
}

export function registerStageReportTools(): void {
  createTool(
    stageReportToolDocs[0].name,
    {
      ...stageReportToolDocs[0],
      async execute({
        session_root,
        expected_project_uuid,
        stage,
        result,
        summary,
        issues,
        details,
      }) {
        if (!Project) throw new Error("No Blockbench project is open.");
        if (Project.uuid !== expected_project_uuid) {
          throw new Error(
            `PROJECT_UUID_MISMATCH: active ${Project.uuid}, expected ${expected_project_uuid}.`
          );
        }

        const fs = nativeFs();
        const current = currentStageEvidence(
          fs,
          session_root,
          stage as EvidenceStage
        );
        const createdAt = new Date().toISOString();
        const report = {
          schema_version: "2.0",
          stage,
          result,
          summary,
          issues,
          details,
          project_uuid: Project.uuid,
          project_name: Project.name,
          project_content_signature: current.projectContentSignature,
          evidence_hashes: current.evidenceHashes,
          created_at: createdAt,
          generated_by: "record_stage_review_report",
        };
        writeJsonAtomically(fs, current.reportPath, report);

        return {
          content: [
            {
              type: "text",
              text: `${stage} review report recorded as ${result} and bound to the current project plus ${Object.keys(current.evidenceHashes).length} evidence digest(s).`,
            },
          ],
          structuredContent: {
            status: result,
            stage,
            report_path: current.reportPath,
            project_content_signature: current.projectContentSignature,
            evidence_hashes: current.evidenceHashes,
            created_at: createdAt,
            report,
          },
        };
      },
    },
    stageReportToolDocs[0].status
  );
}
