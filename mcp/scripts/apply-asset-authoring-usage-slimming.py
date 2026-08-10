from pathlib import Path

ROOT_AGENTS = '''# Workspace Agent Routing

This repository is project memory. Current user intent is the task authority; source and relevant proof own runtime truth.

## Task Class First

Choose the smallest route before loading more context.

### Asset Authoring

Use this route when the user wants to create, revise, texture, animate, inspect, validate, or export a Minecraft Bedrock Entity asset in Blockbench and is **not** asking to change repository/plugin source.

Fast path:

1. use the current user request/reference and any explicitly named workspace asset;
2. load `.agents/skills/blockit-bedrock-entity-mcp/SKILL.md`;
3. load only the current domain specialist (`blockbench-bedrock-modelling`, `blockit-bedrock-texturing`, or `blockit-bedrock-animation`);
4. use BlockIT MCP with minimum necessary evidence.

For normal asset authoring, **do not automatically load** `CONTEXT.md`, `docs/knowledge/next-action.md`, `development-brief`, the activation matrix, engineering history, or every foundation document. Read one of them only when the current asset decision actually depends on repository state, a protected capability boundary, an existing workspace package, or a conflicting product rule.

Asset authoring is not software **Developing** merely because it creates or changes a model. Do not route it through `development-brief` unless the user is asking to change source/plugin behavior.

### Repository / Plugin Work

Use this route for source, docs, MCP/plugin implementation, tests, CI, architecture, or repository maintenance.

Boot only what is needed:

1. `CONTEXT.md` for stable project facts when relevant;
2. `docs/knowledge/next-action.md` for active continuation state when continuing project work;
3. the affected source and nearest `AGENTS.md`;
4. one relevant foundation/routing note only when needed.

For a repository create/change task, use `.agents/skills/development-brief/SKILL.md`; add at most one engineering specialist unless a proved cross-domain blocker requires another owner. Maintenance uses the smallest diagnostic/specialist that owns the failure.

## Source Precedence

1. current user instruction — task intent;
2. source + relevant runtime/visual proof — actual behavior;
3. root/nearest `AGENTS.md` — agent behavior;
4. `docs/foundation/` — product/modelling policy;
5. `docs/knowledge/next-action.md` — active repository continuation state;
6. `CONTEXT.md` — stable facts;
7. decision log/history — rationale only.

If material sources conflict, resolve the authority or report the missing evidence; never choose silently.

## Work Discipline

- Inspect the current owner/caller/pattern before editing shared behavior.
- Prefer the minimum complete solution; every changed line must trace to the goal.
- Reuse/extend before creating files or abstractions.
- Do not broaden scope because adjacent issues are visible.
- Do not add compatibility/fallback/framework layers without a proved need.
- Do not turn fixtures, Golden Samples, or named objects into generic runtime rules.
- Stop the same failed direction after two attempts without new evidence.
- `No change required` is valid.
- Never claim a check, runtime result, or visual approval that was not actually obtained.

## Execution Channels

### ChatGPT → GitHub

Repository reads/writes are available. Do not assume local shell, Blockbench runtime, or live visual proof. Static/source work may prepare a runtime change; report remaining local proof rather than inventing it.

### Codex Local

Use available shell/build/MCP/Blockbench capabilities only when they materially test the current claim. Do not run broad checks by ritual.

## Minimum Useful Proof

Use the cheapest evidence that can falsify the likely failure, then stop when the in-scope claim has enough support.

- text/docs/routing → exact changed owner + relevant diff;
- bounded source change → affected source/callers/contracts and an existing targeted gate when informative;
- public/destructive contract → stronger proof before full completion;
- Blockbench/UI/visual claim → live/runtime/visual proof is required;
- local correction → re-check only affected state/view unless it reveals a global problem.

Do not create extra tests, screenshots, builds, fixtures, or reports merely to look rigorous. Source/CI proof never upgrades a live modelling claim.

When a material support/runtime claim needs a label, use only:

```text
CURRENT-PROJECT VERIFIED
OFFICIALLY VERIFIED
LOCAL PROOF REQUIRED
UNSUPPORTED
UNKNOWN
```

Routine work does not need ceremonial status tagging.

## Asset-Authoring Invariants

- Target Minecraft Bedrock Entity (`bedrock`).
- Tool success is execution evidence, not visual fidelity.
- Use `FAIL / UNVERIFIED / PASS` for visual verdicts and `BLOCKED` when valid continuation would require guessing or looping.
- Use the smallest relevant tool/view/evidence set.
- Do not inspect every new Cube or capture after every mutation.
- Do not start production texture/animation to hide unresolved geometry.
- Preserve native Bedrock capability; do not fake gaps with generic Mesh, risky evaluation, UI automation, or another format.

Detailed artistic judgement belongs to `blockbench-bedrock-modelling`; texture/PBR execution to `blockit-bedrock-texturing`; animation execution to `blockit-bedrock-animation`.

## Repository Engineering Invariants

For `mcp/**`, follow `mcp/AGENTS.md`: strict TypeScript, full Zod validation, schemas free of Blockbench runtime globals, `createTool` registration, generated docs freshness, loopback containment, and dangerous-default quarantine.

Do not add commit/build fingerprint metadata to the product/runtime surface. Git owns revision history.

## Communication

Keep progress compact. Explain decisions, blockers, and final evidence; do not narrate every tool call.

Final non-trivial report:

```text
Status: Selesai | Perlu pemeriksaan | Terhenti
Hasil:
Bukti:
Batasan:
Next step:
```

Use one next step.

## Canonical Owners

- stable facts → `CONTEXT.md`;
- active repository continuation → `docs/knowledge/next-action.md`;
- durable rationale → `docs/knowledge/decision-log.md`;
- product/modelling policy → `docs/foundation/`;
- plugin/server behavior → `mcp/` source + proof;
- asset orchestration → `.agents/skills/blockit-bedrock-entity-mcp/`;
- modelling judgement → `.agents/skills/blockbench-bedrock-modelling/`;
- texture/PBR → `.agents/skills/blockit-bedrock-texturing/`;
- animation → `.agents/skills/blockit-bedrock-animation/`;
- repository development contract → `.agents/skills/development-brief/`.

Do not recreate retired generic skills or parallel planning/state systems.
'''

