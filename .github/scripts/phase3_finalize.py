from pathlib import Path


def replace_once(path: str, old: str, new: str) -> None:
    p = Path(path)
    text = p.read_text()
    if old not in text:
        raise SystemExit(f"Expected text not found in {path}: {old[:160]!r}")
    p.write_text(text.replace(old, new, 1))


old_surface = '''62 tools
74,996 tools/list response characters
51,810 input-schema characters
10,885 description characters
initialize instructions: 386 characters'''
new_surface = '''62 tools
75,129 tools/list response characters
52,105 input-schema characters
10,723 description characters
initialize instructions: 386 characters'''
replace_once("README.md", old_surface, new_surface)
replace_once(
    "README.md",
    "**P0–P7 plus assisted Reference Generator intake/readiness are implemented on `Local` as repository/static contracts unless a specific accepted live baseline applies.**",
    "**P0–P7, assisted Reference Generator intake/readiness, and professional modelling Phase 1–3 contracts are implemented on `Local` unless a specific accepted live baseline applies.**",
)

old_metrics = '''initialize instructions: 386 characters
62 tools
74,996 tools/list response characters
74,952 tools-array characters
51,810 input-schema characters
10,885 description characters
per-tool payload: p50 1,082 / p90 2,149 / p95 2,268 / max 3,034'''
new_metrics = '''initialize instructions: 386 characters
62 tools
75,129 tools/list response characters
75,085 tools-array characters
52,105 input-schema characters
10,723 description characters
per-tool payload: p50 1,082 / p90 2,149 / p95 2,268 / max 3,167'''
replace_once("docs/knowledge/implementation-map.md", old_metrics, new_metrics)
replace_once(
    "docs/knowledge/implementation-map.md",
    "raw semantic stress: Top-1 0.5096 / Top-3 0.7981 / Top-8 0.9231 / MRR 0.6652",
    "raw semantic stress: Top-1 0.5096 / Top-3 0.7981 / Top-8 0.9135 / MRR 0.6668",
)
replace_once(
    "docs/knowledge/implementation-map.md",
    "REF    minimal Reference Generator buildability/cross-view route\nDOC    post-P7/reference-generator current-state synchronization",
    "REF    minimal Reference Generator buildability/cross-view route\nPRO-1  professional representation/transform/hierarchy/detail reasoning\nPRO-2  professional-sample authoring-expressiveness validation\nPRO-3  place_cube per-element parent + initial inflate creation completeness\nDOC    current-state synchronization",
)

replace_once(
    "docs/foundation/validation-report.md",
    "**Scope:** current `Local` source, accepted 2026-08-12 Codex + Blockbench functional evidence, completed non-local efficiency hardening, P0–P7 modelling/evaluation contracts, minimal Reference Generator route, and current-state synchronization.",
    "**Scope:** current `Local` source, accepted 2026-08-12 Codex + Blockbench functional evidence, P0–P7 modelling/evaluation contracts, minimal Reference Generator route, professional modelling reasoning, `place_cube` creation completeness, and current-state synchronization.",
)
replace_once("docs/foundation/validation-report.md", old_metrics, new_metrics)
replace_once(
    "docs/foundation/validation-report.md",
    "Top-1 0.5096 / Top-3 0.7981 / Top-8 0.9231 / MRR 0.6652",
    "Top-1 0.5096 / Top-3 0.7981 / Top-8 0.9135 / MRR 0.6668",
)
phase3_section = '''## Professional Modelling / Phase 3 Static Proof

Professional `.bbmodel` samples are learning evidence, not presets or anatomy rules. Current object-agnostic reasoning covers representation choice, transform ownership, primary hierarchy timing, and identity-weighted secondary detail.

Phase 3 extends the existing `place_cube` contract only:

```text
elements[].group   optional exact per-Cube parent override
elements[].inflate optional finite initial Bedrock inflation
```

Top-level `group` remains the compatibility default. All explicit parent references are resolved before `Undo.initEdit`; one missing/ambiguous parent fails before mutation. No new Cube tool, asset profile, geometry planner, rig generator, or professional preset was added.

GitHub CI contract proof: **212 tests / 0 failures**, TypeScript success, default-surface budget success, production build success, and generated-doc freshness success. `place_cube` serialized payload is **3,167 characters**, below the retained **3,200** ceiling.

**Proof status:** source/schema/tests/generated docs are `CURRENT-PROJECT VERIFIED` for repository/CI semantics. Live Blockbench placement, real call reduction, and visual-quality improvement remain `LOCAL PROOF REQUIRED`.

'''
replace_once(
    "docs/foundation/validation-report.md",
    "## Product / Lifecycle / Export\n",
    phase3_section + "## Product / Lifecycle / Export\n",
)
replace_once(
    "docs/foundation/validation-report.md",
    "Current non-local source/contracts are synchronized through **P0–P7 + the minimal Reference Generator route**.",
    "Current non-local source/contracts are synchronized through **P0–P7 + the minimal Reference Generator route + professional modelling Phase 1–3**.",
)
