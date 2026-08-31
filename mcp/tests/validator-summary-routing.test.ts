import { describe, expect, test } from "bun:test";
import { summarizeActiveValidatorChecks } from "@/server/resources/validator";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("validator summary-first routing", () => {
  test("status exposes only active checks with exact lazy detail URIs", () => {
    expect(
      summarizeActiveValidatorChecks([
        { id: "clean", errors: [], warnings: [] },
        { id: "uv_overlap", errors: [{}], warnings: [{}, {}] },
        { id: "missing_texture", errors: [], warnings: [{}] },
      ])
    ).toEqual([
      {
        id: "uv_overlap",
        errorCount: 1,
        warningCount: 2,
        totalProblems: 3,
        detail_uri: "validator://checks/uv_overlap",
      },
      {
        id: "missing_texture",
        errorCount: 0,
        warningCount: 1,
        totalProblems: 1,
        detail_uri: "validator://checks/missing_texture",
      },
    ]);
  });

  test("validator status remains summary-only instead of embedding problem messages", async () => {
    const validator = await source("server/resources/validator.ts");
    const start = validator.indexOf('createResource("validator-status"');
    const end = validator.indexOf('createResource("validator-checks"', start);
    const statusSection = validator.slice(start, end);

    expect(statusSection).toContain("problemCheckCount");
    expect(statusSection).toContain("problem_checks: problemChecks");
    expect(statusSection).toContain("summarizeActiveValidatorChecks(Validator.checks)");
    expect(statusSection).not.toContain("serializeProblem(");
    expect(statusSection).not.toContain("problem.message");
  });
});
