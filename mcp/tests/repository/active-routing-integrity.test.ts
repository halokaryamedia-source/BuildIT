import { describe, expect, test } from "bun:test";
import { readdir } from "node:fs/promises";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

function backtickedLazyDesignerSkillNames(text: string): string[] {
  return [...text.matchAll(/`(lazydesigner-[a-z0-9-]+)`/g)]
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

    const [root, developmentBrief, mcpDevelopment, blockbenchDevelopment] = await Promise.all([
      source("../AGENTS.md"),
      source("../.agents/skills/lazydesigner-development-brief/SKILL.md"),
      source("../.agents/skills/lazydesigner-mcp-development/SKILL.md"),
      source("../.agents/skills/lazydesigner-blockbench-development/SKILL.md"),
    ]);

    const referenced = new Set([
      ...backtickedLazyDesignerSkillNames(root),
      ...backtickedLazyDesignerSkillNames(developmentBrief),
      ...backtickedLazyDesignerSkillNames(mcpDevelopment),
      ...backtickedLazyDesignerSkillNames(blockbenchDevelopment),
    ]);

    for (const name of referenced) {
      expect(canonical.has(name), name).toBe(true);
      expect(await Bun.file(`../.agents/skills/${name}/SKILL.md`).exists(), name).toBe(true);
    }

    for (const retired of [
      ".agents/skills/blockit-bedrock-entity-mcp/SKILL.md",
      ".agents/skills/blockbench-bedrock-modelling/SKILL.md",
      ".agents/skills/blockit-bedrock-texturing/SKILL.md",
      ".agents/skills/blockit-bedrock-animation/SKILL.md",
    ]) expect(root).not.toContain(retired);
  });

  test("MCP Verify tracks canonical non-mcp specialist owners without legacy router trigger", async () => {
    const workflow = await source("../.github/workflows/mcp-verify.yml");
    for (const path of [
      ".agents/skills/lazydesigner-modelling/**",
      ".agents/skills/lazydesigner-texturing/**",
      ".agents/skills/lazydesigner-animation/**",
      "docs/05-operations/next-action.md",
    ]) {
      expect(workflow).toContain(`- "${path}"`);
    }
    for (const legacy of [
      ".agents/skills/blockbench-bedrock-modelling/**",
      ".agents/skills/blockit-bedrock-texturing/**",
      ".agents/skills/blockit-bedrock-animation/**",
      ".agents/skills/blockit-bedrock-entity-mcp/**",
    ]) expect(workflow).not.toContain(legacy);
    expect(workflow).not.toContain("docs/knowledge/");
    expect(workflow).not.toContain("docs/foundation/");
  });
});
