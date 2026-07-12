import { getAllToolDefinitions, type ToolContext } from "@/lib/factories";
import {
  assertInsideRoot,
  readJsonFile,
} from "@/lib/atomicFiles";
import {
  assertCurrentStageReport,
  joinSessionPath,
  type EvidenceStage,
  type ExtendedFs,
} from "@/lib/stageEvidence";

interface RegisteredTool {
  execute?: (
    args: Record<string, unknown>,
    context?: ToolContext
  ) => Promise<any>;
}

const supportedStages = new Set<EvidenceStage>([
  "TEXTURE",
  "ANIMATION",
  "FINAL_VALIDATION",
]);

let installed = false;

function nativeFs(): ExtendedFs {
  // @ts-ignore Blockbench runtime permission API.
  const fs = requireNativeModule("fs", {
    message: "Stage approval freshness needs current state and evidence access.",
    optional: false,
  });
  if (!fs) throw new Error("Filesystem access was denied.");
  return fs as ExtendedFs;
}

function reportResult(report: Record<string, any>): string | null {
  const value =
    report.result ??
    report.status ??
    report.final_result ??
    report.validation?.status ??
    report.summary?.result;
  return typeof value === "string" ? value.toUpperCase() : null;
}

export function installStageCompletionFreshnessGuards(): void {
  if (installed) return;
  const definitions = getAllToolDefinitions() as Record<string, RegisteredTool>;
  const completion = definitions.complete_stage;
  const validation = definitions.validate_reference_contract;
  if (!completion?.execute || !validation?.execute) return;

  const execute = completion.execute;
  const executeValidation = validation.execute;
  completion.execute = async (args, context) => {
    const stage = String(args.stage ?? "") as EvidenceStage;
    if (!supportedStages.has(stage)) return execute(args, context);
    if (!Project) throw new Error("No Blockbench project is open.");

    const root =
      typeof args.session_root === "string" ? args.session_root : null;
    const expectedUuid =
      typeof args.expected_project_uuid === "string"
        ? args.expected_project_uuid
        : null;
    if (!root || !expectedUuid) {
      throw new Error("STAGE_COMPLETION_CONTEXT_MISSING");
    }

    const fs = nativeFs();
    const statePath = joinSessionPath(root, "state.json");
    assertInsideRoot(statePath, root);
    const state = readJsonFile<Record<string, any>>(fs, statePath);
    const stageRecord = state.workflow?.stage_records?.[stage] ?? {};
    const { report } = assertCurrentStageReport({
      fs,
      root,
      stage,
      projectUuid: expectedUuid,
      stageRecord,
    });
    if (reportResult(report) !== "PASS") {
      throw new Error(
        `STAGE_REPORT_NOT_PASS: current ${stage} report is ${reportResult(report) ?? "MISSING"}.`
      );
    }

    const validationResult = await executeValidation(
      {
        session_root: root,
        expected_project_uuid: expectedUuid,
        stage,
        dimension_tolerance_units: 1,
        require_evidence: true,
      },
      context
    );
    if (validationResult?.structuredContent?.result !== "PASS") {
      const codes = Array.isArray(validationResult?.structuredContent?.issues)
        ? validationResult.structuredContent.issues
            .map((issue: any) => issue?.code)
            .filter(Boolean)
            .join(", ")
        : "unknown";
      throw new Error(
        `STAGE_VALIDATION_NOT_PASS: ${validationResult?.structuredContent?.result ?? "UNKNOWN"}; ${codes}`
      );
    }

    const result = await execute(args, context);
    if (result?.structuredContent && typeof result.structuredContent === "object") {
      result.structuredContent.fresh_validation =
        validationResult.structuredContent;
      result.structuredContent.project_content_signature =
        report.project_content_signature;
      result.structuredContent.evidence_hashes = report.evidence_hashes;
    }
    return result;
  };

  installed = true;
}
