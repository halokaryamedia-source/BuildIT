# MCP Reduction & Stabilization Plan

Updated: 2026-08-11

Status: **Historical/completed — the bounded non-local stabilization pass was implemented and this plan no longer controls current execution.**

Current status is owned by `docs/knowledge/next-action.md`. Current local procedure is `docs/knowledge/operations/local-acceptance-runbook.md`. Keep the body below as implementation provenance; do not restart unchecked items solely because they remain in this historical plan.

Governing evidence:

```text
docs/knowledge/reviews/mcp-development-quality-audit.md
```

This plan converts that audit into the ordered work required before normal MCP
feature development resumes.

The goal is not to perfect every inherited Blockbench MCP capability. The goal is
to make the **smallest trustworthy MCP surface for BlockIT's active Minecraft
Bedrock Entity workflow**, while retaining useful legacy capability behind
explicit gates until there is evidence to keep or delete it.

---

## 1. Product Boundary

The default BlockIT MCP product is:

```text
Minecraft Bedrock Entity
Geometry: Cube/Cuboid only
Rig: Group hierarchy / Cuboid children
Animation: Group/BoneAnimator authored transforms
Texture: only the outcomes required by the Bedrock Entity workflow
Observation: exact authored state + deterministic rendered views
Execution: local desktop Blockbench service
```

Not part of the default product surface:

```text
Mesh modelling
Mesh deformation
Vertex weights
Mesh UV tooling
Bedrock Block material instances
Hytale-specific editing
arbitrary JavaScript execution
screen-coordinate UI automation
generic network import
broad cross-format export
```

Those capabilities may remain in source only when they are explicitly gated or
quarantined. Existing code is not sufficient reason for default exposure.

---

## 2. Stabilization Principles

### 2.1 Runtime enforcement outranks source appearance

A schema, annotation, setting, comment, generated document, or status label is
not counted as a working contract unless the actual MCP registration/execution
path enforces it.

### 2.2 Preserve useful source without preserving default exposure

`gate` means:

- source may remain;
- normal Bedrock Entity clients do not receive the capability;
- no new hardening effort is spent on the gated family unless a product need
  explicitly reactivates it.

### 2.3 Quarantine before deletion when uncertainty remains

`quarantine` means:

- capability is removed from normal registration immediately;
- it is not treated as supported;
- source is retained temporarily only to make rollback/review easy;
- it must later become `gate`, `keep`, or `remove`; quarantine is not a permanent
  compatibility tier.

### 2.4 Do not build a policy framework

Capability reduction should use the existing family-level registration structure
where possible. Do **not** introduce:

- a general permission engine;
- per-tool ACLs;
- dynamic policy DSLs;
- role systems;
- a new service solely to decide which tools exist.

The normal target is one small Bedrock Entity default profile and an explicitly
opted-in legacy/extended surface only if it remains necessary.

### 2.5 Security fixes come before capability polish

Do not continue Animation micro-hardening, Paint completeness, Mesh cleanup, or
result-shape beautification before the P0 boundary is real.

### 2.6 Local proof and static proof stay separate

GitHub/source inspection may prove control flow, schema ownership, registration,
and configuration. It cannot prove actual Blockbench behavior, OS bind state,
MCP Inspector behavior, Undo/Redo, save/reopen, or visual fidelity.

---

## 3. Protocol / SDK Decision — 2026-08-10

### Current repository

```text
@modelcontextprotocol/sdk 1.x
Streamable HTTP/session implementation in Local
```

### Current primary-source state

The stable 2025-11-25 MCP Streamable HTTP security requirements already require
Origin validation and recommend localhost binding for local servers.

The 2026-07-28 protocol revision changes Streamable HTTP substantially, including
removal of protocol-level sessions and the standalone GET stream. However, at the
time of this plan the official TypeScript SDK v2 line is still published as a
beta/pre-release migration path and the 2026-07-28 protocol release is still
represented by release-candidate/draft guidance in the official repositories.

Primary references checked for this plan:

- MCP stable Streamable HTTP transport/security documentation;
- MCP 2026-07-28 Streamable HTTP draft/RC documentation;
- official TypeScript SDK v1→v2 migration guide;
- official TypeScript SDK 2026-07-28 support guide.

### Decision

**Do not migrate SDK/protocol as part of P0.**

P0 stabilizes the currently used v1 line with the smallest security and contract
corrections. This prevents a security fix from becoming a protocol migration.

Until an intentionally scheduled transport decision:

- do not add more custom session features;
- do not add more keepalive layers;
- do not tune the current session architecture for hypothetical clients;
- do not migrate to v2 merely because migration documentation exists.

A later P1 transport decision must re-check the then-current official stable SDK
and protocol release before changing architecture.

---

# 4. Target Bedrock Entity Core Surface

This is the **default MCP surface target**, not a declaration that every current
tool listed below is already correct.

## 4.1 Project / orientation — KEEP

Core outcomes:

```text
create/open intended Bedrock Entity project
read project identity / format / texture resolution
inspect rendered Cube model bounds
```

Current tools retained as core candidates:

```text
create_project
get_project_info
inspect_model_bounds
```

Target correction:

- `bedrock` is the normal product path;
- generic non-Bedrock format creation must not accidentally broaden the default
  product contract;
- generic compatibility may remain gated instead of requiring a new project API.

## 4.2 Cuboid geometry — KEEP

```text
place_cube
modify_cube
modify_cubes_batch
```

Preserve:

- explicit finite geometry where already implemented;
- deterministic target identity;
- intentional pivot rules;
- bounded coherent Undo.

Do not add Mesh parity.

## 4.3 Group / element structure — KEEP, then trim to Bedrock needs

Core candidates:

```text
add_group
list_outline
find_elements_by_criteria
inspect_element
remove_element
rename_element
get_selection
```

Conditional candidates:

```text
duplicate_element       → keep only if used in the normal modelling loop
select_all_of_type      → gate unless a semantic workflow proves it necessary
filter_by_material      → gate unless Texture diagnostics prove it core
```

Core mutation must continue moving toward UUID-first / exact-unique-name
resolution. Selection must not be an implicit destructive target unless the tool
is explicitly a selection operation.

## 4.4 Reference observation / camera — SPLIT

KEEP:

```text
capture_model_views
capture_screenshot
```

GATE as manual/debug UI support:

```text
set_camera_angle
capture_app_screenshot
```

`capture_model_views` remains the preferred fidelity evidence path because it is
canonical and does not depend on the current editor camera.

## 4.5 Texture essentials — KEEP

Core outcome tools:

```text
create_texture
apply_texture
list_textures
get_texture
```

Conditional helper:

```text
activate_texture → gate with direct Paint workflows unless a core caller needs it
```

Advanced PBR/material operations remain source-preserved but gated until format
or project requirements prove them necessary.

## 4.6 Cuboid rig / Animation essentials — KEEP

Default Animation core candidates:

```text
create_animation
manage_keyframes
bone_rigging
animation_timeline
inspect_animation
```

Recent hardening remains preserved.

Advanced Animation candidates are **GATE**, not deleted:

```text
animation_graph_editor
batch_keyframe_operations
animation_copy_paste
```

Reason:

- they are useful for complex animation work;
- they are not required to establish the minimum Bedrock Entity create/inspect
  loop;
- known residual validation/runtime gaps should not force P0 scope expansion.

After P0/P1 core proof, an advanced-animation profile may promote them without
reimplementing them.

## 4.7 History / recoverability — KEEP with one quarantine

KEEP:

```text
undo
redo
get_undo_stack
```

QUARANTINE pending semantic proof:

```text
save_checkpoint
```

A checkpoint that inserts an Undo entry while claiming not to modify the project
needs explicit value and lifecycle proof before remaining a default tool.

## 4.8 Bedrock export — KEEP outcome, narrow generic surface

Required product outcome:

```text
export/save the current Bedrock Entity model
```

Current broad tools:

```text
list_export_formats
export_model
```

Classification:

- current-format Bedrock export behavior → KEEP outcome;
- arbitrary codec discovery/alternate-codec export → GATE;
- arbitrary filesystem-path export → GATE/open-world behavior;
- do not create a second export framework if the existing tool can be narrowed
  cleanly.

## 4.9 Validator resources — KEEP read-only

Keep read-only validator status/check/warning/error resources when they provide
actual Blockbench validation evidence.

They must remain validation evidence only; validator PASS must never be promoted
to visual/reference-fidelity PASS.

---

# 5. Capability Family Classification

| Family / capability | Classification | Default Bedrock Entity exposure | Planned treatment |
|---|---|---:|---|
| Project orientation | **KEEP** | Yes | Keep small; Bedrock Entity is normal path. |
| Cubes / Cuboid correction | **KEEP** | Yes | Preserve recent deterministic/Undo work. |
| Element/Group structure | **KEEP / TRIM** | Yes | Keep Bedrock Group/Cube operations; gate broad selection conveniences if unused. |
| Element inspection | **KEEP** | Yes | Reference design style for read-only tools. |
| Canonical model views | **KEEP** | Yes | Primary visual evidence tool. |
| Generic camera manipulation | **GATE** | No | Manual/debug visual fallback only. |
| Texture create/apply/read | **KEEP** | Yes | Minimum Texture outcome surface. |
| PBR/material utilities | **GATE** | No by default | Enable only for format/project requirements. |
| Paint editor automation | **GATE** | No by default | Promote only operations proved necessary by real Texture workflow. |
| Animation create/manage/rig/timeline/read | **KEEP** | Yes | Preserve recent hardening; resume fixes after P0. |
| Advanced graph/batch/copy Animation | **GATE** | No by default | Preserve source; advanced profile only. |
| Undo/redo/history readback | **KEEP** | Yes | Required recoverability. |
| Undo checkpoint marker | **QUARANTINE** | No | Prove semantics/value or remove. |
| Current-format Bedrock export | **KEEP** | Yes | Narrow existing broad export contract. |
| Generic codec/path export | **GATE** | No | Explicit compatibility/debug mode. |
| `from_geo_json` | **REMOVE** | No | Current contract is misleading and network surface is unjustified. |
| Material instances | **GATE** | No | Bedrock Block-only capability. |
| Mesh modelling/editing | **GATE** | No | Separate/legacy format capability; no Entity hardening. |
| Mesh UV | **GATE** | No | Follows Mesh gate. |
| Armature/vertex weights | **GATE** | No | Mesh-deformation rig, not Cuboid Group rig. |
| Hytale tools/resources/prompts | **GATE** | No | Preserve current plugin-specific optional path. |
| `trigger_action` | **GATE** | No | Debug/fallback only. |
| `emulate_clicks` | **GATE** | No | Debug/fallback only. |
| `fill_dialog` | **GATE** | No | Debug/fallback only. |
| `risky_eval` | **QUARANTINE → REMOVE unless explicitly justified** | No | Never Stable/default; do not build a sandbox around it. |
| Dead `reportProgress` plumbing | **REMOVE** | N/A | Delete unless real progress support becomes a requirement. |
| `mcp_instructions` setting | **QUARANTINE** | N/A | Wire to real server instructions or remove. |
| Prompt CDN fallback | **GATE / OPTIONAL** | No requirement | Default stays off; remove if it has no real product use. |

`REMOVE` means the current capability/contract should be deleted rather than
hardened. It does not forbid a future replacement if a real product requirement
appears.

---

# 6. Resource / Prompt Classification

## 6.1 Resources

### KEEP, but make lightweight

```text
projects://
textures://
validator://...
```

Corrections after P0:

- default project resources should not expose local filesystem paths without a
  demonstrated client need;
- texture metadata resources should not duplicate large image/base64 `source`
  data already available through `get_texture`;
- resource output should remain metadata-oriented.

### GATE

```text
reference_models://...   → only when plugin/capability exists
Hytale resources          → Hytale capability only
nodes://...                → developer/diagnostic unless a core caller proves need
```

