import { describe, expect, test } from "bun:test";
import { captureModelViewsParameters } from "@/server/tools/camera";

const baseInput = {
  views: ["front"],
  front_direction: "+z",
} as const;

describe("capture_model_views explicit framing contract", () => {
  test("uses overflow-safe midpoint math for accepted explicit envelopes", async () => {
    const cameraSource = await Bun.file(new URL("../server/tools/camera.ts", import.meta.url)).text();
    expect(cameraSource).toContain("min[0] + size[0] / 2");
    expect(cameraSource).toContain("min[1] + size[1] / 2");
    expect(cameraSource).toContain("min[2] + size[2] / 2");
    expect(cameraSource).not.toContain("(min[0] + max[0]) / 2");
  });
  test("keeps model framing Cube-owned while explicit framing can use loaded 3D-Assisted evidence", async () => {
    const cameraSource = await Bun.file(
      new URL("../server/tools/camera.ts", import.meta.url)
    ).text();
    expect(cameraSource).toContain("hasVisibleLoadedBlockItThreeDAssistedReference");
    expect(cameraSource).toContain('framingInput.mode === "model"');
    expect(cameraSource).toContain("Model framing requires visible Cube geometry");
    expect(cameraSource).toContain(
      "Explicit framing requires visible Cube geometry or a loaded visible BlockIT 3D-Assisted Evidence reference."
    );
  });

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
