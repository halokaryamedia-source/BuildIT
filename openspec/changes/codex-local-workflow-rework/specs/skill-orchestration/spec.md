# Skill Orchestration Specification

## Canonical skills

Upstream reference creation SHALL use `blockbench-reference-studio` from `engines/chatgpt/skills/`.

Production SHALL use only:

```text
blockbench-production
blockbench-geometry
blockbench-texture
blockbench-animation
blockbench-validation
```

Canonical production sources SHALL remain in `engines/shared/skills/`; `.agents` and `.codex` copies SHALL be synchronized adapters.

## Stage mapping

```text
BOOTSTRAP        → blockbench-production
GEOMETRY         → blockbench-production + blockbench-geometry
TEXTURE          → blockbench-production + blockbench-texture
ANIMATION        → blockbench-production + blockbench-animation
FINAL_VALIDATION → blockbench-production + blockbench-validation
```

No production stage SHALL load more than two skills. Animation SHALL NOT load when skipped.

## Context budget

The dispatcher SHALL resolve the selected asset and active stage from workspace/state authority. It SHALL call runtime status once at startup, call stage context only at stage entry/transition/revision, read only active-stage documents, and avoid loading unrelated production or repository-development skills.

## Writer and advisor selection

Exactly one Terra writer SHALL mutate the active asset. The Terra parent is default; `mcp_builder` is fallback when the parent differs or isolation is safer. Advisors SHALL remain read-only. Sol Medium SHALL be conditional rather than a mandatory stage step.

## Submission ownership

Stage skills SHALL NOT duplicate fresh validation immediately before a submission tool that already validates. Texture and Animation SHALL record a bound report then submit. Final Validation MAY perform one evidence-free preflight before final output generation, then record and submit.

## Separation from repository development

MCP source development SHALL load only the smallest relevant development authority. Production skills SHALL NOT be loaded for repository patching.

## Deprecated skills and flows

The workflow SHALL NOT use or recreate `blockbench-use`, `blockbench-modeling`, `blockbench-texturing`, numbered reference sheets, extra approval stages, repair profiles, reconnect instructions, or versioned replacement names.
