from pathlib import Path

ROOT = Path.cwd()


def read(path: str) -> str:
    return (ROOT / path).read_text()


def write(path: str, content: str) -> None:
    target = ROOT / path
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(content.rstrip() + "\n")


def replace_once(path: str, old: str, new: str) -> None:
    text = read(path)
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f"{path}: expected exactly one marker, found {count}: {old[:120]!r}")
    write(path, text.replace(old, new, 1))


def unlink_required(path: str) -> None:
    target = ROOT / path
    if not target.exists():
        raise RuntimeError(f"required file missing before deletion: {path}")
    target.unlink()


# ---------------------------------------------------------------------------
# F. One enabled MCP prompt authority: Minecraft Bedrock Entity only.
# ---------------------------------------------------------------------------
write(
    "mcp/server/prompts.ts",
    '''import { z } from "zod";
import { createPrompt, prompts } from "@/lib/factories";
import { getPromptContent } from "@/lib/promptLoader";

// Maintainer/development guidance remains source-preserved but is not part of
// the normal agent-facing BlockIT MCP prompt surface.
createPrompt(
  "blockbench_native_apis",
  {
    description:
      "Maintainer-only Blockbench native API security/reference guidance. Disabled in the normal BlockIT Bedrock Entity MCP surface.",
    argsSchema: z.object({}),
    async generate() {
      const text = getPromptContent("blockbench_native_apis");
      return {
        messages: [{ role: "user", content: { type: "text", text } }],
      };
    },
  },
  "stable",
  false
);

createPrompt(
  "blockbench_code_eval_safety",
  {
    description:
      "Maintainer-only safety guidance for Blockbench code evaluation. Disabled together with risky_eval in the normal BlockIT Bedrock Entity MCP surface.",
    argsSchema: z.object({}),
    async generate() {
      const text = getPromptContent("blockbench_code_eval_safety");
      return {
        messages: [{ role: "user", content: { type: "text", text } }],
      };
    },
  },
  "stable",
  false
);

createPrompt("bedrock_entity_workflow", {
  title: "Minecraft Bedrock Entity Workflow",
  description:
    "Canonical BlockIT workflow guidance for creating or revising Minecraft Bedrock Entity models in Blockbench. Covers inspect-first Cuboid modelling, hierarchy/pivots, canonical visual gates, Bedrock texture/Paint/PBR/material-instance work, animation boundaries, protected native capability gaps, and Bedrock/.bbmodel export outcomes.",
  argsSchema: z.object({}),
  async generate() {
    const text = getPromptContent("bedrock_entity_workflow");
    return {
      messages: [{ role: "user", content: { type: "text", text } }],
    };
  },
});

export default prompts;
''',
)

bedrock = read("mcp/prompts/bedrock.md")
protected_section = '''## Protected Native Capability Gaps

BlockIT preserves the Minecraft Bedrock Entity product boundary even when a native capability does not yet have a direct MCP authoring/inspection owner. Current protected examples include direct Locator/NullObject authoring, TextureMesh authoring, native visible bounding-box fields, animation controllers, sound/timeline animation effects, animated-texture authoring, and bone-binding expressions.

When the user asks for one of these native capabilities and the current exposed MCP surface has no direct owner:

- **do not emulate it with generic Mesh, arbitrary Cubes, UI clicks, code evaluation, or a different format;**
- do not claim that a broad runtime resource such as `nodes://` is equivalent to authored native support;
- preserve existing authored data when opening/re-exporting a project unless a proven tool intentionally edits it;
- state the capability gap explicitly and keep the task bounded to supported operations;
- treat the gap as implementation work to audit against official Blockbench Bedrock source, not as permission to remove the capability from BlockIT.

Native Bedrock PBR and per-face `material_instance` are **not** gaps: use the dedicated texture/material and material-instance tools when the task requires them.

## Export Boundary

For normal BlockIT model deliverables, `export_model` intentionally supports only:

- `bedrock` — native Minecraft Bedrock geometry JSON;
- `project` — editable Blockbench `.bbmodel`.

Bedrock animation/controller files belong to Blockbench's separate Bedrock AnimationCodec surface. Do not substitute arbitrary OBJ/glTF/model codecs for a Bedrock Entity deliverable.

'''
needle = "## Default boundaries\n"
if bedrock.count(needle) != 1:
    raise RuntimeError("bedrock prompt: default-boundaries marker missing")
