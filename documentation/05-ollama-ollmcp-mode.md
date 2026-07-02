# 05-ollama-ollmcp-mode

## Purpose
- Clarify how Ollama + OLLMCP mode is initiated and configured.

## Scope
- Workspace detection for Ollama-related tooling.
- Command argument handling for local model bridge operation.

## Implementation notes
- `Ollama`/`ollmcp` dijalankan secara lokal dengan argumen yang ditentukan pengguna.
- Mode ini diperlakukan sebagai local transport fallback sebelum integrasi cloud.
- Endpoint yang dihasilkan diekspose ke UI untuk koneksi berikutnya.

## Risks
- Perbedaan versi binary dapat mengubah flag yang didukung.
- Jika model service tidak aktif, start flow harus berhenti dengan error state.

## Acceptance criteria
- Mode local bisa dijalankan ulang tanpa intervensi manual berlebih.
- Error ketika model/endpoint tidak siap perlu tampil jelas dan actionable.
