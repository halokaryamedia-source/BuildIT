# LazyDesigner Flow

Updated: 2026-09-11

This file is the **single canonical end-to-end workflow** for LazyDesigner. It defines how a request moves from the user through ChatGPT, Control, Codex, Gateway, Runtime, Blockbench, verification, review, and continuation.

Detailed reference-package contents belong in `reference-handoff.md`. Source ownership belongs in `implementation-map.md`. Current implementation work belongs in `next-action.md`.

## 1. Product Boundary

```text
USER
  ↓
CHATGPT
  ↓
REFERENCE PACKAGE
  ↓
LAZYDESIGNER CONTROL
  ↓
CODEX
  ↓
GATEWAY
  ↓
RUNTIME
  ↓
BLOCKBENCH
  ↓
RESULT
  ↓
CONTROL DELTA
  ↓
VERIFY / REVIEW / CONTINUE
```

Responsibilities:

```text
ChatGPT             = reference preparation + ambiguity reduction
LazyDesigner Control= front-line intake + state + readiness + context + routing + invalidation
Codex               = modelling/coding reasoning and execution planning
Gateway             = stable MCP client boundary
Runtime             = capability execution and mutation safety
Blockbench          = live asset truth
Workspace           = persistent asset continuity
Skills / docs       = canonical knowledge
```

Control does not replace Codex reasoning and must not become a second Runtime, second workflow database, or duplicate knowledge base.

## 2. Request Classes

Every LazyDesigner request enters through Control after any required ChatGPT preparation.

Two top-level task modes exist:

```text
ASSET_AUTHORING
SYSTEM_DEVELOPMENT
```

Asset authoring includes:

```text
new asset
continue asset
correction / edit
geometry / rig / UV
texturing / materials / PBR
animation
particle/effect work associated with the asset
inspection / verification
finalization
```

System development includes:

```text
MCP update
new capability/tool
plugin development
Gateway/Runtime change
build/generator change
distribution/update change
bug fix
refactor
```

The two modes share Control as the front door but do not share asset readiness requirements.

## 3. ChatGPT Reference Preparation

For asset work, ChatGPT prepares the reference before Codex when preparation materially reduces ambiguity.

ChatGPT may receive:

```text
user prompt only
user image(s)
existing concept/reference
existing asset + requested change
```

ChatGPT returns a **Reference Package** containing the minimum decision-critical evidence and technical guidance needed by Codex.

Typical contents:

```text
approved image(s)
original user intent
asset identity
requested dimensions/scale when known
animation required: yes/no/unknown
primary silhouette/masses
important openings/negative space
attachment/contact relationships
symmetry/asymmetry
material identity
moving parts/articulation
representation guidance when useful
hierarchy/pivot/rig guidance when useful
UV/texture notes when useful
animation/keyframe guidance when useful
explicit unknowns and conflicts
```

Simple assets receive a simple package. Complex/asymmetric/animated assets may receive richer views and guidance.

ChatGPT must not invent unavailable dimensions, hidden geometry, articulation, materials, or motion as facts. See `reference-handoff.md` for the exact package contract.

## 4. Control Intake

Control receives the original user intent plus the Reference Package or system-development request.

Control preserves the original request and derives compact routing metadata.

For asset work it resolves:

```text
task class
asset identity
new/existing/correction/continue
requested target
requested semantic domain
reference status
requirements status
project/workspace identity
current lifecycle stage
current gates/blockers
required canonical context
legal next route
```

For system development it resolves:

```text
development task class
problem/feature intent
affected subsystem/domain
source owner(s)
direct dependencies
minimum context
build/generate/deploy path when known
```

Control must not transform the user's actual design intent into a lossy generic summary.

## 5. Asset Requirement Gate

For a new asset, no authoring mutation begins until the required facts are known:

```text
Asset
Approved Reference
Dimensions: width × height × length in Minecraft blocks
Animation Required: YES | NO
```

Unknown required values remain explicit and block only the work that depends on them.

Agreed numeric dimensions are numeric authority. Approved reference imagery is visual authority. A material conflict between them requires an explicit decision rather than silent inference.

## 6. Control Orientation

Before Codex mutates an asset, Control resolves current operational state from canonical owners:

```text
Runtime online/identity
catalog freshness
project affinity / active project
current authoring phase
Active Workspace state
current lifecycle stage
current gate status
blockers
already-loaded context handles
```

