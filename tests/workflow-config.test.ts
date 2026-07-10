import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

function readJson(path: string) {
  return JSON.parse(readFileSync(path, "utf8")) as Record<string, any>;
}

describe("Codex local workflow configuration", () => {
  test("state template starts at Geometry with pending validation", () => {
    const state = readJson("Engine/codex/state.template.json");

    expect(state.schema_version).toBe("1.0");
    expect(state.workflow.stage).toBe("GEOMETRY");
    expect(state.workflow.status).toBe("NOT_STARTED");
    expect(state.validation.status).toBe("PENDING_BUILD");
    expect(state.mcp.endpoint).toBe("http://localhost:3000/bb-mcp");
  });

  test("all four user-visible stage profiles exist", () => {
    const profiles = readJson("Engine/codex/stage-profiles.json").profiles;

    expect(Object.keys(profiles).sort()).toEqual(
      ["ANIMATION", "FINAL_VALIDATION", "GEOMETRY", "TEXTURE"].sort()
    );
    expect(profiles.ANIMATION.optional).toBe(true);
    expect(profiles.FINAL_VALIDATION.automatic_local_fix_limit).toBe(2);
  });

  test("Geometry requires the five standard review views", () => {
    const geometry = readJson("Engine/codex/stage-profiles.json").profiles.GEOMETRY;

    expect(geometry.required_evidence).toEqual([
      "front",
      "left_side",
      "back",
      "top_footprint",
      "front_left_3_4",
    ]);
  });

  test("bootstrap defines one review after each user-visible stage", () => {
    const bootstrap = readFileSync("Engine/codex/BOOTSTRAP.md", "utf8");

    expect(bootstrap).toContain("GEOMETRY_REVIEW");
    expect(bootstrap).toContain("TEXTURE_REVIEW");
    expect(bootstrap).toContain("ANIMATION_REVIEW");
    expect(bootstrap).toContain("FINAL_REVIEW");
    expect(bootstrap).toContain("one-issue rule applies only to revision cycles");
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
});
