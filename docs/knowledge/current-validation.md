# Current Validation

Updated: 2026-09-07

This file owns **current proof interpretation**. Continuation belongs in `docs/knowledge/next-action.md`; stable facts in `CONTEXT.md`; source ownership in `docs/knowledge/implementation-map.md`; active asset continuity in `workspace/active/<project>/README.md`.

## Current Source Proof

Repository: `halokaryamedia-source/BuildIT`  
Branch: **`Local` only**.

Per `GITHUB_RULES.md`, device-independent source acceptance must use complete checks on the same exact `Local` SHA. The last full Repository Verify + MCP Verify composite closure remains `1c1f74e160ce520d53fda3a3f271d9323b28558b`.

GitHub **Repository Verify** run `34046872083` completed successfully for that exact SHA and executed the repository routing/policy verifier.

GitHub **MCP Verify** run `34046872042` completed successfully for the same exact SHA and executed `bun run verify:mcp`:

- runtime: **409 PASS / 0 FAIL** across 69 files;
- authoring: **120 PASS / 0 FAIL** across 26 files;
- generated docs/prompt freshness: PASS;
- TypeScript + Gateway typecheck: PASS;
- source surface measurements: PASS;
- build: PASS;
- build identity: `sha256:c208ec49344db79fa22e1cddd330e563f14319d4ed0c724408ee0ba0a01c969c`.

The same MCP run also produced exact-SHA provenance and uploaded `blockit-mcp-verified`:

- artifact ID: `9993371261`;
- artifact ZIP digest: `sha256:70cb1d126fe2bc9077d64b332f6d4e2715b6b14a93fe696b3493e776a0626fe3`;
- verified bundle SHA-256: `9896b8c25e293b7f33dc2ebf3119942809ec4df548839f4ac753366bc8521f87`;
- embedded build identity: `sha256:c208ec49344db79fa22e1cddd330e563f14319d4ed0c724408ee0ba0a01c969c`.

### Authoring-efficiency / Gateway REMOTE_GITHUB closure — ACCEPTED

The current authoring-efficiency GitHub partition is accepted at exact source SHA `f3f7f8062d8e2cfafe79a273443dee2ab2f2a145`.

GitHub **MCP Verify** run `34084250543` completed successfully on that exact SHA and executed `bun run verify:mcp`, including generated freshness, TypeScript + Gateway typecheck, runtime tests, `verify:authoring`, surface/phase measurements, and build. The run also completed exact-SHA provenance and verified bundle upload.

Verified artifact:

- name: `blockit-mcp-verified`;
- artifact ID: `10004673848`;
- artifact ZIP digest: `sha256:2adf4fa0f747fa1dd390b7bdeb2135403fda4e61d0023e2829d32fba6e43ac13`;
- verified bundle SHA-256: `46c821431ead51618fa7ef5fa3fe385e510fc344fa70e71c10413030473e355b`;
- embedded build identity: `sha256:8213f7e2e8bd6360d918394fa0ba7f9cdc96ec036ad38b58a4bfff4c78c49f41`;
- Bun: `1.3.14`.

This closure covers the current remote authoring-efficiency changes: compact Gateway continuation receipts for `manage_cubes`; bounded Gateway discovery default `4`; compact Gateway describe behavior and tools-only boundary; asset-authoring cwd/test-development firewall; and compact Texturing palette/cohort/anti-micro-loop guidance. It is **SOURCE/CI/build-artifact proof only**. It does not prove actual Astra/Codex allowance reduction, installed Runtime behavior, or visual texture quality.

The remaining proposed high-ROI Texturing optimizations alter Runtime Tool schemas/results and therefore require canonical `LOCAL_CODE` generation/verification before they can become source authority. Continuation owns that residue.

## Live Acceptance Harness — SOURCE_READY / LIVE NOT_RUN

The GitHub-prepared harness moves test design, fixtures, assertions and evidence capture out of the later desktop session. The product target is generic BlockIT MCP/authoring behavior; any named model is only test media unless a task explicitly targets that asset.

### Shared preflight

`mcp/scripts/live-e2e-common.ts` requires:
- exact built-vs-live `build_identity`;
- expected authoring phase and required live `tools/list` surface;
- stateless JSON transport;
- explicit `--confirm-disposable`;
- observable HTTP/RPC/tool/cost counters. These byte counts are transport measurements, not model-token counts.

### Geometry + UV representation

`verify:geometry-live` now uses the current consolidated `manage_cubes` + `inspect_elements` surface. It creates one disposable body, proves readback/render/update/Undo/Redo, and creates a generic thin fixture `1 x 4 x 0.5` with explicit `per_face` UV. The thin fixture must keep exact geometry size and non-degenerate per-face UV; no geometry thickening is allowed merely to silence UV warnings.

### Texturing / native repack / Painter

`verify:texturing-live` continues the **same shared AUTHORING session**; there is no Geometry→Texturing phase bounce. It is scripted to prove:

- native template at 16x;
- padded native in-place repack with same texture UUID;
- semantic RGBA pixel preservation across repack;
- thin per-face fixture survives template/repack/Undo/Redo without geometry thickening or meaningful-face collapse;
- explicit target mutation while a decoy texture is selected;
- size-2 request uses native Painter, not the size-1 exact-pixel shortcut;
- bounded `draw_shape_tool` does not bleed outside its reported clip;
- atlas + UV state restore exactly through Undo/Redo;
- final UV production gate remains ready.

These are native-behavior acceptance assertions; they are not texture visual-fidelity claims.

### Animation

`verify:animation-live` prepares two animations so B is selected while operations explicitly target A. It is scripted to prove:

- persistent Animation-A property edit does not mutate/select B;
- targeted set-time/play/pause/stop acts on A;
- targeted A keyframe edit leaves B unchanged;
- property and keyframe Undo/Redo restore exact expected state.

This closes the manual-selection workaround at the test level once the live run passes; motion aesthetics remain separate.

### Native persistence

`verify:persistence-live` is intentionally two-step rather than inventing an open-project fallback.

1. `--prepare`: snapshot body, thin per-face UV, texture/UV gate and both animation states; export a verified disposable `.bbmodel`; hash artifact + write manifest.
2. One manual Blockbench close/reopen of that exact file.
3. `--verify`: require matching build, artifact hash, native `save_path` and exact authored snapshot.

Until step 3 succeeds, native reopen remains UNVERIFIED.

### Representative visual-quality fixture — current example: LIFT

LIFT is **only a representative fixture** for validating the visual-quality/evidence workflow and historical issue closure. It is not a product target and must not create LIFT-specific MCP Runtime, tool schema, routing, packing law, geometry rule, or authoring policy.

`verify:lift-quality-live` remains a bounded **fixture-specific evidence candidate**, not a visual scorer and not a generic MCP acceptance prerequisite.

- requires `BLOCKIT_LIFT_DISPOSABLE_PATH` and rejects canonical `workspace/active/lift/lift.bbmodel`;
- hashes `references/approved-reference.png` and `references/window-detail.png`;
- captures before front/left/front-left-3Q + atlas;
- performs one native 16x, padded, power-of-two in-place repack candidate on the disposable copy;
- records candidate bitmap size and whether native result is `<=512`;
- captures candidate views + atlas;
- Undo must restore the exact original atlas hash and UV packing/gate;
- writes a manifest under `.cache/lift-quality-live/`;
- emits `visual_quality: UNVERIFIED`.

