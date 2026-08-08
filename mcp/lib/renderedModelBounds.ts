/// <reference types="three" />
/// <reference types="blockbench-types" />

export type Vec3 = [number, number, number];

export interface RenderedModelBounds {
  min: Vec3;
  max: Vec3;
  center: Vec3;
  size_xyz: Vec3;
  dimensions: {
    width: number;
    height: number;
    length: number;
  };
  footprint: {
    min_xz: [number, number];
    max_xz: [number, number];
    size: {
      width: number;
      length: number;
    };
  };
}

export interface RenderedModelBoundsObservation {
  total_cube_count: number;
  rendered_cube_count: number;
  hidden_cube_count: number;
  bounds: RenderedModelBounds | null;
  warnings: string[];
}

function normalizeNumber(value: number): number {
  return Object.is(value, -0) ? 0 : value;
}

function asFiniteVec3(value: unknown, cubeName: string): Vec3 {
  if (
    !Array.isArray(value) ||
    value.length !== 3 ||
    value.some((entry) => typeof entry !== "number" || !Number.isFinite(entry))
  ) {
    throw new Error(
      `Cube "${cubeName}" returned invalid global vertex data. Rendered bounds cannot be trusted.`
    );
  }

  return [
    normalizeNumber(value[0]),
    normalizeNumber(value[1]),
    normalizeNumber(value[2]),
  ];
}

function isEffectivelyVisible(object: THREE.Object3D | undefined): boolean {
  if (!object) return false;

  let current: THREE.Object3D | null = object;
  while (current) {
    if (!current.visible) return false;
    current = current.parent;
  }

  return true;
}

function ensureCurrentWorldMatrix(cube: Cube): void {
  if (!cube.mesh) {
    throw new Error(
      `Cube "${cube.name}" has no preview mesh. Rendered bounds cannot be observed reliably.`
    );
  }

  // Update the Cube and all parent transforms before asking Blockbench for its
  // global vertices. This is state-neutral: it refreshes Three.js transform
  // matrices but does not author or mutate model geometry.
  cube.mesh.updateWorldMatrix(true, false);
}

/**
 * Read the active project's currently rendered Cube envelope.
 *
 * Blockbench's Cube.getGlobalVertexPositions() is the authority here because it
 * transforms inflated/stretched Cube corners through the preview mesh's
 * matrixWorld. That keeps Cube rotation and active parent/group transforms in
 * the same coordinate basis the viewport renders.
 *
 * This helper intentionally does not accept target dimensions and never judges
 * whether the model is correct. It returns observation facts only.
 */
export function readRenderedModelBounds(): RenderedModelBoundsObservation {
  if (!Project) {
    throw new Error(
      "No project is open. Open or create the intended Bedrock project before inspecting model bounds."
    );
  }

  if (Mesh.all.length > 0) {
    throw new Error(
      `inspect_model_bounds v1 supports Cube-based Bedrock geometry only. Found ${Mesh.all.length} Mesh element(s); refusing to report incomplete whole-model bounds.`
    );
  }

  const totalCubeCount = Cube.all.length;
  const renderedCubes = Cube.all.filter(
    (cube) => cube.visibility !== false && isEffectivelyVisible(cube.mesh)
  );
  const hiddenCubeCount = totalCubeCount - renderedCubes.length;
  const warnings: string[] = [];

  if (hiddenCubeCount > 0) {
    warnings.push(
      `${hiddenCubeCount} hidden/non-rendered Cube(s) were excluded from rendered bounds.`
    );
  }

  if (renderedCubes.length === 0) {
    return {
      total_cube_count: totalCubeCount,
      rendered_cube_count: 0,
      hidden_cube_count: hiddenCubeCount,
      bounds: null,
      warnings,
    };
  }

  const min: Vec3 = [Infinity, Infinity, Infinity];
  const max: Vec3 = [-Infinity, -Infinity, -Infinity];

  for (const cube of renderedCubes) {
    ensureCurrentWorldMatrix(cube);

    const rawVertices = cube.getGlobalVertexPositions();
    if (!Array.isArray(rawVertices) || rawVertices.length !== 8) {
      throw new Error(
        `Cube "${cube.name}" did not return the expected 8 global vertices. Rendered bounds cannot be trusted.`
      );
    }

    for (const rawVertex of rawVertices) {
      const vertex = asFiniteVec3(rawVertex, cube.name);
      for (let axis = 0; axis < 3; axis++) {
        min[axis] = Math.min(min[axis], vertex[axis]);
        max[axis] = Math.max(max[axis], vertex[axis]);
      }
    }
  }

  if (
    min.some((value) => !Number.isFinite(value)) ||
    max.some((value) => !Number.isFinite(value))
  ) {
    throw new Error("Rendered model bounds are non-finite and cannot be trusted.");
  }

  const center: Vec3 = [
    normalizeNumber((min[0] + max[0]) / 2),
    normalizeNumber((min[1] + max[1]) / 2),
    normalizeNumber((min[2] + max[2]) / 2),
  ];
  const size: Vec3 = [
    normalizeNumber(max[0] - min[0]),
    normalizeNumber(max[1] - min[1]),
    normalizeNumber(max[2] - min[2]),
  ];

  return {
    total_cube_count: totalCubeCount,
    rendered_cube_count: renderedCubes.length,
    hidden_cube_count: hiddenCubeCount,
    bounds: {
      min: [...min],
      max: [...max],
      center,
      size_xyz: size,
      dimensions: {
        width: size[0],
        height: size[1],
        length: size[2],
      },
      footprint: {
        min_xz: [min[0], min[2]],
        max_xz: [max[0], max[2]],
        size: {
          width: size[0],
          length: size[2],
        },
      },
    },
    warnings,
  };
}
