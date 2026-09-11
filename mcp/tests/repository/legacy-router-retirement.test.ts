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
const RETIRED_DEVELOPMENT_PATHS = [
  ".agents/skills/development-brief/SKILL.md",
  ".agents/skills/mcp-server-development/SKILL.md",
  ".agents/skills/blockbench-runtime-development/SKILL.md",
] as const;
const CANONICAL_DEVELOPMENT_PATHS = [
  ".agents/skills/lazydesigner-development-brief/SKILL.md",
  ".agents/skills/lazydesigner-mcp-development/SKILL.md",
  ".agents/skills/lazydesigner-blockbench-development/SKILL.md",
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

describe("canonical LazyDesigner Skill identity", () => {
  test("retired authoring and development Skill files stay physically absent", async () => {
    expect(await Bun.file(`../${RETIRED_ROUTER_PATH}`).exists()).toBe(false);
    for (const path of [...RETIRED_SPECIALIST_PATHS, ...RETIRED_DEVELOPMENT_PATHS]) {
      expect(await Bun.file(`../${path}`).exists(), path).toBe(false);
    }
    for (const path of [...CANONICAL_SPECIALIST_PATHS, ...CANONICAL_DEVELOPMENT_PATHS]) {
      expect(await Bun.file(`../${path}`).exists(), path).toBe(true);
    }
  });

  test("active authority, tests and CI do not reload retired Skill paths", async () => {
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
      for (const retired of [...RETIRED_SPECIALIST_PATHS, ...RETIRED_DEVELOPMENT_PATHS]) {
        expect(text, path).not.toContain(retired);
      }
    }
  });

  test("Control and canonical LazyDesigner specialist identities remain authoritative", async () => {
    const [agents, taxonomy, control, registry] = await Promise.all([
      Bun.file("../AGENTS.md").text(),
      Bun.file("../docs/04-system/skill-taxonomy.md").text(),
      Bun.file("gateway/control/packet.ts").text(),
      Bun.file("gateway/control/registry.ts").text(),
    ]);

    expect(agents).toContain("LazyDesigner Control");
    expect(agents).toContain("exactly one active specialist");
    expect(taxonomy).toContain("lazydesigner-development-brief");
    expect(taxonomy).toContain("lazydesigner-mcp-development");
    expect(taxonomy).toContain("lazydesigner-blockbench-development");
    expect(control).toContain("contextForAuthoringDomain");
    for (const canonical of CANONICAL_SPECIALIST_PATHS) {
      expect(registry).toContain(canonical);
    }
  });
});