A `<=512` result is only a packing candidate. It cannot become visual PASS without the actual reference plus fresh mapped visual evidence.

## Historical LIFT Issue Mapping — fixture evidence only

`workspace/active/lift/README.md` remains the asset owner. Geometry, UV Layout, Texture and Animation are approved/delivered; any quality-system testing uses a disposable copy. The table below preserves traceability for the historical test report; it is **not** the generic MCP roadmap or acceptance checklist.

| ID | GitHub-prepared closure | Remaining proof |
|---|---|---|
| LIFT-01 | Reference-grounded workflow + representative before/candidate comparable capture are scripted | actual-reference visual review on the fixture |
| LIFT-02 | Better/HD intake rule source-protected | no source defect remains |
| LIFT-03 | palette/ramp + adjoining-surface discipline protected; fixture capture bundle prepared | live visual color/form/shadow review on the fixture |
| LIFT-04 | surface-continuity/seam discipline protected; same evidence bundle prepared | live visual seam review on the fixture |
| LIFT-05 | union/bounds metrics + native padded-repack candidate harness prepared | run representative candidate; `<=512` alone is not visual PASS |
| LIFT-06 | generic thin sub-unit per-face fixture scripted through native template/repack/history/persistence | live generic run |
| LIFT-07 | explicit A-vs-selected-B + playback/property/keyframe history harness prepared | live generic run |
| LIFT-08 | proof vocabulary remains fail-closed | visual gate stays mandatory |
| LIFT-09 | every live harness emits comparable execution-cost counters | comparable-fixture Cost to Accepted Result after quality PASS |
| LIFT-10 | proof/continuation route to executable test commands | keep future status in canonical owners |

No additional speculative Runtime logic is justified unless a generic live verifier or representative fixture reproduces a concrete MCP/source defect.

## SDK Security Follow-up

Current `mcp/bun.lock` resolves `@modelcontextprotocol/sdk` **1.25.3**. `GHSA-345p-7cg4-v4c7` / `CVE-2026-25536` is patched in 1.26.0.

BlockIT currently uses request-owned server/transport objects and has exact-SHA CI regression for concurrent same-ID request isolation. That mitigation evidence does **not** make the dependency version patched.

Dependency closure remains `LOCAL_CODE`: upgrade to a patched compatible SDK, regenerate canonical `bun.lock` with Bun, then run the owning source verifier. Do not hand-edit the lockfile and do not use Actions as an authoring path.

## Pending Live Sequence

After the SDK/local source closure and exact deployment, the generic MCP/native acceptance sequence is:

```text
shared AUTHORING
→ verify:geometry-live
→ verify:texturing-live
→ one real AUTHORING→Animation handoff/reconnect
→ verify:animation-live
→ verify:persistence-live --prepare
→ one native close/reopen
→ verify:persistence-live --verify
```

Only when validating the visual-quality/efficiency workflow or the historical LIFT issue report, append the representative-fixture step:

```text
disposable LIFT fixture → verify:lift-quality-live
→ human/multimodal strict visual review
→ only then comparable-fixture efficiency analysis
```

This intentionally removes redundant Geometry↔Texturing reloads and manual test design while keeping fixture-specific evidence outside generic product semantics.

## Visual / Reference Proof Rule

A visual/reference `PASS` requires the **actual approved reference image** plus **fresh evidence** from the current model/revision at a comparable view/scale. Tool success, source/CI success, hashes, coordinates, export, scalar metrics, UV occupancy, native repack success, or a clean structural diagnostic cannot create visual PASS by themselves.

If corresponding live evidence is unavailable, report `UNVERIFIED` or `LOCAL PROOF REQUIRED`.

## Authoring Efficiency

**Authoring Efficiency** means **Cost to Accepted Result**. Static Footprint, raw call count and transport bytes are guardrails only. Efficiency improves only when accepted quality is preserved while avoidable discovery, readback, phase bouncing, retries, recovery or correction cost decreases on a comparable fixture.

## 3D-Assisted Proof Boundary

AUTHORING TAXONOMY remains user-selected `DIRECT | 3D_ASSISTED`. 3D_ASSISTED source/orchestration and environment preparation remain `SOURCE_READY`; GPU inference quality, installed materializer identity, native materializer Undo/stale-state behavior and end-to-end asset quality remain deferred unless explicitly resumed. Source/static/CI proof never upgrades those live claims.
## Notes dari penggunaan — audit authoring multi-model 2026-09-07

### Status, otoritas, dan batas audit

**Ini catatan penggunaan dan usulan rencana perbaikan, bukan perubahan kebijakan atau bukti bahwa perbaikannya telah dilaksanakan.** Pengguna meminta pemetaan mendetail untuk dikerjakan kemudian. Jangan otomatis mengaktifkan seluruh daftar sebagai pekerjaan implementasi. Pilih satu paket dengan bukti dan acceptance yang sesuai ketika pengguna melanjutkan.

- Target dokumentasi: repository `halokaryamedia-source/BuildIT`, branch **Local**.
- Source yang diaudit: `360cfbcf4fddc55cee572763fe3a19a4ee5fa6ca` (Local saat audit).
- Baseline artefak penggunaan: tag **v1.0.0**, commit `1c32f7071dec24fc9201b933e5ccba7518630571`, branch `stable-version-1.0`. Model tidak disalin kembali ke Local dan tidak dimutasi dalam audit ini.
- Sesi authoring sebelumnya memakai checkout source dasar `af4ecf5c7641b0b9ba122bf27d5e382cce6e9488`; identitas Runtime yang terlihat pada sesi papan adalah `sha256:e5f70645919f989d071ece5ceccc021d09a4ba20ac2cedac589c1b824fe5acb9`. Ini **bukan** pembuktian Runtime cocok dengan Local terbaru.
- Konteks audit kode: **LOCAL_CODE** untuk membaca source/artefak dan menulis dokumentasi. Tidak deploy, tidak menjalankan authoring ulang, tidak menutup bukti LIVE yang masih tertunda.
- Cakupan menyeluruh di sini adalah jalur penggunaan DIRECT yang dialami: intake/reference, geometry/rig, UV, paint/variants, motion/effects, feedback/state, persistence/export, discovery/result volume, approval dan proof. Ini bukan klaim setiap baris repository, keamanan dependency, 3D_ASSISTED/GPU, atau Minecraft engine telah diaudit.
- Untuk model lama, sebagian bukti berupa keluhan/screenshot pengguna dan README hasil; urutan tool lengkap tidak tersedia. Jangan mengubah keluhan visual menjadi tuduhan bug implementasi tanpa reproduksi.
- Total token, uang, allowance, durasi aktif tiap model, dan penghematan historis: **UNKNOWN**. Tidak ada persentase penghematan yang dibuktikan. Byte/pixel/call count hanya ukuran perantara.

