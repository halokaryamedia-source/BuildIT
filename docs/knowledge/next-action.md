# Next Action

## Active Task

- Goal: establish an evidence-driven Blockbench geometry workflow, separate
  MCP capability limits from orchestration errors, and keep one active MCP
  session in the desktop runtime.
- In scope: source/runtime parity, single-session lifecycle, basic cuboids and
  groups, composition, SIDE plus FRONT screenshots, undo safety, and small
  reference-driven tests.
- Out of scope: rebuilding the full Zebra, adding a speculative geometry-plan
  system, independent similarity scoring, texture, animation, and export.
- Status: `CHEST_BELLY_TRANSITION_ISSUES_FOUND`.
- Current result: the stale `mcp_bedrock` runtime was removed; the active
  runtime matches `mcp/`; cuboids, groups, rotation, screenshots, and undo
  work in the clean Zebra fixture; a grouped support chain with a rotated
  lower segment also passed SIDE/FRONT capture and rollback.
- The reference package now contains a draft section-landmark contract marked
  `NEEDS_VALIDATION`; it records visible questions without inventing exact
  transforms.
- The approved reference has now been inspected: qualitative SIDE/FRONT
  observations are recorded, while numeric section anchors remain unresolved.
- A draft H1 numeric envelope has been recorded as ranges for one torso and
  one support chain; it is explicitly a test hypothesis, not a requirement.
- H1 was rendered and reviewed as `ISSUES_FOUND`: attachment and ground
  contact worked, but the torso slab lacked shoulder/neck and hip landmarks;
  paired lateral support remains unresolved.
- H2 was rendered and reviewed as `ISSUES_FOUND`: decomposition and rotation
  executed, but the torso still read as disconnected stepped blocks; its
  chosen angles were unsupported guesses.
- Landmark Table v0 is now recorded as normalized ranges with status
  `VALIDATED_BY_USER`; it may drive one bounded H3 test, not final geometry.
- H3 used the approved ranges and was reviewed as `ISSUES_FOUND`: the body was
  more constrained, but SIDE remained stair-stepped and the neck transition
  was still not continuous.
- H4 used three overlapping cuboids for belly, shoulder, and hip; it was
  reviewed as `ISSUES_FOUND` because SIDE still read as abrupt rectangular
  steps, while FRONT only confirmed the width envelope.
- H5 proved that explicit Cube rotations work, but corner pivots made the
  rotated segments detach from the torso.
- H6 moved the pivots to segment centers; rotations stayed clear and the
  segments remained attached, but the torso silhouette is still unapproved.
- H7 verified a three-cuboid support chain: a center-pivot lower segment at
  `8` degrees, an attached upper segment, and a hoof at `Y=0`.
- H8 mirrored H7 into a six-cuboid left/right pair; FRONT proved symmetry and
  shared ground contact, while SIDE showed only a subtle axis change because
  both chains used the same depth band.
- H9 extended H8 into four chains across the front/rear depth bands; SIDE
  separated both zones and FRONT preserved the lateral pair.
- H10 attached one main torso cuboid to all four upper supports; attachment
  topology passed, but the torso remained a rectangular slab.
- H11 added one center-pivot shoulder/neck at `15` degrees and one center-pivot
  hip at `-8` degrees; SIDE proved the rotations and FRONT remained symmetric,
  but the torso silhouette stayed generic.
- LEFT SIDE Profile Contract v1 now defines the shoulder/neck slope, belly
  corridor, level mid-back, hip break, support bands, ground baseline, and
  explicit pass/fail rules before another torso test.
- H12 used three Cube-only torso sections against Profile Contract v1. The
  rotations executed, but SIDE/FRONT framing was too small to verify a
  readable continuous profile; the result remains blocked, not approved.
- LEFT SIDE Station Plan v1 now assigns one visible responsibility to each
  ordered station: head/neck, chest, belly, back, hip, and tail root. It also
  requires a framing gate before visual judgment and forbids extra Cubes after
  the first failed rule.
- Station Plan v1 test exposed two separate failures: the candidate was too
  small because of zoom/framing, and the five station blocks did not read as a
  clearly connected torso mass. The framing failure blocks full silhouette
  judgement; the unclear transitions remain a geometry issue to inspect after
  framing is fixed. The fixture was rolled back.
- Adjacent Station Transition Contract v1 now assigns a silhouette owner and
  rotation owner to each torso boundary, requires zero visible gap, and limits
  the next proof to two adjacent Cubes.
