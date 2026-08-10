from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def read(rel: str) -> str:
    return (ROOT / rel).read_text(encoding="utf-8")


def write(rel: str, text: str) -> None:
    (ROOT / rel).write_text(text, encoding="utf-8")


def replace_once(rel: str, old: str, new: str) -> None:
    text = read(rel)
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f"Expected exactly one target in {rel}, found {count}: {old[:120]!r}")
    write(rel, text.replace(old, new, 1))


# ---------------------------------------------------------------------------
# Canonical prompt: keep hard invariants, remove duplicated specialist detail.
# ---------------------------------------------------------------------------
prompt_path = "mcp/prompts/bedrock_entity_workflow.md"
old_prompt = read(prompt_path)
if len(old_prompt) < 19000 or "## Reference Fidelity Verdict" not in old_prompt:
    raise RuntimeError("Unexpected canonical prompt baseline; refusing broad replacement.")

compact_prompt = r'''# Minecraft Bedrock Entity Workflow

Create or revise a clean, editable Minecraft Bedrock **Entity** model in Blockbench.

## Product boundary

- Use Blockbench format ID `bedrock`, not `bedrock_block` or another format.
- Cubes are the normal geometry primitive; Groups are bones/organization when needed.
- The user brief and approved reference are the modelling authority.
- Tool success, valid coordinates, connected Cubes, or a validator pass are not visual proof.
- Preserve native Bedrock Entity capability. Do not replace unsupported native features with generic Mesh, UI automation, risky evaluation, or another format.

## Minimum necessary evidence

Keep validity strict and calls sparse. Use a tool, inspection, capture, resource, or specialist only when its result can change the next modelling decision or prove an in-scope completion claim.

- Do not inspect each newly placed Cube or capture after every mutation.
- Do not re-read project/outline/resource state already known unless it may have changed.
- Use `inspect_model_bounds` only for numeric envelope, scale, ground, displacement, or gross-placement questions. Otherwise skip it.
- Capture only reference-corresponding views needed for the current gate; after a local correction, re-capture only affected view(s).
- `UNVERIFIED` is not a retry command. Do not spend additional calls trying to remove UNVERIFIED unless the missing evidence can change the next decision and is plausibly obtainable.
- Load texture or animation specialist instructions only when that stage is reached.

## Reference and primary form

Orient before mutation. For an existing or uncertain project, use `get_project_info` and targeted discovery only as needed. Establish X=width, Y=height, Z=front/back length, `front_direction` when relevant, and ground relationship when it matters.

Treat the reference as one 3D object. For material width/height/depth, primary placement, orientation/slope, or visible contact claims, keep the smallest useful evidence state:

```text
SUPPORTED | PROVISIONAL | CONFLICTING | UNAVAILABLE
```

- **SUPPORTED**: relevant reference view(s) directly constrain the claim.
- **PROVISIONAL**: a temporary working value is needed but evidence is incomplete.
- **CONFLICTING**: relevant views materially disagree.
- **UNAVAILABLE**: required evidence cannot be observed.

Do not transfer confidence between axes. A front-view match cannot certify depth. Conflicting primary-form evidence must not be averaged into invented geometry; if the brief/user intent cannot resolve a material conflict, use `BLOCKED`.

Before exact Cube transforms, keep a compact Primary Form Hypothesis: primary masses, relative size/placement, important orientation/contact, and only material uncertainty. Expand it only for genuinely ambiguous/complex references.

## Build and primary gate

Build the coarse whole form from that hypothesis. Each primary Cube must represent a required primary mass or necessary split. Use explicit finite `from`/`to`; rotated Cubes require an intentional pivot/origin. Explicit Group or Texture references must resolve deterministically before mutation.

A successful `place_cube`, `modify_cube`, or `modify_cubes_batch` call is **execution** evidence only. Mutation results use `visual_verdict: not_evaluated`; authored state being applied is not reference approval. Do not chain Cube placement based on previous tool success. Once primary masses are represented well enough to judge, **stop** primary placement and run the visual gate before secondary detail.

An under-constrained extent remains a working hypothesis, not verified reference evidence, even after successful placement.

Use rotation only when the form or required motion justifies it. Non-zero Cube rotation needs an intentional pivot; do not use rotation to hide wrong size/placement. Purely organizational Groups should keep neutral pivot/rotation unless a joint, attachment, or transform reason requires otherwise.

If numeric target dimensions exist or scale/ground/gross placement is in doubt, use `inspect_model_bounds`; otherwise skip it. Bounds are structural evidence only.

Use `capture_model_views` for the minimum corresponding canonical views needed to judge the current question. Use explicit framing only when an approved numeric target envelope exists. The capture tool observes; it does not compare, score, or approve.

## Difference-first visual verdict

At each material visual gate, compare reference ↔ model **difference-first**. Check applicable silhouette, primary proportions, mass placement, orientation/slope, and visible contacts before praising the result.

The verdict is exactly one of:

```text
FAIL
UNVERIFIED
PASS
```

- **FAIL**: a critical/major mismatch is visible. Name the mismatch and supporting view(s).
- **UNVERIFIED**: evidence required for the claim is missing, ambiguous, conflicting, or unavailable.
- **PASS**: fresh corresponding model/reference evidence shows no critical/major mismatch in the applicable criteria.

A convincing front view is not a full 3D PASS when side/depth evidence is missing or fails. Missing evidence never becomes PASS by plausibility.

If several primary relationships fail together or the object is not recognizable, revise/rebuild the primary hypothesis instead of micro-patching a bad scaffold.

## Local correction accuracy

For a local mismatch on an otherwise sound form:

1. Locate the exact target UUID only if needed.
2. `inspect_element` before numeric correction and use the authored state it returns.
3. Diagnose one causal class: `TRANSLATE`, `RESIZE`, `ROTATE`, hierarchy `REATTACH`, `SPLIT`, `MERGE/REMOVE`, or `ADD MASS` only when a required visible volume is genuinely missing.
4. Declare the invariant and expected structural effect before mutation.
5. Use `modify_cube` for one target or `modify_cubes_batch` for one coherent multi-Cube cause.
6. Check returned `geometry_effect` before visual re-observation.
7. Re-capture only affected view(s).

Common invariants:

- `TRANSLATE` → size stays fixed; center moves intentionally.
- `RESIZE` → name the changed axis and the anchor/center/contact that stays fixed.
- `ROTATE` → do not rewrite size just to change angle; use a justified pivot.
- hierarchy REATTACH → if no supported direct reparent owner exists, use `BLOCKED`; never fake hierarchy with coordinate movement.

A structurally wrong effect or no effective geometry/visibility change is not correction progress, even when the tool call succeeds.

If the same causal correction direction fails twice without new evidence, stop speculative mutation and use `BLOCKED` or revise the hypothesis when new evidence actually exists.

## BLOCKED is a workflow outcome

`FAIL / UNVERIFIED / PASS` describe visual evidence. `BLOCKED` means the task cannot validly continue with current evidence/capability without guessing or repeating failed work.

Use `BLOCKED` for unresolved material cross-view conflict, required observation that remains unavailable after one useful controlled retry, repeated same-cause correction failure, unavailable required supported capability, or any situation where continuing would require presenting provisional geometry as verified.

A blocker report states the blocker, concrete evidence/error, affected claim, bounded attempts already made, and exactly what new evidence/user decision/capability is needed. Do not keep changing coordinates merely to avoid reporting a blocker.

## Secondary geometry, texture, and animation

Only after primary-form `PASS` should secondary geometry/hierarchy/pivots be added. Complete geometry review must still pass the surfaces/relationships required by downstream work.

For end-to-end reference-driven creation, do not start **production** texture/UV/PBR/material work until the geometry it depends on is `PASS`. Do not start **production** animation until the required geometry baseline is accepted and participating hierarchy/pivots are inspected and suitable. A material `FAIL` returns upstream; a required unresolved `UNVERIFIED` claim becomes `BLOCKED` rather than being hidden by texture or motion.

For texture-only or animation-only work on an existing asset, current geometry may be the user-provided baseline when remodelling is outside scope; that does not certify reference fidelity. Placeholder texture or diagnostic pose/playback is provisional only.

After material geometry/hierarchy/pivot changes, revalidate only affected downstream texture/UV/material or animation/keyframe/attachment assumptions. Downstream sunk cost never authorizes keeping geometry the geometry gate rejects.

## Locator / Null Object authored state

Use `list_locator_elements` for identity discovery and `inspect_element` for focused authored state. `manage_locator` owns native Bedrock Locator parent/position/rotation/`ignore_inherited_scale`; `manage_null_object` owns the supported Null Object parent/position slice. Use `rename_element` / `remove_element` for rename/delete. Do not replace Locator/Null Object state with arbitrary Cubes or UI automation.

## Protected Native Capability Gaps

Current protected native Bedrock gaps include TextureMesh authoring/inspection, native visible bounding-box fields, animation controllers, animation sound/timeline effects, animated-texture authoring, and bone-binding expressions.

When a requested protected capability lacks a direct MCP owner, preserve existing authored data, state the gap, and keep work bounded to supported operations. A broad resource such as `nodes://` is observability, not authored native support.

Native Bedrock PBR and per-face `material_instance` are **not** gaps; use the dedicated tools when needed.

## Export boundary

Normal BlockIT model outputs are:

- `bedrock` — native Minecraft Bedrock geometry JSON;
- `project` — editable Blockbench `.bbmodel`.

Bedrock animation/controller files belong to the separate Bedrock AnimationCodec surface; do not substitute arbitrary OBJ/glTF/model codecs.

## Tool and resource routing

The catalog is capability, not a checklist. Stay in the smallest active lane:

```text
project/orient → coarse Cube/Group build → relevant views
→ exact inspect/correct only on diagnosed mismatch
→ downstream specialist only after prerequisite gate
→ export only when requested
```

Use Resources for browsing/context when their URI data answers the question. Use focused read-only Tools such as `inspect_element`, `inspect_animation`, or `get_texture` when a modelling decision needs exact authored state or image data. Do not read a Resource and then call an overlapping inspection Tool merely for confirmation.

Selection is for real selection workflows, duplication only for supported repetition/symmetry, validators for structural diagnostics, and checkpoints only when rollback value is meaningful. Do not use `risky_eval`, generic UI automation, generic Mesh/Hytale tooling, or another format as shortcuts.
'''
write(prompt_path, compact_prompt)

