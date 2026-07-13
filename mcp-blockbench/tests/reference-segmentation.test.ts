import { describe, expect, test } from "bun:test";
import { retainRelevantForeground } from "../src/server/tools/geometry-analyzer";
import type { BinaryMask } from "../src/lib/geometryProjection";

function mask(width: number, height: number, pixels: Array<[number, number]>): BinaryMask {
  const data = new Uint8Array(width * height);
  for (const [x, y] of pixels) data[y * width + x] = 1;
  return { width, height, data };
}

describe("Reference Visual foreground retention", () => {
  test("keeps a nearby detached silhouette detail but removes remote noise", () => {
    const body: Array<[number, number]> = [];
    for (let y = 4; y <= 10; y += 1) {
      for (let x = 4; x <= 11; x += 1) body.push([x, y]);
    }
    const horn: Array<[number, number]> = [
      [7, 1], [7, 2], [7, 3], [8, 2],
    ];
    const result = retainRelevantForeground(mask(20, 16, [...body, ...horn, [19, 15]]));
    expect(result.data[2 * 20 + 7]).toBe(1);
    expect(result.data[15 * 20 + 19]).toBe(0);
  });
});
