# Workflow Efficiency Tool Specification

## Requirement: Compact Reference Contract Validation

The MCP workflow SHALL provide `validate_reference_contract` as one compact read-only operation.

It SHALL validate, when data is available:

- active project identity and expected UUID;
- Bedrock format and Per-face UV mode;
- required reference-package files;
- manifest dimensions against current model bounds;
- texture atlas dimensions;
- Classic Bedrock / no-PBR constraints;
- required hierarchy groups;
- required animation names;
- required stage evidence;
- current Blockbench validator error/warning counts.

The result SHALL be one structured response with:

```text
PASS
REVISION_REQUIRED
BLOCKER
```

Each issue SHALL include stage, code, severity, message, and the smallest recommended repair profile when locally repairable.

The tool SHALL NOT claim visual similarity PASS. User review of standard previews remains authoritative for visual match.

## Requirement: Direct Texture Evidence Writing

The MCP workflow SHALL provide `save_texture_evidence`.

The tool SHALL:

- require an explicit texture ID/name;
- verify the expected project UUID when supplied;
- restrict output to the active asset-session root;
- write one PNG through an atomic temporary-file replacement;
- write compact adjacent JSON metadata;
- return path, dimensions, byte count, alpha presence, and texture identity;
- avoid returning the full PNG as base64 to Codex.

This operation SHALL be available only to Texture, Texture Repair, and Final Validation profiles.

## Requirement: Atomic Approved Stage Completion

The MCP workflow SHALL provide `complete_stage` for explicit user approvals only.

The tool SHALL:

1. verify asset ID, project UUID, state revision, active review state, and required evidence;
2. reuse `save_project_checkpoint` to create the approved checkpoint;
3. update stage approval and accepted-area protection;
4. update `state.json` through atomic replacement;
5. activate the exact next tool profile;
6. return one reconnect instruction only when the profile changed.

The tool SHALL fail without advancing state when required evidence, project identity, or state revision is incorrect.

Repair profiles SHALL NOT expose `complete_stage`.

## Requirement: Structured High-Volume Inspection

Normal high-volume inspection tools SHALL return concise text plus `structuredContent` instead of JSON encoded inside text.

The first required conversions are:

```text
get_project_info
get_uv_layout
```

`set_cube_face_uv` SHALL require an explicit cube identifier and SHALL return the updated UV result structurally.

## Requirement: Atomic Filesystem Writes

Workflow-controlled state, checkpoint-adjacent metadata, and PNG evidence SHALL use shared atomic filesystem helpers.

Output paths SHALL be restricted to the approved asset-session root before write.

A failed write SHALL restore the prior target when possible and SHALL NOT advance workflow state.

## Requirement: Token Efficiency

Normal execution SHALL prefer:

```text
one validate_reference_contract call
one save_texture_evidence call per required atlas
one complete_stage call after explicit approval
```

over repeated project inspection, base64 transfer, manual evidence checks, separate checkpoint/state/profile calls, and repeated reconnect instructions.

No additional composite tool SHALL be added unless a dry run proves a repeated real operation or material token/error reduction.

## Focused Verification

Before final integration, local runtime verification SHALL prove:

- compact validation returns deterministic structured issues;
- missing evidence blocks `complete_stage`;
- stale state revision blocks `complete_stage`;
- approved checkpoint and state remain consistent;
- profile transition requires at most one reconnect;
- texture evidence PNG and metadata are written inside the session root;
- no base64 texture payload is required for evidence persistence;
- project and UV inspection results are structured;
- CI remains disabled during active Rework.
