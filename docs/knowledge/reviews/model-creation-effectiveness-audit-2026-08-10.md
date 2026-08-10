# Model Creation Effectiveness Audit

Updated: 2026-08-10
Status: ACTIVE PRODUCT PRIORITY

## Product Goal

BlockIT exists to help Codex create a good Minecraft Bedrock Entity model in Blockbench. Tool count and generic Blockbench API coverage are not product goals by themselves.

The normal success loop is:

```text
REFERENCE / USER BRIEF
→ CREATE
→ SEE
→ UNDERSTAND
→ CORRECT
→ TEXTURE
→ ANIMATE when required
→ EXPORT
```

A change is valuable only when it materially improves one of those stages or removes a real blocker from that loop.

## Priority Problem Map

| Priority | Problem | Real symptom | Root cause | Product solution |
|---|---|---|---|---|
| P0 | False visual approval | Model is visibly unlike the reference but Codex says it is correct or close enough | Structural/tool success can be rationalized as visual success; the same agent creates and judges; current rules do not force a negative-first comparison or an explicit `UNVERIFIED` state | Mandatory Reference Fidelity Verdict: difference-first review, `FAIL / UNVERIFIED / PASS`, evidence tied to matching reference/model views, and no full PASS when an important axis/view is unsupported |
| P0 | Wrong primary geometry decomposition | Cubes are valid but the whole silhouette/proportions are fundamentally wrong | Agent jumps from semantic labels such as body/head/handle directly to exact transforms; local Cube decisions are made independently instead of as primary mass relationships | Stabilize primary masses before local detail, build the minimum recognizable whole form, and reject/rebuild a globally wrong scaffold before secondary geometry |
| P0 | Cross-view / depth hallucination | Front view looks plausible while side/top/depth is wrong | One view is over-weighted, conflicting views are averaged, or missing depth evidence is treated as permission to invent geometry | Tie each important width/height/length/placement claim to the reference view that actually constrains it; unsupported dimensions remain `UNVERIFIED` rather than guessed or approved |
| P1 | Patch churn / correction loop | Many small Cubes and edits accumulate around a wrong base shape, or the same mismatch is repeatedly edited without new evidence | Agent protects already-authored geometry and lacks a hard blocker escalation when correction is not converging | Global-vs-local diagnosis; hard rebuild threshold; after two failed attempts in the same causal direction without new evidence, stop as `BLOCKED` and report what is needed to continue |
| P1 | Framing creates false confidence | Oversized, undersized, floating, or displaced model still fills the screenshot and appears plausible | Auto-framing normalizes the presentation and can hide gross envelope errors | Structural bounds/ground check before visual approval when target dimensions exist; use explicit target-envelope framing when possible |
| P1 | Correction is another guess | Agent notices a wrong part but changes coordinates from memory/screenshot, or fixes one symptom while accidentally moving another relationship | Visual diagnosis is not converted into an explicit invariant/expected structural effect before mutation | Inspect exact authored state; define causal class + invariant; mutate once; verify returned before/after `geometry_effect`; only then re-observe visually |
| P1 | Tool-choice/context friction | Codex spends calls exploring irrelevant capabilities or chooses generic helpers instead of the modelling path | Broad tool catalog competes with the intended Bedrock workflow | Keep normal skill routing focused on create/inspect/capture/correct/texture/animate/export; capability count alone must never drive expansion |
| P2 | Texture hides geometry failure | Surface detail makes a bad silhouette appear more finished without making it more correct | Texture starts before primary geometry is accepted | Geometry gate before texture; texture may improve surface identity but cannot approve wrong form |
| P2 | Animation built on bad rig/form | Motion is created around bad pivots, hierarchy, or geometry | Animation begins before geometry/pivots are visually/functionally established | Animate only after required geometry/hierarchy/pivot state is coherent; animation proof is separate from static geometry proof |
| P3 | Optional/native capability gaps | Specialized Bedrock task cannot be completed directly | A specific native capability has no direct MCP owner | Implement only when the capability materially serves a real modelling workflow; do not let capability completeness replace model-quality priorities |

## Problem #1 — False Visual Approval

### Failure we must prevent

