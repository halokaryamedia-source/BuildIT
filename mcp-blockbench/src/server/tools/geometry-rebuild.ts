/// <reference types="blockbench-types" />

import { z } from "zod";
import { createTool, type ToolSpec } from "@/lib/factories";
import { STATUS_EXPERIMENTAL } from "@/lib/constants";
import {
  assertInsideRoot,
  readJsonFile,
  writeJsonFilesAtomically,
  type NativeFsLike,
} from "@/lib/atomicFiles";
import { mergeGeometryReferenceProfile } from "@/lib/geometryReferenceProfiles";
import {
  getProjectWriteLeaseSnapshot,
  updateProjectWriteLeaseWorkflow,
} from "@/lib/writeLease";

const prepareGeometryVisualRebuildParameters = z.object({
  session_root: z.string().min(1),
  expected_project_uuid: z.string().optional(),
  expected_state_revision: z.number().int().nonnegative(),
  expected_geometry_fingerprint: z.string().regex(/^[a-f0-9]{64}$/i),
  expected_reference_sha256: z.string().regex(/^[a-f0-9]{64}$/i),
  remove_structural_detail: z.boolean().optional().default(false),
});

export const geometryRebuildToolDocs: ToolSpec[] = [
  {
    name: "prepare_geometry_visual_rebuild",
    description:
      "Resumes a fresh diagnosed LOCAL_REPAIR or MAJOR_FORM_REVISION inside the current Geometry profile and MCP session. It returns review-state Geometry to normal work, preserves checkpoints and primary masses, keeps detail by default, and only permits explicit structural-detail cleanup for a major revision.",
    annotations: {
      title: "Prepare Geometry Revision",
      destructiveHint: true,
      openWorldHint: true,
    },
    parameters: prepareGeometryVisualRebuildParameters,
    status: STATUS_EXPERIMENTAL,
  },
];

type RevisionScope = "LOCAL_REPAIR" | "MAJOR_FORM_REVISION";

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

function sha256(value: string | Buffer): string {
  // @ts-ignore Blockbench runtime permission API.
  const crypto = requireNativeModule("crypto", {
    message: "Geometry revision preparation needs integrity checks.",
    optional: false,
  }) as {
    createHash(name: string): {
      update(value: string | Buffer): { digest(encoding: string): string };
    };
  };
  return crypto.createHash("sha256").update(value).digest("hex");
}

function geometryFingerprint(): string {
  return sha256(
    JSON.stringify(
      (Cube.all ?? [])
        .map((cube) => ({
          uuid: cube.uuid,
          name: cube.name,
          from: [...cube.from],
          to: [...cube.to],
          origin: [...cube.origin],
          rotation: [...cube.rotation],
          inflate: cube.inflate,
          parent:
            typeof cube.parent === "string" ? cube.parent : cube.parent?.uuid,
        }))
        .sort((a, b) => String(a.uuid).localeCompare(String(b.uuid)))
    )
  );
}

function emptyIteration() {
  return {
    attempts: 0,
    best_score: null,
    last_score: null,
    score_history: [],
    non_improving_cycles: 0,
  };
}

function restoreRuntime(
  fs: NativeFsLike,
  statePath: string,
  previousState: Record<string, any>,
  runtimePath: string,
  previousRuntime: Record<string, any> | null
): void {
  if (previousRuntime) {
    writeJsonFilesAtomically(fs, [
      { path: statePath, value: previousState },
      { path: runtimePath, value: previousRuntime },
    ]);
    return;
  }
  writeJsonFilesAtomically(fs, [{ path: statePath, value: previousState }]);
  if (fs.existsSync(runtimePath)) fs.rmSync(runtimePath, { force: true });
}

function revisionScope(value: unknown): RevisionScope {
  if (value === "LOCAL_REPAIR" || value === "MAJOR_FORM_REVISION") {
    return value;
  }
  throw new Error("GEOMETRY_REVISION_DIAGNOSIS_REQUIRED");
}

