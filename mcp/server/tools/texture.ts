/// <reference types="three" />
/// <reference types="blockbench-types" />
import { z } from "zod";
import { createTool, type ToolSpec } from "@/lib/factories";
import {
  imageContent,
  getChannelTextureInfo,
  isAbsoluteFilesystemPath,
} from "@/lib/util";
import { STATUS_EXPERIMENTAL, STATUS_STABLE } from "@/lib/constants";
import { resolveCoreCubeOrGroup, resolveCoreTexture } from "@/lib/coreIdentity";
import { DEFAULT_BEDROCK_UV_RESOLUTION } from "./project";
import {
  colorSchema,
  elementIdSchema,
  textureIdSchema,
  textureIdOptionalSchema,
  pbrChannelEnum,
  renderModeEnum,
  renderSidesEnum,
} from "@/lib/zodObjects";

// ============================================================================
// Texture Tool Parameter Schemas
// ============================================================================

export function isDeterministicTextureSource(value: string): boolean {
  if (value.startsWith("data:image/")) return true;
  return isAbsoluteFilesystemPath(value.replace(/^file:\/\//, ""));
}

export const createTextureParameters = z
  .object({
    name: z.string().min(1).describe("Non-empty texture name."),
    width: z.number().int().min(16).max(4096).default(16),
    height: z.number().int().min(16).max(4096).default(16),
    data: z
      .string()
      .refine(isDeterministicTextureSource, {
        message:
          "Texture data must be an image data URL or an absolute POSIX, Windows-drive, UNC, or file:// path.",
      })
      .optional()
      .describe("Image data URL or deterministic absolute image file path."),
    group: z
      .string()
      .min(1)
      .optional()
      .describe(
        "Optional TextureGroup UUID or unique exact name."
      ),
    fill_color: colorSchema
      .optional()
      .describe("RGBA color to fill the texture, as tuple or HEX string."),
    layer_name: z
      .string()
      .min(1)
      .optional()
      .describe(
        "Non-empty texture layer name. Required if fill_color is set."
      ),
    pbr_channel: pbrChannelEnum
      .optional()
      .describe(
        "PBR channel: color, normal, height, or MER."
      ),
    render_mode: renderModeEnum
      .optional()
      .default("default")
      .describe(
        "Texture render mode."
      ),
    render_sides: renderSidesEnum
      .optional()
      .default("auto")
      .describe("Render sides for the texture. Auto, front, or double."),
  })
  .refine((params) => !(params.data && params.fill_color), {
    message:
      "The 'data' and 'fill_color' properties cannot both be defined.",
    path: ["data", "fill_color"],
  })
  .refine((params) => !(params.fill_color && !params.layer_name), {
    message:
      "The 'layer_name' property is required when 'fill_color' is set.",
    path: ["layer_name", "fill_color"],
  })
  .refine(
    ({ pbr_channel, group }) => (pbr_channel && group) || !pbr_channel,
    {
      message:
        "The 'group' property is required when 'pbr_channel' is set.",
      path: ["group", "pbr_channel"],
    }
  );

export const applyTextureParameters = z.object({
  id: elementIdSchema
    .min(1)
    .describe(
      "Required Cube/Group UUID or unique exact name."
    ),
  texture: textureIdSchema
    .min(1)
    .describe(
      "Required Texture UUID, exact ID, or unique exact name."
    ),
  applyTo: z
    .enum(["all", "blank", "none"])
    .describe("Apply texture to element or group.")
    .optional()
    .default("blank"),
});

export const addTextureGroupParameters = z.object({
  name: z.string().min(1).describe("Non-empty TextureGroup name."),
  textures: z
    .array(z.string().min(1))
    .min(1)
    .optional()
    .describe(
      "Optional non-empty list of explicit texture targets. Each target resolves exact UUID first, then exact texture ID, then exact name only when unique."
    ),
  is_material: z
    .boolean()
    .optional()
    .default(true)
    .describe("Whether the texture group is a PBR material or not."),
});

export const listTexturesParameters = z.object({});

export const getTextureParameters = z.object({
  texture: textureIdOptionalSchema,
});

export const activateTextureParameters = z.object({
  texture: textureIdSchema
    .min(1)
    .describe(
      "Required texture target to activate. Exact UUID is preferred, then exact texture ID, then exact name only when unique."
    ),
});

export const createPbrMaterialParameters = z.object({
  name: z.string().min(1).describe("Non-empty material name."),
  color_texture: z
    .string()
    .min(1)
    .optional()
    .describe(
      "Optional color Texture UUID, exact ID, or unique exact name."
    ),
  normal_texture: z
    .string()
    .min(1)
    .optional()
    .describe(
      "Optional normal Texture UUID, exact ID, or unique exact name."
    ),
  height_texture: z
    .string()
    .min(1)
    .optional()
    .describe(
      "Optional height Texture UUID, exact ID, or unique exact name."
    ),
  mer_texture: z
    .string()
    .min(1)
    .optional()
    .describe(
      "Optional MER Texture UUID, exact ID, or unique exact name."
    ),
  color_value: z
    .array(z.number().min(0).max(255))
    .length(4)
    .optional()
    .describe(
      "Uniform RGBA color [R,G,B,A] when no color texture is provided."
    ),
  mer_value: z
    .array(z.number().min(0).max(255))
    .length(3)
    .optional()
    .describe(
      "Uniform MER values [Metalness, Emissive, Roughness] (0-255) when no MER texture is provided."
    ),
  subsurface_value: z
    .number()
    .min(0)
    .max(255)
    .optional()
    .describe(
      "Subsurface scattering value (0-255) for Bedrock 1.21.30+ materials."
    ),
}).superRefine((params, ctx) => {
  if (params.color_texture !== undefined && params.color_value !== undefined) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["color_value"], message: "Choose either color_texture or color_value; native Bedrock export uses the texture when both exist." });
  }
  if (params.mer_texture !== undefined && params.mer_value !== undefined) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["mer_value"], message: "Choose either mer_texture or mer_value; native Bedrock export uses the MER texture when both exist." });
  }
  if (params.normal_texture !== undefined && params.height_texture !== undefined) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["height_texture"], message: "Choose normal_texture or height_texture, not both; native Bedrock export prefers normal when both exist." });
  }
});

export const configureMaterialParameters = z.object({
  material: z
    .string()
    .min(1)
    .describe(
      "Required material/TextureGroup UUID or unique exact name."
    ),
  color_texture: z
    .string()
    .min(1)
    .optional()
    .describe(
      "Color Texture UUID/ID/unique name, or `none` for uniform color."
    ),
  normal_texture: z
    .string()
    .min(1)
    .optional()
    .describe(
      "Normal Texture UUID/ID/unique name, or `none` to remove."
    ),
  height_texture: z
    .string()
    .min(1)
    .optional()
    .describe(
      "Height Texture UUID/ID/unique name, or `none` to remove."
    ),
  mer_texture: z
    .string()
    .min(1)
    .optional()
    .describe(
      "MER Texture UUID/ID/unique name, or `none` for uniform values."
    ),
  color_value: z
    .array(z.number().min(0).max(255))
    .length(4)
    .optional()
    .describe("Uniform RGBA color [R,G,B,A] when no color texture."),
  mer_value: z
    .array(z.number().min(0).max(255))
    .length(3)
    .optional()
    .describe(
      "Uniform MER values [Metalness, Emissive, Roughness] (0-255)."
    ),
  subsurface_value: z
    .number()
    .min(0)
    .max(255)
    .optional()
    .describe("Subsurface scattering value (0-255)."),
}).refine(
  (params) =>
    Object.entries(params).some(
      ([key, value]) => key !== "material" && value !== undefined
    ),
  {
    message:
      "configure_material requires at least one authored field change in addition to material.",
  }
).superRefine((params, ctx) => {
  if (params.color_texture !== undefined && params.color_texture !== "none" && params.color_value !== undefined) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["color_value"], message: "Do not send color_value with an explicit color texture. Use color_texture=none when switching to uniform color." });
  }
  if (params.mer_texture !== undefined && params.mer_texture !== "none" && params.mer_value !== undefined) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["mer_value"], message: "Do not send mer_value with an explicit MER texture. Use mer_texture=none when switching to uniform MER values." });
  }
  const hasNormalTexture = params.normal_texture !== undefined && params.normal_texture !== "none";
  const hasHeightTexture = params.height_texture !== undefined && params.height_texture !== "none";
  if (hasNormalTexture && hasHeightTexture) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["height_texture"], message: "Configure normal_texture or height_texture as the active depth source, not both in one call." });
  }
});

