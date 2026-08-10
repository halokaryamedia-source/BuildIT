import { describe, expect, test } from "bun:test";
import { readdir } from "node:fs/promises";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("pre-local Bedrock prompt and skill surface", () => {
  test("one enabled MCP workflow prompt is Bedrock Entity-only", async () => {
    const prompts = await source("server/prompts.ts");
    expect(prompts).toContain('createPrompt("bedrock_entity_workflow"');
    expect(prompts).not.toContain('createPrompt("model_creation_strategy"');
    expect(prompts).not.toContain('enum(["java_block", "bedrock", "bedrock_block"])');
    expect(prompts).not.toContain('getPromptContent("model_creation_ui")');
  });

  test("bundled prompt content contains only canonical Bedrock workflow plus disabled maintainer references", async () => {
    const files = (await readdir("prompts"))
      .filter((name) => name.endsWith(".md"))
      .sort();
    expect(files).toEqual([
      "bedrock_entity_workflow.md",
      "blockbench_code_eval_safety.md",
      "blockbench_native_apis.md",
    ]);

    const workflow = await source("prompts/bedrock_entity_workflow.md");
    expect(workflow).toContain("Protected Native Capability Gaps");
    expect(workflow).toContain("Native Bedrock PBR and per-face `material_instance` are **not** gaps");
    expect(workflow).toContain("`bedrock` — native Minecraft Bedrock geometry JSON");
  });

  test("BlockIT skill stack replaces generic upstream orchestration without duplicating modelling judgement", async () => {
    const index = await source("../.agents/skills/README.md");
    const orchestrator = await source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md");
    const texturing = await source("../.agents/skills/blockit-bedrock-texturing/SKILL.md");
    const animation = await source("../.agents/skills/blockit-bedrock-animation/SKILL.md");

    expect(index).toContain("blockbench-bedrock-modelling");
    expect(orchestrator).toContain("Protected Native Capability Gaps");
    expect(orchestrator).toContain("`bedrock` — native Minecraft Bedrock geometry JSON");
    expect(texturing).toContain("Per-Face Material Instances");
    expect(texturing).toContain("Do not use upstream instructions such as `auto_uv_mesh`");
    expect(animation).toContain("inspect_animation");
    expect(animation).toContain("animation controllers");
    expect(animation).toContain("Do not fake these with `risky_eval`");
  });

  test("generated-doc source is BlockIT-branded and install guidance does not offer the upstream hosted binary", async () => {
    const docs = await source("build/docs.ts");
    const install = await source("docs/llms/install.md");
    expect(docs).toContain("BlockIT — Bedrock Entity MCP");
    expect(install).toContain("do not install the hosted");
    expect(install).not.toContain("- [Stable](https://jasonjgardner.github.io");
  });
});
