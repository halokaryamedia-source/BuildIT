import { describe, expect, test } from "bun:test";
import {
  planExclusivePbrMaterialAssignment,
  requireExclusivePbrMaterialState,
  type PbrMaterialTextureState,
} from "@/lib/pbrMaterialMembership";

const baseStates = (): PbrMaterialTextureState[] => [
  { uuid: "color-a", group: "mat-a", pbr_channel: "color" },
  { uuid: "normal-a", group: "mat-a", pbr_channel: "normal" },
  { uuid: "color-b", group: "mat-b", pbr_channel: "color" },
];

describe("PBR material membership planning", () => {
  test("replaces one channel by detaching the previous member", () => {
    const plan = planExclusivePbrMaterialAssignment(
      baseStates(),
      "mat-a",
      "color-b",
      "color",
      "Material fixture"
    );

    expect(plan.changes).toContainEqual({
      uuid: "color-a",
      group: "",
      pbr_channel: "color",
    });
    expect(plan.changes).toContainEqual({
      uuid: "color-b",
      group: "mat-a",
      pbr_channel: "color",
    });
    expect(plan.affected_group_uuids).toEqual(["mat-a", "mat-b"]);
  });

  test("normal assignment supersedes an existing height source", () => {
    const states: PbrMaterialTextureState[] = [
      { uuid: "height-a", group: "mat-a", pbr_channel: "height" },
      { uuid: "normal-b", group: "", pbr_channel: "normal" },
    ];
    const plan = planExclusivePbrMaterialAssignment(
      states,
      "mat-a",
      "normal-b",
      "normal",
      "Material fixture"
    );

    expect(plan.changes).toContainEqual({
      uuid: "height-a",
      group: "",
      pbr_channel: "height",
    });
    expect(plan.changes).toContainEqual({
      uuid: "normal-b",
      group: "mat-a",
      pbr_channel: "normal",
    });
  });

  test("height assignment supersedes an existing normal source", () => {
    const states: PbrMaterialTextureState[] = [
      { uuid: "normal-a", group: "mat-a", pbr_channel: "normal" },
      { uuid: "height-b", group: "", pbr_channel: "height" },
    ];
    const plan = planExclusivePbrMaterialAssignment(
      states,
      "mat-a",
      "height-b",
      "height",
      "Material fixture"
    );

    expect(plan.changes).toContainEqual({
      uuid: "normal-a",
      group: "",
      pbr_channel: "normal",
    });
    expect(plan.changes).toContainEqual({
      uuid: "height-b",
      group: "mat-a",
      pbr_channel: "height",
    });
  });

  test("returns no mutation when the assignment is already exclusive", () => {
    const plan = planExclusivePbrMaterialAssignment(
      baseStates(),
      "mat-a",
      "normal-a",
      "normal",
      "Material fixture"
    );
    expect(plan.changes).toEqual([]);
  });

  test("rejects duplicate texture identities and invalid material state", () => {
    expect(() =>
      planExclusivePbrMaterialAssignment(
        [
          { uuid: "same", group: "mat-a", pbr_channel: "color" },
          { uuid: "same", group: "mat-b", pbr_channel: "normal" },
        ],
        "mat-a",
        "same",
        "color",
        "Material fixture"
      )
    ).toThrow();

    expect(() =>
      requireExclusivePbrMaterialState(
        [
          { uuid: "n", group: "mat-a", pbr_channel: "normal" },
          { uuid: "h", group: "mat-a", pbr_channel: "height" },
        ],
        "mat-a",
        "Material fixture"
      )
    ).toThrow();
  });
});
