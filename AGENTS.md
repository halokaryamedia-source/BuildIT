# Workspace Agent Routing

## Instruction priority

- Current user intent takes precedence over workflow guidance in `AGENTS.md` and Skills; repository safety/integrity rules and actual capability limits still apply.
- Do not invent confirmation gates. If a Skill would pause, block, or redirect an explicit request, apply only the exact necessary constraint and name the rule when it materially changes the outcome.

## Branch and boot

- `Local` is working authority; `main` changes only on explicit user request.
- Material GitHub work follows `GITHUB_RULES.md`.

## Execution Context Gate

Classify by **actual capability**, not product/UI name:

```text
CONTEXT: REMOTE_GITHUB
CONTEXT: LOCAL_CODE
CONTEXT: LIVE_BLOCKBENCH
SWITCH CONTEXT: <REMOTE_GITHUB | LOCAL_CODE | LIVE_BLOCKBENCH>
```

A marker is intent, not proof. Without a marker, choose the lowest sufficient provable context. Never infer `LOCAL_CODE` from “Codex”; never infer `LIVE_BLOCKBENCH` from mentioning Blockbench. `LIVE_BLOCKBENCH` is never assumed.

```text
REMOTE_GITHUB   = GitHub repository + CI; no local worktree/Bun/installed Blockbench
LOCAL_CODE      = local checkout + Bun/tests/build/generators/filesystem
LIVE_BLOCKBENCH = LOCAL_CODE + deployed BlockIT + functioning Gateway/runtime connection
```

Proof ceiling follows actual context; exact-commit source acceptance follows `GITHUB_RULES.md`.

```text
REMOTE_GITHUB → exhaust source/static/CI-verifiable work first
higher-context dependency → partition; prepare independent tests/harness/evidence here
handoff only the minimum higher-context residue
never transfer the whole task because one residue needs more capability
covered source result complete → accept CI proof; label only genuinely missing higher-context proof
```

### Observe / recover context

For read-only `amati`, inspect, audit, or recovery:

```text
AGENTS.md → GITHUB_RULES.md Core Rules
→ smallest owner/evidence that can answer the question
→ CONTEXT.md / next-action only when prior state is material
→ report → STOP
```

### Repository / Plugin Work

```text
AGENTS.md → GITHUB_RULES.md Core Rules → EXECUTION CONTEXT
→ Bounded | Standard | Complex
→ nearest AGENTS.md + exact owner
→ only evidence/continuity that can change the decision
```

#### Development Execution Gate

**Bounded contract**
```text
Goal
Failure Classification / first wrong owner
Acceptance
Proof Required
STOP Condition
```

**Standard contract**
```text
Goal
Success Metric
Forbidden Proxy / Non-Goal
First Evidence Required / first wrong owner
In Scope / Out of Scope
Execution Partition / higher-context residue
Proof Required
STOP Condition
```

### Bounded Maintenance

Concrete bug, stale rule/test, CI routing defect, or behavior-preserving cleanup starts at the exact owner. Do not load `development-brief` merely because source code is involved.

### Standard Development

Use when requirement and owner are clear but work exceeds bounded maintenance. Finish the GitHub-verifiable partition before escalating generator/filesystem/native residue.

### Complex / Ambiguous Development

Use `.agents/skills/development-brief/SKILL.md` only when architecture, cross-owner ambiguity, unresolved success criteria, or a material unknown prevents a reliable standard contract. A clear optimization request does not become Complex merely because quality or efficiency matters.

## Task Class After Context

### Reference Preparation

Image/reference generation belongs in **ChatGPT** using `.agents/skills/blockbench-reference-generator/SKILL.md`. Codex authoring consumes the actual user-approved reference image; it does not recreate the reference workflow.

### Asset Authoring

Before any BlockIT Bedrock Entity authoring mutation:

```text
current AGENTS.md
→ .agents/skills/blockit-bedrock-entity-mcp/SKILL.md
→ exactly one matching current-worktree specialist

Geometry / rig / pivots / UV Layout
→ .agents/skills/blockbench-bedrock-modelling/SKILL.md

Texture Atlas / Styling / PBR / Texture Verify
→ .agents/skills/blockit-bedrock-texturing/SKILL.md

Animation / motion
→ .agents/skills/blockit-bedrock-animation/SKILL.md
```

No authoring mutation is allowed until the router + matching specialist are loaded from the current worktree and the specialist entry gate is satisfied. Load a new specialist only when semantic ownership changes.

Geometry↔Texturing use the shared AUTHORING surface: Geometry APPROVED → UV Layout PASS → Texturing → Texturing APPROVED. Animation remains a Gateway handoff.

Hot path:

```text
approved image + explicit asset requirements
→ active stage/owner
→ exact known Runtime capability
→ mutate
→ reuse returned state
→ minimum evidence that can change the verdict
```

`Geometry Strategy` is user-selected `DIRECT | 3D_ASSISTED`; never infer, default, or silently switch it. AUTHORING↔Animation handoff uses Gateway `switch_authoring_phase` in the same task; Geometry↔Texturing correction stays in AUTHORING.

For normal asset authoring, do not automatically load repository continuation/history/foundation docs, scan source/tests/CI, or run development verifiers. Asset authoring is not software **Development**; do not route it through `development-brief` unless repository/plugin behavior changes.

## GitHub Work

`GITHUB_RULES.md` owns branch/ref, GitHub-first partitioning, transfer, atomic delivery, CI/security, retries, and STOP.

## Source Precedence

current user → current source/proof → nearest `AGENTS.md` → required specialist → foundation/continuity only when material → history.

## Work Discipline

- Fix the minimum complete owner; no fallback/framework/profile layers without evidence.
- Reuse fresh returned state; do not add reassurance reads or progress checks.
- Stop the same failed direction after two attempts without new evidence.
- `No change required` is valid; never claim proof above the context ceiling.
- **Authoring Efficiency** = cost to accepted result; **Static Footprint** = guardrail only.

```text
CURRENT-PROJECT VERIFIED
OFFICIALLY VERIFIED
LOCAL PROOF REQUIRED
UNSUPPORTED
UNKNOWN
```

## Product Boundary

Minecraft Bedrock Entity (`bedrock`) remains default. For `mcp/**`, `mcp/AGENTS.md` owns package rules.

## Canonical Owners

GitHub → `GITHUB_RULES.md`; flow → `docs/knowledge/flow.md`; continuation → `docs/knowledge/next-action.md`; assets → `workspace/active/<project>/README.md`; facts → `CONTEXT.md`; ownership → `docs/knowledge/implementation-map.md`; proof → `docs/knowledge/current-validation.md`; policy → `docs/foundation/`; research → `Experimental/`.

Do not create duplicate navigation, review archives, decision logs, roadmaps, or parallel state systems.