bedrock = bedrock.replace(needle, protected_section + needle, 1)
bedrock = bedrock.replace(
    "generic mesh/armature/PBR tooling, or Hytale tooling as shortcuts.",
    "generic mesh/armature tooling or Hytale tooling as shortcuts. Native Bedrock PBR/material-instance workflows are allowed when the asset actually requires them.",
)
write("mcp/prompts/bedrock_entity_workflow.md", bedrock)

for stale_prompt in [
    "mcp/prompts/bedrock.md",
    "mcp/prompts/bedrock_block.md",
    "mcp/prompts/java_block.md",
    "mcp/prompts/model_creation_geometry.md",
    "mcp/prompts/model_creation_import.md",
    "mcp/prompts/model_creation_programmatic.md",
    "mcp/prompts/model_creation_ui.md",
]:
    unlink_required(stale_prompt)

# Documentation manifest must describe the same prompt contract.
docs_manifest = read("mcp/build/docs-manifest.ts")
start = docs_manifest.index('  {\n    name: "model_creation_strategy",')
end = docs_manifest.index("  },\n];\n\n// Resource specs", start) + len("  },")
replacement = '''  {
    name: "bedrock_entity_workflow",
    title: "Minecraft Bedrock Entity Workflow",
    description:
      "Canonical BlockIT workflow guidance for creating or revising Minecraft Bedrock Entity models in Blockbench. Covers inspect-first Cuboid modelling, hierarchy/pivots, canonical visual gates, Bedrock texture/Paint/PBR/material-instance work, animation boundaries, protected native capability gaps, and Bedrock/.bbmodel export outcomes.",
    argsSchema: z.object({}),
    status: "stable",
  },'''
docs_manifest = docs_manifest[:start] + replacement + docs_manifest[end:]
docs_manifest = docs_manifest.replace(
    '"Returns the current validation status including error/warning counts and a summary of all problems.",',
    '"Returns the current validation status. Any elementRefs are best-effort message-text inferences and are explicitly marked non-authoritative.",',
)
docs_manifest = docs_manifest.replace(
    '"Returns all current validation warnings with element references where available.",',
    '"Returns current validation warnings. Any elementRefs are best-effort message-text inferences and are explicitly marked non-authoritative.",',
)
docs_manifest = docs_manifest.replace(
    '"Returns all current validation errors with element references where available.",',
    '"Returns current validation errors. Any elementRefs are best-effort message-text inferences and are explicitly marked non-authoritative.",',
)
write("mcp/build/docs-manifest.ts", docs_manifest)

# P1 registration regression now tracks the single enabled Bedrock prompt.
replace_once(
    "mcp/tests/p1-registration-profile.test.ts",
    '''    const strategyPrompt = source.indexOf('createPrompt("model_creation_strategy"');''',
    '''    const strategyPrompt = source.indexOf('createPrompt("bedrock_entity_workflow"');''',
)

# ---------------------------------------------------------------------------
# H. Generated/reference docs must identify BlockIT and must not install the
# upstream hosted binary.
# ---------------------------------------------------------------------------
write(
    "mcp/docs/llms/install.md",
    '''## BlockIT Local Installation

Build the current `Local` branch and load the generated plugin file from this repository:

```bash
git checkout Local
cd mcp
bun install --frozen-lockfile
bun run build
```

Then load `mcp/dist/mcp.js` as a local plugin in desktop Blockbench.

For BlockIT validation, **do not install the hosted `jasonjgardner.github.io/blockbench-mcp-plugin` artifact**. That URL serves the upstream generic plugin and cannot prove this Bedrock Entity-focused fork.

Default MCP URL after the BlockIT plugin is loaded:

```text
http://127.0.0.1:3000/bb-mcp
```
''',
)
replace_once(
    "mcp/build/docs.ts",
    '<title>Blockbench MCP Plugin — API Reference</title>',
    '<title>BlockIT — Bedrock Entity MCP — API Reference</title>',
)
replace_once(
    "mcp/build/docs.ts",
    '<h1>Blockbench MCP</h1>',
    '<h1>BlockIT — Bedrock Entity MCP</h1>',
)
replace_once(
    "mcp/build/docs.ts",
    '<h1>Blockbench MCP Plugin</h1>',
    '<h1>BlockIT — Bedrock Entity MCP</h1>',
)

