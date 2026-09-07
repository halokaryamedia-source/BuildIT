/// <reference types="blockbench-types" />

import { z } from "zod";
import {
  createTool,
  getAllToolDefinitions,
  invalidateToolRegistrationRuntimeCaches,
  type ToolSpec,
} from "@/lib/factories";
import { resolveCoreTexture } from "@/lib/coreIdentity";
import { getAndActivateTexture, imageContent } from "@/lib/util";
import {
  applyPaintTransactionRgba,
  buildPaintTransactionReceipt,
  paintTransactionParameters,
} from "@/lib/paintTransaction";
import {
  PAINT_TEXTURE_TRANSACTION_TOOL_NAME,
  requirePaintTransactionV1Target,
} from "@/lib/paintTransactionPolicy";
import {
  buildTextureEvidenceSnapshot,
  focusedGetTextureParameters,
} from "@/lib/textureEvidence";
import { buildTextureEvidenceDeliveryMetadata } from "@/lib/textureEvidenceDelivery";
import { computeTextureRevision } from "@/lib/textureRevision";
import {
  createTextureVariantParameters,
  planTextureVariantFromBase,
  type TextureVariantSource,
} from "@/lib/textureVariantPlan";
import { textureIdSchema } from "@/lib/zodObjects";
import { createTextureParameters } from "./texture";
import { wireAnimationRuntimeContracts } from "./animation-runtime-wiring";

/**
 * Runtime closure for source-prepared texture contracts. Keeping this adapter
 * separate avoids duplicating the pure policy/planning helpers while allowing
 * the existing mature texture/paint implementations to remain authoritative
 * for every legacy branch.
 */
export const wiredCreateTextureParameters = z.union([
  createTextureParameters,
  createTextureVariantParameters,
]);

export const paintTextureTransactionToolDocs: ToolSpec = {
  name: PAINT_TEXTURE_TRANSACTION_TOOL_NAME,
  description:
    "Applies one bounded exact-pixel transaction to a non-layered texture with optimistic revision protection and one native Undo unit.",
  annotations: {
    title: "Paint Texture Transaction",
    destructiveHint: true,
  },
  parameters: paintTransactionParameters,
  status: "stable",
};

type RuntimeToolDefinition = {
  inputSchema: Record<string, z.ZodType>;
  parameterSchema: z.ZodType;
  execute: (
    args: Record<string, unknown>,
    context?: unknown
  ) => Promise<unknown>;
};

let textureRuntimeContractsWired = false;

function requireRuntimeToolDefinition(name: string): RuntimeToolDefinition {
  const definitions = getAllToolDefinitions() as unknown as Record<
    string,
    RuntimeToolDefinition
  >;
  const definition = definitions[name];
  if (!definition) {
    throw new Error(
      `Cannot wire ${name}: its canonical runtime definition is unavailable.`
    );
  }
  return definition;
}

function textureGroupByReference(reference: string): TextureGroup {
  const groups = TextureGroup.all ?? [];
  const uuidMatch = groups.find((group) => group.uuid === reference);
  if (uuidMatch) return uuidMatch;

  const nameMatches = groups.filter((group) => group.name === reference);
  if (nameMatches.length === 1) return nameMatches[0];
  if (nameMatches.length > 1) {
    throw new Error(
      `TextureGroup name "${reference}" is ambiguous. Pass the TextureGroup UUID.`
    );
  }
  throw new Error(
    `TextureGroup "${reference}" was not found. Use add_texture_group first and pass its UUID or unique exact name.`
  );
}

function textureProductionRoleForVariant(texture: Texture): TextureVariantSource["role"] {
  const channel = texture.pbr_channel ?? "color";
  if (channel !== "color") return "pbr_support";
  if (!texture.group) return "base_color_candidate";
  const group = TextureGroup.all.find((candidate) => candidate.uuid === texture.group);
  return group?.is_material === false ? "explicit_variant" : "base_color_candidate";
}

function variantSource(texture: Texture): TextureVariantSource {
  return {
    uuid: texture.uuid,
    name: texture.name,
    width: texture.width,
    height: texture.height,
    role: textureProductionRoleForVariant(texture),
  };
}

