# BuildIT Foundation Audit

## Executive assessment

BuildIT is an ambitious and technically serious internal-alpha system. Its strongest work is not the modelling logic itself, but the explicit attempt to make AI production recoverable, evidence-bound, and safe. The project has substantially more governance, checkpointing, visual validation, and failure handling than a typical experimental MCP plugin.

The project is **not yet a repeatable production system**. It has a large amount of documented and tested internal machinery, but still lacks the evidence that matters most: several clean, diverse, end-to-end Blockbench productions on real workstations. Current green CI proves the TypeScript package is internally consistent. It does not prove the user promise.

### Current readiness

| Dimension | Score | Assessment |
| --- | ---: | --- |
| Product vision | 8.5/10 | Clear differentiated promise and strong understanding of user burden. |
| Reference-to-production concept | 8/10 | Coherent architecture; good separation between visual authority and construction. |
| Runtime safety | 7.5/10 | Strong identity, lease, state, evidence, checkpoint, and rollback intent. |
| Architecture coherence | 5/10 | Too many overlapping authorities and guard layers; several are stale. |
| User experience | 4.5/10 | The user journey is still installation-heavy and technically opaque. |
| Developer experience | 4.5/10 | High cognitive load, broad source surface, brittle documentation and test coupling. |
| Test credibility | 5/10 | Many tests pass, but too many assert source markers instead of external behavior. |
| Visual-quality generalization | 4/10 | Strong Rhino-specific history, insufficient multi-archetype proof. |
| Model-routing maturity | 3/10 | Heuristics exist; no representative evaluation or proven RouteLLM integration seam. |
| Operations and release | 3.5/10 | No reliable workstation E2E, rollback drill, installer lifecycle, or release qualification. |
| Security and permissions | 5/10 | Good write ownership concept; insufficient threat model and permission audit. |

**Overall:** approximately **5.5/10 as a repeatable internal production system**, **7.5/10 as a sophisticated prototype**, and **3/10 as an external product ready for other teams**.

## What is genuinely strong

### 1. The product problem is real

The system correctly recognizes that the difficult part is not merely generating cubes. The difficult part is preserving reference intent, controlling AI drift, recovering state, proving visual quality, and preventing the user from managing internal mechanics.

### 2. User and runtime files are separated

The `blockbench/` and `mcp/` split is a strong product decision. It makes the final package understandable while retaining enough state for recovery.

### 3. Evidence is treated as stateful

Binding evidence to project UUID, reference hash, geometry fingerprint, and state revision is materially better than accepting screenshots as timeless proof.

### 4. One-writer protection is appropriate

A local AI system with several agents and mutation tools needs an explicit writer authority. The lease concept is justified even if its implementation can be simplified.

### 5. Review gates are user decisions

Separating internal passes from user-visible reviews is correct. The user should approve visible output, not internal orchestration milestones.

### 6. The project actively rejects overdevelopment

The repeated attempt to prohibit duplicate profiles, repeated validation, alternate visual styles, recursive agents, and speculative features is directionally correct. The problem is that the anti-overdevelopment rules have themselves become overdeveloped and duplicated.

## P0 — blockers to claiming production readiness

### P0.1 No real end-to-end proof

**Bad:** The project has hundreds of checks around source, contracts, profiles, and evidence, but the remaining acceptance still requires a human workstation run. There is no automated or repeatable harness that proves:

```text
fresh machine/profile
→ plugin load
→ MCP connection
→ Reference Package import
→ project creation
→ geometry mutation
→ save/reopen
→ stage transitions
→ final export
→ completed package
```

**Impact:** CI can remain green while the actual product fails at plugin startup, Blockbench API behavior, filesystem permissions, Codex configuration, or desktop lifecycle.

**Required correction:** Build a real Windows-first Blockbench acceptance harness. Even when some UI steps remain human-assisted, setup, expected outputs, logs, and verdict must be deterministic and replayable.

### P0.2 Authority drift is already present

**Bad:** Runtime behavior was changed to automatic identity reconciliation and write ownership, while `STATE_MACHINE.md` and `PONYTAIL_EXECUTION.md` still instruct manual identity/lease steps. Development documents still present a linear authority order that the user has explicitly rejected.

