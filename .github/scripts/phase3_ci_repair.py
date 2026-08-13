from pathlib import Path
import re


def replace_once(path: str, old: str, new: str) -> None:
    p = Path(path)
    text = p.read_text()
    if old not in text:
        raise SystemExit(f"Expected text not found in {path}: {old[:120]!r}")
    p.write_text(text.replace(old, new, 1))


replace_once(
    "mcp/server/tools/cubes.ts",
    "const placements = elements.map((element: PlaceCubeElement) => ({",
    'const placements: Array<{ element: PlaceCubeElement; outlinerGroup: Group | "root" }> = elements.map((element: PlaceCubeElement) => ({',
)
replace_once(
    "mcp/server/tools/cubes.ts",
    '"Places Bedrock Cubes with explicit finite geometry and deterministic UV intent. Texture selection is global in native Bedrock single_texture and remains owned by activate_texture; custom face UV entries switch only the new Cube to per-face UV mode. Success applies authored state only; visual/reference fidelity is not evaluated.",',
    '"Places Bedrock Cubes with explicit geometry, parent, inflate, and UV intent. Texture stays global. Success records authored state; reference fidelity is not evaluated.",',
)

Path("AGENTS.md").write_text(r'''# Workspace Agent Routing

Current intent owns the task; current source and relevant proof own behavior.

## Task Class First

Choose the smallest route before loading context.

### Reference Preparation

For creating/revising the **reference image itself** before Blockbench modelling.

```text
source image / user intent
→ .agents/skills/blockbench-reference-generator/SKILL.md
→ assisted intake + internal brief
→ pre-generation readiness
   ├─ READY → generate Draft → visual gate → user approval
   └─ NOT READY → bounded clarification → still material? NEEDS REVIEW
```

Image-capable surface only. **Generation is output, not discovery.** Do not call BlockIT MCP for reference preparation. Detailed sequence: `docs/knowledge/flow.md`; durable policy: `docs/foundation/04-reference-guide.md`.

### Asset Authoring

For Bedrock Entity create/revise/inspect/texture/animate/validate/export work that does not change repository/plugin source.

```text
current request / actual approved reference
→ .agents/skills/blockit-bedrock-entity-mcp/SKILL.md
→ only the active modelling/texturing/animation specialist
→ BlockIT MCP
```

For normal asset authoring, **do not automatically load** `CONTEXT.md`, `docs/knowledge/next-action.md`, `development-brief`, engineering history, activation matrices, or all foundation docs. Tool selection starts from intent + known state, not repository/code search.

Asset authoring is not software **Developing** merely because it changes a model. Reference generation is not repository development. **Do not route it through `development-brief`** unless repository/plugin behavior changes.

### Repository / Plugin Work

For source/docs/tests/CI/MCP/plugin/architecture/maintenance.

```text
this file
→ docs/knowledge/next-action.md when continuing active work
→ CONTEXT.md only when stable facts matter
→ affected source + nearest AGENTS.md
→ .agents/skills/development-brief/SKILL.md
→ at most one relevant engineering specialist
```

For a named MCP-tool defect, use `docs/knowledge/implementation-map.md` **Hot-Path Defect Index** before broad code search.

## Source Precedence

1. current user instruction;
2. current source + relevant runtime/visual proof;
3. root/nearest `AGENTS.md`;
4. `docs/foundation/` policy;
5. `docs/knowledge/next-action.md`;
6. `CONTEXT.md`;
7. decision/review history for rationale.

Resolve material conflicts explicitly.

## Work Discipline

- Inspect the current owner/caller/pattern before shared changes.
- Make the minimum complete change; reuse before adding a layer.
- Do not broaden scope because adjacent issues are visible.
- No fallback/framework/profile/compatibility layer without proved need.
- Fixtures/named assets are evidence, not generic product rules.
- Stop the same failed direction after two attempts without new evidence.
- `No change required` is valid.
- Never claim proof that was not obtained.

## Execution / Proof

**ChatGPT → GitHub:** repository/source/docs/CI evidence only; never invent Blockbench runtime proof.

**Codex local:** shell/MCP/Blockbench only when the claim requires it; no broad checks by ritual.

Use the cheapest falsifiable evidence. Source/CI proof never upgrades a live visual claim.

```text
CURRENT-PROJECT VERIFIED
OFFICIALLY VERIFIED
LOCAL PROOF REQUIRED
UNSUPPORTED
UNKNOWN
```

## Product Boundary

Minecraft Bedrock Entity (`bedrock`) remains the default. Reference generation creates a visual brief, not geometry. Tool success is execution evidence, not visual fidelity. Reference judgement uses `FAIL / UNVERIFIED / PASS`; `BLOCKED` is valid when continuation would require guessing.

Reference generation → `blockbench-reference-generator`; modelling judgement → `blockbench-bedrock-modelling`; texture/PBR → `blockit-bedrock-texturing`; animation → `blockit-bedrock-animation`. Missing native capability must not be faked with generic Mesh, risky evaluation, UI automation, or another format.

For `mcp/**`, `mcp/AGENTS.md` owns TypeScript/Zod/runtime/registration/result/generated-doc/containment rules.

## Canonical Owners

- task/product flow → `docs/knowledge/flow.md`
- active continuation → `docs/knowledge/next-action.md`
- stable facts → `CONTEXT.md`
- product/reference/modelling policy → `docs/foundation/`
- reference image generation → `.agents/skills/blockbench-reference-generator/`
- asset orchestration → `.agents/skills/blockit-bedrock-entity-mcp/`
- plugin/runtime → `mcp/`
- repository change contract → `.agents/skills/development-brief/`

Do not recreate retired generic skills or parallel planning/state systems.

## Communication

Keep progress compact: decisions, proof, blockers, one next step.
''')

