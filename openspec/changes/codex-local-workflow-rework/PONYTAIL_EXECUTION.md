# Ponytail Minimum-Sufficient Execution

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

## Pre-local optimization freeze

After manifest-only authority and compact-context cleanup, do not add or merge another runtime tool, model role, profile, review gate, evidence type, or checkpoint class before the local acceptance run unless it fixes a reproducible P0 blocker or removes a proven duplicate authority.

Further optimization requires measured local acceptance evidence: actual MCP call count, stage-context response bytes, model-route usage, correction cycles, image payload bytes, checkpoint sizes, and elapsed stage time. A theoretical micro-optimization without those measurements is `DEFERRED_NOT_REQUIRED`.
