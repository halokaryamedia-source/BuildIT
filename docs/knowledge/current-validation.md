# Current Validation

Updated: 2026-09-06

This file owns **current proof interpretation**. Continuation belongs in `docs/knowledge/next-action.md`; stable facts in `CONTEXT.md`; source ownership in `docs/knowledge/implementation-map.md`.

## Laporan issue dan pemborosan — lift DIRECT

**Integrasi GitHub:** pekerjaan lokal digabung dengan remote `72f3ed1` (termasuk `a8219c3` TCP/brush/export). `bun run verify:full` pada hasil gabungan PASS: 32 repository + 402 runtime + 117 authoring = **551 tes**. Build hasil merge: sha256:c208ec49344db79fa22e1cddd330e563f14319d4ed0c724408ee0ba0a01c969c. Fixture brush remote disesuaikan dengan NumSlider native dan pemilihan brush sebelum setting; batas kualitas/native tetap belum berubah. Pengguna melanjutkan dari GitHub; live acceptance yang tertunda tidak dijalankan dalam handoff ini.

**Status sebenarnya: perbaikan source dan panduan sudah diuji; hasil perbaikannya di Blockbench belum diverifikasi. Seluruh masalah kualitas/efisiensi belum dapat dinyatakan selesai.** Batas pekerjaan adalah Blockbench, tanpa pengujian Minecraft.

### Apa yang sudah dan belum diuji

| Lapisan | Hasil | Arti dan batas bukti |
|---|---|---|
| Verifikasi source | PASS: 548 tes = 32 repository + 399 runtime + 117 authoring; typecheck, generator dan build lolos | Istilah runtime pada nama suite berarti tes kode/fixture, bukan 399 pengujian di aplikasi Blockbench |
| Kontrak target timeline | PASS pada executor dengan native globals tiruan dalam fixture terisolasi | Target A tidak mengubah properti B yang sedang dipilih; belum membuktikan playback/Undo native |
| Metrik UV baru | PASS pada fixture koordinat | Union area dan bounds benar; tidak memperbaiki packing secara otomatis dan tidak membuktikan 512 muat |
| Panduan reference/pewarnaan | Diperbarui; pemeriksaan kontrak PASS | Belum ada hasil repaint baru yang membuktikan mutu lebih baik atau putaran koreksi lebih sedikit |
| Build terpasang | File plugin baru berhasil disalin | Pemeriksaan live terakhir masih menunjukkan build lama; reload belum terverifikasi |
| Painter, repack, native reopen | BELUM DIUJI untuk perubahan ini | Menunggu build baru aktif dan salinan lift dibuka; bukan alasan menyentuh lift utama |
| Penghematan waktu/usage | BELUM TERBUKTI | Jumlah token dan waktu aktif baseline historis tidak tersedia; tidak ada persentase penghematan yang sah |

### Daftar masalah yang bisa ditindaklanjuti

