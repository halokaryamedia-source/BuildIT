/// <reference types="blockbench-types" />

import { z } from "zod";
import { createTool, type ToolSpec } from "@/lib/factories";
import { STATUS_STABLE } from "@/lib/constants";
import {
  assertInsideRoot,
  readJsonFile,
  type NativeFsLike,
} from "@/lib/atomicFiles";
import {
  createImageTransportPreview,
  type TransportImageFormat,
} from "@/lib/imageTransport";

const inspectReferenceVisualPreviewParameters = z.object({
  session_root: z.string().min(1),
  manifest_path: z.string().optional(),
  include_image: z.boolean().optional().default(true),
  max_source_bytes: z
    .number()
    .int()
    .positive()
    .max(32 * 1024 * 1024)
    .optional()
    .default(12 * 1024 * 1024),
  max_dimension: z.number().int().min(320).max(2048).optional().default(1400),
  transport_format: z.enum(["jpeg", "png"]).optional().default("jpeg"),
  quality: z.number().min(0.5).max(0.95).optional().default(0.9),
  max_transport_bytes: z
    .number()
    .int()
    .min(64 * 1024)
    .max(2 * 1024 * 1024)
    .optional()
    .default(768 * 1024),
});

export const referenceVisualPreviewToolDocs: ToolSpec[] = [
  {
    name: "inspect_reference_visual_preview",
    description:
      "Verifies the approved Reference Visual at full source integrity, then returns a bounded JPEG/PNG transport preview instead of embedding the multi-megabyte original in one MCP JSON response. The preview is ephemeral and does not count as an additional generated reference image.",
    annotations: {
      title: "Inspect Reference Visual Safely",
      readOnlyHint: true,
      openWorldHint: true,
    },
    parameters: inspectReferenceVisualPreviewParameters,
    status: STATUS_STABLE,
  },
];

