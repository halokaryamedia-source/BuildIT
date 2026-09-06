# Next Action

Updated: 2026-09-07 — daily-flow residue recorded; LOCAL_CODE/LIVE work explicitly deferred by user.
Branch: **`Local` only**. Proof → `current-validation.md`.

## Status

- LIVE ACCEPTANCE HARNESS: **SOURCE_READY / LIVE NOT_RUN**.
- Accepted source/provenance SHA: `1c1f74e160ce520d53fda3a3f271d9323b28558b`.
  - Repository Verify `34046872083`: PASS.
  - MCP Verify `34046872042`: PASS — 409 runtime + 120 authoring; freshness, typechecks, measurements, build PASS.
  - Artifact `blockit-mcp-verified` ID `9993371261`; bundle SHA-256 `9896b8c25e293b7f33dc2ebf3119942809ec4df548839f4ac753366bc8521f87`; build identity `sha256:c208ec49344db79fa22e1cddd330e563f14319d4ed0c724408ee0ba0a01c969c`.
- LIFT is only a replaceable representative fixture. Preserve `workspace/active/lift/lift.bbmodel`; mutate disposable copies only.
- LOCAL_CODE/LIVE work is **USER_DEFERRED** until explicitly reactivated.
- No new daily-flow Runtime/source implementation is accepted from the interrupted REMOTE_GITHUB delivery on 2026-09-07; only continuation state was published. Prepared/unreferenced Git objects are not source authority or proof.
- LOCAL_CODE residue for daily-flow hardening: compact `manage_cubes` correction continuation state; replace legacy `modify_cube` runtime error vocabulary; deterministic material-instance Cube targeting; explicit Animation identity/batch targeting; deterministic blank-atlas dimensions; and public Geometry/Texture wording/title cleanup. Public schema/description/spec edits must ship with canonical `docs:build` output; do not hand-edit generated docs.
- Separate existing LOCAL_CODE residue: upgrade `@modelcontextprotocol/sdk` 1.25.3 to a patched maintained v1, regenerate `bun.lock`, run the owning source verifier. Do not combine this dependency maintenance with daily-flow contract changes unless required by a reproduced dependency conflict.
- AUTHORING TAXONOMY: Geometry Strategy remains user-selected `DIRECT | 3D_ASSISTED`; 3D-Assisted native/GPU quality stays deferred unless resumed.

## Next

1. Until the user reactivates LOCAL_CODE/LIVE work: do not publish coupled daily-flow public-contract source without canonical generated output, and do not treat interrupted prepared objects as implementation.
2. On LOCAL_CODE reactivation, complete the daily-flow hardening as one coherent source/test/generated-doc delivery, then run its owning source verifier.
3. Handle the SDK upgrade as a separate logical maintenance delivery unless current evidence proves it must be coupled.
4. After an accepted exact source closure is deployed, reload BlockIT, keep the AI client on Gateway, and confirm fresh build identity/catalog.
5. Disposable live sequence:
   - `bun run verify:geometry-live -- --confirm-disposable`
   - `bun run verify:texturing-live -- --confirm-disposable`
   - AUTHORING→Animation through Gateway, same task/chat
   - `bun run verify:animation-live -- --confirm-disposable`
   - `bun run verify:persistence-live -- --prepare --confirm-disposable`
   - native close/reopen
   - `bun run verify:persistence-live -- --verify --confirm-disposable`
6. Run `verify:lift-quality-live` only when validating the visual-quality/efficiency method; it must not drive product semantics.
7. Visual PASS needs the actual approved reference + fresh comparable evidence. Measure Cost to Accepted Result only after quality PASS.

No Minecraft acceptance. Re-audit source design only if a verifier reproduces a new defect.
