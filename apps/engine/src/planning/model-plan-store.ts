import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { ModelPlan } from "./model-plan.js";

export async function saveModelPlan(jobId: string, modelPlan: ModelPlan, outputRoot: string): Promise<string> {
  const jobDir = join(outputRoot, "jobs", jobId);
  await mkdir(jobDir, { recursive: true });

  const planPath = join(jobDir, "model_plan.json");
  await writeFile(planPath, JSON.stringify(modelPlan, null, 2));

  return planPath;
}