# ---------------------------------------------------------------------------
# G. BlockIT-specific agent skill layer. Reuse the mature modelling specialist;
# add MCP orchestration, texture/PBR/material-instance, and animation specialists.
# ---------------------------------------------------------------------------
write(
    ".agents/skills/blockit-bedrock-entity-mcp/SKILL.md",
    '''---
name: blockit-bedrock-entity-mcp
description: Mandatory orchestrator for using the BlockIT MCP to create, revise, texture, animate, inspect, validate, or export Minecraft Bedrock Entity assets in Blockbench. Route modelling judgement to blockbench-bedrock-modelling, texture/Paint/PBR/material-instance work to blockit-bedrock-texturing, and animation work to blockit-bedrock-animation. Do not use generic Mesh, Hytale, risky evaluation, arbitrary UI automation, or non-Bedrock project formats as substitutes.
---

# BlockIT Bedrock Entity MCP

Use this skill before substantive BlockIT MCP asset work. It owns **workflow orchestration and tool-surface discipline**, not the artistic judgement of the modelling specialist.

## Product Boundary

- Target Blockbench format: `bedrock` (Minecraft Bedrock Entity).
- Normal geometry: Cubes/Cuboids organized by Groups/bones.
- Preserve native Bedrock capabilities even when their direct MCP mapping is incomplete.
- Generic Blockbench Mesh, Hytale, arbitrary project formats, and arbitrary model codecs are not compatibility requirements.
- `risky_eval` and `from_geo_json` are quarantined; do not design a workflow around them.
- `capture_app_screenshot` and arbitrary `set_camera_angle` are not normal BlockIT observation paths.

## Route By Intent

| Intent | Specialist |
|---|---|
| Whole-form interpretation, Cube geometry, hierarchy/pivot judgement, silhouette/proportion correction | `blockbench-bedrock-modelling` |
| Texture creation/application, Paint, layers/selections, PBR TextureGroups, per-face material instances | `blockit-bedrock-texturing` |
| Bedrock BoneAnimator transforms, keyframes, curves, rigs, particle effects, animation inspection | `blockit-bedrock-animation` |
| Plugin/runtime implementation defect | `blockbench-runtime-development` |
| MCP server/schema/registration implementation | `mcp-server-development` |

Load every relevant domain specialist before a multi-domain task, but keep one domain responsible for each decision.

## Preflight

1. Call `get_project_info` before mutation when an existing project is open.
2. If no project exists and creation is requested, use `create_project`; BlockIT accepts only `bedrock`.
3. Confirm the intended project is actually `bedrock`. Do not silently convert another format.
4. Inspect only the state needed for the next decision:
   - structure: `list_outline`, `find_elements_by_criteria`, `inspect_element`;
   - textures/materials: `list_textures`, `get_texture`, `list_materials`, `get_material_info`;
   - animation: `inspect_animation`;
   - whole-form envelope: `inspect_model_bounds`.
5. Prefer exact UUIDs after discovery. Exact unique names are a convenience, not a durable identity contract.

## Mutation Discipline

- For three or more material mutations, or any risky multi-step rework, create a `save_checkpoint` first when recovery value is meaningful.
- Use `modify_cube` for one diagnosed Cube correction.
- Use `modify_cubes_batch` only when one causal correction genuinely spans several explicit Cube UUIDs.
- Do not use selection as an implicit mutation target when a tool supports explicit identity.
- Do not compensate for a wrong primary form with extra detail, texture, or animation.
- Use `undo`/`redo` rather than generic UI actions.

## Observation Discipline

For reference-driven modelling:

- use `inspect_model_bounds` for structural envelope facts;
- use `capture_model_views` for deterministic labeled views with explicit `front_direction`;
- use `capture_screenshot` only when the current editor view itself is useful;
- successful capture or validator execution is observation evidence, not a resemblance PASS.

## Protected Native Capability Gaps

If a request needs a native Bedrock capability that has no direct exposed authoring/inspection tool, **stop at the capability boundary rather than synthesizing a fake substitute**.

Protected examples currently include direct authored-state owners for:

- Locator / NullObject locators;
- TextureMesh;
- native visible bounding-box fields;
- animation controllers;
- sound/timeline animation effects;
- animated-texture authoring;
- bone-binding expressions.

Do not emulate these with generic Mesh, arbitrary Cubes, `risky_eval`, UI clicks, or another model format. Existing data should be preserved where the normal project/Bedrock codecs preserve it. Record the gap for MCP implementation audit.

## Texture And PBR Boundary

Native Bedrock PBR and per-face `material_instance` are valid BlockIT capabilities. Route those tasks to `blockit-bedrock-texturing`; do not classify them as generic Mesh/PBR shortcuts.

## Animation Boundary

Route animation work to `blockit-bedrock-animation`. Particle effects are directly mapped today. Do not invent sound/timeline/controller authoring through generic actions when no direct owner exists.

## Export

Export only when the user wants a deliverable or an explicit validation artifact.

`export_model` supports:

- `bedrock` — native Minecraft Bedrock geometry JSON;
- `project` — editable Blockbench `.bbmodel`.

Do not ask for OBJ/glTF as an intermediate escape hatch for normal Bedrock Entity work. Bedrock animation/controller file ownership is separate from generic model export.

## Completion

A task is complete only when the relevant state is re-observed after mutation. For reference-driven geometry this means fresh visual comparison; for texture/animation work, use the domain specialist's verification checks. Never report live Blockbench proof from source/CI evidence alone.
''',
)

