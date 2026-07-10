# Common Failure Patterns

These are common issues found during earlier modelling attempts. Use this as a prevention checklist before finalizing a phase.

## Geometry Failures

### Excessive Small Cubes

Symptom:

- Small 1 to 2 pixel cube details appear as surface decoration.

Prevent:

- Move small stripes, seams, scratches, shadows, and minor panels to texture.

### Floating Geometry

Symptom:

- Armor, limb, accessory, or detail appears detached from the body.

Prevent:

- Check side view and 3/4 view before phase approval.
- Attach details to a parent group and verify contact.

### Bad Collision Or Z-Fighting

Symptom:

- Cubes occupy the same surface or overlap too tightly.

Prevent:

- Offset layers slightly.
- Avoid coincident faces.

### Cube-Flat Design

Symptom:

- Model is technically blocky but visually boring or too box-like.

Prevent:

- Use varied cuboid sizes, rotations, offsets, and stepped silhouettes.

## UV And Texture Failures

### Loose UV Atlas

Symptom:

- Texture regions are spread too far apart with large empty areas.

Prevent:

- Pack atlas before painting.
- Reuse mirrored/repeated parts where safe.

### Flat Palette Fill

Symptom:

- Model looks like solid color blocks without material depth.

Prevent:

- Apply stepped gradients to large visible faces.
- Add shadow under overlaps and small edge highlights.

### Focal Detail Wrong Side

Symptom:

- Eyes, logo, face, core, or identity detail appears on the wrong side.

Prevent:

- Lock front direction during Reference Collection.
- Verify focal close-up before polish.

### Random Texture Noise

Symptom:

- Pixel detail looks noisy instead of material-based.

Prevent:

- Use material groups and reference texture logic.
- Keep details purposeful: seam, shadow, highlight, wear, trim.

## Process Failures

### Phase Drift

Symptom:

- Texture work happens during geometry phase, or geometry redesign happens during polish.

Prevent:

- Follow the current phase contract.
- Mark later-phase tasks as `Out of scope for this phase`.

### Silent Fallback Tool Use

Symptom:

- MCP tool is missing and Codex silently uses a risky workaround.

Prevent:

- Run MCP smoke test.
- Report missing tools and ask before fallback.

### Over-Inspection

Symptom:

- Too many broad tool calls, full dumps, or repeated screenshots.

Prevent:

- Use Ponytail token-saving rules.
- Inspect affected part only.
- Screenshot at phase gates.

## Acceptance Criteria

- Known failure patterns are checked before phase approval.
- The model does not proceed to finalization with known blocking issues.
