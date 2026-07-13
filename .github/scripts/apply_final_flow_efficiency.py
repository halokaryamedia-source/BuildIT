from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def read(path: str) -> str:
    return (ROOT / path).read_text(encoding="utf-8")


def write(path: str, content: str) -> None:
    target = ROOT / path
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(content.rstrip() + "\n", encoding="utf-8")


def replace_once(path: str, old: str, new: str) -> None:
    source = read(path)
    count = source.count(old)
    if count != 1:
        raise RuntimeError(
            f"{path}: expected exactly one replacement, found {count}: {old[:160]!r}"
        )
    write(path, source.replace(old, new, 1))


# ---------------------------------------------------------------------------
# Ponytail and OpenSpec: one minimum-sufficient upstream-to-downstream flow
# ---------------------------------------------------------------------------

write(
    "openspec/changes/codex-local-workflow-rework/PONYTAIL_EXECUTION.md",
    r'''# Ponytail Minimum-Sufficient Execution

## Active goal

Run one clear path from ChatGPT reference creation to the final Blockbench package with the fewest safe questions, reads, model calls, image payloads, validations, and correction cycles. Quality gates remain strict; duplicated work and speculative polish are removed.

## Canonical upstream-to-downstream path

```text
CHATGPT REFERENCE STUDIO
source intake
→ one batched clarification turn only when a low-confidence decision has high production impact
→ Production Context approval
→ one Golden-Sample-guided Reference Visual
→ blocking QA; maximum one targeted edit only when required
→ Reference Visual approval
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

## Single-source rule

- `PRODUCTION_CONTEXT.md` owns user intent, scale, assumptions, and forbidden redesigns.
- The approved Reference Visual owns visible identity, silhouette, proportions, pose, and appearance.
- `reference_manifest.json` owns executable numeric crops, regions, part constraints, symmetry/asymmetry, rotations, Texture limits, Animation limits, and required evidence.
- Stage Markdown files provide concise human-readable build and review procedure; they do not duplicate large executable arrays.
- `CODEX_REFERENCE_HANDOFF.md` owns only authority order, route, stage mapping, and non-negotiable boundaries.

When authorities conflict, stop with `REFERENCE_CONFLICT`; do not resolve the conflict by rereading every document repeatedly.

## Call and context budget

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

- repeated user questions for visible or already approved facts;
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

Stop only for an unresolved authority conflict, missing mandatory runtime, unsafe mutation, write-lease conflict, evidence that cannot be regenerated, failed gate with no safe repair route, or a required user review.

## Deferred

- merge into `V1`;
- production release;
- learned routing or persistent routing telemetry;
- unrelated mesh, PBR, Hytale, armature, or multi-project expansion.
''',
)

write(
    "openspec/changes/codex-local-workflow-rework/proposal.md",
    r'''# Proposal: Codex Local Workflow Rework

## Goal

Create one precise, visually grounded, recoverable, and token-efficient pipeline from ChatGPT Reference Studio through final Blockbench completion. Keep all work isolated on `Rework` until explicit integration approval.

The workflow must not ask the user to edit runtime files, choose worker models/profiles, run internal tests, reconnect MCP, reload the plugin, or restart Codex during normal production.

## Canonical architecture

```text
mcp-blockbench/  complete MCP Blockbench package
engines/         ChatGPT, Codex, and shared orchestration authority
workspace/       active and completed Blockbench projects
docs/            authored docs and generated API output
openspec/        approved scope, decisions, and flow constraints
```

Each active asset separates:

```text
blockbench/   canonical model, textures, references, approved previews
mcp/          state, contracts, checkpoints, evidence, reports, final staging
```

## Upstream ChatGPT contract

A new sample begins as `reference_candidate`. ChatGPT performs one batched high-impact clarification turn when necessary, then uses exactly two routine approvals:

1. Production Context;
2. one Golden-Sample-guided Reference Visual.

Technical Markdown, schema-3.3 manifest, Codex handoff, package audit, and candidate ZIP are generated automatically after visual approval. The tracked Black Rhinoceros Golden Sample is the mandatory design-system and technical-completeness benchmark, while its subject-specific anatomy and palette are never copied into another asset.

## User-visible production stages

1. Geometry review;
2. Texture review;
3. Animation review only when required;
4. Final Validation review.

Internal passes, diagnosis scopes, routing, preflight, checkpoints, and evidence generation are not additional user gates.

## Minimum-sufficient execution

- one runtime preflight at startup;
- compact stage context only at stage entry/transition/revision;
- one Reference Visual inspection per unchanged hash;
- zero-start Geometry builds primary form before first analysis;
- affected-view diagnosis during correction;
- one final manifest-required view pass;
- submission tools own fresh validation/checkpoint/state transition;
- no duplicate happy-path validation;
- Final Validation uses one evidence-free preflight before final evidence/export;
- deterministic checks replace model judgment whenever possible;
- Sol Medium is conditional, not mandatory;
- one selected Terra writer performs all active-asset mutations.

## Adaptive model routing

```text
parent default       Terra Medium, direct normal implementation
routine_auditor      5.4 Mini Low, read-only mechanical work
mcp_builder          Terra Medium, fallback sole writer
visual_director      Sol Medium, conditional read-only visual judgment
critical_reviewer    Sol High, one coded critical decision only
```

High is the maximum. Extra High, Max, Ultra, Fast, recursive delegation, broad fan-out, and parallel writers are excluded.

## Included quality and recovery

- one Reference Visual plus concise stage documents and executable manifest;
- fixed-scale transformed Geometry analysis;
- semantic view/region/part diagnosis;
- part, count, parent, symmetry/asymmetry, rotation, Texture, and Animation contracts;
- conditional Right Side evidence for asymmetric assets in Geometry and Final Validation;
- project identity synchronization before lease acquisition;
- one stable MCP tool surface and one Codex/MCP session;
- atomic reports, checkpoints, transitions, revision preparation, upstream reopen, and final promotion;
- active/completed workspace lifecycle with immutable completed baseline;
- automated typecheck, tests, build, bundle, and flow-efficiency regression coverage.

## Excluded until explicit approval

- merge into `V1`;
- release/deployment;
- learned routing or persistent routing telemetry;
- duplicate/versioned authorities or outputs;
- unrelated modelling capabilities outside approved Bedrock cuboid production.
''',
)

write(
    "openspec/changes/codex-local-workflow-rework/specs/codex-local-workflow/spec.md",
    r'''# Codex Local Workflow Specification

## Governance

OpenSpec SHALL preserve approved scope and authority. Ponytail SHALL select the smallest safe operation required by the active stage.

Normal recovery SHALL read only governance, the active OpenSpec/Ponytail summary, selected workspace index, current project/state files, the reference core, and the active-stage contract. It SHALL NOT scan unrelated assets, copied chat context, legacy prompt packs, or old session folders.

## Upstream reference intake

The approved package SHALL contain Production Context, one Reference Visual, Geometry, Texturing, Animation, Validation, schema-3.3 manifest, and Codex handoff. The Golden Sample SHALL be the mandatory layout/quality benchmark. Legacy numbered sheets and additional routine approval moments SHALL NOT be required.

Routine ChatGPT generation SHALL have exactly two approval moments. Technical package generation and audit SHALL be automatic.

## Authority order

1. Production Context for intent and decisions;
2. approved Reference Visual for visible design;
3. manifest for executable numeric contracts;
4. stage Markdown for concise human procedure;
5. Codex handoff for route and boundaries.

## Runtime state

`workspace/active/<asset>/mcp/state.json` SHALL be runtime authority. `workspace/workspace.json` SHALL only select the active asset. User-facing files SHALL remain under `blockbench/`; internal state/evidence/checkpoints/reports SHALL remain under `mcp/`.

## State sequence

```text
REFERENCE_READY
→ GEOMETRY_IN_PROGRESS
→ GEOMETRY_REVIEW
→ GEOMETRY_APPROVED
→ TEXTURE_IN_PROGRESS
→ TEXTURE_REVIEW
→ TEXTURE_APPROVED
→ ANIMATION_IN_PROGRESS or ANIMATION_SKIPPED
→ ANIMATION_REVIEW / ANIMATION_APPROVED when required
→ FINAL_VALIDATION
→ FINAL_REVIEW
→ DONE
```

Broad feedback SHALL reopen the earliest affected stage while preserving accepted areas.

## One-time preflight and context budget

`get_runtime_status` SHALL run once at startup and repeat only after a real runtime/connection/project replacement event. `get_stage_context` SHALL run at stage entry and after approval, revision, or upstream reopen. It SHALL NOT be polled after every MCP call.

Fresh identity, preflight, reference hash, analyzer, and evidence results SHALL be reused until their explicit freshness keys change.

## Geometry branch

After Reference Visual inspection:

- zero-start project: build primary masses from manifest before first capture/analyze;
- existing/revision project: capture affected views and diagnose before mutation.

The first analysis of a blank model is forbidden. Corrections SHALL use affected views and bounded cycles. Final review SHALL use all manifest-required views, including Right Side only for asymmetric assets.

## Review submission

`submit_geometry_for_review` SHALL own fresh Geometry validation, review readiness, checkpoint, state transition, and lease release.

For Texture and Animation, normal flow SHALL be evidence → bound report → `submit_stage_for_review`. The submission tool SHALL own fresh validation. A separate validation call SHALL occur only after a failed submission when structured diagnostics are needed.

Final Validation SHALL run one `require_evidence=false` preflight before final evidence/export, then create final evidence, export, record the bound report, and submit. Submission SHALL run the final evidence-aware validation.

## Model routing

Normal implementation SHALL use the Terra Medium parent. `mcp_builder` SHALL be fallback sole writer only when necessary. Mini SHALL handle sizeable mechanical read-only work. Sol Medium SHALL be conditional on unresolved visual judgment; it SHALL NOT be called solely because a stage started. Sol High SHALL be used at most once for one coded critical decision.

## One-session execution

All stages, approvals, revisions, and upstream reopen SHALL remain in one Codex session and one MCP session. Transitions SHALL release the old lease, call stage context, and acquire a fresh lease without reconnect, reload, or restart.

## Efficiency and stop conditions

The agent SHALL use structured outputs, direct evidence writes, atomic checkpoints, bounded image transport, deterministic validation, and stage-specific guarded completion. It SHALL stop only for a real authority conflict, mandatory runtime failure, unsafe mutation, lease conflict, unrecoverable evidence failure, failed gate without a repair route, or user review. Unrelated work SHALL be `DEFERRED_NOT_REQUIRED`.
''',
)

