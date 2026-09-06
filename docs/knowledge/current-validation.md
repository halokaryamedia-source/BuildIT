# Current Validation

Updated: 2026-09-06

This file owns **current proof interpretation**. Continuation belongs in `docs/knowledge/next-action.md`; stable facts in `CONTEXT.md`; source ownership in `docs/knowledge/implementation-map.md`; active asset continuity in `workspace/active/<project>/README.md`.

## Current Authority

Repository: `halokaryamedia-source/BuildIT`  
Branch: **`Local` only**.

The latest executable/source-affecting quality commit is `1949aa9065f60f817e97fa2d0ba081c3ecd1ac80` (`test(mcp): lock request isolation against SDK advisory`). Later documentation-only synchronization may advance `Local` without invalidating that source proof.

Integrated source baseline `6b3779cc0d3e3f7806699721196e484931075e8e` merged the DIRECT authoring audit with the remote TCP/brush/export repairs. Exact-SHA GitHub proof completed successfully: Repository Verify, Authoring Policy Verify and MCP Verify. The integrated baseline recorded **32 repository + 402 runtime + 117 authoring = 551 tests**, with generated docs/prompt freshness, typechecks, source surface measurements and build passing. Build identity: `sha256:c208ec49344db79fa22e1cddd330e563f14319d4ed0c724408ee0ba0a01c969c`.

Exact-SHA MCP Verify run `34039585699` for `1949aa9` completed successfully and executed `bun run verify:mcp`: **403 runtime + 117 authoring tests PASS**, generated docs fresh, typechecks PASS, source surface measurements PASS and build PASS. The build identity stayed `sha256:c208ec49344db79fa22e1cddd330e563f14319d4ed0c724408ee0ba0a01c969c`, as expected for a regression-test-only change.

This is **source/CI proof only**. It does not prove that the merged build is installed/reloaded in Blockbench, nor native Undo/playback/persistence or visual quality.

## SDK Security Follow-up

Current `mcp/bun.lock` resolves `@modelcontextprotocol/sdk` **1.25.3**. Advisory `GHSA-345p-7cg4-v4c7` / `CVE-2026-25536` covers the affected SDK line through 1.25.3 and is patched in 1.26.0.

BlockIT's current transport owner creates a **request-owned `McpServer` and request-owned `WebStandardStreamableHTTPServerTransport`** instead of sharing either object across clients. Regression `mcp/tests/p1-stateless-sdk-sequence.test.ts` now proves that two concurrent requests using the same JSON-RPC id remain isolated; exact-SHA CI PASS is recorded above.

This architecture/regression evidence does **not** erase the vulnerable dependency version. Dependency closure remains **LOCAL_CODE REQUIRED**: upgrade `@modelcontextprotocol/sdk` to a patched compatible version (minimum 1.26.0), regenerate the canonical Bun lockfile in a Bun-capable checkout, then run the owning source verifier. Do not hand-edit `bun.lock` and do not use Actions as a lockfile authoring path.

## Laporan issue dan pemborosan — lift DIRECT

`workspace/active/lift/README.md` is the active-asset owner. Lift Geometry, UV Layout, Texture and Animation are approved/delivered; the main `lift.bbmodel` must be preserved. Approval is not a claim of perfect texture fidelity.

