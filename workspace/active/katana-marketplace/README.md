# katana-marketplace — Active (Opencode local + MCP live, Fase 3 proof)

Goal: Bukti Fase 1 — model setara pola sample marketplace via MCP murni

Approved reference: tidak ada approved image — replikasi pola konstruksi sample (katana), bukan replika aset. Bukan klaim reference-driven.

Material handoff constraints:
- 16 units = 1 block; tinggi total 53 units (~3.3 block)
- Material: blade steel (#C8D4E8 + edge #F0F4FF + hamon line), tsuka navy (#2F3542), wraps gelap berlapis, tsuba bronze (#8B6F3E)
- Density 2×: UV 128 → PNG 256

Current model file: `katana_marketplace.bbmodel`
- 9 Cubes, 7 Groups; rantai nested blade_1 > blade_2 > blade_3 > blade_tip, pivot sendi + rotasi kumulatif [2,2,2,4]° → kurva katana
- Inflate layering: wrap_lower (+0.1), wrap_upper (+0.2) di atas tsuka
- Mirror pair: tsuba_left/right dengan mirror_uv=true
- Locator `hold_point` di [0,5,0] (anchor genggam)
- UV re-layout shelf-pack 9 cube (anti partial-overlap) + autouv lock, 1 Undo
- PAINT ECONOMY: 9 box-fill (1 rect = 6 face) + 6 aksen

MCP session (29 calls): create_project → add_group batch 7 → place_cube batch 9 (2× fail-closed name-collision guard) → manage_locator → list_textures audit (302 overlap) → create_texture 256 → find_elements → modify_cubes_batch re-layout → draw_shape ×15 → get_texture + capture → export ×2

Pola Fase 1 terbukti live: segment chain curve ✓, inflate layering ✓, mirror pair ✓, locator ✓, density 2× ✓, box-fill ✓, fail-closed guard ✓, consent gate ✓ (sword_curve user project tidak disentuh)

Current next step: user judge visual final; opsional blade edge highlight per-face atau animasi draw/slash (blockit-bedrock-animation).

Known blockers: none.
