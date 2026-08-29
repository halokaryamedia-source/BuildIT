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

  test("root routing uses bounded, standard, and complex development contracts", async () => {
    const root = await source("../AGENTS.md");
    expect(root.length).toBeLessThan(7_000);

    for (const heading of [
      "### Observe / recover context",
      "### Repository / Plugin Work",
      "#### Developing Execution Gate",
      "### Bounded Maintenance",
      "### Standard Development",
      "### Complex / Ambiguous Developing",
      "### Asset Authoring",
    ]) {
      expect(root).toContain(heading);
    }

    requireInvariant(
      root,
      /Bounded contract[\s\S]*Goal[\s\S]*Failure Classification \/ first wrong owner[\s\S]*Acceptance[\s\S]*Proof Required[\s\S]*STOP Condition/i,
      "AGENTS.md",
      "bounded maintenance retains owner, acceptance, proof, and stop gates",
    );
    requireInvariant(
      root,
      /Standard contract[\s\S]*Goal[\s\S]*Success Metric[\s\S]*First Evidence Required \/ first wrong owner[\s\S]*In Scope \/ Out of Scope[\s\S]*Proof Required[\s\S]*STOP Condition/i,
      "AGENTS.md",
      "standard development retains success, owner, scope, proof, and stop gates",
    );
    requireInvariant(
      root,
      /Complex \/ Ambiguous Developing[\s\S]*development-brief[\s\S]*(architecture|redesign)[\s\S]*(quality|efficiency)/i,
      "AGENTS.md",
      "complex or evidence-sensitive work escalates to the full development brief",
    );

    expect(root).toContain("Forbidden Proxy / Non-Goal");
    expect(root).toContain("do not automatically load");
    expect(root).toContain("Do not load `CONTEXT.md`, `next-action.md`, or `development-brief` merely because");
  });

  test("development brief is an escalation contract, not mandatory ceremony", async () => {
    const brief = await source("../.agents/skills/development-brief/SKILL.md");
    expect(brief.length).toBeLessThan(6_000);

    for (const heading of [
      "## Entry boundary",
      "## Mandatory Developing continuity",
      "## Development Contract",
      "## Effectiveness vocabulary",
      "## Evidence before optimization",
      "## Failure classification",
      "## Completion Boundary",
    ]) {
      expect(brief).toContain(heading);
    }

    requireInvariant(
      brief,
      /Do \*\*not\*\* load this Skill for bounded maintenance[\s\S]*clear standard change/i,
      "development-brief/SKILL.md",
      "clear work does not escalate to the full development brief",
    );
    requireInvariant(
      brief,
      /Goal[\s\S]*Success Metric[\s\S]*Forbidden Proxy \/ Non-Goal[\s\S]*First Evidence Required[\s\S]*Failure Classification \/ first wrong owner[\s\S]*Proof Required[\s\S]*STOP Condition/i,
      "development-brief/SKILL.md",
      "complex development keeps the full outcome and evidence contract",
    );

    expect(brief).toContain("Cost to Accepted Result");
    expect(brief).toContain("new ChatGPT, Codex, or Opencode session");
    expect(brief).toContain("GITHUB_RULES.md` owns GitHub execution/history/CI");
  });

  test("generated MCP outputs preflight before substantial implementation", async () => {
    const [packageRules, specialist, implementation] = await Promise.all([
      source("AGENTS.md"),
      source("../.agents/skills/mcp-server-development/SKILL.md"),
      source("../docs/knowledge/implementation-map.md"),
    ]);

    requireInvariant(
      packageRules,
      /Before substantial implementation[\s\S]*public schema\/description\/spec[\s\S]*bun run docs:build[\s\S]*bun run docs:check[\s\S]*(STOP|defer)[\s\S]*before source edits accumulate/i,
      "mcp/AGENTS.md",
      "public-contract work proves API generator capability before substantial source editing",
    );
    requireInvariant(
      packageRules,
      /canonical runtime prompt source[\s\S]*bun run prompts:build[\s\S]*prompts\/manifest\.json[\s\S]*(STOP|defer)[\s\S]*before prompt edits accumulate/i,
      "mcp/AGENTS.md",
      "runtime prompt work proves manifest generator capability before prompt edits accumulate",
    );
    requireInvariant(
      packageRules,
      /same package version[\s\S]*canonical prompt content[\s\S]*same manifest bytes[\s\S]*no wall-clock-only metadata/i,
      "mcp/AGENTS.md",
      "generated prompt manifest remains deterministic",
    );
    requireInvariant(
      packageRules,
      /GitHub Actions[\s\S]*verify generated freshness[\s\S]*not the authoring path[\s\S]*must not create\/commit/i,
      "mcp/AGENTS.md",
      "CI verifies generated freshness but does not author generated outputs",
    );
    requireInvariant(
      specialist,
      /Preflight generated ownership[\s\S]*(schema|description|spec)[\s\S]*runtime prompt[\s\S]*mcp\/AGENTS\.md[\s\S]*before implementation/i,
      "mcp-server-development/SKILL.md",
      "MCP public-contract specialist enters the relevant generator preflight before implementation",
    );

    expect(implementation).toContain(
      "| complex / ambiguous development contract | `.agents/skills/development-brief/` |"
    );
    expect(implementation).not.toContain(
      "| repository change contract | `.agents/skills/development-brief/` |"
    );
  });

  test("repository, authoring policy, and MCP verification stay split by proof surface", async () => {
    const [repository, authoring, mcp, packageRules] = await Promise.all([
      source("../.github/workflows/repository-verify.yml"),
      source("../.github/workflows/authoring-policy-verify.yml"),
      source("../.github/workflows/mcp-verify.yml"),
      source("AGENTS.md"),
    ]);

    for (const workflow of [repository, authoring, mcp]) {
      expect(workflow).toContain("branches:\n      - Local");
      expect(workflow).toContain("cancel-in-progress: true");
      expect(workflow).toContain("contents: read");
    }

    expect(repository).toContain('mcp/tests/repository-*.test.ts');
    for (const path of [
      "mcp/tests/documentation-handoff.test.ts",
      "mcp/tests/experimental-authoring-contract.test.ts",
      "mcp/tests/active-routing-integrity.test.ts",
    ]) {
      expect(repository).toContain(path);
    }
    for (const command of [
      "tests/repository-github-discipline.test.ts",
      "tests/repository-supply-chain.test.ts",
      "tests/experimental-authoring-contract.test.ts",
      "tests/documentation-handoff.test.ts",
      "tests/active-routing-integrity.test.ts",
    ]) {
      expect(repository).toContain(command);
    }
    expect(repository).not.toContain("mcp/tests/static-footprint-budget.test.ts");
    expect(repository).not.toContain("tests/static-footprint-budget.test.ts");
    expect(repository).not.toContain("bun install");

    for (const pattern of [
      "!mcp/tests/repository-*.test.ts",
      "!mcp/tests/documentation-handoff.test.ts",
      "!mcp/tests/experimental-authoring-contract.test.ts",
      "!mcp/tests/active-routing-integrity.test.ts",
      "!mcp/tests/static-footprint-budget.test.ts",
      "!mcp/tests/*authoring*.test.ts",
      "!mcp/tests/asset-tool-routing.test.ts",
      "!mcp/tests/reference-generator-buildability.test.ts",
      "!mcp/tests/model-effectiveness-*.test.ts",
      "!mcp/tests/texture-production-discipline.test.ts",
      "!mcp/tests/animation-professional-reasoning.test.ts",
      "!mcp/tests/prelocal-prompt-skill-surface.test.ts",
      "!mcp/tests/prelocal-usage-optimization.test.ts",
    ]) {
      expect(mcp).toContain(pattern);
    }

    for (const pattern of [
      "mcp/tests/static-footprint-budget.test.ts",
      "mcp/tests/*authoring*.test.ts",
      "mcp/tests/asset-tool-routing.test.ts",
      "mcp/tests/reference-generator-buildability.test.ts",
      "mcp/tests/model-effectiveness-*.test.ts",
      "mcp/tests/texture-production-discipline.test.ts",
      "mcp/tests/animation-professional-reasoning.test.ts",
      "mcp/tests/prelocal-prompt-skill-surface.test.ts",
      "mcp/tests/prelocal-usage-optimization.test.ts",
    ]) {
      expect(authoring).toContain(pattern);
    }

    expect(repository).not.toContain("tests/model-effectiveness-*.test.ts");
    expect(authoring).toContain("tests/model-effectiveness-*.test.ts");
    expect(authoring).toContain("bun install --frozen-lockfile --production");

    for (const path of [
      ".agents/skills/blockit-bedrock-entity-mcp/**",
      ".agents/skills/blockbench-bedrock-modelling/**",
      ".agents/skills/blockit-bedrock-texturing/**",
      ".agents/skills/blockit-bedrock-animation/**",
      "docs/foundation/**",
    ]) {
      expect(authoring).toContain(path);
      expect(mcp).not.toContain(path);
    }

    for (const command of [
      "bun run typecheck",
      "bun run test",
      "bun run measure:surface",
      "bun run build",
      "bun run docs:check",
    ]) {
      expect(mcp).toContain(command);
      expect(packageRules).toContain(command);
    }
    expect(mcp).toContain("bun install --frozen-lockfile");
    expect(mcp).not.toContain("bun install --frozen-lockfile --production");

    for (const command of ["bun run typecheck", "bun run measure:surface", "bun run build", "bun run docs:check"]) {
      expect(repository).not.toContain(command);
      expect(authoring).not.toContain(command);
    }

    requireInvariant(
      packageRules,
      /repository-policy[\s\S]*Repository Verify[\s\S]*authoring-policy[\s\S]*Authoring Policy Verify[\s\S]*executable or public MCP[\s\S]*MCP Verify/i,
      "mcp/AGENTS.md",
      "MCP-package rules route static repository, static authoring, and executable/public claims to distinct verifiers",
    );

    expect(packageRules).toContain("### During iteration");
    expect(packageRules).toContain("### Final MCP gate");
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