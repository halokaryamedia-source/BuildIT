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
      .optional()
      .describe(
        "Name of the texture layer. Required if fill_color is set."
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
        "Texture-set import path must be absolute: use a POSIX `/...` path, a Windows drive path such as `C:\\...`, or a UNC path such as `\\\\server\\share\\...`.",
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

      Undo.initEdit({
        textures: [],
        collections: [],
      });

      let texture: Texture;

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

        Undo.finishEdit("Agent created texture");
      } catch (error) {
        Undo.cancelEdit(true);
        Canvas.updateAll();
        throw error;
      }

      Canvas.updateAll();

      const result = {
        texture: {
          uuid: texture.uuid,
          name: texture.name,
          id: texture.id,
          width: texture.width,
          height: texture.height,
          group: texture.group || null,
          pbr_channel: texture.pbr_channel || null,
          render_mode: texture.render_mode,
          render_sides: texture.render_sides,
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

      Undo.initEdit({
        texture_groups: [],
        textures: textureList,
      });

      try {
        textureGroup.add();

        textureList.forEach((texture) => {
          texture.extend({
            group: textureGroup.uuid,
          });
        });

        Undo.finishEdit("Agent added texture group");
      } catch (error) {
        Undo.cancelEdit(true);
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
      const textures = Project?.textures ?? Texture.all;

      return JSON.stringify(
        textures.map((texture) => ({
          name: texture.name,
          uuid: texture.uuid,
          id: texture.id,
          group: texture.group,
          render_mode: texture.render_mode,
          render_sides: texture.render_sides,
        }))
      );
    },
  }, textureToolDocs[3].status);

  createTool(textureToolDocs[4].name, {
    ...textureToolDocs[4],
    parameters: getTextureParameters,
    async execute({ texture }) {
      if (!texture) {
        const defaultTexture = Texture.getDefault();
        if (!defaultTexture) {
          throw new Error(
            "No default texture available. Use the create_texture tool to create one first, or specify a texture ID."
          );
        }
        return imageContent({ url: defaultTexture.getDataURL() });
      }

      const image = resolveGetTextureTexture(texture);
      return imageContent({ url: image.getDataURL() });
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

        textureGroup.add();

        // Assign preflighted textures to channels without resolving again.
        if (colorTexture) {
          colorTexture.extend({ group: textureGroup.uuid, pbr_channel: "color" });
        }
        if (normalTexture) {
          normalTexture.extend({ group: textureGroup.uuid, pbr_channel: "normal" });
        }
        if (heightTexture) {
          heightTexture.extend({ group: textureGroup.uuid, pbr_channel: "height" });
        }
        if (merTexture) {
          merTexture.extend({ group: textureGroup.uuid, pbr_channel: "mer" });
        }

        // Update material preview
        textureGroup.updateMaterial();

        Undo.finishEdit("Agent created PBR material");
      } catch (error) {
        Undo.cancelEdit(true);
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
          colorTexture.extend({ group: textureGroup.uuid, pbr_channel: "color" });
        }

        // Handle normal channel
        if (normal_texture === "none") {
          textures
            .filter((t: Texture) => t.pbr_channel === "normal")
            .forEach((t: Texture) => (t.group = ""));
        } else if (normalTexture) {
          normalTexture.extend({ group: textureGroup.uuid, pbr_channel: "normal" });
        }

        // Handle height channel
        if (height_texture === "none") {
          textures
            .filter((t: Texture) => t.pbr_channel === "height")
            .forEach((t: Texture) => (t.group = ""));
        } else if (heightTexture) {
          heightTexture.extend({ group: textureGroup.uuid, pbr_channel: "height" });
        }

        // Handle MER channel
        if (mer_texture === "none") {
          textures
            .filter((t: Texture) => t.pbr_channel === "mer")
            .forEach((t: Texture) => (t.group = ""));
        } else if (merTexture) {
          merTexture.extend({ group: textureGroup.uuid, pbr_channel: "mer" });
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

      return JSON.stringify(result);
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

      return JSON.stringify(result);
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
        tex.extend({
          group: textureGroup.uuid,
          pbr_channel: channel,
        });

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