write(
    ".agents/skills/blockit-bedrock-texturing/SKILL.md",
    '''---
name: blockit-bedrock-texturing
description: Specialist for Minecraft Bedrock Entity texture work through BlockIT MCP: texture creation/application, pixel painting, paint settings, layers/selections, PBR TextureGroup materials, channel assignment, and per-face material_instance metadata. Use after geometry is coherent or when revising an existing asset's surface. Do not use generic Mesh UV workflows.
---

# BlockIT Bedrock Texturing

Own the **surface-authoring workflow** for a Bedrock Entity asset. Geometry and pivot judgement remain with `blockbench-bedrock-modelling`.

## Start With Existing State

Before changing an existing asset:

1. `list_textures` to identify texture UUID/ID/name and active assignments.
2. `get_texture` only when image evidence is needed.
3. `list_materials` / `get_material_info` before changing PBR TextureGroups.
4. `get_face_material_instances` or `list_material_instances` before changing per-face material metadata.
5. Use explicit targets; prefer UUIDs once discovered.

If the geometry is reference-driven and still structurally wrong, return to the modelling specialist before painting. Texture must not hide a broken primary form.

## Texture Management

Use the actual BlockIT texture tools:

- `create_texture`
- `list_textures`
- `get_texture`
- `activate_texture`
- `apply_texture`
- `add_texture_group`

`apply_texture` targets Cube or Group scopes, not generic Mesh.

## Paint

Available Painter-backed operations include:

- `paint_fill_tool`
- `draw_shape_tool`
- `gradient_tool`
- `paint_with_brush`
- `eraser_tool`
- `color_picker_tool`
- `copy_brush_tool`
- `paint_settings`
- `texture_selection`
- `texture_layer_management`
- brush preset create/load helpers

These depend on Blockbench's live Painter runtime. Source/CI validation does not replace local rendered/runtime proof.

Prefer bounded, deliberate pixel operations. Use pixel-perfect/mirroring only when the texture design supports it. Avoid procedural noise merely to make a surface look detailed.

## Native Bedrock PBR

PBR is part of Blockbench's native Bedrock format and is valid when the requested asset uses it.

Use:

- `create_pbr_material`
- `configure_material`
- `list_materials`
- `get_material_info`
- `assign_texture_channel`
- `import_texture_set` only when importing an existing Bedrock texture-set is explicitly required
- `save_material_config` only when a filesystem deliverable is requested

Channel work may include color, normal, height, MER, and supported uniform values/subsurface fields. Inspect the existing material before replacing a channel.

## Per-Face Material Instances

`material_instance` is native Bedrock geometry face metadata and is **not the same thing as a PBR TextureGroup**.

Use:

- `get_face_material_instances`
- `list_material_instances`
- `set_face_material_instance`
- `bulk_set_material_instances`
- `clear_material_instances`

For bulk mutation, preflight all Cube identities and face intent first. Do not assign arbitrary material-instance names as decoration when the pack/entity contract does not require them.

## UV Boundary

BlockIT removed the generic Mesh-only UV tool family. Do not use upstream instructions such as `auto_uv_mesh`, `set_mesh_uv`, or `rotate_mesh_uv`.

Cube face/box-UV semantics remain a protected Bedrock capability. Use the Cube/texture fields exposed by the actual current tools, and do not claim full Cube UV authoring coverage where a direct tool contract is still partial.

## Verification

After a material surface change:

- re-read the targeted texture/material/material-instance state;
- use `get_texture` when pixel output itself matters;
- use canonical model views when the surface must be judged on the model;
- distinguish structural success from visual quality;
- keep PBR appearance claims bounded because final RTX/in-game rendering is outside MCP source proof.
''',
)

