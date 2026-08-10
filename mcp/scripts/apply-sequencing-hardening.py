from pathlib import Path


def replace_once(path: str, old: str, new: str) -> None:
    p = Path(path)
    text = p.read_text(encoding="utf-8")
    if new in text:
        return
    if text.count(old) != 1:
        raise RuntimeError(f"Expected one replacement target in {path}: {old!r}")
    p.write_text(text.replace(old, new, 1), encoding="utf-8")


def insert_before(path: str, marker: str, addition: str) -> None:
    p = Path(path)
    text = p.read_text(encoding="utf-8")
    if addition.strip() in text:
        return
    if text.count(marker) != 1:
        raise RuntimeError(f"Expected one marker in {path}: {marker!r}")
    p.write_text(text.replace(marker, addition + marker, 1), encoding="utf-8")


# Orchestrator: one small downstream readiness contract, no runtime/profile state.
orchestrator = ".agents/skills/blockit-bedrock-entity-mcp/SKILL.md"
readiness = r'''## Downstream Readiness Gate

Do not let downstream work create false completion confidence.

For an **end-to-end reference-driven asset**:

- production texture/UV/PBR/material work starts only after the complete geometry review is `PASS` for the geometry that surface work depends on;
- production animation starts only after the geometry baseline for the requested motion is accepted and the participating Group/bone hierarchy and pivots are inspected and suitable;
- a material geometry `FAIL` returns to modelling before downstream production work;
- a material geometry claim that remains `UNVERIFIED` and is required by the downstream work must be resolved or reported `BLOCKED`; do not cover it with texture or motion.

For an **existing-asset texture-only or animation-only task**, the current model may be treated as the user-provided baseline when geometry fidelity is outside the requested scope. This does **not** upgrade that geometry to `PASS`. Inspect only the prerequisites needed by the requested domain, and report a concrete geometry/hierarchy blocker if one prevents valid work instead of silently expanding into speculative remodelling.

Temporary aids are allowed only when their purpose is explicit:

- a flat/placeholder texture may be used to make geometry readable during observation;
- a small diagnostic pose/playback may be used to test a pivot or rig relationship.

These aids are provisional/disposable and are never production texture/animation progress or completion evidence.

If material geometry, hierarchy, or pivots change after downstream work has begun, revalidate the affected downstream state. Changed Cube surfaces can stale UV/texture/material assumptions; changed bones/pivots can stale animation keyframes, attachments, and motion arcs. Do not preserve wrong geometry merely because texture or animation work already exists.

'''
insert_before(orchestrator, "## Preflight\n", readiness)


# Texture specialist: practical readiness and invalidation boundary.
texturing = ".agents/skills/blockit-bedrock-texturing/SKILL.md"
texture_gate = r'''## Texture Readiness Gate

For end-to-end reference-driven creation, production texturing begins only after the complete geometry review has `PASS` for the surfaces/shape relationships the texture depends on. If a material geometry `FAIL` remains, return to modelling. If a required geometry claim is `UNVERIFIED`, resolve it or report `BLOCKED` instead of painting over the uncertainty.

For a texture-only revision on an existing asset, treat the current geometry as the user-provided baseline unless geometry correction is explicitly in scope. Do not claim that baseline is reference-accurate merely because texturing can proceed.

A minimal flat/placeholder texture may be used early when it is genuinely needed to see the model clearly. Mark it provisional; do not spend polish/detail effort on it and do not use it as evidence that the asset is close to finished.

If geometry changes after production texture work starts, re-check only the affected downstream state: Cube/face identity, UV assumptions, texture assignment, material instances, painted alignment, and PBR channel relationships as applicable. Downstream sunk cost never justifies keeping geometry that the modelling gate has rejected.

'''
insert_before(texturing, "## Texture Management\n", texture_gate)