write(
    "openspec/changes/codex-local-workflow-rework/specs/skill-orchestration/spec.md",
    r'''# Skill Orchestration Specification

## Canonical skills

Upstream reference creation SHALL use `blockbench-reference-studio` from `engines/chatgpt/skills/`.

Production SHALL use only:

```text
blockbench-production
blockbench-geometry
blockbench-texture
blockbench-animation
blockbench-validation
```

Canonical production sources SHALL remain in `engines/shared/skills/`; `.agents` and `.codex` copies SHALL be synchronized adapters.

## Stage mapping

```text
BOOTSTRAP        → blockbench-production
GEOMETRY         → blockbench-production + blockbench-geometry
TEXTURE          → blockbench-production + blockbench-texture
ANIMATION        → blockbench-production + blockbench-animation
FINAL_VALIDATION → blockbench-production + blockbench-validation
```

No production stage SHALL load more than two skills. Animation SHALL NOT load when skipped.

## Context budget

The dispatcher SHALL resolve the selected asset and active stage from workspace/state authority. It SHALL call runtime status once at startup, call stage context only at stage entry/transition/revision, read only active-stage documents, and avoid loading unrelated production or repository-development skills.

## Writer and advisor selection

Exactly one Terra writer SHALL mutate the active asset. The Terra parent is default; `mcp_builder` is fallback when the parent differs or isolation is safer. Advisors SHALL remain read-only. Sol Medium SHALL be conditional rather than a mandatory stage step.

## Submission ownership

Stage skills SHALL NOT duplicate fresh validation immediately before a submission tool that already validates. Texture and Animation SHALL record a bound report then submit. Final Validation MAY perform one evidence-free preflight before final output generation, then record and submit.

## Separation from repository development

MCP source development SHALL load only the smallest relevant development authority. Production skills SHALL NOT be loaded for repository patching.

## Deprecated skills and flows

The workflow SHALL NOT use or recreate `blockbench-use`, `blockbench-modeling`, `blockbench-texturing`, numbered reference sheets, extra approval stages, repair profiles, reconnect instructions, or versioned replacement names.
''',
)

write(
    "openspec/changes/codex-local-workflow-rework/specs/workflow-efficiency-tools/spec.md",
    r'''# Workflow Efficiency Tool Specification

## Compact context

`get_runtime_status` SHALL be a startup/runtime-recovery check, not a per-stage polling tool. `get_stage_context` SHALL return one stage-specific next operation at entry/transition/revision. Reference preview SHALL return the next operation after inspection so Codex does not poll context between inspection and first diagnosis.

## Geometry startup

Reference preview SHALL distinguish zero-start from existing Geometry. Zero-start SHALL return `BUILD_PRIMARY_FORM_FROM_MANIFEST`; existing Geometry SHALL return `capture_visual_feedback`. Blank Geometry SHALL NOT be analyzed.

## Compact validation

`validate_reference_contract` SHALL provide structured stage-aware diagnostics. Texture and Animation happy paths SHALL rely on the fresh validation inside `submit_stage_for_review`; a standalone validation call SHALL be used only after submission failure for detailed repair routing.

Final Validation SHALL allow one `require_evidence=false` preflight before final outputs. Final submission SHALL require all current evidence and outputs.

## Direct evidence

Texture and final atlas evidence SHALL be written directly to approved paths instead of being transported through model context. Geometry corrections SHALL return metrics by default and suppress routine diff image payloads.

## Atomic submission and completion

Submission SHALL verify bound report/evidence, run fresh validation, save the next checkpoint, transition atomically, and release the lease. Completion SHALL verify review state, PASS report, evidence, UUID, state revision, and lease before approving and moving to the next stage without reconnect.

## Context and image budget

Reference Visual transport SHALL be bounded and hash-authoritative. Only affected views SHALL be used during correction. One final manifest-required pass SHALL be used; asymmetric assets additionally require Right Side. Fresh evidence SHALL be reused until project identity, source hash, fingerprint, transformed world signature, or evidence hash changes.

## Structured outputs and safety

Agents SHALL consume `structuredContent` rather than parse JSON from prose. All writes SHALL remain inside the canonical active asset roots and use atomic replacement/rollback.
''',
)

# Add a completed efficiency section before local acceptance tasks.
tasks_path = "openspec/changes/codex-local-workflow-rework/tasks.md"
tasks = read(tasks_path)
marker = "## Final flow-efficiency audit"
if marker not in tasks:
    insertion = r'''
## Final flow-efficiency audit

- [x] Replace Geometry-centric Ponytail scope with one upstream-to-downstream minimum-sufficient path.
- [x] Lock exactly two routine ChatGPT approval moments and automatic technical package delivery.
- [x] Make the Golden Sample a mandatory visual/technical template without copying its subject identity.
- [x] Remove active four-sheet and multi-approval instructions from the Reference Studio skill folder.
- [x] Make manifest executable data authoritative over duplicated Markdown arrays.
- [x] Run runtime status once and stage context only at entry/transition/revision.
- [x] Prevent first-pass analysis of blank Geometry and return the next operation from Reference Visual inspection.
- [x] Make Sol visual judgment conditional instead of mandatory.
- [x] Remove duplicate happy-path validation before stage submission.
- [x] Use one evidence-free Final Validation preflight before final outputs and one evidence-aware validation inside submission.
- [x] Require asymmetric Right Side before Geometry runtime reaches final-ready status.
- [x] Expand the final acceptance contract from Geometry-only to ChatGPT package through final workspace completion.
- [x] Add permanent regression tests for authority, call budgets, zero-start branching, validation ownership, and full stage routing.

'''
    tasks = tasks.replace(
        "## Final local Blockbench acceptance — remaining on the workstation",
        insertion + "## Final local Blockbench acceptance — remaining on the workstation",
        1,
    )
write(tasks_path, tasks)


# ---------------------------------------------------------------------------
# ChatGPT Reference Studio authority: two approvals, Golden Sample, no stale sheets
# ---------------------------------------------------------------------------

