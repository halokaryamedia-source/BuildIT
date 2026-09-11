# LazyDesigner AI Context Loading

Updated: 2026-09-12

This document is the canonical contract for **what AI context to load for a task**. It exists to reduce broad reading, duplicate authority, and repeated context delivery without reducing decision quality.

## Objective

```text
TASK
→ resolve domain / stage
→ load minimum REQUIRED owners
→ add CONDITIONAL owners only for an unresolved material decision
→ execute
```

The goal is **minimum sufficient context**, not the smallest possible prompt.

## Authority Roles

```text
Docs     = durable semantic policy / contracts
Skills   = execution procedure and specialist operating instructions
Control  = task/stage/context selection and projection
Source   = current implementation/runtime truth
Ops docs = current continuation/proof only
```

Rules:
- do not load a full Skill and every related policy document as reassurance;
- when a Skill summarizes a durable rule, the canonical doc remains semantic authority;
- a Skill may carry the operational trigger needed to execute without restating the whole policy;
- load source only when implementation state can change the decision;
- load `05-operations/` only for continuation, proof interpretation, or local acceptance;
- unchanged large context should be reused by identity/hash when already available.

## Shared Authoring Stage Contract

Geometry, Texturing, and Animation share one cross-stage context/handoff owner:

```text
docs/04-system/authoring-stage-context.md
```

It owns:
- stage-specific context projection shape;
- evidence-reuse/economy rules;
- diagnostic PASS vs approval semantics;
- AUTHORING↔Animation handoff semantics;
- correction convergence;
- compact stage-exit projection.

Load it **once per oriented authoring task/session** and reuse it while unchanged. Specialist Skills should provide domain intelligence, not independent copies of this cross-stage policy.

## Load Classes

```text
REQUIRED     needed for the current decision
CONDITIONAL  load only when a material unresolved question requires it
EXCLUDED     do not load for this task by default
```

A missing CONDITIONAL document is not a reason to broaden into its whole sibling domain.

---

## 1. REFERENCE_PREPARATION

### REQUIRED

```text
current user intent + current source/reference images
.agents/skills/lazydesigner-reference-preparation/SKILL.md
docs/02-reference/flow.md
```

### CONDITIONAL

```text
docs/02-reference/policy.md
  → durable evidence/readiness question

.agents/skills/lazydesigner-prompt-compiler/SKILL.md
  → after blocking requirements are resolved
docs/02-reference/image/*
  → only when generating/editing reference imagery
docs/02-reference/package/*
  → only when building/validating Codex handoff package
```

### EXCLUDED

```text
docs/03-authoring/**
docs/04-system/control/**
docs/05-operations/**
PRODUCT_DEVELOPMENT Skills
```

Reference Preparation ends at an approved, consistent handoff package. It does not pre-author Blockbench geometry.

---

## 2. GEOMETRY

### REQUIRED

```text
current user intent / delta
actual approved reference image(s) relevant to geometry
GEOMETRY_CONTEXT projection
docs/04-system/authoring-stage-context.md (reuse when already loaded and unchanged)
.agents/skills/lazydesigner-modelling/SKILL.md
exactly one selected profile from docs/03-authoring/modelling/profiles/
```

`GEOMETRY_CONTEXT` should already contain only the relevant Reference Package / workspace subset defined by `control/context-projection.md`.

### CONDITIONAL

```text
docs/03-authoring/modelling/standard.md
  → durable geometry-policy question not sufficiently resolved by specialist procedure
docs/03-authoring/workflow.md
  → lifecycle/handoff/readiness ambiguity
docs/03-authoring/validation/visual.md
  → visual verdict/evidence policy ambiguity
additional reference package fields/views
  → only when the current geometry decision is blocked by missing evidence
```

### EXCLUDED

```text
full Reference Package
all modelling profiles
full texture standards
full animation standards
PRODUCT_DEVELOPMENT Skills
05-operations unless continuing/proving repository work
```

---

## 3. TEXTURING

### REQUIRED

