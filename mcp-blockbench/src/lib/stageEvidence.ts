/// <reference types="blockbench-types" />

import {
  assertInsideRoot,
  readJsonFile,
  type NativeFsLike,
} from "@/lib/atomicFiles";
import { computeProjectContentSignature } from "@/lib/projectFreshness";

export type EvidenceStage = "TEXTURE" | "ANIMATION" | "FINAL_VALIDATION";

export interface ExtendedFs extends NativeFsLike {
  statSync(path: string): { isDirectory(): boolean };
}

export interface StageEvidencePolicy {
  reportRelative: string;
  evidenceRelative: string[];
}

export interface CurrentStageEvidence {
  stage: EvidenceStage;
  reportPath: string;
  projectContentSignature: string;
  evidenceHashes: Record<string, string>;
}

export const stageEvidencePolicies: Record<
  EvidenceStage,
  StageEvidencePolicy
> = {
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

export function joinSessionPath(root: string, relative: string): string {
  const separator = root.includes("\\") && !root.includes("/") ? "\\" : "/";
  return `${root.replace(/[\\/]$/, "")}${separator}${relative.replace(/^[\\/]/, "")}`;
}

function cryptoModule() {
  // @ts-ignore Blockbench runtime permission API.
  const crypto = requireNativeModule("crypto", {
    message: "Stage evidence integrity needs SHA-256 hashing.",
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

export function hashEvidencePath(
  fs: ExtendedFs,
  root: string,
  path: string
): string {
  assertInsideRoot(path, root);
  if (!fs.existsSync(path)) throw new Error(`STAGE_EVIDENCE_MISSING: ${path}`);
  if (!fs.statSync(path).isDirectory()) return sha256(fs.readFileSync(path));

  const parts: string[] = [];
  for (const entry of (fs.readdirSync?.(path) ?? []).sort()) {
    const child = joinSessionPath(path, entry);
    parts.push(`${entry}:${hashEvidencePath(fs, root, child)}`);
  }
  return sha256(parts.join("\n"));
}

function assetId(fs: ExtendedFs, root: string): string {
  const statePath = joinSessionPath(root, "state.json");
  assertInsideRoot(statePath, root);
  const state = readJsonFile<Record<string, any>>(fs, statePath);
  const value = String(state.asset?.id ?? "");
  if (!value) throw new Error("ASSET_ID_MISSING");
  return value;
}

export function evidenceRelativePaths(
  fs: ExtendedFs,
  root: string,
  stage: EvidenceStage
): string[] {
  const relative = [...stageEvidencePolicies[stage].evidenceRelative];
  if (stage === "FINAL_VALIDATION") {
    relative.push(`final/${assetId(fs, root)}.bbmodel`, "final/textures");
  }
  return relative;
}

export function currentEvidenceHashes(
  fs: ExtendedFs,
  root: string,
  stage: EvidenceStage
): Record<string, string> {
  return Object.fromEntries(
    evidenceRelativePaths(fs, root, stage).map((relative) => [
      relative,
      hashEvidencePath(fs, root, joinSessionPath(root, relative)),
    ])
  );
}

export function reportPathForStage(
  root: string,
  stage: EvidenceStage
): string {
  return joinSessionPath(root, stageEvidencePolicies[stage].reportRelative);
}

export function currentStageEvidence(
  fs: ExtendedFs,
  root: string,
  stage: EvidenceStage
): CurrentStageEvidence {
  const reportPath = reportPathForStage(root, stage);
  assertInsideRoot(reportPath, root);
  return {
    stage,
    reportPath,
    projectContentSignature: computeProjectContentSignature(),
    evidenceHashes: currentEvidenceHashes(fs, root, stage),
  };
}

function equalHashes(
  expected: Record<string, string>,
  current: Record<string, string>
): boolean {
  const expectedEntries = Object.entries(expected).sort(([a], [b]) =>
    a.localeCompare(b)
  );
  const currentEntries = Object.entries(current).sort(([a], [b]) =>
    a.localeCompare(b)
  );
  return JSON.stringify(expectedEntries) === JSON.stringify(currentEntries);
}

export function assertCurrentStageReport(input: {
  fs: ExtendedFs;
  root: string;
  stage: EvidenceStage;
  projectUuid: string;
  stageRecord?: Record<string, any>;
}): { report: Record<string, any>; current: CurrentStageEvidence } {
  const { fs, root, stage, projectUuid, stageRecord = {} } = input;
  const current = currentStageEvidence(fs, root, stage);
  if (!fs.existsSync(current.reportPath)) {
    throw new Error(`STAGE_REPORT_MISSING: ${current.reportPath}`);
  }
  const report = readJsonFile<Record<string, any>>(fs, current.reportPath);

  if (report.generated_by !== "record_stage_review_report") {
    throw new Error(
      "STAGE_REPORT_UNBOUND: recreate the report with record_stage_review_report."
    );
  }
  if (report.project_uuid !== projectUuid) {
    throw new Error("STAGE_REPORT_PROJECT_MISMATCH");
  }
  if (report.project_content_signature !== current.projectContentSignature) {
    throw new Error(
      "STAGE_REPORT_PROJECT_STALE: active project content changed after the report."
    );
  }
  if (
    !report.evidence_hashes ||
    !equalHashes(report.evidence_hashes, current.evidenceHashes)
  ) {
    throw new Error(
      "STAGE_REPORT_EVIDENCE_STALE: required evidence changed after the report."
    );
  }

  const boundary = Date.parse(
    String(
      stageRecord.revision?.evidence_after ??
        stageRecord.revision?.prepared_at ??
        ""
    )
  );
  if (Number.isFinite(boundary)) {
    const reportTime = Date.parse(String(report.created_at ?? ""));
    if (!Number.isFinite(reportTime) || reportTime <= boundary) {
      throw new Error(
        "STAGE_REPORT_STALE: create a new report after prepare_stage_revision."
      );
    }
  }

  return { report, current };
}
