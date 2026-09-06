# Next Action

Updated: 2026-09-06 — live acceptance harness prepared in GitHub; local work should execute it, not redesign it.
Branch: **`Local` only**. Proof → `current-validation.md`.

## Status

- LIVE ACCEPTANCE HARNESS: **SOURCE_READY / LIVE NOT_RUN**.
- Exact source gate: `ce8e3dba9a61c73f42ac8cff4b18823030862031`; MCP Verify run `34042901846` PASS: 407 runtime + 117 authoring; generated freshness, typechecks, measurements and build PASS.
- Lift is delivered/approved; preserve `workspace/active/lift/lift.bbmodel`. Quality audit uses disposable copies only.
- `@modelcontextprotocol/sdk` 1.25.3 remains a `LOCAL_CODE` dependency closure; patched compatible target is >=1.26.0 and `bun.lock` must be generated canonically.
- AUTHORING TAXONOMY: user-selected `DIRECT | 3D_ASSISTED`.
- 3D_ASSISTED: SOURCE_READY; GPU/native quality deferred unless explicitly resumed.
- LEGACY UI FALLBACKS: debug/maintenance only.

## Next

1. `LOCAL_CODE`: upgrade MCP SDK to a patched compatible version, regenerate `bun.lock`, run the owning source verifier. This is the only remaining local source-authoring step.
2. Deploy the exact built plugin. In one shared AUTHORING session run:
   - `bun run verify:geometry-live -- --confirm-disposable`
   - `bun run verify:texturing-live -- --confirm-disposable`
   These cover current consolidated tools, thin per-face UV without geometry thickening, native 16x template/repack, semantic pixel preservation, Painter target/clip, and Undo/Redo.
3. Perform only the real AUTHORING→Animation handoff with clearly synthetic disposable-test readiness; reconnect once. Run `bun run verify:animation-live -- --confirm-disposable`.
4. Persistence: run `bun run verify:persistence-live -- --prepare --confirm-disposable`, close/reopen the exported disposable `.bbmodel` once in Blockbench, then run the same command with `--verify`.
5. Lift quality: open a disposable Lift copy, set `BLOCKIT_LIFT_DISPOSABLE_PATH` to that exact absolute path, then run `bun run verify:lift-quality-live -- --confirm-disposable`. It captures reference-hashed before/candidate front/left/3Q + atlas, records native padded-repack size, then restores original state by Undo.
6. Review that evidence against the actual approved reference. `<=512` is only a packing candidate until visual PASS. Measure Cost to Accepted Result only after quality PASS.

No Minecraft acceptance. Do not repeat GitHub audit/source design unless a verifier reproduces a new defect.
