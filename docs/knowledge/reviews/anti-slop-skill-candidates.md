# Anti-Slop Skill Candidate Review

Date: 2026-07-31  
Scope: suitability for preventing unsupported geometry guesses, false
completion claims, stale or duplicated context, overdevelopment, and excessive
tool usage in MCP-Blockbench.  
Method: official repositories, documentation, source metadata, releases, and
issues only. Marketing claims are not treated as proof of MCP-Blockbench
behavior.

## Verdict

| Candidate | What it is | Recommendation | Useful here for | Does not solve |
|---|---|---|---|---|
| `anus-dev/ANUS` | Standalone AI-agent CLI and MCP client | **Reject** | Nothing not already provided more safely by Codex | Geometry evidence, completion proof, context efficiency |
| `memodb-io/Acontext` | Agent-memory backend and SDK | **Reject** | Long-term learned procedures in a custom agent stack | Geometry evidence; can preserve incorrect conclusions |
| `Graphify-Labs/graphify` | CLI, Codex skill, and optional MCP knowledge graph | **Optional** | Large cross-module codebase questions | Visual geometry, runtime proof, completion gates |
| `mksglu/context-mode` | Codex plugin, hooks, MCP server, and local context store | **Optional** | Large tool-output reduction and partial session continuity | Visual correctness, unsupported guesses, false completion |

**Overall:** adopt none as the core anti-slop mechanism. The primary failures
are missing evidence gates, not missing memory or orchestration. Graphify and
context-mode may be useful narrowly, but making either mandatory would add
tools and state without proving the model follows the Model Reference.

## 1. ANUS CLI / Autonomous Networked Utility System

