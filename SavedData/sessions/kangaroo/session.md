# Kangaroo (Bedrock Entity) Session Plan

**Status:** READY_FOR_MAIN_GEOMETRY
**Model:** Kangaroo  
**Session objective:** Create a Blockbench-ready Bedrock Entity with approximately player-height silhouette, correct attachment logic, and marketplace-quality look before any manual export.

## 1) Mandatory identity (must be set before edits)

- Asset name: `kangaroo`
- Identifier prefix: `kang` (system identifier may use `kang_<asset>_...`)
- Target category: `Bedrock Entity` (not export-ready yet)
- In-game function: `hostile-neutral creature`, optional ambient idle/walk/attack if animation phase is added later
- Target visual quality: `marketplace-grade` for non-animated production baseline
- Height target: approximately player-height (1.67m-1.85m equivalent in model scale)
- Visual references to use:
  - Reference package: `SourceDocument/reference-samples/kangaroo/`
  - `01..09_kangaroo_*` sheets (format only, non-dedicated unless user explicitly says "build this exact model")
- Default UV mode: `Per-face UV`
- Output scope for this cycle: Model in Blockbench only (`.bbmodel`), no export step

## 2) Project files loaded each session

- `SourceDocument/modeling/mandatory-blockbench-mcp-procedure.md`
- `SourceDocument/modeling/phase-detail-contract.md`
- `SourceDocument/modeling/operator-one-page-checklist.md`
- `SourceDocument/modeling/quality-implementation-rules.md`
- `SourceDocument/modeling/model-session-checklist-template.md` (for feedback capture)
- `SourceDocument/modeling/model-session-lock-template.md` (per-asset lock)
- `SourceDocument/modeling/mcp-smoke-test-checklist.md`
- `SourceDocument/modeling/reference-package-pass-fail-checklist.md`
- `SourceDocument/modeling/marketplace-reference-intelligence-template.md`
- `SourceDocument/modeling/marketplace-reference-to-mcp-map.md`
- `SourceDocument/engine/WORKFLOW_HUB.md`, `SavedData/ACTIVE_PROJECT.md`
- OpenSpec: `openspec/config.yaml`, `openspec/changes/mcp-blockbench-workflow/*`

## 3) Reference interpretation (must complete before Main Geometry)

### Required outputs from reference review

1. Silhouette intent (front-side-back read)
2. Height/width/depth ratio near player silhouette
3. Key geometry anchors (torso, hind/fore limbs, head, feet contact)
4. Attachment hierarchy and pivot risk map
5. Cube-to-texture partitioning plan
6. Risk log:
   - floating accessories
   - overlapping geometry
   - tiny decorative cubes
   - texture fragmentation

### Must-hold decisions before geometry editing

- Do not copy mesh.
- Use larger geometry blocks first; reserve micro-detail for texture.
- No cosmetic changes before phase approval.
- Preserve user-provided manual edits from prior session if any.

## 4) Phase plan (execution is one phase only per cycle)

### Phase A: Reference Collection (required first pass)

- Goal: lock visual intent and constraints for a player-height kangaroo.
- Output: signed reference summary + cube-vs-texture split + atlas size decision.
- Gate: proceed only if `Needs Verification`/`Assumption` items are explicitly accepted.
- Allowed actions: documentation only.

### Phase B: Main Geometry

- Goal: build major volumes only (core body, limbs, head, ears, tail mass).
- Allowed:
  - 1 root group + body hierarchy
  - large readable volumes
  - placeholder colors
  - clean attachments
- Forbidden:
  - UV / painting
  - decorative micro-cubes
  - animation rigging
- Exit gate:
  - Silhouette readable in Front/Side/Back/3-4
  - No obvious floaters or collisions
  - `No` major floating parts (feet, jaw, ear chain, tail join)

### Phase C: Geometry Detailing

- Goal: reinforce silhouette/depth only with justified cubes.
- Allowed:
  - bulk/attachment clarifiers
  - structural transitions (leg-to-body transition, shoulder/hip shaping)
- Forbidden:
  - 1-2 px decorative cubes
  - texture-like trim as geometry
- Exit gate:
  - Geometry supports target pose and identity
  - Texture-only items moved to texture phases

### Phase D: UV Texture

- Goal: compact single-atlas mapping.
- Start with `32x32` unless approved otherwise.
- Allowed:
  - UV packing
  - mirrored/reused UV for repeated anatomy
  - one clear focal UV density plan
