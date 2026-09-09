# Next Action

Updated: 2026-09-09  
Branch: **`Local` only**. Proof → `current-validation.md`; ownership → `implementation-map.md`.

## Current State
- **AUTHORING TAXONOMY** remains user-selected `DIRECT | 3D_ASSISTED`; Geometry↔Texturing share AUTHORING; only AUTHORING↔Animation hands off.
- REMOTE_GITHUB executable/source closure: `9be8d7e00a78ea7383d70c3988902fff62bdd360`; Repository Verify `34346382752` PASS; MCP Verify `34346382820` PASS.
- Surface remains **54 callable / 49 AUTHORING / 18 Animation**.
- Particle pre-closure is asset-only: `manage_particle` = create/patch/save/preview; downstream runtime binding stays with existing animation/controller infrastructure.
- MCP Verify tracks semantic authoring skills and this continuation because executable tests read them.

## Residue 1 — Particle Production Exposure + Generated Contract
Status: **SOURCE_READY / LOCAL_CODE REQUIRED**.

```text
register + enable inspect_particle/manage_particle
→ Animation-only exposure + particle-reference
→ add Particle + paint_texture_transaction to canonical ToolSpec/docs ownership
→ reconcile required Runtime-augmented schemas with import-safe ToolSpecs
→ update Animation/router routing only after exposure
→ bun run docs:build → bun run docs:check → bun run verify:full
```

No Particle specialist and no fifth Gateway tool. Keep `manage_particle` asset-only: create/patch/save/preview. Inspect only when it changes the next decision.

## Residue 2 — SDK Security
Status: **LOCAL_CODE REQUIRED**. Separately upgrade `@modelcontextprotocol/sdk` 1.25.3 within the maintained patched **v1.x** line using pinned Bun, regenerate `bun.lock`, then `bun run verify:full`. This is not a v2 protocol migration.

## Later Proof / STOP
After exact build/deploy, run only prepared live harnesses. Live/native/visual behavior and actual Astra/Codex usage reduction remain unverified.

Do not add a routing framework, profile, Gateway tool, object-specific repair queue, or capability redesign before these residues close.
