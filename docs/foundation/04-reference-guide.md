# BlockIT — Reference Guide

**Status:** Active Policy  
**Version:** 3.0  
**Updated:** 2026-09-05

## Purpose

Own durable Source Image → Approved Reference semantics. Operational image generation belongs in **ChatGPT** using `.agents/skills/blockbench-reference-generator/SKILL.md` as the specification. Codex/BlockIT consumes the approved output.

The goal is a recognizable, Minecraft-appropriate, Blockbench-buildable interpretation, not exact real-world reconstruction. The approved reference **does not need to be 100% identical** to the source when a simpler Minecraft interpretation preserves identity and buildability.

## Authority / Evidence

```text
user brief / approved target   → identity + requested function
original Source Image           → source-visible evidence regardless of camera angle
actual approved reference image → Minecraft-oriented geometry + texture guidance
approved numeric dimensions     → whole-model scale/envelope
user technical constraints      → downstream facts outside the image
```

The **actual approved reference image** must be available as multimodal input when used for reference-driven visual reasoning. A path itself is not visual evidence. A manifest, prose summary, filename, or memory is context only.

## Execution Boundary

Repository/policy work, audit, CI, or Codex asset authoring never implicitly authorizes reference generation. Generate/edit only from a fresh explicit user instruction in ChatGPT.

After approval, normal handoff to Codex is:

```text
actual approved reference image + user message
```

No ZIP, JSON sidecar, manifest, coordinate sheet, or modelling blueprint is required. An image explicitly sent to Codex for modelling is approved unless the user marks it draft/not ready.

## Minecraft-First Fidelity

Reference fidelity is identity-first and buildability-first, not pixel-copy-first.

### Geometry

Preserve recognizable silhouette, major masses, defining part count, attachments/topology, important negative spaces, and identity-critical features. Prefer the simplest Blockbench-buildable form preserving those requirements.

### Texture

Preserve base palette, major color/material regions, part separation, and identity-critical markings. Texture supports geometry; it must not fake required silhouette or missing structure. Minor shade/noise/marking drift is acceptable when identity/material reading remains clear.

## Pose / Articulation

Use the most structurally readable stable pose unless another state is required. Preserve identity-bearing silhouette/major-mass proportion and visible root → direction/bend → terminal intent for identity-critical articulated features without inventing hidden joint precision.

Duplicated/missing required parts, changed part count, incompatible attachment/topology, or structurally different major masses are material defects.

## Canonical Five-View Board

Every normal new-model reference board uses one fixed normalized layout:

```text
UPPER: LEFT | FRONT | BACK
LOWER: TOP  | FRONT-LEFT 3/4
```

Do not dynamically choose RIGHT, use generic `SIDE`, or reorder views per asset.

- `LEFT`, `FRONT`, `BACK`, `TOP` are orthographic construction evidence.
- `FRONT-LEFT 3/4` is supplemental volume/readability evidence and never overrides stronger orthographic/source evidence.
- five views describe one intended Minecraft model, not five exact engineering drawings.
- image resolution may vary; normalized region identity remains fixed.

The board is crop-safe for later 3D-Assisted use. Keep each subject fully inside its region with neutral uniform background, consistent scale, and generous separation. Do not allow subject/shadow/prop content to cross into another region.

Default board contains no panel border, divider, label, title, header, note, dimensions, target-use text, Blockbench UI/gizmos, gameplay UI, or cinematic scene.

## 3D-Assisted Derived Views

If the user later chooses `3D_ASSISTED`, Codex/local tooling deterministically derives `LEFT`, `FRONT`, and `BACK` from known normalized regions. `TOP` and `FRONT-LEFT 3/4` remain additional validation evidence.

Derived crops are **not new authority**. The full actual approved reference image remains visual authority.

If deterministic extraction is unusable because subject crosses slots, is materially cropped, or required view is wrong, 3D-Assisted becomes `BLOCKED`. Do not improvise a crop, substitute another view, or create an automatic layout detector; ask user to repair/regenerate the board in ChatGPT.

## Material Consistency

A discrepancy is material only when it changes identity, primary mass/required part count, topology/attachment, important negative space, Minecraft buildability, or identity-critical texture/material information.

Minor cross-view drift does not invalidate an otherwise recognizable/buildable board. Material conflicts must not be averaged into invented geometry.

## Downstream Interpretation

For a material modelling decision, retain explicit evidence states:

```text
claim | observable requirement | supporting view | SUPPORTED | PROVISIONAL | CONFLICTING | UNAVAILABLE
```

Claim text describes what is visible, not what the object “usually” has. No Cube coordinates/count/pivot plan or pixel-derived dimensions belong in reference evidence.

Preference order for minor discrepancy:

```text
explicit user requirement
→ original Source Image evidence
→ best-supported approved reference view(s)
→ simplest recognizable Blockbench-buildable interpretation
```

Only unresolved material conflict becomes `CONFLICTING` / `BLOCKED`.

## View Pair Map

Use a View Pair Map only when comparison identity is material:

```text
REFERENCE FRONT      ↔ MODEL front
REFERENCE BACK       ↔ MODEL back
REFERENCE LEFT       ↔ MODEL left
REFERENCE TOP        ↔ MODEL top
REFERENCE FRONT-LEFT ↔ MODEL front-left 3/4
```

Ambiguous/mirrored pairing remains `UNVERIFIED`; do not silently compare the closest-looking view.

## Visual Gate

A Draft is acceptable only when it is recognizable, geometry-buildable, texture-useful, free of material cross-view contradiction, crop-safe, and approved by the user.

For one unchanged Internal Generation Brief / review cycle:

```text
first draft            = maximum 1
targeted correction    = maximum 1
automatic alternatives = 0
```

A materially new user-approved source, pose, target, or requirement begins a new review cycle. Do not open a new cycle automatically to bypass a failed correction.

## Image Content / Completion

Requested dimensions and technical constraints stay **outside the image** and are collected by Codex during the new-model Requirement Gate. Reference validity never proves final model fidelity.

## Related

- [Product Requirements](02-product-requirements.md)
- [Modelling Workflow](03-modelling-workflow.md)
- [Geometry Standard](05-geometry-standard.md)
- [Visual Validation](07-visual-validation.md)
- [Current Flow](../knowledge/flow.md)
