# BlockIT — Reference Guide

**Status:** Active Policy  
**Version:** 3.1  
**Updated:** 2026-09-09

## Purpose

Own durable Source Image → Approved Reference semantics. Operational image generation belongs in **ChatGPT** using `.agents/skills/blockbench-reference-generator/SKILL.md` as the specification. Codex/BlockIT consumes the approved image.

The goal is a recognizable, Minecraft-appropriate, Blockbench-buildable interpretation, not exact real-world reconstruction. A generated reference **does not need to be 100% identical** to the source when a simpler Minecraft interpretation preserves identity and buildability.

A canonical five-view board is **preferred for stronger coverage**, not mandatory for every asset. `DIRECT` may use the original source image itself as the Approved Reference when its visible evidence is sufficient. `3D_ASSISTED` requires the canonical five-view board.

## Authority / Evidence

```text
user brief / approved target        → identity + requested function
original Source Image               → source-visible evidence regardless of camera angle
actual Approved Reference Image     → visual modelling authority; source image or canonical board
approved numeric dimensions         → whole-model scale/envelope
user technical constraints          → downstream facts outside the image
```

The **actual Approved Reference Image** must be available as multimodal input when used for reference-driven visual reasoning. A path itself is not visual evidence. A manifest, prose summary, filename, or memory is context only.

When the original Source Image is used directly for `DIRECT`, it serves as both source-visible evidence and the Approved Reference Image. Do not invent a second authority layer merely because no generated board exists.

## Execution Boundary

Repository/policy work, audit, CI, or Codex asset authoring never implicitly authorizes reference generation. Generate/edit only from a fresh explicit user instruction in ChatGPT.

After approval, normal handoff to Codex is:

```text
actual Approved Reference Image + user message
```

No ZIP, JSON sidecar, manifest, coordinate sheet, or modelling blueprint is required. An actual image explicitly sent to Codex for modelling is approved unless the user marks it draft/not ready.

## Progressive Reference Intake

Accept the user's actual image first. Do not force reference-board generation as intake ceremony.

```text
actual image supplied
→ user selects DIRECT
   → evidence sufficient for material modelling decisions
      → use image directly as Approved Reference
   → material evidence missing/conflicting
      → request only the smallest decision-changing extra source image/detail
      → if still materially insufficient, recommend canonical board or mark BLOCKED

actual image supplied
→ user selects 3D_ASSISTED
   → canonical five-view board present and crop-safe
      → continue
   → otherwise
      → request board preparation in ChatGPT; do not improvise extraction
```

The preferred escalation order is:

```text
current supplied image
→ one decision-changing additional source view/detail when needed
→ canonical five-view board when stronger normalized coverage is needed
```

Do not automatically regenerate a board, open a new strategy, add a reference mode, or ask for extra views that cannot change the next decision.

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

Every **generated canonical board** uses one fixed normalized layout:

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

If identity-critical structure exists on a side not sufficiently visible in the canonical five views, do not invent it. Ask for one additional source image/detail or mark the unresolved material claim `UNAVAILABLE` / `CONFLICTING`.

## 3D-Assisted Derived Views

`3D_ASSISTED` requires the canonical five-view board. Codex/local tooling deterministically derives `LEFT`, `FRONT`, and `BACK` from known normalized regions. `TOP` and `FRONT-LEFT 3/4` remain additional validation evidence.

Derived crops are **not new authority**. The full actual Approved Reference Image and original Source Image evidence remain authority.

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
→ best-supported Approved Reference view(s)
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

This map applies when those canonical board views exist. For a direct original source image, compare only views that the source actually supports; do not fabricate canonical view correspondence.

Ambiguous/mirrored pairing remains `UNVERIFIED`; do not silently compare the closest-looking view.

## Visual Gate

A generated Draft is acceptable only when it is recognizable, geometry-buildable, texture-useful, free of material cross-view contradiction, crop-safe, and approved by the user.

For one unchanged Internal Generation Brief / automatic review cycle:

```text
first draft            = maximum 1
targeted correction    = maximum 1
automatic alternatives = 0
```

A fresh explicit **user-directed correction** after review starts a new user-led review cycle and permits one revised board even when the previous automatic correction budget was used. This is not an automatic retry: apply the requested change once, preserve still-valid relationships, then stop for user review again.

A materially new user-approved source, pose, target, or requirement also begins a new review cycle. Do not open a new cycle automatically to bypass a failed correction.

## Image Content / Completion

Requested dimensions and technical constraints stay **outside the image** and are collected by Codex during the new-model Requirement Gate. Reference validity never proves final model fidelity.

## Related

- [Product Requirements](02-product-requirements.md)
- [Modelling Workflow](03-modelling-workflow.md)
- [Geometry Standard](05-geometry-standard.md)
- [Visual Validation](07-visual-validation.md)
- [Current Flow](../knowledge/flow.md)
