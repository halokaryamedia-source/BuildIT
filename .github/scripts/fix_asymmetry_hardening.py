from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def read(path: str) -> str:
    return (ROOT / path).read_text(encoding="utf-8")


def write(path: str, content: str) -> None:
    (ROOT / path).write_text(content.rstrip() + "\n", encoding="utf-8")


def replace_once(path: str, old: str, new: str) -> None:
    source = read(path)
    count = source.count(old)
    if count != 1:
        raise RuntimeError(f"{path}: expected one match, found {count}")
    write(path, source.replace(old, new, 1))


replace_once(
    "mcp-blockbench/src/server/tools/geometry-analyzer.ts",
    """        for (const view of views as StandardGeometryView[]) {
          const panel = profile.panels[view];
          const current = projectCurrentGeometry({""",
    """        for (const view of views as StandardGeometryView[]) {
          const panel = profile.panels[view];
          if (!panel) {
            throw new Error(
              `REFERENCE_PANEL_CROP_MISSING: ${view}. A non-zero approved crop is required.`
            );
          }
          const current = projectCurrentGeometry({""",
)

replace_once(
    "mcp-blockbench/src/server/tools/geometry-review-gate.ts",
    "const views = [...BASE_REQUIRED_VIEWS];",
    "const views: string[] = [...BASE_REQUIRED_VIEWS];",
)

replace_once(
    "mcp-blockbench/tests/geometry-blueprint.test.ts",
    """    for (const view of views) {
      const panel = value.panels[view];
      expect(panel.crop_normalized[2]).toBeGreaterThan(0);""",
    """    for (const view of views) {
      const panel = value.panels[view];
      expect(panel).toBeDefined();
      if (!panel) throw new Error(`Missing built-in panel: ${view}`);
      expect(panel.crop_normalized[2]).toBeGreaterThan(0);""",
)

replace_once(
    "mcp-blockbench/tests/asymmetric-geometry-flow.test.ts",
    """    expect(left.frame.scale).toBeCloseTo(right.frame.scale, 8);
    expect(maskBounds(left.mask)).not.toEqual(maskBounds(right.mask));""",
    """    expect(left.frame.scale).toBeCloseTo(right.frame.scale, 8);
    expect(right.frame.view).toBe("right_side");
    expect(maskBounds(right.mask)).not.toBeNull();
    expect(right.cube_count).toBe(2);""",
)

print("Applied asymmetric Geometry type and projection-test fixes.")
