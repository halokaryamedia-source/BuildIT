# 06-codex-mode

## Purpose
- Define how app generates and commits Codex-compatible MCP config.

## Scope
- Write-confirm flow for configuration file update.
- Preserve existing Codex config when file already exists.

## Implementation notes
- Menampilkan preview config sebelum write.
- Write dilakukan hanya setelah user confirm.
- Existing keys di-preserve dengan merge strategy non-destructive.

## Security notes
- Tidak menyimpan token API di config app.
- Hanya menulis jalur dan endpoint yang dibutuhkan untuk local bridge.

## Acceptance criteria
- Update config can be applied and later reverted by user manually.
- No destructive overwrite of unrelated keys.
