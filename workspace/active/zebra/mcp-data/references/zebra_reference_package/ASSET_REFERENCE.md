# Model Reference - Zebra

## Authority

- `source/zebra_source_image.webp` is provenance only.
- `zebra_model_reference.webp` is the approved Model Reference.
- MCP uses its five views as the visual authority.

## Dimensions

| Meaning | Blocks | Blockbench units |
|---|---:|---:|
| Height | 2.0 | 32.0 |
| Width | 0.9 | 14.4 |
| Length | 2.6 | 41.6 |

`1 block = 16 Blockbench units`. Texture Style `32x32` is pixel density, not
geometry scale.

## Package boundary

This package validates its file and metadata structure only. It is not approval
of geometry or visual quality.

Dimensions are approximate Blockbench scale targets. The image stays unchanged
and is not stretched to force exact panel ratios.

## Section Landmark Contract (Draft)

Status: `NEEDS_VALIDATION`

This contract separates what the package proves from what must be inspected by
the modeller. It is not approval of any geometry and it does not prescribe
exact cube transforms.

### Confirmed inputs

- Overall envelope: `X=14.4`, `Y=32.0`, `Z=41.6` geometry units.
- Axes: width `X`, height `Y`, length `Z`, forward `-Z`.
- Required construction views: `LEFT SIDE` plus `FRONT`.
- Construction order: contact/support anchor, attached connector, parent
  connector, then main mass.

### Section landmarks

| ID | Section | Visible question | Required view | Status |
|---|---|---|---|---|
| `support.contact` | support chain | Where does the foot/lowest support meet the ground plane? | LEFT SIDE | Needs Validation |
| `support.upper_attach` | support chain | Where does the parent connector meet the torso underside? | LEFT SIDE + FRONT | Needs Validation |
| `support.axis_change` | support chain | Does the lower segment leave the world vertical, and in which view? | LEFT SIDE | Needs Validation |
| `support.lateral_position` | support chain | Is the chain centered, offset, or mirrored across the body width? | FRONT | Needs Validation |
| `torso.belly_mid` | torso | Where is the lowest continuous body line between the support attachments? | LEFT SIDE | Needs Validation |
| `torso.shoulder_top` | torso | Where does the front/top mass rise toward the neck? | LEFT SIDE | Needs Validation |
| `torso.hip_top` | torso | Where does the rear/top mass end near the tail root? | LEFT SIDE | Needs Validation |
| `torso.width_envelope` | torso | Does the body remain within the reference width without becoming a flat slab? | FRONT | Needs Validation |

### Reference observations (not coordinates)

- `support.contact`: the visible hooves terminate on one shared ground
  baseline in `LEFT SIDE`; the support chain must not float or stagger without
  evidence.
- `support.upper_attach`: the visible legs enter the lower torso at distinct
  front/rear attachment zones rather than touching a free-floating body.
- `support.axis_change`: the lower support silhouettes are predominantly
  vertical with small section offsets; no exact rotation angle is established.
- `support.lateral_position`: `FRONT` shows paired supports separated by a
  center gap and arranged symmetrically around the body centerline.
- `torso.belly_mid`: `LEFT SIDE` shows a low, nearly horizontal belly line
  across the central body volume.
- `torso.shoulder_top`: the front body rises into a visibly sloped neck; the
  neck slope must not be folded into a flat torso front.
- `torso.hip_top`: the rear/top body line is comparatively level before the
  tail attachment.
- `torso.width_envelope`: `FRONT` shows a body wider than the head and each
  support, with the central body mass remaining inside the global `X=14.4`
  target.

These observations are reference evidence only. They do not establish exact
`from`, `to`, `origin`, pivot, or rotation values. Those values remain
`Needs Validation` until a section draft is rendered and reviewed from both
required views.

### Draft numeric envelope (hypothesis H1)

The following ranges are modelling candidates derived from the confirmed
global envelope and the observations above. They are deliberately ranges, not
authoritative transforms:

| Section | Candidate envelope | Open question |
|---|---|---|
| `torso` | `X=11..14`, `Y=10..13`, `Z=28..34`; bottom around `Y=10..12` | exact front/rear `Z` bounds and shoulder/hip break |
| `support_chain` | contact at `Y=0`; upper attachment around `Y=10..13`; segment width/depth `3..5` | exact `X` pair offsets and front/rear `Z` zones |
| `support_chain.lower` | candidate rotation around `X`, tested as `0..8` degrees | whether the visible offset needs rotation or only a stepped placement |

