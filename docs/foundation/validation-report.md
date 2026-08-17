# BlockIT Foundation Validation Report

**Updated:** 2026-08-18  
**Scope:** current `Local`, accepted 2026-08-12 live baseline, P0–P7, Minecraft-first Reference Generator, professional PRO-1–PRO-8 closures, pre-local optimization, bounded AnimationController mutation, and repository reliability R1–R4. Local acceptance is user-deferred.

This page owns proof state. Active execution belongs in `docs/knowledge/next-action.md`; local execution procedure belongs in `docs/knowledge/operations/local-acceptance-runbook.md` only when explicitly reactivated.

## Evidence Labels

- `CURRENT-PROJECT VERIFIED` — target-environment proof exists for the exact claim.
- `OFFICIALLY VERIFIED` — authoritative upstream evidence supports the semantics.
- `LOCAL PROOF REQUIRED` — source/contract exists but direct runtime/model-facing proof is still required.
- `UNSUPPORTED` — evidence rejects the method.
- `UNKNOWN` — evidence is insufficient.

## Proof Surface Taxonomy

Evidence labels describe claim state; proof surfaces describe **where the evidence actually came from**. A materially runtime-facing claim should preserve both rather than treating one successful surface as universal proof.

```text
STATIC            exact source/schema/docs or deterministic static inspection
CI                completed matching contract/build/test workflow on the exact commit
HOSTED-RUNTIME    exact hosted runtime/process actually executed
VISUAL            actual generated/rendered image evidence was retrieved and inspected
LOCAL-RUNTIME     exact local BlockIT/Blockbench artifact actually executed
PRODUCTION        actual release/deployment/production environment operation succeeded
```

Rules:

- one proof surface never upgrades a different execution surface;
- `CI` does not imply `LOCAL-RUNTIME`, `VISUAL`, or `PRODUCTION`;
- `HOSTED-RUNTIME` does not prove desktop BlockIT behavior;
- `VISUAL` requires actual inspection of the relevant image/view, not artifact existence;
- `CURRENT-PROJECT VERIFIED` applies only to the exact claim and matching executed surface;
- `LOCAL PROOF REQUIRED` remains until the required local surface actually runs.

Example:

```text
CURRENT-PROJECT VERIFIED / HOSTED-RUNTIME + VISUAL
≠ LOCAL-RUNTIME VERIFIED
```

## Retained Runtime / Artifact Evidence Record

When runtime or artifact proof is retained as acceptance evidence, keep one compact `manifest.json`, `proof.json`, or equivalent record. Include only applicable fields:

```text
source commit/ref
run/job identity
execution surface
material input digest
output filenames + digest/byte size
status + last completed stage
cleanup state when a process/server/browser was launched
visual-inspection state when visual proof is claimed
```

This is reproducibility evidence, not telemetry. Do not create a persistent tracking service or duplicate large artifact contents inside the manifest.

Recommended generic runtime stages:

```text
validate_input
→ pin_source
→ environment_setup
→ launch_runtime
→ execute
→ capture_or_compile
→ write_artifact
→ cleanup
```

Domain-specific stages may refine this list. A retained failure should identify at least `stage`, failure category/owner, and message so a harness/environment failure is not mislabeled as a product/runtime failure.

## Mutation Reconciliation Boundary

GitHub mutation recovery remains owned by `GITHUB_RULES.md`. For ambiguous mutation outcomes, the evidence state must be reconciled before retry:

```text
PRESENT_AS_INTENDED       → accept current repository state; do not duplicate the mutation
ABSENT_SAFE_TO_RETRY      → one evidence-bearing retry may proceed within the retry budget
CONFLICTING_OR_UNKNOWN    → STOP and diagnose; no blind retry
```

A timeout/5xx is not proof of either success or failure. Permission/capability denial remains zero-retry until new evidence changes the condition.

## Functional Status

```text
ACCEPTED LIVE BASELINE (2026-08-12): LOCAL_ACCEPTANCE_COMPLETE
CURRENT HEAD STATE:                 PRELOCAL_CONTROLLER_MUTATION_READY
CURRENT SOURCE/CI:                  STATIC VERIFIED
CURRENT LOCAL RUN:                  NO LOCAL RUN ACTIVE
LOCAL ACCEPTANCE:                   DEFERRED
```

The 2026-08-12 Blockbench 5.1.6 pass remains the accepted live baseline. Later hardening, optimization, and controller-mutation work is source/static proof unless explicitly stated otherwise.

**Do not claim live Blockbench/model-quality, controller execution, or runtime-usage improvement without actual runtime proof on the current local artifact.**

## Static Pre-local Optimization Closure

```text
U1  repository regression preflight + coherent logical patching
U2  targeted tests/invariants read before owner edits
U3  known/coherent place_cube(elements=[...]) batching without batching uncertainty
U4  affected-view-first correction verification with material-risk expansion only
U5  meaningful workspace persistence; no mutation-count checkpoint ritual
U6  canonical documentation ownership; historical review/decision residue removed
U7  NO CHANGE REQUIRED for lean profile/router/runtime-prompt redesign without installed-client evidence
```