# ---------------------------------------------------------------------------
# Factory metadata correctness and stale comments.
# ---------------------------------------------------------------------------
replace_once(
    "mcp/lib/factories.ts",
    ' * Creates a new MCP tool and registers it with the server using the official SDK.\n',
    ' * Stores one MCP tool definition for request-owned server registration.\n',
)
replace_once(
    "mcp/lib/factories.ts",
    ' * Creates a new MCP resource and registers it with the server using the official SDK.\n',
    ' * Stores one MCP resource definition for request-owned server registration.\n',
)
replace_once(
    "mcp/lib/factories.ts",
    ' * Creates a new MCP prompt and registers it with the server using the official SDK.\n',
    ' * Stores one MCP prompt definition for request-owned server registration.\n',
)
replace_once(
    "mcp/lib/factories.ts",
    '    description: toolDef.title,\n',
    '    description: toolDef.description,\n',
)

# ---------------------------------------------------------------------------
# Cube hotspot prose: preserve constraints, remove workflow duplication.
# ---------------------------------------------------------------------------
cube_replacements = [
    (
        '      "Explicit authored Cube start coordinates. Required for initial placement; place_cube never supplies a default geometry extent."\n',
        '      "Required finite Cube start coordinates [x,y,z]."\n',
    ),
    (
        '      "Explicit authored Cube end coordinates. Required for initial placement; place_cube never supplies a default geometry extent."\n',
        '      "Required finite Cube end coordinates [x,y,z]."\n',
    ),
    (
        '        "Intentional Cube pivot/origin. May be omitted for an unrotated Cube. A Cube with any non-zero rotation must provide origin explicitly."\n',
        '        "Cube pivot [x,y,z]. Required for non-zero rotation; optional otherwise."\n',
    ),
    (
        '        "Cube rotation in degrees. Non-zero rotation requires an explicit evidence-backed origin/pivot."\n',
        '        "Cube rotation in degrees [x,y,z]; non-zero rotation requires origin."\n',
    ),
    (
        '        "Exact Cube UUID. Names and selection are intentionally unsupported so a multi-Cube correction cannot silently target the wrong element."\n',
        '        "Exact Cube UUID; names and selection are not accepted for batch correction."\n',
    ),
    (
        '        "New Cube pivot/origin. When origin is the only transform field in this update, the tool treats it as a pivot-only correction and preserves the Cube\'s visual position. When combined with from/to/rotation, it is treated as part of an authored geometry rewrite."\n',
        '        "New pivot. Origin-only preserves visual position; with from/to/rotation it is an authored transform rewrite."\n',
    ),
    (
        '        "New authored Cube rotation in degrees. If the target Cube is currently unrotated and this activates a non-zero rotation, origin must be supplied explicitly in the same update. A Cube that is already rotated may adjust rotation while reusing its existing pivot."\n',
        '        "New rotation in degrees. Activating non-zero rotation requires origin; an already-rotated Cube may reuse its pivot."\n',
    ),
    (
        '      "Array of Cubes to place. Every Cube requires explicit finite from/to extents. Unrotated Cubes may omit origin; every Cube with non-zero rotation must provide an explicit origin/pivot."\n',
        '      "Cubes to place. Each requires finite from/to; rotated Cubes also require origin."\n',
    ),
    (
        '      "Optional texture reference. Omit to keep the existing default-texture behavior. When supplied, UUID is preferred, then exact texture ID, then exact name only when unique; ambiguous or missing references are rejected before Cube creation."\n',
        '      "Optional Texture UUID, exact ID, or unique exact name; unresolved/ambiguous references fail."\n',
    ),
    (
        '      "Exact Group UUID or exact unique name. Omit this field (or pass `root`) only when root placement is intentional."\n',
        '      "Optional Group UUID or unique exact name; omit/use `root` only for intentional root placement."\n',
    ),
    (
        '      "Required Cube target: exact UUID or exact unique name. UUID is preferred. Editor selection is not used as an implicit mutation target."\n',
        '      "Required Cube UUID or unique exact name; selection is never an implicit target."\n',
    ),
    (
        '      "Cube pivot/origin. If supplied without from/to/rotation, this is a pivot-only correction and visual position is preserved. If combined with from/to/rotation, origin is applied as part of the authored geometry rewrite."\n',
        '      "Cube pivot. Origin-only preserves visual position; with from/to/rotation it rewrites the authored transform."\n',
    ),
    (
        '      "Rotation of the Cube. If the target is currently unrotated and this activates a non-zero rotation, provide origin explicitly in the same request. Later rotation adjustments on an already-rotated Cube may reuse its existing pivot."\n',
        '      "Cube rotation. Activating non-zero rotation requires origin; an already-rotated Cube may reuse its pivot."\n',
    ),
    (
        '      "One to 32 explicit per-Cube authored transform/visibility updates applied as one recoverable Undo unit."\n',
        '      "1-32 explicit Cube transform/visibility updates applied in one Undo unit."\n',
    ),
    (
        '      "Places one or more Cubes. Every new Cube must provide explicit finite from/to geometry extents; place_cube does not create a default [0,0,0]→[1,1,1] Cube when geometry was omitted. Unrotated Cubes may omit origin and use the neutral [0,0,0] value; any Cube with non-zero rotation must provide an explicit origin/pivot so a missing pivot cannot silently become [0,0,0]. If `group` is omitted or explicitly `root`, placement is at root. Any other supplied group must resolve by exact UUID or exact unique name before mutation; missing or ambiguous groups fail instead of silently falling back to root. If `texture` is omitted, existing default-texture behavior is preserved. A supplied texture resolves exact UUID first, then exact texture ID, then exact name only when unique; ambiguous or missing references fail before Undo/Cube creation. A successful return confirms only that authored Cube state was applied; it does not evaluate silhouette, proportion, placement quality, or reference fidelity.",\n',
        '      "Places Cubes with explicit finite from/to. Non-zero rotation requires an explicit pivot. Supplied Group/Texture references must resolve uniquely before mutation. Success applies authored state only; visual/reference fidelity is not evaluated.",\n',
    ),
    (
        '      "Modifies one explicit Cube target. `id` is required: UUID is resolved first, otherwise an exact name must be unique; editor selection is never used as an implicit mutation target. Ambiguous names fail instead of modifying multiple Cubes. An origin-only transform change uses Blockbench Cube.transferOrigin so pivot movement preserves visual position; origin combined with from/to/rotation is treated as an authored geometry rewrite. Activating non-zero rotation on a currently unrotated Cube requires explicit origin in the same request; later rotation adjustments may reuse the existing pivot. Auto UV setting: 0 = disabled, 1 = enabled, 2 = relative auto UV. The result includes authored before/after state plus a deterministic `geometry_effect` summary (changed transform fields, center/size/origin/rotation deltas, visibility change) so the caller can verify that the structural effect matches the diagnosed correction invariant. A successful return still does not evaluate whether the Cube is visually correct or matches the reference.",\n',
        '      "Modifies one explicit Cube. UUID is preferred; an exact name must be unique and selection is never implicit. Origin-only uses pivot-transfer semantics; activating non-zero rotation requires origin. Returns before/after authored state and `geometry_effect`; visual/reference fidelity is not evaluated.",\n',
    ),
    (
        '      "Applies one coherent correction across several explicitly identified Cubes in a single recoverable Undo unit. Every target must be an exact Cube UUID and all targets are preflighted before mutation. Each Cube may receive different from/to/origin/rotation/visibility values. Per update, origin without from/to/rotation is a pivot-only transfer that preserves visual position; origin combined with geometry transform fields is an authored rewrite. Activating non-zero rotation on a currently unrotated target requires explicit origin in that update; already-rotated targets may adjust rotation while reusing their existing pivots. If any target fails preflight, the batch does not open Undo. If mutation fails after Undo starts, the edit is cancelled with changes reverted. This tool performs no visual judgement, planning, reparenting, UV work, or automatic correction. Each target result includes authored before/after state plus a deterministic `geometry_effect` summary so unintended structural side effects can be detected before visual approval. A successful return confirms only that the requested authored updates were applied; it does not mean the geometry was corrected visually.",\n',
        '      "Applies 1-32 explicit UUID-targeted Cube corrections in one recoverable Undo unit after full preflight. Origin-only preserves visual position; activating non-zero rotation requires origin. Returns per-Cube before/after state and `geometry_effect`. It performs no planning or visual judgement; success does not mean the geometry was corrected visually.",\n',
    ),
]
for old, new in cube_replacements:
    replace_once("mcp/server/tools/cubes.ts", old, new)

