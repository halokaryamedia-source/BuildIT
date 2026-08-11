import { describe, expect, test } from "bun:test";
import { readdir } from "node:fs/promises";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("Bedrock prompt and skill surface", () => {
  test("runtime MCP exposes only the canonical Bedrock workflow prompt", async () => {
    const prompts = await source("server/prompts.ts");
    expect(prompts).toContain('createPrompt("bedrock_entity_workflow"');
    expect(prompts).not.toContain('createPrompt("blockbench_native_apis"');
    expect(prompts).not.toContain('createPrompt("blockbench_code_eval_safety"');
    expect(prompts).not.toContain('createPrompt("model_creation_strategy"');
  });

  test("maintainer references remain source files but are excluded from the runtime bundle", async () => {
    const files = (await readdir("prompts"))
      .filter((name) => name.endsWith(".md"))
      .sort();
    expect(files).toEqual([
      "bedrock_entity_workflow.md",
      "blockbench_code_eval_safety.md",
      "blockbench_native_apis.md",
    ]);

    const manifest = JSON.parse(await source("prompts/manifest.json")) as {
      prompts: Record<string, string>;
    };
    expect(Object.keys(manifest.prompts)).toEqual(["bedrock_entity_workflow"]);

    const generator = await source("build/generate-manifest.ts");
    expect(generator).toContain('const RUNTIME_PROMPT_FILES = ["bedrock_entity_workflow.md"] as const;');
    expect(generator).not.toContain('new Glob("*.md")');
  });

  test("skill stack keeps orchestration and domain judgement in separate owners", async () => {
    const index = await source("../.agents/skills/README.md");
    const orchestrator = await source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md");
    const modelling = await source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md");
    const texturing = await source("../.agents/skills/blockit-bedrock-texturing/SKILL.md");
    const animation = await source("../.agents/skills/blockit-bedrock-animation/SKILL.md");

    expect(index).toContain("blockbench-bedrock-modelling");
    expect(orchestrator).toContain("Tool Lane Discipline");
    expect(orchestrator).toContain("FAIL / UNVERIFIED / PASS");
    expect(modelling).toContain("Difference-First Reference Fidelity Verdict");
    expect(texturing).toContain("material_instance");
    expect(texturing).toContain("Native Bedrock PBR");
    expect(animation).toContain("inspect_animation");
    expect(animation).toContain("animation controllers");
  });

  test("reference-driven modelling keeps a difference-first three-state visual verdict", async () => {
    const workflow = await source("prompts/bedrock_entity_workflow.md");
    const modelling = await source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md");
    const orchestrator = await source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md");
    const validation = await source("../docs/foundation/07-visual-validation.md");

    for (const text of [workflow, modelling, validation]) {
      expect(text).toContain("FAIL");
      expect(text).toContain("UNVERIFIED");
      expect(text).toContain("PASS");
      expect(text.toLowerCase()).toContain("difference-first");
    }
    expect(orchestrator).toContain("FAIL / UNVERIFIED / PASS");
    expect(workflow).toContain("Front PASS is not full 3D PASS");
  });

  test("generated-doc source is BlockIT-branded and current README requires the local build", async () => {
    const docs = await source("build/docs.ts");
    const readme = await source("README.md");
    expect(docs).toContain("BlockIT — Bedrock Entity MCP");
    expect(readme).toContain("Do **not** use the upstream hosted");
    expect(readme).toContain("dist/mcp.js");
    expect(readme).not.toContain("jasonjgardner.github.io/blockbench-mcp-plugin");
  });
});
