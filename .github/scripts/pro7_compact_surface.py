from pathlib import Path

p = Path('mcp/server/tools/animation.ts')
t = p.read_text()
replacements = [
    (
        '"Bedrock sound effect identifier."',
        '"Bedrock sound effect ID."',
    ),
    (
        '"Optional Locator name for the sound event."',
        '"Optional sound Locator name."',
    ),
    (
        '"Sound effects keyed by unique finite non-negative timestamps; each value is one effect or a non-empty effect array."',
        '"Sound effects by unique non-negative timestamp; one effect or non-empty array."',
    ),
    (
        '"Creates a Bedrock animation from finite numeric transforms plus optional particle/sound effects. Accepts `walk` or canonical `animation.walk`; prefix is applied once. Use manage_keyframes for Molang transforms."',
        '"Creates Bedrock animation numeric transforms plus optional particle/sound effects. Names accept `walk` or `animation.walk`; use manage_keyframes for Molang."',
    ),
]
for old, new in replacements:
    if old not in t:
        raise SystemExit(f'Expected PRO-7 surface text missing: {old}')
    t = t.replace(old, new, 1)
p.write_text(t)