# ---------------------------------------------------------------------------
# Animation hotspots.
# ---------------------------------------------------------------------------
animation_replacements = [
    ('    .describe("Required Bedrock particle effect identifier."),\n', '    .describe("Bedrock particle effect identifier."),\n'),
    ('    .describe("Optional Bedrock locator used to position the particle effect."),\n', '    .describe("Optional Locator name for the particle."),\n'),
    ('      "Optional Bedrock actor-binding flag. Omit for the native default behavior."\n', '      "Optional actor-binding flag; omit for native default."\n'),
    ('    .describe("Optional Molang script evaluated before the particle effect."),\n', '    .describe("Optional pre-effect Molang script."),\n'),
    (
        '    "Bedrock particle effects keyed by complete finite non-negative numeric timestamps. Distinct keys must not resolve to the same numeric time. Each timestamp accepts one particle object or a non-empty array of particle objects."\n',
        '    "Particle effects keyed by unique finite non-negative timestamps; each value is one effect or a non-empty effect array."\n',
    ),
    ('    .describe("Finite non-negative keyframe time in seconds."),\n', '    .describe("Finite keyframe time in seconds (>=0)."),\n'),
    (
        '      "Blockbench-authored position [x, y, z] with finite components. create_animation converts it to Bedrock file space before codec import."\n',
        '      "Authored Blockbench position [x,y,z]; converted internally to Bedrock file space."\n',
    ),
    (
        '      "Blockbench-authored rotation [x, y, z] with finite components. create_animation converts it to Bedrock file space before codec import."\n',
        '      "Authored Blockbench rotation [x,y,z]; converted internally to Bedrock file space."\n',
    ),
    (
        '      "Blockbench-authored finite scale as [x, y, z] or a uniform scalar. Bedrock coordinate conversion leaves scale unchanged."\n',
        '      "Finite scale [x,y,z] or uniform scalar."\n',
    ),
    (
        '    "Transform keyframes with finite non-negative times. Different channels may share a time, but the same channel may be defined only once at each effective time."\n',
        '    "Transform keyframes at finite non-negative times; one value per channel per time."\n',
    ),
    (
        '      "Optional animation length in seconds. Must be finite and within Blockbench\'s 0..10000 range; 0 is valid and omission-equivalent in Bedrock serialization."\n',
        '      "Optional finite animation length in seconds (0..10000)."\n',
    ),
    (
        '      "Keyframes keyed by exact Group UUID or a Group name that is unique under case-insensitive Bedrock animation matching. Transform values use authored Blockbench coordinate/sign space and are converted only for the internal Bedrock codec payload. Targets are canonicalized to the existing Group name before creation."\n',
        '      "Bone keyframes keyed by Group UUID or case-insensitively unique Group name; transform values use Blockbench authored space."\n',
    ),
    (
        '          "For create: new unique bone name. For all other actions: exact Group UUID or exact unique Group name; UUID is preferred."\n',
        '          "Create: new unique name. Other actions: Group UUID or unique exact name."\n',
    ),
    (
        '          "Exact parent Group UUID or exact unique Group name. Required by parent; optional on create (omitted means intentional root)."\n',
        '          "Parent Group UUID or unique exact name; required by parent, optional on create."\n',
    ),
    (
        '          "Pivot/origin. Required by set_pivot. On create, omit unless a real joint, attachment, or transform center justifies a non-zero pivot."\n',
        '          "Pivot/origin; required by set_pivot. Omit on create unless a real joint/attachment needs it."\n',
    ),
    (
        '          "Initial bone rotation for create only. Omit for neutral zero rotation; do not invent an angle without a model/reference reason."\n',
        '          "Initial create rotation; omit for neutral zero rotation."\n',
    ),
    (
        '          "For create only: exact Outliner element UUIDs or exact unique names to reparent into the new bone. Every child is preflighted before mutation."\n',
        '          "Create-only child UUIDs or unique exact names; all are preflighted."\n',
    ),
    (
        '      "Creates/manipulates Group bones with action-specific preflight. Existing bone/parent/child targets use UUID-first or exact-unique-name resolution; missing/ambiguous targets fail before Undo. set_pivot requires an explicit origin and uses Blockbench pivot transfer semantics so the pivot changes without intentionally moving the group\'s visual contents. mirror requires an explicit axis. Mutation failure cancels/reverts the opened edit. This tool does not infer joints, pivots, rotations, or hierarchy from visual appearance.",\n',
        '      "Creates or edits Group bones with preflighted explicit targets. `set_pivot` requires origin and preserves visual contents; `mirror` requires an axis. Missing/ambiguous targets fail before mutation. The tool does not infer joints, pivots, rotation, or hierarchy from appearance.",\n',
    ),
]
for old, new in animation_replacements:
    replace_once("mcp/server/tools/animation.ts", old, new)

