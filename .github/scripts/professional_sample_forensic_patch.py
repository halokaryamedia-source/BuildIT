from pathlib import Path


def replace_once(path: str, old: str, new: str) -> None:
    p = Path(path)
    text = p.read_text()
    if old not in text:
        raise SystemExit(f"Expected text not found in {path}: {old[:140]!r}")
    p.write_text(text.replace(old, new, 1))


# Geometry policy: preserve general reasoning; add only evidence-backed semantics.
replace_once(
    "docs/foundation/05-geometry-standard.md",
    "- `inflate` is layer-control, not proportion repair or fake detail.\n",
    "- `inflate` is layer-control, not proportion repair or fake detail. Its sign and magnitude are local authored choices; do not impose a positive-only or fixed-value rule.\n",
)
replace_once(
    "docs/foundation/05-geometry-standard.md",
    "## Completion Criteria\n",
    "## Functional Anchors / Locators\n\nA required non-visible effect, hold, or attachment point that needs transform identity but no visible volume is **Locator intent**, not a hidden/placeholder Cube. Use geometry only when the target actually has visible form.\n\n## Completion Criteria\n",
)

# Keep active modelling/runtime reasoning compact while making the Locator decision reachable.
replace_once(
    ".agents/skills/blockbench-bedrock-modelling/SKILL.md",
    "Use volume for silhouette; plane-like geometry only for sheet-like form; `inflate` only for deliberate layer separation; linked segments only for meaningful bend/articulation, never unit-Cube staircasing.\n",
    "Use volume for silhouette; planes for sheet-like form; `inflate` for deliberate layer separation; linked segments for meaningful bends; use Locator—not a hidden Cube—for a required non-visible anchor.\n",
)
replace_once(
    "mcp/prompts/bedrock_entity_workflow.md",
    "Use volume for silhouette; plane-like geometry for sheet-like form; `inflate` for layering; linked segments for meaningful bends, never unit-Cube staircasing.\n",
    "Use volume for silhouette; planes for sheet-like form; `inflate` for layering; linked segments for meaningful bends; use Locator—not a hidden Cube—for a required non-visible anchor.\n",
)
replace_once(
    "mcp/prompts/bedrock_entity_workflow.md",
    "TextureMesh, visible bounding-box fields, animation controllers/effects, animated textures, and bone-binding expressions remain gaps; do not fake them. Native Bedrock PBR and per-face `material_instance` are **not** gaps.\n",
    "TextureMesh, visible bounding-box fields, animation controllers, sound/timeline effects, expression-valued transform keyframes, animated textures, and bone-binding expressions remain gaps; do not fake them. Native Bedrock PBR and per-face `material_instance` are **not** gaps.\n",
)

# Texture policy: Box UV/manual atlas state is a first-class professional path, not a preset.
replace_once(
    "docs/foundation/06-texture-standard.md",
    "Do **not** treat a specific texture-canvas size (`256`, `512`, `1024`, etc.) as a\nuniversal product law or automatic MCP guarantee. Choose/verify canvas behavior\nfrom the current model, project format, and actual runtime capability.\n",
    "Do **not** treat a specific texture-canvas size (`256`, `512`, `1024`, etc.) as a\nuniversal product law or automatic MCP guarantee. Choose/verify canvas behavior\nfrom the current model, project format, and actual runtime capability.\n\n**Logical/project UV resolution and physical bitmap dimensions are separate facts.** Do not assume they must be equal, power-of-two, or share one universal scale ratio.\n",
)
replace_once(
    "docs/foundation/06-texture-standard.md",
    "## Mirror UV\n",
    "## Box UV / Atlas Authoring\n\nBox UV is a first-class professional path for Cuboid Bedrock assets when it represents the intended surface workflow. Final layout may deliberately use authored per-Cube `uv_offset`, `mirror_uv`, and disabled/controlled auto-UV state. Automatic UV can be a starting aid; it is not proof of a finished atlas.\n\nIntentional UV reuse/overlap is valid for symmetric or repeated surfaces that are meant to share pixels. Reject accidental overlap, not reuse itself. Do **not** use a universal packing-density score or maximize occupied pixels as a quality target. Multiple texture variants may share one established geometry/UV layout.\n\n## Mirror UV\n",
)

