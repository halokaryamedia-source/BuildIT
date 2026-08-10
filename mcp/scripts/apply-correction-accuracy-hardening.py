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


cubes = "mcp/server/tools/cubes.ts"

# Harden single-Cube vectors and reject id-only no-op requests.
replace_once(
    cubes,
    '''  origin: z
    .array(z.number()).length(3)
    .optional()
    .describe(
      "Cube pivot/origin. If supplied without from/to/rotation, this is a pivot-only correction and visual position is preserved. If combined with from/to/rotation, origin is applied as part of the authored geometry rewrite."
    ),
  from: z
    .array(z.number()).length(3)
    .optional()
    .describe("Starting point of the cube."),
  to: z
    .array(z.number()).length(3)
    .optional()
    .describe("Ending point of the cube."),
  rotation: z
    .array(z.number()).length(3)
    .optional()''',
    '''  origin: finiteVec3Schema
    .optional()
    .describe(
      "Cube pivot/origin. If supplied without from/to/rotation, this is a pivot-only correction and visual position is preserved. If combined with from/to/rotation, origin is applied as part of the authored geometry rewrite."
    ),
  from: finiteVec3Schema
    .optional()
    .describe("Starting point of the cube."),
  to: finiteVec3Schema
    .optional()
    .describe("Ending point of the cube."),
  rotation: finiteVec3Schema
    .optional()''',
)

replace_once(
    cubes,
    '''  visibility: z
    .boolean()
    .optional()
    .describe("Whether the cube is visible or not."),
});

export const modifyCubesBatchParameters''',
    '''  visibility: z
    .boolean()
    .optional()
    .describe("Whether the cube is visible or not."),
}).refine(
  (update) =>
    Object.entries(update).some(
      ([key, value]) => key !== "id" && value !== undefined
    ),
  {
    message:
      "modify_cube requires at least one authored field change in addition to id. Inspect the target and send the intended correction; an id-only request is not progress.",
  }
);

export const modifyCubesBatchParameters''',
)

# Tool descriptions expose the structural-effect contract without claiming visual correctness.
replace_once(
    cubes,
    '''Auto UV setting: 0 = disabled, 1 = enabled, 2 = relative auto UV. A successful return confirms only that the authored update was applied; it does not evaluate whether the Cube is visually correct or matches the reference.''',
    '''Auto UV setting: 0 = disabled, 1 = enabled, 2 = relative auto UV. The result includes authored before/after state plus a deterministic `geometry_effect` summary (changed transform fields, center/size/origin/rotation deltas, visibility change) so the caller can verify that the structural effect matches the diagnosed correction invariant. A successful return still does not evaluate whether the Cube is visually correct or matches the reference.''',
)
replace_once(
    cubes,
    '''This tool performs no visual judgement, planning, reparenting, UV work, or automatic correction. A successful return confirms only that the requested authored updates were applied; it does not mean the geometry was corrected visually.''',
    '''This tool performs no visual judgement, planning, reparenting, UV work, or automatic correction. Each target result includes authored before/after state plus a deterministic `geometry_effect` summary so unintended structural side effects can be detected before visual approval. A successful return confirms only that the requested authored updates were applied; it does not mean the geometry was corrected visually.''',
)

# Add deterministic structural-effect helpers after finalCubeState.
effect_helpers = r'''
type CubeAuthoredState = ReturnType<typeof finalCubeState>;

function vec3Delta(
  after: readonly number[],
  before: readonly number[]
): [number, number, number] {
  return [
    after[0] - before[0],
    after[1] - before[1],
    after[2] - before[2],
  ];
}

function vec3Equal(a: readonly number[], b: readonly number[]): boolean {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}

function cubeStateCenter(state: CubeAuthoredState): [number, number, number] {
  return [
    (state.from[0] + state.to[0]) / 2,
    (state.from[1] + state.to[1]) / 2,
    (state.from[2] + state.to[2]) / 2,
  ];
}

function cubeGeometryEffect(before: CubeAuthoredState, after: CubeAuthoredState) {
  const changedFields: string[] = [];
  if (!vec3Equal(before.from, after.from)) changedFields.push("from");
  if (!vec3Equal(before.to, after.to)) changedFields.push("to");
  if (!vec3Equal(before.origin, after.origin)) changedFields.push("origin");
  if (!vec3Equal(before.rotation, after.rotation)) changedFields.push("rotation");
  if (before.visibility !== after.visibility) changedFields.push("visibility");

  return {
    changed_fields: changedFields,
    center_delta: vec3Delta(cubeStateCenter(after), cubeStateCenter(before)),
    size_delta: vec3Delta(after.size, before.size),
    origin_delta: vec3Delta(after.origin, before.origin),
    rotation_delta: vec3Delta(after.rotation, before.rotation),
    visibility_changed: before.visibility !== after.visibility,
  };
}

'''
insert_before(cubes, "function resolveUniqueCube(reference: string): Cube {\n", effect_helpers)