write(
    ".agents/skills/blockit-bedrock-animation/SKILL.md",
    '''---
name: blockit-bedrock-animation
description: Specialist for Minecraft Bedrock Entity animation through BlockIT MCP. Use for existing-animation inspection, BoneAnimator transforms, keyframes, graph interpolation, Group/bone rig changes, timeline playback/settings, batch/copy operations, and mapped particle effects. Preserve unsupported native controller/sound/timeline-effect capabilities as explicit gaps instead of emulating them.
---

# BlockIT Bedrock Animation

Own animation execution only after the model hierarchy and pivots are suitable for the requested motion.

## Preflight

1. Confirm the active project format is `bedrock` with `get_project_info`.
2. Use `list_outline` to identify Group/bone UUIDs.
3. For an existing animation, call `inspect_animation` before mutation. Use its authored transform channels/effect summary instead of inferring current keyframes from a screenshot.
4. If pivot/hierarchy judgement is unclear, route the modelling decision to `blockbench-bedrock-modelling` before editing animation.

## Directly Mapped Animation Surface

- `create_animation` — uses the current Bedrock AnimationCodec and accepts authored transform keyframes plus mapped particle effects.
- `inspect_animation` — read-only authored Animation/BoneAnimator/keyframe/particle state.
- `manage_keyframes` — create/edit/delete/select transform-channel keyframes.
- `animation_graph_editor` — interpolation/Bezier curve adjustment.
- `bone_rigging` — Group/bone structure and pivot operations with explicit targets.
- `animation_timeline` — playback/time/length/FPS/loop controls.
- `batch_keyframe_operations` — bounded multi-keyframe timing/value operations.
- `animation_copy_paste` — copy/paste/mirror between explicit Group/Animation targets.

Use Group UUIDs whenever possible. Bedrock animation import matches bone names case-insensitively, so duplicate/colliding names are a real determinism problem, not something to guess around.

## Create Versus Edit

For a new animation:

- establish the intended motion and which bones participate;
- verify pivots first;
- keep transform values in the authored Blockbench space expected by the tool;
- create the minimum keyframes needed for the motion;
- inspect the created animation afterward.

For an existing animation:

- inspect first;
- diagnose which bone/channel/time is wrong;
- edit only the affected keyframes or curve range;
- re-inspect and visually preview the affected motion.

## Timeline Caution

Do not make `animation_timeline.select_range` a dependency for core correctness until its live Blockbench lifecycle behavior is explicitly accepted locally. Prefer explicit keyframe/time ranges on the editing tools when available.

## Mapped Effects

Particle effects are currently mapped through `create_animation.particle_effects` and surfaced by `inspect_animation.effects`. Preserve Locator names referenced by particles; a particle locator string does not mean direct Locator authoring is implemented.

## Protected Native Animation Gaps

Blockbench Bedrock Entity natively supports more than the current direct MCP authoring surface. Keep these as explicit protected gaps when no direct tool exists:

- animation controllers;
- sound-effect keyframes;
- timeline-effect keyframes;
- direct Locator/NullObject authoring used by effects;
- bone-binding expressions.

Do not fake these with `risky_eval`, `trigger_action`, dialog filling, arbitrary UI clicks, or generic model export. If the requested deliverable requires one, report the current MCP gap and preserve existing authored data rather than silently substituting another feature.

## Verification

After animation mutation:

- `inspect_animation` for authored-state continuity;
- preview/play only as needed to inspect motion;
- use canonical/model screenshots where pose silhouette or clipping matters;
- verify attachment, transform arc, clipping, and return-to-neutral behavior relevant to the request;
- do not claim in-game/controller behavior without the corresponding direct capability and local/game evidence.
''',
)