H1 is accepted only as a test input. A fresh SIDE/FRONT review may mark it
`ISSUES_FOUND` or `BLOCKED`; it cannot be promoted to a requirement from a
technical placement result alone.

### H1 review result

Decision: `ISSUES_FOUND`

- `support.contact`: observed as connected to the ground in SIDE.
- `support.upper_attach`: observed as connected to the torso candidate, but
  this is only a technical attachment observation.
- `support.axis_change`: the rotated lower segment is visible, so the tool can
  express the tested offset; the chosen angle is not visually approved.
- `torso.belly_mid`: a low body line exists, but it belongs to an overly
  uniform slab.
- `torso.shoulder_top`: failed; the draft has no visible shoulder-to-neck rise.
- `torso.hip_top`: failed as a useful landmark; the torso reads as one flat
  rectangular top rather than a distinct rear transition.
- `torso.width_envelope`: the FRONT width is within the global target, but the
  body is too flat to count as a visual match.
- `support.lateral_position`: unresolved because the draft intentionally used
  one chain; no paired FRONT evidence was produced.

The next correction must change the section decomposition or landmark
evidence. It must not merely resize the same slab and call the result a pass.

### H2 review result

Decision: `ISSUES_FOUND`

- `torso.belly_mid`: the central block is present, but the body reads as
  stepped pieces rather than one continuous low mass.
- `torso.shoulder_top`: a rise is technically visible, but the shoulder and
  neck-base transition is too abrupt and does not match the reference's
  connected slope.
- `torso.hip_top`: the rear block creates an artificial step instead of a
  useful hip transition.
- `torso.width_envelope`: the FRONT silhouette is bounded, but its stacked
  rectangles do not establish the reference taper.
- Rotation execution passed technically; the reference does not provide an
  approved angle, so the chosen `-8` and `-20` degree values remain guesses.

H1 and H2 both failed visual review. Further cuboid corrections are paused
until the section landmarks or an equivalent validated modelling brief is
provided. This prevents another confident but unsupported geometry draft.

### H3 review result

Decision: `ISSUES_FOUND`

- The approved normalized ranges produced a more coherent low body than H1
  and H2, but SIDE still reads as a stair-step silhouette.
- The shoulder rise is visible, yet it remains a block transition rather than
  the continuous sloped neck connection in the reference.
- The hip block is bounded correctly in FRONT, but its step is not a useful
  visual hip landmark.
- The test proves the normalized contract can constrain placement, not that
  cuboids can express the required silhouette.

### H4 review result

Decision: `ISSUES_FOUND`

- The three-cuboid overlap test placed the belly, shoulder, and hip ranges
  inside the approved global envelope and connected them technically.
- `LEFT SIDE` still read as three rectangular blocks with abrupt shoulder and
  hip steps; overlap alone did not produce a continuous torso transition.
- `FRONT` preserved a broad body width inside the envelope, but provided no
  evidence of the side-profile landmarks.
- The batch undo returned the Bedrock fixture to zero cubes and zero outline
  roots.

H4 confirms that Cube/Cuboid placement and rollback work, but the current
three-block decomposition is not visually approved for the torso.

### Rotation probe H5/H6

Decision: `ROTATION_TECHNICALLY_PROVEN`

- H5 used explicit rotations on the shoulder/neck and hip cuboids, but corner
  pivots made both segments rotate away from the main torso.
- H6 moved each pivot to the segment center and retained intentional overlap.
  The rotations remained visibly clear while the segments stayed attached.
- H6 is still not visual approval of the torso silhouette; it proves the
  correct Cube-only construction pattern is pivot placement plus rotation, not
  repeated stacked cuboids.

### H7 support-chain review

Decision: `TECHNICAL_PASS`

- A three-cuboid chain used a vertical upper support, a lower support rotated
  by `8` degrees around its center pivot, and a hoof at `Y=0`.
- `LEFT SIDE` clearly showed the lower-axis change; the upper segment remained
  attached and the hoof met the ground baseline.
- `FRONT` remained a compact, non-voxelized column.
- One batch undo returned the Bedrock fixture to zero cubes and zero roots.

H7 is a reusable support-chain construction pattern. It is not yet a full
Zebra body approval.

