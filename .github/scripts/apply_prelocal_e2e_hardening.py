from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def read(path: str) -> str:
    return (ROOT / path).read_text(encoding="utf-8")


def write(path: str, content: str) -> None:
    target = ROOT / path
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(content.rstrip() + "\n", encoding="utf-8")


def replace_once(path: str, old: str, new: str) -> None:
    source = read(path)
    count = source.count(old)
    if count != 1:
        raise RuntimeError(f"{path}: expected one replacement, found {count}: {old[:120]!r}")
    write(path, source.replace(old, new, 1))


# ---------------------------------------------------------------------------
# Direct no-reconnect semantics (not only response normalization)
# ---------------------------------------------------------------------------

replace_once(
    "mcp-blockbench/src/lib/toolProfiles.ts",
    "    reconnect_required_after_change: true,",
    "    reconnect_required_after_change: false,",
)

runtime = "mcp-blockbench/src/server/tools/runtime.ts"
replace_once(
    runtime,
    '      "Activates one exact stage or repair tool profile. Reconnect once after a change, then reacquire the project write lease.",',
    '      "Activates one exact stage tool profile on the stable tool surface. Continue in the same MCP session and reacquire the current-stage write lease after a change.",',
)
replace_once(
    runtime,
    '''              text: result.changed
                ? `Tool profile changed from ${result.previous_profile} to ${result.snapshot.profile_id}. Reconnect once, then reacquire the project write lease.`
                : `Tool profile ${result.snapshot.profile_id} is already active.`,''',
    '''              text: result.changed
                ? `Tool profile changed from ${result.previous_profile} to ${result.snapshot.profile_id}. Continue in the current MCP session and reacquire the current-stage write lease.`
                : `Tool profile ${result.snapshot.profile_id} is already active; continue in the current MCP session.`,''',
)
replace_once(
    runtime,
    '''            reconnect_required: result.changed,
            write_lease_reacquire_required: result.changed,
            next_action: result.changed
              ? "Reconnect the existing canonical blockbench MCP entry once, call get_runtime_status once, then reacquire manage_project_write_lease."
              : "Continue with the active stage.",''',
    '''            reconnect_required: false,
            current_session_continues: true,
            stable_tool_surface: true,
            write_lease_reacquire_required: result.changed,
            next_action: result.changed
              ? "Call get_stage_context in the current MCP session, then reacquire manage_project_write_lease for the active stage."
              : "Continue with the active stage in the current MCP session.",''',
)

# ---------------------------------------------------------------------------
# Stage-aware evidence and pure transition resolver
# ---------------------------------------------------------------------------

workflow = "mcp-blockbench/src/server/tools/workflow.ts"
replace_once(
    workflow,
    "type WorkflowStage = z.infer<typeof workflowStageEnum>;",
    "export type WorkflowStage = z.infer<typeof workflowStageEnum>;",
)
replace_once(
    workflow,
    "  geometry?: { hierarchy?: Record<string, unknown> };",
    '''  geometry?: {
    hierarchy?: Record<string, unknown>;
    symmetry_policy?: string;
  };''',
)

