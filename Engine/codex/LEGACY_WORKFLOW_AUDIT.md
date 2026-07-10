# Legacy Workflow Audit

This audit prevents Codex from re-entering the old numbered-reference and eight-phase workflow.

## Status Labels

- `ACTIVE`: valid authority for Rework.
- `COMPATIBILITY`: kept for links or human history; cannot override active workflow.
- `CONDITIONAL`: opened only by a specific failure trigger.
- `LEGACY`: old model; do not use for a new Rework session.
- `DELETE_CANDIDATE`: remove only after confirming no tooling/link dependency.

## Primary Active Authorities

| File | Status | Role |
|---|---|---|
| `Engine/codex/GOVERNANCE.md` | ACTIVE | OpenSpec/Ponytail responsibility and anti-overdevelopment rules |
| `Engine/codex/BOOTSTRAP.md` | ACTIVE | Single local production entry point |
| `Engine/codex/STATE_MACHINE.md` | ACTIVE | State and review/revision transitions |
| `Engine/codex/EVIDENCE_CONTRACT.md` | ACTIVE | Stable previews and evidence filenames |
| `Engine/codex/CHECKPOINT_RECOVERY.md` | ACTIVE | Persistent recovery contract |
| `Engine/codex/stage-profiles.json` | ACTIVE | Stage-specific document/tool/evidence profile |
| `Engine/codex/state.template.json` | ACTIVE | Runtime state schema template |
| `openspec/changes/codex-local-workflow-rework/` | ACTIVE | Durable agreed scope and acceptance criteria |
| `SavedData/sessions/<asset>/state.json` | ACTIVE | Per-asset runtime authority |

## Active Human-Facing Workflow Documents

| File | Status | Notes |
|---|---|---|
| `SourceDocument/modeling/README.md` | ACTIVE | Four-stage index |
| `SourceDocument/modeling/workflow-quick-reference.md` | ACTIVE | Compact operator route |
| `SourceDocument/modeling/mandatory-blockbench-mcp-procedure.md` | ACTIVE | Hard production baseline |
| `SourceDocument/modeling/operator-one-page-checklist.md` | ACTIVE | Short operational checklist |
| `SourceDocument/modeling/phase-detail-contract.md` | ACTIVE | Stage contract despite legacy filename |
| `SourceDocument/modeling/pre-modelling-gate.md` | ACTIVE | Reference and preflight readiness |
| `SourceDocument/modeling/reference-package-pass-fail-checklist.md` | ACTIVE | New package intake |
| `SourceDocument/modeling/quality-implementation-rules.md` | ACTIVE | Geometry/texture quality logic |
| `SourceDocument/modeling/modeling-phase-quality-playbook.md` | ACTIVE | Four-stage execution playbook despite legacy filename |
| `SourceDocument/modeling/phase-quality-scorecard-template.md` | ACTIVE | One scorecard per user-visible stage |
| `SourceDocument/modeling/model-session-checklist-template.md` | ACTIVE | Optional summary generated from state |
| `SourceDocument/modeling/model-session-lock-template.md` | ACTIVE | Compatibility lock mirror |
| `SourceDocument/modeling/model-session-folder-convention.md` | ACTIVE | Runtime folder and stable filename convention |
| `SourceDocument/modeling/mcp-smoke-test-checklist.md` | ACTIVE | One-time/stale-check readiness |
| `SourceDocument/modeling/visual-qa-checklist.md` | ACTIVE | Stage/final visual checks |

## Conditional Documents

These documents are not startup reads.

| Pattern / File | Status | Trigger |
|---|---|---|
| `geometry-failure-prevention-playbook.md` | CONDITIONAL | Same Geometry blocker twice |
| `common-failure-patterns.md` | CONDITIONAL | A known repeated failure needs diagnosis |
| `ops/phase-risk-simulation.md` | CONDITIONAL | Repeated blocker or risky broad reopen |
| `marketplace-reference-to-mcp-map.md` | CONDITIONAL | Reference interpretation remains ambiguous |
| `marketplace-reference-intelligence-template.md` | CONDITIONAL | Package lacks enough explicit execution detail |
| `minecraft-style-image-conversion-*` | CONDITIONAL | Creating references, not local post-reference production |
| texture/UV deep guides | CONDITIONAL | Texture stage needs a specific unresolved method |

## Legacy Reference Assets and Templates

| Path | Status | Rule |
|---|---|---|
| `SourceDocument/reference-templates/` numbered packages | LEGACY | Do not require for new Rework sessions |
| `SourceDocument/reference-samples/ninja-master-bedrock-entity/` | COMPATIBILITY | Quality calibration only; not package authority |
| `SourceDocument/reference-samples/legacy/` | LEGACY | Comparison/history only |
| legacy kangaroo numbered sheets | LEGACY | Must be explicitly migrated before continued use |
| ChatGPT old multi-sheet ZIP/prompt files | LEGACY or COMPATIBILITY | Must not override the approved one-visual/four-document package |

## Known Legacy Wording to Reject

The following phrases indicate stale workflow logic when used as active requirements:

```text
Reference Collection as a user-reviewed production phase
Main Geometry and Geometry Detailing as separate user approvals
UV Texture, Base Texturing, and Detail Texturing as separate user approvals
Polish as a mandatory user-review stage
required numbered sheets 01-08
required per-sheet notes
Sheet 05 / Sheet 06 authority
approval after every internal pass
absolute D:/Work/... links
```

When found:

1. update the document if it is an active authority;
2. add a redirect/legacy banner if external links may depend on it;
3. archive or delete only after dependency confirmation.

## Remaining Audit Work

Before final integration:

- search all Markdown/YAML/JSON for the known legacy wording;
- classify every hit using this document;
- update active authorities;
- add a clear legacy banner to historical examples that remain;
- verify prompts and generated ChatGPT packs do not reintroduce the old local workflow;
- verify no absolute local filesystem path remains in active entry documents;
- confirm OpenSpec and Bootstrap are consistent.

## Non-Goal

Do not rewrite every historical document merely for wording consistency.

Ponytail rule:

```text
Update only a document that can influence active execution, confuse recovery, or be loaded by a current tool/prompt.
```
