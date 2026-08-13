from pathlib import Path


def replace_once(path: str, old: str, new: str) -> None:
    p = Path(path)
    text = p.read_text()
    if old not in text:
        raise SystemExit(f"Expected text not found in {path}: {old[:140]!r}")
    p.write_text(text.replace(old, new, 1))


# Keep animation reasoning under the existing compactness budget by removing
# redundant search examples, not by raising the budget or dropping semantics.
replace_once(
    ".agents/skills/blockit-bedrock-animation/SKILL.md",
    '''## Deferred Spec Loading

After routing, load a missing spec with the **exact tool name** + short action; never raw user wording alone.

```text
inspect_animation         → "inspect_animation inspect authored animation keyframes"
manage_keyframes          → "manage_keyframes create edit transform keyframes"
animation_graph_editor    → "animation_graph_editor interpolation Bezier easing"
bone_rigging              → "bone_rigging edit reparent pivot bone rig"
animation_timeline        → "animation_timeline playback time loop"
batch_keyframe_operations → "batch_keyframe_operations batch offset scale keyframes"
animation_copy_paste      → "animation_copy_paste copy mirror paste keyframes"
```

If the exact spec is loaded, call it directly; reformulation keeps the same selected tool name.
''',
    '''## Deferred Spec Loading

After routing, load a missing spec with the **exact tool name** + short action; never raw user wording alone. If the exact spec is loaded, call it directly; reformulation keeps the same selected tool name.
''',
)

# Preserve the established execution-vs-visual-approval wording used by the
# primary-geometry regression contract.
replace_once(
    "mcp/server/tools/cubes.ts",
    '"Applies 1-32 unique UUID-targeted Cube transform/Box-UV/visibility corrections in one Undo unit after full preflight. Unsupported fields and same-value targets fail before Undo; per-Cube before/after `geometry_effect` remains explicit. Execution success is not visual approval.",',
    '"Applies 1-32 unique UUID-targeted Cube transform/Box-UV/visibility corrections in one Undo unit after full preflight. Unsupported fields and same-value targets fail before Undo; per-Cube before/after `geometry_effect` remains explicit. Execution success does not mean the geometry was corrected visually.",',
)
