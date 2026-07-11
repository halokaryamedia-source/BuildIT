/// <reference types="three" />
/// <reference types="blockbench-types" />
import { z } from "zod";
import { createTool, getAllToolDefinitions, type ToolSpec } from "@/lib/factories";
import { STATUS_EXPERIMENTAL } from "@/lib/constants";
import { findTextureOrThrow } from "@/lib/util";
import {
  activateToolProfile,
  getToolProfileSnapshot,
} from "@/lib/toolProfiles";
import {
  assertInsideRoot,
  bufferFromDataUrl,
  readJsonFile,
  writeFileAtomically,
  writeJsonAtomically,
  type NativeFsLike,
} from "@/lib/atomicFiles";

const workflowStageEnum = z.enum([
  "GEOMETRY",
  "TEXTURE",
  "ANIMATION",
  "FINAL_VALIDATION",
]);

export const validateReferenceContractParameters = z.object({
  session_root: z.string().min(1).describe("Absolute SavedData/sessions/<asset> directory."),
  manifest_path: z.string().optional().describe("Optional absolute manifest path. Defaults to references/reference_manifest.json."),
  expected_project_uuid: z.string().optional(),
  stage: workflowStageEnum.optional().default("FINAL_VALIDATION"),
  dimension_tolerance_units: z.number().min(0).max(16).optional().default(1),
  require_evidence: z.boolean().optional().default(true),
});

export const saveTextureEvidenceParameters = z.object({
  texture_id: z.string().min(1).describe("Explicit texture UUID, ID, or name."),
  path: z.string().min(1).describe("Absolute PNG evidence output path."),
  metadata_path: z.string().optional().describe("Optional adjacent JSON metadata path."),
  session_root: z.string().min(1).describe("Absolute active asset-session root."),
  expected_project_uuid: z.string().optional(),
});

export const completeStageParameters = z.object({
  asset_id: z.string().regex(/^[a-z0-9_]+$/),
  session_root: z.string().min(1),
  stage: workflowStageEnum,
  expected_state_revision: z.number().int().min(0),
  expected_project_uuid: z.string().min(1),
  approval_ref: z.string().min(1),
  accepted_areas: z.array(z.string()).min(1),
});

export const workflowToolDocs: ToolSpec[] = [
  {
    name: "validate_reference_contract",
    description:
      "Runs one compact manifest/project/evidence/Blockbench validation pass and routes local failures to the smallest repair profile.",
    annotations: { title: "Validate Reference Contract", readOnlyHint: true, openWorldHint: true },
    parameters: validateReferenceContractParameters,
    status: STATUS_EXPERIMENTAL,
  },
  {
    name: "save_texture_evidence",
    description:
      "Writes one explicit texture to an atomic PNG evidence path with compact metadata, avoiding base64 round-trips through Codex.",
    annotations: { title: "Save Texture Evidence", destructiveHint: false, openWorldHint: true },
    parameters: saveTextureEvidenceParameters,
    status: STATUS_EXPERIMENTAL,
  },
  {
    name: "complete_stage",
    description:
      "After explicit user approval, verifies stage evidence, saves the approved checkpoint, updates state atomically, and activates the next exact tool profile.",
    annotations: { title: "Complete Stage", destructiveHint: true, openWorldHint: true },
    parameters: completeStageParameters,
    status: STATUS_EXPERIMENTAL,
  },
];

type Vec3 = [number, number, number];
type WorkflowStage = z.infer<typeof workflowStageEnum>;

interface ContractIssue {
  code: string;
  stage: WorkflowStage;
  severity: "BLOCKER" | "REVISION_REQUIRED" | "WARNING";
  message: string;
  recommended_profile: string | null;
}

interface ReferenceManifest {
  asset?: { id?: string; target?: string };
  package?: Record<string, string>;
  main_format?: {
    height_blocks?: number;
    width_blocks?: number;
    depth_blocks?: number;
    blockbench_units_per_block?: number;
  };
  geometry?: { hierarchy?: Record<string, unknown> };
  texturing?: {
    atlas?: string;
    pipeline?: string;
    pbr?: boolean;
  };
  animation?: {
    animation_ready?: boolean;
    required_clips?: string[];
    animations?: string[];
  };
}

function joinPath(root: string, relative: string): string {
  return `${root.replace(/[\\/]$/, "")}/${relative.replace(/^[\\/]/, "")}`;
}

