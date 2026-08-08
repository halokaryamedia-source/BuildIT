# MCP Reference Fidelity — Observation Contract v1

**Status:** DESIGN FROZEN FOR IMPLEMENTATION  
**Date:** 2026-08-08  
**Scope:** Minimal read-only MCP observation needed by the Reference Fidelity Loop.

## 1. Purpose

The current product failure is gross divergence between an approved visual
reference and the Blockbench model even when Cube mutation calls succeed.

The observation layer must give the vision-capable modeller two kinds of facts
without pretending to judge resemblance:

```text
inspect_model_bounds
→ structural fact: where/how large is the current rendered model?

capture_model_views
→ visual fact: what does the current model look like from stable named views?
```

These tools do **not** decide whether the model is good. They exist so the agent
can compare evidence instead of assuming that placed/attached Cubes are correct.

## 2. Design Principles

1. **Read-only means state-neutral.** Observation must not leave a different
   project, selection, camera, mode, texture, animation, or tool state behind.
2. **No silent fallback to invented data.** If trustworthy geometry/camera data
   cannot be obtained, return an actionable error or explicit limitation.
3. **No automatic resemblance authority.** No `PASS`, similarity score, IoU,
   projection score, visual classification, or automatic correction.
4. **Global observation first.** These v1 tools inspect/capture the active whole
   model. Local element diagnosis belongs to the later `inspect_element` slice.
5. **Active project only.** Normal BlockIT modelling keeps one active model per
   task. v1 observation therefore does not accept a project selector and does
   not switch tabs.
6. **Stable comparison beats configuration breadth.** Fixed output dimensions,
   fixed camera conventions, and fixed framing padding are preferred over many
   knobs that let two captures become visually incomparable.

---

# 3. `inspect_model_bounds`

## 3.1 Goal

Return the current model's **rendered whole-model envelope** so the modeller can
detect gross scale, location, ground, or orientation consequences that camera
auto-framing could hide.

This is a measurement instrument, not a validator.

## 3.2 Input

v1 intentionally has no public arguments:

```ts
z.object({})
```

It always observes the active Blockbench project.

Why no `target_dimensions` input:

- approved dimensions/envelope already belong to the modelling hypothesis;
- the agent can compare current facts with that target;
- making the tool return `within_target`, tolerance, or correction values would
  turn a read-only instrument into an evaluator/planner and create false
  authority.

Why no `project` input:

- project switching is unnecessary in the normal one-model workflow;
- current `capture_screenshot(project=...)` already demonstrates why observation
  should not casually mutate active-project state;
- the caller can explicitly select the intended project through existing project
  controls before beginning a modelling run if that is ever required.

## 3.3 Bounds Semantics

The returned bounds must represent what the current model **actually renders as**
in the current pose, not merely raw unrotated `from/to` boxes.

Required basis:

```text
space: model/world-visible geometry space
pose: current rendered preview pose
include: Cube rotation and visually-active parent/group transforms
exclude: gizmos, grid, selection handles, editor decorations
```

The implementation must prefer a trustworthy Blockbench preview/scene/world-
transform source or an equivalent complete transform calculation.

### Critical anti-assumption rule

Do **not** copy a fallback such as:

```text
center = [0, 8, 0]
size   = [16, 16, 16]
```

when the runtime cannot obtain bounds. Fabricated defaults are worse than an
error because they can authorize wrong modelling decisions.

Likewise, a manual bounds helper that accounts for Cube rotation but silently
ignores active parent/group transforms is insufficient for the claimed rendered
bounds semantics.

If complete bounds cannot be obtained reliably, fail with an actionable error
rather than degrading silently.

## 3.4 Empty Project

An empty project is valid observable state and should not be treated as a runtime
failure.

Return:

```json
{
  "has_geometry": false,
  "cube_count": 0,
  "bounds": null
}
```

## 3.5 Output

Recommended structured output:

```json
{
  "project": {
    "uuid": "...",
    "name": "...",
    "format": "bedrock"
  },
  "has_geometry": true,
  "cube_count": 6,
  "bounds_basis": "rendered_current_pose",
  "coordinate_axes": {
    "width": "x",
    "height": "y",
    "length": "z"
  },
  "bounds": {
    "min": [-8, 0, -18],
    "max": [8, 30, 18],
    "center": [0, 15, 0],
    "size_xyz": [16, 30, 36],
    "dimensions": {
      "width": 16,
      "height": 30,
      "length": 36
    },
    "footprint": {
      "min_xz": [-8, -18],
      "max_xz": [8, 18],
      "size": {
        "width": 16,
        "length": 36
      }
    }
  },
  "pose_context": {
    "animation": null,
    "timeline_time": null
  },
  "warnings": []
}
```

`pose_context` exists so the caller does not unknowingly compare an animated pose
with a static target. v1 does not change animation/time to manufacture a bind
pose.

## 3.6 Explicitly Forbidden Output

`inspect_model_bounds` must not return:

```text
PASS / FAIL
looks_correct
similarity
within_tolerance
recommended_scale
correction_delta
auto_reanchor suggestion
visual quality score
```

It may report raw facts only.

---

# 4. `capture_model_views`

## 4.1 Goal

Return actual MCP **image content** from deterministic named model views so the
vision-capable agent can compare the current Blockbench model directly with the
corresponding reference views.

This tool is a camera/evidence instrument, not a visual critic.

## 4.2 Minimal Input

```ts
z.object({
  views: z.array(z.enum([
    "front",
    "back",
    "left",
    "right",
    "top",
    "bottom",
    "front_left_3q",
    "front_right_3q"
  ])).min(1).max(5),

  front_direction: z.enum(["+z", "-z"]),

  framing: z.discriminatedUnion("mode", [
    z.object({ mode: z.literal("model") }),
    z.object({
      mode: z.literal("explicit"),
      min: z.tuple([z.number(), z.number(), z.number()]),
      max: z.tuple([z.number(), z.number(), z.number()])
    })
  ]).optional().default({ mode: "model" })
})
```

Additional schema rule: `views` must be unique.

### Why `front_direction` is required

The modelling workflow already requires the agent to establish the asset's
coordinate frame/front direction before exact geometry. The capture tool must
consume that decision rather than inventing its own front/back orientation.

No default is permitted because a wrong default can mirror every visual
comparison while still producing technically valid screenshots.

### Why no generic `three_quarter`

`three_quarter` is ambiguous. v1 uses:

```text
front_left_3q
front_right_3q
```

so the caller can request the side that corresponds to the approved reference.

## 4.3 What Is Intentionally NOT An Input

Do not expose these in v1:

```text
project selector
custom camera transform
width / height
padding
file output / output directory
texture selector
animation selector / timestamp
particle controls
selected-element scope
similarity/reference image
```

Reasons:

- they are not required for the primary reference-fidelity problem;
- they increase state mutation and context surface;
- Sample's broad preview tool is useful evidence, but its particle/file/variant
  responsibilities are outside the Local primary modelling loop;
- explicit/custom camera control would reintroduce non-comparable screenshots.

v1 output is fixed at **512 × 512 PNG** with fixed framing padding (implementation
constant, approximately 10–12%). Change this only after a demonstrated need.

## 4.4 Canonical Camera Semantics

Coordinate basis follows the modelling contract:

```text
X = width / left-right
Y = height / up-down
Z = length / front-back
+Y = up
```

`front_direction` defines which Z side is the object's front.

### If `front_direction = +z`

```text
front  camera side = +Z
back   camera side = -Z
left   camera side = -X
right  camera side = +X
```

### If `front_direction = -z`

```text
front  camera side = -Z
back   camera side = +Z
left   camera side = +X
right  camera side = -X
```

### Principal views

`front`, `back`, `left`, `right`, `top`, and `bottom` must be **true axis-aligned
orthographic views** of the framing center.

Do not add hidden elevation offsets or oblique camera drift to front/side views.
This intentionally differs from the Sample preview helper, whose principal
cameras include a small vertical elevation.

### 3/4 views

`front_left_3q` and `front_right_3q` are stable perspective context views using a
canonical front-relative azimuth (about 45°) plus a modest positive elevation
(about 30°).

3/4 perspective is for volume/readability context. It must not be treated as a
metric proportion view unless the reference explicitly shares the same camera.
Orthographic principal views remain the main shape/proportion evidence.

## 4.5 Framing Semantics

### `mode: "model"`

Frame using the same trustworthy rendered bounds semantics as
`inspect_model_bounds`.

Use this when no approved numeric envelope exists or when the question is only
about the current model's silhouette/relationships.

### `mode: "explicit"`

Frame the exact caller-provided bounds plus fixed padding.

Use this when the Primary Form Hypothesis has an approved target envelope and
stable scale between captures matters.

**Critical rule:** do not automatically expand an explicit frame to include
out-of-envelope geometry. If a model grows beyond the intended envelope, clipping
or crowding is useful evidence rather than something the tool should hide by
zooming out.

This solves the auto-frame failure mode where an oversized model can still look
comfortably centered because every screenshot silently rescales itself.

## 4.6 State-Neutrality Contract

`capture_model_views` operates on the **active project only**.

It must not change:

```text
active project
selection
editor mode/tool
active texture
animation selection/time
model geometry/hierarchy
```

The only persistent editor state it temporarily changes is the preview camera.

Before capture, snapshot at minimum:

```text
camera position
target
projection type
orthographic zoom when applicable
```

For every success, error, cancellation, or partial batch failure:

```text
try
  apply deterministic camera
  capture requested view(s)
finally
  restore exact prior camera state
```

If the camera cannot be restored, the tool must fail rather than return a
misleading successful observation with `restored=true`.

Because the tool does not accept a project selector, it should not need the
project-switch restoration complexity that exists in Sample's broader preview
surface.

## 4.7 Image Transport

