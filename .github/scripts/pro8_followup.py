from pathlib import Path

p = Path("mcp/prompts/bedrock_entity_workflow.md")
t = p.read_text()
old = "Molang strings use `manage_keyframes`; MCP never evaluates them. `inspect_animation` can read controller/state structure, but controller creation/mutation remains a gap. TextureMesh, visible bounds, existing-animation sound/timeline mutation, animated textures, and bone-binding expressions remain gaps; do not fake them."
new = "Molang: `manage_keyframes`; no MCP eval. `inspect_animation` reads controllers. Controller mutation, TextureMesh, visible bounds, sound/timeline mutation, animated textures, bone-binding expressions remain gaps; do not fake them."
if old not in t:
    raise SystemExit("PRO-8 prompt compact anchor missing")
p.write_text(t.replace(old, new, 1))

p = Path(".agents/skills/blockit-bedrock-animation/SKILL.md")
t = p.read_text()
old = "`inspect_animation` may read AnimationController/state structure. Controller creation/mutation remains a protected state-machine gap; existing-animation sound/timeline mutation and bone-binding expressions also remain protected gaps."
new = "`inspect_animation` may read animation controllers/state structure. Controller creation/mutation remains a protected state-machine gap; existing-animation sound/timeline mutation and bone-binding expressions also remain protected gaps."
if old not in t:
    raise SystemExit("PRO-8 skill compatibility anchor missing")
p.write_text(t.replace(old, new, 1))