| ID / prioritas | Masalah dan bukti | Apa yang boros / dampaknya | Sebab dan pemilik | Perbaikan serta status penutupan |
|---|---|---|---|---|
| LIFT-01 / P1 | Jendela dan keterbacaan pintu dikoreksi pengguna setelah hasil awal | Geometry/detail dikerjakan sebelum ketidakcocokan reference diselesaikan | Kegagalan hasil terbukti; kesalahan tool geometry belum terbukti. Pemilik: penalaran Geometry | Landmark/count/bukaan dikaitkan ke view reference sebelum detail. Panduan diubah; kualitas penerapan BELUM DIUJI |
| LIFT-02 / P1 | Permintaan shading lebih bagus sempat ditafsirkan sebagai 4K, lalu pengguna mengoreksi | Pekerjaan resolusi yang tidak diminta serta koreksi balik | Salah memahami kebutuhan, bukan cacat Painter. Pemilik: agen/intake | Better/HD tidak mengubah density, resolusi, atau gaya tanpa instruksi. Aturan diperjelas; tidak mengklaim repaint telah diperbaiki |
| LIFT-03 / P1 | Warna pucat, bidang datar, shadow kurang; tampak pada screenshot aktual | Repaint berulang untuk mencapai hasil yang hanya diterima, belum optimal | Rancangan palette/ramp dan evaluasi visual; kontribusi lighting belum dipisahkan secara terukur. Pemilik: Texturing | Palette/ramp dari reference; bedakan warna atlas dan lighting viewport; uji satu pasangan bidang sebelum propagasi. Perbaikan workflow selesai, kualitas live masih terbuka |
| LIFT-04 / P1 | Garis tebal/ganda dan ramp berulang pada batas Cube | Tambalan lokal tidak menyelesaikan rancangan material sehingga koreksi bertambah | Pemilihan pola/seam oleh agen. Akurasi piksel tool belum terbukti salah | Kontinuitas berdasarkan permukaan; garis hanya pada sambungan yang didukung reference; desain cohort yang salah diganti dari base. BELUM DIUJI secara visual |
| LIFT-05 / P1 | Atlas 1024 memakai 115456 texel (11,01%); bentang 512x516 | 88,99% kanvas tidak dipakai face; belum berarti usage agen naik dengan persentase yang sama | Pilihan ukuran dan packing. Penyebab algoritma native belum terbukti | Metrik occupancy/bounds ditambahkan. Uji native 512 dengan padding pada salinan masih terbuka; bukan janji semua island pasti muat |
| LIFT-06 / P2 | Peringatan native face lebih kecil dari 1 unit pada Box UV | Pemetaan harus dikoreksi setelah tahap berjalan | Kelayakan representasi UV belum disaring cukup awal. Pemilik: Geometry/UV | Preflight sub-unit, per-face UV bila diperlukan; jangan menebalkan geometry hanya untuk menghilangkan warning. Panduan diubah; native test belum selesai |
| LIFT-07 / P2 | Timeline menerima target A tetapi operasi mengenai klip terpilih B | Readback tambahan, kebingungan hasil, dan pengguna perlu memilih klip manual | Cacat kontrak/handler yang terbukti. Pemilik: animation timeline MCP/runtime | Target eksplisit, action select dan receipt UUID ditambahkan; tes executor PASS; native playback/Undo BELUM DIUJI |
| LIFT-08 / P2 | Hasil tool/tes valid tidak menangkap kemiripan yang buruk | Review pengguna menemukan masalah setelah pekerjaan meluas | Celah proof dan evaluasi, bukan bukti seluruh tool tidak akurat | Bedakan tool success, source PASS, visual PASS, persetujuan pengguna, dan efisiensi. Pelaporan diperbaiki; gate visual tetap wajib |
| LIFT-09 / P2 | Discovery/readback diulang dan hasil besar dikirim; satu keluaran animasi terpotong konteks | Konteks dibaca ulang tanpa keputusan baru; pemulihan menambah panggilan | Orkestrasi agen terbukti ikut menyumbang. Payload tool hanya boleh dipangkas bila detail memang tidak diperlukan | Reuse UUID/state/receipt, ringkasan hasil, capture per tahap/cohort. Audit ini tidak membuktikan semua respons MCP boros atau perlu API baru |
| LIFT-10 / P2 | Log riwayat aset/proof pernah bercampur antara pending dan approved; catatan sulit ditemukan pengguna | Pengguna/agen berikutnya harus merekonstruksi status dari percakapan | Kontinuitas dan penyampaian hasil. Pemilik: dokumen proof/next-action | Ringkasan berbahasa Indonesia dan ID issue ditambahkan di dokumen kanonis ini; next-action menunjuk langsung ke laporan |

### Pemborosan selama implementasi perbaikan ini sendiri

Ini termasuk tanggung jawab agen, bukan dibebankan seluruhnya ke tool:

- **Fixture registrasi global:** tes baru sempat mendaftarkan tool pada proses suite bersama dan menyebabkan kegagalan berantai yang tidak berasal dari produk. Diperbaiki dengan subprocess terisolasi. Pelajaran: cocokkan lifecycle fixture dengan registry sebelum full-suite.
- **Panduan melewati batas panjang:** beberapa putaran pemangkasan diperlukan setelah menambah instruksi. Sebagian instruksi lama sudah memuat larangan yang relevan. Pelajaran: ukur panjang seluruh owner terdampak sekali dan ganti bagian berulang sebelum menjalankan suite.
- **Assertion kalimat persis:** pemadatan panduan memicu kegagalan tes pada wording, termasuk heading dan frasa lengkap. Assertion terdampak diperbarui; ini perawatan tes semantik, bukan bukti kualitas gambar. Pelajaran: periksa closure tes terkait sebelum mengubah prose; uji perilaku untuk bug perilaku.
- **Full verifier diulang terlalu dini:** beberapa kali verifikasi menyeluruh dijalankan sebelum seluruh kegagalan targeted authoring diselesaikan. Ini biaya implementasi yang dapat dihindari. Urutan berikutnya: kumpulkan semua kegagalan relevan → perbaiki owner → targeted PASS → final verifier sekali, kecuali ada perubahan/failure baru.
- **Kesalahan pemanggilan:** ada patch multi-hunk yang urutannya tidak sesuai source dan pencarian `rg` dengan wildcard path Windows yang gagal. Tidak menunjukkan bug authoring. Gunakan konteks patch berurutan serta pencarian direktori dengan filter glob yang benar.
- **Permintaan bantuan UI:** reload plugin/open-existing-project belum tersedia melalui Gateway yang dipakai. Ini gap kemampuan untuk acceptance, bukan bug warna/geometry. Jangan mencari berulang atau menyamakan copy file dengan proyek native yang sudah dibuka.

Jumlah menit/token per kejadian di atas belum dihitung; tidak ada angka biaya yang direkayasa. Log verifier sementara tersedia di `.cache/lift-authoring-audit/`; bukti dan status kanonis tetap di dokumen ini.

### Syarat masalah boleh ditutup

1. Build live sama dengan kandidat terpasang dan proyek aktif adalah salinan, bukan lift utama.
2. Timeline A/B, Painter RGBA/koordinat/clip/target, repacking/preservasi piksel dan Undo, serta simpan/buka ulang diuji native sesuai pemiliknya.
3. Pasangan fasad–kiri dibandingkan dengan reference pada view/skala sebanding; kualitas harus lolos sebelum menyebut penghematan biaya menuju hasil diterima.
4. Catat waktu aktif, putaran koreksi, gagal/tanpa efek, readback tak perlu dan usage jika tersedia. Perbandingan harus memakai fixture serta gate kualitas yang sama.

**Tidak ada klaim semua issue sudah fixed.** Source fix timeline dan metrik UV siap diuji live; mutu texturing, kelayakan packing minimum, dan efisiensi akhir masih merupakan pekerjaan terbuka.

## Current Proof Boundary

### DIRECT lift system repair — 2026-09-06

Scope: system first, disposable copy only; completion boundary Blockbench. User approved lift Geometry/Texture/Animation but explicitly considers texture fidelity imperfect. Acceptance is not proof of exact visual equivalence.

Source authority: Local base 7723b9e857ca22d491fa23dc75a9f5f4b8fe067a plus this working diff. Initial live runtime sha256:ed62edfdf0e0674fc4808b9f84d30253608f2b1f1e1922e7e3457a454977046c. Installed verified candidate: sha256:e5f70645919f989d071ece5ceccc021d09a4ba20ac2cedac589c1b824fe5acb9; reload/live identity not yet verified.

PASS — `bun run verify:full`: 32 repository, 399 runtime and 117 authoring tests; typechecks, generated docs/prompt freshness, surface measurements and build. New runtime-executor regression covers explicit A vs selected B, selected-state separation for property edits, select/time/play and invalid target before side effects. UV regression covers union area, exact reuse, partial overlap, clipping, reversed/fractional coordinates and empty layouts. These tests do not prove native playback, paint quality or cost reduction.

Baseline fixture: 40 Cubes / 240 faces, 1024x1024, 16x, unique occupied area 115456 = 11.0107%, bounds 512x516. 256x256 cannot hold that unique area; 512x512 feasibility with padding remains unproven. Main model SHA256: 2B86BFF2A202355CDF3822DFD3A754081AEDD361C7C6C163BDC91ECEC8DF12F1. Copy: `.cache/lift-authoring-audit/lift-audit.bbmodel`.

