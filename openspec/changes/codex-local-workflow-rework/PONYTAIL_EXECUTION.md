# Ponytail Minimum-Sufficient Execution

## Active goal

Run one clear path from ChatGPT reference creation to the final Blockbench package with the fewest safe questions, reads, model calls, image payloads, validations, and correction cycles. Quality gates remain strict; duplicated work, alternate styles, and speculative polish are removed.

## Canonical upstream-to-downstream path

```text
CHATGPT REFERENCE STUDIO
source intake
→ apply fixed Minecraft / Blockbench cuboid interpretation
→ one batched clarification turn only when a low-confidence subject decision has high production impact
→ Production Context approval
→ one Golden-Sample-locked Minecraft cuboid Reference Visual
→ hidden blocking QA
→ maximum one targeted correction of the same visual only when required
→ only a QA-passing visual reaches Reference Visual approval
→ automatic technical package + audit + candidate ZIP

CODEX + MCP-BLOCKBENCH
one runtime preflight
→ create/open canonical Bedrock project
→ stage context + identity sync + one selected Terra writer lease
→ Geometry review
→ Texture review
→ optional Animation review only when required
→ Final Validation review
→ final approval
→ workspace completion
```

Routine ChatGPT production has exactly two approval moments: Production Context and Reference Visual. Technical document generation, package audit, and ZIP delivery are automatic. Golden Sample promotion is a separate repository action, not a third routine approval.

## Minecraft-only upstream lock

The Reference Studio has one visual style only: actual Minecraft Bedrock / Blockbench cuboid pixel art.

The source image supplies identity, proportions, features, markings, and attachments. The Golden Sample supplies construction language, panel layout, camera, facing direction, spacing, and technical presentation.

The generated model must use:

- planned primary and secondary cuboid masses;
- deliberate variation in cuboid width, height, and depth;
- stepped forms for controlled taper;
- limited purposeful one-axis rotations for approved angled features;
- stable major masses, readable hierarchy, and separable moving parts;
- crisp Minecraft pixel texture.

The following are blocking and are corrected internally before review:

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

Do not ask the user to choose realistic versus Minecraft, a stylization level, or whether cuboids should be used. Those are not unresolved decisions.

## Reference Visual execution budget

- source inspection: once per supplied source set;
- visual-style classification question: zero;
- subject clarification: `0–4` high-impact questions in one turn;
- Production Context approval: one;
- normal Reference Visual generation: one;
- blocking QA pass: one;
- targeted correction: zero or one edit of the same image;
- optional polish iteration: zero;
- alternate-style generation: zero;
- failed draft shown to user: zero;
- Reference Visual approval: one;
- post-approval image generation: zero.

When the first image fails, use the one correction only for the named blockers. When the correction still fails, stop with the exact codes. Do not generate another board, return to source intake, ask broad questions, or offer alternate styles.

## Golden Sample position budget

For bilateral assets use exactly:

```text
UPPER: LEFT SIDE | FRONT | BACK
LOWER: TOP / FOOTPRINT | FRONT-LEFT 3/4
```

- Left Side: strict profile facing left.
- Front and Back: centered, upright, same height and ground line.
- Top / Footprint: true top-down, front/head pointing left.
- Front-left 3/4: subject faces left and exposes front plus left planes.

Do not spend a generation exploring another panel arrangement.

## Single-source rule

- `PRODUCTION_CONTEXT.md` owns user intent, scale, assumptions, mandatory Minecraft interpretation, and forbidden redesigns.
- The approved Reference Visual owns visible identity, cuboid construction appearance, silhouette, proportions, pose, and texture.
- `reference_manifest.json` owns executable numeric crops, regions, part constraints, symmetry/asymmetry, rotations, Texture limits, Animation limits, and required evidence.
- Stage Markdown files provide concise human-readable build and review procedure; they do not duplicate large executable arrays.
- `CODEX_REFERENCE_HANDOFF.md` owns only authority order, route, stage mapping, and non-negotiable boundaries.

When authorities conflict, stop with `REFERENCE_CONFLICT`; do not resolve the conflict by rereading every document repeatedly.

## Codex call and context budget

