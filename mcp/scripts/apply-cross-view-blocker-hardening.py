from pathlib import Path


def insert_before(path: str, marker: str, addition: str) -> None:
    p = Path(path)
    text = p.read_text(encoding="utf-8")
    if addition.strip() in text:
        return
    if text.count(marker) != 1:
        raise RuntimeError(f"Expected one marker in {path}: {marker!r}")
    p.write_text(text.replace(marker, addition + marker, 1), encoding="utf-8")


def replace_once(path: str, old: str, new: str) -> None:
    p = Path(path)
    text = p.read_text(encoding="utf-8")
    if new in text:
        return
    if text.count(old) != 1:
        raise RuntimeError(f"Expected one replacement target in {path}: {old!r}")
    p.write_text(text.replace(old, new, 1), encoding="utf-8")


# 1. Reference policy: every material 3D claim has an evidence state.
reference_contract = r'''## Axis Evidence States

Do not let one strong view silently provide information about an axis it does not actually show. For every material primary-mass dimension or relationship that affects the 3D blockout, classify the evidence before treating it as reference-backed:

```text
SUPPORTED    one or more relevant views directly constrain the claim
PROVISIONAL  a working value is needed to build, but evidence is weak/incomplete
CONFLICTING  relevant views materially disagree
UNAVAILABLE  the required axis/relationship cannot be observed from the package
```

Typical evidence directions remain:

```text
width  <- front/back + top when visible
height <- front/back + side
length/depth <- side + top
```

These are guidance, not a fixed camera law. A view only constrains what it actually reveals.

Rules:

- A front view may support width/height but cannot by itself certify depth.
- A perspective 3/4 view may help interpret volume but must not override clearer orthographic evidence.
- `PROVISIONAL` values may be used for a coarse working blockout when necessary, but they remain hypotheses and cannot become verified merely because Blockbench accepted the Cube.
- `CONFLICTING` evidence must not be averaged into a fake compromise. If the conflict materially changes the primary form and the approved brief/user intent cannot resolve it, modelling is **BLOCKED** until the reference is clarified.
- `UNAVAILABLE` evidence leaves the affected claim `UNVERIFIED`; do not invent hidden dimensions/features and then report them as matched.

The goal is not to produce a large manifest. Keep only the small axis/relationship evidence map needed for current primary modelling decisions.

'''
insert_before("docs/foundation/04-reference-guide.md", "## Dimensions\n", reference_contract)

# 2. Modelling specialist: cross-view constraint map and explicit blocker stop.
skill_axis = r'''### 2A. Build A Small Axis Evidence Map

Before exact primary Cube extents, separate what the reference actually proves from what the modeller merely needs to hypothesize. For each material primary mass/relationship, track only the relevant claims:

```text
claim / axis
supporting reference view(s)
state: SUPPORTED | PROVISIONAL | CONFLICTING | UNAVAILABLE
```

Apply the states as follows:

- **SUPPORTED** — relevant view(s) visibly constrain the dimension, placement, orientation, or contact.
- **PROVISIONAL** — a temporary working value is needed for the 3D blockout but current evidence is weak/incomplete.
- **CONFLICTING** — relevant views materially disagree.
- **UNAVAILABLE** — the package does not show the claim well enough to judge it.

Do not transfer confidence across axes. A convincing front silhouette does not validate depth. A strong side view does not prove hidden width detail. A 3/4 view is useful context but must not override clearer orthographic evidence.

If a material primary-form conflict cannot be resolved from the approved brief or explicit user intent, do not average the views or pick whichever is easiest to model. Enter the workflow `BLOCKED` state described below and report the exact conflict.

'''
insert_before(
    ".agents/skills/blockbench-bedrock-modelling/SKILL.md",
    "### 3. Build The Coarse Primary Geometry Pass\n",
    skill_axis,
)

