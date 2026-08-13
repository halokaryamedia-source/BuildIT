# Professional Animation Controller Prioritization — 2026-08-13

Status: **BOUNDED INSPECTION APPROVED; AUTHORING/MUTATION DEFERRED**

## Scope

Static forensic review of the nine supplied professional `.bbmodel` samples plus the native Blockbench `AnimationController` / `AnimationControllerState` model. No local Blockbench/Codex run was performed. Final `.bbmodel` structure proves authored state, not original authoring sequence or runtime correctness.

## Sample Evidence

Four of nine samples contain controllers: Ninja Master, Weapon Katana, Helicopter, and Anky. Across them:

- 21 AnimationControllers
- 84 states
- 187 ordered transitions
- 169 ordered animation links
- 93 non-empty animation blend-value expressions
- 42 states with non-zero blend transition
- 2 non-empty `on_entry` scripts
- 3 controller-state particle entries
- 35 animation links with a preserved authored key but no loaded animation UUID

The supplied set contains no controller-state sound entries, non-empty `on_exit`, blend-transition curves, or shortest-path flags. Those absences are sample facts only, not product rules.

## Native Ownership

Blockbench models controllers as a separate `AnimationController extends AnimationItem`. Each `AnimationControllerState` owns animations, transitions, particles, sounds, `on_entry`, `on_exit`, blend transition state, and state identity. Bedrock compilation preserves animation keys, transition target state names, and array order. Local animation UUID resolution is optional: an authored animation key can remain valid even when its referenced Animation is not loaded in the project.

## Decision

Controller **creation/mutation is not a bounded extension of `create_animation` or `manage_keyframes`**. A correct authoring contract would need state identity/order, initial-state ownership, ordered transitions with Molang conditions, animation-key versus optional loaded-UUID semantics, blend-value expressions, state effects/scripts, and mutation/Undo rules. Folding that into an existing transform-keyframe tool would create ambiguous ownership and a large schema. No controller framework or new mutation tool is justified from this pass.

Read-only controller inspection **is** bounded and belongs to existing `inspect_animation` because Animation and AnimationController share the native AnimationItem selection/identity surface. The approved closure adds an optional focused `state` selector, compact state summaries, and focused authored state detail. It never evaluates transition/blend/on-entry Molang and does not preview or mutate controller execution.

## Explicit Non-Goals

- no `create_animation_controller` / `manage_animation_controller` tool
- no controller evaluator or transition simulator
- no automatic animation-key resolution requirement
- no controller preset/state template
- no local preview/runtime claim

## Stop Condition

After bounded inspection closure, do not expand controller authoring from sample evidence alone. Reopen only with a concrete user authoring requirement and a narrowly proven native ownership path.
