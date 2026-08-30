import { describe, expect, test } from "bun:test";
import { readdir } from "node:fs/promises";

async function text(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("cross-agent repository handoff", () => {
  test("repository-owned skill inventory resolves from canonical packages", async () => {
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
      "bun-tooling",
      "development-brief",
      "mcp-server-development",
      "typescript-type-safety",
    ]);

    for (const name of dirs) {
      expect(await Bun.file(`../.agents/skills/${name}/SKILL.md`).exists()).toBe(true);
    }

    const [context, root, developmentBrief] = await Promise.all([
      text("../CONTEXT.md"), text("../AGENTS.md"), text("../.agents/skills/development-brief/SKILL.md"),
    ]);
    expect(context).toContain("Root `AGENTS.md` owns task selection");
    expect(root).toContain("#### Developing Execution Gate");
    expect(developmentBrief).toContain("new ChatGPT, Codex, or Opencode session");
  });

  test("handoff keeps the real development objective explicit across providers", async () => {
    const [root, brief, runbook] = await Promise.all([
      text("../AGENTS.md"),
      text("../.agents/skills/development-brief/SKILL.md"),
      text("../docs/knowledge/operations/local-acceptance-runbook.md"),
    ]);

    for (const owner of [root, brief]) expect(owner).toContain("Success Metric");
    for (const owner of [root, brief, runbook]) {
      expect(owner).toContain("Authoring Efficiency");
      expect(owner).toContain("Static Footprint");
    }
    expect(root).toContain("Forbidden Proxy / Non-Goal");
    expect(brief).toContain("Forbidden Proxy / Non-Goal");
    expect(runbook).toContain("Cost to Accepted Result");
    for (const marker of ["QUALITY FAIL", "CONTRACT_CAUSED", "REASONING_CAUSED", "IMPROVED", "UNCHANGED", "REGRESSED"]) {
      expect(runbook).toContain(marker);
    }
  });

  test("continuation, stable facts, proof, and ownership remain separate", async () => {
    const [context, next, validation, implementation] = await Promise.all([
      text("../CONTEXT.md"),
      text("../docs/knowledge/next-action.md"),
      text("../docs/foundation/validation-report.md"),
      text("../docs/knowledge/implementation-map.md"),
    ]);

    expect(context).toContain("stable project facts only");
    expect(context).not.toContain("AWAITING_PLUGIN_ENABLE");
    expect(next).toContain("Working branch: **`Local` only**");
    expect(next).toContain("## Current Status");
    expect(next).toContain("## Active Boundary");
    expect(next).toContain("## Next Step");
    expect(next).toContain("NO_ACTIVE_REPOSITORY_DEVELOPMENT");
    expect(next).not.toContain("## Development Contract");
    expect(next).not.toContain("## Local Runtime Gate");
    expect(next).not.toContain("AWAITING_PLUGIN_ENABLE_THEN_RUNBOOK_STEP_4");
    expect(validation).toContain("This file owns the **proof boundary**");
    expect(validation).toContain("LOCAL PROOF REQUIRED");
    expect(implementation).toContain("This map contains no active task status");
  });

  test("historical review and decision residue stays outside active knowledge", async () => {
    const dirs = (await readdir("../docs/knowledge", { withFileTypes: true }))
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);
    expect(dirs).not.toContain("reviews");
    expect(dirs).not.toContain("decisions");

    const foundationFiles = (await readdir("../docs/foundation")).filter((name) => name.endsWith(".md"));
    for (const file of foundationFiles) {
      const body = await text(`../docs/foundation/${file}`);
      expect(body).not.toContain("../knowledge/decisions/");
      expect(body).not.toContain("../knowledge/reviews/");
    }
  });

  test("transient repository-root visual output is ignored rather than versioned", async () => {
    const rootDirs = (await readdir("..", { withFileTypes: true }))
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);
    expect(rootDirs).not.toContain(".capture");
    expect(rootDirs).not.toContain(".sample-renders");

    const ignore = await text("../.gitignore");
    expect(ignore).toContain(".capture/");
    expect(ignore).toContain(".sample-renders/");
  });

  test("named MCP defects retain bounded source and regression owners", async () => {
    const implementation = await text("../docs/knowledge/implementation-map.md");
    expect(implementation).toContain("## Hot-Path Defect Index");
    expect(implementation).toContain("source owner + primary regression owner first");
    expect(implementation).toContain("mcp/tests/static-footprint-budget.test.ts");

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

  test("proof docs never upgrade static compactness into live authoring claims", async () => {
    const [validation, implementation, runbook] = await Promise.all([
      text("../docs/foundation/validation-report.md"),
      text("../docs/knowledge/implementation-map.md"),
      text("../docs/knowledge/operations/local-acceptance-runbook.md"),
    ]);

    expect(validation).toContain("LAST OBSERVED FULL CANONICAL GREEN");
    expect(validation).toContain("ACCEPTED LIVE BASELINE");
    expect(validation).toContain("Character counts are regression ceilings");
    expect(validation).toContain("Visual / Reference Proof Rule");
    expect(validation).toContain("cannot prove visual fidelity");
    expect(implementation).toContain("## Effectiveness / Footprint Evidence Ownership");
    expect(implementation).toContain("Static Footprint cannot upgrade");
    expect(runbook).toContain("Static Footprint");
  });
});
