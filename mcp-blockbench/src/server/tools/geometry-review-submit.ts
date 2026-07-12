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

const submitGeometryForReviewParameters = z.object({
  asset_id: z.string().regex(/^[a-z0-9_]+$/),
  session_root: z.string().min(1),
  expected_state_revision: z.number().int().nonnegative(),
  expected_project_uuid: z.string().min(1),
});

export const geometryReviewSubmitToolDocs: ToolSpec[] = [
  {
    name: "submit_geometry_for_review",
    description:
      "Runs fresh structural validation and the current Geometry review-readiness gate, saves the next unused non-approved Geometry review checkpoint, and atomically moves the workflow to GEOMETRY_REVIEW. It stays in the existing Geometry profile and MCP session.",
    annotations: {
      title: "Submit Geometry for User Review",
      destructiveHint: true,
      openWorldHint: true,
    },
    parameters: submitGeometryForReviewParameters,
    status: STATUS_EXPERIMENTAL,
  },
];

interface RegisteredTool {
  execute?: (
    args: Record<string, unknown>,
    context?: ToolContext
  ) => Promise<any>;
}

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

async function executeRegisteredTool(
  name: string,
  args: Record<string, unknown>,
  context?: ToolContext
): Promise<any> {
  const tool = getAllToolDefinitions()[name] as unknown as RegisteredTool;
  if (!tool?.execute) throw new Error(`${name} is unavailable.`);
  return tool.execute(args, context);
}

function assertValidationPass(result: any): Record<string, any> {
  const report = result?.structuredContent as Record<string, any> | undefined;
  if (!report) throw new Error("GEOMETRY_VALIDATION_RESULT_MISSING");
  if (String(report.result ?? "").toUpperCase() !== "PASS") {
    const codes = Array.isArray(report.issues)
      ? report.issues
          .map((issue: any) => issue?.code)
          .filter(Boolean)
          .join(", ")
      : "unknown";
    throw new Error(
      `GEOMETRY_VALIDATION_NOT_PASS: ${report.result ?? "UNKNOWN"}; ${codes}`
    );
  }
  for (const field of [
    "structural_status",
    "visual_status",
    "deterministic_visual_status",
    "evidence_status",
  ]) {
    if (String(report[field] ?? "").toUpperCase() !== "PASS") {
      throw new Error(
        `GEOMETRY_REPORT_GATE_NOT_PASS: ${field}=${report[field] ?? "MISSING"}`
      );
    }
  }
  if (
    !["PASS", "WARNING"].includes(
      String(report.rotation_status ?? "").toUpperCase()
    )
  ) {
    throw new Error(
      `GEOMETRY_REPORT_GATE_NOT_PASS: rotation_status=${report.rotation_status ?? "MISSING"}`
    );
  }
  return report;
}

function nextReviewCheckpoint(
  fs: NativeFsLike,
  sessionRoot: string
): { modelPath: string; metadataPath: string; checkpointName: string } {
  const directory = joinPath(sessionRoot, "checkpoints");
  assertInsideRoot(directory, sessionRoot);
  fs.mkdirSync(directory, { recursive: true });

  const entries = fs.readdirSync?.(directory) ?? [];
  let number = 10;
  for (const entry of entries) {
    const match = entry.match(/^(\d+)_geometry_/i);
    if (match) number = Math.max(number, Number(match[1]) + 1);
  }

  while (number < 1000) {
    const prefix = String(number).padStart(2, "0");
    const checkpointName = `${prefix}_geometry_review`;
    const modelPath = joinPath(directory, `${checkpointName}.bbmodel`);
    const metadataPath = joinPath(directory, `${checkpointName}.json`);
    if (!fs.existsSync(modelPath) && !fs.existsSync(metadataPath)) {
      return { modelPath, metadataPath, checkpointName };
    }
    number += 1;
  }

  throw new Error("GEOMETRY_REVIEW_CHECKPOINT_NAME_EXHAUSTED");
}

function removeReviewCheckpoint(
  fs: NativeFsLike,
  modelPath: string,
  metadataPath: string
): void {
  for (const path of [modelPath, metadataPath]) {
    if (fs.existsSync(path)) fs.rmSync(path, { force: true });
  }
}

