# Roadmap

Updated: 2026-08-11

This roadmap holds broad direction only. Current execution is always owned by [`next-action.md`](../next-action.md).

## 1. Prove The Current Product Locally

Run the bounded Codex + Blockbench acceptance procedure and answer the real product questions:

- does the local plugin/runtime behave as the source contracts claim?
- does native Codex tool exposure/search keep the 62-tool surface usable?
- does reference-driven modelling avoid false visual approval and speculative correction loops?
- are texture/PBR, animation, Locator/Null Object, and persistence paths reachable and truthful?

Procedure owner: [Local Acceptance Runbook](local-acceptance-runbook.md).

## 2. Fix Only Reproduced Local Defects

For each failure:

```text
reproduce
→ classify exact owner
→ smallest complete fix
→ rerun failing scenario
→ relevant repository gates
→ affected downstream revalidation only
```

Do not reopen stopped source slices or invent architecture without new evidence.

## 3. Prove Delivery / Persistence

Establish real `.bbmodel` save/reopen behavior, Bedrock export truth, and in-scope texture/Locator/animation persistence before defining delivery as complete.

## 4. Tune Efficiency From Trace, Not Assumption

Only after local telemetry exists:

- evaluate native deferred/tool-search exposure;
- reduce proven prompt/skill co-loading duplication;
- test `structuredContent` result slimming only if duplicated text is material;
- preserve Bedrock capability reachability while reducing demonstrated friction.

Raw tool count is diagnostic, not the product KPI.

## 5. Extend Native Bedrock Capability Only From Proven Need

Implement protected gaps only when a real workflow requires them and official Blockbench Bedrock ownership is clear. Do not restore generic Mesh/Hytale/eval behavior as a shortcut.

## 6. Keep Repository Memory Clean

Maintain one owner per job:

```text
AGENTS         task routing/proof
CONTEXT        stable facts
next-action    current repository state
local runbook  local acceptance procedure
foundation     durable product/modelling policy
implementation-map current source ownership
validation-report current proof status
reviews        historical evidence
board          future/non-active work
```

Prefer removing stale routing to adding another documentation layer.
