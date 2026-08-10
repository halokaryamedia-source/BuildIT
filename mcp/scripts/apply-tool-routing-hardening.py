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


# Tool descriptions: keep capability available, but make normal-route boundaries explicit.
replace_once(
    "mcp/server/tools/camera.ts",
    'description: "Returns the image data of the current view.",',
    'description:\n      "Returns the image data of the current editor view. This is a branch-only observation helper when that specific editor view carries evidence that canonical views cannot answer. For normal reference-driven geometry review, prefer `capture_model_views` so framing/orientation are deterministic.",',
)

replace_once(
    "mcp/server/tools/element.ts",
    '"Duplicates one explicit Cube or Group target. UUID is resolved first; an exact name is accepted only when unique. Ambiguous or unsupported element types fail before mutation. You may offset the duplicate or assign a new name.",',
    '"Duplicates one explicit Cube or Group target. Use this only after repetition/symmetry is already supported by the reference or model design; duplication is not a shortcut for deciding primary geometry. UUID is resolved first; an exact name is accepted only when unique. Ambiguous or unsupported element types fail before mutation. You may offset the duplicate or assign a new name.",',
)
replace_once(
    "mcp/server/tools/element.ts",
    '"Selects all Cubes or Groups of the requested type in the current project. Optionally restrict to descendants of one explicit parent Group; parent_group resolves UUID-first and by exact name only when unique, and missing or ambiguous scopes fail before selection changes. You may also add to rather than replace the current Cube/Group selection.",',
    '"Selection/navigation helper for workflows that genuinely need editor selection, such as some texture/Paint operations. It is not a normal geometry-targeting path: `place_cube`, `modify_cube`, `modify_cubes_batch`, inspection, hierarchy, and destructive operations should use explicit identities instead. Optionally restrict to descendants of one explicit parent Group; missing or ambiguous scopes fail before selection changes.",',
)
replace_once(
    "mcp/server/tools/element.ts",
    '"Returns the current Cube/Group selection state plus the active texture. Use this to verify explicit Bedrock Cuboid editing/texture targets without depending on generic Mesh selection.",',
    '"Returns the current Cube/Group selection state plus the active texture. Use it only when current editor selection/active-texture state is itself relevant, especially texture/Paint work. Normal geometry inspection and mutation should prefer explicit UUIDs and `inspect_element` rather than consulting selection as modelling context.",',
)

replace_once(
    "mcp/server/tools/history.ts",
    '"Returns the current undo/redo history: the list of edit entries, the current index, and which entries are undone vs. applied. Use this to inspect available undo/redo operations and find named checkpoints.",',
    '"Returns the current undo/redo history and named checkpoints. Use this for recovery/navigation when the workflow actually needs to undo or return to a checkpoint; it is not a normal modelling-observation step and should not be polled between successful bounded edits.",',
)
replace_once(
    "mcp/server/tools/history.ts",
    '"Inserts a named marker into the undo history. The marker can later be located with `get_undo_stack` so the agent knows how many times to call `undo` to return to this state. Does not modify the project.",',
    '"Inserts a named marker into the undo history for meaningful risky multi-step rework or a valuable recovery boundary. Do not create a checkpoint after every Cube/edit; normal bounded edits already participate in Blockbench Undo. The marker can later be located with `get_undo_stack`. Does not modify model geometry.",',
)

# Mandatory orchestrator: one normal geometry lane, specialist branches only on intent/stage.
orchestrator_lane = r'''## Stage-Gated Tool Routing

Do not treat the exposed MCP catalog as a checklist. Choose the smallest tool lane that answers the current modelling decision and stay in that lane until a concrete stage/intent requires branching.

Normal **reference-driven geometry lane**:

```text
project        get_project_info / create_project
orient/find    list_outline / find_elements_by_criteria
build          place_cube / add_group
whole-form     inspect_model_bounds / capture_model_views
local correct  inspect_element -> modify_cube / modify_cubes_batch
remove         remove_element only after MERGE/REMOVE diagnosis
recover        undo; save_checkpoint only before meaningful risky multi-step rework
finish         export_model only when a deliverable/explicit artifact is requested
```

Branch only when the task actually enters that domain:

```text
texture / UV / Paint / PBR / material_instance -> blockit-bedrock-texturing
animation / keyframes / particle effects        -> blockit-bedrock-animation
Locator / Null Object                           -> explicit attachment/effect need
selection helpers                               -> only when an editor-selection workflow requires them
duplicate_element                               -> only after repetition/symmetry is reference/design-backed
capture_screenshot                              -> only when the current editor view itself is evidence
validator resources                             -> structural diagnostics, never resemblance approval
```

Do not call specialist tools merely because they are available. Texture, Paint, animation, material-instance, Locator, selection, validator, and export work must not interrupt an unresolved primary-geometry `FAIL`/`UNVERIFIED` state.

'''
insert_before(
    ".agents/skills/blockit-bedrock-entity-mcp/SKILL.md",
    "## Preflight\n",
    orchestrator_lane,
)

