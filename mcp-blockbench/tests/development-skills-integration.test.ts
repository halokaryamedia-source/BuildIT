import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const read = (path: string) => readFileSync(path, "utf8");
const json = (path: string) => JSON.parse(read(path)) as Record<string, any>;

const canonical = (name: string) =>
  read(`../engines/shared/skills/${name}/SKILL.md`);

describe("repository development system", () => {
  test("uses domain ownership instead of a linear authority hierarchy", () => {
    const profiles = json("../engines/shared/skills/skill-profiles.json");
    const development = profiles.repository_development;

    expect(profiles.schema_version).toBe("1.3");
    expect(development.authority_order).toBeUndefined();
    expect(development.foundation_change).toBe(
      "openspec/changes/buildit-system-foundation"
    );
    expect(development.domain_ownership).toMatchObject({
      requirements: ["explicit-user-instruction", "active-openspec-change"],
      scope_efficiency: ["ponytail"],
      engineering_method: ["engineering-discipline"],
      context_intelligence: ["code-review-graph", "current-source"],
      model_execution: ["capability-gate", "model-selector"],
    });
    expect(development.task_router.BUG_OR_PERFORMANCE.primary_domain).toBe(
      "engineering_method"
    );
    expect(development.task_router.FEATURE.primary_domain).toBe("requirements");
    expect(development.graph_unavailable_policy).toBe(
      "continue_with_direct_repository_search"
    );
  });

  test("does not alter the two-skill Blockbench production budget", () => {
    const profiles = json("../engines/shared/skills/skill-profiles.json");
    expect(profiles.max_production_skills_loaded).toBe(2);
    expect(profiles.production_skills).toEqual([
      "blockbench-production",
      "blockbench-geometry",
      "blockbench-texture",
      "blockbench-animation",
      "blockbench-validation",
    ]);
    expect(profiles.repository_development.forbidden_production_skills).toEqual(
      profiles.production_skills
    );
    expect(profiles.repository_development.max_support_skills_loaded).toBe(2);
  });

  test("keeps canonical development skills byte-identical across host adapters", () => {
    for (const name of ["engineering-discipline", "code-review-graph"]) {
      const source = canonical(name);
      expect(read(`../.agents/skills/${name}/SKILL.md`), name).toBe(source);
      expect(read(`../.codex/skills/${name}/SKILL.md`), name).toBe(source);
    }

    const sync = read("../engines/shared/skills/scripts/sync-skills.ts");
    expect(sync).toContain('"engineering-discipline"');
    expect(sync).toContain('"code-review-graph"');
  });

  test("adapts Matt engineering practices as an engineering-method domain", () => {
    const skill = canonical("engineering-discipline");
    for (const marker of [
      "BuildIT has no single linear authority hierarchy",
      "Domain modeling",
      "Design It Twice",
      "deep modules",
      "red → green",
      "tight, agent-runnable pass/fail loop",
      "Standards",
      "Spec",
      "mattpocock/skills",
    ]) {
      expect(skill).toContain(marker);
    }
    expect(skill).toContain("It does not own:");
  });

  test("keeps graph use minimal, optional, and source-confirmed", () => {
    const skill = canonical("code-review-graph");
    for (const marker of [
      "context-intelligence domain",
      "get_minimal_context",
      'detail_level="minimal"',
      "five graph calls",
      "800 response tokens",
      "A graph risk score is a prioritisation signal, not a merge decision",
      "continue with direct repository search",
      "Never trust a graph node that disagrees with current source or git diff",
      "tirth8205/code-review-graph",
    ]) {
      expect(skill).toContain(marker);
    }
  });

  test("pins and verifies the local Codex graph integration", () => {
    const setup = read("../engines/codex/setup-development-tools.ts");
    const pkg = json("package.json");
    expect(setup).toContain('CODE_REVIEW_GRAPH_VERSION = "2.3.7"');
    expect(setup).toContain('runGraph(runner, ["install", "--platform", "codex"])');
    expect(setup).toContain("assertPinnedVersion");
    expect(setup).toContain('runGraph(runner, ["build"])');
    expect(setup).toContain('runGraph(runner, ["status"])');
    expect(pkg.scripts["engineering:setup"]).toContain(
      "setup-development-tools.ts"
    );
    expect(pkg.scripts["graph:update"]).toContain("--update");
    expect(pkg.scripts["graph:status"]).toContain("--status");
  });

  test("excludes generated and user asset paths from graph analysis", () => {
    const ignore = read("../.code-review-graphignore");
    for (const marker of [
      "workspace/**",
      "mcp-blockbench/dist/**",
      "docs/api/**",
      ".agents/skills/**",
      ".codex/skills/**",
      "**/*.bbmodel",
    ]) {
      expect(ignore).toContain(marker);
    }
  });

  test("documents production and repository MCP separation", () => {
    const agents = read("../AGENTS.md");
    const openspec = read("../openspec/config.yaml");
    const bootstrap = read("../engines/codex/DEVELOPMENT_BOOTSTRAP.md");

    expect(agents).toContain(
      "Repository development may use MCP key `code-review-graph`"
    );
    expect(agents).toContain(
      "normal Blockbench asset production must not use it"
    );
    expect(openspec).toContain(
      "BuildIT has no single linear authority hierarchy"
    );
    expect(openspec).toContain("RouteLLM status: evaluation-only");
    expect(bootstrap).toContain("Domain ownership");
    expect(bootstrap).toContain("Capability Gate");
    expect(bootstrap).toContain("RouteLLM is evaluation-only");
  });
});
