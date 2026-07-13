from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def append_once(path: str, marker: str, addition: str) -> None:
    target = ROOT / path
    source = target.read_text(encoding="utf-8").rstrip()
    if marker in source:
        return
    target.write_text(source + "\n\n" + addition.strip() + "\n", encoding="utf-8")


append_once(
    "openspec/changes/codex-local-workflow-rework/proposal.md",
    "Project parent default: `gpt-5.6-terra`, medium.",
    '''## Routing identity lock

Project parent default: `gpt-5.6-terra`, medium. The parent default       Terra Medium route performs standard work directly without a controller hop. `mcp_builder` remains the fallback sole MCP writer when isolation is required.''',
)

append_once(
    "engines/chatgpt/skills/blockbench-reference-studio/SKILL.md",
    "Right Side when `symmetry_policy` is `ASYMMETRIC`",
    '''## Compatibility invariants

- Include Right Side when `symmetry_policy` is `ASYMMETRIC`.
- The Geometry handoff ends with a final required-view diagnosis.
- All production stages continue in the same Codex and MCP session—the same Codex session and MCP session—without reconnect.''',
)

append_once(
    "engines/chatgpt/skills/blockbench-reference-studio/templates/CODEX_REFERENCE_HANDOFF.template.md",
    "same Codex session and MCP session",
    '''## Session invariant

All stage changes continue in the same Codex and MCP session: the same Codex session and MCP session remain active from Geometry through workspace completion.''',
)

append_once(
    "engines/codex/BOOTSTRAP.md",
    "four-sheet workflow and three approval",
    '''## Compatibility rejection invariant

`LEGACY_SKILL_CONFLICT` rejects any four-sheet workflow and three approval routine. If optional project roles are not loaded, report `CODEX_PROJECT_CONFIG_NOT_LOADED` and continue with the safe current-session fallback; do not restart.''',
)

append_once(
    "engines/codex/MODEL_ROUTING.md",
    "Multiple read-only MCP sessions are allowed",
    '''## Routing and ownership invariants

- The default Terra parent performs standard implementation directly.
- When isolation is needed, mcp_builder becomes the only writer.
- Never let the Terra parent and `mcp_builder` mutate the same active asset concurrently.
- Multiple read-only MCP sessions are allowed. A mutation still requires explicit caller identity and the active write lease.
- Missing optional roles produce `CODEX_PROJECT_CONFIG_NOT_LOADED`; they do not force restart.
- Reject a model call whose only purpose is choosing another model.
- Every Sol decision returns immediately to the selected Terra writer and deterministic validation.
- Reasoning effort never rises above High.
- Full-access caveat: sandbox labels do not replace MCP allowlists; MCP allowlists and the write lease remain authoritative.''',
)

append_once(
    "engines/shared/skills/blockbench-production/SKILL.md",
    "all manifest-required views",
    '''## Audited routing invariants

The selected Terra writer handles normal mutations. `visual_director` is conditional and inspection-only; High is reserved for one coded critical decision. Geometry uses `BEDROCK_CUBOID_GEOMETRY`, `analyze_geometry_views`, `rotate_cube_about_attachment`, and `submit_geometry_for_review`. Final Geometry and Final Validation must include all manifest-required views.''',
)

append_once(
    "engines/shared/skills/blockbench-geometry/SKILL.md",
    "analyze_geometry_views` persists canonical metrics",
    '''## Evidence and routing invariants

`analyze_geometry_views` persists canonical metrics and therefore requires the active Geometry lease. Freshness is bound to the transformed world-space signature as well as project UUID, local fingerprint, hierarchy, visibility, mesh structure, and Reference Visual hash. The final required-view capture/analyze uses all manifest-required views. The selected Terra writer performs repairs; `visual_director` is conditional, and High is reserved for one coded critical decision only.''',
)

append_once(
    "engines/shared/skills/blockbench-validation/SKILL.md",
    "continues in the same Codex and MCP session",
    '''## Session invariant

Every final-only revision or upstream reopen continues in the same Codex and MCP session. It may require a fresh target-stage lease, never a reconnect.''',
)

append_once(
    "engines/codex/FINAL_ACCEPTANCE_TEST.md",
    "one final end-to-end test",
    '''## Compatibility acceptance wording

This remains one final end-to-end test.

- Load the final `mcp-blockbench/dist/mcp.js` once.
- Start one Codex session.
- Create a new Black Rhinoceros model from zero for the controlled Golden Sample acceptance path.
- Confirm `prebuilt_model_copied: false` before MCP project creation.

The complete acceptance still continues beyond Geometry through Texture, optional Animation, Final Validation, `DONE`, and workspace completion.''',
)

print("Applied final flow compatibility invariants without restoring legacy steps.")
