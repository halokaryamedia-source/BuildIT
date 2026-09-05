import { describe, expect, test } from "bun:test";

async function text(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("MCP dependency closure", () => {
  test("one compact closure command composes semantic and generated freshness gates", async () => {
    const packageJson = JSON.parse(await text("package.json")) as {
      scripts: Record<string, string>;
    };

    expect(packageJson.scripts["verify:closure"]).toBe(
      "bun run verify:repository && bun run verify:authoring && bun run docs:check"
    );
    expect(packageJson.scripts["verify:closure"]).not.toContain("verify:mcp");
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

  test("package rules define all four dependency classes and preserve proof boundaries", async () => {
    const rules = await text("AGENTS.md");

    expect(rules).toContain("## Dependency Closure");
    for (const dependencyClass of [
      "SHARED SOURCE",
      "GENERATED",
      "SEMANTIC MIRROR",
      "CI ROUTING",
    ]) {
      expect(rules).toContain(dependencyClass);
    }

    expect(rules).toContain("bun run verify:closure");
    expect(rules).toContain("does **not** replace `verify:mcp`");
    expect(rules).toContain("Do not auto-rewrite `CONTEXT.md`");
    expect(rules).toContain("transfer before mutating its canonical source");
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