async function createTextureVariant(request: z.infer<typeof createTextureVariantParameters>) {
  const source = resolveCoreTexture(
    request.source_texture_id,
    "Use list_textures to identify the single established base-color atlas."
  );
  const targetGroup = textureGroupByReference(request.group);
  const sources = Texture.all.map(variantSource);
  const plan = planTextureVariantFromBase({
    source: variantSource(source),
    base_color_candidates: sources.filter(
      (candidate) => candidate.role === "base_color_candidate"
    ),
    target_group: {
      uuid: targetGroup.uuid,
      name: targetGroup.name,
      is_material: targetGroup.is_material,
    },
    requested_name: request.name,
    existing_texture_names: Texture.all.map((texture) => texture.name),
  });

  Undo.initEdit({ textures: [], collections: [] });
  let variant: Texture | undefined;
  try {
    variant = new Texture({
      name: plan.requested_name,
      width: source.width,
      height: source.height,
      keep_size: true,
      group: targetGroup.uuid,
      pbr_channel: "color",
      render_mode: source.render_mode,
      render_sides: source.render_sides,
      wrap_mode: source.wrap_mode,
      frame_time: source.frame_time,
      frame_order_type: source.frame_order_type,
      frame_order: source.frame_order,
      frame_interpolate: source.frame_interpolate,
      internal: true,
    }).fromDataURL(source.getDataURL());

    variant.group = targetGroup.uuid;
    variant.pbr_channel = "color";
    variant.uv_width = source.uv_width;
    variant.uv_height = source.uv_height;
    variant.add(false, false);
    await variant.img.decode();

    Undo.finishEdit("Agent created texture variant", {
      textures: [variant],
      collections: [],
    });
  } catch (error) {
    variant?.remove(true);
    Undo.cancelEdit();
    Canvas.updateAll();
    throw error;
  }

  Canvas.updateAll();
  return {
    content: [
      {
        type: "text" as const,
        text: `Created explicit texture variant "${variant.name}" (${variant.uuid}) from base "${source.name}".`,
      },
    ],
    structuredContent: {
      texture: {
        uuid: variant.uuid,
        id: variant.id,
        name: variant.name,
        width: variant.width,
        height: variant.height,
        group: variant.group,
        pbr_channel: variant.pbr_channel,
      },
      variant_creation: plan,
    },
  };
}

function fullTextureRgba(texture: Texture): {
  pixels: Uint8ClampedArray;
  width: number;
  height: number;
} {
  const width = texture.canvas.width;
  const height = texture.canvas.height;
  if (!Number.isSafeInteger(width) || !Number.isSafeInteger(height) || width <= 0 || height <= 0) {
    throw new Error(
      `Texture "${texture.name}" has no positive decoded bitmap dimensions.`
    );
  }
  const data = texture.ctx.getImageData(0, 0, width, height).data;
  return {
    pixels: new Uint8ClampedArray(data),
    width,
    height,
  };
}

function rgbaToPngDataUrl(
  pixels: Uint8ClampedArray,
  width: number,
  height: number
): string {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: false });
  if (!ctx) throw new Error("Texture evidence PNG encoding requires a 2D canvas context.");
  const imageData = ctx.createImageData(width, height);
  imageData.data.set(pixels);
  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL("image/png", 1);
}

async function getFocusedTextureEvidence(request: z.infer<typeof focusedGetTextureParameters>) {
  const available = Project?.textures ?? Texture.all;
  if (!request.texture && available.length > 1) {
    throw new Error(
      "Multiple textures are loaded. Pass texture explicitly so get_texture returns evidence for the intended atlas."
    );
  }
  const texture = request.texture
    ? resolveCoreTexture(
        request.texture,
        "Use list_textures to confirm the intended texture UUID or unique exact name."
      )
    : Texture.getDefault();
  if (!texture) {
    throw new Error("No texture is available. Use create_texture first.");
  }

  const bitmap = fullTextureRgba(texture);
  const snapshot = await buildTextureEvidenceSnapshot(
    bitmap.pixels,
    bitmap.width,
    bitmap.height,
    {
      region: request.region,
      expected_revision: request.expected_revision,
    }
  );
  const metadata = buildTextureEvidenceDeliveryMetadata({
    inspection: snapshot.inspection,
    revision: snapshot.revision,
    bitmap: snapshot.bitmap,
    region: snapshot.region,
    source_byte_length: snapshot.byte_length,
    uv_width: texture.getUVWidth(),
    uv_height: texture.getUVHeight(),
  });
  const png = rgbaToPngDataUrl(
    snapshot.rgba,
    snapshot.region.width,
    snapshot.region.height
  );
  const image = imageContent(png, "image/png");

  return {
    ...image,
    structuredContent: {
      ...metadata,
      texture: {
        uuid: texture.uuid,
        id: texture.id,
        name: texture.name,
        width: texture.width,
        height: texture.height,
        uv_width: texture.getUVWidth(),
        uv_height: texture.getUVHeight(),
      },
    },
  };
}