```text
current user intent / texture delta
TEXTURE_CONTEXT projection
docs/04-system/authoring-stage-context.md (reuse when already loaded and unchanged)
.agents/skills/lazydesigner-texturing/SKILL.md
relevant approved material/reference views
current atlas / UV identity supplied by projection/runtime state
```

### CONDITIONAL

```text
docs/03-authoring/texture/standard.md
  → durable texture-policy ambiguity
docs/03-authoring/texture/material.md
  → material/PBR semantics are material to the task
docs/03-authoring/texture/render-profile.md
  → render-profile semantics are material
docs/03-authoring/texture/surface-pattern.md
  → pattern/continuity problem is material
docs/03-authoring/validation/visual.md
  → visual verdict ambiguity
bounded Geometry context
  → only for a proved upstream geometry/UV defect
```

### EXCLUDED

```text
complete modelling profile prose
complete Geometry construction history
complete Animation context
unrelated material sub-standards
PRODUCT_DEVELOPMENT Skills
```

---

## 4. ANIMATION

### REQUIRED

```text
current user intent / animation delta
ANIMATION_CONTEXT projection
docs/04-system/authoring-stage-context.md (reuse when already loaded and unchanged)
.agents/skills/lazydesigner-animation/SKILL.md
relevant approved pose/motion reference views
current participating rig + clip identity supplied by projection/runtime state
```

### CONDITIONAL

```text
docs/03-authoring/animation/standard.md
  → durable animation-policy ambiguity
docs/03-authoring/validation/visual.md
  → motion/visual verdict ambiguity
bounded Geometry context
  → only when a proved rig/pivot/clearance defect requires upstream handoff
```

### EXCLUDED

```text
full modelling profile
full texture/UV atlas context
nonparticipating geometry
unrelated clips/controllers
PRODUCT_DEVELOPMENT Skills
```

---

## 5. SYSTEM_DEVELOPMENT

### REQUIRED

```text
current development request
root AGENTS.md + GITHUB_RULES.md
exact source owner(s)
docs/04-system/implementation-map.md when ownership is not already exact
matching PRODUCT_DEVELOPMENT Skill only when its reusable procedure materially helps
```

Canonical PRODUCT_DEVELOPMENT Skills:

```text
lazydesigner-mcp-development
lazydesigner-blockbench-development
lazydesigner-development-brief
```

### CONDITIONAL

```text
docs/05-operations/next-action.md
  → only when continuing unfinished repository work
CONTEXT.md
  → stable project fact materially affects the decision
docs/04-system/skill-taxonomy.md
  → Skill ownership/naming question
docs/04-system/control/context-projection.md
  → Control projection implementation/change
docs/01-product/flow.md
  → product boundary/flow is itself being changed
03-authoring / 02-reference owner
  → only when development explicitly changes that semantic contract
```

### EXCLUDED

```text
all Skills by default
all docs domains by default
full repository scan
05-operations local acceptance unless live acceptance is explicitly active
```

Clear bounded changes go directly to the exact source owner. `lazydesigner-development-brief` is not a mandatory development preamble.

---

## Correction / Continuation Rule

For an already-oriented task:

```text
current delta
+ still-valid context identity/hash
+ affected owner
+ affected fresh state
→ continue
```

Do not reload the initial package, profile, shared stage contract, or sibling domain unless the current delta invalidated that context.

## Broadening Rule

Broaden context only when all are true:

```text
1. a named material question is unresolved
2. the current REQUIRED context cannot answer it
3. the additional owner is known
4. reading it can change the next decision
```

Otherwise do not broaden.

## Completion Criterion

AI context loading is correct when:
- the task has one resolved domain/stage;
- the shared authoring-stage contract is loaded at most once while unchanged;
- only one primary specialist is active for that semantic owner;
- only one primary modelling profile is loaded when Geometry needs one;
- sibling domains remain unloaded unless a proved dependency crosses the boundary;
- operational history/status is not loaded as general knowledge;
- repeated unchanged context is reused rather than resent;
- no task uses `read all docs` as a normal boot step.
