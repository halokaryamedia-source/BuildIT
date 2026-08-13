from pathlib import Path


def replace_once(path: str, old: str, new: str) -> None:
    p = Path(path)
    text = p.read_text()
    if old not in text:
        raise SystemExit(f"Expected text not found in {path}: {old[:160]!r}")
    p.write_text(text.replace(old, new, 1))


animation = "mcp/server/tools/animation.ts"
replace_once(
    animation,
    '''const finiteCreateAnimationVector3Schema = z
  .array(z.number().finite())
  .length(3);

const bedrockBoneKeyframeSchema = z.object({''',
    '''const finiteCreateAnimationVector3Schema = z
  .array(z.number().finite())
  .length(3);

const molangTransformStringSchema = z
  .string()
  .refine((value) => value.trim().length > 0, {
    message: "Molang transform strings must contain a non-whitespace authored value.",
  })
  .describe("Explicit non-empty Molang transform value preserved as authored text; BlockIT does not evaluate it.");

const manageTransformValueSchema = z.union([
  z.number().finite(),
  molangTransformStringSchema,
]);

const manageTransformVector3Schema = z
  .array(manageTransformValueSchema)
  .length(3);

const bedrockBoneKeyframeSchema = z.object({''',
)
replace_once(
    animation,
    '''  values: z
    .union([finiteCreateAnimationVector3Schema, z.number().finite()])
    .optional()
    .describe("Finite [x,y,z] values, or a finite uniform scalar."),''',
    '''  values: z
    .union([manageTransformVector3Schema, manageTransformValueSchema])
    .optional()
    .describe("Authored [x,y,z] or uniform transform value. Each axis may be a finite number or explicit non-empty Molang string; strings are preserved, never evaluated by BlockIT."),''',
)
replace_once(
    animation,
    '''    description:
      "Creates a new Bedrock animation from authored transform values. Accepts a short name such as `walk` or canonical `animation.walk`; the Bedrock prefix is applied exactly once.",''',
    '''    description:
      "Creates a new Bedrock animation from finite numeric transform values. Accepts `walk` or canonical `animation.walk`; the Bedrock prefix is applied once. Use manage_keyframes for explicit Molang transform strings.",''',
)
replace_once(
    animation,
    '''    description:
      "Creates, deletes, edits, or selects explicit keyframe targets for one bone/channel. Edit omission preserves existing interpolation; non-create actions require each requested time to resolve uniquely before Undo/selection.",''',
    '''    description:
      "Creates, deletes, edits, or selects explicit keyframes for one bone/channel. Transform values may be finite numbers or authored Molang strings; BlockIT preserves strings without evaluating them. Non-create times resolve uniquely before mutation/selection.",''',
)
replace_once(
    animation,
    '''      const applyValues = (
        keyframe: _Keyframe,
        values: number | number[] | undefined
      ) => {''',
    '''      const applyValues = (
        keyframe: _Keyframe,
        values: number | string | Array<number | string> | undefined
      ) => {''',
)