function nativeFs(message: string): NativeFsLike {
  // @ts-ignore - requireNativeModule is a Blockbench runtime global.
  const fs = requireNativeModule("fs", { message });
  if (!fs) throw new Error("Filesystem access was denied.");
  return fs as NativeFsLike;
}

function currentFormatId(): string | null {
  return typeof Format !== "undefined"
    ? ((Format as unknown as { id?: string }).id ?? null)
    : null;
}

function getBounds(): { min: Vec3 | null; max: Vec3 | null; size: Vec3 | null } {
  const points: Vec3[] = [];
  for (const cube of Cube.all) {
    const from = cube.from as Vec3;
    const to = cube.to as Vec3;
    points.push(
      [Math.min(from[0], to[0]), Math.min(from[1], to[1]), Math.min(from[2], to[2])],
      [Math.max(from[0], to[0]), Math.max(from[1], to[1]), Math.max(from[2], to[2])]
    );
  }
  for (const mesh of Mesh.all) {
    const vertices = (mesh as unknown as { vertices?: Record<string, number[]> }).vertices;
    for (const vertex of Object.values(vertices ?? {})) {
      if (vertex.length >= 3) points.push([vertex[0], vertex[1], vertex[2]]);
    }
  }
  if (!points.length) return { min: null, max: null, size: null };
  const min: Vec3 = [Infinity, Infinity, Infinity];
  const max: Vec3 = [-Infinity, -Infinity, -Infinity];
  for (const point of points) {
    for (let axis = 0; axis < 3; axis++) {
      min[axis] = Math.min(min[axis], point[axis]);
      max[axis] = Math.max(max[axis], point[axis]);
    }
  }
  return { min, max, size: [max[0] - min[0], max[1] - min[1], max[2] - min[2]] };
}

function parseAtlas(value: unknown): [number, number] | null {
  if (typeof value !== "string") return null;
  const match = value.match(/^(\d+)\s*x\s*(\d+)$/i);
  return match ? [Number(match[1]), Number(match[2])] : null;
}

function profileForStage(stage: WorkflowStage, repair = false): string {
  const normal: Record<WorkflowStage, string> = {
    GEOMETRY: "BEDROCK_CUBOID_GEOMETRY",
    TEXTURE: "BEDROCK_CUBOID_TEXTURE",
    ANIMATION: "BEDROCK_CUBOID_ANIMATION",
    FINAL_VALIDATION: "FINAL_VALIDATION_READONLY",
  };
  const repairProfiles: Partial<Record<WorkflowStage, string>> = {
    GEOMETRY: "GEOMETRY_LOCAL_REPAIR",
    TEXTURE: "TEXTURE_LOCAL_REPAIR",
    ANIMATION: "ANIMATION_LOCAL_REPAIR",
  };
  return repair ? (repairProfiles[stage] ?? normal[stage]) : normal[stage];
}

function canonicalEvidence(sessionRoot: string, stage: WorkflowStage): string[] {
  const relative: Record<WorkflowStage, string[]> = {
    GEOMETRY: [
      "evidence/geometry/geometry_front.png",
      "evidence/geometry/geometry_left.png",
      "evidence/geometry/geometry_back.png",
      "evidence/geometry/geometry_top.png",
      "evidence/geometry/geometry_front_left_3_4.png",
      "evidence/geometry/geometry_report.json",
    ],
    TEXTURE: [
      "evidence/texture/texture_atlas.png",
      "evidence/texture/texture_front.png",
      "evidence/texture/texture_left.png",
      "evidence/texture/texture_back.png",
      "evidence/texture/texture_front_left_3_4.png",
      "evidence/texture/texture_report.json",
    ],
    ANIMATION: [
      "evidence/animation/animation_neutral_pose.png",
      "evidence/animation/animation_hierarchy.json",
      "evidence/animation/animation_pivots.json",
      "evidence/animation/animation_report.json",
    ],
    FINAL_VALIDATION: [
      "evidence/final/final_front.png",
      "evidence/final/final_left.png",
      "evidence/final/final_back.png",
      "evidence/final/final_top.png",
      "evidence/final/final_front_left_3_4.png",
      "evidence/final/final_texture_atlas.png",
      "evidence/final/validation_report.json",
      "evidence/final/completed_VALIDATION.md",
    ],
  };
  return relative[stage].map((path) => joinPath(sessionRoot, path));
}

