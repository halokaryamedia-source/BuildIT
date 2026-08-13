# BlockIT Foundation Validation Report

**Updated:** 2026-08-13  
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
NON_LOCAL_P0_P7_REFERENCE_POSE_LIMB_HANDOFF_AND_PRO1_PRO8_STATIC_VERIFIED
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

Semantic form precedes exact transforms; visible orientation, pivot ownership, and contact invariants must be decided explicitly. Behavioral image-to-form effectiveness remains `LOCAL PROOF REQUIRED`.

## P6 — Actual Reference Grounding / Claim-Locked Comparison

Reference-driven approval requires the actual approved image plus fresh current model evidence. Filename/path/prose is not visual evidence. End-to-end image understanding/handoff remains direct evidence.

## P7 — Fidelity Convergence / Evaluation Integrity

Correction progress is `IMPROVED | UNCHANGED | REGRESSED`; only improvement without regression counts as progress. Real convergence quality remains `LOCAL PROOF REQUIRED`.

## Reference Generator — Static Hardened Contract

The current reference-preparation contract is statically verified to require:

```text
source image + user intent
→ Internal Generation Brief
→ articulated pose/limb lock when applicable
→ Pre-Generation Readiness Gate
→ one clean multi-view Draft
→ direct visual review
→ user approval
→ approved image + relevant nonvisual Handoff Constraints
```

For articulated subjects, default pose is a **stable natural neutral stance** unless the user explicitly requests another pose. Required limb/appendage count, plausible attachment, coherent support/ground relation, near/far separation, negative spaces, and pose/limb phase must remain consistent across required panels. Orthographic views own structural pose truth; the 3/4 view must not redesign anatomy or limb placement.

By default, the generated board contains **view labels only**. Nonvisual user facts such as target dimensions/scale, target use, or other downstream constraints stay outside image pixels and must be passed explicitly as Handoff Constraints when material to modelling. No manifest/package layer was added for this.

The contract allows one Draft, at most one targeted correction, and zero automatic variants. **Static tests do not certify the quality of a future generated image.** Actual Draft quality and approval remain direct image-capable evidence.

## Professional Sample Forensics — Static / Non-Local

Nine professional `.bbmodel` samples remain learning evidence only. Retained bounded closures are:

```text
PRO-3  place_cube per-element parent + initial inflate
PRO-5  modify_cubes_batch Box-UV authored-state parity
PRO-6  manage_keyframes authored Molang string preservation
PRO-7  create_animation + inspect_animation sound events
PRO-8  inspect_animation read-only AnimationController/state inspection
```

Controller creation/mutation, existing-animation direct sound/timeline-effect mutation, and bone-binding expressions remain deferred. The supplied samples contain no timeline-effect keyframes.

## Current Static Verification

Current GitHub proof: **217 tests / 0 failures**, typecheck PASS, surface PASS, build PASS, generated-doc freshness PASS, aggregate enforcement PASS. Tool count stays **62**; max tool payload **3,167 < 3,200**; runtime workflow prompt **6,995 < 7,000**.

Reference pose/limb/handoff hardening changed instruction/policy/test owners only; it did not add MCP tools, runtime profiles, planners, manifests, or controller capability.

Later Molang/sound/controller-inspection persistence, controller execution, installed-plugin freshness, real call reduction, and visual-quality improvement remain `LOCAL PROOF REQUIRED` if local testing is reactivated.

## Product / Lifecycle / Export

Project lifecycle, editable `.bbmodel`, Bedrock geometry export, and representative save/reopen retain accepted live-baseline evidence.

## Observation / Reference Fidelity

Observation tools retain accepted representative live evidence. P5–P7 model-facing effectiveness and future generated-reference quality retain their direct-evidence boundaries.

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

Current non-local contracts are synchronized through **P0–P7 + hardened Reference Generator + professional PRO-1–PRO-8**. No local run is active. Source expansion remains stopped unless a concrete requirement proves another bounded gap.