write(
    "engines/chatgpt/skills/blockbench-reference-studio/SKILL.md",
    r'''---
name: blockbench-reference-studio
description: "Create a complete Minecraft Bedrock / Blockbench reference candidate in ChatGPT using the Golden Sample design system, exactly two routine approvals, one generated Reference Visual, concise human contracts, and an executable schema-3.3 Codex handoff."
---

# Blockbench Reference Studio

Create the approved reference package in ChatGPT. Codex and MCP-Blockbench begin only after the package is complete.

## Language and boundary

- Speak with the user in Indonesian.
- Write production contracts, manifest values, labels, and Codex instructions in English.
- Preserve approved names, IDs, dimensions, filenames, and source identity.
- Do not connect to MCP, edit `.bbmodel`, acquire a lease, or simulate Blockbench production.

## Contract and package mode

Emit Reference Studio contract `3.3`, compatible with MCP-Blockbench `1.7.0+` and the one-session workflow.

- New work always starts as `reference_candidate` with `candidate_not_promoted`.
- `golden_sample` is a separately promoted repository baseline.
- Promotion preserves approved candidate files and exact Reference Visual hash.
- A Golden Sample is a reference package and quality benchmark, not a prebuilt model.

## Mandatory Golden Sample design system

Use the bundled or repository-tracked Black Rhinoceros Golden Sample as the prescriptive template for:

- landscape technical-board ratio;
- border, header, title, subtitle, panel-label, scale-marker, footer, spacing, and whitespace hierarchy;
- orthographic camera intent and consistent subject scale;
- concise Production Context and stage-document depth;
- executable manifest completeness;
- Codex/MCP handoff and validation quality.

Copy the design system, structure, and quality bar. Replace the rhinoceros subject completely. Never copy its anatomy, horns, proportions, palette, texture, or species-specific decisions into another asset.

A layout deviation is allowed only when a real format requirement makes the default grid impossible; record the reason in Production Context.

## Question and approval budget

Before Production Context approval:

1. inspect every supplied source;
2. extract visible facts and explicit instructions;
3. ask only `0–4` `LOW_CONFIDENCE_HIGH_IMPACT` questions;
4. batch questions into one turn when possible;
5. explain production impact and provide a recommended default;
6. never ask again for an approved or clearly visible fact.

Routine production has exactly two approval moments:

1. Production Context approval;
2. Reference Visual approval.

Technical documents, manifest, audit, and candidate ZIP are automatic after visual approval. Do not create a third routine approval. Golden Sample promotion is separate.

## Final package

```text
<asset_id>_blockbench_reference/
├─ source/original_reference.<ext>
├─ PRODUCTION_CONTEXT.md
├─ <asset_id>_reference_visual.png
├─ GEOMETRY.md
├─ TEXTURING.md
├─ ANIMATION.md
├─ VALIDATION.md
├─ reference_manifest.json
└─ CODEX_REFERENCE_HANDOFF.md
```

Then create `<asset_id>_blockbench_reference.zip`.

## Image-generation lock

- Exactly one normal generated image: `<asset_id>_reference_visual.png`.
- Maximum one targeted edit of that same image.
- The edit is used only for a blocking identity, camera, scale, crop, panel, label, or cross-view inconsistency—not optional polish.
- No image generation after Reference Visual approval.
- Hidden per-angle generation and additional technical sheets are forbidden.
- Source copies and runtime crops/diffs are evidence, not additional generated reference images.

## Phase 1 — Production Context

Prepare `PRODUCTION_CONTEXT.md` with four main categories:

1. Main Format;
2. Geometry;
3. Texture;
4. Animation.

Record identity, intended use, scale, front direction, ground plane, neutral pose, must-preserve features, interaction profile, symmetry policy, assumptions, constraints, unresolved blockers, and forbidden redesigns. Explain decisions in Indonesian and wait for explicit approval.

## Phase 2 — One Reference Visual

Generate one Golden-Sample-guided board containing:

- Left Side;
- Front;
- Back;
- Top / Footprint;
- Front-left 3/4;
- Right Side only when `symmetry_policy = ASYMMETRIC`;
- scale marker and compact footer.

Every panel must be rectangular, non-overlapping, measurable, fully framed, and consistent. Front, Left, Right, Back, and Top are orthographic in intent. Front-left 3/4 is controlled perspective.

Run one blocking QA pass. Use the single allowed targeted edit only when QA fails. Wait for explicit visual approval.

## Phase 3 — Automatic technical package

After visual approval, generate without further image creation:

- `GEOMETRY.md`;
- `TEXTURING.md`;
- `ANIMATION.md`;
- `VALIDATION.md`;
- `reference_manifest.json`;
- `CODEX_REFERENCE_HANDOFF.md`.

These files may add implementation precision but may not introduce a new visible design.

## Compact single-source writing rule

- Production Context owns decisions and assumptions.
- Reference Visual owns visible design.
- Manifest owns exact numeric arrays and executable contracts.
- Markdown stage files summarize build order, human rationale, and review expectations; do not repeat every crop, region, part, or rotation array.
- Handoff contains route and boundaries only.

## Executable manifest requirements

`reference_manifest.json` must declare:

```json
{
  "schema_version": "3.3",
  "sample_type": "reference_candidate",
  "contract": {
    "reference_studio": "3.3",
    "mcp_blockbench_minimum": "1.7.0",
    "workflow": "single_reference_visual_one_session"
  }
}
```

It must include:

- package identity, required files, image budget, promotion status, and exact visual hash/dimensions;
- Main Format envelope, `16u = 1 block`, ground plane, front direction, neutral pose, and interaction profile;
- `BILATERAL` pairs or explicit `ASYMMETRIC` contracts;
- all required panel crops with non-zero normalized coordinates, projection, scale basis, and threshold;
- weighted semantic regions with issue codes, parts, and targeted repair instructions;
- primary/critical part constraints with role, patterns, parent, reliable count/center/size ranges, views, and rotation IDs;
- one-axis rotation contracts with range, pivot/tip anchor, direction, connection, tolerance, and affected views;
- Texture atlas/UV/material/palette/alpha/color-budget/palette-drift limits;
- Animation required/skipped state, required clips, groups, pivots, duration, animator/keyframe, and root-motion limits;
- five base final views plus conditional `right_side` for asymmetric assets;
- required validation statuses and evidence.

Do not authorize compound rotation unless required. Prefer stepped cuboids over rotating major masses to fake taper.

## Automatic audit

Verify before ZIP delivery:

1. all required files exist;
2. exactly one generated Reference Visual exists;
3. numbered or additional technical PNGs are absent;
4. manifest and Markdown decisions agree;
5. hash and dimensions match the physical visual;
6. all required crops are valid and non-zero;
7. critical semantic regions and primary parts are covered;
8. every authorized rotation has a contract;
9. asymmetric assets contain measurable Right Side panel/crop;
10. `VALIDATION.md` begins `PENDING_BUILD`;
11. handoff uses current MCP tools and one-session semantics;
12. ZIP contains one canonical package root and no draft/backup/version duplicates.

## Authority order

1. `PRODUCTION_CONTEXT.md` — intent, scale, decisions, assumptions, constraints;
2. approved Reference Visual — visible identity, silhouette, proportions, pose, appearance;
3. `reference_manifest.json` — executable numeric contracts;
4. `GEOMETRY.md`, `TEXTURING.md`, `ANIMATION.md`, `VALIDATION.md` — concise human procedure;
5. `CODEX_REFERENCE_HANDOFF.md` — route and boundaries.

Use `REFERENCE_CONFLICT` when authorities cannot be reconciled without guessing.

## Codex handoff route

```text
get_stage_context
→ rebind_active_project_identity when required
→ one selected Terra writer acquires manage_project_write_lease
→ inspect_reference_visual_preview once per unchanged hash
→ zero-start: build primary form from manifest before first capture/analyze
   existing/revision: capture affected views and analyze first
→ bounded diagnosed edits
→ final manifest-required view diagnosis with write_diff_image=true
→ conditional visual_director judgment only when deterministic evidence cannot close the visual decision
→ record_geometry_visual_decision
→ submit_geometry_for_review
→ GEOMETRY_REVIEW
→ user review
```

Every non-zero rotation uses `rotate_cube_about_attachment`. Submission owns fresh validation and review transition; do not add duplicate validation immediately before it. Texture cannot begin before Geometry approval.

## Stop conditions

Stop when Production Context is unapproved, the Reference Visual still has a blocking inconsistency after one targeted edit, required crops/contracts cannot be derived safely, technical files redesign the asset, package authorities conflict, files are missing, more than one generated visual exists, or MCP execution is requested before package completion.
''',
)

write(
    "engines/chatgpt/skills/blockbench-reference-studio/templates/CODEX_REFERENCE_HANDOFF.template.md",
    r'''# Codex Reference Handoff

Status: `APPROVED`

## Asset

- Asset ID: `<asset_id>`
- Display Name: `<display_name>`
- Target Format: `bedrock_entity`
- Reference Visual: `<asset_id>_reference_visual.png`
- Manifest: `reference_manifest.json`
- Manifest Schema: `3.3`
- Sample Type: `<reference_candidate_or_golden_sample>`
- Promotion Status: `<candidate_not_promoted_or_promoted_golden_sample>`
- Canonical Model: `<asset_id>.bbmodel`

## Authority order

1. `PRODUCTION_CONTEXT.md`
2. approved `<asset_id>_reference_visual.png`
3. executable `reference_manifest.json`
4. concise stage Markdown files
5. this handoff

Stop with `REFERENCE_CONFLICT` when these cannot be reconciled. Reject legacy numbered-sheet or extra-approval packages with `LEGACY_SKILL_CONFLICT`.

## Project lock

- `1 Minecraft block = 16u`
- Envelope: `<width>u W × <depth>u D × <height>u H`
- Ground: `<ground_plane>`
- Front: `<front_direction>`
- UV: `<uv_mode>`
- Atlas: `<width>x<height>`
- Pixel Style: `<16x_or_32x>`
- Symmetry: `<BILATERAL_or_ASYMMETRIC>`
- Classic Bedrock required; PBR/Vibrant Visuals forbidden

## Startup call budget

- Call `get_runtime_status` once at startup, not once per stage.
- Call `get_stage_context` at stage entry and after approval/revision/reopen, not after every MCP call.
- Inspect the Reference Visual once per unchanged SHA-256.

## Geometry route

```text
get_stage_context
→ rebind identity when required
→ selected Terra writer acquires lease
→ inspect_reference_visual_preview
→ if zero-start: BUILD_PRIMARY_FORM_FROM_MANIFEST before first capture/analyze
   else: capture affected views and analyze
→ bounded targeted edits
→ final required-view diagnosis
→ conditional visual judgment only when needed
→ record_geometry_visual_decision
→ submit_geometry_for_review
→ lease released
→ GEOMETRY_REVIEW
```

Final views: `front`, `left_side`, `back`, `top_footprint`, `front_left_3_4`; add `right_side` only for `ASYMMETRIC`.

`submit_geometry_for_review` owns fresh validation, readiness, checkpoint, and review transition. Every non-zero rotation uses `rotate_cube_about_attachment`.

## Later stages

```text
TEXTURE
work/evidence → record_stage_review_report → submit_stage_for_review → review

ANIMATION when required
work/evidence → record_stage_review_report → submit_stage_for_review → review

FINAL_VALIDATION
verify Geometry readiness
→ validate_reference_contract(require_evidence=false) once
→ final evidence + export
→ record_stage_review_report
→ submit_stage_for_review
→ final review
→ complete_stage(FINAL_VALIDATION)
→ workspace completion
```

Submission runs fresh evidence-aware validation. If Texture/Animation submission fails validation, call `validate_reference_contract` once for structured diagnostics, repair only named issues, refresh evidence/report, and resubmit.

## Stage mapping

```text
GEOMETRY         → production + geometry  → BEDROCK_CUBOID_GEOMETRY
TEXTURE          → production + texture   → BEDROCK_CUBOID_TEXTURE
ANIMATION        → production + animation → BEDROCK_CUBOID_ANIMATION
FINAL_VALIDATION → production + validation → FINAL_VALIDATION_READONLY
```

Maximum loaded production skills: two. Animation is not loaded when skipped.

## Import

Technical files → `workspace/active/<asset_id>/mcp/references/`

Visual/source files → `workspace/active/<asset_id>/blockbench/references/`

## Non-negotiable boundaries

- Do not redesign or invent parts, materials, clips, or proportions.
- Do not use removed repair profiles.
- Do not continue through a user review automatically.
- Do not reconnect MCP, reload the plugin, or start a new Codex session.
- Do not run mandatory Sol review for deterministic work.
- Do not poll runtime/context or duplicate validation.
- Do not use PBR, Hytale, mesh, armature, vertex weight, UI automation, or risky evaluation in the normal cuboid workflow.
''',
)