old_evidence = '''function canonicalEvidence(sessionRoot: string, stage: WorkflowStage): string[] {
  const relative: Record<WorkflowStage, string[]> = {
    GEOMETRY: [
      "evidence/geometry/geometry_front.png",
      "evidence/geometry/geometry_left.png",
      "evidence/geometry/geometry_back.png",
      "evidence/geometry/geometry_top.png",
      "evidence/geometry/geometry_front_left_3_4.png",
      "evidence/geometry/geometry_report.json",
    ],
    TEXTURE: [
      "evidence/texture/texture_atlas.png",
      "evidence/texture/texture_front.png",
      "evidence/texture/texture_left.png",
      "evidence/texture/texture_back.png",
      "evidence/texture/texture_front_left_3_4.png",
      "evidence/texture/texture_report.json",
    ],
    ANIMATION: [
      "evidence/animation/animation_neutral_pose.png",
      "evidence/animation/animation_hierarchy.json",
      "evidence/animation/animation_pivots.json",
      "evidence/animation/animation_report.json",
    ],
    FINAL_VALIDATION: [
      "evidence/final/final_front.png",
      "evidence/final/final_left.png",
      "evidence/final/final_back.png",
      "evidence/final/final_top.png",
      "evidence/final/final_front_left_3_4.png",
      "evidence/final/final_texture_atlas.png",
      "evidence/final/validation_report.json",
      "evidence/final/completed_VALIDATION.md",
    ],
  };
  return relative[stage].map((path) => joinPath(sessionRoot, path));
}'''
new_evidence = '''export function canonicalEvidence(
  sessionRoot: string,
  stage: WorkflowStage,
  manifest?: ReferenceManifest
): string[] {
  const relative: Record<WorkflowStage, string[]> = {
    GEOMETRY: [
      "evidence/geometry/geometry_front.png",
      "evidence/geometry/geometry_left.png",
      "evidence/geometry/geometry_back.png",
      "evidence/geometry/geometry_top.png",
      "evidence/geometry/geometry_front_left_3_4.png",
      "evidence/geometry/geometry_report.json",
    ],
    TEXTURE: [
      "evidence/texture/texture_atlas.png",
      "evidence/texture/texture_front.png",
      "evidence/texture/texture_left.png",
      "evidence/texture/texture_back.png",
      "evidence/texture/texture_front_left_3_4.png",
      "evidence/texture/texture_report.json",
    ],
    ANIMATION: [
      "evidence/animation/animation_neutral_pose.png",
      "evidence/animation/animation_hierarchy.json",
      "evidence/animation/animation_pivots.json",
      "evidence/animation/animation_report.json",
    ],
    FINAL_VALIDATION: [
      "evidence/final/final_front.png",
      "evidence/final/final_left.png",
      "evidence/final/final_back.png",
      "evidence/final/final_top.png",
      "evidence/final/final_front_left_3_4.png",
      "evidence/final/final_texture_atlas.png",
      "evidence/final/validation_report.json",
      "evidence/final/completed_VALIDATION.md",
    ],
  };

  const required = [...relative[stage]];
  const asymmetric =
    String(manifest?.geometry?.symmetry_policy ?? "").toUpperCase() ===
    "ASYMMETRIC";
  if (asymmetric && stage === "GEOMETRY") {
    required.splice(2, 0, "evidence/geometry/geometry_right.png");
  }
  if (asymmetric && stage === "FINAL_VALIDATION") {
    required.splice(2, 0, "evidence/final/final_right.png");
  }
  return required.map((path) => joinPath(sessionRoot, path));
}'''
replace_once(workflow, old_evidence, new_evidence)

transition_anchor = '''function reportResult(report: Record<string, any>): string | null {'''
transition_helper = '''export interface ApprovedStageTransition {
  nextProfile: string;
  nextState: string;
  nextStage: WorkflowStage;
  nextAction: string;
  startedStage: WorkflowStage | null;
  skippedAnimation: boolean;
}

export function resolveApprovedStageTransition(
  stage: WorkflowStage,
  animationRequired: boolean
): ApprovedStageTransition {
  if (stage === "GEOMETRY") {
    return {
      nextProfile: "BEDROCK_CUBOID_TEXTURE",
      nextState: "TEXTURE_IN_PROGRESS",
      nextStage: "TEXTURE",
      nextAction: "START_TEXTURE",
      startedStage: "TEXTURE",
      skippedAnimation: false,
    };
  }
  if (stage === "TEXTURE" && animationRequired) {
    return {
      nextProfile: "BEDROCK_CUBOID_ANIMATION",
      nextState: "ANIMATION_IN_PROGRESS",
      nextStage: "ANIMATION",
      nextAction: "START_ANIMATION",
      startedStage: "ANIMATION",
      skippedAnimation: false,
    };
  }
  if (stage === "TEXTURE") {
    return {
      nextProfile: "FINAL_VALIDATION_READONLY",
      nextState: "FINAL_VALIDATION",
      nextStage: "FINAL_VALIDATION",
      nextAction: "RUN_FINAL_VALIDATION",
      startedStage: "FINAL_VALIDATION",
      skippedAnimation: true,
    };
  }
  if (stage === "ANIMATION") {
    return {
      nextProfile: "FINAL_VALIDATION_READONLY",
      nextState: "FINAL_VALIDATION",
      nextStage: "FINAL_VALIDATION",
      nextAction: "RUN_FINAL_VALIDATION",
      startedStage: "FINAL_VALIDATION",
      skippedAnimation: false,
    };
  }
  return {
    nextProfile: "FINAL_VALIDATION_READONLY",
    nextState: "DONE",
    nextStage: "FINAL_VALIDATION",
    nextAction: "WAIT_FOR_FINAL_HANDOFF",
    startedStage: null,
    skippedAnimation: false,
  };
}

function reportResult(report: Record<string, any>): string | null {'''
replace_once(workflow, transition_anchor, transition_helper)