skill_blocker = r'''#### Workflow Blocker / Loop Stop Contract

`BLOCKED` is a workflow state, not a visual verdict. Use it when a valid modelling result cannot currently be reached without inventing evidence or repeating failed work.

Enter `BLOCKED` when any of these applies:

- material reference views conflict and the active brief/user intent cannot resolve the conflict;
- a required reference/model view or runtime observation remains unavailable after one controlled retry when a retry is plausibly useful;
- the same causal correction direction has failed twice without new evidence;
- a required MCP/runtime capability is unavailable and no supported path can validate the requested result;
- continuing would require guessing an unsupported primary dimension/relationship and then presenting it as verified.

When `BLOCKED`:

1. stop further speculative mutation;
2. keep the last valid authored state rather than stacking more patches;
3. report the blocker category and concrete evidence;
4. state what claim/result cannot be validated because of it;
5. summarize the bounded attempts already made;
6. state the exact new evidence, user decision, or working capability needed to continue.

Do not report `PASS`, "fixed", "resolved", or "should be correct" while the blocker remains. A blocker report is preferable to an endless correction loop with no new evidence.

'''
insert_before(
    ".agents/skills/blockbench-bedrock-modelling/SKILL.md",
    "#### Hard rebuild rule\n",
    skill_blocker,
)

# 3. MCP prompt carries the same cross-view and blocker behavior for Codex.
prompt_axis = r'''### Cross-view axis evidence contract

Before turning primary masses into exact 3D extents, distinguish reference-backed facts from working guesses. For each material width/height/depth, primary placement, orientation/slope, or visible contact claim, keep a small working status:

```text
SUPPORTED | PROVISIONAL | CONFLICTING | UNAVAILABLE
```

- **SUPPORTED** — relevant view(s) directly constrain the claim.
- **PROVISIONAL** — a temporary value is necessary to build, but evidence is incomplete.
- **CONFLICTING** — relevant views materially disagree.
- **UNAVAILABLE** — the package cannot show the claim well enough to judge it.

Do not transfer confidence between axes. A front-view match cannot certify depth; a 3/4 impression cannot override clearer orthographic evidence. Provisional values remain hypotheses after successful Cube placement. Conflicting primary-form evidence must not be averaged into a compromise; if the active brief/user intent cannot resolve it, stop as `BLOCKED` rather than hallucinating a solution.

'''
insert_before(
    "mcp/prompts/bedrock_entity_workflow.md",
    "3. **Create a temporary Primary Form Hypothesis before exact Cube transforms.**",
    prompt_axis,
)

prompt_blocker = r'''## Blocker / Non-Looping Completion Contract

`FAIL / UNVERIFIED / PASS` describe visual evidence. `BLOCKED` is separate: it describes a workflow that cannot validly continue with the current evidence/capability.

Use `BLOCKED` and stop speculative mutation when:

- material cross-view conflict cannot be resolved from the active brief/user intent;
- required observation evidence remains unavailable after one controlled retry when useful;
- the same causal correction direction fails twice without new evidence;
- a required supported MCP/runtime capability is unavailable;
- continuing would require presenting a provisional/unsupported geometry claim as verified.

A blocker report must state: blocker category, concrete evidence, affected claim/result, bounded attempts already made, and the exact new evidence/user decision/capability needed to continue. Do not keep changing coordinates merely to avoid reporting a blocker, and do not label unresolved work as fixed or successful.

'''
insert_before(
    "mcp/prompts/bedrock_entity_workflow.md",
    "## Locator / Null Object authored state\n",
    prompt_blocker,
)

# 4. Orchestrator owns the stop boundary across domains.
orchestrator_blocker = r'''## Blocker Escalation

Do not convert persistent failure into repeated tool calls. `BLOCKED` is the correct task outcome when the current evidence/capability cannot support a valid result.

For modelling, stop and report `BLOCKED` when `blockbench-bedrock-modelling` reaches its cross-view/runtime/loop-stop threshold. Keep `FAIL / UNVERIFIED / PASS` for visual verdicts; do not use them to hide an execution/reference blocker.

A blocker report must identify the blocker, the evidence or tool failure that proves it, what cannot be validated, what bounded attempts were made, and what specifically is needed to unblock. Do not continue speculative mutation after that point.

'''
insert_before(
    ".agents/skills/blockit-bedrock-entity-mcp/SKILL.md",
    "## Texture And PBR Boundary\n",
    orchestrator_blocker,
)

