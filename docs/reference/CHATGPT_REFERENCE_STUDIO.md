# ChatGPT Reference Studio

BuildIT separates reference creation from Blockbench production.

## Flow

```text
ChatGPT Reference Studio
source image
→ approved Production Context
→ approved Sheet 01
→ approved Sheets 02–04
→ approved stage contracts
→ manifest and Codex handoff
→ final reference ZIP

Codex + MCP-Blockbench
final reference ZIP
→ workspace import
→ Geometry
→ Texture
→ optional Animation
→ Final Validation
```

The canonical ChatGPT skill is:

```text
engines/chatgpt/skills/blockbench-reference-studio/SKILL.md
```

It is documentation and execution guidance for ChatGPT. It is intentionally not copied into `.codex/skills/`, `.agents/skills/`, or the runtime production skill registry.

## Required handoff archive

```text
<asset_id>_blockbench_reference.zip
```

The archive contains the approved source package, four visual sheets, Production Context, four stage contracts, a machine-readable manifest, and the Codex handoff.

See:

- `engines/chatgpt/README.md`
- `engines/chatgpt/skills/blockbench-reference-studio/references/FLOW.md`
- `engines/chatgpt/skills/blockbench-reference-studio/references/CODEX_HANDOFF_CONTRACT.md`

## Golden sample rule

A Golden Sample is not inferred from loose images or partial notes. It must be a complete approved reference package that satisfies the same archive contract.

Until such a package exists, runtime generation must stop with:

```text
BLOCKER: GOLDEN_SAMPLE_REQUIRED
```
