# Professional Sample Forensic Audit — Geometry, Texturing, Animation

Date: 2026-08-13  
Scope: supplied professional `.bbmodel` files + current `Local` source/contracts  
Execution channel: **ChatGPT → GitHub/static only**  
Status: **FORENSIC SAMPLE AUDIT COMPLETE — NO LOCAL TEST**

## Purpose

Study the supplied professional Blockbench models as **learning evidence** and compare their authored structure against current BlockIT reasoning/contracts.

The samples do **not** become presets, asset classes, anatomy rules, fixed Cube counts, hierarchy-depth targets, copied transforms, UV recipes, animation templates, or complexity targets.

Nine supplied models were inspected:

- `weapon_katana.geo.bbmodel`
- `armor_dragon_helmet.geo.bbmodel`
- `outdoor_table.bbmodel`
- `anky.geo.bbmodel`
- `skeleton_spinosaurus.geo.bbmodel`
- `helicopter.geo.bbmodel`
- `ninja_master.geo.bbmodel`
- `Sample_samurai(1).bbmodel`
- `(sample)dragon_boss.geo.bbmodel`

The final `.bbmodel` proves final authored structure. It does **not** prove the chronological modelling process used by the original designer.

---

# 1. Geometry Forensics

Across the nine samples:

```text
538 Cubes
356 Groups/Bones
9 Locators
122 rotated Cubes
180 rotated Groups
105 non-zero inflate Cubes
117 zero-thickness/plane-like Cubes
312 distinct Cube-parent Groups summed across assets
```

| Sample | Cubes | Groups | Locators | Rotated Cubes | Rotated Groups | Inflate | Zero-thickness | Distinct Cube parents | Max hierarchy depth |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Dragon Boss | 200 | 112 | 5 | 79 | 43 | 27 | 72 | 107 | 18 |
| Ninja Master | 33 | 25 | 0 | 8 | 4 | 15 | 6 | 22 | 6 |
| Skeleton Spinosaurus | 69 | 38 | 1 | 0 | 32 | 5 | 25 | 38 | 5 |
| Anky | 61 | 62 | 0 | 1 | 51 | 11 | 6 | 57 | 12 |
| Outdoor Table | 12 | 5 | 0 | 0 | 4 | 0 | 0 | 5 | 0 |
| Samurai | 64 | 39 | 1 | 23 | 21 | 23 | 0 | 36 | 8 |
| Katana | 27 | 45 | 1 | 1 | 18 | 16 | 0 | 22 | 10 |
| Helicopter | 50 | 12 | 1 | 4 | 0 | 6 | 6 | 11 | 3 |
| Dragon Helmet | 22 | 18 | 0 | 6 | 7 | 2 | 2 | 14 | 7 |

## Geometry patterns that generalize

### A. Transform ownership is semantic, not uniformly Cube-owned

Creature/segmented assets often carry orientation in Groups/Bones instead of rotating every Cube independently. Examples include Anky and Skeleton Spinosaurus, where Group rotation dominates Cube rotation.

This supports the current BlockIT rule:

```text
local rigid slope           → Cube-owned when appropriate
shared segment/articulation → Group/Bone-owned
```

No fixed rotation ratio should be inferred.

### B. Zero-thickness Cubes are a real professional representation

117 Cubes have zero span on one axis. They are used for genuinely sheet-like forms such as thin fins, membranes, ribs/string-like elements, panels, and similar authored surfaces.

This validates plane-like Cube support as a first-class representation. It does **not** authorize using zero thickness to hide unknown depth.

### C. `inflate` is layer control, including positive, negative, and very small values

105 Cubes use non-zero `inflate`. Samples include positive and negative values, including small separation values. The professional pattern is not “inflate must be positive” or “use one standard amount.”

The generic rule is:

```text
inflate sign/magnitude follows the intended local layer relationship
not a preset
not proportion repair
not fake detail
```

### D. Hierarchy depth is not a quality score

The dataset ranges from hierarchy depth 0 on a simple table to 18 on Dragon Boss. A deep hierarchy is justified only when transform ownership, articulation, attachment, or useful organization needs it.

### E. Functional anchors are separated from visible geometry

Locators in the samples include names such as:

```text
glow
mouth
stunned
hand_l / hand_r
snooze_vfx
samurai_attack_2
lead_hold
smoke_vfx
```

These represent effect/hold/functional points rather than visible masses. A professional workflow should not create invisible/placeholder Cubes when a Locator is the actual semantic representation.

## Geometry decision

Current PRO-1/PRO-3 geometry reasoning already captures most of the professional construction evidence. **No new geometry tool is justified by this deeper audit.**

The only reasoning additions justified are:

- treat required non-visible functional anchors as Locator intent, not geometry;
- do not assume positive/fixed `inflate`; sign and magnitude are local authored choices.

---

# 2. Texturing / UV Forensics

The sample dataset is unusually consistent in one important area:

```text
538 / 538 Cubes use Box UV
538 / 538 Cubes end with autouv = 0
516 / 538 Cubes store explicit uv_offset
134 / 538 Cubes use mirror_uv = true
```