# Targeted regression: existing manage_keyframes gains string preservation while
# create_animation keeps its bounded numeric codec contract.
test_path = "mcp/tests/animation-mutation-contract.test.ts"
replace_once(
    test_path,
    '''  animationCopyPasteParameters,
  animationTimelineParameters,''',
    '''  animationCopyPasteParameters,
  animationTimelineParameters,
  createAnimationParameters,''',
)
replace_once(
    test_path,
    '''  test("timeline loop requires an explicit loop mode", () => {''',
    '''  test("manage_keyframes preserves explicit Molang transform strings without widening create_animation", async () => {
    const expression = "math.sin(query.life_time*180)*2";
    expect(
      manageKeyframesParameters.safeParse({
        action: "create",
        bone_name: "root",
        channel: "rotation",
        keyframes: [{ time: 0, values: [expression, 0, "-variable.attack_body_rot_y"] }],
      }).success
    ).toBe(true);
    expect(
      manageKeyframesParameters.safeParse({
        action: "edit",
        bone_name: "root",
        channel: "scale",
        keyframes: [{ time: 1, values: expression }],
      }).success
    ).toBe(true);
    expect(
      manageKeyframesParameters.safeParse({
        action: "create",
        bone_name: "root",
        channel: "rotation",
        keyframes: [{ time: 0, values: ["   ", 0, 0] }],
      }).success
    ).toBe(false);
    expect(
      createAnimationParameters.safeParse({
        name: "expression_probe",
        bones: { root: [{ time: 0, rotation: [expression, 0, 0] }] },
      }).success
    ).toBe(false);

    const [animationSource, inspectionSource] = await Promise.all([
      Bun.file("server/tools/animation.ts").text(),
      Bun.file("server/tools/animation-inspection.ts").text(),
    ]);
    expect(animationSource).toContain("values: number | string | Array<number | string> | undefined");
    expect(animationSource).not.toContain("MolangParser.parse(");
    expect(animationSource).not.toContain("risky_eval");
    expect(inspectionSource).toContain("keyframe.getArray(index)");
  });

  test("timeline loop requires an explicit loop mode", () => {''',
)

# Compact specialist reasoning: expressions are authored state, not an excuse to
# add an evaluator or dense numeric baking.
skill = ".agents/skills/blockit-bedrock-animation/SKILL.md"
replace_once(
    skill,
    '''Professional motion has no keyframe-count, FPS, or Bezier-complexity target. Choose interpolation, snapping/FPS, loop mode, and participating bones from the motion; coordinated semantic motion matters more than dense keys.''',
    '''Professional motion has no keyframe/FPS/Bezier target. Choose timing, interpolation, loop, and bones from the motion. `manage_keyframes` preserves explicit Molang transform strings; never evaluate or guess-bake them.''',
)
replace_once(
    skill,
    '''Direct MCP authoring still does not own animation controllers, sound-effect keyframes, timeline-effect keyframes, expression-valued transform keyframes, or bone-binding expressions. Do not fake expression motion by baking arbitrary dense numeric keys, and do not route these gaps through `risky_eval` or generic UI actions.''',
    '''Controllers, sound/timeline-effect keyframes, and bone-binding expressions remain protected gaps. Do not route them through `risky_eval` or generic UI actions.''',
)

workflow = "mcp/prompts/bedrock_entity_workflow.md"
replace_once(
    workflow,
    '''TextureMesh, visible bounding-box fields, animation controllers, sound/timeline effects, expression-valued transform keyframes, animated textures, and bone-binding expressions remain gaps; do not fake them. Native Bedrock PBR and per-face `material_instance` are **not** gaps.''',
    '''Molang transform strings use `manage_keyframes`; MCP never evaluates them. TextureMesh, visible bounding boxes, animation controllers, sound/timeline effects, animated textures, and bone-binding expressions remain gaps; do not fake them. Native PBR/material instances are not gaps.''',
)

# Current ownership map: expression strings are now inside the existing keyframe lane.
implementation = "docs/knowledge/implementation-map.md"
replace_once(
    implementation,
    '''Animation tools own identity, focused inspection, keyframes, graph/batch/copy, rigging, and playback/timeline. Controllers and unsupported sound/timeline-effect authoring remain protected gaps.''',
    '''Animation tools own identity, focused inspection, numeric or explicit Molang transform keyframes, graph/batch/copy, rigging, and playback/timeline. `manage_keyframes` preserves Molang strings without evaluating them. Controllers and unsupported sound/timeline-effect authoring remain protected gaps.''',
)
replace_once(
    implementation,
    '''PRO-3  place_cube per-element parent + initial inflate creation completeness
DOC    current-state synchronization''',
    '''PRO-3  place_cube per-element parent + initial inflate creation completeness
PRO-4  nine-sample geometry/texturing/animation forensic audit
PRO-5  modify_cubes_batch Box-UV parity
PRO-6  manage_keyframes authored Molang transform-string support
DOC    current-state synchronization''',
)

