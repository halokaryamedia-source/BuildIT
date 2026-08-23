# Next Action

Updated: 2026-08-23

## Current Status

```text
PRELOCAL_CONTROLLER_MUTATION_READY
PRO-1–PRO-8 STATIC HARDENING RETAINED
TEXTURING_T0_T18_STATIC_HARDENING_RETAINED
ANIMATION_D1_D5_EFFECT_MOLANG_CLOSURE_RETAINED
FULL_AUDIT_REPAIR_SWEEP_2026_08_23_PUSHED
CANONICAL_GATE_64_OBSERVED_CI_GREEN_D8C0899
GENERATED_ARTIFACTS_FRESH_AGAINST_CURRENT_SOURCE
LOCAL_ACCEPTANCE_REACTIVATED_BY_USER_2026_08_23
AWAITING_PLUGIN_ENABLE_THEN_RUNBOOK_STEP_4
```

Working branch: **`Local` only**. `Experimental/**` remains **PAUSED BY USER**. GitHub discipline is owned by `GITHUB_RULES.md`.

## Proof Boundary

Do not claim live desktop Blockbench/model-quality improvement without actual matching runtime proof. Visual fidelity, playback, persistence, and actual runtime/call-efficiency remain **LOCAL PROOF REQUIRED** until the matching local surface actually runs. Experimental browser proof below does not upgrade desktop MCP claims.

Reference generation stays separately gated: repository/policy work and this testing reactivation never authorize image generation without fresh user instruction.

## Pre-local Optimization Ledger

```text
U1 regression preflight + coherent logical patching
U2 targeted tests/invariants read before owner edits
U3 known/coherent place_cube(elements=[...]) batching
U4 affected-view-first correction verification
U5 meaningful workspace persistence; no mutation-count ritual
U6 canonical documentation ownership
U7  No change required for lean profile/router/runtime-prompt redesign
    without installed-client evidence
```

## 2026-08-23 Audit Repair Sweep (pushed, CI green)

Five commits restored canonical verification and closed material audit findings:

```text
0496fb4  restore canonical gate on the 64-tool surface
         (stale-pin realignment, typecheck stub cast, regenerated artifacts)
0d3ed6e  transport/lifecycle hardening (size caps, chunked rejection,
         request-line/Content-Length/Host validation, backpressure,
         double-onload/unload/port guards, trigger_action Undo pairing,
         reference_models runtime registration, nodes field whitelist)
924598a  geometry fail-closed contracts (shared project guards,
         duplicate newName root-only, locator no-op preflight +
         cross-family uniqueness, export overwrite consent +
         afterSave precheck + honest truncation, undo/redo fail-closed
         depth + partial reporting, create_project discard_unsaved,
         finite origin/rotation reporting)
c56a445  paint/animation gaps (six-surface pixel bounds guard,
         exact-pixel default fix, duplicate controller animation-link
         rejection, blend_value typeof preservation, keyframe create
         casualty counts, schema compaction inside ceilings)
d8c0899  hygiene port (BlockIT llms.txt, manifest freshness gate,
         zod-upgrade surface guard test, controller summary mirror,
         bake scope disclosure)
```

Canonical CI observed green on this state (`MCP Verify` runs 32638654484 / 32648128107 / 32649749692). Generated artifacts are fresh against source.

## Local Acceptance Execution State

The user explicitly reactivated local acceptance on 2026-08-23. Recorded facts:

```text
Git HEAD (local == origin/Local): d8c0899
Deployed artifact:  %APPDATA%\Blockbench\plugins\mcp.js
Artifact SHA-256:   698C3CE9D7F9806B3BAB7E9D25F0E3137EAABFE6EAEBF73177301838E794D1C1
Deploy hash match:  VERIFIED
Blockbench version: 5.1.6
Bun local:          1.3.11 (repo pin 1.3.14 — deviation recorded; no canonical
                    Bun-version PASS is inferred from the local runner)
Endpoint:           http://127.0.0.1:3000/bb-mcp
Plugin permissions: net/fs/process pre-granted for id "mcp"
Blocking step:      user must click Plugins ▸ mcp ▸ Enable in desktop
                    Blockbench; server was not listening before that click
```

## Next Step

Proceed with the runbook (`docs/knowledge/operations/local-acceptance-runbook.md`) from step 4 once the plugin is enabled:

```text
1. health endpoint + tools/list count = 64
2. bun run verify:stateless-local
3. TEST 1 core mechanics (create/inspect → cubes incl. rotated → causal
   correction → undo/redo incl. depth rejection → texture/painter bounds
   rejection → PBR/material instance → small animation + Molang →
   manage_animation_effects → controller batch + undo → Locator/Null Object
   incl. no-op rejection)
4. persistence/export (.bbmodel + bedrock JSON via absolute temp paths;
   verify overwrite-consent refusal live)
5. efficiency log (total calls, discovery calls, redundant readbacks,
   place_cube batches, controller ops per call, capture counts)
```

Runtime questions this run must answer (recorded audit leftovers):

```text
flatten_layers compositing/data-loss suspicion
replaceOthers self-registration of undo casualties
native out-of-bounds paint disposition per wrap_mode
StateMemory 'brush_presets' initialization on first call
NoAAPreview mutation blast radius vs active_editor_camera_untouched
forEachChild traversal completeness (pinned design)
multi-tab behavior of newProject() on unsaved work
BarItems/settings ID currency behind setBarItemValue
slowloris idle timeout stays deliberately absent (loopback-only)
```

Keep continuation compact; historical rationale belongs in Git history.
