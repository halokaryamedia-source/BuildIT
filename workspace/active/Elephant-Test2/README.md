# Elephant-Test2 — Active

Approved reference: 5-view elephant (SIDE/FRONT/BACK/TOP/FRONT-SIDE 3/4) — blocky Minecraft style, visible in chat 2026-08-24.

Current state: `model.bbmodel` 15847 bytes, 19 cubes, 10 groups, 1 texture 64×64 provisional. Primary blockout placed in 1× `place_cube` batch (18) + 1 rot test. Bounds `[-9,-1,-27]→[9,20,14]` center [0,9.5,-6.5].

Next: difference-first visual gate with `front_direction -z` captures (front/back/left/top/front_left_3q). Use View Pair Map: SIDE↔left, FRONT↔front, BACK↔back, TOP↔top, 3/4↔front_left_3q. Classify IMPROVED/UNCHANGED/REGRESSED; fix via `modify_cubes_batch` if needed. Texture production waits for geometry PASS.

Flow: MCP to-the-point verified (1 add_group, 1 place_cube, 1 capture 5 views). No per-cube inspect ritual.
