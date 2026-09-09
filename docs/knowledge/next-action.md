# Next Action

Updated: 2026-09-09  
Branch: **`Local` only**. Proof → `current-validation.md`; ownership → `implementation-map.md`.

## Current State

- **AUTHORING TAXONOMY** stays user-selected `DIRECT | 3D_ASSISTED`; Geometry↔Texturing share AUTHORING and only AUTHORING↔Animation hands off.
- Gateway stays **4 tools**; known capability → direct invoke. Fallback search now prioritizes exact-pixel paint, render/alpha, native Animation properties/Molang, controller blend composition, and Animation effects. MCP Verify passed at `5acb0c3b57a807677ff37dc8655ff15a8a694d13`.
- Source surface: **54 callable / 49 AUTHORING / 18 Animation**. Doc sync reads the canonical counts from `mcp/scripts/measure-phase-surfaces.ts`; Repository Verify passed at `d222835aa54e89322de8be58908bbb6adf1e626a`.
- Native Animation properties, Molang diagnostics, motion intelligence, nested controllers, and blend-transition curves are already wired through canonical tools. Do not add parallels.

## Residue 1 — Particle Production Exposure

Status: **SOURCE_READY / LOCAL_CODE REQUIRED**.

`inspect_particle`, `manage_particle`, semantics/schema, transactional writes, client-entity binding, native preview, reference resource, tests, and live harness exist, but Particle is not yet on the normal Runtime surface.

Complete as one generator-coupled delivery:

```text
register Particle family/tools
→ Animation exposure + enable inspect_particle
→ register particle-reference
→ docs manifest ownership
→ update Animation/router routing after exposure
→ bun run docs:build
→ bun run docs:check
→ bun run verify:full
```

No Particle specialist and no fifth Gateway tool. Prefer one `manage_particle` call for create/patch/save/bind/preview; inspect only when it changes the next decision.

## Residue 2 — SDK Security

Status: **LOCAL_CODE REQUIRED**, separate from Particle. Current lockfile resolves `@modelcontextprotocol/sdk` 1.25.3. Upgrade with pinned Bun, regenerate `bun.lock`, then run the owning full verifier. Do not mix dependency migration into Particle diagnosis.

## Later Proof / STOP

After exact build/deploy, run only relevant prepared live harnesses. Live/native/visual behavior and actual Astra/Codex usage reduction remain unverified until measured.

Do not add a routing framework, profile, Gateway tool, object-specific repair queue, or capability redesign before these two residues close.