**Impact:** Codex may follow stale instructions, developers may reintroduce removed behavior, and tests may lock contradictions instead of correctness.

**Required correction:** One domain map, one system foundation, and generated or tested summaries for state/routing contracts. Remove repeated operational instructions from documents that do not own them.

### P0.3 The active OpenSpec change is no longer a bounded change

**Bad:** `codex-local-workflow-rework` contains product goals, Minecraft visual policy, model routing, implementation history, completed regression work, local acceptance, deferred release work, P0 incidents, and repository-development skill integration. The task list is largely checked while the destination is not achieved.

**Impact:** A checked task list creates false completion. Reviewers cannot determine which decisions are current, which are historical, and which remain blocking. A future agent can justify almost any change by finding a related paragraph.

**Required correction:** Freeze the old change as implementation history. Use a new bounded foundation change with explicit destination, design, decisions, open questions, and tracer-bullet tasks.

### P0.4 RouteLLM cannot yet be treated as a working Codex router

**Bad:** RouteLLM is designed to route requests between a strong and weak model through its controller or OpenAI-compatible server. BuildIT currently relies on Codex-native model configuration, custom agent roles, ChatGPT sign-in, and tool permissions. A compatible interception seam has not been demonstrated.

**Impact:** Replacing the current routing policy prematurely could disable Codex authentication, tool use, model-specific behavior, agent roles, or cost attribution. RouteLLM's published routers were trained on a different model pair and distribution.

**Required correction:** Treat RouteLLM as an evaluation adapter first. Prove the provider/execution seam with a small prototype, then calibrate on BuildIT tasks. Do not describe it as installed runtime infrastructure until that prototype succeeds.

### P0.5 Quality is overfit to too few subjects

**Bad:** Black Rhinoceros and a failed giraffe dominate the quality story. The system has strong checks for the failures already observed, but limited evidence across different asset shapes.

**Impact:** A validator may pass rhino-like quadrupeds and fail or distort tall, thin, asymmetric, mechanical, multi-part, flying, or block-like subjects.

**Required correction:** Create a representative acceptance corpus with at least:

- low/wide quadruped;
- tall quadruped;
- biped;
- asymmetric creature or object;
- mechanical object;
- simple block asset;
- asset requiring animation;
- asset with several rotated attachments.

A Golden Sample should demonstrate quality, not become the only distribution.

### P0.6 The public production interface is still too low-level

**Bad:** The long-term user promise is automatic production, but Codex still sees and coordinates many low-level tools, stage reports, evidence calls, and transition details.

**Impact:** Tool-choice errors remain likely, token usage stays high, and internal refactors can break prompts and source-marker tests.

**Required correction:** Deepen the production module behind a small façade such as `start_asset`, `continue_asset`, `submit_current_stage`, `apply_review_decision`, and `finalize_asset`. Keep low-level tools as implementation details and diagnostics.

## P1 — serious maintainability and reliability risks

### P1.1 Source-marker tests create false confidence

**Bad:** Many tests verify that files contain exact strings, tool names, or wording. These tests are useful for generated adapters and compatibility markers but weak as proof of runtime behavior.

**Impact:** A broken implementation can pass because its source still contains the expected marker. A harmless refactor can fail because text moved.

**Correction:** Move critical claims to behavior tests through the highest public seam. Retain marker tests only for generated-file identity, explicit compatibility strings, and static policy declarations.

### P1.2 Guard installation order is an architectural dependency

**Bad:** Runtime behavior is assembled through many wrappers installed in a specific order around tool definitions.

**Impact:** A new guard or tool registration can silently bypass another guard, normalize stale output in the wrong order, or create nested side effects that are difficult to reason about.

**Correction:** Replace wrapper layering with one explicit execution pipeline:

```text
resolve context
→ authorize
→ reconcile
→ execute
→ persist
→ normalize result
→ audit
```

Each phase should have one interface and behavior tests.

### P1.3 Too many overlapping documents own the same rules

Rules are repeated across:

- `AGENTS.md`;
- OpenSpec proposal/tasks;
- Ponytail execution;
- Governance;
- State machine;
- Codex bootstraps;
- model routing;
- skill profiles;
- stage profiles;
- canonical skills;
- adapter skills;
- README files.