```text
MCP calls succeed
→ model is rendered
→ agent sees roughly the intended category
→ agent writes "looks correct" / "matches the reference"
→ work continues even though silhouette/proportions are materially wrong
```

This is the highest-value issue because every later modelling step depends on the validity of the geometry gate.

### Why the current rule is insufficient

The repository already says that tool success, valid coordinates, connected Cubes, bounds, hierarchy, and validator results are not visual proof. That is necessary but still permissive: an agent can look at the image, perform a weak confirmation-oriented review, and produce `PASS` without explicitly testing where the model differs from the reference.

The missing control is a verdict contract that forces the agent to search for disconfirming evidence first.

## Solution — Reference Fidelity Verdict

Every material visual gate must end in exactly one of these states:

```text
FAIL
UNVERIFIED
PASS
```

### FAIL

Use when any critical or major mismatch is observed in an applicable criterion.

Examples:

- object is not recognizable as the intended target;
- whole silhouette is materially different;
- primary mass proportions/placement are materially wrong;
- an important slope/orientation/contact is wrong;
- several primary relationships fail together.

`FAIL` must name the mismatch and the reference/model view that shows it.

### UNVERIFIED

Use when the evidence needed for a claim is missing or insufficient.

Examples:

- only a front reference exists, so depth fidelity cannot be confirmed;
- side/top reference is ambiguous or conflicts materially with another view;
- current model capture for the required view is unavailable;
- scale cannot be claimed because no approved numeric envelope exists.

Missing evidence is never upgraded to PASS by plausibility.

### PASS

Use only after a difference-first review finds no critical/major mismatch in the applicable criteria supported by available reference evidence.

PASS requires:

1. fresh current-revision model image evidence;
2. direct comparison with the corresponding reference view(s);
3. explicit review of applicable silhouette, proportion, placement, orientation/slope, and visible-contact criteria;
4. no critical or major mismatch found;
5. no important unsupported claim silently treated as verified.

When multiple independent reference views exist and the claim concerns the 3D whole form, the judgement must use the views that constrain the relevant axes. A front-only match cannot become a full 3D PASS when side/depth evidence is missing.

## Difference-First Review

At each whole-form gate, Codex must begin by looking for differences, not by asking whether the model "looks good".

Minimum review form:

```text
REFERENCE VIEW ↔ MODEL VIEW
- silhouette difference:
- primary proportion difference:
- primary placement difference:
- orientation/slope difference:
- visible contact difference:
- severity: critical / major / minor / none
```

Only after this mismatch search may the agent produce a verdict.

Generic approval language such as these is not evidence:

```text
looks good
looks correct
matches well
all parts are present
everything is connected
bounds are correct
the tool succeeded
```

## Problem #2 — Wrong Primary Geometry

### Failure we must prevent

```text
agent recognizes semantic parts
→ invents exact Cube extents independently
→ place_cube succeeds
→ success is treated as proof that the part was placed correctly
→ more Cubes are added around the assumption
→ the model becomes detailed but the whole silhouette/proportions remain wrong
```

The product question is not whether BlockIT can place more primitive types. It is whether Codex can derive the correct major volumes from the reference before committing to local detail.

### Root causes

1. **Execution-success bias** — mutation success sounds like modelling success even though the tool never judged the reference.
2. **Independent-Cube reasoning** — semantic labels such as body/head/handle are converted directly into unrelated exact transforms instead of one coherent set of primary mass relationships.
3. **Success chaining** — the next Cube is placed because the previous call worked, not because a still-unrepresented primary mass requires it.
4. **Premature detail** — secondary Cubes make the model look more complete and create sunk cost before the primary silhouette has been accepted.
5. **Unsupported certainty** — a provisional depth/rotation/placement estimate becomes treated as correct after Blockbench accepts it.

### Implemented source solution

- Cube mutation outputs now report `execution: applied` and `visual_verdict: not_evaluated`.
- Mutation text says that reference fidelity was not evaluated; `modify_cubes_batch` no longer calls its own result "Corrected".
- The modelling skill and canonical MCP prompt prohibit chaining placement from tool success.
- Once the currently hypothesized primary masses form a judgeable blockout, geometry authoring must stop for the primary visual gate before secondary/detail work.
- Under-constrained axes may use provisional working values when necessary, but those values remain hypotheses and cannot become PASS without supporting evidence.

