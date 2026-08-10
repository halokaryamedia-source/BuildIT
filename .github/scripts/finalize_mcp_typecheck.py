from pathlib import Path


def replace_exact(path: str, old: str, new: str, expected: int = 1) -> None:
    p = Path(path)
    text = p.read_text()
    count = text.count(old)
    if count != expected:
        raise SystemExit(f"{path}: expected {expected} match(es), found {count}: {old!r}")
    p.write_text(text.replace(old, new))


replace_exact(
    "mcp/server/tools/paint.ts",
    "const runtimePainter = Painter as unknown as BlockbenchRuntimePainter;\n\nexport function registerPaintTools() {",
    "export function registerPaintTools() {\n  const runtimePainter = Painter as unknown as BlockbenchRuntimePainter;",
)

replace_exact(
    "mcp/server/tools/texture.ts",
    "textureGroup.material_config.color_value = color_value;",
    "textureGroup.material_config.color_value = [\n            color_value[0],\n            color_value[1],\n            color_value[2],\n            color_value[3],\n          ];",
    expected=2,
)
replace_exact(
    "mcp/server/tools/texture.ts",
    "textureGroup.material_config.mer_value = mer_value;",
    "textureGroup.material_config.mer_value = [\n            mer_value[0],\n            mer_value[1],\n            mer_value[2],\n          ];",
    expected=2,
)
