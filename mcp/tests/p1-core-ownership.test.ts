import { describe, expect, test } from "bun:test";
import { createProjectParameters } from "@/server/tools/project";
import { createAnimationParameters } from "@/server/tools/animation";
import {
  findElementsByCriteriaParameters,
  selectAllOfTypeParameters,
} from "@/server/tools/element";
import {
  addTextureGroupParameters,
  createPbrMaterialParameters,
  createTextureParameters,
} from "@/server/tools/texture";
import { readFile } from "node:fs/promises";
import {
  boneNameSchema,
  cubeIdSchema,
  elementIdSchema,
  textureIdSchema,
} from "@/lib/zodObjects";
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
  test("identity-bearing create tools reject empty names", () => {
    expect(createProjectParameters.safeParse({ name: "" }).success).toBe(false);
    expect(createTextureParameters.safeParse({ name: "" }).success).toBe(false);
    expect(addTextureGroupParameters.safeParse({ name: "" }).success).toBe(false);
    expect(createPbrMaterialParameters.safeParse({ name: "" }).success).toBe(false);
    expect(
      createAnimationParameters.safeParse({ name: "", bones: {} }).success
    ).toBe(false);
  });

  test("authored texture pixel dimensions are integer-valued", () => {
    expect(
      createTextureParameters.safeParse({ name: "skin", width: 16.5, height: 16 }).success
    ).toBe(false);
    expect(
      createTextureParameters.safeParse({ name: "skin", width: 16, height: 32.25 }).success
    ).toBe(false);
    expect(
      createTextureParameters.safeParse({ name: "skin", width: 16, height: 32 }).success
    ).toBe(true);
  });

  test("required explicit references reject the empty string", () => {
    for (const schema of [
      elementIdSchema,
      textureIdSchema,
      boneNameSchema,
      cubeIdSchema,
    ]) {
      expect(schema.safeParse("").success).toBe(false);
      expect(schema.safeParse("target").success).toBe(true);
    }
  });

  test("optional explicit Group scopes reject the empty string", () => {
    expect(findElementsByCriteriaParameters.safeParse({ parent_group: "" }).success).toBe(false);
    expect(findElementsByCriteriaParameters.safeParse({}).success).toBe(true);
    expect(
      selectAllOfTypeParameters.safeParse({ type: "cube", parent_group: "" }).success
    ).toBe(false);
    expect(selectAllOfTypeParameters.safeParse({ type: "cube" }).success).toBe(true);
  });

  test("optional explicit discovery name filters reject empty strings", () => {
    expect(findElementsByCriteriaParameters.safeParse({ name_pattern: "" }).success).toBe(false);
    expect(findElementsByCriteriaParameters.safeParse({ name_contains: "" }).success).toBe(false);
    expect(findElementsByCriteriaParameters.safeParse({ name_pattern: "arm.*" }).success).toBe(true);
    expect(findElementsByCriteriaParameters.safeParse({ name_contains: "arm" }).success).toBe(true);
    expect(findElementsByCriteriaParameters.safeParse({}).success).toBe(true);
  });

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
    const [cubes, elements, texture, animation, materialInstances, util] = await Promise.all([
      readFile(new URL("../server/tools/cubes.ts", import.meta.url), "utf8"),
      readFile(new URL("../server/tools/element.ts", import.meta.url), "utf8"),
      readFile(new URL("../server/tools/texture.ts", import.meta.url), "utf8"),
      readFile(new URL("../server/tools/animation.ts", import.meta.url), "utf8"),
      readFile(new URL("../server/tools/material-instances.ts", import.meta.url), "utf8"),
      readFile(new URL("../lib/util.ts", import.meta.url), "utf8"),
    ]);

    expect(cubes).toContain("resolveCoreCube, resolveCoreGroup");
    expect(cubes).toContain("return resolveCoreGroup(");
    expect(cubes).not.toContain("resolveCoreTexture");
    expect(elements).toContain("resolveCoreGroup, resolveCoreTexture");
    expect(elements).toContain("return resolveCoreTexture(");
    expect(texture).toContain("return resolveCoreCubeOrGroup(");
    expect(texture.match(/resolveCoreTexture\(reference/g)?.length).toBeGreaterThanOrEqual(7);
    expect(animation).toContain("resolveCoreAnimation(reference, {");
    expect(animation).toContain("return resolveCoreGroup(");
    expect(materialInstances).toContain("return resolveCoreCube(");
    expect(materialInstances).not.toContain("findElementOrThrow");
    expect(util).toContain("const texture = resolveCoreTexture(");
    expect(util).not.toContain("export function findGroupOrThrow");
    expect(util).not.toContain("export function findElementOrThrow");
    expect(util).not.toContain("export function findTextureOrThrow");
  });

  test("identity-returning core mutations expose structured continuation state", async () => {
    const [cubes, elements, project] = await Promise.all([
      readFile(new URL("../server/tools/cubes.ts", import.meta.url), "utf8"),
      readFile(new URL("../server/tools/element.ts", import.meta.url), "utf8"),
      readFile(new URL("../server/tools/project.ts", import.meta.url), "utf8"),
    ]);

    expect(cubes).toContain("structuredContent: result");
    expect(cubes).toContain("added: cubes.length");
    expect(cubes).toContain("before,");
    expect(cubes).toContain("after,");
    expect(cubes).toContain("geometry_effect: geometryEffect");
    expect(cubes).not.toContain("cube: after,");
    expect(elements).toContain("structuredContent: result");
    expect(elements).toContain("group: {");
    expect(project).toContain("structuredContent: result");
    expect(project).toContain("currentProjectLifecycle()");
    expect(project).toContain("export_path: Project.export_path ?? null");
    expect(project).toContain("export_codec: Project.export_codec ?? null");
    expect(project).toContain("saved: Project.saved === true");
  });
});
