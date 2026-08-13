from pathlib import Path
import re
import shutil

ROOT = Path('.')


def write(path: str, content: str) -> None:
    p = ROOT / path
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(content.rstrip() + '\n', encoding='utf-8')


def replace_once(path: str, old: str, new: str) -> None:
    p = ROOT / path
    text = p.read_text(encoding='utf-8')
    if text.count(old) != 1:
        raise SystemExit(f'{path}: expected exactly one occurrence of {old!r}, found {text.count(old)}')
    p.write_text(text.replace(old, new, 1), encoding='utf-8')


# -----------------------------------------------------------------------------
# Canonical repository entrypoints: one owner per responsibility.
# -----------------------------------------------------------------------------
write('AGENTS.md', r'''# Workspace Agent Routing

Current intent owns the task; current source and relevant proof own behavior.

## Task Class First

### Reference Preparation

```text
source image / user intent
→ .agents/skills/blockbench-reference-generator/SKILL.md
→ one approved Modelling Brief image
```

Image-capable work only. Do not call BlockIT MCP merely to prepare the reference.

### Asset Authoring

```text
current request / actual approved reference
→ .agents/skills/blockit-bedrock-entity-mcp/SKILL.md
→ only the active modelling/texturing/animation specialist
→ BlockIT MCP
```

Do not load repository history or development context for ordinary asset authoring.

### Repository / Plugin Work

```text
this file
→ docs/knowledge/next-action.md when continuing current work
→ CONTEXT.md only when stable facts matter
→ affected source + nearest AGENTS.md
→ .agents/skills/development-brief/SKILL.md
→ at most one relevant engineering specialist
```

For a named MCP-tool defect, use `docs/knowledge/implementation-map.md` **Hot-Path Defect Index** before broad code search.

## Source Precedence

1. current user instruction;
2. current source + relevant runtime/visual proof;
3. root/nearest `AGENTS.md`;
4. `docs/foundation/` current policy;
5. `docs/knowledge/next-action.md`;
6. `CONTEXT.md`;
7. Git history / issue or PR evidence only when rationale is materially needed.

Resolve material conflicts explicitly.

## Work Discipline

- Inspect the current owner/caller/pattern before shared changes.
- Make the minimum complete change; reuse before adding a layer.
- Do not broaden scope because adjacent issues are visible.
- No fallback/framework/profile/compatibility layer without proved need.
- Fixtures and named samples are evidence, not generic product rules.
- Stop the same failed direction after two attempts without new evidence.
- `No change required` is valid.
- Never claim proof that was not obtained.

## Execution / Proof

**ChatGPT → GitHub:** repository/source/docs/CI evidence only.

**Codex local / Blockbench:** runtime/model/visual proof only when explicitly active and materially required.

Use the cheapest falsifiable evidence:

```text
CURRENT-PROJECT VERIFIED
OFFICIALLY VERIFIED
LOCAL PROOF REQUIRED
UNSUPPORTED
UNKNOWN
```

Source/CI proof never upgrades a live visual/runtime claim.

## Product Boundary

Minecraft Bedrock Entity (`bedrock`) is the default. Reference generation creates a visual brief, not geometry. Tool success is execution evidence, not visual fidelity. Reference judgement uses `FAIL / UNVERIFIED / PASS`; `BLOCKED` is valid when continuation would require guessing.

Reference generation → `blockbench-reference-generator`; modelling judgement → `blockbench-bedrock-modelling`; texture/PBR → `blockit-bedrock-texturing`; animation → `blockit-bedrock-animation`.

Missing native capability must not be faked with generic Mesh, risky evaluation, UI automation, or another format. For `mcp/**`, `mcp/AGENTS.md` owns package-specific TypeScript/Zod/runtime/registration/result/generated-doc/containment rules.

## Canonical Owners

- detailed current product/task flow → `docs/knowledge/flow.md`
- active repository continuation → `docs/knowledge/next-action.md`
- stable project facts → `CONTEXT.md`
- source/tool ownership → `docs/knowledge/implementation-map.md`
- current proof state → `docs/foundation/validation-report.md`
- durable product/reference/modelling policy → `docs/foundation/`
- local acceptance procedure → `docs/knowledge/operations/local-acceptance-runbook.md` only when explicitly reactivated
- historical rationale → Git history / GitHub issues and PRs

Do not recreate duplicate navigation, review archives, decision logs, roadmaps, or parallel planning/state systems in the active tree.

## Communication

Keep progress compact: decisions, proof, blockers, one next step.''')