Actual runtime call reduction and installed-client context cost remain `LOCAL PROOF REQUIRED`.

## AnimationController Mutation — Static / Non-Local

The controller closure adds **one** default experimental tool: `manage_animation_controller`. It stays inside the existing animation family and does not add a registration profile, router, controller framework, or generic UI fallback.

One call accepts up to 32 ordered operations and owns one native `animation_controllers` Undo transaction. The tool preflights the complete in-memory plan before native mutation, rejects no-effect/invalid state-machine operations, rolls back an unexpectedly failed native apply with `Undo.cancelEdit(true)`, and returns controller identity plus affected state/created IDs so an immediate `inspect_animation` readback is unnecessary.

Supported mutation scope:

```text
controller rename
state add / update / remove
initial-state selection
transition add / update / remove
animation-link add / update / remove
state on_entry / on_exit
scalar blend_transition
blend_via_shortest_path
```

Native Blockbench source was inspected for `AnimationController`, `AnimationControllerState`, controller codec semantics, and controller Undo ownership. This supports the source design but **does not** prove the current built plugin executes correctly in live Blockbench; that remains `LOCAL PROOF REQUIRED`.

Protected controller sub-gaps remain state particle/sound mutation and blend-curve mutation. Existing-animation direct sound/timeline-effect mutation also remains a gap.

## Deferred Local Acceptance Target

Local acceptance is **not active**. When a fresh explicit instruction later reactivates it, the target remains:

```text
fresh Local build
→ exact Git HEAD + mcp/dist/mcp.js SHA-256
→ load exact local BlockIT artifact
→ restart Blockbench + reconnect MCP
→ verify endpoint + 63-tool default surface
→ verify:stateless-local
→ TEST 1 — MCP / CORE MECHANICS including controller create/mutate/inspect
→ persistence / export
→ TEST 2 — REFERENCE MODEL (ELEPHANT)
→ efficiency check
```

Installed-plugin freshness, runtime behavior on the current build, controller execution, current persistence/export behavior, actual call efficiency, and current elephant model quality remain `LOCAL PROOF REQUIRED` until an explicitly reactivated run occurs.

## Accepted Live Baseline — 2026-08-12

Representative `CURRENT-PROJECT VERIFIED` coverage: loopback/stateless transport, the then-current **62-tool** default surface, geometry/correction/Undo, difference-first reference behavior, texture/Paint/PBR/material instances, base animation create/inspect/timeline/playback, Locator/Null Object lifecycle, `.bbmodel` persistence, and Bedrock geometry export.

This baseline is historical live evidence; it is **not** proof that the current 63-tool artifact has been loaded locally.

## Fresh GitHub-Only Serialized Surface Proof

The current source guard is deliberately budget-based so capability additions cannot silently expand context cost:

```text
tool count                      63 exactly
initialize instructions         <= 700 characters
tools/list response             <= 80,500 characters
input schemas                   <= 56,500 characters
descriptions                    <= 11,500 characters
per-tool payload max            <= 3,200 characters
runtime workflow prompt         < 7,000 characters
```

`bun run measure:surface` emits exact current serialized values in CI. Serialized characters are not model-visible token counts. The controller capability did **not** receive a larger max-per-tool allowance.

## Plugin / MCP Static Readiness

```text
default profile              bedrock_entity
endpoint                     http://127.0.0.1:3000/bb-mcp
transport                    loopback-only stateless Streamable HTTP / JSON
Extended MCP Families        OFF by default
risky_eval                   disabled
from_geo_json                disabled
production artifact          mcp/dist/mcp.js
```

Plugin lifecycle owns the HTTP server and closes active sockets during unload. Disabled tools remain excluded from enabled server registration and panel Tool Test execution.

## Codex / Agent Routing State

Normal asset authoring routes from current intent + known state + stage to the exact MCP tool and only the active specialist.

```text
known fresh identity/state → reuse it
known tool spec            → execute; do not search again
unknown/stale target       → focused discovery only
fresh mutation result      → do not ritual read back
known coherent Cubes       → one place_cube(elements=[...]) call
coherent controller work   → one manage_animation_controller operation batch
controller returned state  → reuse; inspect only when extra detail is needed
visual correction          → affected view(s) first; expand only for material cross-view risk
same causal failure twice without new evidence → BLOCKED
```

Real installed-client call reduction remains `LOCAL PROOF REQUIRED`.

## Native Deferred MCP Discovery Compatibility

`OFFICIALLY VERIFIED` upstream architecture supports catalog → deferred `tool_search` → matching tool spec loading. Static evaluation includes the controller tool while retaining a routed top-8 coverage gate. Installed client/model parity and actual schema/context cost remain `LOCAL PROOF REQUIRED`. No custom BuildIT router/profile was added.

