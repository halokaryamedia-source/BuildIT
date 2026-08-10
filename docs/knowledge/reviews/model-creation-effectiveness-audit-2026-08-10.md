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
| P1 | Patch churn / sunk-cost preservation | Many small Cubes and edits accumulate around a wrong base shape | Agent protects already-authored geometry and defaults to adding mass instead of revising the primary hypothesis | Global-vs-local diagnosis before correction; hard rebuild threshold; two failed attempts in the same direction require reframing rather than more patches |
| P1 | Framing creates false confidence | Oversized, undersized, floating, or displaced model still fills the screenshot and appears plausible | Auto-framing normalizes the presentation and can hide gross envelope errors | Structural bounds/ground check before visual approval when target dimensions exist; use explicit target-envelope framing when possible |
| P1 | Correction is another guess | Agent notices a wrong part but changes coordinates from memory/screenshot and makes it worse | Visual diagnosis is not linked to exact authored state | Locate exact identity, `inspect_element`, classify the causal error, then perform one bounded correction and re-observe the affected view |
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

This is the next modelling-effectiveness target after Problem #1 is hardened.

The product question is not whether BlockIT can place more primitive types. It is whether Codex can derive the correct major volumes from a reference before committing to local detail.

The next audit should test the current primary-form workflow against realistic failure patterns:

- wrong overall silhouette despite correct object category;
- head/body/handle/support masses with incorrect relative scale;
- correct front profile but wrong depth;
- arbitrary slopes/rotations that make the model look sophisticated but less accurate;
- too many Cubes used before the whole form is recognizable;
- detail added to compensate for a wrong main mass.

Do not add a planner or automatic image-to-Cuboid system unless the simpler reference-fidelity workflow is proven insufficient.

## Product Priority Rule

Before future work, ask:

> Does this change help Codex create, observe, diagnose, correct, texture, animate, or export a better Bedrock Entity model?

If the answer is only "it makes the MCP more complete" or "Blockbench has this API", that is insufficient priority by itself.
