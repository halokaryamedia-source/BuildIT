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
      "Resumes a current LOCAL_REPAIR or MAJOR_FORM_REVISION inside the existing Geometry profile and MCP session. Revision authority may come from current fixed-scale metrics or a current Codex/user visual decision, while identity, fingerprint, reference, lease, and freshness checks remain mandatory.",
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
type RevisionSource = "DETERMINISTIC_METRICS" | "MULTIMODAL_DECISION";

interface RevisionEvidence {
  source: RevisionSource;
  path: string;
  record: Record<string, any>;
  scope: RevisionScope;
  issues: unknown[];
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

function revisionScope(value: unknown): RevisionScope | null {
  return value === "LOCAL_REPAIR" || value === "MAJOR_FORM_REVISION"
    ? value
    : null;
}

function freshTimestamp(value: unknown): boolean {
  const timestamp = Date.parse(String(value ?? ""));
  return (
    Number.isFinite(timestamp) &&
    timestamp <= Date.now() + 60_000 &&
    Date.now() - timestamp <= 30 * 60 * 1000
  );
}

function referenceHash(record: Record<string, any>): string {
  return String(record.reference_visual?.sha256 ?? "").toLowerCase();
}

function revisionCandidate(input: {
  source: RevisionSource;
  path: string;
  record: Record<string, any> | null;
  projectUuid: string;
  geometryFingerprint: string;
  referenceSha256: string;
}): RevisionEvidence | null {
  const { source, path, record } = input;
  if (!record || record.result !== "REVISION_REQUIRED") return null;
  const scope = revisionScope(
    source === "DETERMINISTIC_METRICS"
      ? record.recommended_scope
      : record.scope
  );
  if (!scope) return null;
  if (record.project?.uuid !== input.projectUuid) return null;
  if (record.geometry_fingerprint !== input.geometryFingerprint) return null;
  if (referenceHash(record) !== input.referenceSha256) return null;
  if (!freshTimestamp(record.created_at)) return null;
  return {
    source,
    path,
    record,
    scope,
    issues:
      source === "DETERMINISTIC_METRICS"
        ? Array.isArray(record.actionable_issues)
          ? record.actionable_issues
          : []
        : Array.isArray(record.issues)
          ? record.issues
          : [],
  };
}

function selectRevisionEvidence(input: {
  metricsPath: string;
  metrics: Record<string, any>;
  visualReportPath: string;
  visualReport: Record<string, any> | null;
  projectUuid: string;
  geometryFingerprint: string;
  referenceSha256: string;
}): RevisionEvidence {
  const visual = revisionCandidate({
    source: "MULTIMODAL_DECISION",
    path: input.visualReportPath,
    record: input.visualReport,
    projectUuid: input.projectUuid,
    geometryFingerprint: input.geometryFingerprint,
    referenceSha256: input.referenceSha256,
  });
  if (visual) return visual;

  const deterministic = revisionCandidate({
    source: "DETERMINISTIC_METRICS",
    path: input.metricsPath,
    record: input.metrics,
    projectUuid: input.projectUuid,
    geometryFingerprint: input.geometryFingerprint,
    referenceSha256: input.referenceSha256,
  });
  if (deterministic) return deterministic;

  const hasRevisionRequest =
    input.metrics.result === "REVISION_REQUIRED" ||
    input.visualReport?.result === "REVISION_REQUIRED";
  if (hasRevisionRequest) {
    throw new Error("GEOMETRY_REVISION_EVIDENCE_STALE");
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
          "Geometry revision preparation needs reference, state, runtime, and current revision evidence access."
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
        const metricsPath = joinPath(
          session_root,
          "evidence/geometry/geometry_visual_metrics.json"
        );
        const visualReportPath = joinPath(
          session_root,
          "evidence/geometry/geometry_visual_report.json"
        );
        for (const path of [
          manifestPath,
          statePath,
          runtimePath,
          metricsPath,
          visualReportPath,
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
        // A zero-start project can already have a current fixed-scale
        // diagnosis before its first workflow-state write. Treat that
        // narrow, evidence-backed case as the start of Geometry revision;
        // the atomic state update below records GEOMETRY_IN_PROGRESS.
        if (
          ![
            "REFERENCE_READY",
            "GEOMETRY_IN_PROGRESS",
            "GEOMETRY_REVIEW",
          ].includes(String(state.workflow?.state ?? ""))
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

        if (!fs.existsSync(metricsPath)) {
          throw new Error("GEOMETRY_VISUAL_METRICS_MISSING");
        }
        const metrics = readJsonFile<Record<string, any>>(fs, metricsPath);
        const visualReport = fs.existsSync(visualReportPath)
          ? readJsonFile<Record<string, any>>(fs, visualReportPath)
          : null;

        const currentFingerprint = geometryFingerprint();
        if (currentFingerprint !== expected_geometry_fingerprint.toLowerCase()) {
          throw new Error("GEOMETRY_DIAGNOSIS_STALE");
        }

        const referenceFilename = manifest.reference_visual_lock?.filename;
        const referencePath = joinPath(
          session_root,
          `references/${referenceFilename}`
        );
        assertInsideRoot(referencePath, session_root);
        const currentReferenceHash = sha256(fs.readFileSync(referencePath));
        if (
          currentReferenceHash !== expected_reference_sha256.toLowerCase() ||
          currentReferenceHash !==
            String(manifest.reference_visual_lock?.sha256 ?? "").toLowerCase()
        ) {
          throw new Error("GEOMETRY_REFERENCE_MISMATCH");
        }

        const revision = selectRevisionEvidence({
          metricsPath,
          metrics,
          visualReportPath,
          visualReport,
          projectUuid: Project.uuid,
          geometryFingerprint: currentFingerprint,
          referenceSha256: currentReferenceHash,
        });
        const scope = revision.scope;
        const major = scope === "MAJOR_FORM_REVISION";
        if (remove_structural_detail && !major) {
          throw new Error(
            "GEOMETRY_LOCAL_REPAIR_CANNOT_REMOVE_STRUCTURAL_DETAIL"
          );
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
        const phase = major ? "PRIMARY_FORM" : "STRUCTURAL_DETAIL";

        const runtime = {
          schema_version: "1.3",
          phase,
          primary_form: emptyIteration(),
          structural_detail: emptyIteration(),
          final_review: emptyIteration(),
          revision_mode: scope,
          revision_source: revision.source,
          rebuild_mode: major,
          recommended_scope: scope,
          recommended_profile: null,
          last_compared_views: [],
          last_issues: revision.issues,
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
        geometryRecord.previous_review_checkpoint =
          geometryRecord.review_checkpoint ??
          state.checkpoints?.geometry_review ??
          null;
        geometryRecord.review_checkpoint = null;
        geometryRecord.review_submitted_at = null;
        geometryRecord.revision = {
          mode: scope,
          source: revision.source,
          evidence_path: revision.path,
          geometry_fingerprint: currentFingerprint,
          reference_visual_sha256: currentReferenceHash,
          actionable_issues: revision.issues,
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
              text: `${scope} prepared from ${revision.source} inside the current Geometry session. Removed ${removed.length} structural-detail cube(s), preserved checkpoints, and returned workflow state to GEOMETRY_IN_PROGRESS.`,
            },
          ],
          structuredContent: {
            status: "PASS",
            phase,
            revision_mode: scope,
            revision_source: revision.source,
            revision_evidence_path: revision.path,
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
