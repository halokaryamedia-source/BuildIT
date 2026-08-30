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
  test("GITHUB_RULES keeps compact transaction, delivery, proof, and stop boundaries", async () => {
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
    ]) expect(rules).toContain(heading);

    requireInvariant(rules, /`Local` is the working repository authority/i, "GITHUB_RULES.md", "Local remains working authority");
    requireInvariant(rules, /same conversation\/development session[\s\S]*Do not reread the full boot set/i, "GITHUB_RULES.md", "continuity boot is reusable in-session");
    requireInvariant(rules, /ChatGPT atomic Git delivery[\s\S]*keep Local unchanged[\s\S]*fast-forward Local once/i, "GITHUB_RULES.md", "atomic Git delivery stays one ref movement");
    requireInvariant(rules, /Known capability mismatch[\s\S]*0 retries[\s\S]*Same-cause valid-method failure[\s\S]*2 attempts/i, "GITHUB_RULES.md", "retry semantics remain bounded");
    requireInvariant(rules, /Static source\/CI evidence[\s\S]*does not prove live Blockbench/i, "GITHUB_RULES.md", "static proof cannot upgrade runtime proof");
    expect(rules).toContain("GitHub Actions is verification/deployment infrastructure");
    expect(rules).toContain("Do not use exact natural-language wording as a test contract");
    expect(rules).toContain("docs/knowledge/current-validation.md");
  });

  test("root routing uses bounded, standard, and complex Development contracts", async () => {
    const root = await source("../AGENTS.md");
    expect(root.length).toBeLessThan(7_000);

    for (const heading of [
      "### Observe / recover context",
      "### Repository / Plugin Work",
      "#### Development Execution Gate",
      "### Bounded Maintenance",
      "### Standard Development",
      "### Complex / Ambiguous Development",
      "### Asset Authoring",
    ]) expect(root).toContain(heading);

    requireInvariant(root, /Bounded contract[\s\S]*Goal[\s\S]*Failure Classification \/ first wrong owner[\s\S]*Acceptance[\s\S]*Proof Required[\s\S]*STOP Condition/i, "AGENTS.md", "bounded maintenance keeps acceptance/proof/stop gates");
    requireInvariant(root, /Standard contract[\s\S]*Goal[\s\S]*Success Metric[\s\S]*First Evidence Required \/ first wrong owner[\s\S]*In Scope \/ Out of Scope[\s\S]*Proof Required[\s\S]*STOP Condition/i, "AGENTS.md", "standard development keeps success/scope/proof gates");
    requireInvariant(root, /Complex \/ Ambiguous Development[\s\S]*development-brief[\s\S]*(architecture|redesign)[\s\S]*(quality|efficiency)/i, "AGENTS.md", "complex work escalates to development-brief");

    expect(root).toContain("Forbidden Proxy / Non-Goal");
    expect(root).toContain("do not automatically load");
    expect(root).toContain("docs/knowledge/current-validation.md");
  });

  test("development brief is an escalation contract, not mandatory ceremony", async () => {
    const brief = await source("../.agents/skills/development-brief/SKILL.md");
    expect(brief.length).toBeLessThan(6_000);

    for (const heading of [
      "## Entry boundary",
      "## Mandatory Development continuity",
      "## Development Contract",
      "## Effectiveness vocabulary",
      "## Evidence before optimization",
      "## Failure classification",
      "## Completion Boundary",
    ]) expect(brief).toContain(heading);

    requireInvariant(brief, /Do \*\*not\*\* load this Skill for bounded maintenance[\s\S]*clear standard change/i, "development-brief/SKILL.md", "clear work does not escalate to the full brief");
    requireInvariant(brief, /Goal[\s\S]*Success Metric[\s\S]*Forbidden Proxy \/ Non-Goal[\s\S]*First Evidence Required[\s\S]*Failure Classification \/ first wrong owner[\s\S]*Proof Required[\s\S]*STOP Condition/i, "development-brief/SKILL.md", "complex development keeps outcome/evidence contract");

    expect(brief).toContain("Cost to Accepted Result");
    expect(brief).toContain("new ChatGPT, Codex, or Opencode session");
  });

  test("repository-development instruction owners stay bounded by responsibility", async () => {
    const [packageRules, developmentBrief, mcpDevelopment] = await Promise.all([
      source("AGENTS.md"),
      source("../.agents/skills/development-brief/SKILL.md"),
      source("../.agents/skills/mcp-server-development/SKILL.md"),
    ]);

    expect(packageRules.length).toBeLessThan(6_000);
    expect(developmentBrief.length).toBeLessThan(6_000);
    expect(mcpDevelopment.length).toBeLessThan(4_000);
    expect(packageRules).toContain("Root `../AGENTS.md` owns repository routing");
    expect(mcpDevelopment).toContain("`mcp/AGENTS.md` owns package-wide");
  });

  test("generated MCP outputs preflight before substantial public-contract implementation", async () => {
    const [packageRules, specialist] = await Promise.all([
      source("AGENTS.md"),
      source("../.agents/skills/mcp-server-development/SKILL.md"),
    ]);

    requireInvariant(packageRules, /Before substantial implementation[\s\S]*public schema\/description\/spec[\s\S]*bun run docs:build[\s\S]*bun run docs:check[\s\S]*(STOP|defer)[\s\S]*before source edits accumulate/i, "mcp/AGENTS.md", "API generation is preflighted");
    requireInvariant(packageRules, /canonical runtime prompt source[\s\S]*bun run prompts:build[\s\S]*prompts\/manifest\.json[\s\S]*(STOP|defer)[\s\S]*before prompt edits accumulate/i, "mcp/AGENTS.md", "prompt generation is preflighted");
    requireInvariant(specialist, /Preflight generated ownership[\s\S]*(schema|description|spec)[\s\S]*runtime prompt[\s\S]*mcp\/AGENTS\.md[\s\S]*before implementation/i, "mcp-server-development/SKILL.md", "specialist uses package generator ownership");
  });

  test("Local verification is path-scoped while main promotion uses one full release gate", async () => {
    const [repository, authoring, mcp, release, packageRules] = await Promise.all([
      source("../.github/workflows/repository-verify.yml"),
      source("../.github/workflows/authoring-policy-verify.yml"),
      source("../.github/workflows/mcp-verify.yml"),
      source("../.github/workflows/release-verify.yml"),
      source("AGENTS.md"),
    ]);

    for (const workflow of [repository, authoring, mcp]) {
      expect(workflow).toContain("push:\n    branches:\n      - Local");
      expect(workflow).not.toContain("pull_request:");
      expect(workflow).toContain("cancel-in-progress: true");
      expect(workflow).toContain("contents: read");
    }

    expect(release).toContain("push:\n    branches:\n      - main");
    expect(release).toContain("pull_request:\n    branches:\n      - main");
    expect(release).toContain("contents: read");

    expect(repository).toContain('docs/knowledge/current-validation.md');
    expect(repository).toContain('Experimental/blockbench-web-poc/**');
    expect(repository).not.toContain('Experimental/**');
    expect(repository).not.toContain('Experimental/route1-hunyuan-poc/**');
    expect(repository).not.toContain("bun install");

    expect(authoring).toContain('Experimental/route1-hunyuan-poc/**');
    expect(authoring).toContain('mcp/tests/route1-hunyuan-reproducibility.test.ts');
    expect(authoring).toContain('tests/route1-hunyuan-reproducibility.test.ts');
    expect(authoring).toContain("bun install --frozen-lockfile --production");
    expect(authoring).not.toContain('docs/knowledge/current-validation.md');

    expect(mcp).toContain('!mcp/tests/route1-hunyuan-reproducibility.test.ts');
    expect(mcp).toContain("bun install --frozen-lockfile");
    expect(mcp).not.toContain("bun install --frozen-lockfile --production");

    for (const command of [
      "bun run typecheck",
      "bun run test",
      "bun run measure:surface",
      "bun run build",
      "bun run docs:check",
    ]) {
      expect(mcp).toContain(command);
      expect(release).toContain(command);
      expect(packageRules).toContain(command);
      expect(repository).not.toContain(command);
      if (command !== "bun run test") expect(authoring).not.toContain(command);
    }

    requireInvariant(packageRules, /repository-policy[\s\S]*Repository Verify[\s\S]*authoring-policy[\s\S]*Authoring Policy Verify[\s\S]*executable or public MCP[\s\S]*MCP Verify/i, "mcp/AGENTS.md", "package rules keep proof surfaces distinct");
  });

  test("continuation stays compact and stores only active/deferred boundaries", async () => {
    const [next, validation, experimental] = await Promise.all([
      source("../docs/knowledge/next-action.md"),
      source("../docs/knowledge/current-validation.md"),
      source("../Experimental/README.md"),
    ]);

    expect(next.length).toBeLessThan(2_500);
    for (const heading of ["## Current Status", "## Active Boundary", "## Next Step"]) expect(next).toContain(heading);
    expect(next).toContain("Working branch: **`Local` only**");
    expect(next).toContain("NO_ACTIVE_REPOSITORY_DEVELOPMENT");
    expect(next).toContain("Route 1 live validation remains deferred");
    expect(next).toContain("Geometry cleanup remains deferred");
    expect(next).not.toContain("## Development Contract");
    expect(validation).toContain("current proof interpretation");
    expect(validation).not.toContain("LATEST REPOSITORY VERIFY");
    expect(experimental).toContain("NOT PRODUCTION");
  });
});
