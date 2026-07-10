# ChatGPT Reference Context Package

Start here after uploading this ZIP to ChatGPT.

## What This Package Is For

Use this package to generate Minecraft Bedrock / Blockbench reference images and supporting notes.

Visual reference generation may be done by ChatGPT/GPT image, Codex image tools, API tools, or manually by the user. The generator does not matter. The output must still pass the same reference package gates.

## Required Flow

1. Read `SYSTEM_READ_FIRST.md`.
2. Read `START_AFTER_UPLOAD.md`.
3. Read `00_START_HERE_UPLOAD_THIS_TO_CHATGPT.md`.
4. If the source image is not Minecraft style, read:
   - `supporting_docs/minecraft-style-image-conversion-preflight.md`
   - `supporting_docs/minecraft-style-image-conversion-rules.md`
   - `supporting_docs/minecraft-style-image-conversion-mandatory-prompt.md`
5. Ask the user the missing brief questions before generating.
6. Generate one reference file at a time.
7. Produce matching `.notes.md` for every generated image.
8. Produce `reference_manifest.json`.
9. Produce `CODEX_REFERENCE_HANDOFF.md`.

## Key Rule

For non-Minecraft source images, do not generate immediately. Run the conversion preflight first. Generate only after the preflight is `PASS`.

## Active Reference Format

Use the 8-sheet package:

```text
01 orthographic views
02 scale
03 silhouette
04 part breakdown
05 color / texture
06 close-up detail
07 execution target
08 pivot optional
```

## Samples

- `ninja-master-bedrock-entity/`: approved calibration package from real Blockbench source views.
- `sample_reference_images_kangaroo_format_only/`: legacy layout reference only.
- `blockbench_samples/`: `.bbmodel` structure calibration only.

Do not copy sample asset identity unless the user explicitly asks for that exact asset.
