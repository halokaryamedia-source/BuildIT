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
  getProjectWriteLeaseSnapshot,
  updateProjectWriteLeaseWorkflow,
} from "@/lib/writeLease";

const reviewStage = z.enum(["TEXTURE", "ANIMATION", "FINAL_VALIDATION"]);
type ReviewStage = z.infer<typeof reviewStage>;

const parameters = z.object({
  asset_id: z.string().regex(/^[a-z0-9_]+$/),
  session_root: z.string().min(1),
  stage: reviewStage,
  expected_state_revision: z.number().int().nonnegative(),
  expected_project_uuid: z.string().min(1),
});

export const stageReviewSubmitToolDocs: ToolSpec[] = [
  {
    name: "submit_stage_for_review",
    description:
      "Validates current Texture, Animation, or Final Validation evidence/report, saves the next unused non-approved review checkpoint, and atomically moves workflow state to the corresponding user-review gate without changing profile.",
    annotations: {
      title: "Submit Stage for User Review",
      destructiveHint: true,
      openWorldHint: true,
    },
    parameters,
    status: STATUS_EXPERIMENTAL,
  },
];

interface RegisteredTool {
  execute?: (
    args: Record<string, unknown>,
    context?: ToolContext
  ) => Promise<any>;
}

interface StagePolicy {
  workingState: string;
  reviewState: string;
  reviewStatus: string;
  nextAction: string;
  profileIds: string[];
  checkpointBase: number;
  checkpointStem: string;
  checkpointStateKey: string;
  reportRelative: string;
  requiredEvidence: string[];
}

const policies: Record<ReviewStage, StagePolicy> = {
  TEXTURE: {
    workingState: "TEXTURE_IN_PROGRESS",
    reviewState: "TEXTURE_REVIEW",
    reviewStatus: "AWAITING_USER_REVIEW",
    nextAction: "AWAIT_TEXTURE_REVIEW",
    profileIds: ["BEDROCK_CUBOID_TEXTURE", "TEXTURE_LOCAL_REPAIR"],
    checkpointBase: 30,
    checkpointStem: "texture_review",
    checkpointStateKey: "texture_review",
    reportRelative: "evidence/texture/texture_report.json",
    requiredEvidence: [
      "evidence/texture/texture_atlas.png",
      "evidence/texture/texture_front.png",
      "evidence/texture/texture_left.png",
      "evidence/texture/texture_back.png",
      "evidence/texture/texture_front_left_3_4.png",
      "evidence/texture/texture_report.json",
    ],
  },
  ANIMATION: {
    workingState: "ANIMATION_IN_PROGRESS",
    reviewState: "ANIMATION_REVIEW",
    reviewStatus: "AWAITING_USER_REVIEW",
    nextAction: "AWAIT_ANIMATION_REVIEW",
    profileIds: ["BEDROCK_CUBOID_ANIMATION", "ANIMATION_LOCAL_REPAIR"],
    checkpointBase: 50,
    checkpointStem: "animation_review",
    checkpointStateKey: "animation_review",
    reportRelative: "evidence/animation/animation_report.json",
    requiredEvidence: [
      "evidence/animation/animation_neutral_pose.png",
      "evidence/animation/animation_hierarchy.json",
      "evidence/animation/animation_pivots.json",
      "evidence/animation/animation_report.json",
    ],
  },
  FINAL_VALIDATION: {
    workingState: "FINAL_VALIDATION",
    reviewState: "FINAL_REVIEW",
    reviewStatus: "AWAITING_USER_REVIEW",
    nextAction: "AWAIT_FINAL_REVIEW",
    profileIds: ["FINAL_VALIDATION_READONLY"],
    checkpointBase: 70,
    checkpointStem: "final_candidate",
    checkpointStateKey: "final_candidate",
    reportRelative: "evidence/final/validation_report.json",
    requiredEvidence: [
      "evidence/final/final_front.png",
      "evidence/final/final_left.png",
      "evidence/final/final_back.png",
      "evidence/final/final_top.png",
      "evidence/final/final_front_left_3_4.png",
      "evidence/final/final_texture_atlas.png",
      "evidence/final/validation_report.json",
      "evidence/final/completed_VALIDATION.md",
    ],
  },
};

function joinPath(root: string, relative: string): string {
  const separator = root.includes("\\") && !root.includes("/") ? "\\" : "/";
  return `${root.replace(/[\\/]$/, "")}${separator}${relative.replace(/^[\\/]/, "")}`;
}

function nativeFs(): NativeFsLike {
  // @ts-ignore Blockbench runtime permission API.
  const fs = requireNativeModule("fs", {
    message: "Stage review submission needs state, evidence, and checkpoint access.",
    optional: false,
  });
  if (!fs) throw new Error("Filesystem access was denied.");
  return fs as NativeFsLike;
}

