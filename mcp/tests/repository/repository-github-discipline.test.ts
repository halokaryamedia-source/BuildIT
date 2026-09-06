import { describe, expect, test } from "bun:test";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

function requireInvariant(body: string, pattern: RegExp, owner: string, invariant: string): void {
  if (!pattern.test(body)) throw new Error(`INVARIANT: ${invariant}\nOWNER: ${owner}`);
}

describe("repository GitHub discipline", () => {
  test("GITHUB_RULES keeps transaction, proof, retry, and stop boundaries", async () => {
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

    requireInvariant(rules, /Local[^\n]*working repository authority/i, "GITHUB_RULES.md", "Local remains working authority");
    requireInvariant(rules, /atomic Git delivery[\s\S]*keep Local unchanged[\s\S]*fast-forward Local once/i, "GITHUB_RULES.md", "atomic delivery keeps one ref movement");
    requireInvariant(rules, /Known capability mismatch[\s\S]*0 retries[\s\S]*Same-cause valid-method failure[\s\S]*2 attempts/i, "GITHUB_RULES.md", "retry classes stay bounded");
    requireInvariant(rules, /Static source\/CI evidence[\s\S]*does not prove live Blockbench/i, "GITHUB_RULES.md", "static proof cannot upgrade live proof");
    expect(rules).toContain("docs/knowledge/current-validation.md");
  });

  test("development exhausts GitHub-verifiable work before handing off only higher-context residue", async () => {
    const [root, rules, packageRules, brief] = await Promise.all([
      source("../AGENTS.md"),
      source("../GITHUB_RULES.md"),
      source("AGENTS.md"),
      source("../.agents/skills/development-brief/SKILL.md"),
    ]);

    requireInvariant(root, /exhaust source\/static\/CI-verifiable work first[\s\S]*handoff only the minimum[\s\S]*never transfer the whole task/i, "AGENTS.md", "root routes by minimum higher-context residue");
    requireInvariant(rules, /GitHub-first execution partition[\s\S]*Do not transfer the whole task[\s\S]*minimum residue/i, "GITHUB_RULES.md", "GitHub work is exhausted before escalation");
    expect(rules).toContain("exact-SHA verified build/test artifacts");
    expect(rules).toContain("source SHA, artifact hash/build identity, verifier, and toolchain provenance");
    expect(rules).toContain("Verification workflows are read-only by default and do not commit back to `Local`.");
    expect(packageRules).toContain("A higher-context dependency does **not** transfer the whole MCP task.");
    expect(packageRules).toContain("only its coupled canonical edit remains higher-context residue");
    expect(packageRules).toContain("unrelated regression, routing, harness, provenance, or static acceptance work continues in GitHub");
    requireInvariant(brief, /Execution Partition[\s\S]*GitHub-first[\s\S]*Higher-context residue[\s\S]*must not be redone/i, "development-brief/SKILL.md", "complex work carries an explicit GitHub-first partition");
  });

  test("root and complex-development routing stay compact without losing execution gates", async () => {
    const [root, brief] = await Promise.all([
      source("../AGENTS.md"),
      source("../.agents/skills/development-brief/SKILL.md"),
    ]);
    expect(root.length).toBeLessThan(7_000);
    expect(brief.length).toBeLessThan(6_000);

    for (const heading of [
      "### Observe / recover context",
      "### Repository / Plugin Work",
      "#### Development Execution Gate",
      "### Bounded Maintenance",
      "### Standard Development",
      "### Complex / Ambiguous Development",
      "### Asset Authoring",
    ]) expect(root).toContain(heading);

    requireInvariant(root, /Bounded contract[\s\S]*Goal[\s\S]*Acceptance[\s\S]*Proof Required[\s\S]*STOP Condition/i, "AGENTS.md", "bounded work keeps acceptance/proof/stop gates");
    requireInvariant(root, /Standard contract[\s\S]*Goal[\s\S]*Success Metric[\s\S]*In Scope \/ Out of Scope[\s\S]*Execution Partition[\s\S]*Proof Required[\s\S]*STOP Condition/i, "AGENTS.md", "standard work keeps success/scope/partition/proof gates");
    expect(root).toContain("Asset authoring is not software **Development**");

    for (const heading of [
      "## Entry boundary",
      "## Mandatory Development continuity",
      "## Development Contract",
      "## Execution Partition",
      "## Effectiveness vocabulary",
      "## Failure classification",
      "## Completion Boundary",
    ]) expect(brief).toContain(heading);
    expect(brief).toContain("Cost to Accepted Result");
    expect(brief).toContain("Preflight regressions");
  });

  test("generated MCP ownership is preflighted without transferring independent GitHub preparation", async () => {
    const [packageRules, specialist] = await Promise.all([
      source("AGENTS.md"),
      source("../.agents/skills/mcp-server-development/SKILL.md"),
    ]);

    requireInvariant(packageRules, /Before substantial implementation[\s\S]*public schema\/description\/spec[\s\S]*docs:build[\s\S]*docs:check[\s\S]*(STOP|defer)/i, "mcp/AGENTS.md", "API generation is preflighted");
    requireInvariant(packageRules, /canonical runtime prompt source[\s\S]*prompts:build[\s\S]*prompts\/manifest\.json[\s\S]*(STOP|defer)/i, "mcp/AGENTS.md", "prompt generation is preflighted");
    requireInvariant(packageRules, /partition first[\s\S]*independent[\s\S]*(tests|regression|harness)/i, "mcp/AGENTS.md", "unavailable generators do not transfer unrelated preparation");
    requireInvariant(specialist, /Preflight generated ownership[\s\S]*(schema|description|spec)[\s\S]*runtime prompt[\s\S]*mcp\/AGENTS\.md/i, "mcp-server-development/SKILL.md", "specialist follows package generator ownership");
  });

  test("device-independent acceptance reuses only complete exact-commit source proof", async () => {
    const [root, rules, runbook, validation, repository, packageText] = await Promise.all([
      source("../AGENTS.md"),
      source("../GITHUB_RULES.md"),
      source("../docs/knowledge/operations/local-acceptance-runbook.md"),
      source("../docs/knowledge/current-validation.md"),
      source("../.github/workflows/repository-verify.yml"),
      source("package.json"),
    ]);

    const acceptance = rules.split("### Device-independent source acceptance\n")[1]?.split("\n## 2. READ MINIMUM")[0] ?? "";
    requireInvariant(acceptance, /verify:repository[\s\S]*verify:mcp[\s\S]*same exact `Local` SHA/i, "GITHUB_RULES.md", "full composite proof is exact-commit");
    requireInvariant(acceptance, /composite[\s\S]*not an executed `verify:full`/i, "GITHUB_RULES.md", "composite evidence is not a command-execution claim");
    requireInvariant(acceptance, /Do not combine different SHAs[\s\S]*ancestor/i, "GITHUB_RULES.md", "ancestor success cannot replace exact-commit evidence");
    requireInvariant(acceptance, /Do not rerun[^\n]*locally[^\n]*CI/i, "GITHUB_RULES.md", "accepted CI source checks are not duplicated locally");
    requireInvariant(root, /covered source result complete[\s\S]*genuinely missing higher-context proof/i, "AGENTS.md", "routing does not invent a local blocker");

    for (const owner of [runbook, validation]) {
      expect(owner).toContain("GITHUB_RULES.md");
      expect(owner).toMatch(/same exact `Local` SHA/);
    }
    expect(validation).not.toContain("LOCAL verify:full REQUIRED");
    expect(runbook).not.toContain("bun run build\n");
    expect(JSON.parse(packageText).scripts["deploy:local"]).toMatch(/^bun run build && /);

    for (const path of [
      "AGENTS.md",
      "GITHUB_RULES.md",
      "docs/knowledge/current-validation.md",
      "docs/knowledge/operations/**",
      "mcp/tests/repository/**",
    ]) expect(repository).toContain(`"${path}"`);
  });

  test("verification layers, generic fixture, and CI routing stay directory-owned", async () => {
    const [repository, authoring, mcp, release, packageText] = await Promise.all([
      source("../.github/workflows/repository-verify.yml"),
      source("../.github/workflows/authoring-policy-verify.yml"),
      source("../.github/workflows/mcp-verify.yml"),
      source("../.github/workflows/release-verify.yml"),
      source("package.json"),
    ]);
    const scripts = JSON.parse(packageText).scripts as Record<string, string>;

    expect(scripts["verify:repository"]).toBe("bun test tests/repository/*.test.ts");
    expect(scripts["verify:authoring"]).toBe("bun test tests/authoring/*.test.ts");
    expect(scripts["test:runtime"]).toBe("bun test tests/*.test.ts");
    expect(scripts["verify:fixture-static"]).toBe("bun test tests/authoring/current-workspace-fixture-static.test.ts");
    expect(scripts["verify:lift-static"]).toBeUndefined();
    expect(scripts["verify:full"]).toBe("bun run verify:repository && bun run verify:mcp");
    expect(scripts["verify:release"]).toBe("bun run verify:full");
    expect(scripts["verify:mcp"]).toContain("bun run test:runtime");
    expect(scripts["verify:mcp"]).toContain("bun run verify:authoring");
    expect(scripts["verify:mcp"]).not.toContain("bun run verify:repository");

    expect(repository).toContain("bun run verify:repository");
    expect(authoring).toContain("bun run verify:authoring");
    expect(mcp).toContain("bun run verify:mcp");
    expect(release).toContain("bun run verify:release");
    expect(authoring).toContain('"workspace/active/**"');
    expect(mcp).toContain('"!mcp/tests/repository/**"');
    expect(mcp).toContain('"!mcp/tests/authoring/**"');

    expect(await Bun.file("tests/authoring/current-workspace-fixture-static.test.ts").exists()).toBe(true);
    expect(await Bun.file("tests/authoring/lift-static-acceptance.test.ts").exists()).toBe(false);
  });

  test("release verification is Local-only, exact-candidate, and ancestry guarded", async () => {
    const release = await source("../.github/workflows/release-verify.yml");
    expect(release).toContain("name: Full release contract");
    expect(release).toContain('test "$HEAD_REPOSITORY" = "$GITHUB_REPOSITORY"');
    expect(release).toContain('test "$HEAD_REF" = "Local"');
    expect(release).toContain('test "$REF_NAME" = "Local"');
    expect(release).toContain("ref: ${{ github.event.pull_request.head.sha || github.sha }}");
    expect(release).toContain("fetch-depth: 0");
    expect(release).toContain("persist-credentials: false");
    expect(release).toContain("git merge-base --is-ancestor origin/main HEAD");
    expect(release).toContain("bun run verify:release");
  });

  test("local acceptance stays compact and treats Lift only as a replaceable representative fixture", async () => {
    const [next, validation, runbook, experimental] = await Promise.all([
      source("../docs/knowledge/next-action.md"),
      source("../docs/knowledge/current-validation.md"),
      source("../docs/knowledge/operations/local-acceptance-runbook.md"),
      source("../Experimental/README.md"),
    ]);

    expect(next.length).toBeLessThan(2_500);
    expect(next).toContain("SOURCE_READY");
    expect(next).toContain("3D_ASSISTED");
    expect(validation).toContain("current proof interpretation");

    expect(runbook.length).toBeLessThan(8_000);
    expect(runbook).toMatch(/Fast path[^\n]*exact green/i);
    expect(runbook).toContain("deploy:verified");
    expect(runbook).toMatch(/verify:stateless-local[^\n]*diagnostic/i);
    expect(runbook).toContain("Cost to Accepted Result");
    expect(runbook).toContain("only a representative test fixture");
    expect(runbook).toContain("not a product target");
    expect(runbook).toContain("must not create LIFT-specific tool behavior");
    expect(runbook).toContain("Another suitable fixture may replace it without changing production Runtime semantics");
    expect(experimental).toContain("NOT PRODUCTION");
  });
});