write(
    "engines/chatgpt/skills/blockbench-reference-studio/references/FLOW.md",
    r'''# Reference Studio Flow

## Linear flow

```text
source intake
→ zero to four high-impact questions in one batch when needed
→ Production Context
→ APPROVAL 1
→ one Golden-Sample-guided Reference Visual
→ blocking QA; maximum one targeted edit
→ APPROVAL 2
→ automatic stage documents + executable manifest + Codex handoff
→ automatic package audit
→ reference_candidate ZIP
```

There is no routine third approval. Promotion to `golden_sample` is a separate repository action.

## States

```text
CONTEXT_DRAFT
CONTEXT_REVIEW
REFERENCE_VISUAL_DRAFT
REFERENCE_VISUAL_REVIEW
PACKAGE_BUILD
PACKAGE_AUDIT
HANDOFF_READY
```

## Import mapping

- technical contracts and manifest → `workspace/active/<asset>/mcp/references/`
- approved Reference Visual and source evidence → `workspace/active/<asset>/blockbench/references/`

Runtime state, checkpoints, diagnostics, reports, and model output are created only after Codex imports the approved package.
''',
)

write(
    "engines/chatgpt/skills/blockbench-reference-studio/references/SHEET_SPECIFICATIONS.md",
    r'''# Reference Visual Specifications

This compatibility filename is retained to prevent broken links. Numbered technical sheets are deprecated and forbidden.

## Single board

Create exactly one `<asset_id>_reference_visual.png` using the Golden Sample design system.

### Bilateral layout

```text
UPPER: LEFT SIDE | FRONT | BACK
LOWER: TOP / FOOTPRINT | FRONT-LEFT 3/4
```

### Asymmetric layout

```text
UPPER: LEFT SIDE | FRONT | RIGHT SIDE
LOWER: BACK | TOP / FOOTPRINT | FRONT-LEFT 3/4
```

Include stable borders, header/title hierarchy, labels, scale marker, compact footer, balanced whitespace, consistent subject scale, and shared ground alignment.

## Cross-view rules

All panels show the same identity, geometry, segment counts, neutral pose, material version, color family, attachments, and proportions. Only the camera changes.

The board fails when identity, scale, camera, crop, top footprint, panel label, or asymmetric Right Side is inconsistent.

Construction, Texture, Animation, and Validation information belongs in Markdown/manifest data, not additional generated images.
''',
)

write(
    "engines/chatgpt/skills/blockbench-reference-studio/references/QA_AND_REVISION_PROTOCOL.md",
    r'''# QA and Revision Protocol

## Blocking QA

Check identity, panel completeness, camera intent, scale, ground alignment, top footprint, attachments, segment counts, silhouette-critical features, label readability, and cross-view consistency.

## Failure codes

```text
CONTEXT_DRIFT
IDENTITY_DRIFT
CAMERA_DRIFT
SCALE_DRIFT
CROP_DRIFT
TOP_VIEW_DRIFT
ASYMMETRY_DRIFT
STRUCTURE_DRIFT
MATERIAL_DRIFT
TEXT_DRIFT
PACKAGE_INCOMPLETE
```

## Revision budget

- Initial Reference Visual: one normal generation.
- Targeted correction: maximum one edit of that same visual.
- Use the edit only for a blocking failure code.
- Preserve every unrelated approved area.
- If a blocking inconsistency remains after the edit, stop and report; do not generate another board.

## Reopen rules

- `REFERENCE_VISUAL_REOPEN`: only when visible identity, pose, scale, panel, or appearance changes.
- `FULL_DESIGN_REOPEN`: only when category, major proportions, attachments, interaction profile, or core design changes.
- Technical contract correction without visible redesign does not reopen image generation.

## Package audit

Verify one canonical root, required files, matching asset IDs/hashes, exactly one generated visual, no numbered/technical PNGs, schema `3.3`, valid crops/contracts, `PENDING_BUILD` validation, and no draft/backup/version duplicates.
''',
)

write(
    "engines/chatgpt/skills/blockbench-reference-studio/references/CAMERA_AND_RENDER_LOCK.md",
    r'''# Camera and Render Lock

## Standard cameras

```text
Front orthographic         azimuth 0°, elevation 0°, roll 0°
Left orthographic          azimuth 90°, elevation 0°, roll 0°
Right orthographic         azimuth -90°, elevation 0°, roll 0° (asymmetric only)
Back orthographic          azimuth 180°, elevation 0°, roll 0°
Top / Footprint            true top-down orthographic, roll 0°
Front-left 3/4             azimuth about 35°, elevation about 8°, roll 0°
```

All panels use the same subject version, neutral pose, ground plane, material, lighting, proportions, and displayed scale. Orthographic panels have no perspective distortion. No panel crops the subject.

## Golden Sample presentation lock

Preserve the Golden Sample's technical-board ratio, border hierarchy, header/title/subtitle, panel spacing, scale marker, compact footer, and balanced whitespace. Replace its subject content completely.

## Forbidden

No environment scene, action pose, cinematic light, dramatic perspective, extra prop, hidden angle generation, unreadable generated text, or additional technical image.
''',
)

write(
    "engines/chatgpt/skills/blockbench-reference-studio/references/CODEX_HANDOFF_CONTRACT.md",
    r'''# Codex Handoff Contract

## Required package

```text
<asset_id>_blockbench_reference/
├─ source/original_reference.<ext>
├─ PRODUCTION_CONTEXT.md
├─ <asset_id>_reference_visual.png
├─ GEOMETRY.md
├─ TEXTURING.md
├─ ANIMATION.md
├─ VALIDATION.md
├─ reference_manifest.json
└─ CODEX_REFERENCE_HANDOFF.md
```

No numbered or additional technical image is part of the package.

## Authority

Production Context → approved Reference Visual → executable manifest → concise stage documents → handoff.

## Import

- technical files → `workspace/active/<asset>/mcp/references/`
- visual/source evidence → `workspace/active/<asset>/blockbench/references/`

## Preflight

Codex verifies package root, asset ID, required files, schema/hash, approval state, format, scale, UV/atlas, symmetry, Animation decision, and authority consistency once. Failure is `ASSET_REFERENCE_PACKAGE_INVALID` or `REFERENCE_CONFLICT`.

## Runtime

Codex creates the model from the approved package. It does not regenerate the visual, redesign the asset, infer skipped Animation, duplicate validation, reconnect MCP, or cross user-review gates automatically.
''',
)

write(
    "engines/chatgpt/skills/blockbench-reference-studio/templates/TURNAROUND_PROMPT.md",
    r'''# Reference Visual Generation Prompt

Create one polished Minecraft Bedrock / Blockbench `REFERENCE VISUAL` from the approved source and Production Context.

Use the Black Rhinoceros Golden Sample as the mandatory layout, camera, spacing, border, scale-marker, footer, and technical-presentation template. Replace the rhinoceros subject completely.

## Locked asset

- Asset ID: `{{asset_id}}`
- Display Name: `{{display_name}}`
- Subject Type: `{{subject_type}}`
- Symmetry: `{{symmetry_policy}}`
- Height: `{{height_u}}u`
- Width: `{{width_u}}u`
- Depth: `{{depth_u}}u`
- Neutral Pose: `{{neutral_pose}}`
- Front: `{{front_direction}}`
- Recognizable Features: `{{recognizable_features}}`
- Attachments: `{{required_attachments}}`
- Segment Counts: `{{segment_counts}}`
- Material/Color Family: `{{color_family}}`

## Required panels

Bilateral: Left, Front, Back, Top / Footprint, Front-left 3/4.

Asymmetric: add Right Side and use the controlled six-panel layout.

## Rules

- same exact subject, geometry, pose, texture, material, lighting, attachments, and scale in every panel;
- camera changes; subject does not;
- practical cuboid-first construction;
- no micro-cube clutter;
- shared ground alignment;
- complete subject without cropping;
- correct readable labels;
- no environment, extra character, action pose, logo, watermark, technical diagram, UV layout, pivot overlay, or additional sheet;
- no redesign.
''',
)

