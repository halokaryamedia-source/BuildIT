# Workflow Efficiency Tool Specification

## Requirement: Compact Reference Contract Validation

The MCP workflow SHALL provide `validate_reference_contract` as one stage-aware read-only operation.

It SHALL validate, when applicable to the current stage:

- active project identity and expected UUID;
- Bedrock format and Per-face UV mode;
- required reference-package files;
- manifest dimensions against model bounds;
- texture atlas dimensions;
- Classic Bedrock / no-PBR constraints;
- required hierarchy groups;
- required animation names;
- required stage evidence and final paths;
- current Blockbench validator error/warning counts.

Preflight mode SHALL NOT fail because unfinished Geometry, Texture, Animation, or evidence does not exist yet.

The result SHALL be one structured response:

```text
PASS
REVISION_REQUIRED
BLOCKER
```

Each issue SHALL include stage, code, severity, message, and the smallest repair profile when locally repairable.

The tool SHALL NOT claim visual similarity PASS. User review remains authoritative for visible match.

## Requirement: Direct Texture Evidence Writing

The MCP workflow SHALL provide `save_texture_evidence`.

It SHALL:

- require an explicit texture ID/name;
- verify expected project UUID when supplied;
- restrict output to the asset-session root;
- write PNG through atomic replacement;
- write compact adjacent metadata;
- return path, dimensions, byte count, alpha status, and texture identity;
- avoid returning the full PNG as base64 to Codex.

It SHALL be exposed only to Texture, Texture Repair, and Final Validation profiles.

## Requirement: Atomic Approved Stage Completion

The MCP workflow SHALL provide `complete_stage` for explicit user approval only.

The tool SHALL:

1. verify asset ID, project UUID, state revision, active review state, required evidence, and final paths when applicable;
2. require the stage JSON report to contain an explicit `PASS` result;
3. reuse `save_project_checkpoint` for the approved checkpoint;
4. update approval and accepted-area protection;
5. replace `state.json` atomically;
6. activate the exact next profile;
7. return one reconnect instruction only when the profile changed.

It SHALL fail without advancing state when evidence, report result, project identity, or state revision is invalid.

Repair profiles SHALL NOT expose `complete_stage`.

## Requirement: Structured High-Volume Inspection

Normal high-volume operations SHALL return concise text plus `structuredContent`, not JSON encoded inside text.

Required conversions include:

```text
get_project_info
get_uv_layout
undo
redo
get_undo_stack
save_checkpoint
```

`get_undo_stack` SHALL use a bounded default result to avoid unnecessary history payload.

`set_cube_face_uv` SHALL require an explicit cube identifier and return the updated UV result structurally.

## Requirement: Atomic Filesystem Writes

Workflow-controlled state, metadata, and PNG evidence SHALL use shared atomic filesystem helpers.

Output paths SHALL be restricted to the approved asset-session root before write.

A failed write SHALL restore the prior target when possible and SHALL NOT advance workflow state.

## Requirement: Token Efficiency

Normal execution SHALL prefer:

```text
one validate_reference_contract call per required gate
one save_texture_evidence call per required atlas
one complete_stage call after explicit approval
bounded structured inspection results
```

over repeated project inspection, base64 transfer, manual evidence checks, separate checkpoint/state/profile calls, unbounded history, and repeated reconnect instructions.

Always-loaded agent/bootstrap documents SHOULD remain compact and route detail to trigger-specific contracts.

No additional composite tool SHALL be added unless a dry run proves repeated real work or material token/error reduction.

## Focused Verification

Before final integration, local runtime verification SHALL prove:

- preflight validation ignores unfinished stage output correctly;
- review validation returns deterministic structured issues;
- missing evidence or non-PASS report blocks `complete_stage`;
- stale state revision blocks `complete_stage`;
- approved checkpoint/state/profile remain consistent;
- profile transition requires at most one reconnect;
- texture evidence PNG and metadata remain inside the session root;
- no base64 texture payload is required for evidence persistence;
- project, UV, and history results are structured and bounded;
- CI remains disabled during active Rework.
