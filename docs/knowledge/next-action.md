# Next Action

Updated: 2026-09-09  
Branch: **`Local` only**. Proof → `current-validation.md`; ownership → `implementation-map.md`.

## Current State
- **AUTHORING TAXONOMY**: user-selected `DIRECT | 3D_ASSISTED`; shared AUTHORING; only AUTHORING↔Animation hands off.
- Surface: **54 callable / 49 AUTHORING / 18 Animation**, four Gateway tools.
- This remote repair removes presentation-only Animation batch caps, rejects unavailable schema projections, and clarifies handoff/atlas/export rules. `schema-budget-sdk-boundary.test.ts` exercises the SDK plus canonical validation with native executor spies; it is not live proof. Accept only completed exact-SHA CI.
- Full nested schema recovery and conditional branch requirements are NOT closed by this repair. Existing generated ToolSpecs/prompts and `bun.lock` are unchanged.

## Residue 1 — Complete Schema + Particle Production Exposure
Status: **SOURCE_READY / LOCAL_CODE REQUIRED**.

Use a clean matching checkout with pinned Bun; start with `bun install --frozen-lockfile` from `mcp/`.

```text
shared import-safe schemas → Runtime + canonical ToolSpec/docs parity
→ describe_capability restores complete selected-branch entry shapes/required fields
→ remove lossy Animation record(unknown) presentation overrides
→ register + enable inspect_particle/manage_particle
→ Animation-only exposure + particle-reference
→ add Particle + paint_texture_transaction to canonical ToolSpec/docs ownership
→ update Animation/router routing after exposure
→ bun run docs:build → bun run docs:check → bun run verify:full
```

Prove first-call valid/invalid cases through the SDK, including 33 valid keyframes and mode=detail requiring id. Do not copy required-field tables into Gateway or use errors as schema discovery. Retain compact four-tool discovery and branch-scoped describe; raw character count is not accepted-result cost.

No Particle specialist and no fifth Gateway tool. `manage_particle` remains asset-only: create/patch/save/preview.

## Residue 2 — SDK Security
Separately upgrade `@modelcontextprotocol/sdk` 1.25.3 to a maintained patched **v1.x** using pinned Bun; regenerate `bun.lock`; run `bun run verify:full`. This is not a v2 protocol migration.

## Later Proof / STOP
Exact build/deploy → prepared live harnesses. Native/visual behavior and actual Astra/Codex usage savings remain unverified. Do not redo accepted unchanged source checks.

Do not add a routing framework, profile, Gateway tool, or object-specific repair system.
