import { describe, expect, test } from "bun:test";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

function requireInvariant(
  body: string,
  pattern: RegExp,
  owner: string,
  invariant: string,
  expected: string,
): void {
  if (!pattern.test(body)) {
    throw new Error(`INVARIANT: ${invariant}\nOWNER: ${owner}\nEXPECTED: ${expected}`);
  }
}

describe("repository GitHub discipline", () => {
  test("GITHUB_RULES keeps the canonical transaction and proof discipline", async () => {
    const rules = await source("../GITHUB_RULES.md");

    expect(rules.length).toBeLessThan(25_000);
    for (const marker of [
      "PIN",
      "READ MINIMUM",
      "DIAGNOSE",
      "TOOL FIT",
      "WRITE ONCE",
      "VERIFY MINIMUM",
      "STOP",
      "STALE TEST",
      "ROUTING FAILURE",
      "PROOF FAILURE",
      "Same-cause retry budget: maximum 2 attempts",
      "Static source/CI evidence proves only what it exercises",
      "Do not use exact natural-language prose as a test contract",
    ]) expect(rules).toContain(marker);

    requireInvariant(
      rules,
      /repo\/ref\/HEAD pinned[\s\S]*scope \+ owners final[\s\S]*complete final contents ready[\s\S]*no scratch\/temporary paths[\s\S]*expected proof known[\s\S]*DO NOT WRITE/,
      "GITHUB_RULES.md",
      "repository mutations require a complete pre-write transaction gate",
      "pinned authority + final scope/content + known proof",
    );
    requireInvariant(
      rules,
      /keep ref unchanged while blobs\/tree are prepared/,
      "GITHUB_RULES.md",
      "atomic candidate preparation cannot move Local early",
      "keep ref unchanged during blob/tree preparation",
    );
  });

  test("root routing requires the Developing Execution Gate without bloating asset authoring", async () => {
    const root = await source("../AGENTS.md");

    expect(root.length).toBeLessThan(7_000);
    for (const marker of [
      "### Observe / recover context",
      "### Repository / Plugin Work",
      "#### Developing Execution Gate",
      "Success Metric",
      "Forbidden Proxy / Non-Goal",
      "First Evidence Required",
      "Failure Classification / first wrong owner",
      "Proof Required",
      "STOP Condition",
      "Authoring Efficiency",
      "Static Footprint",
      "### Bounded Maintenance",
      "### Asset Authoring",
      "do not automatically load",
      "Do not route it through `development-brief`",
    ]) expect(root).toContain(marker);

    expect(root).toContain("raw MCP-call count alone cannot prove product improvement");
    expect(root).toContain("Do not mutate until those fields are decision-ready");
    expect(root).toContain("If `next-action.md` disagrees materially");
  });

  test("development brief preserves continuity and real success metrics", async () => {
    const brief = await source("../.agents/skills/development-brief/SKILL.md");

    expect(brief.length).toBeLessThan(6_000);
    for (const marker of [
      "## Mandatory Developing continuity",
      "## Development Contract",
      "Success Metric",
      "Forbidden Proxy / Non-Goal",
      "First Evidence Required",
      "Failure Classification / first wrong owner",
      "STOP Condition",
      "## Effectiveness vocabulary",
      "Authoring Quality",
      "Authoring Efficiency",
      "Cost to Accepted Result",
      "Static Footprint",
      "## Evidence before optimization",
      "## Failure classification",
      "at most one specialist",
    ]) expect(brief).toContain(marker);

    expect(brief).toContain(
      "Read `CONTEXT.md` only when stable project facts materially affect the decision."
    );
    expect(brief).toContain("Static source can prove footprint/contract properties");
    expect(brief).not.toContain("`grilling`");
    expect(brief).not.toContain("`code-review`");
  });

  test("repository and MCP verification stay split by proof surface", async () => {
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

    expect(repository).toContain('".agents/skills/**"');
    expect(repository).toContain('"docs/knowledge/**"');
    expect(repository).toContain("tests/repository-github-discipline.test.ts");
    expect(repository).toContain("tests/static-footprint-budget.test.ts");
    expect(repository).toContain("tests/documentation-handoff.test.ts");
    expect(repository).not.toContain("tests/static-efficiency-budget.test.ts");

    expect(mcp).toContain('"mcp/**"');
    expect(mcp).not.toContain('"docs/knowledge/**"');
    expect(mcp).toContain("bun run typecheck");
    expect(mcp).toContain("bun run test");
    expect(mcp).toContain("bun run measure:surface");
    expect(mcp).toContain("bun run build");
    expect(mcp).toContain("bun run docs:check");
  });

  test("current continuation records closure without reviving stale runtime state", async () => {
    const [next, experimental] = await Promise.all([
      source("../docs/knowledge/next-action.md"),
      source("../Experimental/README.md"),
    ]);

    expect(next.length).toBeLessThan(7_000);
    for (const marker of [
      "CROSS_AGENT_EXECUTION_CONTRACT_COMPLETE",
      "AUTHORING_EFFECTIVENESS_TERMINOLOGY_ALIGNED",
      "STATIC_FOOTPRINT_GUARDRAIL_SEPARATED",
      "STALE_CONTINUATION_VERIFIERS_REPAIRED",
      "NO ACTIVE LOCAL ACCEPTANCE RUN",
      "NO ACTIVE EXPERIMENT",
      "NO ACTIVE DEVELOPMENT",
      "Success Metric",
      "Forbidden Proxy / Non-Goal",
      "Cost to Accepted Result",
      "## STOP",
    ]) expect(next).toContain(marker);

    for (const stale of [
      "AWAITING_PLUGIN_ENABLE_THEN_RUNBOOK_STEP_4",
      "LOCAL_ACCEPTANCE_REACTIVATED_BY_USER_2026_08_23",
      "PRELOCAL_CONTROLLER_MUTATION_READY",
    ]) expect(next).not.toContain(stale);

    expect(experimental).toContain("NOT PRODUCTION");
    expect(experimental).toContain("## Stop rules");
  });

  test("experimental Blockbench Web harness remains bounded and artifact-only", async () => {
    const [workflow, runner, pkg] = await Promise.all([
      source("../.github/workflows/blockbench-web-poc.yml"),
      source("../Experimental/blockbench-web-poc/run-poc.mjs"),
      source("../Experimental/blockbench-web-poc/package.json"),
    ]);

    expect(workflow).toContain("workflow_dispatch:");
    expect(workflow).toContain("contents: read");
    expect(workflow).toContain("runs-on: ubuntu-latest");
    expect(workflow).not.toContain("pull_request_target");
    expect(workflow).not.toContain("self-hosted");
    expect(workflow).not.toContain("${{ secrets.");

    expect(pkg).toContain('"playwright": "1.62.1"');
    expect(runner).toContain("Screencam.screenshotPreview");
    expect(runner).toContain("Codecs.project.compile");
    expect(runner).toContain("proof.json");
  });
});
