import { describe, expect, test } from "bun:test";
import { readFile } from "node:fs/promises";

const root = new URL("../../", import.meta.url);

async function readRepo(path: string): Promise<string> {
  return readFile(new URL(path, root), "utf8");
}

describe("LazyDesigner reference fidelity contract", () => {
  test("reference standard preserves buildable structural evidence", async () => {
    const reference = await readRepo("docs/02-reference/image/standard.md");

    expect(reference).toContain("required parts are present");
    expect(reference).toContain("FRONT → width / height / visible part count / primary silhouette");
    expect(reference).toContain("LEFT  → depth / profile / attachment / body axis");
    expect(reference).toContain("attachments/openings agree");
    expect(reference).toContain("cross-view structural contradiction");
    expect(reference).toContain("joint");
  });

  test("geometry blocks material construction gaps before primary batch", async () => {
    const modelling = await readRepo(
      ".agents/skills/lazydesigner-modelling/SKILL.md"
    );

    expect(modelling).toContain("### Reference Evidence Contract");
    expect(modelling).toContain("primary mass inventory + required visible part count");
    expect(modelling).toContain("attachment/topology graph");
    expect(modelling).toContain("primary-part checklist");
    expect(modelling).toContain("No silent omission");
    expect(modelling).toContain("Depth rule");
    expect(modelling).toContain("Largest-difference-first");
    expect(modelling).toContain("Cross-view regression rule");
  });

  test("fidelity remains qualitative and causal instead of scalar", async () => {
    const modelling = await readRepo(
      ".agents/skills/lazydesigner-modelling/SKILL.md"
    );
    const reference = await readRepo("docs/02-reference/image/standard.md");

    expect(modelling).toContain("observed difference | severity | owning cause");
    expect(modelling).toContain("similarity scores cannot justify `PASS`");
    expect(modelling).toContain("no required orthographic relation materially regresses");
    expect(reference).toContain("cross-view structural contradiction");
  });
});
