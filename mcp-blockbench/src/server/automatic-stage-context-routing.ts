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

function compactProject(project: Record<string, any> | null | undefined) {
  if (!project) return null;
  return {
    name: project.name ?? null,
    runtime_uuid: project.runtime_uuid ?? null,
    format: project.format ?? null,
    save_path: project.save_path ?? null,
    identity_ready: project.identity_ready === true,
    rebind_required: false,
    identity_reconciliation_mode: "AUTOMATIC_ON_NEXT_MUTATION",
  };
}

function compactWorkflow(workflow: Record<string, any> | null | undefined) {
  if (!workflow) return null;
  return {
    state: workflow.state ?? null,
    status: workflow.status ?? null,
    active_stage: workflow.active_stage ?? null,
    stage_status: workflow.stage_status ?? null,
    decision: workflow.decision ?? null,
    open_issues: Array.isArray(workflow.open_issues)
      ? workflow.open_issues
      : [],
    runtime_consistent: workflow.runtime_consistent !== false,
  };
}

function compactGeometry(geometry: Record<string, any> | null | undefined) {
  if (!geometry) return null;
  const constraints = Array.isArray(geometry.part_constraints)
    ? geometry.part_constraints
    : [];
  const contracts = geometry.rotation_contracts ?? {};
  const panels = geometry.panel_regions ?? {};
  const runtime = geometry.runtime ?? {};
  const diagnosis = geometry.latest_diagnosis ?? null;
  return {
    strategy: geometry.strategy ?? null,
    geometry_type: geometry.geometry_type ?? null,
    expected_cube_count: geometry.expected_cube_count ?? null,
    runtime: {
      phase: runtime.phase ?? null,
      rebuild_mode: runtime.rebuild_mode === true,
      attention_required: runtime.attention_required === true,
    },
    latest_diagnosis: diagnosis
      ? {
          result: diagnosis.result ?? null,
          scope: diagnosis.scope ?? null,
          created_at: diagnosis.created_at ?? null,
        }
      : null,
    contract_summary: {
      part_constraint_count: constraints.length,
      rotation_contract_ids: Object.keys(contracts),
      required_views: Object.keys(panels),
      ground_contact_count: Array.isArray(geometry.ground_contacts)
        ? geometry.ground_contacts.length
        : 0,
    },
  };
}

function compactTexturing(texturing: Record<string, any> | null | undefined) {
  if (!texturing) return null;
  return {
    style: texturing.style ?? null,
    atlas: texturing.atlas ?? null,
    uv_strategy: texturing.uv_strategy ?? null,
    pipeline: texturing.pipeline ?? null,
    pbr: texturing.pbr ?? false,
    material_family_count: Array.isArray(texturing.material_families)
      ? texturing.material_families.length
      : 0,
    critical_detail_count: Array.isArray(texturing.critical_pixel_details)
      ? texturing.critical_pixel_details.length
      : 0,
  };
}

function compactAnimation(animation: Record<string, any> | null | undefined) {
  if (!animation) return null;
  return {
    status: animation.status ?? null,
    animation_ready: animation.animation_ready === true,
    required_clips: Array.isArray(animation.required_clips)
      ? animation.required_clips
      : [],
    root_motion_policy: animation.root_motion_policy ?? null,
  };
}

export function compactStageContext(
  context: Record<string, any>,
  next: string
): Record<string, any> {
  return {
    schema_version: "3.0-compact",
    stage: context.stage ?? null,
    asset: context.asset
      ? {
          id: context.asset.id ?? null,
          display_name: context.asset.display_name ?? context.asset.name ?? null,
          target: context.asset.target ?? null,
        }
      : null,
    project: compactProject(context.project),
    workflow: compactWorkflow(context.workflow),
    reference_visual: context.reference_visual
      ? {
          filename: context.reference_visual.filename ?? null,
          sha256: context.reference_visual.sha256 ?? null,
          required_panels: context.reference_visual.required_panels ?? [],
        }
      : null,
    geometry: compactGeometry(context.geometry),
    texturing: compactTexturing(context.texturing),
    animation: compactAnimation(context.animation),
    automation: {
      exact_next_safe_operation: next,
      automatic_identity_reconciliation: true,
      automatic_write_ownership: true,
      manual_identity_sync_required: false,
      manual_write_lease_required: false,
      profile_switch_required: false,
      reconnect_required: false,
      user_file_edits_required: false,
      user_restart_required: false,
    },
    context_policy: {
      mode: "COMPACT_ON_DEMAND",
      full_manifest_omitted: true,
      authority_remains_in_reference_package: true,
    },
  };
}

function normalizeResult(result: unknown): void {
  const structured = structuredContent(result);
  const context = structured?.context;
  if (!structured || !context) return;

  const next = automaticStageNextOperation(context);
  structured.next_safe_operation = next;
  structured.context = compactStageContext(context, next);
  structured.context_compacted = true;
  structured.full_context_omitted = true;

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
