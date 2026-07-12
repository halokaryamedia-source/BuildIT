/// <reference types="blockbench-types" />

import { z } from "zod";
import { createTool, type ToolSpec } from "@/lib/factories";
import { STATUS_EXPERIMENTAL } from "@/lib/constants";
import {
  assertInsideRoot,
  writeJsonAtomically,
  type NativeFsLike,
} from "@/lib/atomicFiles";
import { computeProjectContentSignature } from "@/lib/projectFreshness";

const reportStage = z.enum(["TEXTURE", "ANIMATION", "FINAL_VALIDATION"]);
type ReportStage = z.infer<typeof reportStage>;

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

interface ExtendedFs extends NativeFsLike {
  statSync(path: string): { isDirectory(): boolean };
}

interface StagePolicy {
  reportRelative: string;
  evidenceRelative: string[];
}

const policies: Record<ReportStage, StagePolicy> = {
  TEXTURE: {
    reportRelative: "evidence/texture/texture_report.json",
    evidenceRelative: [
      "evidence/texture/texture_atlas.png",
      "evidence/texture/texture_front.png",
      "evidence/texture/texture_left.png",
      "evidence/texture/texture_back.png",
      "evidence/texture/texture_front_left_3_4.png",
    ],
  },
  ANIMATION: {
    reportRelative: "evidence/animation/animation_report.json",
    evidenceRelative: [
      "evidence/animation/animation_neutral_pose.png",
      "evidence/animation/animation_hierarchy.json",
      "evidence/animation/animation_pivots.json",
    ],
  },
  FINAL_VALIDATION: {
    reportRelative: "evidence/final/validation_report.json",
    evidenceRelative: [
      "evidence/final/final_front.png",
      "evidence/final/final_left.png",
      "evidence/final/final_back.png",
      "evidence/final/final_top.png",
      "evidence/final/final_front_left_3_4.png",
      "evidence/final/final_texture_atlas.png",
      "evidence/final/completed_VALIDATION.md",
    ],
  },
};

function joinPath(root: string, relative: string): string {
  const separator = root.includes("\\") && !root.includes("/") ? "\\" : "/";
  return `${root.replace(/[\\/]$/, "")}${separator}${relative.replace(/^[\\/]/, "")}`;
}

function nativeFs(): ExtendedFs {
  // @ts-ignore Blockbench runtime permission API.
  const fs = requireNativeModule("fs", {
    message: "Stage report integrity needs current evidence read/write access.",
    optional: false,
  });
  if (!fs) throw new Error("Filesystem access was denied.");
  return fs as ExtendedFs;
}

function cryptoModule() {
  // @ts-ignore Blockbench runtime permission API.
  const crypto = requireNativeModule("crypto", {
    message: "Stage report integrity needs SHA-256 hashing.",
    optional: false,
  }) as {
    createHash(name: string): {
      update(value: string | Buffer): { digest(encoding: string): string };
    };
  };
  if (!crypto) throw new Error("Crypto access was denied.");
  return crypto;
}

function sha256(value: string | Buffer): string {
  return cryptoModule().createHash("sha256").update(value).digest("hex");
}

function hashPath(fs: ExtendedFs, root: string, path: string): string {
  assertInsideRoot(path, root);
  if (!fs.existsSync(path)) throw new Error(`STAGE_EVIDENCE_MISSING: ${path}`);
  if (!fs.statSync(path).isDirectory()) return sha256(fs.readFileSync(path));

  const entries = (fs.readdirSync?.(path) ?? []).sort();
  const parts: string[] = [];
  for (const entry of entries) {
    const child = joinPath(path, entry);
    parts.push(`${entry}:${hashPath(fs, root, child)}`);
  }
  return sha256(parts.join("\n"));
}

function evidenceFor(
  fs: ExtendedFs,
  root: string,
  stage: ReportStage
): Record<string, string> {
  const relative = [...policies[stage].evidenceRelative];
  if (stage === "FINAL_VALIDATION") {
    const statePath = joinPath(root, "state.json");
    const raw = fs.readFileSync(statePath, "utf8");
    const assetId = String(JSON.parse(String(raw)).asset?.id ?? "");
    if (!assetId) throw new Error("ASSET_ID_MISSING");
    relative.push(`final/${assetId}.bbmodel`, "final/textures");
  }

  return Object.fromEntries(
    relative.map((item) => [item, hashPath(fs, root, joinPath(root, item))])
  );
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
        const policy = policies[stage];
        const reportPath = joinPath(session_root, policy.reportRelative);
        assertInsideRoot(reportPath, session_root);
        const projectSignature = computeProjectContentSignature();
        const evidenceHashes = evidenceFor(fs, session_root, stage);
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
          project_content_signature: projectSignature,
          evidence_hashes: evidenceHashes,
          created_at: createdAt,
          generated_by: "record_stage_review_report",
        };
        writeJsonAtomically(fs, reportPath, report);

        return {
          content: [
            {
              type: "text",
              text: `${stage} review report recorded as ${result} and bound to the current project plus ${Object.keys(evidenceHashes).length} evidence digest(s).`,
            },
          ],
          structuredContent: {
            status: result,
            stage,
            report_path: reportPath,
            project_content_signature: projectSignature,
            evidence_hashes: evidenceHashes,
            created_at: createdAt,
            report,
          },
        };
      },
    },
    stageReportToolDocs[0].status
  );
}
