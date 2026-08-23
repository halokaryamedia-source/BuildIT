# Clockwork

## Goal
Persistent workspace package for Clockwork asset references and future Blockbench model work.

## Approved references
- `references/signal-lamp.png`
- `references/maze-laser-emitter.png`
- `references/spike-floor-trap.png`
- `references/power-source-generator.png`
- `references/power-ring.png`

## Material handoff constraints
### Scale convention
- 16 model units = 1 Minecraft block.
- Dimensions below are target whole-model envelopes, not pixel-derived measurements.

### 1) Signal Lamp
- Purpose: compact semi-steampunk signal lamp for a 3x3 pillar.
- Dimensions: 24W × 24D × 36H units (1.5 × 1.5 × 2.25 blocks).
- Placement: centered on a 3x3 pillar; base flush on top surface.
- Notes: same housing for all 8 color states; only light chamber/core changes.

### 2) Maze Laser Emitter
- Purpose: simple wall-mounted laser trap emitter for narrow maze corridors.
- Dimensions: 16W × 8D × 24H units (1 × 0.5 × 1.5 blocks).
- Placement: BACK side flush to wall; FRONT faces player path.
- Notes: laser origin aligns with center of red lens.

### 3) Spike Floor Trap
- Purpose: compact 1x1 floor trap tile.
- Dimensions: 16W × 16D × 8H units (1 × 1 × 0.5 blocks).
- Placement: floor-mounted, flush to floor.
- Notes: reference is active spikes-up state.

### 4) Power Source Generator
- Purpose: compact magical steampunk power generator for a 3x3 area.
- Dimensions: 32W × 32D × 28H units (2 × 2 × 1.75 blocks).
- Placement: centered inside a 3x3 area; base flush on floor/platform.
- Notes: active state with blue illuminated core.

### 5) Power Ring
- Purpose: compact power ring conduit paired with the generator.
- Dimensions: 32W × 24D × 36H units (2 × 1.5 × 2.25 blocks).
- Placement: centered inside a 3x3 area; base flush on floor/platform.
- Notes: active state with blue illuminated core.

## Current next step
Continue with the next approved Clockwork model on a fresh user instruction. Texture work remains out of scope unless explicitly reactivated.

## Active asset state
### Signal Lamp
- Editable model: `clockwork-signal-lamp.bbmodel`
- Bedrock geometry: `clockwork-signal-lamp.geo.json`
- Geometry authoring complete for the current no-texture scope.

### Power Source Generator
- Editable model: `clockwork-power-source-generator.bbmodel`
- Bedrock geometry: `clockwork-power-source-generator.geo.json`
- Geometry verdict: `PASS` against approved front/right/back/top/3/4 reference views.
- Verified bounds: 32W x 32D x 28H units, centered with the base at Y=0.
- Current structure: 40 Cubes under one root Group.
- Texture intentionally not authored.

### Spike Floor Trap
- Editable model: `clockwork-spike-floor-trap.bbmodel`
- Bedrock geometry: `clockwork-spike-floor-trap.geo.json`
- Geometry verdict: manually approved by the user.
- Verified bounds: 16W x 16D x 8H units, centered with the base at Y=0.
- Active spikes-up state: four shorter outer spikes plus one taller center spike.
- Texture intentionally not authored.

### Power Ring
- Editable model: `clockwork-power-ring.bbmodel`
- Bedrock geometry: `clockwork-power-ring.geo.json`
- Geometry verdict: `PASS` against approved front/right/back/top/3/4 reference views.
- Verified bounds: 32W x 24D x 36H units, centered with the base at Y=0.
- Current structure: 48 Cubes under one root Group.
- Form includes a continuous segmented ring, three mechanical hubs, dual supports, a floating stepped core, four conduits, and base control details.
- Texture intentionally not authored.

## Known blockers
- None.
