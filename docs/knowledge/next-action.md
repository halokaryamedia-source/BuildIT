# Next Action

Updated: 2026-09-06 — GitHub quality cross-check complete through request-isolation regression.
Branch: **`Local` only**. Proof → `current-validation.md`.

## Status

- Continue from GitHub as requested; branch `Local` does not mean working on the local PC. Do not promote to `main`.
- Integrated source baseline `6b3779c` already has matching exact-SHA source proof; do **not** repeat the integration audit.
- Latest executable/source-affecting quality commit: `1949aa9` — concurrent same-JSON-RPC-id request isolation regression. Exact-SHA MCP Verify run `34039585699` PASS: 403 runtime + 117 authoring tests, docs/typechecks/measurements/build PASS.
- Current CI build identity remains `sha256:c208ec49344db79fa22e1cddd330e563f14319d4ed0c724408ee0ba0a01c969c`; merged installed identity is still unverified.
- `@modelcontextprotocol/sdk` lock remains 1.25.3. Current request-owned server/transport architecture has regression proof against cross-client response mixing, but dependency upgrade to patched >=1.26.0 still requires `LOCAL_CODE` so the Bun lockfile is canonically regenerated.
- Lift Geometry/Texture/Animation APPROVED; preserve `workspace/active/lift/lift.bbmodel`. Acceptance is not perfect fidelity proof.
- AUTHORING TAXONOMY: user-selected `DIRECT | 3D_ASSISTED`. Four-tool Gateway and shared AUTHORING retained.
- 3D_ASSISTED: `SOURCE_READY`; environment prepared, GPU/native acceptance deferred.
- LEGACY UI FALLBACKS: debug/maintenance only.

## Next

1. **LOCAL_CODE dependency closure:** in an exact `Local` Bun-capable checkout, upgrade `@modelcontextprotocol/sdk` to a patched compatible version (minimum 1.26.0), regenerate `bun.lock` canonically, and run the owning MCP verifier. Do not hand-edit the lockfile and do not use Actions to author it.
2. **LIVE_BLOCKBENCH DIRECT acceptance:** deploy/reload the exact merged build and confirm `build_identity`; use a disposable lift copy for Painter RGBA/clip/target/Undo, 16x native UV packing/pixel preservation, timeline A while B selected + playback/Undo, and save/native reopen.
3. **Quality + efficiency proof:** compare the same reference/views and adjoining facade-left pair at comparable scale. Only after quality PASS, record active time, correction rounds, failed/no-effect calls, unnecessary rereads and available usage. Historical token totals remain UNKNOWN.
4. Finish this DIRECT audit at Blockbench, not Minecraft. Do not modify the approved lift main checkpoint for system testing.

3D_ASSISTED GPU work remains deferred; reuse `mcp/scripts/three-d-assisted/README.md` only when explicitly resumed. No repeated setup or automatic strategy switch.
