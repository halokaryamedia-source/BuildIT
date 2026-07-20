# Documentation

| Path | Purpose |
| --- | --- |
| `architecture/SYSTEM_FOUNDATION.md` | Selected bounded contexts, modules, interfaces, seams, invariants, testing strategy, and readiness destination. |
| `architecture/FOUNDATION_AUDIT.md` | Critical product, user, developer, testing, routing, operational, and security assessment. |
| `adr/` | Hard-to-reverse architectural decisions and rejected alternatives. |
| `product/` | Product overview, installation, and usage. |
| `workflow/` | Human-readable production Stages and review flow. |
| `architecture/` | Repository, runtime, module, and integration architecture. |
| `integrations/` | ChatGPT, Codex, development-skill, and external-tool integration notes. |
| `reference/` | Reference Package guidance, Reference Studio flow, and approved examples. |
| `project/` | Contribution and repository guidance. |
| `legacy/` | Historical index only; never active authority. |
| `api/` | Generated MCP API documentation; do not edit generated files manually. |

## Foundation entry points

```text
CONTEXT-MAP.md
→ docs/architecture/SYSTEM_FOUNDATION.md
→ openspec/changes/buildit-system-foundation/
→ docs/architecture/FOUNDATION_AUDIT.md
```

## Product entry points

Reference creation starts from:

```text
engines/chatgpt/skills/blockbench-reference-studio/SKILL.md
```

The approved Reference Package is handed to Codex/MCP Blockbench for staged production. See `reference/CHATGPT_REFERENCE_STUDIO.md` and `engines/codex/BOOTSTRAP.md`.

Repository development starts from `engines/codex/DEVELOPMENT_BOOTSTRAP.md`. It loads only the bounded context, active OpenSpec change, and engineering/context skills required by the current Task Kind; it does not load the entire documentation tree.