Path("mcp/prompts/bedrock_entity_workflow.md").write_text(r'''# Minecraft Bedrock Entity Workflow

Create/revise Bedrock **Entity**. Cubes are geometry; Groups are bones.

## Minimum necessary evidence

**Do not inspect each newly placed Cube or capture after every mutation.** Reuse fresh state. **Do not immediately call `get_project_info`** unless needed. `inspect_model_bounds` is only for envelope/scale/ground/displacement; **Otherwise skip it**. **Do not spend additional calls trying to remove UNVERIFIED** unless evidence can change the decision.

## Actual reference grounding

Reference-driven authoring requires the **actual approved reference image visible in active multimodal context**. Path/memory **is not image evidence**. If unavailable, `BLOCKED`.

```text
user brief/target → identity/function
approved image → visible form
approved dimensions → numeric envelope
Reference Evidence Map → claim_id | kind | observable claim | supporting reference view(s) | SUPPORTED | PROVISIONAL | CONFLICTING | UNAVAILABLE
```

Build a **View Pair Map** to matching `capture_model_views` views. Ambiguous front/back, left/right, mirrored, or 3/4 pairing → `UNVERIFIED`.

## Semantic form before coordinates

Before exact `from/to/origin/rotation`, form a **Semantic Form Contract** linked to `claim_id`s:

```text
identity / recognizability
primary masses + must-exist reason
identity-critical landmarks
required count / symmetry or deliberate asymmetry
topology: what attaches to what
important negative spaces / separations
representation: geometry | texture | animation | omit
material evidence state
```

A semantic label never authorizes coordinates. Every primary Cube maps to a declared mass/landmark or justified split; **no orphan/filler Cube**.

Choose the **simplest construction that preserves the visible requirement**. Solid Cuboid, plane-like Cube, layered/inflated shell, linked segments, and texture-only are reasoning examples, **not presets or asset classes**. Use volume for silhouette; plane-like geometry for sheet-like form; `inflate` for layering; linked segments for meaningful bends, never unit-Cube staircasing.

Decide **transform ownership** before rotation. Shared orientation/attachment/articulation should be Group/Bone-owned; local rigid slope can stay Cube-owned. Form/contact/articulation-defining Groups/pivots belong in primary blockout; neutral organization may wait.

Classify each primary mass `AXIS_ALIGNED | ROTATED | UNRESOLVED`. `[0,0,0]` needs image support. A **visible material slope** requires `ROTATED` + explicit origin/pivot + role `MASS_CENTER | ATTACHMENT | JOINT | PARENT_TRANSFORM`. Material `UNRESOLVED` → `BLOCKED`.

For every **required attachment**, identify **contact target/invariant** first. Use an **attachment/joint pivot** when it owns the transform. Numeric overlap/hierarchy is not contact proof; negative spaces stay open.

## Primary form / authoring

**A front-view match cannot certify depth.** Never average cross-view conflict; unresolved conflict → `BLOCKED`.

Semantic Form says what exists/how parts relate; Primary Form Hypothesis says where/how large/how oriented. Keep placement/size, claims/views, transform owner, contact invariant, uncertainty.

Build minimum coherent form with finite `from/to`, required primary Groups/pivots, and intentional transforms. Non-zero Cube rotation needs pivot/origin. Successful `place_cube`, `modify_cube`, or `modify_cubes_batch` is execution evidence only; `visual_verdict: not_evaluated` is not approval. **Do not chain Cube placement based on previous tool success.** Once judgeable, stop before secondary detail. An under-constrained extent remains a **working hypothesis, not verified reference evidence** after placement.

After primary `PASS`, use **identity-weighted detail** only where silhouette, recognizability, contact/layering, or motion benefits.

## Difference-first visual gate

Material verdict requires **actual approved reference image plus fresh current-revision model image(s) visible in the same comparison context**. Path/prose/memory/stale capture cannot approve.

```text
claim_id | reference view | current model view | observed difference | FAIL | UNVERIFIED | PASS
```

Review **difference-first**: recognizability, masses/counts, silhouette/proportion, placement, orientation, contact, negative spaces. `FAIL` = major mismatch; `UNVERIFIED` = missing/ambiguous/conflicting evidence; `PASS` = fresh paired evidence has no critical/major supported mismatch.

Front PASS is not full 3D PASS when depth evidence is missing/fails. Bounds, hierarchy, coordinates, tool success, similarity/IoU/projection scores, or fluent review cannot justify PASS. Material mutation makes affected views stale.

## Local correction / convergence

1. **Reuse fresh exact authored state already returned for that target when sufficient**; otherwise `inspect_element` once.
2. Diagnose `TRANSLATE`, `RESIZE`, `ROTATE`, **hierarchy REATTACH**, `SPLIT`, `MERGE/REMOVE`, or grounded `ADD MASS`.
3. State target UUID(s), change, invariant, expected effect.
4. Mutate; verify `geometry_effect`; re-capture affected view(s).
5. Compare: `IMPROVED | UNCHANGED | REGRESSED`.

Progress requires the mismatch `IMPROVED` and no previously supported material claim/view `REGRESSED`. `UNCHANGED`/`REGRESSED` is not progress; change diagnosis or reopen Primary Form instead of patching around cross-view regression. The delta is **qualitative, not a score**.

TRANSLATE preserves size; RESIZE names fixed center/face/contact; ROTATE preserves `from/to/size`, pivot role, attachment. Wrong/no structural effect is not progress. If the **same causal correction direction fails twice without new evidence**, use `BLOCKED`.

## Downstream stages

Primary-form-defining hierarchy/pivots may exist before primary `PASS`; secondary geometry and neutral organization wait. Production texture waits for dependent **geometry** to `PASS`; production animation waits for suitable **participating hierarchy/pivots**. Material `FAIL` returns upstream; unresolved required `UNVERIFIED` → `BLOCKED`.

## Locator / Null Object authored state

Use `list_locator_elements` for discovery, `inspect_element` for focused state, and `manage_locator` / `manage_null_object` for create/update.

## Protected Native Capability Gaps

TextureMesh, visible bounding-box fields, animation controllers/effects, animated textures, and bone-binding expressions remain gaps; do not fake them. Native Bedrock PBR and per-face `material_instance` are **not** gaps.

## Stage/tool routing

```text
project unknown/absent → get_project_info or create_project as appropriate
known project → grounded reference → Semantic Form + Primary Form → place_cube / add_group
judgeable form → capture_model_views
bounded mismatch → inspect_element only if needed → modify_cube / modify_cubes_batch
downstream → active texture or animation specialist
requested deliverable → export_model
```
''')

