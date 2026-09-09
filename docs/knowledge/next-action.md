# Next Action

Updated: 2026-09-09  
Branch: **`Local` only**. Proof → `current-validation.md`; ownership → `implementation-map.md`.

## Current State
- **AUTHORING TAXONOMY**: user-selected `DIRECT | 3D_ASSISTED`; shared AUTHORING; only AUTHORING↔Animation hands off.
- Surface: **54 callable / 49 AUTHORING / 18 Animation**, four Gateway tools.
- Budget-induced keyframe rejection and unsafe projection claims were repaired; complete nested/conditional schemas remain open. Accept only completed exact-SHA CI.
- Managed Windows distribution now has install/update/rollback, preserved Codex settings, pinned plugin replacement, packaged skills and a dedicated Windows gate. Owner: `mcp/distribution/README.md`. No app/new MCP tool, no automatic publication. Native first-install/permission/restart acceptance remains separate.

## Residue 1 — Complete Schema + Particle Production Exposure
Status: **SOURCE_READY / LOCAL_CODE REQUIRED**.

Start from a clean matching checkout with pinned Bun: `bun install --frozen-lockfile` in `mcp/`.

```text
shared import-safe schemas → Runtime + canonical ToolSpec/docs parity
→ describe_capability restores selected-branch entry shapes/required fields
→ remove lossy Animation record(unknown) overrides
→ register + enable inspect_particle/manage_particle
→ Animation-only exposure + particle-reference
→ add Particle + paint_texture_transaction to ToolSpec/docs ownership
→ update Animation/router routing after exposure
→ bun run docs:build → bun run docs:check → bun run verify:full
```

Prove first-call valid/invalid cases through the SDK, including 33 valid keyframes and mode=detail requiring id. No copied required-field tables or error-driven schema discovery.

No Particle specialist and no fifth Gateway tool. `manage_particle` remains asset-only: create/patch/save/preview.

## Residue 2 — SDK Security
Separately upgrade `@modelcontextprotocol/sdk` 1.25.3 to maintained patched **v1.x** using pinned Bun; regenerate `bun.lock`; run `bun run verify:full`. This is not a v2 protocol migration.

## Later Proof / STOP
Close residues before stable publication. Exact build/deploy → prepared live harnesses plus managed-install host acceptance. Native/visual behavior and actual usage savings remain unverified. Do not redo accepted unchanged checks.

Do not add a routing framework, profile, Gateway tool, or object-specific repair system.