- The neck/chest two-Cube probe passed its boundary contract from SIDE and
  FRONT; this is a local transition pass only, not torso approval.
- The chest/belly two-Cube probe had technical contact and valid FRONT width,
  but SIDE still showed a hard stepped ledge; the transition is not visually
  approved.
- Session repro: two fresh `initialize` requests changed live active sessions
  from `10` to `12`, confirming stale sessions were accumulating.
- Session patch: a fresh initialized session now removes older sessions in the
  single-client desktop runtime; live verification passed with `active=1`.
- Session verification: after reload, health reported `0`; first initialize
  reported `1`; second initialize stayed at `1`; the old session returned
  HTTP `404` and the new session remained active.
- Cube-only reload proof: the live project format was `bedrock`; one cuboid was
  placed and undone; two identified legacy test artifacts were removed; the
  final project and outline both reported zero elements.

## Decisions

- Zebra is a test fixture only; no Zebra anatomy is being added to runtime
  code.
- Tests use the existing empty Bedrock project and stop if it is not empty.
- `place_cube` must work without a texture; explicit invalid textures still
  fail before mutation.
- Cube undo records elements; group undo records the outliner and groups.
- A single cuboid can be created and reviewed, but it is visibly too crude for
  the torso reference.
- Three cuboids can create a stepped torso profile, proving composition is a
  viable foundation but not a faithful final shape.
- A grouped support chain can be built with an anchor, upper segment, rotated
  lower segment, and hoof, proving the existing tools cover basic articulated
  construction.
- Exact section transforms are hypotheses until the reference package contains
  section landmarks; screenshots must be inspected before claiming resemblance.
- Landmark status is promoted only by a fresh SIDE plus FRONT review that names
  the inspected landmark IDs and records observations for both views.
- No full Zebra construction proceeds before a small section passes visual
  review from SIDE and FRONT.
- This desktop plugin intentionally keeps one active MCP client; a new client
  replaces the previous one.
- Minecraft Bedrock geometry scope is Cube/Cuboid only; Mesh, sphere, cylinder,
  and other primitives are excluded from the workflow.

## Verification

- `bun run build`: passed after the source fixes.
- Live health and initialize: passed against the active Blockbench runtime.
- Post-reload health: `active=1`.
- Live parity: the stale `register_geometry_plan` tool is absent and
  `place_cube` has the basic optional-texture schema.
- Vertical slice: project info, cube placement, outline, screenshot, undo, and
  project info returned to zero geometry.
- Composition slice: three cubes, one group, rotation, screenshot, and undo
  returned to zero roots, cubes, groups, and outliner elements.
- Single torso slice: SIDE and FRONT screenshots showed a plain cuboid; undo
  returned the project to zero cubes.
- Three-cuboid torso slice: SIDE showed a stepped profile and FRONT preserved
  the width envelope; one undo returned `cubes=0`, `groups=0`, and
  `outliner_elements=0`.
- Support-chain slice: one group and four cuboids, including a rotated lower
  segment, produced SIDE and FRONT evidence; two undo steps returned
  `cubes=0`, `groups=0`, and `outliner_elements=0`.
- Cube-only cleanup slice: after reload, the Bedrock project ended with
  `cubes=0`, `meshes=0`, `groups=0`, and `outliner_elements=0`; `list_outline`
  returned no roots.
- H4 proof: fresh LEFT SIDE and FRONT screenshots were captured, then one
  batch undo returned the fixture to zero cubes and zero outline roots.
- H5/H6 proof: explicit rotated cuboids were rendered from LEFT SIDE and
  FRONT; H6 used center pivots and one batch undo returned the fixture to zero
  cubes and zero outline roots.
- H7 proof: LEFT SIDE showed the lower-axis change and ground contact, FRONT
  showed a compact chain, and one batch undo returned zero cubes and roots.
- H8 proof: FRONT showed the symmetric pair, LEFT SIDE showed the preserved
  chain structure, and one batch undo returned zero cubes and roots.
- H9 proof: SIDE showed separate front/rear zones, FRONT showed the paired
  arrangement, and one batch undo returned zero cubes and roots.
- H10 proof: SIDE and FRONT showed the torso attached over all four supports;
  one batch undo returned zero cubes and roots.
- H11 proof: SIDE and FRONT showed the two rotated torso sections; cleanup of a
  known legacy cube ghost restored zero cubes and zero roots.
