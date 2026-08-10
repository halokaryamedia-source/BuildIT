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


skill_verdict = r'''#### Mandatory Reference Fidelity Verdict

Do not begin a visual gate by asking whether the model "looks good". Begin by actively searching for differences between each relevant reference view and the matching fresh model view.

Every material whole-form visual gate must end in exactly one state:

```text
FAIL
UNVERIFIED
PASS
```

- **FAIL** — any critical or major mismatch is visible. Name the mismatch, responsible mass/relationship when known, severity, and the reference/model view that demonstrates it.
- **UNVERIFIED** — evidence is missing or insufficient for the claim. Missing side/depth/top evidence, conflicting reference views, or an unavailable current model view cannot be upgraded to PASS by plausibility.
- **PASS** — only after a difference-first review finds no critical or major mismatch in the applicable criteria supported by the available reference evidence.

For each relevant paired view, explicitly check applicable silhouette, primary proportion, primary placement, orientation/slope, and visible contact differences before deciding the verdict. If multiple independent reference views exist and the claim concerns the 3D whole form, use the views that constrain the relevant axes. A front-only match cannot become a full 3D PASS when side/depth evidence is missing.

Generic statements such as "looks correct", "matches well", or "all parts are present" are not evidence and must not be used as the basis for PASS.

'''
insert_before(
    ".agents/skills/blockbench-bedrock-modelling/SKILL.md",
    "#### Hard rebuild rule\n",
    skill_verdict,
)

prompt_verdict = r'''## Reference Fidelity Verdict

At every material visual gate, perform a **difference-first** reference ↔ model review before approval. Do not start from "does it look good?"; first search for concrete mismatch.

The verdict must be exactly one of:

```text
FAIL
UNVERIFIED
PASS
```

- **FAIL** — a critical or major mismatch is visible. State the mismatch, severity, and supporting reference/model view(s).
- **UNVERIFIED** — evidence needed for the claim is missing, ambiguous, conflicting, or unavailable. Missing evidence is not permission to guess.
- **PASS** — only when fresh corresponding model views were directly compared with the available reference views, applicable silhouette/proportion/placement/orientation/contact criteria were checked, and no critical or major mismatch was found.

For each relevant paired view, report material differences before the verdict. When the reference provides multiple views, use the views that constrain the claimed 3D axes. A model matching only the front view is not a full 3D PASS if depth/side evidence is missing or fails.

'''
insert_before(
    "mcp/prompts/bedrock_entity_workflow.md",
    "## Locator / Null Object authored state\n",
    prompt_verdict,
)

validation_verdict = r'''## Visual Verdict Contract

Every material visual gate must end in exactly one state:

```text
FAIL
UNVERIFIED
PASS
```

### FAIL

Use when any critical or major mismatch is visible in an applicable criterion. The review must name the mismatch and the corresponding reference/model evidence.

### UNVERIFIED

Use when evidence needed for the claim is missing or insufficient. Examples include missing side/depth reference evidence, materially conflicting views, or an unavailable current model capture. Missing evidence is not a visual pass.

### PASS

Use only after fresh current-revision model images were directly compared with the corresponding reference view(s), a difference-first review checked the applicable silhouette/proportion/placement/orientation/contact criteria, and no critical or major mismatch was found.

A claim may be narrower than the whole model. For example, a front silhouette can pass while depth remains UNVERIFIED. Do not upgrade a partial-view success into a full 3D PASS.

### Difference-first review

Before approval, actively search for mismatch in each relevant paired view:

```text
REFERENCE VIEW ↔ MODEL VIEW
silhouette difference
primary proportion difference
primary placement difference
orientation / slope difference
visible contact difference
severity: critical / major / minor / none
```

Only after this mismatch search may the reviewer choose PASS. Generic positive language is not a substitute for this comparison.

'''
insert_before(
    "docs/foundation/07-visual-validation.md",
    "## Evidence Types\n",
    validation_verdict,
)

decision_verdict = r'''## Reference Fidelity Verdict

Visual approval uses three states, not a forced binary:

```text
FAIL        critical/major mismatch exists
UNVERIFIED  evidence is insufficient for the claim
PASS        fresh paired evidence was checked and no critical/major mismatch remains
```

The review is difference-first: search for silhouette, proportion, placement, orientation/slope, and visible-contact mismatches before approval. If the reference does not constrain an important axis or view, that aspect remains UNVERIFIED rather than being guessed into PASS.

'''
insert_before(
    "docs/knowledge/decisions/reference-fidelity-loop.md",
    "## Observation Decision\n",
    decision_verdict,
)

