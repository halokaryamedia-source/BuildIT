# Next Action

Updated: 2026-08-14

## Status

```text
PRELOCAL_CONTROLLER_MUTATION_READY
```

Working branch: **`Local` only**. `NO LOCAL RUN ACTIVE`.

Retained state: **P0–P7 + REF + PRO-1–PRO-8 + U1–U7**. Local acceptance remains explicitly deferred.

Current repository capability closure adds:

```text
AnimationController create/state-machine mutation
→ one manage_animation_controller tool
→ up to 32 ordered coherent operations
→ one native animation_controllers Undo unit
→ complete plan preflight before native mutation
→ unexpected apply failure rolls back the open Undo edit
→ returned controller + affected state/IDs are continuation state
→ no automatic inspect_animation readback
→ no new registration family/profile/router/framework
```

Supported controller mutations cover controller rename, state add/update/remove, initial state, transitions, animation links, on_entry/on_exit, scalar blend transition, and shortest-path blend flag.

Still protected: controller-state particle/sound and blend-curve mutation, existing-animation direct sound/timeline-effect mutation, TextureMesh, native visible bounding-box fields, animated textures, and bone-binding expressions.

Optimization boundary remains unchanged:

```text
U7  No change required — no lean profile/router/runtime-prompt redesign without installed-client evidence
```

The default surface is now **63 tools**. The max-per-tool serialized ceiling remains **3,200 characters**; the capability does not justify relaxing that guard. Exact current serialized metrics are emitted by `bun run measure:surface` and are not installed-client token proof.

Installed-plugin freshness, live controller behavior/execution, runtime/model behavior, actual call efficiency, and persistence remain **LOCAL PROOF REQUIRED**.

**Do not claim live Blockbench/model-quality improvement without actual runtime proof; runtime-usage improvement also requires direct runtime evidence.**

## Local Acceptance Boundary

```text
LOCAL ACCEPTANCE DEFERRED
```

The user has explicitly deferred local testing. `docs/knowledge/operations/local-acceptance-runbook.md` remains the single procedure owner but is **inactive**. Do not execute its build/freshness/runtime steps and do not silently reactivate it from repository readiness alone.

Reference generation remains separately gated:

```text
WAIT FOR FRESH EXPLICIT USER GENERATION COMMAND
```

## Next Step

```text
PRELOCAL / REPOSITORY
→ controller-mutation static closure complete
→ no local test active
→ continue only from a fresh concrete user instruction or newly evidenced repository issue
→ local runbook requires fresh explicit reactivation
```

No speculative controller runtime framework, new profile, generic evaluator, compatibility layer, telemetry system, or persistent controller registry is justified.