write(
    "engines/chatgpt/skills/blockbench-reference-studio/templates/PRODUCTION_CONTEXT.md",
    r'''# Production Context

Status: `DRAFT`

- Reference Studio Contract: `3.3`
- Package Mode: `reference_candidate`
- Promotion Status: `candidate_not_promoted`
- MCP-Blockbench Minimum: `1.7.0`
- Workflow: `single_reference_visual_one_session`

## 1. Main Format

- Asset ID:
- Display Name:
- Subject Type:
- Primary Source Files:
- Intended Use:
- Target Format: `Minecraft Bedrock Entity`
- Geometry Type: `cuboid_first`
- `16u = 1 Minecraft block`
- Width / Depth / Height:
- Ground Plane:
- Front Direction:
- Neutral Pose:
- Interaction Profile:
- Variant Policy:
- Classic Bedrock: required
- PBR / Vibrant Visuals: forbidden

## 2. Geometry

- Primary Masses:
- Must-Preserve Silhouette:
- Required Parts / Segment Counts:
- Hierarchy / Parent Relationships:
- Symmetry Policy: `BILATERAL | ASYMMETRIC`
- Ground Contacts:
- Intended Rotations:
- Texture-First Details:
- Forbidden Geometry / Redesign:

## 3. Texture

- Atlas:
- Pixel Style:
- UV Strategy:
- Palette / Material Families:
- Directional Details:
- Alpha / Emissive Zones:
- Forbidden Texture Behavior:

## 4. Animation

- Required: `true | false`
- Required Clips:
- Moving / Static Groups:
- Pivot Priorities:
- Allowed Axes:
- Root Motion Policy:
- Neutral Recovery / Ground Contact:
- Clipping Risks:

## Resolved Decisions

- 

## Assumptions and Recommended Defaults

- 

## Unresolved Blockers

- None

## Approval

- Status: `PENDING`
- Approved By:
- Approval Reference:
- Approval Date:
''',
)

# Compact human templates; executable arrays remain in the manifest.
write(
    "engines/chatgpt/skills/blockbench-reference-studio/templates/GEOMETRY.md",
    r'''# Geometry Contract

## Scope

- Asset ID:
- Strategy: `smart_cuboid`
- Geometry Type: `cuboid_only`
- Envelope / Ground / Front:
- Expected Cube Range:

## Build Order

1. primary masses;
2. provisional support/contacts;
3. silhouette-critical details;
4. contract rotations;
5. final hierarchy and ground check.

## Human Summary

- Primary Masses:
- Hierarchy Summary:
- Ground Contacts:
- Critical Silhouette Relationships:
- Texture-First Details:
- Forbidden Geometry:

## Executable Contract

Exact part patterns, count/parent/center/size ranges, symmetry/asymmetry pairs, panel regions, and rotation contracts are authoritative in `reference_manifest.json`; do not duplicate the full arrays here.

## Review

- Required Views: five base views plus conditional Right Side
- Structural Acceptance:
- Visual Acceptance:
- Rotation Acceptance:
''',
)

write(
    "engines/chatgpt/skills/blockbench-reference-studio/templates/TEXTURING.md",
    r'''# Texturing Contract

## Scope

- Asset ID:
- Atlas / Pixel Style:
- UV Strategy:
- Classic Bedrock only

## Human Summary

- Palette and Material Families:
- Material Zones:
- Directional / Unique Details:
- Mirrored Regions:
- Alpha / Emissive Policy:
- Forbidden Texture Behavior:

## Executable Contract

Exact atlas, UV, palette, coverage, alpha, color-budget, palette-distance, and outlier limits are authoritative in `reference_manifest.json`; do not duplicate large numeric arrays here.

## Review

- Atlas Acceptance:
- UV Acceptance:
- Pixel Sharpness:
- Palette / Material Acceptance:
''',
)

write(
    "engines/chatgpt/skills/blockbench-reference-studio/templates/ANIMATION.md",
    r'''# Animation Contract

## Scope

- Asset ID:
- Status: `ANIMATION_REQUIRED | ANIMATION_SKIPPED`
- Required Clips:

## Human Summary

- Moving / Static Groups:
- Pivot Priorities:
- Motion Chains:
- Allowed Axes:
- Root Motion Policy:
- Neutral Recovery / Ground Contact:
- Clipping Risks:

## Executable Contract

Exact clip names, duration, animator/keyframe, group-reference, pivot, and root-motion limits are authoritative in `reference_manifest.json`.

## Review

- Hierarchy / Pivot Acceptance:
- Clip Acceptance:
- Neutral Pose Acceptance:
- Clipping Acceptance:
''',
)

write(
    "engines/chatgpt/skills/blockbench-reference-studio/templates/VALIDATION.md",
    r'''# Validation Contract

Execution Status: `PENDING_BUILD`

## Required Inputs

- canonical `.bbmodel`;
- final texture file(s);
- all manifest-required views;
- hierarchy/pivot/count reports;
- completed stage reports;
- export/error log;
- final SHA-256 report.

## Checks

- package and authority integrity;
- format, envelope, ground, front, hierarchy, parts, symmetry, and rotations;
- visual identity and all required views;
- atlas, UV, alpha, color budget, palette, and PBR absence;
- required/skipped Animation, pivots, clips, groups, and root motion;
- final model/texture export and evidence freshness.

## Results

- `PASS`
- `REVISION_REQUIRED`
- `BLOCKER`

## Summary

- Final Result: `PENDING_BUILD`
- Earliest Affected Stage:
- Open Issues:
- Evidence:
- Validator / Date:
''',
)


# ---------------------------------------------------------------------------
# Codex and production skills: one-time preflight, zero-start branch, no dupes
# ---------------------------------------------------------------------------

write(
    "engines/codex/BOOTSTRAP.md",
    r'''# Codex + Blockbench MCP Bootstrap

## Goal

Build only what the approved package requires with the fewest safe reads, calls, image payloads, and correction cycles. Keep one Codex session and one MCP session through workspace completion.

## Authority

Use repository OpenSpec/Ponytail, the selected workspace/state, the approved Reference Visual package, and `MODEL_ROUTING.md`. Reject stale prompt packs, numbered-sheet flows, extra routine approvals, and copied session history with `LEGACY_SKILL_CONFLICT`.

## Routing

- Terra Medium parent: normal implementation and default writer.
- Mini Low: sizeable mechanical read-only audit only.
- `mcp_builder`: fallback sole writer only when needed.
- Sol Medium: conditional visual judgment only.
- Sol High: one mandatory coded critical decision only.

No child for micro work, no parallel writers, no effort above High, no user worker selection.

## One-time startup

1. Resolve or initialize the selected asset and canonical `workspace/active/<asset>/mcp` root.
2. Load `blockbench-production` plus the active-stage skill.
3. Create the Bedrock project through MCP when absent and save to the canonical model path.
4. Call `get_runtime_status` once.
5. Call `get_stage_context` for the active stage.
6. Rebind identity before lease acquisition when required.
7. Select one Terra writer and acquire the current-stage lease.

Repeat runtime status only after a real runtime error, plugin reload, project replacement, or connection warning. Call stage context again only after approval, revision, upstream reopen, or stage transition.

## Stable session transition

```text
release old lease
→ continue same MCP session
→ continue same Codex session
→ get_stage_context
→ acquire fresh current-stage lease
```

No reconnect, reload, restart, user JSON edit, checkpoint naming, profile selection, or internal smoke test.

## Geometry

Inspect the Reference Visual once per unchanged hash. The preview returns the next operation.

```text
zero-start
inspect reference
→ BUILD_PRIMARY_FORM_FROM_MANIFEST
→ capture primary views
→ fixed-scale diagnosis

existing/revision
inspect reference only when hash changed
→ capture affected views
→ fixed-scale diagnosis
```

Then perform bounded targeted edits, one final manifest-required view pass, conditional visual judgment, record the visual decision, and call `submit_geometry_for_review`. Never analyze a blank model. Submission owns fresh validation and review transition.

## Texture and Animation

Normal flow is work/evidence → bound report → submission. Submission runs fresh validation. Call standalone validation only after a failed submission to retrieve detailed diagnostics. Do not load Animation when skipped.

## Final Validation

```text
verify current Geometry readiness
→ validate_reference_contract(require_evidence=false) once
→ final atlas/views/document/export
→ record bound report
→ submit for final review
→ final approval
→ workspace completion
```

## Stop

Stop only for authority conflict, unavailable mandatory runtime, unsafe mutation, lease conflict, unrecoverable stale evidence, failed gate without a safe repair route, or user review. Do not scan ports, create alternate MCP keys, load deprecated skills, or create duplicate/versioned outputs.
''',
)

