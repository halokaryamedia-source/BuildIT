import { describe, expect, test } from "bun:test";
import { summarizeFiniteBounds } from "@/lib/renderedModelBounds";

describe("rendered model bounds numeric safety", () => {
  test("derives a finite midpoint without summing large same-sign endpoints", () => {
    const { center, size } = summarizeFiniteBounds(
      [1e308, 0, 0],
      [1.5e308, 16, 8]
    );
    expect(Number.isFinite(size[0])).toBe(true);
    expect(Number.isFinite(center[0])).toBe(true);
    expect(center[0]).toBe(1.25e308);
  });

  test("rejects finite endpoints whose derived span overflows", () => {
    expect(() =>
      summarizeFiniteBounds([-1e308, 0, 0], [1e308, 16, 8])
    ).toThrow("Rendered model bounds span is non-finite");
  });
});
