from pathlib import Path


def replace_once(path: str, old: str, new: str) -> None:
    p = Path(path)
    text = p.read_text(encoding="utf-8")
    if new in text:
        return
    if text.count(old) != 1:
        raise RuntimeError(f"Expected one replacement target in {path}: {old!r}")
    p.write_text(text.replace(old, new, 1), encoding="utf-8")


def insert_before(path: str, marker: str, addition: str) -> None:
    p = Path(path)
    text = p.read_text(encoding="utf-8")
    if addition.strip() in text:
        return
    if text.count(marker) != 1:
        raise RuntimeError(f"Expected one marker in {path}: {marker!r}")
    p.write_text(text.replace(marker, addition + "\n\n" + marker, 1), encoding="utf-8")


# Orchestrator: lazy specialists + minimum necessary evidence + conditional evidence calls.
path = ".agents/skills/blockit-bedrock-entity-mcp/SKILL.md"
replace_once(
    path,
    "Load every relevant domain specialist before a multi-domain task, but keep one domain responsible for each decision.",
    "Load specialists lazily. Start with the specialist that owns the current decision; load texturing or animation only when that stage is actually reached. A multi-domain user request does not justify preloading every specialist before geometry has earned the next stage."
)
replace_once(
    path,
    "whole-form     inspect_model_bounds / capture_model_views",
    "bounds         inspect_model_bounds only for a numeric envelope or scale/ground/placement question\nwhole-form     capture_model_views using only the views that can change the current decision"
)
insert_before(
    path,
    "## Downstream Readiness Gate",
    """## Minimum Necessary Evidence

Keep validity strict but execution lightweight. A tool call, inspection, capture, specialist load, or document read is justified only when its result can change the next modelling decision or prove a completion claim that is actually in scope.

- Do not re-read project/outline state that this workflow just created or already knows unless state may have changed or identity is uncertain.
- Do not inspect every newly placed Cube. Use `inspect_element` for a diagnosed target, ambiguous identity, or exact authored state needed for a correction.
- Do not capture after every mutation. Capture at a meaningful geometry gate; after a local correction, re-capture only the affected reference-corresponding view(s).
- Use `inspect_model_bounds` only when approved numeric dimensions/envelope exist or the active question is scale, ground, displacement, or gross placement. Without such a question, skip it and do not manufacture a numeric claim.
- `UNVERIFIED` is an evidence label, not an instruction to keep searching. Seek more evidence only when it is material to the current decision and plausibly obtainable. Otherwise keep the claim provisional/unverified, or report `BLOCKED` if that missing proof is required for the requested deliverable.
- Create a checkpoint only when rollback value is meaningful because upcoming work is broad/risky. Mutation count alone is not a checkpoint trigger.
- Keep progress reporting compact during execution. Detailed evidence reporting is reserved for a material gate, blocker, or final completion claim."
)
replace_once(
    path,
    "2. If no project exists and creation is requested, use `create_project`; BlockIT accepts only `bedrock`.\n3. Confirm the intended project is actually `bedrock`. Do not silently convert another format.",
    "2. If no project exists and creation is requested, use `create_project`; BlockIT accepts only `bedrock`. Do not immediately call `get_project_info` again merely to confirm the project that this workflow just created unless state is uncertain or has changed.\n3. Confirm the intended project is actually `bedrock`. Do not silently convert another format."
)
replace_once(
    path,
    "- For three or more material mutations, or any risky multi-step rework, create a `save_checkpoint` first when recovery value is meaningful.",
    "- Create `save_checkpoint` only before broad/risky multi-step rework where rollback value is meaningful. Do not trigger checkpoints from an arbitrary mutation count."
)
replace_once(
    path,
    "- use `inspect_model_bounds` for structural envelope facts;",
    "- use `inspect_model_bounds` only for approved numeric envelope/scale/ground/gross-placement questions;"
)

# Modelling specialist: compact hypothesis and exception-driven expensive checks.
path = ".agents/skills/blockbench-bedrock-modelling/SKILL.md"
insert_before(
    path,
    "### Tool Lane Discipline",
    """### Minimum Necessary Evidence

Use the smallest evidence set that can change the next modelling decision. Strictness applies to claims, not to the number of MCP calls.

- No per-Cube inspection ceremony for newly authored geometry that has no diagnosed problem.
- No screenshot-per-mutation loop. Build a judgeable coarse whole form, then run one meaningful visual gate.
- Re-observe only affected relationship/view(s) after a genuinely local correction; reopen the whole-form gate only when the correction exposes a global hypothesis problem.
- Structural bounds are conditional: use them for approved numeric envelope, scale, ground, displacement, or gross-placement questions, not as a universal pre-screenshot ritual.
- `UNVERIFIED` does not automatically require more calls. Obtain more evidence only when it can materially change the current decision and is plausibly available.
- Keep Primary Form reasoning compact for simple assets; expand the hypothesis/evidence map only when complexity, ambiguity, or conflicting views require it."
)
replace_once(
    path,
    "Approximate normalized ratios or qualitative placement are acceptable internal\nreasoning. They are not image-pixel measurements.",
    "Approximate normalized ratios or qualitative placement are acceptable internal\nreasoning. They are not image-pixel measurements. For a simple asset, keep this as a short working note rather than a formal per-part report."
)
replace_once(
    path,
    "Before exact primary Cube extents, separate what the reference actually proves from what the modeller merely needs to hypothesize. For each material primary mass/relationship, track only the relevant claims:",
    "When an important axis/relationship is materially uncertain, hidden, or cross-view dependent, separate what the reference actually proves from what the modeller merely needs to hypothesize. Track only claims that can affect the current primary-form decision:"
)
replace_once(
    path,
    "When the required runtime capability exists, check overall model bounds/ground\nagainst approved dimensions before allowing camera framing to hide gross scale\nerrors. Structural envelope evidence cannot prove resemblance.",
    "When approved numeric dimensions/envelope exist, or the active question is scale,\nground, displacement, or gross placement, check overall model bounds/ground before\nvisual approval. Otherwise skip the bounds call. Structural envelope evidence cannot\nprove resemblance."
)
replace_once(
    path,
    "When one axis such as depth is weakly supported, a provisional working extent may be necessary to create a 3D blockout, but it remains a hypothesis. Do not convert that provisional value into reference-backed certainty simply because `place_cube` accepted it.",
    "When one axis such as depth is weakly supported, a provisional working extent may be necessary to create a 3D blockout, but it remains a hypothesis. Do not convert that provisional value into reference-backed certainty simply because `place_cube` accepted it. `UNVERIFIED` by itself does not require another search/capture cycle; seek additional evidence only when the claim is material to the next decision and that evidence is plausibly obtainable."
)
replace_once(
    path,
    "inspect_model_bounds / capture_model_views",
    "inspect_model_bounds only when envelope/scale/ground evidence matters; capture_model_views only for relevant reference-corresponding views"
)