| Symptom / evidence | Classification / first owner | Repair / acceptance | Status |
|---|---|---|---|
| User corrected window dimensions and door visibility | AGENT_REASONING / Geometry; no proved geometry-tool bug | Strict landmark/view agreement before detail | Workflow updated; live quality BELUM DIUJI |
| Better shading request became 4K | AGENT_REASONING / intake | Better/HD never silently changes density/resolution/style | Workflow PASS; historical failure recorded |
| Pale materials, thick seams and repeated per-Cube ramps in user screenshots | Styling/visual feedback; Painter accuracy UNKNOWN | Reference palette/form, adjoining pair first, surface continuity, cohort redesign instead of overlays | Workflow updated; visual/cost improvement BELUM DIUJI |
| Native sub-unit Box UV warning | Geometry/UV representation | Preflight collapse; per-face mapping instead of unjustified thickening | Workflow updated; native fixture BELUM DIUJI |
| 11.01% occupied 1K atlas | UV sizing/packing; native packer fault not proven | Union/bounds metrics; smallest proven native layout at same density and padding | Metrics source PASS; 512 fit BELUM DIUJI |
| Timeline request names A but modifies selected B | MCP_PUBLIC_CONTRACT + animation runtime owner | Explicit target resolution; select operation; affected UUID receipt | Source regression PASS; native test BELUM DIUJI |
| Tests pass despite visual failure | PROOF_FAILURE | Separate behavior, visual acceptance and efficiency proof | Corrected reporting; no automatic visual PASS |
| Repeated correction/readback and oversized output in conversation | AGENT_REASONING; exact historical usage UNKNOWN | Reuse receipts, bounded evidence, STOP after two unchanged causal attempts | Guidance updated; measured savings BELUM DIUJI |

Test-harness issues during this repair: direct registration polluted suite-global lazy catalog; isolated native executor fixture in a subprocess. Shorter equivalent guidance exposed brittle sentence assertions; affected semantic tests were updated without raising footprint ceilings. Final verify:full PASS above supersedes intermediate failures. Logs remain in `.cache/lift-authoring-audit/` and are not separate canonical proof records.

Pending live: reload candidate, identify disposable project, Painter RGBA/coordinates/clipping/target/Undo, native UV repack + per-face pixel comparison, native save/reopen, paired quality/cost evidence. Original approved asset must stay unchanged. No Minecraft, GPU, PBR or full-catalog testing.

```text
BEDROCK SOURCE CALLABLE CATALOG:       52 tools; last installed proof covers 51
SHARED AUTHORING SURFACE:              SOURCE 47; BASIC LIVE PASS covers earlier 46 tools
ANIMATION SURFACE:                     BASIC HANDOFF LIVE PASS — 19 tools
GATEWAY CLIENT SURFACE:                4 fixed tools — SOURCE + SAME-TASK LIVE
AUTHORING TAXONOMY:                    user-selected DIRECT | 3D_ASSISTED — SOURCE/STATIC
MCP RESOURCE/PROMPT CONTRACT:          UPDATED / GENERATORS + REGRESSIONS PASS
DIRECT AUTHORING:                      DISPOSABLE BASIC LIVE PASS / ASSET QUALITY UNVERIFIED
3D_ASSISTED EXTERNAL ORCHESTRATOR:     SOURCE_READY / ENVIRONMENT PREFLIGHT PASS / GPU NOT_RUN
3D_ASSISTED MATERIALIZER + BINDING:     SOURCE_READY / NATIVE LIVE PROOF DEFERRED
GATEWAY LIVE STABILITY:                BASIC PASS — reconnect after restart + phase catalog refresh
REMOTE MCP VERIFY:                     GREEN @ 071d0bb / SOURCE CI ONLY
CURRENT MODEL-QUALITY CLAIM:           NONE
```

Geometry and Texturing keep separate semantic ownership, but their Runtime capabilities are no longer mutually hidden. Geometry↔Texturing correction stays in the same AUTHORING session. `HANDOFF_REQUIRED` is for AUTHORING↔Animation.

## Source / Static Proof

Current source owns:

- fixed four-tool Gateway and a shared Geometry+Texturing AUTHORING Runtime surface;
- explicit user-selected `DIRECT | 3D_ASSISTED` with no automatic fallback;
- semantic stage ownership while allowing bounded upstream Geometry/UV correction during Texturing without a phase bounce;
- one resumable external 3D-Assisted orchestrator using canonical Active Workspace paths;
- pinned Hunyuan3D v1 and PrimitiveAnything provenance, strict state/decomposition schemas, SHA-256 stale detection, and explicit Shape/Decomposition gates;
- an internal Blockbench materializer engine that prevalidates canonical workspace state before one Group+Cube Undo transaction and cancels on failure.