**Kontrak audit:** tujuan = petakan sebab kualitas/akurasi rendah dan cost-to-accepted-result tinggi; sukses = setiap temuan punya bukti, status, first owner, perbaikan terbatas, serta uji penutupan; non-goal = memperkecil schema/tool list secara membabi buta, mengubah model disetujui, memperbaiki source sekarang, membuat universal quality scorer; STOP = catatan dan pointer rencana tersimpan di Local serta diverifikasi.

Label bukti:
- **OBSERVED_SESSION**: hasil tool atau screenshot yang benar-benar tampak di percakapan.
- **ARTIFACT_CONFIRMED**: kondisi file snapshot v1.0.0 dibaca dalam audit ini.
- **SOURCE_CONFIRMED**: mekanisme source Local ditemukan; tidak otomatis membuktikan efek live.
- **HYPOTHESIS**: penyebab masuk akal, masih memerlukan reproduksi.
- **SOURCE_ADDRESSED / LIVE_UNVERIFIED**: Local sudah mengandung perbaikan; jangan implementasikan ulang.
- Prioritas P0 = menjaga akurasi/integritas atau menghindari regression/rework besar; P1 = mengurangi loop dan biaya setelah kualitas terlindungi; P2 = ergonomi/pengukuran lanjutan. Bukan severity keamanan.

### Peta kasus penggunaan

| Kasus | Bukti masalah dari penggunaan | Batas kesimpulan |
|---|---|---|
| Kopi | Gerak daun diminta tidak serentak, lebih seperti angin | Keluhan motion; penyebab keyframe/Molang lama belum direproduksi |
| Tandan sawit | Detail sub-unit diminta dihapus; UV berantakan dan bagian kayu menonjol; jatuh/rolling berbeda tinggi perlu kontak tanah | Masalah visual/parameter disebut pengguna; tidak tersedia log lengkap untuk menyatakan rumus akhir salah |
| NPC pebisnis | Belakang bolong, wajah/alis tidak simetris, dada kurang jelas, rambut seperti pola kain; idle kurang badan/kaki; pose kemudian direvisi menyilang | Pisahkan cacat awal dari perubahan scope yang sah (kaki menyilang) |
| Lori | Beberapa putaran gradasi; interior, bawah sasis, dan plafon atap tertinggal | Bukti coverage visual tidak lengkap, bukan semata kurang resolusi |
| Pickup kandang | Koreksi z-fighting diikuti hilangnya panel/celah; depan tidak relevan; pintu tampak lepas; engsel baru tidak senada | Bug runtime penyebab lubang belum terbukti; rig/contact dan style correction terlambat |
| Kompresor | Gradasi/detail kurang; pengguna menghapus bagian dan meminta jangan dikembalikan | Geometri hasil edit pengguna adalah otoritas terbaru |
| Perahu meriam | Belang luar/dalam, kayu/meriam kurang detail; float kurang terasa; recoil perlu menggerakkan perahu; asap ditambahkan | Asap dan tambahan recoil merupakan perluasan kebutuhan, bukan semua kegagalan implementasi |
| Papan stasiun | Atlas 256 menjadi 512, varian gagal dibuat dua kali, gradasi masih datar; kemudian diperbaiki | Tool trace lebih lengkap; detail di bawah |
| Bangku | Resize 48 ke 32 unit mengubah UV lima papan dan posisi baut; tiga locator harus dirapatkan | Bukti langsung coupling geometri–UV–pixel; resize sendiri permintaan baru yang sah |

### Temuan detail dan first owner

#### USAGE-01 — Styling terlalu bergantung pada formula per-face (P0)

**Bukti:** OBSERVED_SESSION. Papan awal memiliki gradasi numerik, tetapi pengguna tetap melihat fill datar. Formula sine/linear per muka juga dipakai pada bangku; variasi hue/value bukan otomatis detail material. Keluhan serupa berulang pada kendaraan, perahu dan kompresor.

**Klasifikasi/owner pertama:** AGENT_REASONING; specialist Texturing. Bukan bukti Painter gagal. Local telah memperkuat palette/cohort/anti-micro-loop; kepatuhan dan hasilnya masih perlu dibuktikan.

**Dampak:** repaint besar, pengguna harus mengartikan “kurang bagus” berulang, detail tampak seperti template atau garis dekorasi acak. Menambah resolusi atau jumlah warna saja memperbesar kerja tanpa menjamin kualitas.

**Rencana:** sebelum paint, tetapkan per material base/shadow/highlight/identity, arah permukaan, skala detail, sumber bayangan kontak. Buat satu pasangan muka representatif sebagai bukti sebelum menerapkan seluruh cohort. Gradasi harus mendukung bentuk, bukan otomatis diulang dari awal setiap UV island. Batasi noise dan banding; jangan menyamakan tekstur kayu/rambut/kain.

**Acceptance:** satu fixture kayu, cat bodi, dan baja; referensi + view yang sebanding; identitas material dan sambungan diterima sebelum memperluas pass. Ukur putaran koreksi hingga diterima, bukan banyaknya warna.

#### USAGE-02 — Coverage pemeriksaan tidak lengkap; user menjadi QA terakhir (P0)

**Bukti:** OBSERVED_SESSION berupa keluhan bawah lori, plafon dalam atap, belakang NPC, dan interior perahu. Pernyataan “sudah diperiksa” beberapa kali mendahului temuan pengguna berikutnya.

**Owner:** AGENT_REASONING / PROOF_FAILURE / VISUAL_FEEDBACK. Capture tool yang menghasilkan gambar bukan verdict visual.

**Rencana:** dalam brief aset yang sudah ada, tentukan permukaan wajib dilihat: sisi luar, bukaan, belakang, bawah, interior yang tertutup dari kamera umum. Untuk cacat lokal pakai view terdampak saja; pada completion, pastikan seluruh permukaan material yang diminta pernah mendapat bukti pada revisi relevan. Jangan memotret semua sisi setelah setiap stroke.

**Acceptance:** fixture berisi plafon, belakang kursi, dan bawah bodi yang sengaja diberi cacat; review harus menemukan semuanya sebelum user approval. Hindari universal skor visual atau tes pixel yang hanya mencerminkan formula paint.

#### USAGE-03 — Koreksi geometri lokal merusak hubungan assembly (P0)

**Bukti:** OBSERVED_SESSION pada pickup: setelah upaya menghilangkan z-fighting, pengguna menunjukkan sasis/bodi hilang, beberapa kali celah depan/pintu. **HYPOTHESIS** penyebab: menghapus/menggeser cube terpisah tanpa mempertahankan batas bersama, coverage dan ketebalan shell. Belum terbukti bahwa tool remove/update salah.

**Owner pertama:** Geometry reasoning; `mcp/server/tools/cubes.ts` hanya jika input benar menghasilkan runtime state salah.

**Rencana:** sebelum koreksi, catat batas bersama dan komponen yang wajib tetap menutup shell. Klasifikasikan defect: coplanar overlap, gap, salah depth, atau missing mass. Perbaiki cohort yang berbagi sambungan, gunakan Group untuk perpindahan rigid bersama. Setelah edit, periksa view cacat dan satu sisi yang berpotensi terkena regression.

**Acceptance:** fixture apron–pintu–cowl dan lantai–dinding. Hilangkan overlap tanpa membuka gap, mempertahankan material dan jumlah bukaan sengaja; Undo/Redo mengembalikan geometri lengkap. Positive-volume overlap ataupun zero-overlap tidak cukup sebagai PASS.

