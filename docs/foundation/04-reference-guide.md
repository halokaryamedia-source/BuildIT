# BlockIT — Reference Guide

**Status:** Active Policy  
**Version:** 2.3  
**Updated:** 2026-08-14

## Purpose

Own the durable Source Image → approved Modelling Brief semantics. Operational generation belongs to `.agents/skills/blockbench-reference-generator/SKILL.md`; this file is not a second prompt or MCP subsystem.

## Authority / Evidence

```text
user brief / approved target   → identity + requested function
original Source Image           → source-visible evidence regardless of camera angle
actual approved reference image → generated visible form + approved modelling pose/state
approved numeric dimensions     → whole-model scale/envelope
Handoff Constraints             → material nonvisual facts outside image
Reference Evidence Map          → derived working index; never image authority
```

The **actual approved reference image** and material original Source Image evidence must be available as multimodal input when used for geometry reasoning. **A path itself is not visual evidence.** A manifest, prose summary, or memory is context only. If relevant image evidence cannot be inspected, material reference-driven geometry/approval is `BLOCKED`.

Default deliverable is the image only. Handoff Constraints are task context, not a ZIP/manifest/package.

## Execution / Readiness

Audit, policy work, CI, or `next-action.md` do **not** authorize generation. After hardening/verification, stop and report; resume only after a **fresh explicit user instruction**.

Prefer zero clarification. Never infer numeric dimensions from pixels or invent hidden features, asymmetry, attachments, articulation, or hidden joint precision. **Generation is output, not discovery.** `READY` requires no unresolved material ambiguity in identity, major form, pose/articulation, required orthographic coverage, or buildability.

## Pose / Articulation

Use the most structurally readable stable pose unless another state is required. Grounded load-bearing subjects default to a **stable natural neutral stance**; a dynamic source pose does not automatically become the modelling pose, and neutral does not mean forced bilateral alignment.

When pose is normalized, preserve **identity-bearing silhouette and major-mass proportion**, not source gait/limb silhouette. Source identity remains authority; the approved modelling pose owns limb configuration.

Across generated views preserve observable pose/limb phase, limb/appendage count, plausible attachment, support/contact, near/far separation and important negative spaces. Identity-critical articulated features preserve visible **root → direction/bend → terminal** state. Duplicated, missing, merged, floating, relocated, or independently re-posed limbs/appendages are invalid.

## Construction

Use the **simplest Blockbench-buildable representation that preserves the visible requirement**. Cuboids, rotated/stepped masses, plane-like Cubes, layered/inflated forms, linked segments, and texture-only treatment are examples, not presets. Do not lazy-voxelize, substitute smooth primitives, or turn sample Cube counts into rules.

## Orthographic Core

A board is the **smallest mutually compatible orthographic view set** that constrains every material structure, not a fixed five-panel turnaround.

Choose a **source-nearest orthographic anchor**: the canonical orthographic direction closest to and best supported by the Source Image. The original Source Image remains authority even when captured from 3/4, elevated, or perspective; the generated anchor normalizes camera projection instead of copying lens distortion.

Add only views needed for missing axes, attachments, asymmetry, footprint, or important negative spaces. If an optional view requires contradictory invention, omit it only when the remaining core stays **sufficiently constrained**. If omission makes the reference materially underconstrained, the result is `NEEDS REVIEW`.

Typical guidance, not a template:

```text
ANCHOR SIDE/FRONT
+ perpendicular orthographic view
+ TOP only when footprint/depth materially matters
+ BACK only when rear structure materially matters
```

TOP, when included, is a true top-down projection of the same structure. **3/4 is not part of the default initial core.** A **generated** 3/4 is diagnostic, never structural authority; this does not reduce the authority of an original Source Image photographed from 3/4.

## Visual Gate / Correction

Review in order:

1. **Anchor fidelity** — source identity, identity-bearing silhouette and major masses; normalized pose may change gait/limb silhouette.
2. **Orthographic coherence** — one structure and remaining coverage stays sufficiently constrained.
3. **Articulation lock**.
4. Support / naturalness.
5. Construction / readability.

Material projection mismatch, articulated drift, pose/support conflict, materially underconstrained core, or cross-view redesign is `NOT READY / NEEDS REVIEW`. Material conflicts **must not be averaged** into a fake compromise. Do not replace qualitative review with numeric scores.

A structural cross-view failure is a **board-level defect**. For the one allowed correction, original Source Image + locked Internal Generation Brief remain authority; failed Draft is defect evidence, **not geometry authority**; regenerate the **whole shown orthographic core**, never one panel independently. **Remove an unnecessary problematic view** only when the remaining core stays sufficiently constrained; otherwise stop at `NEEDS REVIEW`.

## View Pair Map

Map only generated views actually present:

```text
REFERENCE FRONT ↔ MODEL front
REFERENCE BACK  ↔ MODEL back
REFERENCE SIDE  ↔ MODEL matching left/right
REFERENCE TOP   ↔ MODEL top
REFERENCE 3/4   ↔ MODEL matching 3/4 when explicitly present
```

Ambiguous pairing remains `UNVERIFIED`. Original Source Image evidence remains separately available regardless of camera angle.

## Reference Evidence Map

Before exact geometry, derive only material observable claims:

```text
claim_id
kind: identity | mass | landmark | count | topology/contact | orientation | negative_space | representation
observable claim
supporting reference view(s)
evidence: SUPPORTED | PROVISIONAL | CONFLICTING | UNAVAILABLE
```

Claim text describes what is visible, not what the object “usually” has. No Cube coordinates/count/pivot plan or pixel-derived dimensions belong here.

## Dimensions / Image Content

When dimensions are approved: `1 block = 16 Blockbench units`; use them as whole-model target/envelope, not per-Cube transforms. Never derive scale/transforms from pixels, masks, perspective, mesh fitting, or similarity scores.

Target dimensions normally remain **Handoff Constraints outside the image**. **Only panel/view labels may appear by default.** No board title/header/subtitle/note/status/scale/dimensions/target-use text unless explicitly requested.

## Completion / Generation Budget

A Draft is acceptable only when identity, orthographic-core coherence, pose/articulation integrity, buildability, present-view pairing, primary masses/contacts and important negative spaces are usable and the user approves the image.

For one **unchanged Internal Generation Brief / review cycle**: one Draft, at most one targeted correction, zero automatic alternatives. A materially new user-approved source, pose, target, or requirement begins a new review cycle; the system must not open a new cycle automatically merely to retry a failed correction.

Reference validity never proves final model fidelity.

## Related

- [Modelling Workflow](03-modelling-workflow.md)
- [Geometry Standard](05-geometry-standard.md)
- [Visual Validation](07-visual-validation.md)
