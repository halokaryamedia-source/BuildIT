import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { classifyGeometryManifestRole } from "../src/lib/geometryRuntime";

const read = (path: string) => readFileSync(path, "utf8");

describe("local Geometry P0 recovery", () => {
  test("classifies manifest roles deterministically", () => {
    const constraints = [
      { role: "PRIMARY_MASS" as const, name_patterns: ["torso", "neck"] },
      { role: "PROVISIONAL_SUPPORT" as const, name_patterns: ["leg"] },
      { role: "STRUCTURAL_DETAIL" as const, name_patterns: ["ear", "tail"] },
    ];
    expect(classifyGeometryManifestRole("torso_main", constraints)).toBe("PRIMARY_MASS");
    expect(classifyGeometryManifestRole("leg_front_left_upper", constraints)).toBe("PROVISIONAL_SUPPORT");
    expect(classifyGeometryManifestRole("ear_left", constraints)).toBe("STRUCTURAL_DETAIL");
    expect(classifyGeometryManifestRole("unknown", constraints)).toBeNull();
  });

  test("enforces primary form before detail and exposes one readiness tool", () => {
    const runtime = read("src/lib/geometryRuntime.ts");
    const gate = read("src/server/tools/geometry-primary-gate.ts");
    const profile = read("../engines/shared/profiles/tool-profiles.json");
    expect(runtime).toContain("GEOMETRY_PRIMARY_FORM_NOT_READY");
    expect(runtime).toContain("GEOMETRY_PRIMARY_FORM_UNCLASSIFIED_PART");
    expect(runtime).toContain("GEOMETRY_PRIMARY_FORM_CUBE_BUDGET_EXCEEDED");
    expect(gate).toContain("verify_primary_form_ready");
    expect(gate).toContain("PRIMARY_ROTATION_NOT_APPLIED");
    expect(gate).toContain("PRIMARY_VIEW_SCORE_LOW");
    expect(profile).toContain('"verify_primary_form_ready"');
  });

  test("keeps rotation contracts mandatory while recovering foreground failure", () => {
    const analyzer = read("src/server/tools/geometry-analyzer.ts");
    const rotation = read("src/server/tools/geometry-rotation.ts");
    expect(analyzer).toContain("segmentReferencePixelsAdaptive");
    expect(rotation).toContain("UNAVAILABLE_STRUCTURAL_FALLBACK");
    expect(rotation).toContain("ROTATION_VISUAL_PRECHECK_UNAVAILABLE");
    expect(rotation).toContain("ROTATION_CONNECTION_REJECTED");
  });

  test("persists canonical project and hardens connection startup", () => {
    const project = read("src/server/tools/project.ts");
    const canonical = read("src/server/tools/project-save.ts");
    const config = read("../.codex/config.toml");
    const connection = read("../engines/codex/CONNECTION_CONTRACT.md");
    expect(project).toContain("persist_immediately");
    expect(project).toContain("CANONICAL_MODEL_PATH_MISMATCH");
    expect(canonical).toContain("save_canonical_project");
    expect(config).toContain("startup_timeout_sec = 30");
    expect(config).toContain("tool_timeout_sec = 300");
    expect(connection).toContain("continue in the same Codex and MCP session");
    expect(connection).not.toContain("single required reconnect");
  });

  test("uses manifest Animation requirement at transition time", () => {
    const workflow = read("src/server/tools/workflow.ts");
    expect(workflow).toContain("manifestAnimationRequired");
    expect(workflow).toContain("state.workflow.animation_required = manifestAnimationRequired");
  });
});
