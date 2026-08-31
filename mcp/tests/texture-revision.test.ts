import { describe, expect, test } from "bun:test";
import {
  computeTextureRevision,
  requireTextureRevisionDimensions,
  requireTextureRevisionMatch,
} from "@/lib/textureRevision";

const PIXELS_2X2 = new Uint8ClampedArray([
  1, 2, 3, 4,
  5, 6, 7, 8,
  9, 10, 11, 12,
  13, 14, 15, 16,
]);

describe("texture revision identity", () => {
  test("locks SHA-256 RGBA revision identity with explicit dimensions", async () => {
    const revision = await computeTextureRevision(PIXELS_2X2, 2, 2);
    expect(revision).toBe(
      "sha256:2x2:5dfbabeedf318bf33c0927c43d7630f51b82f351740301354fa3d7fc51f0132e"
    );
  });

  test("changes revision when any decoded RGBA byte changes", async () => {
    const changed = PIXELS_2X2.slice();
    changed[0] = 2;

    expect(await computeTextureRevision(changed, 2, 2)).not.toBe(
      await computeTextureRevision(PIXELS_2X2, 2, 2)
    );
  });

  test("keeps dimensions in revision identity even when RGBA bytes are equal", async () => {
    expect(await computeTextureRevision(PIXELS_2X2, 1, 4)).not.toBe(
      await computeTextureRevision(PIXELS_2X2, 2, 2)
    );
  });

  test("rejects invalid dimensions and mismatched RGBA payload lengths", async () => {
    expect(() => requireTextureRevisionDimensions(0, 2)).toThrow();
    expect(() => requireTextureRevisionDimensions(2.5, 2)).toThrow();

    await expect(
      computeTextureRevision(new Uint8ClampedArray(4), 2, 2)
    ).rejects.toThrow();
  });

  test("fails closed when a destructive caller presents a stale revision", () => {
    expect(() =>
      requireTextureRevisionMatch(
        "sha256:2x2:old",
        "sha256:2x2:new",
        "Texture fixture"
      )
    ).toThrow();

    expect(() =>
      requireTextureRevisionMatch(
        "sha256:2x2:same",
        "sha256:2x2:same",
        "Texture fixture"
      )
    ).not.toThrow();

    expect(() =>
      requireTextureRevisionMatch(
        undefined,
        "sha256:2x2:any",
        "Texture fixture"
      )
    ).not.toThrow();
  });
});
