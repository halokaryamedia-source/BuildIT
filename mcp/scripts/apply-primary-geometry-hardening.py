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
    p.write_text(text.replace(marker, addition + marker, 1), encoding="utf-8")


# 1. Cube mutation results must never imply visual/reference acceptance.
cubes = "mcp/server/tools/cubes.ts"
replace_once(
    cubes,
    "If `texture` is omitted, existing default-texture behavior is preserved. A supplied texture resolves exact UUID first, then exact texture ID, then exact name only when unique; ambiguous or missing references fail before Undo/Cube creation.",
    "If `texture` is omitted, existing default-texture behavior is preserved. A supplied texture resolves exact UUID first, then exact texture ID, then exact name only when unique; ambiguous or missing references fail before Undo/Cube creation. A successful return confirms only that authored Cube state was applied; it does not evaluate silhouette, proportion, placement quality, or reference fidelity.",
)
replace_once(
    cubes,
    "Auto UV setting: 0 = disabled, 1 = enabled, 2 = relative auto UV.",
    "Auto UV setting: 0 = disabled, 1 = enabled, 2 = relative auto UV. A successful return confirms only that the authored update was applied; it does not evaluate whether the Cube is visually correct or matches the reference.",
)
replace_once(
    cubes,
    "This tool performs no visual judgement, planning, reparenting, UV work, or automatic correction.",
    "This tool performs no visual judgement, planning, reparenting, UV work, or automatic correction. A successful return confirms only that the requested authored updates were applied; it does not mean the geometry was corrected visually.",
)

replace_once(
    cubes,
    '''    const result = {\n      added: cubes.length,\n      cubes: cubes.map((cube: Cube) => finalCubeState(cube)),\n    };''',
    '''    const result = {\n      execution: "applied" as const,\n      visual_verdict: "not_evaluated" as const,\n      added: cubes.length,\n      cubes: cubes.map((cube: Cube) => finalCubeState(cube)),\n    };''',
)
replace_once(
    cubes,
    'text: `Added ${cubes.length} Cube${cubes.length === 1 ? "" : "s"}.`,',
    'text: `Placed ${cubes.length} Cube${cubes.length === 1 ? "" : "s"}. Execution succeeded; reference fidelity was not evaluated.`,',
)
replace_once(
    cubes,
    '''    const result = {\n      modified: cubes.length,\n      cube: finalCubeState(cubes[0]),\n    };''',
    '''    const result = {\n      execution: "applied" as const,\n      visual_verdict: "not_evaluated" as const,\n      modified: cubes.length,\n      cube: finalCubeState(cubes[0]),\n    };''',
)
replace_once(
    cubes,
    'text: `Modified Cube ${cubes[0].name} (${cubes[0].uuid}).`,',
    'text: `Applied authored update to Cube ${cubes[0].name} (${cubes[0].uuid}). Reference fidelity was not evaluated.`,',
)
replace_once(
    cubes,
    '''    const result = {\n      modified: targets.length,\n      cubes: targets.map(({ cube }) => finalCubeState(cube)),\n    };''',
    '''    const result = {\n      execution: "applied" as const,\n      visual_verdict: "not_evaluated" as const,\n      modified: targets.length,\n      cubes: targets.map(({ cube }) => finalCubeState(cube)),\n    };''',
)
replace_once(
    cubes,
    'text: `Corrected ${targets.length} Cubes in one Undo unit.`,',
    'text: `Applied authored updates to ${targets.length} Cubes in one Undo unit. Reference fidelity was not evaluated.`,',
)

# 2. Modelling specialist: successful placement is execution evidence only and
#    primary blockout must stop for visual review before detail continues.
skill_addition = r'''#### Placement Execution Is Not Geometry Approval

Treat every successful `place_cube`, `modify_cube`, or `modify_cubes_batch` call as **execution evidence only**. It proves that Blockbench accepted the authored state; it does not prove that the chosen mass, size, position, depth, rotation, contact, or silhouette is correct. Cube mutation results use `visual_verdict: not_evaluated` for this reason.

Do not continue with another Cube merely because the previous placement succeeded. Every additional primary Cube must still be justified by a primary mass or necessary split that remains unrepresented in the current Primary Form Hypothesis.

Once the currently hypothesized primary masses are represented well enough to judge the whole form, **stop adding geometry** and run the primary visual gate before any secondary/detail pass. Do not use extra detail, bevel-like stepped Cubes, texture, or decorative parts to make an unverified primary scaffold look more finished.

If the primary gate returns:

```text
FAIL       revise/rebuild the responsible primary mass relationships before adding detail
UNVERIFIED keep unsupported axes/relationships provisional; do not claim them correct
PASS       only then continue to secondary geometry
```

When one axis such as depth is weakly supported, a provisional working extent may be necessary to create a 3D blockout, but it remains a hypothesis. Do not convert that provisional value into reference-backed certainty simply because `place_cube` accepted it.

'''
insert_before(
    ".agents/skills/blockbench-bedrock-modelling/SKILL.md",
    "#### Mandatory Reference Fidelity Verdict\n",
    skill_addition,
)

# 3. Canonical MCP prompt carries the same boundary so Codex gets it from MCP.
prompt_addition = r'''### Placement result boundary

A successful `place_cube`, `modify_cube`, or `modify_cubes_batch` call means only that Blockbench applied the authored mutation. Cube mutation results report `visual_verdict: not_evaluated`; never reinterpret that execution success as reference fidelity, geometric correctness, or progress toward PASS.

Do not chain Cube placement based on previous tool success. Each next primary Cube must represent a still-required primary mass/necessary split from the current Primary Form Hypothesis. Once those primary masses are represented well enough to judge the whole form, stop placing geometry and run the primary visual gate before adding secondary/detail Cubes.

A provisional extent chosen for an under-constrained axis is a working hypothesis, not verified reference evidence. If the available reference cannot validate that axis, keep the claim UNVERIFIED even when the Cube was placed successfully.

'''
insert_before(
    "mcp/prompts/bedrock_entity_workflow.md",
    "5. **Use rotation only with evidence and an intentional pivot.**",
    prompt_addition,
)