# Canonical workflow prompt: concise operational rule, conditional bounds, no repeated specialist work.
path = "mcp/prompts/bedrock_entity_workflow.md"
insert_before(
    path,
    "## Normal modelling route",
    """## Minimum necessary evidence

Keep validity strict and calls sparse. Use a tool, inspection, capture, or specialist only when its result can change the next decision or prove an in-scope completion claim.

- Do not inspect each newly placed Cube or capture after every mutation.
- Do not re-discover project/outline state already known from this workflow unless it may have changed.
- Use `inspect_model_bounds` only for numeric envelope/scale/ground/gross-placement questions.
- Capture only reference-corresponding views needed for the current gate; after a local correction, re-capture only affected view(s).
- `UNVERIFIED` does not mean keep searching. Seek more evidence only when it is material and plausibly obtainable; otherwise preserve the uncertainty or report `BLOCKED` when that proof is required.
- Load/use texture or animation specialist instructions only when that stage is actually reached."
)
replace_once(
    path,
    "1. **Orient before mutating.** Use `get_project_info`, then targeted outline/search only as needed. Establish a consistent model frame: X=width, Y=height, Z=length/front-back, plus explicit `front_direction` (`+z` or `-z`) and ground relationship when relevant.",
    "1. **Orient before mutating.** Use `get_project_info` for an existing or uncertain project state, then targeted outline/search only as needed. If this workflow just created the project and no relevant state changed, do not re-read it only for confirmation. Establish X=width, Y=height, Z=length/front-back, explicit `front_direction` when relevant, and the ground relationship when it matters."
)
replace_once(
    path,
    "3. **Create a temporary Primary Form Hypothesis before exact Cube transforms.** For each primary mass, reason about its relative size, relative center/placement, important orientation, major contact, and supporting reference view(s). This is not a locked Cube plan and is not pixel calibration.",
    "3. **Create a temporary Primary Form Hypothesis before exact Cube transforms.** Keep it compact for simple assets: primary masses, relative size/placement, important orientation/contact, and only material uncertainty. Expand the evidence map only for ambiguous/complex relationships. This is not a locked Cube plan or pixel calibration."
)
replace_once(
    path,
    "6. **Measure the primary envelope before visual approval.** After the coarse primary blockout, call `inspect_model_bounds`. Compare its raw width/height/length, center, footprint, and ground/min-Y facts with the approved target envelope when one exists. Matching bounds are structural evidence only and never prove resemblance.",
    "6. **Measure the primary envelope only when it can answer a real question.** Call `inspect_model_bounds` when approved numeric dimensions/envelope exist or when scale, ground, displacement, or gross placement is in doubt. Otherwise skip it. Matching bounds are structural evidence only and never prove resemblance."
)
replace_once(
    path,
    "A provisional extent chosen for an under-constrained axis is a working hypothesis, not verified reference evidence. If the available reference cannot validate that axis, keep the claim UNVERIFIED even when the Cube was placed successfully.",
    "A provisional extent chosen for an under-constrained axis is a working hypothesis, not verified reference evidence. If the available reference cannot validate that axis, keep the claim UNVERIFIED even when the Cube was placed successfully. Do not spend additional calls trying to remove UNVERIFIED unless the missing proof can change the next decision and is plausibly obtainable."
)
replace_once(
    path,
    """## Stage-Gated Tool Routing

The exposed MCP catalog is capability, not a checklist. For normal reference-driven geometry, prefer this lane and do not branch without a concrete stage/intent:

```text
get_project_info / create_project
list_outline / find_elements_by_criteria
place_cube / add_group
inspect_model_bounds / capture_model_views
inspect_element -> modify_cube / modify_cubes_batch
remove_element only for a diagnosed MERGE/REMOVE
undo / save_checkpoint only when recovery value is real
export_model only for a requested deliverable/artifact
```

Branch rules:

- texture/UV/Paint/PBR/material-instance tools only when geometry has reached the appropriate gate and the surface task is active;
- animation tools only when requested and required hierarchy/pivots are coherent;
- Locator/Null Object tools only for a concrete native attachment/effect-point need;
- selection tools only when current editor selection is genuinely required by the active workflow, never as geometry identity;
- `duplicate_element` only after repetition/symmetry is already supported, never to invent primary form;
- `capture_screenshot` only when the current editor view itself answers a question canonical `capture_model_views` cannot;
- validator output is structural diagnostics and never resemblance approval;
- export is not a validation step.

Do **not** use `risky_eval`, `trigger_action`, `fill_dialog`, `emulate_clicks`, `capture_app_screenshot`, `from_geo_json`, generic mesh/armature tooling, or Hytale tooling as shortcuts. Native Bedrock PBR/material-instance workflows remain valid when the asset actually requires them.

Prefer `inspect_model_bounds` + `capture_model_views` for whole-form evidence, `inspect_element` for a diagnosed local target, exact UUIDs for normal mutation/hierarchy targets, and `modify_cubes_batch` only when one causal correction genuinely spans several explicit Cube UUIDs. If primary geometry is still FAIL/UNVERIFIED, do not switch domains merely to make the asset look more complete.""",
    """## Tool routing boundary

The catalog is capability, not a checklist. Stay in the smallest active lane: project/orient -> coarse Cube/Group build -> relevant model views -> exact inspect/correct only on a diagnosed mismatch -> downstream domain only after its prerequisite gate -> export only for a requested artifact.

Use bounds only for envelope/scale/ground questions, selection only for a real selection workflow, duplication only for supported repetition/symmetry, validators only for structural diagnostics, and checkpoints only when rollback value is meaningful. Do not use `risky_eval`, generic UI automation, generic Mesh/Hytale tooling, or a different format as shortcuts."
)