# Animation specialist: baseline/pivot readiness plus diagnostic exception.
animation = ".agents/skills/blockit-bedrock-animation/SKILL.md"
animation_gate = r'''## Animation Readiness Gate

For end-to-end reference-driven creation, production animation begins only after the geometry baseline relevant to the requested motion is accepted and the participating Group/bone hierarchy and pivots are inspected and suitable. A material geometry `FAIL`, unresolved attachment, or pivot/hierarchy uncertainty that affects the motion returns to modelling before keyframe production. A required unresolved claim may become `BLOCKED`; do not animate around it.

For an animation-only revision on an existing asset, the current geometry may be treated as the user-provided baseline when remodelling is outside scope. This does not certify the static model as reference-accurate. Inspect the participating bones/pivots and existing animation state needed for the requested motion.

A small diagnostic pose/playback may be created before production animation when it is specifically testing a pivot, attachment, or transform direction. Keep it disposable and do not count it as animation progress or completion evidence.

If material geometry, hierarchy, or pivots change after animation work starts, consider animation on the affected bones stale until re-inspected and previewed. Re-check keyframe values, transform arcs, attachments, clipping, and return-to-neutral behavior as applicable. Existing animation effort is never a reason to preserve a bad rig or geometry baseline.

'''
insert_before(animation, "## Directly Mapped Animation Surface\n", animation_gate)


# Canonical modelling workflow: make the production readiness boundary explicit.
workflow = "docs/foundation/03-modelling-workflow.md"
replace_once(
    workflow,
    '''## 15. UV / Texture\n\nFollow [06-texture-standard.md](06-texture-standard.md) only after geometry is\ncoherent. Texture must not conceal geometry failure.\n\n## 16. Animation\n\nOnly when required. Verify hierarchy, pivot arcs, clipping/detachment, intended\nmotion, and return/neutral behavior as relevant.\n''',
    '''## 15. UV / Texture\n\nFor end-to-end reference-driven creation, production UV/texture work starts only\nafter the complete geometry review is `PASS` for the surfaces/shape\nrelationships it depends on. Texture must not conceal `FAIL` or convert a\nrequired `UNVERIFIED` geometry claim into apparent completion.\n\nA texture-only task on an existing asset may treat current geometry as the\nuser-provided baseline when geometry correction is outside scope; this is not a\nretroactive geometry `PASS`. A flat/placeholder texture used only to improve\nvisibility remains provisional and is not production surface progress.\n\nIf material geometry changes after texture work begins, re-check affected UV,\nface/texture assignment, material-instance/PBR assumptions, and painted\nalignment. Do not keep rejected geometry because downstream texture work already\nexists.\n\nFollow [06-texture-standard.md](06-texture-standard.md).\n\n## 16. Animation\n\nFor end-to-end creation, production animation starts only after the geometry\nbaseline needed by the requested motion is accepted and participating\nGroup/bone hierarchy and pivots are inspected and suitable. Do not keyframe\naround a material geometry `FAIL`, unresolved attachment, or pivot/hierarchy\nblocker.\n\nAn animation-only task on an existing asset may use the current geometry as its\nuser-provided baseline without claiming static reference fidelity. A disposable\ndiagnostic pose/playback is allowed only to test a pivot/attachment/transform\nrelationship and is not animation completion evidence.\n\nIf material geometry, hierarchy, or pivots change after animation begins,\nre-inspect and preview the affected animation state before completion. Existing\nkeyframe effort never justifies preserving a bad rig or geometry baseline.\n\nWhen animation is required, verify hierarchy, pivot arcs, clipping/detachment,\nintended motion, and return/neutral behavior as relevant.\n'''
)