# 5. Visual validation distinguishes partial-axis verdicts and blocked workflows.
validation_cross_view = r'''## Cross-View Validity

A whole-form verdict must cover the views/axes that the claim actually depends on.

```text
front PASS + side FAIL        -> whole-form FAIL
front PASS + side unavailable -> whole-form UNVERIFIED for depth/side claims
front PASS + conflicting side/top reference -> BLOCKED if the conflict materially affects primary form and cannot be resolved
```

Do not promote the strongest-looking view to represent the whole 3D model. For each material mismatch/approval, name the paired view that supports it and keep unsupported axes provisional or unverified.

### Blocked validation

`BLOCKED` is not a visual quality grade. It means a valid visual verdict cannot currently be reached without missing evidence, resolving a material reference conflict, or restoring a required runtime capability.

When blocked, stop speculative corrections and report:

```text
blocker category
evidence
claim/result that cannot be validated
bounded attempts already made
exact requirement to unblock
```

If the same causal correction direction fails twice without new evidence, treat continued patching as a loop and stop. Do not manufacture a success report from repeated attempts.

'''
insert_before(
    "docs/foundation/07-visual-validation.md",
    "## Structural Envelope Gate\n",
    validation_cross_view,
)

# 6. Architecture decision records axis state + blocker semantics.
decision_cross_view = r'''## Cross-View Evidence Decision

Primary 3D claims use four evidence states:

```text
SUPPORTED
PROVISIONAL
CONFLICTING
UNAVAILABLE
```

Confidence does not transfer between axes. A strong front result cannot validate depth. A provisional value may be authored for a coarse blockout, but successful mutation does not upgrade its evidence status.

Material `CONFLICTING` evidence is not averaged. If the active brief/user intent cannot resolve the contradiction, the workflow becomes `BLOCKED` until clarification exists.

`BLOCKED` is also required when the same causal correction direction fails twice without new evidence or when required observation/capability remains unavailable. At that point the agent stops mutation and reports the concrete blocker plus the exact condition needed to continue.

This stop condition exists to prevent correction loops from being mistaken for progress.

'''
insert_before(
    "docs/knowledge/decisions/reference-fidelity-loop.md",
    "## Failure Classification\n",
    decision_cross_view,
)

# 7. Product audit: formalize Problem #3 and the non-looping blocker requirement.
audit_path = "docs/knowledge/reviews/model-creation-effectiveness-audit-2026-08-10.md"
audit_addition = r'''## Problem #3 — Cross-View / Depth Hallucination

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

'''
insert_before(audit_path, "## Product Priority Rule\n", audit_addition)

# Update the existing patch-churn row to make the blocker escalation visible.
replace_once(
    audit_path,
    "| P1 | Patch churn / sunk-cost preservation | Many small Cubes and edits accumulate around a wrong base shape | Agent protects already-authored geometry and defaults to adding mass instead of revising the primary hypothesis | Global-vs-local diagnosis before correction; hard rebuild threshold; two failed attempts in the same direction require reframing rather than more patches |",
    "| P1 | Patch churn / correction loop | Many small Cubes and edits accumulate around a wrong base shape, or the same mismatch is repeatedly edited without new evidence | Agent protects already-authored geometry and lacks a hard blocker escalation when correction is not converging | Global-vs-local diagnosis; hard rebuild threshold; after two failed attempts in the same causal direction without new evidence, stop as `BLOCKED` and report what is needed to continue |",
)

