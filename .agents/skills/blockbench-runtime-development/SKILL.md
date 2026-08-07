---
name: blockbench-runtime-development
description: Specialist for Blockbench runtime/plugin integration in BlockIT. Use when the primary problem is BBPlugin lifecycle, Blockbench globals/APIs, panels/dialogs/settings/actions, runtime permissions, Undo/Canvas/model mutation mechanics, event cleanup, or other behavior that must execute correctly inside Blockbench. Do not use for MCP protocol contracts, Bun build tooling, TypeScript type-system problems, or 3D modelling decisions such as shape, proportions, cuboid decomposition, texture art direction, or visual quality.
---

# Blockbench Runtime Development

Own the **Blockbench runtime/plugin boundary** for BlockIT.

This skill makes BlockIT interact with Blockbench correctly. It does not decide what a good 3D model should look like.

## Use This Skill For

- `BBPlugin.register` lifecycle and desktop-plugin integration;
- `onload`, `onunload`, install/uninstall behavior, and resource cleanup;
- Blockbench UI primitives already used by Local: panels, dialogs, settings, status/UI surfaces, actions when relevant;
- Blockbench globals and runtime APIs such as `Cube`, `Group`, `Texture`, `Animation`, `Outliner`, `Settings`, `Canvas`, and `Undo`;
- model mutation **mechanics**: correct API call, selection/lookup behavior, undo transaction, refresh/update, and cleanup;
- Blockbench event subscription/unsubscription;
- runtime permissions and `requireNativeModule` behavior;
- Blockbench-specific runtime behavior whose correctness cannot be proven outside Blockbench.

## Do Not Use It For

- MCP tool/resource/prompt/input/result contracts → `mcp-server-development`;
- TypeScript compiler/type-system issues → `typescript-type-safety`;
- Bun build/plugin/package behavior → `bun-tooling`;
- deciding which cubes/bones/details a model needs, proportions, silhouette, style, or reference interpretation → Blockbench modelling skill when recovered;
- judging whether a model visually matches its reference;
- generic Blockbench plugin scaffolding, plugin-store packaging, custom codecs/formats, or tutorials unless the current BlockIT task actually requires them.

A task may involve both an MCP tool and a Blockbench API call. Choose the specialist by the **proved semantic owner**. If the failure is the public MCP contract, use `mcp-server-development`; if the contract is correct but the Blockbench operation/lifecycle is wrong, use this skill.

## Local Architecture First

Inspect only the relevant owner. Typical entry points are:

- `mcp/index.ts` for plugin lifecycle, permissions, startup, and teardown;
- `mcp/ui/` for panels, dialogs, settings, status UI, and cleanup;
- the affected `mcp/server/tools/*.ts` execute path when it manipulates Blockbench state;
- `mcp/types.d.ts` / installed `blockbench-types` when runtime typing matters;
- existing Local usage of the same Blockbench API before introducing another pattern.

Do not treat generic plugin templates or copied API/framework cheat sheets as runtime authority. Local source, installed typings, and live Blockbench behavior are stronger evidence. If an API is uncertain, verify the specific API rather than importing a broad new reference pack.

## Runtime Contract

For a Blockbench-owned change, establish:

1. **Runtime owner** — which Blockbench API/global/lifecycle hook actually owns the behavior?
2. **State before mutation** — project/selection/element/settings/permission assumptions that must be true.
3. **Mutation boundary** — what state is changed and whether it must be undoable.
4. **Refresh/cleanup** — what update, listener cleanup, teardown, or UI refresh is required.
5. **Failure behavior** — what happens when the target/permission/state is unavailable.

Do not add fallback behavior merely because a runtime API is uncertain. Resolve the API or report the missing local proof.

## Mutation Rules

- Use the existing Local `Undo` pattern for user-visible model changes when the operation should be reversible.
- Keep the undo scope matched to the actual mutation; do not wrap unrelated work in one transaction.
- Update the Blockbench view/state only as required by the changed operation.
- Resolve IDs/names/selections using existing project conventions before inventing another lookup layer.
- Keep Blockbench globals out of build-time schema construction; live-state validation belongs in execution.
- Cleanup subscriptions, panels/dialog-owned resources, settings hooks, and runtime state when their lifecycle requires it.

These rules guarantee correct **mechanics**, not good modelling decisions. A technically valid cube mutation can still produce a poor model.

## UI And Embedded Component Rules

- Reuse existing `uiSetup`/`uiTeardown`, settings, dialogs, status, and `Panel` component patterns before adding another UI framework or state layer.
- Treat the component object embedded in Blockbench UI as part of the **Blockbench runtime integration**, not as a standalone Vue application architecture.
- Follow the component/lifecycle shape already present in Local source. Keep subscriptions and DOM/runtime listeners paired with the existing component or plugin teardown path.
- Keep panel-local reactive state local when that is sufficient; do not introduce a store/router/component framework for state already owned by the panel.
- Do not migrate UI to Vue SFCs, Composition API, Pinia, router tooling, Volar/vue-tsc configuration, or another Vue architecture merely because generic Vue guidance recommends it.
- Do not assume a framework version from a copied skill. If a framework-specific behavior matters, establish it from the actual Blockbench runtime/source or targeted local proof.
- Do not create new panels/actions/dialogs when an existing surface can express the same need.
- Keep lifecycle startup resilient only where Local already requires graceful degradation; do not add speculative recovery layers.
- Permission-sensitive native modules must follow the existing Blockbench permission path rather than bypassing it.

## Proof Budget

### ChatGPT → GitHub

Use static proof only:

- exact runtime API/lifecycle owner changed;
- direct setup/teardown or mutation callers inspected;
- cleanup/undo/update behavior remains internally consistent;
- no claim that Blockbench actually executed the behavior.

If the acceptance claim requires live Blockbench state, leave one precise Codex-local proof step.

### Codex Local

Use the smallest live Blockbench reproduction that can falsify the change. Examples:

- load/unload once for lifecycle/cleanup changes;
- execute the changed MCP operation once plus undo when undo semantics are the requirement;
- open/use the specific panel/dialog/setting when UI behavior changed.

Do not automatically run full build + Inspector + every UI path + visual review when one targeted runtime check proves the boundary.

## Anti-Slop Rules

- Do not load this skill merely because code references `Cube`, `Group`, or another Blockbench global.
- Do not turn Blockbench API mechanics into modelling policy.
- Do not infer visual quality from successful `Undo`, `Canvas`, element creation, or saved files.
- Do not copy generic plugin or Vue application templates into the existing MCP plugin.
- Do not preserve duplicate skill authorities for the same Blockbench/UI responsibility.
- Do not hard-code generic Blockbench or framework implementation claims into the skill when Local source or current typings can answer the task directly.
- Do not add abstractions around a one-off runtime API unless repeated Local behavior proves a shared owner.

## Completion

Return to the active `development-brief` and confirm:

- the Blockbench runtime/lifecycle/API problem was fixed at its real owner;
- MCP contract, Bun tooling, TypeScript typing, and modelling decisions stayed outside scope unless they were the actual owner;
- undo/update/cleanup behavior is appropriate to the mutation;
- minimum useful proof for the active execution channel is complete;
- any live Blockbench proof unavailable through GitHub is stated explicitly for Codex local rather than inferred.