# Texture foundation mirrors the same boundary without adding a new state machine.
texture_standard = "docs/foundation/06-texture-standard.md"
texture_sequence = r'''## Sequencing / Existing-Asset Boundary

For end-to-end reference-driven creation, production texture work requires the complete geometry review to have `PASS` for the shape/surfaces the texture depends on. A material geometry `FAIL` returns to modelling. A required `UNVERIFIED` geometry claim must be resolved or reported `BLOCKED`; texture is not a way to make uncertainty look finished.

For a texture-only task on an existing asset, current geometry may be accepted as the user-provided working baseline when geometry correction is outside scope. Do not turn that scope decision into a claim that the geometry matches a reference.

A minimal placeholder/flat texture may be used early solely to make geometry readable. It stays provisional and must not receive production polish/detail or be counted as completion progress.

If geometry changes after texture production begins, invalidate only the affected downstream assumptions and re-check them: Cube/face identity, UV layout, texture assignment, painted alignment, material instances, and PBR channel relationships as applicable. Sunk cost in texture work is not evidence that rejected geometry should be preserved.

'''
insert_before(texture_standard, "## Style / Resolution\n", texture_sequence)


# Canonical MCP prompt: concise operational gate.
prompt = "mcp/prompts/bedrock_entity_workflow.md"
prompt_gate = r'''### Downstream readiness gate

For an end-to-end reference-driven asset, do not start **production** texture/UV/PBR/material work until complete geometry review is `PASS` for the surfaces it depends on, and do not start **production** animation until the required geometry baseline is accepted and participating hierarchy/pivots are inspected and suitable. A material `FAIL` returns to modelling; a required `UNVERIFIED` claim must be resolved or become `BLOCKED`, not hidden by surface detail or motion.

For a texture-only or animation-only task on an existing asset, current geometry may be treated as the user-provided baseline when remodelling is outside scope. This does not certify geometry fidelity. A placeholder texture or small diagnostic pose/playback is allowed only as a provisional observation/rig aid and is not downstream completion progress.

After material geometry/hierarchy/pivot changes, revalidate affected downstream work before completion: texture/UV/material assumptions on changed surfaces, and animation/keyframe/attachment/motion assumptions on changed bones/pivots. Downstream sunk cost never authorizes keeping geometry that the geometry gate rejects.

'''
insert_before(prompt, "16. **Texture after geometry.**", prompt_gate)


# Product audit records the concrete problem/solution and proof boundary.
audit = "docs/knowledge/reviews/model-creation-effectiveness-audit-2026-08-10.md"
problem6 = r'''## Problem #6 — Texture / Animation Sequencing

### Failure we must prevent

```text
geometry is still wrong or materially unverified
-> texture polish or animation starts anyway
-> the asset looks more finished and creates sunk cost
-> Codex becomes less willing to rebuild the bad geometry/rig
-> downstream technical success is mistaken for overall completion
```

A second failure mode is the opposite: a user asks only to texture/animate an existing asset, but the workflow unnecessarily reopens the entire modelling task and expands scope.

### Root causes

1. **Stage blur** — downstream tools are available before geometry dependencies are ready.
2. **Finish bias** — texture detail and motion make an asset feel complete even when primary geometry evidence is unresolved.
3. **Downstream sunk cost** — finished pixels/keyframes psychologically protect a bad scaffold or rig from rebuild.
4. **Baseline confusion** — treating an existing asset as the working baseline can be misreported as a geometry-fidelity PASS.
5. **Stale downstream state** — later geometry/hierarchy/pivot edits can invalidate UV/paint/material or animation assumptions without forcing re-check.

### Implemented source solution

No runtime readiness state, new profile, or tool gate was added because MCP tools cannot legitimately determine visual `PASS` on their own.

The agent workflow now distinguishes:

- **end-to-end creation** — production texture waits for complete geometry readiness; production animation waits for accepted geometry plus suitable participating hierarchy/pivots;
- **existing-asset direct domain work** — current geometry can be a user-provided baseline without being certified as reference-accurate;
- **temporary aids** — placeholder texture or diagnostic pose/playback may support observation/rig diagnosis but remain provisional/disposable and cannot count as completion;
- **downstream invalidation** — material geometry/hierarchy/pivot changes make affected texture/animation assumptions stale until rechecked;
- **sunk-cost rule** — existing texture/keyframes never justify preserving geometry/rig state rejected by the modelling gate.

Material `FAIL` returns to modelling. A required downstream dependency that remains `UNVERIFIED` must be resolved or reported `BLOCKED`, not hidden under more production work.

### Remaining proof

Local end-to-end tests must show that Codex actually delays downstream production on a failing model, allows bounded existing-asset texture/animation tasks without inventing geometry approval, and revalidates affected downstream work after geometry/rig edits. Source/CI proves the sequencing contract exists; it does not prove live behaviour or visual quality.

'''
insert_before(audit, "## Product Priority Rule\n", problem6)


