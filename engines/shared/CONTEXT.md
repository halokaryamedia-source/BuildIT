# Workflow Governance Context

This glossary defines the shared language used across Reference Design, Asset Production, Agent Orchestration, and Repository Development. It contains no implementation procedure.

## Terms

**Authority** — The artifact or decision source allowed to answer one specific kind of question. Authority is domain-specific; BuildIT has no single linear authority hierarchy.

**Contract** — A durable statement of required behavior, invariants, accepted inputs, outputs, errors, and evidence.

**Profile** — A named execution policy that limits available skills or tools for a specific Stage or repository task.

**Workspace** — The filesystem location containing one Asset's user-facing files and retained production metadata.

**Active Workspace** — A Workspace currently open for production or targeted revision.

**Completed Workspace** — A frozen approved Workspace that is not directly mutable.

**Selected Asset** — The Asset identified by the local workspace index as the current target. Selection is not Runtime State.

**State Revision** — A monotonic version that identifies one committed Runtime State transition.

**Invariant** — A rule that must remain true across every valid transition.

**Guard** — A mechanism that prevents an operation when its required invariant is not satisfied.

**Recovery** — A bounded operation that restores a valid state from a current authority or approved Checkpoint.

**Adapter** — A concrete implementation that satisfies a module interface at a seam.

**Seam** — The place where behavior can be observed, replaced, or tested through a stable interface.

**Technical Truth** — Current source, current diff, deterministic tests, typechecking, build output, runtime behavior, and integrity evidence. Technical Truth proves implementation behavior; it does not redefine approved product intent.

**Deferred Item** — A recorded idea intentionally excluded from the active destination. It is not an implicit requirement.
