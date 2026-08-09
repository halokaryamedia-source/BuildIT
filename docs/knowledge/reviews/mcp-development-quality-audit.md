# MCP Development Quality Audit

Updated: 2026-08-10

Status: **Active evidence — feature work frozen pending reduction/stabilization planning**

## What Changed

This review records the repository-wide MCP audit requested before continuing
more feature hardening. It intentionally does **not** modify MCP source.

The audit asks a different question from the recent source-hardening work:

> Is the current MCP development surface actually optimal for BlockIT, or does it
> contain false confidence, legacy breadth, and overdevelopment inherited from
> the earlier generic Blockbench MCP foundation?

The answer from current Local source is:

> **The MCP is not yet optimal.** Recent Bedrock Cuboid/inspection/Animation work
> is materially better than the older source, but it sits on top of a broad,
> inconsistent MCP foundation whose security, validation, verification, tool
> exposure, and maintenance ownership must be stabilized before more
> micro-hardening is justified.

This review is the evidence ledger. It does not itself authorize large rewrites;
its findings must be converted into a separate reduction/stabilization plan
before source changes resume.

## Review Method

Primary specialist lens:

```text
.agents/skills/mcp-server-development/SKILL.md
```

Acceptance lens:

- smallest public surface that solves the BlockIT product need;
- validate external input at the real MCP boundary;
- do not count metadata, comments, schemas, or build success as proof when the
  runtime path does not enforce them;
- do not harden fallback/generic capabilities merely because they already exist;
- distinguish source/static proof from live Blockbench proof;
- treat active Bedrock Entity modelling as **Cube/Cuboid only** unless product
  scope explicitly changes.

Primary repository evidence inspected:

```text
mcp/lib/factories.ts
mcp/lib/sessions.ts
mcp/lib/util.ts
mcp/server/net.ts
mcp/server/server.ts
mcp/server/tools.ts
mcp/server/tools/*.ts
mcp/server/resources.ts
mcp/server/prompts.ts
mcp/build/docs-manifest.ts
mcp/build/index.ts
mcp/package.json
mcp/tsconfig.json
mcp/docs/api.json
mcp/.github/workflows/deploy.yml
mcp/index.ts
mcp/ui/settings.ts
```

## Verdict

| Dimension | Current assessment |
|---|---|
| Product focus | **Too broad** |
| Bedrock Cuboid core tools | **Improving / relatively strong** |
| Animation core | **Improving, still local-proof-limited** |
| Deterministic targeting | **Two generations coexist** |
| Undo/recoverability | **Two generations coexist** |
| MCP contract correctness | **Fundamental gaps remain** |
| Security boundary | **Priority blocker** |
| Tool-surface economy | **Overexposed** |
| Automated verification | **Insufficient** |
| Generated documentation freshness | **Broken** |
| Maintainability | **Duplicate ownership / legacy breadth** |
| Protocol/transport direction | **Legacy-heavy; migration risk must be audited** |

The practical consequence is a development freeze on new MCP features and on
non-critical micro-hardening until the P0/P1 foundation is addressed by an
approved stabilization plan.

---

# P0 — Foundation Problems

These findings outrank the parked `animation_timeline.select_range` lifecycle
fix because they affect the trustworthiness of the MCP boundary itself.

## P0.1 — Server is not explicitly loopback-bound

Location:

```text
mcp/server/net.ts
mcp/index.ts
```

Observed source:

```ts
httpServer.listen(port, () => {
  console.log(`[MCP] Server listening on http://localhost:${port}${endpoint}`)
})
```

The `createNetServer` options type even contains an optional `host?: string`, but
current implementation does not consume it for `listen()` and the plugin entry
does not pass a loopback host.

Issue:

- log output claims `localhost`;
- the actual server bind is not explicitly limited to `127.0.0.1` / `::1`;
- this MCP exposes high-impact capabilities in the same server.

Impact:

- local-only trust is assumed in messaging but not established by source;
- network exposure must be treated as a security blocker until corrected and
  verified locally.

Required stabilization direction:

- make loopback binding explicit by default;
- do not rely on a friendly log string as a security boundary;
- any future non-loopback mode must be deliberate and separately protected.

## P0.2 — No proved Origin/authentication boundary before MCP handling

Location:

```text
mcp/server/net.ts
mcp/ui/settings.ts
mcp/server/server.ts
```

Observed source handles:

- raw HTTP headers/body;
- endpoint routing;
- `Mcp-Session-Id`;
- initialize detection;
- health/ready routes;
- transport dispatch.

The audited Local request path did not show an Origin allowlist or an
authentication/token check before MCP requests reach the transport. Settings do
not expose a security credential either.

Impact:

- especially serious in combination with `risky_eval`, filesystem export,
  generic UI actions, and URL-fetching import;
- security posture currently depends on an unproven assumption that only the
  intended local client can reach the server.

Required stabilization direction:

- define the local desktop security model explicitly;
- add protocol-appropriate request-origin protection;
- decide whether loopback-only is sufficient for the default product and whether
  any stronger authentication is needed for optional remote exposure.

## P0.3 — `risky_eval` is a Stable core tool

Location:

```text
mcp/server/tools/ui.ts
```

Current tool:

```text
name: risky_eval
status: stable
```

Execution includes:

```ts
await eval(code.trim())
```

The input restriction only rejects `console.` and JavaScript comment markers.
It is not a sandbox and does not establish an allowlisted Blockbench operation
surface.

Additional failure semantics:

- arbitrary JavaScript side effects are not guaranteed to be captured by the
  generic Undo edit;
- caught errors are returned as ordinary text rather than necessarily becoming
  a failed MCP call;
- `Undo.finishEdit("Agent executed code")` is executed in `finally`.

Impact:

- arbitrary execution is presented as a stable first-class capability;
- generic Undo creates a false implication of recoverability;
- hardening this evaluator itself would likely be further overdevelopment.

Required stabilization direction:

- remove it from the default product surface;
- keep only as an explicit debug/fallback capability if there is a proved need;
- do not treat regex filtering as execution safety.

## P0.4 — MCP tool annotations are stored but not registered

Location:

```text
mcp/lib/factories.ts
```

`ToolSpec` and internal `ToolDefinition` store:

```text
destructiveHint
readOnlyHint
openWorldHint
```

However both initial registration and per-session reconstruction currently pass
only:

```text
title
description
inputSchema
```

to `server.registerTool()`.

Impact:

- annotations visible in source/docs/UI create an impression that the MCP client
  receives safety metadata;
- the actual MCP registration path does not prove that;
- recent work classifying tools as read-only/destructive is therefore not fully
  reflected at the public MCP contract.

Required stabilization direction:

- make annotations part of the real registration definition;
- include supported hints consistently in both the initial and reconstructed
  server path;
- verify using MCP Inspector/client output, not only source metadata.

## P0.5 — Top-level Zod refinements can be stripped by the tool factory

Location:

```text
mcp/lib/factories.ts
```

Current factory converts schemas using `extractShape()`. For `ZodEffects` it
recursively unwraps to the underlying object and returns only its shape.

The execution callback then casts SDK-provided args and calls the tool directly;
it does not re-run the original complete `tool.parameters.parse(args)` schema.

Issue:

- top-level `.refine()` / `.superRefine()` semantics can disappear from the MCP
  runtime registration boundary;
- source may look strongly validated while cross-field invariants are not actually
  enforced by the registered schema.

Concrete example:

```text
mcp/server/tools/texture.ts → createTextureParameters
```

The schema contains top-level refinements for:

- `data` and `fill_color` mutual exclusion;
- `layer_name` required with `fill_color`;
- `group` required when `pbr_channel` is set.

The execute path does not independently establish the entire same cross-field
contract before mutation.

Impact:

> **Schema presence is currently not sufficient proof of MCP validation.**

This directly changes how prior schema-hardening work should be interpreted.

Required stabilization direction:

- make one complete schema the runtime contract owner;
- ensure the SDK registration path and execution path preserve all refinements;
- add regression tests for top-level refine/superRefine behavior before further
  per-tool validation work.

## P0.6 — `from_geo_json` has a misleading/broken public contract

Location:

```text
mcp/server/tools/import.ts
```

Public description says the tool imports GeoJSON and accepts a file path, data
URL, URL, or inline GeoJSON.

Execution instead ultimately runs:

```ts
Codecs.bedrock.parse!(JSON.parse(geojson), "")
```

For non-inline JSON it uses `new URL(...)` and permits only `http:` / `https:`.
A plain filesystem path and data URL therefore do not match the described input
contract.

The URL-fetch path also contains:

```ts
const blockedPatterns: Array<RegExp> = [];
// TODO: Add patterns for private IPs, localhost, etc. if needed
```

Impact:

- tool name/description imply a different data format than the actual Bedrock
  parser;
- advertised file/data-URL support does not match execution;
- the tool adds unnecessary network-fetch/security surface;
- this is a strong quarantine/removal candidate rather than a hardening target.

## P0.7 — No effective test/typecheck quality gate

Locations:

```text
mcp/package.json
mcp/tsconfig.json
mcp/build/index.ts
mcp/.github/workflows/deploy.yml
```

Current package script:

```json
"test": "echo \"Error: no test specified\" && exit 1"
```

There is no normal `typecheck` script.

`tsconfig.json` sets `strict: true`, but the normal plugin build uses Bun's
bundler. A successful bundle is therefore not equivalent to proving the TypeScript
program typechecks.

Concrete consistency signal:

- `ToolSpec.annotations` does not currently declare `idempotentHint`;
- `texture.ts` nevertheless uses `idempotentHint: true` on `activate_texture`.

This is exactly the kind of mismatch an actual typecheck gate should catch.

Workflow placement problem:

```text
mcp/.github/workflows/deploy.yml
```

is nested below `mcp/`, not repository-root `.github/workflows/`. On the current
monorepo layout this is not a normal repository GitHub Actions workflow location.

Even the workflow content itself builds plugin/docs but does not provide a real
unit/regression test suite or explicit `tsc --noEmit` gate.

Impact:

- `strict: true`, a large workflow file, and successful Bun builds can create
  confidence not backed by an active repository quality gate;
- many MCP changes have no automated regression protection.

Required stabilization direction:

- establish root CI ownership;
- add real typecheck;
- add small high-value contract tests before broad coverage;
- treat build, typecheck, contract tests, and live Blockbench proof as different
  evidence classes.

## P0.8 — Checked-in generated API documentation is stale

Locations:

```text
mcp/package.json
mcp/docs/api.json
mcp/server/tools/cubes.ts
```

Current source package version is `1.6.1`, while checked-in `mcp/docs/api.json`
still reports `1.6.0` and an older generation timestamp.

More importantly, generated docs still describe the legacy `place_cube`
contract with default geometry extents such as:

```text
from: [0,0,0]
to:   [1,1,1]
```

Current Local `place_cube` intentionally requires explicit finite `from/to` and
states that it does **not** invent the default 1×1×1 Cube.

Impact:

- repo contains contradictory public contracts;
- developers/agents can follow generated documentation and produce exactly the
  behavior recent fidelity hardening was designed to prevent.

Required stabilization direction:

- make generated-doc freshness a build/CI assertion;
- regenerate only from canonical schemas/specs;
- do not hand-edit generated files.

---

# P1 — Overdevelopment / Excess Surface

## P1.1 — Core registry remains generic Blockbench rather than BlockIT-focused

Location:

```text
mcp/server/tools.ts
mcp/build/docs-manifest.ts
```

Core registration includes domains such as:

```text
Animation
Armature
Camera
Cubes
Elements
Export
History
Import
Material Instances
Mesh
Paint
Project
Texture
UI
UV
```

plus optional Hytale integration.

The active BlockIT product boundary is much narrower: Minecraft Bedrock Entity
modelling, with model geometry **Cube/Cuboid only** and Animation through normal
Group/BoneAnimator hierarchy.

Impact:

- large tool-selection surface for AI clients;
- more descriptions/schemas in context;
- more wrong-path affordances;
- maintenance burden on capability families that do not improve the primary
  Bedrock Entity workflow.

Required stabilization direction:

- define **Bedrock Entity Core** explicitly;
- make non-core families capability/format/debug gated instead of peer default
  tools.

## P1.2 — Mesh creation/editing is legacy breadth for the default product

Location:

```text
mcp/server/tools/mesh.ts
```

Exposed capabilities include:

- mesh placement;
- extrude/subdivide;
- sphere/cylinder;
- knife;
- vertex/edge/face editing;
- mesh selection/merge.

This is not the active Bedrock Cuboid modelling geometry path.

Legacy behavior also differs from newer deterministic standards. Examples:

- group lookup may fall back silently to root using `?? "root"`;
- some paths open Undo before all validation is complete;
- rollback/cancel handling is inconsistent.

Direction:

- do not spend time hardening every Mesh operation for the Bedrock Entity core;
- gate/quarantine by format/capability unless a separate product scope requires
  it.

## P1.3 — Mesh-only UV tools are non-core

Location:

```text
mcp/server/tools/uv.ts
```

The UV domain is exclusively Mesh-focused (`set_mesh_uv`, `auto_uv_mesh`,
`rotate_mesh_uv`). It therefore does not belong in the default Cuboid workflow.

Some paths also use the older Undo pattern where validation can throw after
`Undo.initEdit()` without a local cancel/recovery wrapper.

Direction:

- remove from default Bedrock Entity exposure;
- do not broaden Cuboid Texture work merely to justify legacy Mesh UV tools.

## P1.4 — Armature/vertex-weight system is the wrong default rig abstraction

Location:

```text
mcp/server/tools/armature.ts
```

The file explicitly describes armature as a skeletal rig for **mesh deformation**
and exposes armature bones plus vertex weights.

The active Bedrock Entity rig path uses normal Blockbench `Group` hierarchy and
`BoneAnimator` for Cuboid children instead.

Legacy resolver behavior also accepts first-match names and UUID prefixes rather
than the deterministic UUID-first/unique-name model used by newer tooling.

Direction:

- gate armature/vertex-weight capabilities away from the default Bedrock Entity
  surface;
- do not make mesh-deformation rigging a prerequisite for Cuboid Animation.

## P1.5 — Bedrock Block material instances are mixed into Entity core

Location:

```text
mcp/server/tools/material-instances.ts
```

The tools themselves describe `minecraft:material_instances` as a **Bedrock
Block** feature, yet they are registered as normal core tools.

They also retain older selection-dependent targeting and mutation/Undo patterns.

Direction:

- format-gate as Bedrock Block capability;
- do not harden them as Entity-core blockers.

## P1.6 — Transport/session stack is disproportionately complex for a single-client desktop service

Locations:

```text
mcp/server/net.ts
mcp/lib/sessions.ts
```

The source itself states that the plugin is a **single-client desktop service**,
but the implementation owns:

- raw TCP socket server;
- custom HTTP parsing;
- TCP keepalive;
- socket idle timeout;
- HTTP keep-alive;
- SSE heartbeat;
- MCP ping requests;
- custom session inactivity manager;
- ping failure tracking;
- per-session server reconstruction;
- health and ready routes.

This is a high maintenance surface whose complexity is not directly tied to
reference fidelity or modelling quality.

Internal semantic drift is already visible: comments around pong/activity and
timeout behavior are not fully aligned with what the implementation does.

Direction:

- audit current official SDK transport ownership before adding more resilience
  mechanisms;
- prefer deleting redundant layers over tuning four keepalive systems;
- preserve only behavior required by actually supported clients.

## P1.7 — Protocol/session architecture has migration risk

Current dependency is pinned to the 1.x MCP TypeScript SDK line. Protocol and SDK
transport guidance continues to evolve.

This review does **not** authorize an immediate protocol rewrite. It records a
risk:

> Do not invest further in custom session machinery until current official SDK
> and protocol guidance is re-audited and the compatibility targets are written
> down.

The right stabilization decision may be to keep part of the existing transport,
or to simplify it; that must be decided from current primary-source evidence and
supported clients, not from sunk cost.

## P1.8 — Home-grown HTTP parsing creates product-irrelevant liability

Location:

```text
mcp/server/net.ts
```

The plugin manually owns header parsing, Content-Length framing, buffering,
response serialization, keep-alive, and SSE forwarding.

The audited code did not establish a product reason to own a general HTTP parser.
It also expands the number of request-size, malformed-request, streaming, and
security cases BlockIT must maintain.

Direction:

- classify this as infrastructure debt;
- prefer official/runtime HTTP ownership where compatible with Blockbench
  constraints.

## P1.9 — `experimental` status does not reduce public MCP exposure

`stable` / `experimental` are stored for local UI/docs filtering, but the
registration path does not use status to disable or gate tools.

Impact:

- calling a capability “experimental” can feel like meaningful isolation while
  clients still receive the same tool;
- the default AI toolset remains broad.

Direction:

- define actual enable/disable/capability gating separately from documentation
  labels.

## P1.10 — Progress abstraction is currently dead

Location:

```text
mcp/lib/factories.ts
```

Factory supplies a no-op `reportProgress` implementation while some older tools
still call it.

Direction:

- remove dead progress plumbing unless real progress notification support is a
  current product requirement;
- do not maintain pseudo-capabilities.

## P1.11 — Tool result contracts are inconsistent

Across tools, results may be:

- plain prose strings;
- JSON serialized into text;
- MCP image content;
- newer `content + structuredContent` objects.

`ToolDefinition` even reserves `outputSchema`, but it is not part of the current
registration flow.

Impact:

- clients/agents must infer whether text should be parsed as JSON;
- inspection/readback tools cannot rely on one stable result pattern;
- public contract is harder to test.

Direction:

- define a small structured-result convention for core tools;
- do not convert every legacy fallback tool until its continued exposure is
  justified.

## P1.12 — Resolver ownership is duplicated and inconsistent

Locations:

```text
mcp/lib/util.ts
mcp/server/tools/texture.ts
mcp/server/tools/cubes.ts
mcp/server/tools/element*.ts
mcp/server/tools/animation.ts
mcp/server/tools/armature.ts
```

Legacy helpers often use first matching UUID/name. Newer hardened tools use
UUID-first and reject ambiguous names.

Texture hardening has also produced many near-identical local resolver functions
for different texture operations.

Impact:

- two identity standards coexist;
- caller-by-caller hardening multiplies code instead of fixing the ownership
  boundary;
- bug fixes can diverge across resolvers.

Direction:

- consolidate only after caller semantics are audited;
- one resolver should own one identity contract instead of cloning the same
  lookup logic per tool.

## P1.13 — UI automation should be an escape hatch, not a peer workflow

Location:

```text
mcp/server/tools/ui.ts
```

Capabilities include:

- generic Blockbench action triggering;
- optional automatic dialog confirmation (currently default true);
- screen-coordinate clicking/dragging;
- generic dialog filling;
- arbitrary eval.

These are inherently less deterministic than purpose-built modelling tools.

Direction:

- keep only as explicit fallback/debug mode;
- default Bedrock Entity modelling should prefer semantic tools (`place_cube`,
  `inspect_element`, Animation tools, etc.).

---

# P2 — Maintenance / Consistency Debt

## P2.1 — Paint surface is much larger than the proven product need

Location:

```text
mcp/server/tools/paint.ts
```

It includes fill, shapes, gradients, color picker, clone brush, eraser, global
settings, free brush paths, presets, texture selection, and layer management.

Many legacy paths change global editor state and do not use the newer uniform
try/cancel/recover lifecycle.

Direction:

- keep high-value Texture outcomes, not every editor gesture, unless a reference
  workflow proves the operation is necessary;
- do not reopen Texture merely to perfect auxiliary tools.

## P2.2 — `mcp_instructions` setting appears disconnected

Location:

```text
mcp/ui/settings.ts
mcp/server/server.ts
```

UI exposes an `mcp_instructions` setting, but audited server creation only uses
name/version and did not show that setting becoming server instructions.

Direction:

- either wire it to a real public contract with proof or remove the misleading
  setting.

## P2.3 — Texture resource can duplicate heavy image source data

Location:

```text
mcp/server/resources.ts
```

Texture resource metadata includes `source`, which may carry embedded image/data
content. A dedicated `get_texture` MCP image tool already exists.

Direction:

- keep resources lightweight metadata-oriented;
- avoid duplicating large binary/base64 surfaces into general resource reads.

## P2.4 — Project resources expose local paths

`projects://` resource includes save/export paths. In a deliberately local,
trusted-only server that may be acceptable, but it amplifies the P0 network
exposure problem.