# Advance next-action to local effectiveness acceptance instead of inventing another abstraction.
next_path = "docs/knowledge/next-action.md"
replace_once(
    next_path,
    "`MCP_MODEL_EFFECTIVENESS_TOOL_ROUTING_HARDENING_SOURCE_COMPLETE_LOCAL_PROOF_REQUIRED`",
    "`MCP_MODEL_EFFECTIVENESS_SEQUENCING_HARDENING_SOURCE_COMPLETE_LOCAL_PROOF_REQUIRED`",
)
old_next = r'''The next bounded modelling problem is:

```text
P2 — texture and animation sequencing
```

Audit whether surface-detail or animation work can still begin early enough to hide unresolved geometry, create sunk cost, or produce false completion confidence. Keep the solution stage-based and small: geometry validity must remain authoritative, but legitimate texture/animation tasks must not be blocked once their prerequisite state is actually ready.

Preserve all existing validity rules: execution success is not visual approval, unsupported axes stay provisional/unverified, unresolved blockers stop mutation, and correction effects must match the declared invariant.

Do not add TextureMesh, a planner, automatic image-to-Cuboid reconstruction, similarity scoring, or another modelling framework unless a concrete modelling requirement proves it is needed.
'''
new_next = r'''The current source slice has hardened **P2 — texture and animation sequencing**. End-to-end downstream production waits for the geometry/rig state it actually depends on; existing-asset texture-only/animation-only tasks may use current geometry as a baseline without inventing a geometry `PASS`; affected downstream work is revalidated after material geometry/hierarchy/pivot changes.

The next authoritative modelling-effectiveness step is:

```text
LOCAL — reference-fidelity acceptance scenarios
```

Use real Codex + Blockbench runs to test the product loop rather than adding another policy/tool abstraction:

1. difficult reference -> coarse primary geometry -> difference-first visual gate;
2. front plausible / side-depth wrong -> `FAIL` or `UNVERIFIED`, never false full PASS;
3. diagnosed local mismatch -> invariant-backed correction -> structural effect -> fresh visual proof;
4. unresolved evidence/capability/correction loop -> explicit `BLOCKED` report;
5. geometry `FAIL` -> no production texture/animation;
6. accepted geometry -> texture -> animation when required -> affected downstream revalidation after any later material geometry/rig change;
7. texture-only / animation-only existing-asset task -> bounded domain work without pretending the baseline geometry was reference-approved.

If the local environment is unavailable, do **not** invent another modelling framework, readiness state machine, planner, scoring system, or capability slice merely to keep work moving. Continue non-local work only for a concrete source defect, failing existing gate, or explicit product requirement with direct modelling value.
'''
replace_once(next_path, old_next, new_next)


# Tool-routing regression should preserve its achieved boundary while allowing next-action to advance.
routing_test = "mcp/tests/model-effectiveness-tool-routing.test.ts"
replace_once(
    routing_test,
    '''  test("next work remains problem-driven and advances to sequencing", async () => {\n    const next = await source("../docs/knowledge/next-action.md");\n    expect(next).toContain("MCP_MODEL_EFFECTIVENESS_TOOL_ROUTING_HARDENING_SOURCE_COMPLETE_LOCAL_PROOF_REQUIRED");\n    expect(next).toContain("P2 — texture and animation sequencing");\n  });''',
    '''  test("tool-routing safeguards remain active as sequencing work completes", async () => {\n    const next = await source("../docs/knowledge/next-action.md");\n    expect(next).toContain("tool-choice / context friction");\n    expect(next).toContain("texture and animation sequencing");\n    expect(next).not.toContain(\n      "The next bounded modelling problem is:\\n\\n```text\\nP1 — tool-choice / context friction"\n    );\n  });''',
)