`nodes://` overlaps newer focused authored-state inspection and should not remain
core merely because it exists.

## 6.2 Prompts

KEEP:

```text
model_creation_strategy
```

GATE as developer/debug guidance:

```text
blockbench_native_apis
blockbench_code_eval_safety
```

The code-eval prompt must not justify exposing `risky_eval` by default.

GATE by capability:

```text
Hytale prompts
```

---

# 7. P0 — Make The Boundary Real

P0 contains only security, public-contract enforcement, and proof infrastructure.
No product feature expansion is allowed.

## P0.1 — Local transport containment

Primary owner:

```text
mcp/server/net.ts
mcp/index.ts
```

Goal:

> Make the server actually local-only rather than merely logging `localhost`.

Required change boundary:

- explicitly bind the default server to loopback;
- consume the existing `host` concept rather than leaving it unused;
- validate `Origin` before MCP transport handling;
- reject invalid present Origins with HTTP 403;
- preserve clients that do not send an Origin header when they are connecting
  through the intended local transport;
- keep remote/non-loopback operation unsupported in the default product.

Authentication decision for default mode:

> Do **not** create an OAuth/token system merely for the local-only BlockIT mode.
> Loopback binding + Origin validation are the immediate containment boundary.
> Any future non-loopback mode must not ship without a separately reviewed auth
> design.

Do not change:

- tool behavior;
- Animation;
- session model beyond what is required for request rejection;
- SDK version.

Static proof:

- explicit host reaches `listen()`;
- Origin check occurs before MCP request dispatch;
- invalid external Origin has a deterministic 403 path.

Local proof required:

```text
OS listener is loopback-only
MCP Inspector/intended local client can connect
invalid external Origin returns 403
normal local MCP call still works
```

## P0.2 — Dangerous default capability containment

Goal:

> Reduce blast radius before deeper refactoring.

Required actions:

- stop registering `risky_eval` in the default MCP surface;
- stop registering `from_geo_json` in the default MCP surface;
- reclassify `risky_eval` away from Stable/default semantics;
- do not replace either with a new generic execution/import framework.

This slice may use the smallest existing enable/registration mechanism. Do not
build the full P1 profile system yet.

Acceptance:

- default `tools/list` does not expose `risky_eval`;
- default `tools/list` does not expose `from_geo_json`;
- normal Bedrock Entity flow is unaffected.

## P0.3 — Real MCP schema enforcement + annotations

Primary owner:

```text
mcp/lib/factories.ts
```

Goal:

> Make one real public-contract owner instead of schemas/annotations that only
> look enforced.

Required behavior on the current SDK line:

1. preserve the original complete Zod schema for execution;
2. validate callback args through that full schema before calling tool logic so
   top-level `.refine()` / `.superRefine()` cannot disappear;
3. continue supplying the SDK-compatible input schema representation needed by
   the installed v1 SDK;
4. pass supported tool annotations through both initial registration and
   per-session reconstruction;
5. include `idempotentHint` in local annotation typing if the installed SDK
   supports it;
6. do not duplicate per-tool validation to work around a broken factory;
7. keep schema construction free of Blockbench globals.

Error policy:

- input-contract failure must be a real failed tool call / SDK validation error,
  not an ordinary success string;
- tool logic may still provide targeted application-level errors where useful.

Targeted regression proof:

- one top-level `.refine()` fixture is rejected through actual registered-tool
  execution;
- one `.superRefine()` fixture is rejected;
- annotation metadata is visible in `tools/list`/Inspector;
- reconstructed session server has the same schema/annotation contract as the
  initial registration path.

## P0.4 — Real engineering gate

Goal:

> Make “strict”, “tested”, and “CI” mean something executable.

Required package scripts:

```text
typecheck   → tsc --noEmit
test        → real Bun tests
build       → current production bundle
docs check  → generated output freshness
```

Required repository workflow:

```text
.github/workflows/<MCP verification workflow>
```

The root workflow must run with `mcp/` as the working package and gate at least:

1. dependency install from the committed lockfile;
2. full package typecheck;
3. targeted Bun contract tests;
4. production build;
5. docs generation/freshness assertion.

Do not claim P0 complete while `tsc --noEmit` still fails.

Do not create broad low-value unit coverage. Initial tests should target the
specific high-risk contracts discovered by the audit:

```text
full-schema refinement preservation
annotation registration
Origin validation helper/path
disabled/quarantined tool exposure
generated-doc freshness
```

## P0.5 — Restore generated documentation authority

Goal:

> Make checked-in generated API documentation match current source or stop
> treating it as authoritative.

Required:

- regenerate from canonical source/schema ownership;
- verify current package version;
- verify hardened `place_cube` no longer documents invented default extents;
- make CI fail when regeneration would create an uncommitted diff;
- do not hand-edit generated API JSON/HTML.

### P0 Exit Gate

P0 is complete only when all are true:

```text
[ ] default network listener is proven loopback-only
[ ] invalid present Origin is rejected before MCP handling
[ ] risky_eval is absent from default tool list
[ ] from_geo_json is absent from default tool list
[ ] top-level refine/superRefine behavior is runtime-enforced
[ ] MCP annotations are visible through the actual client contract
[ ] full package typecheck passes
[ ] targeted contract tests pass
[ ] production build passes
[ ] root MCP verify workflow exists and runs
[ ] generated MCP docs are fresh
```

No Animation/Texture feature work resumes at this point yet; P1 first reduces the
surface and proves the core workflow.

---

# 8. P1 — Reduce The Default MCP

## P1.1 — Introduce one small default registration profile

Goal:

> Default `tools/list` represents BlockIT Bedrock Entity, not generic Blockbench.

Preferred design:

```text
bedrock_entity  → default
extended/legacy → explicit opt-in only if retained
```

Keep implementation family-level. Reuse existing module registration functions.
Do not build dynamic ACLs or per-tool role logic.

Default profile should include only the KEEP core identified in this plan.

Non-core family code may remain compiled temporarily, but it must not be exposed
unless its gate is explicitly enabled.

Acceptance:

- default tool list contains no Mesh modelling, Mesh UV, Armature/weights,
  Bedrock Block material instance, Hytale, generic UI automation, or arbitrary
  eval/import tools;
- Bedrock Entity create→observe→correct→texture→animate→history/export path is
  still representable;
- the reduced list is generated from registration truth, not a documentation-only
  filter.

No numeric tool-count quota is imposed. Fewer tools are a consequence of product
scope, not an optimization target by itself.

## P1.2 — Apply family gates

Gate as families rather than hardening every tool:

```text
Mesh + Mesh UV
Armature + vertex weights
Bedrock Block material instances
advanced PBR/material operations
Paint automation
advanced Animation tools
UI automation
Hytale integration
broad export compatibility
```

Rules:

- gated tools are not default MCP capabilities;
- a gated tool does not need immediate parity with hardened core standards;
- if a gated family becomes a real product requirement later, audit it before
  promotion rather than assuming old source quality is sufficient.

## P1.3 — Consolidate ownership only inside the surviving core

Do not globally refactor legacy/gated code.

### Identity ownership

Create/reuse a small core set of deterministic resolvers only after callers are
audited:

```text
Cube
Group
Texture
Animation
```

Normal mutation identity contract:

```text
exact UUID first
otherwise exact name only when unique
ambiguous explicit target → fail
missing explicit target → fail
no UUID-prefix matching for mutation
no silent root/default target fallback
```

Selection fallback is permitted only for tools whose public contract explicitly
states they operate on selection.

### Mutation ownership

Core mutation pattern:

```text
preflight all external targets
↓
open one bounded Undo transaction
↓
mutate
↓
finish
failure after open → cancel/revert
↓
return actual resulting identity/state where useful
```

Do not retrofit every gated legacy tool in the same refactor.

### Result ownership

For core tools, converge gradually on:

```text
content          → human-readable compact text/JSON
structuredContent → stable machine-readable result when structure matters
```

