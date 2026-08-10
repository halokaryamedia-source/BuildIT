# Next Action

Updated: 2026-08-10

This is the **single active-task snapshot**. New ChatGPT/Codex sessions read:

`AGENTS.md` → `CONTEXT.md` → this note.

## Active Goal

Stabilize and reduce the BlockIT MCP into a trustworthy **Minecraft Bedrock Entity** MCP before normal feature hardening resumes.

The product decision is explicit:

> Preserve capability that belongs to Minecraft Bedrock Entity. Generic capability inherited from a broader Blockbench MCP does not need to remain merely for compatibility. Removal must be grounded in official Blockbench source so native Bedrock Entity capability is not deleted by mistake.

P0.1–P0.4 are now complete for their source/engineering boundaries. The only failing repository verification gate is generated-document freshness, which is the planned **P0.5** owner.

## Current Status

`MCP_P0_ENGINEERING_GATE_COMPLETE_GENERATED_DOCS_NEXT`

Execution channel: **ChatGPT → GitHub**.  
Live Blockbench/MCP behavior remains local proof where applicable.

## Governing Evidence

Primary audit:

```text
docs/knowledge/reviews/mcp-development-quality-audit.md
```

Ordered stabilization plan:

```text
docs/knowledge/operations/mcp-reduction-stabilization-plan.md
```

Official-source Bedrock capability audit:

```text
docs/knowledge/reviews/bedrock-entity-capability-surface-audit.md
```

Safe reduction execution note:

```text
docs/knowledge/operations/bedrock-entity-reduction-execution.md
```

# Product Boundary

Retained BlockIT MCP target:

```text
Minecraft Bedrock Entity
Geometry: Cube/Cuboid only for BlockIT modelling
Rig: Group hierarchy / Cuboid children
Animation: Group/BoneAnimator
Texture: minimum proven Bedrock Entity outcomes
Execution: local desktop Blockbench service
```

The official Blockbench Bedrock format is broader than BlockIT's Cube-only modelling policy. Native optional Bedrock capabilities must not be confused with generic legacy families.

## Native Bedrock capability that must remain available

Official Blockbench source review established the Bedrock format/codec relevance of:

```text
Cube/Cuboid
Group-as-bone hierarchy
Cube UV / UV rotation / box UV
TextureMesh
Locators
Bounding boxes
Animation / animation controllers
animation sound / particle / timeline effects
Texture
Paint
PBR
cube-face material_instance semantics
History / Undo / Redo
canonical model capture
current-format Bedrock export outcome
```

Do not delete those merely to reduce typecheck or registration breadth. `TextureMesh` is distinct from generic `Mesh`.

## Capability already proved outside the native Bedrock Entity product

Removed rather than type-hardened:

```text
Hytale integration
Generic Mesh MCP family
Armature / ArmatureBone / vertex-weight family
mesh-only MCP UV family
```

Cube UV remains owned by `mcp/server/tools/cubes.ts`.

No TextureMesh, Locator, Animation, Paint, PBR, or material-instance capability was removed by that reduction.

# Completed Foundation Slices

## P0.1 — Local transport containment

Source commit:

```text
49c7440ed0dbb5f58c879db14543817791044e80
fix: contain MCP server to local origins
```

Source establishes loopback binding + local Origin containment. Real listener/Inspector/browser behavior remains `LOCAL PROOF REQUIRED`.

## P0.2 — Dangerous default capability containment

Source commit:

```text
33bd7ab2a9cec674fb2183cb178fa24e1727b4e9
fix: disable dangerous default MCP tools
```

Contract:

```text
risky_eval      enabled=false
from_geo_json   enabled=false
risky_eval      Stable → Experimental
```

No sandbox, replacement importer, or capability-profile framework was introduced.

## P0.3 — Real MCP schema enforcement + annotations

Source commit:

```text
2fec534b0204a33c9b20c536724159018a4b5c38
fix: enforce MCP tool schemas and annotations
```

The complete original Zod schema is retained and parsed before execution for initial and reconstructed-session registration. Supported MCP annotations are passed through both paths.

Focused P0.4 contract tests prove top-level `.refine()` / `.superRefine()` rejection before tool logic and annotation preservation in isolated registration fixtures. Real MCP Inspector behavior remains local proof where applicable.

# Completed Slice — P0.4 Engineering Gate + Retained Typecheck

Primary gate owners:

```text
mcp/package.json
mcp/tsconfig.json
mcp/build/check-docs-freshness.ts
mcp/tests/p0-contracts.test.ts
.github/workflows/mcp-verify.yml
```

Package gates:

```text
typecheck   → tsc --noEmit
test        → bun test
build       → production build
docs:check  → generated-doc freshness assertion
```

The root GitHub workflow installs from the committed Bun lockfile, executes all gates, and fails closed through a final aggregator.

