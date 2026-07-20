# Ponytail Minimum-Sufficient Execution

## Domain role

Ponytail owns the **smallest sufficient execution slice, resource budget, preservation boundary, and stop point** for the existing Reference Studio → Codex + MCP Blockbench production flow.

Ponytail does not own product requirements, engineering method, context truth, model permissions, Runtime State, or correctness evidence. BuildIT has no single linear authority hierarchy.

New foundation decisions live in `openspec/changes/buildit-system-foundation/`. This file remains the minimum-execution contract for the current production flow.

## Active goal

Produce one reviewed final Blockbench package with the fewest safe questions, reads, model calls, image payloads, validations, and correction cycles while preserving strict quality and recovery.

## Product path

```text
CHATGPT REFERENCE STUDIO
source intake
→ fixed Minecraft/Blockbench cuboid interpretation
→ one batched high-impact clarification turn only when required
→ Production Context approval
→ one Golden-Sample-guided Reference Visual
→ internal blocking QA
→ zero or one targeted correction of the same visual
→ Reference Visual approval
→ automatic Reference Package

CODEX + MCP BLOCKBENCH
one runtime preflight
→ automatic workspace/project preparation
→ Geometry review
→ Texture review
→ optional Animation review when required
→ Final Validation review
→ final approval
→ automatic workspace completion
```

Routine upstream production has exactly two approval moments: Production Context and Reference Visual. Internal QA, technical documents, manifest generation, package audit, and delivery are automatic.

## Reference Design budget

- source inspection: once per supplied source set;
- visual-style question: zero;
- subject clarification: `0–4` high-impact questions in one turn;
- Production Context approval: one;
- normal Reference Visual generation: one;
- blocking QA: one;
- targeted correction: zero or one edit of the same image;
- alternate style generation: zero;
- optional polish: zero;
- failed draft shown as approval-ready: zero;
- Reference Visual approval: one;
- post-approval image generation: zero unless Reference Design is explicitly reopened.

The source subject owns identity and mandatory visible features. The Golden Sample owns presentation, camera, layout, orientation, and quality language. It does not donate subject identity.

The Reference Visual must depict an actual Minecraft Bedrock/Blockbench cuboid model with planned masses, meaningful cuboid variation, stepped taper, limited purposeful rotations, stable hierarchy, and crisp pixel texture.

Reject before review:

```text
NON_MINECRAFT_GEOMETRY
REALISTIC_ORGANIC_RENDER
PIXEL_TEXTURE_ONLY
GENERIC_VOXEL_FILTER
UNPLANNED_CUBE_STACKING
INSUFFICIENT_CUBOID_VARIATION
MISSING_REQUIRED_ANGLED_FORM
EXCESSIVE_ROTATION_NOISE
NON_BLOCKBENCH_BUILDABLE_FORM
GOLDEN_SAMPLE_CONSTRUCTION_DRIFT
GOLDEN_SAMPLE_LAYOUT_DRIFT
CAMERA_POSITION_DRIFT
TOP_VIEW_NOT_FOOTPRINT
CROSS_VIEW_MODEL_DRIFT
```

If the one targeted correction still fails, stop with exact blockers. Do not silently generate a new style or package.

## Reference authority and reading budget

- `PRODUCTION_CONTEXT.md` owns intended identity, scale, assumptions, mandatory interpretation, and forbidden redesigns.
- The approved Reference Visual owns visible silhouette, proportions, pose, markings, and construction appearance.
- `reference_manifest.json` owns executable crops, regions, constraints, symmetry, rotations, texture/animation limits, landmarks, and evidence requirements.
- Stage Markdown summarizes procedure; it does not duplicate executable arrays.
- `CODEX_REFERENCE_HANDOFF.md` summarizes route and non-negotiable boundaries.

When approved artifacts conflict, stop with `REFERENCE_CONFLICT`. Do not repeatedly reread every document hoping to infer a resolution.

## Codex context and call budget

- `get_runtime_status`: once at startup; repeat only after a real runtime, plugin, project, or connection change.
- `get_stage_context`: once at Stage entry and after approval, revision, or upstream reopen; never poll after every tool.
- Reference Visual preview: once per unchanged SHA-256.
- Zero-start Geometry: build primary/support masses before the first analysis.
- Revision Geometry: inspect and analyze affected views first.
- Geometry correction: maximum two non-improving bounded cycles before one focused question or justified escalation.
- Final Geometry: one manifest-required view pass, plus `right_side` only when required.
- Texture/Animation happy path: evidence/report then submission; do not duplicate submission-owned validation.
- Final Validation: one evidence-free preflight, then final evidence/export/report/submission.
- Deterministic checks precede model judgment.

