# Marketplace Reference Intelligence Intake

Use this template before starting **Main Geometry** for any new model.

This is a general template for reference understanding only.
It is intentionally not per-pack or product-dedicated, and it should not hardcode any specific marketplace source.

## 1) Core Project Identity

- Asset Name:
- Identifier Prefix:
- Category: `Bedrock Entity`
- Asset Scale:
- Visual Role:
- Animation Scope: `none` / `basic` / `combat` / `boss`

## 2) Reference Set

- Reference 1 (main):
- Reference 2 (sibling style):
- Reference 3 (technical/UV style):

For each reference:
- Silhouette match level: `High / Medium / Low`
- Material identity: `cloth / metal / stone / skin / wood / other`
- Complexity level: `Low / Medium / High`

## 3) Required MCP Phase Decisions

- Main Geometry Budget:
  - `Low`: minimal cubes, major shapes only
  - `Medium`: main body + arms/legs + major accessories
  - `High`: silhouette-critical details only
- UV Baseline:
  - `16` / `32` / `64` / `128`
- Atlas Priority:
  - `single`
  - `split per material`
  - `shared with repeated elements`
- Dominant Bone Pattern:
  - root / body / waist / torso
  - limb groups
- Attachment Points:
  - weapon socket
  - shield mount
  - armor parent groups

## 4) Quality Targets (per phase)

### Main Geometry
- Target silhouette clear in front and side
- No free-floating parts
- No minor cube spam

### Geometry Detailing
- All detail cubes must support silhouette
- Micro details should be marked for texturing

### UV Texture
- UV islands grouped by material
- Texture space compact and reuse-friendly

### Base / Detail Texturing
- Base color block separation visible
- Gradient present on at least one major surface type

## 5) Anti-Pattern Checklist (hard blockers)

- Floating knees, knees/arms not attached, floating accessories
- Severe collision between sibling cubes
- Tiny decorative cubes where gradient/texture can replace form
- Over-concentration of unique UV islands with no material reason

## 6) Output Plan (one row only)

- Phase 1 (Geometry): ...
- Phase 2 (Detailing): ...
- Phase 3 (UV): ...
- Phase 4 (Base): ...
- Phase 5 (Detail): ...
- Polish:

## 7) Codex Request Guard

- If required references are missing: `BLOCK` and request only missing references.
- If any blocker is still active: `BLOCK` and fix before next phase.
- If references are aligned: proceed to Main Geometry with this plan.

## Acceptance Criteria

- Reference identity (asset, category, scale, animation scope) is complete before Main Geometry.
- Silhouette, budget, attachment, and texture strategy are explicitly captured.
- Anti-patterns are recorded as hard blockers (not suggestions).
- Plan line items are phase-safe and do not mix phase scopes.
