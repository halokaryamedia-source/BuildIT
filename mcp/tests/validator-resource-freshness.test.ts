import { describe, expect, test } from "bun:test";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("Blockbench validator resource freshness", () => {
  test("resource reads refresh native Validator state before reporting current problems", async () => {
    const validator = await source("server/resources/validator.ts");

    expect(validator).toContain("function refreshValidation(): void");
    expect(validator).toContain("Validator.validate();");
    expect(validator.match(/refreshValidation\(\);/g)?.length).toBe(4);

    const status = validator.slice(
      validator.indexOf('createResource("validator-status"'),
      validator.indexOf('createResource("validator-checks"')
    );
    expect(status.indexOf("refreshValidation();")).toBeGreaterThan(-1);
    expect(status.indexOf("refreshValidation();")).toBeLessThan(
      status.indexOf("totalProblems:")
    );

    const checks = validator.slice(
      validator.indexOf('createResource("validator-checks"'),
      validator.indexOf('createResource("validator-warnings"')
    );
    expect(checks.indexOf("refreshValidation();")).toBeGreaterThan(-1);
    expect(checks.indexOf("refreshValidation();")).toBeLessThan(
      checks.indexOf("const check = Validator.checks.find")
    );

    const warnings = validator.slice(
      validator.indexOf('createResource("validator-warnings"'),
      validator.indexOf('createResource("validator-errors"')
    );
    expect(warnings.indexOf("refreshValidation();")).toBeGreaterThan(-1);
    expect(warnings.indexOf("refreshValidation();")).toBeLessThan(
      warnings.indexOf("const warnings = Validator.warnings.map")
    );

    const errors = validator.slice(
      validator.indexOf('createResource("validator-errors"')
    );
    expect(errors.indexOf("refreshValidation();")).toBeGreaterThan(-1);
    expect(errors.indexOf("refreshValidation();")).toBeLessThan(
      errors.indexOf("const errors = Validator.errors.map")
    );
  });

  test("resource listing remains cheap and does not run validation", async () => {
    const validator = await source("server/resources/validator.ts");

    expect(validator).toContain(
      'description: "Read for a fresh validation summary"'
    );
    expect(validator).toContain(
      'description: "Read for fresh validation warnings"'
    );
    expect(validator).toContain(
      'description: "Read for fresh validation errors"'
    );

    for (const resource of ["validator-status", "validator-warnings", "validator-errors"]) {
      const start = validator.indexOf(`createResource("${resource}"`);
      const listStart = validator.indexOf("async listCallback()", start);
      const readStart = validator.indexOf("async readCallback", listStart);
      const listBody = validator.slice(listStart, readStart);
      expect(listBody, resource).not.toContain("refreshValidation();");
      expect(listBody, resource).not.toContain("Validator.validate();");
    }
  });
});