function requiredReferenceFiles(manifest: ReferenceManifest): string[] {
  const canonical = [
    "PRODUCTION_CONTEXT.md",
    manifest.package?.reference_visual ?? manifest.package?.visual ?? "",
    manifest.package?.geometry ?? "GEOMETRY.md",
    manifest.package?.texturing ?? "TEXTURING.md",
    manifest.package?.animation ?? "ANIMATION.md",
    manifest.package?.validation ?? "VALIDATION.md",
    manifest.package?.codex_handoff ?? "CODEX_REFERENCE_HANDOFF.md",
    "reference_manifest.json",
  ];
  return Array.from(new Set(canonical.filter(Boolean)));
}

function stageCheckpoint(stage: WorkflowStage): { name: string; file: string; stateKey: string } {
  return {
    GEOMETRY: { name: "20_geometry_approved", file: "20_geometry_approved.bbmodel", stateKey: "geometry_approved" },
    TEXTURE: { name: "40_texture_approved", file: "40_texture_approved.bbmodel", stateKey: "texture_approved" },
    ANIMATION: { name: "60_animation_approved", file: "60_animation_approved.bbmodel", stateKey: "animation_approved_or_skipped" },
    FINAL_VALIDATION: { name: "80_validation_pass", file: "80_validation_pass.bbmodel", stateKey: "validation_pass" },
  }[stage];
}

function expectedReviewState(stage: WorkflowStage): string {
  return {
    GEOMETRY: "GEOMETRY_REVIEW",
    TEXTURE: "TEXTURE_REVIEW",
    ANIMATION: "ANIMATION_REVIEW",
    FINAL_VALIDATION: "FINAL_REVIEW",
  }[stage];
}

function stageRecordKey(stage: WorkflowStage): string {
  return stage;
}