write('CONTEXT.md', r'''# BlockIT Workspace Context

Last verified: 2026-08-13  
Stability: stable

This file owns **stable project facts and terminology only**. Active work belongs in `docs/knowledge/next-action.md`; routing belongs in `AGENTS.md`.

## Product

BlockIT is a local Blockbench MCP plugin plus repository workflow for AI-assisted Minecraft Bedrock Entity modelling. Default format is `bedrock`; normal visible geometry is Cube/Cuboid-based and organized by Groups/bones.

Primary deliverable is a clean editable `.bbmodel`; Bedrock geometry JSON is the runtime geometry export. Successful tool/file/coordinate output is not proof of visual resemblance.

## Stable Terms

- **Source Image** — original visual input; not metric geometry.
- **Modelling Brief Draft** — generated multi-view Minecraft/Blockbench-style reference before approval.
- **Modelling Brief** — approved visual guide; not a per-Cube blueprint.
- **Requested Dimensions** — optional user-approved whole-model target; `1 block = 16 Blockbench units`.
- **Reference Generator** — image-capable source/intent → one approved Modelling Brief image.
- **Blockbench Model** — reviewed editable `.bbmodel`.

## Repository Shape

```text
.agents/skills/    repository-owned skills
docs/foundation/  durable current product/reference/modelling policy
docs/knowledge/   current flow, continuation, source ownership, local procedure
mcp/              plugin/runtime/build/tests/generated API docs
workspace/        explicit reusable acceptance fixtures
```

There are **ten repository-owned skill packages** under `.agents/skills/`:

```text
blockbench-reference-generator
blockit-bedrock-entity-mcp
blockbench-bedrock-modelling
blockit-bedrock-texturing
blockit-bedrock-animation
development-brief
mcp-server-development
blockbench-runtime-development
typescript-type-safety
bun-tooling
```

## MCP Architecture Facts

BlockIT runs inside desktop Blockbench and exposes a loopback, request-owned/stateless MCP endpoint. Schema modules must construct outside Blockbench; runtime-only checks belong inside execution.

The accepted default surface has **62 enabled tools**. `risky_eval` and `from_geo_json` remain disabled. Generic fallback families are explicit opt-in.

Supported ownership includes Cube/Group authoring, texture/Painter/PBR/material instances, Bedrock animation including authored Molang transform strings, bounded new-animation sound events and read-only AnimationController/state inspection, Locator/Null Object lifecycle, Undo, `.bbmodel`, and Bedrock geometry export.

Protected gaps include TextureMesh direct authoring, native visible bounding-box fields, AnimationController creation/mutation, existing-animation direct sound/timeline-effect mutation, animated textures, and bone-binding expressions.

Reference image generation is outside the MCP capability surface.

## Execution Channels

- **Image-capable surface** — Source Image → Modelling Brief image.
- **ChatGPT → GitHub** — repository/source/docs/CI/static proof.
- **Codex local / Blockbench** — runtime/model/visual proof only when explicitly active.

## Accepted Functional Baseline

The **first bounded Codex + Blockbench local acceptance pass completed** on 2026-08-12. It established representative live proof for stateless transport, geometry/correction/Undo, difference-first reference behavior, texture/Paint/PBR/material instances, base animation playback, Locator/Null Object lifecycle, and `.bbmodel`/Bedrock export persistence.

Later P0–P7, Reference Generator, and professional PRO-1–PRO-8 changes are static/CI proof unless `docs/foundation/validation-report.md` explicitly says otherwise. No local run is active.

## Engineering Facts

- Untrusted MCP input is validated at the boundary.
- Generated output is secondary to source and regenerated through its owner.
- Current source + current policy outrank historical wording.
- Named fixtures/samples never become generic runtime rules by accident.
- Large machine-readable MCP data should not be duplicated across equivalent result representations.
- Git history owns deleted historical reviews, decisions, plans, and experiments.

## Navigation

- routing → `AGENTS.md`
- current flow → `docs/knowledge/flow.md`
- active continuation → `docs/knowledge/next-action.md`
- source ownership → `docs/knowledge/implementation-map.md`
- proof state → `docs/foundation/validation-report.md`
- MCP engineering → `mcp/README.md` + `mcp/AGENTS.md`''')

write('README.md', r'''# BlockIT

BlockIT is an AI-assisted **Minecraft Bedrock Entity** modelling workspace built around a local Blockbench MCP plugin. The goal is a clean editable `.bbmodel` that follows an approved visual reference through the shortest evidence-backed workflow.

`Local` is the current product/development authority.

## Product Flow

```text
1. PREPARE REFERENCE
   source image / intent → one approved multi-view Modelling Brief

2. AUTHOR BEDROCK MODEL
   actual approved image → grounded primary form → visual comparison → bounded correction

3. FINISH ASSET
   secondary structure → texture/PBR if needed → animation if needed → validation → export
```

Root `AGENTS.md` owns task routing. `docs/knowledge/flow.md` owns the detailed current sequence.

## Canonical Documentation

| Need | Owner |
|---|---|
| task routing | `AGENTS.md` |
| stable project facts | `CONTEXT.md` |
| detailed current flow | `docs/knowledge/flow.md` |
| active repository continuation | `docs/knowledge/next-action.md` |
| source/tool ownership | `docs/knowledge/implementation-map.md` |
| durable product/reference/modelling policy | `docs/foundation/` |
| current proof state | `docs/foundation/validation-report.md` |
| local acceptance procedure | `docs/knowledge/operations/local-acceptance-runbook.md` |

Historical audits, decisions, plans, and superseded experiments live in Git history rather than the active documentation tree.

## Repository Map

| Path | Purpose |
|---|---|
| `.agents/skills/` | current repository-owned skills |
| `mcp/` | BlockIT plugin source/build/tests/generated API docs |
| `docs/foundation/` | current durable product/reference/modelling policy |
| `docs/knowledge/` | current flow/continuation/ownership/procedure only |
| `workspace/fixtures/` | explicit reusable local-acceptance fixtures |

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

Production plugin: `mcp/dist/mcp.js`  
Default endpoint: `http://127.0.0.1:3000/bb-mcp`

Do **not** use the upstream hosted Blockbench MCP plugin as proof of BlockIT.

## Current Static Proof

```text
62 enabled tools
76,439 tools/list response characters
53,493 input-schema characters
10,645 description characters
max per-tool payload: 3,167 characters
runtime workflow prompt: 6,995 characters
```

These are serialized character counts, not model-visible token measurements.

P0–P7, Reference Generator, and professional PRO-1–PRO-8 static contracts are implemented on `Local`. Controller creation/mutation remains deliberately deferred; PRO-8 is read-only controller/state inspection.

The 2026-08-12 accepted local baseline remains historical live proof. Later model-facing/runtime improvements remain `LOCAL PROOF REQUIRED` until local testing is explicitly reactivated.

## Hygiene

- one document per responsibility;
- generated MCP API docs are tracked and checked for freshness;
- current docs link to owners rather than duplicating their content;
- Git history owns removed historical documentation;
- do not add routers/profiles/scorers/packaging or new documentation layers without a concrete need.

## License

GPL-3.0-only; see `LICENSE`.''')

