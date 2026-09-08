import { describe, expect, test } from "bun:test";
import { analyzeTextureMaterialStatus } from "@/lib/textureMaterialStatus";

describe("texture material authoring status", () => {
  test("MER texture plus subsurface is reported as MERS with a pending native save", () => {
    const result = analyzeTextureMaterialStatus({
      uuid: "mat-a",
      name: "Mat A",
      textures: [
        {
          uuid: "color-a",
          name: "asset.png",
          channel: "color",
          width: 128,
          height: 128,
        },
        {
          uuid: "mer-a",
          name: "asset_mer.png",
          channel: "mer",
          width: 128,
          height: 128,
        },
      ],
      color_value: [255, 255, 255, 255],
      mer_value: [0, 0, 0],
      subsurface_value: 1,
      saved: false,
      file_path: "/pack/textures/entity/asset.texture_set.json",
    });

    expect(result.sources.surface).toMatchObject({
      mode: "mers_texture",
      alpha_carries_subsurface: true,
    });
    expect(result.readiness.preview.state).toBe("ready");
    expect(result.readiness.save.state).toBe("pending");
    expect(result.next_actions).toContain("save_material_config");
  });

  test("normal and height together remain an explicit material conflict", () => {
    const result = analyzeTextureMaterialStatus({
      uuid: "mat-conflict",
      name: "Mat Conflict",
      textures: [
        { uuid: "n", name: "n.png", channel: "normal", width: 128, height: 128 },
        { uuid: "h", name: "h.png", channel: "height", width: 128, height: 128 },
      ],
      color_value: [255, 255, 255, 255],
      mer_value: [0, 0, 0],
      saved: false,
    });

    expect(result.readiness.preview.state).toBe("review_required");
    expect(result.readiness.preview.reasons).toContain("NORMAL_HEIGHT_CONFLICT");
    expect(result.next_actions).toContain("resolve_channel_conflicts");
  });

  test("uniform-only material can preview while save target remains unavailable", () => {
    const result = analyzeTextureMaterialStatus({
      uuid: "mat-uniform",
      name: "Mat Uniform",
      textures: [],
      color_value: [80, 90, 100, 255],
      mer_value: [0, 0, 180],
      subsurface_value: 0,
      saved: false,
      file_path: "",
    });

    expect(result.sources.color.mode).toBe("uniform");
    expect(result.sources.surface.mode).toBe("mer_uniform");
    expect(result.readiness.preview.state).toBe("ready");
    expect(result.readiness.save.state).toBe("path_unavailable");
    expect(result.next_actions).toContain("establish_color_texture_file_path");
  });
});
