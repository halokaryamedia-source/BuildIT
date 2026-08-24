# Next Action

Updated: 2026-08-24 — repository cleanup reconciliation

## Current State

```text
LOCAL_REPOSITORY_CLEANUP_COMPLETE
MCP_GEOMETRY_TEXTURING_HARDENING_RETAINED
TRANSIENT_TEST_WORKSPACE_REMOVED
MARKETPLACE_RECIPE_POLICY_REMOVED
HIDDEN_DEV_WATCH_DEPLOY_REMOVED
NO ACTIVE LOCAL ACCEPTANCE RUN
NO ACTIVE EXPERIMENT
```

Working branch: **`Local` only**. `Experimental/**` remains inactive unless the user explicitly resumes it. GitHub execution/history discipline is owned by `GITHUB_RULES.md`.

## What Is Already Done — Do Not Repeat

The following work is already integrated in current source and is **not** a recorded next step:

- coherent `place_cube(elements=[...])` batching;
- coherent `add_group(groups=[...])` batching;
- `create_project` logical UV resolution `128` default / `256` opt-in;
- current source repair for the `flatten_layers` base-bitmap preservation defect;
- texture/Painter bounds and atlas-targeting hardening;
- compact mutation-result reuse / reduced readback discipline;
- current 64-tool default Bedrock Entity surface.

Do not restart those changes merely because older commits or historical validation text mention them.

## Cleanup Closure

This cleanup removed the sources of repository drift discovered on 2026-08-24:

- transient/local quality-test assets no longer live under `workspace/active/`;
- fixture-derived “marketplace-grade” modelling/texture recipes were removed from canonical skills;
- prose-string tests added only to freeze those recipes were removed;
- the Elephant-derived Cube/Group name-collision guard was removed rather than promoted into an unproved global invariant;
- `dev:watch` no longer owns implicit deployment into the installed Blockbench plugin;
- root/package README, `CONTEXT.md`, validation, and implementation ownership no longer compete as parallel continuation trackers.

## Current Continuation

There is **no automatic implementation step** after this cleanup.

If the user explicitly resumes MCP model-quality work, begin with one exact-current-artifact, reference-grounded local test:

```text
approved reference visible
→ build/load exact current Local artifact
→ create one bounded model attempt
→ capture only judgeable views
→ diagnose first wrong owner from observed mismatch
→ smallest complete patch only if evidence requires it
→ targeted proof
→ STOP
```

Do not respond to a poor model by automatically adding more modelling recipes, fixture-specific guards, prompt layers, profiles, routers, or repeated continuation markers.

## Proof Boundary

Repository cleanup and retained source fixes are source/static facts. Current live Blockbench visual fidelity, installed-plugin behavior, and model-quality improvement remain **LOCAL PROOF REQUIRED** until the exact current artifact is deliberately run and inspected.

Historical live/static proof is summarized in `docs/foundation/validation-report.md`; rationale and discarded iterations belong in Git history.

## STOP

No further repository, CI, local-runtime, workspace, or experimental action is implied by this file without a new user instruction.