### H8 paired-support review

Decision: `TECHNICAL_PASS_WITH_SIDE_LIMIT`

- H7 was mirrored across X to create left and right support chains using six
  cuboids total, with matched center pivots and matched lower rotations.
- `FRONT` showed two separated, symmetric supports with shared ground contact.
- `LEFT SIDE` preserved the chain structure, but the axis change was subtle
  because both chains occupied the same depth band.
- One batch undo returned the Bedrock fixture to zero cubes and zero roots.

### H9 depth-pair review

Decision: `TECHNICAL_PASS`

- H8 was extended into four chains across the two proposed front/rear depth
  bands while preserving the mirrored left/right centers.
- `LEFT SIDE` clearly separated the front and rear support zones and showed
  the lower-segment rotations in both zones.
- `FRONT` preserved the lateral pair arrangement; front/rear chains overlap
  in that view as expected from their depth separation.
- One batch undo returned the Bedrock fixture to zero cubes and zero roots.

### H10 torso-attachment review

Decision: `TECHNICAL_PASS_SILHOUETTE_UNAPPROVED`

- The H9 support layout accepted one main torso cuboid overlapping all four
  upper-support attachment bands.
- `LEFT SIDE` showed four attached supports and clear lower rotations, while
  `FRONT` showed the expected broad torso over the paired supports.
- The torso still read as a rectangular slab, so this test proves attachment
  topology only and does not approve the body silhouette.
- One batch undo returned the Bedrock fixture to zero cubes and zero roots.

### H11 rotated-torso review

Decision: `TECHNICAL_PASS_SILHOUETTE_UNAPPROVED`

- H9 support geometry was combined with one main torso, one shoulder/neck
  cuboid rotated `15` degrees, and one hip cuboid rotated `-8` degrees.
- `LEFT SIDE` clearly showed both torso rotations while the parts remained
  attached; `FRONT` remained symmetric over the four supports.
- The torso still reads as a generic rectangular mass, so this is a rotation
  and attachment pass, not approval of the Zebra silhouette.
- Rollback required removing a known legacy cube ghost UUID left by earlier
  tests; the final project and outline were then empty.

## LEFT SIDE Profile Contract v1

Status: `READY_FOR_BOUNDED_CUBE_TEST`

This contract describes the required silhouette relationships from the
reference. It is not a pixel-to-coordinate conversion and does not prescribe
`from`, `to`, `origin`, or rotation values.

| Profile zone | Normalized target | Required relationship |
|---|---:|---|
| Front chest / neck base | `sZ=0.18..0.34` | rises toward the neck; must not end as a flat vertical slab |
| Shoulder-to-neck slope | `sZ=0.22..0.40`, `vY=0.62..0.82` | one clear rotated section with a connected lower attachment |
| Belly corridor | `sZ=0.34..0.72`, `vY=0.36..0.43` | low and nearly horizontal; no stair-step between sections |
| Mid-back line | `sZ=0.38..0.72`, `vY=0.70..0.78` | comparatively level behind the neck rise |
| Hip break | `sZ=0.68..0.86`, `vY=0.60..0.74` | rear transition ends the body mass before the tail root |
| Front support band | `sZ=0.32..0.45` | upper support enters the underside inside the belly corridor |
| Rear support band | `sZ=0.66..0.80` | upper support enters the underside near the hip break |
| Ground contacts | `vY=0` | front and rear hooves share one baseline |

### LEFT SIDE pass/fail rules

- `PASS` requires a readable diagonal shoulder/neck edge produced by rotation,
  not by stacking short cuboids.
- `PASS` requires the belly corridor to remain continuous between the front
  and rear support bands.
- `PASS` requires the mid-back line to stay more level than the neck slope.
- `PASS` requires the hip break to be visible without adding a second flat slab
  on top of the first.
- `PASS` requires every visible hoof to share the same ground baseline.
- Any detached rotated piece, unsupported angle, or staircase silhouette is
  `ISSUES_FOUND`; technical attachment alone cannot promote the profile.

### H12 LEFT SIDE Profile Contract v1 review

Decision: `BLOCKED_BY_FRAMING_AND_UNREADABLE_PROFILE`

- The bounded test used only three Cubes: one main body, one rotated
  shoulder/neck section, and one rotated hip section.