# Animation inspection: focused authored state, not a second workflow manual.
replace_once(
    "mcp/server/tools/animation-inspection.ts",
    '      "Optional exact Group UUID or exact unique Group name. When omitted, returns Animation settings and existing bone-animator summaries. When provided, returns detailed authored transform-channel keyframes for that Group without creating an animator."\n',
    '      "Optional Group UUID or unique exact name. Omit for animation/bone summaries; provide for detailed authored keyframes."\n',
)
replace_once(
    "mcp/server/tools/animation-inspection.ts",
    '      "Returns read-only authored Animation state for one deterministic Animation target. Output includes UUID/name/loop/length/snapping, summaries of existing BoneAnimators, authored particle-effect keyframes from an existing EffectAnimator, and—when `bone` is provided—detailed authored transform-channel keyframes with authored XYZ data points, interpolation, and Bezier vectors. Explicit Animation and Group names must be unique; UUID is preferred. This tool does not change selection, move the timeline, preview the model, or create missing animators.",\n',
    '      "Returns read-only authored Animation state: identity/settings, existing bone-animator and particle summaries, plus detailed transform keyframes when `bone` is supplied. UUID is preferred; explicit names must be unique. It does not change selection/timeline or create animators.",\n',
)

# ---------------------------------------------------------------------------
# Texture/PBR hotspots.
# ---------------------------------------------------------------------------
texture_replacements = [
    (
        '        "Optional explicit TextureGroup target. Exact UUID is preferred; an exact name is accepted only when unique."\n',
        '        "Optional TextureGroup UUID or unique exact name."\n',
    ),
    (
        '        "PBR channel to use for the texture. Color, normal, height, or Metalness/Emissive/Roughness (MER) map."\n',
        '        "PBR channel: color, normal, height, or MER."\n',
    ),
    (
        '        "Render mode for the texture. Default, emissive, additive, or layered."\n',
        '        "Texture render mode."\n',
    ),
    (
        '      "Required Cube or Group target. Exact UUID is preferred; an exact name is accepted only when unique across supported Bedrock Entity element types."\n',
        '      "Required Cube/Group UUID or unique exact name."\n',
    ),
    (
        '      "Required texture target. Exact UUID is preferred, then exact texture ID, then exact name only when unique."\n',
        '      "Required Texture UUID, exact ID, or unique exact name."\n',
    ),
    (
        '      "Optional explicit texture target for the color (albedo) channel. Exact UUID is preferred, then exact texture ID, then exact name only when unique."\n',
        '      "Optional color Texture UUID, exact ID, or unique exact name."\n',
    ),
    (
        '      "Optional explicit texture target for the normal map channel. Exact UUID is preferred, then exact texture ID, then exact name only when unique."\n',
        '      "Optional normal Texture UUID, exact ID, or unique exact name."\n',
    ),
    (
        '      "Optional explicit texture target for the height/displacement map channel. Exact UUID is preferred, then exact texture ID, then exact name only when unique."\n',
        '      "Optional height Texture UUID, exact ID, or unique exact name."\n',
    ),
    (
        '      "Optional explicit texture target for the MER (Metalness/Emissive/Roughness) channel. Exact UUID is preferred, then exact texture ID, then exact name only when unique."\n',
        '      "Optional MER Texture UUID, exact ID, or unique exact name."\n',
    ),
    (
        '      "Required material/texture group target to configure. Exact UUID is preferred; an exact name is accepted only when unique."\n',
        '      "Required material/TextureGroup UUID or unique exact name."\n',
    ),
    (
        '      "Optional explicit texture target for the color channel, or \'none\' to use uniform color. Non-\'none\' targets resolve exact UUID first, then exact texture ID, then exact name only when unique."\n',
        '      "Color Texture UUID/ID/unique name, or `none` for uniform color."\n',
    ),
    (
        '      "Optional explicit texture target for the normal map, or \'none\' to remove. Non-\'none\' targets resolve exact UUID first, then exact texture ID, then exact name only when unique."\n',
        '      "Normal Texture UUID/ID/unique name, or `none` to remove."\n',
    ),
    (
        '      "Optional explicit texture target for the height map, or \'none\' to remove. Non-\'none\' targets resolve exact UUID first, then exact texture ID, then exact name only when unique."\n',
        '      "Height Texture UUID/ID/unique name, or `none` to remove."\n',
    ),
    (
        '      "Optional explicit texture target for the MER channel, or \'none\' to use uniform values. Non-\'none\' targets resolve exact UUID first, then exact texture ID, then exact name only when unique."\n',
        '      "MER Texture UUID/ID/unique name, or `none` for uniform values."\n',
    ),
    (
        '      "Creates a new texture with the given name and size. When an explicit TextureGroup target is supplied, it resolves before mutation by exact UUID, otherwise an exact name must be unique; missing or ambiguous group targets fail before Undo or texture construction.",\n',
        '      "Creates a texture with explicit size/content options. An optional TextureGroup target must resolve by UUID or unique exact name before mutation.",\n',
    ),
    (
        '      "Applies one explicit texture to one explicit Cube or Group scope. Element identity resolves exact UUID first, otherwise an exact name must be unique across Cube/Group targets. Texture identity resolves exact UUID first, then exact texture ID, then exact name only when unique. Missing or ambiguous targets fail before Undo/mutation. Group targets apply to descendant Cubes. Generic Mesh is intentionally outside the native Bedrock Entity surface.",\n',
        '      "Applies one explicit Texture to a Cube or Group scope; Group targets affect descendant Cubes. Element/Texture references must resolve uniquely before mutation. Generic Mesh is outside the Bedrock Entity surface.",\n',
    ),
    (
        '      "Creates a new PBR material (texture group with is_material=true). Optional channel texture references are resolved exactly once before mutation by exact UUID, then exact texture ID, then exact name only when unique; missing or ambiguous supplied references fail before Undo or material creation. Uniform color, MER, and subsurface values remain supported.",\n',
        '      "Creates a PBR material TextureGroup. Optional channel textures must resolve uniquely before mutation; uniform color, MER, and subsurface values are supported.",\n',
    ),
    (
        '      "Configures one explicit material/texture group. Material identity resolves exact UUID first, otherwise an exact name must be unique; missing or ambiguous material targets fail before mutation. Omitted channel fields leave their assignments unchanged; the exact \'none\' sentinel preserves the existing remove/uniform behavior. Other supplied channel targets resolve exactly once before mutation by exact UUID, then exact texture ID, then exact name only when unique; missing or ambiguous references fail before Undo. Uniform color, MER, and subsurface values remain supported.",\n',
        '      "Configures one explicit PBR material. Omitted channels stay unchanged; `none` removes/uses uniform values where supported. Material/Texture references must resolve uniquely before mutation.",\n',
    ),
    (
        '      "Assigns one explicit texture to a PBR channel within one explicit material/texture group. Material identity resolves exact UUID first, otherwise an exact name must be unique; texture identity resolves exactly once before mutation by exact UUID, then exact texture ID, then exact name only when unique. Missing or ambiguous material/texture targets fail before Undo. Undo capture includes the assignment target and any existing textures that will be reset from the requested channel.",\n',
        '      "Assigns one explicit Texture to one PBR channel. Material/Texture references must resolve uniquely before Undo; existing textures on that channel are included in the edit.",\n',
    ),
]
for old, new in texture_replacements:
    replace_once("mcp/server/tools/texture.ts", old, new)