write(
    ".agents/skills/README.md",
    '''# BuildIT Agent Skills

This directory contains repository-owned skills. For normal Minecraft Bedrock Entity work through the BlockIT MCP, use the BlockIT routing below rather than the upstream generic `blockbench-mcp-project` skills verbatim.

## Bedrock Entity authoring

1. **`blockit-bedrock-entity-mcp`** — mandatory MCP workflow orchestrator for asset creation/modification/export.
2. **`blockbench-bedrock-modelling`** — existing whole-form/Cuboid/hierarchy/pivot modelling specialist.
3. **`blockit-bedrock-texturing`** — textures, Paint, PBR, material instances.
4. **`blockit-bedrock-animation`** — Bedrock BoneAnimator/keyframe/effect workflow.

Load the orchestrator first for substantive MCP work, then the domain skill(s) needed by the request.

## Maintainer/development skills

- `blockbench-runtime-development` — Blockbench plugin/runtime/API implementation defects.
- `mcp-server-development` — MCP registration/schema/result/server implementation.
- `bun-tooling` — Bun build/package tooling.
- `typescript-type-safety` — TypeScript type-system issues.
- `development-brief` — repository development planning/brief work.

Maintainer skills are not a substitute for the Bedrock asset-authoring workflow.

## Deliberate exclusions

There is no BlockIT Hytale skill and no generic Mesh modelling skill. Native Bedrock `TextureMesh` remains a protected capability gap distinct from generic Blockbench `Mesh`; it must receive an official-source-backed direct mapping rather than reintroducing the generic Mesh workflow.
''',
)

# Existing modelling specialist stays authoritative for form judgement, but its
# routing must acknowledge native Bedrock PBR as an execution domain rather than
# classifying it as out-of-product generic work.
replace_once(
    ".agents/skills/blockbench-bedrock-modelling/SKILL.md",
    '''- unrelated engines, Hytale production, generic mesh sculpting, PBR pipelines,
  or realistic rendering unless the product scope is explicitly changed.''',
    '''- unrelated engines, Hytale production, generic mesh sculpting, or realistic
  rendering; native Bedrock texture/PBR/material-instance execution routes to
  `blockit-bedrock-texturing` after modelling judgement is settled.''',
)
replace_once(
    ".agents/skills/blockbench-bedrock-modelling/SKILL.md",
    '''This skill decides **what the model should become**. It does not own the
Blockbench API/runtime mechanics used to apply those decisions.''',
    '''This skill decides **what the model should become**. It does not own the
Blockbench API/runtime mechanics used to apply those decisions. For actual MCP
workflow orchestration, load `blockit-bedrock-entity-mcp`; route surface execution
to `blockit-bedrock-texturing` and animation execution to
`blockit-bedrock-animation` when those domains enter scope.''',
)