# Modelling specialist owns the artistic/tool-selection boundary for normal geometry.
modelling_lane = r'''### Tool Lane Discipline

For normal reference-driven modelling, keep the active execution set small. Use project/orientation discovery, Cube/Group authoring, deterministic whole-form observation, exact element inspection, bounded correction, recovery, and final export. Do not explore or invoke texture/Paint, animation, material-instance, Locator, selection, duplicate, validator, or export tools merely because they appear in the MCP catalog.

A branch is justified only by the active modelling decision:

- `duplicate_element` requires already-established repetition/symmetry; it must not generate a primary hypothesis by copying an arbitrary part;
- selection tools are editor-state helpers, not geometry identity or modelling evidence;
- `capture_screenshot` is secondary to `capture_model_views` for reference fidelity and is used only when the current editor view answers a question canonical views cannot;
- validator output may reveal structural issues but never decides resemblance;
- texture/Paint begins only after geometry is coherent enough for its gate;
- animation begins only when requested and after required hierarchy/pivots are coherent;
- export is a completion/artifact action, not a validation loop step.

If no current decision requires a branch, stay in the geometry lane instead of searching for another tool that might make the model look more complete.

'''
insert_before(
    ".agents/skills/blockbench-bedrock-modelling/SKILL.md",
    "### 1. Check Reference Consistency And Coordinate Frame\n",
    modelling_lane,
)

# Canonical prompt: replace generic final boundary with stage-gated routing; keep native capability available.
prompt_path = "mcp/prompts/bedrock_entity_workflow.md"
old_boundary = r'''## Default boundaries

For normal Bedrock Entity modelling, do **not** use `risky_eval`, `trigger_action`, `fill_dialog`, `emulate_clicks`, `capture_app_screenshot`, `from_geo_json`, generic mesh/armature tooling or Hytale tooling as shortcuts. Native Bedrock PBR/material-instance workflows are allowed when the asset actually requires them. Use those only for an explicit specialized request or a demonstrated blocker that the normal MCP surface cannot solve.

Prefer `inspect_model_bounds` + `capture_model_views` for whole-form evidence, `inspect_element` for a diagnosed local target, exact UUIDs for normal mutation/hierarchy targets, and `modify_cubes_batch` only when one causal correction genuinely spans several explicit Cube UUIDs. Prefer coarse whole-form reasoning over per-Cube improvisation, neutral Group defaults over invented transforms, bounded edits over patch churn, and meaningful reference/model comparisons over screenshot quotas.'''
new_boundary = r'''## Stage-Gated Tool Routing

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

Prefer `inspect_model_bounds` + `capture_model_views` for whole-form evidence, `inspect_element` for a diagnosed local target, exact UUIDs for normal mutation/hierarchy targets, and `modify_cubes_batch` only when one causal correction genuinely spans several explicit Cube UUIDs. If primary geometry is still FAIL/UNVERIFIED, do not switch domains merely to make the asset look more complete.'''
replace_once(prompt_path, old_boundary, new_boundary)

# Product audit: record the real friction and why routing is preferred over capability deletion.
audit_path = "docs/knowledge/reviews/model-creation-effectiveness-audit-2026-08-10.md"
audit_addition = r'''## Problem #5 — Tool-Choice / Context Friction

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

'''
insert_before(audit_path, "## Product Priority Rule\n", audit_addition)

