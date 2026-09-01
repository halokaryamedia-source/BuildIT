import { describe, expect, test } from "bun:test";
import {
  mapFrameLocalPixelToBitmapPixel,
  requireTextureFrameIndex,
  resolveTextureFrameLayout,
  textureFrameRect,
} from "@/lib/textureFrameMapping";

describe("texture frame mapping", () => {
  test("resolves one static frame without special casing", () => {
    expect(resolveTextureFrameLayout(64, 32, 32, "Static texture")).toEqual({
      bitmap_width: 64,
      bitmap_height: 32,
      display_height: 32,
      frame_count: 1,
    });
  });

  test("resolves an exact vertical frame stack", () => {
    const layout = resolveTextureFrameLayout(16, 48, 16, "Animated texture");
    expect(layout.frame_count).toBe(3);
    expect(textureFrameRect(layout, 0, "Animated texture")).toEqual([0, 0, 16, 16]);
    expect(textureFrameRect(layout, 2, "Animated texture")).toEqual([0, 32, 16, 48]);
  });

  test("maps frame-local pixels to the stacked physical bitmap", () => {
    const layout = resolveTextureFrameLayout(16, 48, 16, "Animated texture");
    expect(
      mapFrameLocalPixelToBitmapPixel(layout, 1, 0, 0, "Animated texture")
    ).toEqual({ x: 0, y: 16 });
    expect(
      mapFrameLocalPixelToBitmapPixel(layout, 2, 15, 15, "Animated texture")
    ).toEqual({ x: 15, y: 47 });
  });

  test("rejects non-integral frame stacks", () => {
    expect(() =>
      resolveTextureFrameLayout(16, 48, 20, "Animated texture")
    ).toThrow();
  });

  test("rejects invalid frame indices and local pixels", () => {
    const layout = resolveTextureFrameLayout(16, 48, 16, "Animated texture");
    expect(() => requireTextureFrameIndex(layout, -1, "Animated texture")).toThrow();
    expect(() => requireTextureFrameIndex(layout, 3, "Animated texture")).toThrow();
    expect(() =>
      mapFrameLocalPixelToBitmapPixel(layout, 1, 16, 0, "Animated texture")
    ).toThrow();
    expect(() =>
      mapFrameLocalPixelToBitmapPixel(layout, 1, 0.5, 0, "Animated texture")
    ).toThrow();
  });
});
