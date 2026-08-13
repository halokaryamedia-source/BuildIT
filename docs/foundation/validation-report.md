# BlockIT Foundation Validation Report

**Updated:** 2026-08-14  
**Scope:** current `Local`, accepted 2026-08-12 live baseline, P0–P7, hardened Reference Generator, and professional PRO-1–PRO-8 static closures.

This page owns proof state. Active execution belongs in `docs/knowledge/next-action.md`.

## Evidence Labels

- `CURRENT-PROJECT VERIFIED` — target-environment proof exists for the exact claim.
- `OFFICIALLY VERIFIED` — authoritative upstream evidence supports the semantics.
- `LOCAL PROOF REQUIRED` — source/contract exists but direct runtime/model-facing proof is still required.
- `UNSUPPORTED` — evidence rejects the method.
- `UNKNOWN` — evidence is insufficient.

## Functional Status

```text
LOCAL_ACCEPTANCE_COMPLETE
NON_LOCAL_P0_P7_REFERENCE_MINECRAFT_FIRST_FIVE_PREVIEW_AND_PRO1_PRO8_STATIC_VERIFIED
NO_LOCAL_RUN_ACTIVE
```

The 2026-08-12 Blockbench 5.1.6 pass remains the accepted live baseline. Later reasoning, Reference Generator, and professional-sample changes are static/CI proof unless explicitly stated otherwise.

## Accepted Live Baseline — 2026-08-12

Representative `CURRENT-PROJECT VERIFIED` coverage: loopback/stateless transport, 62-tool default surface, geometry/correction/Undo, difference-first reference behavior, texture/Paint/PBR/material instances, base animation create/inspect/timeline/playback, Locator/Null Object lifecycle, `.bbmodel` persistence, and Bedrock geometry export.

## Fresh GitHub-Only Serialized Surface Proof

```text
initialize instructions:       386 characters
tool count:                     62
tools/list response:            76,439 characters
tools array:                    76,395 characters
input schemas:                  53,493 characters
descriptions:                   10,645 characters
per-tool payload:               p50 1,082 / p90 2,149 / p95 2,268 / max 3,167
runtime workflow prompt:        6,959 characters
```

These are serialized characters, not model-visible tokens.

## Native Deferred MCP Discovery Compatibility

`OFFICIALLY VERIFIED` upstream architecture supports catalog → deferred `tool_search` → matching tool spec loading. Installed client/model parity remains `LOCAL PROOF REQUIRED`. No custom BuildIT router/profile was added.

## P0–P4 Static Efficiency / Decision Proof

P0–P4 retain stage locking, exact-name routing, bounded recovery, and named-defect source/test ownership. These are static decision/retrieval proofs, not installed-model behavioral proof.

## P5 — Semantic Form / Rotation / Contact

Semantic form precedes exact transforms and visible relationships own construction decisions. Behavioral image-to-form effectiveness remains `LOCAL PROOF REQUIRED`.

## P6 — Actual Reference Grounding / Claim-Locked Comparison

Reference-driven approval requires the **actual approved reference image** plus fresh current-revision model evidence. Path/prose/memory is not image evidence. Difference-first comparison remains the approval contract. A **View Pair Map** and **Reference Evidence Map** remain explicit evidence owners; ambiguous pairings stay `UNVERIFIED`.

## P7 — Fidelity Convergence / Evaluation Integrity

Correction progress is `IMPROVED | UNCHANGED | REGRESSED`; only improvement without regression counts as progress. Evaluation is qualitative and evidence-bound, not a scalar similarity score. Real convergence remains `LOCAL PROOF REQUIRED`.

## Reference Generator — Minecraft-First Five-Preview Contract

Current reference preparation requires:

```text
source image + user intent
→ Internal Generation Brief
→ MINECRAFT-FIRST GEOMETRY + TEXTURE TARGET
→ SOURCE-NEAREST ORTHOGRAPHIC ANCHOR
→ stable/readable pose + articulated-feature intent
→ FIVE-PREVIEW COVERAGE BOARD
   UPPER: SIDE | FRONT | BACK
   LOWER: TOP / FOOTPRINT | FRONT-SIDE 3/4
→ Pre-Generation Readiness
→ EXECUTION CONSENT GATE
   ├─ fresh explicit user generation instruction → one Draft/correction
   └─ no fresh instruction → STOP; WAIT FOR USER
→ visual gate:
   recognizability / source identity
   geometry buildability
   texture usability
   no material cross-view contradiction
   presentation/readability
→ user approval
→ actual approved reference image + relevant Handoff Constraints
```

