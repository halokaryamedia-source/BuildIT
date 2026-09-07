import { describe, expect, test } from "bun:test";
import {
  buildTextureEvidenceSnapshot,
  cropTextureRgba,
  focusedGetTextureParameters,
  textureEvidenceRegionToLogicalUv,
} from "@/lib/textureEvidence";
import {
  applyPaintTransactionRgba,
  paintTransactionParameters,
  planPaintTransaction,
} from "@/lib/paintTransaction";
import {
  createTextureVariantParameters,
  planTextureVariantFromBase,
} from "@/lib/textureVariantPlan";
import {
  analyzeBedrockGeometryOverwrite,
  bedrockAnimationIdentifiers,
  missingRequestedDeliverables,
  requireExpectedGeometryIdentifier,
} from "@/lib/bedrockExportIntegrity";
import { cubeToolDocs } from "@/server/tools/cubes";

describe("REMOTE_GITHUB authoring residue preparation", () => {
  test("focused texture evidence crops RGBA and binds evidence to a full texture revision", async () => {
    const pixels = new Uint8ClampedArray(Array.from({ length: 48 }, (_, index) => index));
    const full = await buildTextureEvidenceSnapshot(pixels, 4, 3);
    expect(full.inspection).toBe("full_atlas");
    expect(full.revision).toMatch(/^sha256:4x3:[0-9a-f]{64}$/);

    const focused = await buildTextureEvidenceSnapshot(pixels, 4, 3, {
      region: { x: 1, y: 1, width: 2, height: 1 },
      expected_revision: full.revision,
    });
    expect(focused.inspection).toBe("region");
    expect(focused.region).toEqual({ x: 1, y: 1, width: 2, height: 1 });
    expect(Array.from(focused.rgba)).toEqual([20, 21, 22, 23, 24, 25, 26, 27]);
    expect(
      Array.from(cropTextureRgba(pixels, 4, 3, { x: 1, y: 1, width: 2, height: 1 }))
    ).toEqual(Array.from(focused.rgba));
    expect(
      textureEvidenceRegionToLogicalUv(
        { x: 1, y: 1, width: 2, height: 1 },
        4,
        2,
        128,
        64
      )
    ).toEqual([32, 32, 96, 64]);

    expect(
      focusedGetTextureParameters.safeParse({
        texture: "base-texture",
        region: { x: 0, y: 0, width: 2, height: 2 },
        expected_revision: full.revision,
      }).success
    ).toBe(true);

    await expect(
      buildTextureEvidenceSnapshot(pixels, 4, 3, {
        expected_revision: `sha256:4x3:${"0".repeat(64)}`,
      })
    ).rejects.toThrow("changed since the caller observed it");
  });

  test("paint transaction preflights every operation and produces an atomic RGBA candidate", () => {
    const source = new Uint8ClampedArray(4 * 4 * 4);
    const operations = [
      {
        operation: "fill_rect" as const,
        color: "#FF0000",
        rect: { x: 0, y: 0, width: 2, height: 2 },
      },
      {
        operation: "set_pixels" as const,
        color: "#00FF00",
        coordinates: [{ x: 3, y: 3 }],
      },
      {
        operation: "erase_pixels" as const,
        coordinates: [{ x: 1, y: 1 }],
      },
    ];

    const plan = planPaintTransaction(operations, 4, 4);
    expect(plan.operation_count).toBe(3);
    expect(plan.pixel_writes).toBe(6);
    expect(plan.affected_rect).toEqual([0, 0, 4, 4]);

    const applied = applyPaintTransactionRgba(source, 4, 4, operations);
    const pixel = (x: number, y: number) =>
      Array.from(applied.pixels.slice((y * 4 + x) * 4, (y * 4 + x + 1) * 4));
    expect(pixel(0, 0)).toEqual([255, 0, 0, 255]);
    expect(pixel(1, 1)).toEqual([0, 0, 0, 0]);
    expect(pixel(3, 3)).toEqual([0, 255, 0, 255]);
    expect(Array.from(source)).toEqual(new Array(source.length).fill(0));

    expect(() =>
      applyPaintTransactionRgba(source, 4, 4, [
        operations[0],
        {
          operation: "set_pixels",
          color: "#FFFFFF",
          coordinates: [{ x: 99, y: 0 }],
        },
      ])
    ).toThrow("outside bitmap bounds");

    expect(
      paintTransactionParameters.safeParse({
        expected_revision: `sha256:4x4:${"a".repeat(64)}`,
        operations,
      }).success
    ).toBe(true);
  });

  test("variant-from-base plan preserves the sole production base role", () => {
    expect(
      createTextureVariantParameters.safeParse({
        type: "variant",
        name: "muria",
        source_texture_id: "base-1",
        group: "variant-group",
      }).success
    ).toBe(true);

    const base = {
      uuid: "base-1",
      name: "base",
      width: 256,
      height: 256,
      role: "base_color_candidate" as const,
    };
    const group = { uuid: "variants", name: "variants", is_material: false };
    const plan = planTextureVariantFromBase({
      source: base,
      base_color_candidates: [base],
      target_group: group,
      requested_name: "muria",
      existing_texture_names: ["base"],
    });
    expect(plan.preserves_base_role).toBe(true);
    expect(plan.resulting_role).toBe("explicit_variant");
    expect(plan.bitmap).toEqual({ width: 256, height: 256 });

    expect(() =>
      planTextureVariantFromBase({
        source: base,
        base_color_candidates: [base, { ...base, uuid: "base-2" }],
        target_group: group,
        requested_name: "muria",
        existing_texture_names: ["base"],
      })
    ).toThrow("exactly one established base-color atlas");

    expect(() =>
      planTextureVariantFromBase({
        source: base,
        base_color_candidates: [base],
        target_group: { ...group, is_material: true },
        requested_name: "muria",
        existing_texture_names: ["base"],
      })
    ).toThrow("non-material TextureGroup");
  });

  test("Bedrock export integrity distinguishes safe single-owner replacement from native merge", () => {
    const single = {
      "minecraft:geometry": [
        { description: { identifier: "geometry.blockit_fixture" }, bones: [] },
      ],
    };
    const multi = {
      "minecraft:geometry": [
        { description: { identifier: "geometry.blockit_fixture" }, bones: [] },
        { description: { identifier: "geometry.other" }, bones: [] },
      ],
    };

    expect(
      analyzeBedrockGeometryOverwrite(single, "geometry.blockit_fixture")
        .safe_single_model_replace
    ).toBe(true);
    const multiAnalysis = analyzeBedrockGeometryOverwrite(
      multi,
      "geometry.blockit_fixture"
    );
    expect(multiAnalysis.safe_single_model_replace).toBe(false);
    expect(multiAnalysis.requires_native_merge).toBe(true);

    expect(() =>
      requireExpectedGeometryIdentifier(
        {
          "minecraft:geometry": [
            { description: { identifier: "geometry.unknown" }, bones: [] },
          ],
        },
        "geometry.blockit_fixture"
      )
    ).toThrow();

    expect(
      bedrockAnimationIdentifiers({
        animations: {
          "animation.fixture.idle": {},
          "animation.fixture.walk": {},
        },
      })
    ).toEqual(["animation.fixture.idle", "animation.fixture.walk"]);
    expect(
      missingRequestedDeliverables(
        ["model.bbmodel", "model.geo.json", "model.animation.json"],
        ["model.bbmodel", "model.geo.json"]
      )
    ).toEqual(["model.animation.json"]);
  });

  test("manage_cubes canonical ToolSpec already contains the detailed registration contract", () => {
    const schema = cubeToolDocs[0].parameters;
    expect(
      schema.safeParse({
        operation: "create",
        elements: [{ name: "body", from: [0, 0, 0], to: [4, 4, 4] }],
      }).success
    ).toBe(true);
    expect(
      schema.safeParse({
        operation: "create",
        elements: [
          {
            name: "rotated",
            from: [0, 0, 0],
            to: [4, 4, 4],
            rotation: [0, 45, 0],
          },
        ],
      }).success
    ).toBe(false);
    expect(
      schema.safeParse({
        operation: "batch_update",
        updates: [{ id: "cube-uuid", from: [0, 0, 0], to: [2, 2, 2] }],
      }).success
    ).toBe(true);
  });
});
