# Codex Local Workflow Specification

## Requirement: Reference Package Intake

The system SHALL accept the approved package:

```text
PRODUCTION_CONTEXT.md
<asset>_reference_visual.png
GEOMETRY.md
TEXTURING.md
ANIMATION.md
VALIDATION.md
reference_manifest.json
CODEX_REFERENCE_HANDOFF.md
```

The system SHALL NOT require legacy numbered reference sheets.

### Scenario: Valid package

- Given all required files exist and the manifest is valid
- When Codex starts a new asset session
- Then package intake returns PASS
- And no user approval is requested for intake
- And Codex proceeds to Geometry after preflight

### Scenario: Material conflict

- Given Production Context, Reference Visual, and a technical document conflict on a major decision
- When intake validates the package
- Then the result is `REFERENCE_CONFLICT`
- And no Blockbench edit occurs

## Requirement: Single Runtime State

The system SHALL use `SavedData/sessions/<asset>/state.json` as the runtime authority.

Markdown session summaries MAY exist but SHALL NOT override `state.json`.

## Requirement: One-Time Preflight

Codex SHALL run the complete preflight before the first write in a session and SHALL NOT repeat unchanged checks for every edit.

The preflight SHALL verify:

- reference package;
- MCP endpoint;
- active session ownership;
- Blockbench project and UUID;
- project format;
- UV mode;
- texture size;
- manual edits to preserve;
- persistent checkpoint readiness.

## Requirement: Geometry Stage

Geometry SHALL contain internal Primary Form and Structural Detail passes.

The initial build MAY use bounded multi-part edit batches.

Geometry SHALL NOT perform texture, UV, animation, or final export work.

Geometry SHALL end with:

- persistent checkpoint;
- cube/group report;
- Front preview;
- Left Side preview;
- Back preview;
- Top/Footprint preview;
- Front-left 3/4 preview;
- user approval or targeted revision request.

No user approval SHALL be requested between internal geometry passes.

## Requirement: Texture Stage

Texture SHALL contain internal UV, Base Texture, and Detail Texture passes.

Texture SHALL NOT perform broad geometry redesign or animation work.

Texture SHALL end with:

- persistent checkpoint;
- atlas preview;
- UV summary;
- Front, Left Side, Back, and Front-left 3/4 previews;
- user approval or targeted revision request.

No user approval SHALL be requested between internal texture passes.

## Requirement: Optional Animation Stage

Animation SHALL run only when required by the approved manifest or Animation document.

When not required, the stage SHALL be recorded as `ANIMATION_SKIPPED` and Codex SHALL proceed to Final Validation.

When required, Animation SHALL end with:

- persistent checkpoint;
- hierarchy and pivot summary;
- required clips or sampled poses;
- neutral-pose recovery evidence;
- clipping and ground-contact result;
- user approval or targeted revision request.

## Requirement: Final Validation Stage

Final Validation SHALL execute `VALIDATION.md` and collect required evidence.

Codex MAY automatically fix at most two local validation failures.

A fix requiring redesign or reopening an approved earlier stage SHALL NOT be applied silently.

Final Validation SHALL end with:

- candidate `.bbmodel`;
- textures;
- completed validation report;
- five standard-view previews;
- animation evidence when applicable;
- concise revision summary;
- `PASS`, `REVISION_REQUIRED`, or `BLOCKER`;
- user approval or correction request.

## Requirement: Revision Scope

The one-issue-per-cycle rule SHALL apply to revisions, not the initial bounded stage build.

A revision SHALL identify:

- stage;
- part;
- issue;
- expected result;
- preserved areas;
- verification method.

Accepted areas SHALL NOT be rebuilt without explicit reopening.

## Requirement: Token and Tool Efficiency

Codex SHALL read only the bootstrap, state, package core, and active-stage document during normal execution.

Failure playbooks SHALL be loaded only after their trigger occurs.

Codex SHALL use the smallest relevant tool profile for the active stage.

Codex SHALL prefer one bounded edit batch followed by one focused evidence set over repeated single-cube calls during initial construction.