write('.agents/skills/README.md', r'''# BlockIT Agent Skills

`.agents/skills/` is the only repository-owned skill root. Root `AGENTS.md` chooses the task class; load only the owner needed by the active decision.

## Reference Preparation

- `blockbench-reference-generator` — source image/user intent → one approved Minecraft/Blockbench-style multi-view Modelling Brief image. Image-only; no MCP/geometry/package output.

## Bedrock Entity Authoring

- `blockit-bedrock-entity-mcp` — asset routing/state/recovery/evidence discipline.
- `blockbench-bedrock-modelling` — actual-reference grounding, whole-form geometry, hierarchy/pivots, visual correction.
- `blockit-bedrock-texturing` — texture/Painter/PBR/material instances.
- `blockit-bedrock-animation` — animation/keyframes/rig/timeline/effects and read-only controller inspection.

Normal asset work loads the orchestrator then only the active domain specialist.

## Repository Development

- `development-brief` — repository create/change front door.
- `mcp-server-development` — MCP public/schema/result/transport contract.
- `blockbench-runtime-development` — Blockbench runtime/API/UI/Undo mechanics.
- `typescript-type-safety` — TypeScript type-system issues.
- `bun-tooling` — Bun build/package/script behavior.

There is no generic Mesh/Hytale modelling skill and no separate review/evidence/router skill layer. Historical skill experiments live in Git history.''')

# Development skill no longer points at removed current documentation layers.
replace_once(
    '.agents/skills/development-brief/SKILL.md',
    '- Read one relevant policy/decision/source owner only when needed to resolve scope or a conflict.\n- Do not load review history, task board, foundation set, or multiple specialists by ritual.',
    '- Read one relevant current policy/source owner only when needed to resolve scope or a conflict.\n- Do not load Git history, the whole foundation set, or multiple specialists by ritual.'
)

# MCP package rules: only one prompt-source owner remains.
replace_once('mcp/AGENTS.md', 'prompts/        prompt source references', 'prompts/        canonical runtime workflow source')
replace_once(
    'mcp/AGENTS.md',
    'The runtime prompt bundle contains only prompts intentionally exposed by `server/prompts.ts`. Maintainer/reference Markdown may remain source-only and must not be bundled just because it exists in `prompts/`.',
    'The runtime prompt bundle contains only prompts intentionally exposed by `server/prompts.ts`. Keep only intentionally owned prompt sources in `prompts/`; Git history owns removed prompt/reference notes.'
)

# -----------------------------------------------------------------------------
# Foundation: keep durable current policy, redirect duplicated workflow links.
# -----------------------------------------------------------------------------
replace_once('docs/foundation/01-project-overview.md', 'See [Modelling Workflow](03-modelling-workflow.md).', 'See [Current Flow](../knowledge/flow.md).')
replace_once('docs/foundation/01-project-overview.md', '- [Reference Fidelity Decision](../knowledge/decisions/reference-fidelity-loop.md)\n', '')
replace_once('docs/foundation/02-product-requirements.md', 'Detailed procedure: [03-modelling-workflow.md](03-modelling-workflow.md).', 'Detailed procedure: [Current Flow](../knowledge/flow.md).')
replace_once('docs/foundation/04-reference-guide.md', '- [Modelling Workflow](03-modelling-workflow.md)', '- [Current Flow](../knowledge/flow.md)')
replace_once('docs/foundation/05-geometry-standard.md', '- [Modelling Workflow](03-modelling-workflow.md)', '- [Current Flow](../knowledge/flow.md)')
replace_once('docs/foundation/05-geometry-standard.md', '- [Reference Fidelity Decision](../knowledge/decisions/reference-fidelity-loop.md)\n', '')
replace_once('docs/foundation/07-visual-validation.md', '- [Modelling Workflow](03-modelling-workflow.md)', '- [Current Flow](../knowledge/flow.md)')
replace_once('docs/foundation/07-visual-validation.md', '- [Reference Fidelity Decision](../knowledge/decisions/reference-fidelity-loop.md)\n', '')

