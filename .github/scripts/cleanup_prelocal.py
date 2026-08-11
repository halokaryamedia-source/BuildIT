from pathlib import Path


def replace_once(path: Path, old: str, new: str, label: str) -> None:
    text = path.read_text(encoding="utf-8")
    if text.count(old) != 1:
        raise SystemExit(f"{label} anchor changed")
    path.write_text(text.replace(old, new, 1), encoding="utf-8")


next_path = Path("docs/knowledge/next-action.md")
next_text = '''# Next Action

Updated: 2026-08-11

This is the **single active-task snapshot**. New ChatGPT/Codex sessions read:

`AGENTS.md` → `CONTEXT.md` → this note.

## Active Goal

Maintain BlockIT as a trustworthy **Minecraft Bedrock Entity MCP for Blockbench**. The primary product test is whether Codex can create or revise a clean, editable Bedrock Entity model that follows the approved reference without false visual approval, speculative geometry, or unnecessary MCP calls.

Preserve capability that genuinely belongs to Bedrock Entity. Generic inherited Blockbench capability is not a compatibility requirement, while missing native Bedrock coverage remains a protected gap rather than deletion permission.

## Current Status

`NON_LOCAL_PRELOCAL_READINESS_COMPLETE_LOCAL_ACCEPTANCE_REQUIRED`

Working branch: **`Local` only**.

The bounded non-local pass is complete. Source, contract, CI, generated-doc, official-source, and pinned-SDK evidence are ready; live Codex/Blockbench behavior is not yet proven. Do not add more GitHub-only architecture merely to continue activity. A new non-local change now requires a concrete source defect, failing gate, or explicit product requirement with new evidence.

## Completed Non-local Boundary

```text
P0.1–P0.5  stabilization / engineering gates                    COMPLETE
P1.1       default Bedrock Entity registration profile          COMPLETE
P1.2       explicit family gates                                COMPLETE
P1.3       identity + mutation-result ownership                 COMPLETE
P1.4       stateless transport source/CI proof                  COMPLETE; LOCAL PROOF REQUIRED
P1.5       end-to-end acceptance                                LOCAL PROOF REQUIRED
```

Pre-local work also completed the Bedrock-only prompt/skill stack, generic-semantics containment, project/export lifecycle hardening, numeric/discovery boundaries, minimum-evidence routing, context/payload cleanup, and source-level Locator/Null Object coverage.

Current pinned-SDK default surface:

```text
62 enabled tools
72,775 tools/list response characters
48,674 input-schema characters
11,800 tool-description characters
```

`export_model` remains exposed. `list_export_formats`, `apply_texture`, and `filter_by_material` remain absent from the default callable surface.

Detailed implementation history belongs in Git history and the relevant reviews, not in this file:

- `docs/knowledge/reviews/model-creation-effectiveness-audit-2026-08-10.md`
- `docs/knowledge/reviews/codex-native-deferred-mcp-tool-loading-2026-08-11.md`
- `docs/knowledge/reviews/bedrock-entity-capability-surface-matrix.md`
- `docs/knowledge/decision-log.md`

## Stable Product Boundaries

- target format: `bedrock`;
- normal geometry: Cubes/Cuboids organized by Groups/bones;
- normal model outputs: Bedrock geometry JSON and editable `.bbmodel`;
- default profile: `bedrock_entity`;
- `risky_eval` and `from_geo_json` remain disabled;
- generic fallback families remain explicit opt-in only;
- canonical workflow prompt: `bedrock_entity_workflow`;
- authoring routing: `blockit-bedrock-entity-mcp` → modelling / texturing / animation specialists;
- tool success is execution evidence, never reference-fidelity proof;
- visual gates use `FAIL / UNVERIFIED / PASS`; `BLOCKED` is valid when continuation would require guessing or repeated failed work;
- production texture/animation must not hide unresolved geometry;
- no custom tool router, geometry-only default profile, readiness state machine, scoring layer, or capability pruning without local evidence that the retained architecture is the blocker.

Locator and Null Object direct source ownership is implemented in the existing Elements family, but create/update/inspect/rename/remove plus save/reopen/export round-trip still require local proof.

`nodes://` remains transitional observability while TextureMesh lacks a direct owner. Protected native gaps remain TextureMesh direct authoring/inspection, native visible bounding-box fields, animation controllers, animation sound/timeline effects, animated-texture authoring, and bone-binding expressions. Do not fake them with generic Mesh, arbitrary Cubes, UI automation, risky evaluation, or another format.

## Stopped / Deferred Source Slices

Do not reopen these merely because local acceptance has not started:

- animation action/input contract cleanup;
- Paint cleanup;
- material-instance mutation/read cleanup;
- bounded `nodes://` serialization;
- generic Group identity consolidation;
- `manage_keyframes create` collision slice.

They require genuinely new evidence or an explicit product requirement. Likewise, do not pre-emptively set `tool_output_token_limit`, mass-trim real Bedrock schemas, or default-disable retained Animation/Paint/Texture/Locator capability.

## Evidence Boundary

Source/CI proof does not establish live Blockbench behavior, model quality, or actual Codex call efficiency. The remaining questions require the real local client/runtime:

- whether native Codex deferred/tool search materially reduces model-visible tool exposure while retained domains remain reachable;
- which prompt/skills are actually co-loaded and whether context duplication occurs in practice;
- whether duplicated text plus `structuredContent` can be reduced without losing client-visible evidence;
- whether modelling follows the difference-first visual gate and stops false PASS / speculative correction loops;
- whether save/reopen/export and Locator/Null Object round-trips are correct in Blockbench.

## Next Step

```text
LOCAL — Codex + Blockbench acceptance
```

Run bounded acceptance, not another source redesign:

1. record installed Codex version, active model/provider, Blockbench/BlockIT build, and endpoint;
2. prove native deferred/tool-search exposure and representative geometry + texture + animation/Locator reachability;
3. run a difficult reference through coarse primary geometry → difference-first visual gate;
4. force a front-plausible / side-depth-wrong case and require `FAIL` or `UNVERIFIED`, never false full `PASS`;
5. run one diagnosed local mismatch through invariant-backed correction → returned structural effect → fresh visual proof;
6. verify unresolved evidence/capability/repeated-correction paths end as `BLOCKED` instead of speculative mutation;
7. verify geometry `FAIL` prevents production texture/animation, then test accepted geometry → texture → animation sequencing;
8. record tool calls by purpose, redundant reads/captures, retries, latency/context, and actual prompt/skill loading;
9. A/B one high-frequency structured result only if the trace proves duplicated result text is material;
10. verify stateless endpoint plus Locator/Null Object operations and Bedrock save/reopen/export round-trip.

If the local environment is unavailable, stop here unless a concrete new source defect or explicit requirement appears.
'''
if len(next_text) >= 8_000:
    raise SystemExit(f"next-action snapshot too large: {len(next_text)}")