# Capture single-Cube before/after/effect.
replace_once(
    cubes,
    '''  }) {
    const cubes = [resolveUniqueCube(id)];

    cubes.forEach((cube) =>''',
    '''  }) {
    const cubes = [resolveUniqueCube(id)];
    const before = finalCubeState(cubes[0]);

    cubes.forEach((cube) =>''',
)
replace_once(
    cubes,
    '''    Canvas.updateAll();
    const result = {
      execution: "applied" as const,
      visual_verdict: "not_evaluated" as const,
      modified: cubes.length,
      cube: finalCubeState(cubes[0]),
    };
    return {
      content: [
        {
type: "text" as const,
text: `Applied authored update to Cube ${cubes[0].name} (${cubes[0].uuid}). Reference fidelity was not evaluated.`,
        },
      ],
      structuredContent: result,
    };''',
    '''    Canvas.updateAll();
    const after = finalCubeState(cubes[0]);
    const geometryEffect = cubeGeometryEffect(before, after);
    const result = {
      execution: "applied" as const,
      visual_verdict: "not_evaluated" as const,
      modified: cubes.length,
      before,
      after,
      geometry_effect: geometryEffect,
      cube: after,
    };
    return {
      content: [
        {
          type: "text" as const,
          text:
            geometryEffect.changed_fields.length === 0
              ? `Applied request to Cube ${cubes[0].name} (${cubes[0].uuid}), but no geometry/visibility field changed. This is not evidence of correction; reference fidelity was not evaluated.`
              : `Applied authored update to Cube ${cubes[0].name} (${cubes[0].uuid}). Structural effect recorded; reference fidelity was not evaluated.`,
        },
      ],
      structuredContent: result,
    };''',
)

# Capture per-target before/after/effect in batch and remove the misleading internal "corrected" label.
replace_once(
    cubes,
    '''    const targets: Array<{
      cube: Cube;
      update: BatchUpdate;
      pivotOnly: boolean;
    }> = updates.map((update: BatchUpdate) => {''',
    '''    const targets: Array<{
      cube: Cube;
      update: BatchUpdate;
      pivotOnly: boolean;
      before: CubeAuthoredState;
    }> = updates.map((update: BatchUpdate) => {''',
)
replace_once(
    cubes,
    '''      return { cube, update, pivotOnly };
    });''',
    '''      return { cube, update, pivotOnly, before: finalCubeState(cube) };
    });''',
)
replace_once(
    cubes,
    '''      Undo.finishEdit("Agent corrected multiple cubes");''',
    '''      Undo.finishEdit("Agent modified multiple cubes");''',
)
replace_once(
    cubes,
    '''    Canvas.updateAll();
    const result = {
      execution: "applied" as const,
      visual_verdict: "not_evaluated" as const,
      modified: targets.length,
      cubes: targets.map(({ cube }) => finalCubeState(cube)),
    };

    return {
      content: [
        {
          type: "text" as const,
          text: `Applied authored updates to ${targets.length} Cubes in one Undo unit. Reference fidelity was not evaluated.`,
        },
      ],
      structuredContent: result,
    };''',
    '''    Canvas.updateAll();
    const effects = targets.map(({ cube, before }) => {
      const after = finalCubeState(cube);
      return {
        uuid: cube.uuid,
        name: cube.name,
        before,
        after,
        geometry_effect: cubeGeometryEffect(before, after),
      };
    });
    const effectiveGeometryTargets = effects.filter(
      ({ geometry_effect }) => geometry_effect.changed_fields.length > 0
    ).length;
    const result = {
      execution: "applied" as const,
      visual_verdict: "not_evaluated" as const,
      modified: targets.length,
      effective_geometry_targets: effectiveGeometryTargets,
      effects,
      cubes: effects.map(({ after }) => after),
    };

    return {
      content: [
        {
          type: "text" as const,
          text: `Applied authored updates to ${targets.length} Cubes in one Undo unit; ${effectiveGeometryTargets} target(s) changed geometry/visibility. Structural effects recorded; reference fidelity was not evaluated.`,
        },
      ],
      structuredContent: result,
    };''',
)