write(
    "engines/codex/MODEL_ROUTING.md",
    r'''# BuildIT Codex Model Routing

## Objective

Use the cheapest eligible route without lowering quality. Deterministic tools answer mechanical questions; model escalation is evidence-driven.

## Defaults

```text
parent default          gpt-5.6-terra / medium
routine auditor         gpt-5.4-mini / low
fallback builder        gpt-5.6-terra / medium
visual director         gpt-5.6-sol / medium
critical reviewer       gpt-5.6-sol / high
maximum effort          high
max agent threads       2
max depth               1
```

The user controls only the parent model. Missing optional roles produce `CODEX_PROJECT_CONFIG_NOT_LOADED` and use safe current-session fallbacks; they do not force restart.

## One writer

The Terra parent is the default writer. `mcp_builder` becomes the sole writer only when the parent differs or isolation is materially safer. Never let both mutate the same asset. The MCP write lease is final authority.

## Classification

| Class | Route |
| --- | --- |
| `MICRO` obvious read-only or trivial change | parent directly |
| `ROUTINE` sizeable mechanical read-only work | Mini, else parent |
| `STANDARD_BUILD` clear implementation/mutation | selected Terra writer |
| `COMPLEX_VISUAL` unresolved cross-view or subjective decision | Sol Medium, else bounded parent fallback |
| `CRITICAL` valid reason code after Medium failed | Sol High once |

No model call may exist only to choose another model. No recursion, broad fan-out, parallel writers, Extra High, Max, Ultra, Fast, automatic legacy models, or priority-speed escalation.

## Visual routing

Reference inspection is not an automatic Sol call. Terra may use the bounded Reference Visual preview and deterministic analyzer directly.

Use Sol Medium only when:

- affected views conflict;
- deterministic metrics cannot identify the visual root cause;
- the user requests a subjective change after deterministic PASS;
- final artistic acceptance remains genuinely unresolved.

Do not call Sol for hashes, state, typecheck, tests, profiles, dimensions, fixed-scale metrics, evidence freshness, review readiness, or export integrity.

## Compact Sol packet

Provide only objective, reason code, stage/profile/revision, relevant views, analyzer summary, last change, preserve/forbidden constraints, and one specific decision. Exclude raw logs, broad repository dumps, and unrelated history.

After judgment, immediately return to the selected Terra writer and deterministic validation.

## Session and call budget

- one runtime status startup call;
- stage context at entry/transition/revision only;
- one Reference Visual preview per unchanged hash;
- affected views during correction;
- one final required-view pass;
- no mandatory advisor call.

## Reporting

Return route/writer, justified escalation, implementation result, validation result, and next safe operation or blocker. Do not ask the user to test internal components.
''',
)

write(
    "engines/shared/skills/blockbench-production/SKILL.md",
    r'''---
name: blockbench-production
description: "Minimum-sufficient one-session dispatcher for approved Reference Visual packages, one selected Terra writer, bounded judgment, guarded reviews, and final workspace completion."
---

# Blockbench Production

## User contract

The user provides the approved package and reviews stage results. Codex owns workspace/project setup, identity, lease, routing, evidence, reports, checkpoints, transitions, recovery, export, and completion.

Never ask the user to run internal checks, edit JSON, choose workers/profiles/checkpoints, reconnect MCP, reload the plugin, or restart Codex.

## Routing

Terra parent performs normal implementation directly. Mini is for sizeable read-only audit. `mcp_builder` is fallback sole writer. Sol Medium is conditional visual judgment. Sol High is one rare coded critical decision. Exactly one Terra writer mutates the asset.

## Startup and context budget

1. Resolve/init asset and session root.
2. Load this skill plus exactly one active-stage skill.
3. Create the project through MCP when absent.
4. Call `get_runtime_status` once at startup.
5. Call `get_stage_context` at stage entry.
6. Rebind identity when requested.
7. Acquire the current-stage lease.

Do not repeat runtime status unless a real runtime event invalidates it. Do not poll stage context after every MCP call; call it after stage transition, approval, revision, or upstream reopen.

## Geometry

```text
inspect Reference Visual once per hash
→ zero-start: build primary form before first capture/analyze
   existing/revision: capture affected views first
→ fixed-scale diagnosis
→ bounded targeted edits
→ final manifest-required view pass
→ conditional visual judgment
→ record_geometry_visual_decision
→ submit_geometry_for_review
→ user review
```

Submission owns fresh validation, checkpoint, state transition, and lease release. Every non-zero rotation uses `rotate_cube_about_attachment`.

## Texture and Animation

```text
work/evidence
→ record_stage_review_report
→ submit_stage_for_review
→ user review
```

Do not call duplicate happy-path validation. If submission fails contract validation, call `validate_reference_contract` once for diagnostics, repair only named issues, refresh evidence/report, and resubmit. Do not load Animation when skipped.

## Final Validation

```text
verify Geometry readiness
→ validate_reference_contract(require_evidence=false) once
→ final evidence + completed VALIDATION.md + canonical export
→ record_stage_review_report
→ submit_stage_for_review
→ final review
→ complete_stage(FINAL_VALIDATION)
→ workspace completion
```

## Transition

A transition releases the prior lease, stays in the same MCP/Codex session, calls stage context, and acquires a fresh lease. Upstream reopen preserves approved checkpoints and accepted areas.

Stop only for a real authority conflict, mandatory runtime failure, unsafe mutation, unrecoverable evidence, failed gate, lease conflict, or user review.
''',
)

write(
    "engines/shared/skills/blockbench-geometry/SKILL.md",
    r'''---
name: blockbench-geometry
description: "Fixed-scale Bedrock Geometry with a zero-start primary-form branch, affected-view diagnosis, one selected Terra writer, conditional visual judgment, and guarded review submission."
---

# Blockbench Geometry

Use only for `GEOMETRY` with `BEDROCK_CUBOID_GEOMETRY`. `LOCAL_REPAIR` and `MAJOR_FORM_REVISION` are internal scopes.

## Entry

Call stage context, rebind identity if needed, select one Terra writer, and acquire the Geometry lease. Inspect the Reference Visual once per unchanged hash.

## Zero-start versus revision

```text
zero-start / no cubes
→ BUILD_PRIMARY_FORM_FROM_MANIFEST
→ capture primary views
→ analyze

existing or revision
→ capture only affected views
→ analyze
```

Never analyze an empty project. Do not call stage context again between Reference Visual inspection and the first diagnosis; follow the preview's `next_safe_operation`.

## Correction

Analyzer output must name view, region, missing/excess silhouette, direction, magnitude when measurable, parts, and scope. Terra handles concrete corrections directly. Use at most two non-improving bounded cycles before setting attention and asking one focused question or using conditional visual judgment.

Use `place_cubes_safe`/`modify_cubes` for unrotated work and `rotate_cube_about_attachment` for every non-zero rotation. Modify only diagnosed parts.

## Final review

```text
final manifest-required capture/analyze with write_diff_image=true
→ visual_director only when a genuine visual decision remains unresolved
→ otherwise selected Terra writer records the bounded visual decision
→ record_geometry_visual_decision
→ submit_geometry_for_review
→ GEOMETRY_REVIEW
```

Final views are five base views plus `right_side` for asymmetric assets. Evidence must match project UUID, fingerprint, transformed world signature, Reference Visual hash, required views, analyzer, visual decision, and rotation audit.

Submission performs fresh validation/readiness, creates the review checkpoint, transitions atomically, and releases the lease. Do not duplicate validation immediately before submission.

After user approval, acquire a fresh Geometry lease and call `complete_geometry_stage`. Revision acquires a fresh lease, captures/analyzes affected views, calls `prepare_geometry_visual_rebuild`, then mutates only after `GEOMETRY_IN_PROGRESS` returns.
''',
)

write(
    "engines/shared/skills/blockbench-texture/SKILL.md",
    r'''---
name: blockbench-texture
description: "Classic Bedrock Texture workflow with one selected Terra writer, direct evidence, one bound report, validation-owned submission, and same-profile revision."
---

# Blockbench Texture

Use only for `TEXTURE` with `BEDROCK_CUBOID_TEXTURE`. Preserve approved Geometry.

```text
get_stage_context
→ identity/lease
→ UV
→ base texture
→ detail texture
→ save atlas and required view evidence
→ record_stage_review_report
→ submit_stage_for_review
→ TEXTURE_REVIEW
```

Submission verifies the bound report/evidence and runs fresh contract validation. Do not call `validate_reference_contract` immediately before a normal submission.

If submission returns `STAGE_VALIDATION_NOT_PASS`, call validation once for structured diagnostics, repair only named issues, regenerate affected evidence/report, and resubmit.

Use Classic Bedrock, approved atlas, sharp pixels, approved UV/material/palette/alpha rules. No PBR, gradients, Geometry redesign, Animation, or final export.

`APPROVED`: fresh Texture lease → `complete_stage(TEXTURE)`. `REVISION`: fresh lease → `prepare_stage_revision` → targeted repair in the same profile.
''',
)

