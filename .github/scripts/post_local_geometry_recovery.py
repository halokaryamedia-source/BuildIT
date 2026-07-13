from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
path = ROOT / "mcp-blockbench/tests/geometry-session-safety.test.ts"
source = path.read_text(encoding="utf-8")

old = '''  test("internal progress markers do not hard-lock normal editing", () => {
    const runtime = read("src/lib/geometryRuntime.ts");
    expect(runtime).toContain("internal progress markers, not user-facing gates");
    expect(runtime).not.toContain("GEOMETRY_PRIMARY_FORM_GATE");
    expect(runtime).not.toContain("VISUAL_CONVERGENCE_FAILED:");
    expect(runtime).toContain("attention_required");
    expect(runtime).toContain("ROTATION_CONTRACT_TOOL_REQUIRED");
  });'''

new = '''  test("primary form is an internal gate without adding a user review or profile", () => {
    const runtime = read("src/lib/geometryRuntime.ts");
    const geometrySkill = read("../engines/shared/skills/blockbench-geometry/SKILL.md");
    expect(runtime).toContain("PRIMARY_FORM is nevertheless a deterministic mutation boundary");
    expect(runtime).toContain("GEOMETRY_PRIMARY_FORM_NOT_READY");
    expect(runtime).toContain("GEOMETRY_PRIMARY_FORM_UNCLASSIFIED_PART");
    expect(runtime).toContain("attention_required");
    expect(runtime).toContain("ROTATION_CONTRACT_TOOL_REQUIRED");
    expect(geometrySkill).toContain("not extra user reviews or profiles");
    expect(geometrySkill).toContain("verify_primary_form_ready");
  });'''

count = source.count(old)
if count != 1:
    raise RuntimeError(f"Expected one obsolete primary-form regression, found {count}")
path.write_text(source.replace(old, new, 1), encoding="utf-8")
print("Updated primary-form regression contract.")