#### USAGE-04 — Resize terhubung diam-diam dengan layout dan pixel (P0)

**Bukti:** OBSERVED_SESSION. Resize bangku 48→32 mengubah face UV pada lima papan secara otomatis. Offset Box UV tetap, tetapi perpindahan muka mengambil pixel lama dari bagian lain; baut berpindah. Kaki digeser tanpa mengubah ketebalan dan locator diperbarui, kemudian lima papan dicat ulang.

**Owner:** CORRECTION_CAPABILITY + AGENT_REASONING; `cubes.ts`, native UV, lalu Texturing. Perubahan UV dilaporkan dalam receipt: ini bukan perubahan yang tidak dapat diamati, tetapi konsekuensinya belum ditangani sebagai satu hasil koreksi.

**Rencana:** preflight resize menyatakan muka/UV yang berubah dan konsekuensi density/pixel. Bedakan mempertahankan pemetaan (berisiko stretch), crop dengan density tetap, dan re-layout dengan transfer pixel. Pilih secara eksplisit sesuai kebutuhan; tidak ada satu default universal yang benar. Pertahankan exact translation untuk kaki/penopang yang tidak perlu di-scale. Integrasikan koreksi UV/pixel yang memang perlu dengan Undo yang konsisten; jangan otomatis repack seluruh aset.

**Acceptance:** resize fixture bangku ke 32; semua solid faces bertekstur, rasio terjaga, baut kembali di penopang, tiga locator berada di permukaan, tidak ada perubahan tinggi/kedalaman. Bukti mencakup before/after dan Undo/Redo, bukan hanya bounds.

#### USAGE-05 — UV hygiene “ready” disalahartikan sebagai mutu UV lengkap (P0)

**Bukti:** SOURCE_CONFIRMED: `texture.ts:buildUvAtlasAudit` mengembalikan `padding: unverified`; ready berdasarkan daftar alasan teknis. ARTIFACT_CONFIRMED: sandaran bawah bangku tinggi fisik 2.5 unit, tinggi UV north 2 unit. Jadi klaim rasio/density sempurna tidak tepat meskipun UV integer dan gate ready. Beda vertikal 20% dari 1 pixel/unit adalah pengukuran fixture ini, bukan metrik seluruh model.

**Owner:** AGENT_REASONING / PROOF_FAILURE; quality gate Geometry/UV. Runtime sudah membedakan hygiene; jangan mengganti nama status menjadi janji visual.

**Rencana:** cek aspect fisik↔UV dan density tiap muka material, termasuk face rotation dan logical-vs-physical resolution. Tangani ukuran pecahan dengan per-face UV bila perlu, tanpa mempertebal geometri yang sudah disetujui. Pakai diagnostik density yang sudah ada; perluas hanya kasus yang belum tercakup.

**Acceptance:** fixture 2.5-unit face dan thin per-face fixture; ukur ratio, mapping, alpha dan native repack/history. Status menyebut mana yang verified dan mana unverified; jangan menganggap semua fractional endpoint salah.

#### USAGE-06 — Atlas membesar sebelum batas ukuran diuji (P1)

**Bukti:** OBSERVED_SESSION + SOURCE_CONFIRMED. Papan diminta 256² pada 4px/unit; native template menghasilkan 512², logical canvas 128². Bentangan box frame 68 UV units = 272px. Occupied face area 1548 logical units² dari 16384 ≈9.45%. Occupied bounds 68×38. Ini hanya layout yang terjadi, bukan bukti minimum atlas yang mungkin.

**Owner:** Geometry/UV preflight + AGENT_REASONING; `texture.ts:create_texture`. Perubahan 256→512 diputuskan asisten tanpa menguji alternatif representasi; harus dicatat sebagai penyimpangan spec.

**Rencana:** jelaskan target bitmap, logical UV, density dan bentangan maksimum sebelum mutasi. Uji packing native pada representasi yang sesuai; jika satu Box UV terlalu panjang, evaluasi per-face atau reuse yang sah. Native failure/limitation bukan izin membuat packer baru tanpa bukti kebutuhan. Kalau tetap tidak muat, ajukan tradeoff yang konkret.

**Acceptance:** fixture papan; kandidat memenuhi 256² dan 4px/unit tanpa stretch, atau bukti terukur mengapa tidak bisa dengan representasi yang diuji. 512² berarti 4× pixel, bukan otomatis 4× token, PNG size, atau GPU cost aktual.

#### USAGE-07 — Reuse diminta, tetapi tidak benar-benar dibuktikan (P1)

**Bukti:** OBSERVED_SESSION: UV audit papan dan bangku melaporkan exact-reuse 0 meskipun rencana menyebut UV bersama. Parameter native `keep_multi_texture_occupancy` mempertahankan occupancy identik yang ada; keberadaannya tidak membuktikan semantic reuse tercipta.

**Owner:** Geometry/UV judgement. Bukan tuntutan agar setiap muka harus overlap.

**Rencana:** klasifikasikan bagian identik versus asimetris sebelum packing. Reuse hanya pada material/detail dan arah yang cocok. Papan dua sisi harus terbaca normal; jangan mirror teks. Detail baut yang posisinya berbeda tidak boleh dipaksakan berbagi island tanpa desain yang sesuai.

**Acceptance:** repeat frame/post test; intentional exact-reuse terdokumentasi dan terlihat benar, unexpected overlap nol, nama tetap normal. Jika reuse tidak menguntungkan, jelaskan alasan daripada mengklaim sudah dilakukan.

#### USAGE-08 — Varian tekstur terikat pada semantik grup yang tidak intuitif (P1)

**Bukti:** OBSERVED_SESSION: create Muria tanpa group ditolak; asisten lalu memindahkan base ke non-material group sehingga base-count menjadi 0, create ditolak lagi; pemulihan dilakukan dengan base material group dan variant group terpisah. SOURCE_CONFIRMED `classifyTextureProductionRole` dan `requireTextureCreationPreflight` menentukan peran dari channel/group.

**Owner:** pertama AGENT_REASONING karena konfigurasi salah; berikutnya MCP_PUBLIC_CONTRACT / STATE_DISCOVERY karena operasi “duplicate as variant” memerlukan pengetahuan topology internal.

**Rencana:** sediakan alur eksplisit variant-from-base memakai identitas sumber, ukuran dan mapping yang kompatibel; preflight harus menyatakan perubahan peran saat grup diubah. Jangan mencabut single-base safety untuk membolehkan texture-per-cube. Group error harus memberi satu langkah recovery yang valid tanpa menebak.

**Acceptance:** base + dua variant, decoy selected, invalid group reassignment, Undo. Nama/ID tidak ambigu, base tidak hilang, variant dimensions/mapping cocok. Operasi dapat dipakai dari deskripsi capability saja.

#### USAGE-09 — Pengecatan banyak warna menjadi banyak transaksi kecil (P1)

**Bukti:** OBSERVED_SESSION: asisten membangkitkan daftar koordinat tiap warna lalu memanggil brush per warna. Satu eraser call papan mengirim 20,032 koordinat. SOURCE_CONFIRMED: exact-pixel brush mempunyai satu warna per request dan satu Undo per request. Ini bukan bukti brush lambat; roundtrip, payload dan fragmented undo menambah pekerjaan.

