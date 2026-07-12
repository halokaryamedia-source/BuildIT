import { getAllToolDefinitions, type ToolContext } from "@/lib/factories";
import {
  assertInsideRoot,
  readJsonFile,
} from "@/lib/atomicFiles";
import {
  assertCurrentStageReport,
  joinSessionPath,
  type EvidenceStage,
  type ExtendedFs,
} from "@/lib/stageEvidence";

interface RegisteredTool {
  execute?: (
    args: Record<string, unknown>,
    context?: ToolContext
  ) => Promise<any>;
}

interface RoutingPolicy {
  workingState: string;
  reviewState: string;
  awaitAction: string;
  profileId: string;
}

const policies: Record<string, RoutingPolicy> = {
  GEOMETRY: {
    workingState: "GEOMETRY_IN_PROGRESS",
    reviewState: "GEOMETRY_REVIEW",
    awaitAction: "AWAIT_GEOMETRY_REVIEW",
    profileId: "BEDROCK_CUBOID_GEOMETRY",
  },
  TEXTURE: {
    workingState: "TEXTURE_IN_PROGRESS",
    reviewState: "TEXTURE_REVIEW",
    awaitAction: "AWAIT_TEXTURE_REVIEW",
    profileId: "BEDROCK_CUBOID_TEXTURE",
  },
  ANIMATION: {
    workingState: "ANIMATION_IN_PROGRESS",
    reviewState: "ANIMATION_REVIEW",
    awaitAction: "AWAIT_ANIMATION_REVIEW",
    profileId: "BEDROCK_CUBOID_ANIMATION",
  },
  FINAL_VALIDATION: {
    workingState: "FINAL_VALIDATION",
    reviewState: "FINAL_REVIEW",
    awaitAction: "AWAIT_FINAL_REVIEW",
    profileId: "FINAL_VALIDATION_READONLY",
  },
};

let installed = false;

function nativeFs(): ExtendedFs {
  // @ts-ignore Blockbench runtime permission API.
  const fs = requireNativeModule("fs", {
    message: "Compact stage routing needs current state and evidence read access.",
    optional: false,
  });
  if (!fs) throw new Error("Filesystem access was denied.");
  return fs as ExtendedFs;
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

function routeStageContext(args: Record<string, unknown>, result: any): void {
  const structured = result?.structuredContent;
  const context = structured?.context;
  if (!structured || !context) return;

  const stage = String(context.stage ?? "");
  const policy = policies[stage];
  const root = typeof args.session_root === "string" ? args.session_root : null;
  if (!policy || !root) return;

  const fs = nativeFs();
  const statePath = joinSessionPath(root, "state.json");
  assertInsideRoot(statePath, root);
  const state = readJsonFile<Record<string, any>>(fs, statePath);
  const stageRecord = state.workflow?.stage_records?.[stage] ?? {};
  const stateRevision = Number(state.state_revision ?? -1);
  const workflowState = String(context.workflow?.state ?? "");
  const runtimeUuid = context.project?.runtime_uuid ?? null;
  const identityReady = context.project?.identity_ready === true;
  const rebindRequired = context.project?.rebind_required === true;
  const leaseActive = context.lease?.status === "ACTIVE";
  const leaseCurrent = Boolean(
    leaseActive &&
      context.lease?.project_uuid === runtimeUuid &&
      Number(context.lease?.state_revision ?? -2) === stateRevision &&
      context.lease?.profile_id === policy.profileId
  );

  let next = String(structured.next_safe_operation ?? "CONTINUE_STAGE");
  let ready = false;
  let reportError: string | null = null;
  let projectContentSignature: string | null = null;

  if (rebindRequired) {
    next = leaseActive
      ? "manage_project_write_lease:release"
      : "rebind_active_project_identity";
  } else if (!identityReady) {
    next = "BLOCKER:PROJECT_IDENTITY_NOT_READY";
  } else if (workflowState === policy.reviewState) {
    next = policy.awaitAction;
  } else if (leaseActive && !leaseCurrent) {
    next = "manage_project_write_lease:release";
  } else if (!leaseCurrent) {
    next = "manage_project_write_lease:acquire";
  } else if (workflowState === policy.workingState) {
    if (stage === "GEOMETRY") {
      ready = context.geometry?.runtime?.phase === "FINAL_REVIEW_READY";
      if (ready) next = "submit_geometry_for_review";
    } else {
      try {
        const current = assertCurrentStageReport({
          fs,
          root,
          stage: stage as EvidenceStage,
          projectUuid: String(runtimeUuid ?? ""),
          stageRecord,
        });
        ready = reportResult(current.report) === "PASS";
        projectContentSignature = current.current.projectContentSignature;
      } catch (error) {
        reportError = error instanceof Error ? error.message : String(error);
        ready = false;
      }
      next = ready ? "submit_stage_for_review" : "CONTINUE_STAGE";
    }
  }

  context.project = context.project ?? {};
  if (projectContentSignature) {
    context.project.current_content_signature = projectContentSignature;
  }
  structured.next_safe_operation = next;
  context.automation = context.automation ?? {};
  context.automation.exact_next_safe_operation = next;
  context.automation.review_report_tool =
    stage === "GEOMETRY" ? null : "record_stage_review_report";
  context.automation.review_submission_tool =
    stage === "GEOMETRY"
      ? "submit_geometry_for_review"
      : "submit_stage_for_review";
  context.automation.revision_prepare_tool =
    stage === "GEOMETRY"
      ? "prepare_geometry_visual_rebuild"
      : "prepare_stage_revision";
  context.automation.upstream_reopen_tool = "reopen_stage_for_revision";
  context.automation.stage_review_ready = ready;
  context.automation.stage_report_issue = reportError;
  context.automation.lease_current = leaseCurrent;
  context.automation.approval_requires_lease =
    workflowState === policy.reviewState && !leaseCurrent;
  context.automation.user_file_edits_required = false;
  context.automation.user_restart_required = false;
}

export function installStageContextRoutingGuards(): void {
  if (installed) return;
  const definition = getAllToolDefinitions().get_stage_context as
    | RegisteredTool
    | undefined;
  if (!definition?.execute) return;

  const execute = definition.execute;
  definition.execute = async (args, context) => {
    const result = await execute(args, context);
    routeStageContext(args, result);
    return result;
  };

  installed = true;
}