export const listMaterialsParameters = z.object({});

export const getMaterialInfoParameters = z.object({
  material: z
    .string()
    .min(1)
    .describe(
      "Required material/texture group target to inspect. Exact UUID is preferred; an exact name is accepted only when unique."
    ),
});

export const importTextureSetParameters = z.object({
  path: z
    .string()
    .refine(isAbsoluteFilesystemPath, {
      message:
        "Texture-set import path must be absolute: use a POSIX `/...` path, a Windows drive path such as `C:\\\\...`, or a UNC path such as `\\\\\\\\server\\\\share\\\\...`.",
    })
    .describe("Absolute path to the .texture_set.json file to import."),
});

export const assignTextureChannelParameters = z.object({
  material: z
    .string()
    .min(1)
    .describe(
      "Required material/texture group target for channel assignment. Exact UUID is preferred; an exact name is accepted only when unique."
    ),
  texture: textureIdSchema
    .min(1)
    .describe(
      "Required explicit texture target to assign. Exact UUID is preferred, then exact texture ID, then exact name only when unique."
    ),
  channel: pbrChannelEnum.describe("PBR channel to assign the texture to."),
});

export const saveMaterialConfigParameters = z.object({
  material: z
    .string()
    .min(1)
    .describe(
      "Required material/texture group target to save. Exact UUID is preferred; an exact name is accepted only when unique."
    ),
});

// ============================================================================
// Texture Tool Docs
// ============================================================================

export const textureToolDocs: ToolSpec[] = [
  {
    name: "create_texture",
    description:
      "Creates a texture with explicit size/content options and returns resulting texture metadata. An optional TextureGroup target must resolve before mutation. Use `get_texture` only when image evidence is actually needed.",
    annotations: {
      title: "Create Texture",
      destructiveHint: true,
      openWorldHint: true,
    },
    parameters: createTextureParameters,
    status: STATUS_EXPERIMENTAL,
  },
  {
    name: "apply_texture",
    description:
      "Legacy generic per-face Texture.apply wrapper. Disabled from the Bedrock Entity MCP surface because native Bedrock Entity is single_texture and Blockbench hides per-face apply actions there; use activate_texture for the active/default texture.",
    annotations: {
      title: "Apply Texture",
      destructiveHint: true,
    },
    parameters: applyTextureParameters,
    status: STATUS_EXPERIMENTAL,
  },
  {
    name: "add_texture_group",
    description:
      "Adds a uniquely named TextureGroup. Exact group-name collisions and any missing/ambiguous explicit Texture target fail before Undo or group creation.",
    annotations: {
      title: "Add Texture Group",
      destructiveHint: true,
    },
    parameters: addTextureGroupParameters,
    status: STATUS_EXPERIMENTAL,
  },
  {
    name: "list_textures",
    description:
      "Returns a read-only list of all textures in the Blockbench editor, including identity/group metadata and the current render_mode/render_sides settings.",
    annotations: {
      title: "List Textures",
      readOnlyHint: true,
    },
    parameters: listTexturesParameters,
    status: STATUS_STABLE,
  },
  {
    name: "get_texture",
    description:
      "Returns image data for the default texture when no texture is specified. Explicit texture identity resolves exact UUID first, then exact texture ID, then exact name only when unique; missing or ambiguous references fail before image data is returned.",
    annotations: {
      title: "Get Texture",
      readOnlyHint: true,
    },
    parameters: getTextureParameters,
    status: STATUS_STABLE,
  },
  {
    name: "create_pbr_material",
    description:
      "Creates a uniquely named PBR material TextureGroup. Color and MER each accept one effective source (texture or uniform), and depth accepts normal or height; contradictory sources fail before Undo.",
    annotations: {
      title: "Create PBR Material",
      destructiveHint: true,
    },
    parameters: createPbrMaterialParameters,
    status: STATUS_EXPERIMENTAL,
  },
  {
    name: "configure_material",
    description:
      "Configures one explicit PBR material with at least one authored change. Explicit texture + uniform conflicts and simultaneous normal+height sources fail at the MCP boundary; `none` remains the explicit switch to uniform/remove behavior.",
    annotations: {
      title: "Configure Material",
      destructiveHint: true,
    },
    parameters: configureMaterialParameters,
    status: STATUS_EXPERIMENTAL,
  },
  {
    name: "list_materials",
    description:
      "Lists all PBR materials (texture groups with is_material=true) and their assigned textures per channel.",
    annotations: {
      title: "List Materials",
      readOnlyHint: true,
    },
    parameters: listMaterialsParameters,
    status: STATUS_STABLE,
  },
  {
    name: "get_material_info",
    description:
      "Gets detailed information about one explicit material/texture group, including the compiled texture_set.json preview for Bedrock export. Material identity resolves exact UUID first, otherwise an exact name must be unique; missing or ambiguous targets fail before material data is read.",
    annotations: {
      title: "Get Material Info",
      readOnlyHint: true,
    },
    parameters: getMaterialInfoParameters,
    status: STATUS_STABLE,
  },
  {
    name: "import_texture_set",
    description:
      "Imports one absolute Minecraft Bedrock texture_set.json after native-compatible JSON/comment parsing and root preflight. Invalid documents and exact resulting TextureGroup-name collisions fail before native import; success reports the created material identity.",
    annotations: {
      title: "Import Texture Set",
      destructiveHint: true,
      openWorldHint: true,
    },
    parameters: importTextureSetParameters,
    status: STATUS_EXPERIMENTAL,
  },
  {
    name: "assign_texture_channel",
    description:
      "Assigns one explicit Texture to one PBR channel. Material/Texture references resolve before Undo; exact no-op assignments are rejected, while existing competing textures on that channel remain part of the native edit behavior.",
    annotations: {
      title: "Assign Texture Channel",
      destructiveHint: true,
    },
    parameters: assignTextureChannelParameters,
    status: STATUS_EXPERIMENTAL,
  },
  {
    name: "save_material_config",
    description:
      "Saves one explicit material/texture group's Bedrock texture_set.json through Blockbench native save behavior. Missing/ambiguous material targets fail first, and success is returned only when the native saved flag is true and the target file exists.",
    annotations: {
      title: "Save Material Config",
      destructiveHint: true,
      openWorldHint: true,
    },
    parameters: saveMaterialConfigParameters,
    status: STATUS_EXPERIMENTAL,
  },
  {
    name: "activate_texture",
    description:
      "Activates one explicit texture in the Blockbench texture panel. Texture identity resolves exact UUID first, then exact texture ID, then exact name only when unique. Missing or ambiguous references fail before the active texture selection changes. Subsequent paint operations (draw_shape_tool, paint_with_brush, gradient_tool, etc.) then target the activated texture by default.",
    annotations: {
      title: "Activate Texture",
      destructiveHint: false,
      idempotentHint: true,
    },
    parameters: activateTextureParameters,
    status: STATUS_STABLE,
  },
];