write(
    "engines/shared/skills/blockbench-animation/SKILL.md",
    r'''---
name: blockbench-animation
description: "Optional required-clips-only Bedrock Animation workflow with one bound report, validation-owned submission, and same-profile revision."
---

# Blockbench Animation

Load only when the approved manifest requires Animation. Otherwise keep it skipped and continue to Final Validation.

```text
get_stage_context
→ identity/lease
→ verify hierarchy/pivots
→ create required clips only
→ verify neutral pose, inheritance, ground contact, clipping
→ write required evidence
→ record_stage_review_report
→ submit_stage_for_review
→ ANIMATION_REVIEW
```

Submission verifies the current report/evidence and runs fresh validation. Do not duplicate validation immediately before normal submission. On validation failure, call validation once for diagnostics, repair named issues, refresh evidence/report, and resubmit.

No optional clips, new Geometry, Texture redesign, mesh armatures, vertex weights, scale deformation, or final export.

`APPROVED`: fresh Animation lease → `complete_stage(ANIMATION)`. `REVISION`: fresh lease → `prepare_stage_revision` → targeted repair in the same profile.
''',
)

write(
    "engines/shared/skills/blockbench-validation/SKILL.md",
    r'''---
name: blockbench-validation
description: "Final Validation with one evidence-free preflight, current Geometry readiness, canonical final evidence/export, validation-owned submission, and guarded completion."
---

# Blockbench Validation

Use only for `FINAL_VALIDATION` with `FINAL_VALIDATION_READONLY`.

```text
get_stage_context
→ identity/lease
→ verify_geometry_review_ready
→ validate_reference_contract(stage=FINAL_VALIDATION, require_evidence=false) once
→ final atlas evidence
→ clean final manifest-required views
→ complete VALIDATION.md
→ export canonical final model/textures to mcp/final
→ record_stage_review_report
→ submit_stage_for_review
→ FINAL_REVIEW
```

The preflight catches upstream/project issues before final output work. It is not repeated after the report; submission performs the final evidence-aware validation.

The bound final report includes current project serialization plus hashes of final views, atlas, validation document, final model, and final textures.

Final-only issue: remain in Final Validation and use `prepare_stage_revision` after feedback. Upstream Geometry/Texture/Animation issue: call `reopen_stage_for_revision` for the earliest affected stage. Preserve approved checkpoints and accepted areas; continue in the same session.

`APPROVED`: fresh Final Validation lease → `complete_stage(FINAL_VALIDATION)` → workspace completion. No new features, broad polish, silent upstream repair, stale evidence, versioned outputs, export outside `mcp/final`, or manual state edits.
''',
)

write(
    "engines/codex/FINAL_ACCEPTANCE_TEST.md",
    r'''# Final End-to-End User Acceptance Test

This is one integrated flow test, not an internal component checklist. Repository maintainers complete typecheck/tests/build/bundle verification first.

## Part A — ChatGPT Website

1. Upload the final Reference Studio Skill ZIP.
2. Start a new chat with a controlled source asset.
3. Create a new `reference_candidate`.
4. Confirm one batched clarification turn at most, Production Context approval, one Golden-Sample-guided Reference Visual, visual approval, then automatic technical package/audit/ZIP.
5. Confirm there is no third routine approval and no additional generated technical image.

Part A passes when the ZIP contains the nine canonical package files, schema `3.3`, executable contracts, exact visual hash, and current Codex handoff.

## Part B — Codex + Blockbench

The user performs setup only once:

1. pull the final `Rework` head;
2. load `mcp-blockbench/dist/mcp.js` once;
3. start one Codex session from repository root;
4. import/initialize the approved candidate package into a fresh workspace;
5. ask Codex to build the model from zero through final completion.

The user only reviews Geometry, Texture, optional Animation when required, and Final Validation. The user is never asked to run internal tests, inspect UUID/profile/session state, edit files, reconnect, reload, restart, choose workers, or choose profiles.

## Required production behavior

- runtime status runs once at startup;
- stage context runs at entry/transition/revision, not after every call;
- one selected Terra writer holds the active lease;
- zero-start Geometry builds primary form before first analysis;
- affected views are used during corrections;
- Sol is used only with a stated visual reason;
- submission tools own fresh validation and review transition;
- Texture/Animation do not duplicate happy-path validation;
- Final Validation uses one evidence-free preflight, then final evidence/export/report/submission;
- Animation-skipped flow proceeds directly to Final Validation;
- the same Codex and MCP sessions remain active;
- final approval reaches `DONE` and workspace completion.

## Acceptance result

Pass only when the final canonical `.bbmodel`, textures, evidence, PASS reports, approved checkpoints, and completed workspace exist; all stage reviews were user-visible; no reconnect/reload/restart occurred; and no duplicate/versioned output or prebuilt model was used.

A separate automated branch test covers the Animation-required transition even when the first local acceptance asset skips Animation.
''',
)


# ---------------------------------------------------------------------------
# Runtime precision: stage-specific next action, zero-start branch, asymmetry
# ---------------------------------------------------------------------------

stage_context = "mcp-blockbench/src/server/tools/stage-context.ts"
replace_once(
    stage_context,
    '''  runtimePhase: string | null;
  rebuildMode: boolean;
}): string {
  if (input.rebindRequired && input.leaseStatus !== "ACTIVE") {''',
    '''  runtimePhase: string | null;
  rebuildMode: boolean;
  workflowState: string | null;
}): string {
  if (input.workflowState === "GEOMETRY_REVIEW") {
    return "AWAIT_GEOMETRY_REVIEW";
  }
  if (input.rebindRequired && input.leaseStatus !== "ACTIVE") {''',
)

replace_once(
    stage_context,
    '''  return "CONTINUE_GEOMETRY";
}

export function registerStageContextTools(): void {''',
    '''  return "CONTINUE_GEOMETRY";
}

export function genericStageNextOperation(input: {
  stage: "TEXTURE" | "ANIMATION" | "FINAL_VALIDATION";
  rebindRequired: boolean;
  identityReady: boolean;
  leaseStatus: string;
  leaseProjectUuid: string | null;
  runtimeUuid: string | null;
  workflowState: string | null;
}): string {
  const reviewStates: Record<typeof input.stage, string> = {
    TEXTURE: "TEXTURE_REVIEW",
    ANIMATION: "ANIMATION_REVIEW",
    FINAL_VALIDATION: "FINAL_REVIEW",
  };
  const reviewActions: Record<typeof input.stage, string> = {
    TEXTURE: "AWAIT_TEXTURE_REVIEW",
    ANIMATION: "AWAIT_ANIMATION_REVIEW",
    FINAL_VALIDATION: "AWAIT_FINAL_REVIEW",
  };
  if (input.workflowState === "DONE") return "WORKSPACE_COMPLETE";
  if (input.workflowState === reviewStates[input.stage]) {
    return reviewActions[input.stage];
  }
  if (input.rebindRequired && input.leaseStatus !== "ACTIVE") {
    return "rebind_active_project_identity";
  }
  if (!input.identityReady) return "STOP_PROJECT_IDENTITY_MISMATCH";
  if (
    input.leaseStatus !== "ACTIVE" ||
    input.leaseProjectUuid !== input.runtimeUuid
  ) {
    return "manage_project_write_lease:acquire";
  }
  const workActions: Record<typeof input.stage, string> = {
    TEXTURE: "CONTINUE_TEXTURE_WORK",
    ANIMATION: "CONTINUE_ANIMATION_WORK",
    FINAL_VALIDATION: "RUN_FINAL_VALIDATION_PREFLIGHT",
  };
  return workActions[input.stage];
}

export function registerStageContextTools(): void {''',
)

replace_once(
    stage_context,
    '''                runtimePhase: geometryRuntime?.phase ?? null,
                rebuildMode: geometryRuntime?.rebuild_mode === true,
              })
            : "CONTINUE_STAGE";''',
    '''                runtimePhase: geometryRuntime?.phase ?? null,
                rebuildMode: geometryRuntime?.rebuild_mode === true,
                workflowState: state.workflow?.state ?? null,
              })
            : genericStageNextOperation({
                stage,
                rebindRequired,
                identityReady,
                leaseStatus: lease.status,
                leaseProjectUuid: lease.project_uuid,
                runtimeUuid,
                workflowState: state.workflow?.state ?? null,
              });''',
)

reference_preview = "mcp-blockbench/src/server/tools/reference-visual-preview.ts"
replace_once(
    reference_preview,
    '''        const reduction =
          source.byteLength > 0
            ? 1 - preview.transportBytes / source.byteLength
            : 0;
        const content:''',
    '''        const reduction =
          source.byteLength > 0
            ? 1 - preview.transportBytes / source.byteLength
            : 0;
        const cubeCount = typeof Cube !== "undefined" ? Cube.all.length : 0;
        const nextSafeOperation =
          cubeCount === 0
            ? "BUILD_PRIMARY_FORM_FROM_MANIFEST"
            : "capture_visual_feedback";
        const content:''',
)

replace_once(
    reference_preview,
    '''              `${Math.round(reduction * 100)}% smaller than source).`,''',
    '''              `${Math.round(reduction * 100)}% smaller than source). ` +
              `Next safe operation: ${nextSafeOperation}.`,''',
)

replace_once(
    reference_preview,
    '''            transport_preview: {
              returned_image: include_image,''',
    '''            next_safe_operation: nextSafeOperation,
            zero_start_geometry: cubeCount === 0,
            current_cube_count: cubeCount,
            reference_cache_key: actualHash,
            transport_preview: {
              returned_image: include_image,''',
)

