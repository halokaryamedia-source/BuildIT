/// <reference types="three" />
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
  activateToolProfile,
  getToolProfileSnapshot,
} from "@/lib/toolProfiles";
import {
  auditProjectRotations,
  DEFAULT_ROTATION_POLICY,
} from "@/lib/worldBounds";

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
      "Completes Geometry only after fresh structural validation and its embedded required-view review-readiness gate pass. Saves the next unused approved checkpoint and rolls back the new checkpoint/profile/state if the coordinated Texture transition fails.",
    annotations: {
      title: "Complete Geometry Stage",
      destructiveHint: true,
      openWorldHint: true,
    },
    parameters: completeGeometryStageParameters,
    status: STATUS_EXPERIMENTAL,
  },
];

interface RegisteredTool {
  execute?: (
    args: Record<string, unknown>,
    context?: ToolContext
  ) => Promise<any>;
}

interface CheckpointTarget {
  modelPath: string;
  metadataPath: string;
  checkpointName: string;
}

function joinPath(root: string, relative: string): string {
  const separator = root.includes("\\") && !root.includes("/") ? "\\" : "/";
  return `${root.replace(/[\\/]$/, "")}${separator}${relative.replace(/^[\\/]/, "")}`;
}

function nativeFs(message: string): NativeFsLike {
  // @ts-ignore Blockbench runtime permission API.
  const fs = requireNativeModule("fs", { message, optional: false });
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

function assertValidationPass(validationResult: any): Record<string, any> {
  const report = validationResult?.structuredContent as
    | Record<string, any>
    | undefined;
  if (!report) throw new Error("GEOMETRY_VALIDATION_RESULT_MISSING");

  for (const field of [
    "structural_status",
    "visual_status",
    "deterministic_visual_status",
    "rotation_status",
    "evidence_status",
    "result",
  ]) {
    if (typeof report[field] !== "string") {
      throw new Error(`GEOMETRY_REPORT_FIELD_MISSING: ${field}`);
    }
  }

  if (String(report.result).toUpperCase() !== "PASS") {
    const codes = Array.isArray(report.issues)
      ? report.issues
          .map((issue: any) => issue?.code)
          .filter(Boolean)
          .join(", ")
      : "unknown";
    throw new Error(
      `GEOMETRY_VALIDATION_NOT_PASS: ${report.result}; ${codes}`
    );
  }

  for (const field of [
    "structural_status",
    "visual_status",
    "deterministic_visual_status",
    "evidence_status",
  ]) {
    if (String(report[field]).toUpperCase() !== "PASS") {
      throw new Error(
        `GEOMETRY_REPORT_GATE_NOT_PASS: ${field}=${report[field]}`
      );
    }
  }

  if (
    !["PASS", "WARNING"].includes(
      String(report.rotation_status).toUpperCase()
    )
  ) {
    throw new Error(
      `GEOMETRY_REPORT_GATE_NOT_PASS: rotation_status=${report.rotation_status}`
    );
  }

  const reviewGate = report.review_gate as Record<string, any> | undefined;
  if (!reviewGate || reviewGate.result !== "PASS") {
    const codes = Array.isArray(reviewGate?.issues)
      ? reviewGate.issues
          .map((issue: any) => issue?.code)
          .filter(Boolean)
          .join(", ")
      : "unknown";
    throw new Error(
      `GEOMETRY_REVIEW_GATE_NOT_PASS: ${reviewGate?.result ?? "UNKNOWN"}; ${codes}`
    );
  }

  return report;
}

function nextApprovedCheckpoint(
  fs: NativeFsLike,
  sessionRoot: string
): CheckpointTarget {
  const directory = joinPath(sessionRoot, "checkpoints");
  assertInsideRoot(directory, sessionRoot);
  fs.mkdirSync(directory, { recursive: true });

  let number = 20;
  for (const entry of fs.readdirSync?.(directory) ?? []) {
    const match = entry.match(/^(\d+)_geometry_/i);
    if (match) number = Math.max(number, Number(match[1]) + 1);
  }

  while (number < 10000) {
    const prefix = String(number).padStart(2, "0");
    const checkpointName = `${prefix}_geometry_approved`;
    const modelPath = joinPath(directory, `${checkpointName}.bbmodel`);
    const metadataPath = joinPath(directory, `${checkpointName}.json`);
    if (!fs.existsSync(modelPath) && !fs.existsSync(metadataPath)) {
      return { modelPath, metadataPath, checkpointName };
    }
    number += 1;
  }

  throw new Error("GEOMETRY_APPROVED_CHECKPOINT_NAME_EXHAUSTED");
}

function removeCheckpoint(fs: NativeFsLike, target: CheckpointTarget): void {
  for (const path of [target.modelPath, target.metadataPath]) {
    if (fs.existsSync(path)) fs.rmSync(path, { force: true });
  }
}

export function registerGeometryCompletionTools(): void {
  createTool(
    geometryCompletionToolDocs[0].name,
    {
      ...geometryCompletionToolDocs[0],
      async execute(
        {
          asset_id,
          session_root,
          expected_state_revision,
          expected_project_uuid,
          approval_ref,
          accepted_areas,
        },
        context?: ToolContext
      ) {
        const activeProject = Project;
        if (!activeProject) throw new Error("No Blockbench project is open.");
        if (activeProject.uuid !== expected_project_uuid) {
          throw new Error(
            `PROJECT_UUID_MISMATCH: active ${activeProject.uuid}, expected ${expected_project_uuid}.`
          );
        }

        const fs = nativeFs(
          "MCP guarded Geometry completion needs state, validation, visual evidence, and checkpoint write access."
        );
        const statePath = joinPath(session_root, "state.json");
        assertInsideRoot(statePath, session_root);
        const state = readJsonFile<Record<string, any>>(fs, statePath);
        const previousState = structuredClone(state);

        if (state.asset?.id !== asset_id) {
          throw new Error(
            `ASSET_ID_MISMATCH: state has ${state.asset?.id ?? "unknown"}, expected ${asset_id}.`
          );
        }
        if (
          state.project?.uuid &&
          state.project.uuid !== expected_project_uuid
        ) {
          throw new Error(
            `STATE_PROJECT_UUID_MISMATCH: state has ${state.project.uuid}, expected ${expected_project_uuid}.`
          );
        }
        if (state.state_revision !== expected_state_revision) {
          throw new Error(
            `STATE_REVISION_MISMATCH: state is ${state.state_revision ?? "unknown"}, expected ${expected_state_revision}.`
          );
        }
        if (
          state.workflow?.active_stage !== "GEOMETRY" ||
          state.workflow?.state !== "GEOMETRY_REVIEW"
        ) {
          throw new Error(
            `STAGE_STATE_MISMATCH: Geometry approval requires GEOMETRY_REVIEW; found ${state.workflow?.active_stage}/${state.workflow?.state}.`
          );
        }

        const stageRecord = state.workflow?.stage_records?.GEOMETRY;
        const textureRecord = state.workflow?.stage_records?.TEXTURE;
        if (!stageRecord) {
          throw new Error("STATE_STAGE_RECORD_MISSING: GEOMETRY");
        }
        if (!textureRecord) {
          throw new Error("STATE_STAGE_RECORD_MISSING: TEXTURE");
        }

        // The validator already runs verify_geometry_review_ready internally.
        // Reusing its embedded gate avoids a second identical five-view pass.
        const validationResult = await executeRegisteredTool(
          "validate_geometry_contract",
          {
            session_root,
            expected_project_uuid,
            dimension_tolerance_units: 1,
            require_visual_evidence: true,
          },
          context
        );
        const geometryReport = assertValidationPass(validationResult);
        const reviewGate = geometryReport.review_gate as Record<string, any>;
        const rotationAudit =
          geometryReport.rotation_audit ??
          auditProjectRotations(DEFAULT_ROTATION_POLICY);

        if (rotationAudit.status === "REVISION_REQUIRED") {
          throw new Error(
            `GEOMETRY_ROTATION_NOT_SAFE: ${(rotationAudit.issues ?? [])
              .map((issue: any) => issue.message)
              .join(" ")}`
          );
        }

        const checkpoint = nextApprovedCheckpoint(fs, session_root);
        let checkpointResult: any = null;
        let activationChanged = false;
        const previousProfile = getToolProfileSnapshot(false).profile_id;

        try {
          checkpointResult = await executeRegisteredTool(
            "save_project_checkpoint",
            {
              asset_id,
              path: checkpoint.modelPath,
              metadata_path: checkpoint.metadataPath,
              session_root,
              checkpoint_name: checkpoint.checkpointName,
              stage: "GEOMETRY",
              state: "GEOMETRY_APPROVED",
              expected_project_uuid,
              approved: true,
              approval_ref,
              source_state_revision: expected_state_revision,
              accepted_areas,
              open_issues: [],
            },
            context
          );

          const approvedAt = new Date().toISOString();
          stageRecord.status = "APPROVED";
          stageRecord.decision = "APPROVED";
          stageRecord.approved_at = approvedAt;
          stageRecord.approved_checkpoint = checkpoint.modelPath;
          stageRecord.accepted_areas = accepted_areas;
          stageRecord.open_issues = [];
          stageRecord.revision = null;

          state.checkpoints = state.checkpoints ?? {};
          state.checkpoints.geometry_approved = checkpoint.modelPath;
          state.preservation = state.preservation ?? {};
          state.preservation.approved_stage_areas =
            state.preservation.approved_stage_areas ?? {};
          state.preservation.approved_stage_areas.GEOMETRY = accepted_areas;
          state.preservation.globally_protected_areas = Array.from(
            new Set([
              ...(state.preservation.globally_protected_areas ?? []),
              ...accepted_areas,
            ])
          );
          state.workflow.last_completed_stage = "GEOMETRY";
          state.workflow.last_safe_checkpoint = checkpoint.modelPath;
          textureRecord.status = "IN_PROGRESS";

          const activation = activateToolProfile("BEDROCK_CUBOID_TEXTURE");
          activationChanged = activation.changed;
          const profile = activation.snapshot;
          state.workflow.state = "TEXTURE_IN_PROGRESS";
          state.workflow.active_stage = "TEXTURE";
          state.workflow.status = "IN_PROGRESS";
          state.workflow.next_action = "START_TEXTURE";
          state.mcp = state.mcp ?? {};
          state.mcp.active_tool_profile = profile.profile_id;
          state.mcp.tool_profile_revision = profile.profile_revision;
          state.mcp.tool_profile_hash = profile.tool_profile_hash;
          state.mcp.exposed_tool_count = profile.exposed_tool_count;
          state.mcp.total_library_tool_count =
            profile.total_library_tool_count;
          state.mcp.profile_reconnect_required = false;
          state.mcp.stable_tool_surface = true;
          state.mcp.registered_tool_surface = "STABLE_FULL_LIBRARY";
          state.mcp.execution_surface = "ACTIVE_PROFILE_GUARDED";
          state.state_revision = expected_state_revision + 1;
          state.updated_at = approvedAt;
          state.updated_by = "complete_geometry_stage";
          writeJsonAtomically(fs, statePath, state);

          return {
            content: [
              {
                type: "text",
                text: `Geometry approved through fresh structural and visual validation. Saved ${checkpoint.checkpointName} and transitioned to Texture.`,
              },
            ],
            structuredContent: {
              status: "PASS",
              completed_stage: "GEOMETRY",
              checkpoint: checkpoint.modelPath,
              checkpoint_metadata: checkpoint.metadataPath,
              checkpoint_result:
                checkpointResult?.structuredContent ?? null,
              geometry_report: geometryReport,
              review_gate: reviewGate,
              rotation_audit: rotationAudit,
              state_revision: expected_state_revision + 1,
              next_state: "TEXTURE_IN_PROGRESS",
              next_stage: "TEXTURE",
              next_profile: "BEDROCK_CUBOID_TEXTURE",
              reconnect_required: false,
              current_session_continues: true,
              stable_tool_surface: true,
              write_lease_reacquire_required: activation.changed,
              next_action:
                "Call get_stage_context in the current MCP session, then acquire the fresh Texture lease.",
            },
          };
        } catch (error) {
          if (activationChanged) {
            activateToolProfile(previousProfile);
          }
          removeCheckpoint(fs, checkpoint);
          try {
            writeJsonAtomically(fs, statePath, previousState);
          } catch (rollbackError) {
            console.error(
              "[MCP] Geometry completion state rollback failed:",
              rollbackError
            );
          }
          throw error;
        }
      },
    },
    geometryCompletionToolDocs[0].status
  );
}
