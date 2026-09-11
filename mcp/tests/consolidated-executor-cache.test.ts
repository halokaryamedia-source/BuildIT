import { describe, expect, test } from "bun:test";
import { getConsolidatedExecutors } from "@/server/runtime/consolidatedRoutes";

describe("consolidated executor descriptor cache", () => {
  test("reuses one immutable executor list per capability", () => {
    const first = getConsolidatedExecutors("manage_animation_timeline");
    const second = getConsolidatedExecutors("manage_animation_timeline");

    expect(second).toBe(first);
    expect(Object.isFrozen(first)).toBe(true);
    expect(first).toEqual([
      "manage_keyframes",
      "animation_graph_editor",
      "animation_timeline",
      "batch_keyframe_operations",
      "animation_copy_paste",
    ]);
  });
});
