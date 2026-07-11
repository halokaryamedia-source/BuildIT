/// <reference types="three" />
/// <reference types="blockbench-types" />

import { z } from "zod";
import { createTool, getAllToolDefinitions, type ToolSpec } from "@/lib/factories";
import { STATUS_EXPERIMENTAL } from "@/lib/constants";
import {
  assertInsideRoot,
  readJsonFile,
  writeFileAtomically,
  writeJsonAtomically,
  type NativeFsLike,
} from "@/lib/atomicFiles";

const standardViewEnum = z.enum([
  "front",
  "left_side",
  "back",
  "top_footprint",
  "front_left_3_4",
]);

type StandardView = z.infer<typeof standardViewEnum>;
type Crop = [number, number, number, number];

const cropSchema = z.array(z.number().min(0).max(1)).length(4);

const compareReferenceViewsParameters = z.object({
  session_root: z.string().min(1),
  expected_project_uuid: z.string().optional(),
  views: z
    .array(standardViewEnum)
    .min(1)
    .max(5)
    .optional()
    .default(["front", "left_side", "back", "top_footprint", "front_left_3_4"]),
  reference_crops: z.record(standardViewEnum, cropSchema).optional(),
  output_dir: z.string().optional(),
  return_diff_image: z.boolean().optional().default(true),
  segmentation_threshold: z.number().min(8).max(120).optional().default(35),
});

interface ManifestLike {
  asset?: { id?: string };
  reference_visual_lock?: {
    filename?: string;
    sha256?: string;
    width_px?: number;
    height_px?: number;
  };
  package?: { reference_visual?: string };
  visual_grounding?: {
    panels?: Partial<
      Record<
        StandardView,
        {
          crop_normalized?: Crop;
          min_score?: number;
        }
      >
    >;
  };
}

interface BinaryMask {
  width: number;
  height: number;
  data: Uint8Array;
}

interface ViewMetric {
  view: StandardView;
  score: number;
  silhouette_iou: number;
  row_profile_error: number;
  column_profile_error: number;
  reference_aspect: number;
  current_aspect: number;
  aspect_ratio_error: number;
  minimum_score: number;
  result: "PASS" | "REVISION_REQUIRED";
  issue_code: string | null;
}

export const visualCompareToolDocs: ToolSpec[] = [
  {
    name: "compare_reference_views",
    description:
      "Runs a deterministic silhouette comparison between the approved Reference Visual panels and clean current-model captures, writes compact metrics, and returns one diff contact sheet.",
    annotations: { title: "Compare Reference Views", readOnlyHint: true, openWorldHint: true },
    parameters: compareReferenceViewsParameters,
    status: STATUS_EXPERIMENTAL,
  },
];

const GOLDEN_SAMPLE_SHA = "fc46201d38fa1b357d285dd0450becfef1f88c65f39b179dfa41ea27ba182d5f";

const GOLDEN_SAMPLE_CROPS: Record<StandardView, Crop> = {
  left_side: [110 / 1491, 185 / 1055, 590 / 1491, 340 / 1055],
  front: [750 / 1491, 185 / 1055, 270 / 1491, 340 / 1055],
  back: [1120 / 1491, 185 / 1055, 275 / 1491, 340 / 1055],
  top_footprint: [30 / 1491, 610 / 1055, 670 / 1491, 290 / 1055],
  front_left_3_4: [820 / 1491, 600 / 1055, 530 / 1491, 350 / 1055],
};

const DEFAULT_MINIMUM_SCORE: Record<StandardView, number> = {
  front: 0.75,
  left_side: 0.75,
  back: 0.72,
  top_footprint: 0.70,
  front_left_3_4: 0.68,
};

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
    message: "Visual comparison requires SHA-256 integrity checks.",
    optional: false,
  }) as { createHash: (algorithm: string) => { update: (value: string | Buffer) => any; digest: (encoding: string) => string } };
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

