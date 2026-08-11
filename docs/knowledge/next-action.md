# Next Action

Updated: 2026-08-11

This is the **single active repository-continuation snapshot**. It does not replace task-class routing in `AGENTS.md` and is not normal asset-authoring boot context.

## Active Goal

Move BlockIT from non-local/source readiness into **bounded Codex + Blockbench local acceptance** without reopening speculative architecture work.

The product question is now behavioral:

> Can Codex use the current BlockIT surface to create/revise a Bedrock Entity model efficiently, make truthful visual decisions, and persist/export the result in real Blockbench?

## Current Status

`NON_LOCAL_PRELOCAL_READINESS_COMPLETE_LOCAL_ACCEPTANCE_REQUIRED`

Working branch: **`Local` only**.

The non-local pass is complete. Current source/contract/CI/generated-doc evidence is ready; live Blockbench/MCP/client behavior is not yet proven.

Do not start another GitHub-only cleanup/reduction slice merely because local acceptance has not run. A new source change now requires a concrete reproduced defect, failing gate, or explicit product requirement with new evidence.

## Current Pre-local Baseline

Pinned-SDK default surface:

```text
62 enabled tools
72,775 tools/list response characters
48,674 input-schema characters
11,800 tool-description characters
```

Default containment remains:

```text
export_model          exposed
list_export_formats   not exposed
apply_texture         not exposed
filter_by_material    not exposed
risky_eval            disabled
from_geo_json         disabled
```

Normal format/output boundary:

```text
project format: bedrock
model outputs: Bedrock geometry JSON + editable .bbmodel
```

Canonical authoring route:

```text
blockit-bedrock-entity-mcp
├─ blockbench-bedrock-modelling
├─ blockit-bedrock-texturing
└─ blockit-bedrock-animation
```

Repository/plugin source changes use `development-brief` plus the smallest relevant engineering specialist.

## Stable Product Invariants

- Tool success is execution evidence, never reference-fidelity approval.
- Visual gates use `FAIL / UNVERIFIED / PASS`; use `BLOCKED` when valid continuation requires guessing or repeated failed work.
- Reuse fresh mutation/create result state before issuing redundant discovery/inspection reads.
- Production texture/animation must not hide unresolved material geometry.
- Preserve native Bedrock capability; do not fake gaps with generic Mesh, risky evaluation, UI automation, or another format.
- Do not add a custom router/profile/readiness framework before local evidence proves the retained architecture is the blocker.

## Local Acceptance Owner

Follow exactly:

[`docs/knowledge/operations/local-acceptance-runbook.md`](operations/local-acceptance-runbook.md)

Codex local should **not replan the repository from scratch**. For repository continuation it should read, in order:

```text
AGENTS.md
→ CONTEXT.md
→ this file
→ operations/local-acceptance-runbook.md
→ mcp/README.md + mcp/AGENTS.md when executing the plugin/runtime checks
```

Open foundation/source/review notes only when a specific acceptance failure needs that owner or evidence.

## Required Local Acceptance Outcomes

The runbook owns details, but completion must establish or explicitly fail/mark unverified:

1. local plugin build/load + stateless endpoint;
2. canonical Bedrock prompt/default surface and native Codex tool exposure/search behavior;
3. representative project/Group/Cube observation and correction;
4. reference-fidelity difference-first behavior, including a front-plausible/depth-wrong case;
5. texture/Paint/PBR/material-instance reachability without relying on disabled `apply_texture`;
6. animation create/inspect/keyframe/playback reachability;
7. Locator + Null Object create/update/inspect/rename/remove behavior;
8. `.bbmodel` save/reopen plus Bedrock export/persistence;
9. efficiency trace: tool purpose, redundant reads/captures, retries, available latency/context data;
10. explicit classification of every local failure before any source fix.

## Stopped / Deferred Source Slices

Do not reopen these during baseline local acceptance unless the live run produces genuinely new evidence that lands directly on that boundary:

- animation action/input contract cleanup;
- Paint cleanup;
- material-instance mutation/read cleanup;
- bounded `nodes://` serialization;
- generic Group identity consolidation;
- `manage_keyframes create` collision slice.

Likewise, do not pre-emptively set `tool_output_token_limit`, mass-trim real Bedrock schemas, or remove retained Animation/Paint/Texture/Locator capability.

## Evidence Boundary

Source/CI proof does not establish:

- actual Blockbench camera/render/Undo behavior;
- usable image delivery to Codex;
- native deferred/tool-search exposure;
- actual prompt/skill co-loading;
- client handling of `structuredContent` vs text result duplication;
- live visual convergence/reference fidelity;
- save/reopen/export round-trip.

Those are now local acceptance questions.

## Next Step

```text
LOCAL — follow operations/local-acceptance-runbook.md
```

Start with the environment/baseline phase. Do not modify source during the baseline run; reproduce and classify a failure first.
