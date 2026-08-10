# Next Action

Updated: 2026-08-10

This is the **single active-task snapshot**. New ChatGPT/Codex sessions read:

`AGENTS.md` → `CONTEXT.md` → this note.

## Active Goal

Reduce the stabilized BlockIT MCP into a trustworthy **Minecraft Bedrock Entity** MCP while preserving every capability that genuinely belongs to Bedrock Entity.

The product decision is explicit:

> Preserve capability that belongs to Minecraft Bedrock Entity. Generic capability inherited from a broader Blockbench MCP does not need to remain merely for compatibility. Removal must be grounded in official Blockbench source so native Bedrock Entity capability is not deleted by mistake.

P0.1–P0.5 and P1.1–P1.3 are complete for their source/repository boundaries. The active source boundary is now **P1.4 — transport/session simplification decision**.

## Current Status

`MCP_P1_CORE_OWNERSHIP_COMPLETE_TRANSPORT_DECISION_NEXT`

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

# Completed P1.2 — Explicit Family Gates

P1.2 converts the P1.1 source-preserved `extended` distinction into a real opt-in without introducing an ACL, role system, policy DSL, or dynamic permission engine.

## Source commits

```text
b126a9912a5b9c13f9ba8300de5a650c4ac7ad79
feat: add explicit MCP family gates

89c8939061e48f4ed6b6318d79d5bf6ff94c29d3
test: align registration profile contract with family gates
```

## Gate contract

The existing Blockbench `Setting` mechanism now owns one small opt-in:

```text
mcp_extended_families_enabled
```

Contract:

```text
default value                         false
literal boolean true                  selects extended profile
missing/false/string-like values      remain bedrock_entity
extended adds                         import + ui only
bedrock_entity families               unchanged
```

`registerMcpProfile()` tracks already-registered families and is idempotent per family. The default Bedrock Entity profile is still registered at module load; after settings initialize, an explicit extended opt-in adds only the missing fallback families before network startup.

The reconstructed-session path still consumes the same canonical `tools.enabled` / stored tool-definition truth created by those family registration functions. No second reconstructed-session profile table was introduced.

P0.2 remains authoritative inside the optional fallback families:

```text
from_geo_json  enabled=false
risky_eval     enabled=false
```

Therefore enabling the extended families does not expose either dangerous tool.

No Animation, Paint, Texture, PBR, material-instance, Cube, history, export, or project implementation file was changed by P1.2. Native/relevant Bedrock capability remains in the normal `bedrock_entity` family set.

## P1.2 focused proof

The added family-gate tests prove:

```text
extended families require explicit boolean opt-in
extended adds exactly import + ui
setting defaults off and is read before server startup
profile registration is idempotent by family
dangerous tools remain disabled inside opted-in fallback families
setting identifier has one canonical owner
```

Canonical root workflow:

```text
MCP Verify
run: 31369553909
verified head: 89c8939061e48f4ed6b6318d79d5bf6ff94c29d3
```

Result:

```text
frozen-lockfile install     PASS
full tsc --noEmit           PASS
Bun contract tests          PASS — 14/14, 0 failures, 82 expect() calls
production build            PASS
generated docs freshness    PASS
fail-closed aggregator      PASS
workflow conclusion         SUCCESS
```

The first P1.2 run correctly failed closed because one P1.1 source-reading test asserted the previous loop syntax rather than the registration invariant. The follow-up test-only commit updated that assertion to the new idempotent registrar contract; no runtime behavior was weakened to make the test pass.

Actual Blockbench setting persistence, plugin reload behavior, and real `tools/list` differences after opting into extended families remain `LOCAL PROOF REQUIRED`.

# Completed P1.3 — Bedrock Core Identity / Result Ownership

P1.3 consolidated only duplicated identity and continuation-result ownership inside the surviving Bedrock Entity core. It did not globally refactor gated legacy families and did not remove or gate any native Bedrock capability.

## Verified source commit

```text
56967694c2f0a561d956c8e6e7eafa49f5463209
refactor: consolidate Bedrock core identity ownership
```

Primary source owners changed:

```text
mcp/lib/coreIdentity.ts                 added
mcp/lib/util.ts
mcp/server/tools/cubes.ts
mcp/server/tools/element.ts
mcp/server/tools/texture.ts
mcp/server/tools/animation.ts
mcp/tests/p1-core-ownership.test.ts     added
```

Shared identity contract now covers the audited core identities:

```text
Cube       exact UUID -> exact unique name
Group      exact UUID -> exact unique name
Animation  exact UUID -> exact unique name
Texture    exact UUID -> exact unique texture ID -> exact unique name
```

Explicit core mutation resolution does not prefix-match and does not silently select the first ambiguous name. Existing selection fallback is retained only where the public Animation helper already explicitly allowed selected-animation behavior. `create_animation` keeps its Bedrock AnimationCodec-specific case-insensitive bone-name validation local because that is codec semantics rather than generic identity resolution.

