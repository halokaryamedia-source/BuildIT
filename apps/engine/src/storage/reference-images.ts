import { mkdir, writeFile } from "node:fs/promises";
import { basename, extname, join } from "node:path";
import type { ReferenceImage } from "../domain/job.js";

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

function parseDataUrl(dataUrl: string): Buffer {
  const match = dataUrl.match(/^data:[^;]+;base64,(.+)$/);

  if (!match) {
    throw new Error("Invalid image data URL.");
  }

  return Buffer.from(match[1], "base64");
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
    const fileName = sanitizeFileName(upload.fileName);
    const buffer = parseDataUrl(upload.dataUrl);
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
