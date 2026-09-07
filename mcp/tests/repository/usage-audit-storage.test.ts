import { describe, expect, test } from "bun:test";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("historical authoring usage audit storage", () => {
  test("historical multi-model findings stay out of active proof-state payload", async () => {
    const [validation, audit] = await Promise.all([
      source("../docs/knowledge/current-validation.md"),
      source("../Experimental/authoring-usage-audit-2026-09-07.md"),
    ]);

    expect(validation).toContain("Experimental/authoring-usage-audit-2026-09-07.md");
    expect(validation).toContain("historical evidence");
    expect(validation).not.toContain("#### USAGE-01");
    expect(validation).not.toContain("#### USAGE-24");

    expect(audit).toContain("#### USAGE-01");
    expect(audit).toContain("#### USAGE-24");
    expect(audit).toMatch(/bukan perubahan kebijakan/i);
    expect(audit).toMatch(/masalah utama bukan kekurangan jumlah tool/i);
  });
});