next_path.write_text(next_text, encoding="utf-8")


prompt_path = Path("mcp/prompts/bedrock_entity_workflow.md")
prompt = '''# Minecraft Bedrock Entity Workflow

Create or revise a clean, editable Minecraft Bedrock **Entity** model in Blockbench.

## Product boundary

Use format `bedrock`. Cubes are the normal geometry primitive and Groups are bones/organization when needed. The approved brief/reference is the modelling authority; tool success, coordinates, connectivity, or validator success are not visual proof. Preserve native Bedrock capability and never fake unsupported features with generic Mesh, UI automation, risky evaluation, or another format.

## Minimum necessary evidence

Keep validity strict and calls sparse. Use evidence only when it can change the next modelling decision or prove an in-scope completion claim.

- Do not inspect each newly placed Cube or capture after every mutation.
- Reuse known project/outline/resource state unless it may have changed.
- `create_project` and path-writing `export_model` already return lifecycle identity/path/saved state. Do not immediately call `get_project_info` unless required fields such as resolution/counts/root groups are missing or external state may have changed.
- Use `inspect_model_bounds` only for numeric envelope, scale, ground, displacement, or gross-placement questions. Otherwise skip it.
- Capture only reference-corresponding views needed for the current gate; after local correction, re-capture only affected view(s).
- `UNVERIFIED` is not a retry command. Do not spend additional calls trying to remove UNVERIFIED unless missing evidence can change the decision and is plausibly obtainable.
- Load texture or animation specialist instructions only when that stage is reached.

## Reference and primary form

Orient before mutation. For an existing or uncertain project, use `get_project_info` and targeted discovery only as needed. Establish X=width, Y=height, Z=front/back length, `front_direction` when relevant, and ground relationship when material.

Keep material 3D claims in the smallest useful state:

```text
SUPPORTED | PROVISIONAL | CONFLICTING | UNAVAILABLE
```

SUPPORTED is directly constrained; PROVISIONAL is a needed working value; CONFLICTING means relevant views disagree; UNAVAILABLE means the claim cannot be observed. Do not transfer confidence between axes. A front-view match cannot certify depth. Never average material conflicts into invented geometry; unresolved primary-form conflict becomes `BLOCKED`. Before exact transforms, keep a compact Primary Form Hypothesis: primary masses, relative placement/orientation/contact, and material uncertainty only.

## Build and primary gate

Build the minimum coarse whole form needed for recognizability. Each primary Cube represents a required mass or necessary orientation split. Use explicit finite `from`/`to`; non-zero rotation needs an intentional pivot/origin; explicit Group/Texture references must resolve deterministically.

A successful `place_cube`, `modify_cube`, or `modify_cubes_batch` call is **execution** evidence only. Mutation results use `visual_verdict: not_evaluated`; authored state is not reference approval. Do not chain Cube placement based on previous tool success. Once primary masses are judgeable, **stop** primary placement and run the visual gate before secondary detail.

An under-constrained extent remains a working hypothesis, not verified reference evidence, even after successful placement. Do not use rotation or extra detail to hide wrong size/placement; organizational Groups stay neutral unless a joint/attachment/transform reason requires otherwise.

If numeric dimensions exist or scale/ground/gross placement is in doubt, use `inspect_model_bounds`; otherwise skip it. Use `capture_model_views` for only the corresponding canonical views needed by the current gate. Explicit framing is for an approved numeric envelope. Bounds/captures observe; they do not compare, score, or approve.

## Difference-first visual verdict

At each material visual gate compare reference ↔ model **difference-first**: applicable silhouette, primary proportions, mass placement, orientation/slope, and visible contacts.

The verdict is exactly one of:

```text
FAIL
UNVERIFIED
PASS
```

- **FAIL**: a critical/major mismatch is visible; name it and the supporting view(s).
- **UNVERIFIED**: required evidence is missing, ambiguous, conflicting, or unavailable.
- **PASS**: fresh corresponding evidence shows no critical/major mismatch in applicable criteria.

A convincing front view is not a full 3D PASS when side/depth evidence is missing or fails. Missing evidence never becomes PASS by plausibility. If several primary relationships fail together or the object is not recognizable, revise the primary hypothesis instead of micro-patching a bad scaffold.

## Local correction accuracy

For a local mismatch on an otherwise sound form:

1. Locate the exact target UUID only if needed.
2. Reuse fresh exact authored state already returned for that target when sufficient; otherwise use `inspect_element` once before numeric correction.
3. Diagnose one causal class: `TRANSLATE`, `RESIZE`, `ROTATE`, hierarchy `REATTACH`, `SPLIT`, `MERGE/REMOVE`, or `ADD MASS` only for genuinely missing visible volume.
4. Declare the invariant and expected structural effect before mutation.
5. Use `modify_cube` for one target or `modify_cubes_batch` for one coherent multi-Cube cause.
6. Check returned `geometry_effect` before visual re-observation.
7. Re-capture only affected view(s).

Common invariants:

- `TRANSLATE` → size stays fixed; center moves intentionally.
- `RESIZE` → name the changed axis and fixed anchor/center/contact.
- `ROTATE` → do not rewrite size just to change angle; use a justified pivot.
- hierarchy REATTACH → if no supported direct reparent owner exists, use `BLOCKED`; never fake hierarchy with coordinate movement.

A structurally wrong effect or no effective geometry/visibility change is not correction progress. If the same causal correction direction fails twice without new evidence, stop speculative mutation and use `BLOCKED` or revise the hypothesis only when new evidence exists.

## BLOCKED is a workflow outcome

`FAIL / UNVERIFIED / PASS` describe visual evidence; `BLOCKED` means valid continuation would require guessing or repeated failed work. Use it for unresolved material view conflict, required observation still unavailable after one useful retry, repeated same-cause correction failure, unavailable required capability, or provisional geometry being presented as verified. Report the blocker/evidence, affected claim, bounded attempts, and exact evidence/decision/capability needed; do not keep changing coordinates to avoid the blocker.

## Secondary geometry, texture, and animation

Secondary geometry follows primary-form `PASS`. For end-to-end work, production texture waits for dependent geometry to `PASS`; production animation waits for an accepted geometry baseline and suitable participating hierarchy/pivots. `FAIL` returns upstream and required unresolved `UNVERIFIED` becomes `BLOCKED`. Existing-asset texture/animation-only work may use current geometry as a user baseline without certifying it. Revalidate only downstream state affected by later geometry/hierarchy/pivot changes.

## Locator / Null Object authored state

Use `list_locator_elements` for discovery and `inspect_element` for focused state. `manage_locator` owns supported native Locator fields; `manage_null_object` owns the supported Null Object parent/position slice. Rename/delete through `rename_element` / `remove_element`; never substitute arbitrary Cubes or UI automation.

## Protected Native Capability Gaps

Protected gaps include TextureMesh authoring/inspection, native visible bounding-box fields, animation controllers, animation sound/timeline effects, animated-texture authoring, and bone-binding expressions. If no direct owner exists, preserve authored data and state the gap; `nodes://` is observability, not authored native support. Native Bedrock PBR and per-face `material_instance` are **not** gaps.

## Export boundary

Normal BlockIT model outputs are:

- `bedrock` — native Minecraft Bedrock geometry JSON;
- `project` — editable Blockbench `.bbmodel`.

Bedrock animation/controller files belong to the separate Bedrock AnimationCodec surface; do not substitute arbitrary OBJ/glTF/model codecs.

## Tool and resource routing

The catalog is capability, not a checklist. Stay in the smallest active lane:

```text
project unknown/absent → get_project_info or create_project as appropriate
known/returned project state → place_cube/Group build → capture_model_views
→ inspect_element + modify_cube only on diagnosed mismatch when exact state is not already known
→ downstream specialist only after prerequisite gate
→ export_model only when requested
```

Use Resources when their URI data answers the question; use focused reads such as `inspect_element`, `inspect_animation`, or `get_texture` only when the decision needs their state/image data. Do not read overlapping Resource/Tool evidence merely for confirmation.

Selection is for real selection workflows, duplication for established repetition/symmetry, validators for structural diagnostics, and checkpoints only when rollback value is meaningful. Do not use `risky_eval`, generic UI automation, generic Mesh/Hytale tooling, or another format as shortcuts.
'''
if len(prompt) >= 9_000:
    raise SystemExit(f"canonical prompt lacks headroom: {len(prompt)}")
