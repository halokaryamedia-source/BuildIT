# Next Action

Updated: 2026-08-13

This is the **single active repository-continuation snapshot**. Root `AGENTS.md` owns routing; `flow.md` owns the detailed current sequence; `docs/foundation/validation-report.md` owns accepted proof detail.

## Status

```text
PROFESSIONAL_AUTHORING_EXPRESSIVENESS_PHASE2_VALIDATED
```

Working branch: **`Local` only**.

Professional `.bbmodel` samples supplied by the user remain **learning evidence only**. They do not become presets, asset classes, anatomy rules, target Cube counts, hierarchy-depth targets, copied rotations, or complexity targets.

Do not claim live Blockbench/model-quality improvement without actual local/runtime proof.

## Retained Accepted State

```text
P0–P4  routing / deferred loading / bounded recovery / defect navigation
P5     semantic form / orientation / pivot / contact
P6     actual-reference grounding + claim/view locking
P7     qualitative correction convergence + evaluation integrity
REF    assisted intake + pre-generation readiness + buildable multi-view reference
PRO-1  representation reasoning + transform ownership + primary hierarchy timing + identity-weighted detail
```

No P8 architecture, professional preset framework, asset classifier, geometry planner, automatic rig generator, new registration profile, router, scorer, or recovery system was added.

## Phase 2 Result

Representative validation used the supplied professional Samurai model because it combines layered geometry, Cube rotations, Group/Bone transform ownership, hierarchy, and identity-weighted detail.

Observed structure:

```text
64 Cubes
39 Groups
36 distinct Cube parent Groups
23 Cubes with non-zero inflate
23 rotated Cubes
21 rotated Groups
1 Locator
```

Current normal MCP contract requires at least:

```text
36 place_cube calls
  because one request has one shared top-level group

23 additional modify_cube calls
  because known inflate cannot be authored during place_cube

= 59 geometry mutation calls before visual correction
```

This is a static lower bound from the current contracts, not a runtime benchmark or quality score.

A bounded cross-check of the other supplied professional samples reproduced the same parent-fragmentation pattern and, on layered assets, the same known-inflate second mutation. Detailed evidence lives in:

`docs/knowledge/reviews/professional-authoring-expressiveness-2026-08-13.md`

## Diagnosis

The Phase 1 reasoning is expressive enough. The reproduced friction is now a **narrow creation-contract mismatch**:

```text
modeller already knows:
- each Cube's correct Group/Bone parent
- whether a Cube is an intentional inflated layer

place_cube currently forces:
- batching by one shared parent
- a second mutation for known inflate
```

This is material repeated work and is now sufficient evidence for one source change.

## Approved Next Change

```text
PHASE 3 — PLACE_CUBE CREATION COMPLETENESS
```

Modify the **existing** `place_cube` only.

### Add per-element authored state

```text
element.group
  optional Group UUID / unique exact-name parent override

element.inflate
  optional finite Bedrock Cube inflation
```

Compatibility:

```text
element.group supplied → explicit per-Cube parent
element.group omitted  → existing top-level group default
both omitted            → intentional root, same current behavior
```

Execution requirements:

- preflight all explicit Group references before `Undo.initEdit`;
- ambiguous/missing explicit parent fails the whole request before mutation;
- initial finite `inflate` is part of Cube creation, not a follow-up correction;
- preserve current rotation/pivot, UV, Undo, identity, structured-result, and visual-verdict semantics;
- update the existing public schema description and generated docs through their owner;
- add targeted regression coverage for compatibility, preflight, and absence of preset/profile behavior.

## Explicitly Out Of Scope

Do **not** bundle any of the following into Phase 3:

- mirror-UV creation optimization;
- per-Cube texture selection;
- Group batch creation;
- rig generator;
- asset/category preset;
- professional detail profile;
- hierarchy-depth target;
- automatic geometry planner;
- object-specific rules from the samples.

Those remain unapproved until separate evidence proves material need.

## Build / Proof Boundary

The Phase 3 public MCP schema change must follow `mcp/AGENTS.md`:

```text
source owner
→ targeted tests
→ generated docs through docs:build
→ typecheck
→ test
→ build
→ docs:check
```

Current ChatGPT→GitHub static inspection can prove the Phase 2 contract mismatch, but it cannot safely substitute for generated-doc/build ownership or live Blockbench behavior.

`LOCAL / BUILD PROOF REQUIRED` for Phase 3 completion:

- schema/typecheck/test/build success;
- generated docs freshness;
- actual Blockbench per-element parent + initial inflate behavior when runtime proof is activated.

## Continuation Boot

```text
AGENTS.md
→ this file
→ affected mcp owner + mcp/AGENTS.md
→ development-brief
→ mcp-server-development
```

## Next Step

Implement **Phase 3 — `place_cube` creation completeness** as the smallest public-contract change. Do not add another tool. If a build-capable execution channel cannot regenerate/verify public docs safely, stop before leaving the branch with a stale public contract.
