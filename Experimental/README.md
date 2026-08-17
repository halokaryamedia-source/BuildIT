# Experimental

Isolated workspace for bounded research that is **not** part of the active BlockIT production boundary. Experimental source, artifacts, screenshots, `.bbmodel` files, and proof metadata do not become production capability or local-acceptance proof without separate promotion evidence and authority.

## Active Research — On-Demand Blockbench Web Authoring

Status:

```text
EXPERIMENTAL
CUBE POC VERIFIED
DATA-ONLY AUTHORING POC VERIFIED
CHATGPT VISUAL LOOP VERIFIED
NOT PRODUCTION
LOCAL ACCEPTANCE UNCHANGED
```

Goal: prove a reproducible on-demand path where ChatGPT can express bounded Minecraft Bedrock authoring intent as data, GitHub Actions executes it in **official Blockbench Web**, native Blockbench APIs render/compile the result, and ChatGPT can retrieve and visually inspect the real output.

This research is separate from the desktop BlockIT MCP. Browser proof does not upgrade desktop MCP runtime claims.

## Architecture under test

```text
ChatGPT
→ bounded repository-owned request.json
→ GitHub Actions ephemeral runner
→ schema validator
→ repository-owned browser executor
→ official Blockbench Web runtime
→ native Group/Cube/Texture authoring
→ native Preview + Screencam
→ Codecs.project.compile() + native reparse
→ .bbmodel + PNG + proof metadata
→ GitHub Actions artifact
→ ChatGPT retrieval + visual inspection
```

The browser exists only for the job and terminates afterward. Generated outputs do not write back into production source automatically.

## Current proof state

### Phase 1 — fixed Cube loop

```text
BuildIT commit:       091892543f07521e63f675ad88970a6423ecb0e0
Workflow run:         32042300181
Blockbench commit:    47e633e4a1338f957ee7baa0acbcf54da11e77df
Artifact ID:          9292183423
Result:               CUBE POC VERIFIED
```

This proved hosted WebGL, native authoring/render/compile/reparse, artifact retrieval, cleanup, and the first real ChatGPT visual inspection loop.

### Phase 2 — bounded data-only authoring

```text
BuildIT commit:       79e0d4096560a63f5d3b51c7ed19cbd86e2c70d2
Workflow run:         32043429658
Artifact ID:          9292374397
Artifact SHA-256:     14b6bf517139c2b83d55651932eff2d2d680f63553b78eeec80f9b522b68c465
Request SHA-256:      abfa139a6e588c6bb2ac4c35f00bfe6fa41b2fb36bcb758a9dc42d3a912ece5a
Contract:             data-only-v1
Result:               DATA-ONLY AUTHORING POC VERIFIED
```

The verified request contained exactly 5 validated operations:

```text
1 create_texture
1 add_group
3 add_cube
```

The browser executor authored a three-Cube arch (`left_post`, `right_post`, `top_beam`) under `root` with one embedded `copper.png` checker texture. Native reparse preserved the same group, cubes, and texture.

Runtime proof:

```text
WebGL:                WebGL 2.0
Renderer:             ANGLE / Vulkan / SwiftShader Device (Subzero)
Blockbench:           47e633e4a1338f957ee7baa0acbcf54da11e77df
Playwright:           1.62.1
Chromium:             151.0.7922.34
model.bbmodel:        3235 bytes
perspective PNG:      19976 bytes
front PNG:            7920 bytes
browser cleanup:      true
server cleanup:       true
```

The compiled project was inspected as native Bedrock `.bbmodel`: `model_format: bedrock`, Box UV enabled, resolution 16×16, one `root` group, three expected Cubes at the requested coordinates, and one embedded data-URL texture.

ChatGPT retrieved the GitHub Actions artifact and **actually visually inspected both PNGs**. Perspective visibly showed the three-Cube arch in 3D with the copper/dark checker pattern across its faces. Front visibly showed the expected two posts and top beam with the central opening. Artifact existence was not used as a substitute for visual review.

Repository Verify and the full MCP Verify also passed on the generalized-authoring commit. This proves the bounded Experimental path without changing production MCP behavior.

## Data-only v1 contract

`Experimental/blockbench-web-poc/authoring-contract.mjs` is the input authority. The request is parsed and normalized before browser launch, then passed to `page.evaluate` as serialized data rather than executable source.

Allowed operations:

```text
create_texture
add_group
add_cube
```

Limits:

```text
operations <= 32
groups     <= 8
cubes      <= 24
textures   <= 4
coordinates within -64..64
cube size > 0 and <= 32 on each axis
texture resolution: 16 / 32 / 64
texture pattern: solid / checker
Box UV only
```

Unknown fields, unknown operations, duplicate IDs/names, invalid references, invalid dimensions, and invalid pattern values are rejected. Contract v1 exposes no request-provided shell command, JavaScript, browser flags, file path, URL, secret, or arbitrary execution field.

