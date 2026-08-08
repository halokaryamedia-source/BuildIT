# Glossary

Updated: 2026-08-08

Use these terms consistently across the BlockIT vault.

## Documentation Terms

- **Foundation** — durable product/modelling/reference/validation policy under
  `docs/foundation/`.
- **Knowledge Vault** — the Obsidian project-memory layer under
  `docs/knowledge/`.
- **Next Action** — the single current-task snapshot in `next-action.md`.
- **Decision Record** — durable context + choice + reason + tradeoff; not a task
  log.
- **Historical Review** — evidence/reasoning captured at a point in time. Its
  original findings may be retained even after implementation changes; current
  status is shown by the Review Index.
- **SSOT** — single source of truth for a defined responsibility.

## Product / Reference Terms

- **BlockIT** — the Blockbench + MCP system/workflow for AI-assisted Minecraft
  Bedrock modelling.
- **Source Image** — original user-provided image(s) used to understand target
  identity; provenance/input, not direct Cube geometry data.
- **Golden Sample** — presentation/style/construction-language reference only;
  never target anatomy authority.
- **Modelling Brief Draft** — generated five-view visual before approval.
- **Modelling Brief** — approved five-view visual guide used for silhouette,
  proportions, landmarks, contacts, orientation, and construction reasoning.
- **Requested Dimensions** — approved numeric target dimensions. For current
  Bedrock modelling policy, `1 block = 16 Blockbench units`.
- **Reference Package** — approved Modelling Brief plus small metadata and
  optional Source Images/support material.

## Modelling Terms

- **Coordinate Frame** — explicit model-space convention, normally X=width,
  Y=height, Z=front/back length, plus front direction and ground relation.
- **Primary Form Hypothesis** — temporary coarse spatial reasoning for the
  object's main masses: relative size, placement, orientation, contacts,
  supporting views, and uncertainty. It is not a locked Cube blueprint.
- **Primary Geometry** — minimum major Cuboid masses needed for recognizable
  whole form.
- **Secondary Geometry** — later geometry that improves silhouette, attachment,
  motion, or visible detail after primary form is sound.
- **Reference Fidelity Loop** — evidence-backed loop from reference → spatial
  hypothesis → explicit geometry → observation → global/local diagnosis → causal
  correction.
- **Global Failure** — recognizability/whole silhouette/multiple primary
  relationships are wrong; revise/rebuild the primary hypothesis.
- **Local Failure** — whole form is sound and one bounded mass/attachment/
  rotation/pivot relationship is wrong; inspect and correct that target.
- **Structural Evidence** — IDs, hierarchy, bounds, transforms, save state,
  successful tool operations, etc. It does not prove resemblance.
- **Visual Evidence** — fresh current-revision model views compared with the
  corresponding reference views.
- **Visual Gate** — a concrete modelling decision based on current visual
  evidence; not a similarity score.
- **Pivot / Origin** — transform center used for rotation/articulation. It needs a
  real transform/joint/attachment reason when material to the model.
- **Pivot-only Cube Correction** — change `origin` without `from/to/rotation`;
  Local uses `Cube.transferOrigin()` so visual position is preserved.
- **Authored Geometry Rewrite** — intentional change where geometry/rotation and
  pivot relationship are rewritten together, e.g. `origin` with `from/to` or
  `rotation`.

## Correction Vocabulary

- **TRANSLATE** — placement is wrong.
- **RESIZE** — extent/proportion is wrong.
- **ROTATE** — orientation/slope is wrong.
- **REATTACH** — parent/contact relationship is wrong.
- **SPLIT** — one mass genuinely needs separate orientations/volumes.
- **MERGE / REMOVE** — geometry is unnecessary or compensatory.
- **ADD MASS** — a required visible volume is genuinely missing; not the default
  response to a mismatch.

## Evidence Status

These labels come from root `AGENTS.md`, not from an `evidence-gate` skill:

- **CURRENT-PROJECT VERIFIED** — sufficient proof exists in the current target
  project/environment for the claim being made.
- **OFFICIALLY VERIFIED** — authoritative upstream docs/source support the exact
  capability/context, but current-project runtime integration may still be
  unproven.
- **LOCAL PROOF REQUIRED** — source/design is sufficiently supported to proceed,
  but live local runtime/visual proof is still required before claiming it works.
- **UNSUPPORTED** — available evidence shows the proposed method/capability is not
  reliable for the current target.
- **UNKNOWN** — evidence is insufficient or conflicting; do not guess.

## User-Facing Status

- **Selesai** — requested work and the required available proof are complete.
- **Perlu pemeriksaan** — implementation/preparation exists but a material
  runtime/visual/external proof remains unavailable.
- **Terhenti** — safe progress is blocked by an unresolved cause, conflict,
  authority gap, or unavailable required evidence.

## Runtime Terms

- **MCP** — Model Context Protocol.
- **Blockbench Model** — editable `.bbmodel` project being produced/revised.
- **Hierarchy** — parent-child structure of Groups/Cubes/elements.
- **Transform** — authored position/extent/origin/rotation relationships.
- **Rendered Bounds** — current visible model envelope after active transforms;
  used for structural scale/location evidence only.
- **Canonical Model Views** — named stable views (`front`, `back`, `left`,
  `right`, `top`, etc.) used for reference ↔ model comparison.

## Retired Terms / Paths

Do not use these as current owners:

- `Evidence Gate` as a standalone skill;
- `mcp-builder` as current MCP owner;
- `mcp/workflow/skills/` as a skill root;
- `mcp/.agents/skills/` / `mcp/.github/skills/` as canonical skills.

See [Skill Map](skills/skill-map.md) for lineage.

## Parent

- [Knowledge Dashboard](index.md)