write(
    "docs/knowledge/reviews/blockit-agent-skill-surface-2026-08-10.md",
    '''# BlockIT Agent Skill Surface

Updated: 2026-08-10

## Decision

Do not install or copy `jasonjgardner/blockbench-mcp-project` as the canonical BlockIT skill layer. It is useful upstream reference material, but it describes a broader generic Blockbench MCP surface than BlockIT now exposes by default.

Upstream audit covered the published skills for generic Blockbench use, MCP overview, modelling, texturing, PBR, animation, Hytale, and plugin development.

## Replacement map

| Upstream skill | BlockIT treatment |
|---|---|
| `blockbench-use` | Replace with `blockit-bedrock-entity-mcp` orchestrator. |
| `blockbench-mcp-overview` | Replace with the orchestrator + Bedrock capability surface matrix/current MCP docs. |
| `blockbench-modeling` | Replace generic Mesh/Cube guidance with existing `blockbench-bedrock-modelling` specialist. |
| `blockbench-texturing` | Replace Mesh-UV/generic guidance with `blockit-bedrock-texturing`. |
| `blockbench-pbr-materials` | Fold native Bedrock PBR into `blockit-bedrock-texturing`; do not treat PBR as a separate generic product. |
| `blockbench-animation` | Replace with `blockit-bedrock-animation`, which uses current BlockIT identity/inspection contracts and protected-gap rules. |
| `blockbench-hytale` | Excluded from BlockIT product surface. |
| `blockbench-development` / `blockbench-plugins` | Maintainer-only analogue is existing `blockbench-runtime-development`; not loaded for normal asset authoring. |

## Why the upstream orchestrator cannot be canonical here

Its generic workflow references capabilities that are intentionally outside or disabled in normal BlockIT, including generic Mesh/freeform paths, Hytale, broad formats, risky evaluation as a fallback, arbitrary export codecs, full-app/UI automation, and tool names removed with the generic Mesh UV surface.

Keeping those instructions installed beside a Bedrock-only MCP would teach the agent to request tools the server no longer exposes, or worse, to treat quarantined/generic fallback paths as normal recovery behavior.

## BlockIT authoring stack

```text
blockit-bedrock-entity-mcp        workflow/surface authority
  ├─ blockbench-bedrock-modelling whole-form/Cuboid/hierarchy judgement
  ├─ blockit-bedrock-texturing    texture/Paint/PBR/material_instance
  └─ blockit-bedrock-animation    BoneAnimator/keyframes/mapped effects
```

Maintainer-only skills remain separate.

## Capability-gap rule

Skills must not hide native Bedrock gaps. Locator/NullObject, TextureMesh, native bounding-box fields, animation controllers, sound/timeline effects, animated-texture authoring, and bone-binding expressions remain protected when direct MCP ownership is incomplete.

A future skill update may document those features **only after** the corresponding current BlockIT tool/resource contract is implemented and audited. Do not resurrect generic Mesh/UI/eval instructions to simulate them.
''',
)

# Capability matrix now points to prompt/skill ownership while keeping gaps visible.
matrix = read("docs/knowledge/reviews/bedrock-entity-capability-surface-matrix.md")
matrix = matrix.replace(
    'Project creation, model-codec breadth, generic camera/app helpers, and validator inference labeling were reviewed in `mcp-prelocal-generic-semantics-audit-2026-08-10.md`. Next, use this matrix to normalize Bedrock prompts/skills and to design direct authored-state coverage for protected gaps before replacing broad transitional resources. Do not start deletion from tool names alone; trace every proposed reduction through official Blockbench Bedrock source first.',
    'Project creation, model-codec breadth, generic camera/app helpers, and validator inference labeling were reviewed in `mcp-prelocal-generic-semantics-audit-2026-08-10.md`. The canonical MCP prompt is now `bedrock_entity_workflow`, and the repository-owned skill routing is documented in `blockit-agent-skill-surface-2026-08-10.md`. Next capability work should design direct authored-state coverage for protected native gaps before replacing broad transitional resources. Do not start deletion from tool names alone; trace every proposed reduction through official Blockbench Bedrock source first.',
)
write("docs/knowledge/reviews/bedrock-entity-capability-surface-matrix.md", matrix)

