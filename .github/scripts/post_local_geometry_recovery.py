from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]

# Update the obsolete primary-form regression.
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

# Register the two recovery tool docs in the single documentation/tool manifest.
manifest_path = ROOT / "mcp-blockbench/scripts/docs-manifest.ts"
manifest = manifest_path.read_text(encoding="utf-8")

import_anchor = 'import { geometryReviewSubmitToolDocs } from "../src/server/tools/geometry-review-submit";\n'
import_addition = (
    import_anchor
    + 'import { geometryPrimaryGateToolDocs } from "../src/server/tools/geometry-primary-gate";\n'
    + 'import { canonicalProjectSaveToolDocs } from "../src/server/tools/project-save";\n'
)
if manifest.count(import_anchor) != 1:
    raise RuntimeError("docs-manifest import anchor missing")
manifest = manifest.replace(import_anchor, import_addition, 1)

category_anchor = '  { category: "Geometry Review Submission", tools: geometryReviewSubmitToolDocs },\n'
category_addition = (
    category_anchor
    + '  { category: "Geometry Primary Form Gate", tools: geometryPrimaryGateToolDocs },\n'
    + '  { category: "Canonical Project Save", tools: canonicalProjectSaveToolDocs },\n'
)
if manifest.count(category_anchor) != 1:
    raise RuntimeError("docs-manifest category anchor missing")
manifest = manifest.replace(category_anchor, category_addition, 1)
manifest_path.write_text(manifest, encoding="utf-8")

print("Updated primary-form regression and registered recovery tool docs.")
