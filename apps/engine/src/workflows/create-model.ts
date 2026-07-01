import { appendJobLog, setJobStatus, type ModelJob } from "../domain/job.js";
import { BlockbenchMcpClient } from "../mcp/blockbench-client.js";
import { OllamaProvider } from "../providers/ollama.js";
import { createFallbackPlan } from "../planning/model-plan.js";
import { modelPlanToToolActions } from "../planning/tool-actions.js";

export interface CreateModelWorkflowOptions {
  ollama: OllamaProvider;
  blockbench: BlockbenchMcpClient;
}

export async function runCreateModelWorkflow(job: ModelJob, options: CreateModelWorkflowOptions): Promise<ModelJob> {
  let currentJob = setJobStatus(job, "running");

  const isReady = await options.blockbench.health();
  if (!isReady) {
    return { ...setJobStatus(currentJob, "failed"), error: "Blockbench MCP is not connected." };
  }

  currentJob = appendJobLog(currentJob, "Blockbench MCP connected.");

  const plan = createFallbackPlan(job.input.prompt);
  const actions = modelPlanToToolActions(plan);

  for (const action of actions) {
    currentJob = appendJobLog(currentJob, "Running MCP tool: " + action.name);
    await options.blockbench.callTool(action);
  }

  currentJob = setJobStatus(currentJob, "completed");
  return appendJobLog(currentJob, "Model generation completed.");
}
