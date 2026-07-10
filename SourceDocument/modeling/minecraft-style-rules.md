# Minecraft Style Rules

## Rules

- Keep the silhouette readable from gameplay distance.
- Prefer blocky Minecraft proportions over generic smooth 3D forms.
- Avoid excessive micro-detail in geometry.
- Use texture for small details when possible.
- Keep major forms aligned to understandable block, item, or entity proportions.
- Avoid tiny protrusions that only read in close-up screenshots.
- Match the target platform constraints before adding detail.
- Preserve visual clarity from front, side, back, top, and perspective views.
- Keep decorative detail subordinate to the asset function.

## Anti-Patterns

- Smooth sculpted forms without Minecraft justification.
- High-poly detail that should be texture detail.
- Real-world scale assumptions that ignore Minecraft block units.
- Details that only look correct from one camera angle.

## Acceptance Criteria

- The model reads clearly at gameplay distance.
- Geometry remains blocky unless the brief explicitly requires otherwise.
- Small details are primarily texture-driven.
- Target platform constraints are respected.
- Any style deviation is documented as an `Assumption` or approved requirement.