type ApplyTextureElement = Cube | Group;

function applyTextureElementType(
  element: ApplyTextureElement
): "cube" | "group" {
  return element instanceof Cube ? "cube" : "group";
}

function resolveApplyTextureElement(reference: string): ApplyTextureElement {
  return resolveCoreCubeOrGroup(
    reference,
    "Use list_outline or find_elements_by_criteria to confirm the intended Cube/Group UUID before applying a texture."
  );
}

function resolveApplyTextureTexture(reference: string): Texture {
  return resolveCoreTexture(reference, "Use list_textures to confirm the intended UUID or texture ID before applying it.");
}

function resolveActivateTextureTexture(reference: string): Texture {
  return resolveCoreTexture(reference, "Use list_textures to confirm the intended UUID or texture ID before activating it.");
}

function resolveGetTextureTexture(reference: string): Texture {
  return resolveCoreTexture(reference, "Use list_textures to confirm the intended UUID or texture ID before reading image data.");
}

function resolveAddTextureGroupTexture(reference: string): Texture {
  return resolveCoreTexture(reference, "Use list_textures to confirm the intended UUID or texture ID before adding the texture group.");
}

function resolveCreatePbrMaterialTexture(reference: string): Texture {
  return resolveCoreTexture(reference, "Use list_textures to confirm the intended UUID or texture ID before creating the PBR material.");
}

function resolveConfigureMaterialTexture(reference: string): Texture {
  return resolveCoreTexture(reference, "Use list_textures to confirm the intended UUID or texture ID before configuring the material.");
}

function resolveAssignTextureChannelTexture(reference: string): Texture {
  return resolveCoreTexture(reference, "Use list_textures to confirm the intended UUID or texture ID before assigning the PBR channel.");
}

function resolveTextureToolMaterial(reference: string): TextureGroup {
  const uuidMatch = TextureGroup.all.find(
    (group: TextureGroup) => group.uuid === reference
  );
  if (uuidMatch) return uuidMatch;

  const nameMatches = TextureGroup.all.filter(
    (group: TextureGroup) => group.name === reference
  );
  if (nameMatches.length === 1) return nameMatches[0];
  if (nameMatches.length > 1) {
    throw new Error(
      `Material/texture group name "${reference}" is ambiguous. Use an exact UUID. Candidates: ${nameMatches
        .map((group: TextureGroup) => `${group.name} (uuid: ${group.uuid})`)
        .join(", ")}`
    );
  }

  throw new Error(
    `Material/texture group "${reference}" not found. Use the list_materials tool to confirm the intended UUID or unique name.`
  );
}

type PbrChannelAssignment = {
  channel: z.infer<typeof pbrChannelEnum>;
  texture?: Pick<Texture, "uuid" | "name">;
};

export function hasExactTextureGroupNameCollision(
  groups: readonly { name: string }[],
  requestedName: string
): boolean {
  return groups.some((group) => group.name === requestedName);
}

export function isMinecraftTextureSetDocument(value: unknown): boolean {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const root = (value as Record<string, unknown>)["minecraft:texture_set"];
  return Boolean(root && typeof root === "object" && !Array.isArray(root));
}

export function importedTextureGroupName(filePath: string): string {
  const fileName = filePath.split(/[\/\\]/).pop() ?? filePath;
  return fileName.replace(/\.texture_set\.json$/, ".png material");
}

export function requireMaterialConfigSavePostcondition(
  saved: boolean,
  fileExists: boolean,
  filePath: string
): void {
  if (saved && fileExists) return;
  throw new Error(
    `Material config save was not confirmed at "${filePath}". Ensure the color texture has a writable existing directory, then retry.`
  );
}

export function requireDistinctPbrChannelAssignments(
  assignments: readonly PbrChannelAssignment[]
): void {
  const channelByTexture = new Map<string, string>();

  for (const { channel, texture } of assignments) {
    if (!texture) continue;

    const previousChannel = channelByTexture.get(texture.uuid);
    if (previousChannel && previousChannel !== channel) {
      throw new Error(
        `Texture "${texture.name}" (${texture.uuid}) cannot be assigned to both ${previousChannel} and ${channel} in one material operation. A Texture has one pbr_channel; use distinct textures per channel.`
      );
    }
    channelByTexture.set(texture.uuid, channel);
  }
}

export type TextureProductionRole =
  | "base_color_candidate"
  | "explicit_variant"
  | "pbr_support";

export type TextureRoleMetadata = {
  pbr_channel?: string | null;
  has_group: boolean;
  group_is_material?: boolean | null;
};

export function classifyTextureProductionRole(
  metadata: TextureRoleMetadata
): TextureProductionRole {
  const channel = metadata.pbr_channel ?? "color";
  if (channel !== "color") return "pbr_support";
  if (metadata.has_group && metadata.group_is_material === false) {
    return "explicit_variant";
  }
  return "base_color_candidate";
}

export function isAiProductionColorCanvas(
  width: number,
  height: number
): boolean {
  return (
    Number.isInteger(width) &&
    Number.isInteger(height) &&
    width === height &&
    width >= DEFAULT_BEDROCK_UV_RESOLUTION &&
    width % DEFAULT_BEDROCK_UV_RESOLUTION === 0
  );
}

export const UV_ATLAS_AUDIT_EXAMPLE_LIMIT = 6;

export type UvAtlasUsage = {
  cube_uuid: string;
  cube_name: string;
  face: string;
  uv: readonly number[];
  box_uv: boolean;
  autouv: number;
  mirror_uv: boolean;
  face_rotation: number;
};

type NormalizedUvUsage = UvAtlasUsage & {
  rect: [number, number, number, number];
};

function normalizedUvRect(
  values: readonly number[]
): [number, number, number, number] | null {
  if (values.length !== 4 || values.some((value) => !Number.isFinite(value))) {
    return null;
  }
  return [
    Math.min(values[0], values[2]),
    Math.min(values[1], values[3]),
    Math.max(values[0], values[2]),
    Math.max(values[1], values[3]),
  ];
}

function uvUsageExample(usage: UvAtlasUsage) {
  return {
    cube_uuid: usage.cube_uuid,
    cube_name: usage.cube_name,
    face: usage.face,
    uv: [...usage.uv],
    box_uv: usage.box_uv,
    autouv: usage.autouv,
    mirror_uv: usage.mirror_uv,
    face_rotation: usage.face_rotation,
  };
}

function uvRectArea(rect: readonly number[]): number {
  return Math.max(0, rect[2] - rect[0]) * Math.max(0, rect[3] - rect[1]);
}

function uvRectsEqual(a: readonly number[], b: readonly number[]): boolean {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
}

function uvRectIntersection(
  a: readonly number[],
  b: readonly number[]
): [number, number, number, number] | null {
  const left = Math.max(a[0], b[0]);
  const top = Math.max(a[1], b[1]);
  const right = Math.min(a[2], b[2]);
  const bottom = Math.min(a[3], b[3]);
  if (left >= right || top >= bottom) return null;
  return [left, top, right, bottom];
}

function boundedExamples<T>(
  values: readonly T[],
  limit: number
): { examples: T[]; examples_truncated: boolean } {
  return {
    examples: values.slice(0, limit),
    examples_truncated: values.length > limit,
  };
}

