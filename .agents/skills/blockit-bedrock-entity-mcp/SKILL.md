---
name: blockit-bedrock-entity-mcp
description: Mandatory router for BlockIT Bedrock Entity asset authoring.
---
# BlockIT Bedrock Entity MCP
`geometry/rig/UV judgement` → `blockbench-bedrock-modelling`; texture/PBR → `blockit-bedrock-texturing`; animation/motion → `blockit-bedrock-animation`.

User-authorized autonomy replaces approval waits with verified checkpoints; never claim user approval.

## Product Scope Firewall
Asset-only: BP/gameplay/pack OUT; RP visual/export; controllers/preview. `resource_operations` is not a normal authoring route.
## Mandatory Authoring Latch
Load router + matching current worktree specialist before mutation:
`router_loaded=YES | active_owner=GEOMETRY|TEXTURING|ANIMATION | specialist_loaded=YES | gate_satisfied=YES`.
Any `NO` → **DO NOT MUTATE**.
New reference Geometry → approved image + Dimensions + Animation Required; bounded nonvisual edits follow the specialist.
UV → user Geometry APPROVED
Texture → Geometry APPROVED + UV Layout PASS
Animation → Texturing APPROVED + checkpoint + Animation Readiness Preflight → HANDOFF_REQUIRED
`HANDOFF_REQUIRED`: `target_phase`, `reason`, `readiness`, `resume_from`; Gateway `switch_authoring_phase` → same task/chat.
`approved image`; normal Geometry uses the native BlockIT Group/Cube path. 1 Minecraft block = 16 Blockbench units; `front_direction`.

## Cross-Phase Reference Authority
Use one visual authority chain; each phase owns only its layer:
```text
approved reference + explicit constraints
→ Geometry: mass / topology / part count / attachment / depth / pivot structure
→ Texturing: mapped material regions / markings / seams / alpha appearance
→ Animation: pose / timing / contact / joint behavior using the approved rig
```
A downstream phase must not compensate for an upstream defect. Missing/wrong mass, attachment, opening, pivot, or rig → Geometry owner. Texture cannot paint around it; Animation cannot key around it. When the first wrong owner is upstream, return only the bounded defect through the existing owner/handoff path, then resume the same task.
Reference verification is difference-first and qualitative: `FAIL | UNVERIFIED | PASS`; no aggregate score, cube count, key count, or tool success can override a critical visual defect.

## Correction Convergence Contract
Every `FAIL` correction uses one bounded causal loop:
```text
largest material difference
→ first wrong owner/cause
→ reuse fresh state/evidence
→ one smallest coherent correction
→ recapture only evidence that can prove the intended change or a likely regression
→ IMPROVED | UNCHANGED | REGRESSED
```
Do not start a second inspection/discovery cycle when the current mutation receipt, UUID/state, and affected-view evidence are still fresh. Do not re-run `status`, capability search/describe, hierarchy detail, bounds, texture diagnostics, or captures as reassurance.

**Retry rule:** the same causal direction may be attempted at most twice. A second attempt requires new decision-changing evidence or a materially revised diagnosis. Two attempts with the same cause and no new evidence → `BLOCKED`, not a third variation.

**Owner-change rule:** if verification shows the diagnosed cause belongs to another phase, stop correcting in the current phase and hand the bounded defect to the owning specialist. Downstream compensation is not convergence.

## Minimum Necessary Call Paths
Calls are justified only when they establish missing state for a safe mutation, execute the intended mutation, provide decision-changing evidence, recover stale/lost context, or perform a required handoff/deliverable. Everything else is a redundant-call candidate.

```text
NEW GEOMETRY
known orientation/context
→ reference evidence reasoning
→ create project only when needed
→ coherent Groups/Bones + primary Cube batch
→ one Core View Triad
→ conditional bounds only for diagnosed contact/surface/envelope question
→ bounded correction + affected-view recapture

GEOMETRY CORRECTION
fresh UUID/state/evidence
→ inspect detail only if exact target state is missing
→ one coherent correction
→ reuse geometry_effect
→ affected-view verification only

EXISTING GEOMETRY EDIT
known target → mutate directly
unknown target → one focused identity inspection → mutate

NEW TEXTURE
one atlas discovery
→ diagnostics only when readiness is unknown
→ target texture activation/creation when required
→ representative identity-critical patch
→ mapped-model evidence
→ coherent propagation
→ bounded verification

TEXTURE CORRECTION / EXISTING EDIT
known atlas + target → direct coherent paint mutation
→ refresh only affected mapped/atlas evidence
face mapping inspection only when target cannot be located safely

NEW ANIMATION
required AUTHORING→ANIMATION handoff
→ create_animation
→ reuse returned UUID
→ smallest judgeable key cohort
→ one representative time/view batch
→ causal correction only if needed

ANIMATION CORRECTION / EXISTING EDIT
known animation UUID + cohort → mutate directly
unknown/stale clip state → inspect_animation once
→ refresh affected pose/time or loop segment only
```
Do not turn these into fixed numeric quotas; complex assets may need more justified calls. The canonical development/evaluation contract is `mcp/docs/TOOL_CALL_EFFICIENCY.md`. It must not be loaded as a second authoring workflow.

