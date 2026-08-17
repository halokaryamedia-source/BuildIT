import { describe, expect, test } from "bun:test";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("repository GitHub discipline", () => {
  test("GITHUB_RULES keeps PRD-quality core and conditional surfaces", async () => {
    const rules = await source("../GITHUB_RULES.md");

    expect(rules.length).toBeLessThan(20_000);
    for (const marker of [
      "PIN",
      "READ MINIMUM",
      "DIAGNOSE",
      "TOOL FIT",
      "WRITE ONCE",
      "VERIFY MINIMUM",
      "STOP",
      "# Conditional GitHub Surfaces",
      "## API failures, pagination, rate limits, and ambiguous mutations",
      "## Special files, Git LFS, binaries, submodules, and generated artifacts",
      "## Pull requests, branch protection, rulesets, reviews, and merge queues",
      "## GitHub Actions",
      "## Sensitive data, releases, and deployment environments",
      "### Approved `Experimental/` runtime exception",
    ]) expect(rules).toContain(marker);

    for (const code of ["401", "403", "404", "409", "422", "429", "5xx"]) {
      expect(rules).toContain(code);
    }

    expect(rules).toContain("One intentional write per file is the default");
    expect(rules).toContain("one categorized logical commit");
    expect(rules).toContain("Same-cause retry budget: maximum 2 attempts");
    expect(rules).toContain("Static source/CI evidence proves only what it exercises");
    expect(rules).toContain("weaken, delete, bypass, or broaden");
    expect(rules).toContain("deployment success");
    expect(rules).toContain("new third-party actions");
    expect(rules).toContain("trusted sources");
    expect(rules).toContain("immutable/pinned revisions");
    expect(rules).toContain("`pull_request_target`");
    expect(rules).toContain("self-hosted runner");
    expect(rules).toContain("Do not widen permissions");
    expect(rules).toContain("read-only repository permissions");
    expect(rules).toContain("artifact existence is not visual approval");
  });

  test("root routing separates observation, Developing, Maintenance, and asset authoring", async () => {
    const root = await source("../AGENTS.md");

    expect(root.length).toBeLessThan(5_000);
    for (const marker of [
      "### Observe / recover context",
      "### Repository / Plugin Work",
      "### Bounded Maintenance",
      "### Reference Preparation",
      "### Asset Authoring",
      "GITHUB_RULES.md Core Rules",
      "→ report → STOP",
      "do not automatically load",
      "Asset authoring is not software **Developing**",
      "Do not route it through `development-brief`",
    ]) expect(root).toContain(marker);

    expect(root).toContain("Do not edit, run CI, advance continuation state");
    expect(root).toContain("If `next-action.md` disagrees materially");
  });

  test("development brief preserves cross-session continuity without bloating Maintenance", async () => {
    const brief = await source("../.agents/skills/development-brief/SKILL.md");

    expect(brief.length).toBeLessThan(4_000);
    expect(brief).toContain("## Mandatory Developing continuity");
    expect(brief).toContain("→ CONTEXT.md");
    expect(brief).toContain("→ docs/knowledge/next-action.md");
    expect(brief).toContain("does not enter implementation");
    expect(brief).toContain(
      "Read `CONTEXT.md` only when stable project facts materially affect the decision."
    );
    expect(brief).toContain("Execution channel (only when material)");
    expect(brief).toContain("Acceptance criteria: 2-5");
    expect(brief).toContain("at most one specialist");
  });

  test("repository and MCP verification are split by proof surface", async () => {
    const [repository, mcp] = await Promise.all([
      source("../.github/workflows/repository-verify.yml"),
      source("../.github/workflows/mcp-verify.yml"),
    ]);

    for (const marker of [
      "branches:\n      - Local",
      "cancel-in-progress: true",
      "contents: read",
    ]) {
      expect(repository).toContain(marker);
      expect(mcp).toContain(marker);
    }

    expect(repository).toContain('"GITHUB_RULES.md"');
    expect(repository).toContain('"Experimental/**"');
    expect(repository).toContain('".github/workflows/**"');
    expect(repository).not.toContain('".github/workflows/repository-verify.yml"');
    expect(repository).not.toContain('".github/workflows/mcp-verify.yml"');
    expect(repository).not.toContain("pull_request_target");
    expect(repository).toContain("tests/repository-github-discipline.test.ts");
    expect(repository).toContain("tests/static-efficiency-budget.test.ts");

    expect(mcp).toContain('"mcp/**"');
    expect(mcp).not.toContain('"AGENTS.md"');
    expect(mcp).not.toContain('"CONTEXT.md"');
    expect(mcp).not.toContain('"docs/knowledge/**"');
    expect(mcp).not.toContain("pull_request_target");
    expect(mcp).not.toContain("continue-on-error");
    expect(mcp).toContain("bun run typecheck");
    expect(mcp).toContain("bun run test");
    expect(mcp).toContain("bun run measure:surface");
    expect(mcp).toContain("bun run build");
    expect(mcp).toContain("bun run docs:check");
  });

  test("active continuation stays compact while Experimental owns the research contract", async () => {
    const [next, experimental] = await Promise.all([
      source("../docs/knowledge/next-action.md"),
      source("../Experimental/README.md"),
    ]);

    expect(next.length).toBeLessThan(7_000);
    expect(next).toContain("Experimental/README.md");
    expect(next).not.toContain("## Experimental Plan");
    expect(next).toContain("EXPERIMENTAL / NOT ACTIVE / NOT END-TO-END PROVEN");

    for (const marker of [
      "## Active Research — On-Demand Blockbench Web Authoring",
      "## Material unknowns",
      "## POC scope",
      "## Runner strategy",
      "## Native job contract",
      "## Acceptance criteria",
      "## Stop rules",
      "GitHub Actions artifact",
      "actually visually inspects",
      "Codecs.project.compile()",
    ]) expect(experimental).toContain(marker);
  });
});
