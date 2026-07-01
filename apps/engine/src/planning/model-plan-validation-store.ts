import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { ModelPlanValidationReport } from "./model-plan-validation.js";

export async function saveModelPlanValidation(
  jobId: string,
  report: ModelPlanValidationReport,
  outputRoot: string
): Promise<string> {
  const jobDir = join(outputRoot, "jobs", jobId);
  await mkdir(jobDir, { recursive: true });

  const reportPath = join(jobDir, "model_plan_validation.json");
  await writeFile(reportPath, JSON.stringify(report, null, 2));

  return reportPath;
}
