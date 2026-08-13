# Professional Animation Expression Keyframes — PRO-6

Date: 2026-08-13  
Scope: supplied professional `.bbmodel` evidence + current `Local` keyframe source + official Blockbench keyframe semantics  
Execution channel: ChatGPT → GitHub/static only  
Status: **IMPLEMENT NARROW STRING PRESERVATION; NO EVALUATOR**

## Evidence

The supplied animated samples contain 361 transform-axis values that are non-numeric strings: 165 in Anky and 196 in the Katana/player-integration sample. The expressions use normal Molang-style constructs such as `math.*`, `query.*` / `q.*`, `variable.*` / `v.*`, `this`, and a small number of conditional expressions.

They are authored animation values, not JavaScript instructions for BlockIT.

Current BlockIT already has the correct mutation owner: `manage_keyframes`. Its runtime path calls native `_Keyframe.set()`, while `inspect_animation` returns `keyframe.getArray()` values. The missing boundary was only the numeric-only Zod schema/type annotation.

`create_animation` is different: it constructs a Bedrock JSON payload and performs numeric authored-space → file-space sign conversion before native codec import. Supporting expressions there would require expression-safe file-space inversion. That is not necessary to close the basic authoring gap because `manage_keyframes` can create/edit transform keyframes after an animation exists.

## Minimal Contract

`manage_keyframes.keyframes[].values` accepts:

```text
finite number
[number|string, number|string, number|string]
non-empty scalar Molang string
```

String values are passed to native keyframe state unchanged. BlockIT does not parse or evaluate them. Whitespace-only strings are rejected.
Scalar number/string values use the existing uniform-keyframe path; three-component arrays remain per-axis values.

`create_animation` remains numeric-only. Bezier-handle arrays remain numeric-only.

## Safety / Non-goals

Do not add:

- `eval`, `risky_eval`, or a Molang evaluator;
- arbitrary numeric baking as a substitute for expressions;
- animation-controller support;
- sound/timeline-effect support;
- a new animation tool or expression profile.

## Acceptance

- explicit Molang transform strings pass `manage_keyframes` create/edit schema;
- whitespace-only strings fail;
- `create_animation` still rejects expression transform payloads;
- inspection preserves authored strings;
- typecheck/tests/build/docs freshness and existing surface budgets pass.
