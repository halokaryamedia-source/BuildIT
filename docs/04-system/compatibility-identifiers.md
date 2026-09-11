# LazyDesigner Compatibility Identifier Boundary

Updated: 2026-09-11

This file owns the migration boundary for identifiers that still contain `BlockIT` / `blockit` after the product rename.

```text
presentation identity may migrate independently
protocol / persisted / install identity may not
```

Do not bulk-replace `blockit` across the repository.

## Compatibility-Bound Identifiers

These values remain stable until a dedicated migration updates every producer, consumer, persisted value and recovery path.

| Identifier | Current value | Canonical owner | Why retained |
| --- | --- | --- | --- |
| npm/package identity | `blockit-bedrock-entity-mcp` | `mcp/package.json` | package/build/dependency identity |
| production bundle path | `dist/blockit_mcp.js` | package/build/deploy owners | installed file/update continuity |
| Blockbench plugin id | `blockit_mcp` | `mcp/index.ts` | installed plugin identity/reload continuity |
| Gateway MCP server name | `blockit-gateway` | `mcp/gateway/contract.ts` | client/server identity continuity |
| Runtime URL env prefix | `BLOCKIT_RUNTIME_*` | `mcp/gateway/backend.ts` | deployment/config compatibility |
| Gateway queue env key | `BLOCKIT_GATEWAY_MAX_QUEUE_DEPTH` | `mcp/gateway/backend.ts` | deployment/config compatibility |
| project affinity header | `x-blockit-project-uuid` | `mcp/gateway/projectAffinity.ts` | Gateway↔Runtime protocol compatibility |
| authoring phase header | `x-blockit-authoring-phase` | `mcp/gateway/projectAffinity.ts` | Gateway↔Runtime protocol compatibility |
| extended-family localStorage key | `blockit_mcp.extended_families_enabled` | `mcp/ui/settings.ts` | persisted user setting continuity |
| authoring stage setting id | `mcp_authoring_phase` | `mcp/lib/authoringPhase.ts` | persisted Blockbench setting continuity |
| extended-family setting id | `mcp_extended_families_enabled` | `mcp/lib/registrationProfile.ts` | persisted Blockbench setting continuity |

Primary LazyDesigner Skill paths are **not** compatibility-bound. REFERENCE_PREPARATION, ASSET_AUTHORING, and PRODUCT_DEVELOPMENT primary Skills now use canonical `lazydesigner-*` identities; removed legacy paths must not return as aliases.

Internal TypeScript symbols may still contain `Blockit`/`BLOCKIT` where renaming them provides little value. Never change a serialized/string compatibility value accidentally during symbol cleanup.

## Presentation Identity

Human-visible product language should use **LazyDesigner** when it does not change a serialized identifier or external contract.

Safe presentation migration includes:
- docs/headings/descriptions;
- QuickMessages and logs;
- human-readable errors;
- comments describing the current product;
- MCP titles/descriptions where protocol names remain unchanged.

Do not expose compatibility residue as a second product name.

## Migration Preconditions

A compatibility-bound identifier may change only when all of the following are mapped in one coherent migration:

```text
producer(s)
consumer(s)
persisted/install state
generated/build outputs
tests/CI/deploy scripts
rollback/recovery behavior
```

For persisted/install identifiers, migration must define whether old state is read, transformed, dual-read temporarily, or intentionally invalidated. Do not create permanent dual identity.

## Current Priority

```text
1. continue bounded human-readable BlockIT → LazyDesigner cleanup
2. keep compatibility-bound serialized values stable
3. do not rename internal Blockit/BLOCKIT symbols merely for cosmetics
4. rename a compatibility-bound value only as an atomic dedicated migration
5. regenerate generated artifacts through canonical generators when LOCAL_CODE is active
```

## Proof Boundary

This document and source regressions can prove repository intent and string ownership. They do not prove installed migration, persisted-setting upgrade, live Gateway compatibility, or Blockbench plugin replacement behavior until exercised in the appropriate local/live context.
