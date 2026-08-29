import { describe, expect, test } from "bun:test";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

function requireInvariant(
  body: string,
  pattern: RegExp,
  owner: string,
  invariant: string,
): void {
  if (!pattern.test(body)) {
    throw new Error(`INVARIANT: ${invariant}\nOWNER: ${owner}`);
  }
}

describe("repository GitHub discipline", () => {
  test("GITHUB_RULES keeps compact semantic transaction, delivery, proof, and stop boundaries", async () => {
    const rules = await source("../GITHUB_RULES.md");
    expect(rules.length).toBeLessThan(25_000);

    for (const heading of [
      "## 1. PIN",
      "## 2. READ MINIMUM",
      "## 3. DIAGNOSE",
      "## 4. TOOL + TRANSFER GATE",
      "## 5. WRITE ONCE",
      "## 6. VERIFY + FAILURE POLICY",
      "## 7. STOP",
    ]) {
      expect(rules).toContain(heading);
    }

    requireInvariant(
      rules,
      /`Local` is the working repository authority/i,
      "GITHUB_RULES.md",
      "Local remains the default working authority",
    );
    requireInvariant(
      rules,
      /same conversation\/development session[\s\S]*Do not reread the full boot set/i,
      "GITHUB_RULES.md",
      "continuity boot is reusable in-session",
    );
    requireInvariant(
      rules,
      /ChatGPT atomic Git delivery[\s\S]*keep Local unchanged[\s\S]*fast-forward Local once/i,
      "GITHUB_RULES.md",
      "ChatGPT coherent multi-file delivery remains atomic",
    );
    requireInvariant(
      rules,
      /repo\/ref\/current state pinned[\s\S]*scope \+ owners final[\s\S]*complete final contents ready[\s\S]*selected method carries whole delivery[\s\S]*expected relevant proof known[\s\S]*DO NOT WRITE/i,
      "GITHUB_RULES.md",
      "repository mutation requires a complete transaction gate",
    );
    requireInvariant(
      rules,
      /Known capability mismatch[\s\S]*0 retries[\s\S]*Same-cause valid-method failure[\s\S]*2 attempts/i,
      "GITHUB_RULES.md",
      "failure classes retain bounded retry semantics",
    );
    requireInvariant(
      rules,
      /Static source\/CI evidence[\s\S]*does not prove live Blockbench/i,
      "GITHUB_RULES.md",
      "static proof cannot upgrade live runtime proof",
    );
    expect(rules).toContain("GitHub Actions is verification/deployment infrastructure");
    expect(rules).toContain("Do not use exact natural-language wording as a test contract");
  });

  test("root routing keeps bounded Developing and lightweight asset-authoring paths separate", async () => {
    const root = await source("../AGENTS.md");
    expect(root.length).toBeLessThan(7_500);
    for (const heading of [
      "### Observe / recover context",
      "### Repository / Plugin Work",
      "#### Developing Execution Gate",
      "### Bounded Maintenance",
      "### Asset Authoring",
    ]) {
      expect(root).toContain(heading);
    }
    requireInvariant(
      root,
      /Success Metric[\s\S]*Forbidden Proxy \/ Non-Goal[\s\S]*First Evidence Required[\s\S]*Failure Classification \/ first wrong owner[\s\S]*Proof Required[\s\S]*STOP Condition/,
      "AGENTS.md",
      "non-trivial Developing keeps the real execution contract",
    );
    expect(root).toContain("do not automatically load");
    expect(root).toContain("Do not route it through `development-brief`");
  });

  test("development brief preserves cross-session grounding without owning GitHub execution", async () => {
    const brief = await source("../.agents/skills/development-brief/SKILL.md");
    expect(brief.length).toBeLessThan(6_000);
    for (const heading of [
      "## Mandatory Developing continuity",
      "## Development Contract",
      "## Effectiveness vocabulary",
      "## Evidence before optimization",
      "## Failure classification",
      "## Completion Boundary",
    ]) {
      expect(brief).toContain(heading);
    }
    expect(brief).toContain("Cost to Accepted Result");
    expect(brief).toContain("GITHUB_RULES.md` owns GitHub execution/history/CI");
  });

  test("repository and MCP verification remain split by proof surface", async () => {
    const [repository, mcp] = await Promise.all([
      source("../.github/workflows/repository-verify.yml"),
      source("../.github/workflows/mcp-verify.yml"),
    ]);

    for (const workflow of [repository, mcp]) {
      expect(workflow).toContain("branches:\n      - Local");
      expect(workflow).toContain("cancel-in-progress: true");
      expect(workflow).toContain("contents: read");
    }

    expect(repository).toContain("tests/repository-github-discipline.test.ts");
    expect(repository).toContain("tests/static-footprint-budget.test.ts");
    for (const command of [
      "bun run typecheck",
      "bun run test",
      "bun run measure:surface",
      "bun run build",
      "bun run docs:check",
    ]) {
      expect(mcp).toContain(command);
    }
  });

  test("continuation remains compact, deferred, and separate from proof/source ownership", async () => {
    const [next, experimental] = await Promise.all([
      source("../docs/knowledge/next-action.md"),
      source("../Experimental/README.md"),
    ]);

    expect(next.length).toBeLessThan(5_000);
    for (const heading of [
      "## Current State",
      "## Development Contract",
      "### Success Metric",
      "### Forbidden Proxy / Non-Goal",
      "### First Evidence Required",
      "### Failure Classification / first wrong owner",
      "### Proof Required",
      "## Deferred Work",
      "## Local Runtime Gate",
      "## STOP",
    ]) {
      expect(next).toContain(heading);
    }
    expect(next).toContain("Working branch: **`Local` only**");
    expect(next).toContain("MCP_DIRECT_GEOMETRY_REPAIRED");
    expect(next).toContain("LIVE_GEOMETRY_SURFACE_LOCAL_PROOF_REQUIRED");
    expect(next).toContain("ROUTE1_BLOCKBENCH_TEST_BLOCKED");
    expect(next).toContain("GEOMETRY_CLEANUP_DEFERRED_BY_USER");
    expect(next).not.toContain("AWAITING_PLUGIN_ENABLE_THEN_RUNBOOK_STEP_4");
    expect(experimental).toContain("NOT PRODUCTION");
    expect(experimental).toContain("## Stop rules");
  });
});
