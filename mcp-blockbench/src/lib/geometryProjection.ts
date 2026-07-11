/// <reference types="three" />
/// <reference types="blockbench-types" />

import {
  transformedCubeCorners,
  type Vec3,
} from "@/lib/worldBounds";
import type { StandardGeometryView } from "@/lib/geometryReferenceProfiles";

export interface BinaryMask {
  width: number;
  height: number;
  data: Uint8Array;
}

export interface CoordinateEnvelope {
  x_min: number;
  x_max: number;
  y_min: number;
  y_max: number;
  z_min: number;
  z_max: number;
}

export interface ProjectionFrame {
  view: StandardGeometryView;
  width: number;
  height: number;
  margin: number;
  minimum_u: number;
  maximum_u: number;
  minimum_v: number;
  maximum_v: number;
  scale: number;
  offset_x: number;
  offset_y: number;
  ground_pixel_y: number | null;
  center_pixel_x: number;
  center_pixel_y: number;
  projected_envelope_width: number;
  projected_envelope_height: number;
}

export interface ProjectedGeometryMask {
  mask: BinaryMask;
  frame: ProjectionFrame;
  cube_count: number;
}

export interface ProjectableCube {
  name?: string;
  uuid?: string;
  from?: number[];
  to?: number[];
  origin?: number[];
  rotation?: number[];
  inflate?: number;
  visibility?: boolean;
  export?: boolean;
  parent?: any;
}

interface Point2 {
  x: number;
  y: number;
}

const EPSILON = 1e-7;

