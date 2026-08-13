# BlockIT — Reference Guide

**Status:** Active Policy  
**Version:** 1.9  
**Updated:** 2026-08-13

## Purpose

Define the durable Source Image → approved visual Modelling Brief contract. Operational generation procedure belongs to `.agents/skills/blockbench-reference-generator/SKILL.md`; this policy should not duplicate the full prompt or become an MCP/geometry subsystem.

The reference should reduce ambiguity about identity, silhouette, proportion, major masses, pose/state, visible contacts, orientation, and style. It must **not** become a pixel-calibrated Cube blueprint.

## Authority / Handoff

```text
user brief / approved target → identity + requested function
approved reference image     → visible form + approved visible pose/state
approved numeric dimensions  → whole-model scale/envelope
Handoff Constraints          → material nonvisual user facts outside image
Reference Evidence Map       → derived working index; never image authority
```

The **actual approved reference image must be available as multimodal input** to the model performing reference-driven geometry reasoning and visual comparison. A filename, filesystem path, manifest, textual description, previous summary, or memory may provide context but is not visual evidence. **A path itself is not visual evidence.** If the active modelling model cannot inspect the approved image, material reference-driven geometry/approval is `BLOCKED`.

### Canonical terms

- **Source Image** — original user image(s); identity/provenance authority, not geometry data.
- **Internal Generation Brief** — AI-resolved pre-generation understanding; not a user-facing form or Cube blueprint.
- **Modelling Brief Draft** — generated reference before approval.
- **Modelling Brief** — approved visual image guide consumed by modelling.
- **Requested Dimensions** — optional approved numeric width/height/length target.
- **Handoff Constraints** — compact material nonvisual facts such as target scale/height, target use, or must-preserve requirements.
- **Reference Evidence Map** — run-local observable-claim index derived from the actual approved image.
- **Golden Sample** — presentation/construction-language example only; never target anatomy authority.

The default deliverable is the **image only**. Handoff Constraints remain compact task context, not a ZIP/manifest/package. If modelling occurs in another session, pass relevant facts explicitly with the approved image rather than assuming metadata or memory will preserve them.

## Intake / Readiness Principles

Reference preparation is **assistive, not form-filling**. Prefer **zero clarification**. Resolve explicit user facts first, then directly visible facts, leave optional unknowns unset, and ask only for material ambiguity.

Do not repeat questions the user cannot answer. If clarification is necessary, use **one compact round with at most three material items**, explain unfamiliar concepts in plain language, provide one recommended interpretation, and allow **use your recommendation**. A recommendation remains a **working interpretation**, **not a user-provided fact**, until accepted.

Never infer numeric dimensions or scale from pixels. Never invent hidden features, unseen asymmetry, unseen attachments, or unobserved articulation.

The **Pre-Generation Readiness Gate** must pass before generation. **Generation is output, not discovery.** `READY` means there is **no unresolved material ambiguity** that could still change identity, major form, required visible features, pose/state integrity, or buildability. A targeted correction may fix a **concrete visual defect**; it may not compensate for **missing pre-generation understanding**. If material ambiguity remains, `NEEDS REVIEW`; **do not generate**.

## Pose / Articulation Principle

For articulated subjects, use the **most structurally readable stable pose** unless the user explicitly requires another state.

For grounded load-bearing subjects, normal modelling reference uses a **stable natural neutral stance**. A dynamic pose visible in the Source Image does **not** automatically become the modelling pose. Neutral does not require mirrored or robotic symmetry.

If a different pose is required, preserve the same requested/observable pose state and limb phase across required views, but do not invent hidden joint precision that the source does not establish.

Material invariants are relational rather than anatomy presets:

- required limb/appendage count stays consistent;
- attachment is plausible for the visible subject;
- near/far limbs remain distinguishable when relevant;
- grounded load-bearing supports share a coherent ground plane;
- required negative spaces remain consistent;
- duplicated, missing, merged, floating, relocated, or independently re-posed limbs are invalid.

Orthographic views own structural pose truth. The 3/4 view helps read volume but **must not redesign** anatomy, attachment, limb position, or pose state. This is a generic integrity rule, not a quadruped/humanoid anatomy template.