validation = "docs/foundation/validation-report.md"
replace_once(
    validation,
    '''Current contracts retain animation identity, summary/focused inspection, keyframes, graph/batch/copy, rigging, and playback/timeline. Representative create/inspect/keyframe/timeline/playback is accepted live baseline.

Controllers and unsupported sound/timeline-effect mappings remain protected gaps.''',
    '''Current contracts retain animation identity, summary/focused inspection, keyframes, graph/batch/copy, rigging, and playback/timeline. `manage_keyframes` now accepts finite numeric values or explicit authored Molang transform strings and preserves strings without BlockIT evaluation. `create_animation` intentionally remains numeric-only. Representative create/inspect/keyframe/timeline/playback remains the accepted live baseline; the new expression path is source/CI proof only.

Controllers and unsupported sound/timeline-effect mappings remain protected gaps.''',
)
replace_once(
    validation,
    '''Current non-local source/contracts are synchronized through **P0–P7 + the minimal Reference Generator route + professional modelling Phase 1–3**.''',
    '''Current non-local source/contracts are synchronized through **P0–P7 + the minimal Reference Generator route + professional PRO-1–PRO-6**.''',
)

# Preserve the forensic audit as historical evidence, with a follow-up resolution note.
forensic = Path("docs/knowledge/reviews/professional-sample-forensic-audit-2026-08-13.md")
text = forensic.read_text()
if "## Follow-up — PRO-6 Expression Keyframes" not in text:
    forensic.write_text(text.rstrip() + '''\n\n---\n\n## Follow-up — PRO-6 Expression Keyframes\n\nThe 361 non-numeric transform-axis strings were rechecked separately from numeric strings. They include `math.*`, `query.*` / `q.*`, `variable.*` / `v.*`, `this`, and conditional expressions. Current Blockbench keyframe state natively stores transform components as Molang-capable values.\n\nBlockIT therefore resolves this gap narrowly through existing `manage_keyframes` create/edit state:\n\n```text\nfinite number             → authored numeric value\nnon-empty Molang string   → preserve authored string\nBlockIT evaluation        → never\ncreate_animation strings  → still rejected; initial codec payload remains numeric-only\n```\n\nThis is not a Molang parser/evaluator and does not add a tool. `inspect_animation` already reads keyframe arrays without coercing expression strings. Animation controllers and sound/timeline-effect keyframes remain separate gaps.\n''')

# New bounded decision record.
Path("docs/knowledge/reviews/professional-animation-expression-keyframes-2026-08-13.md").write_text('''# Professional Animation Expression Keyframes — PRO-6\n\nDate: 2026-08-13  \nScope: supplied professional `.bbmodel` evidence + current `Local` keyframe source + official Blockbench keyframe semantics  \nExecution channel: ChatGPT → GitHub/static only  \nStatus: **IMPLEMENT NARROW STRING PRESERVATION; NO EVALUATOR**\n\n## Evidence\n\nThe supplied animated samples contain 361 transform-axis values that are non-numeric strings: 165 in Anky and 196 in the Katana/player-integration sample. The expressions use normal Molang-style constructs such as `math.*`, `query.*` / `q.*`, `variable.*` / `v.*`, `this`, and a small number of conditional expressions.\n\nThey are authored animation values, not JavaScript instructions for BlockIT.\n\nCurrent BlockIT already has the correct mutation owner: `manage_keyframes`. Its runtime path calls native `_Keyframe.set()`, while `inspect_animation` returns `keyframe.getArray()` values. The missing boundary was only the numeric-only Zod schema/type annotation.\n\n`create_animation` is different: it constructs a Bedrock JSON payload and performs numeric authored-space → file-space sign conversion before native codec import. Supporting expressions there would require expression-safe file-space inversion. That is not necessary to close the basic authoring gap because `manage_keyframes` can create/edit transform keyframes after an animation exists.\n\n## Minimal Contract\n\n`manage_keyframes.keyframes[].values` accepts:\n\n```text\nfinite number\n[number|string, number|string, number|string]\nnon-empty scalar Molang string\n```\n\nString values are passed to native keyframe state unchanged. BlockIT does not parse or evaluate them. Whitespace-only strings are rejected.\n\n`create_animation` remains numeric-only. Bezier-handle arrays remain numeric-only.\n\n## Safety / Non-goals\n\nDo not add:\n\n- `eval`, `risky_eval`, or a Molang evaluator;\n- arbitrary numeric baking as a substitute for expressions;\n- animation-controller support;\n- sound/timeline-effect support;\n- a new animation tool or expression profile.\n\n## Acceptance\n\n- explicit Molang transform strings pass `manage_keyframes` create/edit schema;\n- whitespace-only strings fail;\n- `create_animation` still rejects expression transform payloads;\n- inspection preserves authored strings;\n- typecheck/tests/build/docs freshness and existing surface budgets pass.\n''')

