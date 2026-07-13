from pathlib import Path

path = Path(__file__).with_name("apply_local_geometry_recovery.py")
source = path.read_text(encoding="utf-8")


def replace_once(old: str, new: str, label: str) -> None:
    global source
    if source.count(old) != 1:
        raise RuntimeError(f"Expected one {label} block, found {source.count(old)}")
    source = source.replace(old, new, 1)


# Canonical session-root null guards.
replace_once(
    '''function canonicalProjectPath(sessionRoot: string, assetId: string): string {
  const activeRoot = parentDirectory(sessionRoot);
  const separator = sessionRoot.includes("\\\\") && !sessionRoot.includes("/") ? "\\\\" : "/";
  return `${activeRoot}${separator}blockbench${separator}${assetId}.bbmodel`;
}''',
    '''function canonicalProjectPath(sessionRoot: string, assetId: string): string {
  const activeRoot = parentDirectory(sessionRoot);
  if (!activeRoot) {
    throw new Error(`CANONICAL_SESSION_ROOT_INVALID: ${sessionRoot}`);
  }
  const separator = sessionRoot.includes("\\\\") && !sessionRoot.includes("/") ? "\\\\" : "/";
  return `${activeRoot}${separator}blockbench${separator}${assetId}.bbmodel`;
}''',
    "canonicalProjectPath",
)

replace_once(
    '''        const activeRoot = parentDirectory(session_root);
        const canonicalPath = joinPath(
          activeRoot,
          `blockbench/${asset_id}.bbmodel`
        );''',
    '''        const activeRoot = parentDirectory(session_root);
        if (!activeRoot) {
          throw new Error(`CANONICAL_SESSION_ROOT_INVALID: ${session_root}`);
        }
        const canonicalPath = joinPath(
          activeRoot,
          `blockbench/${asset_id}.bbmodel`
        );''',
    "save_canonical_project",
)

# Keep the normal Geometry profile within the established 30-tool budget.
replace_once(
    '''if "verify_primary_form_ready" not in geometry_tools:
    index = geometry_tools.index("analyze_geometry_views") + 1
    geometry_tools.insert(index, "verify_primary_form_ready")
profile_path.write_text(json.dumps(profiles, indent=2) + "\\n", encoding="utf-8")''',
    '''if "verify_primary_form_ready" not in geometry_tools:
    index = geometry_tools.index("analyze_geometry_views") + 1
    geometry_tools.insert(index, "verify_primary_form_ready")
for redundant_tool in ["redo", "get_undo_stack"]:
    if redundant_tool in geometry_tools:
        geometry_tools.remove(redundant_tool)
profile_path.write_text(json.dumps(profiles, indent=2) + "\\n", encoding="utf-8")''',
    "Geometry tool budget",
)

# Preserve load-bearing compatibility phrases while keeping the new enforced flow.
replace_once(
    '''All final views, project UUID, fingerprints, transformed world signature,
Reference Visual hash, analyzer, primary-form gate, visual decision, and rotation
audit must be current. Submission owns fresh validation, checkpoint, transition,
and lease release.

After user approval, reacquire a fresh Geometry lease and call''',
    '''All final views, project UUID, fingerprints, transformed world signature,
Reference Visual hash, analyzer, primary-form gate, visual decision, and rotation
audit must be current. Submission owns fresh validation, checkpoint, transition,
and lease release.

## Compatibility and evidence invariants

- Never analyze an empty project.
- `analyze_geometry_views` persists canonical metrics and therefore remains a
  lease-owned write.
- The final required-view capture/analyze is the canonical final evidence pass.
- The selected Terra writer performs normal repairs directly.
- `visual_director` only when deterministic evidence cannot close a genuine
  visual decision.
- High remains the maximum and is reserved for one coded critical decision.

After user approval, reacquire a fresh Geometry lease and call''',
    "Geometry compatibility invariants",
)

replace_once(
    '''write(production_path, production)

# ---------------------------------------------------------------------------
# 9. OpenSpec/Ponytail records the P0 fix and prevents a new loop.''',
    '''if "## Geometry recovery compatibility invariants" not in production:
    production = production.rstrip() + """

## Geometry recovery compatibility invariants

- zero-start: build primary form before first capture/analyze;
- `verify_primary_form_ready` passes before structural detail;
- final required-view capture/analyze remains mandatory;
- no duplicate happy-path validation is added;
- visual judgment stays conditional rather than mandatory.
"""
write(production_path, production)

# ---------------------------------------------------------------------------
# 9. OpenSpec/Ponytail records the P0 fix and prevents a new loop.''',
    "Production compatibility invariants",
)

# Replace the obsolete regression that explicitly prohibited a primary-form gate.
replace_once(
    '''write("mcp-blockbench/tests/local-geometry-p0-recovery.test.ts", primary_test)

print("Applied local Geometry P0 recovery hardening.")''',
    '''write("mcp-blockbench/tests/local-geometry-p0-recovery.test.ts", primary_test)

session_test_path = "mcp-blockbench/tests/geometry-session-safety.test.ts"
session_test = read(session_test_path)
old_session_test = r'''  test("internal progress markers do not hard-lock normal editing", () => {
    const runtime = read("src/lib/geometryRuntime.ts");
    expect(runtime).toContain("internal progress markers, not user-facing gates");
    expect(runtime).not.toContain("GEOMETRY_PRIMARY_FORM_GATE");
    expect(runtime).not.toContain("VISUAL_CONVERGENCE_FAILED:");
    expect(runtime).toContain("attention_required");
    expect(runtime).toContain("ROTATION_CONTRACT_TOOL_REQUIRED");
  });'''
new_session_test = r'''  test("primary form is an internal gate without adding a user review or profile", () => {
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
if session_test.count(old_session_test) != 1:
    raise RuntimeError(
        f"Expected one obsolete primary-form regression, found {session_test.count(old_session_test)}"
    )
write(session_test_path, session_test.replace(old_session_test, new_session_test, 1))

print("Applied local Geometry P0 recovery hardening.")''',
    "Primary-form regression update",
)

path.write_text(source, encoding="utf-8")
print("Patched canonical guards, profile budget, and recovery invariants.")
