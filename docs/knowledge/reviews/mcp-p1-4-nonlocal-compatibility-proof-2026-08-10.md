# P1.4 Non-Local Compatibility Proof — 2026-08-10

Status: **NON-LOCAL PROOF COMPLETE / BLOCKBENCH LOCAL PROOF STILL REQUIRED**

This note records the strongest P1.4 evidence that can be obtained without running the current Local plugin inside the user's real Blockbench desktop process.

It does **not** mark P1.4 complete and does **not** authorize P1.5.

## Scope

Decision owner:

```text
docs/knowledge/reviews/mcp-transport-session-decision-2026-08-10.md
```

Implemented transport source:

```text
775a104a41fc703d6424409c8f71c862727548ae
refactor: simplify MCP transport to stateless v1
```

The product remains:

```text
Minecraft Bedrock Entity MCP
loopback-only
Streamable HTTP
stateless protocol transport
JSON response mode
current production TypeScript SDK v1 line
```

No Bedrock Entity modelling/tool capability was removed by the proof work in this note.

## 1. Pinned TypeScript SDK proof

BlockIT resolves:

```text
@modelcontextprotocol/sdk@1.25.3
```

Official tag / source:

```text
https://github.com/modelcontextprotocol/typescript-sdk/tree/v1.25.3
```

The official v1.25.3 Streamable HTTP transport explicitly documents:

```text
sessionIdGenerator omitted/undefined -> stateless mode
enableJsonResponse: true -> JSON response mode
stateless mode -> no server-issued Mcp-Session-Id and no session validation
```

The official v1.25.3 stateless example uses the same lifecycle shape selected by BlockIT:

```text
for each POST request:
  create fresh McpServer
  create fresh WebStandardStreamableHTTPServerTransport
  sessionIdGenerator: undefined
  connect server to transport
  handle request
  close request-owned server/transport

GET -> 405
DELETE -> 405
```

BlockIT's `mcp/server/net.ts` follows that request-owned shape while retaining the repository's raw `node:net` HTTP adapter and loopback/Origin containment.

## 2. Codex direct Streamable HTTP requirement

Official current Codex source audited:

```text
https://github.com/openai/codex
```

Current config source supports an MCP server configured directly by URL and resolves that configuration to the Streamable HTTP transport. It does not require `mcp-remote` for this path.

Relevant source owners:

```text
codex-rs/config/src/mcp_types.rs
codex-rs/codex-mcp/src/rmcp_client.rs
codex-rs/rmcp-client/src/rmcp_client.rs
```

Current Codex legacy Streamable HTTP initialization explicitly requests:

```text
2025-06-18
```

Therefore P1.4 executable fixtures were aligned to `2025-06-18`, rather than pretending the client currently initializes with the latest server revision.

The pinned BlockIT TypeScript SDK v1.25.3 explicitly supports:

```text
2025-11-25
2025-06-18
2025-03-26
2024-11-05
2024-10-07
```

So Codex's current requested revision is within the server SDK's supported protocol set.

## 3. Exact Codex rmcp transport behavior

Current Codex workspace pins:

```text
rmcp = 3.0.0
```

Official exact upstream tag:

```text
https://github.com/modelcontextprotocol/rust-sdk/tree/rmcp-v3.0.0
```

The exact `rmcp-v3.0.0` Streamable HTTP client configuration defaults to:

```text
allow_stateless: true
```

Its worker accepts an initialize response with **no session ID** when `allow_stateless` is true.

It only starts the standalone/common GET SSE stream when a session ID exists:

```text
if let Some(session_id) = &session_id {
    spawn_common_stream(...)
}
```

Therefore, for BlockIT's JSON-response stateless server that intentionally emits no `Mcp-Session-Id`, current Codex/rmcp source does not require a standalone GET/SSE stream.

This is **official source compatibility evidence**, not proof that a particular installed Codex binary has connected to the user's Blockbench process.

## 4. Pinned-SDK executable sequence proof

Added:

```text
mcp/tests/p1-stateless-sdk-sequence.test.ts
```

