# Example Model Session

This is a generic filled example for one model session. Replace the values for each new asset. The example is not a required target model.

## Project Identity

- Project Name: `example_crystal_golem`
- Category: Bedrock Entity
- Identifier Prefix: `demo`
- Model Identifier: `demo_crystal_golem`
- Default UV Mode: Per-face UV
- Export Target: Blockbench project only; no export yet
- Animation Scope: Not included in this session

## Reference Package Status

- Reference Package: Pass
- Orthographic Views: Provided front, side, rear, and top views
- Silhouette Sheet: Provided with distance readability notes
- Scale Sheet: Provided with total height, shoulder width, and comparison target
- Part Breakdown: Provided for head, torso, arms, legs, accessories, and weapon if any
- Texture Guide: Provided with material palette, gradient/shading logic, and close-ups
- Do/Don't Sheet: Provided with avoid-list for floating parts, flat colors, and clutter

## Required User Answers

- Asset function: Defensive stone creature used as a magical guard
- Visual priority: Strong silhouette, readable crystal core, bulky arms, compact body
- Scale: Medium, taller than a player but not boss-sized
- Texture direction: Dark stone base with blue crystal accents and visible gradients
- Must-have details: Crystal chest core, broad shoulders, heavy feet
- Must-avoid details: Thin fragile spikes, many tiny cube fragments, noisy silhouette

## Phase 1: Reference Collection

Decision:

- Continue only if the reference package supports shape, scale, parts, material logic, and failure rules.
- If a sheet is missing, ask for that sheet before modelling.

Exit Gate:

- References are clear enough to identify the main body mass, important details, cube budget risk, and texture strategy.

## Phase 2: Main Geometry

Allowed:

- Build only large readable masses: head, torso, arms, legs, main accessories.
- Use larger shaped cubes and rotations where useful.

Forbidden:

- No small decorative cube spam.
- No texture work.
- No animation work.

Exit Gate:

- Front, side, rear, and 3/4 silhouettes match the reference direction.
- No major floating parts.
- No obvious collision that would cause texture fighting.

## Phase 3: Geometry Detailing

Allowed:

- Add meaningful medium-size details that affect silhouette or identity.
- Replace minor cube details with planned texture notes.

Exit Gate:

- Important features are readable.
- Cube count is justified by form, not tiny decoration.
- User-approved geometry is preserved.

## Phase 4: UV Texture

Allowed:

- Create a compact single atlas layout.
- Reuse mirrored or repeated UV islands where appropriate.

Exit Gate:

- UV islands are grouped by material and part.
- Empty atlas space is controlled.
- Layout remains readable for painting.

## Phase 5: Base Texturing

Allowed:

- Apply material base colors and clear value separation.

Exit Gate:

- The model reads correctly without detailed polish.
- Palette is not flat single-fill color.

## Phase 6: Detail Texturing

Allowed:

- Add gradients, shadows, highlights, edge wear, and material-specific details.

Exit Gate:

- Large surfaces have visible gradient logic.
- Eyes, face, focal details, and material transitions are readable.

## Phase 7: Polish

Allowed:

- Fix visible texture balance, silhouette issues, and small placement problems.

Exit Gate:

- Final screenshots show front, side, rear, and 3/4 view.
- System scoring is provided, but the user makes the final decision.

## Acceptance Criteria

- The session has a clear identity, reference status, user answers, phase gates, and stop points.
- Each phase has allowed work, forbidden work, and an exit gate.
- The example remains generic and can be copied for different assets.
