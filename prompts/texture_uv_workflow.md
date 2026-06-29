# Per-Face UV Texture Workflow

Use **per-face UV** when painting custom texture atlases for furniture, items, multi-part blocks, or any model where faces need explicit pixel regions on the texture.

Use **box UV** for compact Minecraft-style models where Blockbench auto-packs faces into a box layout.

## UV Modes

Blockbench projects have a default UV mode (Settings > UV > Default UV Mode):

- **Box UV** (`box_uv: true`) — cubes share a box layout; use `uv_offset` and auto UV
- **Per-face UV** (`box_uv: false`) — each face has its own `[u1, v1, u2, v2]` rectangle

## Recommended Workflow (Per-Face)

1. **Create project with per-face UV**
   ```
   create_project:
     name: "sofa"
     format: "bedrock_block"
     box_uv: false
     texture_width: 64
     texture_height: 64
   ```

2. **Verify UV mode**
   ```
   get_project_info  →  uv.mode should be "per_face"
   ```

3. **Place cubes with explicit face UVs**
   ```
   place_cube:
     elements: [{ name: "seat", from: [...], to: [...], origin: [...] }]
     faces:
       - { face: "up", uv: [0, 0, 16, 16] }
       - { face: "north", uv: [16, 0, 32, 8] }
   ```

4. **Export layout before painting**
   ```
   get_uv_layout  →  returns all face rects and texture references
   ```

5. **Create texture and paint**
   ```
   create_texture: { name: "sofa", width: 64, height: 64 }
   ```
   Use paint tools to fill each UV region according to `get_uv_layout` output.

6. **Adjust UVs after placement**
   ```
   set_cube_face_uv:
     id: "seat"
     faces: [{ face: "up", uv: [0, 0, 16, 16] }]
   ```
   Or use `modify_cube` with a `faces` array.

## Switching an Existing Project

```
configure_project:
  box_uv: false
  texture_width: 64
  texture_height: 64
```

After switching from box to per-face, re-assign face UV rects on existing cubes with `set_cube_face_uv`.

## Tools Reference

| Tool | Purpose |
|------|---------|
| `create_project` | Set initial `box_uv`, `texture_width`, `texture_height` |
| `configure_project` | Change UV mode or resolution on open project |
| `get_project_info` | Check `uv.mode`, resolution, format support |
| `place_cube` | Place with `{ face, uv }[]` for explicit rects |
| `modify_cube` | Update face rects via `faces` parameter |
| `set_cube_face_uv` | Set or batch-update face UV rectangles |
| `get_uv_layout` | Export full UV map for texture painting |

## Tips

- UV coordinates are in **texture pixel space** (0 to texture_width/height)
- Set `autouv: 0` (disabled) when using explicit face rects — tools do this automatically
- Call `get_uv_layout` before and after geometry changes to keep texture painting in sync
- Box UV remains ideal for standard Minecraft block/item models with tight atlases