## Fast Routing Contract
Asset work **must not begin by searching repository files**.
**Authoring Context Firewall:** Authoring Codex uses `workspace/active/<asset>/` as cwd, not `mcp/`; deeper MCP development rules are not authoring plan. Do **not** inspect tests/CI/source or run Bun/build/verifiers/deploy.
Existing → inspect only affected target/dependencies.
`ACTIVE STAGE + intent + known state/UUIDs → exact known Runtime capability → Gateway execution → reuse result`
## Authoring Stage Lock
`DISCOVER → AUTHOR → VERIFY → CORRECT → VERIFY → DONE`.
At each review/park boundary update the existing asset README/report with the current artifact revision, stage, unresolved differences, and next action. Separate operation evidence, technical validation, internal visual verdict, and explicit user acceptance. Preserve historical approvals without presenting them as current acceptance after rejection. A stopped test stays stopped; missing measurements are `UNKNOWN`, never zero.
## Tool Lane Discipline
Major defects stay `FAIL` despite approval; never submit as approval-ready. Do not resume/replace stopped tests without later explicit authorization; a newly authorized model has separate intake.
```text
CORE / SHARED
project unknown → get_project_info
identity/hierarchy/detail → inspect_elements(mode=search|outline|detail)
visible/reference comparison  → capture_model_views
envelope/scale/ground OR bounded surface/contact review → inspect_model_bounds
UV/atlas readiness → list_textures
file deliverable → export_model
Animation boundary → switch_authoring_phase

GEOMETRY OWNER
create normal bone/Group       → add_group
create/update Cubes            → manage_cubes(operation=create|update|batch_update)
Group/bone parent move         → reparent_element
Group pivot/rotation/visible   → modify_group
delete/rename                  → remove_element / rename_element
Locator/Null                   → manage_locator / manage_null_object
rig IK/mirror                  → bone_rigging
```
`bone_rigging` only for IK/mirror.
`validator://*` resources are Direct Runtime/Inspector only; a Gateway client must not search for or emulate them.
Known coherent Cubes → one `manage_cubes(operation=create, elements=[...])`; uncertainty → no batch.
Known Cubes sharing one deterministic TRANSLATE/RESIZE intent → derive absolute targets once from fresh state → `manage_cubes(operation=batch_update)`; never loop inspect→modify per Cube; reasoning-layer arithmetic; writes absolute/fail-closed. **Semantic cohort rule:** shared motion → Group; else siblings.
## First-Call Invariants
`add_group` → pass name OR groups, never both.
`manage_cubes update       → id + at least one authored field change`
`manage_cubes rotated create → origin required`
`manage_locator create → name+parent; update → id+authored change`
`manage_null_object create → name+parent; update → id+parent/position`
Validation failure repairs arguments for the **same capability**.
## Capability Discovery / Recovery
Discovery = deferred spec loading after routing.
known exact capability   → invoke directly
unknown/stale → one precise `search_capabilities` query, `limit=4`; `describe_capability` once before mutation.
One precise search miss → reformulate once; second miss → `BLOCKED`. A known foreign-phase capability is never a discovery miss: AUTHORING↔Animation uses handoff.
`INVALID_INPUT` → repair args; same capability. `TARGET_AMBIGUOUS` → resolve UUID once; `TARGET_NOT_FOUND` → focused identity lookup; `STALE_STATE` → one focused refresh; `NO_EFFECT` → diagnose payload; `CAPABILITY_MISMATCH` → handoff/BLOCKED; `OUTCOME_UNKNOWN` → inspect before retry.
Same routed failure twice without new evidence → `BLOCKED`.
## State Reuse / Anti-Loop
Fresh mutation → reuse state/`geometry_effect`; no confirmation readback. Do not automatically re-read fresh mutation targets with `inspect_elements(mode=detail)`; no status/discovery/bounds/capture progress checks.
`inspect_model_bounds` only for envelope/scale/ground/displacement or a diagnosed bounded surface/contact integrity question.
Skip `get_project_info` after create/export unless lifecycle state is unknown/stale.
`export_model`: `bedrock` JSON or `project` `.bbmodel`.
