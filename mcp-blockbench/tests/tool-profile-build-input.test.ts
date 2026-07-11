import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

describe("tool profile build input", () => {
  test("build watches the one canonical shared profile path", () => {
    const source = readFileSync("scripts/index.ts", "utf8");
    expect(source).toContain('resolve("../engines/shared/profiles")');
    expect(source).not.toContain("Engine/codex/tool-profiles.json");
  });
});
