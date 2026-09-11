# LazyDesigner Authoring Stage Context Contract

This document owns the cross-stage context and handoff rules shared by Geometry, Texturing, and Animation specialists. Domain-specific reasoning remains in the relevant specialist Skill.

## Context Projection

Normal specialist work consumes a **stage-specific projection from LazyDesigner Control**, not the complete prior-stage Skill/Profile/Reference Package.

Projection contains only decision-relevant state:

```text
original user intent / current task
asset identity + selected_profile label
current stage and persisted upstream gate state
relevant semantic part IDs and relationships
relevant approved reference evidence
current authored asset identities/state when known
blocking unknowns and upstream blockers
```

Add only domain-relevant fields:

```text
Geometry  → primary masses, topology, dimensions, pivots, openings, motion-readiness
Texture   → material cohorts, atlas/UV identity, markings, alpha/emissive/PBR requirements
Animation → moving parts, hierarchy/pivots, axes, contact/clearance, pose/keyframe guidance
```

Do not load a full modelling profile or full reference package as reassurance. Request only the missing decision-changing relationship. A narrow secondary profile fact may be loaded when it materially changes the current decision.

## Authority

Resolve facts in this order:

```text
explicit current user requirement
→ approved/current visual reference evidence
→ persisted approved asset state
→ specialist technical evidence
→ unresolved remains UNKNOWN
```

Runtime/Tool success, validators, diagnostics, scalar scores, hierarchy, bounds, or coordinates do not create visual acceptance or user approval.

## Evidence Economy

Reuse fresh evidence and mutation receipts. Refresh only the evidence class made stale by a mutation or required to detect a plausible regression.

Avoid:

```text
broad rediscovery of known capability/identity
confirmation readbacks after successful deterministic mutation
full-profile reloads
screenshot-per-micro-mutation loops
repeated unchanged inspection
```

Use bounded discovery only when identity/schema is unknown or stale.

## Gate Semantics

Diagnostic/internal PASS means technical evidence only. It never means user approval.

Canonical Animation handoff readiness is owned by `mcp/lib/authoringReadiness.ts`:

```text
USER_APPROVED
or
AUTONOMOUS_VERIFIED
```

Both require UV Layout PASS, a saved checkpoint, and no blockers. Autonomous verification requires explicit prior user authorization plus current-revision evidence and must never be described as user approval.

Geometry↔Texturing stays on the shared AUTHORING surface. `HANDOFF_REQUIRED` + Gateway `switch_authoring_phase` is reserved for AUTHORING↔Animation.

## Correction / Convergence

A failed review owns one diagnosed cause and one coherent correction round:

```text
FAIL
→ identify first material owning cause
→ reuse fresh state/evidence
→ one bounded coherent mutation
→ refresh affected evidence only
→ IMPROVED | UNCHANGED | REGRESSED
```

A correction is accepted only when the intended defect improves without materially regressing another required relation. The same causal direction failing twice without new evidence becomes `BLOCKED` rather than a third guess.

## Stage Exit Projection

Return only state needed by Control/next stage:

```text
changed authored identities
relevant semantic part IDs/relationships
current evidence freshness
upstream blocker if discovered
stage-specific blocking unknowns
READY_FOR_USER_REVIEW | BLOCKED | HANDOFF_REQUIRED
```

Do not persist or return the full specialist Skill/Profile as stage state.
