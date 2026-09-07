# Current Validation

Updated: 2026-09-07

This file owns **current proof interpretation**. Continuation belongs in `docs/knowledge/next-action.md`; stable facts in `CONTEXT.md`; source ownership in `docs/knowledge/implementation-map.md`; active asset continuity in `workspace/active/<project>/README.md`.

## Current Source Proof

Repository: `halokaryamedia-source/BuildIT`  
Branch: **`Local` only**.

Per `GITHUB_RULES.md`, device-independent source acceptance must use complete checks on the same exact `Local` SHA. The last full Repository Verify + MCP Verify composite closure remains `1c1f74e160ce520d53fda3a3f271d9323b28558b`.

GitHub **Repository Verify** run `34046872083` completed successfully for that exact SHA and executed the repository routing/policy verifier.

GitHub **MCP Verify** run `34046872042` completed successfully for the same exact SHA and executed `bun run verify:mcp`:

- runtime: **409 PASS / 0 FAIL** across 69 files;
- authoring: **120 PASS / 0 FAIL** across 26 files;
- generated docs/prompt freshness: PASS;
- TypeScript + Gateway typecheck: PASS;
- source surface measurements: PASS;
- build: PASS;
- build identity: `sha256:c208ec49344db79fa22e1cddd330e563f14319d4ed0c724408ee0ba0a01c969c`.

The same MCP run also produced exact-SHA provenance and uploaded `blockit-mcp-verified`:

- artifact ID: `9993371261`;
- artifact ZIP digest: `sha256:70cb1d126fe2bc9077d64b332f6d4e2715b6b14a93fe696b3493e776a0626fe3`;
- verified bundle SHA-256: `9896b8c25e293b7f33dc2ebf3119942809ec4df548839f4ac753366bc8521f87`;
- embedded build identity: `sha256:c208ec49344db79fa22e1cddd330e563f14319d4ed0c724408ee0ba0a01c969c`.

### Authoring-efficiency / Gateway REMOTE_GITHUB closure — ACCEPTED

The current authoring-efficiency GitHub partition is accepted at exact source SHA `f3f7f8062d8e2cfafe79a273443dee2ab2f2a145`.

GitHub **MCP Verify** run `34084250543` completed successfully on that exact SHA and executed `bun run verify:mcp`, including generated freshness, TypeScript + Gateway typecheck, runtime tests, `verify:authoring`, surface/phase measurements, and build. The run also completed exact-SHA provenance and verified bundle upload.

Verified artifact:

- name: `blockit-mcp-verified`;
- artifact ID: `10004673848`;
- artifact ZIP digest: `sha256:2adf4fa0f747fa1dd390b7bdeb2135403fda4e61d0023e2829d32fba6e43ac13`;
- verified bundle SHA-256: `46c821431ead51618fa7ef5fa3fe385e510fc344fa70e71c10413030473e355b`;
- embedded build identity: `sha256:8213f7e2e8bd6360d918394fa0ba7f9cdc96ec036ad38b58a4bfff4c78c49f41`;
- Bun: `1.3.14`.

This closure covers the current remote authoring-efficiency changes: compact Gateway continuation receipts for `manage_cubes`; bounded Gateway discovery default `4`; compact Gateway describe behavior and tools-only boundary; asset-authoring cwd/test-development firewall; and compact Texturing palette/cohort/anti-micro-loop guidance. It is **SOURCE/CI/build-artifact proof only**. It does not prove actual Astra/Codex allowance reduction, installed Runtime behavior, or visual texture quality.

The remaining proposed high-ROI Texturing optimizations alter Runtime Tool schemas/results and therefore require canonical `LOCAL_CODE` generation/verification before they can become source authority. Continuation owns that residue.

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

Dependency closure remains `LOCAL_CODE`: upgrade to a patched compatible SDK, regenerate canonical `bun.lock` with Bun, then run the owning source verifier. Do not hand-edit the lockfile and do not use Actions as an authoring path.

## Pending Live Sequence

After the SDK/local source closure and exact deployment, the generic MCP/native acceptance sequence is:

```text
shared AUTHORING
→ verify:geometry-live
→ verify:texturing-live
→ one real AUTHORING→Animation handoff/reconnect
→ verify:animation-live
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