- Exit gate:
  - No fragmented layout beyond justified needs
  - Reused UV areas safe

### Phase E: Base Texturing

- Goal: establish base color separation and major material families.
- Allowed:
  - broad fills
  - color blocking
- Forbidden:
  - heavy gradients/polish
- Exit gate:
  - Main materials readable and non-flat

### Phase F: Detail Texturing

- Goal: gradients, seams, shadows, trim, and focal depth.
- Allowed:
  - stepped shading
  - readable facial region treatment
  - paw, face, fur directionality hints
- Exit gate:
  - Large surfaces are not single-color
  - Focus areas show depth and directional cues

### Phase G: Polish

- Goal: close visible issues only.
- Allowed:
  - local fixes (max 2 critical in one cycle)
- Forbidden:
  - broad remodel
- Exit gate:
  - User acceptance on visible side/front checks
  - No blockers remain

### Phase H: Final Review

- Output:
  - scores: geometry, texturing, UV efficiency, attachment stability
  - explicit user decision (revise / handoff / pause / reopen)
- No edits unless user reopens a specific phase.

## 5) Anti-overengineering controls (Ponytail-aligned)

- One active session lock only for `kangaroo`.
- Max edits per phase cycle: minimal bounded part.
- No phase skips unless user explicitly allows.
- If same blocker repeats 2 cycles: stop and request scope reset.
- One scorecard pass per phase.

## 6) Scoring baseline (minimum acceptance)

- Geometry score target: `>= 8/10`  
- Texture score target: `>= 8/10`  
- UV compactness target: `>= 8/10`  
- Attachment/anchor correctness: `no floaters` / `no major z-fighting`

## 7) Required user inputs before Main Geometry

- Confirm height intent as **player-height**.
- Confirm atlas size (16x16 or 32x32; default 32x32 unless requested).
- Confirm complexity level (Simple / Medium / Detailed).
- Confirm whether animation is in-scope this cycle.
- Confirm manual edits to preserve from previous attempt (if any).

**Resolved in this cycle:**

- Height intent: player-height confirmed.
- Atlas size: `32x32` (default, confirmed).
- Complexity level: medium (from user previous planning).
- Animation: not in scope for this cycle.
- Manual edits: preserve all prior user-edits if present; no additional manual edits currently detected.

## 8) Phase-0 Reference Intake (Executed)

Reference package used: `SourceDocument/reference-samples/kangaroo/`

### Reference validation (from package structure)

- `01..09_*` sheets are present and in order.
- Format is treated as an example reference-sheet strategy, not a strict 1:1 geometry target.
- Do/Don't and scale sheets are available for phase-safe interpretation.

### Geometry intent derived

- Target category confirmed: **Bedrock Entity**.
- Working volume: player-height stylized kangaroo silhouette; large readable primary masses first.
- Detail policy:
  - Structural form: large cubes/meshes only.
  - Micro-detail: texture-first.

### Risk register (Reference phase)

- P0: floating core parts
  - Mitigation: enforce parent hierarchy and major anchors before adding any secondary geometry.
- P0: minor-cube noise
  - Mitigation: reject 1-2px decorative cubes in Main Geometry.
- P1: texture-only details encoded as geometry too early
  - Mitigation: defer textures and details to UV/Texture phases.

## 9) MCP/Workflow Readiness Snapshot

Date/time: 2026-07-06

- Endpoint: `http://localhost:3000/bb-mcp` (reachable)
- Tool list: 97 tools, required tools present.
- Active project: `Kangaroo Bedrock Entity` (format `bedrock`, UV `per_face`, 32x32).
- Session lock: active and reused.
- Checkpoint: saved as `kangaroo_ref_collection_ready_maingeometry` (index 10/10).
- Session id: `a53fc9d2-53b2-414e-bc89-664370cf4c0b`
- Smoke artifacts: baseline screenshot saved to `SavedData/sessions/kangaroo/artifacts/ref_collection_20260706_front_default.png`.

## 8) Next step (first actionable item)

Start with `Main Geometry`:
1. Keep changes bounded to major volumes and hierarchy only.
2. Apply one-phase scope, one checkpoint, and screenshot gate.
3. Move once phase output is reviewed against Main Geometry exit gate.

## Acceptance Criteria

- This file contains all phase gates and lock controls needed to recover a new chat session.
- The plan is explicit that no modeling edits happen without phase approval and OpenSpec checks.
- Geometry-to-texture decisions are locked before texture phases.
- This session is safe to hand over to a new Codex chat or different PC.


