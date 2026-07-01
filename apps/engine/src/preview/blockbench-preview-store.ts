import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

export interface BlockbenchPreviewReport {
  capturedAt: string;
  toolName: string;
  hasImageDataUrl: boolean;
  imageDataUrl?: string;
  rawResult: unknown;
}

function findImageDataUrl(value: unknown): string | undefined {
  if (typeof value === "string") {
    return value.startsWith("data:image/") ? value : undefined;
  }

  if (!value || typeof value !== "object") return undefined;

  for (const candidate of Object.values(value as Record<string, unknown>)) {
    const found = findImageDataUrl(candidate);
    if (found) return found;
  }

  return undefined;
}

export async function saveBlockbenchPreview(
  jobId: string,
  toolName: string,
  rawResult: unknown,
  outputRoot: string
): Promise<string> {
  const jobDir = join(outputRoot, "jobs", jobId);
  await mkdir(jobDir, { recursive: true });

  const imageDataUrl = findImageDataUrl(rawResult);
  const previewPath = join(jobDir, "blockbench_preview.json");

  const report: BlockbenchPreviewReport = {
    capturedAt: new Date().toISOString(),
    toolName,
    hasImageDataUrl: Boolean(imageDataUrl),
    imageDataUrl,
    rawResult
  };

  await writeFile(previewPath, JSON.stringify(report, null, 2));

  return previewPath;
}