# Inspection provides center so translation/resize invariants do not require extra arithmetic guesses.
inspection = "mcp/server/tools/element-inspection.ts"
replace_once(
    inspection,
    '''Returns focused read-only authored state for one explicit Bedrock Cube, Group, Locator, or Null Object in the active project.''',
    '''Returns focused read-only authored state for one explicit Bedrock Cube, Group, Locator, or Null Object in the active project. Cube output includes from/to, size, center, origin, rotation, parent, and visibility so a local correction can be derived from exact current authored state.''',
)
replace_once(
    inspection,
    '''    size: cubeSize(cube),
    origin: [...cube.origin] as [number, number, number],''',
    '''    size: cubeSize(cube),
    center: [
      (cube.from[0] + cube.to[0]) / 2,
      (cube.from[1] + cube.to[1]) / 2,
      (cube.from[2] + cube.to[2]) / 2,
    ] as [number, number, number],
    origin: [...cube.origin] as [number, number, number],''',
)

# Geometry policy: diagnose -> invariant -> expected structural effect -> mutate -> verify effect -> visual proof.
correction_contract = r'''## Correction Accuracy Contract

A visual diagnosis is not yet a coordinate correction. Before mutating a diagnosed local mismatch, define a small correction contract from fresh `inspect_element` state:

```text
mismatch + supporting view(s)
causal class: TRANSLATE | RESIZE | ROTATE | REATTACH | SPLIT | MERGE/REMOVE | ADD MASS
exact target UUID(s)
current authored state
invariant(s) that must remain unchanged
expected structural effect
```

Keep this compact; it is not a persisted planner.

### Structural invariants by common correction

- **TRANSLATE** — size must remain unchanged. The intended center moves by the diagnosed delta. For a rotated Cube, preserve the intended pivot relationship rather than moving only its extents around a stale pivot.
- **RESIZE** — name the axis and what remains fixed before choosing numbers: center, one face/contact edge, or another evidence-backed anchor. A resize is invalid if an unplanned axis or protected contact moves.
- **ROTATE** — do not change `from/to/size` merely to make an angle adjustment. Use the inspected pivot or an explicitly justified new pivot, then verify the returned rotation/origin effect.
- **REATTACH** — distinguish a visual contact problem from a hierarchy-parent problem. A visual contact may resolve as TRANSLATE/RESIZE. If the actual correction requires reparenting an existing Cube/Group and the exposed normal MCP surface has no direct supported owner, stop as `BLOCKED`; do not fake reparenting by moving geometry until it appears attached.

After `modify_cube` / `modify_cubes_batch`, inspect the returned `geometry_effect` before visual approval:

```text
changed_fields
center_delta
size_delta
origin_delta
rotation_delta
visibility_changed
```

If the structural effect violates the declared invariant, the correction itself is invalid even before visual review. Undo the last bounded correction when safe, revise the correction hypothesis, and do not describe it as progress.

If a geometry correction was intended but the returned structural effect shows no geometry/visibility change, it does not count as a successful correction attempt. Re-diagnose instead of repeating the same request.

Only after the structural effect matches the intended correction contract should fresh affected model view(s) decide whether the visual mismatch improved.

'''
insert_before("docs/foundation/05-geometry-standard.md", "## Multi-Cube Correction\n", correction_contract)

