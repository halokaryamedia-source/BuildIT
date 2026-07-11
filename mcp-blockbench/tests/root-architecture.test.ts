import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";

const read = (path: string) => readFileSync(path, "utf8");

describe("canonical root architecture", () => {
  test("uses one root authority per concern", () => {
    for (const path of ["src", "engines", "workspace", "docs", "openspec", "build"]) {
      expect(existsSync(path), `${path} should exist`).toBe(true);
    }
    for (const legacy of ["Engine", "SavedData", "SourceDocument"]) {
      expect(existsSync(legacy), `${legacy} must not return`).toBe(false);
    }
  });

  test("root navigation contains no versioned duplicate naming", () => {
    const root = read("README.md");
    expect(root).toContain("engines/");
    expect(root).toContain("workspace/");
    expect(root).toContain("docs/");
    expect(root).not.toMatch(/\b(v2|latest|new[-_ ]version)\b/i);
  });

  test("runtime and code imports use canonical paths", () => {
    expect(read("src/lib/toolProfiles.ts")).toContain("engines/shared/profiles/tool-profiles.json");
    const build = read("build/index.ts");
    expect(build).toContain("src/assets/icon.svg");
    expect(build).toContain("engines/shared/profiles/tool-profiles.json");
    expect(build).toContain("docs/product/about.md");
  });
});
