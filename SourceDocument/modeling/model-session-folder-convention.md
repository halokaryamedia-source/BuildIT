# Model Session Folder Convention

Use one self-contained runtime workspace per asset.

## Folder Layout

```text
SavedData/sessions/<asset>/
├─ state.json
├─ session.md                 # optional human summary
├─ session-lock.md            # compact lock mirror
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

## Naming

```text
<asset> = lowercase_snake_case
```

Examples:

```text
SavedData/sessions/kangaroo/
SavedData/sessions/samurai_guard/
SavedData/sessions/sound_truck/
```

## Authority

- `state.json`: runtime authority.
- `session.md`: optional summary generated from state when useful.
- `session-lock.md`: session ownership mirror; cannot override state.
- `references/`: approved immutable input package unless the reference stage is reopened.
- `checkpoints/`: persistent recovery states.
- `evidence/`: approved stage-review evidence.
- `reports/`: machine-readable preflight and validation outputs.
- `final/`: only final accepted model and textures.

## Evidence Filenames

Recommended stable names:

```text
geometry/front.png
geometry/left_side.png
geometry/back.png
geometry/top_footprint.png
geometry/front_left_3_4.png

texture/atlas.png
texture/front.png
texture/left_side.png
texture/back.png
texture/front_left_3_4.png

animation/hierarchy.json
animation/pivots.json
animation/neutral_pose.png
animation/<clip_name>.<ext>

final/front.png
final/left_side.png
final/back.png
final/top_footprint.png
final/front_left_3_4.png
```

Do not add timestamps or version suffixes to approved filenames. Store prior review cycles in a clearly named archive subfolder only when history is required.

## Temporary Files

Use:

```text
SavedData/cache/<asset>/
```

for:

- failed screenshots;
- experiments;
- temporary exports;
- diagnostic data dumps.

Do not mix temporary files with approved evidence or final output.

## Session Creation

For a new asset:

1. create the folder structure;
2. copy the approved reference package into `references/`;
3. create `state.json` from `Engine/codex/state.template.json`;
4. create a lock only after session/project verification;
5. save `00_session_start.bbmodel` before the first meaningful write;
6. update state with reference paths, project UUID, stage, and checkpoint.

## Cleanup

- Keep approved stage evidence.
- Remove or move failed attempts to cache after resolution.
- Keep one final accepted model package.
- Do not retain redundant reports that duplicate `state.json`.

## Acceptance Criteria

- Each asset has one clear runtime workspace.
- New sessions recover from governance, OpenSpec, state, references, and the active-stage document.
- Runtime state is not fragmented across competing Markdown files.
- Checkpoints and evidence are stable and stage-specific.