# 4. Architecture decision records the mutation-result semantic boundary.
decision_addition = r'''## Mutation Result Boundary

Cube mutation tools separate execution from visual acceptance:

```text
execution: applied
visual_verdict: not_evaluated
```

This is intentional. `place_cube`, `modify_cube`, and `modify_cubes_batch` can prove that authored state changed, but they cannot prove that the geometry resembles the reference. Language such as "corrected Cubes" must not be emitted by mutation tools because correction is a visual/model decision made only after fresh evidence.

A successful placement is therefore not a reason to continue placing more geometry. The modelling workflow must stop after a judgeable primary blockout and obtain a Reference Fidelity Verdict before secondary/detail geometry continues.

'''
insert_before(
    "docs/knowledge/decisions/reference-fidelity-loop.md",
    "## Observation Decision\n",
    decision_addition,
)

# 5. Expand Problem #2 solution in the product-effectiveness owner.
audit = "docs/knowledge/reviews/model-creation-effectiveness-audit-2026-08-10.md"
old_problem2 = r'''## Problem #2 — Wrong Primary Geometry

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
'''
new_problem2 = r'''## Problem #2 — Wrong Primary Geometry

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
'''
replace_once(audit, old_problem2, new_problem2)

# 6. Advance next-action to cross-view/depth hallucination after this source slice.
next_action = "docs/knowledge/next-action.md"
replace_once(
    next_action,
    "`MCP_MODEL_EFFECTIVENESS_FALSE_PASS_HARDENING_SOURCE_COMPLETE_LOCAL_PROOF_REQUIRED`",
    "`MCP_MODEL_EFFECTIVENESS_PRIMARY_GEOMETRY_HARDENING_SOURCE_COMPLETE_LOCAL_PROOF_REQUIRED`",
)
old_next = r'''The next bounded problem is:

```text
P0 — wrong primary geometry decomposition
```

Audit whether the current Primary Form Hypothesis → coarse Cube blockout workflow actually prevents the recurring real failures: wrong whole silhouette, wrong relative mass scale/placement, front-view overfitting with bad depth, arbitrary slopes/rotations, excessive Cubes before recognizability, and detail used to compensate for a wrong primary scaffold.

Do not add TextureMesh, a planner, automatic image-to-Cuboid reconstruction, or another modelling framework unless a concrete modelling requirement proves it is needed.
'''
new_next = r'''The current source slice has hardened **P0 — wrong primary geometry decomposition** around execution-success bias and premature detail.

The next bounded modelling problem is:

```text
P0 — cross-view / depth hallucination
```

Audit how Codex derives width/height/depth, placement, and orientation when reference views provide unequal or conflicting evidence. The solution should keep unsupported axes explicitly provisional/UNVERIFIED and prevent a strong front-view match from hiding bad side/top/depth geometry.

Do not add TextureMesh, a planner, automatic image-to-Cuboid reconstruction, similarity scoring, or another modelling framework unless a concrete modelling requirement proves it is needed.
'''
replace_once(next_action, old_next, new_next)

# 7. Focused regression test for tool result semantics + modelling stop gate.
test_path = Path("mcp/tests/model-effectiveness-primary-geometry.test.ts")
test_path.write_text(r'''import { describe, expect, test } from "bun:test";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("model creation effectiveness — primary geometry", () => {
  test("Cube mutation results separate execution from visual acceptance", async () => {
    const cubes = await source("server/tools/cubes.ts");
    expect((cubes.match(/visual_verdict: \"not_evaluated\" as const/g) ?? []).length).toBe(3);
    expect((cubes.match(/execution: \"applied\" as const/g) ?? []).length).toBe(3);
    expect(cubes).toContain("Reference fidelity was not evaluated");
    expect(cubes).not.toContain("Corrected ${targets.length} Cubes");
    expect(cubes).toContain("does not mean the geometry was corrected visually");
  });

  test("successful placement cannot authorize more geometry or detail", async () => {
    const modelling = await source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md");
    const workflow = await source("prompts/bedrock_entity_workflow.md");

    for (const text of [modelling, workflow]) {
      expect(text).toContain("execution");
      expect(text).toContain("not_evaluated");
      expect(text.toLowerCase()).toContain("stop");
      expect(text.toLowerCase()).toContain("primary");
      expect(text.toLowerCase()).toContain("secondary");
    }
    expect(modelling).toContain("Do not continue with another Cube merely because the previous placement succeeded");
    expect(workflow).toContain("Do not chain Cube placement based on previous tool success");
  });

  test("under-constrained geometry remains provisional rather than becoming success-by-placement", async () => {
    const modelling = await source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md");
    const workflow = await source("prompts/bedrock_entity_workflow.md");
    const audit = await source("../docs/knowledge/reviews/model-creation-effectiveness-audit-2026-08-10.md");

    expect(modelling).toContain("provisional working extent");
    expect(workflow).toContain("working hypothesis, not verified reference evidence");
    expect(audit).toContain("Execution-success bias");
    expect(audit).toContain("Success chaining");
    expect(audit).toContain("Premature detail");
  });
});
''', encoding="utf-8")

print("Applied primary geometry effectiveness hardening.")
