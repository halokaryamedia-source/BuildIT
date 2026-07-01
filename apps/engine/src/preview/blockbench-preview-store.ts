import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

export interface BlockbenchPreviewValidationIssue {
  severity: "error" | "warning";
  code: string;
  message: string;
}

export interface BlockbenchPreviewValidationReport {
  valid: boolean;
  imageMimeType?: string;
  estimatedImageBytes?: number;
  issues: BlockbenchPreviewValidationIssue[];
}

export interface BlockbenchPreviewReport {
  capturedAt: string;
  toolName: string;
  hasImageDataUrl: boolean;
  imageDataUrl?: string;
  validation: BlockbenchPreviewValidationReport;
  rawResult: unknown;
}

function findImageDataUrl(value: unknown): string | undefined {
  if (typeof value === "string") {
    return value.startsWith("data:image/") ? value : undefined;
  }

  if (Array.isArray(value)) {
    for (const candidate of value) {
      const found = findImageDataUrl(candidate);
      if (found) return found;
    }
  }

  if (!value || typeof value !== "object") return undefined;

  for (const candidate of Object.values(value as Record<string, unknown>)) {
    const found = findImageDataUrl(candidate);
    if (found) return found;
  }

  return undefined;
}

function validateImageDataUrl(imageDataUrl: string | undefined): BlockbenchPreviewValidationReport {
  const issues: BlockbenchPreviewValidationIssue[] = [];

  if (!imageDataUrl) {
    return {
      valid: false,
      issues: [
        {
          severity: "error",
          code: "PREVIEW_IMAGE_MISSING",
          message: "Preview artifact does not contain an image data URL."
        }
      ]
    };
  }

  const match = imageDataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) {
    return {
      valid: false,
      issues: [
        {
          severity: "error",
          code: "PREVIEW_IMAGE_INVALID_DATA_URL",
          message: "Preview image is not a valid base64 image data URL."
        }
      ]
    };
  }

  const imageMimeType = match[1];
  const base64Payload = match[2];
  const estimatedImageBytes = Math.floor((base64Payload.length * 3) / 4);

  if (estimatedImageBytes < 256) {
    issues.push({
      severity: "warning",
      code: "PREVIEW_IMAGE_TOO_SMALL",
      message: "Preview image payload is very small and may not contain a useful render."
    });
  }

  if (estimatedImageBytes > 8 * 1024 * 1024) {
    issues.push({
      severity: "warning",
      code: "PREVIEW_IMAGE_LARGE",
      message: "Preview image payload is large and may slow artifact viewing."
    });
  }

  return {
    valid: !issues.some((issue) => issue.severity === "error"),
    imageMimeType,
    estimatedImageBytes,
    issues
  };
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
  const validation = validateImageDataUrl(imageDataUrl);
  const previewPath = join(jobDir, "blockbench_preview.json");

  const report: BlockbenchPreviewReport = {
    capturedAt: new Date().toISOString(),
    toolName,
    hasImageDataUrl: Boolean(imageDataUrl),
    imageDataUrl,
    validation,
    rawResult
  };

  await writeFile(previewPath, JSON.stringify(report, null, 2));

  return previewPath;
}