## Construction Principle

Use the **simplest Blockbench-buildable representation that preserves the visible requirement**. Cuboids, rotated Cuboids, stepped masses, plane-like Cubes, layered/inflated forms, linked segments, and texture-only treatment are **reasoning examples, not exhaustive categories or presets**.

Do not lazy-voxelize, substitute smooth primitives, or turn one sample's Cube count/segmentation into a rule. The Modelling Brief is a buildable visual target, not an exact Cube plan.

## View / Cross-View Principle

Normal board:

```text
UPPER: LEFT SIDE | FRONT | BACK
LOWER: TOP / FOOTPRINT | FRONT-LEFT 3/4
```

A different view set is allowed when the actual object requires it. **Do not add views for completeness.**

For grounded subjects, side/front/back share a coherent ground relation and comparable presentation scale. TOP is a true top-down orthographic view of the same 3D subject and preserves footprint, center, proportions, placement, and negative spaces; it is not required to depict a side-view ground baseline. The 3/4 view remains structurally subordinate to clearer orthographic evidence.

Before modelling, required views must describe one compatible object and one compatible pose/state. A front view may support width/height but cannot by itself certify depth. Perspective 3/4 may interpret volume but cannot override clearer orthographic evidence. Material cross-view conflict **must not be averaged** into a fake compromise; unresolved conflict is `NOT READY / NEEDS REVIEW` or modelling `BLOCKED` as appropriate.

### View Pair Map

Map reference orientation before it can approve a model view:

```text
REFERENCE FRONT ↔ MODEL front
REFERENCE BACK  ↔ MODEL back
REFERENCE SIDE  ↔ MODEL matching left/right
REFERENCE TOP   ↔ MODEL top
REFERENCE 3/4   ↔ MODEL matching front_left_3q/front_right_3q
```

The sheet's actual orientation owns the mapping. **Ambiguous front/back**, left/right, or 3/4 pairing remains `UNVERIFIED`; do not silently compare the most convenient view.

## Reference Evidence Map

Before exact geometry, derive only material observable claims needed for current decisions:

```text
claim_id
kind: identity | mass | landmark | count | topology/contact | orientation | negative_space | representation
observable claim
supporting reference view(s)
evidence: SUPPORTED | PROVISIONAL | CONFLICTING | UNAVAILABLE
```

**Claim text describes what is visible**, not what the object “usually” has. No Cube coordinates/count/pivot plan belongs here. No pixel-derived dimension is promoted to model space. Material Semantic Form decisions trace to claim IDs; unresolved material claims remain provisional/unverified or `BLOCKED`.

The map is a compact decision aid, not another manifest ceremony. The actual image remains authority.

## Dimensions / Image Content

When dimensions are approved: `1 block = 16 Blockbench units`. Use them as whole-model target/envelope; individual Cube transforms remain modeller decisions.

Never derive scale/transforms from pixels, image bounds, dimension-line lengths, panel size, perspective projection, masks, mesh fitting, or similarity scores.

Target dimensions are optional for reference generation and normally remain **Handoff Constraints outside the image**. **Only view labels may appear** by default. Do not print target height, scale notes, target use, or other user facts into the board unless explicitly requested.

## Readiness / Completion

A Draft is acceptable only when:

- identity is clear and recognizable;
- construction reads as Minecraft / Blockbench Cuboid form;
- required views describe one compatible object and pose/state;
- articulated subjects preserve required count, plausible attachment, support/contact when applicable, separation, and cross-view pose integrity;
- view pairing is resolvable;
- primary masses/proportions/contacts and important negative spaces are understandable;
- no unresolved major cross-view conflict remains;
- user has approved the image for modelling.

Generation budget remains: one Draft, at most one targeted correction, zero automatic alternatives. If a material conflict survives the correction, return `NOT READY / NEEDS REVIEW`; do not generate variants to simulate progress.

Reference validity never proves final model fidelity.

## Related

- [Modelling Workflow](03-modelling-workflow.md)
- [Geometry Standard](05-geometry-standard.md)
- [Visual Validation](07-visual-validation.md)