export function buildUvAtlasAudit(
  usages: readonly UvAtlasUsage[],
  logicalWidth: number | null | undefined,
  logicalHeight: number | null | undefined,
  exampleLimit: number = UV_ATLAS_AUDIT_EXAMPLE_LIMIT
) {
  if (
    typeof logicalWidth !== "number" ||
    typeof logicalHeight !== "number" ||
    !Number.isFinite(logicalWidth) ||
    !Number.isFinite(logicalHeight) ||
    logicalWidth <= 0 ||
    logicalHeight <= 0
  ) {
    return {
      state: "unavailable" as const,
      reason: "logical_uv_canvas_unavailable" as const,
      enabled_faces: usages.length,
    };
  }

  const width = logicalWidth;
  const height = logicalHeight;
  const invalidUv: UvAtlasUsage[] = [];
  const valid: NormalizedUvUsage[] = [];

  for (const usage of usages) {
    const rect = normalizedUvRect(usage.uv);
    if (!rect) {
      invalidUv.push(usage);
      continue;
    }
    valid.push({ ...usage, rect });
  }

  const outOfBounds = valid.filter(
    ({ rect }) =>
      rect[0] < 0 ||
      rect[1] < 0 ||
      rect[2] > width ||
      rect[3] > height
  );
  const fractionalUv = valid.filter(({ uv }) =>
    uv.some((value) => !Number.isInteger(value))
  );
  const degenerateUv = valid.filter(({ rect }) => uvRectArea(rect) === 0);

  const unlockedByCube = new Map<string, UvAtlasUsage>();
  for (const usage of valid) {
    if (usage.box_uv && usage.autouv !== 0 && !unlockedByCube.has(usage.cube_uuid)) {
      unlockedByCube.set(usage.cube_uuid, usage);
    }
  }
  const unlocked = [...unlockedByCube.values()];

  const reusable = valid.filter(({ rect }) => uvRectArea(rect) > 0);
  const exactReuseMap = new Map<string, NormalizedUvUsage[]>();
  for (const usage of reusable) {
    const key = usage.rect.join(",");
    const group = exactReuseMap.get(key) ?? [];
    group.push(usage);
    exactReuseMap.set(key, group);
  }

  const exactReuseGroups = [...exactReuseMap.values()]
    .filter((group) => group.length > 1)
    .map((group) => ({
      rect: group[0].rect,
      owner_count: group.length,
      owners: group
        .slice(0, exampleLimit)
        .map((usage) => uvUsageExample(usage)),
      owners_truncated: group.length > exampleLimit,
    }));

  const sorted = [...reusable].sort(
    (a, b) =>
      a.rect[0] - b.rect[0] ||
      a.rect[2] - b.rect[2] ||
      a.rect[1] - b.rect[1]
  );
  let partialOverlapPairCount = 0;
  const partialOverlapExamples: Array<{
    a: ReturnType<typeof uvUsageExample>;
    b: ReturnType<typeof uvUsageExample>;
    intersection: [number, number, number, number];
  }> = [];

  for (let i = 0; i < sorted.length; i += 1) {
    const a = sorted[i];
    for (let j = i + 1; j < sorted.length; j += 1) {
      const b = sorted[j];
      if (b.rect[0] >= a.rect[2]) break;
      if (uvRectsEqual(a.rect, b.rect)) continue;
      const intersection = uvRectIntersection(a.rect, b.rect);
      if (!intersection) continue;
      partialOverlapPairCount += 1;
      if (partialOverlapExamples.length < exampleLimit) {
        partialOverlapExamples.push({
          a: uvUsageExample(a),
          b: uvUsageExample(b),
          intersection,
        });
      }
    }
  }

  const reasons: string[] = [];
  if (invalidUv.length > 0) reasons.push("INVALID_UV");
  if (outOfBounds.length > 0) reasons.push("OUT_OF_BOUNDS");
  if (fractionalUv.length > 0) reasons.push("FRACTIONAL_UV");
  if (unlocked.length > 0) reasons.push("BOX_UV_AUTOUV_UNLOCKED");
  if (partialOverlapPairCount > 0) reasons.push("PARTIAL_OVERLAP");

  const invalidBounded = boundedExamples(
    invalidUv.map(uvUsageExample),
    exampleLimit
  );
  const outOfBoundsBounded = boundedExamples(
    outOfBounds.map(uvUsageExample),
    exampleLimit
  );
  const fractionalBounded = boundedExamples(
    fractionalUv.map(uvUsageExample),
    exampleLimit
  );
  const degenerateBounded = boundedExamples(
    degenerateUv.map(uvUsageExample),
    exampleLimit
  );
  const unlockedBounded = boundedExamples(
    unlocked.map(uvUsageExample),
    exampleLimit
  );
  const reuseBounded = boundedExamples(exactReuseGroups, exampleLimit);

  return {
    state: "available" as const,
    logical_canvas: { width, height },
    enabled_faces: usages.length,
    valid_uv_faces: valid.length,
    invalid_uv: {
      count: invalidUv.length,
      ...invalidBounded,
    },
    out_of_bounds: {
      count: outOfBounds.length,
      ...outOfBoundsBounded,
    },
    fractional_uv: {
      count: fractionalUv.length,
      ...fractionalBounded,
    },
    degenerate_uv: {
      count: degenerateUv.length,
      ...degenerateBounded,
    },
    unlocked_box_uv_cubes: {
      count: unlocked.length,
      ...unlockedBounded,
    },
    exact_reuse: {
      region_count: exactReuseGroups.length,
      ...reuseBounded,
    },
    partial_overlap: {
      pair_count: partialOverlapPairCount,
      examples: partialOverlapExamples,
      examples_truncated: partialOverlapPairCount > partialOverlapExamples.length,
    },
    production_gate: {
      state: reasons.length === 0 ? ("ready" as const) : ("review_required" as const),
      reasons,
    },
  };
}

const CUBE_FACE_KEYS = [
  "north",
  "south",
  "east",
  "west",
  "up",
  "down",
] as const;

function collectUvAtlasUsages(): UvAtlasUsage[] {
  if (!Project) return [];

  const usages: UvAtlasUsage[] = [];
  for (const cube of Cube.all) {
    for (const faceKey of CUBE_FACE_KEYS) {
      const face = cube.faces[faceKey];
      if (!face || face.enabled === false) continue;
      usages.push({
        cube_uuid: cube.uuid,
        cube_name: cube.name,
        face: faceKey,
        uv: [...face.uv],
        box_uv: cube.box_uv === true,
        autouv: cube.autouv,
        mirror_uv: cube.mirror_uv === true,
        face_rotation: face.rotation,
      });
    }
  }
  return usages;
}

function textureGroupFor(texture: Texture): TextureGroup | null {
  if (!texture.group) return null;
  return (
    TextureGroup.all.find(
      (group: TextureGroup) => group.uuid === texture.group
    ) ?? null
  );
}

function textureProductionRole(texture: Texture): TextureProductionRole {
  const group = textureGroupFor(texture);
  return classifyTextureProductionRole({
    pbr_channel: texture.pbr_channel ?? "color",
    has_group: Boolean(texture.group),
    group_is_material: group?.is_material ?? null,
  });
}

function safeTextureRatio(
  pixels: number,
  uvUnits: number
): number | null {
  if (
    !Number.isFinite(pixels) ||
    !Number.isFinite(uvUnits) ||
    pixels <= 0 ||
    uvUnits <= 0
  ) {
    return null;
  }
  return pixels / uvUnits;
}

