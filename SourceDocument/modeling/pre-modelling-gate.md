# Pre-Modelling Gate

Use this after the reference package is approved and before any Blockbench edit.

## Required Inputs

- Asset brief is clear: target, function, scale, style, animation need, atlas target, and texture style.
- Reference package exists.
- `REFERENCE_PLAN.md` exists.
- `CODEX_REFERENCE_HANDOFF.md` exists.
- `reference_manifest.json` is valid.
- Required sheets 01-07 have matching `.notes.md`.
- Sheet 08 is present or marked not required.
- Reference package matches the target asset from the brief.
- User approved the reference package.

## Gate Checks

| Check | Status |
| --- | --- |
| Scale is locked | PASS / BLOCKER |
| Front direction is locked | PASS / BLOCKER |
| Geometry-level parts are listed | PASS / BLOCKER |
| Texture-only details are listed | PASS / BLOCKER |
| Atlas target is locked | PASS / BLOCKER |
| Texture style is locked | PASS / BLOCKER |
| Main Geometry build order is clear | PASS / BLOCKER |
| Attachment/pivot risks are noted | PASS / BLOCKER |
| Reference package matches the brief | PASS / BLOCKER |
| Reference package is approved | PASS / BLOCKER |
| User approved Main Geometry start | PASS / BLOCKER |

## Main Geometry Start Rule

Start Main Geometry only when every gate check is `PASS`.

If any check is `BLOCKER`, fix the reference package or ask the user before opening Blockbench.

## Codex First Action

```text
Read CODEX_REFERENCE_HANDOFF.md, reference_manifest.json, and the notes for Sheets 01-04 and 07. Use Sheets 05-06 only to avoid texture/detail mistakes. Do not begin UV or texturing during Main Geometry.
```