# 8. Advance next-action to correction accuracy after this slice.
next_action = "docs/knowledge/next-action.md"
replace_once(
    next_action,
    "`MCP_MODEL_EFFECTIVENESS_PRIMARY_GEOMETRY_HARDENING_SOURCE_COMPLETE_LOCAL_PROOF_REQUIRED`",
    "`MCP_MODEL_EFFECTIVENESS_CROSS_VIEW_BLOCKER_HARDENING_SOURCE_COMPLETE_LOCAL_PROOF_REQUIRED`",
)
old_next = r'''The next bounded modelling problem is:

```text
P0 — cross-view / depth hallucination
```

Audit how Codex derives width/height/depth, placement, and orientation when reference views provide unequal or conflicting evidence. The solution should keep unsupported axes explicitly provisional/UNVERIFIED and prevent a strong front-view match from hiding bad side/top/depth geometry.

Do not add TextureMesh, a planner, automatic image-to-Cuboid reconstruction, similarity scoring, or another modelling framework unless a concrete modelling requirement proves it is needed.
'''
new_next = r'''The current source slice has hardened **P0 — cross-view / depth hallucination** and introduced a non-looping `BLOCKED` workflow outcome for unresolved evidence/runtime/correction blockers.

The next bounded modelling problem is:

```text
P1 — correction accuracy
```

Audit whether a diagnosed visual mismatch reliably becomes the correct causal mutation (`TRANSLATE / RESIZE / ROTATE / REATTACH / SPLIT / MERGE-REMOVE / ADD MASS`) from exact authored state, instead of another coordinate guess. Preserve the new blocker rule: two failed attempts in the same causal direction without new evidence must stop rather than loop.

Do not add TextureMesh, a planner, automatic image-to-Cuboid reconstruction, similarity scoring, or another modelling framework unless a concrete modelling requirement proves it is needed.
'''
replace_once(next_action, old_next, new_next)

# 9. Focused source regression contract.
test_path = Path("mcp/tests/model-effectiveness-cross-view-blocker.test.ts")
test_path.write_text(r'''import { describe, expect, test } from "bun:test";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("model creation effectiveness — cross-view and blocker handling", () => {
  test("material 3D claims keep explicit evidence states instead of borrowing confidence across axes", async () => {
    const reference = await source("../docs/foundation/04-reference-guide.md");
    const modelling = await source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md");
    const workflow = await source("prompts/bedrock_entity_workflow.md");

    for (const text of [reference, modelling, workflow]) {
      expect(text).toContain("SUPPORTED");
      expect(text).toContain("PROVISIONAL");
      expect(text).toContain("CONFLICTING");
      expect(text).toContain("UNAVAILABLE");
    }
    expect(modelling).toContain("A convincing front silhouette does not validate depth");
    expect(workflow).toContain("A front-view match cannot certify depth");
  });

  test("material cross-view conflicts block instead of being averaged into invented geometry", async () => {
    const reference = await source("../docs/foundation/04-reference-guide.md");
    const modelling = await source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md");
    const validation = await source("../docs/foundation/07-visual-validation.md");

    expect(reference).toContain("must not be averaged");
    expect(modelling).toContain("Enter the workflow `BLOCKED` state");
    expect(validation).toContain("front PASS + conflicting side/top reference -> BLOCKED");
  });

  test("persistent correction failures stop and report a blocker instead of looping", async () => {
    const modelling = await source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md");
    const orchestrator = await source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md");
    const workflow = await source("prompts/bedrock_entity_workflow.md");
    const audit = await source("../docs/knowledge/reviews/model-creation-effectiveness-audit-2026-08-10.md");

    for (const text of [modelling, orchestrator, workflow, audit]) {
      expect(text).toContain("BLOCKED");
    }
    expect(modelling).toContain("same causal correction direction has failed twice without new evidence");
    expect(workflow).toContain("same causal correction direction fails twice without new evidence");
    expect(orchestrator).toContain("Do not continue speculative mutation");
    expect(audit).toContain("A valid result is more important than producing a success report");
  });

  test("next work stays problem-driven and moves to correction accuracy", async () => {
    const next = await source("../docs/knowledge/next-action.md");
    expect(next).toContain("MCP_MODEL_EFFECTIVENESS_CROSS_VIEW_BLOCKER_HARDENING_SOURCE_COMPLETE_LOCAL_PROOF_REQUIRED");
    expect(next).toContain("P1 — correction accuracy");
    expect(next).not.toContain("The next bounded modelling problem is:\n\n```text\nP0 — cross-view / depth hallucination");
  });
});
''', encoding="utf-8")

print("Applied cross-view and blocker hardening.")