| Sample | Cubes | Textures | Logical project UV | Bitmap size(s) | Bitmap : logical ratio | Box UV | Explicit uv_offset | mirror_uv | autouv=0 |
|---|---:|---:|---|---|---:|---:|---:|---:|---:|
| Dragon Boss | 200 | 1 | 256×256 | 256×256 | 1× | 200 | 194 | 58 | 200 |
| Ninja Master | 33 | 1 | 160×160 | 160×160 | 1× | 33 | 32 | 10 | 33 |
| Skeleton Spinosaurus | 69 | 1 | 512×512 | 512×512 | 1× | 69 | 68 | 22 | 69 |
| Anky | 61 | 1 | 256×256 | 512×512 | 2× | 61 | 61 | 11 | 61 |
| Outdoor Table | 12 | 3 | 146×146 | 146×146 ×3 | 1× | 12 | 11 | 0 | 12 |
| Samurai | 64 | 1 | 128×128 | 128×128 | 1× | 64 | 62 | 23 | 64 |
| Katana | 27 | 1 | 64×64 | 128×128 | 2× | 27 | 25 | 0 | 27 |
| Helicopter | 50 | 1 | 288×288 | 576×576 | 2× | 50 | 44 | 5 | 50 |
| Dragon Helmet | 22 | 1 | 128×128 | 256×256 | 2× | 22 | 19 | 5 | 22 |

All supplied textures are normal color textures; these samples do **not** provide evidence that additional PBR complexity is needed.

## Texturing patterns that generalize

### A. Box UV is not a beginner fallback in this dataset

All 538 Cubes use Box UV. Professional quality here comes from deliberate Cube decomposition plus intentional Box UV placement, not from forcing arbitrary per-face/manual mesh unwraps.

BlockIT should treat Box UV as a first-class professional path when it matches the asset.

### B. Final UV placement is largely manual/intentional

Almost every Cube stores `uv_offset`, while all final Cubes have `autouv=0`. This is strong evidence that final atlas layout is an authored state rather than “automatic UV forever.”

Current `modify_cube` can author:

```text
uv_offset
mirror_uv
autouv
```

but `modify_cubes_batch` cannot. Because production UV work happens after geometry acceptance, this is a **batch-parity defect**, not a reason to push finished UV state into primary geometry authoring.

### C. Logical UV resolution and bitmap pixel resolution are different concepts

Four assets use a 2× physical bitmap while retaining a smaller logical UV canvas:

```text
Anky      project 256×256 → bitmap 512×512
Katana    project 64×64   → bitmap 128×128
Helicopter project 288×288 → bitmap 576×576
Helmet    project 128×128 → bitmap 256×256
```

Therefore:

```text
project/logical UV resolution ≠ necessarily texture bitmap dimensions
```

Do not infer a universal equality between them. Also do not infer a power-of-two requirement: professional examples include 146×146, 160×160, and 288×288 logical canvases.

Current source can read project logical resolution and texture bitmap size, but this static audit does not prove whether new-project creation can intentionally establish every logical/physical relationship. **Do not add a new resolution field until that exact creation gap is reproduced.**

### D. UV reuse/mirroring is intentional, not automatically an error

`mirror_uv` is used on 134 Cubes. Repeated UV offsets also occur. Texture Standard should reject accidental overlap while allowing intentional reuse for symmetric/repeated surfaces.

There is no evidence for a universal atlas-packing percentage target. The extracted atlases vary widely in occupied area; professional organization/editability/reuse can matter more than maximizing packed pixels.

### E. Texture variants can reuse one geometry/UV layout

`outdoor_table.bbmodel` stores three texture variants on the same geometry and matching atlas mask/layout. Variant support should remain texture identity/content work, not a geometry preset.

## Texturing source decision

One narrow source correction is justified:

```text
extend existing modify_cubes_batch only
→ uv_offset
→ mirror_uv
→ autouv
```

Reason:

- these fields already exist in `modify_cube`;
- the professional samples reproduce the same need across almost every Cube;
- production UV authoring occurs after geometry acceptance;
- no new tool, UV planner, auto-packer, material profile, or preset is required.

Do **not** add:

- generic per-Cube texture selection;
- automatic UV packer;
- UV-density score;
- asset-specific atlas templates;
- PBR changes from this sample set.

---

# 3. Animation Forensics

Five of nine samples contain no animation clips at all. Professional static model quality therefore does **not** imply that animation must exist.

Four samples contain animations:

| Sample | Clips | Controllers | Keyframes | Rotation | Position | Scale | Sound | Particle | Linear | Step | Expression-valued axes | Snapping/FPS values |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| Ninja Master | 3 | 2 | 148 | 148 | 0 | 0 | 0 | 0 | 148 | 0 | 0 | 10 |
| Anky | 8 | 6 | 1,582 | 1,336 | 192 | 51 | 2 | 1 | 1,582 | 0 | 165 | 24, 25 |
| Katana / player integration | 89 | 12 | 1,777 | 1,175 | 320 | 259 | 0 | 23 | 1,759 | 18 | 196 | 10, 12, 20, 24, 40, 48 |
| Helicopter | 3 | 1 | 9 | 6 | 0 | 0 | 3 | 0 | 9 | 0 | 0 | 16, 24 |

