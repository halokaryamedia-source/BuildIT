from pathlib import Path


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected exactly one match, found {count}")
    return text.replace(old, new, 1)


# Durable decision log
path = Path("docs/knowledge/decision-log.md")
text = path.read_text()
marker = "## Current Decisions\n"
if text.count(marker) != 1:
    raise SystemExit("decision-log Current Decisions marker mismatch")
section = r'''
### MCP transport will simplify on the production v1 SDK line before any v2 migration

- **Decision:** `SIMPLIFY ON CURRENT SDK LINE`.
- **Date:** 2026-08-10.
- **Official protocol evidence:** `2025-11-25` remains the current stable MCP revision. `2026-07-28` is still an RC/draft and is not implementation authority yet.
- **Official SDK evidence:** TypeScript SDK v2 remains in development/pre-alpha; v1.x remains the recommended production line. BlockIT currently resolves `@modelcontextprotocol/sdk@1.25.3`.
- **Actual supported client requirement:** BlockIT runtime proof targets Codex local. Current Codex clients support direct Streamable HTTP by URL; inherited `mcp/README.md` examples for Claude/mcp-remote/Cline/Ollama/OpenCode are not product compatibility requirements by themselves.
- **Target topology:** loopback-only direct Streamable HTTP, stateless v1 hosting, JSON response mode, no protocol session ID, no MCP ping/SSE heartbeat/custom session timeout/per-session transport map.
- **Preserve:** `127.0.0.1` binding and invalid-present-Origin rejection before MCP dispatch. HTTP keep-alive may remain only as ordinary connection reuse, not as MCP session/liveness state.
- **Temporary owner retained:** the current raw `node:net` HTTP parsing/dispatch remains until a Blockbench-compatible official HTTP adapter/runtime is locally proven. Do not combine parser replacement with the first stateless conversion.
- **UI consequence:** current panel/status-bar session counts are coupled to `sessionManager`; stateless implementation must remove or replace that session-shaped UI state rather than displaying nonexistent protocol sessions.
- **No auth change:** no OAuth/auth framework is added while the product remains loopback-only. Reconsider auth before any future non-loopback boundary.
- **No v2 change:** do not migrate SDK packages or adopt `2026-07-28` in the same implementation slice.
- **Evidence record:** `docs/knowledge/reviews/mcp-transport-session-decision-2026-08-10.md`.
- **Proof boundary:** this is a source/research decision. Direct Codex↔Blockbench stateless behavior remains `LOCAL PROOF REQUIRED` after the implementation passes non-local gates.
- **Owner:** workspace agent.

'''
text = text.replace(marker, marker + "\n" + section, 1)
path.write_text(text)


# Active next-action snapshot
path = Path("docs/knowledge/next-action.md")
text = path.read_text()
text = replace_once(
    text,
    "P0.1–P0.5 and P1.1–P1.3 are complete for their source/repository boundaries. The active source boundary is now **P1.4 — transport/session simplification decision**.",
    "P0.1–P0.5 and P1.1–P1.3 are complete for their source/repository boundaries. The P1.4 transport/session decision is recorded as **SIMPLIFY ON CURRENT SDK LINE**. The active source boundary is now **P1.4 implementation — stateless v1 Streamable HTTP simplification**.",
    "next-action intro",
)
text = replace_once(
    text,
    "`MCP_P1_CORE_OWNERSHIP_COMPLETE_TRANSPORT_DECISION_NEXT`",
    "`MCP_P1_TRANSPORT_DECISION_COMPLETE_STATELESS_V1_IMPLEMENTATION_NEXT`",
    "next-action status",
)
text = replace_once(
    text,
    "P1.4  transport/session future decision              ← ACTIVE NEXT SLICE\nP1.5  local end-to-end core acceptance",
    "P1.4  transport/session simplification              DECISION COMPLETE / IMPLEMENTATION NEXT\nP1.5  local end-to-end core acceptance",
    "P1 work order",
)

old_marker = "# Next Step — P1.4 Transport / Session Decision Only"
if text.count(old_marker) != 1:
    raise SystemExit("P1.4 decision next-step marker mismatch")
