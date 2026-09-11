import { describe, expect, test } from "bun:test";
import { readdir } from "node:fs/promises";
import { join, relative } from "node:path";

async function text(path: string): Promise<string> {
  return Bun.file(path).text();
}

async function walkFiles(root: string): Promise<string[]> {
  const out: string[] = [];
  const entries = await readdir(root, { withFileTypes: true });
  for (const entry of entries) {
    const path = join(root, entry.name);
    if (entry.isDirectory()) out.push(...(await walkFiles(path)));
    else out.push(path);
  }
  return out;
}

describe("AI-first documentation architecture", () => {
  test("docs root exposes exactly one entry point plus five canonical domains", async () => {
    const entries = (await readdir("../docs", { withFileTypes: true }))
      .map((entry) => entry.name)
      .sort();

    expect(entries).toEqual([
      "01-product",
      "02-reference",
      "03-authoring",
      "04-system",
      "05-operations",
      "README.md",
    ]);

    expect(await Bun.file("../docs/foundation").exists()).toBe(false);
    expect(await Bun.file("../docs/knowledge").exists()).toBe(false);
  });

  test("every domain has a navigation README and core system owners resolve", async () => {
    for (const domain of [
      "01-product",
      "02-reference",
      "03-authoring",
      "04-system",
      "05-operations",
    ]) {
      expect(await Bun.file(`../docs/${domain}/README.md`).exists()).toBe(true);
    }

    for (const owner of [
      "../docs/04-system/ai-context-loading.md",
      "../docs/04-system/authoring-stage-context.md",
      "../docs/04-system/control/context-projection.md",
      "../docs/04-system/implementation-map.md",
      "../docs/04-system/skill-taxonomy.md",
    ]) {
      expect(await Bun.file(owner).exists()).toBe(true);
    }
  });

  test("AI entry point routes by domain and defines non-overlapping authority roles", async () => {
    const root = await text("../docs/README.md");

    for (const domain of [
      "01-product/",
      "02-reference/",
      "03-authoring/",
      "04-system/",
      "05-operations/",
    ]) {
      expect(root).toContain(domain);
    }

    expect(root).toContain("04-system/ai-context-loading.md");
    expect(root).toContain("Docs     = durable semantic policy / contracts");
    expect(root).toContain("Skills   = execution procedure");
    expect(root).toContain("Control  = task/stage/context selection and projection");
    expect(root).toMatch(/Do not read all documentation by default/i);
  });

  test("context loading contract defines bounded bundles for every active task class", async () => {
    const [context, sharedStage, taxonomy] = await Promise.all([
      text("../docs/04-system/ai-context-loading.md"),
      text("../docs/04-system/authoring-stage-context.md"),
      text("../docs/04-system/skill-taxonomy.md"),
    ]);

    for (const task of [
      "REFERENCE_PREPARATION",
      "GEOMETRY",
      "TEXTURING",
      "ANIMATION",
      "SYSTEM_DEVELOPMENT",
    ]) {
      expect(context).toContain(task);
    }

    for (const loadClass of ["REQUIRED", "CONDITIONAL", "EXCLUDED"]) {
      expect(context).toContain(loadClass);
    }

    expect(context).toContain("authoring-stage-context.md");
    expect(context).toContain("exactly one selected profile");
    expect(context).toContain("Do not reload the initial package");
    expect(context).toMatch(/read all docs|load all docs/i);
    expect(sharedStage).toContain("stage-specific projection from LazyDesigner Control");
    expect(sharedStage).toContain("Domain-specific reasoning remains in the relevant specialist Skill");
    expect(taxonomy).toContain("shared semantic contract, not a Skill or router");
  });

  test("Skill taxonomy points to current hierarchy and keeps Docs/Skills/Control roles separate", async () => {
    const taxonomy = await text("../docs/04-system/skill-taxonomy.md");

    expect(taxonomy).toContain("docs/02-reference/flow.md");
    expect(taxonomy).toContain("docs/04-system/ai-context-loading.md");
    expect(taxonomy).toContain("authoring-stage-context.md");
    expect(taxonomy).toContain("Docs   = durable semantic policy / contracts");
    expect(taxonomy).toContain("Skills = execution procedure");
    expect(taxonomy).not.toContain("docs/knowledge/");
    expect(taxonomy).not.toContain("docs/foundation/");
  });

  test("active AI-facing documentation and Skills never route through removed legacy docs", async () => {
    const scanRoots = ["../docs", "../.agents/skills"];
    const files = (
      await Promise.all(scanRoots.map((root) => walkFiles(root)))
    ).flat();

    files.push(
      "../README.md",
      "../AGENTS.md",
      "../CONTEXT.md",
      "../GITHUB_RULES.md",
      "../CONTRIBUTING.md",
      "AGENTS.md",
      "README.md"
    );

    const stale: string[] = [];
    for (const file of files) {
      if (!/\.(md|txt)$/i.test(file)) continue;
      const content = await text(file);
      if (content.includes("docs/knowledge/") || content.includes("docs/foundation/")) {
        stale.push(relative("..", file));
      }
    }

    expect(stale).toEqual([]);
  });
});
