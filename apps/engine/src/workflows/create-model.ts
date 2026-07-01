import { appendJobLog, setJobStage, setJobStatus, type JobStage, type ModelJob } from "../domain/job.js";
import { BlockbenchMcpClient, type McpToolCall, type McpToolDefinition } from "../mcp/blockbench-client.js";
import { matchMcpActionsToSchemas } from "../mcp/mcp-action-schema-matcher.js";
import { saveMcpActionSchemaMatchReport } from "../mcp/mcp-action-schema-store.js";
import { splitMcpActionsByAvailability } from "../mcp/mcp-action-availability.js";
import { saveMcpActions } from "../mcp/mcp-action-store.js";
import { adaptMcpActionArgumentShapes } from "../mcp/mcp-argument-shape-adapter.js";
import { saveMcpArgumentShapeAdaptationReport } from "../mcp/mcp-argument-shape-store.js";
import { buildBlockbenchToolActionsFromGeometry } from "../mcp/blockbench-tool-adapter.js";
import { createFailedMcpCapabilityReport, evaluateMcpCapabilities, type McpCapabilityReport } from "../mcp/mcp-capabilities.js";
import { saveMcpCapabilityReport } from "../mcp/mcp-capability-store.js";
import { buildMcpExecutionPlan } from "../mcp/mcp-execution-plan.js";
import { saveMcpExecutionPlanReport } from "../mcp/mcp-execution-plan-store.js";
import { buildMcpGeometry } from "../mcp/mcp-geometry-planner.js";
import { saveMcpGeometryReport } from "../mcp/mcp-geometry-store.js";
import { applyMcpMaterialPlaceholders } from "../mcp/mcp-material-planner.js";
import { saveMcpMaterialPlanReport } from "../mcp/mcp-material-store.js";
import { mapMcpActionToolNames, resolveMcpToolNameMappings } from "../mcp/mcp-tool-name-mapping.js";
import { saveMcpToolNameMappingReport } from "../mcp/mcp-tool-name-mapping-store.js";
import { saveMcpToolSchemaReport } from "../mcp/mcp-tool-schema-store.js";
import { generateModelPlan } from "../planning/model-plan-generator.js";
import { saveModelPlan } from "../planning/model-plan-store.js";
import { saveModelPlanValidation } from "../planning/model-plan-validation-store.js";
import { validateModelPlan } from "../planning/model-plan-validation.js";
import { OllamaProvider } from "../providers/ollama.js";
import { saveImageAnalysis } from "../vision/image-analysis-store.js";
import type { ImageAnalysis } from "../vision/image-analysis.js";
import { analyzeReferenceImages } from "../vision/reference-image-analyzer.js";
import { runMcpExecution } from "./mcp-execution-runner.js";

export interface CreateModelWorkflowOptions {
  ollama: OllamaProvider;
  vision: OllamaProvider;
  blockbench: BlockbenchMcpClient;
  outputDir: string;
  onProgress?: (job: ModelJob) => void | Promise<void>;
}

async function reportProgress(job: ModelJob, options: CreateModelWorkflowOptions): Promise<ModelJob> {
  await options.onProgress?.(job);
  return job;
}

async function enterStage(job: ModelJob, stage: JobStage, options: CreateModelWorkflowOptions): Promise<ModelJob> {
  return reportProgress(setJobStage(job, stage), options);
}

async function failJob(currentJob: ModelJob, message: string, options: CreateModelWorkflowOptions): Promise<ModelJob> {
  return reportProgress(
    {
      ...setJobStatus(currentJob, "failed"),
      error: message
    },
    options
  );
}

