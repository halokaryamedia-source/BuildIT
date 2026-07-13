from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
path = ROOT / "mcp-blockbench/tests/reference-studio-golden-sample-sync.test.ts"
source = path.read_text(encoding="utf-8")
old = '''const baseViews = [
  "front",
  "left_side",
  "back",
  "top_footprint",
  "front_left_3_4",
];'''
new = '''const baseViews = [
  "front",
  "left_side",
  "back",
  "top_footprint",
  "front_left_3_4",
] as const;'''
if old not in source:
    raise RuntimeError("baseViews typing anchor missing")
path.write_text(source.replace(old, new, 1), encoding="utf-8")
print("Reference Studio sync test typing fixed.")
