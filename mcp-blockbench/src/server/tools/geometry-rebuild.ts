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
import { getExecutionProfileState } from "@/lib/executionState";
import { mergeGeometryReferenceProfile } from "@/lib/geometryReferenceProfiles";

const prepareGeometryVisualRebuildParameters = z.object({
  session_root: z.string().min(1),
  expected_project_uuid: z.string().optional(),
  remove_structural_detail: z.boolean().optional().default(true),
});

export const geometryRebuildToolDocs: ToolSpec[] = [
  {
    name: "prepare_geometry_visual_rebuild",
    description:
      "Prepares a classified major Geometry rebuild by resetting runtime to PRIMARY_FORM and atomically removing existing STRUCTURAL_DETAIL cubes identified by the approved machine-readable profile. Prior checkpoints and primary masses are preserved.",
    annotations: {
      title: "Prepare Geometry Visual Rebuild",
      destructiveHint: true,
      openWorldHint: true,
    },
    parameters: prepareGeometryVisualRebuildParameters,
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

function matches(name: string, patterns: string[]): boolean {
  const normalized = name.toLowerCase();
  return patterns.some((pattern) => normalized.includes(pattern.toLowerCase()));
}

export function registerGeometryRebuildTools(): void {
  createTool(
    geometryRebuildToolDocs[0].name,
    {
      ...geometryRebuildToolDocs[0],
      async execute({
        session_root,
        expected_project_uuid,
        remove_structural_detail,
      }) {
        if (!Project) throw new Error("No Blockbench project is open.");
        if (expected_project_uuid && Project.uuid !== expected_project_uuid) {
          throw new Error(
            `PROJECT_UUID_MISMATCH: active ${Project.uuid}, expected ${expected_project_uuid}.`
          );
        }
        const profileState = getExecutionProfileState();
        if (profileState.profileId !== "GEOMETRY_VISUAL_REBUILD") {
          throw new Error(
            `GEOMETRY_REBUILD_PROFILE_REQUIRED: active profile is ${profileState.profileId}.`
          );
        }

        const fs = nativeFs(
          "Major Geometry rebuild preparation needs reference and runtime write access."
        );
        const manifestPath = joinPath(
          session_root,
          "references/reference_manifest.json"
        );
        assertInsideRoot(manifestPath, session_root);
        const manifest = readJsonFile<Record<string, any>>(fs, manifestPath);
        const referenceProfile = mergeGeometryReferenceProfile({
          referenceSha256: manifest.reference_visual_lock?.sha256,
          visualGrounding: manifest.visual_grounding,
          geometry: manifest.geometry,
        });
        if (!referenceProfile) {
          throw new Error("GEOMETRY_REFERENCE_PROFILE_MISSING");
        }
        const detailPatterns = referenceProfile.part_constraints
          .filter((constraint) => constraint.role === "STRUCTURAL_DETAIL")
          .flatMap((constraint) => constraint.name_patterns);
        const removed: Array<{ name: string; uuid: string }> = [];

        if (remove_structural_detail) {
          const targets = (Cube.all ?? []).filter((cube) =>
            matches(cube.name, detailPatterns)
          );
          Undo.initEdit({
            elements: [...targets],
            outliner: true,
            collections: [],
          });
          try {
            for (const cube of targets) {
              removed.push({ name: cube.name, uuid: cube.uuid });
              cube.remove();
            }
            Undo.finishEdit("Prepare major Geometry visual rebuild");
            Canvas.updateAll();
          } catch (error) {
            Undo.cancelEdit();
            Canvas.updateAll();
            throw error;
          }
        }

        const runtimePath = joinPath(
          session_root,
          "evidence/geometry/geometry_runtime.json"
        );
        assertInsideRoot(runtimePath, session_root);
        const emptyIteration = () => ({
          attempts: 0,
          best_score: null,
          last_score: null,
          score_history: [],
          non_improving_cycles: 0,
        });
        writeJsonAtomically(fs, runtimePath, {
          schema_version: "1.0",
          phase: "PRIMARY_FORM",
          primary_form: emptyIteration(),
          structural_detail: emptyIteration(),
          final_review: emptyIteration(),
          recommended_scope: "MAJOR_FORM_REVISION",
          recommended_profile: "GEOMETRY_VISUAL_REBUILD",
          last_compared_views: [],
          last_issues: [],
          blocker: null,
          rebuild_preparation: {
            removed_structural_detail: removed,
            preserved_checkpoints: true,
          },
          updated_at: new Date().toISOString(),
        });

        return {
          content: [
            {
              type: "text",
              text: `Geometry visual rebuild prepared. Removed ${removed.length} structural-detail cube(s), reset to PRIMARY_FORM, and preserved prior checkpoints.`,
            },
          ],
          structuredContent: {
            status: "PASS",
            phase: "PRIMARY_FORM",
            removed_structural_detail: removed,
            preserved_checkpoints: true,
            runtime_path: runtimePath,
          },
        };
      },
    },
    geometryRebuildToolDocs[0].status
  );
}
