import { describe, expect, test } from "bun:test";
import { readdir } from "node:fs/promises";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

function backtickedSkillLikeNames(text: string): string[] {
  return [...text.matchAll(/`([a-z0-9]+(?:-[a-z0-9]+)+)`/g)]
    .map((match) => match[1])
    .filter((name, index, all) => all.indexOf(name) === index)
    .sort();
}

describe("active routing integrity", () => {
  test("active repository skill references resolve to canonical skill packages", async () => {
    const canonical = new Set(
      (await readdir("../.agents/skills", { withFileTypes: true }))
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
    );

    const activation = await source("../docs/knowledge/skills/activation-matrix.md");
    const activeActivation = activation.split("## 7. Retired / External Helpers")[0];
    const developmentBrief = await source(
      "../.agents/skills/development-brief/SKILL.md"
    );
    const mcpDevelopment = await source(
      "../.agents/skills/mcp-server-development/SKILL.md"
    );

    const referenced = new Set([
      ...backtickedSkillLikeNames(activeActivation),
      ...backtickedSkillLikeNames(developmentBrief),
      ...backtickedSkillLikeNames(mcpDevelopment),
    ]);

    for (const name of referenced) {
      expect(canonical.has(name)).toBe(true);
      expect(await Bun.file(`../.agents/skills/${name}/SKILL.md`).exists()).toBe(true);
    }
  });
});