| ID | GitHub/source status | Remaining acceptance |
|---|---|---|
| LIFT-01 | Reference-grounded landmark/count/opening workflow updated and regression-protected | **LIVE QUALITY REQUIRED** — confirm the workflow produces better strict view agreement on a disposable fixture |
| LIFT-02 | Intake rule fixed: Better/HD does not silently change density, resolution or style | Historical reasoning failure recorded; no source defect remains |
| LIFT-03 | Reference-derived palette/ramp, adjoining-pair-first workflow and causal repaint discipline are source-protected | **LIVE VISUAL REQUIRED** — prove color/form/shadow quality improves on comparable views |
| LIFT-04 | Surface-continuity/seam discipline is source-protected | **LIVE VISUAL REQUIRED** — prove thick/double seam behavior is absent on the fixture |
| LIFT-05 | UV union occupancy/bounds metrics are implemented and regression PASS | **LIVE NATIVE REQUIRED** — 512x512 feasibility with required padding/pixel preservation remains unproven |
| LIFT-06 | Sub-unit Box-UV preflight/per-face fallback guidance is source-protected | **LIVE NATIVE REQUIRED** — verify native UV behavior without changing approved geometry merely to silence warnings |
| LIFT-07 | Explicit animation target/select/affected-UUID behavior has executor regression PASS | **LIVE NATIVE REQUIRED** — timeline A while B selected, playback and Undo |
| LIFT-08 | Proof vocabulary separates tool/source success from visual PASS and user approval | Visual gate remains mandatory; no new source defect proven |
| LIFT-09 | Reuse receipts/state, bounded evidence and compact readback guidance are source-protected | **MEASUREMENT REQUIRED** — savings require same-fixture Cost to Accepted Result data |
| LIFT-10 | Current proof and continuation are synchronized against exact source/CI evidence and the active lift owner | Keep future status in canonical owners; do not reconstruct from chat history |

No additional LIFT implementation change is justified from GitHub evidence alone. Adding more runtime logic without reproducing a source defect would be speculative and would exceed the current proof ceiling.

## Current Live Evidence Boundary

Historical local desktop evidence exists for earlier builds: Blockbench 5.1.6, Gateway restart/handoff behavior, disposable native template/brush Undo/Redo, and surface-gap verification were previously exercised successfully. That evidence remains useful historical capability proof, but it **cannot be promoted to the current merged build**.

For the current integrated source:

- CI build identity is `sha256:c208ec49344db79fa22e1cddd330e563f14319d4ed0c724408ee0ba0a01c969c`.
- The pre-merge installed candidate was `sha256:e5f70645919f989d071ece5ceccc021d09a4ba20ac2cedac589c1b824fe5acb9`.
- The last previously observed live runtime identity was `sha256:ed62edfdf0e0674fc4808b9f84d30253608f2b1f1e1922e7e3457a454977046c`.
- Therefore exact merged installed identity remains **UNVERIFIED**.

## Pending `LIVE_BLOCKBENCH`

Use a disposable copy of the committed lift; do not mutate `workspace/active/lift/lift.bbmodel` for system acceptance.

1. Confirm live `build_identity` equals the merged build identity above.
2. Verify Painter RGBA/coordinates/clipping/explicit target and native Undo.
3. Verify native 16x UV repack, padding, per-face pixel preservation, Undo and smallest proven atlas size; 512 fit is not assumed.
4. Verify explicit Animation A while B is selected, plus native playback and Undo.
5. Save and native-reopen the disposable project.
6. Compare facade + left adjoining surfaces against the actual approved reference at comparable view/scale.
7. Only after quality PASS, measure active time, correction rounds, failed/no-effect calls, unnecessary rereads and available usage.

No Minecraft acceptance is required for this audit. 3D_ASSISTED GPU inference/materializer native proof remains deferred unless explicitly resumed.

## Visual / Reference Proof Rule

A visual/reference `PASS` requires the **actual approved reference image** plus **fresh evidence** from the current model/revision at a comparable view/scale. Tool success, source/CI success, hashes, coordinates, export, scalar metrics, UV occupancy or a clean structural diagnostic cannot create visual PASS by themselves.

If corresponding live evidence is unavailable, report `UNVERIFIED` or `LOCAL PROOF REQUIRED` rather than upgrading the claim.

## Authoring Efficiency

**Authoring Efficiency** means **Cost to Accepted Result**. Static Footprint, raw call count and smaller payloads are guardrails only. Efficiency improves only when accepted quality is preserved while avoidable discovery, readback, phase bouncing, retries, recovery or correction cost decreases on a comparable fixture.

## 3D-Assisted Proof Boundary

AUTHORING TAXONOMY remains user-selected `DIRECT | 3D_ASSISTED`. 3D_ASSISTED source/orchestration and environment preparation are `SOURCE_READY`; GPU inference quality, installed materializer identity, native materializer Undo/stale-state behavior and end-to-end asset quality remain deferred/unproven. Source/static/CI proof never upgrades those live claims.