Direction:

- revisit only after the local trust boundary is fixed;
- do not expose path data by accident to non-local clients.

## P2.5 — Generic `create_project` remains broader than the primary product

Current `create_project` accepts a generic Blockbench format ID string and looks
up `Formats[format]` at runtime.

Direction:

- decide whether generic format creation remains a compatibility/fallback
  capability;
- make Bedrock Entity the explicit normal product path rather than relying only
  on a default string.

## P2.6 — Same-domain numeric validation is inconsistent

Example:

- new `place_cube` has finite vector validation;
- portions of legacy `modify_cube` still use generic `z.number()` vectors.

This shows why per-tool hardening should follow foundation stabilization rather
than continue indefinitely.

## P2.7 — Animation still has residual gaps, but they are no longer the active priority

Recent Animation work is worth keeping, but remaining known issues include:

- parked `animation_timeline.select_range` multi-selection lifecycle bug;
- shared `timeRangeSchema` still weak for other callers;
- shared `keyframeDataSchema` still broadly permissive;
- graph-editor custom values/ranges need a separate audit;
- batch pattern/range/time-offset semantics need a separate audit;
- copy/paste continues to depend on implicit clipboard/runtime state;
- live playback, Undo/Redo, save/reopen remain local proof.

These are valid follow-ups **after** P0/P1 stabilization, not justification for
continuing micro-hardening now.

