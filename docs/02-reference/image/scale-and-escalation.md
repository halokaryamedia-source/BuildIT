# LazyDesigner Player Scale & Sheet Escalation Standard

Updated: 2026-09-11

This document owns two cross-cutting rules for ChatGPT-generated LazyDesigner reference images:

1. **Minecraft player-relative scale anchoring** for all assets.
2. **When one unified reference sheet is sufficient vs when additional sheets are justified.**

These rules complement `standard.md` and `prompt-contract.md`. They do not replace explicit user dimensions, the approved brief, or visual authority.

## 1. Core Scale Principle

```text
ALL ASSET SIZING
→ ANCHORED TO MINECRAFT PLAYER/WORLD SCALE
```

Exact user-confirmed dimensions remain authoritative when provided.

When exact dimensions are absent, reason relative to a standard Minecraft player-sized humanoid instead of unanchored words such as `small`, `medium`, `large`, or `fairly tall` by themselves.

## 2. Scale Authority Order

```text
1. explicit user numeric dimensions
2. explicit user relative-scale requirement
3. approved source/reference evidence when player relation is visually clear
4. canonical player-relative category
5. unresolved → ask a simple question when scale is blocking
```

Never infer precise block dimensions from image pixels alone.

## 3. Player-Relative Vocabulary

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

These are semantic anchors, not hardcoded block values.

User-facing wording should remain natural rather than exposing enums unless useful.

## 4. Default Profile Interpretation

Defaults apply only when they do not conflict with user/source authority and the scale is otherwise safe to infer.

```text
HUMANOID normal adult-like NPC → PLAYER_HEIGHT
held tool                    → HANDHELD
wearable gear                → WEARABLE
small stool                  → KNEE_HEIGHT
work/sales table             → WAIST_HEIGHT
display rack                 → CHEST_HEIGHT / ABOVE_PLAYER_HEIGHT
motorcycle/bike              → RIDEABLE_1P
2-seat vehicle               → RIDEABLE_2P
```

For creatures, machinery, foliage, and nonstandard humanoids, preserve the approved body/function context rather than forcing a default.

## 5. Requirement Gate — Scale

Scale is `BLOCKING` before generation when materially different scale would change:

```text
primary silhouette/proportion
player interaction / reach
occupancy
attachment relationship
vehicle cockpit/seat layout
usable furniture height
animation/contact relationship
major world readability
```

When blocking, ask one simple player-relative question.

Examples:

```text
"NPC ini mau setara tinggi player atau lebih tinggi?"
"Kiosnya cukup untuk satu player berdiri di belakang counter atau mau lebih besar?"
"Kendaraannya untuk 1 player atau 2 player?"
```

Avoid requesting exact block dimensions unless that precision is genuinely needed.

## 6. Prompt Compiler Scale Contract

The compiled brief preserves either or both:

```text
explicit dimensions_blocks
player_relative_scale
```

Canonical package representation lives in `../package/schema.md`.

Rules:
- numeric dimensions remain numeric authority;
- `player_relative_scale` communicates semantic world/interaction scale;
- never invent numeric values from a relative category;
- if both materially conflict, the dependent decision is blocked until resolved.

## 7. Scale Lock Across Views and Sheets

Once Sheet 01 establishes approved scale, all later views/sheets preserve:

```text
same whole-asset player/world relationship
same whole-model proportions
same relative size of major parts
same interaction/occupancy scale
```

This is the **Scale Lock**.

Sheet 02+ may enlarge a detail panel for readability, but must not imply a different underlying asset scale.

A material scale change is a revision, not ordinary continuation.

## 8. Scale Visibility Rule

Do **not** add a scale panel by default.

Scale normally belongs in `REFERENCE.json` and `GEOMETRY.md`.

Show explicit visual scale evidence only when it materially reduces ambiguity, especially for:

```text
vehicle occupancy
kiosk / booth / stall
large furniture or environment prop
large machinery
creature with identity-critical size
unusually large/small object with ambiguous world scale
```

Usually unnecessary for:

```text
wearable accessory
handheld tool
small ordinary prop
simple foliage
standard player-height humanoid
```

When needed, use a compact player silhouette/reference marker that does not displace more important construction evidence.

## 9. One-Sheet Default

```text
DEFAULT = 1 PRIMARY REFERENCE SHEET
```

Remain on one sheet while all required P1 and useful P2 evidence remain readable.

Typical one-sheet conditions:

```text
construction views ≤ 4
critical details ≤ 2–3
key poses ≤ 3 when compact
no critical rig/mechanical relationship becomes too small
hero and construction views remain comfortably readable
```

These are practical thresholds, not hard quotas.

## 10. Escalate to Sheet 02 When

Create Sheet 02 when at least one material condition is true:

```text
P1 detail would become too small on Sheet 01
3+ critical detail panels materially compete with construction views
4–5 key poses are required and become unreadable
rig/deformation guidance needs dedicated readable joint views
complex mechanical articulation needs separate evidence
multiple motion states obscure main construction
important asymmetric/hidden structure cannot fit without shrinking P1 evidence
```

Do not escalate merely because more detail could be shown.

## 11. Escalate to Sheet 03+ When

Sheet 03+ is justified only when additional P1/P2 evidence remains necessary after Sheet 02.

Typical valid reasons:

```text
multiple distinct animations with separate pose groups
complex creature articulation with separate wing/jaw/tail evidence
large mechanical assembly with several independent high-risk mechanisms
explicitly requested variant set
multiple identity-critical modular configurations
```

Each added sheet needs one bounded purpose.

## 12. Preferred Multi-Sheet Roles

```text
01-main-reference.png
02-detail-rig.png
02-motion-reference.png
02-mechanical-detail.png
03-variants.png          ← only when variants are required
```

Sheet 01 remains the identity and scale anchor.

## 13. Escalation Decision Order

Before adding a sheet:

```text
1. remove P3 content
2. remove lowest-value P2 content
3. remove redundant construction view
4. restore useful size to P1 evidence
5. if required P1/P2 still does not fit → Sheet 02+
```

Never shrink critical Geometry merely to avoid another image.

## 14. Geometry / Texture / Animation Compression

```text
Geometry  → preserve maximum useful construction evidence
Texture   → keep material identity visible in existing views where possible
Animation → compress to meaningful key poses, not implementation keys
```

If motion poses become too small, move them to Sheet 02 rather than shrinking Geometry.

## 15. Pre-Generation Checks

```text
scale anchor resolved enough for this asset
player-relative relationship does not conflict with explicit dimensions
Sheet 01 preserves the intended scale relationship
scale marker included only if decision-critical
all P1 panels readable
P2 panels still justify space
sheet escalation decision completed before generation
```

## 16. Post-Generation Checks

```text
asset reads at intended player/world scale
construction views preserve apparent scale/proportions
rideable/interactive parts remain plausible relative to player anchor
Sheet 02+ preserves Sheet 01 Scale Lock
an enlarged detail does not imply a different underlying proportion
```

Scale inconsistency across views/sheets is a visual drift defect.

## 17. Package Handoff

`REFERENCE.json` stores confirmed numeric dimensions and/or `player_relative_scale` when useful.

`GEOMETRY.md` explains the scale relationship briefly enough that Codex does not need to infer world size from imagery alone.

A visual scale marker is never required merely because scale metadata exists.

## Completion

Scale/sheet planning is correct when:

```text
asset world scale is anchored to Minecraft player context
explicit numeric dimensions remain authoritative
user is asked only when scale materially changes the result
one sheet remains default
additional sheets exist only for real information/readability pressure
Sheet 01 anchors identity + scale
Sheet 02+ preserves both locks
no decorative scale panel consumes useful evidence
```
