from pathlib import Path


def replace_once(path: str, old: str, new: str) -> None:
    p = Path(path)
    text = p.read_text()
    if old not in text:
        raise SystemExit(f"Expected text not found in {path}: {old[:160]!r}")
    p.write_text(text.replace(old, new, 1))


replace_once(
    ".agents/skills/blockit-bedrock-animation/SKILL.md",
    "Professional motion has no keyframe/FPS/Bezier target. Choose timing, interpolation, loop, and bones from the motion. `manage_keyframes` preserves explicit Molang transform strings; never evaluate or guess-bake them.",
    "Professional motion has no keyframe-count, FPS, or Bezier-complexity target. Choose timing/loop/bones from the motion. For expression-valued transform keyframes, `manage_keyframes` preserves explicit Molang strings; never evaluate or guess-bake them.",
)
replace_once(
    ".agents/skills/blockit-bedrock-animation/SKILL.md",
    "Controllers, sound/timeline-effect keyframes, and bone-binding expressions remain protected gaps. Do not route them through `risky_eval` or generic UI actions.",
    "Direct MCP authoring still does not own animation controllers, sound/timeline-effect keyframes, or bone-binding expressions. Do not route them through `risky_eval` or generic UI actions.",
)
replace_once(
    "mcp/prompts/bedrock_entity_workflow.md",
    "Molang transform strings use `manage_keyframes`; MCP never evaluates them. TextureMesh, visible bounding boxes, animation controllers, sound/timeline effects, animated textures, and bone-binding expressions remain gaps; do not fake them. Native PBR/material instances are not gaps.",
    "Molang strings use `manage_keyframes`; MCP never evaluates them. TextureMesh, visible bounds, controllers, sound/timeline effects, animated textures, and bone-binding expressions remain gaps; do not fake them. Native Bedrock PBR and per-face `material_instance` are **not** gaps.",
)

p = Path("docs/knowledge/next-action.md")
text = p.read_text()
needle = "The user explicitly does **not** want local Codex/Blockbench testing yet. `NO LOCAL RUN ACTIVE`. Professional samples remain learning evidence, never presets/templates/count targets.\n"
if needle not in text:
    raise SystemExit("Next-action no-local marker missing")
p.write_text(text.replace(
    needle,
    needle + "\nDo not claim live Blockbench/model-quality improvement without actual runtime proof.\n",
    1,
))
