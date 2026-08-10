# Next Action

Updated: 2026-08-10

This is the **single active-task snapshot**. New ChatGPT/Codex sessions read:

`AGENTS.md` → `CONTEXT.md` → this note.

## Active Goal

Stabilize and reduce the BlockIT MCP into a trustworthy **Minecraft Bedrock Entity** MCP before normal feature hardening resumes.

The product decision is explicit:

> Preserve capability that belongs to Minecraft Bedrock Entity. Generic capability inherited from a broader Blockbench MCP does not need to remain merely for compatibility. Removal must be grounded in official Blockbench source so native Bedrock Entity capability is not deleted by mistake.

P0.1–P0.5 are complete for their source/repository boundaries. The active source boundary is now **P1.1 — default Bedrock Entity registration profile**.

## Current Status

`MCP_P0_COMPLETE_BEDROCK_DEFAULT_REGISTRATION_PROFILE_NEXT`

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

Do not delete those merely to reduce registration breadth or implementation cost. `TextureMesh` is distinct from generic `Mesh`.

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

# Completed P0 Stabilization

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

## P0.4 — Engineering gate + retained typecheck

Package/repository gates:

```text
typecheck   → tsc --noEmit
test        → bun test
build       → production build
docs:check  → generated-doc freshness assertion
```

Important retained-package remediation outcomes:

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

P0.4 source-head proof on:

```text
35b142d7a45590399ef035978ed448e3b6f059e2
fix: refine Blockbench Paint runtime event types
```

established:

```text
frozen-lockfile install     PASS
full tsc --noEmit           PASS
focused Bun contract tests  PASS — 4/4, 0 failures
production build            PASS
```

The only failure at that checkpoint was stale generated documentation, owned by P0.5.

## P0.5 — Generated-doc freshness

Primary owners:

```text
mcp/build/docs.ts
mcp/docs/api.json
mcp/docs/index.html
mcp/build/check-docs-freshness.ts
```

Generated documentation was rebuilt through the repository generator rather than hand-editing tool entries.

The generator now normalizes trailing horizontal whitespace and final newline before writing `index.html`, making its checked-in output deterministic for repository freshness checks. No documentation layout, tool schema, registration behavior, or product capability was redesigned by this normalization.

Final generated reference commit:

```text
0842e25fdc9a152be2d47bcc9ec77659219ea1a4
docs: refresh generated MCP reference
```

Generation consistently reports:

```text
69 tools across 12 categories
3 documented prompts
8 resources
```

The generated reference comes from the reduced current source surface: removed Hytale, generic Mesh, Armature, and mesh-only UV source families are not reintroduced; retained Cube/Animation/Texture/Paint/PBR-related ToolSpecs remain part of the current source manifest.

### P0.5 final executable proof

Canonical workflow:

```text
MCP Verify
run: 31367549245
verified commit: 0842e25fdc9a152be2d47bcc9ec77659219ea1a4
```

Final outcome:

```text
frozen-lockfile install     PASS
full tsc --noEmit           PASS
focused Bun contract tests  PASS — 4/4, 0 failures
production build            PASS
generated docs freshness    PASS
fail-closed aggregator      PASS
workflow conclusion         SUCCESS
```

Temporary one-shot documentation refresh/verification workflows used to execute the generator on GitHub runners were removed after proof. The durable repository gate remains `.github/workflows/mcp-verify.yml`.

# Current Work Order

```text
P0.1  loopback + Origin containment              SOURCE COMPLETE / LOCAL PROOF PENDING
P0.2  dangerous default capability containment   SOURCE COMPLETE / LOCAL PROOF PENDING
P0.3  full-schema validation + real annotations  SOURCE COMPLETE / TARGETED REGRESSION PROOF PARTIAL
P0.4  typecheck/tests/root CI                     COMPLETE
P0.5  generated-doc freshness                    COMPLETE

P1.1  default Bedrock Entity registration profile ← ACTIVE NEXT SLICE
P1.2  family gates
P1.3  core-only resolver/mutation/result consolidation
P1.4  transport/session future decision
P1.5  local end-to-end core acceptance

P2.*  evidence-driven cleanup and parked product fixes
```

# Next Step — P1.1 Default Bedrock Entity Registration Profile Only

Do not start P1.2 or later work in the same slice.

## Goal

Make the **default MCP registration surface** match the actual BlockIT product: Minecraft Bedrock Entity, while preserving every capability that is legitimately required by that Entity workflow.

This is a registration/default-surface problem, not permission to delete native Bedrock capability.

## Required approach

1. Inventory the currently registered tools/resources/prompts from source and the now-fresh generated manifest.
2. Classify each remaining family against the official-source Bedrock capability audit and actual BlockIT Entity workflow.
3. Preserve all native/relevant Bedrock Entity capability, including optional native capability already identified by the audit.
4. Remove from the **default registered surface** only capability that is proven generic/non-Entity or legacy fallback.
5. Prefer the smallest existing registration mechanism; do not introduce a broad capability-profile framework unless current source proves it is necessary.
6. `risky_eval` and `from_geo_json` remain disabled.
7. Do not use P1.1 to harden or redesign individual Animation, Paint, Texture, Cube, transport, resolver, or output implementations.
8. Initial and reconstructed-session registration must expose an equivalent default surface.
9. Add/adjust focused registration tests where needed to prove the default list rather than relying on documentation alone.
10. Re-run the full P0 engineering gate after the P1.1 source change.

## Explicit preservation rule

If there is doubt whether a capability belongs to Bedrock Entity, **do not remove or disable it until official Blockbench source/product evidence resolves the doubt**.

## Static acceptance

```text
default registration surface is explicitly Bedrock Entity oriented
all audited native/relevant Bedrock capability remains available
proven non-Entity legacy surface is not default-registered
initial and reconstructed registration remain equivalent
no new broad profile/framework architecture without demonstrated need
```

## Executable acceptance

```text
focused default-registration tests PASS
bun run typecheck               PASS
bun run test                    PASS
bun run build                   PASS
bun run docs:check              PASS
root MCP Verify                 PASS
```

Only after P1.1 is recorded may the active boundary advance to **P1.2 — family gates**.

## Proof Boundary

GitHub Actions/package tests prove source/build/generated-doc/registration contracts that do not require Blockbench globals.

Actual OS listener state, live MCP Inspector behavior, Blockbench runtime behavior, Undo/Redo semantics, playback, export/save/reopen, and end-to-end modelling remain `LOCAL PROOF REQUIRED` where applicable.
