import { describe, expect, test } from "bun:test";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("validator routing efficiency", () => {
  test("router uses summary-first structural validation instead of vision spam", async () => {
    const [router, validator] = await Promise.all([
      source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md"),
      source("server/resources/validator.ts"),
    ]);

    expect(router.length).toBeLessThan(5_000);
    expect(router).toContain(
      "structural validation gate    → validator://status; details only when nonzero"
    );
    expect(router).toContain(
      "Validator gate → read `validator://status` first; zero problems means no detail-resource read."
    );

    expect(validator).toContain('uriTemplate: "validator://status"');
    expect(validator).toContain(
      "Returns validation counts/status only. Read `validator://errors` or `validator://warnings` only when detailed problems are needed."
    );
    expect(validator).toContain('errors: "validator://errors"');
    expect(validator).toContain('warnings: "validator://warnings"');

    expect(router).toContain(
      "visible/reference comparison  → capture_model_views"
    );
    expect(router).not.toMatch(/validator:\/\/status.*visual (pass|quality)/i);
  });
});