**Impact:** Drift is inevitable and context loading is expensive.

**Correction:** Assign one owner per rule class and make other documents link or summarize. Machine-readable contracts should generate human summaries where practical.

### P1.4 Filesystem transactions are not proven under failure

**Bad:** Workspace preparation and completion perform copies, renames, backups, deletions, and index writes. Unit/source tests do not prove crash behavior, Windows rename semantics, antivirus interference, disk-full behavior, or partial completion recovery.

**Impact:** The system can leave a model completed but the index active, or move an active project before metadata is safely committed.

**Correction:** Add fault-injection tests around every transaction phase and a recovery journal. Verify on Windows filesystems.

### P1.5 Reference package copy can hide naming and path problems

Potential problems include:

- duplicate image basenames from different source subdirectories;
- symlink traversal;
- unexpected large files;
- unsupported encoding or corrupt JSON;
- package schema version drift;
- workspace root derived from the wrong process working directory.

**Correction:** Materialize to a staging directory, validate all entries, reject collisions/traversal, then atomically promote.

### P1.6 Setup is not truly zero-setup

The developer/user environment may require:

- Bun;
- Blockbench desktop;
- plugin installation and permissions;
- Codex-compatible config version;
- Python or `uvx` for Code Review Graph;
- possibly provider credentials for routing experiments.

**Impact:** The system is zero-setup only after substantial one-time setup.

**Correction:** Rename the promise to **zero coordination per asset after one-time installation**. Build a versioned installer/preflight that reports exact missing prerequisites and supports uninstall/repair.

### P1.7 User-facing failures are too technical

Internal codes are valuable for developers, but the user needs a concise explanation:

```text
what failed
what is visible
what the system will repair
whether user input is required
what remains preserved
```

**Correction:** Map internal codes to user-facing recovery messages. Do not expose lease, profile, fingerprint, or evidence implementation detail unless support diagnostics are requested.

### P1.8 No operational telemetry exists for the stated optimization goals

The project repeatedly optimizes token use, calls, images, corrections, and model routes, but has no reliable run-level measurement store.

**Impact:** Complexity is added based on intuition, and savings claims cannot be verified.

**Correction:** Add local, privacy-preserving run summaries with no raw user content. Use them to compare baseline and candidate flows.

### P1.9 Direct work on `Rework` weakens change review

**Bad:** Large changes are written directly to the integration branch, and temporary PRs are created only to trigger CI.

**Impact:** There is no stable review diff, branch protection cannot stop partial work, and regressions can land between individual file updates.

**Correction:** Keep `Rework` as the integration target but use bounded branches/PRs for each foundation or runtime slice. Add workflow dispatch or push CI that works without dummy PRs.

### P1.10 Security boundaries are under-documented

The plugin can access filesystem, networking, process/native modules, and user assets. The project has write leases but no complete threat model.

**Correction:** Document trust boundaries, path/symlink policy, package size limits, allowed native modules, secret handling, local endpoints, and recovery from malicious or malformed reference packages.

## P2 — product and growth risks

### P2.1 Approval count may still feel high

The user approves Production Context, Reference Visual, Geometry, Texture, optional Animation, and Final Validation. This can be appropriate for high-quality production, but it is not a low-friction flow.

**Correction:** Preserve strict mode, but later evaluate a balanced mode where trusted assets can combine some downstream review gates. Do not add modes before real usage data.

### P2.2 The one-correction Reference Visual policy is brittle

The policy prevents loops, which is good. However, some source images may be genuinely ambiguous or difficult.

**Correction:** Distinguish a model failure from an unresolved source decision. A second generation should remain forbidden by default, but the system needs an explicit exception route for changed user input or reopened Production Context.

### P2.3 Golden Sample rigidity may suppress valid variation

Locking camera and layout improves comparability. Locking construction too aggressively may force unrelated subjects into rhino-like decisions.

**Correction:** Separate presentation locks from archetype-specific construction guidance. Use a small family of quality exemplars rather than one universal subject.

### P2.4 Animation scope is under-proven

Animation is optional and contract-driven, but the current system is much more mature in Geometry than Animation.

**Correction:** Do not market complete animated-asset production until at least one required-animation asset passes the full flow.

### P2.5 No service-level target