# Active texturing reasoning: route known Box-UV state without creating a planner/packer.
replace_once(
    ".agents/skills/blockit-bedrock-texturing/SKILL.md",
    "`material_instance` is Bedrock face metadata, distinct from a PBR TextureGroup. Generic Mesh UV tools are outside BlockIT Bedrock Entity; do not claim direct Cube UV coverage beyond current Cube/texture contracts.\n\nInspect existing PBR state before replacing channels. Keep color/normal/height/MER identity deterministic.\n",
    "`material_instance` is Bedrock face metadata, distinct from a PBR TextureGroup. Generic Mesh UV tools stay outside BlockIT Bedrock Entity. For Box-UV Cubes, `uv_offset`, `mirror_uv`, and `autouv` are intentional authored layout state: use `modify_cube` for one known Cube or `modify_cubes_batch` for a coherent known set. Intentional reuse/mirroring is valid; accidental overlap is not.\n\nLogical project UV resolution and bitmap pixel dimensions are separate facts; do not assume equality, power-of-two sizing, or a packing-density target. Inspect existing PBR state before replacing channels. Keep color/normal/height/MER identity deterministic.\n",
)

# Animation reasoning: learn motion semantics, not density/curve presets; make real gaps explicit.
replace_once(
    ".agents/skills/blockit-bedrock-animation/SKILL.md",
    "A small **diagnostic pose/playback** may test pivot, attachment, or transform direction. If material geometry/hierarchy/pivots change, **consider animation on the affected bones stale** until affected keyframes, arcs, attachments, clipping, and neutral return are rechecked.\n\n## Direct Animation Surface\n",
    "A small **diagnostic pose/playback** may test pivot, attachment, or transform direction. If material geometry/hierarchy/pivots change, **consider animation on the affected bones stale** until affected keyframes, arcs, attachments, clipping, and neutral return are rechecked.\n\nProfessional motion has no keyframe-count, FPS, or Bezier-complexity target. Choose interpolation, snapping/FPS, loop mode, and participating bones from the motion; coordinated semantic motion matters more than dense keys.\n\n## Direct Animation Surface\n",
)
replace_once(
    ".agents/skills/blockit-bedrock-animation/SKILL.md",
    "Direct MCP authoring still does not own animation controllers, sound-effect keyframes, timeline-effect keyframes, or bone-binding expressions. Do not fake them through `risky_eval`, generic UI actions, or unrelated export paths.\n",
    "Direct MCP authoring still does not own animation controllers, sound-effect keyframes, timeline-effect keyframes, expression-valued transform keyframes, or bone-binding expressions. Do not fake expression motion by baking arbitrary dense numeric keys, and do not route these gaps through `risky_eval` or generic UI actions.\n",
)

