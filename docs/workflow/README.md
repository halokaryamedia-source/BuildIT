# Production Workflow

```text
Approved reference package
→ deterministic connection
→ one-time preflight
→ Geometry review
→ Texture review
→ Animation review or skip
→ Final Validation review
```

Every stage uses:

- one exact MCP tool profile;
- `blockbench-production` plus exactly one matching stage skill;
- a persistent checkpoint;
- stable evidence filenames;
- compact validation;
- one user decision.

```text
Geometry         → blockbench-geometry
Texture          → blockbench-texture
Animation        → blockbench-animation only when required
Final Validation → blockbench-validation
```

Maximum loaded production skills: `2`. Skill changes do not require MCP reconnects. Detailed machine contracts live in `engines/shared/`.
