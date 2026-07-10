import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

describe("tool profile build integration", () => {
  test("profile config changes rebuild the bundled Blockbench plugin", () => {
    const build = readFileSync("build/index.ts", "utf8");
    expect(build).toContain('join("Engine", "codex", "tool-profiles.json")');
  });

  test("profile runtime is initialized only after the capability library is registered", () => {
    const registry = readFileSync("src/server/tools.ts", "utf8");
    const coreLoop = registry.indexOf("for (const register of registrationFunctions)");
    const optionalLoop = registry.indexOf("for (const register of optionalRegistrationFunctions)");
    const initialize = registry.indexOf("initializeToolProfiles();");

    expect(coreLoop).toBeGreaterThanOrEqual(0);
    expect(optionalLoop).toBeGreaterThan(coreLoop);
    expect(initialize).toBeGreaterThan(optionalLoop);
  });
});
