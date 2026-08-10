# MCP Transport / Session Decision — 2026-08-10

Status: **DECIDED — SIMPLIFY ON CURRENT SDK LINE**

This review is the P1.4 decision record. It does **not** implement the transport rewrite.

## Decision

BlockIT will remain on the production-supported **MCP TypeScript SDK v1 line** for the next transport change and simplify its local Streamable HTTP architecture.

Do **not** migrate BlockIT to SDK v2 or the `2026-07-28` protocol revision yet.

Target implementation direction:

```text
Codex local client
↓
direct Streamable HTTP
↓
loopback-only Blockbench MCP
↓
stateless MCP transport / JSON response path
↓
Bedrock Entity tools/resources/prompts
```

The intended first implementation removes protocol-session/liveness machinery that is not required by the actual BlockIT client path while preserving the current loopback + Origin security boundary and all Bedrock Entity capability.

## Official evidence checked on 2026-08-10

### Protocol status

Official MCP versioning still identifies **2025-11-25** as the current protocol revision.

The official protocol release repository marks `2026-07-28-RC` as a release candidate whose specification is still draft/not final. The current stable release remains `2025-11-25`.

Official sources:

- https://modelcontextprotocol.io/docs/learn/versioning
- https://github.com/modelcontextprotocol/modelcontextprotocol/releases
- https://modelcontextprotocol.io/specification/2025-11-25/basic/transports
- https://modelcontextprotocol.io/specification/draft/changelog

Important direction signal: the draft revision removes protocol-level sessions and the `Mcp-Session-Id` header. That draft is **not** implementation authority yet, but it reinforces that BlockIT should not add more session machinery while the current product does not require it.

### TypeScript SDK status

The official TypeScript SDK repository still describes v2 as in development/pre-alpha and recommends v1.x for production until stable v2 ships.

The official v2 migration guidance states that published v1 1.29.x and v2 share support for the current 2025-era protocol set, with `2025-11-25` as the newest common revision. Support for `2026-07-28` is a separate explicit v2 opt-in while that revision remains draft.

Official sources:

- https://github.com/modelcontextprotocol/typescript-sdk
- https://github.com/modelcontextprotocol/typescript-sdk/blob/main/docs/migration/upgrade-to-v2.md
- https://github.com/modelcontextprotocol/typescript-sdk/blob/main/docs/migration/support-2026-07-28.md

BlockIT currently declares `@modelcontextprotocol/sdk` `^1.25.3` and the committed Bun lock resolves exact `1.25.3`. P1.4 does not bundle an SDK dependency upgrade with the architecture decision. A v1 patch/minor update can be evaluated separately if the implementation needs a transport fix and must pass the existing package gates plus local Blockbench proof.

### Actual supported BlockIT client requirement

The repository development model identifies **Codex local** as the runtime proof/execution channel. The inherited `mcp/README.md` still lists a broad set of generic clients, but those inherited compatibility examples are not the BlockIT product requirement by themselves.

Current official Codex documentation states that local Codex clients — ChatGPT desktop app, Codex CLI, and the IDE extension — can connect directly to MCP servers and support **Streamable HTTP** servers by URL. Codex can connect without authentication when no credential source resolves.

Official source:

- https://developers.openai.com/codex/extend/mcp

Therefore P1.4 support scope is:

```text
REQUIRED
Codex local host using direct Streamable HTTP

NOT A CURRENT COMPATIBILITY REQUIREMENT
mcp-remote-specific behavior
Claude Desktop-specific transport workarounds
Cline/Ollama/OpenCode/other inherited README clients
legacy HTTP+SSE transport
```

Those other clients may be reintroduced as requirements only through an explicit future product decision and compatibility proof.

## Current Local architecture

`mcp/server/net.ts` currently owns:

```text
raw node:net HTTP parsing/serialization
loopback host binding
Origin validation
TCP keepalive
socket idle timeout
HTTP keep-alive advertisement
SSE comment heartbeat
MCP server ping
Mcp-Session-Id routing
per-session transport map
per-session McpServer reconstruction
health/ready endpoints
WebStandardStreamableHTTPServerTransport dispatch
```

`mcp/lib/sessions.ts` additionally owns:

```text
30-minute inactivity timeout
30-second ping interval
failed-ping counters
client/session metadata
transport-removal callback
UI session subscriptions
```

The UI panel and status bar consume `sessionManager` as their current "connected client" signal. A stateless transport implementation therefore cannot simply delete `sessions.ts`; it must also remove or replace session-shaped UI semantics so the UI does not display a protocol session that no longer exists.

## Why simplify instead of keep current

The current session/liveness stack was inherited to support a broad client surface, including clients that may not hold an SSE GET stream. The source itself notes that failed MCP pings are informational because clients such as `mcp-remote` may never receive them.