Control projects the minimum state needed for the current decision. It must not dump the whole repository or every Skill/schema into Codex context.

## 7. Lifecycle Readiness

Asset readiness is ordered:

```text
REFERENCE / REQUIREMENTS
→ GEOMETRY
→ GEOMETRY VERIFY
→ UV READINESS PREFLIGHT
→ GEOMETRY USER APPROVAL
→ PRODUCTION UV LAYOUT
→ TEXTURING
→ TEXTURE VERIFY
→ TEXTURE USER APPROVAL
→ ANIMATION READINESS when required
→ ANIMATION when required
→ FINALIZATION
→ COMPLETE
```

Control should expose readiness as a projection, for example:

```text
reference: READY
requirements: READY
geometry: READY
uv: LOCKED
texturing: LOCKED
animation: LOCKED
```

Readiness is derived from canonical state; Control is not a second authority for approvals or gates.

## 8. Semantic Ownership

Current semantic domains are:

```text
GEOMETRY
TEXTURING
ANIMATION
CORE
```

Ownership:

```text
Geometry / rig / pivots / UV Layout
→ modelling specialist

Texture Atlas / Styling / materials / PBR
→ texturing specialist

Animation / motion / controllers / animation effects
→ animation specialist
```

Geometry and Texturing share the AUTHORING Runtime surface. Normal Geometry↔Texturing corrections do **not** require a Runtime phase switch.

AUTHORING↔Animation alone uses the explicit phase handoff.

## 9. Minimum Context Projection

Control gives Codex only the context required for the current decision.

Examples:

```text
new whole-model geometry
→ original intent + primary reference + dimensions + geometry constraints + modelling context

small geometry correction
→ changed user intent + affected target + affected reference view(s) + current target state

texture correction
→ relevant material/reference evidence + UV/texture state + texturing context

animation correction
→ relevant rig state + motion/keyframe evidence + affected clip + animation context
```

Content-addressed context that is unchanged should be referenced rather than retransmitted.

## 10. Capability Routing

Control follows direct-first routing:

```text
known capability + known arguments
→ invoke directly

unknown capability
→ bounded capability search

schema uncertainty
→ describe exact capability/branch

stale/lost orientation
→ status refresh
```

Search and describe are fallbacks, not mandatory rituals.

Control should eventually hard-bound discovery to the smallest useful result set; current design target is four results maximum.

## 11. Codex Authoring

After Control supplies the current task packet, Codex performs the creative/technical reasoning.

Codex owns decisions such as:

```text
3D interpretation
primary/secondary form strategy
cube/group decomposition
representation choice
hierarchy construction
visual comparison and correction reasoning
texture design
rig/animation construction
source implementation for system-development tasks
```

Control may provide guidance and constraints but must not precompute an inflexible cube-by-cube model plan.

## 12. Gateway → Runtime → Blockbench

Codex uses the stable Gateway boundary:

```text
status
search_capabilities
describe_capability
invoke_capability
```

Gateway handles client-facing stability and project affinity. Runtime executes the actual capabilities. Blockbench contains the live model state.

## 13. Post-Operation Control Delta

Every meaningful result returns through Control as a compact delta rather than forcing a full re-orientation.

Control delta answers:

```text
WHAT CHANGED?
WHAT BECAME STALE?
WHAT REMAINS VALID?
WHAT IS THE NEXT LEGAL INTENT?
IS A STATUS REFRESH REQUIRED?
```

Example geometry mutation:

```text
changed: geometry
invalidated: affected geometry evidence / candidate acceptance state
preserved: project affinity / Runtime identity / unrelated accepted state
next: verify affected geometry
status refresh: no, unless operational orientation changed
```

## 14. Evidence Freshness and Verification

Mutation invalidates only affected evidence.

For new whole-form Geometry, default internal visual evidence is the smallest useful multi-view bundle, typically front + left + top. Add rear/3q views only when they affect a decision.

Correction loop:

```text
MUTATE
→ VERIFY
→ PASS?
   ├─ YES → next gate
   └─ NO → diagnose smallest material cause
            → smallest correction
            → verify affected area only
```

The same causal correction failing twice without decision-changing evidence becomes `BLOCKED` rather than an endless retry loop.

Tool success, coordinates, hierarchy, validators, or save/export success do not by themselves create visual approval.

## 15. User Review and Approval

Internal verification and user approval are separate.

```text
internal PASS
→ READY_FOR_USER_REVIEW
→ user APPROVE or REVISION
```

