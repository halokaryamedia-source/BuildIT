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
      "Completes Geometry only after the unified five-view deterministic, multimodal, reference-integrity, evidence-freshness, and rotation gates pass. Saves the approved checkpoint and performs the atomic Geometry-to-Texture transition without exposing generic completion to the Geometry profile.",
    annotations: {
      title: "Complete Geometry Stage",
      destructiveHint: true,
      openWorldHint: true,
    },
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

function requireGeometryReportPass(
  fs: NativeFsLike,
  sessionRoot: string
): Record<string, any> {
  const reportPath = joinPath(
    sessionRoot,
    "evidence/geometry/geometry_report.json"
  );
  assertInsideRoot(reportPath, sessionRoot);
  if (!fs.existsSync(reportPath)) {
    throw new Error(`GEOMETRY_REPORT_MISSING: ${reportPath}`);
  }
  const report = readJsonFile<Record<string, any>>(fs, reportPath);
  const required = [
    "structural_status",
    "visual_status",
    "deterministic_visual_status",
    "rotation_status",
    "evidence_status",
    "result",
  ];
  for (const field of required) {
    if (typeof report[field] !== "string") {
      throw new Error(`GEOMETRY_REPORT_FIELD_MISSING: ${field}`);
    }
  }
  if (String(report.result).toUpperCase() !== "PASS") {
    throw new Error(
      `GEOMETRY_REPORT_NOT_PASS: ${reportPath} reports ${report.result}.`
    );
  }
  for (const field of [
    "structural_status",
    "visual_status",
    "deterministic_visual_status",
    "evidence_status",
  ]) {
    if (String(report[field]).toUpperCase() !== "PASS") {
      throw new Error(`GEOMETRY_REPORT_GATE_NOT_PASS: ${field}=${report[field]}`);
    }
  }
  if (
    !["PASS", "WARNING"].includes(String(report.rotation_status).toUpperCase())
  ) {
    throw new Error(
      `GEOMETRY_REPORT_GATE_NOT_PASS: rotation_status=${report.rotation_status}`
    );
  }
  return report;
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
        if (!Project) throw new Error("No Blockbench project is open.");
        if (Project.uuid !== expected_project_uuid) {
          throw new Error(
            `PROJECT_UUID_MISMATCH: active ${Project.uuid}, expected ${expected_project_uuid}.`
          );
        }

        const fs = nativeFs(
          "MCP guarded Geometry completion needs state, visual evidence, and checkpoint write access."
        );
        const statePath = joinPath(session_root, "state.json");
        assertInsideRoot(statePath, session_root);
        const state = readJsonFile<Record<string, any>>(fs, statePath);
        if (state.asset?.id !== asset_id) {
          throw new Error(
            `ASSET_ID_MISMATCH: state has ${state.asset?.id ?? "unknown"}, expected ${asset_id}.`
          );
        }
        if (state.project?.uuid && state.project.uuid !== expected_project_uuid) {
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

        const reviewGate = getAllToolDefinitions()[
          "verify_geometry_review_ready"
        ] as unknown as {
          execute?: (
            args: Record<string, unknown>,
            context?: ToolContext
          ) => Promise<any>;
        };
        if (!reviewGate?.execute) {
          throw new Error("verify_geometry_review_ready is unavailable.");
        }
        const gateResult = await reviewGate.execute(
          {
            session_root,
            expected_project_uuid,
            require_standard_views: true,
          },
          context
        );
        if (gateResult?.structuredContent?.result !== "PASS") {
          const codes = Array.isArray(gateResult?.structuredContent?.issues)
            ? gateResult.structuredContent.issues
                .map((issue: any) => issue?.code)
                .filter(Boolean)
                .join(", ")
            : "unknown";
          throw new Error(
            `GEOMETRY_REVIEW_GATE_NOT_PASS: ${gateResult?.structuredContent?.result ?? "UNKNOWN"}; ${codes}`
          );
        }

        const geometryReport = requireGeometryReportPass(fs, session_root);
        const rotationAudit = auditProjectRotations(DEFAULT_ROTATION_POLICY);
        if (rotationAudit.status === "REVISION_REQUIRED") {
          throw new Error(
            `GEOMETRY_ROTATION_NOT_SAFE: ${rotationAudit.issues
              .map((issue) => issue.message)
              .join(" ")}`
          );
        }

        const checkpointPath = joinPath(
          session_root,
          "checkpoints/20_geometry_approved.bbmodel"
        );
        const checkpointTool = getAllToolDefinitions()[
          "save_project_checkpoint"
        ] as unknown as {
          execute?: (
            args: Record<string, unknown>,
            context?: ToolContext
          ) => Promise<any>;
        };
        if (!checkpointTool?.execute) {
          throw new Error("save_project_checkpoint is unavailable.");
        }
        const checkpointResult = await checkpointTool.execute(
          {
            asset_id,
            path: checkpointPath,
            session_root,
            checkpoint_name: "20_geometry_approved",
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

        const stageRecord = state.workflow?.stage_records?.GEOMETRY;
        if (!stageRecord) {
          throw new Error("STATE_STAGE_RECORD_MISSING: GEOMETRY");
        }
        const approvedAt = new Date().toISOString();
        stageRecord.status = "APPROVED";
        stageRecord.decision = "APPROVED";
        stageRecord.approved_at = approvedAt;
        stageRecord.approved_checkpoint = checkpointPath;
        stageRecord.accepted_areas = accepted_areas;
        stageRecord.open_issues = [];
        stageRecord.revision = null;
        state.checkpoints = state.checkpoints ?? {};
        state.checkpoints.geometry_approved = checkpointPath;
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
        state.workflow.last_safe_checkpoint = checkpointPath;
        state.workflow.stage_records.TEXTURE.status = "IN_PROGRESS";

        const previousProfile = getToolProfileSnapshot(false).profile_id;
        const activation = activateToolProfile("BEDROCK_CUBOID_TEXTURE");
        try {
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
          state.mcp.total_library_tool_count = profile.total_library_tool_count;
          state.mcp.profile_reconnect_required = activation.changed;
          state.state_revision = expected_state_revision + 1;
          state.updated_at = approvedAt;
          state.updated_by = "complete_geometry_stage";
          writeJsonAtomically(fs, statePath, state);
        } catch (error) {
          if (activation.changed) activateToolProfile(previousProfile);
          throw error;
        }

        return {
          content: [
            {
              type: "text",
              text: "Geometry approved through the unified visual and rotation gate. Saved 20_geometry_approved and transitioned to Texture.",
            },
          ],
          structuredContent: {
            status: "PASS",
            completed_stage: "GEOMETRY",
            checkpoint: checkpointPath,
            checkpoint_result: checkpointResult?.structuredContent ?? null,
            geometry_report: geometryReport,
            review_gate: gateResult?.structuredContent ?? null,
            rotation_audit: rotationAudit,
            state_revision: expected_state_revision + 1,
            next_state: "TEXTURE_IN_PROGRESS",
            next_stage: "TEXTURE",
            next_profile: "BEDROCK_CUBOID_TEXTURE",
            reconnect_required: activation.changed,
            next_action: activation.changed
              ? "Reconnect the existing canonical blockbench MCP entry once, call get_runtime_status, then reacquire the write lease from the new state."
              : "START_TEXTURE",
          },
        };
      },
    },
    geometryCompletionToolDocs[0].status
  );
}
