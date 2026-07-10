import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

function readJson(path: string) {
  return JSON.parse(readFileSync(path, "utf8")) as Record<string, any>;
}

describe("Codex local workflow configuration", () => {
  test("state template starts reference-ready with detailed stage records", () => {
    const state = readJson("Engine/codex/state.template.json");

    expect(state.schema_version).toBe("2.0");
    expect(state.workflow.state).toBe("REFERENCE_READY");
    expect(state.workflow.active_stage).toBe("GEOMETRY");
    expect(state.workflow.stage_records.GEOMETRY.status).toBe("NOT_STARTED");
    expect(state.workflow.stage_records.TEXTURE.status).toBe("LOCKED");
    expect(state.validation.status).toBe("PENDING_BUILD");
    expect(state.mcp.endpoint).toBe("http://localhost:3000/bb-mcp");
    expect(state.checkpoints.geometry_approved).toBeNull();
  });

  test("all four user-visible stage profiles exist", () => {
    const config = readJson("Engine/codex/stage-profiles.json");
    const profiles = config.profiles;

    expect(config.schema_version).toBe("2.0");
    expect(Object.keys(profiles).sort()).toEqual(
      ["ANIMATION", "FINAL_VALIDATION", "GEOMETRY", "TEXTURE"].sort()
    );
    expect(profiles.ANIMATION.optional).toBe(true);
    expect(profiles.FINAL_VALIDATION.automatic_local_fix_limit).toBe(2);
  });

  test("Geometry uses stable five-view evidence filenames", () => {
    const geometry = readJson(
      "Engine/codex/stage-profiles.json"
    ).profiles.GEOMETRY;

    expect(geometry.required_evidence).toEqual({
      front: "evidence/geometry/geometry_front.png",
      left_side: "evidence/geometry/geometry_left.png",
      back: "evidence/geometry/geometry_back.png",
      top_footprint: "evidence/geometry/geometry_top.png",
      front_left_3_4: "evidence/geometry/geometry_front_left_3_4.png",
      report: "evidence/geometry/geometry_report.json",
    });
    expect(geometry.review_checkpoint).toBe(
      "checkpoints/10_geometry_review.bbmodel"
    );
    expect(geometry.approved_checkpoint).toBe(
      "checkpoints/20_geometry_approved.bbmodel"
    );
  });

  test("bootstrap defines one review after each user-visible stage", () => {
    const bootstrap = readFileSync("Engine/codex/BOOTSTRAP.md", "utf8");

    expect(bootstrap).toContain("GEOMETRY_REVIEW");
    expect(bootstrap).toContain("TEXTURE_REVIEW");
    expect(bootstrap).toContain("ANIMATION_REVIEW");
    expect(bootstrap).toContain("FINAL_REVIEW");
    expect(bootstrap).toContain("one-issue rule applies to revisions");
    expect(bootstrap).toContain("save_project_checkpoint");
    expect(bootstrap).toContain("capture_standard_views");
  });

  test("state, evidence, and recovery contracts are linked", () => {
    const bootstrap = readFileSync("Engine/codex/BOOTSTRAP.md", "utf8");
    const stateMachine = readFileSync("Engine/codex/STATE_MACHINE.md", "utf8");
    const evidence = readFileSync("Engine/codex/EVIDENCE_CONTRACT.md", "utf8");
    const checkpoint = readFileSync("Engine/codex/CHECKPOINT_RECOVERY.md", "utf8");

    expect(bootstrap).toContain("STATE_MACHINE.md");
    expect(bootstrap).toContain("EVIDENCE_CONTRACT.md");
    expect(bootstrap).toContain("CHECKPOINT_RECOVERY.md");
    expect(stateMachine).toContain("accepted areas are immutable by default");
    expect(evidence).toContain("geometry_front.png");
    expect(checkpoint).toContain("80_validation_pass.bbmodel");
  });

  test("new reference package does not require numbered sheets", () => {
    const checklist = readFileSync(
      "SourceDocument/modeling/reference-package-pass-fail-checklist.md",
      "utf8"
    );

    expect(checklist).toContain("PRODUCTION_CONTEXT.md");
    expect(checklist).toContain("<asset>_reference_visual.png");
    expect(checklist).toContain("Legacy numbered reference sheets are not required");
  });

  test("source exposes persistent checkpoint and standard capture tools", () => {
    const exportTools = readFileSync("src/server/tools/export.ts", "utf8");
    const cameraTools = readFileSync("src/server/tools/camera.ts", "utf8");

    expect(exportTools).toContain('name: "save_project_checkpoint"');
    expect(exportTools).toContain("expected_project_uuid");
    expect(cameraTools).toContain('name: "capture_standard_views"');
    expect(cameraTools).toContain("front_left_3_4");
  });
});
