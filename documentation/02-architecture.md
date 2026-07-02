# 02-architecture

## Purpose
- Menjelaskan arsitektur end-to-end agar tim bisa maintain dan men-debug lebih cepat.

## Scope
- Layer client UI, runtime command layer, dan persistence layer lokal.
- Event stream path: command trigger -> process output -> shared store -> UI logs.

## Components
- **UI Layer**: Svelte/Tauri frontend dengan halaman Dashboard, Docs, Workspace flow, dan Settings.
- **Runtime Layer**: command wrappers untuk memulai/ menghentikan `ollmcp` dan membaca status.
- **Config Layer**: module yang menulis file konfigurasi CodeX/MCP secara eksplisit.
- **Log Layer**: collector output process (`stdout`/`stderr`) dan persist ke state aplikasi.

## Implementation notes
- UI tidak langsung menulis proses shell; semuanya lewat command APIs lokal.
- State log ditampilkan secara streaming agar user melihat progress saat proses berjalan.
- Komponen dipisahkan agar bisa diuji secara modular bila dibutuhkan.

## Acceptance criteria
- Tidak ada cross-coupling langsung UI <-> shell logic.
- Fitur utama tetap jalan meskipun satu komponen dimatikan (degraded mode).
- Log tersedia meski proses `ollmcp` gagal start.
