# Next Action

Updated: 2026-08-11

This is the **single active-task snapshot**. New ChatGPT/Codex sessions read:

`AGENTS.md` → `CONTEXT.md` → this note.

## Active Goal

Maintain BlockIT as a trustworthy **Minecraft Bedrock Entity MCP for Blockbench**. The primary product test is whether Codex can create or revise a clean, editable Bedrock Entity model that follows the approved reference without false visual approval, speculative geometry, or unnecessary MCP calls.

Preserve capability that genuinely belongs to Bedrock Entity. Generic inherited Blockbench capability is not a compatibility requirement, while missing native Bedrock coverage remains a protected gap rather than deletion permission.

## Current Status

`NON_LOCAL_PRELOCAL_READINESS_COMPLETE_LOCAL_ACCEPTANCE_REQUIRED`

Working branch: **`Local` only**.

The bounded non-local pass is complete. Source, contract, CI, generated-doc, official-source, and pinned-SDK evidence are ready; live Codex/Blockbench behavior is not yet proven. Do not add more GitHub-only architecture merely to continue activity. A new non-local change now requires a concrete source defect, failing gate, or explicit product requirement with new evidence.

## Completed Non-local Boundary

```text
P0.1–P0.5  stabilization / engineering gates                    COMPLETE
P1.1       default Bedrock Entity registration profile          COMPLETE
P1.2       explicit family gates                                COMPLETE
P1.3       identity + mutation-result ownership                 COMPLETE
P1.4       stateless transport source/CI proof                  COMPLETE; LOCAL PROOF REQUIRED
P1.5       end-to-end acceptance                                LOCAL PROOF REQUIRED
```

Pre-local work also completed the Bedrock-only prompt/skill stack, generic-semantics containment, project/export lifecycle hardening, numeric/discovery boundaries, minimum-evidence routing, context/payload cleanup, and source-level Locator/Null Object coverage.

Current pinned-SDK default surface:

```text
62 enabled tools
72,775 tools/list response characters
48,674 input-schema characters
11,800 tool-description characters
```

`export_model` remains exposed. `list_export_formats`, `apply_texture`, and `filter_by_material` remain absent from the default callable surface.

Detailed implementation history belongs in Git history and the relevant reviews, not in this file:

- `docs/knowledge/reviews/model-creation-effectiveness-audit-2026-08-10.md`
- `docs/knowledge/reviews/codex-native-deferred-mcp-tool-loading-2026-08-11.md`
- `docs/knowledge/reviews/bedrock-entity-capability-surface-matrix.md`
- `docs/knowledge/decision-log.md`

## Stable Product Boundaries

- target format: `bedrock`;
- normal geometry: Cubes/Cuboids organized by Groups/bones;
- normal model outputs: Bedrock geometry JSON and editable `.bbmodel`;
- default profile: `bedrock_entity`;
- `risky_eval` and `from_geo_json` remain disabled;
- generic fallback families remain explicit opt-in only;
- canonical workflow prompt: `bedrock_entity_workflow`;
- authoring routing: `blockit-bedrock-entity-mcp` → modelling / texturing / animation specialists;
- tool success is execution evidence, never reference-fidelity proof;
- visual gates use `FAIL / UNVERIFIED / PASS`; `BLOCKED` is valid when continuation would require guessing or repeated failed work;
- production texture/animation must not hide unresolved geometry;
- no custom tool router, geometry-only default profile, readiness state machine, scoring layer, or capability pruning without local evidence that the retained architecture is the blocker.

Locator and Null Object direct source ownership is implemented in the existing Elements family, but create/update/inspect/rename/remove plus save/reopen/export round-trip still require local proof.

`nodes://` remains transitional observability while TextureMesh lacks a direct owner. Protected native gaps remain TextureMesh direct authoring/inspection, native visible bounding-box fields, animation controllers, animation sound/timeline effects, animated-texture authoring, and bone-binding expressions. Do not fake them with generic Mesh, arbitrary Cubes, UI automation, risky evaluation, or another format.

## Stopped / Deferred Source Slices

Do not reopen these merely because local acceptance has not started:

- animation action/input contract cleanup;
- Paint cleanup;
- material-instance mutation/read cleanup;
- bounded `nodes://` serialization;
- generic Group identity consolidation;
- `manage_keyframes create` collision slice.

They require genuinely new evidence or an explicit product requirement. Likewise, do not pre-emptively set `tool_output_token_limit`, mass-trim real Bedrock schemas, or default-disable retained Animation/Paint/Texture/Locator capability.

## Evidence Boundary

Source/CI proof does not establish live Blockbench behavior, model quality, or actual Codex call efficiency. The remaining questions require the real local client/runtime:

- whether native Codex deferred/tool search materially reduces model-visible tool exposure while retained domains remain reachable;
- which prompt/skills are actually co-loaded and whether context duplication occurs in practice;
- whether duplicated text plus `structuredContent` can be reduced without losing client-visible evidence;
- whether modelling follows the difference-first visual gate and stops false PASS / speculative correction loops;
- whether save/reopen/export and Locator/Null Object round-trips are correct in Blockbench.

## Next Step

```text
LOCAL — Codex + Blockbench acceptance
```

Run bounded acceptance, not another source redesign:

1. record installed Codex version, active model/provider, Blockbench/BlockIT build, and endpoint;
2. prove native deferred/tool-search exposure and representative geometry + texture + animation/Locator reachability;
3. run a difficult reference through coarse primary geometry → difference-first visual gate;
4. force a front-plausible / side-depth-wrong case and require `FAIL` or `UNVERIFIED`, never false full `PASS`;
5. run one diagnosed local mismatch through invariant-backed correction → returned structural effect → fresh visual proof;
6. verify unresolved evidence/capability/repeated-correction paths end as `BLOCKED` instead of speculative mutation;
7. verify geometry `FAIL` prevents production texture/animation, then test accepted geometry → texture → animation sequencing;
8. record tool calls by purpose, redundant reads/captures, retries, latency/context, and actual prompt/skill loading;
9. A/B one high-frequency structured result only if the trace proves duplicated result text is material;
10. verify stateless endpoint plus Locator/Null Object operations and Bedrock save/reopen/export round-trip.

If the local environment is unavailable, stop here unless a concrete new source defect or explicit requirement appears.
