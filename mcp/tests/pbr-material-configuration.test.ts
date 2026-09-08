import { describe, expect, test } from "bun:test";
import {
  planPbrMaterialConfiguration,
  type PbrMaterialTextureState,
} from "@/lib/pbrMaterialMembership";

describe("PBR coherent material configuration planning", () => {
  test("one configure operation clears replaced color/depth members and preserves independent MER", () => {
    const states: PbrMaterialTextureState[] = [
      { uuid: "color-a", group: "mat-a", pbr_channel: "color" },
      { uuid: "normal-a", group: "mat-a", pbr_channel: "normal" },
      { uuid: "mer-a", group: "mat-a", pbr_channel: "mer" },
      { uuid: "color-b", group: "", pbr_channel: "color" },
      { uuid: "height-b", group: "", pbr_channel: "height" },
    ];
    const plan = planPbrMaterialConfiguration(
      states,
      "mat-a",
      [
        { channel: "color", texture_uuid: "color-b" },
        { channel: "normal", texture_uuid: null },
        { channel: "height", texture_uuid: "height-b" },
      ],
      "Material fixture"
    );

    expect(plan.changes).toEqual(
      expect.arrayContaining([
        { uuid: "color-a", group: "", pbr_channel: "color" },
        { uuid: "normal-a", group: "", pbr_channel: "normal" },
        { uuid: "color-b", group: "mat-a", pbr_channel: "color" },
        { uuid: "height-b", group: "mat-a", pbr_channel: "height" },
      ])
    );
    expect(plan.changes).not.toContainEqual(
      expect.objectContaining({ uuid: "mer-a" })
    );
  });

  test("same incoming texture cannot be assigned to two semantic channels", () => {
    expect(() =>
      planPbrMaterialConfiguration(
        [{ uuid: "shared", group: "", pbr_channel: "normal" }],
        "mat-a",
        [
          { channel: "normal", texture_uuid: "shared" },
          { channel: "mer", texture_uuid: "shared" },
        ],
        "Material fixture"
      )
    ).toThrow("cannot assign texture shared to both");
  });

  test("normal and height cannot be simultaneously authored into one material", () => {
    expect(() =>
      planPbrMaterialConfiguration(
        [
          { uuid: "normal", group: "", pbr_channel: "normal" },
          { uuid: "height", group: "", pbr_channel: "height" },
        ],
        "mat-a",
        [
          { channel: "normal", texture_uuid: "normal" },
          { channel: "height", texture_uuid: "height" },
        ],
        "Material fixture"
      )
    ).toThrow("cannot assign both normal and height");
  });

  test("configuration remains a no-op when final membership already matches", () => {
    const plan = planPbrMaterialConfiguration(
      [
        { uuid: "color", group: "mat-a", pbr_channel: "color" },
        { uuid: "normal", group: "mat-a", pbr_channel: "normal" },
      ],
      "mat-a",
      [{ channel: "normal", texture_uuid: "normal" }],
      "Material fixture"
    );
    expect(plan.changes).toEqual([]);
  });
});
