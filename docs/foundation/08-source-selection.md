# BlockIT Source Selection — Historical Adoption Record

**Status:** Historical Record  
**Updated classification:** 2026-08-08

## Purpose

This note records the **earlier upstream selection phase** that helped shape the
BlockIT Local repository.

It is retained for provenance only. It is **not current runtime authority**.
Current Local source, root `AGENTS.md`, `CONTEXT.md`, and the current foundation
policy override any implementation assumption in this record.

## Historical Sources Considered

### `jasonjgardner/blockbench-mcp-plugin`

Used as the main Blockbench plugin/MCP implementation lineage, including areas
such as:

- plugin/server structure;
- MCP tools/resources/prompts;
- factories/utilities/schemas;
- UI/settings;
- build/docs generation.

### `sigee-min/ashfox`

Reviewed historically for runtime/safety/contract ideas such as:

- configuration/session structure;
- dispatcher/logging/error patterns;
- persistence/registry/contract concepts.

## Historical Selection Rule

Only adopt an upstream idea when it improves the Blockbench-first Local product
without creating a second competing architecture.

Do not carry forward:

- unrelated web/worker/gateway applications;
- Hytale-specific product behavior;
- generated output as source authority;
- duplicate runtime/framework layers;
- legacy names/paths that make current Local harder to understand.

## Current Authority

As of 2026-08-08:

```text
current runtime behavior → Local mcp/ source + relevant proof
product/modelling policy → docs/foundation/
agent behavior           → root AGENTS.md
active work              → docs/knowledge/next-action.md
```

Do not return to an upstream implementation merely because this historical note
mentions it. Re-adoption requires a current demonstrated gap and a new bounded
decision.

## Related

- [Merge Map](09-merge-map.md)
- [Implementation Map](../knowledge/implementation-map.md)
- [Source Map](../knowledge/sources/source-map.md)