# Compact continuation. Metrics are filled after the measured CI pass.
Path("docs/knowledge/next-action.md").write_text('''# Next Action\n\nUpdated: 2026-08-13\n\nSingle active repository-continuation snapshot. Root `AGENTS.md` owns routing; `flow.md` owns detailed product sequence; `docs/foundation/validation-report.md` owns proof state.\n\n## Status\n\n```text\nPROFESSIONAL_ANIMATION_EXPRESSION_KEYFRAMES_PRO6_IMPLEMENTED_AWAITING_VERIFY\n```\n\nWorking branch: **`Local` only**.\n\nThe user explicitly does **not** want local Codex/Blockbench testing yet. `NO LOCAL RUN ACTIVE`. Professional samples remain learning evidence, never presets/templates/count targets.\n\n## Retained State\n\n```text\nP0–P7  existing routing / grounding / convergence contracts\nREF    assisted reference intake/readiness\nPRO-1  professional construction reasoning\nPRO-2  authoring expressiveness validation\nPRO-3  place_cube parent + initial inflate completeness\nPRO-4  geometry/texturing/animation forensic audit\nPRO-5  modify_cubes_batch Box-UV parity\nPRO-6  manage_keyframes explicit Molang transform-string preservation\n```\n\nNo P8 architecture, preset/profile, evaluator, planner, controller framework, new tool family, or local test was added.\n\n## PRO-6 Contract\n\n`manage_keyframes` create/edit may author finite numbers or non-empty Molang strings in transform values. Strings are preserved into native `_Keyframe` state; BlockIT never evaluates them. `inspect_animation` already returns authored `getArray()` values.\n\n`create_animation` intentionally remains numeric-only because it owns a separate codec/file-space conversion path. Expression support there is not required for the bounded gap.\n\n## Still Deferred\n\n```text\nanimation controllers\nsound-effect keyframes\ntimeline-effect keyframes\nbone-binding expressions\n```\n\nDo not fake them with `risky_eval`, generic UI automation, arbitrary numeric baking, or a new framework.\n\n## Verification Boundary\n\nRequired retained GitHub gate:\n\n```text\nfrozen install → typecheck → tests → measure:surface → build → docs:check\n```\n\nStatic/CI proof can establish schema/type/result/docs consistency only. Native expression persistence, preview evaluation, Bedrock export semantics, and visual motion quality remain `LOCAL PROOF REQUIRED` if local testing is later reactivated.\n\n## Next Step\n\nAfter PRO-6 verification, continue **non-local** with `SOUND_EFFECT_KEYFRAME_GAP_PRIORITIZATION`. Inspect whether the existing `EffectAnimator`/keyframe contract can support sound authoring narrowly. If it requires unrelated media/runtime framework expansion, defer it. Do not start local testing.\n''')