# Public contract: give batch correction parity with the existing single-Cube Box-UV fields.
replace_once(
    "mcp/server/tools/cubes.ts",
    '''    rotation: finiteVec3Schema
      .optional()
      .describe(
        "New rotation in degrees. Activating non-zero rotation requires origin; an already-rotated Cube may reuse its pivot."
      ),
    visibility: z
      .boolean()
      .optional()
      .describe("New Cube visibility."),
''',
    '''    rotation: finiteVec3Schema
      .optional()
      .describe(
        "New rotation in degrees. Activating non-zero rotation requires origin; an already-rotated Cube may reuse its pivot."
      ),
    uv_offset: finiteVec2Schema
      .optional()
      .describe("Finite box-UV offset [u,v] for this Cube."),
    autouv: z
      .enum(["0", "1", "2"])
      .optional()
      .describe("Auto UV setting: 0 disabled, 1 enabled, 2 relative."),
    mirror_uv: z.boolean().optional().describe("Whether to mirror Box UVs."),
    visibility: z
      .boolean()
      .optional()
      .describe("New Cube visibility."),
''',
)
replace_once(
    "mcp/server/tools/cubes.ts",
    '''      update.to !== undefined ||
      update.rotation !== undefined ||
      update.visibility !== undefined,
''',
    '''      update.to !== undefined ||
      update.rotation !== undefined ||
      update.uv_offset !== undefined ||
      update.autouv !== undefined ||
      update.mirror_uv !== undefined ||
      update.visibility !== undefined,
''',
)
replace_once(
    "mcp/server/tools/cubes.ts",
    '"Each update must change at least one authored field: origin, from, to, rotation, or visibility.",',
    '"Each update must change at least one authored field: origin, from, to, rotation, uv_offset, autouv, mirror_uv, or visibility.",',
)
replace_once(
    "mcp/server/tools/cubes.ts",
    '"1-32 explicit Cube transform/visibility updates applied in one Undo unit."',
    '"1-32 explicit Cube transform/Box-UV/visibility updates applied in one Undo unit."',
)
replace_once(
    "mcp/server/tools/cubes.ts",
    '"Applies 1-32 unique UUID-targeted Cube corrections in one Undo unit after full preflight. Unsupported fields and same-value targets fail before Undo; pivot, rotation, finite-span, and per-Cube before/after `geometry_effect` rules remain explicit. Execution success does not mean the geometry was corrected visually.",',
    '"Applies 1-32 unique UUID-targeted Cube transform/Box-UV/visibility corrections in one Undo unit after full preflight. Unsupported fields and same-value targets fail before Undo; per-Cube before/after `geometry_effect` remains explicit. Execution success is not visual approval.",',
)
replace_once(
    "mcp/server/tools/cubes.ts",
    '''            ...(update.rotation !== undefined ? { rotation: update.rotation } : {}),
            ...(update.visibility !== undefined
              ? { visibility: update.visibility }
              : {}),
''',
    '''            ...(update.rotation !== undefined ? { rotation: update.rotation } : {}),
            ...(update.uv_offset !== undefined ? { uv_offset: update.uv_offset } : {}),
            ...(update.autouv !== undefined
              ? { autouv: Number(update.autouv) as 0 | 1 | 2 }
              : {}),
            ...(update.mirror_uv !== undefined ? { mirror_uv: update.mirror_uv } : {}),
            ...(update.visibility !== undefined
              ? { visibility: update.visibility }
              : {}),
''',
)
replace_once(
    "mcp/server/tools/cubes.ts",
    '''      const effectiveGeometryTargets = effects.filter(
        ({ geometry_effect }) => geometry_effect.changed_fields.length > 0
      ).length;
''',
    '''      const geometryVisibilityFields = new Set([
        "from",
        "to",
        "origin",
        "rotation",
        "visibility",
      ]);
      const effectiveGeometryTargets = effects.filter(({ geometry_effect }) =>
        geometry_effect.changed_fields.some((field) =>
          geometryVisibilityFields.has(field)
        )
      ).length;
''',
)