---

# False-Confidence Ledger

The audit found several places where code appearance currently overstates the
proved quality of the system.

| Appears true | What source actually proves |
|---|---|
| Safety annotations are implemented | Metadata is stored, but current registration omits it. |
| `.refine()` means MCP rejects invalid cross-field input | Factory unwrapping can strip top-level ZodEffects. |
| `strict: true` means normal build is typechecked | Current build is Bun bundling; no normal typecheck gate is defined. |
| A large GitHub Actions workflow means CI protects Local | Workflow is nested under `mcp/.github/workflows` in the monorepo and no root gate was proved. |
| Generated API docs are authoritative | Checked-in API JSON is stale and contradicts current Cube schema. |
| `experimental` isolates risky tools | Status is mainly metadata/UI filtering; tools remain registered. |
| `risky_eval` has a safety filter | Regex restrictions are not a sandbox. |
| Generic Undo around eval/actions means recoverable | Arbitrary side effects are not guaranteed to be represented by that Undo edit. |
| Log says server is on localhost | `listen(port)` is not an explicit loopback bind. |
| `mcp_instructions` setting configures MCP instructions | Audited server creation did not show it being consumed. |
| Progress is supported | Current tool context supplies a no-op progress reporter. |
| `from_geo_json` imports GeoJSON from path/data URL/URL | Execution feeds parsed JSON into Bedrock codec and only fetches http/https for external input. |

