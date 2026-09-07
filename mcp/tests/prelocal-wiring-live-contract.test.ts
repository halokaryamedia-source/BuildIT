import { describe, expect, test } from "bun:test";
import { getAllToolDefinitions, tools } from "@/lib/factories";
import { PAINT_TEXTURE_TRANSACTION_TOOL_NAME } from "@/lib/paintTransactionPolicy";
import { getToolRegistrationFamily } from "@/server/tools";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("pre-local live wiring acceptance contract", () => {
  test("runtime surface exposes the prepared transaction, variant, and focused evidence contracts", () => {
    const definitions = getAllToolDefinitions();
    const createTexture = definitions.create_texture;
    const getTexture = definitions.get_texture;
    const paintTransaction = definitions[PAINT_TEXTURE_TRANSACTION_TOOL_NAME];

    expect(createTexture).toBeDefined();
    expect(getTexture).toBeDefined();
    expect(paintTransaction).toBeDefined();
    expect(tools[PAINT_TEXTURE_TRANSACTION_TOOL_NAME]?.enabled).toBe(true);
    expect(getToolRegistrationFamily(PAINT_TEXTURE_TRANSACTION_TOOL_NAME)).toBe("paint");

    expect(
      createTexture.parameterSchema.safeParse({
        type: "variant",
        name: "variant",
        source_texture_id: "base-texture",
        group: "variant-group",
      }).success
    ).toBe(true);
    expect(
      createTexture.parameterSchema.safeParse({
        type: "variant",
        name: "variant",
        group: "variant-group",
      }).success
    ).toBe(false);

    const revision = `sha256:4x4:${"a".repeat(64)}`;
    expect(
      getTexture.parameterSchema.safeParse({
        texture: "base-texture",
        region: { x: 0, y: 0, width: 4, height: 4 },
        expected_revision: revision,
      }).success
    ).toBe(true);
    expect(
      paintTransaction.parameterSchema.safeParse({
        texture_id: "base-texture",
        expected_revision: revision,
        operations: [
          {
            operation: "fill_rect",
            color: "#112233FF",
            rect: { x: 0, y: 0, width: 4, height: 4 },
          },
        ],
      }).success
    ).toBe(true);
  });

  test("one disposable live verifier still owns the end-to-end Blockbench boundary", async () => {
    const script = await source("scripts/verify-prelocal-wiring-live.ts");
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
    expect(script).toContain('type: "variant"');
    expect(script).toContain('is_material: false');
    expect(script).toContain('region: { x: 0, y: 0, width: 4, height: 4 }');
    expect(script).toContain("JSON.stringify(baseBefore).includes(\"rgba\") === false");
    expect(script).not.toContain("custom JSON");
  });
});
