# Next Action

Updated: 2026-08-10

This is the **single active-task snapshot**. New ChatGPT/Codex sessions read:

`AGENTS.md` → `CONTEXT.md` → this note.

## Active Goal

Maintain BlockIT as a trustworthy **Minecraft Bedrock Entity MCP for Blockbench** while preserving every capability that genuinely belongs to Bedrock Entity.

The product rule is unchanged:

> Preserve capability that belongs to Minecraft Bedrock Entity. Generic capability inherited from a broader Blockbench MCP does not need to remain merely for compatibility. A missing MCP mapping for a native Bedrock capability is a protected implementation gap, not deletion permission.

## Current Status

`MCP_PRELOCAL_SURFACE_HARDENING_COMPLETE_LOCAL_PROOF_REQUIRED`

Execution channel: **ChatGPT → GitHub**.  
Working branch: **`Local` only**.  
Local Blockbench/Codex runtime proof is still unavailable and must not be fabricated from source, CI, or official-source evidence.

**Do not start P1.5 while P1.4 local acceptance remains unavailable.**

## Completed Stabilization Boundary

```text
P0.1  loopback + Origin containment                     SOURCE COMPLETE / LOCAL PROOF PENDING
P0.2  dangerous default containment                     SOURCE COMPLETE / LOCAL PROOF PENDING
P0.3  full-schema validation + annotations              SOURCE COMPLETE / TARGETED PROOF COMPLETE
P0.4  engineering gate + retained typecheck             COMPLETE
P0.5  generated-doc freshness                           COMPLETE

P1.1  default Bedrock Entity registration profile       COMPLETE
P1.2  explicit family gates                             COMPLETE
P1.3  core identity / mutation-result ownership         COMPLETE
P1.4  stateless-v1 decision + source/non-local proof    SOURCE COMPLETE / LOCAL PROOF REQUIRED

Pre-local plugin surface hardening:
A  BlockIT product identity + build fingerprint         COMPLETE
B  truthful exposed/catalog/available panel surface     COMPLETE
C  Tool Test disabled-definition containment            COMPLETE
D  Bedrock capability surface matrix                    COMPLETE
E  generic semantics narrowing                          COMPLETE
F  canonical Bedrock Entity MCP prompt                  COMPLETE
G  repository-owned BlockIT agent skill stack           COMPLETE
H  BlockIT docs/install normalization                   COMPLETE

P1.5  local end-to-end core acceptance                  BLOCKED ON LOCAL ENVIRONMENT
```

## Latest Pre-Local Source Commits

```text
bc50a3c1772249a51bddc2a52e0f10440621e77d
fix: harden BlockIT plugin surface before local proof

efaaeb227175395abf9d4715b384f0c44da2c25d
fix: narrow generic MCP semantics before local proof

0c6f7e52a95f7ba231759ba19dc85a326f18a480
docs: align Bedrock MCP prompts and agent skills
```

Temporary GitHub runner patch/workflow harnesses used for A–H must not remain in the repository after verification. The only durable root workflow should be `.github/workflows/mcp-verify.yml`.

## Product / Plugin Identity

Visible plugin identity is now BlockIT-owned:

```text
BlockIT — Bedrock Entity MCP
```

The plugin panel and `/health` surface build/profile information so local acceptance can distinguish the current BuildIT artifact from the upstream Jason Gardner hosted plugin.

For BlockIT validation, build branch `Local` and load `mcp/dist/mcp.js`. Do **not** use the upstream hosted `jasonjgardner.github.io/.../mcp.js` artifact as evidence for this fork.

Upstream attribution/license remains preserved.

## Registration / Surface Truth

Default profile:

```text
bedrock_entity
```

Normal default families preserve the audited Bedrock workflow surface. Generic fallback families remain source-preserved behind explicit opt-in where applicable.

Dangerous tools remain quarantined:

```text
risky_eval      enabled=false
from_geo_json   enabled=false
```

The Blockbench panel now distinguishes:

```text
Tools      exposed vs catalog
Resources  currently available
Prompts    exposed vs catalog
```

Disabled definitions are hidden by default and are not executable through the BlockIT Tool Test dialog. Tool Test also runs the complete Zod `parameterSchema.parseAsync()` contract before execution.

## Generic Semantics Narrowed Before Local Proof

### Project creation

`create_project` accepts Minecraft Bedrock Entity format `bedrock` only. Arbitrary `Formats[...]` creation is outside the normal BlockIT product tool.

### Model export

`export_model` / `list_export_formats` intentionally expose only:

```text
bedrock  → native Minecraft Bedrock geometry JSON
project  → editable Blockbench .bbmodel
```

Bedrock animation/controller file behavior belongs to Blockbench's separate native Bedrock `AnimationCodec`; this model-export narrowing is not animation capability deletion.

### Camera / app UI convenience

Default exposed observation keeps the useful model paths such as:

```text
capture_screenshot
capture_model_views
inspect_model_bounds
```

Generic full-application screenshot and arbitrary editor-camera mutation are source-preserved but default-disabled:

```text
capture_app_screenshot
set_camera_angle
```

### Validator references

Validator resources remain available, but regex/message-derived element links explicitly report:

```text
elementRefsSource: message_heuristic | none
elementRefsAuthoritative: false
```

Do not treat those inferred links as authored identity evidence.

### `nodes://` resource

