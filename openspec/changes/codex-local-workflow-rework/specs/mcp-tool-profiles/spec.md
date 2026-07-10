# MCP Tool Profile Specification

## Requirement: Complete Library, Minimal Exposure

The Blockbench MCP plugin SHALL retain its complete capability library.

Normal Codex sessions SHALL receive only the core tools plus the exact allowlist for the active workflow profile.

Tools SHALL NOT be deleted merely because they are not used by the current Bedrock cuboid workflow.

### Scenario: Geometry session starts

- Given the active workflow stage is Geometry
- And the active profile is `BEDROCK_CUBOID_GEOMETRY`
- When a new MCP session requests `tools/list`
- Then the response contains only the four core tools plus the Geometry allowlist
- And it does not advertise Texture, Animation, PBR, Hytale, mesh UV, armature, UI automation, eval, or final-export-only tools

## Requirement: Exact Profile Authority

The machine-readable authority SHALL be:

```text
Engine/codex/tool-profiles.json
```

The runtime implementation SHALL use the same profile IDs and allowlists.

Normal stage profiles SHALL be:

```text
BEDROCK_CUBOID_GEOMETRY
BEDROCK_CUBOID_TEXTURE
BEDROCK_CUBOID_ANIMATION
FINAL_VALIDATION_READONLY
```

Local repair profiles SHALL be:

```text
GEOMETRY_LOCAL_REPAIR
TEXTURE_LOCAL_REPAIR
ANIMATION_LOCAL_REPAIR
```

`DIAGNOSTIC_ESCALATION` SHALL NOT be active during normal production.

## Requirement: Core Tools

The following tools SHALL remain available in every profile:

```text
get_runtime_status
get_project_info
get_tool_profile
activate_tool_profile
```

No other tool SHALL be implicitly available outside an exact allowlist unless `DIAGNOSTIC_ESCALATION` is explicitly activated.

## Requirement: Runtime Exposure

Before a new MCP session server registers its tools, the runtime SHALL apply the active profile to tool exposure.

The next MCP session SHALL advertise only enabled tools from the active profile.

The runtime SHALL report:

- profile ID;
- profile revision;
- exposed tool count;
- total library tool count;
- deterministic profile hash;
- configuration validation errors.

### Scenario: Runtime status

- Given the Geometry profile is active
- When Codex calls `get_runtime_status`
- Then the response includes `tool_profile.profile_id = BEDROCK_CUBOID_GEOMETRY`
- And it includes exposed count, total count, and profile hash
- And it returns BLOCKER when profile configuration is invalid

## Requirement: Call-Time Enforcement

Every network-session tool execution SHALL verify that the tool is allowed by the currently active profile.

A tool outside the active profile SHALL fail with:

```text
TOOL_PROFILE_BLOCKED
```

The agent SHALL NOT bypass this failure using UI automation, eval, another endpoint, or another MCP server key.

### Scenario: Stale Geometry tool after Texture activation

- Given the client still displays a Geometry tool from its previous session
- And `BEDROCK_CUBOID_TEXTURE` is now active
- When the client calls the stale Geometry tool
- Then the call fails with `TOOL_PROFILE_BLOCKED`
- And the safe action is one reconnect to the canonical `blockbench` server

## Requirement: Profile Transition

`activate_tool_profile` SHALL:

1. validate the exact requested profile ID;
2. apply the new allowlist immediately;
3. return whether the profile changed;
4. return the new count and hash;
5. return `reconnect_required = true` when changed.

After a real profile change, Codex SHALL reconnect the existing canonical MCP entry once.

Codex SHALL NOT:

- create another server key;
- scan another port;
- restart Blockbench;
- reconnect after every edit.

### Scenario: Geometry approval

- Given Geometry is approved
- When Codex activates `BEDROCK_CUBOID_TEXTURE`
- Then current disallowed calls are blocked immediately
- And Codex reconnects the existing `blockbench` entry once
- And the next `tools/list` contains the Texture profile only

## Requirement: Bedrock Cuboid Texture Safety

`BEDROCK_CUBOID_TEXTURE` SHALL expose cube UV and pixel texture tools.

It SHALL include:

```text
set_cube_face_uv
get_uv_layout
```

It SHALL NOT include:

```text
set_mesh_uv
auto_uv_mesh
rotate_mesh_uv
create_pbr_material
configure_material
import_texture_set
assign_texture_channel
save_material_config
gradient_tool
```

`gradient_tool` MAY be added only by an approved future profile change when the reference package explicitly requires smooth gradients.

## Requirement: Bedrock Cuboid Animation Safety

`BEDROCK_CUBOID_ANIMATION` SHALL use Blockbench group/bone animation tools.

It SHALL include the required subset of:

```text
bone_rigging
create_animation
manage_keyframes
animation_timeline
```

It SHALL NOT include armature objects, vertex weights, or mesh-deformation tools during normal Bedrock cuboid production.

## Requirement: Read-Mostly Final Validation

`FINAL_VALIDATION_READONLY` SHALL expose inspection, evidence, checkpoint, and final export tools.

It SHALL NOT expose ordinary Geometry, Texture, or Animation write tools.

When validation requires a local fix, Codex SHALL activate the matching repair profile and return to the relevant review stage.

## Requirement: Diagnostic Escalation

`DIAGNOSTIC_ESCALATION` MAY expose the full registered library only when all are recorded:

- actual blocker;
- reason normal stage/repair tools cannot solve it;
- allowed high-risk tool;
- rollback checkpoint;
- verification method;
- stop condition.

After the blocker is resolved, Codex SHALL return immediately to the appropriate normal or repair profile.

## Requirement: State Synchronization

`state.json` SHALL record:

```text
active_tool_profile
tool_profile_revision
tool_profile_hash
exposed_tool_count
total_library_tool_count
profile_reconnect_required
```

Live runtime status SHALL override stale state profile metadata.

State mismatch SHALL be corrected without creating another MCP connection identity.

## Requirement: Focused Verification

Before final integration, local runtime verification SHALL prove:

- exact normal profile counts;
- forbidden tools absent from normal `tools/list`;
- stale disallowed calls return `TOOL_PROFILE_BLOCKED`;
- profile hash remains stable across reconnect;
- one reconnect refreshes the tool list;
- no alternate port or MCP server key is created.

CI SHALL remain deferred until this local profile verification and the full local dry run are complete.