### Remaining proof

Local modelling tests still need to demonstrate that this boundary changes actual Codex behavior on difficult references. Source/CI can prove the contract exists; they cannot prove improved visual quality without live model construction.

Do not add a planner or automatic image-to-Cuboid system unless this simpler execution/acceptance separation is proven insufficient.

## Problem #3 — Cross-View / Depth Hallucination

### Failure we must prevent

```text
front view looks plausible
-> agent gains confidence in the whole object
-> hidden/weakly observed depth or placement is invented
-> side/top evidence is ignored, unavailable, or averaged when conflicting
-> Cube placement succeeds
-> invented 3D geometry is reported as matched
```

### Root causes

1. **Axis confidence leakage** — evidence for width/height is incorrectly reused as confidence for depth.
2. **Single-view dominance** — the visually strongest/most familiar view becomes the de facto authority for the whole model.
3. **Conflict averaging** — incompatible views are silently averaged instead of being treated as a reference blocker.
4. **Mutation confirmation** — Blockbench accepting a provisional depth/rotation makes the guess feel validated.
5. **No blocker escalation** — the agent keeps patching when the reference/runtime cannot actually provide enough evidence for a valid solution.

### Implemented source solution

Primary modelling now uses a small cross-view evidence map with four states:

```text
SUPPORTED    directly constrained by relevant view(s)
PROVISIONAL  working hypothesis; not verified
CONFLICTING  relevant views materially disagree
UNAVAILABLE  required evidence is not observable
```

Rules:

- confidence cannot transfer between axes;
- front-only success cannot produce a full 3D PASS;
- provisional extents remain provisional after successful Cube placement;
- material conflicting views are not averaged;
- unresolved material conflict produces `BLOCKED`, not speculative geometry;
- unavailable evidence keeps the affected claim `UNVERIFIED`.

## Workflow Blocker / Non-Looping Rule

A valid result is more important than producing a success report.

`BLOCKED` is required when current evidence/capability cannot support a valid continuation, including unresolved material cross-view conflict, missing required observation, unsupported capability, or two failed attempts in the same causal correction direction without new evidence.

On `BLOCKED`, Codex stops mutation and reports:

```text
blocker category
concrete evidence / error
affected claim or deliverable
bounded attempts made
exact requirement to unblock
```

It must not continue changing geometry just to create the appearance of progress, and it must not call unresolved work fixed/resolved.

### Remaining proof

This source contract prevents false certainty in the workflow definition. Actual reduction of depth hallucination and correction looping still requires deliberate local modelling tests with difficult multi-view references; until then it remains local effectiveness proof, not a claimed visual-quality result.

## Problem #4 — Correction Accuracy

### Failure we must prevent

```text
model view correctly reveals a mismatch
-> Codex guesses new absolute coordinates
-> mutation succeeds
-> the intended issue may improve, but another relationship moves accidentally
-> tool success is mistaken for a valid correction
-> more patches accumulate
```

### Root causes

1. **Diagnosis-to-number jump** — "too long" or "too high" is converted directly into new from/to values without defining what must remain fixed.
2. **Mixed transform side effects** — an intended TRANSLATE can accidentally resize; an intended RESIZE can shift center/contact; a ROTATE can be mixed with unnecessary extent changes.
3. **After-only feedback** — without authored before/after deltas, structural side effects are easy to miss before visual review.
4. **No-op progress** — an id-only or same-state request can look like another correction attempt even when it changes nothing useful.
5. **REATTACH ambiguity** — visual contact correction and hierarchy-parent correction can be conflated; coordinate patches are not a substitute for a direct parent mutation.

### Implemented source solution

- `modify_cube` rejects an id-only request and uses finite transform vectors.
- `inspect_element` Cube state now includes center in addition to from/to/size/origin/rotation.
- `modify_cube` returns authored `before`, `after`, and deterministic `geometry_effect`.
- `modify_cubes_batch` returns the same structural effect per target plus the count of targets with an effective geometry/visibility change.
- correction workflow requires an explicit invariant before numeric mutation and validates the returned structural effect before visual approval.
- if hierarchy reparenting is the actual required fix and no direct supported owner is exposed, the correct result is `BLOCKED`, not fake attachment through coordinate edits.
- the existing two-failed-attempt blocker remains the stop condition for non-converging corrections.

