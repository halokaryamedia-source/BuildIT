import { describe, expect, test } from "bun:test";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("validator routing efficiency", () => {
  test("Gateway authoring does not chase Direct Runtime validator resources", async () => {
    const [router, validator, gateway] = await Promise.all([
      source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md"),
      source("server/resources/validator.ts"),
      source("gateway/index.ts"),
    ]);

    expect(router).toContain("`validator://*` resources are Direct Runtime/Inspector only");
    expect(router).toContain("Gateway client must not search for or emulate them");
    expect(router).not.toContain("structural validation gate    → validator://status");
    expect(router).not.toContain("Validator gate → read `validator://status` first");

    expect(gateway).toContain("Runtime resources and prompts are not proxied");
    expect(gateway).not.toContain("registerResource(");
    expect(gateway).not.toContain("registerPrompt(");

    expect(validator).toContain('uriTemplate: "validator://status"');
    expect(validator).toContain(
      "Returns validation counts/status only. Read `validator://errors` or `validator://warnings` only when detailed problems are needed."
    );
    expect(validator).toContain('errors: "validator://errors"');
    expect(validator).toContain('warnings: "validator://warnings"');

    expect(router).toContain("visible/reference comparison  → capture_model_views");
    expect(router).not.toMatch(/validator:\/\/status.*visual (pass|quality)/i);
  });
});
