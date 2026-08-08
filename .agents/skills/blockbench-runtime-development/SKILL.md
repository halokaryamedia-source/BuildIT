---
name: blockbench-runtime-development
description: Specialist for Blockbench runtime/plugin integration in BlockIT. Use when the primary problem is BBPlugin lifecycle, Blockbench globals/APIs, panels/dialogs/settings/actions, runtime permissions, Undo/Canvas/model mutation mechanics, event cleanup, or other behavior that must execute correctly inside Blockbench. Do not use for MCP protocol contracts, Bun tooling, TypeScript type-system problems, reference generation, or Bedrock modelling decisions such as shape, proportions, Cuboid decomposition, texture art direction, or visual quality.
---

# Blockbench Runtime Development

Own the **Blockbench runtime/plugin boundary** for BlockIT. This skill decides
how an operation executes correctly inside Blockbench; it does not decide what a
good model should look like.

## Use This Skill For

- `BBPlugin.register`, load/unload/install/uninstall lifecycle and cleanup;
- Blockbench panels, dialogs, settings, actions, and status/UI surfaces already
  used by Local;
- Blockbench globals/APIs such as `Cube`, `Group`, `Texture`, `Animation`,
  `Outliner`, `Settings`, `Canvas`, and `Undo`;
- model mutation mechanics: API call, lookup/selection, undo transaction,
  refresh/update, and cleanup;
- event subscription/unsubscription;
- runtime permissions and `requireNativeModule` behavior;
- Blockbench-specific behavior that requires live runtime proof.

Adjacent owners:

- MCP public/protocol contracts → `mcp-server-development`;
- TypeScript type-system failures → `typescript-type-safety`;
- Bun build/package behavior → `bun-tooling`;
- Bedrock model shape/proportion/reference/visual judgement →
  `blockbench-bedrock-modelling`;
- Source Image → Modelling Brief generation → `docs/foundation/04-reference-guide.md`.

If an MCP tool calls Blockbench APIs, choose by the **proved semantic owner**:
public MCP contract → MCP specialist; correct contract but wrong Blockbench
operation/lifecycle → this skill; operation works but the model is visually
wrong → modelling specialist.

## Local Architecture First

Typical owners:

- `mcp/index.ts` for plugin lifecycle/permissions/startup/teardown;
- `mcp/ui/` for panels/dialogs/settings/status/cleanup;
- affected `mcp/server/tools/*.ts` execute path for live model mutation;
- `mcp/types.d.ts` / installed `blockbench-types` when runtime typing matters;
- existing Local usage of the same API before another pattern is introduced.

Local source, installed typings, and live Blockbench behavior are stronger
runtime authorities than copied plugin/Vue/API cheat sheets.

## Runtime Contract

For a Blockbench-owned change establish only:

1. the runtime API/lifecycle owner;
2. required state before mutation;
3. the mutation/undo boundary;
4. required refresh/update/cleanup;
5. failure behavior when target/state/permission is unavailable.

Do not add speculative fallbacks because an API is uncertain. Resolve the API or
leave the exact local proof outstanding.

## Mutation And UI Rules

- Use existing Local `Undo` patterns for user-visible reversible model changes.
- Match undo scope to the actual mutation.
- Refresh Blockbench state only as required.
- Reuse current ID/name/selection lookup conventions.
- Keep Blockbench globals out of build-time schema construction; live-state
  validation belongs in execution.
- Pair listeners/subscriptions and UI resources with the proper teardown path.
- Reuse existing `uiSetup`/`uiTeardown`, settings, dialog, status, and `Panel`
  component patterns before adding another state/framework layer.
- Treat embedded reactive component behavior as Blockbench runtime integration,
  not a standalone Vue application architecture.
- Do not introduce SFC/Composition API/Pinia/router/Volar/vue-tsc architecture
  unless a new product requirement explicitly creates that boundary.
- Permission-sensitive native modules must follow the existing Blockbench
  permission path.

Correct mechanics do not prove good modelling. A technically valid Cube mutation
can still produce the wrong visual result.

## Proof

Apply root `AGENTS.md` minimum-proof rules. ChatGPT→GitHub can inspect runtime
owners and consistency but cannot claim live Blockbench execution. Codex local
should use the smallest live reproduction that can falsify the changed runtime
behavior, such as one load/unload, one changed operation plus undo, or one
specific UI interaction.

## Anti-Slop Boundary

- Do not load this skill merely because source references a Blockbench global.
- Do not turn API mechanics into modelling policy.
- Do not infer visual quality from successful Undo/Canvas/element/save behavior.
- Do not import generic plugin/Vue scaffolding into the existing plugin.
- Do not add abstractions around a one-off API without repeated Local behavior.

## Completion

Return to `development-brief` and confirm the runtime/API problem is fixed at its
real owner, adjacent domains stayed outside scope, undo/update/cleanup are
appropriate, and unavailable live proof is reported rather than inferred.
