import { describe, expect, test } from "bun:test";
import {
  configureMaterialParameters,
  hasExactTextureGroupNameCollision,
  requireDistinctPbrChannelAssignments,
  importedTextureGroupName,
  isMinecraftTextureSetDocument,
  requireMaterialConfigSavePostcondition,
} from "@/server/tools/texture";

describe("PBR channel identity preflight", () => {
  test("texture_set import preflight rejects non-texture-set documents and derives native group identity", async () => {
    expect(isMinecraftTextureSetDocument({ "minecraft:texture_set": { color: "skin" } })).toBe(true);
    expect(isMinecraftTextureSetDocument({ format_version: "1.16.100" })).toBe(false);
    expect(isMinecraftTextureSetDocument({ "minecraft:texture_set": null })).toBe(false);
    expect(importedTextureGroupName("/packs/skin.texture_set.json")).toBe("skin.png material");
    expect(importedTextureGroupName("C:\\packs\\skin.texture_set.json")).toBe("skin.png material");

    const source = await Bun.file(new URL("../server/tools/texture.ts", import.meta.url)).text();
    const start = source.indexOf("createTool(textureToolDocs[9].name");
    const end = source.indexOf("createTool(textureToolDocs[10].name", start);
    const block = source.slice(start, end);
    expect(block).toContain("isMinecraftTextureSetDocument(document)");
    expect(block).toContain("hasExactTextureGroupNameCollision(TextureGroup.all, expectedGroupName)");
    expect(block).toContain("createdGroups.length !== 1");
    expect(block.indexOf("isMinecraftTextureSetDocument(document)")).toBeLessThan(block.indexOf("importTextureSet({ path, name: fileName })"));
  });

  test("material config save requires a confirmed native/file postcondition", async () => {
    expect(() => requireMaterialConfigSavePostcondition(true, true, "/tmp/mat.texture_set.json")).not.toThrow();
    expect(() => requireMaterialConfigSavePostcondition(false, true, "/tmp/mat.texture_set.json")).toThrow("save was not confirmed");
    expect(() => requireMaterialConfigSavePostcondition(true, false, "/tmp/mat.texture_set.json")).toThrow("save was not confirmed");

    const source = await Bun.file(new URL("../server/tools/texture.ts", import.meta.url)).text();
    const start = source.indexOf("createTool(textureToolDocs[11].name");
    const end = source.indexOf("createTool(textureToolDocs[12].name", start);
    const block = source.slice(start, end);
    expect(block).toContain("textureGroup.material_config.save()");
    expect(block).toContain("fs.existsSync(filePath)");
    expect(block.indexOf("requireMaterialConfigSavePostcondition")).toBeLessThan(block.indexOf("return `Saved material config"));
  });

  test("TextureGroup creation rejects exact name collisions", async () => {
    expect(hasExactTextureGroupNameCollision([{ name: "body" }], "body")).toBe(true);
    expect(hasExactTextureGroupNameCollision([{ name: "body" }], "Body")).toBe(false);

    const source = await Bun.file(new URL("../server/tools/texture.ts", import.meta.url)).text();
    const addStart = source.indexOf("createTool(textureToolDocs[2].name");
    const addEnd = source.indexOf("createTool(textureToolDocs[3].name", addStart);
    const addBlock = source.slice(addStart, addEnd);
    expect(addBlock.indexOf("hasExactTextureGroupNameCollision")).toBeLessThan(addBlock.indexOf("Undo.initEdit"));

    const pbrStart = source.indexOf("createTool(textureToolDocs[5].name");
    const pbrEnd = source.indexOf("createTool(textureToolDocs[6].name", pbrStart);
    const pbrBlock = source.slice(pbrStart, pbrEnd);
    expect(pbrBlock.indexOf("hasExactTextureGroupNameCollision")).toBeLessThan(pbrBlock.indexOf("Undo.initEdit"));
  });

  test("accepts distinct Texture identities across channels", () => {
    expect(() =>
      requireDistinctPbrChannelAssignments([
        { channel: "color", texture: { uuid: "color-1", name: "Color" } },
        { channel: "normal", texture: { uuid: "normal-1", name: "Normal" } },
        { channel: "mer", texture: { uuid: "mer-1", name: "MER" } },
      ])
    ).not.toThrow();
  });

  test("rejects one Texture identity assigned to multiple channels", () => {
    expect(() =>
      requireDistinctPbrChannelAssignments([
        { channel: "color", texture: { uuid: "shared", name: "Shared" } },
        { channel: "normal", texture: { uuid: "shared", name: "Shared Alias" } },
      ])
    ).toThrow("cannot be assigned to both color and normal");
  });

  test("assign texture channel rejects an exact no-op before Undo", async () => {
    const source = await Bun.file(new URL("../server/tools/texture.ts", import.meta.url)).text();
    const start = source.indexOf("createTool(textureToolDocs[10].name");
    const end = source.indexOf("createTool(textureToolDocs[11].name", start);
    const block = source.slice(start, end);
    expect(block).toContain("tex.group === textureGroup.uuid");
    expect(block).toContain("tex.pbr_channel === channel");
    expect(block).toContain("resetTextures.length === 0");
    expect(block).toContain("no authored change is required");
    expect(block.indexOf("resetTextures.length === 0")).toBeLessThan(block.indexOf("Undo.initEdit"));
  });
  test("rejects configure calls with no authored change", () => {
    expect(configureMaterialParameters.safeParse({ material: "mat-1" }).success).toBe(false);
    expect(
      configureMaterialParameters.safeParse({ material: "mat-1", subsurface_value: 0 }).success
    ).toBe(true);
  });
});