**Exact project:** [`anus-dev/ANUS`](https://github.com/anus-dev/ANUS). The old
`nikmcfly/ANUS` URL redirects to this repository.

### Verified behavior

ANUS is a standalone Grok-oriented terminal agent, not a reusable Agent Skill.
It automatically ingests the current directory, uses filesystem and shell
tools, supports MCP integrations, and requires Node.js 20 plus an OpenRouter
API key. Its package is `@anus-dev/anus`
([README](https://github.com/anus-dev/ANUS#installation--setup),
[package.json](https://github.com/anus-dev/ANUS/blob/main/package.json)).
Running it would create a second agent loop beside Codex rather than strengthen
MCP-Blockbench's existing modelling workflow.

The repository describes autonomous self-development as a future vision, not
current verified behavior. It also says 99% of the codebase is AI-generated and
requires contributions to be at least 80% AI-generated
([README](https://github.com/anus-dev/ANUS#vision--roadmap)). Those are project
identity and contribution policies, not evidence that its output is less prone
to AI slop.

### Compatibility, runtime, and risks

- **Codex compatibility:** no Codex skill or plugin is provided. ANUS can use
  MCP servers, but it is itself an alternative CLI agent.
- **Runtime/services:** Node.js 20+, global npm package, OpenRouter account/API
  key, and potentially Docker or Podman for sandbox modes. The package also
  references a remote sandbox image
  ([package.json](https://github.com/anus-dev/ANUS/blob/main/package.json)).
- **Data/privacy/security:** project files and prompts are sent to the selected
  model through OpenRouter; the agent has workspace and shell capabilities.
  Upstream explicitly calls it an experimental, entertainment-focused project
  that should not be used in production or with sensitive data
  ([SECURITY.md](https://github.com/anus-dev/ANUS/blob/main/SECURITY.md)).
- **License:** Apache-2.0
  ([LICENSE](https://github.com/anus-dev/ANUS/blob/main/LICENSE)).
- **Maintenance:** the visible main-branch history ends in September 2025, the
  package remains `0.1.0`, and GitHub has no published releases
  ([commits](https://github.com/anus-dev/ANUS/commits/main),
  [releases](https://github.com/anus-dev/ANUS/releases)).

### Fit for MCP-Blockbench

It may execute multi-step tasks, but it has no reference-image comparator,
Blockbench geometry invariant, claim-evidence gate, or protection against
unsupported cube placement. A second autonomous agent would add model calls,
directory ingestion, tool calls, and another context policy. Expected impact is
therefore **higher API and tool usage with no demonstrated quality gain**.

**Recommendation: Reject.** It conflicts with the goal of the smallest
evidence-backed workflow and its own security policy rules out this use.

## 2. AContext Agent Skills / Memory Layer

**Exact project:** [`memodb-io/Acontext`](https://github.com/memodb-io/Acontext).

### Verified behavior

AContext is an agent-memory platform and SDK, not a drop-in Codex skill. It
stores session messages and execution history, runs an LLM distillation pass
after a task is classified as complete or failed, and writes the inferred
lessons into Markdown skill files. Recall is performed through
`list_skills`, `get_skill`, and `get_skill_file`
([README: store and recall](https://github.com/memodb-io/Acontext#how-it-works)).

The claim that agents “learn from mistakes” means an LLM summarizes prior runs;
it is not an objective verifier. Because learning is triggered by reported task
outcomes, an incorrect completion claim can be distilled into persistent
memory unless a human or an external validator corrects it first.

### Compatibility, runtime, and risks

- **Codex compatibility:** skill memories are portable Markdown, but the
  official setup documents Claude Code and OpenClaw, not a Codex adapter.
  Codex use would require custom SDK/tool integration
  ([README](https://github.com/memodb-io/Acontext#use-it-to-improve-your-agent)).
- **Runtime/services:** cloud use requires an AContext account and API key.
  Self-hosting requires Docker and an OpenAI API key; the default model is
  `gpt-4.1`. The documented backend includes FastAPI, PostgreSQL, S3, Redis,
  RabbitMQ, and a web dashboard
  ([self-host quickstart](https://github.com/memodb-io/Acontext#connect-to-acontext),
  [architecture](https://github.com/memodb-io/Acontext#architecture)).
- **Data/privacy/security:** cloud mode stores messages, files, skills, and
  task state in AContext infrastructure. Self-host mode retains those records
  locally but still sends distillation prompts to the configured LLM unless a
  local provider is substituted. Per-project encryption is documented, but it
  does not remove the need to govern message and trace retention
  ([session storage](https://docs.acontext.io/store/overview)).
- **License:** Apache-2.0
  ([LICENSE](https://github.com/memodb-io/Acontext/blob/main/LICENSE)).
- **Maintenance:** active multi-package development is visible, with TypeScript
  SDK `0.1.21` released in April 2026 and ongoing commits/issues
  ([releases](https://github.com/memodb-io/Acontext/releases),
  [commits](https://github.com/memodb-io/Acontext/commits/main)).

### Fit for MCP-Blockbench

AContext could reduce repeated explanation across sessions, but this workspace
already has inspectable `CONTEXT.md`, `next-action.md`, foundation rules, and
skills. AContext would duplicate that layer with a database, several services,
new tools, and an extra LLM pass. Each learning run consumes additional model
tokens; each recall adds tool calls and skill content to context. Upstream
publishes no MCP-Blockbench benchmark showing a net token reduction.

It cannot inspect a Blockbench preview, measure five-view similarity, or prove
that a tool succeeded visually. More importantly, automatically evolving
skills from unverified outcomes risks making stale or false rules durable.

**Recommendation: Reject.** Reconsider only if MCP-Blockbench later becomes a
multi-user agent service that genuinely needs cross-session learned memory.

## 3. Graphify

**Exact project:** [`Graphify-Labs/graphify`](https://github.com/Graphify-Labs/graphify),
currently developed on its `v8` branch.

### Verified behavior

Graphify is a Python CLI that installs a small assistant skill and can also
serve its graph through MCP. It parses code with tree-sitter into a local
knowledge graph; relations are labelled `EXTRACTED` or `INFERRED`. It generates
`graphify-out/graph.json`, an HTML viewer, and a Markdown report
([README](https://github.com/Graphify-Labs/graphify/blob/v8/README.md)).

For source code, graph construction is deterministic and does not require an
LLM. Semantic extraction for prose, PDFs, images, and video uses the assistant
model or a configured API backend
([README: privacy boundary](https://github.com/Graphify-Labs/graphify/blob/v8/README.md#readme)).
This can improve code-navigation questions, but it does not reason about the
content of a live Blockbench scene or compare model renders with a reference.

### Compatibility, runtime, and risks

- **Codex compatibility:** direct Codex installation is supported and writes
  instruction/skill files. On Codex, the documented `PreToolUse` hook is
  intentionally a no-op, so graph-first behavior remains instruction-driven
  rather than enforced
  ([install table](https://github.com/Graphify-Labs/graphify/blob/v8/README.md#install),
  [v0.9.27 notes](https://github.com/Graphify-Labs/graphify/releases/tag/v0.9.27)).
- **Runtime/services:** Python 3.10+, preferably `uv` or `pipx`, with NetworkX,
  NumPy, RapidFuzz, and many tree-sitter language packages. MCP serving is an
  optional extra
  ([pyproject.toml](https://github.com/Graphify-Labs/graphify/blob/v8/pyproject.toml)).
- **Data/privacy/security:** code parsing is local and does not execute source
  files. URL ingestion and semantic media/document passes can make network or
  model calls. Queries are logged locally by default. HTTP MCP serving is
  opt-in, loopback-bound by default, and should use an API key if exposed
  ([security model](https://github.com/Graphify-Labs/graphify/blob/v8/SECURITY.md),
  [query logging](https://github.com/Graphify-Labs/graphify/blob/v8/README.md#environment-variables)).
- **License:** package metadata and the primary license declare Apache-2.0. An
  additional MIT license file exists, but its scope is not explained in package
  metadata; treat Apache-2.0 as governing unless upstream clarifies
  ([pyproject.toml](https://github.com/Graphify-Labs/graphify/blob/v8/pyproject.toml),
  [LICENSE](https://github.com/Graphify-Labs/graphify/blob/v8/LICENSE),
  [LICENSE-MIT](https://github.com/Graphify-Labs/graphify/blob/v8/LICENSE-MIT)).
- **Maintenance:** very active; `0.9.31` was released on 2026-07-30 with
  resolution and MCP compatibility fixes
  ([release](https://github.com/Graphify-Labs/graphify/releases/tag/v0.9.31)).
  However, `SECURITY.md` still lists `0.3.x` as the supported line while the
  package is `0.9.31`, showing documentation drift.

### Fit for MCP-Blockbench

Graphify can reduce repeated broad file searches after its graph has been
built. Its own benchmark reports zero LLM credits for code graph construction,
but there is no verified token benchmark for this repository
([benchmarks](https://github.com/Graphify-Labs/graphify/blob/v8/BENCHMARKS.md)).
The initial scan, generated `graphify-out/` state, graph queries, and update
workflow add storage and maintenance. This overlaps with the existing
minimal-navigation docs and is unnecessary for normal modelling.

**Recommendation: Optional.** Use only for genuinely cross-module architecture
work where existing `rg`, module notes, and targeted reads are insufficient.
Do not install it as a geometry or completion-quality guard.

## 4. context-mode

**Exact project:** [`mksglu/context-mode`](https://github.com/mksglu/context-mode).

### Verified behavior

context-mode is a Codex plugin plus an MCP server, lifecycle hooks, local
SQLite/FTS5 storage, sandbox execution tools, and routing instructions. It
keeps large command/tool output in a subprocess or local index and returns
smaller selected results. It also captures session events and attempts to
restore working state after compaction
([README](https://github.com/mksglu/context-mode#how-context-mode-solves-it)).

The advertised “98%” is an upstream benchmark over selected large-output
scenarios, not an independent result and not a quality score. Published examples
show 94–100% byte reduction for logs, web snapshots, and repository research
([benchmark table](https://github.com/mksglu/context-mode#benchmarks)).

### Compatibility, runtime, and risks

- **Codex compatibility:** Codex CLI is explicitly supported through a plugin
  or manual MCP/hooks configuration. Hooks require feature flags and user
  trust; Codex input rewriting is not supported yet, and session continuity is
  classified as partial. Support for the Codex desktop application used by
  this workspace is not separately proven
  ([Codex setup and limits](https://github.com/mksglu/context-mode#codex-cli--mcp--hooks)).
- **Runtime/services:** Node.js 22.5+ or Bun, `better-sqlite3`, MCP SDK, Zod,
  local SQLite databases, 11 MCP tools, and several lifecycle hooks
  ([package.json](https://github.com/mksglu/context-mode/blob/main/package.json)).
- **Data/privacy/security:** the default workflow is documented as local-only,
  but it persists user prompts, tool events, file activity, and tool inputs.
  Common credential fields are regex-redacted, which reduces but cannot
  guarantee elimination of secrets
  ([security and storage](https://github.com/mksglu/context-mode#security)).
  Release notes also document a platform bridge for **analytics-opt-in** users
  that forwards derived prompt, cost, and session-event metadata. Therefore the
  broad “nothing leaves your machine” claim applies only when that optional
  analytics path is disabled
  ([v1.0.162 release](https://github.com/mksglu/context-mode/releases/tag/v1.0.162)).
- **License:** Elastic License 2.0, source-available rather than OSI
  open-source; hosted/managed-service redistribution is restricted
  ([LICENSE](https://github.com/mksglu/context-mode/blob/main/LICENSE)).
- **Maintenance:** active, with `1.0.169` released in June 2026 and current
  Codex/Windows fixes and ongoing repository activity
  ([releases](https://github.com/mksglu/context-mode/releases),
  [commits](https://github.com/mksglu/context-mode/commits/main)).

### Fit for MCP-Blockbench

This is the closest candidate for excessive output and context loss. It may
reduce tokens when commands would otherwise return large logs or files and may
restore decisions after compaction. It also adds MCP schemas, hooks, SQLite
state, routing reminders, and extra tool calls. Upstream documents that the
most aggressive reminder setting costs about 250 tokens per matching call;
the default reminder is less frequent
([routing guidance](https://github.com/mksglu/context-mode#routing-guidance-environment-variables)).

It cannot determine whether a zebra silhouette matches five views, whether
cubes touch correctly, or whether “geometry complete” is true. Compressed
context can also hide evidence if the retrieval query is poor. It addresses
context volume, not evidence quality.

**Recommendation: Optional.** Pilot only if measured Codex CLI sessions are
actually dominated by large tool output or compaction loss. Keep it out of the
mandatory modelling path and disable analytics during any local evaluation.

## Decision for MCP-Blockbench

The anti-slop control should remain a small, local, Codex-compatible skill
using existing workspace evidence:

1. every geometry claim names its Model Reference view or measured runtime
   fact;
2. unsupported geometry remains unresolved rather than guessed;
3. tool success is never visual proof;
4. completion requires the existing structural and visual approval gates;
5. repeated failure stops patch churn and triggers diagnosis;
6. only the smallest relevant context is read.

These controls directly address the observed failures and require no new
framework, database, server, model call, or generated knowledge graph.

## Second candidate round — 2026-07-31

Scope: primary-source review of `gsd-build/get-shit-done`,
`multica-ai/andrej-karpathy-skills`, and `supermemoryai/supermemory` for one
specific purpose: preventing unsupported geometry guesses, false completion
claims, stale context, overdevelopment, and excessive tool use in
MCP-Blockbench. No package was installed and no runtime test was performed.

### Round verdict

| Candidate | Recommendation | Useful contribution | Decisive limitation here |
|---|---|---|---|
| `gsd-build/get-shit-done` | **Reject** | Structured planning, persistent state, verification phases | Archived, very large orchestration surface, and no Blockbench visual-evidence gate |
| `multica-ai/andrej-karpathy-skills` | **Optional — reference material only** | Small rules against assumptions, overengineering, and unrelated edits | Mostly duplicates current workspace rules and cannot prove geometry or completion |
| `supermemoryai/supermemory` | **Reject as anti-slop control** | Real Codex CLI memory integration and cross-session recall | Memory is not evidence; automatic capture can preserve and re-inject incorrect conclusions |

### Screenshot and project-identity verification

The three screenshots point to real repositories:

- [`gsd-build/get-shit-done`](https://api.github.com/repos/gsd-build/get-shit-done)
  is the same project shown in the screenshot. Its approximately 64K-star claim
  is credible: the GitHub API reported about 64.8K stars on 2026-07-31.
  However, the screenshot omits a now-critical fact: the repository was
  archived on 2026-06-26 and its README redirects development to
  [`open-gsd/gsd-core`](https://github.com/open-gsd/gsd-core).
- [`multica-ai/andrej-karpathy-skills`](https://api.github.com/repos/multica-ai/andrej-karpathy-skills)
  is the current identity of the project formerly addressed through
  `forrestchang/andrej-karpathy-skills`; the old API URL redirects to the
  current repository. Its screenshot's approximately 174K-star figure was not
  inflated relative to the current repository: the API reported about 198K
  stars on 2026-07-31.
- [`supermemoryai/supermemory`](https://api.github.com/repos/supermemoryai/supermemory)
  is the project shown. Its screenshot's approximately 27K-star figure is
  consistent with the API's approximately 28.7K stars on 2026-07-31.

Star counts prove project identity and popularity only. They do not prove
Codex Desktop compatibility, lower token use, or prevention of AI slop.

### 1. `gsd-build/get-shit-done`

#### What it actually is

GSD is not one anti-slop skill. It is a complete spec-driven development
framework placed between a user and an AI coding runtime. Its archived
[architecture](https://github.com/gsd-build/get-shit-done/blob/main/docs/ARCHITECTURE.md)
documents persistent `.planning/` artifacts, workflow commands, hooks, an SDK,
specialized agents, research/planning/execution waves, and verification stages.
The documented inventory includes 33 agents, 11 hooks, and a routed skill
surface whose flat form contained 86 skills. Its new-project flow can start
four researchers in parallel, then synthesize, plan, execute, and verify.

This is a legitimate attempt to reduce context rot and improve software
delivery discipline. It is not a visual modelling system and it has no
five-view Blockbench comparator.

#### Codex compatibility

Codex CLI support is real rather than a screenshot-only claim. The archived
[README](https://github.com/gsd-build/get-shit-done#getting-started) documents
`npx get-shit-done-cc --codex --global` and installs generated skills under
`~/.codex/`. Its [configuration](https://github.com/gsd-build/get-shit-done/blob/main/docs/CONFIGURATION.md)
also has runtime-aware Codex settings. The exact archived project had
Codex-specific regressions, including a documented
[hook-startup issue](https://github.com/gsd-build/get-shit-done/issues/2637),
and later releases contain Codex hook fixes.

Official documentation says **Codex**, primarily in CLI/runtime terms. It does
not separately prove that the full hook, subagent, command, and state pipeline
works in the Codex Desktop application used for this workspace. Desktop
compatibility is therefore **unverified**.

#### Installation, runtime, and state

- Installer: `npx get-shit-done-cc`, global or project-local.
- Runtime: Node.js 22 or newer.
- Declared runtime dependencies: Anthropic Claude Agent SDK and `ws`
  ([package.json](https://github.com/gsd-build/get-shit-done/blob/main/package.json)).
- Writes skills/hooks/runtime files into the selected agent directory and
  creates a project `.planning/` tree containing project, requirements,
  roadmap, state, research, plans, summaries, and verification artifacts.
- Execution can create task-level commits and invoke multiple fresh-context
  agents.

#### Privacy, security, and license

Planning state is file-backed in the workspace. Model prompts, web research,
and agent execution still follow the selected host/model provider; the reviewed
repository does not establish that all task data stays offline. It includes
advisory prompt-injection/read guards and has a
[security policy](https://github.com/gsd-build/get-shit-done/blob/main/SECURITY.md),
but those controls do not validate visual geometry. The license is
[MIT](https://github.com/gsd-build/get-shit-done/blob/main/LICENSE).

Maintenance of this exact repository has ended: GitHub marks it archived and
the README points to the active
[`open-gsd/gsd-core`](https://github.com/open-gsd/gsd-core). The successor is
active and also supports Codex, but adopting that successor would still mean
adopting the same broad class of workflow framework, not a small evidence
guard.

#### Token and tool impact

The project explicitly optimizes its skill listing: its
[user guide](https://github.com/gsd-build/get-shit-done/blob/main/docs/USER-GUIDE.md)
reports about 120 tokens for six namespace routers versus about 2,150 for the
flat 86-skill listing. That optimization does not make the full workflow cheap:
researchers, planners, checkers, executors, and verifiers each receive context
and perform additional calls. The architecture describes fresh 200K contexts
for executors and parallel research/analysis stages. For MCP-Blockbench's
shortest-path goal, this is materially more orchestration and tool traffic than
the existing single-task workflow.

#### What it solves and does not solve

It can help software projects retain decisions, decompose work, run checks, and
avoid declaring a coding phase complete without its own verification records.
It does **not** know whether a cube follows the Model Reference, whether two
rotated cubes visually connect, or whether five Blockbench views have user
approval. Its generic verifier can still receive a false visual claim unless
MCP-Blockbench supplies the evidence rule—which is the control being designed.

**Recommendation: Reject.** It duplicates `CONTEXT.md`, `next-action.md`,
planning, and verification with a much larger system, while leaving the
geometry-evidence problem unsolved.

### 2. `multica-ai/andrej-karpathy-skills`

#### What it actually is

This is the smallest candidate. Its main artifact is a 47-line
[`SKILL.md`](https://github.com/multica-ai/andrej-karpathy-skills/blob/main/skills/karpathy-guidelines/SKILL.md)
with four behavioral principles:

1. surface assumptions and confusion;
2. prefer the simplest adequate implementation;
3. make only task-relevant edits;
4. define verifiable success criteria.

It also provides a `CLAUDE.md`, a Claude Code plugin wrapper, and a Cursor rule.
There is no verification engine, memory database, model call, MCP server, or
tool implementation.

#### Codex compatibility

The repository documents Claude Code and Cursor installation, not Codex. The
committed `SKILL.md` uses a conventional Agent Skill shape and its text could
be adapted manually to Codex, but the upstream project supplies no official
Codex installer, Codex Desktop test, Codex CLI test, hook, or issue-based proof.
Official Codex support is therefore **unverified** even though the content is
technically portable.

#### Installation, runtime, privacy, and license

The textual skill itself has no runtime, dependency, service, credential, or
network behavior. Copying only the Markdown would add no privacy exposure
beyond the agent already reading its instructions. Installing the documented
plugin path targets Claude Code.

The README and skill frontmatter label the work `MIT`, but the repository API
reports no detected license and the repository has no top-level license text.
The intended license is MIT; the complete repository-level grant is
**ambiguous/unverified**. Reusing the ideas in independently written local
instructions is safer than copying the file verbatim.

Maintenance is light: the API showed 28 commits, no tags or releases, and a
last push on 2026-04-20. Popularity is high, but release/version discipline is
absent.

#### Token and tool impact

As an activated skill, the body is about 2.46 KB and makes no tool calls.
Pasting it into an always-loaded agent file would charge that instruction text
to every relevant session instead. No official benchmark proves a reduction in
rework or tokens.

#### What it solves and does not solve

Its advice directly addresses silent assumptions, overdevelopment, and
unrelated edits. Those are real MCP-Blockbench failure modes. However:

- it does not require a claim to name its evidence source;
- it does not distinguish structural proof from visual proof;
- it does not know `REFERENCE_READY`, the five reference views, or geometry
  approval;
- it does not prevent a model from calling an unsupported result “verified”;
- it does not persist or validate current task state.

Most of its useful content already exists in this workspace's `AGENTS.md`,
root-cause gate, minimal context routing, Ponytail rules, `CONTEXT.md`, and
visual approval policy.

**Recommendation: Optional—reference material only.** Do not install it as a
second overlapping behavior layer. Preserve the useful ideas through the
proposed local evidence gate, expressed in MCP-Blockbench's own terminology.

### 3. `supermemoryai/supermemory`

#### What it actually is

Supermemory is a memory/context platform, API, local server, MCP server, and set
of client integrations. It extracts facts from conversations and documents,
stores them in project/user containers, searches them, maintains profiles, and
injects retrieved context into agents
([main repository](https://github.com/supermemoryai/supermemory)).

Unlike the earlier memory candidate, official Codex support now exists through
the separate
[`supermemoryai/codex-supermemory`](https://github.com/supermemoryai/codex-supermemory)
plugin.

#### Codex compatibility

The official
[Codex integration guide](https://github.com/supermemoryai/supermemory/blob/main/apps/docs/integrations/codex.mdx)
documents Codex **CLI** hooks and skills:

- `UserPromptSubmit` recalls and injects memories before prompts;
- `Stop` flushes remaining turns;
- explicit skills search, save, forget, inspect profile, and manage login.

The installer modifies `~/.codex/config.toml`, `~/.codex/hooks.json`, copies
bundled scripts, and installs skills. This is genuine Codex CLI support.
Neither that guide nor the plugin README separately verifies operation in
Codex Desktop, so Desktop support remains **unverified**.

#### Installation, runtime, dependencies, and services

Cloud/plugin path:

- `npx codex-supermemory@latest install`;
- browser OAuth or a Supermemory API key;
- default remote service `https://api.supermemory.ai`;
- recall request on every prompt;
- automatic capture every three turns by default and a final flush at session
  end.

Self-host path:

- `npx supermemory local`, `bunx supermemory local`, or the published server
  binary;
- embedded graph storage, local embeddings, and an LLM provider;
- supports OpenAI, Anthropic, Gemini, Groq, OpenAI-compatible endpoints, and
  fully local options;
- direct published binaries are officially documented for macOS and Linux,
  not Windows
  ([self-host quickstart](https://github.com/supermemoryai/supermemory/blob/main/apps/docs/self-hosting/quickstart.mdx)).

Therefore the screenshot's “runs fully on your own machine” claim is true for
supported local deployments, but it is not a verified one-command native
Windows solution for this workspace.

#### Privacy, security, and license

Cloud mode stores conversation/project material with Supermemory. Its official
[privacy policy](https://supermemory.ai/privacy/) says uploaded/user data is
stored and processed and may be sent to third-party AI providers such as
OpenAI or Gemini when AI features are used. The Codex plugin redacts only
content explicitly wrapped in `<private>...</private>` before sending; default
automatic capture is otherwise broad. Project tags and API scoping reduce
cross-project mixing but do not prove that extracted facts are correct.

Self-hosting can keep storage local and can use a local model, but it introduces
a persistent server, credentials, embeddings, storage, backups, and update
work. The main repository is
[MIT-licensed](https://github.com/supermemoryai/supermemory/blob/main/LICENSE).
The Codex plugin README says MIT, although its repository API does not detect a
license file.

Maintenance is active: the main repository had more than 1,800 commits, a push
on 2026-07-31, and server releases in July 2026. The Codex plugin also had
recent July 2026 activity.

#### Token and tool impact

The plugin avoids model-invoked recall for its automatic path, but it still
adds a network/local-server request before each prompt and writes memories
every three turns. Defaults allow up to five memories plus five profile items
to be considered/injected per prompt. Exact added token counts and end-to-end
latency for Codex are not published, so savings claims for this workspace are
**unverified**.

It may reduce repeated explanations across separate sessions. It also expands
every prompt with retrieved text and can repeatedly surface a stale or
incorrect extracted conclusion. The explicit `forget` skill is remediation
after the fact, not an evidence gate.

#### What it solves and does not solve

It can solve genuine cross-session forgetting and make project decisions easier
to recall. It cannot determine whether a geometry claim is supported by the
Model Reference, inspect five views, distinguish MCP success from visual
success, or block false completion. Automatically remembering an unsupported
claim can make the anti-slop problem worse by turning one hallucination into
future context.

**Recommendation: Reject as the anti-slop control.** Reconsider only as a
separate memory experiment if measured cross-session loss remains after the
existing file-backed context system is used correctly.

### Comparison with the current MCP-Blockbench controls

| Needed control | Current workspace | GSD | Karpathy guidelines | Supermemory | Minimal evidence gate |
|---|---|---|---|---|---|
| Stable facts and terminology | `CONTEXT.md` | Duplicates with planning artifacts | No persistence | Retrieves stored facts | Reads existing source |
| Current goal/decision/blocker | `next-action.md` | Duplicates with `STATE.md`/roadmap | No persistence | Can recall, not validate | Requires current task source |
| No unsupported geometry | Reference Package + explicit unresolved state | No geometry-specific rule | General “do not assume” | Can remember guesses | Requires evidence per claim |
| No false completion | Structural check + five-view visual approval | Generic verify phase | General success criteria | No completion gate | Blocks completion without acceptance proof |
| No overdevelopment | AGENTS root-cause gate + Ponytail | Large framework overhead | Useful but duplicated | Not addressed | Stops changes outside proved cause |
| Low tool/token use | Minimal navigation and one active task | High orchestration surface | Very low | Per-prompt retrieval/capture | No service or extra model call |

### Second-round conclusion

None should be adopted as the core MCP-Blockbench anti-slop control.

- GSD contains useful verification concepts but is the overdevelopment pattern
  this workspace is trying to avoid.
- Karpathy's guidelines are the best conceptual match, but they are generic,
  mostly already present, and weaker than a claim-to-evidence rule.
- Supermemory is a credible Codex CLI memory product, not a truth or visual
  verification product.

The smallest adequate solution remains one local evidence gate that reuses
`CONTEXT.md`, `next-action.md`, the Ready Reference Package, structural proof,
and user visual approval. It should add no service, database, generated project
graph, automatic memory, or extra model loop.
