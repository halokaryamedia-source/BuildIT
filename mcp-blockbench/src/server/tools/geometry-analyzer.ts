/// <reference types="three" />
/// <reference types="blockbench-types" />

import { z } from "zod";
import { createTool, type ToolSpec } from "@/lib/factories";
import { STATUS_EXPERIMENTAL } from "@/lib/constants";
import {
  assertInsideRoot,
  readJsonFile,
  writeFileAtomically,
  writeJsonAtomically,
  type NativeFsLike,
} from "@/lib/atomicFiles";
import {
  mergeGeometryReferenceProfile,
  type GeometryPanelProfile,
  type GeometryViewRegion,
  type StandardGeometryView,
} from "@/lib/geometryReferenceProfiles";
import {
  cropMask,
  maskBounds,
  maskIoU,
  projectCurrentGeometry,
  type BinaryMask,
  type CoordinateEnvelope,
  type ProjectionFrame,
} from "@/lib/geometryProjection";

const standardViewEnum = z.enum([
  "front",
  "left_side",
  "right_side",
  "back",
  "top_footprint",
  "front_left_3_4",
]);

const analyzeGeometryViewsParameters = z.object({
  session_root: z.string().min(1),
  expected_project_uuid: z.string().optional(),
  views: z
    .array(standardViewEnum)
    .min(1)
    .max(6)
    .optional()
    .default(["front", "left_side", "back", "top_footprint", "front_left_3_4"]),
  output_dir: z.string().optional(),
  return_diff_image: z.boolean().optional().default(false),
  write_diff_image: z.boolean().optional().default(true),
  segmentation_threshold: z.number().min(8).max(120).optional().default(34),
});

export const geometryAnalyzerToolDocs: ToolSpec[] = [
  {
    name: "analyze_geometry_views",
    description:
      "Diagnoses Geometry against the approved Reference Visual using fixed approved scale, transformed cuboid projection, global silhouette/profile metrics, weighted semantic regions, and actionable part-level corrections. It does not free-rescale the current model and returns one compact diff sheet.",
    annotations: {
      title: "Analyze Geometry Views",
      readOnlyHint: false,
      openWorldHint: true,
    },
    parameters: analyzeGeometryViewsParameters,
    status: STATUS_EXPERIMENTAL,
  },
];

interface ManifestLike {
  asset?: { id?: string };
  package?: { reference_visual?: string };
  reference_visual_lock?: {
    filename?: string;
    sha256?: string;
    width_px?: number;
    height_px?: number;
  };
  main_format?: {
    width_units?: number;
    height_units?: number;
    depth_units?: number;
    width_blocks?: number;
    height_blocks?: number;
    depth_blocks?: number;
    blockbench_units_per_block?: number;
    coordinate_envelope?: Partial<CoordinateEnvelope>;
    front_direction?: string;
  };
  geometry?: Record<string, any>;
  visual_grounding?: Record<string, any>;
}

interface MaskMetric {
  view: StandardGeometryView;
  score: number;
  silhouette_iou: number;
  row_profile_error: number;
  column_profile_error: number;
  bbox_score: number;
  minimum_score: number;
  result: "PASS" | "REVISION_REQUIRED";
  issue_code: string | null;
  fixed_scale: true;
  free_rescale_used: false;
  frame: ProjectionFrame;
  reference_bounds: ReturnType<typeof maskBounds>;
  current_bounds: ReturnType<typeof maskBounds>;
  edge_delta_units: Record<string, number | null>;
  regions: RegionMetric[];
  diagnostics: ActionableIssue[];
  blocking_diagnostics: ActionableIssue[];
  warnings: ActionableIssue[];
  score_result: "PASS" | "REVISION_REQUIRED";
  critical_region_result: "PASS" | "REVISION_REQUIRED";
  foreground_result: "PASS" | "REVISION_REQUIRED";
  final_view_result: "PASS" | "REVISION_REQUIRED";
}

interface RegionMetric {
  id: string;
  score: number;
  minimum_score: number;
  weight: number;
  critical: boolean;
  result: "PASS" | "REVISION_REQUIRED";
  issue_code: string;
  parts: string[];
  recommendation: string;
}

interface ActionableIssue {
  code: string;
  view: StandardGeometryView;
  severity: "REVISION_REQUIRED" | "WARNING";
  region?: string;
  direction?: string;
  magnitude_units?: number;
  parts: string[];
  recommendation: string;
}

function joinPath(root: string, relative: string): string {
  const separator = root.includes("\\") && !root.includes("/") ? "\\" : "/";
  return `${root.replace(/[\\/]$/, "")}${separator}${relative.replace(/^[\\/]/, "")}`;
}

function nativeFs(message: string): NativeFsLike {
  // @ts-ignore - Blockbench runtime permission API.
  const fs = requireNativeModule("fs", { message, optional: false });
  if (!fs) throw new Error("Filesystem access was denied.");
  return fs as NativeFsLike;
}