Resource/Prompt/handoff closure is implemented with canonical `prompts:build` and `docs:build` output. Internal PASS remains READY_FOR_USER_REVIEW; Animation readiness requires explicit approval fields and a saved checkpoint. `materialize_3d_assisted_scaffold` is registered in source as a Geometry-owned Elements ToolSpec with only absolute `workspace_path`, behind the existing four-tool Gateway.

## 3D-Assisted Preparation — 2026-09-06

Based on Local `1013cd1f0a96dcaf3c2a326c7a95ae59ec98bd23`; this preparation does not deploy or replace the installed plugin.

- `bun run three-d-assisted:run -- preflight`: PASS. Both backend imports, pinned source, weights/data integrity and CUDA visibility checked; no inference or asset-state writes.
- Hunyuan: Windows Python 3.12 venv at `Experimental/three-d-assisted-hunyuan-poc/.cache/venv`, PyTorch `2.5.1+cu124`; pinned Hunyuan3D-2 source, MultiView model and u2net installed under sibling cache directories. MultiView config/weights match pinned Git/LFS identities; hashes are retained in `environment.py`.
- PrimitiveAnything: WSL2 Ubuntu, `/opt/miniforge3/envs/blockit-pa-poc`, PyTorch 2.1.0 CUDA; source/data/checkpoints under `Experimental/primitiveanything-poc/.cache/PrimitiveAnything`. Both checkpoint SHA-256 values match setup pins. Download cache moved outside the clean upstream checkout.
- RTX 3070 8 GB is visible in both backends. WSL's NAT warning did not prevent setup/download/preflight; no network configuration was changed. Peak inference memory remains unproven.
- Targeted source regressions pass for binding/receipt, rejection before Undo, controlled partial-failure cancellation, resume/invalidation, and missing dependencies before state initialization. These do not prove native Undo or actual asset quality.
- Canonical prompt/API outputs regenerated. Final `bun run verify:full`: PASS on this Local delivery (Bun 1.3.11): repository 32/32, runtime 396/396, authoring 117/117, generated freshness, typechecks, source surface measurements and build. Log: `mcp/.cache/three-d-assisted-verify-full.log`. New built identity: `sha256:8865d0c3fd65849e7957a512b53efe47563c3116782d3e863e11d98b794a6289`; not deployed. The earlier desktop closure below remains historical proof only.

Stop at preparation. GPU inference, deployment, native materializer Undo/stale-state proof and asset approval are user-deferred. Commands and environment paths are owned by `mcp/scripts/three-d-assisted/README.md`.

## Local Source and Desktop Closure — 2026-09-06

Repository: `halokaryamedia-source/BuildIT`, branch `Local`, delivery based on `88331a96973c8c36849f8b15b689ab9a1ed0439a`. Bun **1.3.11**, installed Blockbench **5.1.6**. This section describes the local delivery, not the older remote CI SHA below.

- Frozen-lockfile install, canonical generators, Geometry/UV regressions, and final `bun run verify:full`: PASS. Tests cover async template completion/error/cancellation/audit rollback, retained redo history, meaningful collapsed UV, complete discovery schemas, approval requirements, and native numeric-slider mutation.
- No user project was open before cleanup. No old checkout build/dependency/cache directories existed initially. Removed only legacy `mcp.js`, `mcp.about.md`, `mcp.icon.svg` from the verified Blockbench plugin directory; no legacy registry entry was loaded. Other plugins/settings/assets/credentials were retained.
- Canonical installed path: `C:/Users/Administrator/AppData/Roaming/Blockbench/plugins/blockit_mcp.js`; its registration was aligned from checkout `dist` to this path. Deployment byte comparison and runtime `build_identity` match: `sha256:ed62edfdf0e0674fc4808b9f84d30253608f2b1f1e1922e7e3457a454977046c`.
- `bun run verify:stateless-local`: **12/12 PASS**. Gateway survives Blockbench restart in the same task and refreshes its catalog; final AUTHORING catalog is 46 tools. Texturing focus retained Geometry capabilities with `surface_changed=false`; Animation exposed 19 tools and returned to Geometry without a new task. Missing Animation readiness was rejected. Positive handoff used clearly labeled synthetic disposable-test readiness, never asset approval.
- `bun run scripts/verify-template-live.ts --confirm-disposable`: PASS. Native density 32 gives 2 bitmap pixels/UV unit; rebuild density 16 gives 1. Brush sizes 1/2 change exactly 1/4 decoded pixels. Brush and rebuild Undo/Redo restore full atlas hashes; rebuild retains UUID and one atlas. Editable disposable checkpoint export was verified. Python/Pillow was used only for decoded-pixel comparison.
- `bun run verify:surface-gap-live -- --confirm-disposable`: PASS. Open 0.5-unit gap warns; contact or complete coverage clears warning; hidden cover restores warning.

