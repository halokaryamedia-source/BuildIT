import { describe, expect, test } from "bun:test";
import {
  cubeToolDocs,
  modifyCubeParameters,
  modifyCubesBatchParameters,
  placeCubeParameters,
  simplifyCubesParameters,
} from "@/server/tools/cubes";

const manageCubes = cubeToolDocs.find((tool) => tool.name === "manage_cubes");

describe("manage_cubes zero-loss contract", () => {
  test("retains all four authored operations", () => {
    expect(manageCubes).toBeDefined();
    const schema = manageCubes!.parameters;

    expect(schema.safeParse({ operation: "create", elements: [{ name: "c", from: [0,0,0], to: [1,1,1] }] }).success)
      .toBe(placeCubeParameters.safeParse({ elements: [{ name: "c", from: [0,0,0], to: [1,1,1] }] }).success);
    expect(schema.safeParse({ operation: "update", id: "cube", visibility: true }).success)
      .toBe(modifyCubeParameters.safeParse({ id: "cube", visibility: true }).success);
    expect(schema.safeParse({ operation: "batch_update", updates: [{ id: "cube", visibility: true }] }).success)
      .toBe(modifyCubesBatchParameters.safeParse({ updates: [{ id: "cube", visibility: true }] }).success);
    expect(schema.safeParse({ operation: "simplify", ids: ["cube"], increment: 1, fields: ["bounds"] }).success)
      .toBe(simplifyCubesParameters.safeParse({ ids: ["cube"], increment: 1, fields: ["bounds"] }).success);
  });

  test("rejects unknown operation instead of falling through", () => {
    expect(manageCubes!.parameters.safeParse({ operation: "unknown" }).success).toBe(false);
  });
});
