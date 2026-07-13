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
  activateToolProfile,
  getToolProfileSnapshot,
  type ToolProfileSnapshot,
} from "@/lib/toolProfiles";
import {
  clearProjectWriteLease,
  getProjectWriteLeaseSnapshot,
} from "@/lib/writeLease";

const stageEnum = z.enum([
  "GEOMETRY",
  "TEXTURE",
  "ANIMATION",
  "FINAL_VALIDATION",
]);
type Stage = z.infer<typeof stageEnum>;

const parameters = z.object({
  asset_id: z.string().regex(/^[a-z0-9_]+$/),
  session_root: z.string().min(1),
  target_stage: z.enum(["GEOMETRY", "TEXTURE", "ANIMATION"]),
  expected_current_stage: stageEnum,
  expected_state_revision: z.number().int().nonnegative(),
  expected_project_uuid: z.string().min(1),
  source: z.enum(["VALIDATION_FAILURE", "USER_REVIEW"]),
  summary: z.string().min(1).max(1000),
  issues: z.array(z.string().min(1).max(500)).min(1).max(20),
});

export const stageReopenToolDocs: ToolSpec[] = [
  {
    name: "reopen_stage_for_revision",
    description:
      "Atomically reopens the earliest affected approved stage from a later stage after explicit validation failure or user review feedback, preserves approved checkpoints as rollback baselines, invalidates downstream stage status, activates the canonical target profile, releases the old lease, and continues in the same MCP session.",
    annotations: {
      title: "Reopen Affected Stage for Revision",
      destructiveHint: true,
      openWorldHint: true,
    },
    parameters,
    status: STATUS_EXPERIMENTAL,
  },
];

const order: Stage[] = [
  "GEOMETRY",
  "TEXTURE",
  "ANIMATION",
  "FINAL_VALIDATION",
];

const profileForStage: Record<Stage, string> = {
  GEOMETRY: "BEDROCK_CUBOID_GEOMETRY",
  TEXTURE: "BEDROCK_CUBOID_TEXTURE",
  ANIMATION: "BEDROCK_CUBOID_ANIMATION",
  FINAL_VALIDATION: "FINAL_VALIDATION_READONLY",
};

const workingStateForStage: Record<Stage, string> = {
  GEOMETRY: "GEOMETRY_IN_PROGRESS",
  TEXTURE: "TEXTURE_IN_PROGRESS",
  ANIMATION: "ANIMATION_IN_PROGRESS",
  FINAL_VALIDATION: "FINAL_VALIDATION",
};

const checkpointKeyForStage: Partial<Record<Stage, string>> = {
  GEOMETRY: "geometry_approved",
  TEXTURE: "texture_approved",
  ANIMATION: "animation_approved_or_skipped",
};

function joinPath(root: string, relative: string): string {
  const separator = root.includes("\\") && !root.includes("/") ? "\\" : "/";
  return `${root.replace(/[\\/]$/, "")}${separator}${relative.replace(/^[\\/]/, "")}`;
}

function nativeFs(): NativeFsLike {
  // @ts-ignore Blockbench runtime permission API.
  const fs = requireNativeModule("fs", {
    message: "Upstream stage reopen needs coordinated state access.",
    optional: false,
  });
  if (!fs) throw new Error("Filesystem access was denied.");
  return fs as NativeFsLike;
}

function stageIndex(stage: Stage): number {
  return order.indexOf(stage);
}

function earlierApprovedAreas(
  state: Record<string, any>,
  targetStage: Stage
): string[] {
  const approved = state.preservation?.approved_stage_areas ?? {};
  const targetIndex = stageIndex(targetStage);
  const values: string[] = [];
  for (const stage of order.slice(0, targetIndex)) {
    const areas = approved[stage];
    if (Array.isArray(areas)) values.push(...areas.map(String));
  }
  return Array.from(new Set(values));
}

function applyProfileMetadata(
  state: Record<string, any>,
  profile: ToolProfileSnapshot,
  _reconnectRequired: boolean
): void {
  state.mcp = state.mcp ?? {};
  state.mcp.active_tool_profile = profile.profile_id;
  state.mcp.tool_profile_revision = profile.profile_revision;
  state.mcp.tool_profile_hash = profile.tool_profile_hash;
  state.mcp.exposed_tool_count = profile.exposed_tool_count;
  state.mcp.total_library_tool_count = profile.total_library_tool_count;
  state.mcp.profile_reconnect_required = false;
  state.mcp.stable_tool_surface = true;
  state.mcp.registered_tool_surface = "STABLE_FULL_LIBRARY";
  state.mcp.execution_surface = "ACTIVE_PROFILE_GUARDED";
}

