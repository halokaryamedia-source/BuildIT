/// <reference types="blockbench-types" />

import { z } from "zod";
import { createTool, type ToolSpec } from "@/lib/factories";
import { STATUS_STABLE } from "@/lib/constants";
import {
  assertInsideRoot,
  readJsonFile,
  type NativeFsLike,
} from "@/lib/atomicFiles";

const getStageContextParameters = z.object({
  session_root: z.string().min(1),
  stage: z.enum(["GEOMETRY", "TEXTURE", "ANIMATION", "FINAL_VALIDATION"]).optional().default("GEOMETRY"),
});

export const stageContextToolDocs: ToolSpec[] = [
  {
    name: "get_stage_context",
    description:
      "Returns the compact active-stage decision lock, open issues, accepted areas, visual tools, and rotation policy without loading full Markdown contracts into Codex context.",
    annotations: { title: "Get Compact Stage Context", readOnlyHint: true, openWorldHint: true },
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
  }) as { createHash: (algorithm: string) => { update: (value: string) => any; digest: (encoding: string) => string } };
  if (!cryptoModule) throw new Error("Crypto access was denied.");
  return cryptoModule.createHash("sha256").update(data).digest("hex");
}

export function registerStageContextTools(): void {
  createTool(
    stageContextToolDocs[0].name,
    {
      ...stageContextToolDocs[0],
      async execute({ session_root, stage }) {
        const fs = nativeFs("MCP compact stage context needs asset-session read access.");
        const manifestPath = joinPath(session_root, "references/reference_manifest.json");
        const statePath = joinPath(session_root, "state.json");
        assertInsideRoot(manifestPath, session_root);
        assertInsideRoot(statePath, session_root);
        const manifest = readJsonFile<Record<string, any>>(fs, manifestPath);
        const state = readJsonFile<Record<string, any>>(fs, statePath);
        const stageRecord = state.workflow?.stage_records?.[stage] ?? {};

        const context = {
          schema_version: "1.0",
          stage,
          asset: manifest.asset ?? state.asset ?? null,
          project: {
            name: state.project?.name ?? null,
            uuid: state.project?.uuid ?? null,
            format: state.project?.format ?? null,
            save_path: state.project?.save_path ?? null,
          },
          workflow: {
            state: state.workflow?.state ?? null,
            status: state.workflow?.status ?? null,
            active_stage: state.workflow?.active_stage ?? null,
            next_action: state.workflow?.next_action ?? null,
            stage_status: stageRecord.status ?? null,
            decision: stageRecord.decision ?? null,
            accepted_areas: stageRecord.accepted_areas ?? [],
            open_issues: stageRecord.open_issues ?? [],
          },
          reference_visual: manifest.reference_visual_lock
            ? {
                filename: manifest.reference_visual_lock.filename,
                sha256: manifest.reference_visual_lock.sha256,
                width_px: manifest.reference_visual_lock.width_px,
                height_px: manifest.reference_visual_lock.height_px,
                required_panels: manifest.reference_visual_lock.required_panels,
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
                  material_families: manifest.texturing?.material_families ?? [],
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
          visual_grounding: manifest.visual_grounding ?? {
            required: stage === "GEOMETRY",
            reference_tool: "inspect_reference_visual",
            feedback_tool: "capture_visual_feedback",
            record_tool: "record_geometry_visual_result",
            gate_tool: "verify_geometry_visual_gate",
            approval_tool: "complete_geometry_stage",
            maximum_correction_cycles_per_pass: 2,
          },
        };
        const contextHash = sha256(JSON.stringify(context));
        return {
          content: [
            {
              type: "text",
              text: `Compact ${stage} context ready (${contextHash.slice(0, 12)}).`,
            },
          ],
          structuredContent: {
            status: "PASS",
            context_hash: contextHash,
            context,
          },
        };
      },
    },
    stageContextToolDocs[0].status
  );
}
