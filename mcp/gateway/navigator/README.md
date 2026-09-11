# LazyDesigner Control — legacy physical path

> Physical path note: this module still lives under `mcp/gateway/navigator/` during source migration. **Navigator is not an active parallel architecture.** The public/runtime-facing contract implemented here is LazyDesigner Control (`lazydesigner-control-v1`). The folder will be physically renamed after remaining path dependencies are migrated.

LazyDesigner Control is the **front-line intake, context projection, readiness and routing layer** behind the stable four-tool Gateway.

```text
USER / CODEX TASK
→ CONTROL
→ resolve task class + live orientation
→ consume Reference Package / Workspace when applicable
→ project minimum stage context
→ route exact owner/capability
→ GATEWAY
→ RUNTIME
→ BLOCKBENCH
→ CONTROL DELTA
```

Control selects from canonical owners. It does not create a second Skill database, Tool schema catalog, asset-state database, or reference authority.

## Public Gateway boundary

The Gateway remains exactly:

```text
status
search_capabilities
describe_capability
invoke_capability
```

No Control-specific public tool family is added.

## Task classes

```text
ASSET_AUTHORING
SYSTEM_DEVELOPMENT
```

### ASSET_AUTHORING

`status` may receive:

```text
workspace_path
reference_package_path
current_user_delta
known_context_ids
```

Control combines only decision-relevant state from:

```text
REFERENCE.json
+ Active Workspace README
+ Runtime/project/phase orientation
+ current user delta
```

and produces one active projection:

```text
GEOMETRY_CONTEXT
TEXTURE_CONTEXT
ANIMATION_CONTEXT
```

The original reference intent remains unchanged. `current_user_delta` is additive correction context, not a replacement prompt.

### SYSTEM_DEVELOPMENT

```text
status(
  task_mode=SYSTEM_DEVELOPMENT,
  task_intent=<concrete problem>
)
```

Control resolves a bounded source/specialist/test owner set and excludes asset workspace/reference parsing. Unknown or tied intent remains `UNRESOLVED` instead of broad repository scanning.

## Reference Package projection

Control reads only compact structured authority from `REFERENCE.json`:

```text
asset identity / intent
selected profile
numeric + player-relative scale
animation requirement
stage readiness
blocking/non-blocking unknowns
stage document identities
stage image IDs
```

Control does not copy full stage Markdown or image content into its own persistent state.

## Context loading

Canonical context handles are resolved from current repository files at runtime and content-addressed with SHA-256.

Geometry normally receives:

```text
Modelling Skill
+ exactly one selected profile from REFERENCE.json
```

Texturing normally receives:

```text
Texturing Skill
```

Animation normally receives:

```text
Animation Skill
```

The former router Skill is **not** loaded as mandatory authoring context.

`known_context_ids` lets a caller reuse exact already-loaded content. A changed member of the same context family is invalidated and redelivered.

## Workspace projection

The Active Workspace README remains the persistent asset-state owner. Control reads only navigation fields:

```text
asset
Current Stage
Geometry
UV Layout
Texturing
Animation
Current next step
Known blocker(s)
```

No parallel workspace database is created.

## Readiness

Control distinguishes:

```text
runtime readiness
project binding
active authoring domain
required context availability
Reference Package blockers
Workspace blockers
```

A missing optional Reference Package does not automatically make an existing-asset correction illegal. A real blocking reference unknown does.

## Capability routing

Routing remains direct-first:

```text
known capability        → INVOKE_CAPABILITY
unknown capability      → SEARCH_CAPABILITIES
schema uncertainty      → DESCRIBE_CAPABILITY
stale/lost orientation  → STATUS
unresolved development  → bounded owners, then targeted search
```

Search/describe are fallbacks, not ceremony.

## Control delta / invalidation

Successful capability invocation returns:

```text
control_delta
```

Mutation invalidation follows dependency direction:

```text
Geometry mutation
→ Geometry + dependent Texture + dependent Animation knowledge affected

Texture mutation
→ Texture + dependent Animation knowledge affected

Animation mutation
→ Animation knowledge affected
```

This is **not** a full asset reset. Actual downstream rebuild is still conditional on whether the changed field materially invalidates that dependency.

Phase/project authority changes set `requires_status_refresh=true`; ordinary asset mutations do not force an immediate full status reread.

## Ownership boundary

Control owns:

```text
task intake metadata
runtime/project orientation projection
Reference Package projection
Workspace projection
stage-specific context selection
content-addressed context handles
bounded source/capability routing metadata
post-operation invalidation/delta
```

Control does not own:

```text
user/reference truth
canonical Skill prose
full modelling profiles
Runtime Tool schemas
Blockbench model state
visual acceptance
persistent asset state
creative authoring decisions
```

## Efficiency target

The target remains **Cost to Accepted Result**.

Control should reduce:

```text
broad docs/Skill loading
repeated context delivery
router duplication
unnecessary capability discovery
status reassurance loops
wrong-stage correction
full resets after bounded changes
```

without reducing reference fidelity or final asset quality.