export function registerWorkflowTools() {
  createTool(
    workflowToolDocs[0].name,
    {
      ...workflowToolDocs[0],
      async execute({ session_root, manifest_path, expected_project_uuid, stage, dimension_tolerance_units, require_evidence }) {
        if (!Project) throw new Error("No Blockbench project is open.");
        if (expected_project_uuid && Project.uuid !== expected_project_uuid) {
          throw new Error(`PROJECT_UUID_MISMATCH: active ${Project.uuid}, expected ${expected_project_uuid}.`);
        }

        const fs = nativeFs("MCP validation needs read access to the active asset session.");
        const manifestPath = manifest_path ?? joinPath(session_root, "references/reference_manifest.json");
        assertInsideRoot(manifestPath, session_root);
        const manifest = readJsonFile<ReferenceManifest>(fs, manifestPath);
        const issues: ContractIssue[] = [];
        const add = (
          code: string,
          issueStage: WorkflowStage,
          severity: ContractIssue["severity"],
          message: string
        ) => issues.push({
          code,
          stage: issueStage,
          severity,
          message,
          recommended_profile: severity === "REVISION_REQUIRED" ? profileForStage(issueStage, true) : null,
        });

        for (const file of requiredReferenceFiles(manifest)) {
          const path = joinPath(session_root, `references/${file}`);
          if (!fs.existsSync(path)) add("REFERENCE_FILE_MISSING", stage, "BLOCKER", `Missing required reference file: ${file}`);
        }

        const formatId = currentFormatId();
        if (!formatId || !formatId.toLowerCase().includes("bedrock")) {
          add("FORMAT_MISMATCH", GEOMETRY_STAGE, "BLOCKER", `Active format ${formatId ?? "unknown"} is not Bedrock.`);
        }
        if (Project.box_uv) {
          add("UV_MODE_MISMATCH", "TEXTURE", "REVISION_REQUIRED", "Project uses Box UV; approved workflow expects Per-face UV.");
        }

        const expectedAtlas = parseAtlas(manifest.texturing?.atlas);
        if (expectedAtlas && (Project.texture_width !== expectedAtlas[0] || Project.texture_height !== expectedAtlas[1])) {
          add(
            "ATLAS_SIZE_MISMATCH",
            "TEXTURE",
            "REVISION_REQUIRED",
            `Project atlas ${Project.texture_width}x${Project.texture_height} differs from manifest ${expectedAtlas[0]}x${expectedAtlas[1]}.`
          );
        }

        if (manifest.texturing?.pbr === true || String(manifest.texturing?.pipeline ?? "").toLowerCase().includes("pbr")) {
          add("PBR_REFERENCE_CONFLICT", "TEXTURE", "BLOCKER", "Manifest requests PBR, which conflicts with the approved Classic Bedrock workflow.");
        }
        const pbrTextures = Texture.all.filter((texture) => Boolean((texture as unknown as { pbr_channel?: string }).pbr_channel));
        if (pbrTextures.length > 0) {
          add("PBR_TEXTURE_PRESENT", "TEXTURE", "REVISION_REQUIRED", `${pbrTextures.length} texture(s) use PBR channels.`);
        }

        const bounds = getBounds();
        const unitsPerBlock = manifest.main_format?.blockbench_units_per_block ?? 16;
        const expectedSize: Array<[number | undefined, number, string]> = [
          [manifest.main_format?.width_blocks, 0, "width"],
          [manifest.main_format?.height_blocks, 1, "height"],
          [manifest.main_format?.depth_blocks, 2, "depth"],
        ];
        if (!bounds.size) {
          add("EMPTY_GEOMETRY", "GEOMETRY", "BLOCKER", "Project has no cube or mesh geometry.");
        } else {
          for (const [blocks, axis, label] of expectedSize) {
            if (typeof blocks !== "number" || blocks <= 0) continue;
            const expected = blocks * unitsPerBlock;
            const actual = bounds.size[axis];
            if (Math.abs(actual - expected) > dimension_tolerance_units) {
              add(
                `DIMENSION_${label.toUpperCase()}_MISMATCH`,
                "GEOMETRY",
                "REVISION_REQUIRED",
                `${label} is ${actual} units; expected ${expected} ± ${dimension_tolerance_units}.`
              );
            }
          }
        }

        const hierarchyKeys = Object.keys(manifest.geometry?.hierarchy ?? {});
        const groupNames = new Set(Group.all.map((group) => group.name));
        for (const groupName of hierarchyKeys) {
          if (!groupNames.has(groupName)) {
            add("REQUIRED_GROUP_MISSING", "GEOMETRY", "REVISION_REQUIRED", `Required hierarchy group is missing: ${groupName}`);
          }
        }

        const animationNames = new Set(
          (((globalThis as unknown as { Animation?: { all?: Array<{ name: string }> } }).Animation?.all) ?? [])
            .map((animation) => animation.name)
        );
        const requiredAnimations = manifest.animation?.required_clips ?? manifest.animation?.animations ?? [];
        for (const animation of requiredAnimations) {
          if (!animationNames.has(animation)) {
            add("REQUIRED_ANIMATION_MISSING", "ANIMATION", "REVISION_REQUIRED", `Required animation is missing: ${animation}`);
          }
        }

        if (require_evidence) {
          for (const path of canonicalEvidence(session_root, stage)) {
            assertInsideRoot(path, session_root);
            if (!fs.existsSync(path)) add("EVIDENCE_MISSING", stage, "BLOCKER", `Missing stage evidence: ${path}`);
          }
        }

        const runtimeValidator = (globalThis as unknown as {
          Validator?: { validate?: (trigger?: string) => void; errors?: unknown[]; warnings?: unknown[] };
        }).Validator;
        runtimeValidator?.validate?.("manual");
        const validatorErrors = runtimeValidator?.errors?.length ?? 0;
        const validatorWarnings = runtimeValidator?.warnings?.length ?? 0;
        if (validatorErrors > 0) add("BLOCKBENCH_VALIDATOR_ERROR", stage, "REVISION_REQUIRED", `${validatorErrors} Blockbench validator error(s) remain.`);

        const result = issues.some((issue) => issue.severity === "BLOCKER")
          ? "BLOCKER"
          : issues.some((issue) => issue.severity === "REVISION_REQUIRED")
            ? "REVISION_REQUIRED"
            : "PASS";

        return {
          content: [{
            type: "text" as const,
            text: `Reference contract validation: ${result}. ${issues.length} issue(s), ${validatorWarnings} validator warning(s).`,
          }],
          structuredContent: {
            result,
            stage,
            project_uuid: Project.uuid,
            format: formatId,
            uv_mode: Project.box_uv ? "box" : "per_face",
            texture_size: [Project.texture_width, Project.texture_height],
            bounds,
            counts: {
              cubes: Cube.all.length,
              meshes: Mesh.all.length,
              groups: Group.all.length,
              textures: Texture.all.length,
              animations: animationNames.size,
            },
            blockbench_validator: { errors: validatorErrors, warnings: validatorWarnings },
            issues,
            next_profile: issues.find((issue) => issue.recommended_profile)?.recommended_profile ?? null,
          },
        };
      },
    },
    workflowToolDocs[0].status
  );

  createTool(
    workflowToolDocs[1].name,
    {
      ...workflowToolDocs[1],
      async execute({ texture_id, path, metadata_path, session_root, expected_project_uuid }) {
        if (!Project) throw new Error("No Blockbench project is open.");
        if (expected_project_uuid && Project.uuid !== expected_project_uuid) {
          throw new Error(`PROJECT_UUID_MISMATCH: active ${Project.uuid}, expected ${expected_project_uuid}.`);
        }
        if (!path.toLowerCase().endsWith(".png")) throw new Error("Texture evidence path must end with .png.");
        assertInsideRoot(path, session_root);
        const metadataPath = metadata_path ?? path.replace(/\.png$/i, ".json");
        assertInsideRoot(metadataPath, session_root);

        const texture = findTextureOrThrow(texture_id);
        const data = bufferFromDataUrl(texture.getDataURL());
        const { ctx } = texture.getActiveCanvas();
        let alphaPresent = false;
        try {
          const pixels = ctx.getImageData(0, 0, texture.width, texture.height).data;
          for (let index = 3; index < pixels.length; index += 4) {
            if (pixels[index] < 255) {
              alphaPresent = true;
              break;
            }
          }
        } catch {
          alphaPresent = false;
        }

        const fs = nativeFs(`MCP save_texture_evidence requested write access to ${path}`);
        writeFileAtomically(fs, path, data);
        const metadata = {
          schema_version: "1.0",
          texture: { name: texture.name, uuid: texture.uuid, id: texture.id },
          project_uuid: Project.uuid,
          path,
          width: texture.width,
          height: texture.height,
          byte_length: data.byteLength,
          alpha_present: alphaPresent,
          created_at: new Date().toISOString(),
        };
        writeJsonAtomically(fs, metadataPath, metadata);

        return {
          content: [{ type: "text" as const, text: `Saved texture evidence ${texture.name} to ${path}.` }],
          structuredContent: { status: "PASS", evidence: metadata, metadata_path: metadataPath },
        };
      },
    },
    workflowToolDocs[1].status
  );

  createTool(
    workflowToolDocs[2].name,
    {
      ...workflowToolDocs[2],
      async execute({ asset_id, session_root, stage, expected_state_revision, expected_project_uuid, approval_ref, accepted_areas }) {
        if (!Project) throw new Error("No Blockbench project is open.");
        if (Project.uuid !== expected_project_uuid) {
          throw new Error(`PROJECT_UUID_MISMATCH: active ${Project.uuid}, expected ${expected_project_uuid}.`);
        }

        const fs = nativeFs("MCP complete_stage needs asset-session write access.");
        const statePath = joinPath(session_root, "state.json");
        assertInsideRoot(statePath, session_root);
        const state = readJsonFile<Record<string, any>>(fs, statePath);
        if (state.asset?.id !== asset_id) throw new Error(`ASSET_ID_MISMATCH: state has ${state.asset?.id}, expected ${asset_id}.`);
        if (state.state_revision !== expected_state_revision) {
          throw new Error(`STATE_REVISION_MISMATCH: state is ${state.state_revision}, expected ${expected_state_revision}.`);
        }
        const requiredState = expectedReviewState(stage);
        if (state.workflow?.state !== requiredState) {
          throw new Error(`STAGE_STATE_MISMATCH: ${stage} approval requires ${requiredState}, found ${state.workflow?.state}.`);
        }

        const missingEvidence = canonicalEvidence(session_root, stage).filter((path) => !fs.existsSync(path));
        if (missingEvidence.length > 0) {
          throw new Error(`STAGE_EVIDENCE_MISSING: ${missingEvidence.join(", ")}`);
        }

        const checkpoint = stageCheckpoint(stage);
        const checkpointPath = joinPath(session_root, `checkpoints/${checkpoint.file}`);
        const checkpointTool = getAllToolDefinitions()["save_project_checkpoint"] as unknown as {
          execute: (args: Record<string, unknown>) => Promise<unknown>;
        };
        if (!checkpointTool) throw new Error("save_project_checkpoint is unavailable.");
        await checkpointTool.execute({
          asset_id,
          path: checkpointPath,
          session_root,
          checkpoint_name: checkpoint.name,
          stage,
          state: stage === "FINAL_VALIDATION" ? "DONE" : `${stage}_APPROVED`,
          expected_project_uuid,
          approved: true,
          approval_ref,
          source_state_revision: expected_state_revision,
          accepted_areas,
          open_issues: [],
        });

        const stageRecord = state.workflow.stage_records[stageRecordKey(stage)];
        const approvedAt = new Date().toISOString();
        stageRecord.status = "APPROVED";
        stageRecord.decision = "APPROVED";
        stageRecord.approved_at = approvedAt;
        stageRecord.approved_checkpoint = checkpointPath;
        stageRecord.accepted_areas = accepted_areas;
        stageRecord.open_issues = [];
        stageRecord.revision = null;
        state.checkpoints[checkpoint.stateKey] = checkpointPath;
        state.preservation.approved_stage_areas[stage] = accepted_areas;
        state.preservation.globally_protected_areas = Array.from(new Set([
          ...(state.preservation.globally_protected_areas ?? []),
          ...accepted_areas,
        ]));
        state.workflow.last_completed_stage = stage;
        state.workflow.last_safe_checkpoint = checkpointPath;

        let nextProfile = profileForStage(stage);
        let nextState = "DONE";
        let nextStage: WorkflowStage = "FINAL_VALIDATION";
        let nextAction = "WAIT_FOR_FINAL_HANDOFF";

        if (stage === "GEOMETRY") {
          nextProfile = "BEDROCK_CUBOID_TEXTURE";
          nextState = "TEXTURE_IN_PROGRESS";
          nextStage = "TEXTURE";
          nextAction = "START_TEXTURE";
          state.workflow.stage_records.TEXTURE.status = "IN_PROGRESS";
        } else if (stage === "TEXTURE") {
          if (state.workflow.animation_required) {
            nextProfile = "BEDROCK_CUBOID_ANIMATION";
            nextState = "ANIMATION_IN_PROGRESS";
            nextStage = "ANIMATION";
            nextAction = "START_ANIMATION";
            state.workflow.stage_records.ANIMATION.status = "IN_PROGRESS";
          } else {
            nextProfile = "FINAL_VALIDATION_READONLY";
            nextState = "FINAL_VALIDATION";
            nextStage = "FINAL_VALIDATION";
            nextAction = "RUN_FINAL_VALIDATION";
            state.workflow.stage_records.ANIMATION.status = "SKIPPED";
            state.workflow.stage_records.ANIMATION.decision = "SKIPPED";
            state.workflow.stage_records.ANIMATION.skip_reason = "Not required by approved reference package.";
            state.workflow.stage_records.FINAL_VALIDATION.status = "IN_PROGRESS";
          }
        } else if (stage === "ANIMATION") {
          nextProfile = "FINAL_VALIDATION_READONLY";
          nextState = "FINAL_VALIDATION";
          nextStage = "FINAL_VALIDATION";
          nextAction = "RUN_FINAL_VALIDATION";
          state.workflow.stage_records.FINAL_VALIDATION.status = "IN_PROGRESS";
        }

        const previousProfile = getToolProfileSnapshot(false).profile_id;
        const activation = activateToolProfile(nextProfile);
        try {
          const profile = activation.snapshot;
          state.workflow.state = nextState;
          state.workflow.active_stage = nextStage;
          state.workflow.status = nextState === "DONE" ? "DONE" : "IN_PROGRESS";
          state.workflow.next_action = nextAction;
          state.mcp.active_tool_profile = profile.profile_id;
          state.mcp.tool_profile_revision = profile.profile_revision;
          state.mcp.tool_profile_hash = profile.tool_profile_hash;
          state.mcp.exposed_tool_count = profile.exposed_tool_count;
          state.mcp.total_library_tool_count = profile.total_library_tool_count;
          state.mcp.profile_reconnect_required = activation.changed;
          state.state_revision = expected_state_revision + 1;
          state.updated_at = approvedAt;
          state.updated_by = "complete_stage";
          writeJsonAtomically(fs, statePath, state);
        } catch (error) {
          if (activation.changed) activateToolProfile(previousProfile);
          throw error;
        }

        return {
          content: [{
            type: "text" as const,
            text: `${stage} approved. Saved ${checkpoint.name}; next state ${nextState} with profile ${nextProfile}.`,
          }],
          structuredContent: {
            status: "PASS",
            completed_stage: stage,
            checkpoint: checkpointPath,
            state_revision: expected_state_revision + 1,
            next_state: nextState,
            next_stage: nextStage,
            next_profile: nextProfile,
            reconnect_required: activation.changed,
            next_action: activation.changed
              ? "Reconnect the existing canonical blockbench MCP entry once, then call get_runtime_status."
              : nextAction,
          },
        };
      },
    },
    workflowToolDocs[2].status
  );
}

const GEOMETRY_STAGE: WorkflowStage = "GEOMETRY";