Prioritize inspection/readback and identity-returning mutations.

Do not mass-convert all legacy outputs in one commit.

## P1.4 — Transport/session simplification decision

This is a **decision slice before implementation**, not an automatic rewrite.

At this point re-check:

- current stable MCP protocol release;
- current stable TypeScript SDK release;
- actual BlockIT client(s) that must be supported;
- Blockbench desktop native-module/runtime constraints.

Support only clients BlockIT actually uses. README compatibility claims are not
sufficient reason to own extra transport complexity.

Decision questions:

1. Is v2 now stable and appropriate for production?
2. Can an official server/runtime adapter replace the home-grown HTTP parser in
   Blockbench's desktop environment?
3. Which of TCP keepalive, HTTP keep-alive, SSE heartbeat, MCP ping, custom
   inactivity tracking, and per-session reconstruction are still required?
4. Does the intended client need 2025-era protocol sessions, or can the server
   move to a simpler modern per-request model?
5. What compatibility layer is the minimum required during migration?

Required outcome:

- choose **keep current minimal**, **simplify on v1**, or **migrate to stable v2**;
- record supported clients and evidence;
- remove redundant layers rather than tuning all of them.

No transport migration may be bundled with unrelated modelling/tool work.

## P1.5 — Core local end-to-end acceptance

Before P2 cleanup or resumed feature development, run one real local acceptance
flow:

```text
fresh Blockbench state
↓
connect intended MCP client
↓
create/open Bedrock Entity project
↓
create Cuboid geometry
↓
inspect exact authored geometry
↓
capture canonical model views
↓
create/apply required Texture
↓
create Group rig
↓
create + mutate Animation
↓
inspect Animation
↓
Undo / Redo
↓
export/save
↓
close/reopen
↓
continue inspection without identity drift
```

This is not a visual-quality benchmark for a specific asset. It is an
architecture acceptance run proving the minimal core can complete the product
workflow.

Required recorded evidence:

```text
client used
Blockbench version
MCP version/profile
commands/tool calls used
actual failures
Undo/Redo result
save/reopen result
known limitations
```

### P1 Exit Gate

```text
[ ] default MCP exposure matches Bedrock Entity Core
[ ] non-core families are actually gated, not merely labelled experimental
[ ] core identity contract is consistent
[ ] core mutation/rollback contract is consistent where applicable
[ ] core structured readback is sufficient for continuation
[ ] transport future has an evidence-backed decision
[ ] local end-to-end core acceptance passes or has explicit blocking defects
```

If the E2E run exposes a core blocker, fix that blocker before P2. Do not broaden
surface to hide the failure.

---

# 9. P2 — Remove Residual Debt

P2 is cleanup after a working reduced core exists.

## P2.1 — Paint reduction

Keep only Paint operations demonstrated by the real Bedrock Entity Texture
workflow.

Possible outcomes:

- no direct Paint tools promoted; Texture creation/apply is sufficient;
- a very small Paint subset is promoted;
- the rest stays gated or is removed.

Do not use “Blockbench can do it” as the acceptance criterion.

## P2.2 — Resource hygiene

- remove large texture `source` duplication from metadata resources;
- remove local path exposure from default project resources unless a client
  proves it needs the path;
- keep focused readback over generic object dumping;
- gate generic `nodes://` diagnostics unless promoted by evidence.

## P2.3 — Settings cleanup

For every MCP setting, choose one:

```text
real and consumed
explicit developer-only
remove
```

Specifically:

- wire `mcp_instructions` to actual server instructions or remove it;
- reassess session/heartbeat settings after the transport decision;
- keep CDN prompt fallback only if an actual product workflow needs it.

## P2.4 — Delete dead abstractions

Remove:

- no-op progress plumbing when no real progress capability exists;
- dead compatibility helpers left by removed tool families;
- duplicate resolvers no longer used by surviving core;
- quarantined code that has no approved use case.

Do not remove source solely to reduce line count; delete only when ownership and
callers are proved.

## P2.5 — Quarantine resolution