replace_once(
    workflow,
    "          for (const path of canonicalEvidence(session_root, stage)) {",
    "          for (const path of canonicalEvidence(session_root, stage, manifest)) {",
)
replace_once(
    workflow,
    '''        const requiredEvidence = canonicalEvidence(session_root, stage);
        if (stage === "FINAL_VALIDATION") {''',
    '''        const manifestPath = joinPath(
          session_root,
          "references/reference_manifest.json"
        );
        assertInsideRoot(manifestPath, session_root);
        const manifest = readJsonFile<ReferenceManifest>(fs, manifestPath);
        const requiredEvidence = canonicalEvidence(session_root, stage, manifest);
        if (stage === "FINAL_VALIDATION") {''',
)

old_transition = '''        let nextProfile = profileForStage(stage);
        let nextState = "DONE";
        let nextStage: WorkflowStage = "FINAL_VALIDATION";
        let nextAction = "WAIT_FOR_FINAL_HANDOFF";

        if (stage === "GEOMETRY") {
          nextProfile = "BEDROCK_CUBOID_TEXTURE";
          nextState = "TEXTURE_IN_PROGRESS";
          nextStage = "TEXTURE";
          nextAction = "START_TEXTURE";
          state.workflow.stage_records.TEXTURE.status = "IN_PROGRESS";
        } else if (stage === "TEXTURE") {
          if (state.workflow.animation_required) {
            nextProfile = "BEDROCK_CUBOID_ANIMATION";
            nextState = "ANIMATION_IN_PROGRESS";
            nextStage = "ANIMATION";
            nextAction = "START_ANIMATION";
            state.workflow.stage_records.ANIMATION.status = "IN_PROGRESS";
          } else {
            nextProfile = "FINAL_VALIDATION_READONLY";
            nextState = "FINAL_VALIDATION";
            nextStage = "FINAL_VALIDATION";
            nextAction = "RUN_FINAL_VALIDATION";
            state.workflow.stage_records.ANIMATION.status = "SKIPPED";
            state.workflow.stage_records.ANIMATION.decision = "SKIPPED";
            state.workflow.stage_records.ANIMATION.skip_reason =
              "Not required by approved reference package.";
            state.workflow.stage_records.FINAL_VALIDATION.status = "IN_PROGRESS";
          }
        } else if (stage === "ANIMATION") {
          nextProfile = "FINAL_VALIDATION_READONLY";
          nextState = "FINAL_VALIDATION";
          nextStage = "FINAL_VALIDATION";
          nextAction = "RUN_FINAL_VALIDATION";
          state.workflow.stage_records.FINAL_VALIDATION.status = "IN_PROGRESS";
        }'''
new_transition = '''        const transition = resolveApprovedStageTransition(
          stage,
          state.workflow.animation_required === true
        );
        const { nextProfile, nextState, nextStage, nextAction } = transition;
        if (transition.startedStage) {
          state.workflow.stage_records[transition.startedStage].status =
            "IN_PROGRESS";
        }
        if (transition.skippedAnimation) {
          state.workflow.stage_records.ANIMATION.status = "SKIPPED";
          state.workflow.stage_records.ANIMATION.decision = "SKIPPED";
          state.workflow.stage_records.ANIMATION.skip_reason =
            "Not required by approved reference package.";
        }'''
replace_once(workflow, old_transition, new_transition)

