/// <reference types="blockbench-types" />

import { z } from "zod";
import { createTool, type ToolSpec } from "@/lib/factories";
import { STATUS_STABLE } from "@/lib/constants";
import {
  assertInsideRoot,
  readJsonFile,
  type NativeFsLike,
} from "@/lib/atomicFiles";
import { mergeGeometryReferenceProfile } from "@/lib/geometryReferenceProfiles";
import { readGeometryRuntimeContext } from "@/lib/geometryRuntime";
import { getProjectWriteLeaseSnapshot } from "@/lib/writeLease";

const getStageContextParameters = z.object({
  session_root: z.string().min(1),
  stage: z
    .enum(["GEOMETRY", "TEXTURE", "ANIMATION", "FINAL_VALIDATION"])
    .optional()
    .default("GEOMETRY"),
});

export const stageContextToolDocs: ToolSpec[] = [
  {
    name: "get_stage_context",
    description:
      "Returns the compact active-stage authority and one exact next safe operation. Geometry identity synchronization, lease acquisition, diagnosis, major revision preparation, editing, and review all remain in the same Geometry profile and MCP session.",
    annotations: {
      title: "Get Compact Stage Context",
      readOnlyHint: true,
      openWorldHint: true,
    },
    parameters: getStageContextParameters,
    status: STATUS_STABLE,
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

function sha256(data: string): string {
  // @ts-ignore - Blockbench runtime permission API.
  const cryptoModule = requireNativeModule("crypto", {
    message: "Compact stage context uses SHA-256 for cache identity.",
    optional: false,
  }) as {
    createHash: (algorithm: string) => {
      update: (value: string) => { digest: (encoding: string) => string };
    };
  };
  if (!cryptoModule) throw new Error("Crypto access was denied.");
  return cryptoModule.createHash("sha256").update(data).digest("hex");
}

function currentRuntimeUuid(): string | null {
  return typeof Project !== "undefined" && Project ? Project.uuid : null;
}

function geometryNextOperation(input: {
  rebindRequired: boolean;
  identityReady: boolean;
  leaseStatus: string;
  leaseProjectUuid: string | null;
  runtimeUuid: string | null;
  diagnosisResult: string | null;
  diagnosisScope: string | null;
  runtimePhase: string | null;
}): string {
  if (input.rebindRequired && input.leaseStatus !== "ACTIVE") {
    return "rebind_active_project_identity";
  }
  if (!input.identityReady) return "STOP_PROJECT_IDENTITY_MISMATCH";
  if (
    input.leaseStatus !== "ACTIVE" ||
    input.leaseProjectUuid !== input.runtimeUuid
  ) {
    return "manage_project_write_lease:acquire";
  }
  if (!input.diagnosisResult) return "inspect_reference_visual_preview";
  if (
    input.diagnosisResult === "REVISION_REQUIRED" &&
    input.diagnosisScope === "MAJOR_FORM_REVISION"
  ) {
    return "prepare_geometry_visual_rebuild";
  }
  if (input.runtimePhase === "FINAL_REVIEW_READY") {
    return "verify_geometry_review_ready";
  }
  return "CONTINUE_GEOMETRY";
}

export function registerStageContextTools(): void {
  createTool(
    stageContextToolDocs[0].name,
    {
      ...stageContextToolDocs[0],
      async execute({ session_root, stage }) {
        const fs = nativeFs(
          "MCP compact stage context needs asset-session read access."
        );
        const manifestPath = joinPath(
          session_root,
          "references/reference_manifest.json"
        );
        const statePath = joinPath(session_root, "state.json");
        const projectPath = joinPath(session_root, "project.json");
        const diagnosisPath = joinPath(
          session_root,
          "evidence/geometry/geometry_visual_metrics.json"
        );
        for (const path of [manifestPath, statePath, projectPath]) {
          assertInsideRoot(path, session_root);
        }

        const manifest = readJsonFile<Record<string, any>>(fs, manifestPath);
        const state = readJsonFile<Record<string, any>>(fs, statePath);
        const projectMetadata = readJsonFile<Record<string, any>>(fs, projectPath);
        const stageRecord = state.workflow?.stage_records?.[stage] ?? {};
        const geometryProfile = mergeGeometryReferenceProfile({
          referenceSha256: manifest.reference_visual_lock?.sha256,
          visualGrounding: manifest.visual_grounding,
          geometry: manifest.geometry,
        });
        const geometryRuntime =
          stage === "GEOMETRY" || stage === "FINAL_VALIDATION"
            ? readGeometryRuntimeContext(session_root)
            : null;
        const lease = getProjectWriteLeaseSnapshot();
        const runtimeUuid = currentRuntimeUuid();
        const stateUuid = state.project?.uuid ?? null;
        const projectFileUuid = projectMetadata.project?.uuid ?? null;
        const rebindRequired = Boolean(
          runtimeUuid &&
            (runtimeUuid !== stateUuid || runtimeUuid !== projectFileUuid)
        );
        const identityReady = Boolean(
          runtimeUuid &&
            runtimeUuid === stateUuid &&
            runtimeUuid === projectFileUuid
        );
        const diagnosis = fs.existsSync(diagnosisPath)
          ? readJsonFile<Record<string, any>>(fs, diagnosisPath)
          : null;
        const diagnosisResult = diagnosis?.result
          ? String(diagnosis.result)
          : null;
        const diagnosisScope = diagnosis?.recommended_scope
          ? String(diagnosis.recommended_scope)
          : null;
        const workflowRuntimeConsistent =
          stage !== "GEOMETRY" ||
          (state.workflow?.active_stage === "GEOMETRY" &&
            (state.workflow?.state !== "GEOMETRY_REVIEW" ||
              geometryRuntime?.phase === "FINAL_REVIEW_READY"));
        const nextSafeOperation =
          stage === "GEOMETRY"
            ? geometryNextOperation({
                rebindRequired,
                identityReady,
                leaseStatus: lease.status,
                leaseProjectUuid: lease.project_uuid,
                runtimeUuid,
                diagnosisResult,
                diagnosisScope,
                runtimePhase: geometryRuntime?.phase ?? null,
              })
            : "CONTINUE_STAGE";

        const context = {
          schema_version: "2.0",
          stage,
          asset: manifest.asset ?? state.asset ?? null,
          project: {
            name: state.project?.name ?? null,
            runtime_uuid: runtimeUuid,
            state_uuid: stateUuid,
            project_file_uuid: projectFileUuid,
            format: state.project?.format ?? null,
            save_path: state.project?.save_path ?? null,
            rebind_required: rebindRequired,
            identity_ready: identityReady,
          },
          lease: {
            status: lease.status,
            project_uuid: lease.project_uuid,
            owner_session_id: lease.owner_session_id,
            state_revision: lease.state_revision,
            profile_id: lease.profile_id,
          },
          workflow: {
            state: state.workflow?.state ?? null,
            status: state.workflow?.status ?? null,
            active_stage: state.workflow?.active_stage ?? null,
            next_action: state.workflow?.next_action ?? null,
            stage_status: stageRecord.status ?? null,
            decision: stageRecord.decision ?? null,
            revision: stageRecord.revision ?? null,
            accepted_areas: stageRecord.accepted_areas ?? [],
            open_issues: stageRecord.open_issues ?? [],
            runtime_consistent: workflowRuntimeConsistent,
          },
          automation: {
            one_geometry_profile: true,
            profile_switch_required: false,
            reconnect_required: false,
            exact_next_safe_operation: nextSafeOperation,
            user_file_edits_required: false,
            user_restart_required: false,
          },
          legacy_context_policy: {
            repository_authority_only: true,
            reject_external_four_sheet_workflow: true,
            conflict_code: "LEGACY_SKILL_CONFLICT",
            forbidden_markers: [
              "four mandatory sheets",
              "three approval moments",
              "01_<asset_id>_form_scale_reference.png",
              "02_<asset_id>_construction_reference.png",
              "03_<asset_id>_texture_material_reference.png",
              "04_<asset_id>_motion_pivot_reference.png",
            ],
          },
          reference_visual: manifest.reference_visual_lock
            ? {
                filename: manifest.reference_visual_lock.filename,
                sha256: manifest.reference_visual_lock.sha256,
                width_px: manifest.reference_visual_lock.width_px,
                height_px: manifest.reference_visual_lock.height_px,
                required_panels:
                  manifest.reference_visual_lock.required_panels,
              }
            : null,
          main_format: manifest.main_format ?? null,
          geometry:
            stage === "GEOMETRY" || stage === "FINAL_VALIDATION"
              ? {
                  strategy: manifest.geometry?.strategy,
                  geometry_type: manifest.geometry?.geometry_type,
                  mesh_allowed: manifest.geometry?.mesh_allowed,
                  expected_cube_count: manifest.geometry?.expected_cube_count,
                  root_group: manifest.geometry?.root_group,
                  primary_masses: manifest.geometry?.primary_masses ?? [],
                  silhouette_critical_parts:
                    manifest.geometry?.silhouette_critical_parts ?? [],
                  segment_counts: manifest.geometry?.segment_counts ?? {},
                  hierarchy: manifest.geometry?.hierarchy ?? {},
                  ground_contacts: manifest.geometry?.ground_contacts ?? [],
                  rotation_policy: manifest.geometry?.rotation_policy ?? {
                    preferred_axes_per_cube: 1,
                    maximum_axes_per_cube: 1,
                    maximum_absolute_degrees: 45,
                    explicit_origin_required_when_rotating: true,
                    pivot_margin_ratio: 1,
                  },
                  part_constraints: geometryProfile?.part_constraints ?? [],
                  rotation_contracts:
                    geometryProfile?.rotation_contracts ?? {},
                  panel_regions: geometryProfile
                    ? Object.fromEntries(
                        Object.entries(geometryProfile.panels).map(
                          ([view, panel]) => [
                            view,
                            {
                              crop_normalized: panel.crop_normalized,
                              projection: panel.projection,
                              minimum_score: panel.minimum_score,
                              scale_basis: panel.scale_basis,
                              regions: panel.regions,
                            },
                          ]
                        )
                      )
                    : {},
                  runtime: geometryRuntime,
                  latest_diagnosis: diagnosis
                    ? {
                        result: diagnosisResult,
                        scope: diagnosisScope,
                        geometry_fingerprint:
                          diagnosis.geometry_fingerprint ?? null,
                        reference_sha256:
                          diagnosis.reference_visual?.sha256 ?? null,
                        created_at: diagnosis.created_at ?? null,
                      }
                    : null,
                }
              : null,
          texturing:
            stage === "TEXTURE" || stage === "FINAL_VALIDATION"
              ? {
                  style: manifest.texturing?.style,
                  atlas: manifest.texturing?.atlas,
                  uv_strategy: manifest.texturing?.uv_strategy,
                  pipeline: manifest.texturing?.pipeline,
                  pbr: manifest.texturing?.pbr,
                  vibrant_visuals: manifest.texturing?.vibrant_visuals,
                  material_families:
                    manifest.texturing?.material_families ?? [],
                  critical_pixel_details:
                    manifest.texturing?.critical_pixel_details ?? [],
                }
              : null,
          animation:
            stage === "ANIMATION" || stage === "FINAL_VALIDATION"
              ? {
                  status: manifest.animation?.status,
                  animation_ready: manifest.animation?.animation_ready,
                  required_clips: manifest.animation?.required_clips ?? [],
                  moving_groups: manifest.animation?.moving_groups ?? [],
                  pivot_requirements:
                    manifest.animation?.pivot_requirements ?? [],
                }
              : null,
          visual_grounding: {
            ...(manifest.visual_grounding ?? {}),
            required: stage === "GEOMETRY",
            reference_tool: "inspect_reference_visual_preview",
            feedback_tool: "capture_visual_feedback",
            diagnosis_tool: "analyze_geometry_views",
            record_tool: "record_geometry_visual_decision",
            gate_tool: "verify_geometry_review_ready",
            approval_tool: "complete_geometry_stage",
            safe_rotation_tool: "rotate_cube_about_attachment",
            structural_pass_is_visual_pass: false,
            multimodal_review_required: true,
            deterministic_guard_required: true,
            fixed_scale_required: true,
            free_rescale_forbidden: true,
          },
        };
        const contextHash = sha256(JSON.stringify(context));
        return {
          content: [
            {
              type: "text",
              text: `Compact ${stage} context ready (${contextHash.slice(0, 12)}). Next safe operation: ${nextSafeOperation}.`,
            },
          ],
          structuredContent: {
            status: "PASS",
            context_hash: contextHash,
            next_safe_operation: nextSafeOperation,
            context,
          },
        };
      },
    },
    stageContextToolDocs[0].status
  );
}