# Regression coverage for the same existing tool, plus reasoning invariants.
replace_once(
    "mcp/tests/model-effectiveness-correction-accuracy.test.ts",
    '''    expect(
      modifyCubesBatchParameters.safeParse({
        updates: [{ id: "a", name: "renamed" }],
      }).success
    ).toBe(false);
''',
    '''    expect(
      modifyCubesBatchParameters.safeParse({
        updates: [
          { id: "a", uv_offset: [8, 16], autouv: "0", mirror_uv: true },
        ],
      }).success
    ).toBe(true);
    expect(
      modifyCubesBatchParameters.safeParse({
        updates: [{ id: "a", name: "renamed" }],
      }).success
    ).toBe(false);
''',
)
replace_once(
    "mcp/tests/model-effectiveness-correction-accuracy.test.ts",
    '''  test("Cube authoring rejects finite endpoints that produce non-finite size", () => {
''',
    '''  test("batch Cube correction carries existing Box-UV authored state without a new tool", async () => {
    const cubes = await source("server/tools/cubes.ts");
    expect(cubes).toContain("update.uv_offset");
    expect(cubes).toContain("update.autouv");
    expect(cubes).toContain("update.mirror_uv");
    expect(cubes).toContain("geometryVisibilityFields");
    expect(cubes).not.toContain("professional_uv");
  });

  test("Cube authoring rejects finite endpoints that produce non-finite size", () => {
''',
)
replace_once(
    "mcp/tests/model-effectiveness-professional-construction.test.ts",
    '''    expect(geometry).toContain("unit-Cube staircasing");
''',
    '''    expect(geometry).toContain("unit-Cube staircasing");
    expect(geometry).toContain("Locator intent");
    expect(geometry).toContain("positive-only or fixed-value rule");
''',
)
replace_once(
    "mcp/tests/model-effectiveness-sequencing.test.ts",
    '''  test("sequencing hardening remains decision-layer only", async () => {
''',
    '''  test("professional texture and animation evidence improves reasoning without density presets", async () => {
    const texturing = await source("../.agents/skills/blockit-bedrock-texturing/SKILL.md");
    const animation = await source("../.agents/skills/blockit-bedrock-animation/SKILL.md");
    const texturePolicy = await source("../docs/foundation/06-texture-standard.md");

    expect(texturing).toContain("Box-UV Cubes");
    expect(texturing).toContain("modify_cubes_batch");
    expect(texturing).toContain("Logical project UV resolution and bitmap pixel dimensions are separate facts");
    expect(texturePolicy).toContain("Box UV / Atlas Authoring");
    expect(texturePolicy).toContain("packing-density score");

    expect(animation).toContain("no keyframe-count, FPS, or Bezier-complexity target");
    expect(animation).toContain("expression-valued transform keyframes");
    expect(animation).toContain("Do not fake expression motion");
  });

  test("sequencing hardening remains decision-layer only", async () => {
''',
)

# Validation report: add forensic proof without activating local execution.
replace_once(
    "docs/foundation/validation-report.md",
    "**Scope:** current `Local` source, accepted 2026-08-12 Codex + Blockbench functional evidence, P0–P7 modelling/evaluation contracts, minimal Reference Generator route, professional modelling reasoning, `place_cube` creation completeness, and current-state synchronization.\n",
    "**Scope:** current `Local` source, accepted 2026-08-12 Codex + Blockbench functional evidence, P0–P7, Reference Generator, professional geometry/texturing/animation sample forensics, bounded Box-UV batch parity, and current-state synchronization.\n",
)
replace_once(
    "docs/foundation/validation-report.md",
    "## Minimal Reference Generator\n",
    "## Professional Sample Forensics — Static / Non-Local\n\nNine supplied professional `.bbmodel` files were inspected as learning evidence only. Static evidence supports purposeful transform ownership, plane-like Cubes, signed/local `inflate`, Locator-owned functional anchors, Box-UV/manual atlas state, and motion semantics that avoid keyframe/FPS/curve-density targets.\n\nTexturing evidence reproduced one narrow contract mismatch: `modify_cube` owned `uv_offset` / `mirror_uv` / `autouv`, while `modify_cubes_batch` did not. The existing batch tool now owns those same Box-UV fields; no new UV tool, packer, score, preset, or profile was introduced.\n\nAnimation samples also prove production gaps for animation controllers, sound-effect keyframes, and expression-valued transform keyframes. They remain **deferred capability gaps**, not permission to fake or auto-bake them. No local run is active.\n\nDetailed evidence: `docs/knowledge/reviews/professional-sample-forensic-audit-2026-08-13.md`.\n\n## Minimal Reference Generator\n",
)