# -----------------------------------------------------------------------------
# Knowledge spine: current flow + active continuation + source ownership only.
# -----------------------------------------------------------------------------
flow_path = ROOT / 'docs/knowledge/flow.md'
flow = flow_path.read_text(encoding='utf-8')
start = flow.find('## 6. Continuity Owners')
if start == -1:
    raise SystemExit('flow.md: missing Continuity Owners section')
flow = flow[:start] + r'''## 6. Continuity Owners

```text
current continuation        → next-action.md
stable facts                → CONTEXT.md
current proof state         → foundation/validation-report.md
current source ownership    → implementation-map.md
local acceptance procedure  → operations/local-acceptance-runbook.md only when reactivated
historical rationale        → Git history / GitHub issues and PRs
```

Do not create another roadmap, review archive, decision log, duplicate flow owner, sample-preset system, or parallel planning state in the active tree.

## Related

- [Next Action](next-action.md)
- [Reference Guide](../foundation/04-reference-guide.md)
- [Geometry Standard](../foundation/05-geometry-standard.md)
- [Validation Report](../foundation/validation-report.md)
'''
flow_path.write_text(flow, encoding='utf-8')

impl = ROOT / 'docs/knowledge/implementation-map.md'
impl_text = impl.read_text(encoding='utf-8')
for line in [
    '| future/non-active work | `docs/knowledge/operations/task-board.md` |\n',
]:
    impl_text = impl_text.replace(line, '')
impl_text = impl_text.replace(
    '| completed local procedure | `docs/knowledge/operations/local-acceptance-runbook.md` |',
    '| local acceptance procedure | `docs/knowledge/operations/local-acceptance-runbook.md` (only when reactivated) |'
)
impl_text = impl_text.replace(
    'Current `Local` source/ownership only. Active task state belongs in `next-action.md`; durable rationale belongs in decisions/reviews.',
    'Current `Local` source/ownership only. Active task state belongs in `next-action.md`; Git history owns retired rationale and experiments.'
)
impl.write_text(impl_text, encoding='utf-8')

write('docs/knowledge/next-action.md', r'''# Next Action

Updated: 2026-08-13

Single active repository-continuation snapshot. Root `AGENTS.md` owns routing; `flow.md` owns the detailed current product sequence; `docs/foundation/validation-report.md` owns proof state.

## Status

```text
REPOSITORY_HYGIENE_CLEANUP_COMPLETE
```

Working branch: **`Local` only**.

The user explicitly does **not** want local Codex/Blockbench testing yet. `NO LOCAL RUN ACTIVE`.

Do not claim live Blockbench/model-quality improvement without actual runtime proof. Controller execution also requires direct runtime evidence.

## Retained Product State

```text
P0–P7  routing / grounding / convergence contracts
REF    assisted reference preparation/readiness
PRO-1  professional construction reasoning
PRO-2  authoring expressiveness validation
PRO-3  place_cube parent + initial inflate completeness
PRO-4  geometry/texturing/animation sample forensics
PRO-5  modify_cubes_batch Box-UV parity
PRO-6  authored Molang transform-string preservation
PRO-7  bounded new-animation sound-effect closure
PRO-8  read-only AnimationController/state inspection
```

Professional samples remain evidence, never presets/count targets. AnimationController creation/mutation, existing-animation direct sound/timeline-effect mutation, and bone-binding expressions remain deliberately deferred.

## Active Documentation Spine

```text
AGENTS.md                                      task routing / proof discipline
CONTEXT.md                                     stable facts
README.md                                      public product entrypoint
docs/knowledge/flow.md                         detailed current flow
docs/knowledge/next-action.md                  active continuation
docs/knowledge/implementation-map.md           source/tool ownership
docs/foundation/01-project-overview.md         product purpose
docs/foundation/02-product-requirements.md     product requirements
docs/foundation/04-reference-guide.md          reference policy
docs/foundation/05-geometry-standard.md        geometry policy
docs/foundation/06-texture-standard.md         texture policy
docs/foundation/07-visual-validation.md        visual proof/convergence
docs/foundation/validation-report.md           proof state
docs/knowledge/operations/local-acceptance-runbook.md  local procedure, inactive
```

Historical reviews, audit notes, decision logs, duplicate navigation maps, old prompt notes, and superseded reference-package metadata were removed from the active tree. Their provenance remains available through Git history.

## Verified Static State

```text
typecheck                     PASS
contract tests                PASS
default MCP surface           PASS
production build              PASS
generated docs freshness      PASS
aggregate enforcement         PASS
```

Current serialized surface remains 62 enabled tools with a retained maximum per-tool payload ceiling of 3,200 characters. Character counts are not model-visible token measurements.

## Verification Boundary

Static/CI proof establishes repository/schema/type/build/documentation consistency only. Molang/sound/controller persistence, controller execution, generated-reference quality, P5–P7 model-facing effectiveness, and visual model quality remain `LOCAL PROOF REQUIRED` when their exact live claim matters.

## Next Step

```text
NON-LOCAL STOP — ACTIVE REPOSITORY TREE IS CLEAN
```

Do not add another planning/review/archive layer. Reopen repository source only for a concrete product requirement or new evidence. Keep local testing deferred until the user explicitly reactivates it.''')