**Owner:** AGENT_REASONING untuk broad fill yang seharusnya memakai shape/fill; MCP_PUBLIC_CONTRACT / CORRECTION_CAPABILITY untuk coherent multi-operation paint. Sudah menjadi residue pada next-action Local, jangan bikin roadmap paralel.

**Rencana:** manfaatkan rectangle/fill untuk area luas dan batch same-color untuk detail. Lanjutkan domain-specific texture transaction yang sudah diusulkan: operasi bounded, full preflight sebelum mutate, satu native Undo, target eksplisit, revision dan affected region. Tidak membuat generic Gateway executor/planner. Pixel raster painting tetap boleh untuk detail yang benar-benar perlu.

**Acceptance:** palette pass dan text/stripe patch yang sama menghasilkan RGBA sama tanpa bleed; satu coherent Undo/Redo; invalid operation tengah tidak meninggalkan separuh hasil. Bandingkan bytes/calls/active time sambil mempertahankan kualitas.

#### USAGE-10 — Pembacaan tekstur tidak fokus dan belum revision-aware (P1)

**Bukti:** SOURCE_CONFIRMED Local: `get_texture` selalu memakai full `getDataURL()` dan `inspection: full_atlas`. `mcp/lib/textureRevision.ts` sudah punya hashing dan revision-match helper, tetapi belum diintegrasikan ke read/paint path yang diperiksa. Dalam revisi papan, asisten mengambil mask huruf dari PNG disk, bukan dari bitmap live yang baru diekspor ke memori.

**Owner:** STATE_DISCOVERY / MCP_RESULT_QUALITY; kesalahan asisten memakai sumber disk berpotensi stale. Tidak terbukti perubahan pengguna benar-benar hilang pada kasus ini.

**Rencana:** lanjutkan residue existing untuk focused region + revision. Patch hanya terhadap revision/UV yang diketahui; bila berubah, refresh target lokal sekali. Jangan mengekspor seluruh bbmodel demi membaca beberapa pixel. Full atlas tetap diperlukan pada final review yang relevan.

**Acceptance:** user mengedit live setelah PNG disimpan; patch berbasis old revision ditolak sebelum mutasi, patch refreshed mempertahankan edit; region evidence mempunyai koordinat, ukuran bitmap/logical dan revision. No silent use of default texture.

#### USAGE-11 — Schema create/update tidak setara antara dokumentasi dan live discovery (P1)

**Bukti:** SOURCE_CONFIRMED `cubes.ts`: ToolSpec menyimpan union schema rinci tetapi registration `cubeToolInputSchema` memakai `z.unknown()` pada elements/updates/faces/transform arrays. OBSERVED_SESSION describe hanya mengatakan “Cube placement payload” atau “Optional per-face UV payload”. Validasi execute masih ada; jangan menyebut input tidak divalidasi.

**Owner:** MCP_PUBLIC_CONTRACT. Pengurangan schema yang menyembunyikan bentuk input dapat memindahkan biaya ke guessing/source reads/retry.

**Rencana:** selaraskan advertised schema dengan runtime-valid schema melalui pemilik schema yang sama, tetap ringkas secara branch intent. Evaluasi generated docs dan Gateway describe bersama, jangan memperbaiki docs saja. Tidak perlu menambahkan tool baru untuk tiap field.

**Acceptance:** dari describe saja, caller membentuk create, batch update, dan per-face override yang valid tanpa membuka source; negative cases memberikan pesan field yang jelas. Pastikan schema detail tidak menduplikasi payload besar dalam result.

#### USAGE-12 — Respons mutasi terlalu besar; sebagian sudah ditangani Local (P1)

**Bukti:** OBSERVED_SESSION: resize 19 cube menampilkan before/after UV lengkap termasuk kaki yang hanya diterjemahkan. Asisten juga pernah menampilkan bbmodel + base64 texture lengkap dan menerima truncation. SOURCE_ADDRESSED Local `gateway/contract.ts:compactManageCubesStructuredContent` menghapus before dan face UV yang tidak berubah, mempertahankan UV relevan.

**Owner:** MCP_RESULT_QUALITY untuk jalur lama; AGENT_REASONING untuk meminta dan mencetak full compiled payload. **Jangan implementasikan ulang compaction yang sudah ada.**

**Rencana:** deploy build yang cocok dahulu dalam tugas live terpisah; gunakan receipt continuation. Asisten memproses structuredContent lokal dan mencetak hanya subset yang dibutuhkan. Existing inspect_elements menjadi pilihan awal detail, bukan export full model. Tidak perlu menghapus detail yang justru dibutuhkan untuk koreksi UV.

**Acceptance:** fixture 19-cube resize pada current Gateway; translation receipt tanpa face payload lama, resized faces tetap tersedia, hasil sama. Ukur token nyata bila client menyediakan; byte receipt bukan token otomatis.

#### USAGE-13 — Bukti visual kurang sesuai skala defect atau diambil berlebihan (P1)

**Bukti:** SOURCE_CONFIRMED capture canonical 512², 1–5 views, explicit framing tersedia. OBSERVED_SESSION asisten memakai banyak view full model; detail kecil kadang baru terlihat pada screenshot close-up pengguna. Tidak ada bukti resolusi 512 sendiri tidak cukup.

**Owner:** VISUAL_FEEDBACK / AGENT_REASONING. Local skill sudah mewajibkan minimum affected views.

**Rencana:** gunakan existing explicit framing untuk celah pintu, sambungan engsel, wajah, huruf, dan UV bleeding; whole-model untuk silhouette. Samakan framing before/after agar perbandingan tidak dipengaruhi zoom. Ambil satu evidence bundle per coherent pass, bukan per warna.

**Acceptance:** cacat kecil yang diketahui terbaca di crop dan tidak hilang karena autofit; transform kamera editor tidak berubah. Jangan menurunkan resolusi untuk menghemat tanpa menjaga ability mendeteksi defect.

#### USAGE-14 — Rig/contact terlambat menjadi prasyarat animation (P0)

**Bukti:** OBSERVED_SESSION pintu pickup tampak lepas lalu ditambah pin dan straps; tekstur engsel perlu koreksi tambahan. NPC perlu gerak tangan-pipi/kaki/badan terkoordinasi. **HYPOTHESIS:** pivot benar secara angka belum menjamin attachment visual.

**Owner:** Geometry/rig dahulu, Animation sesudahnya. Handoff bukan bug jika memang melintasi owner, tetapi rig yang terlambat memperbesar rework.

**Rencana:** pada geometry gate, uji komponen bergerak di beberapa pose ekstrem dengan tampilan sementara: closed/mid/open, recoil penuh, pose kontak tangan-pipi. Struktur penopang minimum, pivot dan clearance harus siap sebelum texture approval. Jangan membuat ulang keseluruhan texture ketika menambah satu engsel.

**Acceptance:** gate 0/50/100 derajat tetap tersambung tanpa menembus bingkai/bak, minimum thickness dipenuhi, material hinge menyatu. Tidak menyatakan harus collision dunia/game.

#### USAGE-15 — Motion matematis benar belum berarti ekspresif/natural (P1)

