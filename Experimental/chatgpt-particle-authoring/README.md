# ChatGPT Particle Authoring Research Archive

This directory is retained as historical research evidence for the particle-authoring work that was developed and validated through ChatGPT.

## Status

- **Retired as active authority.**
- Canonical ChatGPT-side particle reference authoring now lives under `docs/02-reference/particle/`.
- Active specialist routing lives in `.agents/skills/lazydesigner-particle-reference-authoring/SKILL.md`.
- The archived `src/`, `tests/`, design notes, promotion audit, and approved volcano example remain research/provenance evidence only.
- Nothing in this directory should be routed as the current workflow.

## Canonical active path

```text
USER PARTICLE REQUEST
→ docs/02-reference/flow.md
→ docs/02-reference/particle/README.md
→ Particle Reference Authoring
→ clean Bedrock/Snowstorm package
→ user visual review
→ optional Codex / MCP handoff
```

## Historical value

The archive preserves the experiments that established:
- Snowstorm/Wintersky scalar-speed compatibility guidance;
- stable emitter-owned vs particle-owned behavior;
- bounded motion preflight concepts;
- bundle and atlas QA;
- keep-out, readability, and particle-budget heuristics;
- the approved `MIVUBI_Volcano_Eruption` reference package.

These findings have been promoted as durable reference-authoring rules, not as MCP runtime implementation.

Do not recreate a second active particle workflow from this archive. Git history owns further historical detail.
