import { describe, expect, test } from "bun:test";
import { readFile } from "node:fs/promises";
import {
  resolveTextureIdentity,
  resolveUuidOrUniqueName,
} from "@/lib/coreIdentity";

type Item = { uuid: string; name: string };
type TextureItem = Item & { id: string };

const options = {
  kind: "Cube",
  notFoundHint: "Inspect first.",
};

describe("P1.3 core identity ownership", () => {
  test("UUID wins before exact unique name and names never prefix-match", () => {
    const items: Item[] = [
      { uuid: "cube-1", name: "arm" },
      { uuid: "cube-2", name: "cube-1" },
      { uuid: "cube-3", name: "arm_long" },
    ];

    expect(resolveUuidOrUniqueName(items, "cube-1", options)).toEqual(items[0]);
    expect(resolveUuidOrUniqueName(items, "arm_long", options)).toEqual(items[2]);
    expect(() => resolveUuidOrUniqueName(items, "arm_", options)).toThrow(
      'Cube "arm_" not found.'
    );
  });

  test("ambiguous exact names fail instead of selecting the first item", () => {
    const items: Item[] = [
      { uuid: "a", name: "leg" },
      { uuid: "b", name: "leg" },
    ];

    expect(() => resolveUuidOrUniqueName(items, "leg", options)).toThrow(
      'Cube name "leg" is ambiguous.'
    );
  });

  test("texture identity is UUID then unique ID then unique name", () => {
    const textures: TextureItem[] = [
      { uuid: "tex-u1", id: "albedo", name: "Stone" },
      { uuid: "tex-u2", id: "normal", name: "Normal" },
      { uuid: "tex-u3", id: "tex-u1", name: "Other" },
    ];

    expect(resolveTextureIdentity(textures, "tex-u1", "List textures.")).toEqual(
      textures[0]
    );
    expect(resolveTextureIdentity(textures, "normal", "List textures.")).toEqual(
      textures[1]
    );
    expect(resolveTextureIdentity(textures, "Other", "List textures.")).toEqual(
      textures[2]
    );
  });

  test("ambiguous texture IDs and names fail deterministically", () => {
    const textures: TextureItem[] = [
      { uuid: "a", id: "shared", name: "Stone" },
      { uuid: "b", id: "shared", name: "Stone" },
    ];

    expect(() => resolveTextureIdentity(textures, "shared", "List textures.")).toThrow(
      'Texture ID "shared" is ambiguous.'
    );
    expect(() => resolveTextureIdentity(textures, "Stone", "List textures.")).toThrow(
      'Texture name "Stone" is ambiguous.'
    );
  });

  test("retained core callers consume shared identity ownership", async () => {
    const [cubes, elements, texture, animation, util] = await Promise.all([
      readFile(new URL("../server/tools/cubes.ts", import.meta.url), "utf8"),
      readFile(new URL("../server/tools/element.ts", import.meta.url), "utf8"),
      readFile(new URL("../server/tools/texture.ts", import.meta.url), "utf8"),
      readFile(new URL("../server/tools/animation.ts", import.meta.url), "utf8"),
      readFile(new URL("../lib/util.ts", import.meta.url), "utf8"),
    ]);

    expect(cubes).toContain("resolveCoreCube, resolveCoreGroup, resolveCoreTexture");
    expect(cubes).toContain("return resolveCoreGroup(");
    expect(cubes).toContain("return resolveCoreTexture(");
    expect(elements).toContain("resolveCoreGroup, resolveCoreTexture");
    expect(elements).toContain("return resolveCoreTexture(");
    expect(texture).toContain("return resolveCoreCubeOrGroup(");
    expect(texture.match(/resolveCoreTexture\(reference/g)?.length).toBeGreaterThanOrEqual(7);
    expect(animation).toContain("resolveCoreAnimation(reference, {");
    expect(animation).toContain("return resolveCoreGroup(");
    expect(util).toContain("const texture = resolveCoreTexture(");
  });

  test("identity-returning core mutations expose structured continuation state", async () => {
    const [cubes, elements] = await Promise.all([
      readFile(new URL("../server/tools/cubes.ts", import.meta.url), "utf8"),
      readFile(new URL("../server/tools/element.ts", import.meta.url), "utf8"),
    ]);

    expect(cubes).toContain("structuredContent: result");
    expect(cubes).toContain("added: cubes.length");
    expect(cubes).toContain("before,");
    expect(cubes).toContain("after,");
    expect(cubes).toContain("geometry_effect: geometryEffect");
    expect(cubes).not.toContain("cube: after,");
    expect(elements).toContain("structuredContent: result");
    expect(elements).toContain("group: {");
  });
});