# Compact local procedure: single retained procedural owner, no historical-doc dependencies.
write('docs/knowledge/operations/local-acceptance-runbook.md', r'''# Local Acceptance Runbook

Updated: 2026-08-13  
Owner: local Codex + Blockbench acceptance procedure  
Active only when `docs/knowledge/next-action.md` points here.

This is the single procedural owner for BlockIT live acceptance. It is inactive during GitHub-only/static work.

## 1. Goal

Prove or disprove claims source/CI cannot establish:

- local plugin/runtime and stateless MCP behavior;
- real Codex tool exposure/search behavior;
- representative Bedrock geometry/texture/animation/Locator reachability;
- difference-first reference judgement and correction convergence;
- save/reopen/export persistence;
- real call/retry/context behavior when observable.

Establish a baseline before editing source. Reproduce and classify a failure first.

## 2. Required Reading

```text
AGENTS.md
→ docs/knowledge/next-action.md
→ CONTEXT.md only when stable facts matter
→ this runbook
→ mcp/README.md + mcp/AGENTS.md when MCP implementation matters
```

Do not load Git history or the whole foundation set before a concrete failure identifies the boundary.

## 3. Environment / Static Gate

Record Local commit SHA, working-tree status, OS, Bun/Codex/Blockbench versions, loaded BlockIT file, MCP endpoint, and Extended MCP Families setting.

From `mcp/`:

```bash
bun install --frozen-lockfile
bun run typecheck
bun run test
bun run measure:surface
bun run build
bun run docs:check
```

Production plugin: `mcp/dist/mcp.js`. A static gate failure is an engineering failure, not runtime proof.

## 4. Load BlockIT / Transport

Load the repository build in desktop Blockbench. Default endpoint:

```text
http://127.0.0.1:3000/bb-mcp
```

Baseline constraints:

- default surface: 62 enabled tools;
- Extended MCP Families off;
- `risky_eval` and `from_geo_json` disabled;
- do not use the upstream hosted plugin as BlockIT proof.

With the plugin running, execute `bun run verify:stateless-local` and confirm independent MCP follow-up calls do not rely on a durable server session.

## 5. Native Tool Exposure

Observe rather than infer:

1. whether Codex injects, defers, or searches tool specs;
2. whether geometry/texture/animation/Locator families become reachable when relevant;
3. whether exact known state is reused without ritual rediscovery;
4. any retry/context/latency data the client actually exposes.

Unknown telemetry stays `UNVERIFIED`. Do not build a custom router from assumptions.

## 6. Fixture A — Deterministic Mechanics

Create a small Bedrock project with one Group and a few Cubes, including one intentionally rotated Cube with an explicit origin. Verify creation identity, focused inspection, finite model bounds, canonical model views, one causal correction with a declared invariant, and Undo/Redo.

Then verify representative downstream reachability:

- texture create/activate + minimal Painter edit;
- native PBR/material-instance path when applicable;
- one small animation with transform keyframes and return to neutral;
- authored Molang transform-string preservation where in scope;
- bounded new-animation sound event creation/inspection where in scope;
- read-only AnimationController/state inspection when a controller fixture is available;
- Locator and Null Object create/inspect/update/rename/remove/Undo.

Do not treat controller **creation/mutation** or existing-animation direct sound/timeline-effect mutation as implemented capability.

## 7. Persistence / Export

Verify editable `.bbmodel` and Bedrock geometry export to explicit absolute paths. When relevant, reopen the `.bbmodel` and confirm the authored state under test survives. Report unsupported reopen/merge scenarios as `LOCAL PROOF REQUIRED` rather than inferring them.

## 8. Fixture B — Reference Fidelity

Use an explicitly approved reference, such as `workspace/fixtures/zebra/reference.webp` when that fixture is deliberately selected.

Required sequence:

```text
actual approved reference
→ Semantic Form / Primary Form Hypothesis
→ coarse primary geometry
→ fresh corresponding model views
→ difference-first FAIL | UNVERIFIED | PASS
→ causal correction only after diagnosis
```

Mandatory adversarial behavior: a front-plausible but side/depth-wrong model cannot receive full 3D `PASS`. A repeated same-cause correction direction that fails twice without new evidence stops as `BLOCKED`.

Geometry failure must not be hidden with texture or animation.

## 9. Efficiency Trace

Record only meaningful calls:

| Phase | Tool/call | Purpose | Needed? | Redundant? | Result | Observable cost |
|---|---|---|---|---|---|---|

Flag lifecycle rereads after create/export, redundant outline/element reads after fresh identity/state, capture-per-mutation behavior, unrelated specialist loads, overlapping resource/tool reads, and retries caused by ambiguous contracts.

Do not fabricate token or latency values.

## 10. Failure Classification

```text
ENVIRONMENT / INSTALL
CODEX CLIENT / TOOL EXPOSURE
MCP TRANSPORT / REGISTRATION
BLOCKBENCH RUNTIME / API
PUBLIC SOURCE CONTRACT
MODELLING / VISUAL ROUTING
TEXTURE / PBR
ANIMATION
PERSISTENCE / EXPORT
UNKNOWN
```

For a reproducible failure: identify the exact owner, capture minimum evidence, make the smallest fix, rerun the failing scenario first, then run relevant repository gates. Broaden only if the fix invalidates downstream evidence.

## 11. Completion

Update only current owners:

- `docs/foundation/validation-report.md` for new live proof;
- `docs/knowledge/next-action.md` for the next active step;
- `docs/knowledge/implementation-map.md` only if ownership changed;
- durable foundation policy only if product rules changed.

Historical rationale belongs in the Git commit/issue/PR rather than a new review or decision document.

Final local report should state environment, pass/fail/unverified by phase, observed efficiency facts, exact fixes, remaining blockers, and one next step.''')

