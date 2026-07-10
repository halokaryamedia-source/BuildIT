# Workflow Quick Reference

Start with:

```text
Engine/codex/BOOTSTRAP.md
```

## Startup

1. Open active `state.json`.
2. Validate the approved reference package.
3. Read manifest, Production Context, Reference Visual, and active-stage document.
4. Run one-time preflight.
5. Save persistent start checkpoint.
6. Begin the active stage.

## Stage Order

```text
GEOMETRY
→ GEOMETRY REVIEW
→ TEXTURE
→ TEXTURE REVIEW
→ ANIMATION or SKIP
→ ANIMATION REVIEW when used
→ FINAL VALIDATION
→ FINAL REVIEW
```

## Geometry

- Internal: Primary Form + Structural Detail.
- Initial work may use bounded batches.
- Review only after five standard previews are ready.

## Texture

- Internal: UV + Base Texture + Detail Texture.
- Review only after atlas and model previews are ready.

## Animation

- Run only when required.
- Otherwise record `ANIMATION_SKIPPED`.
- Review clips/samples, pivots, neutral pose, clipping, and ground contact.

## Final Validation

- Execute `VALIDATION.md`.
- Repair at most two local failures.
- Return `PASS`, `REVISION_REQUIRED`, or `BLOCKER`.
- Wait for final user approval or corrections.

## Revision Rule

One issue or tightly related pair per revision cycle.

```text
Stage:
Part:
Issue:
Expected:
Do not change:
```

## Do Not

- repeat full preflight for every edit;
- open every workflow document;
- request approval between internal passes;
- create a new MCP session without a reset reason;
- rebuild accepted areas;
- turn texture details into micro-cubes;
- use PBR/Vibrant Visuals;
- export before Final Validation.

## Status

- `PASS`: ready for user stage approval.
- `REVISION_REQUIRED`: local, named correction required.
- `BLOCKER`: stop and report safe recovery.
- `REFERENCE_CONFLICT`: stop before editing.