Rule created by this audit:

> **Do not treat an intention declared in schema/comments/UI metadata as a
> completed MCP feature until the actual registration/execution path proves it.**

---

# Strong Patterns Worth Keeping

The audit does **not** recommend throwing away recent work. The following source
patterns are substantially healthier and should guide stabilization:

## `place_cube`

Strengths:

- explicit finite geometry extents;
- no invented 1×1×1 default geometry;
- intentional pivot rule for non-zero rotation;
- deterministic parent/texture targeting.

## `modify_cubes_batch`

Strengths:

- explicit UUID targets;
- bounded batch size;
- all-target preflight;
- one coherent recoverable Undo unit;
- no claim of automatic visual judgement.

## `inspect_element`

Strengths:

- one narrow purpose;
- read-only;
- exact identity;
- structured result;
- does not claim visual correctness.

This is close to the desired MCP design style.

## `capture_model_views`

Strengths:

- deterministic labelled reference views;
- explicit front direction;
- offscreen capture that avoids changing the active editor camera;
- no fake similarity score/PASS claim.

## Recent `create_animation` / `inspect_animation`

Strengths:

- current Bedrock codec ownership;
- deterministic Group binding;
- rollback path;
- authored-space contract improvements;
- read-only authored transform/particle inspection;
- explicit local-proof boundary.