ORCHESTRATOR = '''---
name: blockit-bedrock-entity-mcp
description: Lightweight orchestrator for BlockIT Minecraft Bedrock Entity asset work in Blockbench. Route whole-form/Cube judgement to blockbench-bedrock-modelling, texture/Paint/PBR/material-instance work to blockit-bedrock-texturing, and animation/keyframe work to blockit-bedrock-animation. Keep MCP calls and loaded context minimal without weakening visual validity.
---

# BlockIT Bedrock Entity MCP

Use this skill for **asset authoring**, not repository/plugin development. Target Blockbench format `bedrock`; normal geometry is Cubes organized by Groups/bones. Preserve native Bedrock capability and never substitute generic Mesh, Hytale, `risky_eval`, arbitrary UI automation, or another format for a missing native owner.

## Route By Intent

Load specialists lazily. Start with the one that owns the current decision; do not preload texture or animation because the user eventually wants them.

```text
geometry / silhouette / hierarchy / pivot judgement -> blockbench-bedrock-modelling
texture / UV / Paint / PBR / material_instance       -> blockit-bedrock-texturing
animation / keyframes / particles                    -> blockit-bedrock-animation
```

A proved plugin/API/MCP defect leaves asset authoring and becomes repository work under the corresponding engineering owner.

## Stage-Gated Tool Routing

The catalog is capability, not a checklist. Normal reference-driven geometry lane:

```text
project       get_project_info / create_project only when project state is unknown/needed
find          list_outline / find_elements_by_criteria only when identity/state is unknown
build         place_cube / add_group; batch coherent primary Cubes when already known
observe       capture_model_views; inspect_model_bounds only for numeric envelope/scale/ground questions
correct       inspect_element -> modify_cube / modify_cubes_batch only on a diagnosed mismatch
recover       undo; save_checkpoint only before meaningful risky rework
finish        export_model only when a deliverable is requested
```

Branch-only tools stay branch-only: selection for real editor-selection workflows, `duplicate_element` only for established repetition/symmetry, validator resources for structural diagnostics, `capture_screenshot` only when the current editor view itself matters, Locator/Null Object only for an actual attachment/effect need.

If no current decision requires a branch, stay in the geometry lane.

## Minimum Necessary Evidence

Strict claims do not require ritual calls.

- Do not re-read state this workflow just created or already knows unless it may have changed.
- Do not inspect every newly placed Cube. `inspect_element` is for a diagnosed target, ambiguous identity, or exact authored state needed for correction.
- Do not capture after every mutation. Capture at a meaningful gate; after a local correction, capture only affected reference-corresponding view(s).
- Use `inspect_model_bounds` only when approved numeric dimensions/envelope exist or scale, ground, displacement, or gross placement is the current question.
- `UNVERIFIED` is not a retry command. Seek more evidence only when it can change the decision and is plausibly obtainable.
- Mutation count alone is not a checkpoint trigger. Checkpoint only when rollback value is meaningful.
- Keep progress reporting compact.

## Mutation / Result Discipline

Successful mutation proves authored execution, not resemblance. Use exact identities for destructive geometry operations. `modify_cube` / `modify_cubes_batch` already return before/after and `geometry_effect`; do not add a redundant `inspect_element` after them unless additional state is genuinely needed.

`manage_locator` and `manage_null_object` already return their resulting authored state. Do not automatically re-read them with `inspect_element`; re-inspect only if another required field is missing, state may have changed externally, or the returned result is inconsistent with the intended mutation.

Batch operations only when one coherent, already-understood decision spans multiple targets. Do not batch unknown geometry merely to reduce calls.

## Visual / Blocker Boundary

Reference-driven geometry judgement belongs to `blockbench-bedrock-modelling` and must use its difference-first `FAIL / UNVERIFIED / PASS` Reference Fidelity Verdict. Successful MCP execution, valid bounds, hierarchy, or validator output cannot upgrade the visual verdict.

`BLOCKED` is the correct outcome when valid continuation requires unsupported evidence/capability or repeated speculative correction. Do not continue speculative mutation to avoid reporting a blocker.

## Downstream Readiness

For end-to-end reference-driven work:

- production texture/UV/PBR/material work starts after required geometry is `PASS`;
- production animation starts after the required geometry baseline and participating hierarchy/pivots are suitable;
- material geometry `FAIL` returns upstream;
- required unresolved `UNVERIFIED` becomes `BLOCKED`, not hidden by texture/motion.

For an existing-asset texture-only/animation-only task, current geometry may be the user-provided baseline when remodelling is outside scope; this does **not** upgrade that geometry to `PASS`.

A flat/placeholder texture or diagnostic pose/playback may be provisional/disposable evidence only. If geometry/hierarchy/pivots later change, revalidate only affected downstream state.

## Protected Native Capability Gaps

Current protected gaps include TextureMesh authored-state ownership, native visible bounding-box fields, animation controllers, animation sound/timeline effects, animated-texture authoring, and bone-binding expressions. Do not fake them. Native Bedrock PBR and per-face `material_instance` are valid supported domains.

## Export / Completion

`export_model` supports:

- `bedrock` — native Minecraft Bedrock geometry JSON;
- `project` — editable Blockbench `.bbmodel`.

When writing to a path, prefer metadata-only response unless returned file content is explicitly needed. Completion requires fresh evidence for the relevant state: visual comparison for reference geometry, or the active specialist's domain verification for texture/animation. Source/CI evidence is never live Blockbench proof.
'''

