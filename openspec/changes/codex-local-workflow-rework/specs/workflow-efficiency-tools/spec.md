# Workflow Efficiency Tool Specification

## Compact Validation

`validate_reference_contract` SHALL provide one stage-aware structured check for reference files, project identity, format, dimensions, UV/texture rules, hierarchy, required animations, evidence, final outputs, and Blockbench validator status.

## Direct Texture Evidence

`save_texture_evidence` SHALL write an explicit project texture directly to an approved PNG path inside the active session and return compact metadata instead of transporting PNG base64 through the model context.

## Atomic Stage Completion

After explicit user approval, `complete_stage` SHALL verify review state, report PASS, required evidence, project UUID, and state revision; save the approved checkpoint; protect accepted areas; update state atomically; and activate the next profile.

## Structured Inspection

High-volume inspection tools used by normal profiles SHALL return concise text plus `structuredContent`. Agents SHALL NOT parse JSON embedded in prose when structured results are available.

## File Safety

Workflow state and evidence writes SHALL remain inside `workspace/sessions/<asset>/`, use temporary files before replacement, and restore the previous file after a failed replacement.