export function registerStageReopenTools(): void {
  createTool(
    stageReopenToolDocs[0].name,
    {
      ...stageReopenToolDocs[0],
      async execute({
        asset_id,
        session_root,
        target_stage,
        expected_current_stage,
        expected_state_revision,
        expected_project_uuid,
        source,
        summary,
        issues,
      }) {
        if (!Project) throw new Error("No Blockbench project is open.");
        if (Project.uuid !== expected_project_uuid) {
          throw new Error(
            `PROJECT_UUID_MISMATCH: active ${Project.uuid}, expected ${expected_project_uuid}.`
          );
        }

        const target = target_stage as Stage;
        const current = expected_current_stage as Stage;
        if (stageIndex(target) >= stageIndex(current)) {
          throw new Error(
            `STAGE_REOPEN_ORDER_INVALID: ${target} is not earlier than ${current}.`
          );
        }

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
        if (state.workflow?.active_stage !== current) {
          throw new Error(
            `STAGE_REOPEN_CURRENT_STAGE_MISMATCH: state is ${state.workflow?.active_stage ?? "unknown"}, expected ${current}.`
          );
        }

        const lease = getProjectWriteLeaseSnapshot();
        if (
          lease.status !== "ACTIVE" ||
          lease.project_uuid !== expected_project_uuid ||
          lease.state_revision !== expected_state_revision ||
          lease.stage !== current ||
          lease.profile_id !== profileForStage[current]
        ) {
          throw new Error("STAGE_REOPEN_WRITE_LEASE_REQUIRED");
        }

        const targetRecord = state.workflow?.stage_records?.[target];
        if (!targetRecord) {
          throw new Error(`STATE_STAGE_RECORD_MISSING: ${target}`);
        }

        const reopenedAt = new Date().toISOString();
        const nextRevision = expected_state_revision + 1;
        const previousProfile = getToolProfileSnapshot(false);
        const activation = activateToolProfile(profileForStage[target]);

        try {
          state.state_revision = nextRevision;
          state.workflow.active_stage = target;
          state.workflow.state = workingStateForStage[target];
          state.workflow.status = "IN_PROGRESS";
          state.workflow.next_action =
            target === "GEOMETRY" ? "CONTINUE_GEOMETRY" : "CONTINUE_STAGE";
          state.workflow.last_completed_stage =
            stageIndex(target) > 0 ? order[stageIndex(target) - 1] : null;

          const checkpointKey = checkpointKeyForStage[target];
          if (checkpointKey && state.checkpoints?.[checkpointKey]) {
            state.workflow.last_safe_checkpoint = state.checkpoints[checkpointKey];
          }

          targetRecord.status = "IN_PROGRESS";
          targetRecord.decision = "REVISION_REQUIRED";
          targetRecord.open_issues = [...issues];
          targetRecord.revision = {
            source,
            summary,
            issues: [...issues],
            reopened_from_stage: current,
            prepared_at: reopenedAt,
            profile_switch_required: true,
            reconnect_required: false,
          };

          for (const downstream of order.slice(stageIndex(target) + 1)) {
            const record = state.workflow?.stage_records?.[downstream];
            if (!record) continue;
            record.status = "BLOCKED_BY_UPSTREAM_REVISION";
            record.decision = "REVALIDATION_REQUIRED";
            record.revision = {
              source: "UPSTREAM_STAGE_REOPEN",
              target_stage: target,
              reopened_at: reopenedAt,
            };
          }

          state.preservation = state.preservation ?? {};
          state.preservation.globally_protected_areas = earlierApprovedAreas(
            state,
            target
          );

          applyProfileMetadata(state, activation.snapshot, activation.changed);
          state.updated_at = reopenedAt;
          state.updated_by = "reopen_stage_for_revision";

          writeJsonAtomically(fs, statePath, state);
          clearProjectWriteLease();

          return {
            content: [
              {
                type: "text",
                text: `${target} reopened for targeted revision from ${current}. Approved checkpoints were preserved as rollback baselines.`,
              },
            ],
            structuredContent: {
              status: "PASS",
              source,
              previous_stage: current,
              reopened_stage: target,
              workflow_state: workingStateForStage[target],
              state_revision: nextRevision,
              active_profile: activation.snapshot.profile_id,
              profile_switch_required: activation.changed,
              reconnect_required: false,
              current_session_continues: true,
              stable_tool_surface: true,
              write_lease_reacquire_required: true,
              lease_status: "UNCLAIMED",
              preserved_approved_checkpoints: true,
              downstream_revalidation_required: order.slice(
                stageIndex(target) + 1
              ),
              next_action:
                target === "GEOMETRY"
                  ? "Call get_stage_context in the current MCP session, acquire the fresh Geometry lease, then continue Geometry."
                  : "Call get_stage_context in the current MCP session, acquire the fresh target-stage lease, then continue the stage.",
            },
          };
        } catch (error) {
          let restoredProfile = previousProfile;
          if (activation.changed) {
            restoredProfile = activateToolProfile(previousProfile.profile_id).snapshot;
          }
          clearProjectWriteLease();
          applyProfileMetadata(previousState, restoredProfile, activation.changed);
          previousState.updated_at = new Date().toISOString();
          previousState.updated_by = "reopen_stage_for_revision_rollback";
          writeJsonAtomically(fs, statePath, previousState);
          throw error;
        }
      },
    },
    stageReopenToolDocs[0].status
  );
}