The broader `element.ts` destructive resolver was intentionally **not** narrowed to Cube/Group because the native Bedrock Entity surface may include other Outliner element types such as Locator/TextureMesh; P1.3 does not trade native capability for resolver uniformity.

Texture/PBR implementation was preserved. Repeated Texture lookup algorithms in Cube/Element/Texture/Paint-support paths now consume one strict Texture identity owner while TextureGroup/material semantics remain separate.

Continuation result ownership was improved only for high-value identity-returning core mutations:

```text
place_cube   -> structured final Cube states
modify_cube  -> structured final Cube state
add_group    -> structured Group identity/state
```

Existing `modify_cubes_batch` and `create_animation` structured results remain intact. No mass result-format rewrite was performed.

## Non-local executable proof

Canonical workflow:

```text
MCP Verify
run: 31372079399
verified source commit: 56967694c2f0a561d956c8e6e7eafa49f5463209
```

Result:

```text
frozen-lockfile install     PASS
full tsc --noEmit           PASS
Bun contract tests          PASS — 20/20, 0 failures, 106 expect() calls
production build            PASS
generated docs freshness    PASS
fail-closed aggregator      PASS
workflow conclusion         SUCCESS
```

Generated source manifest remains unchanged at:

```text
69 tools across 12 categories
3 documented prompts
8 resources
```

Temporary GitHub-runner harnesses used to perform/test the non-local consolidation were removed after the canonical proof. The durable repository verification workflow remains `mcp-verify.yml`.

## P1.3 proof boundary

The non-local evidence proves TypeScript/build/test/doc consistency plus pure deterministic identity contracts. It does **not** prove live Blockbench mutation semantics, Undo/Redo behavior, rendered state, save/reopen continuity, or end-to-end identity stability. Those remain `LOCAL PROOF REQUIRED`, primarily for P1.5 acceptance.

# Current Work Order

```text
P0.1  loopback + Origin containment              SOURCE COMPLETE / LOCAL PROOF PENDING
P0.2  dangerous default capability containment   SOURCE COMPLETE / LOCAL PROOF PENDING
P0.3  full-schema validation + real annotations  SOURCE COMPLETE / TARGETED REGRESSION PROOF PARTIAL
P0.4  typecheck/tests/root CI                     COMPLETE
P0.5  generated-doc freshness                    COMPLETE

P1.1  default Bedrock Entity registration profile COMPLETE
P1.2  family gates                               COMPLETE
P1.3  core-only resolver/mutation/result consolidation COMPLETE
P1.4  transport/session future decision              ← ACTIVE NEXT SLICE
P1.5  local end-to-end core acceptance

P2.*  evidence-driven cleanup and parked product fixes
```

# Next Step — P1.4 Transport / Session Decision Only

Do not implement a transport migration before the decision is recorded, and do not start P1.5 in the same slice.

## Goal

Re-evaluate the MCP transport/session architecture against the **current official MCP protocol and TypeScript SDK state** plus the actual BlockIT client requirement, then choose the smallest supported direction before any source rewrite.

Because protocol/SDK status is time-sensitive, P1.4 must use current official primary sources rather than repository-era assumptions.

## Required research

Re-check at execution time:

```text
current stable MCP protocol revision
current stable @modelcontextprotocol/sdk / official TypeScript SDK line
official Streamable HTTP requirements and security guidance
current session semantics / deprecations
Blockbench desktop runtime constraints
actual BlockIT MCP client(s) that must remain supported
```

## Required decision

Choose and document exactly one:

```text
KEEP CURRENT MINIMAL
SIMPLIFY ON CURRENT SDK LINE
MIGRATE TO CURRENT STABLE SDK/PROTOCOL
```

For the chosen direction, explicitly classify whether these existing layers remain necessary:

```text
TCP keepalive
HTTP keep-alive
SSE heartbeat
MCP ping
custom inactivity timeout
protocol session IDs
per-session server reconstruction
custom HTTP parsing/dispatch
```

Do not preserve transport complexity merely because it already exists. Do not remove compatibility required by the actual BlockIT client without evidence.

## Non-goals

```text
no modelling/tool feature work
no Animation/Paint/Texture rewrite
no authentication system unless a newly approved non-loopback requirement actually demands it
no P1.5 local E2E execution yet
```

## Acceptance

```text
official current protocol/SDK evidence recorded
actual supported client requirement recorded
decision among keep/simplify/migrate recorded
redundant vs required transport/session layers classified
implementation boundary for any later transport change is explicit
```

Only after this decision may P1.4 implementation proceed if the decision requires source changes. P1.5 remains the later local end-to-end acceptance boundary.
