from pathlib import Path

root = Path(__file__).resolve().parents[2]
path = root / "mcp-blockbench/src/server/tools/workflow.ts"
source = path.read_text(encoding="utf-8")
old = """          let uvOutOfBounds = 0;
          for (const cube of Cube.all) {"""
new = """          const textureWidth = Project.texture_width;
          const textureHeight = Project.texture_height;
          let uvOutOfBounds = 0;
          for (const cube of Cube.all) {"""
if source.count(old) != 1:
    raise RuntimeError(f"Expected one UV validation anchor, found {source.count(old)}")
source = source.replace(old, new, 1)
old = "value < 0 || value > (index % 2 === 0 ? Project.texture_width : Project.texture_height)"
new = "value < 0 || value > (index % 2 === 0 ? textureWidth : textureHeight)"
if source.count(old) != 1:
    raise RuntimeError(f"Expected one Project UV width expression, found {source.count(old)}")
source = source.replace(old, new, 1)
path.write_text(source, encoding="utf-8")
print("Applied Project narrowing fix.")