### Remaining proof

Local modelling tests must still demonstrate that Codex uses these effects to make better corrections on real models. Source/CI proves the contract and deterministic structural metadata exist; it does not prove final visual improvement.

## Problem #5 — Tool-Choice / Context Friction

### Failure we must prevent

```text
Codex sees a broad Bedrock-capable MCP catalog
-> treats available tools as equally relevant
-> calls selection/duplicate/current-view/validator/specialist tools during unresolved geometry
-> accumulates context and side work
-> primary modelling decision becomes less explicit
-> technical activity is mistaken for progress
```

### Root causes

1. **Capability-equals-priority bias** — a tool being exposed can make it look appropriate for the current step.
2. **Domain leakage** — texture/Paint/animation/material/Locator work can begin before geometry is accepted.
3. **Convenience-tool substitution** — selection, duplication, current-view screenshots, checkpoints, or validators can replace explicit identity/reference reasoning.
4. **Catalog exploration** — the agent may search for another tool instead of resolving the current modelling question with the existing core lane.

### Implemented source solution

No Bedrock registration family was removed and no new profile/gating framework was added. The normal workflow now has an explicit stage-gated geometry lane:

```text
project/orient -> build -> whole-form observe -> exact inspect -> bounded correct -> recover when needed -> finish
```

Specialist/native capabilities remain available but branch only when their actual stage/intent is active. Tool descriptions for current-view capture, duplication, selection, and history/checkpoints now state their branch-only role so the tool list itself does not present them as normal geometry steps.

### Remaining proof

Local Codex modelling tests must verify whether the routing materially reduces irrelevant tool calls and keeps geometry reasoning focused. If real runs still show repeated wrong-tool selection because the full exposed schema context itself is the blocker, record that evidence before considering narrower default exposure of proven generic convenience tools. Do not pre-emptively hide native Bedrock capability.

## Problem #6 — Texture / Animation Sequencing

### Failure we must prevent

```text
geometry is still wrong or materially unverified
-> texture polish or animation starts anyway
-> the asset looks more finished and creates sunk cost
-> Codex becomes less willing to rebuild the bad geometry/rig
-> downstream technical success is mistaken for overall completion
```

A second failure mode is the opposite: a user asks only to texture/animate an existing asset, but the workflow unnecessarily reopens the entire modelling task and expands scope.

### Root causes

1. **Stage blur** — downstream tools are available before geometry dependencies are ready.
2. **Finish bias** — texture detail and motion make an asset feel complete even when primary geometry evidence is unresolved.
3. **Downstream sunk cost** — finished pixels/keyframes psychologically protect a bad scaffold or rig from rebuild.
4. **Baseline confusion** — treating an existing asset as the working baseline can be misreported as a geometry-fidelity PASS.
5. **Stale downstream state** — later geometry/hierarchy/pivot edits can invalidate UV/paint/material or animation assumptions without forcing re-check.

### Implemented source solution

No runtime readiness state, new profile, or tool gate was added because MCP tools cannot legitimately determine visual `PASS` on their own.

The agent workflow now distinguishes:

- **end-to-end creation** — production texture waits for complete geometry readiness; production animation waits for accepted geometry plus suitable participating hierarchy/pivots;
- **existing-asset direct domain work** — current geometry can be a user-provided baseline without being certified as reference-accurate;
- **temporary aids** — placeholder texture or diagnostic pose/playback may support observation/rig diagnosis but remain provisional/disposable and cannot count as completion;
- **downstream invalidation** — material geometry/hierarchy/pivot changes make affected texture/animation assumptions stale until rechecked;
- **sunk-cost rule** — existing texture/keyframes never justify preserving geometry/rig state rejected by the modelling gate.

Material `FAIL` returns to modelling. A required downstream dependency that remains `UNVERIFIED` must be resolved or reported `BLOCKED`, not hidden under more production work.

### Remaining proof

