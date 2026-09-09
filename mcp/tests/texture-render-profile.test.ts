import { describe, expect, test } from "bun:test";
import {
  inspectEntityRenderMaterialCode,
  minecraftMaterialCodeForRenderProfile,
} from "../lib/textureRenderProfile";

describe("Minecraft entity render profile semantics", () => {
  test("separates cutout from translucent alpha behavior", () => {
    const cutout = inspectEntityRenderMaterialCode("entity_alphatest");
    const translucent = inspectEntityRenderMaterialCode("entity_alphablend");

    expect(cutout.domain).toBe("minecraft_entity_render_material");
    expect(cutout.render_profile).toBe("cutout");
    expect(cutout.alpha_semantics).toBe("cutout_opacity");
    expect(translucent.render_profile).toBe("translucent");
    expect(translucent.alpha_semantics).toBe("blended_opacity");
  });

  test("emissive alpha is not misclassified as ordinary transparency", () => {
    const emissive = inspectEntityRenderMaterialCode("entity_emissive");
    const emissiveBlend = inspectEntityRenderMaterialCode("entity_emissive_alpha");

    expect(emissive.render_profile).toBe("emissive_mask");
    expect(emissive.alpha_semantics).toBe("emissive_mask");
    expect(emissive.texture_format).toBe("tga_required");
    expect(emissiveBlend.alpha_semantics).toBe("emissive_and_translucent");
    expect(emissiveBlend.culling).toBe("disabled");
  });

  test("layered emissive and color-mask semantics stay distinct", () => {
    const layered = inspectEntityRenderMaterialCode("entity_emissive_layer");
    const colorMask = inspectEntityRenderMaterialCode("entity_change_color");

    expect(layered.render_profile).toBe("emissive_layer");
    expect(layered.texture_format).toBe("layered_png_required");
    expect(colorMask.render_profile).toBe("color_mask");
    expect(colorMask.alpha_semantics).toBe("color_mask");
  });

  test("unknown custom material codes remain explicit and unverified", () => {
    const custom = inspectEntityRenderMaterialCode("my_pack:custom_glow");

    expect(custom.render_profile).toBe("custom");
    expect(custom.minecraft_material_code).toBe("my_pack:custom_glow");
    expect(custom.alpha_semantics).toBe("unknown_custom");
    expect(custom.verification).toBe("unverified_custom");
  });

  test("canonical profile intent maps back to Vanilla codes without aliases", () => {
    expect(minecraftMaterialCodeForRenderProfile("opaque")).toBe("entity");
    expect(minecraftMaterialCodeForRenderProfile("cutout")).toBe("entity_alphatest");
    expect(minecraftMaterialCodeForRenderProfile("translucent")).toBe("entity_alphablend");
    expect(minecraftMaterialCodeForRenderProfile("emissive_mask")).toBe("entity_emissive");
    expect(() => minecraftMaterialCodeForRenderProfile("custom")).toThrow();
    expect(minecraftMaterialCodeForRenderProfile("custom", "custom:material")).toBe("custom:material");
  });
});
