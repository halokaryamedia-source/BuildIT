# BlockIT Navigator — Context Projection Proposal

Status:

```text
PROPOSAL
NOT IMPLEMENTED
NOT PRODUCTION
BASELINE: BlockIT v0.2.0 / Local @ b6c29c5d9edb7bb5058c42bbce123efe9dc02ed8
```

## Purpose

BlockIT already has a capable MCP Runtime and a stable four-tool Gateway, but Codex can still spend too much context and reasoning effort reconstructing where it is, which owner applies, which capability is relevant, what state is current, and whether information is stale.

BlockIT Navigator is proposed as a **machine-first, headless navigation/context layer** for Codex. It is not a new MCP, not a user-facing application requirement, and not a second workflow authority.

Primary goals:

1. reduce repeated context loading and repository scanning;
2. reduce capability-discovery and wrong-route loops;
3. preserve exact canonical information without paraphrase drift;
4. make current project/runtime/development state explicit;
5. deliver only decision-relevant context;
6. keep the existing Gateway as the stable Codex front door;
7. improve Cost to Accepted Result rather than optimize token count in isolation.

## Core Principle

```text
SELECT, DON'T SUMMARIZE
```

Navigator must not rewrite canonical knowledge into another human-authored summary that can drift.

Instead:

```text
canonical source
→ deterministic index
→ exact relevant projection
→ content identity/hash
→ compact initial snapshot
→ delta-only continuation
```

The information stays owned by its existing canonical source. Navigator resolves, filters, ranks, projects and caches it.

## Proposed Method — Canonical Context Projection

The design uses five primary methods together.

### 1. Single Source of Truth

Do not copy Tool, Skill, Prompt, workflow or ownership knowledge into a second Navigator-authored knowledge base.

Examples of existing authorities remain authoritative:

```text
Runtime ToolSpec/schema     → MCP source
phase/surface classification → existing phase owner
specialist knowledge         → current-worktree Skill
runtime workflow prompt      → canonical prompt source
asset continuity/state       → workspace owner
runtime identity/state       → live Runtime health/state
build/install sync           → development sync owner
```

Navigator stores references/metadata, not duplicate prose.

### 2. Content-Addressed Context

Each projectable canonical unit receives a stable logical ID plus content hash, for example:

```text
ctx:skill/geometry@<hash>
ctx:skill/texturing@<hash>
ctx:skill/animation@<hash>
ctx:tool/manage_cubes@<hash>
ctx:workflow/authoring@<hash>
```

If the logical owner and hash are unchanged, the same content does not need to be delivered again during the active task context.

A product version alone is insufficient during development because many different source revisions can share the same package version.

### 3. Progressive Projection

Context is delivered in levels instead of dumping the whole BlockIT surface.

#### L0 — Navigation Packet

Default orientation payload:

```text
mode
asset/project
stage
owner
revision
next intent
blocker
health/sync
required context handles
```

#### L1 — Working Context

Only after the owner is resolved:

```text
matching specialist handle
small relevant capability set
current gates/state
current project affinity
```

#### L2 — Exact Detail

Loaded only when needed:

```text
exact capability schema branch
exact canonical section
source owner
test owner
diagnostics/development detail
```

Normal authoring must not receive MCP development history, CI, broad source maps or unrelated capability schemas.

### 4. Exact Selection / Field Projection

Projection must be lossless for selected material.

Use exact sections/fields from canonical sources instead of AI summaries when correctness depends on exact wording/schema.

For large consolidated capability schemas, project only the exact active branch while preserving the original field definitions. Existing Gateway schema-projection behavior is the model to extend.

Semantic/vector search is a fallback for genuinely unknown intent, not the normal navigation path. Known task class/domain/owner relationships should resolve deterministically.

### 5. Snapshot + Delta

Send one compact snapshot when a task starts/resumes or when its authority materially changes.

After that, mutation/result flows return only the navigation delta:

```text
revision_before → revision_after
changed state/gates
invalidations
next legal intent
new blocker/warning
changed context handles
```

Do not repeatedly call status/read the same Skill/re-send the same snapshot after every successful operation.

## Information Classes

Navigator should classify data before delivery.

### Static Knowledge

Usually indexed at build/generation time:

```text
Tool identities/schemas
capability ownership
phase/surface classification
Skill identities
Prompt identities
source/test ownership when relevant to development
```

### Live Operational State

Read from authoritative live/current owners:

```text
active Blockbench project
Gateway project affinity
authoring phase
workspace/current stage
current revision/gates
Runtime build identity
Runtime capability surface
blockers
```

### Development State

Only relevant to source/plugin development:

```text
source revision
built identity
installed identity
running Runtime identity
sync/reload state
last build status
```

### Historical / Proof Evidence

Lazy/on-demand only:

```text
current-validation
next-action
commit history
past defects
detailed test/proof evidence
```

These must not enter normal asset-authoring context automatically.

## Proposed Runtime Shape

