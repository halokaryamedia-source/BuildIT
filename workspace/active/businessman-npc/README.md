# Businessman NPC

## Animation review checkpoint
- User approved final texture. Animation handoff completed; seated_idle6-second loop authored and saved. See ANIMATION.md for motion and checks. Project, atlas, geometry and animation JSON available. Animation user acceptance pending.

## Latest face/chest/hair revision
- User requested symmetric eyes/brows, clearer chest and hair without textile-like vertical repetition. Eye/brow pixels now horizontally mirrored at same rows; head rest tilt retained. Chest has collar, diagonal lapels, central placket/buttons, restrained fold shadows. Hair repainted with swept directional bands and tonal highlights instead of alternating vertical stripes.
- Fresh front/back/three-quarter and atlas inspected; updated saved project, PNG and previews. Mapped alpha check zero transparent samples. User texture approval pending.

## Latest texture repair
- User found missing alpha after prior cleanup: previous preview preceded erasure and was stale. Restored opaque pixels across every mapped region using bounded behind fills, then repainted jacket rear/side gradients and face. No further eraser used.
- Face now has asymmetric brows, iris/pupil detail, under-eye shadows, nose highlight/shadow, smirk and stepped cheek/jaw shading. Fresh back/front/three-quarter captures reviewed after repair; back-preview.png and texture-preview.png updated.
- Saved project and PNG; mapped alpha audit sampled every UV face region and reports zero non-opaque texel samples. Texture acceptance still pending; animation not started.

## Texture checkpoint
- User approved geometry. Native template generated then exact-aspect per-face correction/reuse:46 material regions, uniform2 pixels/model unit,128px bitmap over64 logical UV canvas. Mirrored reuse for identical garments, shoes and case frame. No partial overlap/out-of-bounds. Fractional UV endpoints intentionally preserve geometry dimensions; automatic gate review_required, manually reviewed aspect PASS.
- Black jacket with lapels, open white shirt, cream trouser creases, black shoes, blond-brown hair, skin and asymmetric smirk; brown case with metal frame. Fresh front/back/three-quarter views reviewed. Residual template cleared with isolated eraser stamps after disabling face restriction. Unused atlas area transparent.
- Project and PNG saved, texture-preview.png for user review. Texture user approval pending; no animation yet. Next approval -> Animation handoff within same task for6-second seated idle.

DIRECT Bedrock NPC, approved photographic reference in reference.png. Standing-scale target approximately32 units; sitting pose authored as rest geometry. Footprint limited16x16. Black jacket, white shirt, cream trousers, blond-brown hair and framed brown case planned; no texture yet.

Geometry review checkpoint:22 Cubes,13 Groups. Head tilted; left hand to lower cheek with bent supporting arm, right hand on thigh; hips at case top Y8, shoes groundY0. Last upper-arm correction lengthens left supporting arm to reach thigh; user should review stylized proportions. No sub-unit cube thickness. Case body partition corrected to avoid coplanar frame overlap. Initial envelope14.74x28.74x13.59; arm correction remains within footprint.

Hierarchy: npc_root owns suitcase and pelvis; pelvis owns body and thigh/calf chains; body owns head and upper-arm/forearm chains. Joint pivots established; cube rest orientations define bent limb segments. Left elbow pivot[6,12,5]. Shared future animation belongs to bones. Pose follows reference in blocky interpretation; facial expression and clothing identity await texture.

READY_FOR_USER_REVIEW geometry. Review approval required before native UV template generation. Then128px atlas, intentional reuse/mirroring, clear transparent unused space. Texture approval before Animation handoff same task. Animation planned6-second seated idle: subtle chest breath and1–2degree head motion with coordinated support hand, fixed pelvis/case/feet and seamless start/end. No standing transition or behavior pack.

Saved businessman_npc.bbmodel; geometry-preview.png uses temporary element colors. Coffee and palm assets remain separate.