Local end-to-end tests must show that Codex actually delays downstream production on a failing model, allows bounded existing-asset texture/animation tasks without inventing geometry approval, and revalidates affected downstream work after geometry/rig edits. Source/CI proves the sequencing contract exists; it does not prove live behaviour or visual quality.

## Problem #6 — Validation Overhead / Usage Waste

### Failure we must prevent

```text
strict policy
-> per-Cube inspect/capture/discovery/checkpoint rituals
-> many MCP calls without new decision-changing evidence
-> high context/usage cost
-> slower modelling without stronger proof
```

### Source solution — Minimum Necessary Evidence

A read/capture/checkpoint/specialist load is justified only when its result can change the next modelling decision or prove an in-scope completion claim.

- bounds are conditional on numeric envelope/scale/ground/gross-placement questions;
- newly authored Cubes are not inspected one-by-one unless a diagnosis/identity/current-state question requires it;
- captures happen at meaningful gates, not after every mutation;
- local corrections revalidate affected views/state only unless they expose a global hypothesis problem;
- specialists load lazily when their stage is reached;
- checkpoints are risk/recovery based, not mutation-count based;
- simple Primary Form Hypotheses remain compact;
- `UNVERIFIED` preserves uncertainty and does not automatically authorize more search/capture calls.

No `lean_mode`, runtime readiness state, new profile, scoring system, or dynamic gating framework was added.

## Proof Taxonomy — Do Not Confuse Contract With Behaviour

Current CI/source tests prove that schemas, routing text, mutation-result contracts, and regression guardrails exist and remain internally consistent. Many modelling-effectiveness tests deliberately inspect source/policy text. That is **contract proof**, not evidence that Codex will obey the contract during a real modelling run.

```text
SOURCE / CONTRACT PROOF
  tests/build/docs verify the rule exists and source remains valid

LIVE TOOL PROOF
  real Blockbench + MCP call proves a tool behaves as claimed in the active runtime

BEHAVIORAL MODELLING PROOF
  real Codex + Blockbench reference task demonstrates tool choice, call economy,
  visual FAIL/UNVERIFIED/PASS judgement, correction behaviour, and blocker handling

REFERENCE-FIDELITY OUTCOME PROOF
  fresh rendered result is directly compared with the approved reference and
  supports the claimed model quality
```

A green CI run must never be reported as proof that visual fidelity, anti-hallucination behaviour, call efficiency, or `BLOCKED` escalation works live. Those remain `LOCAL PROOF REQUIRED` until acceptance scenarios exercise them.

## Product Priority Rule

Before future work, ask:

> Does this change help Codex create, observe, diagnose, correct, texture, animate, or export a better Bedrock Entity model?

If the answer is only "it makes the MCP more complete" or "Blockbench has this API", that is insufficient priority by itself.


## Pre-Local Context & Payload Cleanup — 2026-08-11

Measured generated baseline before cleanup:

```text
72 tools
123,851 tool-metadata JSON characters
18,249 tool-description characters
40,850 schema-description characters
19,808 canonical workflow-prompt characters
```

The hotspot audit showed that most removable prose cost was concentrated in `create_animation`, Cube mutation schemas/descriptions, bone rigging, PBR/material configuration, element search/group creation, and a few observation/export tools. The cleanup therefore trims only measured hotspots rather than rewriting all 72 tools.

Bounded decisions:

- preserve all existing Bedrock registration families and tool count;
- keep runtime validation/refine logic unchanged;
- keep execution-vs-visual-verdict and blocker semantics;
- compact the canonical MCP prompt instead of duplicating specialist-skill detail;
- use Resources as lazy browsing/context, not mandatory pre-tool reads;
- remove raw Texture `source` from normal resource metadata because `get_texture` owns image retrieval;
- make `validator://status` summary-only and keep detail in `validator://errors`, `validator://warnings`, and `validator://checks`;
- keep `nodes://` unchanged until the protected TextureMesh gap has a direct authored-state owner;
- annotation audit found every generated tool already exposes either `readOnlyHint` or an explicit `destructiveHint`, so no speculative annotation changes were made.

This remains **source/contract and payload proof only**. Whether the smaller surface materially reduces Codex usage or wrong tool selection remains a Local behavioral measurement.
