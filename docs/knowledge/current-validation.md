# Current Validation

Updated: 2026-09-09

This file owns **current proof interpretation**. Continuation belongs in `docs/knowledge/next-action.md`; stable facts in `CONTEXT.md`; source ownership in `docs/knowledge/implementation-map.md`; active asset continuity in `workspace/active/<project>/README.md`.

## Current Source Proof

Repository: `halokaryamedia-source/BuildIT`  
Branch: **`Local` only**.

Per `GITHUB_RULES.md`, device-independent composite acceptance requires Repository Verify + MCP Verify on the same exact `Local` SHA. Exact-SHA source/CI proof below is reusable only within its stated proof ceiling and does not establish `LOCAL_CODE` or `LIVE_BLOCKBENCH` claims. Documentation-only commits after the accepted SHA do not upgrade or invalidate that executable proof.

### Current LOCAL_CODE candidate

Working checkout: `D:/Work/AI Stuff/BuildIT-refresh`, based on `adcb0d64f8450810cb24ffa425a8f9713ee6564f`.
Bun 1.3.14; SDK 1.30.0. Initial `verify:closure` PASS; final `verify:full` PASS locally on the complete native-fix/harness candidate: 35 repository, 621 runtime, 153 authoring tests; generated freshness, both typechecks, loopback surface checks, and build PASS. Final gate log: `mcp/.verify-native-final.log`.
Source surface: 56 callable / 49 AUTHORING / 20 Animation; four Gateway tools; 68 documented source ToolSpecs and 10 resources.
SDK-boundary regression proves 33 valid keyframes, strict invalid-input rejection, selected-branch required/nested structure and Animation/Particle ToolSpec parity.
Installed package: `f1dcb77e8db800b4307feedba199fe8fff37b720`; ZIP SHA256 `531a18acf1e0aff2484584b32fbfad41679c044f7d8a38e5a18d32fdad5fcf8b`. Runtime identity: `sha256:dff7fc084d883922754d1d7470feac31c339176641d37cdd131d0c50384bbb01`. Host plugin: `%LOCALAPPDATA%/BlockIT/plugin/blockit_mcp.js`; workspace: `%USERPROFILE%/BlockIT-Workspace`. User removed the old native plugin.
Native PASS: Geometry mutation/Undo/Redo/thin per-face UV; shared AUTHORING Texturing alpha/repack/clipping/target isolation/history; installed compiled four-tool Gateway and Animation handoff; explicit animation targeting/playback/history; Particle create/patch/save/preview; verified .bbmodel save, native close/reopen and state comparison.
Live findings fixed: exact-pixel writes now clear only destination pixels before RGBA fill; native Windows realpath resolves MSIX logical/physical installation aliases. Harness fixtures avoid premultiplied-alpha RGB rounding, seed an opaque outside-clip sentinel and send explicit phase-affinity headers. Native test consent is disposable-fixture authorization, not asset visual approval.
Managed PASS: compiled repeated install, active-Gateway staging/activation, recovery and initial-install rollback in disposable paths; actual active-Runtime staging `477061`→`76a572d9`; installed `f1dcb77e` rollback to `76a572d9`, native startup, then restoration of `f1dcb77e`. The latter two packages intentionally share the same Runtime identity; their manager source SHAs differ. Wrapper status is healthy and no pending update remains. User checkpoint SHA256 remained `bf334a6859e0ed105bf42dde676c5b5c9a66427644b1c973b13f35a79ae374d1`.
Evidence logs are local ignored `mcp/.geometry-live-final.log`, `.texturing-live-final.log`, `.gateway-native.log`, `.animation-live.log`, `.particle-live.log`, `.persistence-prepare.log`, `.persistence-verify.log`, `.package-path-fix.log`. Source-only harness edits after the package SHA do not change installed executable identity.
Remaining: actual fresh Codex session pickup of managed workspace instructions/skills. Technical acceptance does not establish visual quality, user asset approval, Minecraft execution or usage savings.

### Prior REMOTE_GITHUB hardening — historical accepted baseline

