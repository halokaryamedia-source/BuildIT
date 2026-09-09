# Next Action

Updated: 2026-09-09  
Branch: **`Local` only**. Proof → `current-validation.md`; ownership → `implementation-map.md`.

## Current State

- **AUTHORING TAXONOMY** stays user-selected `DIRECT | 3D_ASSISTED`; Geometry↔Texturing share AUTHORING and only AUTHORING↔Animation hands off.
- REMOTE_GITHUB pre-local hardening is complete at executable SHA `ab82d8116d9b021f6546239f974256f8423f9c3b`: Repository Verify `34334588510` PASS and MCP Verify `34334588675` PASS.
- Source surface remains **54 callable / 49 AUTHORING / 18 Animation**. `prelocal-surface-closure.test.ts` now guards family ownership, phase reachability, Runtime augmentation wiring, generated ToolSpec orphan bounds, and all-or-nothing Particle exposure.
- Tool-discovery evaluation is already part of `test:runtime`; do not run it again inside `verify:mcp`. Known capability → direct invoke; search/describe remain fallback only.

## Residue 1 — Particle Production Exposure + Generated Contract

Status: **SOURCE_READY / LOCAL_CODE REQUIRED**.

Complete as one generator-coupled delivery:

```text
register + enable inspect_particle/manage_particle
→ Animation-only exposure + particle-reference
→ add Particle + paint_texture_transaction to canonical ToolSpec/docs ownership
→ reconcile current Runtime-augmented schemas with import-safe ToolSpecs/generated docs where required
→ update Animation/router routing only after exposure
→ bun run docs:build → bun run docs:check → bun run verify:full
```

No Particle specialist and no fifth Gateway tool. Prefer one `manage_particle` call for create/patch/save/bind/preview; inspect only when it changes the next decision.

## Residue 2 — SDK Security

Status: **LOCAL_CODE REQUIRED**, separate from Particle. Upgrade `@modelcontextprotocol/sdk` from current 1.25.3 with pinned Bun, regenerate `bun.lock`, then `bun run verify:full`. Do not mix dependency migration into Particle diagnosis.

## Later Proof / STOP

After exact build/deploy, run only prepared live harnesses. Live/native/visual behavior and actual Astra/Codex usage reduction remain unverified until measured.

Do not add a routing framework, profile, Gateway tool, object-specific repair queue, or capability redesign before these residues close.
