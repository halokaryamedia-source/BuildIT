# Next Action

Updated: 2026-09-06 — DIRECT authoring quality/efficiency repair. Proof: `current-validation.md`.

Branch: **`Local` only**. Proof → `current-validation.md`.

## Status

```text
GATEWAY: BASIC LIVE PASS / 4 FIXED CLIENT TOOLS
SHARED AUTHORING SURFACE: SOURCE 47; LAST LIVE 46; ANIMATION 19
AUTHORING TAXONOMY: user-selected DIRECT | 3D_ASSISTED
GEOMETRY/UV CORRECTION: REGRESSIONS PASS; ASSET QUALITY UNVERIFIED
SURFACE GAP DIAGNOSTIC: TARGETED LIVE PASS
MCP RESOURCE/PROMPT/HANDOFF: SOURCE + GENERATORS + BASIC LIVE PASS
3D_ASSISTED: ORCHESTRATOR + PUBLIC BINDING SOURCE_READY; ENVIRONMENT PREFLIGHT PASS
3D_ASSISTED GPU / NATIVE UNDO / ASSET QUALITY: NOT_RUN / DEFERRED
LEGACY UI FALLBACKS: DEBUG/MAINTENANCE ONLY
ACTIVE ASSET: LIFT — USER APPROVED; PRESERVE MAIN CHECKPOINT
```

## Next

**Handoff GitHub (permintaan pengguna):** lanjutkan pekerjaan dari repository GitHub pada branch `Local`; nama branch bukan kewajiban bekerja di PC lokal. Source, tes, laporan issue dan aset lift ikut dikirim. Pengujian native yang belum selesai tetap deferred selama tidak ada LIVE_BLOCKBENCH. Jangan mengulang authoring lift atau mengklaim kualitas/usage sudah terbukti. Mulai dari laporan issue di bawah dan source terbaru; `.cache/` tidak dikirim, jadi salinan uji dapat dibuat ulang dari `workspace/active/lift/lift.bbmodel` bila kelak pengujian live dilanjutkan.

**Baca dahulu:** [Laporan issue dan pemborosan lift](current-validation.md#laporan-issue-dan-pemborosan--lift-direct). LIFT-01 sampai LIFT-10 memisahkan kegagalan hasil, bug tool yang terbukti, pemborosan orkestrasi, dan pekerjaan yang belum diuji. Source PASS bukan penutupan audit kualitas/efisiensi.

Current priority supersedes the earlier preparation-only STOP below: user authorized system fixes and targeted live testing on a disposable lift copy, ending at Blockbench. 3D_ASSISTED/GPU testing remains deferred.

1. Source repair PASS: reference-derived adjoining-pair texturing workflow; thin-face UV preflight; native minimum packing guidance; UV occupancy/bounds; explicit timeline target/selection/receipt. Generated docs/prompts and verify:full pass (32 repository, 399 runtime, 117 authoring tests).
2. Installed bundle e5f70645919f989d071ece5ceccc021d09a4ba20ac2cedac589c1b824fe5acb9 awaits native reload proof. User was asked to reload BlockIT and open `.cache/lift-authoring-audit/lift-audit.bbmodel`; do not mutate original `workspace/active/lift/lift.bbmodel`.
3. On that copy: confirm build and project identity; test explicit clip A while B selected, native Undo; then native UV repacking at 16x with padding, mapped-pixel preservation; Painter exact pixels/clip/target/Undo; native save and reopen. No new packer unless a concrete native limit is reproduced.
4. Record raw metrics and result separately from visual acceptance. Historical token/time totals are UNKNOWN; do not claim savings from source size or passing tests. Finish at Blockbench, not Minecraft.

## Deferred 3D_ASSISTED preparation

1. Do not repeat completed Geometry/UV or texture/discovery repairs. Legacy `mcp` files were removed; canonical `blockit_mcp.js` deployment and Gateway reconnect were verified on Blockbench 5.1.6.
2. STOP at preparation. Environment/weights are installed and preflight passed without inference. Setup/run commands: `mcp/scripts/three-d-assisted/README.md`. Do not deploy, run GPU/live tests, or create an asset until the user resumes testing.
3. For actual asset authoring, obtain the approved reference, dimensions, user-selected strategy, and Animation requirement. Internal PASS only means READY_FOR_USER_REVIEW. Geometry APPROVED → UV Layout PASS → user Texture APPROVED + checkpoint → optional Animation handoff.
4. When testing is resumed: choose explicit intake → external GPU Shape/Decomposition gates → deploy verified binding → Gateway materializer native Undo/stale-state proof → end-to-end. No fallback or fifth Gateway tool. Earlier disposable tests do not establish new binding/asset quality.
5. RTX 3070 8 GB CUDA visibility is proven; peak inference VRAM capacity is not. Keep internal review gates and bounded retries. Installed runtime is unchanged by this preparation.