The five previews are **broad Minecraft modelling evidence, not five exact technical drawings**. SIDE/FRONT/BACK/TOP provide construction evidence and generated 3/4 provides supplemental volume/readability evidence. TOP gives useful footprint/depth guidance without requiring engineering-perfect projection.

Reference fidelity is **Minecraft-first**. Geometry preserves recognizable silhouette, primary masses/counts, topology/attachment, important negative spaces, and Blockbench buildability rather than exact real-world anatomy or contour. Texture preserves base palette, major color/material regions, part separation, and identity-critical markings rather than photoreal micro-detail.

Minor preview drift—small curl/angle/contour/overlap/shade/marking differences—does not invalidate a recognizable and buildable reference. Downstream modelling/texturing resolves minor discrepancy into **one canonical Minecraft interpretation**:

```text
explicit user requirement
→ original Source Image evidence
→ best-supported approved reference view(s)
→ simplest recognizable Blockbench-buildable interpretation
```

Minor drift is not `BLOCKED` and must not be averaged. Only unresolved **material** contradiction affecting identity, primary mass/required count, topology/attachment, important negative space, Minecraft buildability, or identity-critical texture/material information becomes `CONFLICTING / BLOCKED`.

Structural correction remains board-level. A fix that helps one view while materially regressing another is rejected; runtime workflow explicitly rejects cross-view regression. Repository/policy hardening, audit completion, CI success, or `next-action.md` never authorizes image generation.

Only panel/view labels appear by default; scale/height/use facts remain Handoff Constraints outside image pixels. No anatomy engine, pose planner, scorer, similarity authority, new MCP tool, runtime profile, or asset-specific preset was added. Static tests do not certify future generated-image quality; actual Draft quality and final model quality still require image-capable/local evidence.

## Professional Sample Forensics — Static / Non-Local

Nine professional `.bbmodel` samples remain learning evidence only. Retained bounded closures are:

```text
PRO-3  place_cube per-element parent + initial inflate
PRO-5  modify_cubes_batch Box-UV authored-state parity
PRO-6  manage_keyframes authored Molang string preservation
PRO-7  create_animation + inspect_animation sound events
PRO-8  inspect_animation read-only AnimationController/state inspection
```

Controller creation/mutation, existing-animation direct sound/timeline-effect mutation, and bone-binding expressions remain deferred.

## Current Static Verification

Current GitHub proof: **209 tests / 0 failures**, typecheck PASS, surface PASS, build PASS, generated-doc freshness PASS, aggregate enforcement PASS. Tool count remains **62**; max tool payload remains **3,167 < 3,200**; runtime workflow prompt remains **6,959 < 7,000**.

Later Molang/sound/controller-inspection persistence, controller execution, installed-plugin freshness, real call reduction, and visual-quality improvement remain `LOCAL PROOF REQUIRED` if local testing is reactivated.

## Product / Lifecycle / Export

Project lifecycle, editable `.bbmodel`, Bedrock geometry export, and representative save/reopen retain accepted live-baseline evidence.

## Texture / Paint / PBR

Native texture/Painter/PBR/material-instance capability remains. PRO-5 adds Box-UV batch parity without a new UV tool/preset system. Minecraft-first texture judgement now tolerates minor surface drift while material identity/channel contradictions remain blockers.

## Animation / Rig

`manage_keyframes` preserves authored Molang strings without evaluation. PRO-7 adds bounded new-animation sound events. PRO-8 adds read-only AnimationController/state inspection while preserving authored external animation keys. Controller creation/mutation remains deferred.

## Locator / Null Object

Direct Locator/Null Object lifecycle ownership and representative reopen persistence retain accepted baseline evidence.

## Protected Native Capability Gaps

```text
TextureMesh direct authoring/inspection
native Bedrock visible bounding-box fields
animation controller creation/mutation
existing-animation direct sound/timeline-effect mutation
animated-texture authoring
bone-binding expressions
```

## Explicitly Unsupported As Modelling Authority

Automatic image→geometry truth, similarity scores as visual approval, metadata/prose as image evidence, mutation success as visual approval, arbitrary fallback transforms, and sample-specific rules are unsupported.

## Current Evidence Boundary

Current non-local contracts are synchronized through **P0–P7 + execution-gated Minecraft-first five-preview Reference Generator + minor/material canonicalization + professional PRO-1–PRO-8**. No local run is active. Source expansion remains stopped unless a concrete requirement proves another bounded gap.
