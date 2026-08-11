import { describe, expect, test } from "bun:test";
import {
  configureMaterialParameters,
  hasExactTextureGroupNameCollision,
  requireDistinctPbrChannelAssignments,
} from "@/server/tools/texture";

describe("PBR channel identity preflight", () => {
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

  test("rejects configure calls with no authored change", () => {
    expect(configureMaterialParameters.safeParse({ material: "mat-1" }).success).toBe(false);
    expect(
      configureMaterialParameters.safeParse({ material: "mat-1", subsurface_value: 0 }).success
    ).toBe(true);
  });
});
