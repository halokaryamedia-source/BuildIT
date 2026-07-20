import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const read = (path: string) => readFileSync(path, "utf8");
const json = (path: string) => JSON.parse(read(path)) as Record<string, any>;

const canonical = (name: string) =>
  read(`../engines/shared/skills/${name}/SKILL.md`);

describe("repository development skill stack", () => {
  test("keeps OpenSpec and Ponytail above both support skills", () => {
    const profiles = json("../engines/shared/skills/skill-profiles.json");
    expect(profiles.schema_version).toBe("1.2");
    expect(profiles.repository_development.authority_order).toEqual([
      "openspec",
      "ponytail",
      "engineering-discipline",
      "code-review-graph",
      "repository-tools",
    ]);
    expect(profiles.repository_development.required_support_skills).toEqual([
      "engineering-discipline",
    ]);
    expect(profiles.repository_development.optional_context_skills).toEqual([
      "code-review-graph",
    ]);
    expect(profiles.repository_development.graph_unavailable_policy).toBe(
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

  test("adapts engineering practices without introducing another planning authority", () => {
    const skill = canonical("engineering-discipline");
    for (const marker of [
      "OpenSpec owns the approved goal",
      "Ponytail selects the smallest safe action",
      "red → green",
      "tight, agent-runnable pass/fail loop",
      "Standards",
      "Spec",
      "must not create another state machine",
      "mattpocock/skills",
    ]) {
      expect(skill).toContain(marker);
    }
  });

  test("enforces minimal graph context and direct-source fallback", () => {
    const skill = canonical("code-review-graph");
    for (const marker of [
      "get_minimal_context",
      'detail_level="minimal"',
      "five graph calls",
      "800 response tokens",
      "A graph risk score is a prioritisation signal, not a merge decision",
      "continue with direct repository search",
      "tirth8205/code-review-graph",
    ]) {
      expect(skill).toContain(marker);
    }
  });

  test("pins and configures the local Codex graph integration", () => {
    const setup = read("../engines/codex/setup-development-tools.ts");
    const pkg = json("package.json");
    expect(setup).toContain('CODE_REVIEW_GRAPH_VERSION = "2.3.5"');
    expect(setup).toContain('["install", "--platform", "codex"]');
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

  test("documents the production and repository MCP separation", () => {
    const agents = read("../AGENTS.md");
    const openspec = read("../openspec/config.yaml");
    const bootstrap = read("../engines/codex/DEVELOPMENT_BOOTSTRAP.md");
    expect(agents).toContain(
      "Normal Blockbench asset production must not use it"
    );
    expect(agents).toContain(
      "Repository development may use MCP key `code-review-graph`"
    );
    expect(openspec).toContain(
      "Engineering Discipline responsibility"
    );
    expect(openspec).toContain("Code Review Graph responsibility");
    expect(bootstrap).toContain(
      "OpenSpec and Ponytail remain authoritative"
    );
  });
});
