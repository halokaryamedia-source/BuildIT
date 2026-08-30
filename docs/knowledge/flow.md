# BlockIT Flow

Updated: 2026-08-30

This is the **single detailed current flow**. Root `AGENTS.md` owns task routing.

## 1. Route

```text
REFERENCE PREPARATION → blockbench-reference-generator
ASSET AUTHORING       → named workspace package when persistent → blockit-bedrock-entity-mcp → active specialist only
REPOSITORY WORK       → AGENTS.md classify Bounded | Standard | Complex → exact owner + nearest AGENTS.md → development-brief only when Complex
LOCAL ACCEPTANCE      → inactive unless next-action.md explicitly reactivates it
```

Hardening never silently continues into image generation. After hardening/verification, **STOP AND REPORT**; generation requires a fresh explicit user instruction.

## 2. Reference Preparation

```text
SOURCE IMAGE + USER INTENT
→ VISUAL TARGET + HANDOFF CONSTRAINTS
→ INTERNAL GENERATION BRIEF
→ MINECRAFT-FIRST GEOMETRY + TEXTURE TARGET
→ SOURCE-NEAREST ORTHOGRAPHIC ANCHOR
→ stable/readable POSE + ARTICULATED-FEATURE INTENT
→ FIVE-PREVIEW COVERAGE BOARD
   UPPER: SIDE | FRONT | BACK
   LOWER: TOP / FOOTPRINT | FRONT-SIDE 3/4
→ PRE-GENERATION READINESS
→ EXECUTION CONSENT GATE
   ├─ no fresh instruction → STOP; WAIT FOR USER
   └─ fresh instruction → ONE CLEAN FIVE-PREVIEW DRAFT
        → labels only by default
        → gate: recognizability
                geometry buildability
                texture usability
                no material contradiction
                readability
        ├─ PASS or minor preview drift → USER APPROVAL
        └─ MATERIAL DEFECT → one board-level correction → still material? NEEDS REVIEW
→ ACTUAL APPROVED REFERENCE IMAGE + HANDOFF CONSTRAINTS
```

Five previews are broad Minecraft modelling evidence, not five engineering drawings. Minor curl/angle/contour/overlap/shade/marking drift is acceptable when identity, primary geometry, topology/attachment, buildability, and identity-critical texture information remain clear.

Geometry prioritizes recognizable Blockbench-buildable major form. Texture target prioritizes Minecraft-readable palette, material regions, part separation, and identity-critical markings rather than photoreal micro-detail.

Generation budget is per unchanged Internal Generation Brief/review cycle: one Draft, at most one targeted correction, zero automatic variants. A materially changed user-approved source/pose/target/requirement starts a new cycle; never start one automatically just to retry.

The Reference Generator returns one image only. Saving an approved reference under `workspace/active/<project>/references/` is downstream/local persistence, not generator output.

## 3. Bedrock Authoring

For persistent work:

```text
user names/continues project
→ workspace/active/<project>/README.md
→ current .bbmodel + only required reference/assets
→ actual approved reference visible when visual judgement is needed
```

If no persistent package exists and the user wants retention, create one compact package. Do not create manifest JSON, per-Cube plans, checkpoint logs, or duplicate model-version files merely for continuity.

### 3.1 Geometry

Choose the smallest evidence path that can change the model decision.

For a clear predominantly rigid reference:

```text
ACTUAL APPROVED REFERENCE + HANDOFF CONSTRAINTS
→ identity + envelope + primary masses
→ CONSTRUCTION + TRANSFORM OWNERSHIP
→ minimum meaningful hierarchy
→ PRIMARY BLOCKOUT: coherent Cubes + REQUIRED PRIMARY GROUPS/PIVOTS
→ CANONICAL MODEL VIEWS
→ DIFFERENCE-FIRST REFERENCE ↔ MODEL COMPARISON
→ FAIL | UNVERIFIED | PASS
```

Do **not** force View Pair Map / Reference Evidence Map ceremony when the reference is already clear.

For material ambiguity/conflict only:

```text
relevant VIEW PAIR MAP / REFERENCE EVIDENCE
→ DISCREPANCY TRIAGE
   ├─ MINOR → ONE CANONICAL MINECRAFT INTERPRETATION → continue
   └─ MATERIAL → CONFLICTING / BLOCKED
→ SEMANTIC FORM facts that can change construction
→ normal Geometry path
```

For a minor discrepancy choose consistently: explicit user requirement → original Source evidence → best-supported approved view(s) → simplest recognizable Blockbench-buildable interpretation. Do not average drift.