function dataUrl(base64: string): string {
  return `data:image/png;base64,${base64}`;
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
  crop?: Crop,
  maxDimension = 256
): ImageData {
  const sourceX = crop ? Math.round(crop[0] * image.naturalWidth) : 0;
  const sourceY = crop ? Math.round(crop[1] * image.naturalHeight) : 0;
  const sourceWidth = crop
    ? Math.max(1, Math.round(crop[2] * image.naturalWidth))
    : image.naturalWidth;
  const sourceHeight = crop
    ? Math.max(1, Math.round(crop[3] * image.naturalHeight))
    : image.naturalHeight;
  const scale = Math.min(1, maxDimension / Math.max(sourceWidth, sourceHeight));
  const width = Math.max(1, Math.round(sourceWidth * scale));
  const height = Math.max(1, Math.round(sourceHeight * scale));
  const canvas = makeCanvas(width, height);
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("VISUAL_ANALYSIS_CONTEXT_UNAVAILABLE");
  context.imageSmoothingEnabled = false;
  context.drawImage(
    image,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    0,
    0,
    width,
    height
  );
  return context.getImageData(0, 0, width, height);
}

function cornerSamples(image: ImageData): Array<[number, number, number]> {
  const samples: Array<[number, number, number]> = [];
  const radius = Math.max(2, Math.min(6, Math.floor(Math.min(image.width, image.height) / 16)));
  const corners = [
    [0, 0],
    [Math.max(0, image.width - radius), 0],
    [0, Math.max(0, image.height - radius)],
    [Math.max(0, image.width - radius), Math.max(0, image.height - radius)],
  ];
  for (const [startX, startY] of corners) {
    for (let y = startY; y < Math.min(image.height, startY + radius); y += 1) {
      for (let x = startX; x < Math.min(image.width, startX + radius); x += 1) {
        const index = (y * image.width + x) * 4;
        samples.push([
          image.data[index],
          image.data[index + 1],
          image.data[index + 2],
        ]);
      }
    }
  }
  return samples;
}

