import { getAllToolDefinitions, type ToolContext } from "@/lib/factories";
import {
  assertInsideRoot,
  readJsonFile,
  type NativeFsLike,
} from "@/lib/atomicFiles";

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
  reportRelative: string;
  requiredEvidence: string[];
}

const policies: Record<string, RoutingPolicy> = {
  TEXTURE: {
    workingState: "TEXTURE_IN_PROGRESS",
    reviewState: "TEXTURE_REVIEW",
    awaitAction: "AWAIT_TEXTURE_REVIEW",
    profileId: "BEDROCK_CUBOID_TEXTURE",
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
    awaitAction: "AWAIT_ANIMATION_REVIEW",
    profileId: "BEDROCK_CUBOID_ANIMATION",
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
    awaitAction: "AWAIT_FINAL_REVIEW",
    profileId: "FINAL_VALIDATION_READONLY",
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

let installed = false;

function joinPath(root: string, relative: string): string {
  const separator = root.includes("\\") && !root.includes("/") ? "\\" : "/";
  return `${root.replace(/[\\/]$/, "")}${separator}${relative.replace(/^[\\/]/, "")}`;
}

function nativeFs(): NativeFsLike {
  // @ts-ignore Blockbench runtime permission API.
  const fs = requireNativeModule("fs", {
    message: "Compact stage routing needs current state and evidence read access.",
    optional: false,
  });
  if (!fs) throw new Error("Filesystem access was denied.");
  return fs as NativeFsLike;
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

function timestamp(value: unknown): number | null {
  const parsed = Date.parse(String(value ?? ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function reviewReady(
  fs: NativeFsLike,
  root: string,
  assetId: string | null,
  stage: string,
  policy: RoutingPolicy,
  stageRecord: Record<string, any>
): boolean {
  const required = [...policy.requiredEvidence];
  if (stage === "FINAL_VALIDATION" && assetId) {
    required.push(`final/${assetId}.bbmodel`, "final/textures");
  }

  for (const relative of required) {
    const path = joinPath(root, relative);
    assertInsideRoot(path, root);
    if (!fs.existsSync(path)) return false;
  }

  const reportPath = joinPath(root, policy.reportRelative);
  assertInsideRoot(reportPath, root);
  const report = readJsonFile<Record<string, any>>(fs, reportPath);
  if (reportResult(report) !== "PASS") return false;

  const boundary = timestamp(
    stageRecord.revision?.evidence_after ?? stageRecord.revision?.prepared_at
  );
  if (boundary === null) return true;
  const reportTime = timestamp(report.created_at ?? report.updated_at);
  return reportTime !== null && reportTime > boundary;
}

function routeStageContext(args: Record<string, unknown>, result: any): void {
  const structured = result?.structuredContent;
  const context = structured?.context;
  if (!structured || !context || context.stage === "GEOMETRY") return;

  const stage = String(context.stage ?? "");
  const policy = policies[stage];
  const root = typeof args.session_root === "string" ? args.session_root : null;
  if (!policy || !root) return;

  const fs = nativeFs();
  const statePath = joinPath(root, "state.json");
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

  let next = "CONTINUE_STAGE";
  let ready = false;

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
    ready = reviewReady(
      fs,
      root,
      context.asset?.id ? String(context.asset.id) : null,
      stage,
      policy,
      stageRecord
    );
    next = ready ? "submit_stage_for_review" : "CONTINUE_STAGE";
  }

  structured.next_safe_operation = next;
  context.automation = context.automation ?? {};
  context.automation.exact_next_safe_operation = next;
  context.automation.review_submission_tool = "submit_stage_for_review";
  context.automation.revision_prepare_tool = "prepare_stage_revision";
  context.automation.stage_review_ready = ready;
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
