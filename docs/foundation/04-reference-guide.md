# BlockIT — Reference Guide

**Status:** Active Policy  
**Version:** 2.2  
**Updated:** 2026-08-14

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

## Execution Boundary

Reference readiness and repository/policy hardening are separate from image execution.

- Audit, skill/policy changes, CI, or `next-action.md` do **not** authorize generation.
- If work switches into workflow/repository hardening, earlier generation permission is consumed.
- After hardening/verification, stop and report. Resume image generation/editing only after a **fresh explicit user instruction**.
- A repository next step is not execution consent.

## Intake / Readiness

Reference preparation is assistive, not form-filling. Prefer zero clarification. Resolve explicit user facts, then visible facts; leave optional unknowns unset; ask only for material ambiguity.

Never infer numeric dimensions from pixels or invent hidden features, asymmetry, attachments, articulation, or hidden joint precision.

The **Pre-Generation Readiness Gate** must pass first. **Generation is output, not discovery.** `READY` means no unresolved material ambiguity could still change identity, major form, pose/articulation integrity, the chosen orthographic core, or buildability.

## Pose / Articulation

Use the **most structurally readable stable pose** unless another state is explicitly required.

For grounded load-bearing subjects, default to a **stable natural neutral stance**. A dynamic source pose does not automatically become the modelling pose. Neutral does not mean robotic symmetry; do not force perfect bilateral alignment merely because it is easier to generate.

Preserve the same requested/observable pose state and limb phase across shown views without inventing hidden joint precision.

Relational invariants:
- limb/appendage count stays consistent;
- visible attachment is plausible;
- near/far limbs remain distinguishable when relevant;
- grounded supports share a coherent ground relation;
- important negative spaces stay compatible;
- duplicated, missing, merged, floating, relocated, or independently re-posed limbs/appendages are invalid.

Identity-critical articulated features—trunk, tail, antenna, wing, jaw, hinged part, carried tool, etc.—keep one state across views. Preserve visible **root → direction/bend → terminal relationship**. Projection may change appearance; state may not change.

## Construction

Use the **simplest Blockbench-buildable representation that preserves the visible requirement**. Cuboids, rotated/stepped masses, plane-like Cubes, layered/inflated forms, linked segments, and texture-only treatment are examples, not exhaustive categories or presets.

Do not lazy-voxelize, substitute smooth primitives, or turn sample Cube counts/segmentation into rules.

## Orthographic Core Principle

A reference board is **the smallest mutually compatible orthographic view set that constrains the model**, not a fixed five-panel turnaround.

Choose one **source-nearest anchor orientation** first. Add only views needed to constrain missing axes, key attachments, asymmetry, footprint, or important negative spaces. Every added view must remain explainable by the same locked mass/pose/attachment relationships.

If an extra view can only be produced by inventing contradictory structure, **omit that view and report the limitation**. Missing justified view coverage is preferable to fabricated coherence.

Typical reasoning:

```text
ANCHOR SIDE/FRONT
+ perpendicular orthographic view
+ TOP only when footprint/depth materially matters
+ BACK only when rear structure materially matters
```

This is guidance, not a template.

- SIDE/FRONT/BACK shown together keep comparable scale and coherent ground relation when grounded.
- TOP, when included, is a true **top-down projection of the same locked structure** and preserves footprint, mass placement, appendage roots, limb locations, and negative spaces.
- **3/4 is not part of the default initial core.** Add it only after the orthographic core is coherent and only when it resolves a real volume ambiguity or the user explicitly requests it. It is diagnostic, never structural authority.

Do not add views for completeness.

## Visual Gate

Review the actual Draft in this order:

1. **Anchor fidelity** — source-nearest view preserves subject identity and major silhouette.
2. **Orthographic coherence** — every shown view fits one mass/pose/attachment interpretation.
3. **Articulation lock** — limbs and critical articulated features keep one state.
4. **Support / naturalness** — stable support without accidental gait, floating support, or forced robotic symmetry.
5. **Construction / readability** — recognizable, uncropped, buildable target.

Any material projection mismatch, articulated-feature drift, pose/support conflict, or cross-view redesign is `NOT READY / NEEDS REVIEW` regardless of presentation quality. Material cross-view conflicts **must not be averaged** into a fake compromise. Do not replace qualitative review with numeric scores.

## Targeted Correction

A structural cross-view defect is a **board-level defect**.

For the one allowed correction:
- original Source Image + locked Internal Generation Brief remain authority;
- failed Draft is defect evidence, **not geometry authority**;
- name failed invariants explicitly;
- regenerate the **whole shown orthographic core from the same locked structure**, never one panel independently;
- preserve relationships that already passed;
- remove an unnecessary problematic view rather than invent structure solely to preserve layout.

A correction also requires the Execution Boundary above. If material conflict remains, stop at `NOT READY / NEEDS REVIEW`; do not generate more variants.

## View Pair Map

Map only views actually present in the approved reference:

```text
REFERENCE FRONT ↔ MODEL front
REFERENCE BACK  ↔ MODEL back
REFERENCE SIDE  ↔ MODEL matching left/right
REFERENCE TOP   ↔ MODEL top
REFERENCE 3/4   ↔ MODEL matching 3/4 when explicitly present
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

Never derive scale/transforms from pixels, panel size, perspective, masks, mesh fitting, or similarity scores. Target dimensions normally remain **Handoff Constraints outside the image**.

**Only panel/view labels may appear by default.** No board title, header, subtitle, explanatory note, status text, target height, scale note, dimensions, or target-use text is rendered unless explicitly requested.

## Completion

A Draft is acceptable only when identity, orthographic-core coherence, pose/articulation integrity, buildability, present-view pairing, primary masses/contacts, and important negative spaces are usable and the user approves the image.

Generation budget: one Draft, at most one targeted correction, zero automatic alternatives. Reference validity never proves final model fidelity.

## Related

- [Modelling Workflow](03-modelling-workflow.md)
- [Geometry Standard](05-geometry-standard.md)
- [Visual Validation](07-visual-validation.md)
