# LazyDesigner Reference Package Load Contract

Updated: 2026-09-11

This document owns how Astra/Codex should consume a ChatGPT-generated LazyDesigner reference package. It does not define Geometry, Texture, Animation, image-generation, or Runtime implementation semantics.

## Objective

Keep package consumption deterministic and small:

```text
REFERENCE.json
→ identify current task/stage/readiness
→ load only the relevant stage Markdown
→ inspect only the image IDs referenced by that stage
→ perform downstream work
```

Do not read every Markdown file and every image by default.

## Canonical Package

```text
asset_reference/
├── REFERENCE.json
├── GEOMETRY.md
├── TEXTURE.md      ← optional
├── ANIMATION.md    ← optional
└── images/
```

`REFERENCE.json` is always the entrypoint.

## Authority Order

```text
1. explicit current user requirement
2. approved visual reference
3. REFERENCE.json structured facts
4. active stage Markdown
5. downstream Codex interpretation
```

Stage Markdown is a projection, not an independent authority.

If a lower authority conflicts with a higher authority, do not silently merge them. Treat the affected decision as conflicting and stop only the dependent work.

## Load Order

### Geometry

```text
1. REFERENCE.json
2. GEOMETRY.md
3. only image IDs referenced by GEOMETRY.md
4. downstream LazyDesigner Modelling Skill / selected profile
```

Do not load `TEXTURE.md` or `ANIMATION.md` unless a specific Geometry decision explicitly depends on information owned there.

### Texture

```text
1. REFERENCE.json
2. TEXTURE.md when present
3. only image IDs referenced by TEXTURE.md
4. current approved Geometry/UV state from downstream authoring environment
5. LazyDesigner Texturing Skill
```

Do not reload full Geometry reference prose merely because the asset has Geometry. Geometry facts needed by Texturing should already be represented through stable semantic IDs, mapped state, or bounded references.

### Animation

```text
1. REFERENCE.json
2. ANIMATION.md when present
3. only image IDs referenced by ANIMATION.md
4. current approved rig/hierarchy/pivot state from downstream authoring environment
5. LazyDesigner Animation Skill
```

Do not load `TEXTURE.md` unless material/effect appearance materially changes motion interpretation.

## Stage Skip Rule

A stage document may be absent when it does not materially improve downstream correctness.

Examples:

```text
simple solid-color prop
→ TEXTURE.md may be absent

known simple rigid mechanical loop
→ ANIMATION.md may be absent if REFERENCE.json already carries enough explicit motion fact

static asset
→ ANIMATION.md absent and readiness.animation = NOT_REQUIRED
```

Missing optional stage document is not an error when `REFERENCE.json` records the stage appropriately.

## Image Loading Rule

Images are loaded by semantic ID, not by scanning the whole `images/` folder.

Example:

```text
GEOMETRY.md
→ IMG_GEO_01
→ IMG_RIG_01
```

Codex should inspect those first. Additional images are loaded only if a specific unresolved decision requires them.

This prevents image-heavy packages from becoming automatic context overhead.

## Cross-Stage Leakage Rule

Each stage document owns only its domain interpretation:

```text
GEOMETRY.md
→ form / proportion / topology / representation / rig-readiness

TEXTURE.md
→ materials / colors / markings / surface / alpha / emissive / PBR

ANIMATION.md
→ participants / motion relationships / poses / timing / contact / deformation
```

If a fact belongs to multiple stages, `REFERENCE.json` owns the stable cross-stage fact and each Markdown file may contain only the stage-specific consequence.

Example:

```text
REFERENCE.json
part: right_hand owns tool

GEOMETRY.md
→ tool must be structurally attached to right_hand

ANIMATION.md
→ tool must remain attached to right_hand throughout the clip
```

This is not duplicate authority; it is one fact with two stage-specific consequences.

## Unknown / Blocker Rule

`REFERENCE.json` owns the canonical unknown inventory.

Stage Markdown may repeat only the unknowns relevant to that stage.

```text
texture-only unknown
→ must not appear as Geometry blocker

rig blocker
→ may block Animation while Texture remains READY
```

Do not promote a non-blocking unknown into a blocker merely because a stage document mentions it.

## Correction / Delta Load

For a bounded correction:

```text
REFERENCE.json
→ identify changed fact / affected stage
→ load only affected stage Markdown
→ load only affected image IDs
→ preserve unaffected accepted package content
```

Do not reread the entire package for a local correction unless the change invalidates whole-asset identity or multiple stage authorities.

## Package Consistency Gate

Before handoff, ChatGPT should ensure:

```text
all listed documents exist
all referenced image IDs exist
all stage files agree with REFERENCE.json
no stage file introduces unsupported facts
no stage file contains another stage's implementation plan
readiness values match blockers
optional omitted files are not referenced
```

A package failing these checks is not ready for Codex.

## Minimal Consumption Principle

The intended downstream behavior is:

```text
ORIENT ONCE
→ LOAD ACTIVE STAGE
→ LOAD REFERENCED EVIDENCE
→ WORK
```

Not:

```text
READ EVERYTHING
→ REINTERPRET EVERYTHING
→ WORK
```

The goal is minimum context required for the next correct decision, not minimum context at the expense of fidelity.

## Completion Condition

This contract is satisfied when Astra/Codex can determine:

```text
where to start
which stage file to read
which images to inspect
which files can be ignored for the current stage
how authority conflicts are handled
how corrections stay bounded
```

without relying on the original ChatGPT conversation.