# Workspace Structure

`workspace/` adalah area penyimpanan proyek Blockbench di root repository.

## Top-Level Areas

```text
workspace/
├─ active/
│  └─ <project>/
└─ saved/
   └─ <project>/
```

- `active/` berisi proyek yang sedang dikerjakan.
- `saved/` berisi proyek yang sudah selesai dan tervalidasi.
- Satu proyek hanya boleh berada di salah satu area.

## Project Package

```text
<project>/
├─ <project>.bbmodel
├─ export-data/
└─ mcp-data/
   ├─ cache/
   └─ references/
```

- `<project>.bbmodel`: file native Blockbench utama, langsung di root proyek.
- `export-data/`: hasil development Minecraft Bedrock seperti texture,
  animation, geometry, dan output lain yang siap dipakai.
- `mcp-data/references/`: reference image, reference package, dan bahan
  pembanding model.
- `mcp-data/cache/`: screenshot preview dan cache proses MCP/Codex yang dapat
  dibuat ulang.

## Lifecycle

1. Script membuat proyek baru di `workspace/active/<project>/` dari preset
   immutable di `mcp/workflow/presets/`.
2. Pengerjaan model dan cache tetap berada di area `active/`.
3. Setelah model dan output tervalidasi, seluruh folder proyek dipindahkan ke
   `workspace/saved/`.
4. Jangan menyimpan hasil final Bedrock di `mcp-data/`; folder itu khusus data
   pendukung MCP dan Codex.

## Boundary

- Preset dan script reusable berada di `mcp/workflow/`.
- Aturan dan kebijakan workflow berada di `docs/`.
- Data per proyek berada di `workspace/`.
