import { describe, expect, test } from "bun:test";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("pre-local live wiring acceptance contract", () => {
  test("one disposable live verifier owns the new integration boundary", async () => {
    const script = await source("scripts/verify-prelocal-wiring-live.ts");
    const policy = await source("lib/paintTransactionPolicy.ts");
    const pkg = JSON.parse(await source("package.json")) as {
      scripts?: Record<string, string>;
    };

    expect(pkg.scripts?.["verify:prelocal-wiring-live"]).toBe(
      "bun run ./scripts/verify-prelocal-wiring-live.ts"
    );
    for (const marker of [
      "model_identifier",
      "get_project_info",
      "PAINT_TEXTURE_TRANSACTION_TOOL_NAME",
      "expected_revision",
      "changed since",
      "fill_rect",
      "set_pixels",
      "undo",
      "redo",
      "variant_target_isolation",
      "focused_png_delivery",
      "stale_revision_rejected",
    ]) {
      expect(script).toContain(marker);
    }
    expect(policy).toContain('"paint_texture_transaction"');
    expect(script).toContain('type: "variant"');
    expect(script).toContain('is_material: false');
    expect(script).toContain('region: { x: 0, y: 0, width: 4, height: 4 }');
    expect(script).toContain("JSON.stringify(baseBefore).includes(\"rgba\") === false");
    expect(script).not.toContain("custom JSON");
  });
});