# -----------------------------------------------------------------------------
# Workspace: keep the Zebra evidence fixture but remove retired package machinery.
# -----------------------------------------------------------------------------
write('workspace/README.md', r'''# BlockIT Fixtures

`workspace/` contains only intentional reusable model/reference fixtures. It is not a project-history or cache area.

```text
fixtures/zebra/
  README.md
  zebra.bbmodel
  reference.webp
  source.webp
```

Zebra is an **optional local reference-fidelity acceptance fixture**, not a product template and never a source of object-specific runtime rules.

Transient MCP screenshots/previews under `workspace/**/mcp-data/cache/` remain ignored. Git history owns retired experiments and old package structures.''')

zebra_src = ROOT / 'workspace/active/zebra'
zebra_dst = ROOT / 'workspace/fixtures/zebra'
zebra_dst.mkdir(parents=True, exist_ok=True)
shutil.copy2(zebra_src / 'zebra.bbmodel', zebra_dst / 'zebra.bbmodel')
shutil.copy2(zebra_src / 'mcp-data/references/zebra_reference_package/zebra_model_reference.webp', zebra_dst / 'reference.webp')
shutil.copy2(zebra_src / 'mcp-data/references/zebra_reference_package/source/zebra_source_image.webp', zebra_dst / 'source.webp')
write('workspace/fixtures/zebra/README.md', r'''# Zebra — Optional Local Acceptance Fixture

This fixture exists only for explicit BlockIT reference-fidelity/local-acceptance work. It is not a product template.

Files:

- `zebra.bbmodel` — reset/editable fixture project;
- `reference.webp` — approved visual reference for this fixture;
- `source.webp` — original source/provenance image.

Target metadata:

```text
Height: 2.0 blocks / 32.0 Blockbench units
Width:  0.9 blocks / 14.4 Blockbench units
Length: 2.6 blocks / 41.6 Blockbench units
Texture style: 32x32
Pose: neutral standing
Required animation: none
```

The reference constrains visible form but does not prescribe Cube count, exact transforms, pivots, hierarchy depth, or object-specific product rules. Historical geometry attempts and the retired manifest/reference-package structure remain available through Git history.''')

# -----------------------------------------------------------------------------
# Tests: route from current owners and lock the clean documentation spine.
# -----------------------------------------------------------------------------
write('mcp/tests/active-routing-integrity.test.ts', r'''import { describe, expect, test } from "bun:test";
import { readdir } from "node:fs/promises";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

function backtickedSkillLikeNames(text: string): string[] {
  return [...text.matchAll(/`([a-z0-9]+(?:-[a-z0-9]+)+)`/g)]
    .map((match) => match[1])
    .filter((name, index, all) => all.indexOf(name) === index)
    .sort();
}

describe("active routing integrity", () => {
  test("active repository skill references resolve to canonical skill packages", async () => {
    const canonical = new Set(
      (await readdir("../.agents/skills", { withFileTypes: true }))
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
    );

    const [root, index, developmentBrief, mcpDevelopment] = await Promise.all([
      source("../AGENTS.md"),
      source("../.agents/skills/README.md"),
      source("../.agents/skills/development-brief/SKILL.md"),
      source("../.agents/skills/mcp-server-development/SKILL.md"),
    ]);

    const referenced = new Set([
      ...backtickedSkillLikeNames(root),
      ...backtickedSkillLikeNames(index),
      ...backtickedSkillLikeNames(developmentBrief),
      ...backtickedSkillLikeNames(mcpDevelopment),
    ]);

    for (const name of referenced) {
      expect(canonical.has(name)).toBe(true);
      expect(await Bun.file(`../.agents/skills/${name}/SKILL.md`).exists()).toBe(true);
    }
  });
});''')

