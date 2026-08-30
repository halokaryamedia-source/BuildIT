import { describe, expect, test } from "bun:test";

async function text(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("current developer-facing documentation sync", () => {
  test("current proof, tool counts, and developer-loop ownership stay aligned", async () => {
    const [flow, llms, implementation, packageRules] = await Promise.all([
      text("../docs/knowledge/flow.md"),
      text("llms.txt"),
      text("../docs/knowledge/implementation-map.md"),
      text("AGENTS.md"),
    ]);

    expect(flow).toContain("current proof state        → docs/knowledge/current-validation.md");
    expect(flow).not.toContain("docs/foundation/validation-report.md");

    expect(llms).toContain("65 callable tools across authoring phases");
    expect(llms).toContain("currently **28 exposed tools**");
    expect(llms).toContain("77 declared source ToolSpecs");
    expect(llms).not.toContain("64 callable tools across authoring phases");
    expect(llms).not.toContain("currently **27 exposed tools**");

    expect(packageRules).toContain(
      "scripts/        verification/measurement/preparation/local-deploy utilities"
    );
    expect(implementation).toContain(
      "developer loop: `dev:watch`, prompt watch regeneration, `deploy:local`"
    );
    expect(implementation).toContain("`mcp/tests/developer-loop.test.ts`");
    expect(implementation).toContain("77 declared source ToolSpecs");
  });

  test("execution context markers, defaults, and proof ceilings stay synchronized", async () => {
    const [root, githubRules, packageRules, flow, contributing, runbook] = await Promise.all([
      text("../AGENTS.md"),
      text("../GITHUB_RULES.md"),
      text("AGENTS.md"),
      text("../docs/knowledge/flow.md"),
      text("../CONTRIBUTING.md"),
      text("../docs/knowledge/operations/local-acceptance-runbook.md"),
    ]);

    for (const owner of [root, githubRules, packageRules, flow, contributing]) {
      for (const context of ["REMOTE_GITHUB", "LOCAL_CODE", "LIVE_BLOCKBENCH"]) {
        expect(owner).toContain(context);
      }
    }

    for (const marker of [
      "CONTEXT: REMOTE_GITHUB",
      "CONTEXT: LOCAL_CODE",
      "CONTEXT: LIVE_BLOCKBENCH",
      "SWITCH CONTEXT:",
    ]) {
      expect(root).toContain(marker);
    }
    expect(root).toMatch(/without a marker[\s\S]*lowest sufficient provable context/i);
    expect(root).toMatch(/never infer `LOCAL_CODE`[\s\S]*never infer `LIVE_BLOCKBENCH`/i);
    expect(root).toMatch(/`LIVE_BLOCKBENCH` is never assumed/i);
    expect(root).toMatch(/proof ceiling[\s\S]*handoff before substantial edits/i);
    expect(root).toContain("LOCAL PROOF REQUIRED");

    expect(githubRules).toContain("Execution context / proof ceiling");
    expect(githubRules).toContain("### Execution Handoff");
    expect(githubRules).toContain("FROM_CONTEXT");
    expect(githubRules).toContain("TO_CONTEXT");

    expect(packageRules).toContain("## Execution Context / Proof Ceiling");
    expect(packageRules).toMatch(
      /REMOTE_GITHUB[\s\S]*source\/static\/CI-verifiable[\s\S]*LOCAL_CODE[\s\S]*LIVE_BLOCKBENCH/i
    );

    expect(flow).toMatch(/PIN CURRENT AUTHORITY[\s\S]*EXECUTION CONTEXT[\s\S]*PROOF CEILING[\s\S]*TASK CLASS/i);
    expect(flow).not.toContain("ChatGPT → GitHub");
    expect(flow).not.toContain("Codex local / Blockbench");

    expect(runbook).toMatch(/LIVE_BLOCKBENCH[\s\S]*execution capability[\s\S]*does not activate/i);
    expect(runbook).toMatch(/targeted live debugging[\s\S]*formal Local Acceptance/i);
  });
});
