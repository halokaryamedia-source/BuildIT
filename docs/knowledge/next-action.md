# Next Action

Updated: 2026-09-07 — GitHub-first closure current; named assets are test media, not product scope.
Branch: **`Local` only**. Proof → `current-validation.md`.

## Status

- LIVE ACCEPTANCE HARNESS: **SOURCE_READY / LIVE NOT_RUN**.
- Accepted source/provenance SHA: `1c1f74e160ce520d53fda3a3f271d9323b28558b`.
  - Repository Verify `34046872083`: PASS.
  - MCP Verify `34046872042`: PASS — 409 runtime + 120 authoring; freshness, typechecks, measurements, build PASS.
  - Verified artifact `blockit-mcp-verified` ID `9993371261`; bundle SHA-256 `9896b8c25e293b7f33dc2ebf3119942809ec4df548839f4ac753366bc8521f87`; build identity `sha256:c208ec49344db79fa22e1cddd330e563f14319d4ed0c724408ee0ba0a01c969c`.
- LIFT is **only a replaceable representative acceptance fixture**. It must not create LIFT-specific MCP/runtime/tool behavior. Preserve canonical `workspace/active/lift/lift.bbmodel`; mutate disposable copies only.
- Known `LOCAL_CODE` source residue: upgrade `@modelcontextprotocol/sdk` 1.25.3 to a patched compatible maintained v1 release, regenerate canonical `bun.lock`, and run the owning source verifier.
- AUTHORING TAXONOMY: user-selected `DIRECT | 3D_ASSISTED`; 3D_ASSISTED native/GPU quality stays deferred unless resumed.

## Next

1. `LOCAL_CODE` residue only: upgrade the SDK within maintained v1, regenerate `bun.lock`, and run the owning source verifier. Do not hand-edit the lockfile and do not redo GitHub-side design/harness/provenance work.
2. Push that exact source closure and use its verified CI bundle/provenance for deployment. Reload BlockIT, keep the normal AI client on the Gateway, and confirm fresh build identity/catalog rather than manually reconnecting the client.
3. Generic live acceptance on disposable state:
   - `bun run verify:geometry-live -- --confirm-disposable`
   - `bun run verify:texturing-live -- --confirm-disposable`
   - one real AUTHORING→Animation handoff through Gateway, continuing the same task/chat
   - `bun run verify:animation-live -- --confirm-disposable`
   - `bun run verify:persistence-live -- --prepare --confirm-disposable`
   - one native close/reopen
   - `bun run verify:persistence-live -- --verify --confirm-disposable`
4. Only to validate visual-quality/efficiency methodology or historical Lift issue traceability, append disposable LIFT `verify:lift-quality-live`. That fixture step is not a generic MCP requirement and must not drive product semantics.
5. Visual PASS requires the actual approved reference plus fresh comparable evidence. Measure Cost to Accepted Result only after accepted quality.

No Minecraft acceptance. Do not repeat GitHub audit/source design unless a verifier reproduces a new defect.