For the actual BlockIT path:

- service is local loopback-only;
- actual required client can use direct Streamable HTTP;
- current tool calls use `enableJsonResponse: true`;
- no BlockIT requirement has demonstrated resumability;
- no BlockIT requirement has demonstrated standalone server-to-client SSE notifications/requests;
- protocol session IDs are optional in the current 2025-11-25 transport specification.

Maintaining multiple liveness/session layers therefore has more ownership cost than demonstrated product value.

## Why not migrate to v2 now

A v2 migration would combine a major SDK package split, import/API migration, changed transport/runtime adapters, and a not-yet-final protocol direction with a transport simplification whose actual product requirement can already be satisfied on v1.

That would violate the stabilization rule to choose the smallest supported change and would make local Blockbench failures harder to attribute.

## Layer classification

| Existing layer | P1.4 target | Reason |
|---|---|---|
| Loopback bind (`127.0.0.1`) | **KEEP** | Current local product/security boundary. |
| Present-Origin validation / 403 | **KEEP** | Mandatory Streamable HTTP DNS-rebinding protection. |
| TCP keepalive probes | **REMOVE as MCP liveness layer** | Loopback request/response path has no demonstrated NAT/proxy liveness requirement. Do not couple MCP correctness to TCP probes. |
| Raw socket idle timeout | **REMOVE from session/liveness stack** | Stateless requests do not need a connection lifetime to represent client lifetime. Any later bounded HTTP-request timeout is a separate parser/resource-safety concern. |
| HTTP keep-alive | **KEEP MINIMAL / OPTIONAL** | Connection reuse may remain normal HTTP behavior, but it must not carry MCP session semantics or custom liveness ownership. |
| SSE heartbeat | **REMOVE from default path** | Default BlockIT path targets JSON responses and does not require a standalone SSE stream. GET may return the protocol-supported 405 behavior when no standalone SSE is offered. |
| MCP ping | **REMOVE** | No protocol session/liveness state is required for the direct request/response path. |
| Custom inactivity timeout | **REMOVE** | No protocol session exists to reap in the target stateless topology. |
| `Mcp-Session-Id` | **REMOVE / disable** | Current protocol makes server-assigned sessions optional; target uses stateless v1 hosting. |
| Per-session transport map | **REMOVE** | No protocol session IDs in target topology. |
| Per-session McpServer reconstruction | **REMOVE** | Replace with the established stateless per-request server/transport factory pattern. |
| Custom HTTP parsing/dispatch | **KEEP TEMPORARILY, then narrow** | Current Blockbench plugin obtains a native `net` module and already proves this host path. Do not replace the HTTP runtime owner in the same change until a Blockbench-compatible official adapter/runtime is locally proven. |
| Health/ready endpoints | **KEEP only if truthful** | Remove session-count/config claims when sessions are removed; readiness may remain a server-liveness signal. |
| UI connected-session list/count | **REMOVE or replace with non-session telemetry** | Stateless HTTP has no durable protocol session to display. UI must not present false session semantics. |

## Intended stateless v1 shape

The official SDK documents stateless Streamable HTTP using `sessionIdGenerator: undefined`; JSON response mode is available with `enableJsonResponse: true`. The established stateless idiom uses a fresh server/transport factory per request rather than a `Map<Mcp-Session-Id, transport>`.

For BlockIT, the implementation candidate is therefore:

```text
incoming MCP HTTP request
↓
Origin + endpoint/basic HTTP validation
↓
fresh McpServer
↓
register canonical enabled tools/resources/prompts
↓
fresh WebStandardStreamableHTTPServerTransport
  sessionIdGenerator: undefined
  enableJsonResponse: true
↓
handleRequest
↓
close/discard request-owned MCP server + transport
```

This is an **implementation candidate**, not runtime proof. Exact behavior against Codex local and Blockbench must be proven before P1.4 implementation is considered complete.

## Security boundary

No OAuth/authentication framework is added in this slice.

Reasons:

- BlockIT remains explicitly loopback-only;
- invalid present Origin remains rejected before MCP handling;
- current Codex clients can connect to a Streamable HTTP MCP URL without authentication when no credential source resolves;
- there is no approved non-loopback deployment requirement.

If BlockIT later becomes remotely reachable, authentication must be reconsidered before that network boundary changes.

## P1.4 implementation boundary

The next source slice may change only the transport/session ownership required to realize this decision:

```text
mcp/server/net.ts
mcp/lib/sessions.ts          remove/retire if no longer needed
mcp/index.ts                 remove session/heartbeat configuration wiring
mcp/ui/index.ts              remove/replace session-shaped client state
mcp/ui/statusBar.ts          remove/replace session-shaped connection state
mcp/ui/settings.ts           remove obsolete session/heartbeat settings if unused
focused transport tests
```