replace_once(
    workflow,
    "          state.mcp.profile_reconnect_required = activation.changed;",
    '''          state.mcp.profile_reconnect_required = false;
          state.mcp.stable_tool_surface = true;
          state.mcp.registered_tool_surface = "STABLE_FULL_LIBRARY";
          state.mcp.execution_surface = "ACTIVE_PROFILE_GUARDED";''',
)
replace_once(
    workflow,
    '''            reconnect_required: activation.changed,
            next_action: activation.changed
              ? "Reconnect the existing canonical blockbench MCP entry once, then call get_runtime_status."
              : nextAction,''',
    '''            reconnect_required: false,
            current_session_continues: true,
            stable_tool_surface: true,
            write_lease_reacquire_required:
              activation.changed && nextState !== "DONE",
            next_action: nextAction,''',
)

# ---------------------------------------------------------------------------
# Geometry approval and upstream reopen must persist no-reconnect state
# ---------------------------------------------------------------------------

geometry_completion = "mcp-blockbench/src/server/tools/geometry-completion.ts"
replace_once(
    geometry_completion,
    '      "Completes Geometry only after fresh structural validation and its embedded five-view review-readiness gate pass. Saves the next unused approved checkpoint and rolls back the new checkpoint/profile/state if the coordinated Texture transition fails.",',
    '      "Completes Geometry only after fresh structural validation and its embedded required-view review-readiness gate pass. Saves the next unused approved checkpoint and rolls back the new checkpoint/profile/state if the coordinated Texture transition fails.",',
)
replace_once(
    geometry_completion,
    "          state.mcp.profile_reconnect_required = activation.changed;",
    '''          state.mcp.profile_reconnect_required = false;
          state.mcp.stable_tool_surface = true;
          state.mcp.registered_tool_surface = "STABLE_FULL_LIBRARY";
          state.mcp.execution_surface = "ACTIVE_PROFILE_GUARDED";''',
)
replace_once(
    geometry_completion,
    '''              reconnect_required: activation.changed,
              next_action: activation.changed
                ? "Reconnect the canonical blockbench MCP entry once, call get_runtime_status, then reacquire the Texture lease."
                : "START_TEXTURE",''',
    '''              reconnect_required: false,
              current_session_continues: true,
              stable_tool_surface: true,
              write_lease_reacquire_required: activation.changed,
              next_action:
                "Call get_stage_context in the current MCP session, then acquire the fresh Texture lease.",''',
)

stage_reopen = "mcp-blockbench/src/server/tools/stage-reopen.ts"
replace_once(
    stage_reopen,
    '      "Atomically reopens the earliest affected approved stage from a later stage after explicit validation failure or user review feedback, preserves approved checkpoints as rollback baselines, invalidates downstream stage status, activates the canonical target profile, and releases the old lease for one canonical MCP reconnect.",',
    '      "Atomically reopens the earliest affected approved stage from a later stage after explicit validation failure or user review feedback, preserves approved checkpoints as rollback baselines, invalidates downstream stage status, activates the canonical target profile, releases the old lease, and continues in the same MCP session.",',
)
replace_once(
    stage_reopen,
    "  reconnectRequired: boolean",
    "  _reconnectRequired: boolean",
)
replace_once(
    stage_reopen,
    "  state.mcp.profile_reconnect_required = reconnectRequired;",
    '''  state.mcp.profile_reconnect_required = false;
  state.mcp.stable_tool_surface = true;
  state.mcp.registered_tool_surface = "STABLE_FULL_LIBRARY";
  state.mcp.execution_surface = "ACTIVE_PROFILE_GUARDED";''',
)
replace_once(
    stage_reopen,
    '''            profile_switch_required: true,
            reconnect_required: activation.changed,''',
    '''            profile_switch_required: true,
            reconnect_required: false,''',
)
replace_once(
    stage_reopen,
    '''              reconnect_required: activation.changed,
              lease_status: "UNCLAIMED",
              preserved_approved_checkpoints: true,
              downstream_revalidation_required: order.slice(
                stageIndex(target) + 1
              ),
              next_action: activation.changed
                ? "Reconnect the canonical blockbench MCP entry once, call get_stage_context, then acquire the target-stage lease."
                : target === "GEOMETRY"
                  ? "CONTINUE_GEOMETRY"
                  : "CONTINUE_STAGE",''',
    '''              reconnect_required: false,
              current_session_continues: true,
              stable_tool_surface: true,
              write_lease_reacquire_required: true,
              lease_status: "UNCLAIMED",
              preserved_approved_checkpoints: true,
              downstream_revalidation_required: order.slice(
                stageIndex(target) + 1
              ),
              next_action:
                target === "GEOMETRY"
                  ? "Call get_stage_context in the current MCP session, acquire the fresh Geometry lease, then continue Geometry."
                  : "Call get_stage_context in the current MCP session, acquire the fresh target-stage lease, then continue the stage.",''',
)

