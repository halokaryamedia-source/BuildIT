# Local Acceptance Runbook

Updated: 2026-08-11  
Owner: local Codex + Blockbench acceptance procedure  
Active only when `docs/knowledge/next-action.md` points here.

This runbook is the **single procedural owner** for the first real local acceptance pass after the non-local cleanup. It is not another planning framework and is not normal asset-authoring guidance.

## 1. Goal

Prove or disprove the current BlockIT product in the environment that source/CI cannot simulate:

- local plugin/runtime behavior;
- stateless MCP endpoint;
- native Codex tool exposure/search behavior;
- representative Bedrock project/geometry/texture/animation/Locator reachability;
- difference-first visual judgement and correction behavior;
- save/reopen/export persistence;
- real call efficiency and redundant-read behavior.

The baseline run should reveal facts. **Do not edit source while establishing the baseline.** Reproduce and classify a failure first.

## 2. Required Reading — No Broad Scan

For repository continuation, read only:

```text
AGENTS.md
→ CONTEXT.md
→ docs/knowledge/next-action.md
→ this runbook
→ mcp/README.md
→ mcp/AGENTS.md
```

Load one source/foundation/review owner only after a concrete failure identifies the boundary.

Do not start by reading all reviews, the task board, historical plans, `Rework`, `Sample`, generated docs, or every skill.

## 3. Hard Constraints

- Branch stays `Local`.
- Do not install/use the upstream hosted Blockbench MCP plugin as proof of BlockIT.
- Extended MCP Families remain **off** for the baseline.
- `risky_eval` and `from_geo_json` remain disabled.
- `list_export_formats`, `apply_texture`, and `filter_by_material` are intentionally absent from the default callable surface.
- Do not create a custom router/profile/readiness system during the baseline.
- Do not change tool count merely because 62 tools appear large; first observe actual Codex exposure/search behavior.
- Do not claim telemetry the client does not expose. Mark it `UNVERIFIED`.
- Do not convert the smoke fixture below into product-specific runtime rules.

## 4. Capture The Environment First

Record before testing:

```text
Local commit SHA
working-tree status
OS
Bun version
Codex version/build
active model/provider when observable
Blockbench version
BlockIT plugin file loaded
MCP endpoint
Extended MCP Families setting
```

From repository root:

```bash
git branch --show-current
git rev-parse HEAD
git status --short
bun --version
```

Expected branch: `Local`.

If the working tree already contains unrelated changes, do not overwrite them. Record them and decide whether the acceptance run can proceed safely.

## 5. Build / Static Gate

From `mcp/`:

```bash
bun install --frozen-lockfile
bun run typecheck
bun run test
bun run build
bun run docs:check
```

Expected production plugin:

```text
mcp/dist/mcp.js
```

A failure here is an **engineering gate failure**, not a Blockbench/runtime failure. Stop and classify before proceeding.

## 6. Load BlockIT Locally

Load `mcp/dist/mcp.js` as a local desktop Blockbench plugin.

Expected default endpoint:

```text
http://127.0.0.1:3000/bb-mcp
```

Confirm in the BlockIT panel/settings:

- BlockIT identity is shown;
- default Bedrock profile is active;
- Extended MCP Families is off;
- endpoint matches the configured loopback endpoint;
- default exposed tool count is 62 for this baseline source state.

Do not treat the panel alone as end-to-end MCP proof.

## 7. Stateless Transport Smoke

With the plugin running:

```bash
cd mcp
bun run verify:stateless-local
```

Also verify the active Codex MCP connection can initialize and issue independent follow-up calls without relying on a server-issued durable session.

Classify failure as one of:

```text
ENVIRONMENT
CLIENT CONNECTION
MCP TRANSPORT/RUNTIME
SOURCE CONTRACT
```

Do not modify source until the failure is reproducible and its owner is clear.

## 8. Default Surface / Native Tool Exposure

Record what Codex actually exposes or searches for on the first meaningful modelling request.

Questions:

1. Does the client inject all 62 tool schemas directly, defer them, or use native tool search?
2. Can geometry tools be reached without manually enumerating the catalog?
3. Can texture, animation, and Locator tools be reached when their stage/intent becomes active?
4. Does Codex load the canonical BlockIT prompt/skills only when relevant?

If client telemetry does not reveal model-visible schema/tokens/search events, write `UNVERIFIED` rather than inferring them.

**Do not build a BlockIT-side router from this test unless live evidence shows the native client path materially fails.**

## 9. Fixture A — Deterministic MCP Smoke Asset

This fixture tests mechanics only. It is **not** a reference-fidelity fixture and must not become a generic modelling rule.

Create project:

```text
name: blockit_local_smoke
format: implicit Bedrock product default
```

Create one root Group/bone:

```text
name: body
origin: [0, 8, 0]
rotation: [0, 0, 0]
```

Create three Cubes under `body`:

```text
core
from [-4, 0, -3]
to   [ 4, 8,  3]

arm
from [4, 3, -2]
to   [10, 6, 2]

tilt
from [-2, 8, -1]
to   [ 2,12,  1]
rotation [0, 0, 15]
origin   [0, 8, 0]
```

Acceptance checks:

- creation returns usable identity/state;
- no immediate ritual `get_project_info`, `list_outline`, or `inspect_element` when the required state was just returned;
- `list_outline`/targeted discovery works when identity is intentionally treated as unknown;
- `inspect_element` returns truthful authored state;
- `inspect_model_bounds` returns finite plausible envelope data;
- `capture_model_views` returns usable named image evidence.

Then perform one deliberate correction, for example resize or translate `arm` while declaring the invariant. Verify returned `geometry_effect`, then re-observe only the affected view/state.

Undo/Redo the correction in Blockbench and confirm the visible/authored result is coherent.

## 10. Fixture A — Texture / PBR / Material Instance Reachability

On the same smoke asset:

1. create one 16×16 texture named `blockit_smoke_texture`;
2. activate it as the Bedrock active/default texture;
3. perform a minimal Painter operation that produces visible pixel evidence;
4. inspect the texture only when image evidence is required;
5. exercise one native Bedrock PBR TextureGroup/material path if runtime support is available;
6. exercise one `material_instance` read/write path on an explicit Cube/face when applicable.

Important:

- do **not** look for or re-enable `apply_texture`;
- do **not** use `filter_by_material` for Bedrock texture identity;
- reuse mutation-returned metadata instead of immediately re-listing it.

Record whether the surface is reachable and whether any reread was actually necessary.

## 11. Fixture A — Animation Reachability

Create a small animation for `body`:

```text
intended canonical name: animation.blockit_smoke
length: about 1 second
simple body rotation out and back to neutral
```

Use the current animation tools rather than inventing raw file manipulation.

Acceptance checks:

- animation identity can be created and inspected;
- known Group UUID/state is reused rather than rediscovered by ritual;
- transform keyframes can be authored and inspected;
- playback/timeline controls behave in live Blockbench;
- return-to-neutral is visibly correct;
- required unsupported controller/sound/timeline-effect capability is reported as a protected gap, not faked.

## 12. Fixture A — Locator / Null Object

Under `body`, create:

```text
Locator: smoke_socket
position [0, 8, 3]
rotation [0, 0, 0]

Null Object: smoke_null
position [0, 4, 0]
```

Verify for each applicable type:

- create;
- inspect;
- update position/parent within the supported contract;
- rename;
- remove/Undo when appropriate.

Do not assume source-level Locator/Null Object support is runtime-proven until these live operations succeed.

## 13. Persistence / Export Round-trip

Use an **absolute** filesystem path outside generated repo state unless the user explicitly wants artifacts committed.

Verify both product outputs:

```text
project → editable .bbmodel
bedrock → Bedrock geometry JSON
```

Acceptance checks:

- path/extension contract is respected;
- reported lifecycle state points at the written artifact;
- `.bbmodel` can be reopened in Blockbench;
- Group/Cube transforms, texture state in scope, Locator/Null Object state, and required animation/project state survive as expected;
- Bedrock geometry export does not silently clobber an existing multi-model geometry file through a non-native path.