Totals across animated samples:

```text
103 clips
21 animation controllers
3,516 keyframes
2,665 rotation keyframes
512 position keyframes
310 scale keyframes
24 particle keyframes
5 sound keyframes
3,498 linear interpolation
18 step interpolation
361 expression-valued transform axes
```

## Animation patterns that generalize

### A. Curve complexity is not a quality target

99%+ of sampled keyframes use `linear`; only 18 use `step`. There is no sample evidence for “professional = Bezier everywhere.”

Use the simplest interpolation that matches the motion. Curve count/complexity is not a quality score.

### B. FPS/snapping is clip-specific

Observed snapping values range from 10 through 48. Do not create a universal 24/30 FPS authoring law.

### C. Loop mode follows motion function

Samples use `loop`, `once`, and `hold`. The correct loop mode is semantic to the clip, not a global default.

### D. Professional motion is coordinated across semantic bones

The complex creature/player samples distribute transforms across many participating bones. The useful reasoning target is coordinated body mechanics, attachment, arc, timing, and return-to-neutral—not increasing the number of animated bones or keyframes.

### E. Procedural expressions are materially used

Anky and Katana/player integration contain 361 transform-axis values expressed as Molang/query/math strings rather than finite numeric values, for example life-time sinusoidal motion or query-driven placement.

Current `create_animation` / `manage_keyframes` accept finite numeric transform values only. This is a **real direct-authoring gap**.

Do not fake the gap by automatically baking arbitrary expression motion into dense numeric keyframes. That changes semantics and can create large, brittle animation data.

### F. Sound keyframes are a real but bounded gap

Anky and Helicopter contain five sound-effect keyframes. Current direct animation MCP explicitly does not own sound-effect keyframes.

This is now **sample-evidenced**, but it is not necessary to change before core animation clip quality can improve.

### G. Animation controllers are production integration, not clip-quality scoring

All four animated samples contain animation controllers: 21 controllers total. Controllers contain conditional states/transitions and animation links. This proves controller authoring is relevant to production Bedrock assets.

However, controller support is a materially larger runtime/state-machine capability than clip authoring. It should not be implemented merely because professional files contain it.

Classify it as:

```text
PROVEN PRODUCTION CAPABILITY GAP
DEFERRED — separate bounded requirement needed
```

### H. Mapped particles are already covered

The dataset contains particle animation channels. Current BlockIT already owns mapped particle effects. No new particle capability is justified by these samples.

## Animation decision

Improve reasoning and capability-boundary wording now; **do not implement** controllers, sound keyframes, or expression-valued transforms in this phase.

Why:

- they are real gaps, but each changes a larger public/runtime contract;
- none is required to fix the currently demonstrated geometry/UV authoring friction;
- implementing them together would violate the minimum-change rule and the user's anti-overdevelopment constraint.

---

# 4. Resulting BlockIT Changes

## Reasoning / policy improvements justified

### Geometry

- functional non-visible anchor → Locator, not fake/invisible Cube;
- `inflate` sign/magnitude is local authored state, not a preset.

### Texturing

- Box UV is a professional first-class path when suitable;
- final UV offsets/mirroring are intentional authored state;
- logical UV resolution is distinct from bitmap resolution;
- intentional UV reuse is allowed; no packing-density score;
- texture variants may share geometry/UV layout.

### Animation

- no keyframe-count, controller-count, hierarchy-depth, FPS, or interpolation-complexity targets;
- select loop/FPS/interpolation by motion function;
- coordinated semantic bone motion matters more than dense keys;
- expression/controller/sound gaps must stay explicit rather than being faked.

## One source change justified

```text
modify_cubes_batch
→ add existing single-Cube UV state parity:
   uv_offset
   mirror_uv
   autouv
```

No new tool or authoring mode.

## Explicitly deferred

```text
animation controllers
sound-effect keyframe authoring
expression-valued transform keyframes
new project logical-UV resolution control (not yet reproduced)
UV auto-packer / UV score
PBR expansion
Group batch creation
rig generator
professional presets / asset classes
```

---

# 5. Evidence Boundary

`CURRENT-PROJECT VERIFIED` for this static audit:

- supplied `.bbmodel` authored structure/counts/fields;
- cross-sample geometry/UV/animation patterns above;
- current `Local` schemas showing single-Cube UV support and missing batch UV parity;
- current animation schemas accepting finite numeric transform values;
- current documented protected controller/sound gaps.

`LOCAL PROOF REQUIRED` remains for:

- live Blockbench persistence of any new batch UV mutation;
- model-visible improvement from the new professional reasoning;
- real authoring-call reduction;
- animation expression/controller/sound runtime behavior if those capabilities are ever implemented.

No local Codex/Blockbench test is activated by this audit.
