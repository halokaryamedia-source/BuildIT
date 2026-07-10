# Geometry Failure Prevention Playbook (Global, Non-Model Specific)

Untuk alur kerja harian yang paling ringkas, lihat:
[compact-geometric-pipeline.md](/D:/Work/AI%20Stuff/MCP-Blockbench/SourceDocument/modeling/compact-geometric-pipeline.md)

Dokumen ini dipakai saat ada regresi/ masalah berulang. Untuk sesi normal, cukup pakai
[compact-geometric-pipeline.md](/D:/Work/AI%20Stuff/MCP-Blockbench/SourceDocument/modeling/compact-geometric-pipeline.md).

Tujuan: mencegah kegagalan geometri berulang untuk semua model MCP (Bedrock Entity/Block), tanpa menyentuh texture.

## 0.0) Geometric Reliability Charter (Wajib)

- Gunakan aturan berhenti: jika Front/Side belum PASS, jangan lanjut ke issue berikutnya.
- State eksplisit harus tetap: `reference`, `format`, `phase`, `model_scale`.
- Semua keputusan dikunci dengan label: `PASS`, `PARTIAL`, `BLOCKER`.
- Evaluasi setiap geometri dari akar cause: parent, pivot, skala, bukan warna.
- Tiap issue harus punya rollback point sebelum perubahan berikutnya.
- Maks 1 area utama per siklus; jika 3 kegagalan beruntun, lakukan post-mortem kecil lalu reset strategi.
- SS capture memakai sudut tetap dan kamera preset agar tidak ada ilusi.
- Issue Card wajib ada untuk semua perubahan, termasuk yang berasal dari manual edit.
- Campur fase = dilarang (geometri, UV, texture dijalankan terpisah, bukan tumpang tindih).

## 0) Aturan Dasar (wajib dipakai semua sesi)
- **No-mix rule**: Main Geometry → Geometry Detailing → UV → Texture. Tidak ada lintas fase.
- **No-micro detail** di fase geometri.
- **Satu issue = satu siklus** (maks. 1–2 perubahan kritis per cycle).
- **Checkpoint wajib** sebelum dan sesudah setiap issue.
- **Validasi visual**: Front, Side, Back, 3/4 untuk setiap cycle geometri.

## 0.1) 10 penguat logika yang harus diaktifkan

- Stop otomatis bila exit gate geometri tidak terpenuhi.
- Kunci state dan reset jika endpoint/project/format berubah di tengah sesi.
- Semua penilaian memakai target visual yang kuantitatif, bukan rasa visual semata.
- Prioritaskan koreksi pivot/parent sebelum mengubah bentuk cube.
- Target pass/partial/blocker selalu ditulis di bawah issue card.
- Batasi eksperimen per siklus maksimal 2 tindakan kritis.
- Gunakan referensi tetap untuk geometri: orthographic, silhouette, scale.
- Lakukan superimpose SS reference vs current setelah Front/Side.
- Cek logika manual/otomatis sebelum loop berikutnya; snapshot manual di awal sesi.
- Jika issue sama gagal 2x, lakukan audit akar penyebab dan stop pengulangan pattern.

## 1) Tiga pertanyaan validasi awal per asset
1. Target skala sudah dikunci? (player-height / custom?)
2. Fase aktif? (Reference, Main Geometry, dll)
3. Format yang dipakai fix? (Bedrock Entity + cube-only, UV mode)

Jika salah satu belum jelas → stop dan set default kontrak dulu.

## 2) 10 issue + tindakan koreksi sistemik

### A) Referensi tidak berprioritas
- **Gejala:** bentuk meloncat antara silhouette dan detail.
- **Perbaikan:** gunakan 3 referensi primer saja untuk geometri: orthographic + silhouette + scale.
- **Batas:** close-up detail tidak dipakai di Main Geometry.

### B) Fase tercampur (UV/texture ikut geometri)
- **Gejala:** dianggap “sudah cocok” padahal geometri belum stabil.
- **Perbaikan:** kunci UV lock pada fase geometri, tidak ada UV edit.
- **Batas:** evaluasi geometri hanya dari siluet/volume.

