import { describe, expect, test } from "bun:test";
import {
  findElementsByCriteriaParameters,
  listOutlineParameters,
} from "@/server/tools/element";
import { getUndoStackParameters } from "@/server/tools/history";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("static efficiency budget", () => {
  test("active authoring instruction owners stay compact", async () => {
    const [root, orchestrator, modelling, texturing, animation, workflow] =
      await Promise.all([
        source("../AGENTS.md"),
        source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md"),
        source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md"),
        source("../.agents/skills/blockit-bedrock-texturing/SKILL.md"),
        source("../.agents/skills/blockit-bedrock-animation/SKILL.md"),
        source("prompts/bedrock_entity_workflow.md"),
      ]);

    expect(root.length).toBeLessThan(5_000);
    expect(orchestrator.length).toBeLessThan(5_000);
    expect(modelling.length).toBeLessThan(8_000);
    expect(texturing.length).toBeLessThan(4_500);
    expect(animation.length).toBeLessThan(4_500);
    expect(workflow.length).toBeLessThan(7_000);
  });

  test("repository-development instruction owners stay bounded by responsibility", async () => {
    const [packageRules, developmentBrief, mcpDevelopment] = await Promise.all([
      source("AGENTS.md"),
      source("../.agents/skills/development-brief/SKILL.md"),
      source("../.agents/skills/mcp-server-development/SKILL.md"),
    ]);

    expect(packageRules.length).toBeLessThan(6_000);
    expect(developmentBrief.length).toBeLessThan(4_000);
    expect(mcpDevelopment.length).toBeLessThan(4_000);

    expect(packageRules).toContain("Root `../AGENTS.md` owns repository routing");
    expect(mcpDevelopment).toContain("`mcp/AGENTS.md` owns package-wide");
    expect(developmentBrief).toContain(
      "Read `CONTEXT.md` only when stable project facts materially affect the decision."
    );
    expect(developmentBrief).not.toContain("`grilling`");
    expect(developmentBrief).not.toContain("`code-review`");
  });

  test("normal discovery and recovery reads default to compact bounds", () => {
    const outline = listOutlineParameters.parse({});
    expect(outline.max_depth).toBe(8);
    expect(outline.max_nodes).toBe(120);
    expect(listOutlineParameters.parse({ max_depth: 32, max_nodes: 5000 })).toEqual({
      include_cubes: true,
      max_depth: 32,
      max_nodes: 5000,
    });

    expect(findElementsByCriteriaParameters.parse({}).limit).toBe(50);
    expect(findElementsByCriteriaParameters.parse({ limit: 1000 }).limit).toBe(1000);
    expect(getUndoStackParameters.parse({}).limit).toBe(20);
    expect(getUndoStackParameters.parse({ limit: 200 }).limit).toBe(200);
  });

  test("project info is bounded and result mirrors are compacted centrally", async () => {
    const [project, factories] = await Promise.all([
      source("server/tools/project.ts"),
      source("lib/factories.ts"),
    ]);

    expect(project).toContain("const ROOT_GROUP_SUMMARY_LIMIT = 50");
    expect(project).toContain("root_groups_truncated");
    expect(project).toContain("structuredContent: result");
    expect(factories).toContain("compactMirroredStructuredContent");
    expect(factories).toContain("returned structured data");
  });

  test("runtime prompt bundle contains only the exposed Bedrock workflow", async () => {
    const manifest = JSON.parse(await source("prompts/manifest.json")) as {
      prompts: Record<string, string>;
    };
    const serverPrompts = await source("server/prompts.ts");
    const generator = await source("build/generate-manifest.ts");

    expect(Object.keys(manifest.prompts)).toEqual(["bedrock_entity_workflow"]);
    expect(serverPrompts).toContain('createPrompt("bedrock_entity_workflow"');
    expect(serverPrompts).not.toContain('createPrompt("blockbench_native_apis"');
    expect(serverPrompts).not.toContain('createPrompt("blockbench_code_eval_safety"');
    expect(generator).toContain('RUNTIME_PROMPT_FILES = ["bedrock_entity_workflow.md"]');
  });
});