## Bedrock-retained type remediation

The first full typecheck exposed both irrelevant legacy families and valid Bedrock owners. The approved response was:

```text
1. audit official Blockbench Bedrock Entity source;
2. remove only capability proved unrelated;
3. preserve native Bedrock Entity capability;
4. type-fix the retained package against real Blockbench/MCP contracts.
```

Important remediation outcomes include:

```text
blockbench-types pinned/synced to 5.1.0 in package.json + bun.lock
obsolete fastmcp type dependency removed
MCP prompt factory aligned with installed SDK 1.25.3
shared BarItem compatibility localized
Animation kept and aligned with Blockbench AnimationItem/runtime typing
Texture kept; generic Mesh branch removed from apply_texture
Paint kept and aligned with official Painter/runtime selection APIs
PBR/material-instance runtime fields retained through narrow evidence-backed declarations
```

The final retained-source type remediation after the earlier baseline touched only:

```text
mcp/server/tools/animation.ts
mcp/server/tools/paint.ts
mcp/server/tools/texture.ts
mcp/types.d.ts
```

That remediation did not remove the retained Bedrock Animation, Texture, Paint, PBR, or material-instance families.

## P0.4 executable proof

Exact `MCP Verify` run on source head:

```text
35b142d7a45590399ef035978ed448e3b6f059e2
fix: refine Blockbench Paint runtime event types
```

reported:

```text
frozen-lockfile install     PASS
full tsc --noEmit           PASS
focused Bun contract tests  PASS — 4/4, 0 failures
production build            PASS
generated docs freshness    FAIL — api.json + index.html stale
workflow final result       FAIL-CLOSED only because DOCS failed
```

Therefore the P0.4-owned engineering/typecheck blocker is resolved. Do not reopen unrelated feature hardening simply because P0.4 is complete.

The generated documentation failure is not hidden or waived; it is exactly the active P0.5 problem.

# Current Work Order

```text
P0.1  loopback + Origin containment              SOURCE COMPLETE / LOCAL PROOF PENDING
P0.2  dangerous default capability containment   SOURCE COMPLETE / LOCAL PROOF PENDING
P0.3  full-schema validation + real annotations  SOURCE COMPLETE / TARGETED REGRESSION PROOF PARTIAL
P0.4  typecheck/tests/root CI                     COMPLETE — RETAINED PACKAGE TYPECHECK PASS
P0.5  generated-doc freshness                    ← ACTIVE NEXT SLICE

P1.1  default Bedrock Entity registration profile
P1.2  family gates
P1.3  core-only resolver/mutation/result consolidation
P1.4  transport/session future decision
P1.5  local end-to-end core acceptance

P2.*  evidence-driven cleanup and parked product fixes
```

# Next Step — P0.5 Generated-Doc Freshness Only

Do not start P1 work yet.

Primary owner:

```text
mcp/docs/api.json
mcp/docs/index.html
mcp/build/docs.ts
mcp/build/check-docs-freshness.ts
```

## Goal

Bring checked-in generated MCP documentation back into exact agreement with the retained source/tool manifest after P0.2–P0.4 and the Bedrock-only reduction.

## Required behavior

1. Generate docs through the existing documented generator; do not hand-edit generated tool entries.
2. Generated docs must reflect the current **69 tools / 3 documented prompts / 8 resources** source manifest unless generation itself proves the count has legitimately changed.
3. Removed Hytale, generic Mesh, Armature, and mesh-only UV entries must not reappear.
4. `risky_eval` and `from_geo_json` metadata must reflect their current disabled/default-containment state as represented by the generator contract.
5. Bedrock-retained Animation, Cube, Texture, Paint, PBR/material-instance documentation must remain present where their source ToolSpecs/resources exist.
6. `bun run docs:check` must pass after regeneration.
7. Re-run typecheck, focused tests, and production build after generated output is committed so P0.5 does not regress P0.4.
8. Do not use P0.5 to redesign documentation layout, tool schemas, registration profiles, or product capability.

## Static acceptance

```text
api.json regenerated from current source
index.html regenerated from current source
no removed non-Bedrock family resurrected
no retained Bedrock family silently lost
generated files contain no hand-maintained divergence
```

## Executable acceptance

```text
bun install --frozen-lockfile   PASS
bun run typecheck               PASS
bun run test                    PASS
bun run build                   PASS
bun run docs:check              PASS
root MCP Verify                 PASS
```

Only after that proof may the active boundary advance to **P1.1 — default Bedrock Entity registration profile**.

## Proof Boundary

GitHub Actions/package tests prove source/build/generated-doc consistency that does not require Blockbench globals.

Actual OS listener state, live MCP Inspector behavior, Blockbench runtime behavior, Undo/Redo semantics, playback, export/save/reopen, and end-to-end modelling remain `LOCAL PROOF REQUIRED` where applicable.
