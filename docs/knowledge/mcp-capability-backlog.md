# MCP Capability Backlog

Updated: 2026-08-31

Authority: **`Local` only**.

This file records capability gaps discovered from the BlockIT audit against public Blockbench MCP implementations and native Blockbench behavior. It is backlog/design state, not runtime proof.

## Goal

Improve **Cost to Accepted Result** without inflating the MCP surface.

Preserve:

- Bedrock-specific ownership;
- UUID-first targeting;
- full preflight / fail-closed mutation;
- coherent Undo;
- Geometry → Texturing → Animation phase boundaries;
- generated-doc discipline;
- visual proof as final quality authority.

## Current Gate

The active pre-E2E implementation remains the Texturing contract in `docs/knowledge/next-action.md`.

Public ToolSpec/schema or runtime prompt changes require `LOCAL_CODE` because canonical prompt/API output must be generated with Bun. Never hand-edit generated prompt/API files remotely.

```text
REMOTE-SAFE FOUNDATION
→ LOCAL PUBLIC-CONTRACT IMPLEMENTATION
→ bun run prompts:build
→ bun run docs:build
→ bun run verify:mcp
→ LIVE Geometry → Texturing → Animation E2E
→ measure Cost to Accepted Result
→ evidence-gated follow-up work
```

Remote-safe foundations currently prepared:

```text
mcp/lib/facePixelMapping.ts
mcp/tests/face-pixel-mapping.test.ts
mcp/lib/orientedBoxContact.ts
mcp/tests/oriented-box-contact.test.ts
mcp/lib/textureRevision.ts
mcp/tests/texture-revision.test.ts
```

All remain **LOCAL PROOF REQUIRED** until Bun/local/live gates pass.

---

# Tier A

## Geometry A1 — Per-Face UV Correction

Gap: `place_cube` can author explicit per-face UV at creation, but existing/imported per-face UV rectangles and face rotation need deterministic correction.

Preferred direction: extend existing `modify_cube`, not a new generic UV family.

Conceptual shape:

```text
modify_cube
  id
  uv_mode?
  faces?
    face
    uv
    rotation?
```

Requirements: explicit Cube identity, finite UVs, native rotations only, clear Box UV ↔ per-face switching, full preflight before Undo, final UV readback.

## Geometry A2 — Exact Spatial / Contact Measurement

Gap: canonical views/bounds do not numerically prove whether rotated Cube parts are separated, touching, or penetrating.

Foundation: `mcp/lib/orientedBoxContact.ts`.

Preferred public direction: one read-only `measure_geometry`-style owner.

Possible surfaces:

```text
elements
pairs
distances
angles
```

Caller owns semantic expectation:

```text
unspecified
connected
separate
intentionally_embedded
```

Never infer intended connection from names/appearance. For Cubes, prefer exact transformed OBB evidence.

---

## Texturing A1 — `create_texture` Dimension Semantics

Already locked in `docs/knowledge/next-action.md`.

Required:

- remove omitted-dimension 16×16 blank-production behavior;
- explicit width+height only as a pair;
- blank base derives project logical UV;
- blank variant/PBR derives established base bitmap size;
- absolute file import preserves native dimensions;
- data URL remains explicit-dimension until native inference is proven;
- return dimension provenance.

## Texturing A2 — Deterministic Face-Local Authoring

Already locked in `docs/knowledge/next-action.md`.

Preferred tool:

```text
paint_face_features
```

Exact operations:

```text
fill
rect
line
pixels
```

Use shared `facePixelMapping`; full preflight; one texture edit; one Undo; exact RGBA postcondition verification; no automatic artistic PASS.

## Texturing A3 — Texture Revision Guard

Gap: manual editor changes can make later exact MCP writes stale.

Foundation: `mcp/lib/textureRevision.ts`.

Revision identity:

```text
sha256:<width>x<height>:<decoded RGBA digest>
```

Prefer returning `revision` from existing texture observations. Exact destructive paths may accept:

```text
expected_revision?: string
```

Stale token must fail before bitmap mutation/Undo.

## Texturing A4 — Focused Face / Region Readback

Extend existing texture observation rather than adding multiple tools.

Conceptually:

```text
get_texture
  scope: full | face | rect
```

