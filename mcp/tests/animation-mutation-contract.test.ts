import { describe, expect, test } from "bun:test";
import {
  animationCopyPasteParameters,
  animationTimelineParameters,
  batchKeyframeOperationsParameters,
  countAnimationClipboardKeyframes,
  manageKeyframesParameters,
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
});
