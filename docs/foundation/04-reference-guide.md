# BlockIT — Reference Guide

**Status:** Active Policy  
**Version:** 2.4  
**Updated:** 2026-08-14

## Purpose

Own the durable Source Image → approved Modelling Brief semantics. Operational generation belongs to `.agents/skills/blockbench-reference-generator/SKILL.md`; this file is not a second prompt or MCP subsystem.

The goal is a **recognizable, Minecraft-appropriate, Blockbench-buildable interpretation**, not exact real-world reconstruction.

## Authority / Evidence

```text
user brief / approved target   → identity + requested function
original Source Image           → source-visible evidence regardless of camera angle
actual approved reference image → Minecraft-oriented geometry + texture guidance
approved numeric dimensions     → whole-model scale/envelope
Handoff Constraints             → material nonvisual facts outside image
Reference Evidence Map          → derived working index; never image authority
```

The **actual approved reference image** and material original Source Image evidence must be available as multimodal input when used for geometry reasoning. **A path itself is not visual evidence.** A manifest, prose summary, or memory is context only. If relevant image evidence cannot be inspected, material reference-driven geometry/approval is `BLOCKED`.

## Execution / Readiness

Audit, policy work, CI, or `next-action.md` do **not** authorize generation. After hardening/verification, stop and report; resume only after a **fresh explicit user instruction**.

Prefer zero clarification. Never infer numeric dimensions from pixels or invent identity-changing hidden structure. **Generation is output, not discovery.** `READY` requires no unresolved ambiguity that could materially change identity, primary geometry, required topology/attachment, Minecraft buildability, or identity-critical texture information.

## Minecraft-First Fidelity

Reference fidelity is **identity-first and buildability-first**, not pixel-copy-first.

### Geometry

Preserve recognizable silhouette, major masses, defining part count, attachments/topology, important negative spaces, and identity-critical features. Prefer the simplest Blockbench-buildable form that preserves those requirements. Exact anatomy, contour, pose, or engineering-grade projection is not required when a simpler Minecraft interpretation remains recognizable.

### Texture

Preserve base palette, major color/material regions, part separation, and identity-critical markings. Texture supports geometry; it must not fake required silhouette or missing structure. Prefer Minecraft-readable pixel treatment over photoreal micro-detail, dense noise, wrinkles, or baked lighting.

Minor shade/noise/marking drift between previews is acceptable when identity and material reading remain clear.

## Pose / Articulation

Use the most structurally readable stable pose unless another state is required. Grounded load-bearing subjects default to a stable natural neutral stance; a dynamic source pose does not automatically become the modelling pose, and neutral does not mean forced bilateral alignment.

When pose is normalized, preserve **identity-bearing silhouette and major-mass proportion**, not source gait/limb silhouette. Identity-critical articulated features should preserve visible **root → direction/bend → terminal** intent, but a small terminal-angle/curl discrepancy is minor when it does not change identity, attachment, buildability, or the intended Minecraft form.

Duplicated/missing required parts, changed part count, incompatible attachment/topology, or structurally different major masses are material defects.

## Five-Preview Coverage Board

Default reference output provides broad modelling coverage:

```text
UPPER: SIDE | FRONT | BACK
LOWER: TOP / FOOTPRINT | FRONT-SIDE 3/4
```

Use the same source-supported LEFT/RIGHT side for SIDE and FRONT-SIDE 3/4 and label it explicitly when known. The source-nearest orthographic view is the anchor.

- SIDE / FRONT / BACK / TOP provide orthographic construction evidence.
- TOP provides footprint/depth guidance; engineering-perfect projection is not required.
- generated 3/4 is supplemental readability evidence and never overrides stronger orthographic/source evidence.
- five previews are broad evidence for one intended Minecraft model, **not five exact technical drawings**.

Minor cross-view drift—small curl/angle changes, slight contour differences, overlap differences, shade changes, or marking placement drift—does not invalidate an otherwise recognizable and buildable reference.

A discrepancy is **material** only when it changes identity, primary mass/required part count, topology/attachment, important negative space, Minecraft buildability, or identity-critical texture/material information. Material conflicts **must not be averaged** into invented geometry.

## Canonical Interpretation Downstream

Minor reference imperfections are resolved during modelling/texturing by selecting **one canonical Minecraft interpretation** and using it consistently. Preference order:

```text
explicit user requirement
→ original Source Image evidence
→ best-supported approved reference view(s)
→ simplest recognizable Blockbench-buildable interpretation
```

This is judgement, not a new score/profile/manifest. Minor drift is not `BLOCKED`. Only unresolved **material** contradiction becomes `CONFLICTING` / `BLOCKED`.

## View Pair Map

Map generated views actually present:

```text
REFERENCE FRONT ↔ MODEL front
REFERENCE BACK  ↔ MODEL back
REFERENCE SIDE  ↔ MODEL matching left/right
REFERENCE TOP   ↔ MODEL top
REFERENCE 3/4   ↔ MODEL matching 3/4 when explicitly present
```

**Ambiguous front/back, left/right, or 3/4 pairing remains `UNVERIFIED`.** Original Source Image evidence remains separately available regardless of camera angle.

## Reference Evidence Map

Before exact geometry, derive only material observable claims:

```text
claim_id
kind: identity | mass | landmark | count | topology/contact | orientation | negative_space | representation
observable claim
supporting reference view(s)
evidence: SUPPORTED | PROVISIONAL | CONFLICTING | UNAVAILABLE
```

**Claim text describes what is visible**, not what the object “usually” has. No Cube coordinates/count/pivot plan or pixel-derived dimensions belong here. Minor preview variation does not need a separate claim unless it changes a material decision.

## Image Content / Completion

Target dimensions normally remain **Handoff Constraints outside the image**. **Only panel/view labels may appear by default.** No board title/header/subtitle/note/status/scale/dimensions/target-use text unless explicitly requested.

A Draft is acceptable when it is recognizable, geometry-buildable, texture-useful, free of material contradiction, and user-approved. It does **not** need to be 100% identical to the source.

For one **unchanged Internal Generation Brief / review cycle**: one Draft, at most one targeted correction, zero automatic alternatives. A materially new user-approved source, pose, target, or requirement begins a new review cycle; the system must not open a new cycle automatically merely to retry a failed correction.

Reference validity never proves final model fidelity.

## Related

- [Modelling Workflow](03-modelling-workflow.md)
- [Geometry Standard](05-geometry-standard.md)
- [Visual Validation](07-visual-validation.md)