Each requested view must be returned as actual MCP image content, not merely a
filesystem path or an opaque base64 string embedded in text.

Local already has the correct low-level response shape through `imageContent()`:

```text
content:
  type: image
  data: <base64 image bytes>
  mimeType: image/png
```

The runtime implementation should reuse that pattern.

The tool should not add file-output mode in v1. The primary goal is to put the
image directly in the AI observation channel.

Whether a specific Codex/client configuration actually exposes that image to the
vision-capable model remains a later **LOCAL PROOF REQUIRED** runtime claim; the
public contract must nevertheless be correct first.

## 4.8 Result Ordering

The content stream must make image identity unambiguous:

```text
TEXT: VIEW front
IMAGE: <front PNG>
TEXT: VIEW left
IMAGE: <left PNG>
TEXT: VIEW top
IMAGE: <top PNG>
```

Do not return an unlabeled image bundle.

Recommended structured metadata:

```json
{
  "project": {
    "uuid": "...",
    "name": "..."
  },
  "count": 3,
  "front_direction": "+z",
  "framing": {
    "mode": "explicit",
    "min": [-10, 0, -20],
    "max": [10, 32, 20]
  },
  "captures": [
    {
      "view": "front",
      "projection": "orthographic",
      "width": 512,
      "height": 512,
      "camera": {
        "position": [0, 16, 60],
        "target": [0, 16, 0],
        "zoom": 1.0
      }
    }
  ],
  "pose_context": {
    "animation": null,
    "timeline_time": null
  },
  "restored_camera": true,
  "warnings": []
}
```

Exact numeric camera position/zoom are implementation results, not public fixed
constants. Returning them makes the evidence reproducible/debuggable.

## 4.9 Error Conditions

Fail or return explicit empty state rather than guessing when:

- there is no active project;
- there is no active preview;
- `views` contains duplicates or more than five items;
- explicit bounds are invalid (`max <= min` on a required dimension);
- model framing is requested but trustworthy model bounds cannot be computed;
- there is no visible geometry to capture;
- image capture fails;
- camera restoration fails.

No fabricated default geometry/camera state is permitted.

## 4.10 Explicitly Forbidden Behavior

`capture_model_views` must not:

```text
compare the model with a reference image
return PASS / FAIL
score similarity
infer the object's front direction
choose which reference view is authoritative
modify Cubes/groups/pivots
repair framing by moving the model
change project/selection/texture/animation state
save files by default
capture after every Cube automatically
```

---

# 5. Required Workflow Use

When target dimensions/envelope are available:

```text
Primary Form Hypothesis
↓
coarse primary build
↓
inspect_model_bounds
↓
compare raw bounds with target envelope
↓
capture_model_views(framing = explicit target envelope)
↓
reference ↔ model visual comparison
```

This pairing prevents two opposite mistakes:

```text
bounds only
→ structurally plausible but visually wrong

screenshots only with auto-frame
→ visually centered but globally wrong scale/ground/envelope
```

When no approved numeric envelope exists:

```text
capture_model_views(framing = model)
```

is still useful for silhouette/proportion/contact comparison, but no numeric
scale claim may be invented.

---

# 6. Relationship To Later Tools

Do not add local correction complexity into these observation tools.

Later slices remain separate:

```text
inspect_element
→ exact authored Cube/group state for a diagnosed local mismatch

modify_cubes_batch
→ one coherent explicit multi-Cube correction under Undo
```

The observation layer must remain small even after those capabilities exist.

---

# 7. Implementation Order

The lowest-risk implementation order is:

```text
1. one trustworthy internal rendered-bounds reader
2. public inspect_model_bounds using that reader
3. capture_model_views reusing exactly the same bounds semantics for framing
```

This order is intentional even though visual capture is the higher product
priority: camera framing must not invent a second, inconsistent definition of the
model envelope.

Do not copy Sample's `inspect_model_bounds` literally: its useful rotation-aware
bounds helper is good evidence, but the Local contract does not need anchor,
reanchor, root-pivot summaries, or correction deltas. More importantly, the
implemented bounds source must satisfy the declared rendered/current-pose
semantics including visually-active hierarchy transforms.

Do not copy Sample's `capture_bedrock_preview` literally: keep its useful named
views, deterministic framing, inline images, and `finally` restoration pattern;
drop file output, particle/animation/texture variants, custom cameras, and other
unrelated responsibilities.

---

# 8. Acceptance Contract

The observation design is sufficient for implementation when these statements
remain true:

1. `inspect_model_bounds` reports facts only and cannot approve/correct a model.
2. `capture_model_views` returns deterministic labeled inline images from the
   active model and restores camera state.
3. explicit target-envelope framing cannot silently zoom out to hide an
   oversized/misplaced model.
4. principal views are true orthographic axis views tied to an explicit
   `front_direction`.
5. both tools use one consistent trustworthy definition of rendered model bounds.
6. neither tool requires project switching, reference pixels, similarity scoring,
   or mutation behavior.
