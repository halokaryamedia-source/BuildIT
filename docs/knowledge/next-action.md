# Next Action

Updated: 2026-08-10

This is the **single active-task snapshot**. New ChatGPT/Codex sessions read:

`AGENTS.md` → `CONTEXT.md` → this note.

## Active Goal

Reduce the stabilized BlockIT MCP into a trustworthy **Minecraft Bedrock Entity** MCP while preserving every capability that genuinely belongs to Bedrock Entity.

The product decision is explicit:

> Preserve capability that belongs to Minecraft Bedrock Entity. Generic capability inherited from a broader Blockbench MCP does not need to remain merely for compatibility. Removal must be grounded in official Blockbench source so native Bedrock Entity capability is not deleted by mistake.

P0.1–P0.5 and P1.1 are complete for their source/repository boundaries. The active source boundary is now **P1.2 — family gates**.

## Current Status

`MCP_P1_DEFAULT_BEDROCK_PROFILE_COMPLETE_FAMILY_GATES_NEXT`

Execution channel: **ChatGPT → GitHub**.  
Working branch: **`Local` only**.  
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
Texture/Paint/PBR: preserve all proven Bedrock Entity capability
Observation: exact authored state + deterministic rendered views
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

P1 registration gating is an **exposure decision**, not permission to delete native Bedrock capability. If a native/optional Bedrock capability is later removed from the smallest default list, it must remain available through an intentional Bedrock-capable path unless a newer product/source audit explicitly approves removal.

## Capability already proved outside the native Bedrock Entity product

Removed rather than type-hardened:

```text
Hytale integration
Generic Mesh MCP family
Armature / ArmatureBone / vertex-weight family
generic-Mesh-only MCP UV family
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

Focused contract tests prove top-level `.refine()` / `.superRefine()` rejection before tool logic and annotation preservation in isolated registration fixtures. Real MCP Inspector behavior remains local proof where applicable.

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

## P0.5 — Generated-doc freshness

Generated documentation was rebuilt through the repository generator rather than hand-editing tool entries.

The generator normalizes trailing horizontal whitespace and final newline before writing `index.html`, making its checked-in output deterministic for repository freshness checks.

Final generated reference recorded by the completed P0 slice:

```text
0842e25fdc9a152be2d47bcc9ec77659219ea1a4
docs: refresh generated MCP reference
```

Generation reports:

```text
69 tools across 12 categories
3 documented prompts
8 resources
```

Canonical P0.5 verification recorded by the prior slice:

```text
MCP Verify
run: 31367549245
```

with install/typecheck/tests/build/docs freshness/fail-closed aggregator all passing.

# Completed P1.1 — Default Bedrock Entity Registration Profile

P1.1 intentionally implemented the **smallest family-level profile mechanism**, not a dynamic ACL, permission engine, role model, or policy framework.

## Source commits

```text
b54e5fd31f3ee153d595bacf55116cafd573de33
feat: define Bedrock Entity MCP registration profile

447792b82a7833e5fda29edcdbd48918238d90c9
feat: apply Bedrock Entity MCP registration profile

68b09f759e8edbfc071cc83ad61a732e0a5bed47
feat: keep developer prompts out of Bedrock default