function sha256(data: string | Buffer): string {
  // @ts-ignore - Blockbench runtime permission API.
  const cryptoModule = requireNativeModule("crypto", {
    message: "Geometry visual diagnosis requires SHA-256 integrity checks.",
    optional: false,
  }) as {
    createHash: (algorithm: string) => {
      update: (value: string | Buffer) => { digest: (encoding: string) => string };
    };
  };
  if (!cryptoModule) throw new Error("Crypto access was denied.");
  return cryptoModule.createHash("sha256").update(data).digest("hex");
}

function geometryFingerprint(): string {
  const cubes = (Cube.all ?? [])
    .map((cube) => ({
      uuid: cube.uuid,
      name: cube.name,
      from: [...cube.from],
      to: [...cube.to],
      origin: [...cube.origin],
      rotation: [...cube.rotation],
      inflate: cube.inflate,
      parent: typeof cube.parent === "string" ? cube.parent : cube.parent?.uuid,
    }))
    .sort((a, b) => String(a.uuid).localeCompare(String(b.uuid)));
  return sha256(JSON.stringify(cubes));
}

function dataUrl(data: Buffer): string {
  return `data:image/png;base64,${data.toString("base64")}`;
}

async function loadImage(source: string): Promise<HTMLImageElement> {
  if (typeof Image === "undefined") {
    throw new Error("VISUAL_ANALYSIS_IMAGE_API_UNAVAILABLE");
  }
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("VISUAL_ANALYSIS_IMAGE_LOAD_FAILED"));
    image.src = source;
  });
}