async function executeRegisteredTool(
  name: string,
  args: Record<string, unknown>,
  context?: ToolContext
): Promise<any> {
  const tool = getAllToolDefinitions()[name] as unknown as RegisteredTool;
  if (!tool?.execute) throw new Error(`${name} is unavailable.`);
  return tool.execute(args, context);
}

function reportResult(report: Record<string, any>): string | null {
  const value =
    report.result ??
    report.status ??
    report.final_result ??
    report.validation?.status ??
    report.summary?.result;
  return typeof value === "string" ? value.toUpperCase() : null;
}

function nextCheckpoint(
  fs: NativeFsLike,
  sessionRoot: string,
  policy: StagePolicy
): { modelPath: string; metadataPath: string; checkpointName: string } {
  const directory = joinPath(sessionRoot, "checkpoints");
  assertInsideRoot(directory, sessionRoot);
  fs.mkdirSync(directory, { recursive: true });

  let number = policy.checkpointBase;
  const suffix = policy.checkpointStem.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`^(\\d+)_${suffix}`, "i");
  for (const entry of fs.readdirSync?.(directory) ?? []) {
    const match = entry.match(pattern);
    if (match) number = Math.max(number, Number(match[1]) + 1);
  }

  while (number < 10000) {
    const prefix = String(number).padStart(2, "0");
    const checkpointName = `${prefix}_${policy.checkpointStem}`;
    const modelPath = joinPath(directory, `${checkpointName}.bbmodel`);
    const metadataPath = joinPath(directory, `${checkpointName}.json`);
    if (!fs.existsSync(modelPath) && !fs.existsSync(metadataPath)) {
      return { modelPath, metadataPath, checkpointName };
    }
    number += 1;
  }

  throw new Error("STAGE_REVIEW_CHECKPOINT_NAME_EXHAUSTED");
}

function removeCheckpoint(
  fs: NativeFsLike,
  checkpoint: { modelPath: string; metadataPath: string }
): void {
  for (const path of [checkpoint.modelPath, checkpoint.metadataPath]) {
    if (fs.existsSync(path)) fs.rmSync(path, { force: true });
  }
}

