# Pixel Art Prompt Contract

## Purpose

Normalize pixel-art requests into the smallest production-useful intent packet without turning prompting into a ceremony.

The contract preserves user intent, reference identity, grid constraints, and revision boundaries before authoring.

## Minimum Intent Packet

Resolve only fields that materially affect the result:

```text
SUBJECT
ARTIFACT_CLASS
TARGET_USE
TARGET_MODE
GRID_OR_SIZE_CONSTRAINT
PROJECTION
BACKGROUND_ALPHA
REFERENCE_EVIDENCE
STYLE_LOCK
ANIMATION_CONTRACT
PRESERVE
CHANGE
OUTPUT_FORM
```

Not every field must be explicit. Omit fields that are not relevant.

## Authority Order

Resolve each field from:

```text
explicit current user instruction
→ supplied reference evidence
→ accepted style-lock / existing asset set
→ canonical Pixel Art rules
→ conservative reversible provisional choice
```

Do not infer a hard requirement from a provisional choice.

## Blocking vs Provisional

Ask only when an unknown can materially alter identity, compatibility, or required output structure.

Potential blockers:

- exact required dimensions imposed by a target format;
- materially conflicting source/reference identity;
- sprite-sheet layout required but frame contract is unknown;
- target style explicitly depends on an unavailable accepted asset/style lock;
- requested revision cannot identify which element must change vs remain fixed;
- an external engine/UI contract requires a specific alpha, anchor, or frame convention that is unknown.

Usually provisional:

- precise palette shades when no authoritative palette exists;
- minor light direction when no Style Lock exists;
- bounded padding adjustments;
- secondary texture/detail density;
- minor material highlight placement.

## New Asset Normalization

Example:

```text
user: "buat icon sekop pixel art untuk game Minecraft style"

SUBJECT            = shovel
ARTIFACT_CLASS     = ICON
TARGET_USE         = game icon
TARGET_MODE        = MINECRAFT_NATIVE
GRID_OR_SIZE       = unresolved, choose lowest viable provisional icon tier
PROJECTION         = ITEM_ICON unless evidence requires otherwise
BACKGROUND_ALPHA   = transparent unless target contradicts
REFERENCE_EVIDENCE = none
STYLE_LOCK         = none
OUTPUT_FORM        = standalone asset
```

Do not invent extra decorative features merely because the brief is short.

## Reference Conversion Normalization

For user-supplied imagery:

```text
SUBJECT
→ what must remain recognizable

REFERENCE_EVIDENCE
→ visible identity, proportion, color/material relationships

TARGET_MODE
→ how aggressively photographic complexity should be abstracted

GRID_OR_SIZE
→ target pixel budget

PRESERVE
→ identity-critical landmarks and supported relationships

CHANGE
→ requested stylization, simplification, cleanup, or target-mode conversion
```

The source image is evidence, not a bitmap that should simply be resized/pixelated.

## Revision Contract

Every bounded revision should resolve:

```text
CHANGE
PRESERVE
```

Example:

```text
CHANGE
- bottle liquid from yellow to blue
- simplify highlight clusters

PRESERVE
- bottle silhouette
- canvas size
- projection
- existing Style Lock
- transparent background
```

If a requested change does not invalidate an existing field, preserve that field by default.

Do not redesign unrelated regions during a bounded correction.

## Series / Style-Lock Contract

When the asset belongs to an existing set:

```text
STYLE_LOCK = existing style_lock_id
```

Load only the fields needed for the current asset. A subject-specific exception does not automatically create a new style family.

## Animation Contract

For sprite animation, resolve only what changes frame construction:

```text
frame count or timing target when constrained
loop / one-shot intent
key action or motion
anchor/alignment convention when required
frame output form: ordered frames | sprite sheet
```

Do not infer engine-specific packing rules without evidence.

## Output Form

Resolve the lowest sufficient delivery form:

```text
single transparent image
ordered frames
sprite sheet
seamless tile
texture reference
revision of existing asset
compact downstream handoff
```

Do not create package metadata or composite sheets unless requested or required by the target.

## Natural-Language Classification Examples

```text
"buat icon sekop pixel art"
→ ICON

"buat botol bensin seperti gambar ini, pixel style Minecraft"
→ OBJECT / PROP + reference conversion + MINECRAFT_NATIVE

"buat sprite kucing jalan 6 frame"
→ SPRITE + animation

"buat pattern bata pixel yang seamless"
→ TILE / PATTERN

"buat konsep texture pixel untuk model ini"
→ TEXTURE_REFERENCE

"ubah hanya warna cairannya, bentuk jangan berubah"
→ AUDIT / REVISION
→ CHANGE=color
→ PRESERVE=silhouette/proportion/other accepted identity
```

## Context Economy

Compile the request into the smallest owner bundle.

```text
intent packet
+ Pixel Art Skill
+ one primary owner
+ one conditional dependency only when material
→ author
```

Do not include every Pixel Art document, prior prompt, or full conversation history in each task.
