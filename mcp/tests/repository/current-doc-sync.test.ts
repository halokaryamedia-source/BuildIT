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

  test("execution context and proof ceilings stay synchronized", async () => {
    const [root, githubRules, packageRules] = await Promise.all([
      text("../AGENTS.md"),
      text("../GITHUB_RULES.md"),
      text("AGENTS.md"),
    ]);

    for (const owner of [root, githubRules, packageRules]) {
      for (const context of ["REMOTE_GITHUB", "LOCAL_CODE", "LIVE_BLOCKBENCH"]) {
        expect(owner).toContain(context);
      }
    }

    expect(root).toContain("## Execution Context Gate");
    expect(root).toContain("## Task Class After Context");
    expect(root).toMatch(/proof ceiling[\s\S]*handoff before substantial edits/i);
    expect(root).toContain("LOCAL PROOF REQUIRED");

    expect(githubRules).toContain("Execution context / proof ceiling");
    expect(githubRules).toContain("### Execution Handoff");
    expect(githubRules).toContain("FROM_CONTEXT");
    expect(githubRules).toContain("TO_CONTEXT");
    expect(githubRules).toMatch(/CI is not a substitute[\s\S]*live Blockbench proof/i);

    expect(packageRules).toContain("## Execution Context / Proof Ceiling");
    expect(packageRules).toMatch(
      /REMOTE_GITHUB[\s\S]*source\/static\/CI-verifiable[\s\S]*LOCAL_CODE[\s\S]*LIVE_BLOCKBENCH/i
    );
    expect(packageRules).toMatch(
      /generated output or runtime proof[\s\S]*transfer \*\*before substantial edits accumulate\*\*/i
    );
  });
});