# Foundation workflow: make expensive evidence explicitly conditional and local.
path = "docs/foundation/03-modelling-workflow.md"
replace_once(
    path,
    "inspect_model_bounds\n↓\ncapture_model_views",
    "inspect_model_bounds only when numeric envelope/scale/ground evidence is relevant\n↓\ncapture_model_views using only reference-corresponding views needed for the gate"
)
insert_before(
    path,
    "## 1. Understand Request",
    """## Minimum Necessary Evidence

The workflow is strict about claims, not ritualistic about calls. Use a read, capture, or checkpoint only when its result can change the next modelling decision or prove an in-scope completion claim.

```text
no per-Cube inspect by default
no screenshot per mutation
no automatic full-view capture
no bounds call without an envelope/scale/ground question
no repeated discovery of state already known
no checkpoint based only on mutation count
local correction -> affected view/state only
UNVERIFIED -> preserve uncertainty unless more evidence is both material and obtainable
```

A global failure still reopens the whole-form hypothesis. A genuinely local failure should not trigger a full-project validation ceremony."
)
replace_once(
    path,
    "This may use qualitative/normalized proportions. It is **not**:",
    "This may use qualitative/normalized proportions. Keep it as a compact working note for simple assets and expand it only when complexity/ambiguity requires more evidence tracking. It is **not**:"
)
replace_once(
    path,
    "After coarse primary authoring, use:\n\n`inspect_model_bounds`\n\nCompare raw rendered bounds/center/ground facts with the approved target envelope\nwhen one exists.",
    "After coarse primary authoring, use `inspect_model_bounds` only when an approved\nnumeric target envelope exists or the active question concerns scale, ground,\ndisplacement, or gross placement. Otherwise skip this structural check.\n\nWhen used, compare raw rendered bounds/center/ground facts with the approved target envelope."
)

# Audit: record the efficiency problem and proof taxonomy explicitly.
path = "docs/knowledge/reviews/model-creation-effectiveness-audit-2026-08-10.md"
insert_before(
    path,
    "## Product Priority Rule",
    """## Problem #6 — Validation Overhead / Usage Waste

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

A green CI run must never be reported as proof that visual fidelity, anti-hallucination behaviour, call efficiency, or `BLOCKED` escalation works live. Those remain `LOCAL PROOF REQUIRED` until acceptance scenarios exercise them."
)