# Focused sequencing regression tests.
Path("mcp/tests/model-effectiveness-sequencing.test.ts").write_text(r'''import { describe, expect, test } from "bun:test";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("model creation effectiveness — texture/animation sequencing", () => {
  test("end-to-end production waits for geometry and rig prerequisites", async () => {
    const orchestrator = await source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md");
    const texturing = await source("../.agents/skills/blockit-bedrock-texturing/SKILL.md");
    const animation = await source("../.agents/skills/blockit-bedrock-animation/SKILL.md");
    const workflow = await source("prompts/bedrock_entity_workflow.md");

    for (const text of [orchestrator, texturing, workflow]) {
      expect(text).toContain("production");
      expect(text).toContain("geometry");
      expect(text).toContain("PASS");
      expect(text).toContain("UNVERIFIED");
      expect(text).toContain("BLOCKED");
    }
    expect(animation).toContain("participating Group/bone hierarchy and pivots");
    expect(workflow).toContain("participating hierarchy/pivots");
  });

  test("existing-asset direct tasks do not invent geometry approval", async () => {
    const orchestrator = await source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md");
    const texturing = await source("../.agents/skills/blockit-bedrock-texturing/SKILL.md");
    const animation = await source("../.agents/skills/blockit-bedrock-animation/SKILL.md");

    for (const text of [orchestrator, texturing, animation]) {
      expect(text.toLowerCase()).toContain("existing asset");
      expect(text.toLowerCase()).toContain("baseline");
    }
    expect(orchestrator).toContain("does **not** upgrade that geometry to `PASS`");
    expect(texturing).toContain("Do not claim that baseline is reference-accurate");
    expect(animation).toContain("does not certify the static model as reference-accurate");
  });

  test("temporary visibility/rig aids stay provisional and downstream state is invalidated after material upstream changes", async () => {
    const orchestrator = await source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md");
    const texturing = await source("../.agents/skills/blockit-bedrock-texturing/SKILL.md");
    const animation = await source("../.agents/skills/blockit-bedrock-animation/SKILL.md");
    const foundation = await source("../docs/foundation/03-modelling-workflow.md");

    expect(orchestrator).toContain("flat/placeholder texture");
    expect(orchestrator).toContain("diagnostic pose/playback");
    expect(orchestrator).toContain("provisional/disposable");
    expect(texturing).toContain("re-check only the affected downstream state");
    expect(animation).toContain("consider animation on the affected bones stale");
    expect(foundation).toContain("Existing keyframe effort never justifies preserving a bad rig or geometry baseline");
  });

  test("sequencing hardening remains decision-layer only and advances to local acceptance", async () => {
    const profile = await source("lib/registrationProfile.ts");
    const next = await source("../docs/knowledge/next-action.md");
    const audit = await source("../docs/knowledge/reviews/model-creation-effectiveness-audit-2026-08-10.md");

    expect(profile).toContain('export type McpRegistrationProfile = "bedrock_entity" | "extended";');
    expect(profile).not.toContain("sequencing");
    expect(profile).not.toContain("readiness");
    expect(audit).toContain("No runtime readiness state, new profile, or tool gate was added");
    expect(next).toContain("MCP_MODEL_EFFECTIVENESS_SEQUENCING_HARDENING_SOURCE_COMPLETE_LOCAL_PROOF_REQUIRED");
    expect(next).toContain("LOCAL — reference-fidelity acceptance scenarios");
    expect(next).toContain("do **not** invent another modelling framework");
  });
});
''', encoding="utf-8")

print("Applied texture/animation sequencing hardening.")
