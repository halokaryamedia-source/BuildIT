import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";

const root = "..";

describe("canonical root architecture", () => {
  test("keeps the complete MCP package under one root", () => {
    for (const path of [
      "src/index.ts",
      "scripts/index.ts",
      "prompts/manifest.json",
      "tests/workflow-config.test.ts",
      "package.json",
      "bun.lock",
      "tsconfig.json",
    ]) {
      expect(existsSync(path), path).toBe(true);
    }
  });

  test("removes duplicate root-level package and legacy roots", () => {
    for (const path of [
      "src",
      "build",
      "prompts",
      "tests",
      "package.json",
      "bun.lock",
      "tsconfig.json",
      "skills-lock.json",
      "Engine",
      "SavedData",
      "SourceDocument",
    ]) {
      expect(existsSync(`${root}/${path}`), path).toBe(false);
    }
  });

  test("keeps one domain authority per concern", () => {
    for (const path of ["engines", "workspace", "docs", "openspec"]) {
      expect(existsSync(`${root}/${path}`), path).toBe(true);
    }
    expect(existsSync(`${root}/engines/shared/skills/skills-lock.json`)).toBe(true);
  });

  test("runtime and build imports use canonical paths", () => {
    expect(readFileSync("src/lib/toolProfiles.ts", "utf8")).toContain(
      "../../../engines/shared/profiles/tool-profiles.json"
    );
    const build = readFileSync("scripts/index.ts", "utf8");
    expect(build).toContain("src/assets/icon.svg");
    expect(build).toContain("../engines/shared/profiles");
    expect(build).toContain("../docs/product/about.md");
  });

  test("generated API documentation has one target", () => {
    const generator = readFileSync("scripts/docs.ts", "utf8");
    expect(generator).toContain("../../docs/api");
    expect(existsSync(`${root}/docs/api/README.md`)).toBe(true);
  });

  test("root navigation forbids versioned duplicate naming", () => {
    const readme = readFileSync(`${root}/README.md`, "utf8");
    expect(readme).toContain("mcp-blockbench/");
    expect(readme).toContain("Do not create `v2`, `new`, `latest`, `backup`");
  });
});