Every quarantine must end as a decision:

```text
risky_eval       → default expectation: REMOVE from production surface/source
save_checkpoint  → KEEP only with proved useful semantics; otherwise REMOVE
mcp_instructions → WIRE or REMOVE
```

`from_geo_json` is already planned as REMOVE rather than indefinite quarantine.

## P2.6 — Resume parked product hardening from evidence only

After P0 + P1 acceptance, revisit the backlog in product order.

Known parked Animation defect:

```text
animation_timeline.select_range selection lifecycle
```

Other Animation/Texture work resumes only when:

- it is inside the default/approved capability surface; and
- a real workflow or local proof identifies it as a blocker.

Do not restart a long sequence of one-field schema hardening merely because more
weak schemas can be found.

---

# 10. Work Order

Execute one bounded slice at a time:

```text
P0.1  loopback + Origin containment
P0.2  dangerous default capability containment
P0.3  full-schema validation + real annotations
P0.4  typecheck/tests/root CI
P0.5  generated-doc freshness

P1.1  default Bedrock Entity registration profile
P1.2  family gates
P1.3  core-only resolver/mutation/result consolidation
P1.4  transport/session future decision
P1.5  local end-to-end core acceptance

P2.1  Paint reduction
P2.2  resource hygiene
P2.3  settings cleanup
P2.4  dead abstraction removal
P2.5  quarantine resolution
P2.6  evidence-driven parked product fixes
```

A slice may be split smaller when source ownership or proof requires it. It may
not be silently combined with the next item for convenience.

---

# 11. Anti-Overdevelopment Stop Rules

Stop and re-evaluate if a proposed fix requires any of the following without a
proved product need:

```text
new generic server framework inside the plugin
new permission/role engine
OAuth solely for localhost-only default mode
new dynamic capability DSL
hardening every gated legacy tool
rewriting all output contracts at once
rewriting all resolvers at once
protocol migration mixed with modelling changes
keeping four liveness systems because each already exists
new visual scoring/AI judgement service
new Mesh/Armature abstractions for Bedrock Entity
```

Preferred response to a legacy non-core defect is often:

```text
gate it
```

not:

```text
perfect it
```

---

# 12. Evidence Model For Implementation

## Static/source proof

Can prove:

- registration profile membership;
- full schema parse is invoked;
- annotation config reaches SDK registration;
- loopback host is supplied;
- Origin rejection control flow exists;
- typecheck/test/build/docs commands are defined;
- generated docs match source at commit time.

## Local runtime proof

Required for:

- actual OS bind address;
- MCP Inspector/client-visible annotations/tool list;
- runtime refined-schema rejection;
- local client compatibility;
- Blockbench mutation/Undo/Redo;
- camera/image return behavior;
- Animation playback/state;
- export/save/reopen;
- reference-fidelity visual behavior.

Do not convert static proof into runtime claims in project memory.

---

# 13. Definition Of Stabilized MCP

The MCP may leave stabilization mode only when:

1. the default listener is genuinely local-only and request-origin handling is
   explicit;
2. arbitrary execution/misleading import is absent from the normal surface;
3. full MCP input schemas and annotations are enforced by the real registration
   path;
4. full package typecheck, targeted tests, build, and docs freshness are active
   repository gates;
5. default `tools/list` represents the Bedrock Entity product rather than generic
   Blockbench capability breadth;
6. non-core families are explicitly gated/quarantined/removed;
7. one complete local Bedrock Entity workflow succeeds through save/reopen;
8. remaining known defects are prioritized by actual core workflow impact.

Only then should the repository return to normal feature-hardening mode.

---

# 14. Immediate Next Slice

The first implementation slice after this plan is approved is **P0.1 only**:

> Explicit loopback binding + Origin validation on the current MCP v1 transport,
> without changing SDK version, tool behavior, session architecture, Animation,
> Geometry, or Texture.

Before that source change, re-read the current stable MCP Streamable HTTP
security requirements and inspect the installed SDK/runtime call path. Local
network behavior remains proof-required after the source change.
