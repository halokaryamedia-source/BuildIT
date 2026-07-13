# Workflow Efficiency Tool Specification

## Compact Validation

`validate_reference_contract` SHALL provide one stage-aware structured check for reference files, project identity, format, dimensions, UV/texture rules, hierarchy, required animations, evidence, final outputs, and Blockbench validator status.

## Direct Texture Evidence

`save_texture_evidence` SHALL write an explicit project texture directly to an approved PNG path under `workspace/active/<asset>/mcp/evidence/` and return compact metadata instead of transporting PNG base64 through the model context.

## Atomic Stage Completion

After explicit user approval, the stage-specific guarded completion tool SHALL verify review state, report PASS, required evidence, project UUID, state revision, and current lease ownership; save the approved checkpoint; protect accepted areas; update state atomically; release the old lease; and activate the next logical profile without reconnecting.

Geometry SHALL use `complete_geometry_stage`. Texture, optional Animation, and Final Validation SHALL use their matching guarded workflow tools rather than a generic bypass.

## Structured Inspection

High-volume inspection tools used by normal profiles SHALL return concise text plus `structuredContent`. Agents SHALL NOT parse JSON embedded in prose when structured results are available.

## File Safety

Workflow state and evidence writes SHALL remain inside `workspace/active/<asset>/mcp/`, user-facing model assets SHALL remain inside `workspace/active/<asset>/blockbench/`, temporary files SHALL be used before replacement, and the previous file SHALL be restored after a failed replacement.

## Context and Image Efficiency

Reference Visual transport SHALL be bounded and hash-authoritative. Current-model visual capture SHALL include only the required affected views during correction and one final five-view pass. Fresh deterministic evidence SHALL be reused until its project identity, source hash, fingerprint, or transformed world-space signature becomes stale.