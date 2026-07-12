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
import {
  getProjectWriteLeaseSnapshot,
  updateProjectWriteLeaseWorkflow,
} from "@/lib/writeLease";

const revisionStage = z.enum(["TEXTURE", "ANIMATION", "FINAL_VALIDATION"]);
type RevisionStage = z.infer<typeof revisionStage>;

const parameters = z.object({
  asset_id: z.string().regex(/^[a-z0-9_]+$/),
  session_root: z.string().min(1),
  stage: revisionStage,
  expected_state_revision: z.number().int().nonnegative(),
  expected_project_uuid: z.string().min(1),
  summary: z.string().min(1).max(1000),
  issues: z.array(z.string().min(1).max(500)).min(1).max(20),
});

export const stageRevisionToolDocs: ToolSpec[] = [
  {
    name: "prepare_stage_revision",
    description:
      "Returns Texture, Animation, or Final Validation from user review to its working state inside the same profile/session, records targeted revision feedback, and advances state plus lease revision before any mutation.",
    annotations: {
      title: "Prepare Stage Revision",
      destructiveHint: true,
      openWorldHint: true,
    },
    parameters,
    status: STATUS_EXPERIMENTAL,
  },
];

interface StagePolicy {
  reviewState: string;
  workingState: string;
  profileId: string;
}

const policies: Record<RevisionStage, StagePolicy> = {
  TEXTURE: {
    reviewState: "TEXTURE_REVIEW",
    workingState: "TEXTURE_IN_PROGRESS",
    profileId: "BEDROCK_CUBOID_TEXTURE",
  },
  ANIMATION: {
    reviewState: "ANIMATION_REVIEW",
    workingState: "ANIMATION_IN_PROGRESS",
    profileId: "BEDROCK_CUBOID_ANIMATION",
  },
  FINAL_VALIDATION: {
    reviewState: "FINAL_REVIEW",
    workingState: "FINAL_VALIDATION",
    profileId: "FINAL_VALIDATION_READONLY",
  },
};

function joinPath(root: string, relative: string): string {
  const separator = root.includes("\\") && !root.includes("/") ? "\\" : "/";
  return `${root.replace(/[\\/]$/, "")}${separator}${relative.replace(/^[\\/]/, "")}`;
}

function nativeFs(): NativeFsLike {
  // @ts-ignore Blockbench runtime permission API.
  const fs = requireNativeModule("fs", {
    message: "Stage revision preparation needs state write access.",
    optional: false,
  });
  if (!fs) throw new Error("Filesystem access was denied.");
  return fs as NativeFsLike;
}

export function registerStageRevisionTools(): void {
  createTool(
    stageRevisionToolDocs[0].name,
    {
      ...stageRevisionToolDocs[0],
      async execute({
        asset_id,
        session_root,
        stage,
        expected_state_revision,
        expected_project_uuid,
        summary,
        issues,
      }) {
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
        if (
          state.workflow?.active_stage !== stage ||
          state.workflow?.state !== policy.reviewState
        ) {
          throw new Error(
            `STAGE_REVISION_STATE_MISMATCH: found ${state.workflow?.active_stage}/${state.workflow?.state}; expected ${stage}/${policy.reviewState}.`
          );
        }

        const lease = getProjectWriteLeaseSnapshot();
        if (
          lease.status !== "ACTIVE" ||
          lease.project_uuid !== expected_project_uuid ||
          lease.state_revision !== expected_state_revision ||
          lease.stage !== stage ||
          lease.profile_id !== policy.profileId
        ) {
          throw new Error("STAGE_REVISION_WRITE_LEASE_REQUIRED");
        }

        const stageRecord = state.workflow?.stage_records?.[stage];
        if (!stageRecord) {
          throw new Error(`STATE_STAGE_RECORD_MISSING: ${stage}`);
        }

        const preparedAt = new Date().toISOString();
        const nextRevision = expected_state_revision + 1;
        state.state_revision = nextRevision;
        state.workflow.state = policy.workingState;
        state.workflow.status = "IN_PROGRESS";
        state.workflow.next_action = "CONTINUE_STAGE";
        stageRecord.status = "IN_PROGRESS";
        stageRecord.decision = "REVISION_REQUIRED";
        stageRecord.open_issues = [...issues];
        stageRecord.revision = {
          source: "USER_REVIEW",
          summary,
          issues: [...issues],
          prepared_at: preparedAt,
          evidence_after: preparedAt,
          profile_switch_required: false,
          reconnect_required: false,
        };
        state.updated_at = preparedAt;
        state.updated_by = "prepare_stage_revision";

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
          writeJsonAtomically(fs, statePath, previousState);
          throw error;
        }

        return {
          content: [
            {
              type: "text",
              text: `${stage} revision prepared inside the current profile. Workflow returned to ${policy.workingState}.`,
            },
          ],
          structuredContent: {
            status: "PASS",
            stage,
            workflow_state: policy.workingState,
            next_action: "CONTINUE_STAGE",
            revision_source: "USER_REVIEW",
            revision_summary: summary,
            issues,
            evidence_after: preparedAt,
            state_revision: nextRevision,
            active_profile: policy.profileId,
            profile_switch_required: false,
            reconnect_required: false,
          },
        };
      },
    },
    stageRevisionToolDocs[0].status
  );
}