The test uses the repository's pinned TypeScript SDK and creates a fresh server + stateless transport per POST.

It executes:

```text
initialize (2025-06-18)
notifications/initialized
tools/list
tools/call
repeated tools/list
```

Assertions include:

```text
all expected status codes
no server-issued Mcp-Session-Id
follow-up requests succeed on fresh request-owned servers
tool list/call protocol handlers work in JSON response mode
```

This proves the selected stateless sequence against the exact TypeScript SDK line used by BuildIT without requiring Blockbench globals.

## 5. Raw `node:net` executable integration proof

Added:

```text
mcp/tests/p1-stateless-net-integration.test.ts
```

This test instantiates the real `mcp/server/net.ts` owner using a real TCP listener on an ephemeral port and a minimal runtime-independent BlockIT tool fixture.

It deliberately does **not** import the full Bedrock registration surface because Paint registration correctly expects live Blockbench globals such as `Painter`. Faking those globals in CI would create false runtime proof.

The raw TCP integration proves:

```text
actual TCP listener address == 127.0.0.1
/health reports stateless/json
health contains no protocol session state
GET MCP endpoint -> HTTP 405
DELETE MCP endpoint -> HTTP 405
invalid present Origin -> real HTTP 403
initialize over the real raw HTTP parser succeeds
repeated tools/list succeeds without Mcp-Session-Id
tools/call succeeds through the raw parser + BlockIT registry
Codex-compatible protocol revision 2025-06-18 is accepted
```

## 6. Canonical final non-local verification

Current aligned proof head:

```text
11417b1070ad095a081c8e4408bc323f10111627
test: align local smoke with Codex protocol
```

Canonical workflow:

```text
MCP Verify
run: 31378088972
```

Result:

```text
frozen-lockfile install     PASS
full tsc --noEmit           PASS
Bun tests                   PASS — 32/32, 0 failures, 187 expect() calls
production build            PASS
generated docs freshness    PASS
fail-closed aggregator      PASS
workflow conclusion         SUCCESS
```

The test set includes both the pinned-SDK request sequence and the real raw-TCP integration described above.

## 7. Prepared local smoke harness

Prepared command:

```bash
cd mcp
bun run verify:stateless-local
```

Default URL:

```text
http://127.0.0.1:3000/bb-mcp
```

Alternate URL may be supplied by command argument or `BLOCKIT_MCP_URL`.

The harness now mirrors current Codex legacy initialization with protocol revision:

```text
2025-06-18
```

When the real Blockbench plugin is running, it checks:

```text
health stateless/json
GET 405
DELETE 405
invalid Origin 403
initialize succeeds
no Mcp-Session-Id
initialized notification accepted
real tools/list includes key Bedrock core tools
risky_eval absent
from_geo_json absent
repeated tools/list remains session-independent
```

The harness explicitly reports that it is **not** a substitute for the remaining manual/runtime acceptance.

## 8. Remaining evidence — LOCAL PROOF REQUIRED

The following claims cannot honestly be established from GitHub Actions or source audit alone:

```text
current built plugin loads inside the user's actual Blockbench desktop runtime
real Blockbench process binds the configured listener only to 127.0.0.1
actual installed Codex connects directly to the running Blockbench plugin
real default Bedrock tools/list completes while live Paint/Blockbench globals exist
real read-only Bedrock tool call succeeds
real bounded Bedrock mutation succeeds and affects the intended project
invalid Origin returns 403 from the actual Blockbench-hosted listener
plugin unload/reload closes and reopens the listener cleanly
running panel/status bar remains truthful
```

These remain the P1.4 local acceptance boundary.

## 9. Work-order consequence

```text
P1.4 decision                 COMPLETE
P1.4 source implementation    COMPLETE
P1.4 non-local compatibility  COMPLETE
P1.4 Blockbench/Codex runtime LOCAL PROOF REQUIRED
P1.5                          WAITING — DO NOT START
```

Do not add more transport abstraction, session compatibility code, SDK migration, SSE machinery, or fake Blockbench globals unless the eventual real local run produces a concrete blocking defect.
