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

    const [root, developmentBrief, mcpDevelopment, orchestrator] = await Promise.all([
      source("../AGENTS.md"),
      source("../.agents/skills/development-brief/SKILL.md"),
      source("../.agents/skills/mcp-server-development/SKILL.md"),
      source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md"),
    ]);

    const referenced = new Set([
      ...backtickedSkillLikeNames(root),
      ...backtickedSkillLikeNames(developmentBrief),
      ...backtickedSkillLikeNames(mcpDevelopment),
      ...backtickedSkillLikeNames(orchestrator),
    ]);

    for (const name of referenced) {
      expect(canonical.has(name)).toBe(true);
      expect(await Bun.file(`../.agents/skills/${name}/SKILL.md`).exists()).toBe(true);
    }
  });

  test("MCP Verify tracks non-mcp owners consumed by executable contract tests", async () => {
    const workflow = await source("../.github/workflows/mcp-verify.yml");
    for (const path of [
      ".agents/skills/blockit-bedrock-entity-mcp/**",
      ".agents/skills/blockbench-bedrock-modelling/**",
      ".agents/skills/blockit-bedrock-texturing/**",
      ".agents/skills/blockit-bedrock-animation/**",
      "docs/05-operations/next-action.md",
    ]) {
      expect(workflow).toContain(`- "${path}"`);
    }
    expect(workflow).not.toContain("docs/knowledge/");
    expect(workflow).not.toContain("docs/foundation/");
  });
});
