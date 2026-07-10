# Per-Asset Session Workspace

Each asset uses:

```text
SavedData/sessions/<asset>/
├─ state.json
├─ references/
│  ├─ PRODUCTION_CONTEXT.md
│  ├─ <asset>_reference_visual.png
│  ├─ GEOMETRY.md
│  ├─ TEXTURING.md
│  ├─ ANIMATION.md
│  ├─ VALIDATION.md
│  ├─ reference_manifest.json
│  └─ CODEX_REFERENCE_HANDOFF.md
├─ checkpoints/
│  ├─ 00_session_start.bbmodel
│  ├─ 10_geometry_review.bbmodel
│  ├─ 20_texture_review.bbmodel
│  ├─ 30_animation_review.bbmodel
│  └─ 40_validation_pass.bbmodel
├─ evidence/
│  ├─ geometry/
│  ├─ texture/
│  ├─ animation/
│  └─ final/
├─ reports/
│  ├─ preflight.json
│  └─ validation.json
└─ final/
   ├─ <asset>.bbmodel
   └─ textures/
```

## Runtime Authority

`state.json` is authoritative.

`session.md`, `session-lock.md`, and `ACTIVE_PROJECT.md` are optional human-readable summaries and must not contradict it.

## Stage Evidence

- Geometry: five standard views.
- Texture: atlas, UV summary, and model previews.
- Animation: pivots/hierarchy and required clips/samples when used.
- Final: completed validation and final evidence.

## Cleanup Rule

Temporary screenshots and experiments belong in `SavedData/cache/`, not in the approved evidence or final folders.
