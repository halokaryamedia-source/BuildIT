# BlockIT Foundation

This folder is the durable product/modelling policy source of truth.

Do **not** load every foundation file for every task. Root `AGENTS.md`,
`CONTEXT.md`, and `docs/knowledge/next-action.md` are the normal session boot;
open only the foundation note relevant to the active boundary.

## Document Groups

### Policy and Product

- `00-agent-policy.md`: BlockIT-specific agent/product constraints only.
- `01-project-overview.md`: product purpose and target user.
- `02-product-requirements.md`: product scope, requirements, and definition of
  done.

### Workflow

- `03-modelling-workflow.md`: generic whole-form-first modelling sequence.
- `04-reference-guide.md`: reference input/generation policy.
- `08-source-selection.md`: source/reference selection rules.
- `09-merge-map.md`: source/repository merge boundaries.

### Modelling Standards

- `05-geometry-standard.md`: geometry/proportion rules.
- `06-texture-standard.md`: texture/UV rules.
- `07-visual-validation.md`: visual evidence and acceptance gates.

### Verification

- `validation-report.md`: verified findings and remaining `Needs Validation`
  items.

## Task-Specific Read Rule

| Need | Read |
|---|---|
| BlockIT product constraint | `00-agent-policy.md` + the specific product note only if needed |
| Product scope / feature requirement | `02-product-requirements.md` |
| Modelling sequence | `03-modelling-workflow.md` |
| Reference preparation | `04-reference-guide.md` |
| Cube/proportion rule | `05-geometry-standard.md` |
| Texture/UV | `06-texture-standard.md` |
| Visual acceptance | `07-visual-validation.md` |
| External/source authority | `08-source-selection.md` |
| Merge/adoption boundary | `09-merge-map.md` |
| Proof status | `validation-report.md` |

Read a second note only when the active decision crosses that boundary.

## Rule of Use

- Stable product/model rules belong here.
- Working task state does not belong here.
- If a rule is unverified, mark it `Needs Validation`.
- If a foundation rule conflicts with current verified source/decision, resolve
  the conflict instead of layering another exception.
- Remove/supersede misleading policy; do not compensate by adding more context.

## Bridge to Knowledge

- `docs/knowledge/next-action.md` — current work/resume state.
- `docs/knowledge/decision-log.md` — durable decisions/reasons.
- `docs/knowledge/index.md` — project-memory navigation.
- `docs/knowledge/glossary.md` — stable terminology.
