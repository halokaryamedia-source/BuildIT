# Texture and UV Rules

## Texture Terms

Do not mix these terms:

| Term | Meaning | Allowed values |
| --- | --- | --- |
| Atlas size | Texture canvas size / image file dimensions | `64x64`, `128x128`, `256x256`, `512x512` |
| Pixel style | Minecraft pixel-art detail density | `16x style`, `32x style` |
| Pixel density | How many texture pixels are spent per visible model area | Must stay consistent within an asset |

Examples:

- A model can use a `128x128` atlas with `16x style`.
- A model can use a `256x256` atlas with `32x style`.
- Do not say `64x style` unless the user explicitly wants high-density texture style. Usually `64x64` means atlas size, not pixel style.

## Default Texture Policy

- Choose atlas size from asset complexity: `64x64`, `128x128`, `256x256`, or `512x512`.
- Choose pixel style separately: default Minecraft `16x style` or cleaner higher-detail `32x style`.
- For most marketplace-grade Bedrock Entity work:
  - simple/medium props: `64x64` or `128x128` atlas, `16x style`
  - humanoids/armor/medium entities: `128x128` atlas, `16x style` or `32x style`
  - vehicles/large creatures/bosses: `256x256` or `512x512` atlas, usually `32x style`
- Larger atlas does not automatically mean smoother or more realistic texture.
- Pixel style must remain blocky and stepped unless explicitly approved otherwise.

## Texture Consistency

- Use a consistent palette and shading style for one asset.
- Keep lighting direction consistent.
- Avoid mixing pixel densities across parts.
- Use texture detail for small features instead of geometry when practical.

## UV Layout Rules

- Keep UV islands readable and aligned to pixel boundaries where possible.
- Avoid stretching, squashing, and accidental mirroring.
- Leave enough separation between regions when texture bleeding is likely.
- Use per-face UVs when an atlas or furniture-style layout needs explicit control.

## Mixels and Pixel Density

- Avoid mixels: do not combine incompatible pixel densities in the same asset.
- Match visible parts to the selected atlas size and pixel style.
- Recheck small details from gameplay distance.

## Naming Convention

- Use lowercase descriptive texture names.
- Prefer asset-scoped names such as `oak_chair_base` or `crystal_golem_body`.
- Avoid temporary names in exported deliverables.

## Export Considerations

- Confirm texture output path.
- Confirm model references the expected texture names.
- Confirm animation exports do not reference missing textures.
- Recheck UVs after export when the target format changes.

## Acceptance Criteria

- Texture size and naming are documented.
- Atlas size and pixel style are documented separately.
- UV stretching and pixel density are checked.
- Mixels are avoided or explicitly approved.
- Exported model references the expected texture files.
- Texture clarity is verified through screenshots.