These improvements remain retained while feature work is frozen.

---

# Product-Surface Classification To Decide In The Stabilization Plan

This review records the provisional classification to be resolved in the next
planning artifact. It is **not yet a deletion commit**.

## Likely Core — Bedrock Entity

```text
Project orientation / create-open basics
Cube placement + correction
Group hierarchy / Cuboid rigging
Focused element inspection
Model bounds observation
Canonical model-view capture
Texture create/apply/read essentials
Animation create/mutate/read essentials
Undo/redo/history essentials
Bedrock export/save essentials
```

## Likely Format/Capability Gated

```text
Bedrock Block material instances
Hytale integration
Mesh modelling/editing
Mesh UV
Armature / vertex weights
advanced PBR/material utilities when format-relevant
```

## Likely Debug/Fallback Gated

```text
trigger_action
emulate_clicks
fill_dialog
risky_eval
generic import paths
broad generic export paths
```

## Strong Quarantine/Removal Candidates

```text
from_geo_json in its current contract
risky_eval as a Stable/default tool
dead progress plumbing
misleading/disconnected settings
stale generated docs as authoritative input
```

The stabilization plan must prove each classification from actual product use
and supported formats before implementation.

---

# Development Freeze Decision

Effective after this audit:

1. **Do not continue new MCP feature development.**
2. **Do not continue Animation micro-hardening by default**, including the known
   `select_range` lifecycle correction, until P0/P1 ordering is approved.
