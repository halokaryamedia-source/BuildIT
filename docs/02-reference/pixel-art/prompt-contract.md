# Pixel Art Prompt Contract

## Purpose

Normalize pixel-art requests into the smallest production-useful intent packet without turning prompting into a ceremony.

The contract preserves user intent, reference identity, grid constraints, target family, and revision boundaries before authoring.

## Minimum Intent Packet

Resolve only fields that materially affect the result:

```text
SUBJECT
ARTIFACT_CLASS
TARGET_USE
TARGET_MODE
MINECRAFT_FAMILY
GRID_OR_SIZE_CONSTRAINT
PROJECTION
BACKGROUND_ALPHA
REFERENCE_EVIDENCE
STYLE_LOCK
ARTIST_PRIORITY
ANIMATION_CONTRACT
PRESERVE
CHANGE
OUTPUT_FORM
```

Not every field must be explicit. Omit irrelevant fields.

## Authority Order

Resolve each field from:

```text
explicit current user instruction
→ supplied reference evidence
→ accepted Style Lock / existing asset set
→ canonical Pixel Art rules
→ conservative reversible provisional choice
```

Never promote a provisional choice into a hard requirement.

## Artist Priority

When the brief is short, preserve the default professional hierarchy:

```text
READABILITY
> FORM
> IDENTITY
> MATERIAL
> STYLE CONSISTENCY
> DETAIL
> DECORATION
```

If the user explicitly prioritizes something else (for example exact logo fidelity or intentionally ornate detail), preserve that override.

## Blocking vs Provisional

Ask only when an unknown can materially alter identity, compatibility, or required output structure.

Potential blockers:
- externally required exact dimensions;
- materially conflicting source/reference identity;
- sprite-sheet layout required but frame contract unknown;
- target style depends on an unavailable accepted asset/Style Lock;
- revision cannot identify CHANGE vs PRESERVE;
- external engine/UI contract requires unknown alpha/anchor/frame convention;
- Minecraft target is specified but the family (item/block/entity/GUI/particle) materially changes the output and cannot be inferred from use.

Usually provisional:
- exact shades without an authoritative palette;
- minor light direction without a Style Lock;
- bounded padding;
- secondary detail density;
- minor highlight placement.

## New Asset Normalization

Example:

```text
user: "buat icon sekop pixel art untuk game Minecraft style"

SUBJECT            = shovel
ARTIFACT_CLASS     = ICON
TARGET_USE         = game item/icon
TARGET_MODE        = MINECRAFT_NATIVE
MINECRAFT_FAMILY   = ITEM ICON
GRID_OR_SIZE       = unresolved, choose lowest viable provisional tier
PROJECTION         = ITEM_ICON unless evidence requires otherwise
BACKGROUND_ALPHA   = transparent unless target contradicts
REFERENCE_EVIDENCE = none
STYLE_LOCK         = none
ARTIST_PRIORITY    = default professional hierarchy
OUTPUT_FORM        = standalone asset
```

Do not add decoration merely because the brief is short.

## Reference Conversion Normalization

For user-supplied imagery, resolve:

```text
SUBJECT
→ what must remain recognizable

REFERENCE_EVIDENCE
→ invariant identity vs supporting vs incidental detail

TARGET_MODE / MINECRAFT_FAMILY
→ required abstraction language

GRID_OR_SIZE
→ pixel budget

PRESERVE
→ silhouette, proportion hierarchy, landmarks, negative spaces,
  identity color/markings, supported material relationships

CHANGE
→ requested stylization, simplification, cleanup, target-family conversion
```

The source image is evidence, not a bitmap to resize/pixelate.

## Style Extraction

When the user provides an existing pixel-art asset as a style reference, extract grammar rather than copying subject detail:

```text
visible pixel scale
occupancy
projection
edge / outline language
palette-ramp behavior
contrast hierarchy
cluster density / shape language
light direction
shadow/highlight grammar
accent priority
simplification level
alpha convention
```

Use these fields to establish/reuse a Style Lock.

Do not infer unrelated subject geometry, markings, or material identity from the style reference.

## Revision Contract

Every bounded revision resolves:

```text
CHANGE
PRESERVE
```

Example:

```text
CHANGE
- bottle liquid yellow → blue
- simplify highlight cluster

PRESERVE
- bottle silhouette
- canvas/grid
- projection
- Style Lock
- material grammar
- transparent background
```

If a change does not invalidate a field, preserve it by default. Do not redesign unrelated regions during correction.

## Series / Style-Lock Contract

When an asset belongs to an existing set:

```text
STYLE_LOCK = existing style_lock_id
```

Load only decision-relevant fields and at most one representative accepted asset when visual calibration is needed.

A subject-specific exception does not automatically create a new visual family.

## Minecraft Family Resolution

When `TARGET_MODE` is Minecraft-facing, resolve actual family when it matters:

```text
ITEM_ICON
BLOCK_TEXTURE
ENTITY_SKIN_TEXTURE
GUI_SYMBOL
PARTICLE_TEXTURE
REFERENCE_ONLY_PIXEL_ART
```

Do not use one generic Minecraft prompt for all families.

## Animation Contract

For sprite animation, resolve only what changes frame construction:

```text
frame count/timing when constrained
loop / one-shot intent
key action or motion
anchor/alignment when required
frame output: ordered frames | sprite sheet
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

Do not create package metadata or composite sheets unless requested/required.

## Natural-Language Classification Examples

```text
"buat icon sekop pixel art"
→ ICON

"buat botol bensin seperti gambar ini, pixel style Minecraft"
→ OBJECT / PROP + reference conversion + MINECRAFT_NATIVE
→ family resolved from intended use when material

"buat sprite kucing jalan 6 frame"
→ SPRITE + animation

"buat pattern bata pixel yang seamless"
→ TILE / PATTERN

"buat konsep texture pixel untuk model ini"
→ TEXTURE_REFERENCE

"ubah hanya warna cairannya, bentuk jangan berubah"
→ AUDIT / REVISION
→ CHANGE=color
→ PRESERVE=silhouette/proportion/style/other accepted identity
```

## Context Economy

Compile into the smallest owner bundle:

```text
intent packet
+ Pixel Art Skill
+ one primary owner
+ one conditional dependency only when material
→ author
```

Do not include every Pixel Art document, prior prompt, or full conversation history in each task.
