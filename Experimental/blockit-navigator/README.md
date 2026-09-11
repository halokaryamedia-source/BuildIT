# BlockIT Navigator — Retired Historical Proposal

Status:

```text
RETIRED / HISTORICAL ONLY
CURRENT PRODUCTION CONTROL: mcp/gateway/control/
DO NOT USE AS CURRENT AUTHORITY
```

This folder preserves the original BlockIT Navigator proposal only as design history. The former production `mcp/gateway/navigator/` source path has been removed and must not be recreated as an alias or second routing path.

Current LazyDesigner routing, context projection, readiness, continuation semantics, and capability ownership are owned by:

```text
mcp/gateway/control/
mcp/gateway/index.ts
mcp/lib/authoringPhase.ts
```

Control remains part of the existing Gateway. It is not a second MCP server, database, workflow engine, daemon, or authoring UI.

Do not copy rules from this historical proposal into active implementation. When historical proposal text conflicts with canonical production source or current docs, canonical production ownership wins.