write('mcp/tests/documentation-handoff.test.ts', r'''import { describe, expect, test } from "bun:test";
import { readdir } from "node:fs/promises";

async function text(path: string): Promise<string> {
  return Bun.file(path).text();
}

async function names(path: string): Promise<string[]> {
  return (await readdir(path, { withFileTypes: true })).map((entry) => entry.name).sort();
}

describe("Codex documentation handoff", () => {
  test("current repository-owned skill inventory is documented without a duplicate routing map", async () => {
    const dirs = (await readdir("../.agents/skills", { withFileTypes: true }))
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort();
    const [context, index, root, referenceGenerator] = await Promise.all([
      text("../CONTEXT.md"),
      text("../.agents/skills/README.md"),
      text("../AGENTS.md"),
      text("../.agents/skills/blockbench-reference-generator/SKILL.md"),
    ]);

    expect(dirs).toEqual([
      "blockbench-bedrock-modelling",
      "blockbench-reference-generator",
      "blockbench-runtime-development",
      "blockit-bedrock-animation",
      "blockit-bedrock-entity-mcp",
      "blockit-bedrock-texturing",
      "bun-tooling",
      "development-brief",
      "mcp-server-development",
      "typescript-type-safety",
    ]);
    for (const name of dirs) expect(index).toContain(name);
    expect(context).toContain("ten repository-owned skill packages");
    expect(root).toContain("Task Class First");
    expect(referenceGenerator).toContain("Return **one image only**");
  });

  test("active human documentation tree is intentionally minimal", async () => {
    expect(await names("../docs/knowledge")).toEqual([
      "flow.md",
      "implementation-map.md",
      "next-action.md",
      "operations",
    ]);
    expect(await names("../docs/knowledge/operations")).toEqual([
      "local-acceptance-runbook.md",
    ]);
    expect(await names("../docs/foundation")).toEqual([
      "01-project-overview.md",
      "02-product-requirements.md",
      "04-reference-guide.md",
      "05-geometry-standard.md",
      "06-texture-standard.md",
      "07-visual-validation.md",
      "validation-report.md",
    ]);
    const promptMd = (await names("prompts")).filter((name) => name.endsWith(".md"));
    expect(promptMd).toEqual(["bedrock_entity_workflow.md"]);
    expect(await names("../workspace")).toEqual(["README.md", "fixtures"]);
    expect(await names("../workspace/fixtures/zebra")).toEqual([
      "README.md",
      "reference.webp",
      "source.webp",
      "zebra.bbmodel",
    ]);
  });

  test("current continuation stays bounded and does not silently reactivate local acceptance", async () => {
    const [next, runbook, implementation] = await Promise.all([
      text("../docs/knowledge/next-action.md"),
      text("../docs/knowledge/operations/local-acceptance-runbook.md"),
      text("../docs/knowledge/implementation-map.md"),
    ]);

    expect(next.length).toBeLessThan(7_000);
    expect(next).toContain("Working branch: **`Local` only**");
    expect(next).toContain("PRO-1");
    expect(next).toContain("PRO-2");
    expect(next).toContain("## Next Step");
    expect(next).toContain("LOCAL PROOF REQUIRED");
    expect(next).toContain("Do not claim live Blockbench/model-quality improvement without actual runtime proof");
    expect(runbook).toContain("Active only when `docs/knowledge/next-action.md` points here");
    expect(implementation).toContain("## Hot-Path Defect Index");
    expect(implementation).toContain("62 enabled tools");
    expect(implementation).toContain("No local run is active");
  });

  test("named MCP-tool defects have a bounded source and primary-test index", async () => {
    const implementation = await text("../docs/knowledge/implementation-map.md");
    expect(implementation).toContain("source owner + primary regression owner first");
    expect(implementation).toContain("Expand only if that pair cannot explain the defect");
    expect(implementation).toContain("`undo`/`redo` remain source-owned");

    const mappings = [
      { tools: ["create_project"], source: "server/tools/project.ts", test: "tests/p1-core-ownership.test.ts" },
      { tools: ["get_project_info"], source: "server/tools/project.ts", test: "tests/static-efficiency-budget.test.ts" },
      { tools: ["inspect_model_bounds"], source: "server/tools/project.ts", test: "tests/rendered-model-bounds-numeric-safety.test.ts" },
      { tools: ["place_cube", "modify_cube", "modify_cubes_batch"], source: "server/tools/cubes.ts", test: "tests/model-effectiveness-correction-accuracy.test.ts" },
      { tools: ["add_group"], source: "server/tools/element.ts", test: "tests/p1-core-ownership.test.ts" },
      { tools: ["list_outline", "find_elements_by_criteria"], source: "server/tools/element.ts", test: "tests/context-payload-cleanup.test.ts" },
      { tools: ["inspect_element"], source: "server/tools/element-inspection.ts", test: "tests/model-effectiveness-correction-accuracy.test.ts" },
      { tools: ["capture_model_views"], source: "server/tools/camera.ts", test: "tests/camera-framing-contract.test.ts" },
      { tools: ["list_locator_elements", "manage_locator", "manage_null_object"], source: "server/tools/locators.ts", test: "tests/bedrock-locator-coverage.test.ts" },
      { tools: ["create_texture", "list_textures", "get_texture", "activate_texture"], source: "server/tools/texture.ts", test: "tests/context-payload-cleanup.test.ts" },
      { tools: ["create_animation"], source: "server/tools/animation.ts", test: "tests/create-animation-contract.test.ts" },
      { tools: ["inspect_animation"], source: "server/tools/animation-inspection.ts", test: "tests/context-payload-cleanup.test.ts" },
      { tools: ["get_undo_stack"], source: "server/tools/history.ts", test: "tests/static-efficiency-budget.test.ts" },
      { tools: ["export_model"], source: "server/tools/export.ts", test: "tests/prelocal-generic-semantics.test.ts" },
    ];

    for (const mapping of mappings) {
      const row = implementation
        .split("\n")
        .find((line) => mapping.tools.every((tool) => line.includes(`\`${tool}\``)));
      expect(row).toBeDefined();
      expect(row).toContain(`\`mcp/${mapping.source}\``);
      expect(row).toContain(`\`mcp/${mapping.test}\``);
      expect(await Bun.file(mapping.source).exists()).toBe(true);
      expect(await Bun.file(mapping.test).exists()).toBe(true);
    }
  });

  test("proof docs separate accepted live baseline from current static/model-facing evidence", async () => {
    const [validation, context, implementation] = await Promise.all([
      text("../docs/foundation/validation-report.md"),
      text("../CONTEXT.md"),
      text("../docs/knowledge/implementation-map.md"),
    ]);

    expect(validation).toContain("LOCAL_ACCEPTANCE_COMPLETE");
    expect(validation).toContain("Fresh GitHub-Only Serialized Surface Proof");
    expect(validation).toContain("Native Deferred MCP Discovery Compatibility");
    expect(validation).toContain("P0–P4 Static Efficiency / Decision Proof");
    expect(validation).toContain("OFFICIALLY VERIFIED");
    expect(validation).toContain("LOCAL PROOF REQUIRED");
    expect(context).toContain("first bounded Codex + Blockbench local acceptance pass completed");
    expect(implementation).toContain("Deferred MCP Discovery Ownership");
    expect(implementation).toContain("Authoring Decision / Recovery Ownership");
  });
});''')

