---
name: blockbench-production
description: "Mandatory dispatcher for approved Blockbench asset production. Reads the selected active workspace state, acquires the single project write lease, selects exactly one stage skill, enforces the matching MCP tool profile, and stops at the stage review gate. Do not use for MCP repository development."
---

# Blockbench Production

Use this skill only for asset production from an approved reference package.

## Upstream Reference Boundary

The package may be created by the ChatGPT-only skill at:

```text
engines/chatgpt/skills/blockbench-reference-studio/SKILL.md
```

That ChatGPT skill is not loaded during Codex production. Codex receives only the approved `<asset_id>_blockbench_reference.zip`, validates it using the manifest and handoff contract, imports it into the active workspace, and then starts this dispatcher.

A valid imported package contains Production Context, four approved sheets, `GEOMETRY.md`, `TEXTURING.md`, `ANIMATION.md`, `VALIDATION.md`, `reference_manifest.json`, and `CODEX_REFERENCE_HANDOFF.md`.

## Dispatch

1. Read `workspace/workspace.json` and resolve `selected_asset_id`.
2. Read `workspace/active/<asset>/mcp/project.json` and `mcp/state.json`.
3. Resolve the skill profile from `engines/shared/skills/skill-profiles.json`.
4. Verify the expected MCP tool profile from `engines/shared/profiles/stage-profiles.json`.
5. Call `manage_project_write_lease` once with:
   - `action: acquire`
   - exact asset ID
   - absolute `workspace/active/<asset>/mcp` session root
   - active project UUID
   - current `state_revision`
   - current `workflow.active_stage`
6. Load exactly one stage skill in addition to this dispatcher.
7. Read only the reference manifest, Production Context, Reference Visual, and active-stage document.
8. Execute the smallest complete stage batch.
9. Stop at the required user review gate.

## Workspace Boundary

```text
workspace/active/<asset>/
├─ blockbench/   # user-facing .bbmodel, textures, references, previews
└─ mcp/          # project/state metadata, technical contracts, checkpoints, evidence, reports
```

- Never place MCP reports, state files, or checkpoints inside `blockbench/`.
- Never place the canonical `.bbmodel` or user textures inside permanent MCP metadata folders.
- Temporary final-validation staging may exist under `mcp/final/`; completion promotes validated files into `blockbench/` and removes the staging folder.
- Completed projects move to `workspace/completed/<asset>/` with the same separation.

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
- The lease is bound to project UUID, asset, MCP session root, stage, state revision, and tool-profile revision.
- A successful stage/profile transition releases the lease automatically.
- After the required single MCP reconnect, reacquire the lease using the new state and profile before any next-stage mutation.
- On `WRITE_LEASE_*` errors, stop and repair ownership/state alignment; never bypass the guard.

## Efficiency Rules

- Reuse a fresh `PASS` connection/preflight report; do not rerun discovery.
- Use paths from `mcp/project.json`; do not scan the workspace tree.
- Use only tools exposed by the active exact MCP profile.
- Do not load all Blockbench skills together.
- Do not load MCP-development skills during asset production.
- Do not use PBR, Hytale, mesh, armature, UI automation, or eval capabilities in the normal Bedrock cuboid workflow.
- Capture evidence only at stage review or for an affected revision view.
- When evidence is written to disk, use `return_images: false` to avoid unnecessary image payloads.
- Export only in Final Validation and only to the active project's `mcp/final/` staging area; workspace completion promotes validated files.

## Revision Mode

Keep the same stage skill and activate the matching local-repair tool profile. Reacquire the write lease after the profile transition. Change only the named issue or tightly related pair, preserve approved areas, regenerate affected evidence, and return to the same review gate.

A completed project is reopened through the workspace lifecycle command. The approved completed baseline remains immutable until the new revision is approved.

## Stop Conditions

Stop immediately on `REFERENCE_CONFLICT`, `BLOCKER`, required user review, lease/state mismatch, or completion of the active stage acceptance criteria.
