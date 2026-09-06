# Next Action

Updated: 2026-09-07 — GitHub-first closure current; named assets are test media, not product scope.
Branch: **`Local` only**. Proof → `current-validation.md`.

## Status

- LIVE ACCEPTANCE HARNESS: **SOURCE_READY / LIVE NOT_RUN**.
- Accepted source/provenance SHA: `1c1f74e160ce520d53fda3a3f271d9323b28558b`.
  - Repository Verify `34046872083`: PASS.
  - MCP Verify `34046872042`: PASS — 409 runtime + 120 authoring; freshness, typechecks, measurements, build PASS.
  - Artifact `blockit-mcp-verified` ID `9993371261`; bundle SHA-256 `9896b8c25e293b7f33dc2ebf3119942809ec4df548839f4ac753366bc8521f87`; build identity `sha256:c208ec49344db79fa22e1cddd330e563f14319d4ed0c724408ee0ba0a01c969c`.
- LIFT is only a replaceable representative fixture. Preserve `workspace/active/lift/lift.bbmodel`; mutate disposable copies only.
- `LOCAL_CODE` residue: upgrade `@modelcontextprotocol/sdk` 1.25.3 to a patched maintained v1, regenerate `bun.lock`, run the owning source verifier.
- AUTHORING TAXONOMY: Geometry Strategy remains user-selected `DIRECT | 3D_ASSISTED`; 3D-Assisted native/GPU quality stays deferred unless resumed.

## Next

1. `LOCAL_CODE`: upgrade SDK within maintained v1, regenerate `bun.lock`, run its verifier. Do not hand-edit the lockfile or redo GitHub-prepared work.
2. Push the exact source closure; deploy its verified CI bundle. Reload BlockIT, keep the AI client on Gateway, and confirm fresh build identity/catalog.
3. Disposable live sequence:
   - `bun run verify:geometry-live -- --confirm-disposable`
   - `bun run verify:texturing-live -- --confirm-disposable`
   - AUTHORING→Animation through Gateway, same task/chat
   - `bun run verify:animation-live -- --confirm-disposable`
   - `bun run verify:persistence-live -- --prepare --confirm-disposable`
   - native close/reopen
   - `bun run verify:persistence-live -- --verify --confirm-disposable`
4. Run `verify:lift-quality-live` only when validating the visual-quality/efficiency method; it must not drive product semantics.
5. Visual PASS needs the actual approved reference + fresh comparable evidence. Measure Cost to Accepted Result only after quality PASS.

No Minecraft acceptance. Re-audit source design only if a verifier reproduces a new defect.
