# 08-safety-policy

## Purpose
- Menetapkan batas aman penggunaan local bridge dan perlindungan data.

## Scope
- Permissions, write scope, dan output data handling.

## Non-goals
- Tidak melakukan enkripsi end-to-end.
- Tidak mengelola policy enterprise khusus.

## Policy
- Hanya tulis konfigurasi pada workspace yang dipilih user.
- Tampilkan diff/pesan sebelum menulis perubahan penting.
- Logging hanya metadata proses (status/exit code/timestamp), bukan secret payload.
- Validasi path dengan ketat untuk mencegah traversal ke luar workspace.

## Acceptance criteria
- Tidak ada penyimpanan token/API key oleh aplikasi tanpa persetujuan.
- Tidak ada operasi write ke sistem file global di luar folder yang dikelola.
- Semua fail kritis ditampilkan ke user serta masuk log audit lokal.
