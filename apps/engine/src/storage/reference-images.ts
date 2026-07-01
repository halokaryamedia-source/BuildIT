import { mkdir, writeFile } from "node:fs/promises";
import { basename, extname, join } from "node:path";
import type { ReferenceImage } from "../domain/job.js";

export const maxReferenceImageBytes = 10 * 1024 * 1024;

export interface ReferenceImageUpload {
  fileName: string;
  mimeType: string;
  dataUrl: string;
}

function sanitizeFileName(fileName: string): string {
  const extension = extname(fileName).toLowerCase();
  const rawName = basename(fileName, extension)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return (rawName || "reference") + (extension || ".png");
}

function assertImageMimeType(mimeType: string): void {
  if (!mimeType.startsWith("image/")) {
    throw new Error("Reference upload must be an image file.");
  }
}

function parseDataUrl(dataUrl: string, expectedMimeType: string): Buffer {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);

  if (!match) {
    throw new Error("Invalid image data URL.");
  }

  const actualMimeType = match[1];
  if (actualMimeType !== expectedMimeType) {
    throw new Error("Image data URL MIME type does not match the uploaded file MIME type.");
  }

  return Buffer.from(match[2], "base64");
}

function assertImageSize(buffer: Buffer): void {
  if (buffer.byteLength > maxReferenceImageBytes) {
    throw new Error("Reference image must be 10 MB or smaller.");
  }
}

export async function saveReferenceImages(
  jobId: string,
  uploads: ReferenceImageUpload[],
  outputRoot: string
): Promise<ReferenceImage[]> {
  if (uploads.length === 0) return [];

  const referenceDir = join(outputRoot, "jobs", jobId, "references");
  await mkdir(referenceDir, { recursive: true });

  const savedImages: ReferenceImage[] = [];

  for (const upload of uploads) {
    assertImageMimeType(upload.mimeType);
    const fileName = sanitizeFileName(upload.fileName);
    const buffer = parseDataUrl(upload.dataUrl, upload.mimeType);
    assertImageSize(buffer);
    const filePath = join(referenceDir, fileName);

    await writeFile(filePath, buffer);

    savedImages.push({
      fileName,
      mimeType: upload.mimeType,
      path: filePath,
      sizeBytes: buffer.byteLength
    });
  }

  return savedImages;
}