Cancellation/error restoration has local controlled regression proof; live successful template/rebuild/brush Undo has native desktop proof. Interactive cancellation, long-running lifecycle endurance, real-asset persistence/visual quality and 3D-assisted execution are not claimed. Disposable fixtures under `mcp/.cache/template-live/` are development artifacts, not Active Workspace assets.

## Static Verification State

GitHub **MCP Verify** run `33992971202` completed successfully for exact `Local` commit `071d0bb41c8103f8a58fafc16bd0440788b66f47` and executed `bun run verify:mcp`. This is REMOTE_GITHUB source/build/generated-freshness evidence, not local execution or installed-plugin proof. This record does not establish a completed exact `verify:full` or a same-SHA full composite.

Device-independent acceptance follows `GITHUB_RULES.md`: accept an exact successful full source gate from CI or a capable development workspace; do not mandate a duplicate local `verify:full`. The gate may use `verify:repository` + `verify:mcp` on the same exact `Local` SHA, reported as composite source evidence. Static/CI success still cannot prove live Blockbench behavior or visual fidelity.

## What Is Not Yet Proven

Static source/CI does not prove:

- long-running Gateway lifecycle endurance beyond the tested restart/handoffs;
- final geometry surface/gap quality or semantic-cohort correctness;
- final UV layout quality, texel density, orientation, seams, or mapped styling;
- Hunyuan Shape GLB quality on a selected asset;
- PrimitiveAnything decomposition quality on a selected asset;
- installed availability of the new source-registered materializer binding;
- materializer native Undo/stale-state behavior inside desktop Blockbench.

## 3D-Assisted Proof Model

```text
Approved Reference + Requested Dimensions
→ deterministic LEFT/FRONT/BACK extraction
→ Hunyuan3D v1 → Shape GLB Gate → shape.glb
→ PrimitiveAnything → Primitive Decomposition Gate
→ primitive-decomposition.json + state.json
→ atomic Cuboid Materialization
→ Cuboid Materialization Gate
→ Semantic Geometry Cleanup
→ final Geometry verification
```

Approved image remains visual authority; requested dimensions remain numeric authority. `shape.glb`, decomposition, and Cuboid scaffold are intermediate evidence/starting state only.

## Visual / Reference Proof Rule

A visual/reference `PASS` requires the actual approved reference image plus fresh evidence from the current model/revision. Tool success, source/CI success, hashes, coordinates, export, GLB/decomposition existence, scalar scores, or a clean positive-volume overlap audit cannot create visual PASS by themselves.

If evidence is unavailable, use `UNVERIFIED` or `LOCAL PROOF REQUIRED`.

## Authoring Efficiency

**Authoring Efficiency** means **Cost to Accepted Result**. Static Footprint/raw call count are guardrails only; quality must stay accepted while avoidable discovery, readback, phase bouncing, retry, recovery, or correction cost decreases.

## Active Asset Proof

No active asset project exists under `workspace/active/`. Historical Industrial Elevator evidence is not current active-asset proof and must not be resumed automatically.

## Current Local Gate

```text
exact Local
→ accepted exact full source gate (CI or capable workspace; see GITHUB_RULES.md)
→ deploy exact plugin
→ prove shared AUTHORING + AUTHORING↔Animation Gateway lifecycle
→ DIRECT smoke: Geometry APPROVED → UV Layout PASS → Texture APPROVED → Finalization
→ 3D_ASSISTED setup + public binding + generated/source checks
→ STOP ready-to-test while user defers GPU/live work
→ later external 3D_ASSISTED GPU proof
→ deploy matching materializer binding
→ live atomic materializer proof
→ end-to-end 3D_ASSISTED
```