# ---------------------------------------------------------------------------
# Element/discovery hotspots.
# ---------------------------------------------------------------------------
element_replacements = [
    (
        '      "Optional case-sensitive regex pattern for element names (e.g., \'^arm_.*\'). Omit or pass an empty string for no regex filter. An explicit invalid, oversized, or unsafe pattern is rejected instead of being ignored."\n',
        '      "Optional case-sensitive name regex; invalid/oversized/unsafe patterns are rejected."\n',
    ),
    (
        '      "Exact parent Group UUID or exact unique name. Omit for no parent scope. Ambiguous or missing explicit scopes are rejected before search."\n',
        '      "Optional parent Group UUID or unique exact name."\n',
    ),
    (
        '    .describe("Minimum [x,y,z] size for cubes. Cubes smaller on any axis are excluded."),\n',
        '    .describe("Minimum Cube size [x,y,z]."),\n',
    ),
    (
        '    .describe("Maximum [x,y,z] size for cubes. Cubes larger on any axis are excluded."),\n',
        '    .describe("Maximum Cube size [x,y,z]."),\n',
    ),
    (
        '      "Authored Group pivot/origin. Omit for an organizational/non-articulated Group; provide a non-zero value only when a real joint, attachment, or transform center justifies it."\n',
        '      "Group pivot/origin; omit for organizational Groups unless a joint/attachment needs it."\n',
    ),
    (
        '      "Initial Group rotation. Omit for the neutral zero rotation; provide rotation only when the model/reference or required transform explicitly justifies it."\n',
        '      "Initial Group rotation; omit for neutral zero rotation."\n',
    ),
    (
        '      "Exact parent Group UUID or exact unique name. Omit/pass `root` only when root parenting is intentional."\n',
        '      "Parent Group UUID or unique exact name; omit/use `root` for intentional root."\n',
    ),
    (
        '      "Adds a Group with neutral origin/rotation defaults so callers are not forced to invent pivots or angles. An explicit parent is preflighted UUID-first (or by exact unique name) before mutation; missing or ambiguous parents fail instead of falling back. Use a non-zero origin/rotation only when a real joint, attachment, or transform relationship justifies it.",\n',
        '      "Adds a Group with neutral pivot/rotation defaults. Optional explicit parent must resolve uniquely before mutation; use non-zero pivot/rotation only for a real joint/attachment/transform reason.",\n',
    ),
    (
        '      "Searches the current Bedrock Cuboid modelling project for Cubes/Groups matching the given criteria. Supports name pattern matching (regex or substring), Cube/Group type filtering, scoping to a parent Group, cube size ranges, and selection scope. An explicit parent_group resolves UUID-first and by exact name only when unique. Invalid/rejected name_pattern values fail instead of being silently ignored. Returns metadata and never modifies state.",\n',
        '      "Read-only Cube/Group search by name, type, parent scope, size range, or selection. Explicit parent scope must resolve uniquely; invalid regex is rejected. Returns metadata only.",\n',
    ),
    (
        '      "Duplicates one explicit Cube or Group target. Use this only after repetition/symmetry is already supported by the reference or model design; duplication is not a shortcut for deciding primary geometry. UUID is resolved first; an exact name is accepted only when unique. Ambiguous or unsupported element types fail before mutation. You may offset the duplicate or assign a new name.",\n',
        '      "Duplicates one explicit Cube/Group by UUID or unique exact name, with optional offset/name. Use only for already-established repetition/symmetry, not to decide primary form.",\n',
    ),
    (
        '      "Selection/navigation helper for workflows that genuinely need editor selection, such as some texture/Paint operations. It is not a normal geometry-targeting path: `place_cube`, `modify_cube`, `modify_cubes_batch`, inspection, hierarchy, and destructive operations should use explicit identities instead. Optionally restrict to descendants of one explicit parent Group; missing or ambiguous scopes fail before selection changes.",\n',
        '      "Selection helper for workflows that require editor selection, mainly texture/Paint. Geometry inspection/mutation should use explicit identities. Optional parent scope must resolve uniquely.",\n',
    ),
    (
        '      "Returns the current Cube/Group selection state plus the active texture. Use it only when current editor selection/active-texture state is itself relevant, especially texture/Paint work. Normal geometry inspection and mutation should prefer explicit UUIDs and `inspect_element` rather than consulting selection as modelling context.",\n',
        '      "Returns current Cube/Group selection plus active Texture. Use only when editor selection state matters; geometry decisions should prefer explicit UUIDs and focused inspection.",\n',
    ),
]
for old, new in element_replacements:
    replace_once("mcp/server/tools/element.ts", old, new)