If no direct MCP reopen owner exists, use Blockbench's normal open flow and label that part as manual runtime proof.

## 14. Fixture B — Reference Fidelity Scenario

This scenario requires an **approved reference** supplied by the user or an existing explicitly approved workspace package. If no approved reference exists, mark this scenario `BLOCKED`; do not invent one just to complete the checklist.

Choose a reference that exposes depth/side relationships and at least one non-trivial mass/attachment so a front-only approximation can be wrong.

Required sequence:

```text
approved reference
→ compact Primary Form Hypothesis
→ coarse whole-form Cubes only
→ minimum corresponding canonical views
→ difference-first FAIL / UNVERIFIED / PASS
→ secondary work only after primary PASS
```

Mandatory adversarial case:

- make or encounter a state that looks plausible from the front but is materially wrong in side/depth;
- the workflow must return `FAIL` or `UNVERIFIED`, never full 3D `PASS`;
- correct one diagnosed local mismatch using fresh known authored state when sufficient, otherwise one focused `inspect_element`;
- declare the invariant and expected effect;
- verify returned structural effect and fresh affected visual evidence;
- if the same causal correction direction fails twice without new evidence, stop as `BLOCKED` rather than continuing speculative coordinate edits.

Geometry `FAIL` must prevent production texture/animation from being used to hide the problem.

## 15. Efficiency Trace

For each meaningful phase, record a compact table:

| Phase | Tool/call | Purpose | Needed? | Redundant? | Result | Latency/context if observable |
|---|---|---|---|---|---|---|

Specifically flag:

- immediate lifecycle rereads after `create_project`/path export;
- unnecessary `list_outline` after known create/mutation identities;
- unnecessary `inspect_element` after fresh exact state;
- screenshot/capture-per-mutation behavior;
- specialist loads unrelated to the active stage;
- repeated overlapping Resource + Tool reads;
- retries caused by ambiguous/invalid contracts.

Do not fabricate token/latency numbers the client does not expose.

## 16. `structuredContent` A/B — Conditional Only

Do **not** edit result payloads during the baseline.

Run a structured-result A/B only if the trace shows duplicated text + `structuredContent` is a material client/context cost and the client provides enough evidence to judge the change.

Use one high-frequency read tool first. Preserve client-visible evidence before generalizing.

## 17. Failure Classification Before Fix

Every local failure must be classified before source changes:

```text
ENVIRONMENT / INSTALL
CODEX CLIENT / TOOL EXPOSURE
MCP TRANSPORT / REGISTRATION
BLOCKBENCH RUNTIME / API
PUBLIC SOURCE CONTRACT
MODELLING / VISUAL ROUTING
TEXTURE / PBR
ANIMATION
PERSISTENCE / EXPORT
UNKNOWN
```

For a reproducible failure:

1. identify exact owner/source;
2. capture minimum failing evidence;
3. make the smallest complete fix;
4. rerun the failing scenario first;
5. run relevant repository gates;
6. re-run only affected downstream acceptance unless the fix invalidates the whole baseline.

Do not reopen stopped source slices unless the live failure is genuinely new evidence for that slice.

## 18. Completion / Repository Update

After the local pass:

- update `docs/foundation/validation-report.md` with actual live statuses;
- update `docs/knowledge/next-action.md` with the next single active step;
- update `docs/knowledge/operations/task-board.md` only for future/non-active findings;
- record a durable decision only when architecture/product policy actually changed;
- keep historical reviews historical; update the Review Index status rather than rewriting old evidence.

Final local report:

```text
Status: Selesai | Perlu pemeriksaan | Terhenti

Environment:
<versions / commit / endpoint>

Acceptance results:
<pass/fail/unverified by phase>

Efficiency trace:
<only observed facts>

Fixes made:
<none during baseline, or exact evidence-backed fixes afterward>

Remaining blockers:
<exact local evidence/capability needed>

Next step:
<one step>
```
