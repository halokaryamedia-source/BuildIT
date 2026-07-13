# Final End-to-End User Acceptance Test

This is one integrated flow test, not an internal component checklist. Repository maintainers complete typecheck/tests/build/bundle verification first.

## Part A — ChatGPT Website

1. Upload the final Reference Studio Skill ZIP.
2. Start a new chat with a controlled source asset.
3. Create a new `reference_candidate`.
4. Confirm one batched clarification turn at most, Production Context approval, one Golden-Sample-guided Reference Visual, visual approval, then automatic technical package/audit/ZIP.
5. Confirm there is no third routine approval and no additional generated technical image.

Part A passes when the ZIP contains the nine canonical package files, schema `3.3`, executable contracts, exact visual hash, and current Codex handoff.

## Part B — Codex + Blockbench

The user performs setup only once:

1. pull the final `Rework` head;
2. load `mcp-blockbench/dist/mcp.js` once;
3. start one Codex session from repository root;
4. import/initialize the approved candidate package into a fresh workspace;
5. ask Codex to build the model from zero through final completion.

The user only reviews Geometry, Texture, optional Animation when required, and Final Validation. The user is never asked to run internal tests, inspect UUID/profile/session state, edit files, reconnect, reload, restart, choose workers, or choose profiles.

## Required production behavior

- runtime status runs once at startup;
- stage context runs at entry/transition/revision, not after every call;
- one selected Terra writer holds the active lease;
- zero-start Geometry builds primary form before first analysis;
- affected views are used during corrections;
- Sol is used only with a stated visual reason;
- submission tools own fresh validation and review transition;
- Texture/Animation do not duplicate happy-path validation;
- Final Validation uses one evidence-free preflight, then final evidence/export/report/submission;
- Animation-skipped flow proceeds directly to Final Validation;
- the same Codex and MCP sessions remain active;
- final approval reaches `DONE` and workspace completion.

## Acceptance result

Pass only when the final canonical `.bbmodel`, textures, evidence, PASS reports, approved checkpoints, and completed workspace exist; all stage reviews were user-visible; no reconnect/reload/restart occurred; and no duplicate/versioned output or prebuilt model was used.

A separate automated branch test covers the Animation-required transition even when the first local acceptance asset skips Animation.

## Compatibility acceptance wording

This remains one final end-to-end test.

- Load the final `mcp-blockbench/dist/mcp.js` once.
- Start one Codex session.
- Create a new Black Rhinoceros model from zero for the controlled Golden Sample acceptance path.
- Confirm `prebuilt_model_copied: false` before MCP project creation.

The complete acceptance still continues beyond Geometry through Texture, optional Animation, Final Validation, `DONE`, and workspace completion.
