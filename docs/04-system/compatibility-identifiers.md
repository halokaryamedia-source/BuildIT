# LazyDesigner Compatibility Identifier Boundary

Updated: 2026-09-11

This file owns the current migration boundary for identifiers that still contain `BlockIT` / `blockit` after the product rename.

Rule:

```text
presentation identity may migrate independently
protocol / persisted / install identity may not
```

Do not bulk-replace `blockit` across the repository.

## Compatibility-Bound Identifiers

These values remain stable until a dedicated migration explicitly updates every producer, consumer, persisted value and recovery path.

| Identifier | Current value | Canonical owner | Why retained |
| --- | --- | --- | --- |
| npm/package identity | `blockit-bedrock-entity-mcp` | `mcp/package.json` | package/build/dependency identity |
| production bundle path | `dist/blockit_mcp.js` | `mcp/package.json`, build/deploy/distribution owners | installed file/update continuity |
| Blockbench plugin id | `blockit_mcp` | `mcp/index.ts` | installed plugin identity and reload/update continuity |
| Gateway MCP server name | `blockit-gateway` | `mcp/gateway/contract.ts` | client/server identity continuity |
| Runtime URL env prefix | `BLOCKIT_RUNTIME_*` | `mcp/gateway/backend.ts` | deployment/config compatibility |
| Gateway queue env key | `BLOCKIT_GATEWAY_MAX_QUEUE_DEPTH` | `mcp/gateway/backend.ts` | deployment/config compatibility |
| project affinity header | `x-blockit-project-uuid` | `mcp/gateway/projectAffinity.ts` | Gateway↔Runtime protocol compatibility |
| authoring phase header | `x-blockit-authoring-phase` | `mcp/gateway/projectAffinity.ts` | Gateway↔Runtime protocol compatibility |
| extended-family localStorage key | `blockit_mcp.extended_families_enabled` | `mcp/ui/settings.ts` | persisted user setting continuity |
| authoring stage setting id | `mcp_authoring_phase` | `mcp/lib/authoringPhase.ts` | persisted Blockbench setting continuity |
| extended-family setting id | `mcp_extended_families_enabled` | `mcp/lib/registrationProfile.ts` | persisted Blockbench setting continuity |

A compatibility-bound identifier may have an internal TypeScript symbol whose name still contains `Blockit`/`BLOCKIT`. Renaming the symbol alone is optional and lower priority than eliminating user-facing stale branding; never change the serialized/string value accidentally while doing symbol cleanup.

## Presentation Identity

User-visible product language should use **LazyDesigner** when it does not change a serialized identifier or external contract.

Examples:

```text
LazyDesigner Gateway
LazyDesigner Runtime
LazyDesigner project affinity
LazyDesigner authoring stage
LazyDesigner Legacy UI Fallbacks
```

Safe presentation migration includes:

- docs/headings/descriptions;
- quick messages;
- human-readable errors;
- comments that describe the current product;
- MCP tool titles/descriptions where the protocol/tool name itself is unchanged.

Do not expose compatibility implementation residue as a second product name.

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
1. migrate safe user-facing BlockIT strings to LazyDesigner
2. keep compatibility-bound serialized values stable
3. map remaining legacy specialist Skill path consumers
4. rename a compatibility-bound value only as an atomic dedicated migration
5. regenerate generated artifacts through canonical generators when LOCAL_CODE is active
```

## Proof Boundary

This document and its source regressions can prove repository intent and string ownership. They do not prove an installed migration, persisted-setting upgrade, live Gateway compatibility, or Blockbench plugin replacement behavior until those paths are exercised in the appropriate local/live context.
