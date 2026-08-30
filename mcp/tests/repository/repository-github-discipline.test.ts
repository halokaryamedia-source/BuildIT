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

  test("root routing exposes bounded, standard, complex, and asset-authoring lanes", async () => {
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

    requireInvariant(root, /Bounded contract[\s\S]*Goal[\s\S]*Acceptance[\s\S]*Proof Required[\s\S]*STOP Condition/i, "AGENTS.md", "bounded work keeps acceptance/proof/stop gates");
    requireInvariant(root, /Standard contract[\s\S]*Goal[\s\S]*Success Metric[\s\S]*In Scope \/ Out of Scope[\s\S]*Proof Required[\s\S]*STOP Condition/i, "AGENTS.md", "standard work keeps success/scope/proof gates");
    requireInvariant(root, /Complex \/ Ambiguous Development[\s\S]*development-brief[\s\S]*(architecture|redesign)[\s\S]*(quality|efficiency)/i, "AGENTS.md", "complex work escalates to the brief");
    requireInvariant(root, /Asset authoring[\s\S]*not software \*\*Development\*\*[\s\S]*not route it through `development-brief`/i, "AGENTS.md", "asset work bypasses repository-development ceremony");
    expect(root).not.toMatch(/Developing Execution|Ambiguous Developing/);
  });

  test("development brief remains an escalation contract rather than default ceremony", async () => {
    const brief = await source("../.agents/skills/development-brief/SKILL.md");
    expect(brief.length).toBeLessThan(6_000);

    for (const heading of [
      "## Entry boundary",
      "## Mandatory Development continuity",
      "## Development Contract",
      "## Effectiveness vocabulary",
      "## Failure classification",
      "## Completion Boundary",
    ]) expect(brief).toContain(heading);

    requireInvariant(brief, /not\*\* load this Skill for bounded maintenance[\s\S]*clear standard change/i, "development-brief/SKILL.md", "clear work does not escalate");
    requireInvariant(brief, /Goal[\s\S]*Success Metric[\s\S]*Forbidden Proxy \/ Non-Goal[\s\S]*Proof Required[\s\S]*STOP Condition/i, "development-brief/SKILL.md", "complex work preserves outcome/proof contract");
    expect(brief).toContain("Cost to Accepted Result");
    expect(brief).not.toMatch(/BlockIT Developing|Mandatory Developing|Developing Execution Gate/);
  });

  test("generated MCP ownership is preflighted before substantial public-contract editing", async () => {
    const [packageRules, specialist] = await Promise.all([
      source("AGENTS.md"),
      source("../.agents/skills/mcp-server-development/SKILL.md"),
    ]);

    requireInvariant(packageRules, /Before substantial implementation[\s\S]*public schema\/description\/spec[\s\S]*docs:build[\s\S]*docs:check[\s\S]*(STOP|defer)/i, "mcp/AGENTS.md", "API generation is preflighted");
    requireInvariant(packageRules, /canonical runtime prompt source[\s\S]*prompts:build[\s\S]*prompts\/manifest\.json[\s\S]*(STOP|defer)/i, "mcp/AGENTS.md", "prompt generation is preflighted");
    requireInvariant(specialist, /Preflight generated ownership[\s\S]*(schema|description|spec)[\s\S]*runtime prompt[\s\S]*mcp\/AGENTS\.md/i, "mcp-server-development/SKILL.md", "specialist follows package generator ownership");
  });

  test("test-only verifier ownership is directory-based while full MCP remains recursive", async () => {
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
    expect(scripts["test"]).toBe("bun test");
    expect(scripts["verify:release"]).toBe("bun run verify:mcp");

    const fullGate = scripts["verify:mcp"];
    const ordered = ["bun run typecheck", "bun run test", "bun run measure:surface", "bun run build", "bun run docs:check"];
    let previous = -1;
    for (const command of ordered) {
      const index = fullGate.indexOf(command);
      expect(index).toBeGreaterThan(previous);
      previous = index;
    }

    expect(repository).toContain("bun run verify:repository");
    expect(authoring).toContain("bun run verify:authoring");
    expect(mcp).toContain("bun run verify:mcp");
    expect(release).toContain("bun run verify:release");

    for (const workflow of [repository, authoring, mcp]) {
      expect(workflow).toContain("push:\n    branches:\n      - Local");
      expect(workflow).not.toContain("pull_request:");
      expect(workflow).toContain("contents: read");
    }
    expect(release).toContain("push:\n    branches:\n      - main");
    expect(release).toContain("pull_request:\n    branches:\n      - main");

    expect(repository).toContain('"mcp/package.json"');
    expect(repository).toContain('"mcp/tests/repository/**"');
    expect(authoring).not.toContain('"mcp/package.json"');
    expect(authoring).toContain('"mcp/tests/authoring/**"');
    expect(authoring).toContain('"Experimental/route1-hunyuan-poc/**"');
    expect(mcp).toContain('"mcp/**"');
    expect(mcp).toContain('"!mcp/tests/repository/**"');
    expect(mcp).toContain('"!mcp/tests/authoring/**"');

    for (const workflow of [repository, authoring, mcp]) {
      expect(workflow).not.toMatch(/mcp\/tests\/[^"\n]+\.test\.ts/);
    }

    for (const name of [
      "repository-github-discipline.test.ts",
      "repository-supply-chain.test.ts",
      "documentation-handoff.test.ts",
      "experimental-authoring-contract.test.ts",
      "active-routing-integrity.test.ts",
    ]) {
      expect(await Bun.file(`tests/repository/${name}`).exists(), name).toBe(true);
      expect(await Bun.file(`tests/${name}`).exists(), name).toBe(false);
    }

    for (const name of [
      "static-footprint-budget.test.ts",
      "model-effectiveness-reference-grounding.test.ts",
      "texture-production-discipline.test.ts",
      "animation-professional-reasoning.test.ts",
      "route1-hunyuan-reproducibility.test.ts",
    ]) {
      expect(await Bun.file(`tests/authoring/${name}`).exists(), name).toBe(true);
      expect(await Bun.file(`tests/${name}`).exists(), name).toBe(false);
    }

    for (const name of [
      "authoring-phase-surface.test.ts",
      "texture-authoring-contract.test.ts",
      "model-effectiveness-correction-accuracy.test.ts",
    ]) {
      expect(await Bun.file(`tests/${name}`).exists(), name).toBe(true);
      expect(await Bun.file(`tests/authoring/${name}`).exists(), name).toBe(false);
    }

    for (const workflow of [repository, authoring, mcp, release]) {
      expect(workflow).not.toContain("bun run measure:surface\n");
      expect(workflow).not.toContain("bun run docs:check\n");
    }
  });

  test("continuation and local acceptance remain compact, current, and fail-closed", async () => {
    const [next, validation, runbook, experimental] = await Promise.all([
      source("../docs/knowledge/next-action.md"),
      source("../docs/knowledge/current-validation.md"),
      source("../docs/knowledge/operations/local-acceptance-runbook.md"),
      source("../Experimental/README.md"),
    ]);

    expect(next.length).toBeLessThan(2_500);
    expect(next).toContain("NO_ACTIVE_REPOSITORY_DEVELOPMENT");
    expect(next).toContain("Route 1 live validation remains deferred");
    expect(validation).toContain("current proof interpretation");
    expect(validation).not.toContain("LATEST REPOSITORY VERIFY");

    expect(runbook.length).toBeLessThan(8_000);
    expect(runbook).toContain("Fast path — reuse exact green MCP Verify");
    expect(runbook).toContain("bun run verify:mcp");
    expect(runbook).toContain("Cost to Accepted Result");
    expect(runbook).toContain("docs/knowledge/current-validation.md");
    expect(runbook).not.toContain("docs/foundation/validation-report.md");
    expect(runbook).not.toContain("Developing Execution Contract");
    expect(experimental).toContain("NOT PRODUCTION");
  });
});