## Automatic coordination

Normal production never includes manual path calculation, identity rebind, profile activation, lease acquisition, checkpoint naming, reconnect, or user JSON editing.

```text
create/open canonical project
→ automatic identity/profile/current-session ownership preparation
→ execute current Stage
```

Manual identity and lease tools remain diagnostic-only. A real lease owned by another Writer is a blocker and is never bypassed.

## Stage routes

### Geometry

```text
Stage entry
→ inspect Reference Visual once per hash
→ zero-start primary/support cuboids
→ guarded required rotations/attachments
→ primary left/front/top diagnosis
→ verify_primary_form_ready
→ structural detail
→ guarded angled details
→ bounded targeted corrections
→ final required-view diagnosis
→ conditional visual judgment only when deterministic evidence is insufficient
→ record visual decision
→ submit_geometry_for_review
→ user review
```

Rotation routes:

```text
accurate manifest attachment contract
→ rotate_cube_about_attachment

missing, ambiguous, or visibly inaccurate contract
→ apply_cube_transforms
```

Both routes validate rendered pivot and connection when `matrixWorld` data is available and invalidate affected evidence. Do not substitute axis-aligned stacks for a visibly rotated form.

`submit_geometry_for_review` owns fresh validation, readiness, checkpointing, Runtime State transition, and writer release.

### Texture

```text
UV + base + detail
→ atlas and required view evidence
→ record_stage_review_report
→ submit_stage_for_review
→ user review
```

On `STAGE_VALIDATION_NOT_PASS`, fetch structured diagnostics once, repair only named issues, regenerate affected evidence/report, and resubmit.

### Animation

Run only when the approved manifest requires it:

```text
required clips only
→ hierarchy/pivot/neutral evidence
→ record_stage_review_report
→ submit_stage_for_review
→ user review
```

### Final Validation

```text
verify current Geometry readiness
→ evidence-free contract preflight once
→ final atlas/views/document/export
→ record_stage_review_report
→ submit_stage_for_review
→ final user review
→ complete_stage(FINAL_VALIDATION)
→ automatic workspace completion
```

## Model execution budget

Model execution is defined in `engines/codex/MODEL_ROUTING.md`:

```text
Capability Gate
→ Candidate Pool
→ Model Selector
→ fixed permissions
```

The current deterministic selector remains the runtime baseline. RouteLLM is evaluation-only until the foundation change records successful provider integration, calibration, and quality acceptance.

- no model call exists only to choose another model;
- one Writer performs all active Asset mutations;
- read-only mechanical work may use a lower-cost eligible route;
- visual judgment is conditional;
- critical review requires an eligible reason and remains rare;
- deterministic validation wins over unnecessary advisory calls.

## Loop prevention

Forbidden:

- asking the user to choose the fixed Minecraft/cuboid style;
- realistic, cinematic, generic-voxel, or alternate-style output;
- repeated questions for approved or visible facts;
- presenting a known-invalid Reference Candidate;
- optional polish after a valid approved visual exists;
- a third routine upstream approval;
- analyzing empty Geometry;
- repeated manual guessing when a guarded transform route exists;
- mandatory visual-advisor calls for deterministic work;
- duplicate validation before a submission that validates internally;
- rereading all package documents when current Stage context is sufficient;
- parallel Writers, recursive delegation, reconnect loops, or duplicate output versions;
- runtime RouteLLM adoption without the accepted evaluation boundary.

## Stop conditions

Stop only for:

- unresolved Reference Conflict or reopened product decision;
- a Reference Candidate that remains invalid after the allowed correction;
- missing mandatory runtime;
- unsafe mutation;
- Writer conflict;
- evidence that cannot be regenerated;
- failed gate with no valid recovery route;
- required user Review Gate.

## Measurement freeze

Do not add another runtime tool, role, profile, review gate, evidence class, checkpoint class, prompt variant, or style before current acceptance evidence proves a need.

Measure before further optimization:

```text
MCP calls
Stage-context bytes
model routes and tokens
correction cycles
image payload bytes
checkpoint sizes
elapsed Stage time
validation failures
user revision count
```

A theoretical micro-optimization without measured evidence is `DEFERRED_NOT_REQUIRED`.

## Historical implementation notes

The detailed Rhino/giraffe incidents, completed implementation tasks, and compatibility history remain in the existing proposal/tasks and Git history. They do not belong in the active minimum-execution path.