Path("mcp/tests/documentation-handoff.test.ts").write_text(r'''import { describe, expect, test } from "bun:test";
import { readdir } from "node:fs/promises";

async function text(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("Codex documentation handoff", () => {
  test("current repository-owned skill inventory is documented without stale routing", async () => {
    const dirs = (await readdir("../.agents/skills", { withFileTypes: true }))
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort();

    expect(dirs).toEqual([
      "blockbench-bedrock-modelling",
      "blockbench-reference-generator",
      "blockbench-runtime-development",
      "blockit-bedrock-animation",
      "blockit-bedrock-entity-mcp",
      "blockit-bedrock-texturing",
      "bun-tooling",
      "development-brief",
      "mcp-server-development",
      "typescript-type-safety",
    ]);

    const [context, skillMap, activation, developmentBrief, referenceGenerator] =
      await Promise.all([
        text("../CONTEXT.md"),
        text("../docs/knowledge/skills/skill-map.md"),
        text("../docs/knowledge/skills/activation-matrix.md"),
        text("../.agents/skills/development-brief/SKILL.md"),
        text("../.agents/skills/blockbench-reference-generator/SKILL.md"),
      ]);

    for (const name of dirs) expect(skillMap).toContain(name);
    expect(context).toContain("ten repository-owned skill packages");
    expect(activation).toContain("Reference Preparation / Asset Authoring");
    expect(activation).toContain("Blockbench asset authoring");
    expect(activation).toContain("Repository / Plugin Development");
    expect(activation).toContain("Local Acceptance — Only When Reactivated");
    expect(activation).toContain("Hot-Path Defect Index");
    expect(skillMap).toContain("exact-name deferred spec loading");
    expect(referenceGenerator).toContain("Return **one image only**");
    expect(referenceGenerator).toContain("automatic variants   = 0");
    expect(referenceGenerator).toContain("Do not generate ZIPs");
    expect(developmentBrief).not.toContain("`grilling`");
    expect(developmentBrief).not.toContain("`code-review`");
  });

  test("current continuation stays bounded and does not silently reactivate local acceptance", async () => {
    const [next, runbook, implementation] = await Promise.all([
      text("../docs/knowledge/next-action.md"),
      text("../docs/knowledge/operations/local-acceptance-runbook.md"),
      text("../docs/knowledge/implementation-map.md"),
    ]);

    expect(next.length).toBeLessThan(7_000);
    expect(next).toContain("Working branch: **`Local` only**");
    expect(next).toContain("PRO-1");
    expect(next).toContain("PRO-2");
    expect(next).toContain("## Next Step");
    expect(next).toContain("LOCAL PROOF REQUIRED");
    expect(next).toContain("Do not claim live Blockbench/model-quality improvement without actual runtime proof");
    expect(next).not.toContain("LOCAL — run one fresh Codex efficiency trace");
    expect(next).not.toContain("LOCAL — follow operations/local-acceptance-runbook.md");

    expect(runbook).toContain("Active only when `docs/knowledge/next-action.md` points here");
    expect(implementation).toContain("## Hot-Path Defect Index");
    expect(implementation).toContain("62 enabled tools");
    expect(implementation).toContain("No local run is active");
  });

  test("named MCP-tool defects have a bounded source and primary-test index", async () => {
    const [root, implementation] = await Promise.all([
      text("../AGENTS.md"),
      text("../docs/knowledge/implementation-map.md"),
    ]);

    expect(root).toContain("Hot-Path Defect Index");
    expect(root).toContain("docs/knowledge/implementation-map.md");
    expect(implementation).toContain("## Hot-Path Defect Index");
    expect(implementation).toContain("source owner + primary regression owner first");
    expect(implementation).toContain("Expand only if that pair cannot explain the defect");
    expect(implementation).toContain("`undo`/`redo` remain source-owned");

    const mappings = [
      { tools: ["create_project"], source: "server/tools/project.ts", test: "tests/p1-core-ownership.test.ts" },
      { tools: ["get_project_info"], source: "server/tools/project.ts", test: "tests/static-efficiency-budget.test.ts" },
      { tools: ["inspect_model_bounds"], source: "server/tools/project.ts", test: "tests/rendered-model-bounds-numeric-safety.test.ts" },
      { tools: ["place_cube", "modify_cube", "modify_cubes_batch"], source: "server/tools/cubes.ts", test: "tests/model-effectiveness-correction-accuracy.test.ts" },
      { tools: ["add_group"], source: "server/tools/element.ts", test: "tests/p1-core-ownership.test.ts" },
      { tools: ["list_outline", "find_elements_by_criteria"], source: "server/tools/element.ts", test: "tests/context-payload-cleanup.test.ts" },
      { tools: ["inspect_element"], source: "server/tools/element-inspection.ts", test: "tests/model-effectiveness-correction-accuracy.test.ts" },
      { tools: ["capture_model_views"], source: "server/tools/camera.ts", test: "tests/camera-framing-contract.test.ts" },
      { tools: ["list_locator_elements", "manage_locator", "manage_null_object"], source: "server/tools/locators.ts", test: "tests/bedrock-locator-coverage.test.ts" },
      { tools: ["create_texture", "list_textures", "get_texture", "activate_texture"], source: "server/tools/texture.ts", test: "tests/context-payload-cleanup.test.ts" },
      { tools: ["create_animation"], source: "server/tools/animation.ts", test: "tests/create-animation-contract.test.ts" },
      { tools: ["inspect_animation"], source: "server/tools/animation-inspection.ts", test: "tests/context-payload-cleanup.test.ts" },
      { tools: ["get_undo_stack"], source: "server/tools/history.ts", test: "tests/static-efficiency-budget.test.ts" },
      { tools: ["export_model"], source: "server/tools/export.ts", test: "tests/prelocal-generic-semantics.test.ts" },
    ];

    for (const mapping of mappings) {
      const row = implementation
        .split("\n")
        .find((line) => mapping.tools.every((tool) => line.includes(`\`${tool}\``)));
      expect(row).toBeDefined();
      expect(row).toContain(`\`mcp/${mapping.source}\``);
      expect(row).toContain(`\`mcp/${mapping.test}\``);
      expect(await Bun.file(mapping.source).exists()).toBe(true);
      expect(await Bun.file(mapping.test).exists()).toBe(true);
    }
  });

  test("proof docs separate accepted live baseline from current static/model-facing evidence", async () => {
    const [validation, context, implementation] = await Promise.all([
      text("../docs/foundation/validation-report.md"),
      text("../CONTEXT.md"),
      text("../docs/knowledge/implementation-map.md"),
    ]);

    expect(validation).toContain("LOCAL_ACCEPTANCE_COMPLETE");
    expect(validation).toContain("Fresh GitHub-Only Serialized Surface Proof");
    expect(validation).toContain("Native Deferred MCP Discovery Compatibility");
    expect(validation).toContain("P0–P4 Static Efficiency / Decision Proof");
    expect(validation).toContain("OFFICIALLY VERIFIED");
    expect(validation).toContain("LOCAL PROOF REQUIRED");
    expect(context).toContain("first bounded Codex + Blockbench local acceptance pass completed");
    expect(context).not.toContain("The next authoritative stage is **Codex + Blockbench local acceptance**");
    expect(implementation).toContain("Deferred MCP Discovery Ownership");
    expect(implementation).toContain("Authoring Decision / Recovery Ownership");
  });
});
''')

