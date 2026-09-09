# Next Action

Updated: 2026-09-09  
Branch: **`Local` only**. Proof → `current-validation.md`; ownership → `implementation-map.md`.

## Current State
- **AUTHORING TAXONOMY**: user-selected `DIRECT | 3D_ASSISTED`; shared AUTHORING; only AUTHORING↔Animation hands off.
- Surface: **54 callable / 49 AUTHORING / 18 Animation**, four Gateway tools.
- Budget-induced keyframe rejection and unsafe projection claims were repaired; complete nested/conditional schemas remain open.
- Managed Windows distribution has install/update/rollback, preserved Codex settings, pinned plugin replacement, packaged skills and a dedicated Windows gate. Owner: `mcp/distribution/README.md`. No app/new MCP tool, no automatic publication.
- Remote acceptance before local handoff: `Local` SHA `f46274f6faa1bdd27ca14e87270af49d5bb0a3f5`; MCP Verify and Managed Distribution Windows gate passed on that exact SHA. Treat this only as source/package evidence. Native Blockbench/Codex host acceptance is still pending.

# CODEX LOCAL EXECUTION ORDER

This is the canonical handoff for the next local Codex session. **Do not restart the repository audit, redesign the architecture, or ask the user to manually replace BlockIT files.** Start from the current `Local` branch and execute the remaining work in this order.

## 0 — Pin and Prepare Local Workspace

Context: **LOCAL_CODE**.

```text
checkout Local
→ confirm clean worktree and current HEAD
→ read root AGENTS.md + mcp/AGENTS.md
→ read this file
→ bun install --frozen-lockfile from mcp/
```

If local source already differs from remote `Local`, inspect the diff before writing. Do not discard user/local changes. Remote CI proof can be reused only for unchanged exact source; once source changes locally, verify the changed result normally.

## 1 — Close Schema + Particle Production Exposure

Status at handoff: **REQUIRED IMPLEMENTATION — LOCAL_CODE**.

Goal: make the Runtime contract, Gateway describe surface, generated ToolSpec/docs and Particle exposure complete without expanding the Gateway tool count.

Execute:

```text
shared import-safe schemas → Runtime + canonical ToolSpec/docs parity
→ describe_capability restores complete selected-branch nested shapes + required fields
→ remove remaining lossy Animation record(unknown) presentation overrides where they hide callable structure
→ register + enable inspect_particle/manage_particle
→ expose Particle only on the intended Animation surface + particle-reference
→ add Particle + paint_texture_transaction to canonical ToolSpec/docs ownership
→ update Animation/router guidance only where exposure changes user-visible routing
→ bun run docs:build
→ bun run docs:check
```

Required regressions:
- SDK boundary still accepts 33 valid keyframes when the canonical schema allows them.
- `inspect_elements(mode=detail)` advertises/requires `id` correctly.
- `describe_capability` exposes enough nested structure for a correct first call; no error-driven schema discovery.
- Particle production exposure is all-or-nothing across registration, phase, docs and resource wiring.
- No Particle specialist and **no fifth Gateway tool**.
- `manage_particle` remains asset-only: create/patch/save/preview; client-entity wiring stays in its existing owner.

Do not copy required-field tables into Gateway as a second contract owner. Fix the canonical/shared schema owner instead.

## 2 — Upgrade MCP SDK Security Line

Status at handoff: **REQUIRED IMPLEMENTATION — LOCAL_CODE**.

Upgrade `@modelcontextprotocol/sdk` from `1.25.3` to a maintained patched **v1.x** compatible with the current architecture.

```text
update dependency
→ regenerate bun.lock with pinned Bun
→ run focused SDK/stateless/Gateway tests first
→ fix only reproduced compatibility issues
→ do not migrate to protocol/SDK v2
```

Preserve:
- request-owned/stateless Runtime design;
- loopback-only network boundary;
- four-tool Gateway;
- no automatic mutation retries;
- project/phase affinity behavior.

## 3 — Final Local Source Gate

After Steps 1–2 are complete:

```bash
bun run verify:closure
bun run verify:full
```

