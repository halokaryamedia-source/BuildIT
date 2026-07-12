import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { toolManifest } from "../scripts/docs-manifest";
import {
  normalizeGeometryStageContextResult,
  normalizeGeometryValidationResult,
} from "../src/lib/toolProfiles";

const read = (path: string) => readFileSync(path, "utf8");
const json = (path: string) => JSON.parse(read(path)) as Record<string, any>;

const toolNames = new Set(
  toolManifest.flatMap((group) => group.tools.map((tool) => tool.name))
);

describe("automatic Geometry review submission", () => {
  test("registers and exposes submit_geometry_for_review in the single Geometry profile", () => {
    const profiles = json("../engines/shared/profiles/tool-profiles.json");
    const stages = json("../engines/shared/profiles/stage-profiles.json");
    const allowed = new Set<string>(
      profiles.profiles.BEDROCK_CUBOID_GEOMETRY.allowed_tools
    );

    expect(toolNames.has("submit_geometry_for_review")).toBe(true);
    expect(allowed.has("submit_geometry_for_review")).toBe(true);
    expect(stages.geometry_visual_policy.review_submission_tool).toBe(
      "submit_geometry_for_review"
    );
    expect(stages.profiles.GEOMETRY.review_submission_tool).toBe(
      "submit_geometry_for_review"
    );

    const exposed = new Set([
      ...profiles.core_tools,
      ...profiles.profiles.BEDROCK_CUBOID_GEOMETRY.allowed_tools,
    ]);
    expect(exposed.size).toBeLessThanOrEqual(30);
  });

  test("submission verifies readiness, saves a unique checkpoint, and moves state to review", () => {
    const source = read("src/server/tools/geometry-review-submit.ts");
    for (const marker of [
      "verify_geometry_review_ready",
      "save_project_checkpoint",
      "GEOMETRY_IN_PROGRESS",
      "GEOMETRY_REVIEW",
      "AWAITING_USER_REVIEW",
      "AWAIT_GEOMETRY_REVIEW",
      "nextReviewCheckpoint",
      "updateProjectWriteLeaseWorkflow",
      "reconnect_required: false",
      "profile_switch_required: false",
    ]) {
      expect(source).toContain(marker);
    }
  });

  test("stage context routes final-ready Geometry to submission and review state to user review", () => {
    const finalReady: Record<string, any> = {
      structuredContent: {
        next_safe_operation: "verify_geometry_review_ready",
        context: {
          stage: "GEOMETRY",
          project: { runtime_uuid: "u", identity_ready: true },
          lease: { status: "ACTIVE", project_uuid: "u" },
          workflow: { state: "GEOMETRY_IN_PROGRESS" },
          geometry: { runtime: { phase: "FINAL_REVIEW_READY" } },
          visual_grounding: {},
          automation: {},
        },
      },
    };
    normalizeGeometryStageContextResult(finalReady);
    expect(finalReady.structuredContent.next_safe_operation).toBe(
      "submit_geometry_for_review"
    );
    expect(
      finalReady.structuredContent.context.visual_grounding.review_submission_tool
    ).toBe("submit_geometry_for_review");

    finalReady.structuredContent.context.workflow.state = "GEOMETRY_REVIEW";
    normalizeGeometryStageContextResult(finalReady);
    expect(finalReady.structuredContent.next_safe_operation).toBe(
      "AWAIT_GEOMETRY_REVIEW"
    );
  });
});

describe("single-profile Geometry repair routing", () => {
  test("normalizes generic Geometry revision output to the main Geometry profile", () => {
    const result: Record<string, any> = {
      structuredContent: {
        result: "REVISION_REQUIRED",
        stage: "GEOMETRY",
        next_profile: "GEOMETRY_LOCAL_REPAIR",
        issues: [
          {
            severity: "REVISION_REQUIRED",
            recommended_profile: "GEOMETRY_LOCAL_REPAIR",
          },
        ],
      },
    };

    normalizeGeometryValidationResult(result);

    expect(result.structuredContent.next_profile).toBe(
      "BEDROCK_CUBOID_GEOMETRY"
    );
    expect(result.structuredContent.revision_route).toEqual({
      profile: "BEDROCK_CUBOID_GEOMETRY",
      scope: "CLASSIFY_WITH_ANALYZE_GEOMETRY_VIEWS",
      profile_switch_required: false,
      reconnect_required: false,
    });
    expect(result.structuredContent.issues[0].recommended_profile).toBe(
      "BEDROCK_CUBOID_GEOMETRY"
    );
  });
});