**Bukti:** keluhan daun serentak, NPC terlalu diam di badan/kaki, float perahu terlalu lemah. Penambahan recoil badan/asap kemudian adalah scope baru, sehingga jangan dihitung sebagai seluruhnya defect awal.

**Owner:** Animation reasoning. Local skill sudah mempunyai archetype/driver/follower/contact/phase; gap utama adalah penerapan dan bukti.

**Rencana:** definisikan primary motion, counter-motion, fase/delay, amplitudo yang terlihat pada ukuran model, dan invariant kontak. Tinjau loop penuh serta repeated playback, bukan hanya awal/tengah/akhir diam. Bedakan float subtle dengan float expressive dari intent pengguna; jangan memakai satu preset amplitudo universal.

**Acceptance:** gerak badan/kaki terbaca, tangan tidak lepas pipi, pinggul tetap pada koper; daun punya phase hierarchy; loop tidak snap; visual acceptance pengguna terpisah dari numeric keys.

#### USAGE-16 — Query, parameter dan efek memerlukan konteks pemanggil (P1)

**Bukti:** README pickup menyatakan distance query accumulated sehingga reverse bukan signed-direction motion. Perahu mendapat smoke resource pack; tandan sawit memakai parameter tinggi dan kontak tanah. Pengujian Minecraft tidak dilakukan pada sesi ini.

**Owner:** Animation/integration proof, bukan otomatis bug Molang. Jangan menjanjikan arah mundur/partikel live hanya dari preview.

**Rencana:** dalam output yang diminta, nyatakan external query/variable, unit, default, reset time, hold/loop dan mutually-exclusive clips. Hitung satu keliling roda dan neutral return; uji height 0/1/4/16 serta direction samples untuk jatuh saat scope aktif. Verifikasi locator/effect identifiers antarfile; Minecraft smoke membutuhkan caller/resource configuration yang benar.

**Acceptance:** distance tetap→sudut tetap, seperempat/satu keliling benar, parametric fall duration berubah sesuai tinggi, geometry tidak menembus tanah pada sampel. Particle binding tervalidasi statik; runtime Minecraft tetap UNVERIFIED sampai benar-benar dites.

#### USAGE-17 — Hasil final tidak lengkap meskipun native model ada (P0)

**Bukti ARTIFACT_CONFIRMED pada v1.0.0:** folder `workspace/active/tiger-transport-pickup/` memiliki bbmodel/PNG, tetapi tidak memiliki standalone *.geo.json dan *.animation.json. Native bbmodel mempunyai empat animasi (drive, engine_idle, cage_open, cage_close). Rencana awal meminta kedua ekspor. README masih memuat kalimat “final Bedrock animation export pending”, lalu penutup menyebut bbmodel/PNG saved.

**Owner pertama:** AGENT_REASONING / PROOF_FAILURE pada completion. Ini temuan deliverable, bukan bukti native animation hilang.

**Rencana:** pisahkan “native saved” dari “all requested deliverables complete”. Daftar output yang diminta harus dicocokkan dengan file aktual beserta identifier/reference pada finalisasi. Untuk koreksi ini nanti, ekspor dari approved bbmodel tanpa membangun ulang model.

**Acceptance:** semua file yang dijanjikan hadir, parse valid, bone/animation/texture references sesuai, dan revision sama. Audit ini hanya mencatat kekurangan; tidak memperbaiki snapshot stabil.

#### USAGE-18 — Identifier dan salinan ekspor dapat tidak sinkron (P0)

**Bukti:** ARTIFACT_CONFIRMED `small_cannon_boat.geo.json` memakai `geometry.unknown`, sedangkan file geometry di resource pack memakai `geometry.small_cannon_boat`. Native model_identifier pada sampel yang diperiksa kosong. OBSERVED_SESSION bangku/papan memerlukan penggantian identifier di JSON hasil compile memakai shell, tidak di native project.

**Owner:** finalization reasoning + project metadata/export contract. Beda identifier tidak otomatis berarti resource pack gagal: salinan di pack bisa konsisten. Masalahnya pengguna tidak memperoleh satu kontrak yang sama untuk semua hasil.

**Rencana:** tetapkan identifier di authoritative native project melalui jalur resmi sebelum compile; bila belum ada capability, identifikasi gap, jangan normalisasi downstream diam-diam. Bedakan file standalone dan packaged binding secara eksplisit atau samakan jika memang varian artefak yang sama. Validasi cross-file references.

**Acceptance:** re-export dari native tidak kembali ke unknown; standalone/package/client entity setuju dengan identifier yang dimaksud. Reopen native tetap mempertahankan metadata.

#### USAGE-19 — Save/update aset membutuhkan roundtrip file manual (P1)

**Bukti:** SOURCE_CONFIRMED `export.ts` menolak overwrite Bedrock existing karena risiko multi-geometry merge. Export filesystem memeriksa file/byte size serta native afterSave lifecycle. OBSERVED_SESSION asisten mengambil compile ke memori, menulis JSON melalui shell dan mengekstrak PNG dari embedded source.

**Owner:** MCP_PUBLIC_CONTRACT / persistence. Pengamanan multi-model valid; jangan dihapus agar save lebih cepat.

**Rencana:** jalur update yang memiliki ownership eksplisit untuk identifier dalam file (atau native merge yang teruji), expected file state dan consent sesuai kontrak. Finalisasi harus menyatukan native/atlas/geometry/animation yang diminta tanpa menjadikan generic filesystem writer sebagai tool normal. Pakai existing lifecycle dan native APIs.

**Acceptance:** overwrite own model aman; model lain di multi-geometry tidak terhapus; permission/failure tidak dilaporkan sebagai sukses; native path/saved state benar. Bukti hash/cross-reference dan actual reopen melengkapi size check; native reopen harness sudah tersedia.

#### USAGE-20 — State live, state disk, dan edit pengguna mudah tercampur (P0)

**Bukti:** pengguna kompresor eksplisit melarang mengembalikan bagian yang dihapus; bangku dibuka ulang menghasilkan UUID project baru, sementara element IDs masih sama. Pada revisi papan, mask diambil dari disk walaupun source live tersedia. Tidak terbukti user edit hilang, tetapi jalurnya berisiko.

**Owner:** STATE_DISCOVERY / AGENT_REASONING. Reuse state perlu batas freshness, bukan readback setiap operasi maupun percaya cache selamanya.

**Rencana:** refresh identitas sekali setelah project switch/reopen/user edit yang material. Kunci transaksi ke project + target UUID + revision bila tersedia. Setelah mutation gunakan receipt; jangan baca seluruh proyek lagi tanpa kebutuhan. User-deleted geometry tidak boleh direkonstruksi dari snapshot lama.

**Acceptance:** edit manual di antara reads, switch project, texture decoy dan reopen; stale target ditolak/di-refresh bounded, user changes tetap ada. Tidak membuat persistent state system kedua.

#### USAGE-21 — Readme append-only membuat status lama bertabrakan (P1)

**Bukti:** ARTIFACT_CONFIRMED README bangku masih berisi ukuran/locator lama sebelum paragraf latest revision; pickup mencampur “pending export” dengan “saved”; beberapa catatan memakai koordinat tanpa spasi yang sulit dibaca. Dokumentasi dapat menyebabkan implementer memakai ukuran/hasil yang salah.

