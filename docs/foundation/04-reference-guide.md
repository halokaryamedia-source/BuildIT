# BlockIT — Reference Guide

**Status:** Active Policy  
**Version:** 2.0  
**Updated:** 2026-08-13

## Purpose

Define the durable Source Image → approved Modelling Brief contract. Operational procedure belongs to `.agents/skills/blockbench-reference-generator/SKILL.md`; this file should remain semantic policy, not a second prompt or MCP subsystem.

The reference reduces ambiguity about identity, silhouette, proportion, major masses, pose/state, contacts, orientation, and style. It is not an exact Cube blueprint.

## Authority

```text
user brief / approved target → identity + requested function
actual approved reference image → visible form + approved pose/state
approved numeric dimensions → whole-model scale/envelope
Handoff Constraints → material nonvisual facts outside image
Reference Evidence Map → derived working index; never image authority
```

The **actual approved reference image** must be available as multimodal input to the model performing reference-driven geometry reasoning. A path, manifest, prose summary, or memory is context, not visual evidence. **A path itself is not visual evidence.** If the image cannot be inspected, material reference-driven geometry/approval is `BLOCKED`.

Default deliverable is the image only. Handoff Constraints are task context, not a ZIP/manifest/package.

## Intake / Readiness

Reference preparation is assistive, not form-filling. Prefer zero clarification. Resolve explicit user facts, then visible facts; leave optional unknowns unset; ask only for material ambiguity.

Never infer numeric dimensions from pixels or invent hidden features, asymmetry, attachments, articulation, or hidden joint precision.

The **Pre-Generation Readiness Gate** must pass first. **Generation is output, not discovery.** `READY` means no unresolved material ambiguity could still change identity, major form, visible feature, pose/articulation integrity, projection consistency, or buildability. A targeted correction fixes a concrete visual defect; it cannot replace missing understanding.

## Pose / Articulation

Use the **most structurally readable stable pose** unless another state is explicitly required.

For grounded load-bearing subjects, default to a **stable natural neutral stance**. A dynamic source pose does not automatically become the modelling pose. Neutral does not mean robotic symmetry; do not force perfect bilateral alignment merely because it is easier to generate.

If another pose is required, preserve the same requested/observable pose state and limb phase across required views without inventing hidden joint precision.

Relational invariants:
- limb/appendage count stays consistent;
- visible attachment is plausible;
- near/far limbs remain distinguishable when relevant;
- grounded supports share a coherent ground relation;
- important negative spaces stay compatible;
- duplicated, missing, merged, floating, relocated, or independently re-posed limbs/appendages are invalid.

Identity-critical articulated features—trunk, tail, antenna, wing, jaw, hinged part, carried tool, etc.—also keep one state across views. Preserve visible **root → direction/bend → terminal relationship**. Projection may change appearance; the articulated state may not change.

Orthographic views own structural truth. The 3/4 view must not redesign anatomy, attachment, limb placement, or articulated state.

## Construction

Use the **simplest Blockbench-buildable representation that preserves the visible requirement**. Cuboids, rotated/stepped masses, plane-like Cubes, layered/inflated forms, linked segments, and texture-only treatment are examples, not exhaustive categories or presets.

Do not lazy-voxelize, substitute smooth primitives, or turn sample Cube counts/segmentation into rules.

## Single-Model Projection Principle

A multi-view board is **one structural interpretation shown from several views**, not several independent drawings.

```text
UPPER: LEFT SIDE | FRONT | BACK
LOWER: TOP / FOOTPRINT | FRONT-LEFT 3/4
```

Before generation, the locked major masses, pose, limb placement, articulated-feature states, attachments, and negative spaces must explain every required view without contradiction.

- SIDE/FRONT/BACK keep comparable scale and coherent ground relation when grounded.
- TOP is a true **top-down projection of the same locked structure**. Preserve footprint, mass placement, appendage roots, limb locations, and negative spaces. Unknown hidden detail stays conservative instead of becoming invented geometry.
- 3/4 remains structurally subordinate to orthographic views.

A material **TOP mismatch** proves the board is not yet one coherent model.

## Visual Gate

Review the actual Draft in this order:

1. **Projection coherence** — SIDE/FRONT/BACK/TOP fit one structure.
2. **Articulation lock** — limbs and critical articulated features keep one state.
3. **Support / naturalness** — stable support without accidental gait, floating support, or forced robotic symmetry.
4. **Construction / readability** — recognizable, uncropped, buildable, visually consistent target.

Any material TOP mismatch, articulated-feature drift, pose/support conflict, or cross-view redesign is `NOT READY / NEEDS REVIEW` regardless of presentation quality. Material cross-view conflicts **must not be averaged** into a fake compromise. Do not replace qualitative review with numeric scores.

## Targeted Correction

A structural cross-view defect is a **board-level defect**, even when one panel reveals it.

For the one allowed correction:
- original Source Image + locked Internal Generation Brief remain authority;
- failed Draft is defect evidence, **not geometry authority**;
- name failed invariants explicitly;
- regenerate the **whole board from the same locked structure**, never one panel independently;
- preserve relationships that already passed;
- reject a correction that fixes one panel by silently redesigning another.

If material conflict remains, stop at `NOT READY / NEEDS REVIEW`; do not generate more variants.

## View Pair Map

```text
REFERENCE FRONT ↔ MODEL front
REFERENCE BACK  ↔ MODEL back
REFERENCE SIDE  ↔ MODEL matching left/right
REFERENCE TOP   ↔ MODEL top
REFERENCE 3/4   ↔ MODEL matching 3/4
```

**Ambiguous front/back, left/right, or 3/4 pairing remains `UNVERIFIED`.**

## Reference Evidence Map

Before exact geometry, derive only material observable claims:

```text
claim_id
kind: identity | mass | landmark | count | topology/contact | orientation | negative_space | representation
observable claim
supporting reference view(s)
evidence: SUPPORTED | PROVISIONAL | CONFLICTING | UNAVAILABLE
```

**Claim text describes what is visible**, not what the object “usually” has. No Cube coordinates/count/pivot plan or pixel-derived dimensions belong here. The actual approved reference image remains authority.

## Dimensions / Image Content

When dimensions are approved: `1 block = 16 Blockbench units`. Use them as whole-model target/envelope; individual Cube transforms remain modeller decisions.

Never derive scale/transforms from pixels, panel size, perspective, masks, mesh fitting, or similarity scores. Target dimensions normally remain **Handoff Constraints outside the image**. **Only view labels may appear** by default unless the user explicitly requests visible notes.

## Completion

A Draft is acceptable only when identity, one-model projection coherence, pose/articulation integrity, buildability, view pairing, primary masses/contacts, and important negative spaces are usable and the user approves the image.

Generation budget: one Draft, at most one targeted correction, zero automatic alternatives. Reference validity never proves final model fidelity.

## Related

- [Modelling Workflow](03-modelling-workflow.md)
- [Geometry Standard](05-geometry-standard.md)
- [Visual Validation](07-visual-validation.md)
