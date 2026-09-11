import { describe, expect, test } from "bun:test";
import { readdir } from "node:fs/promises";
import { join } from "node:path";

const RETIRED_ROUTER_PATH = ".agents/skills/blockit-bedrock-entity-mcp/SKILL.md";
const RETIRED_SPECIALIST_PATHS = [
  ".agents/skills/blockbench-bedrock-modelling/SKILL.md",
  ".agents/skills/blockit-bedrock-texturing/SKILL.md",
  ".agents/skills/blockit-bedrock-animation/SKILL.md",
] as const;
const CANONICAL_SPECIALIST_PATHS = [
  ".agents/skills/lazydesigner-modelling/SKILL.md",
  ".agents/skills/lazydesigner-texturing/SKILL.md",
  ".agents/skills/lazydesigner-animation/SKILL.md",
] as const;

async function collectTextFiles(root: string): Promise<string[]> {
  const entries = await readdir(root, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const path = join(root, entry.name);
    if (entry.isDirectory()) {
      files.push(...await collectTextFiles(path));
      continue;
    }
    if (/\.(?:md|ts|yml|yaml)$/.test(entry.name)) files.push(path);
  }
  return files;
}

describe("retired authoring routing integrity", () => {
  test("legacy router and pre-LazyDesigner specialist files stay physically absent", async () => {
    expect(await Bun.file(`../${RETIRED_ROUTER_PATH}`).exists()).toBe(false);
    for (const path of RETIRED_SPECIALIST_PATHS) {
      expect(await Bun.file(`../${path}`).exists(), path).toBe(false);
    }
    for (const path of CANONICAL_SPECIALIST_PATHS) {
      expect(await Bun.file(`../${path}`).exists(), path).toBe(true);
    }
  });

  test("active authoring authority, tests and CI do not reload retired authoring Skills", async () => {
    const roots = [
      "../AGENTS.md",
      "../workspace/README.md",
      "../docs/03-authoring",
      "../docs/04-system",
      "../docs/05-operations",
      "tests/authoring",
      "tests/repository",
      "../.github/workflows",
    ];

    const files: string[] = [];
    for (const root of roots) {
      if (root.endsWith(".md")) files.push(root);
      else files.push(...await collectTextFiles(root));
    }

    for (const path of files) {
      if (path.endsWith("legacy-router-retirement.test.ts")) continue;
      const text = await Bun.file(path).text();
      expect(text, path).not.toContain(RETIRED_ROUTER_PATH);
      for (const retired of RETIRED_SPECIALIST_PATHS) {
        expect(text, path).not.toContain(retired);
      }
    }
  });

  test("Control and exactly-one-specialist routing remain canonical", async () => {
    const [agents, taxonomy, control, registry] = await Promise.all([
      Bun.file("../AGENTS.md").text(),
      Bun.file("../docs/04-system/skill-taxonomy.md").text(),
      Bun.file("gateway/control/packet.ts").text(),
      Bun.file("gateway/control/registry.ts").text(),
    ]);

    expect(agents).toContain("LazyDesigner Control");
    expect(agents).toContain("exactly one active specialist");
    expect(taxonomy).toContain("asset-router Skill is **retired and removed**");
    expect(control).toContain("contextForAuthoringDomain");
    for (const canonical of CANONICAL_SPECIALIST_PATHS) {
      expect(registry).toContain(canonical);
    }
  });
});