function textureInventoryEntry(texture: Texture) {
  const group = textureGroupFor(texture);
  const uvWidth = texture.getUVWidth();
  const uvHeight = texture.getUVHeight();
  const displayHeight = texture.display_height;

  return {
    name: texture.name,
    uuid: texture.uuid,
    id: texture.id,
    role: textureProductionRole(texture),
    group: group
      ? {
          uuid: group.uuid,
          name: group.name,
          is_material: group.is_material,
        }
      : null,
    pbr_channel: texture.pbr_channel || "color",
    is_default: Texture.getDefault()?.uuid === texture.uuid,
    is_selected: Texture.selected?.uuid === texture.uuid,
    bitmap: {
      width: texture.width,
      height: texture.height,
      display_height: displayHeight,
    },
    logical_uv: {
      width: uvWidth,
      height: uvHeight,
    },
    physical_pixels_per_uv_unit: {
      x: safeTextureRatio(texture.width, uvWidth),
      y: safeTextureRatio(displayHeight, uvHeight),
    },
    animated: texture.height !== displayHeight,
    render_mode: texture.render_mode,
    render_sides: texture.render_sides,
  };
}

function currentTextureInventory() {
  const textures = Project?.textures ?? Texture.all;
  const entries = textures.map(textureInventoryEntry);
  const baseColorCandidates = entries.filter(
    (entry) => entry.role === "base_color_candidate"
  );
  const explicitVariants = entries.filter(
    (entry) => entry.role === "explicit_variant"
  );
  const pbrSupport = entries.filter(
    (entry) => entry.role === "pbr_support"
  );

  return {
    state:
      baseColorCandidates.length === 0
        ? ("none" as const)
        : baseColorCandidates.length === 1
          ? ("single" as const)
          : ("fragmented" as const),
    base_color_candidates: baseColorCandidates.map((entry) => ({
      uuid: entry.uuid,
      name: entry.name,
      group: entry.group,
      bitmap: entry.bitmap,
    })),
    explicit_variants: explicitVariants.map((entry) => ({
      uuid: entry.uuid,
      name: entry.name,
      group: entry.group,
      bitmap: entry.bitmap,
    })),
    pbr_support: pbrSupport.map((entry) => ({
      uuid: entry.uuid,
      name: entry.name,
      pbr_channel: entry.pbr_channel,
      group: entry.group,
      bitmap: entry.bitmap,
    })),
    default_texture_uuid: Texture.getDefault()?.uuid ?? null,
    selected_texture_uuid: Texture.selected?.uuid ?? null,
    textures: entries,
  };
}

function requireTextureCreationPreflight(params: {
  width: number;
  height: number;
  data?: string;
  pbr_channel?: z.infer<typeof pbrChannelEnum>;
  textureGroup?: TextureGroup;
}): void {
  const requestedRole = classifyTextureProductionRole({
    pbr_channel: params.pbr_channel ?? "color",
    has_group: Boolean(params.textureGroup),
    group_is_material: params.textureGroup?.is_material ?? null,
  });

  const existingTextures = Project?.textures ?? Texture.all;
  const existingBase = existingTextures.filter(
    (texture) => textureProductionRole(texture) === "base_color_candidate"
  );

  if (requestedRole === "base_color_candidate") {
    if (existingBase.length > 0) {
      const [first] = existingBase;
      throw new Error(
        `A base-color atlas already exists: "${first.name}" (${first.uuid}). Reuse that atlas instead of creating a color texture per body part/material zone. Explicit color variants must be placed in an explicit non-material TextureGroup.`
      );
    }
    if (
      params.data === undefined &&
      !isAiProductionColorCanvas(params.width, params.height)
    ) {
      throw new Error(
        `New AI-authored base-color atlases must use a square 128-based canvas (128, 256, 384, 512, ...). Received ${params.width}×${params.height}. Existing imported texture data may retain authored dimensions.`
      );
    }
    return;
  }

  if (requestedRole === "explicit_variant") {
    if (existingBase.length !== 1) {
      throw new Error(
        `An explicit color variant requires exactly one established base-color atlas; found ${existingBase.length}. Resolve the base atlas first.`
      );
    }
    if (
      params.data === undefined &&
      (params.width !== existingBase[0].width ||
        params.height !== existingBase[0].height)
    ) {
      throw new Error(
        `A new AI-authored color variant must match the base atlas bitmap size ${existingBase[0].width}×${existingBase[0].height}; received ${params.width}×${params.height}.`
      );
    }
    return;
  }

  if (params.textureGroup?.is_material !== true) {
    throw new Error(
      "PBR support textures require an explicit material TextureGroup. Use create_pbr_material/add the support texture to that material instead of a variant/non-material group."
    );
  }

  if (params.data !== undefined) return;

  if (existingBase.length !== 1) {
    throw new Error(
      `A new PBR support texture requires exactly one established base-color atlas; found ${existingBase.length}. Create/resolve the base atlas first.`
    );
  }
  if (
    params.width !== existingBase[0].width ||
    params.height !== existingBase[0].height
  ) {
    throw new Error(
      `New PBR support textures must match the base atlas bitmap size ${existingBase[0].width}×${existingBase[0].height}; received ${params.width}×${params.height}.`
    );
  }
}

// ============================================================================
// Tool Registration
// ============================================================================