# README points at the concrete repository-owned skills after G is installed.
readme = read("mcp/README.md")
old = '''A BlockIT-specific skill pack is a separate pre-local hardening step and should be generated from the current capability matrix and actual MCP contract.'''
new = '''Repository-owned BlockIT skills now live under `.agents/skills/`: use `blockit-bedrock-entity-mcp` as the MCP orchestrator, the existing `blockbench-bedrock-modelling` specialist for whole-form geometry judgement, `blockit-bedrock-texturing` for texture/Paint/PBR/material-instance work, and `blockit-bedrock-animation` for Bedrock animation.'''
if readme.count(old) != 1:
    raise RuntimeError("mcp README skill placeholder not found")
write("mcp/README.md", readme.replace(old, new, 1))

# ---------------------------------------------------------------------------
# Focused F/G/H regression proof.
# ---------------------------------------------------------------------------
write(
    "mcp/tests/prelocal-prompt-skill-surface.test.ts",
    '''import { describe, expect, test } from "bun:test";
import { readdir } from "node:fs/promises";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("pre-local Bedrock prompt and skill surface", () => {
  test("one enabled MCP workflow prompt is Bedrock Entity-only", async () => {
    const prompts = await source("server/prompts.ts");
    expect(prompts).toContain('createPrompt("bedrock_entity_workflow"');
    expect(prompts).not.toContain('createPrompt("model_creation_strategy"');
    expect(prompts).not.toContain('enum(["java_block", "bedrock", "bedrock_block"])');
    expect(prompts).not.toContain('getPromptContent("model_creation_ui")');
  });

  test("bundled prompt content contains only canonical Bedrock workflow plus disabled maintainer references", async () => {
    const files = (await readdir("prompts"))
      .filter((name) => name.endsWith(".md"))
      .sort();
    expect(files).toEqual([
      "bedrock_entity_workflow.md",
      "blockbench_code_eval_safety.md",
      "blockbench_native_apis.md",
    ]);

    const workflow = await source("prompts/bedrock_entity_workflow.md");
    expect(workflow).toContain("Protected Native Capability Gaps");
    expect(workflow).toContain("Native Bedrock PBR and per-face `material_instance` are **not** gaps");
    expect(workflow).toContain("`bedrock` — native Minecraft Bedrock geometry JSON");
  });

  test("BlockIT skill stack replaces generic upstream orchestration without duplicating modelling judgement", async () => {
    const index = await source("../.agents/skills/README.md");
    const orchestrator = await source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md");
    const texturing = await source("../.agents/skills/blockit-bedrock-texturing/SKILL.md");
    const animation = await source("../.agents/skills/blockit-bedrock-animation/SKILL.md");

    expect(index).toContain("blockbench-bedrock-modelling");
    expect(orchestrator).toContain("Protected Native Capability Gaps");
    expect(orchestrator).toContain("`bedrock` — native Minecraft Bedrock geometry JSON");
    expect(texturing).toContain("Per-Face Material Instances");
    expect(texturing).not.toContain("auto_uv_mesh");
    expect(animation).toContain("inspect_animation");
    expect(animation).toContain("animation controllers");
    expect(animation).toContain("Do not fake these with `risky_eval`");
  });

  test("generated-doc source is BlockIT-branded and install guidance does not offer the upstream hosted binary", async () => {
    const docs = await source("build/docs.ts");
    const install = await source("docs/llms/install.md");
    expect(docs).toContain("BlockIT — Bedrock Entity MCP");
    expect(install).toContain("do not install the hosted");
    expect(install).not.toContain("- [Stable](https://jasonjgardner.github.io");
  });
});
''',
)

print("Pre-local prompt/skill/documentation F-G-H patch applied.")