3. Geometry remains Cube/Cuboid-only.
4. Texture remains frozen unless a core Bedrock workflow proves a blocker.
5. Existing recent fidelity/Animation fixes remain in place; this is not a
   rollback request.
6. Do not begin a large refactor merely because the audit is broad.
7. The next artifact must convert findings into a small ordered reduction and
   stabilization plan with explicit keep/gate/fix/remove decisions.

## Missing Validation

This audit is primarily source/static evidence. The following still require
runtime/local proof later:

- actual network bind addresses on the target OS/runtime;
- actual MCP client view of tool annotations;
- actual SDK behavior after preserving full Zod schemas;
- MCP Inspector contract behavior;
- supported client compatibility after any transport reduction;
- live Blockbench mutation + Undo/Redo behavior;
- save/reopen continuation;
- reference-fidelity end-to-end workflow.

External protocol/toolchain assumptions must be rechecked against current
primary documentation immediately before implementation, especially MCP
transport/security/session guidance.

## Follow-up

The **only next planning step** is:

> Create an **MCP Reduction & Stabilization Plan (P0 → P2)** that turns this audit
> into an implementation order, defines the Bedrock Entity Core surface, and
> classifies every non-core family as keep, gate, quarantine, or remove.

The plan must not silently implement the fixes while being written.