function makeCanvas(width: number, height: number): HTMLCanvasElement {
  if (typeof document === "undefined") {
    throw new Error("VISUAL_ANALYSIS_CANVAS_UNAVAILABLE");
  }
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function imageDataFor(
  image: HTMLImageElement,
  crop: [number, number, number, number]
): ImageData {
  const sourceX = Math.max(0, Math.floor(crop[0] * image.naturalWidth));
  const sourceY = Math.max(0, Math.floor(crop[1] * image.naturalHeight));
  const sourceWidth = Math.max(
    1,
    Math.min(
      image.naturalWidth - sourceX,
      Math.ceil(crop[2] * image.naturalWidth)
    )
  );
  const sourceHeight = Math.max(
    1,
    Math.min(
      image.naturalHeight - sourceY,
      Math.ceil(crop[3] * image.naturalHeight)
    )
  );
  const canvas = makeCanvas(sourceWidth, sourceHeight);
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("VISUAL_ANALYSIS_CONTEXT_UNAVAILABLE");
  context.drawImage(
    image,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    0,
    0,
    sourceWidth,
    sourceHeight
  );
  return context.getImageData(0, 0, sourceWidth, sourceHeight);
}

function colorDistance(
  red: number,
  green: number,
  blue: number,
  sample: [number, number, number]
): number {
  return Math.hypot(red - sample[0], green - sample[1], blue - sample[2]);
}

function cornerSamples(image: ImageData): Array<[number, number, number]> {
  const positions = [
    [1, 1],
    [Math.max(0, image.width - 2), 1],
    [1, Math.max(0, image.height - 2)],
    [Math.max(0, image.width - 2), Math.max(0, image.height - 2)],
  ];
  return positions.map(([x, y]) => {
    const index = (y * image.width + x) * 4;
    return [image.data[index], image.data[index + 1], image.data[index + 2]];
  });
}

interface ForegroundComponent {
  pixels: number[];
  min_x: number;
  min_y: number;
  max_x: number;
  max_y: number;
}

function foregroundComponents(mask: BinaryMask): ForegroundComponent[] {
  const total = mask.width * mask.height;
  const visited = new Uint8Array(total);
  const queue = new Int32Array(total);
  const components: ForegroundComponent[] = [];
  for (let start = 0; start < total; start += 1) {
    if (!mask.data[start] || visited[start]) continue;
    let head = 0;
    let tail = 0;
    queue[tail++] = start;
    visited[start] = 1;
    const pixels: number[] = [];
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    while (head < tail) {
      const index = queue[head++];
      pixels.push(index);
      const x = index % mask.width;
      const y = Math.floor(index / mask.width);
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
      const neighbors = [
        x > 0 ? index - 1 : -1,
        x + 1 < mask.width ? index + 1 : -1,
        y > 0 ? index - mask.width : -1,
        y + 1 < mask.height ? index + mask.width : -1,
      ];
      for (const neighbor of neighbors) {
        if (neighbor >= 0 && mask.data[neighbor] && !visited[neighbor]) {
          visited[neighbor] = 1;
          queue[tail++] = neighbor;
        }
      }
    }
    components.push({
      pixels,
      min_x: minX,
      min_y: minY,
      max_x: maxX,
      max_y: maxY,
    });
  }
  return components.sort((a, b) => b.pixels.length - a.pixels.length);
}

function componentGap(a: ForegroundComponent, b: ForegroundComponent): number {
  const dx = Math.max(0, a.min_x - b.max_x - 1, b.min_x - a.max_x - 1);
  const dy = Math.max(0, a.min_y - b.max_y - 1, b.min_y - a.max_y - 1);
  return Math.hypot(dx, dy);
}

export function retainRelevantForeground(mask: BinaryMask): BinaryMask {
  const components = foregroundComponents(mask);
  const main = components[0];
  if (!main) throw new Error("REFERENCE_FOREGROUND_NOT_FOUND");
  const minimumDetachedArea = Math.max(4, Math.ceil(main.pixels.length * 0.0125));
  const proximity = Math.max(mask.width, mask.height) * 0.12;
  const selected = components.filter(
    (component, index) =>
      index === 0 ||
      component.pixels.length >= main.pixels.length * 0.08 ||
      (component.pixels.length >= minimumDetachedArea &&
        componentGap(main, component) <= proximity)
  );
  const data = new Uint8Array(mask.width * mask.height);
  let foreground = 0;
  for (const component of selected) {
    for (const index of component.pixels) {
      if (!data[index]) foreground += 1;
      data[index] = 1;
    }
  }
  const ratio = foreground / Math.max(1, data.length);
  if (ratio < 0.002 || ratio > 0.92) {
    throw new Error(`REFERENCE_FOREGROUND_RATIO_INVALID: ${ratio.toFixed(4)}`);
  }
  return { width: mask.width, height: mask.height, data };
}

export function segmentReferencePixels(
  image: ImageData,
  threshold: number
): BinaryMask {
  const backgrounds = cornerSamples(image);
  const data = new Uint8Array(image.width * image.height);
  for (let pixel = 0; pixel < data.length; pixel += 1) {
    const source = pixel * 4;
    if (image.data[source + 3] < 32) continue;
    const red = image.data[source];
    const green = image.data[source + 1];
    const blue = image.data[source + 2];
    const minimum = Math.min(
      ...backgrounds.map((sample) => colorDistance(red, green, blue, sample))
    );
    if (minimum > threshold) data[pixel] = 1;
  }
  return retainRelevantForeground({ width: image.width, height: image.height, data });
}

function referenceMaskOnFixedFrame(input: {
  source: BinaryMask;
  frame: ProjectionFrame;
  view: StandardGeometryView;
  panel: GeometryPanelProfile;
  envelope: CoordinateEnvelope;
}): BinaryMask {
  const bounds = maskBounds(input.source);
  if (!bounds) throw new Error("REFERENCE_FOREGROUND_NOT_FOUND");
  const output: BinaryMask = {
    width: input.frame.width,
    height: input.frame.height,
    data: new Uint8Array(input.frame.width * input.frame.height),
  };
  const basisUnits =
    input.panel.scale_basis === "width"
      ? input.envelope.x_max - input.envelope.x_min
      : input.panel.scale_basis === "depth"
        ? input.envelope.z_max - input.envelope.z_min
        : input.envelope.y_max - input.envelope.y_min;
  const sourceBasis =
    input.panel.scale_basis === "height" ? bounds.height : bounds.width;
  const scale = (basisUnits * input.frame.scale) / Math.max(1, sourceBasis);
  const targetWidth = Math.max(1, bounds.width * scale);
  const targetHeight = Math.max(1, bounds.height * scale);
  const left = input.frame.center_pixel_x - targetWidth / 2;
  const top =
    input.view === "top_footprint"
      ? input.frame.center_pixel_y - targetHeight / 2
      : (input.frame.ground_pixel_y ?? input.frame.height - input.frame.margin) -
        targetHeight;

  const x0 = Math.max(0, Math.floor(left));
  const y0 = Math.max(0, Math.floor(top));
  const x1 = Math.min(output.width, Math.ceil(left + targetWidth));
  const y1 = Math.min(output.height, Math.ceil(top + targetHeight));
  for (let y = y0; y < y1; y += 1) {
    const sourceY =
      bounds.min_y +
      Math.min(
        bounds.height - 1,
        Math.max(0, Math.floor((y - top) / scale))
      );
    for (let x = x0; x < x1; x += 1) {
      const sourceX =
        bounds.min_x +
        Math.min(
          bounds.width - 1,
          Math.max(0, Math.floor((x - left) / scale))
        );
      if (input.source.data[sourceY * input.source.width + sourceX]) {
        output.data[y * output.width + x] = 1;
      }
    }
  }
  return output;
}

function profileError(
  reference: BinaryMask,
  current: BinaryMask,
  transpose: boolean
): number {
  const outer = transpose ? reference.width : reference.height;
  const inner = transpose ? reference.height : reference.width;
  let error = 0;
  let compared = 0;
  for (let outerIndex = 0; outerIndex < outer; outerIndex += 1) {
    const extents = [reference, current].map((mask) => {
      let minimum = Infinity;
      let maximum = -Infinity;
      for (let innerIndex = 0; innerIndex < inner; innerIndex += 1) {
        const x = transpose ? outerIndex : innerIndex;
        const y = transpose ? innerIndex : outerIndex;
        if (mask.data[y * mask.width + x]) {
          minimum = Math.min(minimum, innerIndex);
          maximum = Math.max(maximum, innerIndex);
        }
      }
      return Number.isFinite(minimum) ? [minimum, maximum] : null;
    });
    if (!extents[0] && !extents[1]) continue;
    compared += 1;
    if (!extents[0] || !extents[1]) {
      error += 1;
      continue;
    }
    error +=
      (Math.abs(extents[0][0] - extents[1][0]) +
        Math.abs(extents[0][1] - extents[1][1])) /
      (2 * inner);
  }
  return compared > 0 ? error / compared : 1;
}

function regionMetric(
  reference: BinaryMask,
  current: BinaryMask,
  region: GeometryViewRegion
): RegionMetric {
  const score = maskIoU(cropMask(reference, region.rect), cropMask(current, region.rect));
  return {
    id: region.id,
    score,
    minimum_score: region.minimum_score,
    weight: region.weight,
    critical: region.critical === true,
    result: score >= region.minimum_score ? "PASS" : "REVISION_REQUIRED",
    issue_code: region.issue_code,
    parts: region.parts,
    recommendation: region.recommendation,
  };
}

export function diagnosticThresholds(view: StandardGeometryView) {
  const perspective = view === "front_left_3_4";
  return {
    extent: perspective ? 1.5 : 1,
    ground: perspective ? 1.25 : 0.75,
    center: perspective ? 1.5 : 1,
  };
}

export function classifyViewStatus(input: {
  score: number;
  minimumScore: number;
  criticalRegionFailed: boolean;
  blockingDiagnostics: number;
  foregroundPassed?: boolean;
}) {
  const score_result =
    input.score >= input.minimumScore ? "PASS" : "REVISION_REQUIRED";
  const critical_region_result = input.criticalRegionFailed
    ? "REVISION_REQUIRED"
    : "PASS";
  const foreground_result = input.foregroundPassed === false
    ? "REVISION_REQUIRED"
    : "PASS";
  const final_view_result =
    score_result === "PASS" &&
    critical_region_result === "PASS" &&
    foreground_result === "PASS" &&
    input.blockingDiagnostics === 0
      ? "PASS"
      : "REVISION_REQUIRED";
  return { score_result, critical_region_result, foreground_result, final_view_result } as const;
}

function edgeDiagnostics(input: {
  view: StandardGeometryView;
  reference: NonNullable<ReturnType<typeof maskBounds>>;
  current: NonNullable<ReturnType<typeof maskBounds>>;
  pixelsPerUnit: number;
}): { deltas: Record<string, number>; issues: ActionableIssue[] } {
  const deltas = {
    left: (input.current.min_x - input.reference.min_x) / input.pixelsPerUnit,
    right: (input.current.max_x - input.reference.max_x) / input.pixelsPerUnit,
    top: (input.current.min_y - input.reference.min_y) / input.pixelsPerUnit,
    bottom: (input.current.max_y - input.reference.max_y) / input.pixelsPerUnit,
    width: (input.current.width - input.reference.width) / input.pixelsPerUnit,
    height: (input.current.height - input.reference.height) / input.pixelsPerUnit,
    center_x:
      (input.current.center_x - input.reference.center_x) / input.pixelsPerUnit,
    center_y:
      (input.current.center_y - input.reference.center_y) / input.pixelsPerUnit,
  };
  const issues: ActionableIssue[] = [];
  const thresholds = diagnosticThresholds(input.view);
  if (Math.abs(deltas.width) > thresholds.extent) {
    issues.push({
      code: deltas.width > 0 ? "VIEW_WIDTH_EXCESS" : "VIEW_WIDTH_MISSING",
      view: input.view,
      severity: "REVISION_REQUIRED",
      direction: deltas.width > 0 ? "reduce_horizontal_extent" : "increase_horizontal_extent",
      magnitude_units: Math.abs(deltas.width),
      parts: [],
      recommendation:
        input.view === "left_side" || input.view === "top_footprint"
          ? "Correct front/rear extent and body mass lengths; do not free-rescale the entire model."
          : "Correct bilateral width in the affected masses rather than scaling the whole asset.",
    });
  }
  if (Math.abs(deltas.height) > thresholds.extent) {
    issues.push({
      code: deltas.height > 0 ? "VIEW_HEIGHT_EXCESS" : "VIEW_HEIGHT_MISSING",
      view: input.view,
      severity: "REVISION_REQUIRED",
      direction: deltas.height > 0 ? "reduce_vertical_extent" : "increase_vertical_extent",
      magnitude_units: Math.abs(deltas.height),
      parts: [],
      recommendation:
        "Correct the specific topmost or lowest part identified by regional diagnostics; preserve Y=0 ground contact.",
    });
  }
  if (Math.abs(deltas.center_x) > thresholds.center) {
    issues.push({
      code: "VIEW_HORIZONTAL_CENTER_OFFSET",
      view: input.view,
      severity: "WARNING",
      direction: deltas.center_x > 0 ? "shift_left" : "shift_right",
      magnitude_units: Math.abs(deltas.center_x),
      parts: [],
      recommendation:
        "Correct asymmetric part placement or front/rear mass distribution; do not move the root away from the approved origin.",
    });
  }
  if (
    input.view !== "top_footprint" &&
    Math.abs(deltas.bottom) > thresholds.ground
  ) {
    issues.push({
      code: "GROUND_ALIGNMENT_MISMATCH",
      view: input.view,
      severity: "REVISION_REQUIRED",
      direction: deltas.bottom > 0 ? "raise_low_geometry" : "restore_ground_contact",
      magnitude_units: Math.abs(deltas.bottom),
      parts: ["legs", "feet"],
      recommendation:
        "Align all required foot bottoms to Y=0 and remove geometry extending below the ground plane.",
    });
  }
  return { deltas, issues };
}

function compareView(input: {
  view: StandardGeometryView;
  reference: BinaryMask;
  current: BinaryMask;
  panel: GeometryPanelProfile;
  frame: ProjectionFrame;
}): MaskMetric {
  const referenceBounds = maskBounds(input.reference);
  const currentBounds = maskBounds(input.current);
  if (!referenceBounds || !currentBounds) {
    return {
      view: input.view,
      score: 0,
      silhouette_iou: 0,
      row_profile_error: 1,
      column_profile_error: 1,
      bbox_score: 0,
      minimum_score: input.panel.minimum_score,
      result: "REVISION_REQUIRED",
      issue_code: `${input.view.toUpperCase()}_FOREGROUND_MISSING`,
      fixed_scale: true,
      free_rescale_used: false,
      frame: input.frame,
      reference_bounds: referenceBounds,
      current_bounds: currentBounds,
      edge_delta_units: {},
      regions: [],
      diagnostics: [
        {
          code: `${input.view.toUpperCase()}_FOREGROUND_MISSING`,
          view: input.view,
          severity: "REVISION_REQUIRED",
          parts: [],
          recommendation:
            "The analyzer could not find a valid full silhouette in this view. Verify camera orientation, visible Geometry, and reference crop.",
        },
      ],
      blocking_diagnostics: [
        {
          code: `${input.view.toUpperCase()}_FOREGROUND_MISSING`,
          view: input.view,
          severity: "REVISION_REQUIRED",
          parts: [],
          recommendation: "Verify camera orientation, visible Geometry, and reference crop.",
        },
      ],
      warnings: [],
      score_result: "REVISION_REQUIRED",
      critical_region_result: "REVISION_REQUIRED",
      foreground_result: "REVISION_REQUIRED",
      final_view_result: "REVISION_REQUIRED",
    };
  }

  const silhouetteIou = maskIoU(input.reference, input.current);
  const rowError = profileError(input.reference, input.current, false);
  const columnError = profileError(input.reference, input.current, true);
  const widthError = Math.abs(currentBounds.width - referenceBounds.width) /
    Math.max(referenceBounds.width, 1);
  const heightError = Math.abs(currentBounds.height - referenceBounds.height) /
    Math.max(referenceBounds.height, 1);
  const centerError =
    (Math.abs(currentBounds.center_x - referenceBounds.center_x) / input.reference.width +
      Math.abs(currentBounds.center_y - referenceBounds.center_y) / input.reference.height) /
    2;
  const bboxScore = Math.max(0, 1 - (widthError + heightError + centerError) / 3);
  const regions = input.panel.regions.map((region) =>
    regionMetric(input.reference, input.current, region)
  );
  const regionWeight = regions.reduce((sum, region) => sum + region.weight, 0);
  const regionScore =
    regionWeight > 0
      ? regions.reduce((sum, region) => sum + region.score * region.weight, 0) /
        regionWeight
      : silhouetteIou;
  const profileScore = Math.max(0, 1 - (rowError + columnError) / 2);
  const score = Math.max(
    0,
    Math.min(
      1,
      0.48 * silhouetteIou +
        0.17 * profileScore +
        0.12 * bboxScore +
        0.23 * regionScore
    )
  );
  const criticalFailure = regions.some(
    (region) => region.critical && region.result !== "PASS"
  );
  const edge = edgeDiagnostics({
    view: input.view,
    reference: referenceBounds,
    current: currentBounds,
    pixelsPerUnit: input.frame.scale,
  });
  const diagnostics: ActionableIssue[] = [
    ...regions
      .filter((region) => region.result !== "PASS")
      .map((region) => ({
        code: region.issue_code,
        view: input.view,
        severity: region.critical ? ("REVISION_REQUIRED" as const) : ("WARNING" as const),
        region: region.id,
        parts: region.parts,
        recommendation: region.recommendation,
      })),
    ...edge.issues,
  ];
  const blockingDiagnostics = diagnostics.filter(
    (issue) => issue.severity === "REVISION_REQUIRED"
  );
  const warnings = diagnostics.filter((issue) => issue.severity === "WARNING");
  const classified = classifyViewStatus({
    score,
    minimumScore: input.panel.minimum_score,
    criticalRegionFailed: criticalFailure,
    blockingDiagnostics: blockingDiagnostics.length,
  });

  return {
    view: input.view,
    score,
    silhouette_iou: silhouetteIou,
    row_profile_error: rowError,
    column_profile_error: columnError,
    bbox_score: bboxScore,
    minimum_score: input.panel.minimum_score,
    result: classified.final_view_result,
    issue_code:
      classified.final_view_result === "PASS"
        ? null
        : `${input.view.toUpperCase().replace(/[^A-Z0-9]+/g, "_")}_SILHOUETTE_MISMATCH`,
    fixed_scale: true,
    free_rescale_used: false,
    frame: input.frame,
    reference_bounds: referenceBounds,
    current_bounds: currentBounds,
    edge_delta_units: edge.deltas,
    regions,
    diagnostics,
    blocking_diagnostics: blockingDiagnostics,
    warnings,
    score_result: classified.score_result,
    critical_region_result: classified.critical_region_result,
    foreground_result: classified.foreground_result,
    final_view_result: classified.final_view_result,
  };
}

function drawMask(
  context: CanvasRenderingContext2D,
  mask: BinaryMask,
  offsetX: number,
  offsetY: number,
  color: [number, number, number]
): void {
  const image = context.createImageData(mask.width, mask.height);
  for (let index = 0; index < mask.data.length; index += 1) {
    const target = index * 4;
    if (mask.data[index]) {
      image.data[target] = color[0];
      image.data[target + 1] = color[1];
      image.data[target + 2] = color[2];
      image.data[target + 3] = 255;
    } else {
      image.data[target] = 18;
      image.data[target + 1] = 20;
      image.data[target + 2] = 24;
      image.data[target + 3] = 255;
    }
  }
  context.putImageData(image, offsetX, offsetY);
}

function drawDiff(
  context: CanvasRenderingContext2D,
  reference: BinaryMask,
  current: BinaryMask,
  offsetX: number,
  offsetY: number
): void {
  const image = context.createImageData(reference.width, reference.height);
  for (let index = 0; index < reference.data.length; index += 1) {
    const target = index * 4;
    const ref = Boolean(reference.data[index]);
    const cur = Boolean(current.data[index]);
    const color: [number, number, number] = ref && cur
      ? [55, 205, 95]
      : ref
        ? [230, 65, 65]
        : cur
          ? [55, 125, 235]
          : [18, 20, 24];
    image.data[target] = color[0];
    image.data[target + 1] = color[1];
    image.data[target + 2] = color[2];
    image.data[target + 3] = 255;
  }
  context.putImageData(image, offsetX, offsetY);
}

function contactSheet(
  views: StandardGeometryView[],
  references: Map<StandardGeometryView, BinaryMask>,
  currents: Map<StandardGeometryView, BinaryMask>,
  metrics: MaskMetric[]
): Buffer {
  const cell = metrics[0]?.frame.width ?? 256;
  const header = 30;
  const canvas = makeCanvas(cell * 3, views.length * (cell + header));
  const context = canvas.getContext("2d");
  if (!context) throw new Error("VISUAL_ANALYSIS_CONTEXT_UNAVAILABLE");
  context.fillStyle = "#111318";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.font = "14px sans-serif";
  context.textBaseline = "middle";
  for (let row = 0; row < views.length; row += 1) {
    const view = views[row];
    const metric = metrics.find((candidate) => candidate.view === view);
    const y = row * (cell + header);
    context.fillStyle = metric?.result === "PASS" ? "#69d27d" : "#ff7a70";
    context.fillText(
      `${view} fixed-scale ${(metric?.score ?? 0).toFixed(3)} / ${(metric?.minimum_score ?? 0).toFixed(2)}`,
      8,
      y + header / 2
    );
    const reference = references.get(view);
    const current = currents.get(view);
    if (!reference || !current) continue;
    drawMask(context, reference, 0, y + header, [210, 210, 210]);
    drawMask(context, current, cell, y + header, [210, 210, 210]);
    drawDiff(context, reference, current, cell * 2, y + header);
  }
  const encoded = canvas
    .toDataURL("image/png")
    .replace(/^data:image\/png;base64,/, "");
  return Buffer.from(encoded, "base64");
}

function coordinateEnvelope(manifest: ManifestLike): CoordinateEnvelope {
  const units = manifest.main_format?.blockbench_units_per_block ?? 16;
  const width =
    manifest.main_format?.width_units ??
    (manifest.main_format?.width_blocks ?? 1) * units;
  const height =
    manifest.main_format?.height_units ??
    (manifest.main_format?.height_blocks ?? 1) * units;
  const depth =
    manifest.main_format?.depth_units ??
    (manifest.main_format?.depth_blocks ?? 1) * units;
  const explicit = manifest.main_format?.coordinate_envelope ?? {};
  return {
    x_min: explicit.x_min ?? -width / 2,
    x_max: explicit.x_max ?? width / 2,
    y_min: explicit.y_min ?? 0,
    y_max: explicit.y_max ?? height,
    z_min: explicit.z_min ?? -depth / 2,
    z_max: explicit.z_max ?? depth / 2,
  };
}

function uniqueIssues(metrics: MaskMetric[]): ActionableIssue[] {
  const result: ActionableIssue[] = [];
  const seen = new Set<string>();
  for (const metric of metrics) {
    for (const issue of metric.diagnostics) {
      const key = `${issue.code}:${issue.view}:${issue.region ?? ""}`;
      if (seen.has(key)) continue;
      seen.add(key);
      result.push(issue);
    }
  }
  return result
    .sort((a, b) => {
      const severity =
        (a.severity === "REVISION_REQUIRED" ? 1 : 0) -
        (b.severity === "REVISION_REQUIRED" ? 1 : 0);
      if (severity !== 0) return -severity;
      return (b.magnitude_units ?? 0) - (a.magnitude_units ?? 0);
    })
    .slice(0, 12);
}

export function registerGeometryAnalyzerTools(): void {
  createTool(
    geometryAnalyzerToolDocs[0].name,
    {
      ...geometryAnalyzerToolDocs[0],
      async execute({
        session_root,
        expected_project_uuid,
        views,
        output_dir,
        return_diff_image,
        write_diff_image,
        segmentation_threshold,
      }) {
        if (!Project) throw new Error("No Blockbench project is open.");
        if (expected_project_uuid && Project.uuid !== expected_project_uuid) {
          throw new Error(
            `PROJECT_UUID_MISMATCH: active ${Project.uuid}, expected ${expected_project_uuid}.`
          );
        }
        const fs = nativeFs(
          "MCP Geometry diagnosis needs Reference Visual and evidence access."
        );
        const manifestPath = joinPath(
          session_root,
          "references/reference_manifest.json"
        );
        assertInsideRoot(manifestPath, session_root);
        const manifest = readJsonFile<ManifestLike>(fs, manifestPath);
        const referenceFilename =
          manifest.reference_visual_lock?.filename ??
          manifest.package?.reference_visual ??
          (manifest.asset?.id
            ? `${manifest.asset.id}_reference_visual.png`
            : "reference_visual.png");
        const referencePath = joinPath(
          session_root,
          `references/${referenceFilename}`
        );
        assertInsideRoot(referencePath, session_root);
        if (!fs.existsSync(referencePath)) {
          throw new Error(`REFERENCE_VISUAL_MISSING: ${referencePath}`);
        }
        const rawReference = fs.readFileSync(referencePath);
        const referenceBuffer = Buffer.isBuffer(rawReference)
          ? rawReference
          : Buffer.from(rawReference);
        const referenceHash = sha256(referenceBuffer);
        const expectedHash =
          manifest.reference_visual_lock?.sha256?.toLowerCase();
        if (expectedHash && referenceHash !== expectedHash) {
          throw new Error(
            `REFERENCE_VISUAL_HASH_MISMATCH: ${referenceHash}; expected ${expectedHash}.`
          );
        }

        const profile = mergeGeometryReferenceProfile({
          referenceSha256: referenceHash,
          visualGrounding: manifest.visual_grounding as any,
          geometry: manifest.geometry as any,
        });
        if (!profile) {
          throw new Error(
            "GEOMETRY_REFERENCE_PROFILE_MISSING: add visual_grounding panels/regions and Geometry constraints to the manifest."
          );
        }
        for (const view of views as StandardGeometryView[]) {
          const panel = profile.panels[view];
          if (
            !panel ||
            panel.crop_normalized[2] <= 0 ||
            panel.crop_normalized[3] <= 0
          ) {
            throw new Error(
              `REFERENCE_PANEL_CROP_MISSING: ${view}. A non-zero approved crop is required.`
            );
          }
        }

        const envelope = coordinateEnvelope(manifest);
        const referenceImage = await loadImage(dataUrl(referenceBuffer));
        const referenceMasks = new Map<StandardGeometryView, BinaryMask>();
        const currentMasks = new Map<StandardGeometryView, BinaryMask>();
        const metrics: MaskMetric[] = [];

        for (const view of views as StandardGeometryView[]) {
          const panel = profile.panels[view];
          if (!panel) {
            throw new Error(
              `REFERENCE_PANEL_CROP_MISSING: ${view}. A non-zero approved crop is required.`
            );
          }
          const current = projectCurrentGeometry({
            view,
            envelope,
            front_axis: profile.front_axis,
            width: profile.canvas_size,
            height: profile.canvas_size,
            margin: profile.margin_pixels,
          });
          const segmented = segmentReferencePixels(
            imageDataFor(referenceImage, panel.crop_normalized),
            segmentation_threshold
          );
          const reference = referenceMaskOnFixedFrame({
            source: segmented,
            frame: current.frame,
            view,
            panel,
            envelope,
          });
          referenceMasks.set(view, reference);
          currentMasks.set(view, current.mask);
          metrics.push(
            compareView({
              view,
              reference,
              current: current.mask,
              panel,
              frame: current.frame,
            })
          );
        }

        const result = metrics.every(
          (metric) => metric.final_view_result === "PASS"
        )
          ? "PASS"
          : "REVISION_REQUIRED";
        const failingViews = metrics
          .filter((metric) => metric.final_view_result !== "PASS")
          .map((metric) => metric.view);
        const recommendedScope =
          failingViews.length >= 2 ||
          failingViews.some((view) =>
            ["left_side", "front", "top_footprint"].includes(view)
          )
            ? "MAJOR_FORM_REVISION"
            : "LOCAL_REPAIR";
        const report = {
          schema_version: "2.0",
          stage: "GEOMETRY",
          result,
          project: { name: Project.name, uuid: Project.uuid },
          geometry_fingerprint: geometryFingerprint(),
          reference_visual: {
            filename: referenceFilename,
            sha256: referenceHash,
          },
          coordinate_policy: {
            fixed_approved_scale: true,
            free_rescale_current_model: false,
            ground_alignment: true,
            center_axis_alignment: true,
            envelope,
            canvas_size: profile.canvas_size,
            margin_pixels: profile.margin_pixels,
          },
          segmentation_threshold,
          views: metrics,
          failing_views: failingViews,
          actionable_issues: uniqueIssues(metrics),
          recommended_scope: recommendedScope,
          recommended_profile: "BEDROCK_CUBOID_GEOMETRY",
          created_at: new Date().toISOString(),
          analyzer: "geometry_projection_region_v2",
          note:
            "Current Geometry is projected directly from transformed cuboids at approved scale. The result identifies where and how the silhouette differs; Codex multimodal inspection and user review remain mandatory.",
        };
        const evidenceRoot =
          output_dir ?? joinPath(session_root, "evidence/geometry");
        assertInsideRoot(evidenceRoot, session_root);
        const reportPath = joinPath(
          evidenceRoot,
          "geometry_visual_metrics.json"
        );
        writeJsonAtomically(fs, reportPath, report);
        const diff = write_diff_image || return_diff_image
          ? contactSheet(
              views as StandardGeometryView[],
              referenceMasks,
              currentMasks,
              metrics
            )
          : null;
        const diffPath = write_diff_image
          ? joinPath(evidenceRoot, "geometry_visual_diff.png")
          : null;
        if (diff && diffPath) writeFileAtomically(fs, diffPath, diff);

        const content: Array<
          | { type: "text"; text: string }
          | { type: "image"; data: string; mimeType: string }
        > = [
          {
            type: "text",
            text: `Geometry diagnosis: ${result}. Failing views: ${
              failingViews.join(", ") || "none"
            }. Recommended route: ${recommendedScope}. The report contains ranked affected regions, parts, direction, and magnitude; do not guess unrelated changes.`,
          },
        ];
        if (return_diff_image && diff) {
          content.push({
            type: "image",
            data: diff.toString("base64"),
            mimeType: "image/png",
          });
        }
        return {
          content,
          structuredContent: {
            result,
            report_path: reportPath,
            diff_path: diffPath,
            geometry_fingerprint: report.geometry_fingerprint,
            reference_sha256: referenceHash,
            metrics,
            actionable_issues: report.actionable_issues,
            recommended_scope: recommendedScope,
            recommended_profile: "BEDROCK_CUBOID_GEOMETRY",
            returned_diff_image: return_diff_image,
            wrote_diff_image: Boolean(diffPath),
            usage: {
              analyzed_views: views.length,
              image_payloads_returned: return_diff_image && diff ? 1 : 0,
              persistent_diff_images_written: diffPath ? 1 : 0,
            },
          },
        };
      },
    },
    geometryAnalyzerToolDocs[0].status
  );
}
