# Bedrock Model Production Workflow

This is the short production overview for the Rework branch.

Primary operational entry:

```text
Engine/codex/BOOTSTRAP.md
```

Runtime authority:

```text
SavedData/sessions/<asset>/state.json
```

## Approved Reference Package

```text
PRODUCTION_CONTEXT.md
<asset>_reference_visual.png
GEOMETRY.md
TEXTURING.md
ANIMATION.md
VALIDATION.md
reference_manifest.json
CODEX_REFERENCE_HANDOFF.md
```

New sessions do not require legacy numbered reference sheets.

## User-Visible Flow

```text
Reference Intake + One-Time Preflight
→ Geometry
→ Geometry Review
→ Texture
→ Texture Review
→ Animation Review when required, otherwise skip
→ Final Validation
→ Final Review
→ Done
```

Internal technical passes remain explicit but do not create separate user approvals.

## 0. Reference Intake and Preflight

Goal: prove the package and runtime are ready before the first Blockbench write.

Required:

- package files exist and manifest is valid;
- Production Context and Reference Visual identify one clear target;
- Geometry, Texturing, Animation, and Validation documents do not conflict materially;
- Animation requirement is explicit;
- `state.json` exists;
- one active project/session owner is clear;
- MCP endpoint and active-stage tools are available;
- project UUID, format, UV mode, and texture dimensions are recorded;
- manual edits to preserve are recorded;
- persistent session-start checkpoint is created.

No user approval is required when intake and preflight pass.

Stop only for `REFERENCE_CONFLICT` or a runtime `BLOCKER`.

## 1. Geometry

Internal passes:

```text
Primary Form
→ Structural Detail
```

Goal: produce the complete approved physical form before texture work.

Allowed:

- scale envelope;
- primary and silhouette-critical masses;
- ground-contact parts;
- hierarchy and attachments;
- rotations that improve approved form;
- bounded multi-part initial construction;
- structural detail that texture cannot represent;
- placeholder/untextured geometry.

Forbidden:

- UV packing;
- texture painting;
- decorative micro-cubes;
- geometry used only for color, seams, scratches, bands, or tiny trim;
- animation clips;
- final export.

Review output:

- persistent Geometry review checkpoint;
- Front, Left Side, Back, Top / Footprint, and Front-left 3/4;
- dimensions, hierarchy, ground-contact, and cube report;
- `PASS`, `REVISION_REQUIRED`, or `BLOCKER`.

After approval, save the approved Geometry checkpoint and protect accepted areas.

## 2. Texture

Internal passes:

```text
UV
→ Base Texture
→ Detail Texture
```

Goal: produce the approved Classic Bedrock texture and UV result without interrupting the user between internal passes.

Allowed:

- approved atlas setup;
- per-face/Box UV according to `TEXTURING.md`;
- safe shared/mirrored UV;
- unique directional areas where required;
- base material zones;
- stepped shading;
- focal detail;
- local seam and palette corrections.

Forbidden:

- broad Geometry redesign;
- geometry used to solve pixel-level detail;
- PBR or Vibrant Visuals;
- Animation work;
- extra texture files or larger atlas without approved need.

Review output:

- persistent Texture review checkpoint;
- texture atlas;
- Front, Left Side, Back, and Front-left 3/4;
- UV/material report;
- `PASS`, `REVISION_REQUIRED`, or `BLOCKER`.

After approval, save the approved Texture checkpoint and protect accepted areas.

## 3. Animation — Optional

Run only when the manifest or `ANIMATION.md` requires at least one animation family or interactive motion.

When not required:

```text
ANIMATION_SKIPPED
```

Do not create optional animation merely for completeness.

When required, allowed work includes:

- approved hierarchy and pivots;
- required clips or sampled motion;
- neutral-pose recovery;
- ground-contact and clipping correction.

Forbidden:

- changing approved Geometry or Texture silently;
- unrequested clips;
- broad rig redesign beyond the approved motion contract.

Review output:

- persistent Animation review checkpoint;
- hierarchy/pivot summary;
- neutral pose;
- required clips or representative samples;
- clipping/ground-contact result.

## 4. Final Validation

Goal: prove the final candidate matches all approved authorities and is ready for user acceptance.

Validate:

- final `.bbmodel` and textures;
- five standard views;
- Reference Visual match;
- Geometry contract;
- Texturing contract;
- Animation contract or skip;
- Blockbench validator;
- naming and export readiness;
- completed `VALIDATION.md`.

Codex may fix at most two clearly local validation failures automatically.

Broad failure returns to Geometry, Texture, or Animation review. Final Validation cannot add new features or perform broad polish.

Review output:

- final candidate `.bbmodel`;
- textures;
- five final views and atlas;
- completed validation report;
- animation evidence when applicable;
- concise revision summary;
- `PASS`, `REVISION_REQUIRED`, or `BLOCKER`.

User approval changes state to `DONE`.

## Revision Rule

Initial stage construction may use bounded multi-part batches.

Revision cycles use:

```text
one named issue or one tightly related issue pair
```

Each revision records:

- stage;
- part;
- issue;
- expected result;
- accepted areas to preserve;
- reference;
- verification;
- rollback checkpoint.

Do not rebuild accepted work unless the relevant earlier stage is explicitly reopened.

## Global Efficiency Rules

- OpenSpec remembers goal, boundaries, decisions, and acceptance criteria.
- Ponytail selects the smallest complete safe action needed now.
- Run the full preflight once; re-run only stale checks.
- Use the active-stage document and tool profile only.
- Capture screenshots at review gates or after meaningful revision batches.
- Prefer bounded initial batches over one MCP call per cube.
- Prefer focused evidence over large data dumps.
- Use texture for minor surface detail.
- Stop when the active stage acceptance criteria are met.
- CI and integration remain deferred until Rework is intentionally ready for final verification.