Run narrower failing tests during implementation; use the full gate once as terminal source evidence. Generated docs/prompt outputs must be fresh and committed with their canonical source changes when applicable.

**STOP here if `verify:full` is not green. Do not deploy a knowingly failing candidate into Blockbench.**

## 4 — Build and Exercise Managed Installation

Context advances to **LOCAL_CODE**, then **LIVE_BLOCKBENCH** for host proof.

Use the managed distribution; do not manually copy the plugin, skills or Codex configuration.

From `mcp/` on Windows x64:

```text
bun run build
→ bun run ./distribution/package.ts
→ install the produced managed package into a disposable/local acceptance location
→ use blockit.exe / installed blockit.cmd for install/update/status/rollback/recover
```

Acceptance:
- installer writes the managed plugin path automatically;
- installer updates only the BlockIT Codex MCP section and preserves unrelated settings/servers;
- packaged skills/foundation files land in the intended workspace automatically;
- repeated install of the same package is idempotent;
- rollback restores the previous managed version and does not touch user assets;
- edited/conflicting managed files fail closed unless explicitly adopted;
- no manual file replacement is required from the user.

First Blockbench registration/trust may still require the native **Load Plugin from File** permission step once. Do not bypass or edit Blockbench internal localStorage to fake installation trust. After that first registration, subsequent managed updates must continue replacing the pinned plugin file automatically.

## 5 — Live Codex + Blockbench Acceptance

Context: **LIVE_BLOCKBENCH**.

Use a disposable test workspace/project first. Verify the actual installed package, not the source tree.

Minimum host sequence:

```text
Blockbench loads managed blockit_mcp.js
→ Runtime becomes healthy
→ Codex starts the installed compiled Gateway from managed config
→ Gateway tools/list exposes exactly 4 client-facing tools
→ one simple AUTHORING read
→ one reversible Geometry mutation + Undo/Redo
→ Texturing path on the same AUTHORING surface
→ AUTHORING→Animation handoff
→ Animation read/mutation/playback smoke
→ Particle inspect/create-patch-save-preview smoke after Step 1 exposure
→ save .bbmodel
→ close/reopen and prove persistence
```

Then run the prepared live verifiers relevant to the changed surfaces. Reuse their shared preflight; do not add repeated status/search/describe calls merely for reassurance.

Host acceptance must also confirm:
- Codex actually reads the installed current skills/instructions after a fresh session;
- Blockbench plugin reload/restart does not require manual file copying;
- project affinity does not mutate the wrong tab;
- user model/PNG/workspace files are not treated as application-update files;
- no unexpected background polling or update work occurs during authoring.

## 6 — Managed Update / Rollback Acceptance

After one local package is working, test a second disposable package/version through the manager:

```text
installed vA
→ request update to vB while Blockbench/Gateway active: replacement must defer/fail safe
→ close active host/session as instructed
→ run update again: files change automatically
→ reopen Blockbench/Codex
→ confirm vB build identity + working Gateway
→ rollback
→ confirm vA restored
```

The user must never be instructed to replace `blockit_mcp.js`, Gateway binaries, skill files or Codex config by hand. If automation cannot safely perform a replacement, return a precise blocker instead of falling back to manual copy instructions.

## 7 — Completion Boundary

Only after Steps 1–6 pass:

```text
source contract green
+ managed install green
+ actual Codex config/skill pickup green
+ native Blockbench Runtime green
+ save/reopen persistence green
+ managed update/rollback green
→ candidate is ready for release review
```

Do **not** publish Stable automatically. Release/tag publication remains a separate explicit maintainer decision.

Actual visual fidelity and real Astra/Codex usage savings should be measured with representative authoring tasks after functional host acceptance; do not claim them from static/package tests alone.

## STOP / Non-Goals

Do not add:
- a desktop updater app;
- a background service or polling daemon;
- a fifth Gateway tool;
- a new routing/profile framework;
- object-specific repair systems;
- automatic source execution from moving `Local`;
- manual-copy fallback as normal user workflow.

The intended product flow remains:

```text
install once
→ Codex + Blockbench use managed BlockIT
→ author normally
→ explicit managed update when desired
→ automatic safe file/config replacement
→ rollback/recover if required
```
