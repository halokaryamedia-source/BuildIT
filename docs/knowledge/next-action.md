# Next Action

Updated: 2026-09-07 — GitHub-first source/provenance closure refreshed; representative fixture is test media, not product scope.
Branch: **`Local` only**. Proof → `current-validation.md`.

## Status

- LIVE ACCEPTANCE HARNESS: **SOURCE_READY / LIVE NOT_RUN**.
- Current exact source closure: `1c1f74e160ce520d53fda3a3f271d9323b28558b`.
  - Repository Verify run `34046872083`: PASS.
  - MCP Verify run `34046872042`: PASS — 409 runtime + 120 authoring, generated freshness, typechecks, measurements and build PASS.
  - Verified CI artifact `blockit-mcp-verified`, artifact ID `9993371261`, bundle SHA-256 `9896b8c25e293b7f33dc2ebf3119942809ec4df548839f4ac753366bc8521f87`, embedded build identity `sha256:c208ec49344db79fa22e1cddd330e563f14319d4ed0c724408ee0ba0a01c969c`.
- LIFT is **only the current representative acceptance fixture** for selected quality/effectiveness checks. It is not a product target and must not create LIFT-specific MCP/runtime/tool behavior. Preserve `workspace/active/lift/lift.bbmodel`; any fixture mutation uses a disposable copy.
- `@modelcontextprotocol/sdk` 1.25.3 remains the only known `LOCAL_CODE` source-authoring residue; patched compatible target is >=1.26.0 and `bun.lock` must be generated canonically.
- AUTHORING TAXONOMY: user-selected `DIRECT | 3D_ASSISTED`.
- 3D_ASSISTED: SOURCE_READY; GPU/native quality deferred unless explicitly resumed.
- LEGACY UI FALLBACKS: debug/maintenance only.

## Next

1. `LOCAL_CODE` residue only: upgrade MCP SDK to a patched compatible version, regenerate `bun.lock`, and run the owning source verifier. Do not redo GitHub-side design/harness/provenance work.
2. For the resulting exact post-upgrade SHA, use its verified CI bundle/provenance rather than rebuilding merely for deployment. Deploy that exact bundle, reload BlockIT, reconnect, then in one shared AUTHORING session run:
   - `bun run verify:geometry-live -- --confirm-disposable`
   - `bun run verify:texturing-live -- --confirm-disposable`
   These are generic MCP/native acceptance checks: consolidated tools, thin per-face UV without geometry thickening, native 16x template/repack, semantic pixel preservation, Painter target/clip, and Undo/Redo.
3. Perform only the real AUTHORING→Animation handoff with clearly synthetic disposable-test readiness; reconnect once. Run `bun run verify:animation-live -- --confirm-disposable`.
4. Persistence: run `bun run verify:persistence-live -- --prepare --confirm-disposable`, close/reopen the exported disposable `.bbmodel` once in Blockbench, then run the same command with `--verify`.
5. Only when validating the visual-quality/efficiency workflow or historical Lift issue closure, use LIFT as the representative fixture: open a disposable copy, set `BLOCKIT_LIFT_DISPOSABLE_PATH`, and run `bun run verify:lift-quality-live -- --confirm-disposable`. This fixture-specific evidence step is **not** a generic MCP product requirement and must not drive runtime semantics.
6. A representative-fixture visual PASS still requires the actual approved reference plus fresh comparable evidence. `<=512` is only a packing candidate. Measure Cost to Accepted Result only after quality PASS.

No Minecraft acceptance. Do not repeat GitHub audit/source design unless a verifier reproduces a new defect.
