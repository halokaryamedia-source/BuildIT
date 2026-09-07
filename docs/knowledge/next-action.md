# Next Action

Updated: 2026-09-07 — REMOTE_GITHUB design closure locked.
Branch: **`Local` only**. Proof → `current-validation.md`; history → `Experimental/authoring-usage-audit-2026-09-07.md`.

## Status

- Generic quality-first Skills/Finalization: **REMOTE_GITHUB COMPLETE**.
- Public-contract helpers: **SOURCE_READY / PREWIRED**:
  - revision/crop → `mcp/lib/textureEvidence.ts`;
  - compact PNG metadata → `mcp/lib/textureEvidenceDelivery.ts`;
  - atomic paint → `mcp/lib/paintTransaction.ts` + `paintTransactionPolicy.ts`;
  - variant → `mcp/lib/textureVariantPlan.ts`;
  - project identifier → `mcp/lib/bedrockProjectIdentity.ts`;
  - export → `mcp/lib/bedrockExportIntegrity.ts` + `bedrockExportWritePolicy.ts`.
- Historical assets are evidence, not repair targets.
- **AUTHORING TAXONOMY** remains user-selected `DIRECT | 3D_ASSISTED`.
- LIVE_BLOCKBENCH/native visual behavior and Astra allowance reduction: **UNVERIFIED**.

## Locked local wiring

Do not redesign these contracts.

1. `get_texture`: full-composite revision, optional bounded region, encode only requested crop as PNG `content.image`; structured result stays metadata-only (no raw RGBA).
2. Exact paint transaction v1: non-layered base editable bitmap only; layered texture → fail closed and use native Painter. One preflighted transaction = one native Undo unit.
3. Variant: clone explicit base UUID, preserve dimensions/UV/base role, explicit non-material target group; selection is not authority.
4. New project: explicit `model_identifier` wins; otherwise `geometry.<project_slug>` from `bedrockProjectIdentity.ts`; assign native `Project.model_identifier` at creation, never repair compiled JSON as authority.
5. `manage_cubes`: remove vague manual advertised shape and derive discovery from canonical detailed ToolSpec.
6. Bedrock write v1: direct only `CREATE_NEW | REPLACE_SINGLE`; multi-geometry = `NATIVE_MERGE_REQUIRED` fail-closed, no custom JSON splice.

## Local order

Runtime wiring → `bun run docs:build` → `bun run docs:check` → `bun run verify:mcp` → SDK upgrade/`bun.lock` regenerate with pinned Bun → `bun run verify:full` → exact build/deploy → live disposable harnesses. Do not mix SDK migration into initial wiring diagnosis.

## STOP

Local should be limited to canonical generation, native wiring impossible remotely, dependency lockfile work, and live proof. No object-specific repair queue or another design phase.