prefix = text.split(old_marker, 1)[0]
completed = r'''# Completed P1.4 Decision — Simplify On Current SDK Line

Decision record:

```text
docs/knowledge/reviews/mcp-transport-session-decision-2026-08-10.md
```

Decision:

```text
SIMPLIFY ON CURRENT SDK LINE
```

Current official evidence checked on 2026-08-10 established:

```text
current stable MCP revision     2025-11-25
2026-07-28 revision             RC / draft, not final
TypeScript SDK v2               development / pre-alpha
production SDK recommendation   v1.x
actual required BlockIT client  Codex local, direct Streamable HTTP
```

The inherited broad client list in `mcp/README.md` is not a compatibility requirement for the BlockIT product. P1.4 implementation targets the actual Codex local path first.

Target transport ownership:

```text
KEEP       loopback binding
KEEP       invalid-present-Origin -> 403 before MCP dispatch
REMOVE     custom TCP keepalive as MCP liveness
REMOVE     socket idle timeout as session lifetime
KEEP MIN   ordinary HTTP keep-alive only if useful
REMOVE     SSE heartbeat from default path
REMOVE     MCP ping
REMOVE     custom inactivity/session timeout
REMOVE     Mcp-Session-Id / protocol session routing
REMOVE     per-session transport map
REMOVE     per-session McpServer reconstruction
KEEP TEMP  current raw node:net HTTP parser/serializer
ADAPT      health/status UI so it does not claim nonexistent sessions
```

No SDK v2 migration, 2026 draft adoption, authentication framework, Bedrock tool work, or broad HTTP-runtime rewrite is authorized by this decision.

# Next Step — P1.4 Stateless v1 Implementation Only

Implement the recorded transport decision **non-local first**. Do not start P1.5 until the implementation has passed repository gates and the required local proof has been run.

## Goal

Replace the current sessionful/layered-liveness Streamable HTTP ownership with the smallest direct-Codex stateless v1 path while preserving loopback/Origin containment and all Bedrock Entity MCP registration behavior.

## Intended implementation shape

```text
HTTP MCP request
↓
existing loopback / Origin / endpoint checks
↓
fresh request-owned McpServer
↓
register canonical enabled tools/resources/prompts
↓
fresh WebStandardStreamableHTTPServerTransport
  sessionIdGenerator: undefined
  enableJsonResponse: true
↓
handle request
↓
close/discard request-owned server + transport
```

## Source scope to audit/change

```text
mcp/server/net.ts
mcp/lib/sessions.ts
mcp/index.ts
mcp/ui/index.ts
mcp/ui/statusBar.ts
mcp/ui/settings.ts
focused transport tests
```

`mcp/lib/sessions.ts` may be retired if no truthful non-session owner remains. Do not preserve it merely for historical client compatibility.

The panel/status bar must not present a durable "connected session" when the transport is stateless. Prefer server-running / recent-request telemetry only if it has a real product use; otherwise remove the session-specific display cleanly rather than inventing another state system.

## Must preserve

```text
host default/bind = 127.0.0.1
present invalid Origin rejected with 403 before MCP handling
normal Bedrock Entity registration truth
P0.2 disabled dangerous tools
P1.1/P1.2 default + extended family gates
P1.3 core identity/result ownership
health/ready only if their returned state remains truthful
```

## Explicit non-goals

```text
no SDK v2 migration
no 2026-07-28 protocol adoption
no auth/OAuth framework
no Bedrock modelling/tool feature work
no Animation/Paint/Texture rewrite
no generic HTTP-framework migration
no custom parser replacement unless the existing parser blocks the stateless implementation
```

Do not upgrade `@modelcontextprotocol/sdk` merely because newer v1 releases exist. If the installed `1.25.3` proves to block the documented stateless pattern, stop and make the dependency update an explicit evidence-backed subdecision rather than silently mixing it into the transport rewrite.

## Non-local acceptance

```text
focused stateless transport tests PASS
no session ID / ping / heartbeat / inactivity ownership remains in default path
typecheck PASS
full Bun tests PASS
production build PASS
generated docs freshness PASS
root MCP Verify PASS
```

## Local proof required before closing P1.4

```text
Blockbench plugin binds loopback
Codex local connects directly by Streamable HTTP URL
initialize succeeds
real tools/list works
repeated requests work without Mcp-Session-Id
read-only tool call works
bounded mutation works
invalid present Origin still returns 403
no unexpected standalone SSE dependency
plugin unload/reload closes server cleanly
UI does not report fake protocol sessions
```

Only after that local proof passes (or records an explicit blocking defect) may P1.4 close and P1.5 full Bedrock Entity end-to-end acceptance begin.
'''
path.write_text(prefix + completed)
