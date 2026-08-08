# Task Board

Updated: 2026-08-08

Use this page for **future / non-active work only**. It never overrides
[`next-action.md`](../next-action.md).

## Current Direction

The active engineering program is Reference Fidelity hardening. Source work has
already implemented the main observation, correction, targeting, pivot, and
initial-placement safeguards.

Local Blockbench testing is intentionally deferred at the current priority; do
not turn the proof queue into the active task until that priority changes.

## P0 — Remaining Reference Fidelity Source Safety

- [ ] Harden **existing-Cube first rotation activation** so an initially
  unrotated Cube cannot silently begin rotating around an unproven neutral pivot.
- [ ] Re-check whether any other normal Bedrock mutation path can introduce
  assumption-driven `from/to/origin/rotation` behavior without an explicit
  modelling decision.

The exact active item remains in `next-action.md`.

## P1 — Local Reference Fidelity Proof (When Resumed)

Run one bounded Codex local + Blockbench proof, not a broad test campaign:

- [ ] build/load current Local plugin;
- [ ] verify default Bedrock project + bundled Bedrock prompt;
- [ ] create a small explicit-extent Cube blockout;
- [ ] verify `inspect_model_bounds` against visible transformed geometry;
- [ ] verify `capture_model_views` image delivery/orientation/framing;
- [ ] verify `inspect_element`;
- [ ] verify single + `modify_cubes_batch` correction and Undo;
- [ ] verify Cube/Group pivot-transfer behavior visually;
- [ ] run one approved-reference → primary-form comparison loop;
- [ ] record what actually improves or still fails.

Do not add more architecture before this proof unless a current source audit finds
a concrete safety defect.

## P1 — Persistence / Delivery Proof

- [ ] verify `.bbmodel` save path in current Local workflow;
- [ ] reopen the saved file and inspect geometry/hierarchy state;
- [ ] verify texture/persistence only when texture is in scope;
- [ ] define delivery completion from actual proof rather than assumption.

## P2 — MCP Surface Cleanup

- [ ] G3: forward existing tool annotations through registration and verify one
  read-only + one destructive example in MCP Inspector when local testing resumes;
- [ ] revisit public-surface reduction after the Reference Fidelity path is
  proven, hiding unrelated diagnostic/unsafe/broad tools from normal modelling
  without deleting useful implementation;
- [ ] prove save/open capability before adding duplicate project tools;
- [ ] add UV helpers only after a concrete texture workflow proves a real gap.

## P2 — Documentation / Obsidian Maintenance

- [ ] periodically audit active notes for stale paths/skill names;
- [ ] keep historical reviews as history and update Review Index status instead
  of rewriting evidence;
- [ ] keep `validation-report.md` aligned when local proof status changes;
- [ ] keep `implementation-map.md` aligned when source ownership changes;
- [ ] prune backlog items after they become done/irrelevant.

## Holds

- G1/G2 local proof — source corrections exist; proof deferred.
- G3 annotation forwarding — paused until higher-priority fidelity source work is
  complete.
- broad UV/public-surface/save-open work — later, after current fidelity loop is
  stabilized.

## Done — Major 2026-08-08 Work

- [x] frozen six-skill architecture at root `.agents/skills/`;
- [x] Source Image → Modelling Brief policy simplified;
- [x] Reference Fidelity root cause documented;
- [x] Reference Fidelity observation contract designed;
- [x] `inspect_model_bounds` source implementation;
- [x] `capture_model_views` source implementation;
- [x] `inspect_element` source implementation;
- [x] `modify_cubes_batch` source implementation;
- [x] strict Cube/group targeting and rollback behavior;
- [x] Group/pivot authoring hardening;
- [x] Cube pivot-only vs geometry-rewrite semantics;
- [x] explicit pivot for new rotated Cubes;
- [x] explicit finite `from/to` for new Cubes;
- [x] root docs/Obsidian knowledge refresh.

## Rule

- one active task → `next-action.md`;
- future work → this board;
- durable reason → decision note/log;
- current proof state → `foundation/validation-report.md`;
- do not read this page during normal boot unless backlog context is needed.