export async function runCreateModelWorkflow(job: ModelJob, options: CreateModelWorkflowOptions): Promise<ModelJob> {
  let currentJob = await reportProgress(setJobStatus(job, "running"), options);
  let imageAnalysis: ImageAnalysis | null = null;

  currentJob = await enterStage(currentJob, "analyzing_image", options);
  if (currentJob.input.imagePaths.length > 0) {
    currentJob = await reportProgress(appendJobLog(currentJob, "Analyzing reference image input."), options);
    imageAnalysis = await analyzeReferenceImages(currentJob, options.vision);
    const analysisPath = await saveImageAnalysis(currentJob.id, imageAnalysis, options.outputDir);
    currentJob = await reportProgress(appendJobLog(currentJob, "Reference image analysis saved to " + analysisPath + "."), options);
  } else {
    currentJob = await reportProgress(
      appendJobLog(currentJob, "Skipping vision analysis because no reference image was provided."),
      options
    );
  }

  currentJob = await enterStage(currentJob, "planning_model", options);
  currentJob = await reportProgress(
    appendJobLog(currentJob, "Generating typed model plan for format " + currentJob.input.format + "."),
    options
  );
  const plan = await generateModelPlan(currentJob, imageAnalysis, options.ollama);
  const planPath = await saveModelPlan(currentJob.id, plan, options.outputDir);
  currentJob = await reportProgress(appendJobLog(currentJob, "Model plan saved to " + planPath + "."), options);

  currentJob = await enterStage(currentJob, "validating_plan", options);
  const validationReport = validateModelPlan(plan);
  const validationPath = await saveModelPlanValidation(currentJob.id, validationReport, options.outputDir);
  currentJob = await reportProgress(
    appendJobLog(currentJob, "Model plan validation saved to " + validationPath + "."),
    options
  );

  if (!validationReport.valid) {
    return failJob(currentJob, "Model plan validation failed. Review model_plan_validation.json for details.", options);
  }

  currentJob = await reportProgress(
    appendJobLog(
      currentJob,
      validationReport.issues.length > 0
        ? "Model plan validation completed with " + validationReport.issues.length + " warning(s)."
        : "Model plan validation completed with no issues."
    ),
    options
  );

  currentJob = await enterStage(currentJob, "building_mcp_actions", options);
  const materializedGeometry = applyMcpMaterialPlaceholders(buildMcpGeometry(plan));
  const materialPath = await saveMcpMaterialPlanReport(currentJob.id, materializedGeometry.materialPlan, options.outputDir);
  currentJob = await reportProgress(appendJobLog(currentJob, "MCP material plan saved to " + materialPath + "."), options);

  const geometryReport = materializedGeometry.geometry;
  const geometryPath = await saveMcpGeometryReport(currentJob.id, geometryReport, options.outputDir);
  currentJob = await reportProgress(appendJobLog(currentJob, "MCP geometry plan saved to " + geometryPath + "."), options);

  if (!geometryReport.valid) {
    return failJob(currentJob, "MCP geometry planning failed. Review mcp_geometry_plan.json for details.", options);
  }

  const adapterResult = buildBlockbenchToolActionsFromGeometry(plan, geometryReport);
  const actionsPath = await saveMcpActions(
    currentJob.id,
    {
      createdAt: new Date().toISOString(),
      valid: adapterResult.valid,
      format: adapterResult.format,
      actionCount: adapterResult.actions.length,
      issues: adapterResult.issues,
      actions: adapterResult.actions
    },
    options.outputDir
  );
  currentJob = await reportProgress(appendJobLog(currentJob, "MCP action list saved to " + actionsPath + "."), options);

  if (!adapterResult.valid) {
    return failJob(currentJob, "MCP tool adapter validation failed. Review mcp_actions.json for details.", options);
  }

  currentJob = await reportProgress(
    appendJobLog(
      currentJob,
      adapterResult.issues.length > 0
        ? "MCP tool adapter completed with " + adapterResult.issues.length + " warning(s)."
        : "MCP tool adapter completed with no issues."
    ),
    options
  );

  currentJob = await enterStage(currentJob, "checking_mcp_capabilities", options);
  const isReady = await options.blockbench.health();
  if (!isReady) {
    return failJob(currentJob, "Blockbench MCP is not connected.", options);
  }

  currentJob = await reportProgress(appendJobLog(currentJob, "Blockbench MCP connected."), options);

  let availableTools: McpToolDefinition[] = [];
  let capabilityReport: McpCapabilityReport;
  let toolNameMappingReport = resolveMcpToolNameMappings([]);
  try {
    availableTools = await options.blockbench.listTools();
    const schemaPath = await saveMcpToolSchemaReport(currentJob.id, availableTools, options.outputDir);
    currentJob = await reportProgress(appendJobLog(currentJob, "MCP tool schema saved to " + schemaPath + "."), options);

    toolNameMappingReport = resolveMcpToolNameMappings(availableTools);
    const mappingPath = await saveMcpToolNameMappingReport(currentJob.id, toolNameMappingReport, options.outputDir);
    currentJob = await reportProgress(appendJobLog(currentJob, "MCP tool name mapping saved to " + mappingPath + "."), options);

    capabilityReport = evaluateMcpCapabilities(availableTools);
  } catch (error) {
    capabilityReport = createFailedMcpCapabilityReport(error);
  }

  const capabilityPath = await saveMcpCapabilityReport(currentJob.id, capabilityReport, options.outputDir);
  currentJob = await reportProgress(appendJobLog(currentJob, "MCP capability report saved to " + capabilityPath + "."), options);

  if (!capabilityReport.valid) {
    return failJob(currentJob, "Blockbench MCP required tools are missing. Review mcp_capabilities.json for details.", options);
  }

  currentJob = await reportProgress(appendJobLog(currentJob, "Blockbench MCP capability check passed."), options);

  const mappedActions = mapMcpActionToolNames(adapterResult.actions, toolNameMappingReport);
  const actionAvailability = splitMcpActionsByAvailability(
    mappedActions,
    toolNameMappingReport,
    capabilityReport.missingOptionalTools
  );

  if (actionAvailability.skippedActions.length > 0) {
    currentJob = await reportProgress(
      appendJobLog(
        currentJob,
        "Skipping " + actionAvailability.skippedActions.length + " optional MCP action(s) before schema matching."
      ),
      options
    );
  }

  const argumentShapeReport = adaptMcpActionArgumentShapes(
    actionAvailability.executableActions,
    availableTools,
    toolNameMappingReport
  );
  const argumentShapePath = await saveMcpArgumentShapeAdaptationReport(currentJob.id, argumentShapeReport, options.outputDir);
  currentJob = await reportProgress(
    appendJobLog(currentJob, "MCP argument shape adaptation report saved to " + argumentShapePath + "."),
    options
  );

  if (!argumentShapeReport.valid) {
    return failJob(currentJob, "MCP argument shape adaptation failed. Review mcp_argument_shape_adaptation.json for details.", options);
  }

  const adaptedActions = argumentShapeReport.actions.map((action) => action.adapted);
  const schemaMatchReport = matchMcpActionsToSchemas(adaptedActions, availableTools);
  const schemaMatchPath = await saveMcpActionSchemaMatchReport(currentJob.id, schemaMatchReport, options.outputDir);
  currentJob = await reportProgress(
    appendJobLog(currentJob, "MCP action schema match report saved to " + schemaMatchPath + "."),
    options
  );

  if (!schemaMatchReport.valid) {
    return failJob(currentJob, "MCP action schema matching failed. Review mcp_action_schema_match.json for details.", options);
  }

  const executionActions: McpToolCall[] = schemaMatchReport.actions.map((action) => action.normalized);
  const executionPlan = buildMcpExecutionPlan(executionActions, toolNameMappingReport, capabilityReport.missingOptionalTools ?? []);
  const executionPlanPath = await saveMcpExecutionPlanReport(currentJob.id, executionPlan, options.outputDir);
  currentJob = await reportProgress(appendJobLog(currentJob, "MCP execution plan saved to " + executionPlanPath + "."), options);

  return runMcpExecution(currentJob, executionActions, {
    blockbench: options.blockbench,
    outputDir: options.outputDir,
    adapterFormat: adapterResult.format,
    toolNameMappingReport,
    missingOptionalTools: capabilityReport.missingOptionalTools,
    skippedActions: actionAvailability.skippedActions,
    onProgress: options.onProgress
  });
}
