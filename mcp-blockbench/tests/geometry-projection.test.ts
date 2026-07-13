import { describe, expect, test } from "bun:test";
import {
  maskBounds,
  projectElementsGeometry,
  type CoordinateEnvelope,
} from "../src/lib/geometryProjection";

const envelope: CoordinateEnvelope = {
  x_min: -13.6,
  x_max: 13.6,
  y_min: 0,
  y_max: 40,
  z_min: -30,
  z_max: 22.8,
};

const input = {
  view: "left_side" as const,
  envelope,
  front_axis: "-z" as const,
  width: 256,
  height: 256,
  margin: 18,
};

describe("fixed-scale Geometry projection", () => {
  test("larger world-space geometry remains larger instead of being normalized", () => {
    const small = projectElementsGeometry(
      [
        {
          name: "small",
          uuid: "small",
          from: [-4, 0, -8],
          to: [4, 16, 8],
          origin: [0, 0, 0],
          rotation: [0, 0, 0],
          parent: "root",
        },
      ],
      input
    );
    const large = projectElementsGeometry(
      [
        {
          name: "large",
          uuid: "large",
          from: [-8, 0, -16],
          to: [8, 32, 16],
          origin: [0, 0, 0],
          rotation: [0, 0, 0],
          parent: "root",
        },
      ],
      input
    );
    const smallBounds = maskBounds(small.mask);
    const largeBounds = maskBounds(large.mask);
    expect(smallBounds).not.toBeNull();
    expect(largeBounds).not.toBeNull();
    expect(largeBounds!.width).toBeGreaterThan(smallBounds!.width);
    expect(largeBounds!.height).toBeGreaterThan(smallBounds!.height);
    expect(large.frame.scale).toBeCloseTo(small.frame.scale, 8);
  });

  test("grounded geometry shares the same fixed ground pixel", () => {
    const low = projectElementsGeometry(
      [
        {
          name: "grounded_low",
          uuid: "grounded_low",
          from: [-4, 0, -5],
          to: [4, 12, 5],
          origin: [0, 0, 0],
          rotation: [0, 0, 0],
          parent: "root",
        },
      ],
      input
    );
    const tall = projectElementsGeometry(
      [
        {
          name: "grounded_tall",
          uuid: "grounded_tall",
          from: [-4, 0, -5],
          to: [4, 28, 5],
          origin: [0, 0, 0],
          rotation: [0, 0, 0],
          parent: "root",
        },
      ],
      input
    );
    const lowBounds = maskBounds(low.mask);
    const tallBounds = maskBounds(tall.mask);
    expect(low.frame.ground_pixel_y).toBeCloseTo(tall.frame.ground_pixel_y!, 8);
    expect(lowBounds!.max_y).toBe(tallBounds!.max_y);
  });

  test("rotation changes projected silhouette at the same approved scale", () => {
    const unrotated = projectElementsGeometry(
      [
        {
          name: "horn",
          uuid: "horn",
          from: [-1, 20, -25],
          to: [1, 36, -21],
          origin: [0, 20, -23],
          rotation: [0, 0, 0],
          parent: "root",
        },
      ],
      input
    );
    const rotated = projectElementsGeometry(
      [
        {
          name: "horn",
          uuid: "horn",
          from: [-1, 20, -25],
          to: [1, 36, -21],
          origin: [0, 20, -23],
          rotation: [-25, 0, 0],
          parent: "root",
        },
      ],
      input
    );
    expect(Array.from(rotated.mask.data)).not.toEqual(
      Array.from(unrotated.mask.data)
    );
    expect(rotated.frame.scale).toBeCloseTo(unrotated.frame.scale, 8);
  });
  test("right-side projection uses the same fixed scale", () => {
    const elements = [{
      name: "asymmetric", uuid: "asymmetric", from: [-7, 0, -5], to: [4, 18, 7],
      origin: [0, 0, 0], rotation: [0, 0, 0], parent: "root",
    }];
    const left = projectElementsGeometry(elements, input);
    const right = projectElementsGeometry(elements, { ...input, view: "right_side" });
    expect(right.frame.scale).toBeCloseTo(left.frame.scale, 8);
    expect(Array.from(right.mask.data)).not.toEqual(Array.from(left.mask.data));
  });

});
