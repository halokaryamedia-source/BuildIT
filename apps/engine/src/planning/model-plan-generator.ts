import type { ModelJob } from "../domain/job.js";
import type { OllamaProvider } from "../providers/ollama.js";
import type { ImageAnalysis } from "../vision/image-analysis.js";
import { getProjectTypeInstructions } from "../domain/project-type.js";
import { createFallbackPlan, ModelPlanSchema, type ModelPlan } from "./model-plan.js";

function extractJson(raw: string): unknown {
  const trimmed = raw.trim();
  if (trimmed.startsWith("{")) return JSON.parse(trimmed);

  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Planner response did not contain JSON.");
  }

  return JSON.parse(trimmed.slice(start, end + 1));
}

function resolveProjectType(format: string): "bedrock_entity" | "bedrock_block" {
  return format === "bedrock_block" ? "bedrock_block" : "bedrock_entity";
}

function resolvePlanFormat(format: string): "bedrock" | "bedrock_block" {
  return format === "bedrock_block" ? "bedrock_block" : "bedrock";
}

export async function generateModelPlan(
  job: ModelJob,
  analysis: ImageAnalysis | null,
  planner: OllamaProvider
): Promise<ModelPlan> {
  const planFormat = resolvePlanFormat(job.input.format);
  const projectType = resolveProjectType(planFormat);

  const prompt = [
    "Create a structured Blockbench model plan for a Minecraft Bedrock project.",
    getProjectTypeInstructions(projectType),
    "Return only valid JSON with these fields: name, format, groups, parts.",
    "format must be either bedrock or bedrock_block and must match the requested target.",
    "parts must contain cube parts with name, group, from, to, and material.",
    "For Bedrock Block, the result must be a placeable Minecraft custom block, not an entity.",
    "For Bedrock Entity, the result must be an entity model, not a placeable block.",
    "User prompt: " + job.input.prompt,
    "Vision analysis: " + JSON.stringify(analysis ?? {}, null, 2)
  ].join("\n");

  try {
    const raw = await planner.chat([{ role: "user", content: prompt }]);
    const parsed = extractJson(raw);
    const modelPlan = ModelPlanSchema.parse(parsed);

    if (modelPlan.format !== planFormat) {
      return { ...modelPlan, format: planFormat };
    }

    return modelPlan;
  } catch {
    return createFallbackPlan(job.input.prompt, planFormat);
  }
}