- `get_runtime_status`: once at startup; repeat only after a real runtime error, plugin reload, project replacement, or connection warning.
- `get_stage_context`: once at stage entry and once after approval, revision, or upstream reopen; do not poll it after every MCP call.
- Reference Visual preview: once per unchanged SHA-256.
- Zero-start Geometry: inspect the reference, build primary masses from the manifest, then capture/analyze. Never analyze a blank project.
- Existing/revision Geometry: capture only affected views first, then diagnose.
- Geometry correction: maximum two bounded non-improving cycles before setting an attention flag and asking one focused question or escalating.
- Final Geometry: one manifest-required view pass; add `right_side` only for `ASYMMETRIC` assets.
- Texture/Animation happy path: record the bound report, then submit. Submission already runs fresh validation; do not call the same validation immediately beforehand.
- Final Validation: one `require_evidence=false` preflight before final capture/export, then report and submit; submission performs the final evidence-aware validation.
- Sol Medium: no mandatory startup call. Use only for unresolved cross-view judgment, subjective feedback after deterministic evidence, or a final artistic decision that Terra cannot close safely.
- Sol High: at most once for one coded critical decision after Medium failed.
- Mini: only for sizeable mechanical read-only work; no subagent for micro work.

## Stage path

### Geometry

```text
stage entry
→ identity/lease
→ inspect Reference Visual once per hash
→ zero-start: build primary form first
   existing/revision: capture affected views first
→ fixed-scale diagnosis
→ bounded targeted edits
→ final required-view diagnosis
→ conditional visual judgment
→ record visual decision
→ submit_geometry_for_review
→ user review
```

`submit_geometry_for_review` owns fresh Geometry validation, review readiness, checkpoint creation, state transition, and lease release. No duplicate validation call is added immediately before it.

### Texture

```text
UV + base + detail
→ atlas and required view evidence
→ record_stage_review_report
→ submit_stage_for_review
→ user review
```

If submission reports `STAGE_VALIDATION_NOT_PASS`, call `validate_reference_contract` once for structured diagnostics, repair only named issues, regenerate affected evidence/report, and resubmit.

### Animation

Run only when required by the approved manifest:

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
→ validate_reference_contract(require_evidence=false) once
→ final atlas and required-view evidence
→ complete VALIDATION.md
→ export canonical final model/textures
→ record_stage_review_report
→ submit_stage_for_review
→ final user review
→ complete_stage(FINAL_VALIDATION)
→ workspace completion
```

## Model routing

```text
normal implementation  → Terra Medium parent directly
large read-only audit  → routine_auditor / Mini Low when worthwhile
fallback sole writer   → mcp_builder / Terra Medium only when needed
visual judgment        → visual_director / Sol Medium only with a reason
critical decision      → critical_reviewer / Sol High once
```

Exactly one Terra writer may mutate the active asset. Deterministic validation always wins over unnecessary model review.

## Loop prevention

Forbidden:

- asking which visual style the user wants;
- realistic, semi-realistic-render, cinematic, generic-voxel, or alternate-style output;
- repeated user questions for visible or already approved facts;
- showing a known-invalid Reference Visual for approval;
- a second normal Reference Visual generation;
- optional polish after a valid visual exists;
- a third routine ChatGPT approval;
- analyzing empty Geometry;
- mandatory Sol calls for deterministic work;
- `get_runtime_status` on every stage;
- `get_stage_context` polling after every tool call;
- duplicate validation immediately before a submission tool that validates internally;
- rereading all package documents when compact stage context is current;
- parallel writers, recursive delegation, reconnects, plugin reloads, or new Codex sessions;
- new output versions, duplicate packages, or speculative features.

## Stop conditions

Stop only for an unresolved authority conflict, a Reference Visual that remains non-Minecraft or inconsistent after the one allowed correction, missing mandatory runtime, unsafe mutation, write-lease conflict, evidence that cannot be regenerated, failed gate with no safe repair route, or a required user review.

## Reproducible P0 correction

The giraffe simulation produced a realistic animal render with pixelated texture and Golden Sample position drift. That is a reproducible upstream P0, not a request for a new feature. This correction removes the invalid style branch while preserving all existing Geometry, rotation, manifest, Codex, and MCP rules.

## Deferred

- merge into `V1`;
- production release;
- learned routing or persistent routing telemetry;
- unrelated mesh, PBR, Hytale, armature, or multi-project expansion;
- any additional Reference Studio style, sheet, approval, or regeneration mode.

## Pre-local optimization freeze

After the Minecraft-only upstream correction, manifest-only authority, and compact-context cleanup, do not add or merge another runtime tool, model role, profile, review gate, evidence type, checkpoint class, image style, prompt variant, or approval stage before the local acceptance run unless it fixes a reproducible P0 blocker or removes a proven duplicate authority.

Further optimization requires measured local acceptance evidence: actual MCP call count, stage-context response bytes, model-route usage, correction cycles, image payload bytes, checkpoint sizes, and elapsed stage time. A theoretical micro-optimization without those measurements is `DEFERRED_NOT_REQUIRED`.