**Owner:** AGENT_REASONING / asset continuity. Git history sudah menyimpan keadaan lama.

**Rencana:** current summary di README diperbarui sebagai otoritas tunggal; letakkan batas/proof/output aktual secara eksplisit. Jangan terus menambahkan “final” baru tanpa menghapus atau mengisolasi status yang sudah superseded. Catatan penggunaan ini adalah historis; next-action hanya pointer, bukan salinan rencana lain.

**Acceptance:** satu pembaca dapat menentukan current dimensions, locator, files, approval dan missing proof tanpa menebak urutan paragraf. Link existing files valid.

#### USAGE-22 — Biaya boot/discovery dan shell noise sebagian berasal dari asisten (P1)

**Bukti:** OBSERVED_SESSION berulang kali membaca skill lengkap, describe yang sudah diketahui, mencetak output sangat besar. Pada audit ini sendiri beberapa perintah rg memakai path/glob yang tidak cocok dengan PowerShell, satu inventory pipe salah sintaks, lalu diperbaiki. Ini pemborosan agent execution, bukan MCP authoring defect.

**Owner:** AGENT_REASONING. Local sudah mengurangi search default ke 4, compact describe dan menambah cwd firewall.

**Rencana:** reusable boot berlaku dalam revision worktree yang sama; ganti specialist saat owner berubah tanpa menumpuk bacaan yang tidak diperlukan. Temukan tool melalui metadata sekali, reuse schema/UUID valid. Batasi output dari orchestrator; gunakan rg file filter yang benar pada Windows. Jangan membaca repo development saat hanya mengecat aset.

**Acceptance:** tugas koreksi bounded dimulai dari state yang relevan; tidak ada broad scan atau retry sintaks berulang. Ukur rereads/discovery secara terpisah dari mandatory new-worktree gate, jangan menghapus gate agar angka turun.

#### USAGE-23 — Angka verifikasi mudah tampak lebih kuat daripada buktinya (P0)

**Bukti:** JSON parse, bounds, UV ready dan save berhasil sering menjadi dasar respons “selesai”; ditemukan aspect mismatch dan missing exports setelah itu. Snapshot v1.0.0 dibuat tanpa rerun full MCP suite dan diberi catatan archival release; nama “stable” bukan bukti regresi/native baru.

**Owner:** PROOF_FAILURE / communication. Jangan menyalahkan verifier karena tidak memeriksa klaim di luar lingkupnya.

**Rencana:** output akhir membedakan tool applied, structural/UV hygiene, visual review, native save/reopen, export completeness, Minecraft integration. Pengukuran numerik menguji klaim spesifik. Jangan menduplikasi full MCP tests untuk edit texture; jangan mengklaim full MCP PASS dari JSON parse.

**Acceptance:** receipt/report fixture tidak mempromosikan unknown proof. Missing artifact atau mismatched identifier mencegah “all deliverables complete”, tetapi tidak menyangkal bagian yang memang selesai.

#### USAGE-24 — Ketiadaan baseline biaya aktual menghambat prioritas berbasis angka (P1)

**Bukti:** token/durasi per model tidak tersedia. SOURCE_CONFIRMED live harness mengukur request/response bytes dan call counters serta menyatakan itu bukan model tokens. SOURCE_ADDRESSED Gateway/source efficiency tidak sama dengan actual allowance reduction.

**Owner:** proof/measurement; existing live-e2e-common dan validation owner. Tidak perlu telemetry service baru.

**Rencana:** instrumentasi fixture terkontrol dengan baseline source/build, reference hash, input state, model/reasoning setting, active work vs waiting, calls/errors/retries/rereads, bytes, image count/size, correction passes, dan actual client token bila tersedia. Bila tidak, tulis UNKNOWN, jangan konversi byte secara spekulatif.

**Acceptance:** hanya bandingkan run dengan kualitas akhir setara. Gunakan setidaknya tiga run bila biaya hendak dijadikan klaim stabil; laporkan median dan rentang. Target relatif ditetapkan setelah baseline, bukan menjanjikan persentase sekarang.

### Hal yang sudah ada di Local — jangan dibangun ulang

| Kemampuan / perbaikan | Status dari source/dokumentasi Local saat audit | Pekerjaan yang masih sah |
|---|---|---|
| Gateway cube receipt compaction | SOURCE_ADDRESSED; `gateway/contract.ts` membuang before dan face_uvs yang tidak relevan | Deploy/prove exact current build dan ukur use-case resize |
| Search default 4, compact describe, tools-only Gateway | SOURCE_ADDRESSED | Evaluasi discoverability input, bukan tambah router/tool surface |
| Palette/cohort/anti-micro-loop + minimum affected views | SOURCE_ADDRESSED di Texturing skill | Kepatuhan agent dan visual acceptance multi-material |
| Explicit animation target A saat B selected | SOURCE_ADDRESSED di animation timeline dan live harness | Jalankan fixture native, jangan ulang manual-selection workaround |
| Native template/repack + RGBA/history harness | SOURCE_READY / LIVE_NOT_RUN menurut validation owner | Run disposable fixtures dengan exact build; jangan anggap repack sudah proven live |
| Persistence prepare/manual reopen/verify | SOURCE_READY / LIVE_NOT_RUN | Native close/reopen yang benar-benar dilakukan, bukan byte-size saja |
| Texture revision helper | Source helper ada | Integrasi read/paint + focused region + coherent transaction tetap pending |
| Runtime state freshness / stateless Gateway | Ada kontrak/harness | Tidak ada bukti baru yang membenarkan transport rewrite |
| Generic 3D_ASSISTED pipeline | Di luar penggunaan DIRECT ini | Tetap deferred, tidak dipakai sebagai obat kegagalan DIRECT |

### Rencana perbaikan bertahap — usulan untuk dikerjakan kemudian

**Paket A — integritas hasil dan kualitas pemeriksaan (P0; USAGE-01/02/03/05/17/18/20/21/23).**
1. Jadikan tiga fixture reproduksi pertama: bangku resize, papan dua varian, pickup panel/door. Ambil salinan dari exact v1.0.0 tanpa memutasi aset disetujui.
2. Perbaiki disiplin agent memakai kemampuan existing: cohort/material intent, coverage relevan, current-state authority, completion per artifact.
3. Verifikasi missing pickup exports, native identifier dan ratio bangku sebagai tugas repair aset terpisah bila pengguna memintanya.
4. Source changes hanya bila fixture membuktikan kontrak existing tidak memadai. Tidak menambah universal fidelity grader.
5. Done: known defects ditemukan sebelum user review, current README tidak ambigu, deliverables complete tidak palsu.

**Paket B — texture revision, focused evidence dan transaksi paint (P1; USAGE-09/10/12/13).**
1. Lanjutkan residue LOCAL_CODE yang sudah tercatat, bukan agenda baru.
2. Integrasikan helper revision ke read/receipt, region read, stale-check sebelum paint, dan domain-specific multi-operation transaction dengan satu Undo.
3. Gunakan fill/shape untuk broad regions; pertahankan exact pixel detail dan full final evidence.
4. Done: targeted/decoy/stale/rollback/Undo native tests lulus; kualitas tidak menurun dan biaya berkurang terukur.