### C) Pivot drift
- **Gejala:** sambungan terputus, bagian memanjang/terpotong aneh.
- **Perbaikan:** setiap joint harus di-set dari pivot induk: root → major limb → sub-limb.
- **Kunci:** simpan nilai offset/rotation baseline di log cycle.

### D) Attachment/parent salah
- **Gejala:** floating/floating-like, kaki/ekor melayang.
- **Perbaikan:** cek parent tree visual tiap siklus, target parent chain minimal:
  - root, body, hip/shoulder, tail_base, limb_upper, limb_lower, paw
- **Batas:** node anak tidak boleh langsung melayang tanpa parent support.

### E) Skala target berubah-ubah
- **Gejala:** proporsi tidak konsisten antar-sesi.
- **Perbaikan:** ukur awal dan simpan bounding box target: tinggi-lebar-dalam.
- **Batas:** tidak boleh mengubah ukuran target setelah pass Front/Side lulus.

### F) Terlalu cepat pakai micro-cube
- **Gejala:** geometri pecah dan tekstur sulit dibaca.
- **Perbaikan:** pakai 1–3 transition cube besar saja saat Main Geometry.
- **Batas:** detail kulit/jari/pattern dipindah ke texture phase.

### G) Iterasi massal
- **Gejala:** regresi tidak bisa ditelusuri.
- **Perbaikan:** satu cycle = satu isu spesifik.
- **Batas:** maksimal 2 tindakan kritis per cycle, lalu SS gate.

### H) Tidak ada view gate
- **Gejala:** masalah terlihat di side/3-4 tapi lolos di front.
- **Perbaikan:** wajib SS Front + Side + Back + 3/4.
- **Batas:** lanjut jika minimal 3/4 view lulus, 1/4 boleh revisi di cycle berikutnya.

### I) Manual edit bertabrakan dengan edit otomatis
- **Gejala:** regresi acak, sulit rollback.
- **Perbaikan:** catat “manual edits preserved” di header issue card dan lakukan minimal rework geometri setelahnya.
- **Batas:** jika menyentuh area manual, wajib checkpoint + revert option.

### J) Session/state MCP tidak stabil
- **Gejala:** hasil model berubah walau data terlihat sama.
- **Perbaikan:** pre-flight checklist wajib: endpoint, project id, format, fase, UV mode.
- **Batas:** jika salah satu berubah di tengah siklus, rollback dan ulangi dari checkpoint.

## 3) Template Issue Card (dipakai ulang semua asset)
- **Issue ID:**
- **Target:**
- **Failed view:** Front / Side / Back / 3-4
- **Failed part:**
- **Hipotesis akar:**
- **Root cause:** scale / silhouette / parent-pivot / attachment / cube noise / wrong reference priority
- **Decision path:** scale envelope / front-side silhouette / parent-pivot-attachment / collision-z-fighting / cube noise reduction / defer to texture
- **Aksi tunggal:**
- **Sebelum:** SS(front/side)
- **Sesudah:** SS(front/side/back/3-4)
- **Hasil:** PASS / PARTIAL / BLOCKER
- **Alasan rollback (jika BLOCKER):**

## 4) Kontrak geometri exit gate
- Tail continuity: tidak ada celah pada chain ekor.
- Limb continuity: kaki/tangan tidak terputus dari badan.
- Pivot stability: parent-child chain konsisten.
- Skala: tetap di dalam envelope target.
- Tidak ada floating major part.

## 5) Retry policy
- Jika 2 cycle berturut-turut gagal untuk issue sama:
  1. freeze,
  2. audit pivot+parent,
  3. ambil clean geometry reference snapshot,
  4. reset issue dari checkpoint valid terakhir.

### Checklist cepat untuk eksekusi berikutnya
1. Isi 3 pertanyaan validasi awal.
2. Pilih satu issue.
3. Eksekusi 1 aksi.
4. SS 4-view + checklist exit gate.
5. Jika PASS, catat dan lanjut issue berikutnya; jika FAIL, rollback + revisi.
