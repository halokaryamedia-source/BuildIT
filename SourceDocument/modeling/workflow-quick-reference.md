# Workflow Quick Reference (Single Entry Point)

Gunakan ini **pertama kali** sebelum memulai sesi baru.

## Urutan kerja

1. Pastikan Brief Asset jelas.
   - Sumber boleh user, Codex, ChatGPT, atau tool lain.
2. Pastikan Reference Package mengikuti 8-sheet template.
3. Baca [compact-geometric-pipeline.md](/D:/Work/AI%20Stuff/MCP-Blockbench/SourceDocument/modeling/compact-geometric-pipeline.md)  
   - Aturan inti eksekusi 1 isu.
4. Isi [model-session-checklist-template.md](/D:/Work/AI%20Stuff/MCP-Blockbench/SourceDocument/modeling/model-session-checklist-template.md) (ringkas).
5. Validasi referensi pada [reference-package-pass-fail-checklist.md](/D:/Work/AI%20Stuff/MCP-Blockbench/SourceDocument/modeling/reference-package-pass-fail-checklist.md).
6. Jalankan [pre-modelling-gate.md](/D:/Work/AI%20Stuff/MCP-Blockbench/SourceDocument/modeling/pre-modelling-gate.md) sebelum Blockbench edit.
7. Jika gagal berulang, pakai [geometry-failure-prevention-playbook.md](/D:/Work/AI%20Stuff/MCP-Blockbench/SourceDocument/modeling/geometry-failure-prevention-playbook.md) untuk diagnosa.

## Kapan berhenti

- Jika referensi utama atau endpoint tidak stabil => `BLOCKER`.
- Jika perubahan utama tidak mencapai bentuk sesuai referensi => `BLOCKER` lalu rollback.
- Jika minor issue visual/texture => `PARTIAL`, lanjutkan per 1 isu.

## Keputusan status (tetap dipakai)

- PASS: lanjut fase berikutnya.
- PARTIAL: revisi kecil terukur.
- BLOCKER: rollback + minta user setuju sebelum melanjutkan.

## Jalur cepat (tanpa gate berlapis)

- Ambil SS Front + Side untuk tiap perubahan.
- Isi satu status + satu aksi berikutnya.
- Tutup 1 isu per cycle.
- Tidak ada pengulangan checklist yang tidak perlu.

## Sumber keputusan

- Sumber referensi/format: [reference-package-pass-fail-checklist.md](/D:/Work/AI%20Stuff/MCP-Blockbench/SourceDocument/modeling/reference-package-pass-fail-checklist.md)
- Gate sebelum modelling: [pre-modelling-gate.md](/D:/Work/AI%20Stuff/MCP-Blockbench/SourceDocument/modeling/pre-modelling-gate.md)
- Aturan geometri & loop: [compact-geometric-pipeline.md](/D:/Work/AI%20Stuff/MCP-Blockbench/SourceDocument/modeling/compact-geometric-pipeline.md)
- Diagnosa kalau jalan buntu: [geometry-failure-prevention-playbook.md](/D:/Work/AI%20Stuff/MCP-Blockbench/SourceDocument/modeling/geometry-failure-prevention-playbook.md)
- Detail batas/wajib per fase: [phase-detail-contract.md](/D:/Work/AI%20Stuff/MCP-Blockbench/SourceDocument/modeling/phase-detail-contract.md)  
  (dibuka saat fase dimulai, bukan di setiap aksi kecil.)
