import { describe, expect, test } from "bun:test";

async function text(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("MCP dependency closure", () => {
  test("verification layers compose without rerunning repository/authoring subsets in the full gate", async () => {
    const packageJson = JSON.parse(await text("package.json")) as {
      scripts: Record<string, string>;
    };

    expect(packageJson.scripts["test:runtime"]).toBe("bun test tests/*.test.ts");
    expect(packageJson.scripts["verify:closure"]).toBe(
      "bun run verify:repository && bun run verify:authoring && bun run docs:check"
    );
    expect(packageJson.scripts["verify:closure"]).not.toContain("verify:mcp");
    expect(packageJson.scripts["verify:mcp"]).toContain("bun run test:runtime");
    expect(packageJson.scripts["verify:mcp"]).toContain("bun run verify:authoring");
    expect(packageJson.scripts["verify:mcp"]).not.toContain("bun run test &&");
    expect(packageJson.scripts["verify:full"]).toBe(
      "bun run verify:repository && bun run verify:mcp"
    );
    expect(packageJson.scripts["verify:full"]).not.toContain("verify:closure");
    expect(packageJson.scripts["verify:release"]).toBe("bun run verify:full");
    expect(packageJson.scripts["verify:mcp"]).toContain("bun run docs:check");
  });

  test("generated docs and runtime prompt manifest share the same freshness gate", async () => {
    const freshness = await text("build/check-docs-freshness.ts");

    expect(freshness).toContain('{ file: "api.json"');
    expect(freshness).toContain('{ file: "index.html"');
    expect(freshness).toContain('file: "../prompts/manifest.json"');
    expect(freshness).toContain('runBuildScript("docs:build")');
    expect(freshness).toContain('runBuildScript("prompts:build")');
    expect(freshness).toContain("Generated MCP documentation is stale");
  });

  test("package rules define dependency classes, impact mapping, and proof boundaries", async () => {
    const rules = await text("AGENTS.md");

    expect(rules).toContain("## Dependency Closure");
    expect(rules).toContain("### Change Closure Gate");
    expect(rules).toContain("## Test Ownership / Anti-Stale");
    for (const dependencyClass of [
      "SHARED SOURCE",
      "GENERATED",
      "SEMANTIC MIRROR",
      "CI ROUTING",
    ]) {
      expect(rules).toContain(dependencyClass);
    }
    for (const marker of [
      "transient impact map",
      "UPDATED | VERIFIED_UNCHANGED | NOT_APPLICABLE",
      "authoring semantics / stage / handoff",
      "public Tool / Resource / Prompt",
      "implementation-only change",
      "state/proof owners if their state actually changes",
    ]) {
      expect(rules).toContain(marker);
    }

    expect(rules).toContain("bun run verify:closure");
    expect(rules).toContain("does **not** replace `verify:mcp`");
    expect(rules).toContain("Do not auto-rewrite `CONTEXT.md`");
    expect(rules).toContain("transfer before mutating its canonical source");
    expect(rules).toContain("do not create a persisted checklist/roadmap file");
  });

  test("semantic mirrors keep shared AUTHORING and approval-to-UV ordering synchronized", async () => {
    const [flow, runbook] = await Promise.all([
      text("../docs/knowledge/flow.md"),
      text("../docs/knowledge/operations/local-acceptance-runbook.md"),
    ]);

    expect(flow).toContain("No Geometry↔Texturing `switch_authoring_phase` is required");
    expect(runbook).toContain("Geometry↔Texturing stays on the shared AUTHORING surface");
    expect(runbook).toMatch(
      /user Geometry APPROVED[\s\S]*UV Layout PASS[\s\S]*Texturing/
    );
    expect(runbook).toMatch(
      /3D_ASSISTED[\s\S]*user Geometry APPROVED[\s\S]*UV Layout PASS[\s\S]*Texture APPROVED/
    );
    expect(runbook).not.toContain("Geometry              25");
    expect(runbook).not.toContain("Texturing             35");
  });

  test("semantic mirrors and CI routes remain protected by their owning verifiers", async () => {
    const [docSync, repositoryWorkflow, authoringWorkflow, mcpWorkflow] =
      await Promise.all([
        text("tests/repository/current-doc-sync.test.ts"),
        text("../.github/workflows/repository-verify.yml"),
        text("../.github/workflows/authoring-policy-verify.yml"),
        text("../.github/workflows/mcp-verify.yml"),
      ]);

    for (const invariant of [
      "Geometry Strategy",
      "DIRECT",
      "3D_ASSISTED",
      "AUTHORING",
    ]) {
      expect(docSync).toContain(invariant);
    }

    for (const routedPath of [
      '"mcp/AGENTS.md"',
      '"mcp/package.json"',
      '"mcp/tests/repository/**"',
      '".github/workflows/**"',
    ]) {
      expect(repositoryWorkflow).toContain(routedPath);
    }

    expect(authoringWorkflow).toContain('"mcp/tests/authoring/**"');
    expect(authoringWorkflow).toContain(
      '".agents/skills/blockit-bedrock-entity-mcp/**"'
    );
    expect(authoringWorkflow).toContain(
      '".agents/skills/blockbench-bedrock-modelling/**"'
    );
    expect(authoringWorkflow).toContain(
      '".agents/skills/blockit-bedrock-texturing/**"'
    );
    expect(authoringWorkflow).toContain(
      '".agents/skills/blockit-bedrock-animation/**"'
    );

    expect(mcpWorkflow).toContain('- "mcp/**"');
    expect(mcpWorkflow).not.toContain('!mcp/server/**');
    expect(mcpWorkflow).not.toContain(
      '!mcp/prompts/bedrock_entity_workflow.md'
    );
  });
});
