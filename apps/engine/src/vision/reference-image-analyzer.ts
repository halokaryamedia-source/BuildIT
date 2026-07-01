import { readFile } from "node:fs/promises";
import type { ModelJob } from "../domain/job.js";
import type { OllamaProvider } from "../providers/ollama.js";
import { createFallbackImageAnalysis, ImageAnalysisSchema, type ImageAnalysis } from "./image-analysis.js";

function extractJson(raw: string): unknown {
  const trimmed = raw.trim();
  if (trimmed.startsWith("{")) return JSON.parse(trimmed);

  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Vision response did not contain JSON.");
  }

  return JSON.parse(trimmed.slice(start, end + 1));
}

async function readImageBase64(path: string): Promise<string> {
  const buffer = await readFile(path);
  return buffer.toString("base64");
}

export async function analyzeReferenceImages(job: ModelJob, vision: OllamaProvider): Promise<ImageAnalysis> {
  if (job.input.imagePaths.length === 0) {
    return createFallbackImageAnalysis(job.input.prompt);
  }

  const images = await Promise.all(job.input.imagePaths.slice(0, 1).map((path) => readImageBase64(path)));

  const prompt = [
    "Analyze the attached reference image for Minecraft-style voxel modeling.",
    "Return only valid JSON with these fields:",
    "objectType, summary, visibleParts, shapeNotes, colorPalette, materialHints, modelingPriorities, risks.",
    "All list fields must be arrays of short strings.",
    "User prompt: " + job.input.prompt
  ].join("\n");

  try {
    const raw = await vision.chat([{ role: "user", content: prompt, images }]);
    const parsed = extractJson(raw);
    return ImageAnalysisSchema.parse(parsed);
  } catch {
    return createFallbackImageAnalysis(job.input.prompt);
  }
}
