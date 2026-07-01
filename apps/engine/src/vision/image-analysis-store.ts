import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { ImageAnalysis } from "./image-analysis.js";

export async function saveImageAnalysis(jobId: string, analysis: ImageAnalysis, outputRoot: string): Promise<string> {
  const jobDir = join(outputRoot, "jobs", jobId);
  await mkdir(jobDir, { recursive: true });

  const analysisPath = join(jobDir, "image_analysis.json");
  await writeFile(analysisPath, JSON.stringify(analysis, null, 2));

  return analysisPath;
}
