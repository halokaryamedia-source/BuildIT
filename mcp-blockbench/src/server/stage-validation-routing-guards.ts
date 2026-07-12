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

function normalize(result: any): void {
  const structured = result?.structuredContent;
  if (!structured || typeof structured !== "object") return;

  let firstRevisionStage: string | null = null;
  if (Array.isArray(structured.issues)) {
    for (const issue of structured.issues) {
      if (
        !issue ||
        typeof issue !== "object" ||
        issue.severity !== "REVISION_REQUIRED"
      ) {
        continue;
      }
      const stage = String(issue.stage ?? structured.stage ?? "");
      const profile = stageProfiles[stage];
      if (!profile) continue;
      firstRevisionStage ??= stage;
      issue.recommended_profile = profile;
      issue.recommended_scope = scope(stage);
      issue.profile_switch_required = false;
      issue.reconnect_required = false;
    }
  }

  const topStage = String(structured.stage ?? "");
  const topProfile = stageProfiles[topStage];
  const selectedRemovedProfile = removedProfiles.has(
    String(structured.next_profile ?? "")
  );
  const topLevelRevision =
    structured.result === "REVISION_REQUIRED" && Boolean(topProfile);
  const routedStage = topLevelRevision ? topStage : firstRevisionStage;
  const routedProfile = routedStage ? stageProfiles[routedStage] : null;

  if (!routedProfile && !selectedRemovedProfile) return;

  const effectiveStage = routedStage ?? topStage;
  const effectiveProfile =
    routedProfile ?? stageProfiles[effectiveStage] ?? null;
  if (!effectiveProfile) return;

  structured.next_profile = effectiveProfile;
  structured.revision_route = {
    stage: effectiveStage,
    profile: effectiveProfile,
    scope: scope(effectiveStage),
    prepare_tool:
      effectiveStage === "GEOMETRY"
        ? "prepare_geometry_visual_rebuild"
        : "prepare_stage_revision",
    profile_switch_required: false,
    reconnect_required: false,
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