function colorDistance(
  red: number,
  green: number,
  blue: number,
  sample: [number, number, number]
): number {
  const dr = red - sample[0];
  const dg = green - sample[1];
  const db = blue - sample[2];
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

function largestComponent(mask: BinaryMask): BinaryMask {
  const total = mask.width * mask.height;
  const visited = new Uint8Array(total);
  const queue = new Int32Array(total);
  let best: number[] = [];

  for (let start = 0; start < total; start += 1) {
    if (!mask.data[start] || visited[start]) continue;
    let head = 0;
    let tail = 0;
    queue[tail++] = start;
    visited[start] = 1;
    const component: number[] = [];
    while (head < tail) {
      const index = queue[head++];
      component.push(index);
      const x = index % mask.width;
      const y = Math.floor(index / mask.width);
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
    if (component.length > best.length) best = component;
  }

  if (!best.length) throw new Error("VISUAL_FOREGROUND_NOT_FOUND");
  const output = new Uint8Array(total);
  for (const index of best) output[index] = 1;
  return { width: mask.width, height: mask.height, data: output };
}

function segment(image: ImageData, threshold: number): BinaryMask {
  const backgrounds = cornerSamples(image);
  const data = new Uint8Array(image.width * image.height);
  for (let pixel = 0; pixel < data.length; pixel += 1) {
    const source = pixel * 4;
    if (image.data[source + 3] < 32) continue;
    const red = image.data[source];
    const green = image.data[source + 1];
    const blue = image.data[source + 2];
    let minimum = Infinity;
    for (const sample of backgrounds) {
      minimum = Math.min(minimum, colorDistance(red, green, blue, sample));
    }
    if (minimum > threshold) data[pixel] = 1;
  }
  return largestComponent({ width: image.width, height: image.height, data });
}

function maskBounds(mask: BinaryMask): { minX: number; minY: number; maxX: number; maxY: number } {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (let index = 0; index < mask.data.length; index += 1) {
    if (!mask.data[index]) continue;
    const x = index % mask.width;
    const y = Math.floor(index / mask.width);
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }
  if (!Number.isFinite(minX)) throw new Error("VISUAL_FOREGROUND_NOT_FOUND");
  return { minX, minY, maxX, maxY };
}

function normalizeMask(mask: BinaryMask, topView: boolean, size = 128): { mask: BinaryMask; aspect: number } {
  const bounds = maskBounds(mask);
  const sourceWidth = bounds.maxX - bounds.minX + 1;
  const sourceHeight = bounds.maxY - bounds.minY + 1;
  const available = size - 16;
  const scale = Math.min(available / sourceWidth, available / sourceHeight);
  const targetWidth = Math.max(1, Math.round(sourceWidth * scale));
  const targetHeight = Math.max(1, Math.round(sourceHeight * scale));
  const offsetX = Math.floor((size - targetWidth) / 2);
  const offsetY = topView
    ? Math.floor((size - targetHeight) / 2)
    : size - 8 - targetHeight;
  const output = new Uint8Array(size * size);

  for (let y = 0; y < targetHeight; y += 1) {
    const sourceY = bounds.minY + Math.min(sourceHeight - 1, Math.floor(y / scale));
    for (let x = 0; x < targetWidth; x += 1) {
      const sourceX = bounds.minX + Math.min(sourceWidth - 1, Math.floor(x / scale));
      if (mask.data[sourceY * mask.width + sourceX]) {
        output[(offsetY + y) * size + offsetX + x] = 1;
      }
    }
  }
  return {
    mask: { width: size, height: size, data: output },
    aspect: sourceWidth / sourceHeight,
  };
}

function profileError(reference: BinaryMask, current: BinaryMask, transpose: boolean): number {
  const outer = transpose ? reference.width : reference.height;
  const inner = transpose ? reference.height : reference.width;
  let error = 0;
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
    if (!extents[0] || !extents[1]) {
      error += 1;
      continue;
    }
    error +=
      (Math.abs(extents[0][0] - extents[1][0]) +
        Math.abs(extents[0][1] - extents[1][1])) /
      (2 * inner);
  }
  return error / outer;
}

function compareMasks(
  view: StandardView,
  reference: { mask: BinaryMask; aspect: number },
  current: { mask: BinaryMask; aspect: number },
  minimumScore: number
): ViewMetric {
  let intersection = 0;
  let union = 0;
  for (let index = 0; index < reference.mask.data.length; index += 1) {
    const ref = Boolean(reference.mask.data[index]);
    const cur = Boolean(current.mask.data[index]);
    if (ref && cur) intersection += 1;
    if (ref || cur) union += 1;
  }
  const silhouetteIou = union > 0 ? intersection / union : 0;
  const rowError = profileError(reference.mask, current.mask, false);
  const columnError = profileError(reference.mask, current.mask, true);
  const aspectError = Math.min(
    1,
    Math.abs(Math.log(Math.max(1e-6, current.aspect / reference.aspect)))
  );
  const score = Math.max(
    0,
    Math.min(
      1,
      0.7 * silhouetteIou +
        0.1 * (1 - rowError) +
        0.1 * (1 - columnError) +
        0.1 * (1 - aspectError)
    )
  );
  const result = score >= minimumScore ? "PASS" : "REVISION_REQUIRED";
  return {
    view,
    score,
    silhouette_iou: silhouetteIou,
    row_profile_error: rowError,
    column_profile_error: columnError,
    reference_aspect: reference.aspect,
    current_aspect: current.aspect,
    aspect_ratio_error: aspectError,
    minimum_score: minimumScore,
    result,
    issue_code:
      result === "PASS"
        ? null
        : `${view.toUpperCase().replace(/[^A-Z0-9]+/g, "_")}_SILHOUETTE_MISMATCH`,
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
  views: StandardView[],
  references: Map<StandardView, BinaryMask>,
  currents: Map<StandardView, BinaryMask>,
  metrics: ViewMetric[]
): Buffer {
  const cell = 128;
  const header = 24;
  const canvas = makeCanvas(cell * 3, views.length * (cell + header));
  const context = canvas.getContext("2d");
  if (!context) throw new Error("VISUAL_ANALYSIS_CONTEXT_UNAVAILABLE");
  context.fillStyle = "#111318";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.font = "14px sans-serif";
  context.textBaseline = "middle";

  views.forEach((view, row) => {
    const y = row * (cell + header);
    const metric = metrics.find((candidate) => candidate.view === view);
    context.fillStyle = metric?.result === "PASS" ? "#69d27d" : "#ff7a70";
    context.fillText(
      `${view}  score ${(metric?.score ?? 0).toFixed(3)} / ${(metric?.minimum_score ?? 0).toFixed(2)}`,
      8,
      y + header / 2
    );
    const reference = references.get(view);
    const current = currents.get(view);
    if (!reference || !current) return;
    drawMask(context, reference, 0, y + header, [210, 210, 210]);
    drawMask(context, current, cell, y + header, [210, 210, 210]);
    drawDiff(context, reference, current, cell * 2, y + header);
  });

  const encoded = canvas.toDataURL("image/png").replace(/^data:image\/png;base64,/, "");
  return Buffer.from(encoded, "base64");
}

function resolveCrops(
  manifest: ManifestLike,
  provided?: Partial<Record<StandardView, Crop>>
): Partial<Record<StandardView, Crop>> {
  const result: Partial<Record<StandardView, Crop>> = {};
  for (const view of standardViewEnum.options) {
    const manifestCrop = manifest.visual_grounding?.panels?.[view]?.crop_normalized;
    if (provided?.[view]) result[view] = provided[view];
    else if (manifestCrop) result[view] = manifestCrop;
  }
  const lockedHash = manifest.reference_visual_lock?.sha256?.toLowerCase();
  if (lockedHash === GOLDEN_SAMPLE_SHA) {
    for (const view of standardViewEnum.options) {
      result[view] ??= GOLDEN_SAMPLE_CROPS[view];
    }
  }
  return result;
}

export function registerVisualCompareTools(): void {
  createTool(
    visualCompareToolDocs[0].name,
    {
      ...visualCompareToolDocs[0],
      async execute({
        session_root,
        expected_project_uuid,
        views,
        reference_crops,
        output_dir,
        return_diff_image,
        segmentation_threshold,
      }) {
        if (!Project) throw new Error("No Blockbench project is open.");
        if (expected_project_uuid && Project.uuid !== expected_project_uuid) {
          throw new Error(
            `PROJECT_UUID_MISMATCH: active ${Project.uuid}, expected ${expected_project_uuid}.`
          );
        }
        const fs = nativeFs("MCP visual comparison needs Reference Visual and evidence access.");
        const manifestPath = joinPath(session_root, "references/reference_manifest.json");
        assertInsideRoot(manifestPath, session_root);
        const manifest = readJsonFile<ManifestLike>(fs, manifestPath);
        const referenceFilename =
          manifest.reference_visual_lock?.filename ??
          manifest.package?.reference_visual ??
          (manifest.asset?.id ? `${manifest.asset.id}_reference_visual.png` : "reference_visual.png");
        const referencePath = joinPath(session_root, `references/${referenceFilename}`);
        assertInsideRoot(referencePath, session_root);
        if (!fs.existsSync(referencePath)) {
          throw new Error(`REFERENCE_VISUAL_MISSING: ${referencePath}`);
        }
        const rawReference = fs.readFileSync(referencePath);
        const referenceBuffer = Buffer.isBuffer(rawReference)
          ? rawReference
          : Buffer.from(rawReference);
        const referenceHash = sha256(referenceBuffer);
        const expectedHash = manifest.reference_visual_lock?.sha256?.toLowerCase();
        if (expectedHash && referenceHash !== expectedHash) {
          throw new Error(
            `REFERENCE_VISUAL_HASH_MISMATCH: ${referenceHash}; expected ${expectedHash}.`
          );
        }

        const crops = resolveCrops(
          manifest,
          reference_crops as Partial<Record<StandardView, Crop>> | undefined
        );
        for (const view of views) {
          if (!crops[view]) {
            throw new Error(
              `REFERENCE_PANEL_CROP_MISSING: ${view}. Add visual_grounding.panels.${view}.crop_normalized or pass reference_crops.`
            );
          }
        }

        const captureTool = getAllToolDefinitions()["capture_visual_feedback"] as unknown as {
          execute?: (args: Record<string, unknown>) => Promise<any>;
        };
        if (!captureTool?.execute) throw new Error("capture_visual_feedback is unavailable.");
        const captureResult = await captureTool.execute({
          project: Project.uuid,
          expected_project_uuid: Project.uuid,
          session_root,
          views,
          include_reference: false,
          return_images: true,
          custom_prefix: "visual_compare_current",
        });
        const currentImages = (captureResult?.content ?? []).filter(
          (entry: any) => entry?.type === "image"
        );
        if (currentImages.length !== views.length) {
          throw new Error(
            `VISUAL_CAPTURE_COUNT_MISMATCH: captured ${currentImages.length}; expected ${views.length}.`
          );
        }

        const referenceImage = await loadImage(dataUrl(referenceBuffer.toString("base64")));
        const referenceMasks = new Map<StandardView, BinaryMask>();
        const currentMasks = new Map<StandardView, BinaryMask>();
        const metrics: ViewMetric[] = [];

        for (let index = 0; index < views.length; index += 1) {
          const view = views[index];
          const crop = crops[view];
          if (!crop) throw new Error(`REFERENCE_PANEL_CROP_MISSING: ${view}`);
          const currentImage = await loadImage(dataUrl(currentImages[index].data));
          const referenceSegment = segment(
            imageDataFor(referenceImage, crop),
            segmentation_threshold
          );
          const currentSegment = segment(
            imageDataFor(currentImage),
            segmentation_threshold
          );
          const normalizedReference = normalizeMask(
            referenceSegment,
            view === "top_footprint"
          );
          const normalizedCurrent = normalizeMask(
            currentSegment,
            view === "top_footprint"
          );
          referenceMasks.set(view, normalizedReference.mask);
          currentMasks.set(view, normalizedCurrent.mask);
          const minimumScore =
            manifest.visual_grounding?.panels?.[view]?.min_score ??
            DEFAULT_MINIMUM_SCORE[view];
          metrics.push(
            compareMasks(view, normalizedReference, normalizedCurrent, minimumScore)
          );
        }

        const result = metrics.every((metric) => metric.result === "PASS")
          ? "PASS"
          : "REVISION_REQUIRED";
        const report = {
          schema_version: "1.0",
          stage: "GEOMETRY",
          result,
          project: { name: Project.name, uuid: Project.uuid },
          geometry_fingerprint: geometryFingerprint(),
          reference_visual: {
            filename: referenceFilename,
            sha256: referenceHash,
          },
          segmentation_threshold,
          views: metrics,
          created_at: new Date().toISOString(),
          analyzer: "silhouette_profile_v1",
          note:
            "Deterministic silhouette metrics are a guardrail, not a substitute for Codex multimodal review. Both must pass before Geometry approval.",
        };
        const reportPath = joinPath(
          output_dir ?? joinPath(session_root, "evidence/geometry"),
          "geometry_visual_metrics.json"
        );
        assertInsideRoot(reportPath, session_root);
        writeJsonAtomically(fs, reportPath, report);

        const diff = contactSheet(views, referenceMasks, currentMasks, metrics);
        const diffPath = joinPath(
          output_dir ?? joinPath(session_root, "evidence/geometry"),
          "geometry_visual_diff.png"
        );
        assertInsideRoot(diffPath, session_root);
        writeFileAtomically(fs, diffPath, diff);

        const content: Array<
          | { type: "text"; text: string }
          | { type: "image"; data: string; mimeType: string }
        > = [
          {
            type: "text",
            text: `Deterministic Geometry visual comparison: ${result}. ${metrics.filter((metric) => metric.result !== "PASS").length} failing view(s). Diff: reference | current | overlap(green)/missing(red)/excess(blue).`,
          },
        ];
        if (return_diff_image) {
          content.push({ type: "image", data: diff.toString("base64"), mimeType: "image/png" });
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
            returned_diff_image: return_diff_image,
          },
        };
      },
    },
    visualCompareToolDocs[0].status
  );
}
