---
name: blockbench-production
description: "Mandatory dispatcher for approved Blockbench asset production. Reads the active workflow state, selects exactly one stage skill, enforces the matching MCP tool profile, and stops at the stage review gate. Do not use for MCP repository development."
---

# Blockbench Production

Use this skill only for asset production from an approved reference package.

## Dispatch

1. Read `workspace/sessions/<asset>/state.json`.
2. Resolve the skill profile from `engines/shared/skills/skill-profiles.json`.
3. Verify the expected MCP tool profile from `engines/shared/profiles/stage-profiles.json`.
4. Load exactly one stage skill in addition to this dispatcher.
5. Read only the reference manifest, Production Context, Reference Visual, and active-stage document.
6. Execute the smallest complete stage batch.
7. Stop at the required user review gate.

## Stage Routing

```text
GEOMETRY         → blockbench-geometry
TEXTURE          → blockbench-texture
ANIMATION        → blockbench-animation, only when required
FINAL_VALIDATION → blockbench-validation
```

Maximum loaded production skills: `2`.

## Efficiency Rules

- Reuse a fresh `PASS` connection/preflight report; do not rerun discovery.
- Use only tools exposed by the active exact MCP profile.
- Do not load all Blockbench skills together.
- Do not load MCP-development skills during asset production.
- Do not use PBR, Hytale, mesh, armature, UI automation, or eval capabilities in the normal Bedrock cuboid workflow.
- Capture evidence only at stage review or for an affected revision view.
- Export only in Final Validation.

## Revision Mode

Keep the same stage skill and activate the matching local-repair tool profile. Change only the named issue or tightly related pair, preserve approved areas, regenerate affected evidence, and return to the same review gate.

## Stop Conditions

Stop immediately on `REFERENCE_CONFLICT`, `BLOCKER`, required user review, or completion of the active stage acceptance criteria.