MODELLING = '''---
name: blockbench-bedrock-modelling
description: Minecraft Bedrock Entity modelling judgement for reference-driven Cube/Cuboid form, proportions, silhouette, hierarchy/pivots, visual correction, and completion. Use with the BlockIT orchestrator; do not load for plugin/runtime or MCP implementation defects.
---

# Blockbench Bedrock Modelling

Own **what the Bedrock model should become** and whether the visible result is good enough to continue. MCP mechanics belong to the BlockIT orchestrator; texture/PBR and animation execution stay in their specialists.

Read foundation docs only when the current decision needs their detail: `03-modelling-workflow`, `04-reference-guide`, `05-geometry-standard`, `06-texture-standard`, `07-visual-validation`.

## Minimum Necessary Evidence

Use the smallest evidence set that can change the next modelling decision. Strictness applies to claims, not call count.

- **No per-Cube inspection ceremony** for new geometry with no diagnosed problem.
- **No screenshot-per-mutation loop**. Build a judgeable coarse whole form, then run a meaningful gate.
- Re-observe only affected view/relationship after a local correction; reopen whole-form review only when a global hypothesis is implicated.
- Bounds are conditional on numeric envelope, scale, ground, displacement, or gross-placement questions. **Otherwise skip the bounds call**.
- `UNVERIFIED` does not automatically require more calls.
- Keep simple Primary Form reasoning as a short working note.

## Tool Lane Discipline

Normal lane: project/orient only when needed → coherent Cube/Group build → necessary canonical views → exact inspect/correct only for diagnosed mismatch → secondary/downstream work after its gate → export on request.

Batch primary Cube placement when several masses are already supported by one coherent Primary Form Hypothesis; do not split them into separate calls merely for ceremony. Batch `capture_model_views` for the few views needed by the same gate.

If no current decision requires a branch, stay in the geometry lane instead of searching for a tool that only makes the asset look more complete.

## Reference Frame And Evidence

Establish only material facts: object identity, `bedrock` target, approved reference, numeric dimensions if supplied, X=width/Y=height/Z=length, front/ground when relevant, texture scope, animation requirement, and existing model state when revising.

Treat the reference as one 3D brief, not pixel calibration. For material axis/placement/orientation/contact claims use the smallest useful state:

```text
SUPPORTED | PROVISIONAL | CONFLICTING | UNAVAILABLE
```

- SUPPORTED: directly constrained by relevant view(s).
- PROVISIONAL: a working value is needed but evidence is incomplete.
- CONFLICTING: relevant views materially disagree.
- UNAVAILABLE: the claim cannot be observed.

Do not borrow confidence across axes. **A convincing front silhouette does not validate depth.** A 3/4 view is context, not authority over clearer orthographic evidence. Never average a material cross-view conflict into invented geometry; if the brief/user intent cannot resolve it, **Enter the workflow `BLOCKED` state**.

## Primary Form Hypothesis

Before exact transforms, keep a compact working hypothesis containing only:

```text
primary mass role
relative size / center / placement
important slope or contact
supporting view(s)
material uncertainty
```

No locked per-Cube blueprint, fixed Cube count, universal build order, anatomy template, or exact transform approval is required. Exact transforms come from the whole-form hypothesis, not independent coordinate guesses.

## Coarse Primary Build

Create the minimum coherent whole form needed for recognizability.

- represent each required primary mass or necessary orientation split;
- establish major masses before local polish;
- axis-align when correct; rotate only for evidence-backed slope/motion;
- do not use rotation or extra detail to hide wrong size/placement;
- preserve visible contacts/relationships;
- defer detail, UV polish, texture, and decoration.

A successful `place_cube`, `modify_cube`, or `modify_cubes_batch` is **execution** evidence only; mutation result `visual_verdict: not_evaluated` is not visual approval. **Do not continue with another Cube merely because the previous placement succeeded.** Once primary masses are judgeable, **stop** adding primary geometry and run the gate before secondary detail.

An under-constrained axis may need a **provisional working extent**, but successful placement does not make it reference-verified.

## Difference-First Reference Fidelity Verdict

At each material gate compare fresh model view(s) against the corresponding reference view(s) **difference-first**: silhouette, primary proportions, placement, orientation/slope, and visible contacts applicable to that claim.

Every material visual gate ends in exactly one:

```text
FAIL
UNVERIFIED
PASS
```

- **FAIL** — any critical/major mismatch is visible; name the mismatch and supporting view.
- **UNVERIFIED** — required evidence is missing, ambiguous, conflicting, or unavailable.
- **PASS** — fresh corresponding evidence shows no critical/major mismatch in applicable supported criteria.

Front PASS is not full 3D PASS when side/depth evidence is missing or fails. Tool success, valid coordinates, bounds, hierarchy, connectivity, or validator success cannot justify PASS.

If several primary relationships fail together, the object is not recognizable, or fixes require compensating detail, revise/rebuild the Primary Form Hypothesis instead of micro-patching. If global form is sound and one bounded relationship is wrong, correct locally.

## Local Correction Contract

Classify the cause before mutation:

```text
TRANSLATE      placement
RESIZE         extent/proportion
ROTATE         orientation/slope
REATTACH       hierarchy/contact ownership
SPLIT          one mass needs separate orientation/volume
MERGE/REMOVE   compensatory/unnecessary geometry
ADD MASS       genuinely missing visible volume
```

Do not default to adding a Cube.

Before a numeric local correction, use `inspect_element` once to obtain exact authored state, then declare the smallest **invariant**:

```text
cause
exact UUID(s)
current state
what changes
what must stay fixed
expected structural effect
```

Examples: TRANSLATE preserves size; RESIZE names axis + fixed center/face/contact; ROTATE does not rewrite size and uses a justified pivot; hierarchy REATTACH uses a supported parent owner or becomes `BLOCKED`.

`modify_cube` / `modify_cubes_batch` return before/after plus `geometry_effect`. Check that structural effect before visual approval. **An unintended center shift** during a center-preserving resize, size change during TRANSLATE, or extent change during ROTATE means the correction is structurally wrong. No effective geometry/visibility change is not progress.

Re-capture only affected view(s). If the **same causal correction direction has failed twice without new evidence**, stop speculative mutation and report/reframe instead of patching again.

## BLOCKED

`FAIL / UNVERIFIED / PASS` are visual verdicts. `BLOCKED` means valid continuation would require guessing or repeated failed work.

Use `BLOCKED` for unresolved material reference conflict, required observation still unavailable after one useful retry, the two-failure same-cause threshold, unavailable required supported capability, or any path that would present provisional geometry as verified.

When blocked: stop mutation, keep last valid state, state the blocker/evidence and affected claim, summarize bounded attempts, and name the exact evidence/user decision/capability needed. Never report PASS/fixed/resolved while the blocker remains.

## Secondary Geometry / Hierarchy / Pivots

Only after primary PASS:

- add secondary geometry that materially improves silhouette, contact, required detail, or motion;
- use semantic names and purposeful editable structure;
- add Groups/hierarchy for real organization/articulation needs;
- place pivots where actual joints/attachments/transform centers require them;
- do not invent bones/pivots merely because animation may exist later.

Run a complete geometry review before production downstream work. Confirm relevant silhouette/proportions/depth/contacts/orientation plus hierarchy/pivots needed by the requested surface/motion work. Technical validity is not visual PASS.

## Downstream Handoff

For end-to-end creation, production texture/UV/PBR/material work waits for geometry it depends on to PASS. Production animation waits for the required geometry baseline plus suitable participating hierarchy/pivots. Existing-asset texture-only/animation-only work may use current geometry as a user-provided baseline without claiming reference approval.

Placeholder texture or diagnostic pose may be provisional/disposable. If geometry/hierarchy/pivots change later, only affected downstream UV/material/keyframe/attachment assumptions become stale and need revalidation. Downstream sunk cost never justifies preserving rejected geometry.

## Completion

A model is complete only for claims actually proved by fresh evidence. Report remaining UNVERIFIED claims honestly. A valid result is more important than a success report. Live reference fidelity remains a live Blockbench/Codex proof, never a source/CI claim.
'''