Face read returns face-local image, local size, mapped atlas rect, and revision. Orientation must match `paint_face_features`.

## Texturing A5 — Native Texture Clone

Avoid round-tripping a full PNG just to create a color variant.

Preferred owner: extend `create_texture` with explicit:

```text
source_texture: <UUID>
```

Native copy; dimensions derive from source; role/group remains caller-owned; source/data/fill semantics remain unambiguous.

## Texturing A6 — PNG Export

Add Texturing-owned deterministic standalone texture delivery.

Conceptually:

```text
export_texture
```

Explicit texture UUID, safe path policy, explicit overwrite, no file picker, return path/bytes/identity/dimensions. Must work for base, variants, and PBR support textures.

---

## Animation A1 — Complete Bedrock Metadata

Add ownership for native:

```text
override_previous_animation
start_delay
loop_delay
```

Prefer extending existing Animation metadata/timeline owner. Delay values preserve authored Molang and are never evaluated by BlockIT. Inspection must round-trip final values.

## Animation A2 — Animation / Controller JSON Delivery

Gap: animations/controllers can be authored but do not have their own deterministic standalone codec-owned export route.

Preferred direction:

```text
export_animation_file
  type: animation | controller
```

Use native Blockbench `AnimationCodec`. Support compiled content and/or explicit safe-path write. Keep separate from geometry export.

## Animation A3 — Temporary Pose Canonical Views

Add read-only animation timestamp observation without persistent timeline state changes.

Conceptually:

```text
capture_animation_views
  animation
  time
  views
  front_direction
```

Snapshot selected/playing/timeline state, mute effects when needed, pose temporarily, capture canonical views, restore on every path. Return requested and rendered time.

## Animation A4 — Multi-Bone / Multi-Channel Keyframe Batch

Current single bone/channel unit can make one complete pose expensive.

Prefer extending existing keyframe owner:

```text
targets:
  - bone
    channel
    keyframes
```

Full preflight before Undo; duplicate times fail; one request = one Undo; preserve authored Molang. Prioritize if E2E confirms pose-call cost is material.

---

# Tier B — After Core / E2E Evidence

## Geometry

- relative translate/scale/rotate/pivot intent, preferably inside existing correction owners;
- UV island translate/scale/90° rotation after exact per-face UV correction is stable;
- explicit-pair symmetry audit;
- coplanar/Z-fighting diagnostic as lazy validation/resource evidence.

## Texturing

- copy face pixels with optional flip/rotation;
- bounded exact `replace_color`, region flip/rotate, flood fill;
- objective statistics: exact color count, transparency counts, histogram, texel density.

Do not turn statistics into artistic quality scores.

## Animation

- native entity-relative/global rotation round-trip;
- animation validation sweep after exact Geometry contact + temporary pose capture exist;
- native animation/controller import for existing Bedrock projects.

---

# Tier C — Evidence-Gated

```text
linear cube arrays
radial cube arrays
dense face-grid authoring
advanced texture region transforms
advanced pre/post keyframe data points
specialized symmetry automation
```

Add only when repeated workloads prove material benefit.

---

# Explicit Non-Goals

Do not add to the normal BlockIT Bedrock surface:

```text
execute_script
risky_eval
arbitrary Blockbench JavaScript
automatic phase switching
semantic compiler / Intent Program authority
generic mesh/vertex/weight-paint expansion
procedural biped/limb generators
noise-first automatic texture detailing
automatic artistic quality scores
large generic router/profile/framework layers
tool-count growth for parity alone
```

BlockIT remains explicit, fail-closed, Bedrock-specific, Undo-aware, and evidence-driven.

## External References

Capability ideas were compared against:

- `SwagRee/BlockBenchMCP`
- `sosadly/blockbench-mcp`
- `jasonjgardner/blockbench-mcp-plugin`
- `XiaoNetwork-Astral/blockbench-mcp`
- `adhi-jp/minecraft-blockbench-mcp`
- `FFriends/Blockbench-MCP`
- `Golub4ik-Official/blockbench-mcp`
- `sigee-min/ashfox`

Native semantics/format ownership were checked against official `JannisX11/blockbench` source when material.

External repositories are references only. BlockIT implementation must follow this repository's rules, Bedrock constraints, source ownership, and proof boundaries.