Navigator v1 should remain inside the existing Gateway architecture rather than introducing a daemon, executable, database, tray application or second MCP server.

Proposed production location when implementation is authorized:

```text
mcp/gateway/navigator/
├─ types.ts
├─ snapshot.ts
├─ contextRegistry.ts
├─ resolveContext.ts
├─ resolveOwner.ts
├─ resolveCapabilities.ts
├─ resolveNextAction.ts
├─ delta.ts
└─ compact.ts
```

Optional generated metadata may be produced by the existing build system, for example:

```text
mcp/generated/context-index.json
```

Generated metadata must contain identities, hashes and relationships rather than duplicate canonical prose.

## Gateway Contract

Keep the existing four Gateway tools:

```text
status
search_capabilities
describe_capability
invoke_capability
```

Do not add a parallel Navigator tool family unless evidence later proves the four-tool boundary insufficient.

Proposed behavior:

### status

Return the compact navigation bootstrap plus health/affinity/sync state.

### search_capabilities

Rank/filter against current task, stage, owner and gate eligibility instead of lexical relevance alone.

### describe_capability

Return only exact relevant capability/schema projection plus current eligibility and canonical ownership metadata when needed.

### invoke_capability

Reuse current navigation state and return a compact navigation delta with the normal operation result. Wrong-stage or stale-context requests should fail closed with a precise recovery direction rather than forcing Codex to rediscover the system.

## Task Context and Cache

Navigator should maintain a lightweight task-context identity such as:

```text
asset:<id>:<stage>:rev<revision>
```

It tracks which content-addressed handles have already been delivered for that active context.

Context is refreshed only when a material authority changes, such as:

```text
project changed
stage/owner changed
workspace revision changed
capability catalog changed
canonical context hash changed
Runtime/build identity changed where relevant
```

Unchanged context should be referenced, not retransmitted.

## UI Boundary

Navigator is **machine-first**. A large user dashboard is not required.

The existing Blockbench panel may remain a minimal operational view, for example:

```text
BlockIT: Ready
Project: <name>
Stage: <stage>
Sync: Live | Stale | Reloading | Error
```

Advanced tools/resources/prompt diagnostics may remain available for troubleshooting, but Navigator accuracy must never depend on a user reading or operating a UI panel.

## Non-Goals

Navigator v1 must not become:

- a second MCP server;
- a second workflow/state authority;
- a duplicate Tool/Prompt/Skill knowledge base;
- a persistent general-purpose database;
- a Windows service/daemon requirement;
- a new authoring UI;
- a broad autonomous planner/compiler;
- a reason to expose more Gateway front-door tools;
- semantic search over the whole repo for every request;
- a token-minimization system that removes decision-critical information.

## Safety / Accuracy Invariants

1. Canonical content is never silently paraphrased when exact content is required.
2. A cached handle is reusable only while its content hash remains identical.
3. Stale project/runtime/catalog state must fail closed.
4. Mutation interruption remains subject to existing `OUTCOME_UNKNOWN` rules; Navigator does not blind-retry mutations.
5. Runtime/source/build identities remain distinct.
6. Navigator must not claim live/native proof from static repository information.
7. Generated context metadata is secondary to canonical source and must fail freshness checks when stale.
8. One authoritative route remains: Codex → Gateway → Runtime → Blockbench.

## Efficiency Model

Navigator success is not measured by smaller prompts alone.

Primary metric:

```text
Cost to Accepted Result
```

Supporting measurements should compare the v0.2.0 baseline with Navigator-enabled flows across representative tasks:

```text
context/instruction characters delivered
status calls
capability searches
describe calls
wrong-capability attempts
recovery calls
total tool calls
repeated canonical-context delivery
accepted-result quality
```

Representative benchmarks should include at least:

```text
new rigid prop
existing asset continuation
UV correction
texture correction
animation task
MCP source-development defect
```

Static footprint reduction alone is not proof of real authoring efficiency.

## Promotion Path

This proposal is isolated under `Experimental/` and does not change current BlockIT production behavior.

When implementation is explicitly authorized:

```text
1. define exact v1 acceptance contract
2. derive minimal context registry from current canonical owners
3. implement L0 navigation snapshot
4. implement exact capability/context projection
5. implement content hashes/handles
6. implement task-context cache
7. implement mutation navigation delta
8. add stale/freshness and routing regressions
9. benchmark against v0.2.0
10. promote only proven production pieces into mcp/gateway/navigator/
```

Do not thin existing Skills/Prompt or remove current routing rules before Navigator proves equivalent or better correctness on representative workflows.

## Current Decision

```text
FOLDER
Experimental/blockit-navigator/

DOCUMENT
Experimental/blockit-navigator/README.md

PRODUCTION SOURCE
NOT CREATED

CURRENT MCP/GATEWAY BEHAVIOR
UNCHANGED
```

The proposal exists to preserve the design without mixing unimplemented Navigator concepts into current production owners.