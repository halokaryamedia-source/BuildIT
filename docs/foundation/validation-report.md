# BlockIT Foundation Validation Report

**Updated:** 2026-08-19  
**Scope:** current `Local`, accepted 2026-08-12 live baseline, P0–P7, Minecraft-first Reference Generator, professional PRO-1–PRO-8 closures, pre-local optimization, bounded AnimationController mutation, integrated animation effect/Molang source closure, and repository reliability R1–R4. Local acceptance is user-deferred.

This page owns proof state. Active execution belongs in `docs/knowledge/next-action.md`; local execution procedure belongs in `docs/knowledge/operations/local-acceptance-runbook.md` only when explicitly reactivated.

## Evidence Labels

- `CURRENT-PROJECT VERIFIED` — target-environment proof exists for the exact claim.
- `OFFICIALLY VERIFIED` — authoritative upstream evidence supports the semantics.
- `LOCAL PROOF REQUIRED` — source/contract exists but direct runtime/model-facing proof is still required.
- `UNSUPPORTED` — evidence rejects the method.
- `UNKNOWN` — evidence is insufficient.

## Proof Surface Taxonomy

Evidence labels describe claim state; proof surfaces describe **where the evidence actually came from**.

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

GitHub mutation recovery remains owned by `GITHUB_RULES.md`. For ambiguous mutation outcomes, reconcile evidence before retry:

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
CURRENT SOURCE STATE:               ANIMATION_LOCAL_SOURCE_INTEGRATION_STATIC_VERIFIED
CURRENT CANONICAL CI:               NOT OBSERVED FOR 64-TOOL SOURCE
GENERATED ARTIFACTS:                STALE AGAINST CURRENT SOURCE
CURRENT LOCAL RUN:                  NO LOCAL RUN ACTIVE
LOCAL ACCEPTANCE:                   DEFERRED
```

The 2026-08-12 Blockbench 5.1.6 pass remains the accepted live baseline. Later hardening, optimization, controller mutation, and the 2026-08-19 animation effect/Molang closure are source/static evidence unless an exact newer proof surface is stated.

**Do not claim live Blockbench/model-quality, controller execution, persistence, or runtime-usage improvement without actual matching runtime proof on the current artifact.**

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

## AnimationController Mutation + Animation Closure — Static / Non-Local

`manage_animation_controller` remains one bounded default experimental capability inside the existing animation family. It does not add a registration profile, router, controller framework, or generic UI fallback.

Current source can coherently mutate controller/state-machine ownership including:

```text
controller rename
state add / update / remove
initial-state selection
transition add / update / remove
animation-link add / update / remove
state on_entry / on_exit
scalar blend_transition
blend_via_shortest_path
state particle add / update / remove
state sound add / update / remove
```

The integrated animation closure at source commit `33784de067525e8fcdd2510d6195c7b2ac85187e` additionally provides:

```text
manage_animation_effects
→ existing-animation particle / sound / timeline add-update-remove

animation_timeline
→ set_anim_time_update
→ set_blend_weight
```

Source/static inspection confirms registration inside the existing animation family, exact inspected identity ownership for effect mutation, bounded preflight/no-op/collision handling, and regression owners for D1/D2/D3. This does **not** prove current built-plugin execution in live Blockbench or Minecraft; those claims remain `LOCAL PROOF REQUIRED`.

Remaining protected animation gaps are controller blend-curve mutation and bone-binding expressions.

## Deferred Local Acceptance Target

Local acceptance is **not active**. When explicitly reactivated, first sync the runbook to the actual then-current source and generated artifacts. The current source expects this target:

```text
fresh Local build
→ exact Git HEAD + mcp/dist/mcp.js SHA-256
→ load exact local BlockIT artifact
→ restart Blockbench + reconnect MCP
→ verify endpoint + 64-tool default surface
→ verify:stateless-local
→ TEST 1 — MCP / CORE MECHANICS including animation/controller create-mutate-inspect
→ persistence / export
→ TEST 2 — REFERENCE MODEL (ELEPHANT)
→ efficiency check
```

Installed-plugin freshness, runtime behavior on the current build, controller execution, effect persistence, current persistence/export behavior, actual call efficiency, and current model quality remain `LOCAL PROOF REQUIRED` until a deliberately reactivated run occurs.

## Accepted Live Baseline — 2026-08-12

Representative `CURRENT-PROJECT VERIFIED` coverage: loopback/stateless transport, the then-current **62-tool** default surface, geometry/correction/Undo, difference-first reference behavior, texture/Paint/PBR/material instances, base animation create/inspect/timeline/playback, Locator/Null Object lifecycle, `.bbmodel` persistence, and Bedrock geometry export.

This baseline is historical live evidence. It is **not** proof that the current 64-tool source has been built or loaded locally.

## Fresh GitHub-Only Serialized Surface Proof

The source guard remains budget-based so capability additions cannot silently expand context cost.

Last completed canonical proof before the animation closure covered **63 tools**. Current `Local` source now expects **64 tools**, but the exact 64-tool measurement has not been observed as a completed canonical CI result.

```text
current source expected tool count  64 exactly
initialize instructions             <= 700 characters
tools/list response                 <= 80,500 characters
input schemas                       <= 56,500 characters
descriptions                        <= 11,500 characters
per-tool payload max                <= 3,200 characters
runtime workflow prompt             < 7,000 characters
```

`bun run measure:surface` owns the exact current serialized values. Serialized characters are not installed-client token/context measurements. No character ceiling was raised speculatively for the new animation effect tool.

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
existing animation effects → manage_animation_effects
returned state             → reuse; inspect only when extra detail is needed
visual correction          → affected view(s) first; expand only for material cross-view risk
same causal failure twice without new evidence → BLOCKED
```

