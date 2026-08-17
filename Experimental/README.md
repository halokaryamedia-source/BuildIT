# Experimental

Isolated workspace for bounded research that is **not** part of the active BlockIT production boundary.

Experiments here may produce source, workflows, fixtures, `.bbmodel` files, textures, screenshots, logs, or proof metadata. None of those become production capability, local-acceptance proof, or end-to-end verification until the relevant evidence is explicitly reviewed and promoted.

## Active Research — On-Demand Blockbench Web Authoring

Status:

```text
EXPERIMENTAL
NOT ACTIVE
NOT END-TO-END PROVEN
LOCAL ACCEPTANCE UNCHANGED
```

Goal: prove a reproducible on-demand path that can author a small Minecraft Bedrock model in **official Blockbench Web**, render native Blockbench previews, compile a native `.bbmodel`, return the outputs through GitHub Actions artifacts, and let ChatGPT inspect the real PNG evidence.

This research is separate from the desktop BlockIT MCP. MCP remains the live Blockbench adapter; this experiment tests an optional ephemeral job-mode architecture.

## Architecture under test

```text
ChatGPT
→ bounded repository-owned job/input
→ GitHub Actions ephemeral runner
→ browser controller
→ official Blockbench Web runtime
→ native author/load/render/compile
→ .bbmodel + PNG + proof metadata
→ GitHub Actions artifact
→ ChatGPT retrieval + visual inspection
```

The browser exists only for the job and terminates afterward. Generated outputs do not write back into production source automatically.

## Source-backed feasibility

The audited official Blockbench source provides the required primitives:

- web build/serve target;
- native `Cube`/Group/Texture/Animation APIs;
- `Texture.fromDataURL(...)` for in-memory texture input;
- `Codecs.project.compile()` / project parsing for native `.bbmodel` state;
- native `Preview` using `THREE.WebGLRenderer`;
- native camera presets;
- `Screencam` viewport capture to image data;
- deterministic animation time/preview APIs.

This proves the API shape, **not** GitHub-hosted runtime success.

The initial research snapshot inspected official Blockbench at commit:

```text
47e633e4a1338f957ee7baa0acbcf54da11e77df
```

A real POC must pin the exact upstream revision it actually tests and record that revision in proof metadata.

## Non-goals

The first POC must not introduce:

- MCP as a requirement for the job;
- a continuously running desktop Blockbench instance;
- a custom Three.js renderer replacing Blockbench Preview;
- a custom full `.bbmodel` serializer replacing Blockbench codecs;
- a generic remote code/shell execution interface;
- a new production router/profile/compatibility framework;
- a persistent controller/telemetry service;
- automatic promotion of generated artifacts into production.

## Material unknowns

The experiment is not viable until all three are proved:

1. **Runner WebGL proof** — the hosted runner can create the Blockbench WebGL viewport and render a known model deterministically enough for review.
2. **Artifact-to-ChatGPT visual proof** — a generated PNG can be retrieved from the workflow artifact and actually inspected visually by ChatGPT.
3. **Native authoring injection proof** — a bounded browser-controller script can create/load native Blockbench geometry and texture state without MCP or a persistent session.

## POC scope

Keep the first experiment intentionally small:

```text
1 Bedrock project
1 root/bone
1 known cube
1 in-memory PNG texture
optional: 1 bone + 2 keyframes
```

Required outputs:

```text
model.bbmodel
preview-perspective.png
preview-front.png
proof.json
```

Optional animation proof:

```text
animation-frame-000.png
animation-frame-050.png
```

`proof.json` should contain bounded reproducibility facts such as the tested Blockbench revision, browser/runtime version, WebGL availability/renderer identity, authored cube/texture counts, native compile result, and output byte sizes. It is experiment evidence, not a telemetry system.

## Runner strategy

### Attempt A — preferred

```text
ubuntu hosted runner
→ virtual display
→ Playwright Chromium in normal window mode
→ ANGLE / software WebGL where required
→ locally served Blockbench Web
```

### Attempt B — bounded fallback

If Attempt A fails for a distinct evidenced reason:

```text
ubuntu hosted runner
→ Chromium headless
→ explicit software WebGL fallback
→ locally served Blockbench Web
```

Do not cycle flags indefinitely. The same causal direction gets at most two bounded approaches with new evidence.

## Native job contract

The runner/controller should own filesystem writes. Blockbench Web should keep browser-safe state in memory.

```text
build/serve Blockbench Web
→ open browser
→ prove WebGL context
→ create Bedrock project through native Blockbench APIs
→ create known cube
→ load texture from data URL
→ render native perspective/front views
→ capture with native Blockbench viewport/Screencam
→ compile with native project codec
→ reset/reparse compiled project
→ verify expected cube/texture state
→ write outputs from runner controller
→ upload one workflow artifact
→ terminate browser/server
```

Do not require web-mode Blockbench to use desktop filesystem APIs.

## Acceptance criteria

The architecture becomes **POC VERIFIED** only when one current workflow run proves all applicable items:

1. official Blockbench Web boots on the pinned runner/browser setup;
2. a usable WebGL context is created;
3. the Bedrock project and known cube/texture are authored through native Blockbench state;
4. native Blockbench Preview renders the model;
5. perspective/front PNGs are valid and non-empty;
6. `Codecs.project.compile()` produces the `.bbmodel`;
7. the compiled `.bbmodel` is reparsed and the expected authored state survives;
8. the outputs are downloadable as a GitHub Actions artifact;
9. ChatGPT retrieves and **actually visually inspects** at least one native Blockbench PNG;
10. browser/server processes end with the job.

Artifact existence alone is not visual PASS.

## Stop rules

- If hosted-runner WebGL fails after two bounded approaches with genuinely new evidence, stop that runner direction. Re-evaluate a different runner class rather than building a renderer clone.
- If PNG artifacts cannot be surfaced to ChatGPT as real image evidence, do not claim a closed visual correction loop.
- If native authoring/compile cannot be proven for the known cube, do not expand into complex model generation.
- Do not expand geometry, texture, animation, or autonomous correction scope until the cube → native render → native `.bbmodel` → ChatGPT-visible image loop is proven.
- Failure here does not change current MCP behavior or reactivate local acceptance.

## GitHub execution discipline

`GITHUB_RULES.md` is authoritative.

For this experiment specifically:

- keep a retained reusable harness rather than creating a new workflow per run;
- use path/event routing that matches the experiment;
- use read-only repository permission unless a separately approved need proves otherwise;
- validate bounded workflow inputs;
- pin external revisions where reproducibility matters;
- store outputs in workflow artifacts;
- do not auto-commit artifacts to `Local`;
- do not treat Actions as a generic development shell;
- stop when the current acceptance claim is either proved or blocked.
