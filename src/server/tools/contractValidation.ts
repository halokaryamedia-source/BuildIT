/// <reference types="three" />
/// <reference types="blockbench-types" />
import { z } from "zod";
import { createTool, type ToolSpec } from "@/lib/factories";
import { STATUS_STABLE } from "@/lib/constants";

type Vec3 = [number, number, number];
type ValidationIssue = {
  stage: "PROJECT" | "GEOMETRY" | "TEXTURE" | "ANIMATION" | "FINAL_VALIDATION";
  code: string;
  severity: "BLOCKER" | "REVISION_REQUIRED";
  message: string;
  local: boolean;
  recommended_profile: string;
};

declare const Validator: {
  errors: Array<{ message: string }>;
  warnings: Array<{ message: string }>;
  validate: (trigger?: string) => void;
};

export const validateReferenceContractParameters = z.object({
  expected_project_uuid: z.string().optional(),
  expected_format: z.string().optional().default("bedrock"),
  expected_uv_mode: z.enum(["box", "per_face"]).optional().default("per_face"),
  expected_texture_size: z.array(z.number().int().positive()).length(2).optional(),
  expected_dimensions_units: z.array(z.number()).length(3).optional().describe("Expected [width,height,depth] in Blockbench units."),
  dimension_tolerance_units: z.number().min(0).optional().default(0.5),
  required_groups: z.array(z.string()).optional().default([]),
  required_textures: z.array(z.string()).optional().default([]),
  required_animations: z.array(z.string()).optional().default([]),
  animation_required: z.boolean().optional().default(false),
  forbid_pbr: z.boolean().optional().default(true),
  check_uv_bounds: z.boolean().optional().default(true),
  run_blockbench_validator: z.boolean().optional().default(true),
});

export const contractValidationToolDocs: ToolSpec[] = [{
  name: "validate_reference_contract",
  description: "Runs one compact validation pass for project identity, dimensions, hierarchy, textures, UV bounds, Classic Bedrock material rules, animations, and Blockbench validator output.",
  annotations: { title: "Validate Reference Contract", readOnlyHint: true },
  parameters: validateReferenceContractParameters,
  status: STATUS_STABLE,
}];

