import { describe, expect, test } from "bun:test";
import { readFile } from "node:fs/promises";

const root = new URL("../../", import.meta.url);

async function readRepo(path: string): Promise<string> {
  return readFile(new URL(path, root), "utf8");
}

describe("BlockIT reference fidelity contract", () => {
  test("reference generator preserves buildable structural evidence", async () => {
    const reference = await readRepo(
      ".agents/skills/blockbench-reference-generator/SKILL.md"
    );

    expect(reference).toContain("## Buildable Evidence Handoff");
    expect(reference).toContain("required visible part count");
    expect(reference).toContain("attachment/contact direction");
    expect(reference).toContain("Cross-view completeness");
    expect(reference).toContain("Depth readability");
    expect(reference).toContain("largest structural difference first");
    expect(reference).toContain("joint neighborhoods readable");
  });

  test("geometry blocks material construction gaps before primary batch", async () => {
    const modelling = await readRepo(
      ".agents/skills/blockbench-bedrock-modelling/SKILL.md"
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
      ".agents/skills/blockbench-bedrock-modelling/SKILL.md"
    );
    const reference = await readRepo(
      ".agents/skills/blockbench-reference-generator/SKILL.md"
    );

    expect(modelling).toContain("observed difference | severity | owning cause");
    expect(modelling).toContain("similarity scores cannot justify `PASS`");
    expect(reference).toContain("must not fix one view by materially breaking another");
  });
});
