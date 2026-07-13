import { describe, expect, test } from "bun:test";
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
