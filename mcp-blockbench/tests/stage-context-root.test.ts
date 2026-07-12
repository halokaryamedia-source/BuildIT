import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolveCanonicalStageSessionRoot } from "../src/server/stage-context-root-guards";

function fakeFs(existing: string[]) {
  const normalized = new Set(existing.map((value) => value.replace(/\\/g, "/")));
  return {
    existsSync(path: string) {
      return normalized.has(path.replace(/\\/g, "/"));
    },
  };
}

describe("compact stage context session-root recovery", () => {
  test("keeps an already canonical MCP session root", () => {
    const root = "workspace/active/black_rhinoceros/mcp";
    const fs = fakeFs([`${root}/state.json`, `${root}/project.json`]);
    expect(resolveCanonicalStageSessionRoot(fs, root)).toBe(root);
  });

  test("normalizes an asset root to its canonical mcp directory", () => {
    const assetRoot = "workspace/active/black_rhinoceros";
    const canonical = `${assetRoot}/mcp`;
    const fs = fakeFs([`${canonical}/state.json`, `${canonical}/project.json`]);
    expect(resolveCanonicalStageSessionRoot(fs, assetRoot)).toBe(canonical);
  });

  test("preserves an unresolved path so the canonical tool reports the missing authority", () => {
    const root = "workspace/active/missing_asset";
    expect(resolveCanonicalStageSessionRoot(fakeFs([]), root)).toBe(root);
  });

  test("does not reject multiple connected sessions before a write is requested", () => {
    const source = readFileSync("src/lib/mutationContext.ts", "utf8");
    expect(source).not.toContain("WRITE_LEASE_SESSION_AMBIGUOUS");
    expect(source).toContain("Multiple connected sessions are valid for read-only inspection");
    expect(source).toContain("WRITE_LEASE_SESSION_REQUIRED");
  });

  test("installs root normalization before profile and final context routing guards", () => {
    const source = readFileSync("src/server/tools.ts", "utf8");
    const rootGuard = source.indexOf("installStageContextRootGuards();");
    const profiles = source.indexOf("initializeToolProfiles();");
    const routing = source.indexOf("installStageContextRoutingGuards();");
    expect(rootGuard).toBeGreaterThan(-1);
    expect(profiles).toBeGreaterThan(rootGuard);
    expect(routing).toBeGreaterThan(profiles);
  });
});