There is no accepted target for:

- time to first review;
- total production time;
- success rate without human intervention;
- maximum correction cycles;
- acceptable validation false positives;
- cost per completed asset.

**Correction:** Define internal service targets after the first benchmark corpus.

## User perspective

### What the user will appreciate

- They do not need to edit JSON or choose internal workers.
- Reviews align with visible output.
- Final files are separated from MCP internals.
- The system attempts to preserve accepted work during revisions.
- The Reference Visual gives a shared target before expensive production.

### What will frustrate the user

- Installation still involves several applications and permissions.
- The user may not know whether ChatGPT, Codex, Blockbench, or MCP is responsible for a failure.
- There is no single progress view.
- Error codes and stage terminology may leak into ordinary conversation.
- Waiting for several reviews can feel slower than manual production.
- A strict one-correction policy can stop instead of solving a hard asset.
- The claim of automation may feel misleading if the user must restart tools, locate folders, or repair local config.

### Minimum user-facing product required

One status surface should answer:

```text
Asset: <name>
Current stage: <stage>
Progress: <human-readable summary>
Waiting for: system / user
Visible blocker: <one sentence or none>
Preserved work: <summary>
Next action: <one sentence>
Final output: <path when complete>
```

## Developer perspective

### What is valuable

- Strong explicit invariants.
- Good concern separation at the filesystem level.
- A serious attempt at deterministic validation.
- Extensive regression intent.
- Clear aversion to duplicate authorities and parallel writers.

### What is currently painful

- Too many files must be read to understand one behavior.
- Rules are duplicated and sometimes contradictory.
- Many runtime modules are shallow wrappers around other tools.
- Tests frequently couple to implementation wording.
- One large OpenSpec change has become a permanent project notebook.
- Model routing, skill routing, tool profiles, runtime stages, and agent roles overlap conceptually.
- Direct commits to `Rework` make changes hard to review as a coherent unit.
- No single architecture map explains the actual current system.

### Minimum developer foundation required

- context map and canonical vocabulary;
- one foundation architecture document;
- one bounded OpenSpec change per destination;
- ADRs only for hard-to-reverse trade-offs;
- deep module interfaces;
- behavior tests at those interfaces;
- a decision map for unresolved architecture questions;
- one CI path that runs without dummy changes;
- real E2E and fault-injection harnesses.

## RouteLLM assessment

RouteLLM is useful as a **tested routing framework and evaluation toolkit**, but not as proof that BuildIT routing is correct.

Strengths:

- established strong/weak routing abstraction;
- threshold calibration;
- benchmark/evaluation framework;
- replaceable router strategies;
- OpenAI-compatible serving option.

Risks:

- trained router distribution differs from BuildIT agentic tasks;
- model pairs differ;
- some routers require embedding/API configuration;
- Codex-native role/tool/permission integration is not demonstrated;
- a prompt-only router does not know write leases, stage permissions, or visual evidence;
- cost savings can hide higher correction or failure cost.

Required decision sequence:

```text
prove Codex integration seam
→ build representative routing dataset
→ run deterministic baseline
→ run RouteLLM offline
→ shadow recommendations
→ compare quality/cost/corrections
→ controlled read-only rollout
→ consider broader use
```

## Release recommendation

### Suitable now

- continued internal architecture and workflow development;
- controlled experiments by the project author;
- repository-level CI and unit/integration refinement;
- manual Blockbench acceptance runs with detailed logging.

### Not suitable now

- claiming general zero-setup production;
- onboarding another team without direct support;
- replacing deterministic routing with RouteLLM in live Codex sessions;
- public distribution as a reliable end-to-end asset factory;
- using one or two animal examples as proof of broad visual quality.

## Required next milestones

1. Freeze and separate the old monolithic OpenSpec change.
2. Approve the domain-owned foundation and public module interfaces.
3. Remove stale/duplicated authority instructions.
4. Build a Windows-first Blockbench E2E harness.
5. Build the multi-archetype acceptance corpus.
6. Replace critical marker tests with behavior tests.
7. Prototype the RouteLLM/Codex provider seam.
8. Add run-level observability.
9. Perform one security and filesystem fault review.
10. Only then decide whether the system is ready for repeated production use.