Use the simplest construction that preserves visible requirements; examples are not presets. Local rigid transform may be **Cube-owned**; shared orientation/contact/articulation is **Group/Bone**-owned. Form/contact/articulation-defining hierarchy may belong in primary blockout; neutral organization stays downstream.

Local correction:

```text
fresh target state
→ TRANSLATE | RESIZE | ROTATE | REATTACH | SPLIT | MERGE/REMOVE | grounded ADD MASS
→ fresh affected evidence
→ IMPROVED | UNCHANGED | REGRESSED
```

After Geometry `PASS`, add identity-weighted secondary geometry only when silhouette, recognizability, contact/layering, or motion benefits.

### 3.2 Canonical UV / Texture Vocabulary

Never collapse these into one generic authoring stage:

```text
UV LAYOUT       = geometry → atlas coordinate mapping
TEXTURE ATLAS   = bitmap/PNG canvas that stores pixels
TEXTURE STYLING = color/material/shading/detail authored into the atlas
TEXTURE VERIFY  = fresh atlas + mapped-model visual validation
```

`create_texture` creates a **Texture Atlas**. It does not create UV Layout and does not complete Texture Styling.

### 3.3 UV Layout

After Geometry `PASS`:

```text
fresh box_uv_region / authored UV state
→ final UV ownership + orientation
→ final Box-UV lock: autouv=0
→ list_textures global UV audit
→ UV LAYOUT PASS
```

UV Layout owns `uv_offset`, `autouv`, `mirror_uv`, per-face UV, `box_uv_region`, reuse, orientation, seams, and bounds. It owns no color/style decision.

Reuse fresh `place_cube` UV state. Use `inspect_element` only when face-specific mapping/orientation is missing.

### 3.4 Texture Atlas

```text
UV LAYOUT PASS
→ one base-color TEXTURE ATLAS
→ explicit 128-based production bitmap dimensions
→ retain atlas UUID / texture_id
```

The Texture Atlas is only the bitmap canvas. Atlas existence, blank pixels, or one fill color do not prove styling.

PBR normal/height/MER are support Texture Atlases and do not change UV Layout ownership. If required, create matching support atlases before final styling/material configuration.

### 3.5 Texture Styling

```text
TEXTURE ATLAS ready
→ BASE PASS
→ VALUE / FORM PASS
→ IDENTITY PASS
→ SECONDARY DETAIL PASS
```

Texture Styling owns palette, material separation, value/hue ramps, face/form shading, contact/occlusion, edge treatment, identity marks, and controlled detail.

Flat fill is only a BASE PASS when visible form/material/detail exists. Prefer Minecraft-readable stepped pixel ramps; use continuous gradient only when reference/style supports it. Noise-first styling is rejected.

### 3.6 Texture Verify

```text
fresh Texture Atlas image
+ fresh affected model views
→ UV/region
→ palette/material
→ form/contact/edge
→ seam/orientation
→ identity
→ microdetail
→ FAIL | UNVERIFIED | PASS
```

Texture Verify is evidence, not another authoring stage. A paint-tool success cannot create visual `PASS`.

After Texture Verify `PASS`: animation if required → final validation/export.

For persistent projects, save the current `.bbmodel` and deliberate deliverables at meaningful handoff/resume/park/completion boundaries, not after every mutation/capture. Keep README to one current next step plus real blockers. Git history owns prior revisions. Move completed/parked packages to `workspace/saved/`.

## 4. Repository Work

```text
AGENTS.md
→ GITHUB_RULES.md Core Rules
→ classify Bounded | Standard | Complex
→ exact owner + nearest AGENTS.md
→ recover CONTEXT.md / next-action.md only when material
→ development-brief only when Complex
→ one smallest coherent patch
→ minimum useful proof
→ STOP AND REPORT
```

A clear maintenance or standard-development task must not load `development-brief` merely because files in the repository change. Repository proof never becomes permission for image generation or local Blockbench execution.

## 5. Evidence / Continuity

```text
ChatGPT → GitHub          = source/docs/static/CI evidence
image-capable preparation = generated-reference visual evidence
Codex local / Blockbench  = installed-client/runtime/model-facing evidence

repository continuation    → next-action.md
active asset continuity    → workspace/active/<project>/README.md
saved asset package        → workspace/saved/<project>/
asset workspace rules      → workspace/README.md
stable facts               → CONTEXT.md
current proof state        → docs/knowledge/current-validation.md
current source ownership   → implementation-map.md
local acceptance procedure → operations/local-acceptance-runbook.md only when reactivated
historical rationale       → Git history / GitHub issues and PRs
```

Do not create duplicate roadmap, review index, decision log, flow owner, manifest layer, or parallel workspace-state system.