# Only one authored MCP prompt source remains; generated manifest stays separate.
prelocal = ROOT / 'mcp/tests/prelocal-prompt-skill-surface.test.ts'
pre = prelocal.read_text(encoding='utf-8')
old = '''  test("maintainer references remain source files but are excluded from the runtime bundle", async () => {\n    const files = (await readdir("prompts"))\n      .filter((name) => name.endsWith(".md"))\n      .sort();\n    expect(files).toEqual([\n      "bedrock_entity_workflow.md",\n      "blockbench_code_eval_safety.md",\n      "blockbench_native_apis.md",\n    ]);\n\n    const manifest = JSON.parse(await source("prompts/manifest.json")) as {\n      prompts: Record<string, string>;\n    };\n    expect(Object.keys(manifest.prompts)).toEqual(["bedrock_entity_workflow"]);\n\n    const generator = await source("build/generate-manifest.ts");\n    expect(generator).toContain('const RUNTIME_PROMPT_FILES = ["bedrock_entity_workflow.md"] as const;');\n    expect(generator).not.toContain('new Glob("*.md")');\n  });'''
new = '''  test("only the canonical runtime workflow remains as authored prompt source", async () => {\n    const files = (await readdir("prompts"))\n      .filter((name) => name.endsWith(".md"))\n      .sort();\n    expect(files).toEqual(["bedrock_entity_workflow.md"]);\n\n    const manifest = JSON.parse(await source("prompts/manifest.json")) as {\n      prompts: Record<string, string>;\n    };\n    expect(Object.keys(manifest.prompts)).toEqual(["bedrock_entity_workflow"]);\n\n    const generator = await source("build/generate-manifest.ts");\n    expect(generator).toContain('const RUNTIME_PROMPT_FILES = ["bedrock_entity_workflow.md"] as const;');\n    expect(generator).not.toContain('new Glob("*.md")');\n  });'''
if pre.count(old) != 1:
    raise SystemExit('prelocal prompt skill test block changed unexpectedly')
prelocal.write_text(pre.replace(old, new, 1), encoding='utf-8')

# -----------------------------------------------------------------------------
# Remove historical/duplicate active-tree documentation. Git history is archive.
# -----------------------------------------------------------------------------
remove_files = [
    'docs/README.md',
    'docs/foundation/00-agent-policy.md',
    'docs/foundation/03-modelling-workflow.md',
    'docs/foundation/README.md',
    'docs/knowledge/index.md',
    'docs/knowledge/minimal-nav.md',
    'docs/knowledge/decision-log.md',
    'docs/knowledge/operations/README.md',
    'docs/knowledge/operations/task-board.md',
    'docs/knowledge/workspace-map.md',
    'mcp/prompts/blockbench_code_eval_safety.md',
    'mcp/prompts/blockbench_native_apis.md',
]
for path in remove_files:
    p = ROOT / path
    if not p.exists():
        raise SystemExit(f'expected obsolete file missing before cleanup: {path}')
    p.unlink()

for path in [
    'docs/knowledge/decisions',
    'docs/knowledge/reviews',
    'docs/knowledge/skills',
    'docs/knowledge/sources',
    'workspace/active',
    'workspace/saved',
]:
    p = ROOT / path
    if p.exists():
        shutil.rmtree(p)

# Current Markdown may not point to deleted active-tree owners.
obsolete_markers = [
    '03-modelling-workflow.md',
    'decision-log.md',
    'reviews/review-graph.md',
    'skills/activation-matrix.md',
    'skills/skill-map.md',
    'minimal-nav.md',
    'operations/task-board.md',
    'sources/source-map.md',
    'workspace-map.md',
    'blockbench_native_apis.md',
    'blockbench_code_eval_safety.md',
]
violations = []
for p in ROOT.rglob('*.md'):
    if '.git' in p.parts or 'node_modules' in p.parts:
        continue
    text = p.read_text(encoding='utf-8', errors='replace')
    for marker in obsolete_markers:
        if marker in text:
            violations.append(f'{p}: {marker}')
if violations:
    raise SystemExit('stale Markdown references remain:\n' + '\n'.join(violations))

print('Repository hygiene cleanup applied successfully.')