# Advance single active snapshot to the next modelling-quality problem.
next_path = "docs/knowledge/next-action.md"
replace_once(
    next_path,
    "`MCP_MODEL_EFFECTIVENESS_CORRECTION_ACCURACY_HARDENING_SOURCE_COMPLETE_LOCAL_PROOF_REQUIRED`",
    "`MCP_MODEL_EFFECTIVENESS_TOOL_ROUTING_HARDENING_SOURCE_COMPLETE_LOCAL_PROOF_REQUIRED`",
)
old_next = r'''The current source slice has hardened **P1 — correction accuracy** by linking diagnosis to exact authored state, a declared structural invariant, and deterministic before/after mutation effects.

The next bounded modelling problem is:

```text
P1 — tool-choice / context friction
```

Audit whether Codex is still exposed to or encouraged to call irrelevant/redundant tools during normal create -> observe -> correct modelling. Prefer simplifying routing/descriptions over deleting native Bedrock capability. Do not reduce tool count merely for aesthetics.

Preserve all existing validity rules: execution success is not visual approval, unsupported axes stay provisional/unverified, unresolved blockers stop mutation, and correction effects must match the declared invariant.

Do not add TextureMesh, a planner, automatic image-to-Cuboid reconstruction, similarity scoring, or another modelling framework unless a concrete modelling requirement proves it is needed.'''
new_next = r'''The current source slice has hardened **P1 — correction accuracy** by linking diagnosis to exact authored state, a declared structural invariant, and deterministic before/after mutation effects.

The current source slice has hardened **P1 — tool-choice / context friction** with a stage-gated normal geometry lane. Native Bedrock families remain available; specialist/convenience tools branch only when the active stage/intent requires them.

The next bounded modelling problem is:

```text
P2 — texture and animation sequencing
```

Audit whether surface-detail or animation work can still begin early enough to hide unresolved geometry, create sunk cost, or produce false completion confidence. Keep the solution stage-based and small: geometry validity must remain authoritative, but legitimate texture/animation tasks must not be blocked once their prerequisite state is actually ready.

Preserve all existing validity rules: execution success is not visual approval, unsupported axes stay provisional/unverified, unresolved blockers stop mutation, and correction effects must match the declared invariant.

Do not add TextureMesh, a planner, automatic image-to-Cuboid reconstruction, similarity scoring, or another modelling framework unless a concrete modelling requirement proves it is needed.'''
replace_once(next_path, old_next, new_next)

# Focused regression/source contract.
Path("mcp/tests/model-effectiveness-tool-routing.test.ts").write_text(r'''import { describe, expect, test } from "bun:test";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("model creation effectiveness — tool routing", () => {
  test("normal geometry lane is explicit and specialist tools are stage-gated", async () => {
    const orchestrator = await source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md");
    const modelling = await source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md");
    const workflow = await source("prompts/bedrock_entity_workflow.md");

    for (const text of [orchestrator, workflow]) {
      expect(text).toContain("get_project_info");
      expect(text).toContain("place_cube");
      expect(text).toContain("capture_model_views");
      expect(text).toContain("inspect_element");
      expect(text).toContain("modify_cube");
      expect(text).toContain("export_model");
      expect(text.toLowerCase()).toContain("stage");
    }
    expect(modelling).toContain("Tool Lane Discipline");
    expect(modelling).toContain("If no current decision requires a branch, stay in the geometry lane");
  });

  test("convenience tools explain their branch-only role instead of competing with geometry identity/evidence", async () => {
    const [camera, elements, history] = await Promise.all([
      source("server/tools/camera.ts"),
      source("server/tools/element.ts"),
      source("server/tools/history.ts"),
    ]);

    expect(camera).toContain("branch-only observation helper");
    expect(elements).toContain("duplication is not a shortcut for deciding primary geometry");
    expect(elements).toContain("not a normal geometry-targeting path");
    expect(elements).toContain("Normal geometry inspection and mutation should prefer explicit UUIDs");
    expect(history).toContain("should not be polled between successful bounded edits");
    expect(history).toContain("Do not create a checkpoint after every Cube/edit");
  });

  test("routing hardening preserves the Bedrock registration families instead of adding a new profile/gating framework", async () => {
    const profile = await source("lib/registrationProfile.ts");
    expect(profile).toContain('export type McpRegistrationProfile = "bedrock_entity" | "extended";');
    expect(profile).toContain('"animation"');
    expect(profile).toContain('"paint"');
    expect(profile).toContain('"material_instances"');
    expect(profile).toContain('"textures"');
    expect(profile).not.toContain("geometry_only");
    expect(profile).not.toContain("tool_lane_profile");
  });

  test("next work remains problem-driven and advances to sequencing", async () => {
    const next = await source("../docs/knowledge/next-action.md");
    expect(next).toContain("MCP_MODEL_EFFECTIVENESS_TOOL_ROUTING_HARDENING_SOURCE_COMPLETE_LOCAL_PROOF_REQUIRED");
    expect(next).toContain("P2 — texture and animation sequencing");
  });
});
''', encoding="utf-8")

print("Applied tool-routing hardening.")