Path('AGENTS.md').write_text(ROOT_AGENTS, encoding='utf-8')
Path('.agents/skills/blockit-bedrock-entity-mcp/SKILL.md').write_text(ORCHESTRATOR, encoding='utf-8')
Path('.agents/skills/blockbench-bedrock-modelling/SKILL.md').write_text(MODELLING, encoding='utf-8')

# Export-to-path: preserve returned content only when explicitly requested.
export_path = Path('mcp/server/tools/export.ts')
text = export_path.read_text(encoding='utf-8')
text = text.replace(
'''    .optional()\n    .default(100_000)\n    .describe(\n      "Maximum characters returned in `content`. Use 0 when only writing to disk."\n    ),''',
'''    .optional()\n    .describe(\n      "Maximum characters returned in `content`. Defaults to 0 when `path` is supplied, otherwise 100000; set explicitly when both file write and returned content are needed."\n    ),''',
1)
text = text.replace(
'''        const fullContent = binaryBuffer\n          ? binaryBuffer.toString("base64")\n          : (text ?? "");\n        const truncated = fullContent.length > max_content_length;\n        const returnedContent =\n          max_content_length === 0\n            ? null\n            : truncated\n              ? fullContent.slice(0, max_content_length)\n              : fullContent;''',
'''        const fullContent = binaryBuffer\n          ? binaryBuffer.toString("base64")\n          : (text ?? "");\n        const effectiveMaxContentLength =\n          max_content_length ?? (path ? 0 : 100_000);\n        const truncated = fullContent.length > effectiveMaxContentLength;\n        const returnedContent =\n          effectiveMaxContentLength === 0\n            ? null\n            : truncated\n              ? fullContent.slice(0, effectiveMaxContentLength)\n              : fullContent;''',
1)
export_path.write_text(text, encoding='utf-8')