The earlier executable/source closure was accepted at exact `Local` SHA `9be8d7e00a78ea7383d70c3988902fff62bdd360`.

GitHub **Repository Verify** run `34346382752` completed successfully for that SHA.

GitHub **MCP Verify** run `34346382820` completed successfully for the same SHA and executed the canonical MCP gate: generated docs/prompt freshness, TypeScript + Gateway typecheck, Runtime tests, authoring tests, source/phase surface measurements, build/provenance generation, and verified bundle upload.

That remote baseline had:

```text
Gateway client surface   4 fixed tools
Runtime callable union   54 tools
AUTHORING surface        49 tools
Animation surface        18 tools
```

Pre-local closure now additionally protects:

- every enabled default capability has one registration family, an executable Runtime definition, and at least one semantic phase surface;
- current Runtime augmentation fields remain attached to their canonical capabilities rather than becoming parallel tools;
- `paint_texture_transaction` is the only explicitly bounded enabled Runtime capability still outside the current generated ToolSpec manifest;
- Particle production exposure is fail-closed as an all-or-nothing contract across Runtime registration, enablement, Animation exposure, generated ToolSpec ownership, and `particle-reference` registration;
- the future public Particle path is asset-only: create/patch/save/native preview remain in `manage_particle`, while client-entity/gameplay binding is downstream integration owned by existing animation/controller infrastructure;
- the live Particle harness is source-prepared around create/patch/save/preview + readback rather than client-entity mutation;
- the four semantic authoring skills read by executable MCP contract tests are explicit `MCP Verify` trigger dependencies, with repository regression protecting that coverage;
- routed phase-scoped tool discovery remains the intended fallback model; the existing discovery evaluation stays inside `test:runtime`, avoiding a duplicate verification pass.

The discovery proxy on this closure reports routed phase-scoped Top-3 and Top-8 recall of **1.0**; Animation Top-1 is **1.0**. These are static/spec-loading proxies, not installed Astra/Codex usage proof.

Verified artifact from MCP Verify:

- name: `blockit-mcp-verified`;
- artifact ID: `10101875068`;
- artifact ZIP digest: `sha256:feb8f4f77525d85a0351da700ce3f210a3d5ec266742e8736e8946e7ef02411a`.

This is **SOURCE/CI/build-artifact proof only**. It does not prove installed Blockbench behavior, native Undo/playback/persistence, visual fidelity, GPU inference quality, or actual Astra/Codex allowance reduction.

Remaining source work is intentionally narrow and belongs to `LOCAL_CODE`: Particle production exposure plus its generator-coupled public-contract/docs closure, current generated ToolSpec alignment (including `paint_texture_transaction` and any import-safe Runtime augmentation parity needed by the generator), then the separate MCP SDK dependency closure. `next-action.md` owns the exact continuation.

No additional speculative Runtime framework or routing layer is justified by the final remote sweep. The accepted closure keeps the established four-tool Gateway and bounded semantic specialist routing.

## Live Acceptance Harness — SOURCE_READY / LIVE NOT_RUN

The GitHub-prepared harness moves test design, fixtures, assertions and evidence capture out of the later desktop session. The product target is generic BlockIT MCP/authoring behavior; any named model is only test media unless a task explicitly targets that asset.

### Shared preflight

`mcp/scripts/live-e2e-common.ts` requires:
- exact built-vs-live `build_identity`;
- expected authoring phase and required live `tools/list` surface;
- stateless JSON transport;
- explicit `--confirm-disposable`;
- observable HTTP/RPC/tool/cost counters. These byte counts are transport measurements, not model-token counts.

### Geometry + UV representation

`verify:geometry-live` now uses the current consolidated `manage_cubes` + `inspect_elements` surface. It creates one disposable body, proves readback/render/update/Undo/Redo, and creates a generic thin fixture `1 x 4 x 0.5` with explicit `per_face` UV. The thin fixture must keep exact geometry size and non-degenerate per-face UV; no geometry thickening is allowed merely to silence UV warnings.

### Texturing / native repack / Painter

