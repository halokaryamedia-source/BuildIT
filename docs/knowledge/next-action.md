# Next Action

Updated: 2026-09-09
Branch: **`Local` only**. Proof → `current-validation.md`; source ownership → `implementation-map.md`.

## Current State

- Gateway remains **4 fixed tools**; known authoring capabilities are direct-invoke first.
- Current source surface is **54 callable / 49 AUTHORING / 18 Animation**. Repository docs now derive their expected counts from `mcp/scripts/measure-phase-surfaces.ts` instead of maintaining a second numeric authority.
- Gateway fallback discovery now prioritizes current hot paths such as exact-pixel transactions, render/alpha profiles, native Animation properties/Molang, controller blend composition, and Animation effects. Exact-SHA MCP Verify passed for commit `5acb0c3b57a807677ff37dc8655ff15a8a694d13`.
- Current developer-facing surface synchronization passed Repository Verify on `d222835aa54e89322de8be58908bbb6adf1e626a`.
- Animation native properties, Molang diagnostics, motion intelligence, nested controllers and blend-transition curves are already wired through existing canonical capabilities; do not add parallel tools.

## Only Remaining MCP Wiring Residue

### Particle production exposure — `LOCAL_CODE`

Particle implementation is already source-ready (`inspect_particle`, `manage_particle`, schema/semantics, transactional writes, client-entity binding, native preview, reference resource, tests and live harness), but it is not yet part of the normal production Runtime surface.

Complete it as one generator-coupled delivery:

```text
register Particle family/tools
→ expose both tools on Animation surface
→ enable inspect_particle
→ register particle-reference resource
→ add Tool/Resource docs manifest ownership
→ update Animation/router routing only after capability is actually exposed
→ bun run docs:build
→ bun run docs:check
→ bun run verify:full
```

Do not add a Particle specialist or a fifth Gateway tool. Particle stays a conditional Animation/effects lane. Prefer one `manage_particle` call for create/patch/save/bind/preview; use `inspect_particle` only when inspection can change the next decision.

### SDK security closure — separate `LOCAL_CODE` task

Current lockfile still resolves `@modelcontextprotocol/sdk` 1.25.3. Upgrade/regenerate `bun.lock` with the pinned Bun toolchain and run the owning full verifier **after** Particle wiring; do not mix dependency migration into Particle diagnosis.

## Later Live Proof

After exact build/deploy, run only the already-prepared relevant live harnesses. Live Blockbench/native/visual behavior and actual Astra/Codex usage reduction remain unverified until they are measured; source/static footprint alone is not Authoring Efficiency proof.

## STOP

No new routing framework, profile, Gateway tool, object-specific repair queue, or capability redesign is justified before the two residues above are closed.