export function registerGeometryRebuildTools(): void {
  createTool(
    geometryRebuildToolDocs[0].name,
    {
      ...geometryRebuildToolDocs[0],
      async execute({
        session_root,
        expected_project_uuid,
        expected_state_revision,
        expected_geometry_fingerprint,
        expected_reference_sha256,
        remove_structural_detail,
      }) {
        if (!Project) throw new Error("No Blockbench project is open.");
        if (expected_project_uuid && Project.uuid !== expected_project_uuid) {
          throw new Error(
            `PROJECT_UUID_MISMATCH: active ${Project.uuid}, expected ${expected_project_uuid}.`
          );
        }

        const fs = nativeFs(
          "Geometry revision preparation needs reference, state, and runtime write access."
        );
        const manifestPath = joinPath(
          session_root,
          "references/reference_manifest.json"
        );
        const statePath = joinPath(session_root, "state.json");
        const runtimePath = joinPath(
          session_root,
          "evidence/geometry/geometry_runtime.json"
        );
        const diagnosisPath = joinPath(
          session_root,
          "evidence/geometry/geometry_visual_metrics.json"
        );
        for (const path of [
          manifestPath,
          statePath,
          runtimePath,
          diagnosisPath,
        ]) {
          assertInsideRoot(path, session_root);
        }

        const manifest = readJsonFile<Record<string, any>>(fs, manifestPath);
        const state = readJsonFile<Record<string, any>>(fs, statePath);
        const previousState = structuredClone(state);
        if (state.state_revision !== expected_state_revision) {
          throw new Error("STATE_REVISION_MISMATCH");
        }
        if (state.project?.uuid !== Project.uuid) {
          throw new Error("PROJECT_IDENTITY_STATE_MISMATCH");
        }
        if (state.workflow?.active_stage !== "GEOMETRY") {
          throw new Error("GEOMETRY_STAGE_NOT_ACTIVE");
        }
        if (
          !["GEOMETRY_IN_PROGRESS", "GEOMETRY_REVIEW"].includes(
            String(state.workflow?.state ?? "")
          )
        ) {
          throw new Error(
            `GEOMETRY_REVISION_STATE_MISMATCH: ${state.workflow?.state ?? "unknown"}.`
          );
        }

        const lease = getProjectWriteLeaseSnapshot();
        if (
          lease.status !== "ACTIVE" ||
          lease.project_uuid !== Project.uuid ||
          lease.state_revision !== expected_state_revision ||
          lease.stage !== "GEOMETRY" ||
          lease.profile_id !== "BEDROCK_CUBOID_GEOMETRY"
        ) {
          throw new Error("GEOMETRY_REVISION_WRITE_LEASE_REQUIRED");
        }

        const diagnosis = readJsonFile<Record<string, any>>(fs, diagnosisPath);
        if (diagnosis.result !== "REVISION_REQUIRED") {
          throw new Error("GEOMETRY_REVISION_DIAGNOSIS_REQUIRED");
        }
        const scope = revisionScope(diagnosis.recommended_scope);
        const major = scope === "MAJOR_FORM_REVISION";
        if (remove_structural_detail && !major) {
          throw new Error(
            "GEOMETRY_LOCAL_REPAIR_CANNOT_REMOVE_STRUCTURAL_DETAIL"
          );
        }

        const currentFingerprint = geometryFingerprint();
        if (
          currentFingerprint !== expected_geometry_fingerprint.toLowerCase() ||
          diagnosis.geometry_fingerprint !== currentFingerprint
        ) {
          throw new Error("GEOMETRY_DIAGNOSIS_STALE");
        }

        const referenceFilename = manifest.reference_visual_lock?.filename;
        const referencePath = joinPath(
          session_root,
          `references/${referenceFilename}`
        );
        assertInsideRoot(referencePath, session_root);
        const referenceHash = sha256(fs.readFileSync(referencePath));
        if (
          referenceHash !== expected_reference_sha256.toLowerCase() ||
          referenceHash !==
            String(manifest.reference_visual_lock?.sha256 ?? "").toLowerCase() ||
          diagnosis.reference_visual?.sha256 !== referenceHash
        ) {
          throw new Error("GEOMETRY_REFERENCE_MISMATCH");
        }

        const diagnosisTime = Date.parse(String(diagnosis.created_at ?? ""));
        if (
          !Number.isFinite(diagnosisTime) ||
          Date.now() - diagnosisTime > 30 * 60 * 1000
        ) {
          throw new Error("GEOMETRY_DIAGNOSIS_STALE");
        }

        let detailPatterns: string[] = [];
        if (remove_structural_detail) {
          const referenceProfile = mergeGeometryReferenceProfile({
            referenceSha256: manifest.reference_visual_lock?.sha256,
            visualGrounding: manifest.visual_grounding,
            geometry: manifest.geometry,
          });
          if (!referenceProfile) {
            throw new Error("GEOMETRY_REFERENCE_PROFILE_MISSING");
          }
          detailPatterns = referenceProfile.part_constraints
            .filter((constraint) => constraint.role === "STRUCTURAL_DETAIL")
            .flatMap((constraint) => constraint.name_patterns);
        }

        const removed: Array<{ name: string; uuid: string }> = [];
        const previousRuntime = fs.existsSync(runtimePath)
          ? readJsonFile<Record<string, any>>(fs, runtimePath)
          : null;
        const nextRevision = expected_state_revision + 1;
        const actionableIssues = Array.isArray(diagnosis.actionable_issues)
          ? diagnosis.actionable_issues
          : [];
        const phase = major ? "PRIMARY_FORM" : "STRUCTURAL_DETAIL";

        const runtime = {
          schema_version: "1.2",
          phase,
          primary_form: emptyIteration(),
          structural_detail: emptyIteration(),
          final_review: emptyIteration(),
          revision_mode: scope,
          rebuild_mode: major,
          recommended_scope: scope,
          recommended_profile: null,
          last_compared_views: [],
          last_issues: actionableIssues,
          attention_required: false,
          blocker: null,
          rebuild_preparation: {
            removed_structural_detail: removed,
            preserved_checkpoints: true,
          },
          updated_at: new Date().toISOString(),
        };

        state.state_revision = nextRevision;
        state.workflow.state = "GEOMETRY_IN_PROGRESS";
        state.workflow.status = "IN_PROGRESS";
        state.workflow.active_stage = "GEOMETRY";
        state.workflow.next_action = "CONTINUE_GEOMETRY";
        const geometryRecord = state.workflow?.stage_records?.GEOMETRY;
        if (!geometryRecord) {
          throw new Error("STATE_STAGE_RECORD_MISSING: GEOMETRY");
        }
        geometryRecord.status = "IN_PROGRESS";
        geometryRecord.decision = "REVISION_REQUIRED";
        geometryRecord.revision = {
          mode: scope,
          diagnosis_report: diagnosisPath,
          geometry_fingerprint: currentFingerprint,
          reference_visual_sha256: referenceHash,
          actionable_issues: actionableIssues,
          prepared_at: new Date().toISOString(),
        };

        const updateLease = (stateRevision: number) =>
          updateProjectWriteLeaseWorkflow(lease.owner_session_id, {
            stage: "GEOMETRY",
            stateRevision,
            profileId: lease.profile_id!,
            profileRevision: lease.profile_revision!,
            profileHash: lease.profile_hash!,
          });

        let leaseAdvanced = false;
        let editStarted = false;
        try {
          if (remove_structural_detail) {
            const targets = (Cube.all ?? []).filter((cube) =>
              matches(cube.name, detailPatterns)
            );
            Undo.initEdit({
              elements: [...targets],
              outliner: true,
              collections: [],
            });
            editStarted = true;
            for (const cube of targets) {
              removed.push({ name: cube.name, uuid: cube.uuid });
              cube.remove();
            }
            runtime.rebuild_preparation.removed_structural_detail = removed;
          }

          updateLease(nextRevision);
          leaseAdvanced = true;
          writeJsonFilesAtomically(fs, [
            { path: statePath, value: state },
            { path: runtimePath, value: runtime },
          ]);

          if (editStarted) {
            Undo.finishEdit(`Prepare ${scope} Geometry revision`);
            Canvas.updateAll();
          }
        } catch (error) {
          if (editStarted) {
            Undo.cancelEdit();
            Canvas.updateAll();
          }
          if (leaseAdvanced) updateLease(expected_state_revision);
          restoreRuntime(
            fs,
            statePath,
            previousState,
            runtimePath,
            previousRuntime
          );
          throw error;
        }

        return {
          content: [
            {
              type: "text",
              text: `${scope} prepared inside the current Geometry session. Removed ${removed.length} structural-detail cube(s), preserved checkpoints, and returned workflow state to GEOMETRY_IN_PROGRESS.`,
            },
          ],
          structuredContent: {
            status: "PASS",
            phase,
            revision_mode: scope,
            rebuild_mode: major,
            structural_detail_removed: remove_structural_detail,
            removed_structural_detail: removed,
            preserved_checkpoints: true,
            runtime_path: runtimePath,
            state_revision: nextRevision,
            workflow_state: "GEOMETRY_IN_PROGRESS",
            next_action: "CONTINUE_GEOMETRY",
            active_profile: "BEDROCK_CUBOID_GEOMETRY",
            profile_switch_required: false,
            reconnect_required: false,
          },
        };
      },
    },
    geometryRebuildToolDocs[0].status
  );
}
