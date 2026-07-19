import { afterEach, describe, expect, test } from "bun:test";
import {
  computeProjectWorldBounds,
  renderedCubeWorldCorners,
  transformedCubeCorners,
} from "../src/lib/worldBounds";

class FakeVector {
  x: number;
  y: number;
  z: number;

  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  clone() {
    return new FakeVector(this.x, this.y, this.z);
  }

  set(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }

  applyMatrix4(matrix: { translate: [number, number, number] }) {
    this.x += matrix.translate[0];
    this.y += matrix.translate[1];
    this.z += matrix.translate[2];
    return this;
  }
}

const originalCanvas = (globalThis as any).Canvas;
const originalCube = (globalThis as any).Cube;

afterEach(() => {
  (globalThis as any).Canvas = originalCanvas;
  (globalThis as any).Cube = originalCube;
});

function installRenderedCube() {
  const cube = {
    uuid: "rendered-cube",
    name: "rendered",
    from: [100, 100, 100],
    to: [101, 101, 101],
    origin: [0, 0, 0],
    rotation: [0, 0, 0],
    parent: "root" as const,
  };
  const mesh = {
    position: new FakeVector(),
    matrixWorld: { translate: [10, 20, 30] as [number, number, number] },
    updateMatrixWorld() {},
    geometry: {
      boundingBox: {
        min: new FakeVector(-1, -2, -3),
        max: new FakeVector(1, 2, 3),
      },
      computeBoundingBox() {},
    },
  };
  (globalThis as any).Canvas = { meshes: { [cube.uuid]: mesh } };
  (globalThis as any).Cube = { all: [cube] };
  return cube;
}

describe("Rendered Blockbench world geometry authority", () => {
  test("prefers matrixWorld corners over manual cube coordinates", () => {
    const cube = installRenderedCube();
    const rendered = renderedCubeWorldCorners(cube);
    expect(rendered).not.toBeNull();
    expect(rendered).toContainEqual([9, 18, 27]);
    expect(rendered).toContainEqual([11, 22, 33]);

    const resolved = transformedCubeCorners(cube);
    expect(resolved).toEqual(rendered!);
    expect(resolved).not.toContainEqual([100, 100, 100]);
  });

  test("uses rendered corners for project world bounds", () => {
    installRenderedCube();
    const bounds = computeProjectWorldBounds();
    expect(bounds.source).toBe("render_mesh");
    expect(bounds.min).toEqual([9, 18, 27]);
    expect(bounds.max).toEqual([11, 22, 33]);
    expect(bounds.size).toEqual([2, 4, 6]);
  });
});