# Active continuation: explicitly preserve the user's non-local boundary.
Path("docs/knowledge/next-action.md").write_text(r'''# Next Action

Updated: 2026-08-13

This is the **single active repository-continuation snapshot**. Root `AGENTS.md` owns routing; `flow.md` owns detailed task/product sequence; `docs/foundation/validation-report.md` owns proof state.

## Status

```text
PROFESSIONAL_SAMPLE_FORENSIC_AUDIT_AND_UV_BATCH_PARITY_COMPLETE
```

Working branch: **`Local` only**.

The user explicitly does **not** want a local Codex/Blockbench test yet. `NO LOCAL RUN ACTIVE`.

Professional `.bbmodel` samples remain learning evidence only. They never become presets, asset classes, anatomy rules, target Cube/keyframe counts, UV templates, hierarchy-depth targets, copied transforms, or complexity targets.

Do not claim live Blockbench/model-quality improvement without actual runtime proof.

## Retained State

```text
P0–P4  routing / deferred loading / bounded recovery / defect navigation
P5     semantic form / orientation / pivot / contact
P6     actual-reference grounding + claim/view locking
P7     qualitative correction convergence + evaluation integrity
REF    assisted intake + pre-generation readiness
PRO-1  representation + transform ownership + primary hierarchy + identity-weighted detail
PRO-2  professional authoring expressiveness validation
PRO-3  place_cube per-element parent + initial inflate
PRO-4  nine-sample geometry / texturing / animation forensic audit
PRO-5  existing modify_cubes_batch Box-UV parity
```

No P8 architecture, professional preset/profile, asset classifier, auto-packer, geometry planner, rig generator, router, scorer, or new authoring mode was added.

## Forensic Result

### Geometry

Current reasoning already covers the important professional patterns. Added only two missing semantics:

- `inflate` sign/magnitude is a local layer relationship, not a positive/fixed preset;
- required non-visible effect/hold/attachment anchors are Locator intent, not hidden placeholder Cubes.

No new geometry tool is justified.

### Texturing / UV

Across the supplied samples:

```text
538 / 538 Cubes use Box UV
538 / 538 final Cubes use autouv = 0
516 / 538 store explicit uv_offset
134 / 538 use mirror_uv
```

Professional Box-UV layout is therefore intentional authored state. `modify_cubes_batch` now has parity with the existing single-Cube fields:

```text
uv_offset
mirror_uv
autouv
```

This remains one existing tool. No UV planner/packer, packing score, texture preset, or generic per-Cube texture selector was added.

The samples also prove that logical project UV resolution may differ from bitmap dimensions. That observation alone does **not** justify a new project-resolution field; exact creation ownership remains unproven.

### Animation

Five of nine samples are static. The four animated samples contain 103 clips, 21 controllers, 3,516 keyframes, and overwhelmingly linear interpolation. Therefore professional quality does not imply dense curves, one FPS, one loop mode, or a keyframe target.

Static evidence also proves three direct production gaps:

```text
expression-valued transform keyframes
sound-effect keyframes
animation controllers
```

They are **DEFERRED**, not implemented here. Do not fake expression motion by arbitrary dense numeric baking. Mapped particle effects remain already supported.

Full evidence: `docs/knowledge/reviews/professional-sample-forensic-audit-2026-08-13.md`.

## CI / Surface Proof

The retained repository gate must pass:

```text
frozen install
→ typecheck
→ tests
→ measure:surface
→ build
→ docs:check
```

Fresh serialized metrics after PRO-5:

```text
__SURFACE_METRICS_PENDING__
```

These are serialized characters, not model-visible token measurements.

## Evidence Boundary

`CURRENT-PROJECT VERIFIED` after CI for source/static semantics: forensic counts, current reasoning/policy, Box-UV batch schema/execution contract, generated docs, and surface/build/test gates.

`LOCAL PROOF REQUIRED` remains for native Blockbench persistence/visual behavior, real call reduction, and whether the revised reasoning creates visibly better models.

## Explicitly Deferred

Do not implement without a separate bounded requirement:

- animation controllers;
- sound/timeline-effect keyframes;
- expression-valued transform keyframes;
- new project logical-UV resolution control;
- UV auto-packer / UV-density score;
- PBR expansion from these samples;
- Group batch creation / rig generator;
- professional presets or asset classes.

## Next Step

```text
NON-LOCAL NEXT — ANIMATION GAP PRIORITIZATION
```

Inspect the three sample-evidenced animation gaps **one at a time**, starting with expression-valued transform keyframes. Determine whether an existing keyframe contract can support it narrowly and safely. If it requires an evaluator/controller framework, defer it. Do not start local Codex/Blockbench acceptance until the user explicitly reactivates it.
''')
