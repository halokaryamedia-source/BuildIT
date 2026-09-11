import { describe, expect, test } from "bun:test";
import { readFile } from "node:fs/promises";

async function source(path: string): Promise<string> {
  return readFile(new URL(path, import.meta.url), "utf8");
}

describe("authoring stage context loading", () => {
  test("Geometry Texturing and Animation share one cross-stage context owner", async () => {
    const loading = await source("../../docs/04-system/ai-context-loading.md");

    expect(loading).toContain("docs/04-system/authoring-stage-context.md");
    expect(loading).toContain("load it **once per oriented authoring task/session**");
    expect(loading).toContain("reuse it while unchanged");

    for (const heading of ["## 2. GEOMETRY", "## 3. TEXTURING", "## 4. ANIMATION"]) {
      const start = loading.indexOf(heading);
      expect(start, heading).toBeGreaterThan(-1);
      const next = loading.indexOf("\n---", start);
      const section = loading.slice(start, next === -1 ? undefined : next);
      expect(section).toContain("docs/04-system/authoring-stage-context.md");
    }
  });

  test("cross-stage contract keeps context projection bounded", async () => {
    const contract = await source("../../docs/04-system/authoring-stage-context.md");

    expect(contract).toContain("stage-specific projection from LazyDesigner Control");
    expect(contract).toContain("Do not load a full modelling profile or full reference package as reassurance");
    expect(contract).toContain("Reuse fresh evidence and mutation receipts");
    expect(contract).toContain("Geometry↔Texturing stays on the shared AUTHORING surface");
    expect(contract).toContain("HANDOFF_REQUIRED");
    expect(contract).toContain("READY_FOR_USER_REVIEW | BLOCKED | HANDOFF_REQUIRED");
  });
});