`verify:texturing-live` continues the **same shared AUTHORING session**; there is no Geometry→Texturing phase bounce. It is scripted to prove:

- native template at 16x;
- padded native in-place repack with same texture UUID;
- semantic RGBA pixel preservation across repack;
- thin per-face fixture survives template/repack/Undo/Redo without geometry thickening or meaningful-face collapse;
- explicit target mutation while a decoy texture is selected;
- size-2 request uses native Painter, not the size-1 exact-pixel shortcut;
- bounded `draw_shape_tool` does not bleed outside its reported clip;
- atlas + UV state restore exactly through Undo/Redo;
- final UV production gate remains ready.

These are native-behavior acceptance assertions; they are not texture visual-fidelity claims.

### Animation

`verify:animation-live` prepares two animations so B is selected while operations explicitly target A. It is scripted to prove:

- persistent Animation-A property edit does not mutate/select B;
- targeted set-time/play/pause/stop acts on A;
- targeted A keyframe edit leaves B unchanged;
- property and keyframe Undo/Redo restore exact expected state.

This closes the manual-selection workaround at the test level once the live run passes; motion aesthetics remain separate.

### Particle

`verify:particle-live` is already source-prepared but must not run until the LOCAL_CODE Particle public exposure/generator closure is complete and the exact deployed Runtime advertises both `inspect_particle` and `manage_particle` on the Animation surface. Its prepared success path is create/patch/save/native preview + readback; it does not author client-entity integration.

### Native persistence

`verify:persistence-live` is intentionally two-step rather than inventing an open-project fallback.

1. `--prepare`: snapshot body, thin per-face UV, texture/UV gate and both animation states; export a verified disposable `.bbmodel`; hash artifact + write manifest.
2. One manual Blockbench close/reopen of that exact file.
3. `--verify`: require matching build, artifact hash, native `save_path` and exact authored snapshot.

Until step 3 succeeds, native reopen remains UNVERIFIED.

### Representative visual-quality fixture — current example: LIFT

LIFT is **only a representative fixture** for validating the visual-quality/evidence workflow and historical issue closure. It is not a product target and must not create LIFT-specific MCP Runtime, tool schema, routing, packing law, geometry rule, or authoring policy.

`verify:lift-quality-live` remains a bounded **fixture-specific evidence candidate**, not a visual scorer and not a generic MCP acceptance prerequisite.

- requires `BLOCKIT_LIFT_DISPOSABLE_PATH` and rejects canonical `workspace/active/lift/lift.bbmodel`;
- hashes `references/approved-reference.png` and `references/window-detail.png`;
- captures before front/left/front-left-3Q + atlas;
- performs one native 16x, padded, power-of-two in-place repack candidate on the disposable copy;
- records candidate bitmap size and whether native result is `<=512`;
- captures candidate views + atlas;
- Undo must restore the exact original atlas hash and UV packing/gate;
- writes a manifest under `.cache/lift-quality-live/`;
- emits `visual_quality: UNVERIFIED`.

A `<=512` result is only a packing candidate. It cannot become visual PASS without the actual reference plus fresh mapped visual evidence.

## Historical LIFT Issue Mapping — fixture evidence only

`workspace/active/lift/README.md` remains the asset owner. Geometry, UV Layout, Texture and Animation are approved/delivered; any quality-system testing uses a disposable copy. The table below preserves traceability for the historical test report; it is **not** the generic MCP roadmap or acceptance checklist.

| ID | GitHub-prepared closure | Remaining proof |
|---|---|---|
| LIFT-01 | Reference-grounded workflow + representative before/candidate comparable capture are scripted | actual-reference visual review on the fixture |
| LIFT-02 | Better/HD intake rule source-protected | no source defect remains |
| LIFT-03 | palette/ramp + adjoining-surface discipline protected; fixture capture bundle prepared | live visual color/form/shadow review on the fixture |
| LIFT-04 | surface-continuity/seam discipline protected; same evidence bundle prepared | live visual seam review on the fixture |
| LIFT-05 | union/bounds metrics + native padded-repack candidate harness prepared | run representative candidate; `<=512` alone is not visual PASS |
| LIFT-06 | generic thin sub-unit per-face fixture scripted through native template/repack/history/persistence | live generic run |
| LIFT-07 | explicit A-vs-selected-B + playback/property/keyframe history harness prepared | live generic run |
| LIFT-08 | proof vocabulary remains fail-closed | visual gate stays mandatory |
| LIFT-09 | every live harness emits comparable execution-cost counters | comparable-fixture Cost to Accepted Result after quality PASS |
| LIFT-10 | proof/continuation route to executable test commands | keep future status in canonical owners |

