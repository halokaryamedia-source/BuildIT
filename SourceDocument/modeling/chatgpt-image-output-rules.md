# ChatGPT Image Output Rules

Workflow note: use this whenever ChatGPT/GPT image or another external image generator creates separate reference sheets. Codex still validates the final package with notes, manifest, handoff, and gates.

Use this to prevent reference images from being merged into one wrong combined image.

## Core Rule

Every planned filename is a separate output.

If the plan contains 8 filenames, the correct result is 8 separate images or 8 separate image prompts.

Do not combine multiple planned files into one image.

## Correct Output Pattern

Generate or prompt only the current filename:

```text
Now create only:
01_[asset]_orthographic_views.png

Do not include:
02_[asset]_scale_sheet.png
03_[asset]_silhouette_sheet.png
04_[asset]_part_breakdown_sheet.png
05_[asset]_color_palette_sheet.png
06_[asset]_closeup_detail_sheet.png
07_[asset]_execution_target_sheet.png
08_[asset]_animation_pivot_sheet_optional.png
```

After the user approves, continue with the next filename.

## Wrong Output Pattern

Do not create:

- one mega-sheet containing all planned references
- one collage containing 01 through 08
- one contact sheet
- one grid/poster with all reference types
- one image with orthographic, scale, silhouette, palette, texture, and do/don't all together

## Allowed Internal Panels

Panels are allowed only inside the current file.

Examples:

- `01_[asset]_orthographic_views.png` may contain front, side, back, top, and 3/4 panels.
- `03_[asset]_silhouette_sheet.png` may contain front, side, back, and small-size silhouettes.
- `05_[asset]_color_palette_sheet.png` may contain swatches and material labels.

But `01_[asset]_orthographic_views.png` must not also contain the scale sheet, silhouette sheet, palette sheet, close-up sheet, execution target sheet, or pivot sheet.

## Required Self-Check Before Each Image

Before generating or writing the prompt, verify:

- Current filename:
- This output contains only that filename's content:
- Other planned filenames excluded:
- No collage/contact-sheet/mega-sheet:
- Sample designs not copied:

If any check fails, stop and rewrite the prompt before generating.

## If The User Asks For Multiple Images

Treat the request as a queue:

```text
I will create these as separate outputs in order.
First output: 01_[asset]_orthographic_views.png only.
```

Do not compress the queue into one image.
