# Next Action

Updated: 2026-09-07 — REMOTE_GITHUB quality/public-contract preparation active.
Branch: **`Local` only**. Proof → `current-validation.md`; history → `Experimental/authoring-usage-audit-2026-09-07.md`.

## Status

- Generic quality-first Skills/Finalization: **REMOTE_GITHUB COMPLETE**.
- Public-contract helpers: **SOURCE_READY / PREWIRED**:
  - texture evidence/revision → `mcp/lib/textureEvidence.ts`;
  - atomic paint → `mcp/lib/paintTransaction.ts`;
  - variant-from-base → `mcp/lib/textureVariantPlan.ts`;
  - Bedrock export integrity → `mcp/lib/bedrockExportIntegrity.ts`.
- Regression: `authoring-residue-remote-prep.test.ts` + `authoring-residue-handoff.test.ts`.
- Historical assets are evidence, not repair targets.
- **AUTHORING TAXONOMY** remains user-selected `DIRECT | 3D_ASSISTED`.
- LIVE_BLOCKBENCH/native visual behavior and Astra allowance reduction: **UNVERIFIED**.

## Remaining source closure

Exhaust `REMOTE_GITHUB`; defer only generated/native coupling.

1. `get_texture` — wire prepared revision/snapshot owner; public `region` / `expected_revision` must ship with generated docs.
2. Paint — reuse prepared planner/RGBA candidate/receipt for one domain-specific native Undo transaction; no redesign.
3. Variant — reuse `planTextureVariantFromBase`; preserve sole base role/dimensions.
4. `manage_cubes` — remove vague manual advertised shape; derive discovery from canonical detailed ToolSpec; `docs:check` must remain clean.
5. Export — reuse `planBedrockGeometryWrite` + identifier checks; never truncate multi-geometry or patch compiled JSON as native authority.

## Higher-context residue

Public ToolSpec/schema changes require canonical generation:

```text
bun run docs:build
bun run docs:check
bun run verify:mcp
```

Never hand-edit generated docs or use CI as generator. SDK upgrade, if resumed, also requires pinned-Bun lockfile regeneration.

## Live proof

Use existing disposable harnesses for revision rejection, transaction rollback/Undo, variant isolation, detailed Cube describe, safe geometry update, then geometry/texturing/animation/persistence. Quality parity precedes cost comparison.

## STOP

Local should be limited to canonical generation, native wiring impossible remotely, dependency lockfile work, and live proof. Do not reopen design or create object-specific repair queues.
