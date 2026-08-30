# BlockIT

BlockIT is an AI-assisted **Minecraft Bedrock Entity** modelling workspace built around a local Blockbench MCP plugin.

**Project snapshot:** `v0.1` (separate from the MCP package version).

## Branch Model

```text
Local  → active development / working authority
main   → changes only by explicit instruction
```

Routine repository development uses `Local`. Repository behavior is routed by `AGENTS.md`; GitHub execution/history/CI rules are owned by `GITHUB_RULES.md`.

## Product Flow

```text
1. PREPARE REFERENCE
2. AUTHOR BEDROCK MODEL
3. FINISH ASSET
```

Reference-driven work is Minecraft-first: preserve recognizability, primary masses/counts, topology/attachment, important negative spaces, texture identity, and Blockbench/Bedrock buildability. Tool success is execution evidence, not visual approval.

## Current Product Surface

The retained normal Bedrock catalog contains **65 callable tools across authoring phases**. Startup exposes only **MCP Core + exactly one active authoring phase**; default **Geometry** currently exposes **28 tools**.

Current source covers Cube/Group authoring, texture/Painter/PBR/material instances, Bedrock animation and AnimationController mutation, Locator/Null Object lifecycle, Undo/history, editable `.bbmodel`, and Bedrock geometry export.

Retained hardening includes coherent Cube placement batching, coherent Group batching, explicit project UV resolution selection (`128` default, `256` opt-in), source-level texture/paint fixes, and compact result/discovery discipline. Generic fallback families remain opt-in; `risky_eval` and `from_geo_json` remain disabled.

Protected gaps remain controller blend-curve mutation, TextureMesh direct authoring/inspection, native visible bounding-box fields, animated-texture authoring, and bone-binding expressions.

## Evidence Boundary

Do not encode transient continuation or CI state here.

- stable project facts → `CONTEXT.md`
- repository/plugin continuation → `docs/knowledge/next-action.md`
- current proof state → `docs/foundation/validation-report.md`
- exact current source/tool ownership → `docs/knowledge/implementation-map.md`

Static source/CI proof does not prove live Blockbench visual fidelity, playback, persistence, or model-quality improvement unless that exact surface actually ran.

## Repository Map

```text
.agents/skills/    task/domain specialists loaded only when relevant
docs/foundation/  durable authoring policy + current proof owner
docs/knowledge/   current flow, continuation, source ownership, local procedure
mcp/              Blockbench MCP plugin/runtime/build/tests/generated API docs
workspace/        persistent active/saved asset packages
Experimental/     bounded research/proof harnesses only
```

Generated/transient captures and sample renders are not repository-root source artifacts. Persistent visual/project evidence belongs with its owning workspace or experimental package; temporary output stays in ignored cache paths.

## Asset Workspace

Persistent asset continuity lives under `workspace/`. `workspace/README.md` is the workspace contract.

An active package should contain only resume-critical current state. Prefer one current editable `.bbmodel` per asset package; Git history owns discarded iterations and transient test models. Stored reference paths are provenance only until the actual image is visible in the active modelling context.

## MCP Development

From `mcp/`:

```bash
bun install --frozen-lockfile
bun run typecheck
bun run test
bun run measure:surface
bun run build
bun run docs:check
```

Development watch mode builds only:

```bash
bun run dev:watch
```

Deployment/loading into desktop Blockbench is a separate explicit local action; a normal watch build must not silently overwrite the installed plugin.

## Contributing

Repository development conventions, verification routing, commit discipline, and transient-file rules are documented in `CONTRIBUTING.md`.

Historical audits, test-model iterations, retired decisions, and obsolete continuation belong in Git history rather than parallel current-state files.

## License

BlockIT is distributed under the GNU General Public License v3.0. See `LICENSE` for the full terms.
