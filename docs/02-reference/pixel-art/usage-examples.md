# Pixel Art Usage Examples

These examples clarify routing only. They are not fixed visual presets.

## Example: small tool icon

Request:

```text
buat ikon sabit untuk perkebunan
```

Route:

```text
ICON
→ target mode from current project/style
→ smallest viable icon grid
→ iconography.md
→ silhouette + palette/cluster authoring
→ qa.md
```

## Example: Minecraft-native item

Request:

```text
buat botol bensin pixel art gaya Minecraft
```

Route:

```text
OBJECT / PROP
→ MINECRAFT_NATIVE
→ object-prop.md
→ minecraft-compatibility.md
→ QA
```

## Example: convert user image

Request:

```text
ubah referensi kamera ini menjadi icon pixel art
```

Route:

```text
REFERENCE INPUT
→ ICON
→ reference-conversion.md
→ iconography.md only when icon-specific decision is needed
→ QA against identity
```

## Example: consistent icon family

Request:

```text
lanjut buat fishing rod dengan style icon sebelumnya
```

Route:

```text
ICON
→ reuse established Style Lock
→ iconography.md
→ style-lock.md only when consistency needs diagnosis/change
→ QA including STYLE LOCK
```

## Example: particle texture

Request:

```text
buat texture pixel untuk particle api biru
```

Route:

```text
PIXEL ART texture asset
→ target grid + alpha contract
→ palette/material as needed
→ clean asset
→ handoff minimal texture state to Particle Authoring
```

Particle physics remain Particle-owned.

## Example: model texture concept

Request:

```text
buat konsep texture pixel untuk rak kayu ini
```

Route:

```text
TEXTURE_REFERENCE
→ reference-conversion.md when source image exists
→ texture-reference.md
→ palette/material.md as needed
→ handoff to LazyDesigner Texturing
```

Actual UV/mapped texture production remains Texturing-owned.