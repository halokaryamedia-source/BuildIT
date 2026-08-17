# Next Action

Updated: 2026-08-17

## Status

```text
PRELOCAL_CONTROLLER_MUTATION_READY
```

Working branch: **`Local` only**. `NO LOCAL RUN ACTIVE`.

Retained state: **P0–P7 + REF + PRO-1–PRO-8 + U1–U7**. Local acceptance remains explicitly deferred.

Current repository capability closure adds:

```text
AnimationController create/state-machine mutation
→ one manage_animation_controller tool
→ up to 32 ordered coherent operations
→ one native animation_controllers Undo unit
→ complete plan preflight before native mutation
→ unexpected apply failure rolls back the open Undo edit
→ returned controller + affected state/IDs are continuation state
→ no automatic inspect_animation readback
→ no new registration family/profile/router/framework
```

Supported controller mutations cover controller rename, state add/update/remove, initial state, transitions, animation links, on_entry/on_exit, scalar blend transition, and shortest-path blend flag.

Still protected: controller-state particle/sound and blend-curve mutation, existing-animation direct sound/timeline-effect mutation, TextureMesh, native visible bounding-box fields, animated textures, and bone-binding expressions.

Optimization boundary remains unchanged:

```text
U7  No change required — no lean profile/router/runtime-prompt redesign without installed-client evidence
```

The default surface is now **63 tools**. The max-per-tool serialized ceiling remains **3,200 characters**; the capability does not justify relaxing that guard. Exact current serialized metrics are emitted by `bun run measure:surface` and are not installed-client token proof.

Installed-plugin freshness, live controller behavior/execution, runtime/model behavior, actual call efficiency, and persistence remain **LOCAL PROOF REQUIRED**.

**Do not claim live Blockbench/model-quality improvement without actual runtime proof; runtime-usage improvement also requires direct runtime evidence.**

## Local Acceptance Boundary

```text
LOCAL ACCEPTANCE DEFERRED
```

The user has explicitly deferred local testing. `docs/knowledge/operations/local-acceptance-runbook.md` remains the single procedure owner but is **inactive**. Do not execute its build/freshness/runtime steps and do not silently reactivate it from repository readiness alone.

Reference generation remains separately gated:

```text
WAIT FOR FRESH EXPLICIT USER GENERATION COMMAND
```

## Next Step

```text
PRELOCAL / REPOSITORY
→ controller-mutation static closure complete
→ no local test active
→ continue only from a fresh concrete user instruction or newly evidenced repository issue
→ local runbook requires fresh explicit reactivation
```

No speculative controller runtime framework, new profile, generic evaluator, compatibility layer, telemetry system, or persistent controller registry is justified.

## Experimental Plan — On-Demand Blockbench Web Authoring

```text
EXPERIMENTAL / NOT ACTIVE / NOT END-TO-END PROVEN
```

This is a research-backed experimental direction, **not** an approved product boundary, active implementation phase, or local-acceptance reactivation.

### Feasibility finding

The official Blockbench source supports the core pieces required for an on-demand browser authoring/render job:

```text
Blockbench Web can be built/served
→ native Cube / Texture / Animation APIs are programmatically authorable
→ project codec can parse and compile .bbmodel
→ native Preview uses THREE.WebGLRenderer
→ native camera presets are callable
→ Screencam can capture viewport screenshots/GIFs
→ Timeline.setTime() + Animator.preview() can render deterministic animation frames
```

Therefore the architecture is technically feasible **without requiring MCP or a continuously running Blockbench instance**. The intended job mode is:

```text
ChatGPT
→ GitHub job/input state
→ ephemeral on-demand browser runner
→ official Blockbench Web runtime
→ native author/load/render/validate/compile
→ .bbmodel + texture + preview artifacts
→ GitHub
→ ChatGPT visual review
→ bounded correction iteration
```

MCP remains a separate optional **live Blockbench adapter**; it is not required by this experimental job-mode architecture.

### Important corrections / non-goals

- Do **not** build a custom Three.js renderer when native Blockbench Preview/Screencam can own rendering.
- Do **not** make a custom full `.bbmodel` serializer by default; prefer native `Codecs.project.compile()` / project parse behavior.
- Do **not** treat Blockbench URL `loadtype=json&loaddata=...` as the production transport for large models; browser-side in-memory/file/blob injection is the safer experiment.
- Web Blockbench has no Electron/Node filesystem (`fs`, `PathModule`, `child_process`, etc. are unavailable in web mode), so the runner must transfer project/texture data through browser-safe memory/blob/upload/HTTP mechanisms.
- No official Blockbench Playwright/Puppeteer/headless harness was found in the audited source. Browser automation around the official web runtime would be BuildIT-owned experimental glue.
- The official Blockbench GitHub workflow proves the web app can be built on `ubuntu-latest`; it does **not** prove WebGL rendering succeeds in a GitHub-hosted headless browser.

### Material unknowns that must be proved before implementation expands

1. **Runner WebGL proof** — a GitHub-hosted runner must successfully create the Blockbench WebGL viewport and render a known cube. Software rendering is acceptable for the POC if deterministic enough.
2. **Artifact-to-ChatGPT visual proof** — the generated PNG must be retrievable through the connected GitHub path in a form ChatGPT can actually inspect visually, not merely as opaque/base64 metadata.
3. **Native authoring injection proof** — one bounded runner script must create/load native geometry, texture, and animation state without MCP and without maintaining a persistent Blockbench session.

### POC scope

The first experiment must stay intentionally small:

```text
1 known cube
+ 1 in-memory PNG texture
+ optional 1-bone / 2-keyframe animation probe
```

Required outputs:

```text
model.bbmodel
preview-perspective.png
preview-front.png
(optional) animation-frame-000.png
(optional) animation-frame-050.png
```

Acceptance criteria:

1. Start the official Blockbench Web runtime only for the job and terminate it afterward.
2. Create or load the known model through native Blockbench project/authoring APIs and render it with native Preview/Screencam.
3. Compile the result with the native Blockbench project codec and persist the `.bbmodel` plus screenshots as GitHub artifacts/output.
4. Prove ChatGPT can retrieve and **visually inspect** at least one native Blockbench screenshot from that output path.
5. No MCP server, persistent desktop Blockbench session, custom renderer, or custom full `.bbmodel` compatibility layer is introduced for this POC.

### Stop rules

- If GitHub-hosted WebGL fails after **two bounded approaches with new evidence**, stop that runner direction; do not compensate by building a renderer clone. Re-evaluate a self-hosted/on-demand browser runner or mark the experiment blocked.
- If screenshot artifacts cannot be surfaced back to ChatGPT as real visual evidence, do not claim a closed visual correction loop.
- Do not expand into full geometry/texture/animation generation until the cube → native render → native `.bbmodel` → ChatGPT-visible screenshot loop is proven.
- Keep current MCP behavior, current product status, and deferred local acceptance unchanged while this remains experimental.
