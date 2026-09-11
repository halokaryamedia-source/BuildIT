# 02 — Reference Preparation

Owns ChatGPT-side reference preparation and the compact artifacts handed to Codex or other downstream authoring systems.

## AI Read Rule

Do not preload this whole domain.

```text
reference task starts
→ flow.md

need durable evidence/authority rule
→ policy.md

need to generate/edit reference imagery
→ image/README.md

need to author a Bedrock/Snowstorm particle reference asset
→ particle/README.md

need to build/validate/consume Codex package
→ package/README.md
```

`policy.md`, `image/`, `particle/`, and `package/` are conditional owners, not mandatory boot context for every reference request.

## Capability branches

```text
VISUAL / MODEL REFERENCE
→ image/
→ optional package/

PARTICLE / VFX REFERENCE
→ particle/
→ clean Bedrock/Snowstorm particle package
→ optional Codex / MCP handoff
```

The particle branch is a ChatGPT-side reference-authoring capability. It is not part of MCP runtime implementation.

## Boundary

This domain ends when the approved reference artifact/package is ready for downstream use. Actual Blockbench asset authoring belongs to `../03-authoring/`; MCP implementation remains under `mcp/`.