# Modelling specialist gets the operational correction gate.
skill_contract = r'''### Correction Contract Before Numeric Mutation

For a diagnosed local mismatch, do not jump directly from "too long / too high / misplaced / wrong angle" to new coordinates. First read the exact target with `inspect_element`, then state the smallest useful correction contract:

```text
cause
target UUID(s)
current state
invariant(s)
expected structural effect
```

Examples:

- TRANSLATE: preserve size; move center by the intended delta.
- RESIZE: identify the axis plus the center/face/contact that must stay fixed.
- ROTATE: preserve extents/size; change only the evidence-backed angle/pivot relationship.
- hierarchy REATTACH: use a direct supported parent-mutation owner only. If none is exposed, report `BLOCKED` rather than simulating attachment through coordinate patches.

`modify_cube` and `modify_cubes_batch` return authored before/after state plus `geometry_effect`. Check that effect against the invariant **before** calling the visual correction successful. An unintended center shift during a center-preserving resize, a size change during TRANSLATE, or a changed extent during ROTATE is a failed correction.

If the requested geometry correction produces no effective geometry/visibility change, do not call it progress and do not repeat the same values. Re-diagnose. If the same causal direction reaches the existing two-failure threshold without new evidence, enter `BLOCKED`.

'''
insert_before(
    ".agents/skills/blockbench-bedrock-modelling/SKILL.md",
    "### 6. Add Secondary Geometry / Hierarchy / Pivots\n",
    skill_contract,
)

# Canonical MCP prompt mirrors the minimum invariant/effect workflow.
prompt_contract = r'''### Correction accuracy contract

When a local mismatch is diagnosed, `inspect_element` first and derive the mutation from exact authored state. Before editing, identify the causal class, target UUID(s), the invariant that must stay unchanged, and the expected structural effect.

Common invariants:

- TRANSLATE -> preserve size; move center intentionally.
- RESIZE -> name the changed axis and the evidence-backed anchor/center/contact that stays fixed.
- ROTATE -> do not rewrite from/to/size merely to change angle; use an inspected/justified pivot.
- hierarchy REATTACH -> if no direct supported reparent owner is exposed, `BLOCKED`; never fake parent correction with coordinate movement.

`modify_cube` / `modify_cubes_batch` return before/after authored state plus `geometry_effect`. Validate `changed_fields`, center/size/origin/rotation deltas, and visibility effect against the correction invariant before visual re-observation. A structurally wrong effect is a failed correction even if the tool call succeeded. A requested geometry correction with no effective geometry/visibility change is not progress.

'''
insert_before(
    "mcp/prompts/bedrock_entity_workflow.md",
    "13. **Re-observe after correction.**",
    prompt_contract,
)

# Product audit formalizes the root cause and implemented solution.
audit_path = "docs/knowledge/reviews/model-creation-effectiveness-audit-2026-08-10.md"
audit_addition = r'''## Problem #4 — Correction Accuracy

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

'''
insert_before(audit_path, "## Product Priority Rule\n", audit_addition)
replace_once(
    audit_path,
    "| P1 | Correction is another guess | Agent notices a wrong part but changes coordinates from memory/screenshot and makes it worse | Visual diagnosis is not linked to exact authored state | Locate exact identity, `inspect_element`, classify the causal error, then perform one bounded correction and re-observe the affected view |",
    "| P1 | Correction is another guess | Agent notices a wrong part but changes coordinates from memory/screenshot, or fixes one symptom while accidentally moving another relationship | Visual diagnosis is not converted into an explicit invariant/expected structural effect before mutation | Inspect exact authored state; define causal class + invariant; mutate once; verify returned before/after `geometry_effect`; only then re-observe visually |",
)