A revision request re-enters Control as a new/continued correction intent. Control preserves accepted unaffected state and routes only the affected owner/dependencies.

## 16. Geometry → UV → Texturing

Normal sequence:

```text
GEOMETRY IN_PROGRESS
→ internal Geometry verify
→ UV READINESS PREFLIGHT
→ READY_FOR_USER_REVIEW
→ Geometry APPROVED
→ checkpoint
→ production UV Layout
→ UV Layout PASS
→ Texturing
→ Texture Verify
→ READY_FOR_USER_REVIEW
→ Texturing APPROVED
→ checkpoint
```

Texture/PBR mutation requires `Geometry APPROVED + UV Layout PASS`.

If Texturing exposes a Geometry/UV defect, Control routes the correction to the exact upstream owner on the shared AUTHORING surface, then invalidates only affected downstream evidence/state.

## 17. Animation Handoff

If `Animation Required = NO`, proceed to Finalization after Texture approval.

If `YES`:

```text
Texturing APPROVED
+ current checkpoint
→ Animation Readiness Preflight
→ hierarchy/pivots/attachments/clearance ready
→ no unresolved upstream blocker
→ HANDOFF_REQUIRED
→ switch_authoring_phase(animation)
→ animation specialist
→ Animation authoring
→ playback/technical/visual verify
→ READY_FOR_USER_REVIEW
→ user approval
→ checkpoint
```

Upstream corrections return to AUTHORING through the same controlled handoff.

## 18. Dependency Invalidation

Invalidate the minimum dependency set.

```text
Geometry material change affecting mapped surfaces
→ UV Layout INVALIDATED
→ affected Texture INVALIDATED

UV Layout material change
→ affected Texture INVALIDATED

unaffected accepted downstream state
→ preserve
```

Control tracks/projections should express dependency impact without resetting the whole asset unnecessarily.

## 19. Persistence

Persistent asset continuity remains:

```text
workspace/active/<asset>/README.md
```

Persist/reconcile state at meaningful boundaries:

```text
handoff
approval
resume
park
completion
```

Do not persist every small mutation as a new state system. Git history owns historical versions.

## 20. Finalization

When all required gates are ready:

```text
FINALIZATION
→ current state check
→ hierarchy / dimensions / UV / textures / animation refs
→ identifiers and native references
→ requested exports
→ remove temporary/debug residue
→ reconcile workspace summary
→ COMPLETE
```

Finalization cannot silently change approved visual work.

## 21. Existing Asset / Correction Flow

```text
USER CHANGE REQUEST
→ ChatGPT adds reference/technical clarification only when useful
→ Control recovers current asset/workspace/live state
→ preserve unaffected accepted state
→ classify target/domain/dependencies
→ project minimum context to Codex
→ Codex mutation
→ Control delta
→ affected verification only
→ user review when required
→ continue/finalize
```

Do not regenerate a complete Reference Package for every small edit.

## 22. System Development Flow

LazyDesigner Control is also the front line for product development.

```text
USER MCP / PLUGIN / BUILD / RUNTIME REQUEST
→ optional ChatGPT technical research/reference preparation
→ Control: SYSTEM_DEVELOPMENT
→ classify bug/feature/refactor/update
→ resolve affected source owner(s)
→ resolve dependency/impact boundary
→ project minimum source + Skill/test/build context
→ Codex implementation
→ source delta
→ required build/generate/package/deploy path
```

System development does not pass through asset Reference/Dimensions/Animation requirement gates.

Control must not become a compiler, package manager, source editor, or updater itself. It routes those operations to their real owners.

## 23. Efficiency Principle

Primary objective:

```text
COST TO ACCEPTED RESULT
```

Efficiency means preserving or improving accepted quality while reducing avoidable:

```text
repository/context scans
repeated Skill delivery
capability discovery
schema reads
status rereads
wrong-route attempts
phase bouncing
full-view recaptures
retries and recovery loops
```

A smaller packet is useful only if it preserves decision-critical information.

## 24. Non-Goals

LazyDesigner Control must not become:

```text
second MCP server
second workflow authority
duplicate Tool/Skill knowledge base
creative modelling engine
visual judge replacing Codex/user
persistent model database
large UI requirement
broad autonomous planner
```

Its core verbs remain:

```text
INTAKE
RESOLVE
PROJECT
ROUTE
INVALIDATE
CONTINUE
```

This is the required workflow baseline for the next Control implementation phase.