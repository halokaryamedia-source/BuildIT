# 10-release-checklist

## Purpose
- Checklist final sebelum merge/push ke branch `V1`.

## Pre-release
- Semua file docs terkait sudah diisi dan sinkron.
- Tidak ada konfigurasi temp yang terlanjur ditulis.
- Branch clean dari artefak debug.

## Verification
- Review cepat terhadap perubahan penting di runtime/UI.
- Smoke run lokal: buka app, pilih workspace, jalankan start flow, stop flow.
- Verifikasi tidak ada secret/sensitive data di commit.

## Release criteria
- Semua acceptance criteria di dokumen 00-09 terpenuhi.
- Dokumentasi dan fitur minimal sesuai tujuan sprint.
- Lakukan commit dan push ke `origin V1` dengan pesan yang menjelaskan scope.
