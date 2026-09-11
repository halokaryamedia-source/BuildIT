# LazyDesigner Player Scale & Sheet Escalation Standard

Updated: 2026-09-11

This document owns two cross-cutting rules for ChatGPT-generated LazyDesigner reference images:

1. **Minecraft player-relative scale anchoring** for all assets.
2. **When one unified reference sheet is sufficient vs when additional sheets are justified.**

These rules complement `image-reference-standard.md` and `image-generation-prompt-contract.md`. They do not replace the approved user brief, explicit dimensions, or visual authority.

## 1. Core Scale Principle

```text
ALL ASSET SIZING
→ ANCHORED TO MINECRAFT PLAYER SCALE
```

When exact numeric dimensions are explicitly provided, those dimensions remain authoritative.

When exact dimensions are not provided, ChatGPT must reason about asset scale relative to a standard Minecraft player-sized humanoid rather than using unanchored language such as `small`, `medium`, `large`, or `fairly tall` by itself.

The goal is consistent world-scale relationships across NPCs, props, furniture, vehicles, machinery, foliage and other assets.

## 2. Authority Order for Scale

```text
1. explicit user-provided numeric dimensions
2. explicit user-provided relative scale requirement
3. approved source/reference evidence when it clearly establishes player relationship
4. canonical player-relative category
5. unresolved → ask a simple question if scale is blocking
```

Never infer precise block dimensions from image pixels alone.

Never override explicit dimensions merely because another proportion looks visually convenient.

## 3. Player-Relative Vocabulary

Use simple canonical categories when exact dimensions are unnecessary or unavailable:

```text
HANDHELD
WEARABLE
BELOW_KNEE
KNEE_HEIGHT
WAIST_HEIGHT
CHEST_HEIGHT
PLAYER_HEIGHT
ABOVE_PLAYER_HEIGHT
RIDEABLE_1P
RIDEABLE_2P
STALL_SCALE
ROOM_SCALE
CUSTOM
```

These categories are semantic scale anchors, not hardcoded block dimensions.

A user-facing question may use natural language instead of exposing the enum.

Examples:

```text
"Ini kira-kira setinggi pinggang player, setinggi player, atau lebih tinggi?"
"Motornya cukup untuk 1 player atau lebih besar?"
"NPC-nya mau setara tinggi player, lebih pendek, atau lebih tinggi?"
```

## 4. Default Profile Interpretation

These are interpretation defaults only when the user has not supplied a conflicting requirement and scale is not otherwise ambiguous.

### HUMANOID

```text
normal adult-like humanoid NPC
→ PLAYER_HEIGHT
```

Do not automatically apply `PLAYER_HEIGHT` to children, giants, dwarfs, stylized nonstandard figures, or explicit custom proportions.

### PROP_FURNITURE

Anchor to plausible player interaction.

Examples:

```text
small stool       → KNEE_HEIGHT
work/sales table  → WAIST_HEIGHT
counter           → WAIST_HEIGHT / CHEST_HEIGHT depending on function
display rack      → CHEST_HEIGHT / ABOVE_PLAYER_HEIGHT depending on target
wearable gear     → WEARABLE
held tool         → HANDHELD
```

### VEHICLE

Anchor to occupancy and interaction.

Examples:

```text
motorcycle / bike → RIDEABLE_1P
small cart        → RIDEABLE_1P
2-seat vehicle    → RIDEABLE_2P
```

Vehicle scale must remain consistent with wheel, cockpit, seat and control relationships.

### MECHANICAL

Anchor to visible function and operator relationship when known.

Do not force machinery into humanoid scale when its intended operating context is clearly larger or smaller.

### PLANT_FOLIAGE

Use player relationship only as a world-scale anchor; do not turn natural variation into a fixed template.

Examples:

```text
grass / tiny flower → BELOW_KNEE or KNEE_HEIGHT
small crop           → KNEE_HEIGHT / WAIST_HEIGHT
bush                 → WAIST_HEIGHT / CHEST_HEIGHT
large decorative plant / tree → CUSTOM or ABOVE_PLAYER_HEIGHT
```

### CREATURE

Use player comparison to communicate world scale but preserve the approved creature body plan.

Do not normalize creature proportions toward humanoid anatomy.

## 5. Requirement Gate — Scale

Scale is `BLOCKING` before generation when a materially different scale would change one or more of:

```text
primary silhouette/proportion
player interaction
occupancy
attachment relationship
vehicle cockpit/seat layout
usable furniture height
animation/contact relationship
major world readability
```

When blocking, ask one simple player-relative question.

Good:

```text
"NPC ini mau setara tinggi player atau lebih tinggi?"
"Kiosnya cukup untuk satu player berdiri di belakang counter atau mau lebih besar?"
"Kendaraannya untuk 1 player atau 2 player?"
```

Avoid asking users for exact block dimensions unless precision is genuinely needed.

## 6. Prompt Compiler Scale Contract

The internal compiled brief should preserve either:

```text
exact confirmed dimensions
```

or:

```text
player-relative scale anchor
```

Recommended internal representation:

```text
scale:
  anchor: PLAYER
  relative: RIDEABLE_1P
  dimensions_blocks: unknown
```

or:

```text
scale:
  anchor: PLAYER
  relative: PLAYER_HEIGHT
  dimensions_blocks:
    height: 2
```

The compiler must not invent exact block values merely because a relative category exists.

## 7. Scale Lock Across Views and Sheets

