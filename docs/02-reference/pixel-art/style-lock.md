# Pixel Art Style Lock

## Purpose

Keep a series of pixel-art assets visually coherent without forcing every subject into identical geometry or literal palette values.

Style Lock is a compact reusable visual contract, not a prompt archive or a second project-state system.

## Identity

Each established set may use one stable `style_lock_id`.

```text
style_lock_id
→ identifies one visual grammar
→ reused across related assets
→ changes only when the shared grammar materially changes
```

Do not create a new ID for ordinary subject-specific exceptions or revisions that preserve the same family grammar.

## Canonical Profile Shape

Keep only decision-relevant fields.

### Core fields

```text
style_lock_id
canvas_or_target_grid
visible_pixel_scale
subject_occupancy
projection_family
outline_treatment
palette_relationship
light_direction
contrast_range
cluster_density
shadow_language
material_highlight_language
alpha_background_convention
```

### Optional fields

Use only when the set actually requires them:

```text
shared_padding_rule
shared_anchor_rule
shared_emissive_language
shared_animation_timing_language
shared_material_exception_rules
```

Do not add fields merely because they are measurable.

## Field Authority

Each field should preserve its authority class when material:

```text
USER_REQUIREMENT
REFERENCE_SUPPORTED
EXISTING_STYLE_SUPPORTED
PROVISIONAL
```

If a field is provisional, it may guide a first pass but must not be presented as approved project truth.

## Establishing a Profile

Resolve fields in this order:

1. explicit current user instruction;
2. accepted existing asset set;
3. clearly dominant project convention;
4. conservative provisional choice.

Do not average conflicting accepted examples silently. If two existing assets imply materially different grammar, determine whether they are separate style families rather than creating a vague hybrid profile.

## Compactness Rule

Style Lock must not contain:

```text
full source prompt
full image/reference corpus
conversation history
per-pixel coordinates
complete palette dumps unless exact palette reuse is authoritative
UV coordinates
Blockbench texture UUIDs
particle runtime behavior
revision diary
```

Those belong to their actual owners or are transient working context.

## Reuse

For a subsequent asset in the same set:

```text
current subject requirement
+ style_lock_id
+ only style fields that can change the decision
→ author new asset
```

Do not retransmit the entire Pixel Art corpus or all prior assets when the compact profile plus one representative accepted asset is sufficient.

## Subject-Specific Exceptions

An exception is valid when required for recognizability, transparency, material behavior, or functional readability.

Example:

```text
family = selective outline
→ glass bottle reduces interior outline
→ transparency remains readable
→ style_lock_id remains unchanged
```

Record only the local exception that materially affects the asset. Do not mutate the shared profile for a one-off subject requirement.

## Drift Detection

Treat these as likely style drift when unsupported:

- changed implicit pixel scale;
- inconsistent canvas occupancy;
- switching full/selective/no outline without material reason;
- conflicting light direction;
- substantially different contrast range;
- projection family changing between comparable icons;
- one asset using micro-noise while the set uses clean clusters;
- arbitrary palette expansion;
- inconsistent padding or anchor behavior in a UI/icon set;
- materially different shadow/highlight grammar for the same material family.

## Profile Update

When the user intentionally changes the shared style direction:

```text
identify changed shared fields
→ update Style Lock once
→ preserve unchanged fields
→ propagate only where required
```

Do not re-author unaffected assets merely because profile metadata changed.

A major change that intentionally creates a separate visual family should receive a new `style_lock_id`; a bounded correction within the same grammar should not.

## Downstream Handoff

Pass only `style_lock_id` plus fields that can affect the next owner.

Examples:

```text
Texturing
→ visible pixel scale, palette relationship, light/shadow language, alpha convention

Particle texture
→ visible pixel scale, palette/emissive language, alpha convention, frame language when animated
```

Downstream owners do not need the full Style Lock when only a subset changes their decision.
