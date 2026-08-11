import { describe, expect, test } from "bun:test";
import {
  animationCopyPasteParameters,
  animationTimelineParameters,
  batchKeyframeOperationsParameters,
  boneRiggingParameters,
  countAnimationClipboardKeyframes,
  deriveMirroredRigName,
  hasCaseInsensitiveRigNameCollision,
  manageKeyframesParameters,
  wouldCreateRigHierarchyCycle,
} from "@/server/tools/animation";

describe("animation mutation contract", () => {
  test("manage_keyframes rejects an empty target list", () => {
    const result = manageKeyframesParameters.safeParse({
      action: "create",
      bone_name: "root",
      channel: "rotation",
      keyframes: [],
    });
    expect(result.success).toBe(false);
  });

  test("timeline loop requires an explicit loop mode", () => {
    expect(animationTimelineParameters.safeParse({ action: "loop" }).success).toBe(false);
    expect(
      animationTimelineParameters.safeParse({ action: "loop", loop_mode: "loop" }).success
    ).toBe(true);
  });

  test("batch operations reject incomplete or effective no-op requests", () => {
    expect(
      batchKeyframeOperationsParameters.safeParse({ operation: "offset" }).success
    ).toBe(false);
    expect(
      batchKeyframeOperationsParameters.safeParse({
        operation: "offset",
        parameters: { offset_time: 0, offset_values: [0, 0, 0] },
      }).success
    ).toBe(false);
    expect(
      batchKeyframeOperationsParameters.safeParse({
        operation: "offset",
        parameters: { offset_time: 0.25 },
      }).success
    ).toBe(true);
    expect(
      batchKeyframeOperationsParameters.safeParse({ operation: "scale" }).success
    ).toBe(false);
    expect(
      batchKeyframeOperationsParameters.safeParse({
        operation: "scale",
        parameters: { scale_factor: 1 },
      }).success
    ).toBe(false);
    expect(
      batchKeyframeOperationsParameters.safeParse({
        operation: "scale",
        parameters: { scale_factor: 1.5 },
      }).success
    ).toBe(true);
    expect(
      batchKeyframeOperationsParameters.safeParse({
        selection: "range",
        operation: "reverse",
      }).success
    ).toBe(false);
    expect(
      batchKeyframeOperationsParameters.safeParse({
        selection: "pattern",
        operation: "reverse",
      }).success
    ).toBe(false);
  });

  test("copy/paste contract rejects empty channel intent and detects empty clipboard data", () => {
    expect(
      animationCopyPasteParameters.safeParse({
        action: "copy",
        source: { bone: "root", channels: [] },
      }).success
    ).toBe(false);
    expect(
      animationCopyPasteParameters.safeParse({
        action: "paste",
        target: { bone: "root", time_offset: Infinity },
      }).success
    ).toBe(false);
    expect(countAnimationClipboardKeyframes({})).toBe(0);
    expect(countAnimationClipboardKeyframes({ rotation: [], position: [] })).toBe(0);
    expect(countAnimationClipboardKeyframes({ rotation: [{ time: 0 }] })).toBe(1);
  });

  test("set_ik rejects empty updates while allowing target-only state preservation", async () => {
    expect(
      boneRiggingParameters.safeParse({
        action: "set_ik",
        bone_data: { name: "arm" },
      }).success
    ).toBe(false);
    expect(
      boneRiggingParameters.safeParse({
        action: "set_ik",
        bone_data: { name: "arm", ik_target: "hand_target" },
      }).success
    ).toBe(true);
    expect(
      boneRiggingParameters.safeParse({
        action: "set_ik",
        bone_data: { name: "arm", ik_enabled: false },
      }).success
    ).toBe(true);

    const source = await Bun.file("server/tools/animation.ts").text();
    expect(source).toContain("if (bone_data.ik_enabled !== undefined)");
    expect(source).not.toContain("bone_data.ik_enabled ?? false");
  });

  test("rig parent preflight rejects self, descendant, and already-cyclic parent chains", () => {
    const hierarchy = new Map<string, string | null>([
      ["root-bone", null],
      ["mid-bone", "root-bone"],
      ["leaf-bone", "mid-bone"],
    ]);
    expect(
      wouldCreateRigHierarchyCycle("root-bone", "root-bone", hierarchy)
    ).toBe(true);
    expect(
      wouldCreateRigHierarchyCycle("root-bone", "leaf-bone", hierarchy)
    ).toBe(true);
    expect(
      wouldCreateRigHierarchyCycle("leaf-bone", "root-bone", hierarchy)
    ).toBe(false);

    const corruptHierarchy = new Map<string, string | null>([
      ["a", "b"],
      ["b", "a"],
    ]);
    expect(wouldCreateRigHierarchyCycle("target", "a", corruptHierarchy)).toBe(true);
  });

  test("rig bone names reject case-insensitive collisions while allowing self case-only rename", async () => {
    const groups = [
      { uuid: "arm-id", name: "Arm" },
      { uuid: "leg-id", name: "Leg" },
    ];
    expect(hasCaseInsensitiveRigNameCollision(groups, "arm")).toBe(true);
    expect(hasCaseInsensitiveRigNameCollision(groups, "ARM")).toBe(true);
    expect(
      hasCaseInsensitiveRigNameCollision(groups, "arm", "arm-id")
    ).toBe(false);
    expect(hasCaseInsensitiveRigNameCollision(groups, "hand")).toBe(false);

    const source = await Bun.file("server/tools/animation.ts").text();
    expect(source).toContain("hasCaseInsensitiveRigNameCollision(Group.all, bone_data.name)");
    expect(source).toContain("bone_data.new_name === targetBone.name");
    expect(source).not.toContain("group.name === bone_data.new_name");
  });

  test("mirror derives its bone name before mutation so identity collisions can be rejected", async () => {
    expect(deriveMirroredRigName("left_arm")).toBe("right_arm");
    expect(deriveMirroredRigName("right_leg")).toBe("left_leg");
    expect(deriveMirroredRigName("head")).toBe("head_mirrored");

    const source = await Bun.file("server/tools/animation.ts").text();
    expect(source).toContain("mirroredBoneName = deriveMirroredRigName(targetBone.name)");
    expect(source).toContain("mirroredBone.name = mirroredBoneName!");
    expect(source).not.toContain("mirroredBone.name = targetBone!.name.includes");
  });

  test("copy/paste actions require their explicit source, target, and mirror axis", async () => {
    expect(animationCopyPasteParameters.safeParse({ action: "copy" }).success).toBe(false);
    expect(animationCopyPasteParameters.safeParse({ action: "paste" }).success).toBe(false);
    expect(
      animationCopyPasteParameters.safeParse({
        action: "mirror_paste",
        target: { bone: "arm" },
      }).success
    ).toBe(false);
    expect(
      animationCopyPasteParameters.safeParse({
        action: "mirror_paste",
        target: { bone: "arm", mirror_axis: "z" },
      }).success
    ).toBe(true);

    const source = await Bun.file("server/tools/animation.ts").text();
    expect(source).toContain("action === \"mirror_paste\" ? target.mirror_axis! : null");
    expect(source).not.toContain("target.mirror_axis || \"x\"");
  });
});
