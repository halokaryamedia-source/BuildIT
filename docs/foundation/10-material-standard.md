# Material Standard

## Purpose

Material authoring is optional. A normal Minecraft-style entity can remain on the single production color atlas with no PBR material at all. Create a PBR material only when the asset actually needs normal/height, metalness, emissive, roughness, or subsurface behavior.

The material workflow must stay easy to reason about and must not fragment the normal texturing path.

## Canonical authoring route

```text
list_materials
  → get_material_info(one material)
  → manage_material(create/configure/assign_channel)
  → list_textures validation
  → material preview / mapped model evidence
  → manage_material(save)
```

`manage_material` remains the single mutation boundary. `list_materials` is the compact overview; `get_material_info` is the one-material diagnostic read. `manage_material_instances` is a separate per-face override mechanism and does not replace PBR channel configuration.

## Material sources

A material has three semantic source groups:

### Color

Use exactly one of:

- a color texture; or
- uniform RGBA.

Do not create a second color atlas merely because the model has several visual materials. The standard entity path remains one production base-color atlas.

### Depth

Use at most one:

- normal texture; or
- height texture.

`normal XOR height` is a hard material invariant. A normal texture represents surface directions in RGB. A height texture is grayscale displacement evidence. Do not place a grayscale height map into the normal channel or use normal and height simultaneously.

### Surface response

MER is RGB:

- **R** = Metalness
- **G** = Emissive
- **B** = Roughness

A MER texture with `subsurface_value=0` exports as normal MER behavior.

**MER texture + subsurface_value>0** selects the Bedrock MERS texture-set form. The texture still uses Blockbench's `mer` channel, but alpha is now semantically meaningful:

- **R** = Metalness
- **G** = Emissive
- **B** = Roughness
- **A** = Subsurface

Do not invent a separate Blockbench MERS texture channel while the native API represents it as MER plus subsurface configuration.

Uniform MER/MERS is also valid when no MER texture is required.

## `authoring_status`

Material reads and mutation receipts should expose one compact `authoring_status` instead of forcing the caller to reconstruct state from several arrays.

It separates:

- `sources.color` — texture / uniform / unresolved;
- `sources.depth` — normal texture / height texture / none;
- `sources.surface` — MER texture / MERS texture / uniform / default;
- `readiness.preview` — whether channel semantics are internally coherent;
- `readiness.save` — whether a native texture-set save target exists and whether it is already saved;
- `next_actions` — only the remaining material steps.

A valid preview does not imply a writable export path. Native Blockbench derives the `.texture_set.json` save location from the material's color texture path. Therefore `save.path_ready=false` is not a material-quality failure; it means the native save target has not been established yet.

## PBR content diagnostics

Technical membership alone is insufficient. Active PBR maps receive bounded semantic diagnostics:

- normal-map RGB sanity;
- height-map grayscale sanity;
- MER/MERS channel interpretation;
- MERS metalness/subsurface overlap review.

These diagnostics are not artistic scores. They must not reject valid stylized maps merely because the distribution is unusual.

### Normal

A flat tangent-space normal is approximately `(128,128,255)`. Normal maps should generally behave as encoded vectors rather than grayscale photographs. A mostly grayscale normal map is therefore a strong channel-mismatch candidate.

### Height

Height maps represent scalar height and should be grayscale. Meaningful RGB channel divergence is a review signal.

### MER / MERS

Partial metalness is allowed and is advisory only. Emissive coverage and roughness distribution are descriptive evidence. For MERS, significant simultaneous metalness and subsurface at the same pixels is a review candidate because physically these behaviors usually represent different surface classes.

## Seam continuity

Texture completion is not proven by per-face coverage alone. `list_textures.seam_continuity` samples a small bounded set of physical cube edges and ranks high-contrast or alpha-discontinuous seams.

Seam evidence is **advisory**:

- never auto-fix a seam;
- never convert seam contrast alone into visual FAIL;
- intentional face lighting, panel boundaries, trim, or material changes may legitimately differ;
- inspect only ranked candidates against the approved reference and current mapped model views.

The diagnostic uses edge samples only; it must not add another full-atlas scan.

## Reference identity

`get_texture.color_profile` can support palette and value reasoning, but it is evidence rather than a similarity score. Preserve identity colors and accents visible in the approved reference, especially after broad palette/value passes. Do not enforce arbitrary color counts or automatic percentage similarity.

## Material validation order

```text
channel membership
  → production atlas alignment
  → PBR content sanity
  → seam/coverage advisories
  → material preview
  → mapped model-view verification
  → save
```

Technical `ready` never means visually approved. Final quality remains evidence-based and requires the current atlas/model appearance to match the intended material treatment.

## Efficiency contract

- no new MCP tool is required for these diagnostics;
- no new runtime dependency is required;
- seam scanning is bounded edge sampling;
- PBR-content scanning runs only for active PBR support textures and uses a bounded sample budget;
- material status is metadata-only;
- normal non-PBR texturing pays no PBR content-analysis cost beyond discovering that no active PBR maps exist.