# ---------------------------------------------------------------------------
# Observation/export metadata: concise role boundaries.
# ---------------------------------------------------------------------------
replace_once(
    "mcp/server/tools/camera.ts",
    '      "Captures deterministic labeled 512×512 model views from the active project for direct reference comparison. Principal views are true axis-aligned orthographic; 3/4 views are stable perspective context views. Requires explicit front_direction, supports current-model or explicit target-envelope framing, and returns actual MCP image content through Blockbench\'s offscreen screenshot preview so the active editor camera remains untouched. This tool does not compare against a reference, score resemblance, infer front direction, repair geometry, or return PASS/FAIL.",\n',
    '      "Captures 1-5 deterministic labeled 512×512 canonical model views without changing the active editor camera. Requires explicit front_direction and supports model or explicit-envelope framing. Returns observation images only; it does not compare, score, repair, or return PASS/FAIL.",\n',
)
replace_once(
    "mcp/server/tools/project.ts",
    '      "Returns read-only project orientation: format id and display name, project name/UUID, texture resolution, Cube/Group/texture counts, and a summary of top-level groups. Prefer this over `risky_eval` for first-look inspection — no JavaScript execution required.",\n',
    '      "Returns read-only project identity/format, texture resolution, Cube/Group/Texture counts, and top-level Group summaries.",\n',
)
replace_once(
    "mcp/server/tools/project.ts",
    '      "Returns raw rendered-current-pose bounds for visible Cube geometry in the active project: min/max/center, width-height-length, XZ footprint, Cube counts, and pose context. Uses Blockbench global Cube vertices so active Cube/group transforms are reflected. This is structural observation only: it does not compare against a target, score resemblance, recommend corrections, or return PASS/FAIL.",\n',
    '      "Returns rendered-current-pose Cube bounds, dimensions/footprint, visibility counts, and pose context. Structural observation only; it does not compare, score, recommend corrections, or return PASS/FAIL.",\n',
)
replace_once(
    "mcp/server/tools/export.ts",
    '      "Compiles an active Minecraft Bedrock Entity project as native Bedrock geometry JSON or editable `.bbmodel`. Arbitrary OBJ/glTF/other registered codecs are intentionally rejected. Optionally writes the result to a filesystem path after Blockbench permission approval.",\n',
    '      "Compiles the active Bedrock Entity project as Bedrock geometry JSON or editable `.bbmodel`; optional filesystem write requires Blockbench permission. Other model codecs are rejected.",\n',
)
replace_once(
    "mcp/server/tools/export.ts",
    '      "Codec-specific compile options for the selected Bedrock/project codec. Defaults to the codec\'s configured export options."\n',
    '      "Optional compile options for the selected Bedrock/project codec."\n',
)
replace_once(
    "mcp/server/tools/export.ts",
    '      "Absolute filesystem path to write the compiled model to. Requires user permission in Blockbench. If omitted, content is returned in the MCP response only."\n',
    '      "Optional absolute output path; requires Blockbench filesystem permission."\n',
)

