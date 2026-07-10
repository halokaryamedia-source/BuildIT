# Phase Risk Simulation for MCP Blockbench Asset Builds

## Purpose

This document simulates a full build pass and identifies where quality is most likely to degrade.
Use it before every new asset build to decide which checks must happen first.

It applies to the active Bedrock Entity workflow.

## Simulation: "Build one new object from references"

| Phase | Expected action | High-risk issue | Main cause | Failure signal | Priority fix |
| --- | --- | --- | --- | --- | --- |
| 1. Reference Collection | Collect and tag references | Ambiguous front/side orientation | Incomplete reference framing | User asks for fixes but no orientation baseline exists | Lock front direction + focal zones before any tool call |
| 1. Reference Collection | Geometry intention mapping | Missing texture-vs-geometry plan | No explicit boundary in brief | Too much micro-geometry during Main Geometry | Add `Geometry Purpose` + `Texture Purpose` blocks in brief |
| 2. Main Geometry | Build base silhouette | Floating core parts | Attachment logic not planned first | Limbs/armor/weapons appear detached from side or rear views | Parent map + attach points before cube placement |
| 2. Main Geometry | Build base silhouette | Cube fragmentation overload | "Decorative" micro-cubes for material detail | Many tiny cubes for color/line details | Convert tiny details to texture-only plan |
| 2. Main Geometry | Build base silhouette | Invalid object-to-object overlap | Hard edits without pivot/group checks | Z-fighting flicker, impossible texture seams | Keep pivot map and keep only one cube occupying same volume |
| 3. Geometry Detailing | Add secondary silhouette detail | Over-shape / over-detail | Expanding from flat body with small noisy additions | Silhouette becomes noisy but unreadable | Add only structural/reading-value elements first |
| 3. Geometry Detailing | Add secondary silhouette detail | Wrong attachment direction | Arms/weapons/parts mirrored or rotated wrong | One hand holds item backward, knee guard offset | Validate parent orientation in side + front |
| 4. UV Texture | Map UV for all faces | Loose atlas / low utilization | No UV occupancy target | Large empty spacing, repeated texture waste | Run atlas occupancy check and compress low-visibility faces |
| 4. UV Texture | Map UV for all faces | Mixed texture regions accidentally | Multiple disconnected texture sources | Color drift between symmetric faces | Keep one base atlas for build phase unless explicit split is required |
| 5. Base Texturing | Paint base materials | Flat palette fill | Gradient rule ignored | Large faces use single tone only | Apply stepped 3+ tones to each visible primary face |
| 5. Base Texturing | Paint base materials | Texture applied opposite side | Front/back mix-up | Face detail appears on wrong side | Use one per-face UV orientation note before paint |
| 6. Detail Texturing | Add material depth | Unrealistic noise for detail | Overuse brush noise | Focal details look random/noisy | Replace noise with directional highlights/shadows |
| 6. Detail Texturing | Add material depth | No gradient on large surfaces | Material still color-blocked | No depth, matte flatness | Force graded ramps (3-step minimum per large area) |
| 7. Polish | Final cleanup | Reappearance of hidden blockers | Early phase blockers not removed before finish | Previously tolerated small issues appear visible in final | Run blocker pass again using scorecard BLOCKER rules |
| 7. Polish | Final cleanup | Manual edits break structure | Tooling mismatch or user manual tweak | Pivot/parent changed after review | Rebuild a final structure check (root, pivots, parents, attach) |

## What makes issues repeat most (Root-cause map)

1. Reference ambiguity
   - Happens when only one image is provided and orientation is unclear.
   - Impact: wrong limb direction, wrong details on wrong side, hard-to-detect texturing mistakes.
   - Control: require multi-angle references and explicit front marker.

2. Phase leakage
   - Happens when geometry and texture decisions are mixed in one phase.
   - Impact: cube overuse, poor gradients, unstable atlas.
   - Control: deny phase jumps; every phase has a hard stop.

3. Tool limitation
   - Happens when tool calls are too broad and context is gathered by partial data.
   - Impact: detached elements, collision not noticed until later, wrong pivots.
   - Control: narrow tool scope and screenshot at phase gates.

4. Session/context drift
   - Happens when per-asset session artifacts are inconsistent across chats/PC.
   - Impact: model starts from wrong phase or duplicate decisions.
   - Control: per-asset session folder + `session.md` as source-of-truth.

## Per-phase risk level (current baseline)

- P0: Main Geometry, Geometry Detailing, UV Texture
- P1: Base Texturing, Detail Texturing
- P2: Polish

Prioritize checkpoints and screenshots on P0 phases first to reduce rework.

## Simulation playbook (10-minute pre-flight)

1. Confirm phase order is valid and current phase is `Reference`.
2. Read reference authority order (front/scale/silhouette -> attachments -> close-up detail).
3. Verify cube budget and micro-cube exception rule are written.
4. Verify expected UV occupancy target and gradient rule are set before UV work.
5. Verify screenshot checkpoints are prepared:
   - `phase-2-main-geom-front.png`
   - `phase-2-main-geom-side.png`
   - `phase-4-uv-map.png`
   - `phase-7-final-front.png`

If any of steps 2-4 are not complete, stop and request missing reference/decision input.

## Acceptance Criteria

- Each phase has a documented high-risk item and corresponding mitigation.
- Phase risk gates are reviewed before entering each phase.
- Simulation output is used to add targeted checks at phase transitions.
- If a P0 issue is unresolved, that phase must not advance to the next one.