interface ReferenceManifest {
  asset?: { id?: string };
  package?: { reference_visual?: string };
  reference_visual_lock?: {
    filename?: string;
    sha256?: string;
    width_px?: number;
    height_px?: number;
    format?: string;
  };
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

function sha256(data: Buffer): string {
  // @ts-ignore - Blockbench runtime permission API.
  const cryptoModule = requireNativeModule("crypto", {
    message: "Reference Visual transport requires SHA-256 integrity verification.",
    optional: false,
  }) as {
    createHash: (algorithm: string) => {
      update: (value: Buffer) => { digest: (encoding: string) => string };
    };
  };
  if (!cryptoModule) throw new Error("Crypto access was denied.");
  return cryptoModule.createHash("sha256").update(data).digest("hex");
}

function sourceMimeType(filename: string, declared?: string): string {
  const normalized = declared?.toLowerCase() ?? "";
  if (normalized.includes("jpeg") || normalized.includes("jpg")) return "image/jpeg";
  if (filename.toLowerCase().endsWith(".jpg") || filename.toLowerCase().endsWith(".jpeg")) {
    return "image/jpeg";
  }
  return "image/png";
}

export function registerReferenceVisualPreviewTools(): void {
  createTool(
    referenceVisualPreviewToolDocs[0].name,
    {
      ...referenceVisualPreviewToolDocs[0],
      async execute({
        session_root,
        manifest_path,
        include_image,
        max_source_bytes,
        max_dimension,
        transport_format,
        quality,
        max_transport_bytes,
      }) {
        const fs = nativeFs(
          "MCP compact Reference Visual inspection needs package read access."
        );
        const resolvedManifest =
          manifest_path ?? joinPath(session_root, "references/reference_manifest.json");
        assertInsideRoot(resolvedManifest, session_root);
        if (!fs.existsSync(resolvedManifest)) {
          throw new Error(`REFERENCE_MANIFEST_MISSING: ${resolvedManifest}`);
        }

        const manifest = readJsonFile<ReferenceManifest>(fs, resolvedManifest);
        const filename =
          manifest.reference_visual_lock?.filename ??
          manifest.package?.reference_visual ??
          (manifest.asset?.id
            ? `${manifest.asset.id}_reference_visual.png`
            : "reference_visual.png");
        const path = joinPath(session_root, `references/${filename}`);
        assertInsideRoot(path, session_root);
        if (!fs.existsSync(path)) {
          throw new Error(`REFERENCE_VISUAL_MISSING: ${path}`);
        }

        const raw = fs.readFileSync(path);
        const source = Buffer.isBuffer(raw) ? raw : Buffer.from(raw);
        if (source.byteLength > max_source_bytes) {
          throw new Error(
            `REFERENCE_VISUAL_SOURCE_TOO_LARGE: ${source.byteLength} bytes exceeds ${max_source_bytes}.`
          );
        }

        const actualHash = sha256(source);
        const expectedHash =
          manifest.reference_visual_lock?.sha256?.toLowerCase() ?? null;
        if (expectedHash && actualHash !== expectedHash) {
          throw new Error(
            `REFERENCE_VISUAL_HASH_MISMATCH: ${actualHash}; expected ${expectedHash}.`
          );
        }

        const preview = await createImageTransportPreview(
          source,
          sourceMimeType(filename, manifest.reference_visual_lock?.format),
          {
            maxDimension: max_dimension,
            format: transport_format as TransportImageFormat,
            quality,
            maxBytes: max_transport_bytes,
          }
        );

        const expectedWidth = manifest.reference_visual_lock?.width_px ?? null;
        const expectedHeight = manifest.reference_visual_lock?.height_px ?? null;
        if (expectedWidth && preview.sourceWidth !== expectedWidth) {
          throw new Error(
            `REFERENCE_VISUAL_WIDTH_MISMATCH: ${preview.sourceWidth}; expected ${expectedWidth}.`
          );
        }
        if (expectedHeight && preview.sourceHeight !== expectedHeight) {
          throw new Error(
            `REFERENCE_VISUAL_HEIGHT_MISMATCH: ${preview.sourceHeight}; expected ${expectedHeight}.`
          );
        }

        const reduction =
          source.byteLength > 0
            ? 1 - preview.transportBytes / source.byteLength
            : 0;
        const cubeCount = typeof Cube !== "undefined" ? Cube.all.length : 0;
        const nextSafeOperation =
          cubeCount === 0
            ? "BUILD_PRIMARY_FORM_FROM_MANIFEST"
            : "capture_visual_feedback";
        const content: Array<
          | { type: "text"; text: string }
          | { type: "image"; data: string; mimeType: string }
        > = [
          {
            type: "text",
            text:
              `Approved Reference Visual verified: ${filename} ` +
              `(${preview.sourceWidth}×${preview.sourceHeight}, SHA-256 ${actualHash}). ` +
              `Returned bounded ${preview.mimeType} transport preview ` +
              `(${preview.width}×${preview.height}, ${preview.transportBytes} bytes; ` +
              `${Math.round(reduction * 100)}% smaller than source). ` +
              `Next safe operation: ${nextSafeOperation}.`,
          },
        ];
        if (include_image) {
          content.push({
            type: "image",
            data: preview.data.toString("base64"),
            mimeType: preview.mimeType,
          });
        }

        return {
          content,
          structuredContent: {
            status: "PASS",
            original_reference: {
              filename,
              path,
              sha256: actualHash,
              expected_sha256: expectedHash,
              width: preview.sourceWidth,
              height: preview.sourceHeight,
              bytes: source.byteLength,
              authority: "single_visual_source_of_truth",
            },
            next_safe_operation: nextSafeOperation,
            zero_start_geometry: cubeCount === 0,
            current_cube_count: cubeCount,
            reference_cache_key: actualHash,
            transport_preview: {
              returned_image: include_image,
              mime_type: preview.mimeType,
              width: preview.width,
              height: preview.height,
              bytes: preview.transportBytes,
              estimated_base64_bytes: preview.base64Bytes,
              quality: preview.quality,
              attempts: preview.attempts,
              downscaled: preview.downscaled,
              max_transport_bytes,
              ephemeral: true,
              image_generation_count_impact: 0,
            },
          },
        };
      },
    },
    referenceVisualPreviewToolDocs[0].status
  );
}