p = Path("mcp/tests/context-payload-cleanup.test.ts")
text = p.read_text()
pattern = re.compile(r'  test\("continuity stays compact and keeps local execution deferred".*?\n  \}\);\n\}\);\s*$', re.S)
replacement = r'''  test("continuity stays compact and keeps local execution deferred", async () => {
    const profile = await source("lib/registrationProfile.ts");
    const next = await source("../docs/knowledge/next-action.md");
    expect(profile).toContain('export type McpRegistrationProfile = "bedrock_entity" | "extended";');
    expect(profile).not.toContain("lean_mode");
    expect(profile).not.toContain("context_mode");
    expect(next.length).toBeLessThan(7_000);
    expect(next).toContain("Working branch: **`Local` only**");
    expect(next).toContain("PRO-1");
    expect(next).toContain("PRO-2");
    expect(next).toContain("## Next Step");
    expect(next).toContain("LOCAL PROOF REQUIRED");
    expect(next).toContain("Do not claim live Blockbench/model-quality improvement without actual runtime proof");
    expect(next).not.toContain("LOCAL — run one fresh Codex efficiency trace");
    expect(next).not.toContain("LOCAL — follow operations/local-acceptance-runbook.md");
  });
});
'''
updated, count = pattern.subn(replacement, text, count=1)
if count != 1:
    raise SystemExit("Failed to update context-payload continuity contract")
p.write_text(updated)

replace_once(
    "mcp/tests/reference-generator-buildability.test.ts",
    'expect(lowerFlow).toContain("pre-generation readiness gate");',
    'expect(lowerFlow).toContain("pre-generation readiness");',
)
replace_once(
    "mcp/tests/reference-generator-buildability.test.ts",
    'expect(lowerFlow).toContain("not ready → do not generate");',
    'expect(lowerFlow).toContain("still material? needs review; do not generate");',
)
replace_once(
    "mcp/tests/reference-generator-buildability.test.ts",
    'expect(lowerSkill).toContain("stop for user review / approval");',
    'expect(lowerSkill).toContain("user review / approval");',
)
replace_once(
    "mcp/tests/asset-authoring-usage-slimming.test.ts",
    'expect(readme).toContain("## Task Class First");',
    'expect(readme).toContain("## Start By Task");',
)