function add(a: Vec3, b: Vec3): Vec3 {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function subtract(a: Vec3, b: Vec3): Vec3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function scaleVector(value: Vec3, amount: number): Vec3 {
  return [value[0] * amount, value[1] * amount, value[2] * amount];
}

function dot(a: Vec3, b: Vec3): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function cross(a: Vec3, b: Vec3): Vec3 {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

function normalize(value: Vec3): Vec3 {
  const length = Math.hypot(value[0], value[1], value[2]);
  if (length <= EPSILON) return [0, 0, 1];
  return [value[0] / length, value[1] / length, value[2] / length];
}

function frontVector(axis: "-z" | "+z" | "-x" | "+x"): Vec3 {
  if (axis === "+z") return [0, 0, 1];
  if (axis === "-x") return [-1, 0, 0];
  if (axis === "+x") return [1, 0, 0];
  return [0, 0, -1];
}

function envelopeCorners(envelope: CoordinateEnvelope): Vec3[] {
  const xs = [envelope.x_min, envelope.x_max];
  const ys = [envelope.y_min, envelope.y_max];
  const zs = [envelope.z_min, envelope.z_max];
  const result: Vec3[] = [];
  for (const x of xs) {
    for (const y of ys) {
      for (const z of zs) result.push([x, y, z]);
    }
  }
  return result;
}

function envelopeCenter(envelope: CoordinateEnvelope): Vec3 {
  return [
    (envelope.x_min + envelope.x_max) / 2,
    (envelope.y_min + envelope.y_max) / 2,
    (envelope.z_min + envelope.z_max) / 2,
  ];
}

function cameraBasis(
  view: StandardGeometryView,
  frontAxis: "-z" | "+z" | "-x" | "+x"
): {
  right: Vec3;
  up: Vec3;
  camera_direction: Vec3;
  perspective: boolean;
} {
  const worldUp: Vec3 = [0, 1, 0];
  const front = frontVector(frontAxis);
  const right = normalize(cross(front, worldUp));

  if (view === "front") {
    return { right, up: worldUp, camera_direction: front, perspective: false };
  }
  if (view === "back") {
    return {
      right: scaleVector(right, -1),
      up: worldUp,
      camera_direction: scaleVector(front, -1),
      perspective: false,
    };
  }
  if (view === "left_side") {
    return {
      right: scaleVector(front, -1),
      up: worldUp,
      camera_direction: scaleVector(right, -1),
      perspective: false,
    };
  }
  if (view === "top_footprint") {
    return {
      right: scaleVector(front, -1),
      up: scaleVector(right, -1),
      camera_direction: worldUp,
      perspective: false,
    };
  }

  const cameraDirection = normalize(
    add(add(front, scaleVector(right, -1)), scaleVector(worldUp, 0.18))
  );
  const screenRight = normalize(cross(cameraDirection, worldUp));
  const screenUp = normalize(cross(screenRight, cameraDirection));
  return {
    right: screenRight,
    up: screenUp,
    camera_direction: cameraDirection,
    perspective: true,
  };
}

function projectPhysical(
  point: Vec3,
  center: Vec3,
  view: StandardGeometryView,
  frontAxis: "-z" | "+z" | "-x" | "+x",
  cameraDistance: number
): Point2 {
  const basis = cameraBasis(view, frontAxis);
  const relative = subtract(point, center);
  const horizontal = dot(relative, basis.right);
  const vertical = dot(relative, basis.up);
  if (!basis.perspective) return { x: horizontal, y: vertical };

  const towardCamera = dot(relative, basis.camera_direction);
  const denominator = Math.max(
    cameraDistance - towardCamera,
    cameraDistance * 0.3
  );
  const perspectiveScale = cameraDistance / denominator;
  return {
    x: horizontal * perspectiveScale,
    y: vertical * perspectiveScale,
  };
}

function projectedEnvelope(
  view: StandardGeometryView,
  envelope: CoordinateEnvelope,
  frontAxis: "-z" | "+z" | "-x" | "+x"
): {
  minimum_u: number;
  maximum_u: number;
  minimum_v: number;
  maximum_v: number;
  camera_distance: number;
} {
  const center = envelopeCenter(envelope);
  const maxExtent = Math.max(
    envelope.x_max - envelope.x_min,
    envelope.y_max - envelope.y_min,
    envelope.z_max - envelope.z_min,
    1
  );
  const cameraDistance = maxExtent * 3.2;
  const points = envelopeCorners(envelope).map((point) =>
    projectPhysical(point, center, view, frontAxis, cameraDistance)
  );
  return {
    minimum_u: Math.min(...points.map((point) => point.x)),
    maximum_u: Math.max(...points.map((point) => point.x)),
    minimum_v: Math.min(...points.map((point) => point.y)),
    maximum_v: Math.max(...points.map((point) => point.y)),
    camera_distance: cameraDistance,
  };
}

export function createProjectionFrame(input: {
  view: StandardGeometryView;
  envelope: CoordinateEnvelope;
  front_axis: "-z" | "+z" | "-x" | "+x";
  width: number;
  height: number;
  margin: number;
}): ProjectionFrame {
  const projected = projectedEnvelope(
    input.view,
    input.envelope,
    input.front_axis
  );
  const physicalWidth = Math.max(
    projected.maximum_u - projected.minimum_u,
    EPSILON
  );
  const physicalHeight = Math.max(
    projected.maximum_v - projected.minimum_v,
    EPSILON
  );
  const availableWidth = Math.max(1, input.width - input.margin * 2);
  const availableHeight = Math.max(1, input.height - input.margin * 2);
  const scale = Math.min(
    availableWidth / physicalWidth,
    availableHeight / physicalHeight
  );
  const renderedWidth = physicalWidth * scale;
  const renderedHeight = physicalHeight * scale;
  const offsetX =
    (input.width - renderedWidth) / 2 - projected.minimum_u * scale;
  const offsetY =
    (input.height - renderedHeight) / 2 + projected.maximum_v * scale;
  const center = envelopeCenter(input.envelope);
  const centerProjection = projectPhysical(
    center,
    center,
    input.view,
    input.front_axis,
    projected.camera_distance
  );
  const groundProjection = projectPhysical(
    [center[0], input.envelope.y_min, center[2]],
    center,
    input.view,
    input.front_axis,
    projected.camera_distance
  );

  return {
    view: input.view,
    width: input.width,
    height: input.height,
    margin: input.margin,
    minimum_u: projected.minimum_u,
    maximum_u: projected.maximum_u,
    minimum_v: projected.minimum_v,
    maximum_v: projected.maximum_v,
    scale,
    offset_x: offsetX,
    offset_y: offsetY,
    ground_pixel_y:
      input.view === "top_footprint"
        ? null
        : offsetY - groundProjection.y * scale,
    center_pixel_x: offsetX + centerProjection.x * scale,
    center_pixel_y: offsetY - centerProjection.y * scale,
    projected_envelope_width: physicalWidth,
    projected_envelope_height: physicalHeight,
  };
}

function physicalToPixel(point: Point2, frame: ProjectionFrame): Point2 {
  return {
    x: frame.offset_x + point.x * frame.scale,
    y: frame.offset_y - point.y * frame.scale,
  };
}

function convexHull(points: Point2[]): Point2[] {
  const unique = Array.from(
    new Map(
      points.map((point) => [
        `${point.x.toFixed(6)},${point.y.toFixed(6)}`,
        point,
      ])
    ).values()
  ).sort((a, b) => a.x - b.x || a.y - b.y);
  if (unique.length <= 2) return unique;

  const turn = (a: Point2, b: Point2, c: Point2) =>
    (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
  const lower: Point2[] = [];
  for (const point of unique) {
    while (
      lower.length >= 2 &&
      turn(lower[lower.length - 2], lower[lower.length - 1], point) <= 0
    ) {
      lower.pop();
    }
    lower.push(point);
  }
  const upper: Point2[] = [];
  for (let index = unique.length - 1; index >= 0; index -= 1) {
    const point = unique[index];
    while (
      upper.length >= 2 &&
      turn(upper[upper.length - 2], upper[upper.length - 1], point) <= 0
    ) {
      upper.pop();
    }
    upper.push(point);
  }
  lower.pop();
  upper.pop();
  return [...lower, ...upper];
}

function pointInPolygon(x: number, y: number, polygon: Point2[]): boolean {
  let inside = false;
  for (
    let current = 0, previous = polygon.length - 1;
    current < polygon.length;
    previous = current++
  ) {
    const a = polygon[current];
    const b = polygon[previous];
    const intersects =
      a.y > y !== b.y > y &&
      x < ((b.x - a.x) * (y - a.y)) / (b.y - a.y + EPSILON) + a.x;
    if (intersects) inside = !inside;
  }
  return inside;
}

function fillPolygon(mask: BinaryMask, polygon: Point2[]): void {
  if (polygon.length < 3) return;
  const minimumX = Math.max(
    0,
    Math.floor(Math.min(...polygon.map((point) => point.x)))
  );
  const maximumX = Math.min(
    mask.width - 1,
    Math.ceil(Math.max(...polygon.map((point) => point.x)))
  );
  const minimumY = Math.max(
    0,
    Math.floor(Math.min(...polygon.map((point) => point.y)))
  );
  const maximumY = Math.min(
    mask.height - 1,
    Math.ceil(Math.max(...polygon.map((point) => point.y)))
  );
  for (let y = minimumY; y <= maximumY; y += 1) {
    for (let x = minimumX; x <= maximumX; x += 1) {
      if (pointInPolygon(x + 0.5, y + 0.5, polygon)) {
        mask.data[y * mask.width + x] = 1;
      }
    }
  }
}

export function projectElementsGeometry(
  elements: ProjectableCube[],
  input: {
    view: StandardGeometryView;
    envelope: CoordinateEnvelope;
    front_axis: "-z" | "+z" | "-x" | "+x";
    width: number;
    height: number;
    margin: number;
  }
): ProjectedGeometryMask {
  const frame = createProjectionFrame(input);
  const mask: BinaryMask = {
    width: input.width,
    height: input.height,
    data: new Uint8Array(input.width * input.height),
  };
  const center = envelopeCenter(input.envelope);
  const maxExtent = Math.max(
    input.envelope.x_max - input.envelope.x_min,
    input.envelope.y_max - input.envelope.y_min,
    input.envelope.z_max - input.envelope.z_min,
    1
  );
  const cameraDistance = maxExtent * 3.2;
  let count = 0;
  for (const cube of elements) {
    if (cube.visibility === false || cube.export === false) continue;
    const projected = transformedCubeCorners(cube).map((point) =>
      physicalToPixel(
        projectPhysical(
          point,
          center,
          input.view,
          input.front_axis,
          cameraDistance
        ),
        frame
      )
    );
    fillPolygon(mask, convexHull(projected));
    count += 1;
  }
  return { mask, frame, cube_count: count };
}

export function projectCurrentGeometry(input: {
  view: StandardGeometryView;
  envelope: CoordinateEnvelope;
  front_axis: "-z" | "+z" | "-x" | "+x";
  width: number;
  height: number;
  margin: number;
}): ProjectedGeometryMask {
  const elements: ProjectableCube[] = (Cube.all ?? []).map((cube) => ({
    name: cube.name,
    uuid: cube.uuid,
    from: [...cube.from],
    to: [...cube.to],
    origin: [...cube.origin],
    rotation: [...cube.rotation],
    inflate: cube.inflate,
    visibility: cube.visibility,
    export: (cube as unknown as { export?: boolean }).export,
    parent: cube.parent,
  }));
  return projectElementsGeometry(elements, input);
}

export function maskBounds(mask: BinaryMask): {
  min_x: number;
  min_y: number;
  max_x: number;
  max_y: number;
  width: number;
  height: number;
  center_x: number;
  center_y: number;
  pixel_count: number;
} | null {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let pixels = 0;
  for (let index = 0; index < mask.data.length; index += 1) {
    if (!mask.data[index]) continue;
    pixels += 1;
    const x = index % mask.width;
    const y = Math.floor(index / mask.width);
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }
  if (!Number.isFinite(minX)) return null;
  return {
    min_x: minX,
    min_y: minY,
    max_x: maxX,
    max_y: maxY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
    center_x: (minX + maxX) / 2,
    center_y: (minY + maxY) / 2,
    pixel_count: pixels,
  };
}

export function cropMask(
  mask: BinaryMask,
  rect: [number, number, number, number]
): BinaryMask {
  const x0 = Math.max(0, Math.floor(rect[0] * mask.width));
  const y0 = Math.max(0, Math.floor(rect[1] * mask.height));
  const x1 = Math.min(
    mask.width,
    Math.ceil((rect[0] + rect[2]) * mask.width)
  );
  const y1 = Math.min(
    mask.height,
    Math.ceil((rect[1] + rect[3]) * mask.height)
  );
  const width = Math.max(1, x1 - x0);
  const height = Math.max(1, y1 - y0);
  const data = new Uint8Array(width * height);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      data[y * width + x] = mask.data[(y0 + y) * mask.width + x0 + x];
    }
  }
  return { width, height, data };
}

export function maskIoU(reference: BinaryMask, current: BinaryMask): number {
  if (
    reference.width !== current.width ||
    reference.height !== current.height
  ) {
    throw new Error("MASK_DIMENSION_MISMATCH");
  }
  let intersection = 0;
  let union = 0;
  for (let index = 0; index < reference.data.length; index += 1) {
    const ref = Boolean(reference.data[index]);
    const cur = Boolean(current.data[index]);
    if (ref && cur) intersection += 1;
    if (ref || cur) union += 1;
  }
  return union > 0 ? intersection / union : 0;
}
