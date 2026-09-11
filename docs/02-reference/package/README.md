# Reference Package

Canonical Codex handoff documentation.

```text
schema.md          REFERENCE.json structure, stable facts, scale, readiness
handoff.md         ChatGPT Reference Preparation → Codex boundary only
load-contract.md   minimal stage-specific consumption and fallback loading
geometry.md        GEOMETRY.md projection contract
texture.md         TEXTURE.md projection contract
animation.md       ANIMATION.md projection contract
```

## AI Read Rule

```text
building/validating REFERENCE.json
→ schema.md

handing package from ChatGPT to Codex
→ handoff.md

Codex deciding what package content to load
→ load-contract.md

working on one stage projection
→ only that stage document
```

Do not read Geometry, Texture, and Animation contracts together unless the task genuinely spans all three.

Stage Markdown files are optional when they add no material value. `REFERENCE.json` remains the package entry point and may route stage-relevant images through `images.used_by` even when a stage Markdown file is absent.