from pathlib import Path

path = Path(__file__).with_name("apply_local_geometry_recovery.py")
source = path.read_text(encoding="utf-8")


def replace_once(old: str, new: str, label: str) -> None:
    global source
    count = source.count(old)
    if count != 1:
        raise RuntimeError(f"Expected one {label} block, found {count}")
    source = source.replace(old, new, 1)


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

replace_once(
    '''for profile_id in [
    "BEDROCK_CUBOID_GEOMETRY",
    "BEDROCK_CUBOID_TEXTURE",
    "BEDROCK_CUBOID_ANIMATION",
    "FINAL_VALIDATION_READONLY",
]:
    tools = profiles["profiles"][profile_id]["allowed_tools"]
    if "save_canonical_project" not in tools:
        tools.append("save_canonical_project")
profile_path.write_text(json.dumps(profiles, indent=2) + "\\n", encoding="utf-8")''',
    '''for profile_id in [
    "BEDROCK_CUBOID_GEOMETRY",
    "BEDROCK_CUBOID_TEXTURE",
    "BEDROCK_CUBOID_ANIMATION",
    "FINAL_VALIDATION_READONLY",
]:
    tools = profiles["profiles"][profile_id]["allowed_tools"]
    if "save_canonical_project" not in tools:
        tools.append("save_canonical_project")
texture_tools = profiles["profiles"]["BEDROCK_CUBOID_TEXTURE"]["allowed_tools"]
if "save_project_checkpoint" in texture_tools:
    texture_tools.remove("save_project_checkpoint")
profile_path.write_text(json.dumps(profiles, indent=2) + "\\n", encoding="utf-8")''',
    "Texture tool budget",
)

replace_once(
    '''All final views, project UUID, fingerprints, transformed world signature,
Reference Visual hash, analyzer, primary-form gate, visual decision, and rotation
audit must be current. Submission owns fresh validation, checkpoint, transition,
and lease release.

After user approval, reacquire a fresh Geometry lease and call''',
    '''All final views, project UUID, fingerprints, transformed world-space signature,
Reference Visual hash, analyzer, primary-form gate, visual decision, and rotation
audit must be current. Submission owns fresh validation, checkpoint, transition,
and lease release.

## Compatibility and evidence invariants

- Never analyze an empty project.
- `analyze_geometry_views` persists canonical metrics and therefore remains a lease-owned write.
- The final required-view capture/analyze is the canonical final evidence pass.
- The selected Terra writer performs normal repairs directly.
- visual_director only when deterministic evidence cannot close a genuine visual decision.
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

path.write_text(source, encoding="utf-8")
print("Patched canonical guards, tool budgets, and compatibility invariants.")