## P0–P4 Static Efficiency / Decision Proof

P0–P4 retain stage locking, exact-name routing, bounded recovery, and named-defect source/test ownership. These are static decision/retrieval proofs, not installed-model behavioral proof.

## P5 — Semantic Form / Rotation / Contact

Semantic form precedes exact transforms and visible relationships own construction decisions. Behavioral image-to-form effectiveness remains `LOCAL PROOF REQUIRED`.

## P6 — Actual Reference Grounding / Claim-Locked Comparison

Reference-driven approval requires the **actual approved reference image** plus fresh current-revision model evidence. Path/prose/memory is not image evidence. Difference-first comparison remains the approval contract. A **View Pair Map** and **Reference Evidence Map** remain explicit evidence owners; ambiguous pairings stay `UNVERIFIED`.

## P7 — Fidelity Convergence / Evaluation Integrity

Correction progress is `IMPROVED | UNCHANGED | REGRESSED`; only improvement without regression counts as progress. Evaluation is qualitative and evidence-bound, not a scalar similarity score. Real convergence remains `LOCAL PROOF REQUIRED`.

## Reference Generator — Minecraft-First Five-Preview Contract

Current reference preparation remains execution-gated and Minecraft-first:

```text
source image + user intent
→ Internal Generation Brief
→ Minecraft-first Geometry + Texture target
→ source-nearest orthographic anchor
→ stable/readable pose + articulated-feature intent
→ SIDE | FRONT | BACK | TOP/FOOTPRINT | FRONT-SIDE 3/4
→ readiness + fresh explicit execution consent
→ one Draft; at most one targeted correction
→ user approval
```

Minor preview drift does not invalidate a recognizable/buildable reference. Only unresolved material contradiction affecting identity, primary mass/count, topology/attachment, important negative space, buildability, or identity-critical material information becomes `CONFLICTING / BLOCKED`.

Repository/policy hardening, CI success, or `next-action.md` never authorizes image generation.

## Professional Sample Forensics — Static / Non-Local

Nine professional `.bbmodel` samples remain learning evidence only. Retained bounded closures are:

```text
PRO-3  place_cube per-element parent + initial inflate
PRO-5  modify_cubes_batch Box-UV authored-state parity
PRO-6  manage_keyframes authored Molang string preservation
PRO-7  create_animation + inspect_animation sound events
PRO-8  inspect_animation read-only AnimationController/state inspection
CTRL   manage_animation_controller bounded state-machine mutation
```

## Current Static Verification

Current GitHub proof: **full contract suite PASS**, typecheck PASS, surface PASS, build PASS, generated-doc freshness PASS, aggregate enforcement PASS. Tool count is **63**; surface and prompt ceilings remain enforced rather than replaced with guessed token savings.

Exact test totals and transient exact surface character counts are deliberately not stored as durable proof metadata. Later installed-plugin freshness, real call reduction, controller execution, controller-effect persistence, and visual-quality improvement remain `LOCAL PROOF REQUIRED` if local testing is explicitly reactivated.

## Product / Lifecycle / Export

Project lifecycle, editable `.bbmodel`, Bedrock geometry export, and representative save/reopen retain accepted 2026-08-12 baseline evidence. Current-build persistence/export is rechecked only when local acceptance is explicitly reactivated rather than inferred from source.

## Texture / Paint / PBR

Native texture/Painter/PBR/material-instance capability remains. Minecraft-first texture judgement tolerates minor surface drift while material identity/channel contradictions remain blockers.

## Animation / Rig

`manage_keyframes` preserves authored Molang strings without evaluation. New-animation sound events remain bounded. `inspect_animation` remains read-only for controller/state inspection. `manage_animation_controller` now owns bounded controller state-machine creation/mutation and returns continuation state to avoid ritual reinspection. Controller runtime execution is still `LOCAL PROOF REQUIRED`.

## Locator / Null Object

Direct Locator/Null Object lifecycle ownership and representative reopen persistence retain accepted baseline evidence.

## Protected Native Capability Gaps

```text
AnimationController state particle/sound mutation
AnimationController blend-curve mutation
existing-animation direct sound/timeline-effect mutation
TextureMesh direct authoring/inspection
native Bedrock visible bounding-box fields
animated-texture authoring
bone-binding expressions
```

## Explicitly Unsupported As Modelling Authority

Automatic image→geometry truth, similarity scores as visual approval, metadata/prose as image evidence, mutation success as visual approval, arbitrary fallback transforms, and sample-specific rules are unsupported.

## Current Evidence Boundary

Current non-local contracts are synchronized through **P0–P7 + execution-gated Minecraft-first Reference Generator + PRO-1–PRO-8 + static pre-local optimization + bounded AnimationController mutation + R1–R4 repository reliability**. No local acceptance is active. No current runtime/model-quality, controller-execution, or actual usage-efficiency claim is upgraded until a future explicitly reactivated local run provides that evidence.
