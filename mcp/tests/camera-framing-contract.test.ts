import { describe, expect, test } from "bun:test";
import { captureModelViewsParameters } from "@/server/tools/camera";

const baseInput = {
  views: ["front"],
  front_direction: "+z",
} as const;

describe("capture_model_views explicit framing contract", () => {
  test("accepts a finite positive target envelope", () => {
    const result = captureModelViewsParameters.safeParse({
      ...baseInput,
      framing: {
        mode: "explicit",
        min: [-16, 0, -8],
        max: [16, 32, 8],
      },
    });
    expect(result.success).toBe(true);
  });

  test("rejects invalid or non-finite framing math before camera runtime", () => {
    const invalidFramings = [
      { mode: "explicit", min: [0, 0, 0], max: [Number.POSITIVE_INFINITY, 16, 16] },
      { mode: "explicit", min: [-1e308, 0, 0], max: [1e308, 16, 16] },
      { mode: "explicit", min: [0, 0, 0], max: [0, 16, 16] },
    ];
    for (const framing of invalidFramings) {
      const result = captureModelViewsParameters.safeParse({ ...baseInput, framing });
      expect(result.success).toBe(false);
    }
  });
});
