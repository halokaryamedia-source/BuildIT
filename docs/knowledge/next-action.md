# Next Action

Updated: 2026-08-14

## Status

```text
PRELOCAL_USAGE_OPTIMIZATION_READY
```

Working branch: **`Local` only**. `NO LOCAL RUN ACTIVE`.

Retained state: **P0–P7 + REF + PRO-1, PRO-2, PRO-3–PRO-8**. No MCP source capability was added or removed.

Pre-local usage discipline is now encoded in current instructions/tests: repository regression preflight + coherent patching, known/coherent `place_cube(elements=[...])` batching, affected-view-first correction verification, and a concrete Efficiency Check. This is instruction/test evidence only.

Current source contract is static-verified. Installed plugin freshness, runtime/model behavior, efficiency impact, and persistence remain **LOCAL PROOF REQUIRED**.

**Do not claim live Blockbench/model-quality improvement without actual runtime proof.**

## Local Handoff

Single procedure owner: `docs/knowledge/operations/local-acceptance-runbook.md`.

The local test is deliberately simple:

```text
current Local
→ clean tree + exact HEAD
→ static gate + fresh build
→ record dist/mcp.js SHA-256
→ load current local BlockIT build
→ restart Blockbench + reconnect MCP
→ verify endpoint + 62-tool default surface
→ verify:stateless-local
→ TEST 1 — MCP / CORE MECHANICS
→ persistence / export
→ TEST 2 — REFERENCE MODEL (ELEPHANT)
→ efficiency check
```

**Test 1** proves the plugin/MCP mechanics work. **Test 2** proves MCP can build a Minecraft/Blockbench elephant from the approved reference, including Geometry + Texture judgement.

Package version alone is not freshness proof.

The approved elephant reference may be used for Test 2 only when the actual image is visible to the local modelling context. Five previews are the future default, not a reason to regenerate an already approved usable reference.

```text
MINOR → one canonical Minecraft interpretation → continue
MATERIAL → CONFLICTING / BLOCKED
```

Reference generation remains separately gated:

```text
WAIT FOR FRESH EXPLICIT USER GENERATION COMMAND
```

## Next Step

```text
LOCAL MACHINE
→ execute runbook sections 3–4
→ prove exact HEAD + artifact hash + current BlockIT load
→ begin TEST 1 — MCP / CORE MECHANICS
```

Do not change source unless a reproducible local failure identifies a concrete owner. No speculative cleanup, new tools, profiles, routers, or compatibility layers.