# Advance next-action to the next problem after this bounded slice.
next_path = "docs/knowledge/next-action.md"
replace_once(
    next_path,
    "`MCP_MODEL_EFFECTIVENESS_CROSS_VIEW_BLOCKER_HARDENING_SOURCE_COMPLETE_LOCAL_PROOF_REQUIRED`",
    "`MCP_MODEL_EFFECTIVENESS_CORRECTION_ACCURACY_HARDENING_SOURCE_COMPLETE_LOCAL_PROOF_REQUIRED`",
)
old_next = r'''The next bounded modelling problem is:

```text
P1 — correction accuracy
```

Audit whether a diagnosed visual mismatch reliably becomes the correct causal mutation (`TRANSLATE / RESIZE / ROTATE / REATTACH / SPLIT / MERGE-REMOVE / ADD MASS`) from exact authored state, instead of another coordinate guess. Preserve the new blocker rule: two failed attempts in the same causal direction without new evidence must stop rather than loop.

Do not add TextureMesh, a planner, automatic image-to-Cuboid reconstruction, similarity scoring, or another modelling framework unless a concrete modelling requirement proves it is needed.
'''
new_next = r'''The current source slice has hardened **P1 — correction accuracy** by linking diagnosis to exact authored state, a declared structural invariant, and deterministic before/after mutation effects.

The next bounded modelling problem is:

```text
P1 — tool-choice / context friction
```

Audit whether Codex is still exposed to or encouraged to call irrelevant/redundant tools during normal create -> observe -> correct modelling. Prefer simplifying routing/descriptions over deleting native Bedrock capability. Do not reduce tool count merely for aesthetics.

Preserve all existing validity rules: execution success is not visual approval, unsupported axes stay provisional/unverified, unresolved blockers stop mutation, and correction effects must match the declared invariant.

Do not add TextureMesh, a planner, automatic image-to-Cuboid reconstruction, similarity scoring, or another modelling framework unless a concrete modelling requirement proves it is needed.
'''
replace_once(next_path, old_next, new_next)

# Focused executable/source contracts.
Path("mcp/tests/model-effectiveness-correction-accuracy.test.ts").write_text(r'''import { describe, expect, test } from "bun:test";
import { modifyCubeParameters } from "@/server/tools/cubes";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("model creation effectiveness — correction accuracy", () => {
  test("single-Cube mutation rejects id-only correction requests", () => {
    expect(() => modifyCubeParameters.parse({ id: "cube-1" })).toThrow();
    expect(
      modifyCubeParameters.parse({ id: "cube-1", from: [0, 0, 0] }).from
    ).toEqual([0, 0, 0]);
    expect(() =>
      modifyCubeParameters.parse({ id: "cube-1", to: [Infinity, 1, 1] })
    ).toThrow();
  });

  test("Cube correction results expose before/after structural effects", async () => {
    const cubes = await source("server/tools/cubes.ts");
    const inspection = await source("server/tools/element-inspection.ts");

    expect(cubes).toContain("geometry_effect: geometryEffect");
    expect(cubes).toContain("center_delta");
    expect(cubes).toContain("size_delta");
    expect(cubes).toContain("origin_delta");
    expect(cubes).toContain("rotation_delta");
    expect(cubes).toContain("effective_geometry_targets");
    expect(cubes).not.toContain('Undo.finishEdit("Agent corrected multiple cubes")');
    expect(inspection).toContain("center: [");
  });

  test("modelling workflow requires an invariant before numeric correction", async () => {
    const geometry = await source("../docs/foundation/05-geometry-standard.md");
    const modelling = await source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md");
    const workflow = await source("prompts/bedrock_entity_workflow.md");

    for (const text of [geometry, modelling, workflow]) {
      expect(text.toLowerCase()).toContain("invariant");
      expect(text).toContain("geometry_effect");
      expect(text).toContain("TRANSLATE");
      expect(text).toContain("RESIZE");
      expect(text).toContain("ROTATE");
    }
    expect(modelling).toContain("An unintended center shift");
    expect(workflow).toContain("hierarchy REATTACH");
    expect(workflow).toContain("`BLOCKED`");
  });

  test("next work remains problem-driven after correction accuracy", async () => {
    const next = await source("../docs/knowledge/next-action.md");
    expect(next).toContain(
      "MCP_MODEL_EFFECTIVENESS_CORRECTION_ACCURACY_HARDENING_SOURCE_COMPLETE_LOCAL_PROOF_REQUIRED"
    );
    expect(next).toContain("P1 — tool-choice / context friction");
  });
});
''', encoding="utf-8")

print("Applied correction accuracy hardening.")
