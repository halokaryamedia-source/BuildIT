import { describe, expect, test } from "bun:test";
import { focusedGetTextureParameters } from "@/lib/textureEvidence";
import { paintTransactionParameters } from "@/lib/paintTransaction";
import { createTextureVariantParameters } from "@/lib/textureVariantPlan";

describe("REMOTE_GITHUB authoring handoff contracts", () => {
  test("prepared schemas remain strict enough for minor local wiring", () => {
    expect(
      focusedGetTextureParameters.safeParse({
        texture: "base",
        region: { x: 0, y: 0, width: 8, height: 8 },
        expected_revision: `sha256:16x16:${"a".repeat(64)}`,
      }).success
    ).toBe(true);
    expect(
      focusedGetTextureParameters.safeParse({
        region: { x: -1, y: 0, width: 8, height: 8 },
      }).success
    ).toBe(false);

    expect(
      paintTransactionParameters.safeParse({
        expected_revision: `sha256:16x16:${"b".repeat(64)}`,
        operations: [
          {
            operation: "fill_rect",
            color: "#FFFFFFFF",
            rect: { x: 0, y: 0, width: 4, height: 4 },
          },
        ],
      }).success
    ).toBe(true);
    expect(
      paintTransactionParameters.safeParse({
        expected_revision: `sha256:16x16:${"b".repeat(64)}`,
        operations: [],
      }).success
    ).toBe(false);
    expect(
      paintTransactionParameters.safeParse({
        operations: [
          {
            operation: "fill_rect",
            color: "#FFFFFFFF",
            rect: { x: 0, y: 0, width: 4, height: 4 },
          },
        ],
      }).success
    ).toBe(false);

    expect(
      createTextureVariantParameters.safeParse({
        type: "variant",
        name: "alternate",
        source_texture_id: "base",
        group: "variants",
      }).success
    ).toBe(true);
    expect(
      createTextureVariantParameters.safeParse({
        type: "variant",
        name: "alternate",
        source_texture_id: "base",
      }).success
    ).toBe(false);
  });

  test("continuation is a bounded local wiring checklist, not another design phase", async () => {
    const continuation = await Bun.file("../docs/knowledge/next-action.md").text();
    for (const marker of [
      "LOCAL_CODE — minor closure only",
      "Do not redesign the contracts",
      "focusedGetTextureParameters",
      "paintTransactionParameters",
      "createTextureVariantParameters",
      "cubeToolInputSchema",
      "inputSchema: cubeToolInputSchema",
      "planBedrockGeometryWrite",
      "NATIVE_MERGE_REQUIRED",
      "bun run docs:build",
      "bun run docs:check",
      "bun run verify:mcp",
    ]) {
      expect(continuation).toContain(marker);
    }
    expect(continuation).toContain("not repair targets");
    expect(continuation.toLowerCase()).toContain("do not create a generic executor/planner");
  });
});