export function registerGeometryReviewSubmitTools(): void {
  createTool(
    geometryReviewSubmitToolDocs[0].name,
    {
      ...geometryReviewSubmitToolDocs[0],
      async execute(
        {
          asset_id,
          session_root,
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

        const fs = nativeFs(
          "Submitting Geometry for review needs state and checkpoint write access."
        );
        const statePath = joinPath(session_root, "state.json");
        assertInsideRoot(statePath, session_root);
        const state = readJsonFile<Record<string, any>>(fs, statePath);

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
        if (state.workflow?.active_stage !== "GEOMETRY") {
          throw new Error("GEOMETRY_STAGE_NOT_ACTIVE");
        }
        if (state.workflow?.state === "GEOMETRY_REVIEW") {
          throw new Error("GEOMETRY_ALREADY_IN_REVIEW");
        }
        if (state.workflow?.state !== "GEOMETRY_IN_PROGRESS") {
          throw new Error(
            `GEOMETRY_REVIEW_SUBMISSION_STATE_MISMATCH: ${state.workflow?.state ?? "unknown"}.`
          );
        }

        const lease = getProjectWriteLeaseSnapshot();
        if (
          lease.status !== "ACTIVE" ||
          lease.project_uuid !== expected_project_uuid ||
          lease.state_revision !== expected_state_revision ||
          lease.stage !== "GEOMETRY" ||
          lease.profile_id !== "BEDROCK_CUBOID_GEOMETRY"
        ) {
          throw new Error("GEOMETRY_REVIEW_WRITE_LEASE_REQUIRED");
        }

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

        const gateResult = await executeRegisteredTool(
          "verify_geometry_review_ready",
          {
            session_root,
            expected_project_uuid,
            require_standard_views: true,
          },
          context
        );
        const gate = gateResult?.structuredContent as
          | Record<string, any>
          | undefined;
        if (!gate || gate.result !== "PASS") {
          const codes = Array.isArray(gate?.issues)
            ? gate.issues
                .map((issue: any) => issue?.code)
                .filter(Boolean)
                .join(", ")
            : "unknown";
          throw new Error(
            `GEOMETRY_REVIEW_GATE_NOT_PASS: ${gate?.result ?? "UNKNOWN"}; ${codes}`
          );
        }

        const checkpoint = nextReviewCheckpoint(fs, session_root);
        await executeRegisteredTool(
          "save_project_checkpoint",
          {
            asset_id,
            path: checkpoint.modelPath,
            metadata_path: checkpoint.metadataPath,
            session_root,
            checkpoint_name: checkpoint.checkpointName,
            stage: "GEOMETRY",
            state: "GEOMETRY_REVIEW",
            expected_project_uuid,
            approved: false,
            source_state_revision: expected_state_revision,
            accepted_areas: [],
            open_issues: [],
          },
          context
        );

        const previousState = structuredClone(state);
        const nextRevision = expected_state_revision + 1;
        const submittedAt = new Date().toISOString();
        const stageRecord = state.workflow?.stage_records?.GEOMETRY;
        if (!stageRecord) {
          removeReviewCheckpoint(
            fs,
            checkpoint.modelPath,
            checkpoint.metadataPath
          );
          throw new Error("STATE_STAGE_RECORD_MISSING: GEOMETRY");
        }

        state.state_revision = nextRevision;
        state.workflow.state = "GEOMETRY_REVIEW";
        state.workflow.status = "AWAITING_USER_REVIEW";
        state.workflow.active_stage = "GEOMETRY";
        state.workflow.next_action = "AWAIT_GEOMETRY_REVIEW";
        state.workflow.last_safe_checkpoint = checkpoint.modelPath;
        stageRecord.status = "AWAITING_REVIEW";
        stageRecord.decision = null;
        stageRecord.review_checkpoint = checkpoint.modelPath;
        stageRecord.review_submitted_at = submittedAt;
        stageRecord.open_issues = [];
        state.checkpoints = state.checkpoints ?? {};
        state.checkpoints.geometry_review = checkpoint.modelPath;
        state.updated_at = submittedAt;
        state.updated_by = "submit_geometry_for_review";

        let leaseAdvanced = false;
        try {
          updateProjectWriteLeaseWorkflow(lease.owner_session_id, {
            stage: "GEOMETRY",
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
              stage: "GEOMETRY",
              stateRevision: expected_state_revision,
              profileId: lease.profile_id!,
              profileRevision: lease.profile_revision!,
              profileHash: lease.profile_hash!,
            });
          }
          removeReviewCheckpoint(
            fs,
            checkpoint.modelPath,
            checkpoint.metadataPath
          );
          writeJsonAtomically(fs, statePath, previousState);
          throw error;
        }

        return {
          content: [
            {
              type: "text",
              text: `Geometry submitted for user review. Saved ${checkpoint.checkpointName} and moved the workflow to GEOMETRY_REVIEW.`,
            },
          ],
          structuredContent: {
            status: "PASS",
            workflow_state: "GEOMETRY_REVIEW",
            workflow_status: "AWAITING_USER_REVIEW",
            next_action: "AWAIT_GEOMETRY_REVIEW",
            checkpoint: checkpoint.modelPath,
            checkpoint_metadata: checkpoint.metadataPath,
            state_revision: nextRevision,
            active_profile: "BEDROCK_CUBOID_GEOMETRY",
            reconnect_required: false,
            profile_switch_required: false,
            geometry_report: geometryReport,
            review_gate: gate,
          },
        };
      },
    },
    geometryReviewSubmitToolDocs[0].status
  );
}
