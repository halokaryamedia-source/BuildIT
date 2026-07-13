# Workflow Efficiency Tool Specification

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