# ---------------------------------------------------------------------------
# Resource payload/routing cleanup.
# ---------------------------------------------------------------------------
replace_once(
    "mcp/server/resources.ts",
    '    "Returns information about available projects in Blockbench. List URIs use the project\'s slugified name (e.g. `projects://my-character`) when unique, or `projects://<slug>~<uuid-prefix>` on collision. The read side also accepts the raw UUID or exact name. Use without an ID to list all projects.",\n',
    '    "Browse Blockbench project metadata by stable resource URI. Use focused project tools when a modelling decision needs current operational state rather than browsing context.",\n',
)
replace_once(
    "mcp/server/resources.ts",
    '    "Returns the current nodes in the Blockbench editor. List URIs use the node\'s slugified name (e.g. `nodes://head`) when unique, with a `~<uuid-prefix>` suffix added to disambiguate collisions. Reads also accept the raw UUID or exact name.",\n',
    '    "Broad read-only Blockbench node observability retained for native gaps such as TextureMesh. It is not a focused authored-state owner; prefer dedicated inspection tools when available.",\n',
)
replace_once(
    "mcp/server/resources.ts",
    '    "Returns information about textures in the current Blockbench project. List URIs use the texture\'s slugified name (e.g. `textures://skin`) when unique, with a `~<uuid-prefix>` suffix added on collision. Reads also accept the raw UUID, short numeric `id`, or exact name.",\n',
    '    "Browse Texture metadata by URI. This resource does not return raw image/source payload; use `get_texture` when image data is actually needed.",\n',
)
replace_once(
    "mcp/server/resources.ts",
    '      source: texture.source || null,\n',
    '      has_source: Boolean(texture.source),\n',
)

validator_old = '''    async readCallback(uri) {
      const errors = Validator.errors.map((e) => serializeProblem(e, true));
      const warnings = Validator.warnings.map((w) => serializeProblem(w, false));

      return {
        contents: [
          {
            uri: uri.href,
            text: JSON.stringify(
              {
                summary: {
                  totalProblems: errors.length + warnings.length,
                  errorCount: errors.length,
                  warningCount: warnings.length,
                  checkCount: Validator.checks.length,
                  triggers: Validator.triggers,
                },
                errors,
                warnings,
              },
              null,
              2
            ),
            mimeType: "application/json",
          },
        ],
      };
    },
'''
validator_new = '''    async readCallback(uri) {
      return {
        contents: [
          {
            uri: uri.href,
            text: JSON.stringify(
              {
                summary: {
                  totalProblems: Validator.errors.length + Validator.warnings.length,
                  errorCount: Validator.errors.length,
                  warningCount: Validator.warnings.length,
                  checkCount: Validator.checks.length,
                  triggers: Validator.triggers,
                },
                detail_resources: {
                  errors: "validator://errors",
                  warnings: "validator://warnings",
                  checks: "validator://checks",
                },
              },
              null,
              2
            ),
            mimeType: "application/json",
          },
        ],
      };
    },
'''
replace_once("mcp/server/resources/validator.ts", validator_old, validator_new)
replace_once(
    "mcp/server/resources/validator.ts",
    '      "Returns the current validation status including error/warning counts and a summary of all problems. Any elementRefs are best-effort message-text inferences and are explicitly marked non-authoritative.",\n',
    '      "Returns validation counts/status only. Read `validator://errors` or `validator://warnings` only when detailed problems are needed.",\n',
)

# ---------------------------------------------------------------------------
# Prompt metadata and status docs.
# ---------------------------------------------------------------------------
replace_once(
    "mcp/server/prompts.ts",
    '    "Canonical BlockIT workflow guidance for creating or revising Minecraft Bedrock Entity models in Blockbench. Covers inspect-first Cuboid modelling, hierarchy/pivots, canonical visual gates, Bedrock texture/Paint/PBR/material-instance work, animation boundaries, protected native capability gaps, and Bedrock/.bbmodel export outcomes.",\n',
    '    "Compact BlockIT operating contract for Bedrock Entity creation: minimum evidence, primary-form/visual gates, bounded correction, downstream readiness, native capability boundaries, and Bedrock/.bbmodel export.",\n',
)

replace_once(
    "docs/knowledge/next-action.md",
    '`MCP_PLUGIN_RUNTIME_CLEANUP_SOURCE_COMPLETE_LOCAL_PROOF_REQUIRED`',
    '`MCP_CONTEXT_PAYLOAD_CLEANUP_SOURCE_COMPLETE_LOCAL_PROOF_REQUIRED`',
)
replace_once(
    "mcp/tests/model-effectiveness-minimum-evidence.test.ts",
    '    expect(next).toContain("MCP_PLUGIN_RUNTIME_CLEANUP_SOURCE_COMPLETE_LOCAL_PROOF_REQUIRED");\n',
    '    expect(next).toContain("MCP_CONTEXT_PAYLOAD_CLEANUP_SOURCE_COMPLETE_LOCAL_PROOF_REQUIRED");\n',
)

