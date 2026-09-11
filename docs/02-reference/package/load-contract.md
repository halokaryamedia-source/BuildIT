# LazyDesigner Reference Package Load Contract

Updated: 2026-09-11

This document owns how Astra/Codex consumes a ChatGPT-generated LazyDesigner reference package. It does not define Geometry, Texture, Animation, image-generation, or Runtime implementation semantics.

## Objective

Keep package consumption deterministic and small:

```text
REFERENCE.json
→ identify task / active stage / readiness
→ load active stage Markdown when present
→ load only stage-relevant image IDs
→ load current downstream authoring state
→ work
```

Do not read every Markdown file or every image by default.

## Entry Point

`REFERENCE.json` is always the package entry point.

Canonical package:

```text
asset_reference/
├── REFERENCE.json
├── GEOMETRY.md
├── TEXTURE.md      ← optional
├── ANIMATION.md    ← optional
└── images/
```

## Authority Order

```text
explicit current user requirement
→ approved visual reference
→ confirmed scale requirement
→ REFERENCE.json structured facts
→ active stage Markdown
→ downstream interpretation
```

A lower authority never silently overrides a higher authority. Block only the dependent decision when a material conflict exists.

## Stage Load Order

### Geometry

```text
1. REFERENCE.json
2. GEOMETRY.md when present
3. Geometry image IDs referenced by GEOMETRY.md
   OR images.used_by includes GEOMETRY when GEOMETRY.md is absent
4. current asset Geometry state when continuing/correcting
5. LazyDesigner Modelling Skill + exactly one selected profile when useful
```

Do not load `TEXTURE.md` or `ANIMATION.md` merely because they exist.

### Texture

```text
1. REFERENCE.json
2. TEXTURE.md when present
3. Texture image IDs referenced by TEXTURE.md
   OR images.used_by includes TEXTURE when TEXTURE.md is absent
4. current approved Geometry/UV state
5. LazyDesigner Texturing Skill
```

Do not reload full Geometry prose. Stable Geometry facts needed by Texture should arrive through semantic IDs/current mapped state.

### Animation

```text
1. REFERENCE.json
2. ANIMATION.md when present
3. Animation image IDs referenced by ANIMATION.md
   OR images.used_by includes ANIMATION when ANIMATION.md is absent
4. current approved rig/hierarchy/pivot state
5. LazyDesigner Animation Skill
```

Do not load unrelated Texture or full modelling-profile prose.

## Optional Stage Document Rule

A stage Markdown file may be absent when it would not materially improve correctness.

Examples:

```text
simple prop with obvious material
→ TEXTURE.md may be absent

simple explicit rigid mechanical loop
→ ANIMATION.md may be absent

static asset
→ ANIMATION.md absent + readiness.animation = NOT_REQUIRED
```

When a stage file is absent, `REFERENCE.json` remains sufficient orientation through stable facts, `images.used_by`, unknowns, and readiness.

Missing optional Markdown is not an error.

## Image Loading Rule

Never scan `images/` blindly.

Preferred image resolution:

```text
stage Markdown image IDs
→ if stage Markdown absent, REFERENCE.json images.used_by
→ additional image only for a specific unresolved decision
```

`images.used_by` vocabulary:

```text
GEOMETRY | TEXTURE | ANIMATION
```

An image may support multiple stages without being duplicated.

## Scale Loading Rule

Use scale directly from `REFERENCE.json.requirements`:

```text
dimensions_blocks
player_relative_scale
```

Numeric dimensions are numeric authority. Player-relative scale communicates world/interactivity relationship. If they materially conflict, block the dependent stage instead of inventing a reconciliation.

Do not infer world scale from image size when package scale authority already exists.

## Cross-Stage Leakage Rule

```text
GEOMETRY.md
→ form / proportion / topology / representation / rig-readiness

TEXTURE.md
→ materials / colors / markings / surface / alpha / emissive / PBR

ANIMATION.md
→ participants / motion / poses / timing / contact / deformation
```

Stable facts shared across stages belong in `REFERENCE.json`; Markdown contains only stage-specific consequences.

Example:

```text
REFERENCE.json
→ right_hand owns tool

GEOMETRY.md
→ tool structurally attaches to right_hand

ANIMATION.md
→ tool remains attached during motion
```

This is one fact with separate stage consequences, not duplicate authority.

## Unknown / Blocker Rule

`REFERENCE.json` owns the canonical unknown inventory.

Stage Markdown repeats only stage-relevant consequences.

```text
Texture-only unknown
→ does not block Geometry

rig blocker
→ may block Animation while Texture remains READY
```

Do not promote a non-blocking unknown simply because a stage document mentions it.

## Correction / Delta Load

For bounded corrections:

```text
REFERENCE.json
→ identify changed fact + affected stage(s)
→ load affected stage Markdown only
→ load affected image IDs only
→ load current affected asset state
→ preserve unaffected accepted context
```

Do not reread the entire package unless the change invalidates whole-asset identity, scale, or multiple stage authorities.

## Package Consistency Gate

Before handoff, ChatGPT verifies:

```text
all listed documents exist
all image IDs/paths resolve
images.used_by uses valid stages
stage files agree with REFERENCE.json
no stage file introduces unsupported facts
no stage file compensates for another stage's defect
numeric/player-relative scale do not conflict
readiness matches blockers
omitted optional files are not referenced
```

A failing package is not ready for Codex.

## Minimal Consumption Principle

```text
ORIENT ONCE
→ LOAD ACTIVE STAGE
→ LOAD RELEVANT EVIDENCE
→ WORK
```

Not:

```text
READ EVERYTHING
→ REINTERPRET EVERYTHING
→ WORK
```

The goal is minimum sufficient context, not minimum context at the expense of fidelity.

## Completion

This contract is satisfied when Astra/Codex can determine where to start, which stage file is relevant, which images matter even when a stage file is omitted, what scale authority exists, what can be ignored, and how corrections remain bounded—without using the original ChatGPT transcript.