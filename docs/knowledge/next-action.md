# Next Action

Updated: 2026-08-12

This is the **single active repository-continuation snapshot**. It does not replace task-class routing in `AGENTS.md` and is not normal asset-authoring boot context.

## Active Goal

Keep the locally accepted BlockIT baseline stable and wait for the next explicit product requirement.

The first bounded Codex + Blockbench local acceptance pass is complete.

## Current Status

`LOCAL_ACCEPTANCE_COMPLETE`

Working branch: **`Local` only**.

Live Blockbench proof now covers stateless MCP transport, representative geometry and correction/Undo, texture/Paint/PBR/material-instance reachability, animation create/inspect/timeline/playback, Locator and Null Object lifecycle, reference-fidelity refusal of a false 3D PASS, and `.bbmodel`/Bedrock export persistence.

Two reproduced defects were fixed locally: discriminated-union tool schemas were advertised as empty objects, and `create_animation` did not select the created animation for timeline operations. The active Codex task retained a stale pre-reload tool catalog even though the live endpoint exposed the correct 62-tool surface; that is a client-task cache limitation, not an open BlockIT source defect.

Repository hygiene is also complete: standalone-upstream/editor residue, duplicate planning layers, and tracked transient preview caches have been removed. Current source/runtime capability was not pruned by this cleanup.

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

## Local Acceptance Evidence

Completed procedure:

[`docs/knowledge/operations/local-acceptance-runbook.md`](operations/local-acceptance-runbook.md)

Future repository work should **not replan the repository from scratch**. Read, in order:

```text
AGENTS.md
→ CONTEXT.md
→ this file
→ operations/local-acceptance-runbook.md
→ mcp/README.md + mcp/AGENTS.md when executing the plugin/runtime checks
```

Open foundation/source/review notes only when a specific acceptance failure needs that owner or evidence.

## Completed Local Acceptance Outcomes

The local pass established:

1. local plugin build/load + stateless endpoint;
2. canonical Bedrock prompt/default surface and representative domain reachability, with catalog-refresh behavior recorded `UNKNOWN`;
3. representative project/Group/Cube observation and correction;
4. reference-fidelity difference-first behavior, including a front-plausible/depth-wrong case;
5. texture/Paint/PBR/material-instance reachability without relying on disabled `apply_texture`;
6. animation create/inspect/keyframe/playback reachability;
7. Locator + Null Object create/update/inspect/rename/remove behavior;
8. `.bbmodel` save/reopen plus Bedrock export/persistence;
9. sparse, purpose-driven calls with retries recorded only for concrete response/path mistakes;
10. explicit classification of every local failure before source repair.

## Stopped / Deferred Source Slices

Do not reopen these during baseline local acceptance unless the live run produces genuinely new evidence that lands directly on that boundary:

- animation action/input contract cleanup;
- Paint cleanup;
- material-instance mutation/read cleanup;
- bounded `nodes://` serialization;
- generic Group identity consolidation;
- `manage_keyframes create` collision slice.

Likewise, do not pre-emptively set `tool_output_token_limit`, mass-trim real Bedrock schemas, or remove retained Animation/Paint/Texture/Locator capability.

## Remaining Evidence Boundary

The completed task did not establish native deferred/tool-search telemetry, prompt/skill co-loading telemetry, or whether text plus `structuredContent` duplication is materially costly. Keep those `UNKNOWN`; do not infer them from the stale task catalog.

## Next Step

```text
WAIT — no active source change; accept the next explicit user requirement.
```

Do not reopen acceptance fixes or deferred slices without a new reproduced defect or explicit requirement.
