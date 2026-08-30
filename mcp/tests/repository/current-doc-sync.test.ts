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
});