next_marker = "The Blockbench plugin runtime has also been cleaned before local acceptance: definition factories no longer create/register an unused singleton MCP server, each POST remains request-owned, active TCP sockets have an explicit unload owner, UI CSS/dialog/settings handles are torn down deterministically, dead session/SSE/system-instructions settings were removed, prompt loading is bundled-Local plus user override only, and MCP/package identity now consistently reports BlockIT. No Bedrock capability family or stateless request architecture was removed.\n"
next_addition = next_marker + "\nThe final pre-local **Context & Payload Cleanup** keeps the same capability surface while reducing duplicated agent-facing prose: the canonical workflow prompt is compact, measured metadata hotspots are shortened without removing input constraints, panel descriptions use real tool descriptions, Texture resources no longer return raw `source`, and validator status is summary-only with lazy detail resources. Tool annotations were audited and already provide a read-vs-mutation hint across the full generated catalog, so no annotation churn was added. `nodes://` remains unchanged pending direct TextureMesh ownership.\n"
replace_once("docs/knowledge/next-action.md", next_marker, next_addition)

# Record measured baseline and bounded decisions in the existing effectiveness audit.
audit_path = "docs/knowledge/reviews/model-creation-effectiveness-audit-2026-08-10.md"
audit = read(audit_path)
heading = "## Pre-Local Context & Payload Cleanup — 2026-08-11"
if heading in audit:
    raise RuntimeError("Context/payload cleanup audit section already exists.")
audit += f'''\n\n{heading}\n\nMeasured generated baseline before cleanup:\n\n```text\n72 tools\n123,851 tool-metadata JSON characters\n18,249 tool-description characters\n40,850 schema-description characters\n19,808 canonical workflow-prompt characters\n```\n\nThe hotspot audit showed that most removable prose cost was concentrated in `create_animation`, Cube mutation schemas/descriptions, bone rigging, PBR/material configuration, element search/group creation, and a few observation/export tools. The cleanup therefore trims only measured hotspots rather than rewriting all 72 tools.\n\nBounded decisions:\n\n- preserve all existing Bedrock registration families and tool count;\n- keep runtime validation/refine logic unchanged;\n- keep execution-vs-visual-verdict and blocker semantics;\n- compact the canonical MCP prompt instead of duplicating specialist-skill detail;\n- use Resources as lazy browsing/context, not mandatory pre-tool reads;\n- remove raw Texture `source` from normal resource metadata because `get_texture` owns image retrieval;\n- make `validator://status` summary-only and keep detail in `validator://errors`, `validator://warnings`, and `validator://checks`;\n- keep `nodes://` unchanged until the protected TextureMesh gap has a direct authored-state owner;\n- annotation audit found every generated tool already exposes either `readOnlyHint` or an explicit `destructiveHint`, so no speculative annotation changes were made.\n\nThis remains **source/contract and payload proof only**. Whether the smaller surface materially reduces Codex usage or wrong tool selection remains a Local behavioral measurement.\n'''
write(audit_path, audit)

# Add a focused regression file; avoid turning the whole catalog into a rigid budget framework.
new_test = ROOT / "mcp/tests/context-payload-cleanup.test.ts"
if new_test.exists():
    raise RuntimeError("context-payload-cleanup.test.ts already exists")
new_test.write_text(r'''import { describe, expect, test } from "bun:test";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("pre-local context and payload cleanup", () => {
  test("canonical workflow stays compact while preserving hard validity invariants", async () => {
    const workflow = await source("prompts/bedrock_entity_workflow.md");
    expect(workflow.length).toBeLessThan(10_000);
    for (const invariant of [
      "minimum necessary evidence",
      "SUPPORTED | PROVISIONAL | CONFLICTING | UNAVAILABLE",
      "visual_verdict: not_evaluated",
      "FAIL",
      "UNVERIFIED",
      "PASS",
      "BLOCKED",
      "same causal correction direction fails twice without new evidence",
      "geometry_effect",
      "Protected Native Capability Gaps",
      "Native Bedrock PBR and per-face `material_instance` are **not** gaps",
    ]) {
      expect(workflow.toLowerCase()).toContain(invariant.toLowerCase());
    }
  });

  test("panel metadata uses actual tool descriptions", async () => {
    const factories = await source("lib/factories.ts");
    expect(factories).toContain("description: toolDef.description");
    expect(factories).not.toContain("description: toolDef.title,");
  });

  test("Texture resource stays metadata-only and routes image reads to get_texture", async () => {
    const resources = await source("server/resources.ts");
    expect(resources).toContain("has_source: Boolean(texture.source)");
    expect(resources).not.toContain("source: texture.source || null");
    expect(resources).toContain("use `get_texture` when image data is actually needed");
  });

  test("validator status is summary-only with lazy detail resources", async () => {
    const validator = await source("server/resources/validator.ts");
    const start = validator.indexOf('createResource("validator-status"');
    const end = validator.indexOf('createResource("validator-checks"', start);
    const statusSection = validator.slice(start, end);
    expect(statusSection).toContain("detail_resources");
    expect(statusSection).toContain('errors: "validator://errors"');
    expect(statusSection).not.toContain("const errors = Validator.errors.map");
    expect(statusSection).not.toContain("const warnings = Validator.warnings.map");
  });

  test("context cleanup changes payload, not Bedrock capability/profile architecture", async () => {
    const profile = await source("lib/registrationProfile.ts");
    const next = await source("../docs/knowledge/next-action.md");
    expect(profile).toContain('export type McpRegistrationProfile = "bedrock_entity" | "extended";');
    expect(profile).not.toContain("lean_mode");
    expect(profile).not.toContain("context_mode");
    expect(next).toContain("MCP_CONTEXT_PAYLOAD_CLEANUP_SOURCE_COMPLETE_LOCAL_PROOF_REQUIRED");
    expect(next).toContain("`nodes://` remains unchanged");
  });
});
''', encoding="utf-8")

print("Applied bounded context/payload cleanup.")