## Source-backed feasibility

The pinned official Blockbench source provides the primitives now exercised by the hosted proof:

- web build/serve target;
- native `Group`, `Cube`, and `Texture` APIs;
- `Texture.fromDataURL(...)`;
- native `Preview` using `THREE.WebGLRenderer`;
- `Screencam.screenshotPreview(...)`;
- `Codecs.project.compile()` and native project parsing.

Source inspection alone was not treated as runtime proof; the current claims above come from actual matching workflow runs and artifacts.

## Non-goals

The experiment does not authorize:

- arbitrary JavaScript or shell execution from a request;
- general filesystem/network access from a request;
- a persistent Blockbench/browser/controller service;
- a custom Three.js renderer;
- a custom full `.bbmodel` serializer;
- MCP replacement;
- production auto-writeback;
- complex-model capability claims from the current small proofs;
- autonomous correction;
- animation capability claims.

## Material unknowns for expansion

The original unknowns—hosted WebGL, native browser authoring, artifact return, visual inspection, and a bounded data-only create contract—are now resolved for the proved scope.

Still unproven:

1. a **bounded correction iteration** can consume prior authored state/evidence and apply a targeted correction without arbitrary code or rebuilding architecture;
2. a safe mutation contract for existing elements (`modify_cube` or equivalent) can preserve deterministic identity and native state;
3. larger geometry/texture workloads remain practical before complex-model claims;
4. richer texture input beyond generated solid/checker data remains safe and useful;
5. rotations, deletes, broader hierarchy edits, animation, and autonomous correction remain outside v1.

## POC scope

Verified phases remain intentionally small:

```text
Phase 1: 1 group + 1 Cube + 1 texture
Phase 2: 1 group + 3 Cubes + 1 texture via data-only request
```

Verified artifact outputs:

```text
request.json
model.bbmodel
preview-perspective.png
preview-front.png
proof.json
logs
```

## Runner strategy

### Attempt A — VERIFIED

```text
ubuntu hosted runner
→ Xvfb virtual display
→ Playwright Chromium in normal window mode
→ ANGLE / SwiftShader software WebGL
→ locally served official Blockbench Web
```

Attempt B was not needed. Do not add fallback machinery without a current evidenced need.

## Native job contract

```text
validate bounded request data
→ pin official Blockbench source
→ build/serve Blockbench Web
→ open browser + prove WebGL
→ setup Bedrock project
→ map allowed operations to native APIs
→ update native Canvas/Preview
→ capture perspective/front with Screencam
→ Codecs.project.compile()
→ native reparse
→ compare expected authored identity/state
→ write artifact from runner controller
→ terminate browser/server
```

Web-mode Blockbench is not required to use desktop filesystem APIs.

## Acceptance criteria

The **data-only authoring POC is VERIFIED** because workflow run `32043429658` proved:

1. the request passed the bounded v1 validator;
2. the request crossed into the browser as data, not generated executable code;
3. native Blockbench authored multiple requested Cubes and texture state;
4. native Preview rendered the request-derived model;
5. both PNGs were valid, non-empty, downloaded, and visually inspected;
6. `Codecs.project.compile()` produced a native Bedrock `.bbmodel`;
7. native reparse preserved the expected group/Cube/texture identity;
8. artifact `request.json` matched the proof request hash;
9. browser/server cleanup completed;
10. repository and MCP regression gates remained green.

This is end-to-end proof for the bounded create-only v1 contract, **not** end-to-end production or complex-model verification.

## Next experimental boundary

Do not jump directly into complex assets. The next useful experiment, only after a fresh explicit instruction, is:

```text
verified prior authored state
→ bounded data-only correction request
→ targeted native mutation
→ native compile/reparse
→ fresh visual artifact
→ ChatGPT difference review
```

The correction experiment should prove one targeted geometry correction first. It must not introduce arbitrary code execution, persistent services, a new renderer, or production integration.

## Stop rules

- Data-only create v1 is proven; stop this phase here.
- Do not expand into correction, rotations, richer textures, animation, autonomous iteration, or complex assets without a fresh bounded acceptance contract.
- If a later direction fails twice for the same causal reason with new evidence, stop that direction rather than cycling flags.
- Later Experimental failure does not change production MCP behavior or reactivate local acceptance.
- Production promotion requires separate evidence and explicit authority.

## GitHub execution discipline

`GITHUB_RULES.md` is authoritative.

For this experiment:

- retain one reusable harness;
- keep repository permissions read-only;
- treat `request.json` as bounded data, not a remote-code interface;
- validate before browser execution;
- pin external revisions where reproducibility matters;
- use artifacts for outputs;
- never auto-commit generated artifacts into `Local`;
- stop once the current bounded claim is proved or blocked.
