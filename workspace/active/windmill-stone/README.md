# windmill-stone — Active (Opencode local + MCP live)

Goal: Model kompleks uji Geometri + Texture MCP — Windmill Batu

Approved reference: tidak ada approved image — target generik windmill Minecraft untuk stress-test. Bukan klaim reference-driven.

Material handoff constraints:
- 16 units = 1 block; envelope ~34W × 49H × 20D termasuk blade span
- Material: plester menara (#D8CFC0 + stone lines), atap gelap (#4A3728), blade kayu (#8B5A2B + grain #5C3317), hub besi (#555), pintu (#3E2B1F), jendela (#2B2B2B) — semua di 1 atlas 128×128

Current model file: `windmill_stone.bbmodel`
- 15 Cubes, 3 Groups: mill_tower > mill_roof (nested), mill_blades (rotasi Z 45° origin [0,32,7] → blade pola X)
- Detail: base_ring cobble, menara 4 tingkat meruncing, pintu proud, 3 jendela, hub + 4 blade tipa

MCP session log (33 calls):
1 create_project(128) | 2 add_group BATCH 3 groups 1 Undo | 3 place_cube BATCH 15 cubes 1 Undo
4-5 capture_model_views blockout (4 views) → geometri PASS (X-blades dari group rotation terbukti)
6 create_texture 128 plaster | 7 find_elements_by_criteria (UUID)
8 modify_cubes_batch 15 updates: uv_offset re-layout anti-overlap + autouv lock 0 — 1 Undo
9-29 draw_shape_tool ×21: box-fill material per cube (1 rect = 6 face) + stone lines + wood grain + door planks
30 get_texture atlas verify | 31 capture final front+3q → PASS visual | 32-33 export bbmodel + geo.json

Efisiensi terbukti: add_group batch 3→1 call, place_cube 15→1 call, modify_cubes_batch 15→1 call, box-fill paint 6 face→1 call.
Friksi ditemukan: (1) autouv batch harus string "0" bukan number — schema enum vs ergonomi; (2) fill_color union RGBA/HEX ambigu saat array; (3) draw_shape tidak punya mode line — grain pakai rect 1px; (4) export format param bernama codec_id bukan format.

Current next step: selesai untuk scope uji. Lanjutan opsional: blade lattice detail, uv_offset mirror untuk blade simetris, atau animasi rotasi blade (butuh blockit-bedrock-animation).

Known blockers: none.
