# Professional Authoring Expressiveness — Phase 2

Date: 2026-08-13  
Scope: GitHub/static + supplied professional `.bbmodel` evidence  
Status: **VALIDATED — ONE MATERIAL `place_cube` BOTTLENECK**

## Purpose

Validate whether the Phase 1 professional-modelling reasoning can be expressed through the current normal MCP surface without adding presets, asset classes, planners, or new tool families.

Professional sample files are **evidence only**. Their anatomy, Cube counts, hierarchy depth, names, rotations, UV layout, and object category are not product rules.

## Representative Task

Primary representative: `Sample_samurai(1).bbmodel` supplied by the user.

Observed final authored structure:

```text
64 Cubes
39 Groups
36 distinct Cube parent Groups
23 Cubes with non-zero inflate
23 rotated Cubes
21 rotated Groups
1 Locator
```

This task is useful because it exercises the Phase 1 decisions together: layered geometry, local Cube rotation, Group/Bone transform ownership, hierarchy, and identity-weighted detail.

## Current-Surface Replay

Current `place_cube` accepts one top-level `group` for the whole request. Therefore known Cubes that belong to different Groups must be split by parent even when all target Groups are already known.

For the Samurai sample:

```text
36 distinct Cube parent Groups
→ minimum 36 place_cube calls for correct parent ownership
```

Current `place_cube` does not accept initial `inflate`. `modify_cube` does, while `modify_cubes_batch` does not expose `inflate`.

For the same sample:

```text
23 inflated Cubes
→ minimum 23 additional modify_cube calls only to author known layer state
```

Before any visual correction, texture work, Locator work, or Group creation cost:

```text
36 place_cube
+ 23 modify_cube for known inflate
= 59 geometry mutation calls
```

This is not a quality score or runtime benchmark. It is a lower-bound call count derived from the current public contracts and the supplied authored structure.

## Cross-Sample Sanity Check

The pattern is not unique to Samurai. A bounded structural check of the other supplied professional samples found the same parent-fragmentation pattern, often combined with non-zero `inflate`:

| Sample | Cubes | Distinct Cube Parents | Non-zero Inflate | Current lower-bound place + inflate calls |
|---|---:|---:|---:|---:|
| Samurai | 64 | 36 | 23 | 59 |
| Anky | 61 | 57 | 11 | 68 |
| Dragon Boss | 200 | 107 | 27 | 134 |
| Katana | 27 | 22 | 16 | 38 |
| Skeleton Spinosaurus | 69 | 38 | 5 | 43 |
| Ninja Master | 33 | 22 | 15 | 37 |
| Dragon Helmet | 22 | 14 | 2 | 16 |
| Helicopter | 50 | 11 | 6 | 17 |
| Outdoor Table | 12 | 5 | 0 | 5 |

These figures are evidence that the contract friction is structural, not a Samurai preset requirement.

## Diagnosis

The problem is **not missing modelling intelligence** after Phase 1 and does not require a new tool family.

The mismatch is narrower:

```text
reasoning already knows:
- the correct parent Group/Bone for each Cube
- whether a Cube is a deliberate inflated layer

current creation contract forces:
- batching by one shared parent
- a second mutation for known inflate state
```

This creates repeated authoring activity for decisions that are already resolved.

## Minimal Source Change

Only one existing tool needs to become more creation-complete:

### `place_cube`

Add two optional per-element authored fields:

```text
group   optional Group UUID / unique exact name override
inflate optional finite Bedrock Cube inflation
```

Compatibility rule:

```text
element.group supplied → use that explicit parent
element.group omitted  → use existing top-level group default
both omitted            → intentional root, same current behavior
```

Execution rule:

- resolve/preflight every referenced Group before `Undo.initEdit`;
- any missing/ambiguous explicit Group fails the whole request before mutation;
- apply finite `inflate` in the initial Cube authored state;
- keep current rotation/pivot, UV mode, identity, Undo, and result semantics;
- return final authored state as today.

With Groups already created, the representative 64-Cube Samurai geometry/layer state can then be expressed in one coherent creation request rather than 59 geometry mutations. This does **not** remove visual gates or justify creating all detail at once; batching is execution efficiency after modelling decisions are already made.

## Explicitly Not Included

Do **not** bundle these into this change:

- mirror-UV optimization;
- per-Cube texture selection;
- Group batch creation;
- rig generator;
- asset/category preset;
- hierarchy-depth target;
- professional-detail profile;
- automatic planner;
- any object-specific rule from the samples.

Those require separate evidence. `No change required` remains valid for them.

## Proof Boundary

`CURRENT-PROJECT VERIFIED`:

- current `place_cube` has one top-level Group target;
- current `modify_cube` exposes `inflate`;
- current `modify_cubes_batch` does not expose `inflate`;
- supplied professional structures reproduce material repeated authoring under that contract.

`LOCAL / BUILD PROOF REQUIRED` for the implementation:

- schema/typecheck/test/build success;
- runtime Blockbench parent placement and initial inflate behavior;
- generated MCP docs freshness;
- actual model-facing authoring-call reduction.

## Decision

```text
PHASE 2 RESULT: MATERIAL BOTTLENECK REPRODUCED
APPROVED NEXT CHANGE: enrich existing place_cube only
NO NEW TOOL / PRESET / PROFILE / PLANNER
```
