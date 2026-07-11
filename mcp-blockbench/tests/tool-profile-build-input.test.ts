import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

describe("tool profile build input", () => {
  test("build watches the one canonical profile path", () => {
    const source = readFileSync("build/index.ts", "utf8");
    expect(source).toContain('join("engines", "shared", "profiles", "tool-profiles.json")');
    expect(source).not.toContain("Engine/codex/tool-profiles.json");
  });
});