geometry_runtime = "mcp-blockbench/src/lib/geometryRuntime.ts"
replace_once(
    geometry_runtime,
    '''const FINAL_VIEWS = new Set([
  "front",
  "left_side",
  "back",
  "top_footprint",
  "front_left_3_4",
]);''',
    '''const BASE_FINAL_VIEWS = [
  "front",
  "left_side",
  "back",
  "top_footprint",
  "front_left_3_4",
] as const;

export function requiredGeometryFinalViews(symmetryPolicy: unknown): string[] {
  const views: string[] = [...BASE_FINAL_VIEWS];
  if (String(symmetryPolicy ?? "").toUpperCase() === "ASYMMETRIC") {
    views.splice(2, 0, "right_side");
  }
  return views;
}''',
)

replace_once(
    geometry_runtime,
    '''  const comparedViews = Array.isArray(args.compared_views)
    ? args.compared_views.map(String)
    : [];
  const viewSet = new Set(comparedViews);
  const isFinal = [...FINAL_VIEWS].every((view) => viewSet.has(view));''',
    '''  const comparedViews = Array.isArray(args.compared_views)
    ? args.compared_views.map(String)
    : [];
  const viewSet = new Set(comparedViews);
  const manifestPath = joinPath(
    sessionRoot,
    "references/reference_manifest.json"
  );
  const symmetryPolicy = fs.existsSync(manifestPath)
    ? readJsonFile<Record<string, any>>(fs, manifestPath).geometry?.symmetry_policy
    : null;
  const requiredFinalViews = requiredGeometryFinalViews(symmetryPolicy);
  const isFinal = requiredFinalViews.every((view) => viewSet.has(view));''',
)


# ---------------------------------------------------------------------------
# Permanent regression coverage
# ---------------------------------------------------------------------------

write(
    "mcp-blockbench/tests/final-flow-efficiency.test.ts",
    r'''import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { requiredGeometryFinalViews } from "../src/lib/geometryRuntime";
import { genericStageNextOperation } from "../src/server/tools/stage-context";

const read = (path: string) => readFileSync(path, "utf8");

const chatgptRoot = "../engines/chatgpt/skills/blockbench-reference-studio";

describe("final upstream-to-downstream flow efficiency", () => {
  test("keeps one current ChatGPT flow with two approvals and mandatory Golden Sample guidance", () => {
    const skill = read(`${chatgptRoot}/SKILL.md`);
    const flow = read(`${chatgptRoot}/references/FLOW.md`);
    const sheetCompatibility = read(
      `${chatgptRoot}/references/SHEET_SPECIFICATIONS.md`
    );
    const handoffContract = read(
      `${chatgptRoot}/references/CODEX_HANDOFF_CONTRACT.md`
    );
    const prompt = read(`${chatgptRoot}/templates/TURNAROUND_PROMPT.md`);
    const combined = `${skill}\n${flow}\n${sheetCompatibility}\n${handoffContract}\n${prompt}`;

    expect(skill).toContain("exactly two approval moments");
    expect(skill).toContain("Mandatory Golden Sample design system");
    expect(skill).toContain("Compact single-source writing rule");
    expect(flow).toContain("There is no routine third approval");
    expect(sheetCompatibility).toContain(
      "Numbered technical sheets are deprecated and forbidden"
    );
    expect(prompt).toContain("Top / Footprint");
    expect(prompt).toContain("Right Side");

    for (const stale of [
      "Sheet 01",
      "Sheets 02–04",
      "four approved sheets",
      "TECHNICAL_SHEETS_REVIEW",
      "STAGE_CONTRACTS_REVIEW",
    ]) {
      expect(combined).not.toContain(stale);
    }
  });

  test("uses one consistent authority order", () => {
    const skill = read(`${chatgptRoot}/SKILL.md`);
    const handoff = read(
      `${chatgptRoot}/templates/CODEX_REFERENCE_HANDOFF.template.md`
    );
    const skillManifest = skill.indexOf("3. `reference_manifest.json`");
    const skillGeometry = skill.indexOf("4. `GEOMETRY.md`");
    const handoffManifest = handoff.indexOf("3. executable `reference_manifest.json`");
    const handoffStage = handoff.indexOf("4. concise stage Markdown files");
    expect(skillManifest).toBeGreaterThan(0);
    expect(skillGeometry).toBeGreaterThan(skillManifest);
    expect(handoffManifest).toBeGreaterThan(0);
    expect(handoffStage).toBeGreaterThan(handoffManifest);
  });

  test("prevents blank-model analysis and returns the post-preview next operation", () => {
    const production = read("../engines/shared/skills/blockbench-production/SKILL.md");
    const geometry = read("../engines/shared/skills/blockbench-geometry/SKILL.md");
    const preview = read("src/server/tools/reference-visual-preview.ts");
    expect(production).toContain("zero-start: build primary form before first capture/analyze");
    expect(geometry).toContain("Never analyze an empty project");
    expect(preview).toContain("BUILD_PRIMARY_FORM_FROM_MANIFEST");
    expect(preview).toContain("next_safe_operation: nextSafeOperation");
  });

  test("routes stage context without polling or generic CONTINUE_STAGE ambiguity", () => {
    expect(
      genericStageNextOperation({
        stage: "TEXTURE",
        rebindRequired: false,
        identityReady: true,
        leaseStatus: "ACTIVE",
        leaseProjectUuid: "u",
        runtimeUuid: "u",
        workflowState: "TEXTURE_IN_PROGRESS",
      })
    ).toBe("CONTINUE_TEXTURE_WORK");
    expect(
      genericStageNextOperation({
        stage: "ANIMATION",
        rebindRequired: false,
        identityReady: true,
        leaseStatus: "ACTIVE",
        leaseProjectUuid: "u",
        runtimeUuid: "u",
        workflowState: "ANIMATION_REVIEW",
      })
    ).toBe("AWAIT_ANIMATION_REVIEW");
    expect(
      genericStageNextOperation({
        stage: "FINAL_VALIDATION",
        rebindRequired: false,
        identityReady: true,
        leaseStatus: "ACTIVE",
        leaseProjectUuid: "u",
        runtimeUuid: "u",
        workflowState: "FINAL_VALIDATION",
      })
    ).toBe("RUN_FINAL_VALIDATION_PREFLIGHT");
  });

  test("requires asymmetric Right Side before Geometry runtime becomes final-ready", () => {
    expect(requiredGeometryFinalViews("BILATERAL")).toEqual([
      "front",
      "left_side",
      "back",
      "top_footprint",
      "front_left_3_4",
    ]);
    expect(requiredGeometryFinalViews("ASYMMETRIC")).toEqual([
      "front",
      "left_side",
      "right_side",
      "back",
      "top_footprint",
      "front_left_3_4",
    ]);
  });

  test("removes duplicate happy-path validation and mandatory Sol routing", () => {
    const texture = read("../engines/shared/skills/blockbench-texture/SKILL.md");
    const animation = read("../engines/shared/skills/blockbench-animation/SKILL.md");
    const validation = read("../engines/shared/skills/blockbench-validation/SKILL.md");
    const geometry = read("../engines/shared/skills/blockbench-geometry/SKILL.md");
    const routing = read("../engines/codex/MODEL_ROUTING.md");

    expect(texture).toContain(
      "record_stage_review_report\n→ submit_stage_for_review"
    );
    expect(animation).toContain(
      "record_stage_review_report\n→ submit_stage_for_review"
    );
    expect(texture).not.toContain(
      "record_stage_review_report\n→ validate_reference_contract"
    );
    expect(animation).not.toContain(
      "record_stage_review_report\n→ validate_reference_contract"
    );
    expect(validation).toContain("require_evidence=false");
    expect(geometry).toContain("visual_director only when");
    expect(routing).toContain("Reference inspection is not an automatic Sol call");
    expect(routing).not.toContain(
      "Use `visual_director` once per unchanged Reference Visual hash"
    );
  });

  test("locks Ponytail and OpenSpec to the full pipeline rather than Geometry only", () => {
    const ponytail = read(
      "../openspec/changes/codex-local-workflow-rework/PONYTAIL_EXECUTION.md"
    );
    const spec = read(
      "../openspec/changes/codex-local-workflow-rework/specs/codex-local-workflow/spec.md"
    );
    for (const stage of [
      "CHATGPT REFERENCE STUDIO",
      "Geometry review",
      "Texture review",
      "Animation review",
      "Final Validation review",
      "workspace completion",
    ]) {
      expect(`${ponytail}\n${spec}`).toContain(stage);
    }
    expect(ponytail).toContain("get_runtime_status`: once at startup");
    expect(ponytail).toContain("do not poll it after every MCP call");
  });

  test("defines one integrated final acceptance from ChatGPT to DONE", () => {
    const acceptance = read("../engines/codex/FINAL_ACCEPTANCE_TEST.md");
    expect(acceptance).toContain("Part A — ChatGPT Website");
    expect(acceptance).toContain("Part B — Codex + Blockbench");
    expect(acceptance).toContain("final approval reaches `DONE`");
    expect(acceptance).toContain("workspace completion");
  });
});
''',
)

print("Applied final upstream-to-downstream flow efficiency hardening.")