**Paket C — koreksi ukuran dan UV serta atlas preflight (P0/P1; USAGE-04/05/06/07/11).**
1. Putuskan kontrak resize berdasarkan invariant semantic, bukan blind scale. Advertised input schema harus cukup lengkap.
2. Sebelum mutasi, laporkan UV impact/density dan representasi yang menyebabkan packing melebihi target.
3. Pakai native generator dan existing per-face support terlebih dahulu. Jangan menulis custom packer sebelum per-face/native limitation yang relevan direproduksi.
4. Done: bangku 32-unit dan papan target atlas memenuhi acceptance masing-masing, tanpa stretch, missing alpha atau bolt drift; Undo exact.

**Paket D — varian dan finalisasi (P1, dengan output integrity P0; USAGE-08/17/18/19/21).**
1. Varian eksplisit dari base atlas; preflight role/group; preserve base dan mapping.
2. Native project identifier ditetapkan, kemudian compile/export file yang memang diminta; update file existing harus menjaga multi-model content.
3. Reopen/compare hasil akhir dengan existing harness dan verifikasi package references bila pack diminta.
4. Done: duplicate variant tanpa recovery, re-export tidak drift identifier, native/PNG/geo/animation konsisten, tidak perlu koreksi JSON manual.

**Paket E — motion/contact dan effects (P1; USAGE-14/15/16).**
1. Rig readiness dan pose-extreme review sebelum texture approval untuk model bergerak.
2. Terapkan driver/follower/phase/contact dari skill existing; full-loop playback dan composite samples.
3. Isi batas query/particle integration secara jelas; arah mundur berbasis query tidak boleh diasumsikan signed.
4. Done: pose attachment dan loop terjaga, gerak ekspresif sesuai intent; Minecraft tetap label terpisah.

**Paket F — benchmark quality-first (USAGE-12/22/24; berjalan bersama paket lain).**
1. Pin source+live build yang sama; jangan membandingkan sesi e5f706 dengan Local baru seolah software identik.
2. Baseline tugas diterima dahulu; catat correction count, errors, receipt/evidence volume, active elapsed, actual usage bila tersedia.
3. Bandingkan fixture/input/model setting yang sama dan laporkan scope pengukuran.
4. Done: ada bukti biaya ke hasil diterima, bukan sekadar tool list lebih pendek.

### Matriks acceptance/reproduksi untuk implementer

| Fixture / tindakan | Pemeriksaan source/otomatis | Bukti live/visual yang wajib | Larangan shortcut |
|---|---|---|---|
| Bench 48→32, 3 locator | coords/UV ratio/count/cross-file IDs | bolts, seams, all solid faces, Undo/Redo | stretch atlas atau mengurangi thickness kaki |
| Sign 2 variants | explicit base role, dimensions, text regions | depan/belakang normal, gradasi, no bleed | mirror letters, naik atlas tanpa laporan |
| Pickup shell correction | bounded target cohort, preserved counts/coverage intent | defect close-up + affected side, no new holes | hapus panel untuk mendapat zero-overlap |
| Door/hinge | pivot/parent + angle samples | connected at 0/50/100, compatible steel style | pivot numerik dianggap cukup |
| Local paint revision | revision mismatch/preflight/transaction rollback | decoy target, RGBA outside region unchanged, Undo | mask dari PNG stale |
| Export/update | IDs, references, file set and ownership | native reopen preserves textures/animations/UV | size-only claim sebagai whole-asset PASS |
| NPC idle / boat recoil | key endpoints/reset/loop/data validation | repeated playback, contact, readability/composition | snapshot tiga frame dianggap bukti semua waktu |
| Palm/wheel procedural fixture | gravity/circumference/sample math | ground contact and target preview inputs | mengklaim real world collision dari math |
| Cost comparison | counters/source/build/input provenance | accepted visual quality equal before comparing cost | byte→token atau raw calls→efficiency otomatis |

### Implementasi, closure dan bukti yang belum ada

- Tugas ini **hanya dokumentasi penggunaan**, tidak mengganti source/runtime/skill/generated docs dan tidak menjalankan live harness. Rencana bukan bukti “fixed”.
- Jika paket kemudian mengubah public schema/result: source canonical → docs:build/docs:check → owning verifier, semantic mirrors dan CI routing sesuai mcp/AGENTS. Jangan mengedit generated API docs manual.
- Source/static work dan harness preparation dapat dilakukan di GitHub; generator/lockfile memakai capable workspace; native Undo/reopen/visual hanya pada exact matching LIVE_BLOCKBENCH. Partition residue, bukan handoff seluruh task.
- Batas dua gagal dengan sebab sama tetap berlaku; tidak menambah percobaan karena berganti tool. Permission/safety rejection bukan alasan memutar lewat generic shell/eval.
- Tidak ada klaim kebocoran secret, runtime crash, salah Molang final, gagal particle di Minecraft, atau universal UV-pack minimum tanpa bukti spesifik.
- Untuk audit lanjutan, prioritas reproduksi adalah USAGE-04/05/08/17/18, karena ada angka/artifact/trace yang konkret. Keluhan visual lama tetap penting, tetapi first wrong owner perlu dipastikan dengan fixture.
- Jangan merge snapshot stabil ke Local hanya untuk memperoleh fixture. Referensi artefak historis tersedia pada [v1.0.0](https://github.com/halokaryamedia-source/BuildIT/tree/v1.0.0/workspace/active); ekstrak disposable copy ketika pengujian dibutuhkan.

### Indeks owner yang diperiksa

Source paths di bawah relatif repository dan merujuk Local SHA audit, bukan janji line number tetap:
- `mcp/server/tools/cubes.ts`: create/update schemas, registration input schema, authored state/effects.
- `mcp/server/tools/texture.ts`: native template, role/group preflight, inventory, UV audit, full-atlas get, activation.
- `mcp/server/tools/paint.ts`: exact-pixel path, one-color request, native/Undo paths, receipt.
- `mcp/lib/textureRevision.ts`: revision hashing dan stale guard helper.
- `mcp/gateway/contract.ts`, `index.ts`, `backend.ts`: receipt compaction/discovery/dispatch.
- `mcp/server/tools/camera.ts`: canonical capture dan explicit framing.
- `mcp/server/tools/animation.ts`: explicit target timeline dan coherent operation paths.
- `mcp/server/tools/export.ts`: overwrite boundary, native codec compile/afterSave/file checks.
- `mcp/scripts/live-e2e-common.ts` dan existing geometry/texturing/animation/persistence live harness: exact build, counters, prepared proof.
- Geometry/Texturing/Animation skills, root/mcp AGENTS, implementation-map dan current next-action: judgement, routing, existing residue.

**Kesimpulan penggunaan:** masalah utama bukan kekurangan jumlah tool. Hasil kurang akurat terutama muncul saat keputusan material/assembly dan acceptance asisten belum kuat; biaya bertambah ketika koreksi memutus UV/pixel, state perlu direkonstruksi, serta export/variant memerlukan langkah manual. Perbaiki first owner dan buktikan hasil setara sebelum mengklaim penghematan.