Real installed-client call reduction remains `LOCAL PROOF REQUIRED`.

## Native Deferred MCP Discovery Compatibility

`OFFICIALLY VERIFIED` upstream architecture supports catalog → deferred `tool_search` → matching tool spec loading. Static source keeps a compact server namespace and no custom BuildIT router/profile. Installed client/model parity and actual schema/context cost remain `LOCAL PROOF REQUIRED`.

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

Professional `.bbmodel` samples remain learning evidence only. Retained bounded closures include:

```text
PRO-3  place_cube per-element parent + initial inflate
PRO-5  modify_cubes_batch Box-UV authored-state parity
PRO-6  manage_keyframes authored Molang string preservation
PRO-7  create_animation + inspect_animation sound/particle effects
PRO-8  inspect_animation read-only AnimationController/state inspection
CTRL   manage_animation_controller bounded state-machine mutation
ANIM   existing-effect, controller-effect, and animation-level Molang mutation source
```

## Current Static Verification

Last completed canonical GitHub proof before the current animation closure reported **full contract suite PASS, typecheck PASS, surface PASS, build PASS, generated-doc freshness PASS, and aggregate enforcement PASS** for the then-current **63-tool** source.

For the current 64-tool `Local` source, source-level integration has been inspected and is coherent, but canonical PASS is **not claimed**:

- runtime registration includes `registerAnimationEffectTools()` inside the existing animation family;
- canonical docs-manifest source includes `animationEffectToolDocs`;
- surface owner expects exactly 64 tools;
- D1/D2/D3 regression owners are present;
- `mcp/docs/api.json` remains generated from 2026-08-14;
- `mcp/docs/index.html` still reports Animation tool count `(9)`;
- `mcp/prompts/manifest.json` still classifies existing-animation effects as a gap;
- no matching completed CI run/status for the 64-tool integration has been observable through the currently available run/status surfaces.

Therefore generated-doc freshness and current typecheck/test/build/surface PASS remain pending until the canonical Bun gate is observed on the exact final source state.

## Product / Lifecycle / Export

Project lifecycle, editable `.bbmodel`, Bedrock geometry export, and representative save/reopen retain accepted 2026-08-12 baseline evidence. Current-build persistence/export is rechecked only when local acceptance is explicitly reactivated rather than inferred from source.

## Texture / Paint / PBR

Native texture/Painter/PBR/material-instance capability remains. Minecraft-first texture judgement tolerates minor surface drift while material identity/channel contradictions remain blockers.

## Animation / Rig

Current source includes numeric/Molang transform keys, existing-animation effect mutation, controller-state effect mutation, animation-level `anim_time_update` / `blend_weight`, and bounded controller state-machine mutation. `inspect_animation` remains the read owner. Live playback, persistence, and Minecraft controller execution remain `LOCAL PROOF REQUIRED`.

## Locator / Null Object

Direct Locator/Null Object lifecycle ownership and representative reopen persistence retain accepted baseline evidence.

## Protected Native Capability Gaps

```text
AnimationController blend-curve mutation
TextureMesh direct authoring/inspection
native Bedrock visible bounding-box fields
animated-texture authoring
bone-binding expressions
```

## Explicitly Unsupported As Modelling Authority

Automatic image→geometry truth, similarity scores as visual approval, metadata/prose as image evidence, mutation success as visual approval, arbitrary fallback transforms, and sample-specific rules are unsupported.

## Current Evidence Boundary

Current non-local contracts include **P0–P7 + execution-gated Minecraft-first Reference Generator + PRO-1–PRO-8 + static pre-local optimization + bounded AnimationController mutation + animation effect/Molang source closure + R1–R4 repository reliability**. No local acceptance is active. No current runtime/model-quality, controller-execution, persistence, or actual usage-efficiency claim is upgraded until a matching proof surface provides that evidence.
