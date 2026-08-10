from pathlib import Path


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected exactly one match, found {count}")
    return text.replace(old, new, 1)


# Append implementation evidence to the P1.4 decision review.
path = Path("docs/knowledge/reviews/mcp-transport-session-decision-2026-08-10.md")
text = path.read_text()
section = r'''

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
'''
if "## Implemented non-local source slice" in text:
    raise SystemExit("P1.4 implementation section already recorded")
path.write_text(text.rstrip() + section + "\n")


# Update the single active-task snapshot without advancing to P1.5.
path = Path("docs/knowledge/next-action.md")
text = path.read_text()
text = replace_once(
    text,
    "P0.1–P0.5 and P1.1–P1.3 are complete for their source/repository boundaries. The P1.4 transport/session decision is recorded as **SIMPLIFY ON CURRENT SDK LINE**. The active source boundary is now **P1.4 implementation — stateless v1 Streamable HTTP simplification**.",
    "P0.1–P0.5 and P1.1–P1.3 are complete for their source/repository boundaries. P1.4 decision + stateless-v1 source implementation are complete and verified non-locally. The active boundary is now **P1.4 local transport proof only**; do not start P1.5 yet.",
    "next-action intro",
)
text = replace_once(
    text,
    "`MCP_P1_TRANSPORT_DECISION_COMPLETE_STATELESS_V1_IMPLEMENTATION_NEXT`",
    "`MCP_P1_STATELESS_V1_SOURCE_COMPLETE_LOCAL_PROOF_REQUIRED`",
    "next-action status",
)
text = replace_once(
    text,
    "P1.4  transport/session simplification              DECISION COMPLETE / IMPLEMENTATION NEXT\nP1.5  local end-to-end core acceptance",
    "P1.4  transport/session simplification              SOURCE COMPLETE / LOCAL PROOF REQUIRED\nP1.5  local end-to-end core acceptance                  WAITING — DO NOT START YET",
    "P1 work order",
)

old_marker = "# Next Step — P1.4 Stateless v1 Implementation Only"
if text.count(old_marker) != 1:
    raise SystemExit("P1.4 implementation next-step marker mismatch")
prefix = text.split(old_marker, 1)[0]
next_section = r'''# Completed P1.4 Source — Stateless v1 Streamable HTTP

Verified source commit:

```text
775a104a41fc703d6424409c8f71c862727548ae
refactor: simplify MCP transport to stateless v1
```

Implemented repository contract:

```text
request-owned McpServer + WebStandardStreamableHTTPServerTransport
sessionIdGenerator: undefined
enableJsonResponse: true
no Mcp-Session-Id routing
no per-session transport/server map
no sessionManager
no MCP ping
no SSE heartbeat
no custom inactivity/session timeout
GET default MCP endpoint -> 405 (no standalone SSE)
DELETE default MCP endpoint -> 405 (no protocol sessions)
loopback + present-Origin containment retained
raw node:net HTTP owner retained
ordinary HTTP keep-alive remains independent from MCP state
session-shaped UI/settings removed
```

Canonical non-local proof:

```text
MCP Verify
run: 31374646462
verified source: 775a104a41fc703d6424409c8f71c862727548ae

install      PASS
typecheck    PASS
tests        PASS — 26/26, 148 expect() calls
build        PASS
docs:check   PASS
aggregator   PASS
```

No SDK/package upgrade was required. `@modelcontextprotocol/sdk@1.25.3` remains the committed resolved SDK.

# Next Step — P1.4 Local Stateless Transport Proof Only

Do not start P1.5 yet.

Use the real Blockbench desktop plugin and the actual Codex local client. This is verification, not a source redesign unless the real run exposes a concrete defect.

Required proof sequence:

```text
1. load/reload the current Local plugin build
2. prove the OS listener is bound only to 127.0.0.1 on configured port
3. connect Codex local directly to http://127.0.0.1:<port>/<endpoint>
4. initialize successfully
5. inspect real tools/list and confirm Bedrock default profile
6. issue repeated independent requests with no server-issued Mcp-Session-Id
7. execute at least one read-only MCP tool
8. execute at least one bounded core mutation
9. send a request with an invalid present Origin and record actual HTTP 403
10. confirm Codex does not require a standalone GET/SSE stream for this path
11. unload/reload plugin and confirm the listener closes/reopens cleanly
12. inspect the running MCP panel/status bar and confirm it does not report fake protocol sessions
```

Record:

```text
Blockbench version
Codex client surface/version if visible
configured URL
initialize result
real tools/list result
read-only call used/result
mutation call used/result
whether any Mcp-Session-Id was issued/required
GET/SSE behavior observed
Origin 403 evidence
unload/reload result
UI result
actual defects
```

If this focused transport proof passes, mark P1.4 complete and then begin P1.5 full Bedrock Entity create→observe→correct→texture→animate→history/export acceptance. If it fails, fix only the evidenced P1.4 blocker before advancing.
'''
path.write_text(prefix + next_section)