# Next-action: latest source boundary + efficiency acceptance metrics + proof honesty.
path = "docs/knowledge/next-action.md"
replace_once(path, "Updated: 2026-08-10", "Updated: 2026-08-11")
replace_once(
    path,
    "`MCP_MODEL_EFFECTIVENESS_SEQUENCING_HARDENING_SOURCE_COMPLETE_LOCAL_PROOF_REQUIRED`",
    "`MCP_MODEL_EFFECTIVENESS_MINIMUM_EVIDENCE_SOURCE_COMPLETE_LOCAL_PROOF_REQUIRED`"
)
replace_once(
    path,
    "The current source slice has hardened **P2 — texture and animation sequencing**. End-to-end downstream production waits for the geometry/rig state it actually depends on; existing-asset texture-only/animation-only tasks may use current geometry as a baseline without inventing a geometry `PASS`; affected downstream work is revalidated after material geometry/hierarchy/pivot changes.",
    "The current source slice has hardened **P2 — texture and animation sequencing**. End-to-end downstream production waits for the geometry/rig state it actually depends on; existing-asset texture-only/animation-only tasks may use current geometry as a baseline without inventing a geometry `PASS`; affected downstream work is revalidated after material geometry/hierarchy/pivot changes.\n\nThe final pre-local cleanup has hardened **Minimum Necessary Evidence**: bounds are conditional, specialists load lazily, checkpoints are risk-based, newly placed Cubes do not require per-Cube inspection, captures happen at meaningful gates/affected views only, simple Primary Form reasoning stays compact, and `UNVERIFIED` is not an automatic retry/search instruction. No runtime mode/profile/framework was added.\n\n**Proof boundary:** modelling-effectiveness CI tests are source/contract regression proof. They are not behavioral proof that Codex follows the workflow, and they are not visual proof that a live model resembles its reference."
)
replace_once(
    path,
    "7. texture-only / animation-only existing-asset task -> bounded domain work without pretending the baseline geometry was reference-approved.",
    "7. texture-only / animation-only existing-asset task -> bounded domain work without pretending the baseline geometry was reference-approved;\n8. efficiency trace -> record tool calls by purpose and flag redundant bounds/discovery/per-Cube inspect/capture/checkpoint/specialist loads;\n9. simple happy-path model -> demonstrate that strict validity can complete with one meaningful primary visual gate rather than screenshot-per-mutation ceremony."
)
replace_once(
    path,
    "If the local environment is unavailable, do **not** invent another modelling framework, readiness state machine, planner, scoring system, or capability slice merely to keep work moving.",
    "If the local environment is unavailable, do **not** invent another modelling framework, readiness state machine, planner, scoring system, efficiency mode, or capability slice merely to keep work moving."
)

