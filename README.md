# BlockIT Workspace

BlockIT is an AI-assisted Minecraft Bedrock modelling workspace. The user gives a simple request and an approved visual reference; Codex reasons about the model as a modeller, then uses the Blockbench MCP as a focused execution, inspection, and recovery interface.

## Product Goal

Produce a clean, editable `.bbmodel` that follows the approved reference with the shortest evidence-backed workflow.

The product is **object-agnostic**. Animals, props, mechanical objects, block assets, and other supported Bedrock models use the same general modelling rules. A test fixture or sample must never become an object-specific runtime rule.

## Official Modelling Flow

```text
User request
→ Approved Model Reference
→ Reference buildability check
→ Whole-form interpretation
→ Primary Geometry Pass
→ Primary visual gate
→ Secondary geometry / hierarchy / pivots
→ Full geometry review
→ UV / texture
→ Optional animation
→ Final validation
→ Save .bbmodel
```

Key rules:

- understand the whole form before choosing individual Cubes;
- plan globally, then execute in the attachment/dependency order appropriate to the object;
- use the minimum useful geometry needed for silhouette, volume, attachment, or motion;
- do not add detail before the primary form is recognizable;
- one concrete visual issue gets one targeted correction; if the same direction still fails, replan instead of adding compensating geometry;
- MCP success or a valid file is not proof of visual quality.

## Development Channels

The same repository rules support both workflows:

- **ChatGPT → GitHub:** ChatGPT reads the repository rules and edits through the connected GitHub repository. Do not assume local shell, Blockbench runtime, or local skill installation.
- **Codex local:** Codex uses the same repository contract with local build/test/runtime proof only when relevant and available.

The goal, scope, POVs, and acceptance criteria stay the same across both channels. Only the available proof changes. Do not add validation work merely because a tool or test exists.

## Repository Map

- `mcp/` — active Blockbench MCP plugin source, tools, runtime, UI, build, prompts, and resources.
- `mcp/.agents/skills/` — workspace skills that are actually checked into the current `Local` branch.
- `workspace/` — active and saved Blockbench project packages and fixtures.
- `docs/foundation/` — product, modelling, reference, and validation policy.
- `docs/knowledge/next-action.md` — single active-task snapshot.

Do not invent or depend on repository paths that are not present in the current checkout.

## Where to Start

This boot order is mandatory for both ChatGPT → GitHub and Codex local work:

1. Read `AGENTS.md`.
2. Read `CONTEXT.md`.
3. Read `docs/knowledge/next-action.md`.
4. Read only the relevant `docs/foundation/` rule and affected source.
5. For Developing, read and apply `mcp/.agents/skills/development-brief/SKILL.md`; do not rely on ChatGPT product skill auto-discovery for a repo-local skill.
6. Load one additional specialist only when it adds real domain value.

## Branch Roles

- `Local` — current product and development authority.
- `Rework` — historical architecture/reference material only.
- `Sample` — external implementation/reference material only.

Do not merge behaviour from `Rework` or `Sample` into `Local` just because it is more elaborate. Adopt only a bounded pattern that solves a demonstrated `Local` problem and can be proved.