export function registerTextureTools() {
  createTool(textureToolDocs[0].name, {
    ...textureToolDocs[0],
    parameters: createTextureParameters,
    async execute({
      name,
      width,
      height,
      data,
      pbr_channel,
      fill_color,
      group,
      layer_name,
      render_mode,
      render_sides,
    }) {
      const textureGroup =
        group !== undefined ? resolveTextureToolMaterial(group) : undefined;

      requireTextureCreationPreflight({
        width,
        height,
        data,
        pbr_channel,
        textureGroup,
      });

      Undo.initEdit({
        textures: [],
        collections: [],
      });

      let texture!: Texture;

      try {
        texture = new Texture({
          name,
          width,
          height,
          group: textureGroup?.uuid,
          pbr_channel,
          render_mode,
          render_sides,
          internal: true,
        });

        if (data) {
          if (data.startsWith("data:image/")) {
            texture.source = data;
            texture.width = width;
            texture.height = height;
          } else {
            texture = texture.fromFile({
              name: data.split(/[\/\\]/).pop() || data,
              path: data.replace(/^file:\/\//, ""),
            });
          }

          texture.load();
          texture.fillParticle();
          texture.layers_enabled = false;
        } else {
          const { ctx } = texture.getActiveCanvas();

          if (fill_color) {
            const color = Array.isArray(fill_color)
              // @ts-ignore - tinycolor is available globally in Blockbench
              ? tinycolor({
                r: Number(fill_color[0]),
                g: Number(fill_color[1]),
                b: Number(fill_color[2]),
                a: Number(fill_color[3] ?? 255) / 255,
              })
              // @ts-ignore - tinycolor ok
              : tinycolor(fill_color);

            ctx.fillStyle = color.toRgbString().toLowerCase();
            ctx.fillRect(0, 0, texture.width, texture.height);
          } else {
            ctx.clearRect(0, 0, texture.width, texture.height);
          }

          texture.updateSource(ctx.canvas.toDataURL("image/png", 1));
          texture.updateLayerChanges(true);
        }

        texture.add();

        if (fill_color && layer_name) {
          texture.activateLayers(false);
          texture.getActiveLayer().name = layer_name;
        }

        Undo.finishEdit("Agent created texture", {
          textures: [texture],
          collections: [],
        });
      } catch (error) {
        if (texture) texture.remove(true);
        Undo.cancelEdit();
        Canvas.updateAll();
        throw error;
      }

      Canvas.updateAll();

      const result = {
        texture: {
          ...textureInventoryEntry(texture),
          uuid: texture.uuid,
        },
      };
      return {
        content: [
          {
            type: "text" as const,
            text: `Created texture "${texture.name}" (${texture.uuid}). Use get_texture only when image evidence is needed.`,
          },
        ],
        structuredContent: result,
      };
    },
  }, textureToolDocs[0].status);

  createTool(textureToolDocs[1].name, {
    ...textureToolDocs[1],
    parameters: applyTextureParameters,
    async execute({ applyTo, id, texture }) {
      const element = resolveApplyTextureElement(id);
      const projectTexture = resolveApplyTextureTexture(texture);

      // Resolve the target to concrete Bedrock Cube geometry.
      // Group scopes recurse through Groups and collect descendant Cubes only.
      const targets: Cube[] = [];
      if (element instanceof Group) {
        const collectDescendants = (group: Group) => {
          for (const child of group.children ?? []) {
            if (child instanceof Cube) {
              targets.push(child);
              continue;
            }
            if (child instanceof Group) collectDescendants(child);
          }
        };
        collectDescendants(element);
      } else {
        targets.push(element);
      }

      if (targets.length === 0) {
        throw new Error(`Element "${id}" resolved to no paintable Bedrock Cubes.`);
      }

      // Save prior direct selection so the call remains non-destructive to UI state.
      const prevCubeSelection = [...Cube.selected];
      const prevGroupSelection = [...Group.selected];

      // Undo must capture the element face-texture state, not just outliner.
      Undo.initEdit({
        elements: targets,
        outliner: false,
        collections: [],
      });

      try {
        try {
          // Replace selection with exactly the resolved Cube targets so Texture.apply()
          // cannot be affected by unrelated caller selection.
          Cube.all.forEach((cube: Cube) => {
            if (cube.selected) cube.unselect?.();
          });
          Group.selected.slice().forEach((group: Group) => group.unselect());

          for (const target of targets) {
            target.select?.(new MouseEvent("click", { shiftKey: true }));
          }
          updateSelection();

          projectTexture.select();
          Texture.selected?.apply(
            applyTo === "none" ? false : applyTo === "all" ? true : "blank"
          );
          projectTexture.updateChangesAfterEdit();
        } finally {
          Cube.all.forEach((cube: Cube) => {
            if (cube.selected) cube.unselect?.();
          });
          Group.selected.slice().forEach((group: Group) => group.unselect());

          for (const cube of prevCubeSelection) {
            cube.select?.(new MouseEvent("click", { shiftKey: true }));
          }
          for (const group of prevGroupSelection) {
            group.markAsSelected(false);
          }
          updateSelection();
        }

        Undo.finishEdit("Agent applied texture");
      } catch (error) {
        Undo.cancelEdit(true);
        Canvas.updateAll();
        throw error;
      }

      // Force face-level render refresh so the viewport matches the data.
      // Canvas.updateAll() alone sometimes doesn't push new face materials
      // into the THREE.js render targets.
      Canvas.updateView({
        elements: targets,
        element_aspects: { faces: true, uv: true, geometry: false },
      });
      Canvas.updateAll();

      return `Applied texture "${projectTexture.name}" to ${targets.length} Bedrock Cube(s) scoped by "${id}" (${element instanceof Group ? "group" : "cube"}).`;
    },
  }, textureToolDocs[1].status, false);

  createTool(textureToolDocs[2].name, {
    ...textureToolDocs[2],
    parameters: addTextureGroupParameters,
    async execute({ name, textures, is_material }) {
      if (hasExactTextureGroupNameCollision(TextureGroup.all, name)) {
        throw new Error(`TextureGroup name "${name}" already exists. Use a distinct name so future material/group references remain deterministic.`);
      }
      const textureList = textures?.map(resolveAddTextureGroupTexture) ?? [];
      const textureGroup = new TextureGroup({
        name,
        is_material,
      });
      const originalTextureGroups = textureList.map((texture) => ({
        texture,
        group: texture.group,
      }));

      Undo.initEdit({
        texture_groups: [],
        textures: textureList,
      });

      try {
        textureList.forEach((texture) => {
          texture.group = textureGroup.uuid;
        });

        textureGroup.add();

        Undo.finishEdit("Agent added texture group", {
          texture_groups: [textureGroup],
          textures: textureList,
        });
      } catch (error) {
        for (const { texture, group } of originalTextureGroups) {
          texture.group = group;
        }
        textureGroup.remove();
        Undo.cancelEdit();
        Canvas.updateAll();
        throw error;
      }

      Canvas.updateAll();

      return `Added texture group ${textureGroup.name} with ID ${textureGroup.uuid}`;
    },
  }, textureToolDocs[2].status);

  createTool(textureToolDocs[3].name, {
    ...textureToolDocs[3],
    parameters: listTexturesParameters,
    async execute() {
      const inventory = currentTextureInventory();
      const uvAudit = buildUvAtlasAudit(
        collectUvAtlasUsages(),
        Project?.texture_width ?? null,
        Project?.texture_height ?? null
      );
      const uvGate =
        uvAudit.state === "available"
          ? uvAudit.production_gate.state
          : "unavailable";
      const result = {
        logical_uv: {
          width: Project?.texture_width ?? null,
          height: Project?.texture_height ?? null,
        },
        atlas_state: {
          state: inventory.state,
          base_color_candidates: inventory.base_color_candidates,
          explicit_variants: inventory.explicit_variants,
          pbr_support: inventory.pbr_support,
          default_texture_uuid: inventory.default_texture_uuid,
          selected_texture_uuid: inventory.selected_texture_uuid,
        },
        uv_audit: uvAudit,
        textures: inventory.textures,
      };

      return {
        content: [
          {
            type: "text" as const,
            text: `Found ${inventory.textures.length} texture(s); base-color atlas state: ${inventory.state}; UV atlas gate: ${uvGate}.`,
          },
        ],
        structuredContent: result,
      };
    },
  }, textureToolDocs[3].status);

  createTool(textureToolDocs[4].name, {
    ...textureToolDocs[4],
    parameters: getTextureParameters,
    async execute({ texture }) {
      const available = Project?.textures ?? Texture.all;
      if (!texture && available.length > 1) {
        throw new Error(
          "Multiple textures are loaded. Pass texture explicitly so atlas evidence cannot drift to implicit default state."
        );
      }
      const image = texture
        ? resolveGetTextureTexture(texture)
        : Texture.getDefault();
      if (!image) {
        throw new Error(
          "No default texture available. Use the create_texture tool to create one first, or specify a texture ID."
        );
      }

      const imageResult = imageContent({ url: image.getDataURL() });
      return {
        ...imageResult,
        structuredContent: {
          inspection: "full_atlas",
          texture: textureInventoryEntry(image),
        },
      };
    },
  }, textureToolDocs[4].status);

  createTool(textureToolDocs[5].name, {
    ...textureToolDocs[5],
    parameters: createPbrMaterialParameters,
    async execute({
      name,
      color_texture,
      normal_texture,
      height_texture,
      mer_texture,
      color_value,
      mer_value,
      subsurface_value,
    }) {
      if (hasExactTextureGroupNameCollision(TextureGroup.all, name)) {
        throw new Error(`TextureGroup/material name "${name}" already exists. Use a distinct name so future material references remain deterministic.`);
      }
      const colorTexture =
        color_texture !== undefined
          ? resolveCreatePbrMaterialTexture(color_texture)
          : undefined;
      const normalTexture =
        normal_texture !== undefined
          ? resolveCreatePbrMaterialTexture(normal_texture)
          : undefined;
      const heightTexture =
        height_texture !== undefined
          ? resolveCreatePbrMaterialTexture(height_texture)
          : undefined;
      const merTexture =
        mer_texture !== undefined
          ? resolveCreatePbrMaterialTexture(mer_texture)
          : undefined;
      requireDistinctPbrChannelAssignments([
        { channel: "color", texture: colorTexture },
        { channel: "normal", texture: normalTexture },
        { channel: "height", texture: heightTexture },
        { channel: "mer", texture: merTexture },
      ]);
      const texturesToAdd = [
        colorTexture,
        normalTexture,
        heightTexture,
        merTexture,
      ].filter((texture): texture is Texture => texture !== undefined);
      const originalTextureChannels = texturesToAdd.map((texture) => ({
        texture,
        group: texture.group,
        pbrChannel: texture.pbr_channel,
      }));

      // @ts-ignore - TextureGroup is globally available
      const textureGroup = new TextureGroup({
        name,
        is_material: true,
      });

      Undo.initEdit({
        texture_groups: [],
        textures: texturesToAdd,
      });

      try {
        // Set material config values
        if (color_value) {
          textureGroup.material_config.color_value = [
            color_value[0],
            color_value[1],
            color_value[2],
            color_value[3],
          ];
        }
        if (mer_value) {
          textureGroup.material_config.mer_value = [
            mer_value[0],
            mer_value[1],
            mer_value[2],
          ];
        }
        if (subsurface_value !== undefined) {
          textureGroup.material_config.subsurface_value = subsurface_value;
        }
        textureGroup.material_config.saved = false;

        // Match Blockbench's native create-material path: author the two
        // channel fields directly before adding the material group.
        if (colorTexture) {
          colorTexture.group = textureGroup.uuid;
          colorTexture.pbr_channel = "color";
        }
        if (normalTexture) {
          normalTexture.group = textureGroup.uuid;
          normalTexture.pbr_channel = "normal";
        }
        if (heightTexture) {
          heightTexture.group = textureGroup.uuid;
          heightTexture.pbr_channel = "height";
        }
        if (merTexture) {
          merTexture.group = textureGroup.uuid;
          merTexture.pbr_channel = "mer";
        }

        textureGroup.add();

        Undo.finishEdit("Agent created PBR material", {
          texture_groups: [textureGroup],
          textures: texturesToAdd,
        });
      } catch (error) {
        for (const { texture, group, pbrChannel } of originalTextureChannels) {
          texture.group = group;
          texture.pbr_channel = pbrChannel;
        }
        textureGroup.remove();
        Undo.cancelEdit();
        Canvas.updateAll();
        throw error;
      }

      Canvas.updateAll();

      return JSON.stringify({
        success: true,
        material: {
          name: textureGroup.name,
          uuid: textureGroup.uuid,
          is_material: true,
          channels: {
            color: color_texture ? true : !!color_value,
            normal: !!normal_texture,
            height: !!height_texture,
            mer: mer_texture ? true : !!mer_value,
          },
        },
      });
    },
  }, textureToolDocs[5].status);

  createTool(textureToolDocs[6].name, {
    ...textureToolDocs[6],
    parameters: configureMaterialParameters,
    async execute({
      material,
      color_texture,
      normal_texture,
      height_texture,
      mer_texture,
      color_value,
      mer_value,
      subsurface_value,
    }) {
      const textureGroup = resolveTextureToolMaterial(material);
      const textures = textureGroup.getTextures();
      const colorTexture =
        color_texture !== undefined && color_texture !== "none"
          ? resolveConfigureMaterialTexture(color_texture)
          : undefined;
      const normalTexture =
        normal_texture !== undefined && normal_texture !== "none"
          ? resolveConfigureMaterialTexture(normal_texture)
          : undefined;
      const heightTexture =
        height_texture !== undefined && height_texture !== "none"
          ? resolveConfigureMaterialTexture(height_texture)
          : undefined;
      const merTexture =
        mer_texture !== undefined && mer_texture !== "none"
          ? resolveConfigureMaterialTexture(mer_texture)
          : undefined;
      requireDistinctPbrChannelAssignments([
        { channel: "color", texture: colorTexture },
        { channel: "normal", texture: normalTexture },
        { channel: "height", texture: heightTexture },
        { channel: "mer", texture: merTexture },
      ]);
      const assignmentTextures = [
        colorTexture,
        normalTexture,
        heightTexture,
        merTexture,
      ].filter((texture): texture is Texture => texture !== undefined);
      const undoTextures = [...textures, ...assignmentTextures].filter(
        (texture, index, all) =>
          all.findIndex((candidate) => candidate.uuid === texture.uuid) === index
      );

      Undo.initEdit({
        texture_groups: [textureGroup],
        textures: undoTextures,
      });

      try {
        // Handle color channel
        if (color_texture === "none") {
          textures
            .filter((t: Texture) => t.pbr_channel === "color")
            .forEach((t: Texture) => (t.group = ""));
        } else if (colorTexture) {
          textures
            .filter((t: Texture) => t.pbr_channel === "color")
            .forEach((t: Texture) => (t.pbr_channel = "color"));
          colorTexture.group = textureGroup.uuid;
          colorTexture.pbr_channel = "color";
        }

        // Handle normal channel
        if (normal_texture === "none") {
          textures
            .filter((t: Texture) => t.pbr_channel === "normal")
            .forEach((t: Texture) => (t.group = ""));
        } else if (normalTexture) {
          normalTexture.group = textureGroup.uuid;
          normalTexture.pbr_channel = "normal";
        }

        // Handle height channel
        if (height_texture === "none") {
          textures
            .filter((t: Texture) => t.pbr_channel === "height")
            .forEach((t: Texture) => (t.group = ""));
        } else if (heightTexture) {
          heightTexture.group = textureGroup.uuid;
          heightTexture.pbr_channel = "height";
        }

        // Handle MER channel
        if (mer_texture === "none") {
          textures
            .filter((t: Texture) => t.pbr_channel === "mer")
            .forEach((t: Texture) => (t.group = ""));
        } else if (merTexture) {
          merTexture.group = textureGroup.uuid;
          merTexture.pbr_channel = "mer";
        }

        // Update uniform values
        if (color_value) {
          textureGroup.material_config.color_value = [
            color_value[0],
            color_value[1],
            color_value[2],
            color_value[3],
          ];
        }
        if (mer_value) {
          textureGroup.material_config.mer_value = [
            mer_value[0],
            mer_value[1],
            mer_value[2],
          ];
        }
        if (subsurface_value !== undefined) {
          textureGroup.material_config.subsurface_value = subsurface_value;
        }

        textureGroup.material_config.saved = false;
        textureGroup.updateMaterial();

        Undo.finishEdit("Agent configured material");
      } catch (error) {
        Undo.cancelEdit(true);
        Canvas.updateAll();
        throw error;
      }

      Canvas.updateAll();

      return `Configured material "${textureGroup.name}"`;
    },
  }, textureToolDocs[6].status);

  createTool(textureToolDocs[7].name, {
    ...textureToolDocs[7],
    parameters: listMaterialsParameters,
    async execute() {
      // @ts-ignore - TextureGroup is globally available
      const materials = TextureGroup.all.filter(
        (g: TextureGroup) => g.is_material
      );

      const result = materials.map((group: TextureGroup) => {
        const textures = group.getTextures();
        return {
          name: group.name,
          uuid: group.uuid,
          channels: {
            color: getChannelTextureInfo(textures, "color"),
            normal: getChannelTextureInfo(textures, "normal"),
            height: getChannelTextureInfo(textures, "height"),
            mer: getChannelTextureInfo(textures, "mer"),
          },
          config: {
            color_value: group.material_config.color_value,
            mer_value: group.material_config.mer_value,
            subsurface_value: group.material_config.subsurface_value,
            saved: group.material_config.saved,
          },
        };
      });

      return {
        content: [
          {
            type: "text" as const,
            text: `Found ${result.length} PBR material(s).`,
          },
        ],
        structuredContent: { materials: result },
      };
    },
  }, textureToolDocs[7].status);

  createTool(textureToolDocs[8].name, {
    ...textureToolDocs[8],
    parameters: getMaterialInfoParameters,
    async execute({ material }) {
      const textureGroup = resolveTextureToolMaterial(material);
      const textures = textureGroup.getTextures();

      // Get compiled texture_set.json
      let textureSetJson = null;
      try {
        textureSetJson = textureGroup.material_config.compileForBedrock();
      } catch {
        // Format might not support texture_set.json
      }

      const result = {
        name: textureGroup.name,
        uuid: textureGroup.uuid,
        is_material: textureGroup.is_material,
        textures: textures.map((tex: Texture) => ({
          name: tex.name,
          uuid: tex.uuid,
          pbr_channel: tex.pbr_channel,
          width: tex.width,
          height: tex.height,
          render_mode: tex.render_mode,
          render_sides: tex.render_sides,
        })),
        config: {
          color_value: textureGroup.material_config.color_value,
          mer_value: textureGroup.material_config.mer_value,
          subsurface_value: textureGroup.material_config.subsurface_value,
          saved: textureGroup.material_config.saved,
          file_path: textureGroup.material_config.getFilePath(),
        },
        texture_set_json: textureSetJson,
      };

      return {
        content: [
          {
            type: "text" as const,
            text: `Read PBR material "${textureGroup.name}" (${textureGroup.uuid}) with ${textures.length} texture(s); texture_set preview: ${textureSetJson ? "available" : "unavailable"}.`,
          },
        ],
        structuredContent: result,
      };
    },
  }, textureToolDocs[8].status);

  createTool(textureToolDocs[9].name, {
    ...textureToolDocs[9],
    parameters: importTextureSetParameters,
    async execute({ path }) {
      // Validate path ends with texture_set.json
      if (!path.endsWith(".texture_set.json")) {
        throw new Error(
          "Path must end with '.texture_set.json'. Example: '/absolute/path/mytexture.texture_set.json'"
        );
      }

      const fs = requireNativeModule("fs");
      if (!fs) {
        throw new Error("File system access was denied. Cannot import texture_set.json.");
      }
      if (!fs.existsSync(path)) {
        throw new Error(`File not found: ${path}`);
      }

      const fileName = path.split(/[\/\\]/).pop() ?? path;
      const expectedGroupName = importedTextureGroupName(path);
      if (hasExactTextureGroupNameCollision(TextureGroup.all, expectedGroupName)) {
        throw new Error(
          `Import would create TextureGroup name "${expectedGroupName}", which already exists. Rename/remove the existing group or import a distinctly named texture_set.json.`
        );
      }

      const parseJson = (globalThis as typeof globalThis & {
        autoParseJSON?: (data: string, feedback?: boolean | { file_path?: string }) => unknown;
      }).autoParseJSON;
      if (typeof parseJson !== "function") {
        throw new Error("Blockbench JSON parser is unavailable. Cannot preflight texture_set.json safely.");
      }
      const document = parseJson(
        fs.readFileSync(path, { encoding: "utf-8" }),
        false
      );
      if (!isMinecraftTextureSetDocument(document)) {
        throw new Error(
          `File "${path}" is not a valid Minecraft texture_set document: expected an object-valued "minecraft:texture_set" root.`
        );
      }

      const groupUuidsBefore = new Set(
        TextureGroup.all.map((group: TextureGroup) => group.uuid)
      );
      // Native import owns its Undo boundary and image/channel loading behavior.
      // @ts-ignore - importTextureSet is globally available
      importTextureSet({ path, name: fileName });
      const createdGroups = TextureGroup.all.filter(
        (group: TextureGroup) => !groupUuidsBefore.has(group.uuid)
      );
      if (createdGroups.length !== 1) {
        throw new Error(
          `Native texture_set import created ${createdGroups.length} new TextureGroups; expected exactly 1.`
        );
      }
      const [createdGroup] = createdGroups;

      return `Imported texture set from "${path}" as material "${createdGroup.name}" (uuid: ${createdGroup.uuid}).`;
    },
  }, textureToolDocs[9].status);

  createTool(textureToolDocs[10].name, {
    ...textureToolDocs[10],
    parameters: assignTextureChannelParameters,
    async execute({ material, texture, channel }) {
      const textureGroup = resolveTextureToolMaterial(material);
      const tex = resolveAssignTextureChannelTexture(texture);
      const existingTextures = textureGroup.getTextures();
      const resetTextures = existingTextures.filter(
        (existing: Texture) =>
          existing.pbr_channel === channel && existing.uuid !== tex.uuid
      );
      if (
        tex.group === textureGroup.uuid &&
        tex.pbr_channel === channel &&
        resetTextures.length === 0
      ) {
        throw new Error(
          `Texture "${tex.name}" is already the only ${channel} assignment on material "${textureGroup.name}"; no authored change is required.`
        );
      }
      const undoTextures = [tex, ...resetTextures].filter(
        (candidate, index, all) =>
          all.findIndex((item) => item.uuid === candidate.uuid) === index
      );

      Undo.initEdit({
        texture_groups: [textureGroup],
        textures: undoTextures,
      });

      try {
        // Remove any existing texture from this channel in the group
        resetTextures.forEach((existing: Texture) => {
          existing.pbr_channel = "color"; // Reset to color
        });

        // Assign the texture to the channel
        tex.group = textureGroup.uuid;
        tex.pbr_channel = channel;

        textureGroup.material_config.saved = false;
        textureGroup.updateMaterial();

        Undo.finishEdit("Agent assigned texture channel");
      } catch (error) {
        Undo.cancelEdit(true);
        Canvas.updateAll();
        throw error;
      }

      Canvas.updateAll();

      return `Assigned texture "${tex.name}" to ${channel} channel of material "${textureGroup.name}"`;
    },
  }, textureToolDocs[10].status);

  createTool(textureToolDocs[11].name, {
    ...textureToolDocs[11],
    parameters: saveMaterialConfigParameters,
    async execute({ material }) {
      const textureGroup = resolveTextureToolMaterial(material);
      const filePath = textureGroup.material_config.getFilePath();

      if (!filePath) {
        throw new Error(
          "Cannot save: Material needs a color texture with a valid file path. Save the color texture first, then try again."
        );
      }

      const fs = requireNativeModule("fs");
      if (!fs) {
        throw new Error("File system access was denied. Cannot save texture_set.json.");
      }

      textureGroup.material_config.save();
      requireMaterialConfigSavePostcondition(
        textureGroup.material_config.saved === true,
        fs.existsSync(filePath),
        filePath
      );

      return `Saved material config to "${filePath}"`;
    },
  }, textureToolDocs[11].status);

  createTool(textureToolDocs[12].name, {
    ...textureToolDocs[12],
    parameters: activateTextureParameters,
    async execute({ texture }) {
      const target = resolveActivateTextureTexture(texture);
      if (Texture.selected?.uuid !== target.uuid) {
        target.select();
      }
      return `Activated texture "${target.name}" (uuid: ${target.uuid}). Paint tools will now target it by default.`;
    },
  }, textureToolDocs[12].status);
}
