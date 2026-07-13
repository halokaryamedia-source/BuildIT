from pathlib import Path

# Temporary verified migration for the smart attachment runtime.
path = Path("mcp-blockbench/src/server/tools/geometry-rotation.ts")
text = path.read_text(encoding="utf-8")

origin_old = '''    const origin = Array.isArray(parent.origin) ? vec(parent.origin) : [0, 0, 0];'''
origin_new = '''    const origin: Vec3 = Array.isArray(parent.origin)
      ? vec(parent.origin)
      : [0, 0, 0];'''
if text.count(origin_old) != 1:
    raise RuntimeError(f"Expected one origin fallback, found {text.count(origin_old)}")
text = text.replace(origin_old, origin_new, 1)

rotation_old = '''    const rotation = Array.isArray(parent.rotation)
      ? vec(parent.rotation)
      : [0, 0, 0];'''
rotation_new = '''    const rotation: Vec3 = Array.isArray(parent.rotation)
      ? vec(parent.rotation)
      : [0, 0, 0];'''
if text.count(rotation_old) != 2:
    raise RuntimeError(f"Expected two parent rotation fallbacks, found {text.count(rotation_old)}")
text = text.replace(rotation_old, rotation_new)

inverse_old = '''    const rotation = Array.isArray(parents[index].rotation)
      ? vec(parents[index].rotation as number[])
      : [0, 0, 0];'''
inverse_new = '''    const rotation: Vec3 = Array.isArray(parents[index].rotation)
      ? vec(parents[index].rotation as number[])
      : [0, 0, 0];'''
if text.count(inverse_old) != 1:
    raise RuntimeError(f"Expected one inverse rotation fallback, found {text.count(inverse_old)}")
text = text.replace(inverse_old, inverse_new, 1)

path.write_text(text, encoding="utf-8")
print("Patched all smart rotation Vec3 fallbacks.")
