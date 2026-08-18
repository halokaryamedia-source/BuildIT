import { describe, expect, test } from "bun:test";
import {
  buildUvAtlasAudit,
  classifyTextureProductionRole,
  isAiProductionColorCanvas,
} from "@/server/tools/texture";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("texture atlas integrity", () => {
  test("AI color canvas standard is square and 128-based", () => {
    for (const size of [128, 256, 384, 512, 1024]) {
      expect(isAiProductionColorCanvas(size, size)).toBe(true);
    }

    for (const [width, height] of [
      [16, 16],
      [64, 64],
      [128, 256],
      [192, 192],
      [256, 128],
    ]) {
      expect(isAiProductionColorCanvas(width, height)).toBe(false);
    }
  });

  test("texture roles distinguish base color, explicit variants, and PBR support", () => {
    expect(
      classifyTextureProductionRole({
        pbr_channel: "color",
        has_group: false,
      })
    ).toBe("base_color_candidate");

    expect(
      classifyTextureProductionRole({
        pbr_channel: "color",
        has_group: true,
        group_is_material: true,
      })
    ).toBe("base_color_candidate");

    expect(
      classifyTextureProductionRole({
        pbr_channel: "color",
        has_group: true,
        group_is_material: false,
      })
    ).toBe("explicit_variant");

    for (const pbr_channel of ["normal", "height", "mer"]) {
      expect(
        classifyTextureProductionRole({
          pbr_channel,
          has_group: true,
          group_is_material: true,
        })
      ).toBe("pbr_support");
    }
  });

  test("global UV audit allows exact reuse but reports partial overlap and unstable UV", () => {
    const exactReuse = buildUvAtlasAudit(
      [
        {
          cube_uuid: "left",
          cube_name: "left_arm",
          face: "north",
          uv: [0, 0, 8, 8],
          box_uv: true,
          autouv: 0,
          mirror_uv: false,
          face_rotation: 0,
        },
        {
          cube_uuid: "right",
          cube_name: "right_arm",
          face: "north",
          uv: [0, 0, 8, 8],
          box_uv: true,
          autouv: 0,
          mirror_uv: true,
          face_rotation: 0,
        },
      ],
      128,
      128
    );

    expect(exactReuse.state).toBe("available");
    if (exactReuse.state !== "available") throw new Error("expected available audit");
    expect(exactReuse.exact_reuse.region_count).toBe(1);
    expect(exactReuse.partial_overlap.pair_count).toBe(0);
    expect(exactReuse.production_gate.state).toBe("ready");

    const review = buildUvAtlasAudit(
      [
        {
          cube_uuid: "a",
          cube_name: "a",
          face: "north",
          uv: [0, 0, 8, 8],
          box_uv: true,
          autouv: 1,
          mirror_uv: false,
          face_rotation: 0,
        },
        {
          cube_uuid: "b",
          cube_name: "b",
          face: "north",
          uv: [4, 4, 12, 12],
          box_uv: true,
          autouv: 0,
          mirror_uv: false,
          face_rotation: 0,
        },
        {
          cube_uuid: "c",
          cube_name: "c",
          face: "north",
          uv: [120, 120, 132, 132],
          box_uv: true,
          autouv: 0,
          mirror_uv: false,
          face_rotation: 0,
        },
        {
          cube_uuid: "d",
          cube_name: "d",
          face: "north",
          uv: [20.5, 20, 28.5, 28],
          box_uv: true,
          autouv: 0,
          mirror_uv: false,
          face_rotation: 0,
        },
      ],
      128,
      128
    );

    expect(review.state).toBe("available");
    if (review.state !== "available") throw new Error("expected available audit");
    expect(review.unlocked_box_uv_cubes.count).toBe(1);
    expect(review.out_of_bounds.count).toBe(1);
    expect(review.fractional_uv.count).toBe(1);
    expect(review.partial_overlap.pair_count).toBeGreaterThan(0);
    expect(review.production_gate.state).toBe("review_required");
    for (const reason of [
      "OUT_OF_BOUNDS",
      "FRACTIONAL_UV",
      "BOX_UV_AUTOUV_UNLOCKED",
      "PARTIAL_OVERLAP",
    ]) {
      expect(review.production_gate.reasons).toContain(reason);
    }
  });

  test("texture creation preflight runs before Undo and prevents atlas fragmentation", async () => {
    const texture = await source("server/tools/texture.ts");
    const start = texture.indexOf("createTool(textureToolDocs[0].name");
    const end = texture.indexOf("createTool(textureToolDocs[1].name", start);
    const createBlock = texture.slice(start, end);

    expect(createBlock.indexOf("requireTextureCreationPreflight")).toBeGreaterThanOrEqual(0);
    expect(createBlock.indexOf("Undo.initEdit")).toBeGreaterThan(
      createBlock.indexOf("requireTextureCreationPreflight")
    );

    for (const invariant of [
      "base-color atlas already exists",
      "square 128-based canvas",
      "explicit non-material TextureGroup",
      "PBR support textures require an explicit material TextureGroup",
      "match the base atlas bitmap size",
    ]) {
      expect(texture).toContain(invariant);
    }
  });

  test("list_textures exposes atlas inventory and global UV gate without a new tool", async () => {
    const texture = await source("server/tools/texture.ts");
    const start = texture.indexOf("createTool(textureToolDocs[3].name");
    const end = texture.indexOf("createTool(textureToolDocs[4].name", start);
    const listBlock = texture.slice(start, end);

    for (const marker of [
      "currentTextureInventory()",
      "buildUvAtlasAudit(",
      "atlas_state:",
      "uv_audit:",
      "structuredContent: result",
      "base-color atlas state",
      "UV atlas gate",
    ]) {
      expect(listBlock).toContain(marker);
    }

    for (const auditMarker of [
      "invalid_uv",
      "out_of_bounds",
      "fractional_uv",
      "unlocked_box_uv_cubes",
      "exact_reuse",
      "partial_overlap",
      "production_gate",
    ]) {
      expect(texture).toContain(auditMarker);
    }
  });

  test("painting requires explicit texture identity when multiple textures are loaded", async () => {
    const util = await source("lib/util.ts");
    expect(util).toContain("available.length > 1");
    expect(util).toContain("Pass texture_id explicitly");
    expect(util).toContain("implicit selected/default state");
    expect(util).toContain("resolveCoreTexture(");
  });

  test("full-atlas image evidence is explicit in multi-texture state and returns density metadata", async () => {
    const texture = await source("server/tools/texture.ts");
    const start = texture.indexOf("createTool(textureToolDocs[4].name");
    const end = texture.indexOf("createTool(textureToolDocs[5].name", start);
    const block = texture.slice(start, end);

    expect(block).toContain("available.length > 1");
    expect(block).toContain("Pass texture explicitly");
    expect(block).toContain("implicit default state");
    expect(block).toContain('inspection: "full_atlas"');
    expect(block).toContain("textureInventoryEntry(image)");
    expect(block).toContain("imageContent({ url: image.getDataURL() })");
    expect(texture).toContain("physical_pixels_per_uv_unit");
  });
});