orchestrator_verdict = r'''## Visual Verdict Boundary

For reference-driven modelling, route visual judgement to `blockbench-bedrock-modelling` and require its `FAIL / UNVERIFIED / PASS` Reference Fidelity Verdict. Missing reference/view evidence means UNVERIFIED for that claim, not PASS. Do not let successful MCP execution, bounds, hierarchy, or validator output upgrade the visual verdict.

'''
insert_before(
    ".agents/skills/blockit-bedrock-entity-mcp/SKILL.md",
    "## Texture And PBR Boundary\n",
    orchestrator_verdict,
)

replace_once(
    "docs/knowledge/next-action.md",
    "`MCP_LOCATOR_SOURCE_COMPLETE_LOCAL_PROOF_REQUIRED`",
    "`MCP_MODEL_EFFECTIVENESS_FALSE_PASS_HARDENING_SOURCE_COMPLETE_LOCAL_PROOF_REQUIRED`",
)

priority_section = r'''## Model Creation Effectiveness Priority

The primary product goal is not MCP feature completeness. It is whether Codex can create a Bedrock Entity model that actually resembles the approved reference.

Current problem order:

```text
P0  false visual approval
P0  wrong primary geometry decomposition
P0  cross-view / depth hallucination
P1  patch churn / sunk-cost preservation
P1  correction accuracy
P1  tool-choice/context friction
P2  texture and animation sequencing
P3  specialized native capability gaps when a real workflow needs them
```

Problem/solution owner: `docs/knowledge/reviews/model-creation-effectiveness-audit-2026-08-10.md`.

The false-approval solution is now a mandatory difference-first `FAIL / UNVERIFIED / PASS` verdict contract in the modelling skill, canonical MCP prompt, visual-validation policy, and Reference Fidelity decision. No new visual scoring or automatic similarity tool was added.

'''
insert_before(
    "docs/knowledge/next-action.md",
    "## Locator / Null Object Coverage\n",
    priority_section,
)

old_next = r'''## Next Allowed Step

If continuing non-local native-capability work before local Blockbench acceptance becomes available, the next bounded slice is:

```text
TextureMesh official-source audit and minimum direct authored-state coverage
```

Do not reintroduce the removed generic Mesh family as a shortcut; native Bedrock TextureMesh must be mapped from its own Blockbench source contract.
'''
new_next = r'''## Next Allowed Step

If continuing non-local work before local Blockbench acceptance becomes available, continue **model creation effectiveness**, not capability completeness.

The next bounded problem is:

```text
P0 — wrong primary geometry decomposition
```

Audit whether the current Primary Form Hypothesis → coarse Cube blockout workflow actually prevents the recurring real failures: wrong whole silhouette, wrong relative mass scale/placement, front-view overfitting with bad depth, arbitrary slopes/rotations, excessive Cubes before recognizability, and detail used to compensate for a wrong primary scaffold.

Do not add TextureMesh, a planner, automatic image-to-Cuboid reconstruction, or another modelling framework unless a concrete modelling requirement proves it is needed.
'''
replace_once("docs/knowledge/next-action.md", old_next, new_next)

test_marker = '  test("generated-doc source is BlockIT-branded and install guidance does not offer the upstream hosted binary", async () => {\n'
test_addition = r'''  test("reference-driven modelling uses a difference-first three-state visual verdict", async () => {
    const workflow = await source("prompts/bedrock_entity_workflow.md");
    const modelling = await source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md");
    const orchestrator = await source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md");
    const validation = await source("../docs/foundation/07-visual-validation.md");

    for (const text of [workflow, modelling, validation]) {
      expect(text).toContain("FAIL");
      expect(text).toContain("UNVERIFIED");
      expect(text).toContain("PASS");
      expect(text.toLowerCase()).toContain("difference-first");
    }
    expect(orchestrator).toContain("FAIL / UNVERIFIED / PASS");
    expect(workflow).toContain("front view is not a full 3D PASS");
  });

'''
insert_before("mcp/tests/prelocal-prompt-skill-surface.test.ts", test_marker, test_addition)

print("Applied model creation effectiveness verdict hardening.")
