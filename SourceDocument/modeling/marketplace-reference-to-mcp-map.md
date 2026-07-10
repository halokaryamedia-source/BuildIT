# Marketplace Reference → MCP Implementation Intelligence

This map is a general pattern extractor for marketplace-style quality.
It is for learning intent and execution behavior, not for modeling one specific pack.

Use this document to convert sample packs into a reliable modeling pipeline.

## 1) What to extract from each reference pack

Create one **Reference Signature** before Geometry work:

- Asset Type: `entity`, `block`, `armor`, `weapon`, `furniture`, `projectile`, `misc`.
- Visual Priority (ranked): silhouette / proportions / material / trim / face detail.
- Animation Priority: `none`, `basic`, `combat`, `boss`.
- Geometry Budget: `low`, `medium`, `high`.
- Atlas Baseline: `16`, `32`, `64`, `128`, or custom.
- Bone Strategy: flat torso-root, segmented limbs, attachment groups, accessory groups.
- Texture Strategy: flat fill only / gradients present / layered materials / painted patterns.

## 2) MCP Execution Intelligence Rule

Do not copy the sample mesh.
Do not copy the exact UV layout.

Only implement these rules:

- Silhouette must match the reference intent.
- Component hierarchy must be readable and non-overlapping.
- Performance balance must come from texture-first detail, not micro-cubes.
- Per-face UV is default.

## 3) Phase-by-phase extraction template

### Phase: Reference Collection

- Pick 1 hero model + 1 style sibling + 1 technical sibling for category.
- Extract target pose, body proportions, and visible silhouette only.
- Confirm texture density range needed (`16`, `32`, `64`, `128`, etc).
- If animation intended, extract only required motion patterns.

### Phase: Main Geometry

- Build major body masses first from largest to smallest.
- Use bone names that match function (`root`, `body`, `waist`, `head`, `left_arm`, `right_arm`, `left_leg`, `right_leg`, `weapon`, `armor_layer`).
- Avoid final ornamentation until detail phase.

### Phase: Geometry Detailing

- Add non-fragile secondary forms only if they change silhouette.
- Convert micro-details (nails, seams, stitches, scratches) into texturing work.
- Keep parts attached to parent pivots; no hovering accessories.

### Phase: UV Texture

- Group textures by material family before paint.
- Keep UV compact; prioritize continuity.
- Reuse symmetry and mirrored faces where plausible.

### Phase: Base Texturing

- Establish main color families: base, shadow, highlight, edge wear.
- Add readable material separation (cloth/metal/skin/wood).
- No single-color flat fills for large visible surfaces.

### Phase: Detail Texturing

1. Build silhouette and proportions first; this is the only phase that can change major form.
2. Convert fine details to texture unless silhouette or collider logic requires geometry.
3. Check attachment relation before detailing; any part without a clear parent is flagged.
4. Keep UV islands contiguous by material where possible; fragmented islands are allowed only when needed for symmetry or repeat.
5. Any phase can only change one core decision:
   - phase main geometry: mass and hierarchy
   - geometry detailing: silhouette-supporting forms
   - UV: map reuse and continuity
   - base/detail texturing: shape illusion and material hierarchy

Use this checklist as MCP intelligence trigger:

- If collision/overlap is detected => pause and fix geometry before paint.
- If tiny decorative details exceed 5% of total cubes => move to texturing.
- If palette lacks gradient separation => continue to detail texturing, not UV.
- If attachment is floating/unanchored => return to geometry detailing.

## 2) Direct implementation rule
- Validate no stretching seams at attachments.

### Phase: Polish

- Compare final preview to reference intent, not exact pixel match.
- Reduce geometry where detail can be moved to texture.
- Keep armature clean and future-animatable.

## 4) Marketplace quality signals (from provided samples)

- Good models usually show:
  - Strong silhouette first.
  - Explicit bone hierarchy with reusable parts.
  - Texture used for pattern and micro-detail.
  - Clear naming by function.
- Warning signs:
  - Excessive micro-cubes on small decorative edges.
  - Free-floating ornaments.
  - Texture islands too fragmented.
  - One-size UV approach for all materials.

## 5) Quick acceptance check (before phase progression)

- Does silhouette remain clear after each phase?
- Can the same detail be expressed with fewer cubes?
- Are main materials readable under single lighting pass?
- Are all attachment parts anchored and named logically?
- Did we keep references as intent only, not as a copied mesh?

## 6) Example category mapping

### Creature / Dinosaur

- Focus on body mass + limb articulation.
- Use medium-high atlas if anatomy variation is required.
- Prioritize animation readability over micro-cubes.

### Weapon / Armor

- Focus on profile, grip, and silhouette edge.
- Small atlas is often enough (`16/32`) unless ornament is central.
- Use consistent slot naming and origin pivot conventions.

### Furniture / Static Entity

- Start with axis-aligned primitives.
- Preserve scale cues from reference.
- Emphasize trim/material transitions through UV blocks.

## 7) Anti-hallucination behavior

- MCP should not generate unseen parts.
- MCP should ask for missing material or pose references before adding new motifs.
- MCP should preserve the user intent and project direction from the reference package.

## Acceptance Criteria

- The map includes extracted fields needed before Main Geometry (asset type, geometry budget, atlas baseline, texture strategy).
- Anti-pattern blockers force pause before progression.
- Micro-details are consistently routed to texturing when they do not support silhouette or attachment.
- No "copy mesh" interpretation is allowed; only intent transfer is permitted.
