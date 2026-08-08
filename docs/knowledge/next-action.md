# Next Action

This is the **single active-task snapshot**. A new ChatGPT or Codex session reads
this after `AGENTS.md` and `CONTEXT.md` and continues from here instead of
reconstructing prior chats.

## Active Task

- **Goal:** solve gross Reference Image / Modelling Brief → Blockbench geometry
  divergence by making modelling decisions evidence-backed instead of
  assumption-driven.
- **Status:** `REFERENCE_FIDELITY_OBSERVATION_CONTRACT_FROZEN`.
- **Execution now:** ChatGPT → GitHub architecture/source work.
- **Local testing:** explicitly deferred by current user priority.
- **G3:** paused.
- **Root-cause review:**
  `docs/knowledge/reviews/mcp-reference-fidelity-root-cause.md`.
- **Observation contract:**
  `docs/knowledge/reviews/mcp-reference-fidelity-observation-contract.md`.

## Confirmed Failure Evidence

Prior modelling tests repeatedly showed:

1. the agent can place Cubes mainly because they can be made to fit/attach, then
   treat "all Cubes are placed" as approval even when the model is visibly far
   from the reference;
2. rotation values can become arbitrary/overcomplicated without a clear visible
   slope/orientation reason;
3. pivot/origin values can become abstract or distant because they are filled as
   numeric fields instead of being chosen from a real joint/attachment/transform
   relationship.

Foundation/modelling rules are already hardened against those behaviors.

## Reference Fidelity Loop v1

```text
APPROVED REFERENCE
↓
CROSS-VIEW CONSISTENCY
↓
COORDINATE FRAME + TARGET ENVELOPE
↓
NORMALIZED PRIMARY FORM HYPOTHESIS
↓
COARSE PRIMARY BLOCKOUT
↓
STRUCTURAL ENVELOPE OBSERVATION
↓
CANONICAL MODEL VIEWS
↓
REFERENCE ↔ MODEL COMPARISON
↓
GLOBAL OR LOCAL FAILURE?
  │
  ├─ GLOBAL → revise/rebuild primary hypothesis
  │
  └─ LOCAL → inspect exact authored state → causal correction
↓
FRESH AFFECTED EVIDENCE
↺ until primary form passes or hypothesis is abandoned
↓
SECONDARY GEOMETRY / HIERARCHY / TEXTURE / OPTIONAL ANIMATION
```

## Frozen Read-Only Observation Contract

### `inspect_model_bounds`

v1 is deliberately small:

```text
input: {}
active project only
whole model only
read-only
```

It reports raw facts only:

```text
project identity
has_geometry / cube_count
rendered-current-pose bounds basis
min / max / center
size XYZ
semantic width / height / length
XZ footprint
animation/timeline pose context
warnings
```

Requirements:

- bounds must describe the currently rendered model geometry, including Cube
  rotation and visually-active parent/group transforms;
- no fabricated default bounds when runtime inspection fails;
- empty project returns `has_geometry=false` + `bounds=null`;
- no target/tolerance input is needed; the modeller compares the raw result with
  the already-approved target envelope;
- no `PASS`, `within_tolerance`, correction delta, reanchor suggestion, or visual
  score.

Important implementation warning: Sample's rotation-aware `calculateBounds` is
useful evidence but cannot be copied blindly if the implementation would ignore
visually-active parent/group transforms. The claimed bounds semantics must match
what the model actually renders as.

### `capture_model_views`

Minimal input:

```text
views: 1–5 unique named views
front_direction: +z | -z
framing:
  model
  OR explicit min/max target envelope
```

Named views:

```text
front
back
left
right
top
bottom
front_left_3q
front_right_3q
```

Requirements:

- active project only; no project selector/tab switching;
- fixed 512×512 PNG output and fixed small framing padding;
- front/back/left/right/top/bottom are true axis-aligned **orthographic** views;
- no hidden vertical elevation on principal views;
- front direction is explicit and has no default;
- left/right semantics are object-relative to that front direction;
- 3/4 views are stable perspective context views, not metric evidence;
- `framing=model` uses the exact same trustworthy rendered-bounds reader as
  `inspect_model_bounds`;
- `framing=explicit` frames the caller-provided target envelope and must **not**
  silently zoom out to include out-of-envelope geometry;
- content ordering is labeled text + actual MCP image for each requested view;
- no file-output mode in v1;
- no custom camera, texture, animation, particle, or selected-element scope in
  v1;
- camera state is snapshotted and restored in `finally`; restoration failure is
  a tool failure, not a successful result;
- project, selection, mode/tool, texture, animation/time, and model state are not
  changed.

Local already has the correct low-level inline image response shape through
`imageContent()` (`type=image`, base64 data, `image/png`). Whether a specific
Codex/client configuration exposes that content to a vision-capable model remains
a later `LOCAL PROOF REQUIRED` claim and is not the current blocker.

## Why The Sample Tool Is Not Copied Whole

Keep from Sample:

```text
named views
deterministic framing
inline images
structured capture metadata
finally-based restoration
```

Drop for Local v1:

```text
project switching
file output
custom camera input
texture variants
animation/time controls
particle controls
visible-alpha framing
selected framing
payload configuration surface
```

Also change the principal-camera semantics: Sample's front/back/left/right
presets contain a small elevation offset. Local reference-fidelity views must be
true axis-aligned orthographic views for direct comparison.

## Shared Bounds Rule

There must be **one** internal rendered-bounds definition reused by both public
observation tools.

Do not implement:

```text
inspect_model_bounds → bounds algorithm A
capture_model_views  → separate bounds algorithm B
```

Contradictory structural and visual framing evidence would recreate the same
assumption problem this work is intended to remove.

## Implementation Order

```text
1. trustworthy internal rendered-bounds reader
2. public inspect_model_bounds using it
3. capture_model_views reusing the same reader
4. only then inspect_element / modify_cubes_batch
```

The first public implementation is `inspect_model_bounds` even though canonical
capture has higher product visibility, because capture framing depends on the
same correct bounds definition.

## Holds

- **G1/G2:** source corrections remain implemented; local proof deferred.
- **Slice A:** goal-oriented prompt source remains implemented; local proof is not
  the active blocker.
- **G3 annotations:** paused.
- **G4 screenshot restoration:** do not patch separately; canonical capture owns
  its own strict camera restoration and avoids project switching entirely.
- **G5 bone-rigging Undo preflight:** held until hierarchy runtime work resumes.
- `inspect_element`, `modify_cubes_batch`, mutation safety, UV additions, and
  public-surface reduction remain later slices.

## Do Not Reintroduce

- per-Cube approval/planning ceremony;
- first-Cube/support/section-first rules;
- automatic image→Cube conversion;
- SF3D/mesh decomposition;
- IoU/projection/similarity authority;
- all-in-one Bedrock builder;
- arbitrary rotation/pivot helpers;
- detail generation before whole-form pass;
- dynamic Rework profile/state/lease machinery.

## Next Step

Implement **only the shared rendered-bounds reader + public
`inspect_model_bounds`** contract in Local. Do not implement `capture_model_views`,
mutation tools, or resume G3 in the same slice. Static GitHub proof should verify
schema/registration/output ownership; live rendered-bounds correctness remains
`LOCAL PROOF REQUIRED` until the user chooses to run local Blockbench testing.
