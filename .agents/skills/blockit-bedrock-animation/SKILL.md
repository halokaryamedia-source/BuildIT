---
name: blockit-bedrock-animation
description: Specialist for Minecraft Bedrock Entity animation through BlockIT MCP. Use for existing-animation inspection, BoneAnimator transforms, keyframes, graph interpolation, Group/bone rig changes, timeline playback/settings, batch/copy operations, and mapped particle effects. Preserve unsupported native controller/sound/timeline-effect capabilities as explicit gaps instead of emulating them.
---

# BlockIT Bedrock Animation

Own animation execution only after the model hierarchy and pivots are suitable for the requested motion.

## Preflight

1. Reuse project lifecycle/format state already returned by the current workflow. Call `get_project_info` only when the active project format/state is unknown, stale, or missing a field needed by the animation decision.
2. Reuse known Group/bone UUIDs from creation/mutation/discovery results. Call `list_outline` only when a participating identity or hierarchy relationship is still unknown.
3. For an existing animation, call `inspect_animation` before mutation. Use its authored transform channels/effect summary instead of inferring current keyframes from a screenshot.
4. If pivot/hierarchy judgement is unclear, route the modelling decision to `blockbench-bedrock-modelling` before editing animation.

## Animation Readiness Gate

For end-to-end reference-driven creation, production animation begins only after the geometry baseline relevant to the requested motion is accepted and the participating Group/bone hierarchy and pivots are inspected and suitable. A material geometry `FAIL`, unresolved attachment, or pivot/hierarchy uncertainty that affects the motion returns to modelling before keyframe production. A required unresolved claim may become `BLOCKED`; do not animate around it.

For an animation-only revision on an existing asset, the current geometry may be treated as the user-provided baseline when remodelling is outside scope. This does not certify the static model as reference-accurate. Inspect the participating bones/pivots and existing animation state needed for the requested motion.

A small diagnostic pose/playback may be created before production animation when it is specifically testing a pivot, attachment, or transform direction. Keep it disposable and do not count it as animation progress or completion evidence.

If material geometry, hierarchy, or pivots change after animation work starts, consider animation on the affected bones stale until re-inspected and previewed. Re-check keyframe values, transform arcs, attachments, clipping, and return-to-neutral behavior as applicable. Existing animation effort is never a reason to preserve a bad rig or geometry baseline.

## Directly Mapped Animation Surface

- `create_animation` — uses the current Bedrock AnimationCodec and accepts authored transform keyframes plus mapped particle effects.
- `inspect_animation` — read-only authored Animation/BoneAnimator/keyframe/particle state.
- `manage_keyframes` — create/edit/delete/select transform-channel keyframes.
- `animation_graph_editor` — interpolation/Bezier curve adjustment.
- `bone_rigging` — Group/bone structure and pivot operations with explicit targets.
- `animation_timeline` — playback/time/length/FPS/loop controls.
- `batch_keyframe_operations` — bounded multi-keyframe timing/value operations.
- `animation_copy_paste` — copy/paste/mirror between explicit Group/Animation targets.

Use Group UUIDs whenever possible. Bedrock animation import matches bone names case-insensitively, so duplicate/colliding names are a real determinism problem, not something to guess around.

## Create Versus Edit

For a new animation:

- establish the intended motion and which bones participate;
- verify pivots first;
- keep transform values in the authored Blockbench space expected by the tool;
- create the minimum keyframes needed for the motion;
- inspect the created animation afterward.

For an existing animation:

- inspect first;
- diagnose which bone/channel/time is wrong;
- edit only the affected keyframes or curve range;
- re-inspect and visually preview the affected motion.

## Timeline Caution

Do not make `animation_timeline.select_range` a dependency for core correctness until its live Blockbench lifecycle behavior is explicitly accepted locally. Prefer explicit keyframe/time ranges on the editing tools when available.

## Mapped Effects

Particle effects are currently mapped through `create_animation.particle_effects` and surfaced by `inspect_animation.effects`. Preserve Locator names referenced by particles; a particle locator string does not mean direct Locator authoring is implemented.

## Protected Native Animation Gaps

Blockbench Bedrock Entity natively supports more than the current direct MCP authoring surface. Keep these as explicit protected gaps when no direct tool exists:

- animation controllers;
- sound-effect keyframes;
- timeline-effect keyframes;
- direct Locator/NullObject authoring used by effects;
- bone-binding expressions.

Do not fake these with `risky_eval`, `trigger_action`, dialog filling, arbitrary UI clicks, or generic model export. If the requested deliverable requires one, report the current MCP gap and preserve existing authored data rather than silently substituting another feature.

## Verification

After animation mutation:

- `inspect_animation` for authored-state continuity;
- preview/play only as needed to inspect motion;
- use canonical/model screenshots where pose silhouette or clipping matters;
- verify attachment, transform arc, clipping, and return-to-neutral behavior relevant to the request;
- do not claim in-game/controller behavior without the corresponding direct capability and local/game evidence.