# Existing sequencing regression should preserve sequencing, not freeze the previous active status.
path = "mcp/tests/model-effectiveness-sequencing.test.ts"
replace_once(
    path,
    "    expect(next).toContain(\"MCP_MODEL_EFFECTIVENESS_SEQUENCING_HARDENING_SOURCE_COMPLETE_LOCAL_PROOF_REQUIRED\");\n    expect(next).toContain(\"LOCAL — reference-fidelity acceptance scenarios\");",
    "    expect(next).toContain(\"texture and animation sequencing\");\n    expect(next).toContain(\"Minimum Necessary Evidence\");\n    expect(next).toContain(\"LOCAL — reference-fidelity acceptance scenarios\");"
)

# Focused contract regression for the cleanup. It explicitly does not claim live behavior.
Path("mcp/tests/model-effectiveness-minimum-evidence.test.ts").write_text(
'''import { describe, expect, test } from "bun:test";\n\nasync function source(path: string): Promise<string> {\n  return Bun.file(path).text();\n}\n\ndescribe("model creation effectiveness — minimum necessary evidence", () => {\n  test("normal modelling avoids ritual calls while keeping validity gates", async () => {\n    const orchestrator = await source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md");\n    const modelling = await source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md");\n    const workflow = await source("prompts/bedrock_entity_workflow.md");\n    const foundation = await source("../docs/foundation/03-modelling-workflow.md");\n\n    for (const text of [orchestrator, modelling, workflow, foundation]) {\n      expect(text.toLowerCase()).toContain("minimum necessary evidence");\n      expect(text.toLowerCase()).toContain("unverified");\n    }\n    expect(orchestrator).toContain("Do not inspect every newly placed Cube");\n    expect(orchestrator).toContain("Do not capture after every mutation");\n    expect(modelling).toContain("No per-Cube inspection ceremony");\n    expect(modelling).toContain("No screenshot-per-mutation loop");\n    expect(workflow).toContain("Do not inspect each newly placed Cube or capture after every mutation");\n    expect(foundation).toContain("no per-Cube inspect by default");\n  });\n\n  test("bounds, specialists, checkpoints and uncertainty are conditional rather than mandatory", async () => {\n    const orchestrator = await source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md");\n    const modelling = await source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md");\n    const workflow = await source("prompts/bedrock_entity_workflow.md");\n\n    expect(orchestrator).toContain("Load specialists lazily");\n    expect(orchestrator).toContain("Mutation count alone is not a checkpoint trigger");\n    expect(orchestrator).toContain("Use `inspect_model_bounds` only when");\n    expect(modelling).toContain("Otherwise skip the bounds call");\n    expect(workflow).toContain("Otherwise skip it");\n    expect(workflow).toContain("Do not spend additional calls trying to remove UNVERIFIED");\n  });\n\n  test("cleanup remains decision-layer only with no new efficiency profile or runtime mode", async () => {\n    const profile = await source("lib/registrationProfile.ts");\n    const next = await source("../docs/knowledge/next-action.md");\n\n    expect(profile).toContain('export type McpRegistrationProfile = "bedrock_entity" | "extended";');\n    expect(profile).not.toContain("lean_mode");\n    expect(profile).not.toContain("efficiency_mode");\n    expect(profile).not.toContain("minimum_evidence");\n    expect(next).toContain("MCP_MODEL_EFFECTIVENESS_MINIMUM_EVIDENCE_SOURCE_COMPLETE_LOCAL_PROOF_REQUIRED");\n    expect(next).toContain("LOCAL — reference-fidelity acceptance scenarios");\n  });\n\n  test("CI modelling gates are explicitly contract proof, not behavioral or visual proof", async () => {\n    const audit = await source("../docs/knowledge/reviews/model-creation-effectiveness-audit-2026-08-10.md");\n    const next = await source("../docs/knowledge/next-action.md");\n\n    expect(audit).toContain("Proof Taxonomy — Do Not Confuse Contract With Behaviour");\n    expect(audit).toContain("contract proof");\n    expect(audit).toContain("BEHAVIORAL MODELLING PROOF");\n    expect(audit).toContain("REFERENCE-FIDELITY OUTCOME PROOF");\n    expect(next).toContain("They are not behavioral proof that Codex follows the workflow");\n    expect(next).toContain("not visual proof that a live model resembles its reference");\n  });\n});\n''',
    encoding="utf-8",
)

print("Applied minimum necessary evidence cleanup.")
