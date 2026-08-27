import { describe, expect, test } from "bun:test";
import { readdir } from "node:fs/promises";
import { assertBedrockWorkflowSourceCompatible } from "@/lib/promptContract";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("Bedrock prompt and skill surface", () => {
  test("runtime MCP exposes only the canonical Bedrock workflow prompt", async () => {
    const prompts = await source("server/prompts.ts");
    expect(prompts).toContain('createPrompt("bedrock_entity_workflow"');
    expect(prompts).not.toContain('createPrompt("blockbench_native_apis"');
    expect(prompts).not.toContain('createPrompt("blockbench_code_eval_safety"');
    expect(prompts).toContain("selectMcpPhaseWorkflowBody");
  });

  test("runtime prompt manifest exactly mirrors the canonical full prompt source", async () => {
    const promptSource = await source("prompts/bedrock_entity_workflow.md");
    const manifest = JSON.parse(await source("prompts/manifest.json")) as { prompts: Record<string, string> };
    expect(Object.keys(manifest.prompts)).toEqual(["bedrock_entity_workflow"]);
    expect(manifest.prompts.bedrock_entity_workflow).toBe(promptSource);
  });

  test("maintainer references remain source files but are excluded from runtime bundle", async () => {
    const files = (await readdir("prompts")).filter((name) => name.endsWith(".md")).sort();
    expect(files).toEqual(["bedrock_entity_workflow.md", "blockbench_code_eval_safety.md", "blockbench_native_apis.md"]);
    const manifest = JSON.parse(await source("prompts/manifest.json")) as { prompts: Record<string, string> };
    expect(Object.keys(manifest.prompts)).toEqual(["bedrock_entity_workflow"]);
  });

  test("prompt override compatibility is phase-aware and stale overrides are not silently reused", async () => {
    const workflow = await source("prompts/bedrock_entity_workflow.md");
    expect(() => assertBedrockWorkflowSourceCompatible(workflow)).not.toThrow();
    expect(() =>
      assertBedrockWorkflowSourceCompatible(
        workflow.replace("## Texture Verify", "## Legacy Texture Review")
      )
    ).toThrow("missing section(s)");

    const [loader, dialog, prompts] = await Promise.all([
      source("lib/promptLoader.ts"),
      source("ui/promptOverrideDialog.ts"),
      source("server/prompts.ts"),
    ]);
    expect(loader).toContain("PROMPT_OVERRIDE_STORE_VERSION = 2");
    expect(loader).toContain("base_fingerprint");
    expect(loader).toContain("schema_version");
    expect(loader).toContain("assertBedrockWorkflowSourceCompatible");
    expect(dialog).toContain("Prompt override rejected");
    expect(prompts).toContain("assertBedrockWorkflowSourceCompatible(workflow)");
  });

  test("skill stack keeps orchestration and domain judgement in separate active-phase owners", async () => {
    const [root, orchestrator, modelling, texturing, animation] = await Promise.all([
      source("../AGENTS.md"),
      source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md"),
      source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md"),
      source("../.agents/skills/blockit-bedrock-texturing/SKILL.md"),
      source("../.agents/skills/blockit-bedrock-animation/SKILL.md"),
    ]);
    expect(root).toContain("active specialist only");
    expect(orchestrator).toContain("Tool Lane Discipline");
    expect(orchestrator).toContain("FAIL / UNVERIFIED / PASS");
    expect(modelling).toContain("Difference-First Reference Fidelity Verdict");
    expect(texturing).toContain("material_instance");
    expect(texturing).toContain("PBR/material semantics");
    expect(animation).toContain("inspect_animation");
    expect(animation).toContain("manage_animation_controller");
    expect(animation).toContain("batch coherent operations");
  });

  test("reference-driven modelling keeps a difference-first three-state visual verdict", async () => {
    const [workflow, modelling, orchestrator, validation] = await Promise.all([
      source("prompts/bedrock_entity_workflow.md"),
      source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md"),
      source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md"),
      source("../docs/foundation/07-visual-validation.md"),
    ]);
    for (const text of [workflow, modelling, validation]) {
      expect(text).toContain("FAIL");
      expect(text).toContain("UNVERIFIED");
      expect(text).toContain("PASS");
      expect(text.toLowerCase()).toContain("difference-first");
    }
    expect(orchestrator).toContain("FAIL / UNVERIFIED / PASS");
    expect(workflow).toContain("Front PASS is not full 3D PASS");
  });

  test("generated-doc source is BlockIT-branded and README requires the local build", async () => {
    const [docs, readme] = await Promise.all([source("build/docs.ts"), source("README.md")]);
    expect(docs).toContain("BlockIT — Bedrock Entity MCP");
    expect(readme).toContain("Do **not** use the upstream hosted plugin");
    expect(readme).toContain("dist/blockit_mcp.js");
  });
});
