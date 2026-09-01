import { describe, expect, test } from "bun:test";
import { readdir } from "node:fs/promises";

async function text(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("cross-agent repository handoff", () => {
  test("repository-owned skill inventory resolves from canonical semantic owners", async () => {
    const dirs = (await readdir("../.agents/skills", { withFileTypes: true }))
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort();

    expect(dirs).toEqual([
      "blockbench-bedrock-modelling",
      "blockbench-reference-generator",
      "blockbench-runtime-development",
      "blockit-bedrock-animation",
      "blockit-bedrock-entity-mcp",
      "blockit-bedrock-texturing",
      "development-brief",
      "mcp-server-development",
    ]);
    for (const name of dirs) expect(await Bun.file(`../.agents/skills/${name}/SKILL.md`).exists()).toBe(true);
    expect(await Bun.file("../.agents/skills/bun-tooling/SKILL.md").exists()).toBe(false);
    expect(await Bun.file("../.agents/skills/typescript-type-safety/SKILL.md").exists()).toBe(false);
  });

  test("language/build mechanics and complex-development ceremony stay with their real owners", async () => {
    const [packageRules, implementation, root, brief] = await Promise.all([
      text("AGENTS.md"),
      text("../docs/knowledge/implementation-map.md"),
      text("../AGENTS.md"),
      text("../.agents/skills/development-brief/SKILL.md"),
    ]);

    expect(packageRules).toMatch(/TypeScript and Bun are implementation mechanics/i);
    expect(implementation).toMatch(/MCP TypeScript\/Bun implementation mechanics/i);
    expect(root).toContain("#### Development Execution Gate");
    expect(brief).toContain("## Mandatory Development continuity");
    for (const owner of [implementation, brief]) {
      expect(owner).not.toContain("typescript-type-safety");
      expect(owner).not.toContain("bun-tooling");
    }
  });

  test("development objective and efficiency vocabulary remain explicit without duplicating procedure", async () => {
    const [root, brief, runbook] = await Promise.all([
      text("../AGENTS.md"),
      text("../.agents/skills/development-brief/SKILL.md"),
      text("../docs/knowledge/operations/local-acceptance-runbook.md"),
    ]);

    for (const owner of [root, brief]) {
      expect(owner).toMatch(/success metric/i);
      expect(owner).toMatch(/forbidden proxy\s*\/\s*non-goal/i);
    }
    for (const owner of [root, brief, runbook]) {
      expect(owner).toMatch(/authoring efficiency/i);
      expect(owner).toMatch(/static footprint/i);
    }
    expect(runbook).toMatch(/cost to accepted result/i);
    expect(runbook).toMatch(/quality fail/i);
  });

  test("stable facts, active continuation, proof, source ownership, and live procedure stay separate", async () => {
    const [context, next, validation, implementation, runbook] = await Promise.all([
      text("../CONTEXT.md"),
      text("../docs/knowledge/next-action.md"),
      text("../docs/knowledge/current-validation.md"),
      text("../docs/knowledge/implementation-map.md"),
      text("../docs/knowledge/operations/local-acceptance-runbook.md"),
    ]);

    expect(context).toMatch(/stable project facts only/i);
    expect(next).toContain("LOCAL_IMPLEMENTATION_REQUIRED");
    expect(next).toContain("IMAGE_GLB_SELECTED");
    expect(validation).toMatch(/current proof interpretation/i);
    expect(implementation).toMatch(/no active task status/i);
    expect(runbook).toMatch(/explicitly reactivates local testing/i);
    expect(await Bun.file("../docs/foundation/validation-report.md").exists()).toBe(false);
  });

  test("retired proof paths and terminology cannot return to current routing/procedure docs", async () => {
    const owners = await Promise.all([
      text("../AGENTS.md"),
      text("../CONTEXT.md"),
      text("../README.md"),
      text("../CONTRIBUTING.md"),
      text("README.md"),
      text("../.agents/skills/development-brief/SKILL.md"),
      text("../docs/knowledge/next-action.md"),
      text("../docs/knowledge/implementation-map.md"),
      text("../docs/knowledge/operations/local-acceptance-runbook.md"),
    ]);

    for (const owner of owners) {
      expect(owner).not.toContain("docs/foundation/validation-report.md");
      expect(owner).not.toMatch(/\bDeveloping Execution\b|\bAmbiguous Developing\b|\bMandatory Developing\b/);
    }
  });

  test("transient and generated repository surfaces stay classified explicitly", async () => {
    const rootDirs = (await readdir("..", { withFileTypes: true }))
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);
    expect(rootDirs).not.toContain(".capture");
    expect(rootDirs).not.toContain(".sample-renders");

    const [ignore, attributes] = await Promise.all([text("../.gitignore"), text("../.gitattributes")]);
    for (const marker of [".capture/", ".sample-renders/", ".env", ".env.*", "!.env.example"]) expect(ignore).toContain(marker);
    expect(attributes).toContain("mcp/docs/*.html linguist-generated=true");
  });

  test("named MCP defects retain bounded source and regression owners", async () => {
    const implementation = await text("../docs/knowledge/implementation-map.md");
    expect(implementation).toContain("## Hot-Path Defect Index");

    const mappings = [
      { tools: ["create_project"], source: "server/tools/project.ts", test: "tests/p1-core-ownership.test.ts" },
      { tools: ["inspect_model_bounds"], source: "server/tools/project.ts", test: "tests/rendered-model-bounds-numeric-safety.test.ts" },
      { tools: ["place_cube", "modify_cube", "modify_cubes_batch"], source: "server/tools/cubes.ts", test: "tests/model-effectiveness-correction-accuracy.test.ts" },
      { tools: ["inspect_element"], source: "server/tools/element-inspection.ts", test: "tests/model-effectiveness-correction-accuracy.test.ts" },
      { tools: ["capture_model_views"], source: "server/tools/camera.ts", test: "tests/camera-framing-contract.test.ts" },
      { tools: ["export_model"], source: "server/tools/export.ts", test: "tests/prelocal-generic-semantics.test.ts" },
    ];

    for (const mapping of mappings) {
      const row = implementation.split("\n").find((line) => mapping.tools.every((tool) => line.includes(`\`${tool}\``)));
      expect(row).toBeDefined();
      expect(row).toContain(`\`mcp/${mapping.source}\``);
      expect(row).toContain(`\`mcp/${mapping.test}\``);
      expect(await Bun.file(mapping.source).exists()).toBe(true);
      expect(await Bun.file(mapping.test).exists()).toBe(true);
    }
  });

  test("current proof and local acceptance never upgrade static evidence into live quality", async () => {
    const [validation, implementation, runbook] = await Promise.all([
      text("../docs/knowledge/current-validation.md"),
      text("../docs/knowledge/implementation-map.md"),
      text("../docs/knowledge/operations/local-acceptance-runbook.md"),
    ]);

    expect(validation).toMatch(/Visual\s*\/\s*Reference Proof Rule/i);
    expect(validation).toMatch(/cannot prove visual fidelity/i);
    expect(validation).toMatch(/authoring efficiency/i);
    expect(implementation).toMatch(/Static Footprint[\s\S]*cannot upgrade/i);
    expect(runbook).toMatch(/quality gate passes/i);
    expect(runbook).toMatch(/cost to accepted result/i);
  });
});
