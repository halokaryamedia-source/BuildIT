# Next Action

Updated: 2026-09-06 — GitHub quality cross-check complete through request isolation.
Branch: **`Local` only**. Proof → `current-validation.md`.

## Status

- Integrated baseline `6b3779c` already has matching exact-SHA source proof; do not repeat it.
- Latest executable/source-affecting quality commit `1949aa9`: concurrent same-JSON-RPC-id isolation regression. MCP Verify `34039585699` PASS: 403 runtime + 117 authoring tests; docs/typechecks/measurements/build PASS.
- CI build identity remains `sha256:c208ec49344db79fa22e1cddd330e563f14319d4ed0c724408ee0ba0a01c969c`; exact merged installed identity is unverified.
- SDK lock is 1.25.3. Request-owned server/transport isolation is regression-protected; patched dependency upgrade (>=1.26.0) still requires `LOCAL_CODE` for canonical Bun lockfile generation.
- Lift Geometry/Texture/Animation APPROVED; preserve `workspace/active/lift/lift.bbmodel`.
- AUTHORING TAXONOMY: user-selected `DIRECT | 3D_ASSISTED`; four-tool Gateway + shared AUTHORING retained.
- 3D_ASSISTED: `SOURCE_READY`; GPU/native acceptance deferred.
- LEGACY UI FALLBACKS: debug/maintenance only.

## Next

1. **LOCAL_CODE:** upgrade `@modelcontextprotocol/sdk` to patched compatible >=1.26.0, regenerate `bun.lock` canonically, run the owning MCP verifier. Never hand-edit the lockfile or use Actions to author it.
2. **LIVE_BLOCKBENCH:** deploy/reload exact merged build and confirm `build_identity`; on a disposable lift copy verify Painter RGBA/clip/target/Undo, 16x native UV packing + pixel preservation, timeline A while B selected + playback/Undo, and native save/reopen.
3. Compare the same reference/views and facade-left pair. Only after quality PASS, measure active time, corrections, failed/no-effect calls, unnecessary rereads and available usage. Historical token totals remain UNKNOWN.
4. Finish DIRECT audit at Blockbench, not Minecraft. Do not modify the approved lift main checkpoint for system testing.

3D_ASSISTED GPU work remains deferred; reuse `mcp/scripts/three-d-assisted/README.md` only when explicitly resumed. No automatic strategy switch.
