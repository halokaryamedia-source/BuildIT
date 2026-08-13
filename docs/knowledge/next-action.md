# Next Action

Updated: 2026-08-13

Single active repository-continuation snapshot. Root `AGENTS.md` owns routing; `flow.md` owns detailed product sequence; `docs/foundation/validation-report.md` owns proof state.

## Status

```text
PROFESSIONAL_STATIC_PRELOCAL_CONSOLIDATION_COMPLETE
```

Working branch: **`Local` only**.

The user explicitly does **not** want local Codex/Blockbench testing yet. `NO LOCAL RUN ACTIVE`. Professional samples remain learning evidence, never presets/templates/count targets.

Do not claim live Blockbench/model-quality improvement without actual runtime proof. Controller execution also requires direct runtime evidence.

## Retained State

```text
P0–P7  existing routing / grounding / convergence contracts
REF    assisted reference intake/readiness
PRO-1  professional construction reasoning
PRO-2  authoring expressiveness validation
PRO-3  place_cube parent + initial inflate completeness
PRO-4  geometry/texturing/animation forensic audit
PRO-5  modify_cubes_batch Box-UV parity
PRO-6  manage_keyframes explicit Molang transform-string preservation
PRO-7  create_animation + inspect_animation Bedrock sound-effect closure
PRO-8  inspect_animation AnimationController/state read-only closure; authoring deferred
```

No P8 architecture, preset/profile, evaluator, planner, controller framework, new tool family, or local test was added. Current proof/ownership/README/task/review owners are synchronized through PRO-8.

## PRO-6 Contract

`manage_keyframes` create/edit may author finite numbers or non-empty Molang strings in transform values. Strings are preserved into native `_Keyframe` state; BlockIT never evaluates them. `inspect_animation` returns authored `getArray()` values.

Scalar number/string values use the existing uniform-keyframe path; three-component arrays remain explicit per-axis values.

`create_animation` intentionally remains numeric-only because it owns a separate codec/file-space conversion path. Expression support there is not required for the bounded gap.

## PRO-7 Contract

`create_animation.sound_effects` authors bounded Bedrock sound events by unique finite non-negative timestamp. Each event requires a non-empty Bedrock `effect` identifier and may carry an optional Locator name. Multiple sound events at one timestamp remain a non-empty array under that one timestamp.

`inspect_animation.effects.sound` reports sound keyframe/event counts by default and returns authored `effect` / optional `locator` data when `include_effect_keyframes=true`.

The local audio-preview `file` path is intentionally **not** part of the BlockIT sound contract because Blockbench uses it for editor preview while Bedrock compilation owns `effect` / `locator`. Existing-animation direct sound mutation remains deferred; no `manage_sound_keyframes` tool or media subsystem was added.

## PRO-8 Contract

`inspect_animation` now resolves either a native Animation or AnimationController through the existing AnimationItem identity surface. For controllers it returns read-only controller identity, initial-state identity, ordered state summaries, and optional focused `state` detail.

Focused controller-state inspection preserves authored animation keys even when no local Animation UUID is loaded, ordered transitions with target UUID/name plus Molang condition text, animation blend values, state effects/scripts, and blend-transition state. BlockIT does **not** evaluate transition/blend/on-entry Molang and does not simulate controller execution.

Controller creation/mutation remains intentionally deferred. A correct mutation surface would need state identity/order, initial-state ownership, ordered transition semantics, external animation-key handling, Molang conditions/blend values, state effects/scripts, and Undo rules. No `create_animation_controller`, `manage_animation_controller`, controller evaluator, or controller framework was added.

## Still Deferred

```text
animation controller creation/mutation
existing-animation sound-effect mutation
timeline-effect keyframes
bone-binding expressions
```

Do not fake them with `risky_eval`, generic UI automation, arbitrary numeric baking, or a new framework.

## Verified GitHub / CI State

```text
typecheck                     PASS
contract tests                218 PASS / 0 FAIL
default MCP surface           PASS
production build              PASS
generated docs freshness      PASS
```

Fresh serialized surface after PRO-8:

```text
initialize instructions:       386 characters
tool count:                     62
tools/list response:            76,439 characters
tools array:                    76,395 characters
input schemas:                  53,493 characters
descriptions:                   10,645 characters
per-tool payload:               p50 1,082 / p90 2,149 / p95 2,268 / max 3,167
create_animation payload:       3,126 characters
runtime workflow prompt:        6,995 characters
```

These are serialized characters, not model-visible token measurements. Existing ceilings remain unchanged: per-tool payload max 3,200 and runtime workflow prompt <7,000.

## Verification Boundary

Required retained GitHub gate:

```text
frozen install → typecheck → tests → measure:surface → build → docs:check
```

Normal `MCP Verify` on retained `Local` is the final static/CI authority. Static/CI proof establishes schema/type/result/docs consistency only. Native controller selection/persistence, controller execution, sound playback/export behavior, Molang evaluation, and visual motion quality remain `LOCAL PROOF REQUIRED` if local testing is later reactivated.

## Next Step

```text
NON-LOCAL STOP — NO FURTHER SAMPLE-DRIVEN SOURCE EXPANSION
```

The professional sample audit now has bounded closures for geometry creation, Box-UV batch state, Molang transform keyframes, sound events, and controller inspection. Controller creation/mutation remains intentionally deferred because it requires state-machine ownership rather than a small existing-tool extension. The supplied samples contain no timeline-effect keyframes and do not justify a new controller/evaluator framework.

Keep local testing deferred until the user explicitly reactivates it. There is no remaining justified sample-driven non-local source task after this synchronization; reopen only from a concrete new authoring requirement or new evidence that demonstrates a bounded missing capability.
