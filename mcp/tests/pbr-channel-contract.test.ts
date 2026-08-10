import { describe, expect, test } from "bun:test";
import { configureMaterialParameters, requireDistinctPbrChannelAssignments } from "@/server/tools/texture";

describe("PBR channel identity preflight", () => {
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
