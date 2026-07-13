from pathlib import Path

path = Path("mcp-blockbench/src/server/tools/geometry-rotation.ts")
text = path.read_text(encoding="utf-8")

replacements = [
    (
        '''    const origin = Array.isArray(parent.origin) ? vec(parent.origin) : [0, 0, 0];''',
        '''    const origin: Vec3 = Array.isArray(parent.origin)
      ? vec(parent.origin)
      : [0, 0, 0];''',
    ),
    (
        '''    const rotation = Array.isArray(parent.rotation)
      ? vec(parent.rotation)
      : [0, 0, 0];''',
        '''    const rotation: Vec3 = Array.isArray(parent.rotation)
      ? vec(parent.rotation)
      : [0, 0, 0];''',
    ),
    (
        '''    const rotation = Array.isArray(parents[index].rotation)
      ? vec(parents[index].rotation as number[])
      : [0, 0, 0];''',
        '''    const rotation: Vec3 = Array.isArray(parents[index].rotation)
      ? vec(parents[index].rotation as number[])
      : [0, 0, 0];''',
    ),
]

for old, new in replacements:
    if old not in text:
        raise RuntimeError(f"Missing type patch anchor: {old[:80]}")
    text = text.replace(old, new, 1)

path.write_text(text, encoding="utf-8")
print("Patched smart rotation Vec3 fallbacks.")
