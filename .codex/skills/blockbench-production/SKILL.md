---
name: blockbench-production
description: "Mandatory dispatcher for approved Blockbench asset production. Reads the active workflow state, acquires the single project write lease, selects exactly one stage skill, enforces the matching MCP tool profile, and stops at the stage review gate. Do not use for MCP repository development."
---

# Blockbench Production

Use this skill only for asset production from an approved reference package.

## Dispatch

1. Read `workspace/sessions/<asset>/state.json`.
2. Resolve the skill profile from `engines/shared/skills/skill-profiles.json`.
3. Verify the expected MCP tool profile from `engines/shared/profiles/stage-profiles.json`.
4. Call `manage_project_write_lease` once with:
   - `action: acquire`
   - exact asset ID and absolute session root
   - active project UUID
   - current `state_revision`
   - current `workflow.active_stage`
5. Load exactly one stage skill in addition to this dispatcher.
6. Read only the reference manifest, Production Context, Reference Visual, and active-stage document.
7. Execute the smallest complete stage batch.
8. Stop at the required user review gate.

## Stage Routing

```text
GEOMETRY         → blockbench-geometry
TEXTURE          → blockbench-texture
ANIMATION        → blockbench-animation, only when required
FINAL_VALIDATION → blockbench-validation
```

Maximum loaded production skills: `2`.

## Write Ownership

- Only the lease-owning MCP session may mutate the project or write evidence/checkpoints.
- The lease is bound to project UUID, asset, session root, stage, state revision, and tool-profile revision.
- A successful stage/profile transition releases the lease automatically.
- After the required single MCP reconnect, reacquire the lease using the new state and profile before any next-stage mutation.
- On `WRITE_LEASE_*` errors, stop and repair ownership/state alignment; never bypass the guard.

## Efficiency Rules

- Reuse a fresh `PASS` connection/preflight report; do not rerun discovery.
- Use only tools exposed by the active exact MCP profile.
- Do not load all Blockbench skills together.
- Do not load MCP-development skills during asset production.
- Do not use PBR, Hytale, mesh, armature, UI automation, or eval capabilities in the normal Bedrock cuboid workflow.
- Capture evidence only at stage review or for an affected revision view.
- When evidence is written to disk, use `return_images: false` to avoid unnecessary image payloads.
- Export only in Final Validation and only inside the active asset session.

## Revision Mode

Keep the same stage skill and activate the matching local-repair tool profile. Reacquire the write lease after the profile transition. Change only the named issue or tightly related pair, preserve approved areas, regenerate affected evidence, and return to the same review gate.

## Stop Conditions

Stop immediately on `REFERENCE_CONFLICT`, `BLOCKER`, required user review, lease/state mismatch, or completion of the active stage acceptance criteria.
