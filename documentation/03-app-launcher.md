# 03-app-launcher

## Purpose
- Describe user journey from app open -> workspace launch.

## Scope
- Wizard onboarding and route map: Home, Start Workspace, Docs, Settings.
- Status cards and error surfaces.

## Flow
1. App render dan mendeteksi state awal (`idle`/`unknown`).
2. User memilih workspace lokal.
3. User menekan start flow.
4. Runtime launch command and monitors status.
5. Jika sukses, tampilkan endpoint and Codex-ready action.

## Implementation notes
- State machine sederhana (`idle`, `starting`, `running`, `error`, `stopping`).
- Button actions disabled sesuai state agar tidak terjadi race atau double-start.
- Settings disimpan untuk preferred workspace, dan command arguments.

## Acceptance criteria
- Semua tombol mengikuti state guard dan tidak memicu command ganda.
- UI tetap responsif saat `ollmcp` berjalan > 60 detik.