- Rotation and placement executed technically, but the torso-only SIDE and
  FRONT captures framed the result too small to inspect the required profile
  zones reliably.
- The visible result still read as a generic central box with attached pieces;
  the continuous belly corridor, level mid-back, and hip break could not be
  proven from the evidence.
- No additional cuboids were added. One batch undo returned the Bedrock
  fixture to zero geometry and zero outline roots.

H12 does not promote any transform or landmark. The next test requires an
ordered side-profile station plan and a camera framing/fit check before
another geometry placement.

## LEFT SIDE Station Plan v1

Status: `READY_FOR_ONE_BOUNDED_TEST`

This is the construction order for one Cube/Cuboid draft. A station owns a
visible section of the SIDE silhouette; it is not permission to stack cubes
until the outline looks full.

| Order | Station | Profile ownership | Construction rule | Proof required |
|---:|---|---|---|---|
| 1 | Head / neck | front chest and neck base, `sZ=0.18..0.34` | one clear diagonal rise; use rotation and a center pivot | SIDE shows the slope without detachment |
| 2 | Chest | shoulder-to-neck transition, `sZ=0.22..0.40`, `vY=0.62..0.82` | attach into the front of the body; do not make a vertical front wall | SIDE shows a connected shoulder edge |
| 3 | Belly | belly corridor, `sZ=0.34..0.72`, `vY=0.36..0.43` | one continuous low underside between support bands | SIDE shows no staircase or gap |
| 4 | Back | mid-back line, `sZ=0.38..0.72`, `vY=0.70..0.78` | keep the line more level than the neck slope | SIDE shows a level run behind the rise |
| 5 | Hip | hip break, `sZ=0.68..0.86`, `vY=0.60..0.74` | end the main mass before the tail; no second flat slab | SIDE shows one readable rear transition |
| 6 | Tail root | rear continuation after the hip, exact range `Needs Validation` | reserve the attachment zone; do not place it in this torso test | reference check must establish its boundary |

### Station boundaries

- Each station must overlap its immediate neighbor only enough to remove a
  visible gap; overlap is not a substitute for a transition.
- The belly owns the lowest continuous line. The chest and hip must not create
  a second lower line that breaks it.
- The neck owns the only strong diagonal. The back remains comparatively level.
- The hip owns the rear break. The tail root begins after that break and is
  excluded from the next torso proof.
- Supports are checked against the belly and hip bands, but are not added to
  this torso-only station test.
- If one station needs extra stacked Cubes to hide a bad boundary, stop with
  `ISSUES_FOUND` and revise the station boundary instead.

### Camera and review gate

- Capture `LEFT SIDE` first in orthographic projection, then `FRONT`.
- The candidate must occupy a readable central scale: its silhouette must not
  be a tiny object surrounded by empty viewport, and no required station may
  be clipped.
- If the framing fails, record `BLOCKED_BY_FRAMING` and do not judge the
  geometry from that capture.
- Review in order: neck slope, chest connection, belly continuity, level back,
  hip break. Stop at the first failed rule; do not add another Cube.
- After review, rollback the single batch and verify zero cubes and zero roots.

### Station Plan v1 test result

Decision: `ISSUES_FOUND_AFTER_FRAMING_PASS`

- The project was empty and the test placed exactly five Cube stations:
  head/neck, chest, belly, back, and hip. Tail root was correctly excluded.
- The reloaded runtime exposed the new `zoom` parameter. `zoom=6` and `zoom=2`
  clipped the candidate; `zoom=1.1` produced a readable SIDE and FRONT frame.
- With framing passing, the SIDE view showed the five station sections as
  separate rectangular blocks with abrupt boundaries. They did not read as
  one continuous torso mass.
- This is now a geometry-transition failure, not a camera blocker. No extra
  Cubes were added and the single batch rollback returned the project to zero
  geometry and zero outline roots.
- One batch undo restored zero cubes, zero meshes, zero groups, and zero roots.

## Adjacent Station Transition Contract v1

Status: `READY_FOR_TWO_STATION_PROBE`

This contract tests one boundary at a time. It prevents a full torso batch from
hiding broken joins behind more Cubes.

