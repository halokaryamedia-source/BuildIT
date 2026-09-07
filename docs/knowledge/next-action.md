# Next Action

Updated: 2026-09-07 — REMOTE_GITHUB quality + public-contract prewiring complete.
Branch: **`Local` only**. Proof → `current-validation.md`. Historical usage evidence → `Experimental/authoring-usage-audit-2026-09-07.md`.

## Status

- Generic quality-first Skills/Finalization: **REMOTE_GITHUB COMPLETE**.
- Focused texture evidence/revision semantics: **PREWIRED** in `mcp/lib/textureEvidence.ts`.
- Atomic multi-operation paint semantics/receipt: **PREWIRED** in `mcp/lib/paintTransaction.ts`.
- Variant-from-base semantics: **PREWIRED** in `mcp/lib/textureVariantPlan.ts`.
- Bedrock export/identifier/write-plan integrity: **PREWIRED** in `mcp/lib/bedrockExportIntegrity.ts`.
- Regression owners: `mcp/tests/authoring-residue-remote-prep.test.ts` + `mcp/tests/authoring-residue-handoff.test.ts`.
- Historical objects/assets are **not repair targets**. Do not reopen old fixtures merely to close this system work.
- LIVE_BLOCKBENCH/native visual behavior and actual Astra allowance reduction remain **UNVERIFIED** until exact-build live proof.

## LOCAL_CODE — minor closure only

Do these in order. **Do not redesign the contracts; reuse the prepared schemas/helpers.**

### 1. Focused `get_texture`

Owner: existing `get_texture` in `mcp/server/tools/texture.ts`.

- Extend the public input with `focusedGetTextureParameters`.
- Read the current composited live RGBA for the explicit texture target.
- Run `buildTextureEvidenceSnapshot`; default no-region behavior must remain full-atlas compatible.
- For `region`, encode only the returned bounded RGBA and return `revision`, bitmap dimensions, region and logical-UV mapping.
- `expected_revision` mismatch must reject **before** returning/using stale evidence.
- Keep explicit texture targeting when multiple textures exist; no implicit-default fallback.

### 2. Atomic paint transaction

Owner: Texturing/Painter Runtime; use `paintTransactionParameters`, `planPaintTransaction`, `applyPaintTransactionRgba`, `buildPaintTransactionReceipt`.

- Register one **domain-specific texture paint transaction** capability; do not create a generic executor/planner.
- Resolve explicit texture + current composited/active editable bitmap as appropriate to the existing Painter owner.
- Verify `expected_revision` before mutation.
- Preflight the **entire** operation list before opening native edit state.
- Apply all `fill_rect | set_pixels | erase_pixels` operations as one native Blockbench Undo unit.
- Any preflight/native failure leaves bitmap/history unchanged.
- Compute post-mutation revision and return the prepared compact receipt with affected region.
- Keep existing Painter tools for normal artistic strokes; transaction is for coherent exact/bounded multi-op patches, not a replacement for Painter.

### 3. Variant from base

Owner: existing texture creation family.

- Add the prepared `createTextureVariantParameters` branch to the current texture creation owner.
- Resolve source as the **single established base-color atlas**.
- Run `planTextureVariantFromBase`.
- Duplicate native bitmap/mapping into the explicit non-material variant group in one Undo unit.
- Never demote/re-group the base just to make variant preflight pass.
- Return explicit source/base/variant identities and preserved dimensions.

### 4. `manage_cubes` advertised schema

Owner: `mcp/server/tools/cubes.ts` + existing `createTool` extractor.

Current defect is isolated: canonical `cubeToolDocs[0].parameters` is already detailed, but registration overrides it with vague `cubeToolInputSchema` / `z.unknown()` fields.

- Delete the manual `cubeToolInputSchema` compatibility block.
- Delete `inputSchema: cubeToolInputSchema` from `manage_cubes` registration.
- Let `createTool` derive the advertised shape from canonical `cubeToolDocs[0].parameters`.
- Do **not** change execute validation semantics.
- Verify Gateway `describe_capability` can form create/batch/per-face payloads without source reading.
- Generated docs are expected to remain semantically aligned because ToolSpec `parameters` is already the canonical docs owner; prove with `docs:check`.

### 5. Export/update integrity

Owner: existing `export_model`.

- Use `planBedrockGeometryWrite` before an existing Bedrock geometry destination is replaced.
- `CREATE_NEW` → current path.
- `REPLACE_SINGLE` → allowed only with explicit overwrite consent and exactly one matching owned identifier.
- `NATIVE_MERGE_REQUIRED` → preserve other geometry entries using a tested native/semantic merge path; never truncate them.
- `IDENTIFIER_REPAIR_REQUIRED` → repair native project metadata first; never patch compiled JSON to pretend native state changed.
- Run `requireExpectedGeometryIdentifier` on produced Bedrock output and retain existing afterSave/file postconditions.
- Use `missingRequestedDeliverables` in Finalization/reporting, not as an automatic “export everything” rule.

## Canonical generation / source verification

After public wiring:

```text
bun run docs:build
bun run docs:check
bun run verify:mcp
```

Generated API docs/prompt manifest are authored only by their canonical generators. Do not hand-edit generated artifacts.

If the SDK security closure is included in that LOCAL_CODE session:
- upgrade `@modelcontextprotocol/sdk` to a patched compatible version (>=1.26.0);
- regenerate `bun.lock` with pinned Bun;
- rerun the same owning verifier.

## LIVE_BLOCKBENCH — proof only

Deploy the exact verified build, then use disposable generic fixtures to prove:
- focused region read + revision mismatch rejection;
- transaction target isolation, one Undo/Redo, rollback on invalid middle op;
- base + two variants with decoy selected;
- `manage_cubes` live describe is detailed enough without source reads;
- safe single geometry overwrite and multi-geometry preservation;
- existing geometry/texturing/animation/persistence harness sequence.

Only after accepted quality is equal may comparable-fixture cost be evaluated. Bytes/call count are not model tokens or allowance by themselves.

## STOP

When the five wiring items, canonical generation, `verify:mcp`, and required live/native proof are complete, update `current-validation.md` with the exact source/build/runtime identity. Do not create another roadmap or object-specific repair queue.