# Compact machine-oriented JSON text without changing data.
for rel in [
    'mcp/server/tools/element-inspection.ts',
    'mcp/server/tools/project.ts',
    'mcp/server/tools/animation-inspection.ts',
    'mcp/server/tools/locators.ts',
    'mcp/server/tools/element.ts',
]:
    p = Path(rel)
    data = p.read_text(encoding='utf-8')
    data = data.replace('JSON.stringify(result, null, 2)', 'JSON.stringify(result)')
    # Common multi-line/string-only objects in project/element tools.
    data = data.replace(',\n        null,\n        2\n      )', '\n      )')
    p.write_text(data, encoding='utf-8')

# Advance status without changing the authoritative next local step.
next_path = Path('docs/knowledge/next-action.md')
next_text = next_path.read_text(encoding='utf-8')
next_text = next_text.replace(
    '`MCP_CONTEXT_PAYLOAD_CLEANUP_SOURCE_COMPLETE_LOCAL_PROOF_REQUIRED`',
    '`MCP_ASSET_AUTHORING_USAGE_SLIMMING_SOURCE_COMPLETE_LOCAL_PROOF_REQUIRED`',
    1,
)
anchor = 'The final pre-local **Context & Payload Cleanup** keeps the same capability surface while reducing duplicated agent-facing prose: the canonical workflow prompt is compact, measured metadata hotspots are shortened without removing input constraints, panel descriptions use real tool descriptions, Texture resources no longer return raw `source`, and validator status is summary-only with lazy detail resources. Tool annotations were audited and already provide a read-vs-mutation hint across the full generated catalog, so no annotation churn was added. `nodes://` remains unchanged pending direct TextureMesh ownership.\n'
addition = anchor + '\nThe final pre-local **Asset Authoring Usage Slimming** adds a dedicated asset-authoring fast path that skips repository-development boot context, `development-brief`, and unrelated specialists unless the active modelling decision needs them. The BlockIT orchestrator and modelling skill are compact operating contracts, coherent Cube/view batches are preferred where already justified, redundant post-mutation reads are avoided when a mutation already returns the required authored state, high-frequency JSON text is compact, and `export_model` defaults to metadata-only content return when writing to a filesystem path. No Bedrock capability/profile, visual gate, or local-proof requirement was removed.\n'
if anchor not in next_text:
    raise SystemExit('next-action context cleanup anchor missing')
