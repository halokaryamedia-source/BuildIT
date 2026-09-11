# Reference Package

Canonical Codex handoff documentation.

```text
schema.md          REFERENCE.json structure and authority
handoff.md         Reference Preparation → Codex handoff semantics
load-contract.md   minimal stage-specific load order and consistency gate
geometry.md        GEOMETRY.md contract
texture.md         TEXTURE.md contract
animation.md       ANIMATION.md contract
```

AI load rule: always start from `schema.md` for package structure, then load only the active stage document. Do not read Geometry, Texture and Animation contracts together unless the task genuinely spans all three.