# ---------------------------------------------------------------------------
# Permanent pre-local regression suite
# ---------------------------------------------------------------------------

write(
    "mcp-blockbench/tests/prelocal-end-to-end-hardening.test.ts",
    r'''import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { getToolProfileSnapshot } from "../src/lib/toolProfiles";
import {
  canonicalEvidence,
  resolveApprovedStageTransition,
} from "../src/server/tools/workflow";

const read = (path: string) => readFileSync(path, "utf8");
const json = (path: string) => JSON.parse(read(path)) as Record<string, any>;

const baseViews = [
  "front",
  "left_side",
  "back",
  "top_footprint",
  "front_left_3_4",
];

describe("pre-local ChatGPT to Codex/MCP end-to-end hardening", () => {
  test("starts every newly generated package as a complete 3.3 reference candidate", () => {
    const skill = read(
      "../engines/chatgpt/skills/blockbench-reference-studio/SKILL.md"
    );
    const template = json(
      "../engines/chatgpt/skills/blockbench-reference-studio/templates/reference_manifest.template.json"
    );
    const handoff = read(
      "../engines/chatgpt/skills/blockbench-reference-studio/templates/CODEX_REFERENCE_HANDOFF.template.md"
    );
    const golden = json(
      "../docs/reference/golden-samples/black_rhinoceros/reference_manifest.json"
    );

    expect(skill).toContain("reference_candidate");
    expect(skill).toContain("golden_sample");
    expect(skill).toContain("final required-view diagnosis");
    expect(template.schema_version).toBe("3.3");
    expect(template.contract).toMatchObject({
      reference_studio: "3.3",
      mcp_blockbench_minimum: "1.7.0",
      workflow: "single_reference_visual_one_session",
    });
    expect(template.validation.base_required_views).toEqual(baseViews);
    expect(template.validation.conditional_required_views.ASYMMETRIC).toEqual([
      "right_side",
    ]);
    expect(golden.sample_type).toBe("golden_sample");
    expect(golden.workflow.promotion_status).toBe("promoted_golden_sample");
    expect(handoff).toContain("submit_geometry_for_review");
    expect(handoff).toContain("same Codex session and MCP session");
  });

  test("resolves both approved production paths through FINAL_VALIDATION to DONE", () => {
    expect(resolveApprovedStageTransition("GEOMETRY", false)).toMatchObject({
      nextProfile: "BEDROCK_CUBOID_TEXTURE",
      nextState: "TEXTURE_IN_PROGRESS",
      nextStage: "TEXTURE",
      nextAction: "START_TEXTURE",
    });
    expect(resolveApprovedStageTransition("TEXTURE", false)).toMatchObject({
      nextProfile: "FINAL_VALIDATION_READONLY",
      nextState: "FINAL_VALIDATION",
      nextStage: "FINAL_VALIDATION",
      skippedAnimation: true,
    });
    expect(resolveApprovedStageTransition("TEXTURE", true)).toMatchObject({
      nextProfile: "BEDROCK_CUBOID_ANIMATION",
      nextState: "ANIMATION_IN_PROGRESS",
      nextStage: "ANIMATION",
      skippedAnimation: false,
    });
    expect(resolveApprovedStageTransition("ANIMATION", true)).toMatchObject({
      nextProfile: "FINAL_VALIDATION_READONLY",
      nextState: "FINAL_VALIDATION",
      nextStage: "FINAL_VALIDATION",
    });
    expect(
      resolveApprovedStageTransition("FINAL_VALIDATION", false)
    ).toMatchObject({
      nextProfile: "FINAL_VALIDATION_READONLY",
      nextState: "DONE",
      nextAction: "WAIT_FOR_FINAL_HANDOFF",
    });
  });

  test("requires Right Side evidence at Geometry and Final Validation only for asymmetric assets", () => {
    const bilateral = { geometry: { symmetry_policy: "BILATERAL" } };
    const asymmetric = { geometry: { symmetry_policy: "ASYMMETRIC" } };

    expect(canonicalEvidence("/asset/mcp", "GEOMETRY", bilateral)).not.toContain(
      "/asset/mcp/evidence/geometry/geometry_right.png"
    );
    expect(canonicalEvidence("/asset/mcp", "GEOMETRY", asymmetric)).toContain(
      "/asset/mcp/evidence/geometry/geometry_right.png"
    );
    expect(
      canonicalEvidence("/asset/mcp", "FINAL_VALIDATION", bilateral)
    ).not.toContain("/asset/mcp/evidence/final/final_right.png");
    expect(
      canonicalEvidence("/asset/mcp", "FINAL_VALIDATION", asymmetric)
    ).toContain("/asset/mcp/evidence/final/final_right.png");
  });

  test("direct profile and transition implementations never persist reconnect state", () => {
    expect(getToolProfileSnapshot(false).reconnect_required_after_change).toBe(
      false
    );

    const runtime = read("src/server/tools/runtime.ts");
    const workflow = read("src/server/tools/workflow.ts");
    const geometry = read("src/server/tools/geometry-completion.ts");
    const reopen = read("src/server/tools/stage-reopen.ts");
    const combined = `${runtime}\n${workflow}\n${geometry}\n${reopen}`;

    for (const forbidden of [
      "Reconnect once",
      "Reconnect the existing canonical",
      "Reconnect the canonical blockbench",
      "one canonical MCP reconnect",
      "profile_reconnect_required = activation.changed",
      "reconnect_required: activation.changed",
    ]) {
      expect(combined).not.toContain(forbidden);
    }
    for (const source of [runtime, workflow, geometry, reopen]) {
      expect(source).toContain("reconnect_required: false");
    }
    for (const source of [workflow, geometry, reopen]) {
      expect(source).toContain("profile_reconnect_required = false");
      expect(source).toContain('registered_tool_surface = "STABLE_FULL_LIBRARY"');
      expect(source).toContain('execution_surface = "ACTIVE_PROFILE_GUARDED"');
    }
  });

  test("keeps all stage tools, reports, final export checks, and completion lifecycle connected", () => {
    const stageProfiles = json("../engines/shared/profiles/stage-profiles.json");
    const toolProfiles = json("../engines/shared/profiles/tool-profiles.json");
    const workflow = read("src/server/tools/workflow.ts");
    const workspace = read("../engines/shared/workspace/manage-workspace.ts");

    const expected = {
      GEOMETRY: {
        profile: "BEDROCK_CUBOID_GEOMETRY",
        submit: "submit_geometry_for_review",
        complete: "complete_geometry_stage",
      },
      TEXTURE: {
        profile: "BEDROCK_CUBOID_TEXTURE",
        submit: "submit_stage_for_review",
        complete: "complete_stage",
      },
      ANIMATION: {
        profile: "BEDROCK_CUBOID_ANIMATION",
        submit: "submit_stage_for_review",
        complete: "complete_stage",
      },
      FINAL_VALIDATION: {
        profile: "FINAL_VALIDATION_READONLY",
        submit: "submit_stage_for_review",
        complete: "complete_stage",
      },
    } as const;

    for (const [stage, contract] of Object.entries(expected)) {
      const profile = stageProfiles.profiles[stage];
      expect(profile.tool_profile_id).toBe(contract.profile);
      expect(profile.review_submission_tool).toBe(contract.submit);
      expect(profile.approval_transition_tool).toBe(contract.complete);
      const allowed = new Set(toolProfiles.profiles[contract.profile].allowed_tools);
      expect(allowed.has(contract.submit), `${stage} submit`).toBe(true);
      expect(allowed.has(contract.complete), `${stage} complete`).toBe(true);
    }

    expect(workflow).toContain("FINAL_MODEL_MISSING");
    expect(workflow).toContain("FINAL_TEXTURE_DIRECTORY_MISSING");
    expect(workflow).toContain("STAGE_REPORT_NOT_PASS");
    expect(workflow).toContain("STAGE_EVIDENCE_MISSING");
    expect(workspace).toContain("await promoteFinal(assetId)");
    expect(workspace).toContain('status: "COMPLETED"');
    expect(workspace).toContain("reference_manifest_sha256");
  });
});
''',
)

print("Applied pre-local end-to-end hardening patch.")
