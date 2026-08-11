# Agent Work Flow

Updated: 2026-08-11

Root `AGENTS.md` is the canonical routing owner. This note is only a compact map.

```text
User request
→ classify task

ASSET AUTHORING
→ current request/reference
→ blockit-bedrock-entity-mcp
→ only active modelling/texturing/animation specialist
→ minimum useful MCP evidence

REPOSITORY / PLUGIN CHANGE
→ current repo state when relevant
→ development-brief
→ inspect actual owner/caller
→ at most one useful engineering specialist
→ smallest complete change
→ minimum useful proof
→ acceptance check

LOCAL ACCEPTANCE CONTINUATION
→ next-action.md
→ operations/local-acceptance-runbook.md
→ establish baseline without source edits
→ reproduce + classify failure
→ only then smallest owner-specific fix
```

## Repository-development owner selection

- MCP public/input/result/registration/transport contract → `mcp-server-development`
- Blockbench runtime/API/UI/Undo/Canvas mechanics → `blockbench-runtime-development`
- Bedrock model judgement/visual policy → `blockbench-bedrock-modelling`
- TypeScript type-system issue → `typescript-type-safety`
- Bun build/tooling/dependency issue → `bun-tooling`

Do not stack specialists because one file contains multiple technologies.

## Proof discipline

Use the cheapest evidence that can falsify the likely failure. Source/CI proof never becomes live Blockbench or visual proof.

Material uncertainty may use these labels from root `AGENTS.md`:

```text
CURRENT-PROJECT VERIFIED
OFFICIALLY VERIFIED
LOCAL PROOF REQUIRED
UNSUPPORTED
UNKNOWN
```

## Continuity

Update only the owner whose state changed:

```text
current continuation → next-action.md
current local procedure → local-acceptance-runbook.md
durable reason → decision-log / decision note
current proof state → foundation/validation-report.md
future work → operations/task-board.md
```

Chat history and old plans are not task trackers.

## Related

- [Knowledge Dashboard](index.md)
- [Next Action](next-action.md)
- [Local Acceptance Runbook](operations/local-acceptance-runbook.md)
- [Skill Activation Matrix](skills/activation-matrix.md)
