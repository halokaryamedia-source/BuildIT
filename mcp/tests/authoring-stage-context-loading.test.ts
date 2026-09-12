import { describe, expect, test } from "bun:test";
import { readFile } from "node:fs/promises";

async function source(path: string): Promise<string> {
  return readFile(new URL(path, import.meta.url), "utf8");
}

describe("authoring stage context loading", () => {
  test("Geometry Texturing and Animation share one canonical cross-stage owner without routine duplicate loading", async () => {
    const loading = await source("../../docs/04-system/ai-context-loading.md");

    expect(loading).toContain("docs/04-system/authoring-stage-context.md");
    expect(loading).toContain("Normal hot path does not load this document as an additional payload");
    expect(loading).toContain("one primary specialist is active");

    for (const heading of ["## 2. GEOMETRY", "## 3. TEXTURING", "## 4. ANIMATION"]) {
      const start = loading.indexOf(heading);
      expect(start, heading).toBeGreaterThan(-1);
      const next = loading.indexOf("\n---", start);
      const section = loading.slice(start, next === -1 ? undefined : next);
      expect(section).toContain("docs/04-system/authoring-stage-context.md");
      expect(section).toContain("CONDITIONAL");
    }
  });

  test("cross-stage contract keeps context projection bounded", async () => {
    const contract = await source("../../docs/04-system/authoring-stage-context.md");

    expect(contract).toContain("canonical semantic owner, not a routine authoring payload");
    expect(contract).toContain("stage-specific projection from LazyDesigner Control");
    expect(contract).toContain("Do not load a full modelling profile or full reference package as reassurance");
    expect(contract).toContain("Reuse fresh evidence and mutation receipts");
    expect(contract).toContain("Geometry↔Texturing stays on the shared AUTHORING Runtime surface");
    expect(contract).toContain("HANDOFF_REQUIRED");
    expect(contract).toContain("READY_FOR_USER_REVIEW | BLOCKED | HANDOFF_REQUIRED");
  });
});
