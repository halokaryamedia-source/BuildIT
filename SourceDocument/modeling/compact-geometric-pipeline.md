# Pipeline Ringkas Bedrock MCP

Tujuan: jalur minimum yang tetap memakai reference package secara disiplin.

## 4 Aturan inti

1. **Satu fase aktif**
   - Fase tidak boleh dilompati.

2. **Satu isu per siklus**
   - Satu putaran = satu target (ekor, tangan, kaki, pivot, atau attachment).

3. **PASS gate**
   - Jika hasil tidak PASS, tidak lanjut ke tindakan berikutnya.

4. **Geometri dulu**
   - Main Geometry: bentuk, sambungan, dan pose saja.
   - UV/tekstur: fase berikutnya.

## Flow penuh

1. Brief Asset.
2. Reference Package.
3. Reference Gate.
4. Main Geometry.
5. Geometry Detailing.
6. UV Texture.
7. Base Texturing.
8. Detail Texturing.
9. Polish.
10. Final Review.

## Precheck sebelum edit Blockbench

- Brief asset jelas, dari user/Codex/external tool.
- Reference package valid: Sheet `01-07` = PASS, Sheet `08` = PASS atau optional/not required.
- `REFERENCE_PLAN.md`, `CODEX_REFERENCE_HANDOFF.md`, dan `reference_manifest.json` ada.
- `pre-modelling-gate.md` = PASS sebelum Main Geometry.
- State session stabil: endpoint, active project, format, phase, UV mode.
- Ambil rollback point sebelum edit.

## Satu siklus kerja

1. pilih satu isu kritis
2. tulis akar dugaan 1 baris
3. lakukan 1 paket edit
4. ambil SS Front + Side (`+Back/3-4` jika perlu)
5. rekam hasil:
   - `status: PASS / PARTIAL / BLOCKER`
   - `next: lanjut / rollback`

## Exit gate referensi untuk masing-masing jalur

- Main Geometry: pakai Sheet 01-04 dan 07; bentuk menyambung, tidak ada bagian mengambang, skala konsisten.
- Geometry Detailing: pakai Sheet 04, 06, 07, dan 08 jika relevan; hanya detail struktur.
- UV Texture: pakai Sheet 02 dan 05; UV tidak tumpang tindih untuk area aktif.
- Base Texturing: pakai Sheet 05; warna utama dan material zones terbaca.
- Detail Texturing: pakai Sheet 05-06; pixel detail, trim, shading, accent.
- Polish: pakai semua sheet; small fixes saja.
- Final Review: bandingkan hasil ke package per sheet.

## 10 penyebab utama dan respon cepat

1. Referensi ambigu -> prioritaskan 01 -> 02 -> 03 -> 04.
2. Campur fase -> fokuskan scope (jangan UV saat geometri).
3. Pivot salah -> cek parent chain + offset akar.
4. Limb / tail disconnect -> reset parent, sambung ulang ke root-body.
5. Skala berubah -> lock ukuran awal, edit secara proporsional.
6. Over-detail cube -> pindahkan ke texture jika ukuran kecil.
7. Iterasi terlalu banyak -> 1 loop = 1 isu.
8. Missing Front/Side -> ambil SS wajib.
9. Manual edit bentrok auto -> cek checkpoint dan ulangi dari backup.
10. MCP tidak stabil -> ulang preflight endpoint/project/format/phase.
