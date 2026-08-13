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
NON_LOCAL_P0_P7_REFERENCE_ORTHOGRAPHIC_BOUNDARIES_AND_PRO1_PRO8_STATIC_VERIFIED
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
runtime workflow prompt:        6,995 characters
```

These are serialized characters, not model-visible tokens.

## Native Deferred MCP Discovery Compatibility

`OFFICIALLY VERIFIED` upstream architecture supports catalog → deferred `tool_search` → matching tool spec loading. Installed client/model parity remains `LOCAL PROOF REQUIRED`. No custom BuildIT router/profile was added.

## P0–P4 Static Efficiency / Decision Proof

P0–P4 retain stage locking, exact-name routing, bounded recovery, and named-defect source/test ownership. These are static decision/retrieval proofs, not installed-model behavioral proof.

## P5 — Semantic Form / Rotation / Contact

Semantic form precedes exact transforms and visible relationships own construction decisions. Behavioral image-to-form effectiveness remains `LOCAL PROOF REQUIRED`.

## P6 — Actual Reference Grounding / Claim-Locked Comparison

Reference-driven approval requires the **actual approved reference image** plus fresh current-revision model evidence. Path/prose/memory is not image evidence. Difference-first comparison remains the approval contract.

## P7 — Fidelity Convergence / Evaluation Integrity

Correction progress is `IMPROVED | UNCHANGED | REGRESSED`; only improvement without regression counts as progress. Evaluation is qualitative and evidence-bound, not a scalar similarity score. Real convergence remains `LOCAL PROOF REQUIRED`.

## Reference Generator — Orthographic Core + Clarified Boundaries

Current reference preparation requires:

```text
source image + user intent
→ Internal Generation Brief
→ SOURCE-NEAREST ORTHOGRAPHIC ANCHOR
→ stable/readable pose + identity-critical articulated-feature state
→ SMALLEST ORTHOGRAPHIC CORE
   → only evidence-bearing views
   → TOP/BACK conditional
   → generated 3/4 diagnostic, not structural authority
   → optional conflicting view may be omitted only if remaining core stays sufficiently constrained
   → otherwise NEEDS REVIEW
→ Pre-Generation Readiness
→ EXECUTION CONSENT GATE
   ├─ fresh explicit user generation instruction → one Draft/correction
   └─ no fresh instruction → STOP; WAIT FOR USER
→ visual gate:
   anchor fidelity
   orthographic coherence
   articulation lock
   support/naturalness
   construction/readability
→ user approval
→ actual approved reference image + relevant Handoff Constraints
```

Five ambiguity closures are now part of the generic contract:

- **Anchor:** the generated anchor is orthographic, while the original Source Image remains visual authority regardless of its camera angle; perspective/lens distortion is normalized rather than copied.
- **Pose normalization:** preserve identity-bearing silhouette and major-mass relationships, not source gait/limb silhouette when the approved modelling pose intentionally changes.
- **View omission:** an optional contradictory view may be removed only when the remaining core still sufficiently constrains every material structure; otherwise the board remains `NEEDS REVIEW`.
- **3/4:** an original Source Image photographed from 3/4 remains evidence authority; only a generated 3/4 panel is diagnostic and never structural authority.
- **Generation budget:** one Draft + at most one targeted correction applies per unchanged Internal Generation Brief/review cycle. A materially changed user-approved source/pose/target/requirement may start a new cycle, but the system never auto-opens a new cycle merely to retry failure.

Pose/articulation rules remain relational, not anatomy presets. Structural correction stays board-level: original Source Image + locked Brief remain authority; failed Draft is defect evidence, not geometry authority; the whole shown core is regenerated rather than patching one panel.

Repository/policy hardening, audit completion, CI success, or `next-action.md` never authorizes image generation. Only panel/view labels appear by default; scale/height/use facts remain Handoff Constraints outside image pixels.

No anatomy engine, pose planner, fixed view preset, manifest/package, new MCP tool, runtime profile, or scoring system was added. Static tests do not certify future generated-image quality; actual Draft quality and approval require direct image-capable evidence.

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

Current GitHub proof: **213 tests / 0 failures**, typecheck PASS, surface PASS, build PASS, generated-doc freshness PASS, aggregate enforcement PASS. Tool count remains **62**; max tool payload remains **3,167 < 3,200**; runtime workflow prompt remains **6,995 < 7,000**.

Later Molang/sound/controller-inspection persistence, controller execution, installed-plugin freshness, real call reduction, and visual-quality improvement remain `LOCAL PROOF REQUIRED` if local testing is reactivated.

## Product / Lifecycle / Export

Project lifecycle, editable `.bbmodel`, Bedrock geometry export, and representative save/reopen retain accepted live-baseline evidence.

## Texture / Paint / PBR

Native texture/Painter/PBR/material-instance capability remains. PRO-5 adds Box-UV batch parity without a new UV tool/preset system.

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

Current non-local contracts are synchronized through **P0–P7 + execution-gated clarified orthographic-core Reference Generator + professional PRO-1–PRO-8**. No local run is active. Source expansion remains stopped unless a concrete requirement proves another bounded gap.