- H12 proof: the three-Cube bounded test produced fresh SIDE/FRONT captures,
  then one batch undo returned `cubes=0`, `meshes=0`, `groups=0`, and
  `outliner_elements=0`; health remained `active=1`.
- Station-plan proof: the reference package records six ordered stations,
  explicit boundary ownership, Cube-only stop rules, and SIDE/FRONT framing
  requirements without assigning unverified transforms.
- Zoom-rerun proof: the reloaded `set_camera_angle` schema exposed `zoom`; a
  `zoom=1.1` SIDE/FRONT capture passed framing but failed station continuity,
  then rollback returned `cubes=0`, `meshes=0`, `groups=0`, and roots empty.
- Neck/chest probe proof: two Cube placement, rotated center-pivot attachment,
  SIDE/FRONT capture, and one batch rollback returned the Bedrock project to
  zero cubes, meshes, groups, and roots; health stayed `active=1`.
- Chest/belly probe proof: two Cube placement, SIDE/FRONT capture, explicit
  `ISSUES_FOUND` review, and one batch rollback returned zero cubes, meshes,
  groups, and roots; health stayed `active=1`.
- Station-plan test proof: the empty Bedrock project accepted one five-Cube
  batch; SIDE/FRONT captures were saved, zoom/framing was rejected, the
  station transitions were visibly unclear, and rollback returned zero cubes,
  meshes, groups, and roots while health stayed `active=1`.
- Profile-contract proof: v1 is recorded from the orthographic reference as
  normalized zones and visual relationships, without inventing Cube transforms.
- Contract proof: the reference package records confirmed global inputs and
  eight section landmarks, all explicitly marked `Needs Validation`.
- Reference-inspection proof: the package records SIDE/FRONT observations for
  ground contacts, support attachments, torso belly/shoulder/hip landmarks,
  and the width envelope without claiming coordinates.
- H1 contract proof: torso and support ranges are recorded with open questions
  for front/rear bounds, lateral offsets, and lower-segment rotation.
- H1 review proof: the fresh SIDE/FRONT draft recorded concrete mismatches and
  did not promote any numeric value to an approved transform.
- H2 review proof: a four-cuboid torso decomposition produced fresh SIDE/FRONT
  evidence, then rolled back to zero geometry; no visual approval was issued.
- Table proof: v0 names torso bounds, belly/shoulder/hip landmarks, support
  contacts, lateral/depth bands, and the unresolved axis change without using
  pixel-to-cube conversion.
- User decision proof: the user approved v0 as the H3 test contract.
- Session proof: the red repro showed `active=10 → 12` after two initializes;
  the replacement patch built cleanly and awaits runtime reload.

## Known Limitations

- The MCP can create and validate technical geometry but cannot independently
  decide whether a silhouette resembles the reference.
- The reference manifest supplies overall dimensions, not authoritative torso
  landmarks, so section transforms remain hypotheses.
- Cube/Cuboid composition produces stepped forms; visual fidelity depends on
  validated section landmarks and cube placement.
- The support-chain test proves structural composition, not anatomical fidelity;
  no visual pass is claimed for the final Zebra.
- Fresh screenshots are evidence for inspection, not an automatic visual score.
- H1 through H4 failed visual approval for the torso; H5/H6 establish the
  rotation-and-pivot pattern, but no torso silhouette pass is claimed.
- H12 is blocked by evidence framing and an unreadable torso-only profile; the
  current Cube-only torso transform set is not visually approved.
- The zoom blocker is resolved for bounded review, but the five-Cube torso
  still fails visual continuity: adjacent stations read as separate blocks.
- Camera patch: `set_camera_angle` now accepts optional orthographic `zoom` and
  updates the projection matrix and controls; build passed, but live reload
  is still required before runtime proof.
- Camera zoom is now live-proven: `zoom=1.1` produced readable SIDE/FRONT
  framing, while `zoom=2` and `zoom=6` clipped the candidate. The same test
  then exposed a real geometry issue: the station sections remained separate
  blocks with abrupt boundaries.
- H7 technically passes the support-chain contract; the full body silhouette
  remains unapproved.
- The single-client policy intentionally disconnects an older client when a
  newer client initializes.

## Next Step

Revise the `Chest ↔ Belly` boundary ownership and overlap rule to remove the
hard SIDE ledge; do not probe the next boundary or rebuild the torso until this
failed transition has a new bounded hypothesis.
