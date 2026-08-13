# Next Action

Updated: 2026-08-14

## Status

```text
PRELOCAL_PLUGIN_FRESHNESS_READY
```

Working branch: **`Local` only**. `NO LOCAL RUN ACTIVE`.

Current source contract is static-verified: Minecraft-first Geometry + Texture, five-preview default for future references, minor reference drift may be resolved into one canonical Minecraft interpretation, and unresolved material contradiction remains `BLOCKED`.

## Local Handoff

Use `docs/knowledge/operations/local-acceptance-runbook.md` as the single procedure owner.

```text
current Local
→ clean working tree + exact HEAD
→ MCP static gate
→ fresh build
→ record mcp/dist/mcp.js SHA-256
→ load the exact local BlockIT build
→ restart Blockbench
→ reconnect MCP client
→ verify endpoint + 62-tool default surface
→ verify:stateless-local
→ Fixture A
→ persistence/export
→ Fixture B
→ efficiency trace
```

Package/plugin version alone is not freshness proof. CI cannot prove which local plugin file Blockbench actually loaded.

The existing elephant reference was accepted as sufficient for a Minecraft/Blockbench interpretation. Fixture B may use it only when the **actual approved image is visible to the local modelling context**. Do not regenerate merely to satisfy the new five-preview default. If an approved reference lacks a material axis, that claim stays `UNVERIFIED / BLOCKED`.

```text
MINOR → one canonical Minecraft interpretation → continue
MATERIAL → CONFLICTING / BLOCKED
```

## Next Step

```text
LOCAL MACHINE
→ run runbook sections 3–4
→ prove exact HEAD + dist/mcp.js hash + loaded BlockIT file
→ then begin Fixture A
```

Do not change source during preparation unless a reproducible local failure identifies a concrete owner. No speculative cleanup, new tools, profiles, routers, or compatibility layers.
