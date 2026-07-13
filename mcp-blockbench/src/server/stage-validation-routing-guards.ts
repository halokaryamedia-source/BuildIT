import { getAllToolDefinitions, type ToolContext } from "@/lib/factories";

interface RegisteredTool {
  execute?: (
    args: Record<string, unknown>,
    context?: ToolContext
  ) => Promise<any>;
}

const stageProfiles: Record<string, string> = {
  GEOMETRY: "BEDROCK_CUBOID_GEOMETRY",
  TEXTURE: "BEDROCK_CUBOID_TEXTURE",
  ANIMATION: "BEDROCK_CUBOID_ANIMATION",
  FINAL_VALIDATION: "FINAL_VALIDATION_READONLY",
};

const stageOrder = [
  "GEOMETRY",
  "TEXTURE",
  "ANIMATION",
  "FINAL_VALIDATION",
];

const removedProfiles = new Set([
  "GEOMETRY_LOCAL_REPAIR",
  "GEOMETRY_VISUAL_REBUILD",
  "TEXTURE_LOCAL_REPAIR",
  "ANIMATION_LOCAL_REPAIR",
]);

let installed = false;

function scope(stage: string): string {
  return stage === "GEOMETRY"
    ? "CLASSIFY_WITH_ANALYZE_GEOMETRY_VIEWS"
    : "TARGETED_STAGE_REVISION";
}

function earlierThan(candidate: string, current: string): boolean {
  const candidateIndex = stageOrder.indexOf(candidate);
  const currentIndex = stageOrder.indexOf(current);
  return candidateIndex >= 0 && currentIndex >= 0 && candidateIndex < currentIndex;
}

function earliest(stages: string[]): string | null {
  return stages
    .filter((stage) => stageProfiles[stage])
    .sort((a, b) => stageOrder.indexOf(a) - stageOrder.indexOf(b))[0] ?? null;
}

function normalize(result: any): void {
  const structured = result?.structuredContent;
  if (!structured || typeof structured !== "object") return;

  const currentStage = String(structured.stage ?? "");
  const revisionStages: string[] = [];

  if (Array.isArray(structured.issues)) {
    for (const issue of structured.issues) {
      if (
        !issue ||
        typeof issue !== "object" ||
        issue.severity !== "REVISION_REQUIRED"
      ) {
        continue;
      }
      const issueStage = String(issue.stage ?? currentStage);
      const profile = stageProfiles[issueStage];
      if (!profile) continue;
      revisionStages.push(issueStage);
      const upstream = earlierThan(issueStage, currentStage);
      issue.recommended_profile = profile;
      issue.recommended_scope = scope(issueStage);
      issue.prepare_tool = upstream
        ? "reopen_stage_for_revision"
        : issueStage === "GEOMETRY"
          ? "prepare_geometry_visual_rebuild"
          : "prepare_stage_revision";
      issue.profile_switch_required = upstream;
      issue.reconnect_required = false;
      issue.current_session_continues = true;
    }
  }

  const currentProfile = stageProfiles[currentStage];
  const topLevelRevision =
    structured.result === "REVISION_REQUIRED" && Boolean(currentProfile);
  if (topLevelRevision && revisionStages.length === 0) {
    revisionStages.push(currentStage);
  }

  const selectedRemovedProfile = removedProfiles.has(
    String(structured.next_profile ?? "")
  );
  const affectedStage = earliest(revisionStages);
  if (!affectedStage && !selectedRemovedProfile) return;

  const targetStage = affectedStage ?? currentStage;
  const targetProfile = stageProfiles[targetStage];
  if (!targetProfile) return;

  const upstream = earlierThan(targetStage, currentStage);
  structured.next_profile = targetProfile;
  structured.revision_route = {
    current_stage: currentStage,
    target_stage: targetStage,
    profile: targetProfile,
    scope: scope(targetStage),
    prepare_tool: upstream
      ? "reopen_stage_for_revision"
      : targetStage === "GEOMETRY"
        ? "prepare_geometry_visual_rebuild"
        : "prepare_stage_revision",
    profile_switch_required: upstream,
    reconnect_required: false,
    current_session_continues: true,
    preserve_approved_checkpoints: upstream,
    downstream_revalidation_required: upstream,
  };
}

export function installStageValidationRoutingGuards(): void {
  if (installed) return;
  const definition = getAllToolDefinitions().validate_reference_contract as
    | RegisteredTool
    | undefined;
  if (!definition?.execute) return;

  const execute = definition.execute;
  definition.execute = async (args, context) => {
    const result = await execute(args, context);
    normalize(result);
    return result;
  };

  installed = true;
}