export function registerPaintTextureTransactionTool(): void {
  createTool(
    paintTextureTransactionToolDocs.name,
    {
      ...paintTextureTransactionToolDocs,
      parameters: paintTransactionParameters,
      async execute({ texture_id, expected_revision, operations }) {
        const texture = getAndActivateTexture(texture_id);
        requirePaintTransactionV1Target({
          texture_uuid: texture.uuid,
          texture_name: texture.name,
          layers_enabled: texture.layers_enabled,
        });

        const before = fullTextureRgba(texture);
        const beforeRevision = await computeTextureRevision(
          before.pixels,
          before.width,
          before.height
        );
        if (beforeRevision !== expected_revision) {
          throw new Error(
            `Texture "${texture.name}" changed since the caller observed it. Expected revision ${expected_revision}, actual ${beforeRevision}. Refresh texture state before retrying the mutation.`
          );
        }

        const applied = applyPaintTransactionRgba(
          before.pixels,
          before.width,
          before.height,
          operations
        );
        const plannedAfterRevision = await computeTextureRevision(
          applied.pixels,
          before.width,
          before.height
        );
        const plannedReceipt = buildPaintTransactionReceipt({
          texture_uuid: texture.uuid,
          texture_name: texture.name,
          before_revision: beforeRevision,
          after_revision: plannedAfterRevision,
          operation_count: applied.operation_count,
          pixel_writes: applied.pixel_writes,
          affected_rect: applied.affected_rect,
        });

        const undoAspects: UndoAspects = {
          selected_texture: true,
          bitmap: true,
          textures: [texture],
        };
        Undo.initEdit(undoAspects);
        try {
          texture.edit(
            (_canvas, env) => {
              const imageData = env.ctx.createImageData(before.width, before.height);
              imageData.data.set(applied.pixels);
              env.ctx.putImageData(imageData, 0, 0);
            },
            { no_undo: true }
          );

          const actualAfter = fullTextureRgba(texture);
          const actualAfterRevision = await computeTextureRevision(
            actualAfter.pixels,
            actualAfter.width,
            actualAfter.height
          );
          if (actualAfterRevision !== plannedAfterRevision) {
            throw new Error(
              `Paint transaction postcondition mismatch: planned revision ${plannedAfterRevision}, actual ${actualAfterRevision}.`
            );
          }

          Undo.finishEdit("Paint texture transaction");
        } catch (error) {
          Undo.cancelEdit(true);
          Canvas.updateAll();
          throw error;
        }

        Canvas.updateAll();
        return {
          content: [
            {
              type: "text" as const,
              text: `Applied ${plannedReceipt.operation_count} texture operation(s) as one Undo transaction on "${texture.name}".`,
            },
          ],
          structuredContent: plannedReceipt,
        };
      },
    },
    paintTextureTransactionToolDocs.status
  );
}

/**
 * Replaces only the prepared create/get contracts after the canonical texture
 * family has registered. Legacy branches still dispatch to the original
 * create_texture executor; variant and focused evidence use their dedicated
 * source-owned policy helpers. Animation evidence/routing adapters are wired
 * here only because this is the last default family boundary after Animation,
 * Animation inspection, and camera registration are already available.
 */
export function wireTextureRuntimeContracts(): void {
  if (textureRuntimeContractsWired) return;

  wireAnimationRuntimeContracts();

  const createDefinition = requireRuntimeToolDefinition("create_texture");
  const originalCreate = createDefinition.execute.bind(createDefinition);
  createDefinition.parameterSchema = wiredCreateTextureParameters;
  createDefinition.inputSchema = {
    ...createDefinition.inputSchema,
    type: z
      .enum(["blank", "template", "variant"])
      .default("blank")
      .describe("Texture creation mode. variant duplicates the established base atlas into an explicit non-material group."),
    source_texture_id: textureIdSchema
      .optional()
      .describe("Required only when type=variant: established base-color texture UUID/ID/unique exact name."),
  };
  createDefinition.execute = async (args, context) => {
    if (args.type === "variant") {
      return createTextureVariant(
        createTextureVariantParameters.parse(args)
      );
    }
    return originalCreate(args, context);
  };

  const getDefinition = requireRuntimeToolDefinition("get_texture");
  getDefinition.parameterSchema = focusedGetTextureParameters;
  getDefinition.inputSchema = focusedGetTextureParameters.shape;
  getDefinition.execute = async (args) =>
    getFocusedTextureEvidence(focusedGetTextureParameters.parse(args));

  textureRuntimeContractsWired = true;
  invalidateToolRegistrationRuntimeCaches();
}