Once Sheet 01 establishes approved scale, all later views/sheets must preserve:

```text
same whole-asset player relationship
same whole-model proportions
same relative size of major parts
same interaction/occupancy scale
```

This is the **Scale Lock**.

Sheet 02+ may enlarge a detail panel for readability, but the detail itself must not imply a different underlying asset scale.

A material scale change is a revision of the approved target, not an ordinary detail-sheet continuation.

## 8. Scale Visibility Rule

Do **not** add a scale panel by default.

Numeric/player-relative scale normally belongs in `REFERENCE.json` and `GEOMETRY.md`.

Show explicit visual scale evidence only when it materially reduces ambiguity for Astra/Codex.

### Visual scale is useful for:

```text
vehicle occupancy
kiosk / booth / stall
large furniture or environment prop
large machinery
creature whose size relative to player is identity-critical
unusually large/small object with ambiguous world scale
```

### Visual scale is usually unnecessary for:

```text
wearable accessory
handheld tool
small ordinary prop
simple foliage
standard player-height humanoid
```

When visual scale evidence is useful, prefer a compact player silhouette/reference marker rather than a large decorative panel.

The scale marker must be clearly supportive and must not displace more important construction evidence.

## 9. One-Sheet Default

```text
DEFAULT = 1 PRIMARY REFERENCE SHEET
```

Remain on one sheet when all required P1 evidence and useful P2 evidence remain clearly readable.

One sheet is usually sufficient when:

```text
construction views ≤ 4
critical details ≤ 2–3
key poses ≤ 3 when compact
no critical rig/mechanical relationship becomes too small
hero and construction views remain comfortably readable
```

These are practical thresholds, not hard quotas.

## 10. Escalate to Sheet 02 When

Create a second sheet when at least one condition is true:

```text
P1 detail would become too small on Sheet 01
3+ critical detail panels materially compete with construction views
4–5 key poses are required and become unreadable at useful size
rig/deformation guidance requires dedicated readable joint views
complex linkage/mechanical articulation requires its own evidence
multiple motion states materially obscure main identity/construction
important asymmetric/hidden structure cannot fit without shrinking P1 evidence
```

Do not escalate merely because empty space exists or because more detail could be shown.

## 11. Escalate to Sheet 03+ When

Sheet 03+ is justified only when additional **P1/P2** evidence remains necessary after Sheet 02.

Typical valid reasons:

```text
multiple distinct animations requiring separate pose groups
complex creature articulation with separate wing/jaw/tail evidence
large mechanical assembly with several independent high-risk mechanisms
required variant set explicitly requested by user
multiple identity-critical modular configurations
```

Additional sheets must remain bounded to one clear purpose each.

Do not create `extra reference` sheets as general dumping grounds.

## 12. Preferred Multi-Sheet Roles

Use semantic purpose rather than arbitrary numbering alone:

```text
01-main-reference.png
02-detail-rig.png        when structure/rig is the overflow
02-motion-reference.png  when motion is the overflow
02-mechanical-detail.png when mechanism is the overflow
03-variants.png          only when variants are explicitly required
```

Sheet 01 always remains the visual identity and scale anchor.

## 13. Escalation Decision Order

Before creating another sheet:

```text
1. remove P3 content
2. remove lowest-value P2 content
3. remove redundant construction view
4. enlarge remaining P1 evidence
5. if required P1/P2 evidence still does not fit → Sheet 02+
```

Never shrink critical geometry merely to avoid creating a second image.

## 14. Geometry / Texture / Animation Compression

To keep one-sheet usage efficient:

### Geometry

Keep the maximum useful construction evidence. Geometry has first priority.

### Texture

Prefer texture/material identity to remain visible directly in hero/construction views.

Create a dedicated texture/detail panel only for ambiguity that cannot be read reliably otherwise.

### Animation

Compress to key poses, not implementation keys.

```text
simple motion → START / EXTREME / RETURN
common action → READY / ANTICIPATION / CONTACT / FOLLOW_THROUGH / RECOVERY
```

If key poses become too small, move motion to Sheet 02 rather than shrinking Geometry.

## 15. Internal Pre-Generation Checks

Before image generation, confirm:

```text
scale anchor resolved enough for this asset
player-relative relationship does not conflict with explicit dimensions
Sheet 01 panel plan preserves scale relationship
scale marker included only if decision-critical
all P1 panels readable
P2 panels still justify their space
sheet escalation decision completed before generation
```

## 16. Internal Post-Generation Checks

Verify:

```text
asset reads at intended player-relative scale
construction views preserve same apparent scale/proportions
rideable/interactive parts remain plausible relative to player anchor
Sheet 02+ preserves Sheet 01 scale lock
no enlarged detail panel accidentally changes perceived underlying proportion
```

A scale inconsistency across views/sheets is a visual drift defect.

## 17. Package Handoff

`REFERENCE.json` should preserve explicit dimensions and/or the player-relative scale relationship when materially useful.

`GEOMETRY.md` should explain scale briefly enough that Codex does not need to infer world size from the image alone.

Do not require a visual scale marker merely because scale is present in the package.

## Completion Condition

Scale/sheet planning is correct when:

```text
asset world scale is anchored to Minecraft player context
exact dimensions remain authoritative when explicitly supplied
user is asked only when scale materially changes the result
one sheet remains the default
additional sheets exist only for real readability/information overflow
Sheet 01 anchors identity + scale
Sheet 02+ preserves identity lock + scale lock
no decorative scale panel consumes useful evidence
```