97a29e24a5446016e0ce73b790c2274e7be16d3f
test: lock Bedrock Entity default registration profile
```

Exact P1.1 source diff from the pre-slice head modifies only:

```text
mcp/lib/registrationProfile.ts       added
mcp/server/tools.ts                  registration-root profile selection
mcp/server/prompts.ts                developer/eval prompts disabled by default
mcp/tests/p1-registration-profile.test.ts  added
```

No Animation, Cube, Texture, Paint, PBR, material-instance, history, camera, export, or project implementation file was removed or modified by P1.1.

## Default registration profile

Default profile name:

```text
bedrock_entity
```

Default registered families:

```text
animation
animation_inspection
camera
cubes
elements
element_inspection
export
history
material_instances
paint
project
textures
validator_resources
```

This intentionally keeps the audited Bedrock/native families available in the normal profile, including:

```text
Animation
Paint
PBR/Texture
cube-face material_instance operations
history/recoverability
canonical camera/observation
Bedrock export outcome
```

## Source-preserved generic fallback families

Not invoked by the default profile:

```text
import
ui
```

They remain source-compiled under the small `extended` profile definition for later explicit family-gate work. P1.1 does **not** introduce a user-facing extended-profile setting yet; that belongs to the P1.2 family-gate decision.

P0.2 containment remains authoritative if those families are ever explicitly invoked:

```text
from_geo_json  enabled=false
risky_eval     enabled=false
```

Therefore the extended family definition does not silently re-enable either dangerous tool.

## Prompt default surface

Default enabled prompt:

```text
model_creation_strategy
```

Developer/debug prompts are source-preserved but disabled from normal registration:

```text
blockbench_native_apis
blockbench_code_eval_safety
```

This is registration truth through `createPrompt(..., enabled=false)`, not a documentation-only filter.

## Registration equivalence

Initial startup invokes only the families returned by:

```text
getRegistrationFamilies(DEFAULT_MCP_REGISTRATION_PROFILE)
```

The resulting enabled tool definitions remain the canonical input to `registerToolsOnServer()` for reconstructed-session servers. No separate reconstructed-session profile list was introduced, avoiding divergent registration ownership.

## P1.1 executable proof

Root workflow:

```text
MCP Verify
run: 31368270648
verified source head: 97a29e24a5446016e0ce73b790c2274e7be16d3f
```

Result:

```text
frozen-lockfile install     PASS
full tsc --noEmit           PASS
Bun contract tests          PASS — 8/8, 0 failures, 59 expect() calls
production build            PASS
generated docs freshness    PASS
fail-closed aggregator      PASS
workflow conclusion         SUCCESS
```

P1-specific tests prove:

```text
default profile is bedrock_entity
audited Bedrock families remain in default profile
import/ui are absent from default profile
extended profile adds exactly import + ui
registration root consumes the explicit default profile
developer/eval prompts are not default registered
```

# Current Work Order

```text
P0.1  loopback + Origin containment              SOURCE COMPLETE / LOCAL PROOF PENDING
P0.2  dangerous default capability containment   SOURCE COMPLETE / LOCAL PROOF PENDING
P0.3  full-schema validation + real annotations  SOURCE COMPLETE / TARGETED REGRESSION PROOF PARTIAL
P0.4  typecheck/tests/root CI                     COMPLETE
P0.5  generated-doc freshness                    COMPLETE

P1.1  default Bedrock Entity registration profile COMPLETE
P1.2  family gates                               ← ACTIVE NEXT SLICE
P1.3  core-only resolver/mutation/result consolidation
P1.4  transport/session future decision
P1.5  local end-to-end core acceptance

P2.*  evidence-driven cleanup and parked product fixes
```

# Next Step — P1.2 Family Gates Only

Do not start P1.3 or later work in the same slice.

## Goal

Turn the P1.1 registration distinction into explicit, reviewable **family gates** without creating a broad capability-policy framework and without deleting native Bedrock Entity capability.

## Required approach

1. Audit the existing P1.1 `bedrock_entity` + `extended` family split before adding any new switch.
2. Keep family-level ownership; do not introduce per-tool ACLs, role systems, policy DSLs, or dynamic permission engines.
3. Define how a non-default family becomes explicitly available when there is a real use case, using the smallest existing configuration mechanism.
4. `import` and generic `ui` are the currently proven generic fallback families; they must remain non-default.
5. `risky_eval` and `from_geo_json` remain individually disabled even when their containing family is opted in unless a separate future review explicitly changes that decision.
6. Do **not** treat all optional Bedrock functionality as legacy merely because it is not needed in every workflow.
7. Preserve source and availability for native/relevant Bedrock capability, especially:

```text
TextureMesh
Locators
Bounding boxes
Paint
PBR
cube-face material_instance
Animation effects/controllers
```

8. Re-audit any candidate family before gating it away from the normal Entity profile. If there is doubt, keep it available until official-source/product evidence resolves the doubt.
9. Initial and reconstructed-session registration must continue to derive from one registration truth.
10. Add focused gate tests and rerun the complete MCP Verify workflow.

## Important non-goal

P1.2 is **not** a tool-count reduction contest. A smaller default list is a consequence of product scope, not the objective itself.

Do not use P1.2 to:

```text
rewrite Animation
rewrite Paint/Texture/PBR
redesign export
refactor all resolvers
migrate MCP protocol/SDK
add authentication
resume parked feature work
```

## Static acceptance

```text
family gates are explicit and small
bedrock_entity remains the default
generic import/UI fallback requires explicit opt-in
risky_eval/from_geo_json remain disabled
native/relevant Bedrock capability remains available
one registration truth feeds initial + reconstructed sessions
no ACL/policy framework introduced
```

## Executable acceptance

```text
focused family-gate tests PASS
bun run typecheck               PASS
bun run test                    PASS
bun run build                   PASS
bun run docs:check              PASS
root MCP Verify                 PASS
```

Only after P1.2 is recorded may the active boundary advance to **P1.3 — core-only resolver/mutation/result consolidation**.

## Proof Boundary

GitHub Actions/package tests prove source/build/generated-doc/registration contracts that do not require Blockbench globals.

Actual OS listener state, live MCP Inspector behavior, Blockbench runtime behavior, Undo/Redo semantics, playback, export/save/reopen, optional-family opt-in behavior in the real plugin UI, and end-to-end modelling remain `LOCAL PROOF REQUIRED` where applicable.
