import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { toolManifest } from "../scripts/docs-manifest";

const read = (path: string) => readFileSync(path, "utf8");
const readJson = (path: string) => JSON.parse(read(path)) as Record<string, any>;

const toolNames = toolManifest.flatMap((group) =>
  group.tools.map((tool) => tool.name)
);

function occurrences(name: string): number {
  return toolNames.filter((candidate) => candidate === name).length;
}

describe("audited multi-stage MCP flow", () => {
  test("registers every automatic review and recovery tool exactly once", () => {
    for (const name of [
      "record_stage_review_report",
      "submit_stage_for_review",
      "prepare_stage_revision",
      "reopen_stage_for_revision",
      "submit_geometry_for_review",
      "complete_geometry_stage",
    ]) {
      expect(occurrences(name), name).toBe(1);
    }
  });

  test("wires every correctness guard in the intended order", () => {
    const source = read("src/server/tools.ts");
    for (const marker of [
      "installGeometryFreshnessGuards();",
      "installStageReviewMutationGuards();",
      "installStageCompletionFreshnessGuards();",
      "installReviewSubmissionLeaseGuards();",
      "installFinalValidationGeometryGuards();",
      "installStageTransitionGuards();",
      "installProfileStateReconciliationGuards();",
      "initializeToolProfiles();",
      "installStageValidationRoutingGuards();",
      "installStageContextRoutingGuards();",
    ]) {
      expect(source).toContain(marker);
    }
    for (const marker of [
      "installStageValidationRoutingGuards();",
      "installStageContextRoutingGuards();",
    ]) {
      expect(source.indexOf(marker), marker).toBeGreaterThan(
        source.indexOf("initializeToolProfiles();")
      );
    }
  });

  test("binds non-Geometry review reports to current project and evidence", () => {
    const evidence = read("src/lib/stageEvidence.ts");
    const report = read("src/server/tools/stage-report.ts");
    const submit = read("src/server/tools/stage-review-submit.ts");
    const completion = read("src/server/stage-completion-freshness-guards.ts");

    for (const marker of [
      "STAGE_REPORT_UNBOUND",
      "STAGE_REPORT_PROJECT_MISMATCH",
      "STAGE_REPORT_PROJECT_STALE",
      "STAGE_REPORT_EVIDENCE_STALE",
      "STAGE_REPORT_STALE",
    ]) {
      expect(evidence).toContain(marker);
    }
    expect(report).toContain('generated_by: "record_stage_review_report"');
    expect(submit).toContain("assertCurrentStageReport");
    expect(completion).toContain("assertCurrentStageReport");
    expect(completion).toContain("validate_reference_contract");
  });

  test("locks review snapshots and releases the writer while waiting", () => {
    const mutation = read("src/server/stage-review-mutation-guards.ts");
    const lease = read("src/server/review-submission-lease-guards.ts");
    expect(mutation).toContain("STAGE_REVIEW_MUTATION_BLOCKED");
    for (const state of [
      "GEOMETRY_REVIEW",
      "TEXTURE_REVIEW",
      "ANIMATION_REVIEW",
      "FINAL_REVIEW",
    ]) {
      expect(mutation).toContain(state);
    }
    expect(lease).toContain("submit_geometry_for_review");
    expect(lease).toContain("submit_stage_for_review");
    expect(lease).toContain("clearProjectWriteLease");
    expect(lease).toContain('lease_status = "UNCLAIMED"');
  });

  test("enforces current Geometry readiness during final review and approval", () => {
    const guard = read("src/server/final-validation-geometry-guards.ts");
    expect(guard).toContain("submit_stage_for_review");
    expect(guard).toContain("complete_stage");
    expect(guard).toContain("verify_geometry_review_ready");
    expect(guard).toContain("FINAL_GEOMETRY_REVIEW_NOT_READY");
  });

  test("supports same-profile revision and guarded upstream reopen", () => {
    const revision = read("src/server/tools/stage-revision.ts");
    const reopen = read("src/server/tools/stage-reopen.ts");
    const routing = read("src/server/stage-validation-routing-guards.ts");
    expect(revision).toContain("profile_switch_required: false");
    expect(revision).toContain("reconnect_required: false");
    expect(revision).toContain("evidence_after");
    expect(reopen).toContain("BLOCKED_BY_UPSTREAM_REVISION");
    expect(reopen).toContain("preserved_approved_checkpoints: true");
    expect(reopen).toContain("clearProjectWriteLease");
    expect(routing).toContain('"reopen_stage_for_revision"');
    expect(routing).toContain("earlierThan");
  });

  test("preserves approved checkpoint history and reconciles failed transitions", () => {
    const transitions = read("src/server/stage-transition-guards.ts");
    const reconciliation = read(
      "src/server/profile-state-reconciliation-guards.ts"
    );
    expect(transitions).toContain("archived_previous_checkpoint");
    expect(transitions).toContain("restoreCanonicalCheckpoint");
    expect(transitions).toContain("removeNewCheckpointEntries");
    expect(reconciliation).toContain("const mismatch");
    expect(reconciliation).toContain("profile_reconnect_required = true");
    expect(reconciliation).toContain("clearProjectWriteLease");
  });

  test("nested mutation calls inherit the current lease owner", () => {
    const context = read("src/lib/mutationContext.ts");
    expect(context).toContain("getProjectWriteLeaseSnapshot");
    expect(context).toContain('lease.status === "ACTIVE"');
    expect(context).toContain("lease.owner_session_id");
  });

  test("stage policy exposes automatic transitions without removed repair profiles", () => {
    const profiles = readJson("../engines/shared/profiles/tool-profiles.json");
    const stages = readJson("../engines/shared/profiles/stage-profiles.json");
    for (const removed of [
      "GEOMETRY_LOCAL_REPAIR",
      "GEOMETRY_VISUAL_REBUILD",
      "TEXTURE_LOCAL_REPAIR",
      "ANIMATION_LOCAL_REPAIR",
    ]) {
      expect(profiles.profiles[removed]).toBeUndefined();
    }
    for (const stage of ["TEXTURE", "ANIMATION", "FINAL_VALIDATION"]) {
      expect(stages.profiles[stage].identity_sync_tool).toBe(
        "rebind_active_project_identity"
      );
      expect(stages.profiles[stage].review_submission_tool).toBe(
        "submit_stage_for_review"
      );
      expect(stages.profiles[stage].revision_prepare_tool).toBe(
        "prepare_stage_revision"
      );
    }
  });

  test("all production stage skill adapters remain byte-identical", () => {
    for (const skill of [
      "blockbench-production",
      "blockbench-geometry",
      "blockbench-texture",
      "blockbench-animation",
      "blockbench-validation",
    ]) {
      const canonical = read(`../engines/shared/skills/${skill}/SKILL.md`);
      expect(read(`../.agents/skills/${skill}/SKILL.md`)).toBe(canonical);
      expect(read(`../.codex/skills/${skill}/SKILL.md`)).toBe(canonical);
    }
  });
});