export function registerStageReviewSubmitTools(): void {
  createTool(
    stageReviewSubmitToolDocs[0].name,
    {
      ...stageReviewSubmitToolDocs[0],
      async execute(
        {
          asset_id,
          session_root,
          stage,
          expected_state_revision,
          expected_project_uuid,
        },
        context?: ToolContext
      ) {
        if (!Project) throw new Error("No Blockbench project is open.");
        if (Project.uuid !== expected_project_uuid) {
          throw new Error(
            `PROJECT_UUID_MISMATCH: active ${Project.uuid}, expected ${expected_project_uuid}.`
          );
        }

        const policy = policies[stage];
        const fs = nativeFs();
        const statePath = joinPath(session_root, "state.json");
        assertInsideRoot(statePath, session_root);
        const state = readJsonFile<Record<string, any>>(fs, statePath);
        const previousState = structuredClone(state);

        if (state.asset?.id !== asset_id) {
          throw new Error(
            `ASSET_ID_MISMATCH: state has ${state.asset?.id ?? "unknown"}, expected ${asset_id}.`
          );
        }
        if (state.project?.uuid !== expected_project_uuid) {
          throw new Error("STATE_PROJECT_UUID_MISMATCH");
        }
        if (state.state_revision !== expected_state_revision) {
          throw new Error(
            `STATE_REVISION_MISMATCH: state is ${state.state_revision ?? "unknown"}, expected ${expected_state_revision}.`
          );
        }
        if (state.workflow?.active_stage !== stage) {
          throw new Error(
            `STAGE_STATE_MISMATCH: active stage is ${state.workflow?.active_stage ?? "unknown"}, expected ${stage}.`
          );
        }
        if (state.workflow?.state === policy.reviewState) {
          throw new Error("STAGE_ALREADY_IN_REVIEW");
        }
        if (state.workflow?.state !== policy.workingState) {
          throw new Error(
            `STAGE_REVIEW_SUBMISSION_STATE_MISMATCH: ${state.workflow?.state ?? "unknown"}; expected ${policy.workingState}.`
          );
        }

        const lease = getProjectWriteLeaseSnapshot();
        if (
          lease.status !== "ACTIVE" ||
          lease.project_uuid !== expected_project_uuid ||
          lease.state_revision !== expected_state_revision ||
          lease.stage !== stage ||
          !policy.profileIds.includes(String(lease.profile_id ?? ""))
        ) {
          throw new Error("STAGE_REVIEW_WRITE_LEASE_REQUIRED");
        }

        const requiredEvidence = [...policy.requiredEvidence];
        if (stage === "FINAL_VALIDATION") {
          requiredEvidence.push(`final/${asset_id}.bbmodel`, "final/textures");
        }
        const missing = requiredEvidence
          .map((relative) => joinPath(session_root, relative))
          .filter((path) => {
            assertInsideRoot(path, session_root);
            return !fs.existsSync(path);
          });
        if (missing.length > 0) {
          throw new Error(`STAGE_EVIDENCE_MISSING: ${missing.join(", ")}`);
        }

        const reportPath = joinPath(session_root, policy.reportRelative);
        assertInsideRoot(reportPath, session_root);
        const report = readJsonFile<Record<string, any>>(fs, reportPath);
        const currentReportResult = reportResult(report);
        if (currentReportResult !== "PASS") {
          throw new Error(
            `STAGE_REPORT_NOT_PASS: ${reportPath} reports ${currentReportResult ?? "MISSING"}.`
          );
        }

        const validation = await executeRegisteredTool(
          "validate_reference_contract",
          {
            session_root,
            expected_project_uuid,
            stage,
            dimension_tolerance_units: 1,
            require_evidence: true,
          },
          context
        );
        if (validation?.structuredContent?.result !== "PASS") {
          const codes = Array.isArray(validation?.structuredContent?.issues)
            ? validation.structuredContent.issues
                .map((issue: any) => issue?.code)
                .filter(Boolean)
                .join(", ")
            : "unknown";
          throw new Error(
            `STAGE_VALIDATION_NOT_PASS: ${validation?.structuredContent?.result ?? "UNKNOWN"}; ${codes}`
          );
        }

        const stageRecord = state.workflow?.stage_records?.[stage];
        if (!stageRecord) {
          throw new Error(`STATE_STAGE_RECORD_MISSING: ${stage}`);
        }

        const checkpoint = nextCheckpoint(fs, session_root, policy);
        await executeRegisteredTool(
          "save_project_checkpoint",
          {
            asset_id,
            path: checkpoint.modelPath,
            metadata_path: checkpoint.metadataPath,
            session_root,
            checkpoint_name: checkpoint.checkpointName,
            stage,
            state: policy.reviewState,
            expected_project_uuid,
            approved: false,
            source_state_revision: expected_state_revision,
            accepted_areas: [],
            open_issues: [],
          },
          context
        );

        const submittedAt = new Date().toISOString();
        const nextRevision = expected_state_revision + 1;
        state.state_revision = nextRevision;
        state.workflow.state = policy.reviewState;
        state.workflow.status = policy.reviewStatus;
        state.workflow.next_action = policy.nextAction;
        state.workflow.last_safe_checkpoint = checkpoint.modelPath;
        stageRecord.status = "AWAITING_REVIEW";
        stageRecord.decision = null;
        stageRecord.review_checkpoint = checkpoint.modelPath;
        stageRecord.review_submitted_at = submittedAt;
        stageRecord.open_issues = [];
        state.checkpoints = state.checkpoints ?? {};
        state.checkpoints[policy.checkpointStateKey] = checkpoint.modelPath;
        state.updated_at = submittedAt;
        state.updated_by = "submit_stage_for_review";

        let leaseAdvanced = false;
        try {
          updateProjectWriteLeaseWorkflow(lease.owner_session_id, {
            stage,
            stateRevision: nextRevision,
            profileId: lease.profile_id!,
            profileRevision: lease.profile_revision!,
            profileHash: lease.profile_hash!,
          });
          leaseAdvanced = true;
          writeJsonAtomically(fs, statePath, state);
        } catch (error) {
          if (leaseAdvanced) {
            updateProjectWriteLeaseWorkflow(lease.owner_session_id, {
              stage,
              stateRevision: expected_state_revision,
              profileId: lease.profile_id!,
              profileRevision: lease.profile_revision!,
              profileHash: lease.profile_hash!,
            });
          }
          removeCheckpoint(fs, checkpoint);
          writeJsonAtomically(fs, statePath, previousState);
          throw error;
        }

        return {
          content: [
            {
              type: "text",
              text: `${stage} submitted for user review. Saved ${checkpoint.checkpointName} and moved workflow state to ${policy.reviewState}.`,
            },
          ],
          structuredContent: {
            status: "PASS",
            stage,
            workflow_state: policy.reviewState,
            workflow_status: policy.reviewStatus,
            next_action: policy.nextAction,
            checkpoint: checkpoint.modelPath,
            checkpoint_metadata: checkpoint.metadataPath,
            state_revision: nextRevision,
            active_profile: lease.profile_id,
            profile_switch_required: false,
            reconnect_required: false,
            validation: validation?.structuredContent ?? null,
            report_path: reportPath,
          },
        };
      },
    },
    stageReviewSubmitToolDocs[0].status
  );
}