next_text = next_text.replace(anchor, addition, 1)
next_path.write_text(next_text, encoding='utf-8')

# Keep existing regression owners aligned with the new active status.
for rel in [
    'mcp/tests/model-effectiveness-minimum-evidence.test.ts',
    'mcp/tests/context-payload-cleanup.test.ts',
]:
    p = Path(rel)
    data = p.read_text(encoding='utf-8').replace(
        'MCP_CONTEXT_PAYLOAD_CLEANUP_SOURCE_COMPLETE_LOCAL_PROOF_REQUIRED',
        'MCP_ASSET_AUTHORING_USAGE_SLIMMING_SOURCE_COMPLETE_LOCAL_PROOF_REQUIRED',
    )
    p.write_text(data, encoding='utf-8')

usage_test = '''import { describe, expect, test } from "bun:test";\nimport { exportModelParameters } from "@/server/tools/export";\n\nasync function source(path: string): Promise<string> {\n  return Bun.file(path).text();\n}\n\ndescribe("pre-local asset-authoring usage slimming", () => {\n  test("asset authoring bypasses repository-development boot and development-brief", async () => {\n    const agents = await source("../AGENTS.md");\n    expect(agents).toContain("### Asset Authoring");\n    expect(agents).toContain("do not automatically load");\n    expect(agents).toContain("Asset authoring is not software **Developing**");\n    expect(agents).toContain("Do not route it through `development-brief`");\n  });\n\n  test("normal authoring skill stack remains compact while hard gates stay present", async () => {\n    const orchestrator = await source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md");\n    const modelling = await source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md");\n    expect(orchestrator.length).toBeLessThan(8_000);\n    expect(modelling.length).toBeLessThan(13_000);\n    for (const required of [\n      "Minimum Necessary Evidence",\n      "FAIL / UNVERIFIED / PASS",\n      "BLOCKED",\n      "capture_model_views",\n      "modify_cube",\n      "export_model",\n    ]) expect(orchestrator).toContain(required);\n    for (const required of [\n      "SUPPORTED | PROVISIONAL | CONFLICTING | UNAVAILABLE",\n      "difference-first",\n      "FAIL",\n      "UNVERIFIED",\n      "PASS",\n      "BLOCKED",\n      "geometry_effect",\n      "same causal correction direction has failed twice without new evidence",\n    ]) expect(modelling.toLowerCase()).toContain(required.toLowerCase());\n  });\n\n  test("filesystem export omits large returned content by default but remains opt-in", () => {\n    expect(exportModelParameters.parse({ path: "/tmp/model.json" }).max_content_length).toBeUndefined();\n    expect(exportModelParameters.parse({}).max_content_length).toBeUndefined();\n    expect(exportModelParameters.parse({ path: "/tmp/model.json", max_content_length: 500 }).max_content_length).toBe(500);\n  });\n\n  test("high-frequency read outputs use compact JSON and locator mutation does not require redundant read", async () => {\n    const files = await Promise.all([\n      source("server/tools/element-inspection.ts"),\n      source("server/tools/project.ts"),\n      source("server/tools/animation-inspection.ts"),\n      source("server/tools/locators.ts"),\n    ]);\n    for (const text of files) expect(text).not.toContain("JSON.stringify(result, null, 2)");\n    const orchestrator = await source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md");\n    expect(orchestrator).toContain("Do not automatically re-read them with `inspect_element`");\n  });\n\n  test("capability architecture is unchanged", async () => {\n    const profile = await source("lib/registrationProfile.ts");\n    const next = await source("../docs/knowledge/next-action.md");\n    expect(profile).toContain('export type McpRegistrationProfile = "bedrock_entity" | "extended";');\n    expect(profile).not.toContain("asset_authoring_profile");\n    expect(next).toContain("MCP_ASSET_AUTHORING_USAGE_SLIMMING_SOURCE_COMPLETE_LOCAL_PROOF_REQUIRED");\n    expect(next).toContain("LOCAL — reference-fidelity acceptance scenarios");\n  });\n});\n'''
Path('mcp/tests/asset-authoring-usage-slimming.test.ts').write_text(usage_test, encoding='utf-8')

print('Applied asset-authoring usage slimming.')