prompt_path.write_text(prompt, encoding="utf-8")


modelling_path = Path(".agents/skills/blockbench-bedrock-modelling/SKILL.md")
modelling = modelling_path.read_text(encoding="utf-8")
old = "Before a numeric local correction, use `inspect_element` once to obtain exact authored state, then declare the smallest **invariant**:"
new = "Before a numeric local correction, reuse fresh exact authored state already returned for that target when sufficient; otherwise use `inspect_element` once. Then declare the smallest **invariant**:"
if modelling.count(old) != 1:
    raise SystemExit("modelling fresh-state anchor changed")
modelling_path.write_text(modelling.replace(old, new, 1), encoding="utf-8")


element_path = Path("mcp/server/tools/element.ts")
element = element_path.read_text(encoding="utf-8")
old = '''}).superRefine((params, ctx) => {
  if (params.min_size === undefined || params.max_size === undefined) return;
  params.min_size.forEach((minimum, axis) => {
    if (minimum > params.max_size![axis]) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["max_size", axis],
        message: `max_size[${axis}] must be greater than or equal to min_size[${axis}].`,
      });
    }
  });
});'''
new = '''}).superRefine((params, ctx) => {
  const minSize = params.min_size;
  const maxSize = params.max_size;
  if (minSize === undefined || maxSize === undefined) return;

  minSize.forEach((minimum, axis) => {
    if (minimum > maxSize[axis]) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["max_size", axis],
        message: `max_size[${axis}] must be greater than or equal to min_size[${axis}].`,
      });
    }
  });
});'''
if element.count(old) != 1:
    raise SystemExit("element range-refine anchor changed")
element_path.write_text(element.replace(old, new, 1), encoding="utf-8")


review_path = Path("docs/knowledge/reviews/codex-native-deferred-mcp-tool-loading-2026-08-11.md")
review = review_path.read_text(encoding="utf-8")
review_replacements = {
    "Current actual stateless `tools/list` measurement after default-disabling generic per-face `apply_texture`:":
        "Historical post-`apply_texture` stateless `tools/list` snapshot:",
    "Current callable measurement after both containments: **63 tools / 73,149 response characters / 48,614 input-schema characters / 12,020 description characters**.":
        "Historical snapshot after both containments: **63 tools / 73,149 response characters / 48,614 input-schema characters / 12,020 description characters**.",
    "Current wire size is **73,174 response characters / 48,551 input-schema characters / 12,108 description characters**,":
        "That historical wire snapshot was **73,174 response characters / 48,551 input-schema characters / 12,108 description characters**,",