No additional speculative Runtime logic is justified unless a generic live verifier or representative fixture reproduces a concrete MCP/source defect.

## SDK Security Follow-up

Current `mcp/bun.lock` resolves `@modelcontextprotocol/sdk` **1.25.3**. `GHSA-345p-7cg4-v4c7` / `CVE-2026-25536` is patched in 1.26.0.

BlockIT currently uses request-owned server/transport objects and has exact-SHA CI regression for concurrent same-ID request isolation. That mitigation evidence does **not** make the dependency version patched.

Dependency closure remains `LOCAL_CODE`: upgrade within a compatible maintained patched **v1.x** line, regenerate canonical `bun.lock` with pinned Bun, then run the owning source verifier. Do not hand-edit the lockfile, migrate protocol major version as part of this security fix, or use Actions as an authoring path.

## Pending Local / Live Sequence

Local source closure should remain ordered and diagnostic:

```text
Particle + generated public-contract closure
→ bun run verify:full
→ SDK v1.x security upgrade + bun.lock regeneration
→ bun run verify:full
→ exact build/deploy
```

After that, the generic MCP/native acceptance sequence is:

```text
shared AUTHORING
→ verify:geometry-live
→ verify:texturing-live
→ one real AUTHORING→Animation handoff/reconnect
→ verify:animation-live
→ verify:particle-live
→ verify:persistence-live --prepare
→ one native close/reopen
→ verify:persistence-live --verify
```

Only when validating the visual-quality/efficiency workflow or the historical LIFT issue report, append the representative-fixture step:

```text
disposable LIFT fixture → verify:lift-quality-live
→ human/multimodal strict visual review
→ only then comparable-fixture efficiency analysis
```

This intentionally removes redundant Geometry↔Texturing reloads and manual test design while keeping fixture-specific evidence outside generic product semantics.

## Visual / Reference Proof Rule

A visual/reference `PASS` requires the **actual approved reference image** plus **fresh evidence** from the current model/revision at a comparable view/scale. Tool success, source/CI success, hashes, coordinates, export, scalar metrics, UV occupancy, native repack success, or a clean structural diagnostic cannot create visual PASS by themselves.

If corresponding live evidence is unavailable, report `UNVERIFIED` or `LOCAL PROOF REQUIRED`.

## Authoring Efficiency

**Authoring Efficiency** means **Cost to Accepted Result**. Static Footprint, raw call count and transport bytes are guardrails only. Efficiency improves only when accepted quality is preserved while avoidable discovery, readback, phase bouncing, retries, recovery or correction cost decreases on a comparable fixture.

## 3D-Assisted Proof Boundary

AUTHORING TAXONOMY remains user-selected `DIRECT | 3D_ASSISTED`. 3D_ASSISTED source/orchestration and environment preparation remain `SOURCE_READY`; GPU inference quality, installed materializer identity, native materializer Undo/stale-state behavior and end-to-end asset quality remain deferred unless explicitly resumed. Source/static/CI proof never upgrades those live claims.

## Historical Generic Quality-First Closure

The generic quality-first authoring contract was source/static accepted at exact `Local` SHA `8e2a54f3016f744e3cd1bedef27379bdb07c3885` with Authoring Policy Verify run `34119139741`. It remains historical proof beneath the current pre-local closure, not the active continuation baseline.

The detailed 2026-09-07 multi-model DIRECT usage audit remains historical evidence only: `Experimental/authoring-usage-audit-2026-09-07.md`. Each defect must be reproduced against current source before it is treated as current.
