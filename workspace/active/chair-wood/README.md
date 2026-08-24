# chair-wood — Active (Opencode local)

Goal: Custom Bedrock Entity Chair kayu — uji efisiensi kerja MCP via Opencode local (sama seperti Codex local `AGENTS.md:99`)

Approved reference: tidak ada approved image — model generik kursi kayu Minecraft sebagai target awal. Visual gate dengan actual approved image menunggu jika diminta; bukan klaim reference-driven.

Material handoff constraints:
- 16 units = 1 block
- Envelope: 16W × 24H × 14D (base Y=0 lantai), center XZ=0
- Kayu: single 128×128 atlas base #8B4513 + grain, `box_uv` `autouv=0` setelah blockout PASS `docs/foundation/06-texture-standard.md:1`

Current model file: `chair-wood.bbmodel`
- 6 Cubes (4 kaki 2×10×2 + dudukan 16×2×14 + sandaran 16×12×2) dalam 1 Group `chair`
- Efisien: 1× `add_group` + 1× `place_cube(elements=[6])` 1 Undo `mcp/server/tools/cubes.ts:148` `mcp/server/tools/element.ts:152`
- Texture: `assets/chair_wood.png` 128×128 single atlas (provisional, box_uv locked 0 setelah UV audit)

Current next step: Buka `chair-wood.bbmodel` di Blockbench desktop → `capture_model_views` front/back/left/top + `list_textures` UV audit → jika FAIL → `modify_cubes_batch` causal correction; jika PASS → paint kayu produksi.

Known blockers: none — file siap di `workspace/active/chair-wood/` untuk dibuka langsung; MCP live efficiency counter bisa diukur saat Blockbench + `mcp/dist/mcp.js` running.