function getBounds(): { min: Vec3; max: Vec3; size: Vec3 } | null {
  const points: Vec3[] = [];
  for (const cube of Cube.all) {
    points.push(
      [Math.min(cube.from[0], cube.to[0]), Math.min(cube.from[1], cube.to[1]), Math.min(cube.from[2], cube.to[2])],
      [Math.max(cube.from[0], cube.to[0]), Math.max(cube.from[1], cube.to[1]), Math.max(cube.from[2], cube.to[2])]
    );
  }
  for (const mesh of Mesh.all) {
    const vertices = (mesh as unknown as { vertices?: Record<string, number[]> }).vertices;
    if (!vertices) continue;
    for (const vertex of Object.values(vertices)) {
      const origin = (mesh.origin ?? [0, 0, 0]) as number[];
      points.push([
        Number(vertex[0] ?? 0) + Number(origin[0] ?? 0),
        Number(vertex[1] ?? 0) + Number(origin[1] ?? 0),
        Number(vertex[2] ?? 0) + Number(origin[2] ?? 0),
      ]);
    }
  }
  if (!points.length) return null;
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

function getFormatId(): string | null {
  const format = typeof Format !== "undefined" ? (Format as { id?: string }) : undefined;
  return format?.id ?? null;
}

function getAnimationNames(): string[] {
  const all = typeof Animation !== "undefined"
    ? ((Animation as unknown as { all?: Array<{ name?: string }> }).all ?? [])
    : [];
  return all.map((animation) => animation.name ?? "").filter(Boolean);
}

function getPbrMaterialCount(): number {
  const groups = typeof TextureGroup !== "undefined"
    ? ((TextureGroup as unknown as { all?: Array<{ is_material?: boolean }> }).all ?? [])
    : [];
  return groups.filter((group) => group.is_material === true).length;
}

function getUvOutOfBounds(): Array<{ cube: string; face: string; uv: number[] }> {
  if (!Project) return [];
  const width = Number(Project.texture_width ?? 0);
  const height = Number(Project.texture_height ?? 0);
  if (width <= 0 || height <= 0) return [];
  const failures: Array<{ cube: string; face: string; uv: number[] }> = [];
  for (const cube of Cube.all) {
    for (const [faceName, face] of Object.entries(cube.faces)) {
      if (!face || !Array.isArray(face.uv)) continue;
      const uv = [...face.uv].map(Number);
      if (uv.length >= 4 && (uv[0] < 0 || uv[1] < 0 || uv[2] < 0 || uv[3] < 0 || uv[0] > width || uv[2] > width || uv[1] > height || uv[3] > height)) {
        failures.push({ cube: cube.name, face: faceName, uv });
      }
    }
  }
  return failures;
}

export function registerContractValidationTools() {
  createTool(contractValidationToolDocs[0].name, {
    ...contractValidationToolDocs[0],
    async execute(params) {
      if (!Project) throw new Error("No Blockbench project is open.");

      const issues: ValidationIssue[] = [];
      const addIssue = (issue: ValidationIssue) => issues.push(issue);
      const currentFormat = getFormatId();
      const currentUvMode = Project.box_uv ? "box" : "per_face";
      const bounds = getBounds();
      const groups = Group.all.map((group) => group.name);
      const textures = Texture.all.map((texture) => texture.name);
      const animations = getAnimationNames();

      if (params.expected_project_uuid && Project.uuid !== params.expected_project_uuid) addIssue({ stage: "PROJECT", code: "PROJECT_UUID_MISMATCH", severity: "BLOCKER", message: `Active project UUID ${Project.uuid} does not match ${params.expected_project_uuid}.`, local: false, recommended_profile: "BOOTSTRAP" });
      if (params.expected_format && currentFormat && !currentFormat.includes(params.expected_format)) addIssue({ stage: "PROJECT", code: "FORMAT_MISMATCH", severity: "BLOCKER", message: `Project format ${currentFormat} does not match expected ${params.expected_format}.`, local: false, recommended_profile: "BOOTSTRAP" });
      if (currentUvMode !== params.expected_uv_mode) addIssue({ stage: "TEXTURE", code: "UV_MODE_MISMATCH", severity: "REVISION_REQUIRED", message: `UV mode is ${currentUvMode}; expected ${params.expected_uv_mode}.`, local: false, recommended_profile: "TEXTURE_LOCAL_REPAIR" });

      if (params.expected_texture_size) {
        const [expectedWidth, expectedHeight] = params.expected_texture_size;
        if (Project.texture_width !== expectedWidth || Project.texture_height !== expectedHeight) addIssue({ stage: "TEXTURE", code: "TEXTURE_SIZE_MISMATCH", severity: "REVISION_REQUIRED", message: `Texture size is ${Project.texture_width}x${Project.texture_height}; expected ${expectedWidth}x${expectedHeight}.`, local: false, recommended_profile: "TEXTURE_LOCAL_REPAIR" });
      }

      if (params.expected_dimensions_units) {
        if (!bounds) {
          addIssue({ stage: "GEOMETRY", code: "EMPTY_GEOMETRY", severity: "BLOCKER", message: "Project has no measurable cube or mesh geometry.", local: false, recommended_profile: "BEDROCK_CUBOID_GEOMETRY" });
        } else {
          const labels = ["width", "height", "depth"];
          bounds.size.forEach((actual, index) => {
            const expected = params.expected_dimensions_units![index];
            if (Math.abs(actual - expected) > params.dimension_tolerance_units) addIssue({ stage: "GEOMETRY", code: `DIMENSION_${labels[index].toUpperCase()}_MISMATCH`, severity: "REVISION_REQUIRED", message: `${labels[index]} is ${actual}; expected ${expected} ± ${params.dimension_tolerance_units}.`, local: false, recommended_profile: "GEOMETRY_LOCAL_REPAIR" });
          });
        }
      }

      for (const required of params.required_groups) if (!groups.includes(required)) addIssue({ stage: "GEOMETRY", code: "REQUIRED_GROUP_MISSING", severity: "REVISION_REQUIRED", message: `Required group/bone "${required}" is missing.`, local: true, recommended_profile: "GEOMETRY_LOCAL_REPAIR" });
      for (const required of params.required_textures) if (!textures.includes(required)) addIssue({ stage: "TEXTURE", code: "REQUIRED_TEXTURE_MISSING", severity: "REVISION_REQUIRED", message: `Required texture "${required}" is missing.`, local: true, recommended_profile: "TEXTURE_LOCAL_REPAIR" });

      if (params.forbid_pbr && getPbrMaterialCount() > 0) addIssue({ stage: "TEXTURE", code: "PBR_MATERIAL_FORBIDDEN", severity: "BLOCKER", message: `${getPbrMaterialCount()} PBR material group(s) exist in a Classic Bedrock workflow.`, local: false, recommended_profile: "TEXTURE_LOCAL_REPAIR" });

      const uvFailures = params.check_uv_bounds ? getUvOutOfBounds() : [];
      if (uvFailures.length > 0) addIssue({ stage: "TEXTURE", code: "UV_OUT_OF_BOUNDS", severity: "REVISION_REQUIRED", message: `${uvFailures.length} cube face UV rectangle(s) exceed the texture atlas.`, local: true, recommended_profile: "TEXTURE_LOCAL_REPAIR" });

      if (params.animation_required && animations.length === 0) addIssue({ stage: "ANIMATION", code: "REQUIRED_ANIMATION_SET_EMPTY", severity: "REVISION_REQUIRED", message: "Animation is required but the project contains no animations.", local: false, recommended_profile: "BEDROCK_CUBOID_ANIMATION" });
      for (const required of params.required_animations) if (!animations.includes(required)) addIssue({ stage: "ANIMATION", code: "REQUIRED_ANIMATION_MISSING", severity: "REVISION_REQUIRED", message: `Required animation "${required}" is missing.`, local: true, recommended_profile: "ANIMATION_LOCAL_REPAIR" });

      let blockbenchValidator = { errors: [] as string[], warnings: [] as string[] };
      if (params.run_blockbench_validator && typeof Validator !== "undefined") {
        Validator.validate("update_selection");
        blockbenchValidator = { errors: Validator.errors.map((problem) => problem.message), warnings: Validator.warnings.map((problem) => problem.message) };
        if (blockbenchValidator.errors.length > 0) addIssue({ stage: "FINAL_VALIDATION", code: "BLOCKBENCH_VALIDATOR_ERRORS", severity: "BLOCKER", message: `${blockbenchValidator.errors.length} Blockbench validator error(s) remain.`, local: false, recommended_profile: "FINAL_VALIDATION_READONLY" });
      }

      const blockerCount = issues.filter((issue) => issue.severity === "BLOCKER").length;
      const result = blockerCount > 0 ? "BLOCKER" : issues.length > 0 ? "REVISION_REQUIRED" : "PASS";
      const stageResults = ["PROJECT", "GEOMETRY", "TEXTURE", "ANIMATION", "FINAL_VALIDATION"].reduce<Record<string, string>>((acc, stage) => {
        const stageIssues = issues.filter((issue) => issue.stage === stage);
        acc[stage] = stageIssues.some((issue) => issue.severity === "BLOCKER") ? "BLOCKER" : stageIssues.length > 0 ? "REVISION_REQUIRED" : stage === "ANIMATION" && !params.animation_required ? "NOT_REQUIRED" : "PASS";
        return acc;
      }, {});

      return {
        content: [{ type: "text" as const, text: `Reference contract validation: ${result}. ${issues.length} issue(s), ${blockerCount} blocker(s).` }],
        structuredContent: {
          result,
          stage_results: stageResults,
          project: { name: Project.name, uuid: Project.uuid, format: currentFormat, uv_mode: currentUvMode, texture_size: [Project.texture_width, Project.texture_height] },
          counts: { cubes: Cube.all.length, meshes: Mesh.all.length, groups: Group.all.length, textures: Texture.all.length, animations: animations.length, pbr_material_groups: getPbrMaterialCount() },
          bounds,
          missing: { groups: params.required_groups.filter((name) => !groups.includes(name)), textures: params.required_textures.filter((name) => !textures.includes(name)), animations: params.required_animations.filter((name) => !animations.includes(name)) },
          uv_out_of_bounds: uvFailures.slice(0, 50),
          blockbench_validator: blockbenchValidator,
          issues,
          recommended_next_profile: issues[0]?.recommended_profile ?? null,
        },
      };
    },
  }, contractValidationToolDocs[0].status);
}
