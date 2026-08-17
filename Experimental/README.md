# Experimental

Isolated workspace for bounded research that is **not** part of the active BlockIT production boundary.

Experiments here may produce source, workflows, fixtures, `.bbmodel` files, textures, screenshots, logs, or proof metadata. None of those become production capability or local-acceptance proof unless explicitly promoted through the repository's normal evidence and product boundaries.

## Active Research — On-Demand Blockbench Web Authoring

Status:

```text
EXPERIMENTAL
CUBE POC VERIFIED
CHATGPT VISUAL LOOP VERIFIED
NOT PRODUCTION
LOCAL ACCEPTANCE UNCHANGED
```

Goal: prove a reproducible on-demand path that can author a small Minecraft Bedrock model in **official Blockbench Web**, render native Blockbench previews, compile a native `.bbmodel`, return the outputs through GitHub Actions artifacts, and let ChatGPT inspect the real PNG evidence.

The bounded one-Cube proof is now complete. This does **not** yet prove a generalized authoring job language, complex-model generation, autonomous correction, MCP replacement, or production readiness.

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

For the current fixed Cube harness, that complete path is **CURRENT-PROJECT VERIFIED**. The browser exists only for the job and terminates afterward. Generated outputs do not write back into production source automatically.

## Current proof state

The successful proof came from:

```text
BuildIT commit:       091892543f07521e63f675ad88970a6423ecb0e0
Workflow run:         32042300181
Attempt:              A — headed Xvfb + SwiftShader
Blockbench commit:    47e633e4a1338f957ee7baa0acbcf54da11e77df
Playwright:           1.62.1
Chromium:             151.0.7922.34
Artifact ID:          9292183423
Artifact SHA-256:     af1bc0319667b92f70a78403ee7ffe2d9ded8a9706eb3600de30e36dac41dd4b
```

Runtime proof reported:

```text
WebGL:                WebGL 2.0
Renderer:             ANGLE / Vulkan / SwiftShader Device (Subzero)
Authored state:       1 root group + 1 Cube + 1 16x16 texture
Native reparse:       same root/Cube/texture survived
model.bbmodel:        2161 bytes
perspective PNG:      13872 bytes
front PNG:            7279 bytes
browser cleanup:      true
server cleanup:       true
```

The compiled project is a native Bedrock `.bbmodel` with `model_format: bedrock`, Box UV enabled, one `root` group, one `poc_cube` from `[-4, 0, -4]` to `[4, 8, 4]`, and one embedded `poc.png` texture.

ChatGPT retrieved the GitHub Actions artifact and **actually visually inspected both PNGs**. The perspective image visibly contains the textured Cube in 3D with the two-tone pattern across its visible faces. The front image visibly contains the square front view with the authored two-tone texture. Artifact existence was not used as a substitute for visual inspection.

The localhost Web build emitted non-blocking CORS/service-worker console noise for Blockbench online services; this did not prevent native project authoring, WebGL rendering, screenshots, compile/reparse, or cleanup.

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

The source-backed API shape is now complemented by the current hosted-runner proof above.

## Non-goals

The experiment must not introduce:

- MCP as a requirement for the job;
- a continuously running desktop Blockbench instance;
- a custom Three.js renderer replacing Blockbench Preview;
- a custom full `.bbmodel` serializer replacing Blockbench codecs;
- a generic remote code/shell execution interface;
- a new production router/profile/compatibility framework;
- a persistent controller/telemetry service;
- automatic promotion of generated artifacts into production.

## Material unknowns for expansion

The fixed one-Cube harness resolved the original three material unknowns: hosted-runner WebGL, artifact-to-ChatGPT visual proof, and native authoring injection.

The next phase, if explicitly authorized, still must prove:

1. a **bounded data-only authoring-operation contract** can express useful model changes without exposing arbitrary JavaScript or shell execution;
2. the browser executor can map those allowed operations deterministically onto native Blockbench APIs;
3. bounded correction iterations can reuse returned authored state and visual evidence without creating a persistent service or new production framework;
4. larger geometry/texture workloads remain practical before any claim about complex model generation;
5. animation remains separately unproven by this Cube POC.

## POC scope

The completed experiment intentionally stayed small:

```text
1 Bedrock project
1 root/bone
1 known cube
1 in-memory PNG texture
```

Verified outputs:

```text
model.bbmodel
preview-perspective.png
preview-front.png
proof.json
```

Animation was intentionally not added because it was optional and unnecessary to close the Cube proof.

`proof.json` contains bounded reproducibility facts: tested Blockbench revision, browser/runtime version, WebGL renderer identity, authored/reparsed state, output byte sizes, and cleanup state. It remains experiment evidence, not a telemetry system.

## Runner strategy

### Attempt A — VERIFIED

```text
ubuntu hosted runner
→ Xvfb virtual display
→ Playwright Chromium in normal window mode
→ ANGLE / SwiftShader software WebGL
→ locally served Blockbench Web
```

Attempt A succeeded after one harness-only correction: the first run failed before browser launch because the Node child process was given a server log `WriteStream` before its file descriptor opened. The correction opened the log file descriptor before `spawn()`. That failure was a harness bug, not a WebGL failure.

### Attempt B — NOT RUN / NOT NEEDED

The headless fallback was not used because Attempt A reached native Blockbench WebGL/render/compile success. Do not add Attempt B merely as redundancy.

## Native job contract

The runner/controller owns filesystem writes. Blockbench Web keeps browser-safe authored state in memory.

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

The current Cube architecture is **POC VERIFIED** because workflow run `32042300181` proved all applicable items:

1. official Blockbench Web booted on the pinned runner/browser setup;
2. a usable WebGL 2 context was created through ANGLE/SwiftShader;
3. the Bedrock project and known Cube/texture were authored through native Blockbench state;
4. native Blockbench Preview rendered the model;
5. perspective/front PNGs were valid, non-empty, and visually inspected;
6. `Codecs.project.compile()` produced the `.bbmodel`;
7. the compiled `.bbmodel` was reparsed and the expected authored state survived;
8. the outputs were downloaded as a GitHub Actions artifact;
9. ChatGPT retrieved and **actually visually inspected** native Blockbench PNGs;
10. browser/server processes ended with the job.

This is an end-to-end **Cube POC**, not end-to-end production verification.

## Next experimental boundary

Do not expand directly into complex assets. The next useful experiment, only after a fresh explicit instruction, is:

```text
bounded data-only authoring operations
→ repository-owned browser executor
→ native Blockbench APIs
→ artifact + visual review
```

The operation contract must be narrower than arbitrary code execution and must reuse the proven runner/render/compile path rather than introducing a new renderer or persistent service.

## Stop rules

- The Cube → native render → native `.bbmodel` → ChatGPT-visible image loop is proven; stop this POC here.
- Do not expand geometry, texture, animation, or autonomous correction scope without a fresh explicit instruction and a bounded next acceptance contract.
- If a later hosted-runner direction fails twice for the same causal reason with new evidence, stop that direction rather than cycling flags.
- Failure in a later experiment does not change current MCP behavior or reactivate local acceptance.
- Production promotion requires separate evidence and explicit authority.

## GitHub execution discipline

`GITHUB_RULES.md` is authoritative.

For this experiment specifically:

- keep the retained reusable harness rather than creating a new workflow per run;
- use path/event routing that matches the experiment;
- use read-only repository permission unless a separately approved need proves otherwise;
- validate bounded workflow inputs;
- pin external revisions where reproducibility matters;
- store outputs in workflow artifacts;
- do not auto-commit artifacts to `Local`;
- do not treat Actions as a generic development shell;
- stop when the current acceptance claim is either proved or blocked.