The broad `nodes://{id}` observation resource is intentionally **deferred, not removed**. Direct authored-state owners for native Locator and TextureMesh are still protected gaps, so removing the broader observation route first would reduce observability while pretending the product became cleaner.

## Canonical Prompt Surface

The one enabled normal workflow prompt is now:

```text
bedrock_entity_workflow
```

It has no Java Block / Bedrock Block / generic UI / programmatic / import routing branches.

Bundled prompt content is reduced to three files:

```text
bedrock_entity_workflow.md
blockbench_native_apis.md          disabled maintainer reference
blockbench_code_eval_safety.md     disabled maintainer reference
```

The Bedrock workflow explicitly requires protected native gaps to remain visible rather than being faked with generic Mesh, arbitrary Cubes, UI automation, code evaluation, or a different format.

## Repository-Owned Agent Skills

Canonical Bedrock authoring stack:

```text
blockit-bedrock-entity-mcp         MCP workflow/surface orchestrator
  ├─ blockbench-bedrock-modelling  whole-form/Cuboid/hierarchy/pivot judgement
  ├─ blockit-bedrock-texturing     texture/Paint/PBR/material_instance
  └─ blockit-bedrock-animation     BoneAnimator/keyframes/mapped particle effects
```

Maintainer skills such as `blockbench-runtime-development` and `mcp-server-development` remain separate from normal asset authoring.

Do not install/copy the upstream `jasonjgardner/blockbench-mcp-project` skills as BlockIT's canonical layer. They describe a broader generic MCP surface containing Mesh, Hytale, risky-eval fallback, arbitrary formats/codecs, and tool names that no longer match the normal BlockIT contract.

## Protected Native Bedrock Capability Gaps

Official Blockbench source establishes native/relevant Bedrock capability beyond BlockIT's current direct MCP authoring surface. The following remain protected until direct owners are audited/implemented:

```text
Locator / NullObject locator authoring
TextureMesh authoring / authored-state inspection
native Bedrock visible bounding-box fields
animation controllers
animation sound effects
animation timeline effects
animated-texture authoring
bone-binding expressions
```

Also preserve already-mapped native capabilities:

```text
Cube/Cuboid
Group-as-bone hierarchy
Cube UV / box UV / UV rotation semantics
Texture / Paint
PBR / TextureGroup materials
per-face material_instance
Animation / BoneAnimator transform channels
mapped particle effects
History / Undo / Redo
Bedrock geometry + editable .bbmodel outcomes
```

`TextureMesh` is distinct from generic Blockbench `Mesh` and must never be removed merely because the generic Mesh MCP family was removed.

## Governing Evidence

Read these before any next capability change:

```text
docs/knowledge/reviews/mcp-development-quality-audit.md
docs/knowledge/operations/mcp-reduction-stabilization-plan.md
docs/knowledge/reviews/bedrock-entity-capability-surface-audit.md
docs/knowledge/reviews/bedrock-entity-capability-surface-matrix.md
docs/knowledge/reviews/mcp-prelocal-generic-semantics-audit-2026-08-10.md
docs/knowledge/reviews/blockit-agent-skill-surface-2026-08-10.md
docs/knowledge/reviews/mcp-p1-4-nonlocal-compatibility-proof-2026-08-10.md
```

## Non-Local Proof Available

P1.4 already has SDK/raw-TCP proof for stateless request flow, loopback binding in the test listener, real HTTP Origin rejection, initialize/initialized/tools-list/tools-call, and Codex legacy protocol compatibility.

A–E helper gates established typecheck/tests/build/docs/diff hygiene before source commits. The F–G–H helper gate established:

```text
typecheck              PASS
Bun tests              PASS — 46/46, 253 expect() calls
production build       PASS
prompt manifest        3 prompt content files
generated MCP docs     69 tools / 3 prompt metadata / 8 resource catalog
docs freshness         PASS
git diff hygiene       PASS
```

The durable `MCP Verify` workflow remains the authoritative final clean-head repository gate and should be run after helper cleanup.

## Exact Next Step When Local Environment Becomes Available

**P1.4 Local Stateless Transport + Plugin Surface Proof**, using the current BuildIT Local plugin artifact.

Minimum acceptance:

```text
load current mcp/dist/mcp.js in desktop Blockbench
confirm panel says BlockIT — Bedrock Entity MCP
confirm displayed build revision/profile matches intended Local build
confirm listener is actually loopback-only
run bun run verify:stateless-local
connect real Codex directly to Streamable HTTP endpoint
initialize + real tools/list pass without Mcp-Session-Id
panel exposed counts agree with real tools/list/prompt exposure
read-only Bedrock tool call passes
bounded Bedrock mutation passes with Undo/re-observation
invalid present Origin is real HTTP 403
plugin unload/reload cleans listener/UI correctly
Paint/texture/animation runtime behavior is checked where applicable
```

Only after that proof may P1.4 be marked fully complete and P1.5 begin.

## Do Not Do Next

Until local proof is available:

- do not start P1.5 and call it accepted;
- do not migrate MCP SDK/protocol merely for novelty;
- do not reintroduce generic Mesh/Hytale/UI/eval fallback into the default workflow;
- do not remove a protected native Bedrock capability because direct MCP coverage is incomplete;
- do not replace `nodes://` until Locator/TextureMesh authored-state ownership is designed;
- do not claim live Blockbench/Painter/Animation behavior from CI alone.
