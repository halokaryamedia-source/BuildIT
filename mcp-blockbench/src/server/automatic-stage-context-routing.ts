import { getAllToolDefinitions, type ToolContext } from "@/lib/factories";

interface ToolDefinitionLike {
  execute: (args: Record<string, unknown>, context?: ToolContext) => Promise<unknown>;
}

let installed = false;

function structuredContent(result: unknown): Record<string, any> | null {
  if (!result || typeof result !== "object") return null;
  const structured = (result as Record<string, any>).structuredContent;
  return structured && typeof structured === "object" ? structured : null;
}

export function automaticStageNextOperation(context: Record<string, any>): string {
  const stage = String(context.stage ?? "GEOMETRY");
  const state = String(context.workflow?.state ?? "");
  const runtimeUuid = context.project?.runtime_uuid ?? null;

  if (state === "DONE") return "WORKSPACE_COMPLETE";
  if (state === "GEOMETRY_REVIEW") return "AWAIT_GEOMETRY_REVIEW";
  if (state === "TEXTURE_REVIEW") return "AWAIT_TEXTURE_REVIEW";
  if (state === "ANIMATION_REVIEW") return "AWAIT_ANIMATION_REVIEW";
  if (state === "FINAL_REVIEW") return "AWAIT_FINAL_REVIEW";
  if (!runtimeUuid) return "create_project";

  if (stage === "GEOMETRY") {
    const runtime = context.geometry?.runtime ?? {};
    const diagnosis = context.geometry?.latest_diagnosis ?? {};
    if (runtime.phase === "FINAL_REVIEW_READY") {
      return "submit_geometry_for_review";
    }
    if (runtime.rebuild_mode === true) return "CONTINUE_GEOMETRY";
    if (!diagnosis.result) return "inspect_reference_visual_preview";
    if (
      diagnosis.result === "REVISION_REQUIRED" &&
      diagnosis.scope === "MAJOR_FORM_REVISION"
    ) {
      return "prepare_geometry_visual_rebuild";
    }
    return "CONTINUE_GEOMETRY";
  }

  if (stage === "TEXTURE") return "CONTINUE_TEXTURE_WORK";
  if (stage === "ANIMATION") return "CONTINUE_ANIMATION_WORK";
  if (stage === "FINAL_VALIDATION") return "RUN_FINAL_VALIDATION_PREFLIGHT";
  return "CONTINUE_CURRENT_STAGE";
}

function normalizeResult(result: unknown): void {
  const structured = structuredContent(result);
  const context = structured?.context;
  if (!structured || !context) return;

  const next = automaticStageNextOperation(context);
  structured.next_safe_operation = next;
  context.automation = {
    ...(context.automation ?? {}),
    exact_next_safe_operation: next,
    automatic_identity_reconciliation: true,
    automatic_write_ownership: true,
    manual_identity_sync_required: false,
    manual_write_lease_required: false,
    profile_switch_required: false,
    reconnect_required: false,
    user_file_edits_required: false,
    user_restart_required: false,
  };

  if (context.project) {
    context.project.rebind_required = false;
    context.project.identity_reconciliation_mode = "AUTOMATIC_ON_NEXT_MUTATION";
  }
  if (context.lease) {
    context.lease.manual_action_required = false;
    context.lease.ownership_mode = "AUTOMATIC_CURRENT_SESSION";
  }

  if (Array.isArray((result as Record<string, any>).content)) {
    const hash = String(structured.context_hash ?? "").slice(0, 12);
    (result as Record<string, any>).content = [
      {
        type: "text",
        text: `Compact ${context.stage} context ready${hash ? ` (${hash})` : ""}. Next safe operation: ${next}. Identity and write ownership are automatic.`,
      },
    ];
  }
}

export function installAutomaticStageContextRouting(): void {
  if (installed) return;
  const definition = getAllToolDefinitions()["get_stage_context"] as
    | ToolDefinitionLike
    | undefined;
  if (!definition) throw new Error("get_stage_context is unavailable.");
  const execute = definition.execute;
  definition.execute = async (args, context) => {
    const result = await execute(args, context);
    normalizeResult(result);
    return result;
  };
  installed = true;
}
