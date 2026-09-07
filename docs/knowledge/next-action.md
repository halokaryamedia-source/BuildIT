# Next Action

Updated: 2026-09-07 — REMOTE_GITHUB quality/public-contract preparation active.
Branch: **`Local` only**. Proof → `current-validation.md`; historical usage evidence → `Experimental/authoring-usage-audit-2026-09-07.md`.

## Status

- Generic quality-first Skills/Finalization: **REMOTE_GITHUB COMPLETE**.
- Public-contract residue helpers: **SOURCE_READY / PREWIRED**:
  - focused texture evidence/revision → `mcp/lib/textureEvidence.ts`;
  - atomic paint transaction → `mcp/lib/paintTransaction.ts`;
  - variant-from-base → `mcp/lib/textureVariantPlan.ts`;
  - Bedrock export integrity → `mcp/lib/bedrockExportIntegrity.ts`.
- Regression owners: `mcp/tests/authoring-residue-remote-prep.test.ts` and `mcp/tests/authoring-residue-handoff.test.ts`.
- Historical assets are evidence only, not repair targets.
- LIVE_BLOCKBENCH/native visual behavior and actual Astra allowance reduction remain **UNVERIFIED**.

## Remaining source closure

Exhaust `REMOTE_GITHUB` first. Keep only generated/native coupling for later.

1. **Focused `get_texture`** — wire prepared snapshot/revision owner as far as possible; public `region` / `expected_revision` schema must ship with canonical generated docs.
2. **Paint transaction** — prepared planner/RGBA candidate/receipt are authoritative; public capability + native one-Undo wiring must reuse them without redesign.
3. **Variant from base** — reuse `planTextureVariantFromBase`; preserve sole base role and dimensions.
4. **`manage_cubes` discovery** — remove/neutralize vague manual registration shape so advertised fields derive from canonical detailed ToolSpec; generated docs should remain unchanged and must pass `docs:check`.
5. **Export integrity** — reuse `planBedrockGeometryWrite` / identifier checks; never truncate multi-geometry files or patch compiled JSON as native authority.

## Higher-context residue only

When a public ToolSpec/schema changes, canonical generated output must accompany it:

```text
bun run docs:build
bun run docs:check
bun run verify:mcp
```

Do not hand-edit generated docs or use CI as an authoring generator. If SDK security closure is included later, regenerate `bun.lock` with pinned Bun after upgrading to a patched compatible SDK.

## Live proof

Existing disposable harnesses should prove focused revision rejection, one-Undo transaction rollback, variant target isolation, detailed `manage_cubes` describe, safe geometry update, then geometry/texturing/animation/persistence. Quality parity precedes cost comparison.

## STOP

Local work should be limited to canonical generation, native/runtime wiring that cannot be authored remotely, dependency lockfile work, and live proof. Do not reopen design or create an object-specific repair queue.