Do not bundle:

```text
SDK v2 migration
2026-07-28 protocol adoption
Bedrock modelling/tool changes
Animation/Paint/Texture changes
authentication/OAuth
broad UI redesign
custom HTTP parser replacement unless required by proved Blockbench runtime evidence
```

## Required proof after implementation

Non-local first:

```text
typecheck
focused transport contract tests
full Bun tests
production build
generated docs freshness
root MCP Verify
```

Then local proof:

```text
Blockbench plugin starts on loopback
Codex local connects directly by Streamable HTTP URL
initialize succeeds
real tools/list reflects Bedrock profile
at least one read-only tool call succeeds
at least one bounded mutation succeeds
repeated independent requests work without Mcp-Session-Id
no unexpected standalone SSE dependency
invalid present Origin still returns 403
plugin unload/reload closes server cleanly
UI does not claim nonexistent protocol sessions
```

Only after that proof should P1.4 be closed and P1.5 full Bedrock workflow acceptance begin.

## Implemented non-local source slice

Verified source commit:

```text
775a104a41fc703d6424409c8f71c862727548ae
refactor: simplify MCP transport to stateless v1
```

The implementation realizes the recorded v1 stateless decision without an SDK/package upgrade:

```text
mcp/server/net.ts
  fresh request-owned McpServer
  canonical tools/resources/prompts registered per request
  WebStandardStreamableHTTPServerTransport
    sessionIdGenerator: undefined
    enableJsonResponse: true
  GET/DELETE default endpoint -> 405 (no standalone SSE/session termination)
  loopback + Origin rejection retained
  raw HTTP parser retained
  ordinary HTTP/1.1 connection reuse retained without MCP session semantics
  health output reports stateless/json mode, not session counts

mcp/lib/sessions.ts
  removed

mcp/index.ts
  session transport map/timer configuration removed
  plugin lifecycle owns only the HTTP server

mcp/ui/index.ts + mcp/ui/statusBar.ts + mcp/ui/panel.html
  protocol-session list/count semantics removed
  UI identifies transport as Streamable HTTP (stateless)
  status bar no longer fabricates connected-client state

mcp/ui/settings.ts
  obsolete session-timeout and SSE-heartbeat settings removed
```

The transport parser also serializes request processing per raw socket so buffered HTTP requests are not handled concurrently by overlapping `data` callbacks. This is HTTP parser correctness inside the retained raw-net owner; it does not create protocol session state.

Focused P1.4 contracts assert:

```text
stateless transport options are present
session ID / ping / heartbeat / inactivity ownership is absent
standalone SSE and session DELETE are not offered
health output contains no session state
plugin lifecycle contains no session transport ownership
UI contains no durable session count/list
Origin guard remains before stateless MCP dispatch
```

Canonical root verification:

```text
MCP Verify
run: 31374646462
verified head: 775a104a41fc703d6424409c8f71c862727548ae
```

Result:

```text
frozen-lockfile install     PASS
full tsc --noEmit           PASS
Bun contract tests          PASS — 26/26, 0 failures, 148 expect() calls
production build            PASS
generated docs freshness    PASS
fail-closed aggregator      PASS
workflow conclusion         SUCCESS
```

The committed package still resolves `@modelcontextprotocol/sdk@1.25.3`; non-local typecheck/test/build evidence did not require an SDK upgrade.

### Remaining proof boundary

P1.4 is **not complete yet**. The source/repository implementation is complete, but the following are still `LOCAL PROOF REQUIRED` in the real Blockbench desktop + Codex local environment:

```text
loopback listener actually binds
Codex direct Streamable HTTP initialize
real tools/list
repeated requests without Mcp-Session-Id
read-only tool call
bounded mutation
invalid present Origin -> actual 403
no unexpected standalone SSE dependency
plugin unload/reload
UI truthfulness in the running plugin
```

Do not start P1.5 until that focused P1.4 local transport proof passes or records a concrete blocking defect.

## Non-local compatibility follow-up

The strongest non-local compatibility evidence is recorded separately at:

```text
docs/knowledge/reviews/mcp-p1-4-nonlocal-compatibility-proof-2026-08-10.md
```

It records the pinned TypeScript SDK stateless example, current Codex direct Streamable HTTP path, exact `rmcp-v3.0.0` stateless behavior, Codex's current `2025-06-18` initialization revision, pinned-SDK executable request sequencing, raw `node:net` TCP integration, canonical 32/32 test proof, and the prepared local smoke command.

This follow-up does **not** change the decision or proof boundary: P1.4 remains source/non-local complete with real Blockbench + Codex runtime proof still required before P1.5.
