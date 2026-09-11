import { describe, expect, test } from "bun:test";
import { readdir } from "node:fs/promises";
import { join } from "node:path";

const RETIRED_SKILL_PATH = ".agents/skills/blockit-bedrock-entity-mcp/SKILL.md";

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

describe("retired asset-router integrity", () => {
  test("legacy router Skill stays physically absent", async () => {
    expect(await Bun.file(`../${RETIRED_SKILL_PATH}`).exists()).toBe(false);
  });

  test("active authoring authority, tests and CI do not reload the retired router", async () => {
    const roots = [
      "../AGENTS.md",
      "../workspace/README.md",
      "../docs/03-authoring",
      "../docs/04-system",
      "../docs/05-operations",
      "tests/authoring",
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
      expect(text, path).not.toContain(RETIRED_SKILL_PATH);
    }
  });

  test("Control and exactly-one-specialist routing remain canonical", async () => {
    const [agents, taxonomy, control] = await Promise.all([
      Bun.file("../AGENTS.md").text(),
      Bun.file("../docs/04-system/skill-taxonomy.md").text(),
      Bun.file("gateway/control/packet.ts").text(),
    ]);

    expect(agents).toContain("LazyDesigner Control");
    expect(agents).toContain("exactly one matching current-worktree specialist");
    expect(taxonomy).toContain("asset-router Skill is **retired and removed**");
    expect(control).toContain("contextForAuthoringDomain");
  });
});