| Boundary | Shared responsibility | Silhouette owner | Rotation owner |
|---|---|---|---|
| Head/neck ↔ chest | one connected front attachment; no gap | head/neck owns the strong diagonal; chest owns the lower join | head/neck only |
| Chest ↔ belly | front mass meets the continuous underside | belly owns the lowest line; chest ends above it | neither unless the join remains attached |
| Belly ↔ back | one body volume, not two stacked ledges | belly owns the lower contour; back owns the level upper line | neither |
| Back ↔ hip | level back transitions once into the rear break | back owns the level run; hip owns the break before tail root | hip only |

### Transition rules

- Required gap at every shared boundary: `0` visible units.
- Required visible seam: one boundary is allowed; a double ledge or detached
  color block is not.
- Overlap amount: `Needs Validation`; use the smallest overlap that removes a
  gap and does not create a second silhouette step.
- A rotated station must have a center pivot and must remain attached at its
  owning boundary after rotation.
- A probe contains exactly two adjacent Cubes, one boundary, and no supports.
  Capture SIDE first, then FRONT, and rollback immediately after review.
- `PASS` requires one readable connected mass in SIDE and a preserved width
  envelope in FRONT. Any gap, detached rotation, or double ledge is
  `ISSUES_FOUND`.

### Neck/chest transition probe result

Decision: `PASS_BOUNDARY_ONLY`

- The two-Cube probe used `probe_head_neck` with a center pivot and an explicit
  rotation, joined to `probe_chest` at the front boundary.
- `LEFT SIDE` showed a readable diagonal neck attached to the chest without a
  visible gap or detached rotated piece.
- `FRONT` preserved the chest width envelope and did not expose a broken join.
- The result approves this boundary pattern only. It does not approve the
  belly, back, hip, or full torso silhouette.
- One batch undo returned zero cubes, zero meshes, zero groups, and zero roots.

### Chest/belly transition probe result

Decision: `ISSUES_FOUND`

- The two-Cube probe had no visible gap and FRONT preserved the width envelope.
- `LEFT SIDE` still read as two rectangular blocks with an abrupt stepped
  boundary; technical contact did not create a continuous belly transition.
- The belly lower line was visible, but the chest-to-belly join introduced a
  hard ledge instead of a unified body mass.
- One batch undo returned zero cubes, zero meshes, zero groups, and zero roots.

## Landmark Table v0 (Proposed)

Status: `VALIDATED_BY_USER`

These are normalized visual ranges for review, not cube transforms. They use
the global reference envelope as a measuring frame:

- `uX=0..1`: left-to-right across the global width envelope;
- `vY=0..1`: ground-to-top across the global height envelope;
- `sZ=0..1`: front-to-rear across the global length envelope, with forward at
  `-Z`.

| Landmark | Proposed normalized range | Meaning |
|---|---:|---|
| `torso.front_bound` | `sZ=0.24..0.34` | front body/shoulder boundary before the neck rises |
| `torso.rear_bound` | `sZ=0.78..0.88` | rear body boundary before the tail root |
| `torso.belly_mid` | `vY=0.36..0.43` | low continuous body line |
| `torso.shoulder_top` | `sZ=0.24..0.38`, `vY=0.66..0.76` | shoulder-to-neck rise zone |
| `torso.hip_top` | `sZ=0.70..0.86`, `vY=0.62..0.72` | rear/top body transition |
| `torso.width_envelope` | `uX=0.10..0.90` | body is broad but remains inside global width |
| `support.contact` | `vY=0` | shared ground contact baseline |
| `support.upper_attach` | `vY=0.34..0.43` | underside attachment band |
| `support.lateral_pair` | `uX=0.16..0.30` and `0.70..0.84` | left/right support bands in FRONT |
| `support.depth_pair` | `sZ=0.32..0.45` and `0.66..0.80` | front/rear support zones in SIDE |
| `support.axis_change` | small `sZ` offset only | lower segment is mostly vertical; angle remains unresolved |

The table is intentionally coarse. It is a review contract for section
placement, not a pixel-to-coordinate conversion and not a resemblance score.
The user approved these ranges as the H3 test contract. They still do not
approve any rendered geometry; a fresh SIDE/FRONT review remains mandatory.

### Evidence rule

Until these landmarks are inspected and recorded, section transforms remain
hypotheses. A technical result such as “cube placed”, “group attached”, or
“undo succeeded” cannot promote a landmark to verified. A section review must
show `LEFT SIDE` and `FRONT`, identify the landmark IDs inspected, and record
`PASS`, `ISSUES_FOUND`, or `BLOCKED` with observations for both views.
