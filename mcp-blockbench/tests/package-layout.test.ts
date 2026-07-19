import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";

const read = (path: string) => readFileSync(path, "utf8");

describe("canonical MCP package layout", () => {
  test("keeps package source and generated bundle in the canonical root", () => {
    for (const path of [
      "package.json",
      "src/index.ts",
      "src/runtime.ts",
      "src/lib/renderedGeometry.ts",
      "src/server/tools/geometry-direct-transform.ts",
      "dist/mcp.js",
    ]) {
      expect(existsSync(path), path).toBe(true);
    }
  });

  test("documents the zero-setup rendered-world production path", () => {
    const readme = read("README.md");
    expect(readme).toContain("create_project(session_root, asset_id)");
    expect(readme).toContain("apply_cube_transforms");
    expect(readme).toContain("matrixWorld");
    expect(readme).toContain("Normal production must not require");
  });
});
