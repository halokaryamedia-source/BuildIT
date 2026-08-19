/// <reference types="three" />
/// <reference types="blockbench-types" />
import { z } from "zod";
import { createTool, type ToolSpec } from "@/lib/factories";
import { STATUS_EXPERIMENTAL } from "@/lib/constants";
import { getProjectTexture, getAndActivateTexture, setBarItemValue } from "@/lib/util";
import {
  textureIdOptionalSchema,
  hexColorSchema,
  opacitySchema,
  brushSizeSchema,
  brushSoftnessSchema,
  brushShapeEnum,
  blendModeEnum,
  fillModeEnum,
  drawShapeEnum,
  copyBrushModeEnum,
  brushModifierEnum,
  axisEnum,
  coordinateSchema,
  brushSettingsSchema,
} from "@/lib/zodObjects";

const textureLayerBlendModeEnum = z.enum([
  "default",
  "set_opacity",
  "color",
  "multiply",
  "add",
  "darken",
  "lighten",
  "screen",
  "overlay",
  "difference",
  "alpha_mask",
]);

export const paintFillToolParameters = z.object({
  texture_id: textureIdOptionalSchema,
  x: z.number().describe("X coordinate to start fill."),
  y: z.number().describe("Y coordinate to start fill."),
  color: hexColorSchema.describe("Fill color as hex string."),
  opacity: opacitySchema.describe("Fill opacity (0-255)."),
  fill_mode: fillModeEnum
    .optional()
    .default("color_connected")
    .describe("Fill mode."),
  blend_mode: blendModeEnum.optional().describe("Fill blend mode."),
});

export const drawShapeToolParameters = z.object({
  texture_id: textureIdOptionalSchema,
  shape: drawShapeEnum.describe("Shape to draw. '_h' suffix means hollow."),
  start: coordinateSchema.extend({
    x: z.number().describe("Start X coordinate."),
    y: z.number().describe("Start Y coordinate."),
  }),
  end: coordinateSchema.extend({
    x: z.number().describe("End X coordinate."),
    y: z.number().describe("End Y coordinate."),
  }),
  color: hexColorSchema.describe("Shape color as hex string."),
  line_width: z
    .number()
    .min(1)
    .max(50)
    .optional()
    .describe("Line width for hollow shapes."),
  opacity: opacitySchema.describe("Shape opacity (0-255)."),
  blend_mode: blendModeEnum.optional().describe("Shape blend mode."),
});

export const gradientToolParameters = z.object({
  texture_id: textureIdOptionalSchema,
  start: coordinateSchema.extend({
    x: z.number().describe("Gradient start X coordinate."),
    y: z.number().describe("Gradient start Y coordinate."),
  }),
  end: coordinateSchema.extend({
    x: z.number().describe("Gradient end X coordinate."),
    y: z.number().describe("Gradient end Y coordinate."),
  }),
  start_color: z.string().describe("Start color as hex string."),
  end_color: z.string().describe("End color as hex string."),
  opacity: opacitySchema.describe("Gradient opacity (0-255)."),
  blend_mode: blendModeEnum.optional().describe("Gradient blend mode."),
});

export const colorPickerToolParameters = z.object({
  texture_id: textureIdOptionalSchema,
  x: z.number().describe("X coordinate to pick color from."),
  y: z.number().describe("Y coordinate to pick color from."),
  set_as_secondary: z
    .boolean()
    .optional()
    .default(false)
    .describe("Set as secondary color instead of primary."),
  pick_opacity: z
    .boolean()
    .optional()
    .default(false)
    .describe("Also pick and apply the pixel's opacity."),
});

export const copyBrushToolParameters = z.object({
  texture_id: textureIdOptionalSchema,
  source: coordinateSchema.extend({
    x: z.number().describe("Source X coordinate to copy from."),
    y: z.number().describe("Source Y coordinate to copy from."),
  }),
  target: coordinateSchema.extend({
    x: z.number().describe("Target X coordinate to paste to."),
    y: z.number().describe("Target Y coordinate to paste to."),
  }),
  brush_size: brushSizeSchema.describe("Copy brush size."),
  opacity: opacitySchema.describe("Copy opacity (0-255)."),
  mode: copyBrushModeEnum.optional().default("copy").describe("Copy brush mode."),
});

export const eraserToolParameters = z.object({
  texture_id: textureIdOptionalSchema,
  coordinates: z
    .array(
      coordinateSchema.extend({
        x: z.number().describe("X coordinate to erase at."),
        y: z.number().describe("Y coordinate to erase at."),
      })
    )
    .describe("Array of coordinates to erase at."),
  brush_size: brushSizeSchema.describe("Eraser brush size."),
  opacity: opacitySchema.describe("Eraser opacity (0-255)."),
  softness: brushSoftnessSchema.describe("Eraser softness percentage."),
  shape: brushShapeEnum.optional().describe("Eraser shape."),
  connect_strokes: z
    .boolean()
    .optional()
    .default(true)
    .describe("Whether to connect erase strokes with lines."),
});

export const paintSettingsParameters = z.object({
  mirror_painting: z
    .object({
      enabled: z.boolean().describe("Enable mirror painting."),
      axis: z.array(axisEnum).optional().describe("Mirror axes."),
      texture: z.boolean().optional().describe("Enable texture mirroring."),
      texture_center: coordinateSchema
        .extend({
          x: z.number().describe("X coordinate of texture mirror center."),
          y: z.number().describe("Y coordinate of texture mirror center."),
        })
        .optional()
        .describe("Texture mirror center."),
    })
    .optional()
    .describe("Mirror painting settings."),
  lock_alpha: z
    .boolean()
    .optional()
    .describe("Lock alpha channel while painting."),
  pixel_perfect: z
    .boolean()
    .optional()
    .describe("Enable pixel perfect drawing."),
  paint_side_restrict: z
    .boolean()
    .optional()
    .describe("Restrict painting to current face side."),
  color_erase_mode: z
    .boolean()
    .optional()
    .describe("Enable color erase mode."),
  brush_opacity_modifier: brushModifierEnum
    .optional()
    .describe("Brush opacity modifier for stylus."),
  brush_size_modifier: brushModifierEnum
    .optional()
    .describe("Brush size modifier for stylus."),
  paint_with_stylus_only: z
    .boolean()
    .optional()
    .describe("Only allow painting with stylus input."),
  pick_color_opacity: z
    .boolean()
    .optional()
    .describe("Pick opacity when using color picker."),
  pick_combined_color: z
    .boolean()
    .optional()
    .describe("Pick combined layer colors."),
});

export const paintWithBrushParameters = z.object({
  texture_id: textureIdOptionalSchema,
  coordinates: z
    .array(
      coordinateSchema.extend({
        x: z.number().describe("X coordinate on texture."),
        y: z.number().describe("Y coordinate on texture."),
      })
    )
    .describe("Array of coordinates to paint at."),
  brush_settings: brushSettingsSchema,
  connect_strokes: z
    .boolean()
    .optional()
    .default(true)
    .describe("Whether to connect paint strokes with lines."),
});

export const createBrushPresetParameters = z.object({
  name: z.string().describe("Name of the brush preset."),
  size: brushSizeSchema,
  opacity: opacitySchema,
  softness: brushSoftnessSchema,
  shape: brushShapeEnum.optional().describe("Brush shape."),
  color: hexColorSchema.describe("Brush color as hex string."),
  blend_mode: blendModeEnum.optional().describe("Brush blend mode."),
  pixel_perfect: z
    .boolean()
    .optional()
    .describe("Enable pixel perfect drawing."),
});

export const loadBrushPresetParameters = z.object({
  preset_name: z.string().describe("Name of the brush preset to load."),
});

export const textureSelectionParameters = z.object({
  action: z
    .enum([
      "select_rectangle",
      "select_ellipse",
      "select_all",
      "clear_selection",
      "invert_selection",
      "expand_selection",
      "contract_selection",
    ])
    .describe("Selection action to perform."),
  texture_id: textureIdOptionalSchema,
  coordinates: z
    .object({
      x1: z.number().describe("Start X coordinate."),
      y1: z.number().describe("Start Y coordinate."),
      x2: z.number().describe("End X coordinate."),
      y2: z.number().describe("End Y coordinate."),
    })
    .optional()
    .describe("Selection area coordinates."),
  radius: z
    .number()
    .optional()
    .describe("Radius for expand/contract operations."),
  mode: z
    .enum(["create", "add", "subtract", "intersect"])
    .optional()
    .default("create")
    .describe("Selection mode."),
});

export const textureLayerManagementParameters = z.object({
  action: z
    .enum([
      "create_layer",
      "delete_layer",
      "duplicate_layer",
      "merge_down",
      "set_opacity",
      "set_blend_mode",
      "move_layer",
      "rename_layer",
      "flatten_layers",
    ])
    .describe("Layer management action."),
  texture_id: textureIdOptionalSchema,
  layer_name: z.string().optional().describe("Name of the layer."),
  opacity: z
    .number()
    .min(0)
    .max(100)
    .optional()
    .describe("Layer opacity percentage."),
  blend_mode: textureLayerBlendModeEnum.optional().describe("Layer blend mode."),
  target_index: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .describe("0-based final layer index."),
});

export const paintToolDocs: ToolSpec[] = [
  {
    name: "paint_fill_tool",
    description: "Uses the fill/bucket tool to fill areas with color.",
    annotations: {
      title: "Paint Fill Tool",
      destructiveHint: true,
    },
    parameters: paintFillToolParameters,
    status: STATUS_EXPERIMENTAL,
  },
  {
    name: "draw_shape_tool",
    description: "Draws geometric shapes on textures.",
    annotations: {
      title: "Draw Shape Tool",
      destructiveHint: true,
    },
    parameters: drawShapeToolParameters,
    status: STATUS_EXPERIMENTAL,
  },
  {
    name: "gradient_tool",
    description: "Applies gradients to textures.",
    annotations: {
      title: "Gradient Tool",
      destructiveHint: true,
    },
    parameters: gradientToolParameters,
    status: STATUS_EXPERIMENTAL,
  },
  {
    name: "color_picker_tool",
    description:
      "Picks colors from textures and sets them as the active color.",
    annotations: {
      title: "Color Picker Tool",
      readOnlyHint: true,
    },
    parameters: colorPickerToolParameters,
    status: STATUS_EXPERIMENTAL,
  },
  {
    name: "copy_brush_tool",
    description: "Uses the copy/clone brush to copy texture areas.",
    annotations: {
      title: "Copy Brush Tool",
      destructiveHint: true,
    },
    parameters: copyBrushToolParameters,
    status: STATUS_EXPERIMENTAL,
  },
  {
    name: "eraser_tool",
    description: "Erases parts of textures with customizable settings.",
    annotations: {
      title: "Eraser Tool",
      destructiveHint: true,
    },
    parameters: eraserToolParameters,
    status: STATUS_EXPERIMENTAL,
  },
  {
    name: "paint_settings",
    description: "Configures paint mode settings and preferences.",
    annotations: {
      title: "Paint Settings",
      destructiveHint: true,
    },
    parameters: paintSettingsParameters,
    status: STATUS_EXPERIMENTAL,
  },
  {
    name: "paint_with_brush",
    description:
      "Paints on textures using the brush tool with customizable settings.",
    annotations: {
      title: "Paint with Brush",
      destructiveHint: true,
    },
    parameters: paintWithBrushParameters,
    status: STATUS_EXPERIMENTAL,
  },
  {
    name: "create_brush_preset",
    description: "Creates a custom brush preset with specified settings.",
    annotations: {
      title: "Create Brush Preset",
      destructiveHint: true,
    },
    parameters: createBrushPresetParameters,
    status: STATUS_EXPERIMENTAL,
  },
  {
    name: "load_brush_preset",
    description: "Loads and applies a brush preset by name.",
    annotations: {
      title: "Load Brush Preset",
      destructiveHint: true,
    },
    parameters: loadBrushPresetParameters,
    status: STATUS_EXPERIMENTAL,
  },
  {
    name: "texture_selection",
    description:
      "Creates, modifies, or manipulates texture selections for painting.",
    annotations: {
      title: "Texture Selection",
      destructiveHint: true,
    },
    parameters: textureSelectionParameters,
    status: STATUS_EXPERIMENTAL,
  },
  {
    name: "texture_layer_management",
    description: "Creates, manages, and manipulates texture layers.",
    annotations: {
      title: "Texture Layer Management",
      destructiveHint: true,
    },
    parameters: textureLayerManagementParameters,
    status: STATUS_EXPERIMENTAL,
  },
];

function getRuntimePainter(): BlockbenchRuntimePainter {
  return Painter as unknown as BlockbenchRuntimePainter;
}

type PaintCoordinate = { x: number; y: number };

export function requirePaintCoordinates(
  coordinates: readonly PaintCoordinate[],
  toolName: string
): void {
  if (coordinates.length === 0) {
    throw new Error(`${toolName} requires at least one coordinate.`);
  }
}

type TexturePixelRegion = {
  rect: [number, number, number, number];
  size: [number, number];
};

function requirePositiveTextureDimension(value: number, context: string): number {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${context} must be a finite positive texture dimension.`);
  }
  return value;
}

function requireFiniteTexturePoint(
  point: PaintCoordinate,
  width: number,
  height: number,
  context: string
): void {
  if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) {
    throw new Error(`${context} must use finite texture coordinates.`);
  }
  if (point.x < 0 || point.y < 0 || point.x >= width || point.y >= height) {
    throw new Error(
      `${context} (${point.x}, ${point.y}) is outside texture bounds 0..${width - 1} × 0..${height - 1}.`
    );
  }
}

export function normalizeTexturePixelRegion(
  start: PaintCoordinate,
  end: PaintCoordinate,
  width: number,
  height: number,
  context: string
): TexturePixelRegion {
  requirePositiveTextureDimension(width, `${context} texture width`);
  requirePositiveTextureDimension(height, `${context} texture height`);
  requireFiniteTexturePoint(start, width, height, `${context} start`);
  requireFiniteTexturePoint(end, width, height, `${context} end`);
  if (
    !Number.isInteger(start.x) ||
    !Number.isInteger(start.y) ||
    !Number.isInteger(end.x) ||
    !Number.isInteger(end.y)
  ) {
    throw new Error(`${context} requires integer pixel coordinates for bounded region authoring.`);
  }

  const left = Math.min(start.x, end.x);
  const top = Math.min(start.y, end.y);
  const right = Math.max(start.x, end.x) + 1;
  const bottom = Math.max(start.y, end.y) + 1;
  return {
    rect: [left, top, right, bottom],
    size: [right - left, bottom - top],
  };
}

export function texturePixelRectToUvTag(
  rect: readonly number[],
  width: number,
  height: number,
  uvWidth: number,
  uvHeight: number,
  context: string
): [number, number, number, number] {
  requirePositiveTextureDimension(width, `${context} texture width`);
  requirePositiveTextureDimension(height, `${context} texture height`);
  requirePositiveTextureDimension(uvWidth, `${context} UV width`);
  requirePositiveTextureDimension(uvHeight, `${context} UV height`);
  if (
    rect.length !== 4 ||
    rect.some((value) => !Number.isFinite(value) || !Number.isInteger(value))
  ) {
    throw new Error(`${context} requires an integer [left, top, right, bottom] pixel rectangle.`);
  }
  const [left, top, right, bottom] = rect;
  if (left < 0 || top < 0 || right <= left || bottom <= top || right > width || bottom > height) {
    throw new Error(`${context} pixel rectangle is outside the active texture frame.`);
  }
  return [
    (left / width) * uvWidth,
    (top / height) * uvHeight,
    (right / width) * uvWidth,
    (bottom / height) * uvHeight,
  ];
}

export function requireTextureCoordinatesWithinBounds(
  coordinates: readonly PaintCoordinate[],
  width: number,
  height: number,
  toolName: string
): void {
  requirePositiveTextureDimension(width, `${toolName} texture width`);
  requirePositiveTextureDimension(height, `${toolName} texture height`);
  coordinates.forEach((coordinate, index) =>
    requireFiniteTexturePoint(
      coordinate,
      width,
      height,
      `${toolName} coordinate[${index}]`
    )
  );
}

function exactPixelBounds(coordinates: readonly PaintCoordinate[]): TexturePixelRegion {
  const xs = coordinates.map((coordinate) => coordinate.x);
  const ys = coordinates.map((coordinate) => coordinate.y);
  const left = Math.min(...xs);
  const top = Math.min(...ys);
  const right = Math.max(...xs) + 1;
  const bottom = Math.max(...ys) + 1;
  return { rect: [left, top, right, bottom], size: [right - left, bottom - top] };
}

export function isExactPixelAuthoringRequest(
  coordinates: readonly PaintCoordinate[],
  settings: {
    size: number;
    opacity: number;
    softness: number;
    shape: string;
    blendMode: string;
    connectStrokes: boolean;
    mirrorPainting: boolean;
    lockAlpha: boolean;
    eraseMode: boolean;
  }
): boolean {
  return (
    coordinates.every(
      (coordinate) => Number.isInteger(coordinate.x) && Number.isInteger(coordinate.y)
    ) &&
    settings.size === 1 &&
    settings.opacity === 255 &&
    settings.softness === 0 &&
    settings.shape === "square" &&
    settings.blendMode === "default" &&
    settings.connectStrokes === false &&
    settings.mirrorPainting === false &&
    settings.lockAlpha === false &&
    settings.eraseMode === false
  );
}

export function registerPaintTools() {
  createTool(
    paintToolDocs[0].name,
    {
      ...paintToolDocs[0],
      parameters: paintFillToolParameters,
      async execute({
        texture_id,
        x,
        y,
        color,
        opacity,
        fill_mode,
        blend_mode,
      }) {
        const texture = getAndActivateTexture(texture_id);

        // Apply settings
        if (color) {
          ColorPanel.set(color, false, false);
        }
        if (opacity !== undefined) {
          setBarItemValue("slider_brush_opacity", opacity);
        }
        if (fill_mode) {
          setBarItemValue("fill_mode", fill_mode);
        }
        if (blend_mode) {
          setBarItemValue("blend_mode", blend_mode);
        }

        // Select fill tool
        // @ts-ignore
        BarItems.fill_tool.select();

        // Perform fill
        getRuntimePainter().startPaintTool(texture, x, y, {}, { shiftKey: false });
        getRuntimePainter().stopPaintTool();
        Canvas.updateAll();

        return `Filled area at (${x}, ${y}) on texture "${texture.name}"`;
      },
    },
    paintToolDocs[0].status
  );

  createTool(
    paintToolDocs[1].name,
    {
      ...paintToolDocs[1],
      parameters: drawShapeToolParameters,
      async execute({
        texture_id,
        shape,
        start,
        end,
        color,
        line_width,
        opacity,
        blend_mode,
      }) {
        const texture = getAndActivateTexture(texture_id);
        if (getRuntimePainter().mirror_painting) {
          throw new Error(
            "draw_shape_tool bounded region authoring requires mirror painting to be disabled so no mirrored write can escape the reported bounds."
          );
        }
        const region = normalizeTexturePixelRegion(
          start,
          end,
          texture.width,
          texture.display_height,
          "draw_shape_tool"
        );
        const uvTag = texturePixelRectToUvTag(
          region.rect,
          texture.width,
          texture.display_height,
          texture.getUVWidth(),
          texture.getUVHeight(),
          "draw_shape_tool"
        );

        // Apply settings
        if (color) {
          ColorPanel.set(color, false, false);
        }
        if (opacity !== undefined) {
          setBarItemValue("slider_brush_opacity", opacity);
        }
        if (line_width !== undefined) {
          setBarItemValue("slider_brush_size", line_width);
        }
        if (blend_mode) {
          setBarItemValue("blend_mode", blend_mode);
        }

        // Set shape type
        setBarItemValue("draw_shape_type", shape);

        // Select draw shape tool
        // @ts-ignore
        BarItems.draw_shape_tool.select();

        // Pass the bounded UV tag through Blockbench's native Painter so the
        // requested pixel rectangle clips the shape instead of allowing bleed.
        getRuntimePainter().startPaintTool(
          texture,
          start.x,
          start.y,
          uvTag,
          { shiftKey: false }
        );
        getRuntimePainter().useShapeTool(texture, end.x, end.y, {}, uvTag);
        getRuntimePainter().stopPaintTool();
        Canvas.updateAll();

        const result = {
          operation: "draw_shape",
          shape,
          texture: { uuid: texture.uuid, name: texture.name, id: texture.id },
          bounded: true,
          affected_rect: region.rect,
          affected_size: region.size,
        };
        return {
          content: [
            {
              type: "text" as const,
              text: `Drew ${shape} inside texture pixel bounds [${region.rect.join(", ")}] on "${texture.name}".`,
            },
          ],
          structuredContent: result,
        };
      },
    },
    paintToolDocs[1].status
  );

  createTool(
    paintToolDocs[2].name,
    {
      ...paintToolDocs[2],
      parameters: gradientToolParameters,
      async execute({
        texture_id,
        start,
        end,
        start_color,
        end_color,
        opacity,
        blend_mode,
      }) {
        const texture = getAndActivateTexture(texture_id);

        // Apply settings
        ColorPanel.set(start_color, false, false);
        // @ts-ignore
        ColorPanel.set(end_color, true, false); // Set as secondary color

        if (opacity !== undefined) {
          setBarItemValue("slider_brush_opacity", opacity);
        }
        if (blend_mode) {
          setBarItemValue("blend_mode", blend_mode);
        }

        // Select gradient tool
        // @ts-ignore
        BarItems.gradient_tool.select();

        // Apply gradient
        getRuntimePainter().startPaintTool(texture, start.x, start.y, {}, { shiftKey: false });
        getRuntimePainter().useGradientTool(texture, end.x, end.y, {});
        getRuntimePainter().stopPaintTool();
        Canvas.updateAll();

        return `Applied gradient from (${start.x}, ${start.y}) to (${end.x}, ${end.y}) on texture "${texture.name}"`;
      },
    },
    paintToolDocs[2].status
  );

  createTool(
    paintToolDocs[3].name,
    {
      ...paintToolDocs[3],
      parameters: colorPickerToolParameters,
      async execute({ texture_id, x, y, set_as_secondary, pick_opacity }) {
        const texture = getAndActivateTexture(texture_id);

        // Pick color
        getRuntimePainter().colorPicker(texture, x, y, { button: set_as_secondary ? 2 : 0 });

        // Get the picked color
        const color = ColorPanel.get(false);

        if (pick_opacity) {
          // Read the alpha byte directly from the active texture canvas.
          const pixel = texture.ctx.getImageData(Math.floor(x), Math.floor(y), 1, 1).data;
          const opacity = pixel[3];

          // Apply opacity to brush tools
          for (let id in BarItems) {
            const tool = BarItems[id];
            // @ts-ignore
            if (tool.tool_settings && tool.tool_settings.brush_opacity >= 0) {
              // @ts-ignore
              tool.tool_settings.brush_opacity = opacity;
            }
          }

          return `Picked color ${color} with opacity ${opacity} from (${x}, ${y}) on texture "${texture.name}"`;
        }

        return `Picked color ${color} from (${x}, ${y}) on texture "${texture.name}"`;
      },
    },
    paintToolDocs[3].status
  );

  createTool(
    paintToolDocs[4].name,
    {
      ...paintToolDocs[4],
      parameters: copyBrushToolParameters,
      async execute({ texture_id, source, target, brush_size, opacity, mode }) {
        const texture = getAndActivateTexture(texture_id);

        // Apply settings
        if (brush_size !== undefined) {
          setBarItemValue("slider_brush_size", brush_size);
        }
        if (opacity !== undefined) {
          setBarItemValue("slider_brush_opacity", opacity);
        }
        if (mode) {
          setBarItemValue("copy_brush_mode", mode);
        }

        // Select copy brush tool
        // @ts-ignore
        BarItems.copy_brush.select();

        // Set source point (Ctrl+click equivalent)
        getRuntimePainter().startPaintTool(texture, source.x, source.y, {}, {
          ctrlOrCmd: true,
        });

        // Apply at target point. The native Painter lifecycle owns Undo.
        getRuntimePainter().startPaintTool(texture, target.x, target.y, {}, { shiftKey: false });
        getRuntimePainter().stopPaintTool();
        Canvas.updateAll();

        return `Copied from (${source.x}, ${source.y}) to (${target.x}, ${target.y}) on texture "${texture.name}"`;
      },
    },
    paintToolDocs[4].status
  );

  createTool(
    paintToolDocs[5].name,
    {
      ...paintToolDocs[5],
      parameters: eraserToolParameters,
      async execute({
        texture_id,
        coordinates,
        brush_size,
        opacity,
        softness,
        shape,
        connect_strokes,
      }) {
        requirePaintCoordinates(coordinates, "eraser_tool");
        const texture = getAndActivateTexture(texture_id);

        if (brush_size !== undefined) {
          setBarItemValue("slider_brush_size", brush_size);
        }
        if (opacity !== undefined) {
          setBarItemValue("slider_brush_opacity", opacity);
        }
        if (softness !== undefined) {
          setBarItemValue("slider_brush_softness", softness);
        }
        if (shape !== undefined) {
          setBarItemValue("brush_shape", shape);
        }

        // @ts-ignore - official Blockbench Painter tool ID
        BarItems.eraser.select();

        const first = coordinates[0];
        getRuntimePainter().startPaintTool(
          texture,
          first.x,
          first.y,
          {},
          { shiftKey: false }
        );
        for (const coord of coordinates.slice(1)) {
          getRuntimePainter().movePaintTool(
            texture,
            coord.x,
            coord.y,
            {},
            !connect_strokes
          );
        }
        getRuntimePainter().stopPaintTool();
        Canvas.updateAll();

        return `Erased ${coordinates.length} points on texture "${texture.name}"`;
      },
    },
    paintToolDocs[5].status
  );

  createTool(
    paintToolDocs[6].name,
    {
      ...paintToolDocs[6],
      parameters: paintSettingsParameters,
      async execute({
        mirror_painting,
        lock_alpha,
        pixel_perfect,
        paint_side_restrict,
        color_erase_mode,
        brush_opacity_modifier,
        brush_size_modifier,
        paint_with_stylus_only,
        pick_color_opacity,
        pick_combined_color,
      }) {
        const appliedSettings: string[] = [];
        const requestedBlockbenchSettings = [
          ["paint_side_restrict", paint_side_restrict],
          ["brush_opacity_modifier", brush_opacity_modifier],
          ["brush_size_modifier", brush_size_modifier],
          ["paint_with_stylus_only", paint_with_stylus_only],
          ["pick_color_opacity", pick_color_opacity],
          ["pick_combined_color", pick_combined_color],
        ] as const;

        for (const [settingId, value] of requestedBlockbenchSettings) {
          if (value !== undefined && !settings[settingId]) {
            throw new Error(`Blockbench setting "${settingId}" is unavailable.`);
          }
        }

        // Mirror painting
        if (mirror_painting !== undefined) {
          setBarItemValue("mirror_painting", mirror_painting.enabled);
          getRuntimePainter().mirror_painting = mirror_painting.enabled;
          appliedSettings.push(`Mirror painting: ${mirror_painting.enabled}`);

          if (
            mirror_painting.enabled &&
            (mirror_painting.axis ||
              mirror_painting.texture ||
              mirror_painting.texture_center)
          ) {
            // @ts-ignore
            const options = getRuntimePainter().mirror_painting_options;
            if (mirror_painting.axis) {
              mirror_painting.axis.forEach((axis) => {
                options[axis] = true;
              });
            }
            if (mirror_painting.texture !== undefined) {
              options.texture = mirror_painting.texture;
            }
            if (mirror_painting.texture_center) {
              options.texture_center = [
                mirror_painting.texture_center.x,
                mirror_painting.texture_center.y,
              ];
            }
            appliedSettings.push(`Mirror options updated`);
          }
        }

        // Lock alpha
        if (lock_alpha !== undefined) {
          getRuntimePainter().lock_alpha = lock_alpha;
          appliedSettings.push(`Lock alpha: ${lock_alpha}`);
        }

        // Pixel perfect
        if (pixel_perfect !== undefined) {
          setBarItemValue("pixel_perfect_drawing", pixel_perfect);
          appliedSettings.push(`Pixel perfect: ${pixel_perfect}`);
        }

        // Color erase mode
        if (color_erase_mode !== undefined) {
          setBarItemValue("color_erase_mode", color_erase_mode);
          getRuntimePainter().erase_mode = color_erase_mode;
          appliedSettings.push(`Color erase mode: ${color_erase_mode}`);
        }

        if (paint_side_restrict !== undefined) {
          settings.paint_side_restrict.set(paint_side_restrict);
          appliedSettings.push(`Paint side restrict: ${paint_side_restrict}`);
        }

        if (brush_opacity_modifier !== undefined) {
          settings.brush_opacity_modifier.set(brush_opacity_modifier);
          appliedSettings.push(`Brush opacity modifier: ${brush_opacity_modifier}`);
        }

        if (brush_size_modifier !== undefined) {
          settings.brush_size_modifier.set(brush_size_modifier);
          appliedSettings.push(`Brush size modifier: ${brush_size_modifier}`);
        }

        if (paint_with_stylus_only !== undefined) {
          settings.paint_with_stylus_only.set(paint_with_stylus_only);
          appliedSettings.push(`Paint with stylus only: ${paint_with_stylus_only}`);
        }

        if (pick_color_opacity !== undefined) {
          settings.pick_color_opacity.set(pick_color_opacity);
          appliedSettings.push(`Pick color opacity: ${pick_color_opacity}`);
        }

        if (pick_combined_color !== undefined) {
          settings.pick_combined_color.set(pick_combined_color);
          appliedSettings.push(`Pick combined color: ${pick_combined_color}`);
        }

        return `Updated paint settings: ${appliedSettings.join(", ")}`;
      },
    },
    paintToolDocs[6].status
  );

  createTool(
    paintToolDocs[7].name,
    {
      ...paintToolDocs[7],
      parameters: paintWithBrushParameters,
      async execute({
        texture_id,
        coordinates,
        brush_settings,
        connect_strokes,
      }) {
        requirePaintCoordinates(coordinates, "paint_with_brush");
        const texture = getAndActivateTexture(texture_id);

        const colorHex = brush_settings?.color ?? "#000000";
        const size = brush_settings?.size ?? 1;
        const opacity = brush_settings?.opacity ?? 255;
        const softness = brush_settings?.softness ?? 0;
        const shape = brush_settings?.shape ?? "square";
        const blendMode = brush_settings?.blend_mode ?? "ambient";

        setBarItemValue("slider_brush_size", size);
        setBarItemValue("slider_brush_opacity", opacity);
        setBarItemValue("slider_brush_softness", softness);
        setBarItemValue("brush_shape", shape);
        if (brush_settings?.blend_mode !== undefined) {
          setBarItemValue("blend_mode", brush_settings.blend_mode);
        }
        ColorPanel.set(colorHex, false, false);

        const exactPixelMode = isExactPixelAuthoringRequest(coordinates, {
          size,
          opacity,
          softness,
          shape,
          blendMode,
          connectStrokes: connect_strokes,
          mirrorPainting: getRuntimePainter().mirror_painting,
          lockAlpha: getRuntimePainter().lock_alpha,
          eraseMode: getRuntimePainter().erase_mode,
        });

        if (exactPixelMode) {
          requireTextureCoordinatesWithinBounds(
            coordinates,
            texture.width,
            texture.display_height,
            "paint_with_brush exact pixel"
          );
          const active = texture.getActiveCanvas();
          for (const coordinate of coordinates) {
            const localX = coordinate.x - active.offset[0];
            const localY = coordinate.y - active.offset[1];
            if (
              localX < 0 ||
              localY < 0 ||
              localX >= active.canvas.width ||
              localY >= active.canvas.height
            ) {
              throw new Error(
                `paint_with_brush exact pixel (${coordinate.x}, ${coordinate.y}) falls outside the active texture canvas/layer.`
              );
            }
          }

          const undoAspects: UndoAspects = { selected_texture: true, bitmap: true };
          if (texture.layers_enabled && texture.layers[0]) {
            const activeLayer = texture.getActiveLayer();
            if (!activeLayer) {
              throw new Error("paint_with_brush exact pixel authoring requires an active texture layer.");
            }
            undoAspects.layers = [activeLayer];
          } else {
            undoAspects.textures = [texture];
          }

          Undo.initEdit(undoAspects);
          try {
            texture.edit(
              (canvas, env) => {
                env.ctx.save();
                env.ctx.globalAlpha = 1;
                env.ctx.globalCompositeOperation = "source-over";
                env.ctx.fillStyle = colorHex;
                for (const coordinate of coordinates) {
                  env.ctx.fillRect(
                    coordinate.x - env.offset[0],
                    coordinate.y - env.offset[1],
                    1,
                    1
                  );
                }
                env.ctx.restore();
              },
              { no_undo: true }
            );
            Undo.finishEdit("Paint exact texture pixels");
          } catch (error) {
            Undo.cancelEdit(true);
            throw error;
          }
          Canvas.updateAll();

          const bounds = exactPixelBounds(coordinates);
          const result = {
            operation: "paint_with_brush",
            mode: "exact_pixels",
            texture: { uuid: texture.uuid, name: texture.name, id: texture.id },
            pixels_requested: coordinates.length,
            affected_rect: bounds.rect,
            affected_size: bounds.size,
          };
          return {
            content: [
              {
                type: "text" as const,
                text: `Painted ${coordinates.length} exact pixels inside [${bounds.rect.join(", ")}] on "${texture.name}".`,
              },
            ],
            structuredContent: result,
          };
        }

        // @ts-ignore - official Blockbench Painter tool ID
        BarItems.brush_tool.select();

        const first = coordinates[0];
        getRuntimePainter().startPaintTool(
          texture,
          first.x,
          first.y,
          {},
          { shiftKey: false }
        );
        for (const coord of coordinates.slice(1)) {
          getRuntimePainter().movePaintTool(
            texture,
            coord.x,
            coord.y,
            {},
            !connect_strokes
          );
        }
        getRuntimePainter().stopPaintTool();
        Canvas.updateAll();

        return `Painted ${coordinates.length} points on texture "${texture.name}"`;
      },
    },
    paintToolDocs[7].status
  );

  createTool(
    paintToolDocs[8].name,
    {
      ...paintToolDocs[8],
      parameters: createBrushPresetParameters,
      async execute({
        name,
        size,
        opacity,
        softness,
        shape,
        color,
        blend_mode,
        pixel_perfect,
      }) {
        const preset = {
          name,
          size: size ?? null,
          opacity: opacity ?? null,
          softness: softness ?? null,
          shape: shape || "square",
          color: color || null,
          blend_mode: blend_mode || "default",
          pixel_perfect: pixel_perfect || false,
        };

        // @ts-ignore
        StateMemory.brush_presets.push(preset);
        // @ts-ignore
        StateMemory.save("brush_presets");

        return `Created brush preset "${name}" with settings: ${JSON.stringify(
          preset
        )}`;
      },
    },
    paintToolDocs[8].status
  );

  createTool(
    paintToolDocs[9].name,
    {
      ...paintToolDocs[9],
      parameters: loadBrushPresetParameters,
      async execute({ preset_name }) {
        // @ts-ignore
        const preset = StateMemory.brush_presets.find(
          (p: { name: string }) => p.name === preset_name
        );

        if (!preset) {
          throw new Error(`Brush preset "${preset_name}" not found.`);
        }

        // @ts-ignore
        Painter.loadBrushPreset(preset);

        return `Loaded brush preset "${preset_name}"`;
      },
    },
    paintToolDocs[9].status
  );

  createTool(
    paintToolDocs[10].name,
    {
      ...paintToolDocs[10],
      parameters: textureSelectionParameters,
      async execute({ action, texture_id, coordinates, radius, mode }) {
        const texture = getAndActivateTexture(texture_id);

        if (action === "invert_selection") {
          Undo.initSelection({ texture_selection: true });
          try {
            const selection = texture.selection;
            if (selection.is_custom) {
              const selectionArray = selection.array;
              if (!selectionArray) {
                throw new Error("Custom texture selection has no backing matrix.");
              }
              selection.forEachPixel((x, y, value, index) => {
                selectionArray[index] = value ? 0 : 1;
              });
            } else {
              selection.setOverride(!selection.override);
            }
            UVEditor.updateSelectionOutline();
            Undo.finishSelection("Invert selection");
          } catch (error) {
            Undo.cancelSelection(true);
            UVEditor.updateSelectionOutline();
            throw error;
          }

          return `Applied ${action} to texture "${texture.name}"`;
        }

        if (action === "expand_selection" || action === "contract_selection") {
          if (radius === undefined) {
            throw new Error(
              `Radius required for ${action === "expand_selection" ? "expand" : "contract"} selection.`
            );
          }

          const signedRadius =
            action === "contract_selection" ? -Math.abs(radius) : Math.abs(radius);
          if (signedRadius === 0) {
            return `Applied ${action} to texture "${texture.name}"`;
          }

          Undo.initSelection({ texture_selection: true });
          try {
            const selection = texture.selection;
            const selectionRadius = Math.abs(signedRadius);
            const radiusSquared = signedRadius ** 2;

            if (selection.is_custom) {
              const selectionArray = selection.array;
              if (!selectionArray) {
                throw new Error("Custom texture selection has no backing matrix.");
              }
              const selectionCopy = selectionArray.slice();
              const expectedValue = signedRadius < 0 ? 0 : 1;

              selection.forEachPixel((x, y, value, index) => {
                if (value === expectedValue) return;
                for (
                  let offsetX = -selectionRadius;
                  offsetX <= selectionRadius;
                  offsetX++
                ) {
                  for (
                    let offsetY = -selectionRadius;
                    offsetY <= selectionRadius;
                    offsetY++
                  ) {
                    if (offsetX ** 2 + offsetY ** 2 > radiusSquared) continue;
                    if (selection.get(x + offsetX, y + offsetY) === expectedValue) {
                      selectionCopy[index] = expectedValue;
                      return;
                    }
                  }
                }
              });
              selection.array = selectionCopy;
            } else if (selection.override === true && signedRadius < 0) {
              selection.setOverride(null);
              const selectionArray = selection.array;
              if (!selectionArray) {
                throw new Error("Texture selection matrix is unavailable.");
              }
              selection.forEachPixel((x, y, value, index) => {
                const selected =
                  x >= selectionRadius &&
                  y >= selectionRadius &&
                  x < selection.width - selectionRadius &&
                  y < selection.height - selectionRadius;
                selectionArray[index] = selected ? 1 : 0;
              });
            }

            UVEditor.updateSelectionOutline();
            Undo.finishSelection(
              action === "expand_selection" ? "Expand selection" : "Contract selection"
            );
          } catch (error) {
            Undo.cancelSelection(true);
            UVEditor.updateSelectionOutline();
            throw error;
          }

          return `Applied ${action} to texture "${texture.name}"`;
        }

        const selection = texture.selection;

        const applyMask = (
          predicate: (x: number, y: number) => boolean
        ) => {
          const previousOverride = selection.override;
          selection.activate();
          selection.setOverride(null);
          const selectionArray = selection.array;
          if (!selectionArray) {
            throw new Error("Texture selection matrix is unavailable.");
          }

          if (previousOverride === true) selectionArray.fill(1);
          if (previousOverride === false) selectionArray.fill(0);

          selection.forEachPixel((x, y, value, index) => {
            const inside = predicate(x, y);
            switch (mode) {
              case "create":
                selectionArray[index] = inside ? 1 : 0;
                break;
              case "add":
                if (inside) selectionArray[index] = 1;
                break;
              case "subtract":
                if (inside) selectionArray[index] = 0;
                break;
              case "intersect":
                if (!inside) selectionArray[index] = 0;
                break;
            }
          });
        };

        Undo.initSelection({ texture_selection: true });
        try {
          switch (action) {
            case "select_rectangle": {
              if (!coordinates) {
                throw new Error("Coordinates required for rectangle selection.");
              }
              const minX = Math.floor(Math.min(coordinates.x1, coordinates.x2));
              const maxX = Math.ceil(Math.max(coordinates.x1, coordinates.x2));
              const minY = Math.floor(Math.min(coordinates.y1, coordinates.y2));
              const maxY = Math.ceil(Math.max(coordinates.y1, coordinates.y2));
              applyMask((x, y) => x >= minX && x < maxX && y >= minY && y < maxY);
              break;
            }

            case "select_ellipse": {
              if (!coordinates) {
                throw new Error("Coordinates required for ellipse selection.");
              }
              const centerX = (coordinates.x1 + coordinates.x2) / 2;
              const centerY = (coordinates.y1 + coordinates.y2) / 2;
              const radiusX = Math.abs(coordinates.x2 - coordinates.x1) / 2;
              const radiusY = Math.abs(coordinates.y2 - coordinates.y1) / 2;
              if (radiusX === 0 || radiusY === 0) {
                throw new Error("Ellipse selection requires non-zero width and height.");
              }
              applyMask((x, y) => {
                const dx = (x + 0.5 - centerX) / radiusX;
                const dy = (y + 0.5 - centerY) / radiusY;
                return dx * dx + dy * dy <= 1;
              });
              break;
            }

            case "select_all":
              selection.setOverride(true);
              break;

            case "clear_selection":
              selection.clear();
              break;

            default:
              throw new Error(`Unsupported texture selection action: ${action}`);
          }

          UVEditor.updateSelectionOutline();
          Undo.finishSelection("Texture selection");
        } catch (error) {
          Undo.cancelSelection(true);
          UVEditor.updateSelectionOutline();
          throw error;
        }

        return `Applied ${action} to texture "${texture.name}"`;
      },
    },
    paintToolDocs[10].status
  );

  createTool(
    paintToolDocs[11].name,
    {
      ...paintToolDocs[11],
      parameters: textureLayerManagementParameters,
      async execute({
        action,
        texture_id,
        layer_name,
        opacity,
        blend_mode,
        target_index,
      }) {
        const texture = getAndActivateTexture(texture_id);

        Undo.initEdit({
          textures: [texture],
          layers: texture.layers,
          bitmap: true,
        });

        if (action === "create_layer") {
          let result = "";

          try {
            if (!texture.layers_enabled) {
              texture.activateLayers(false);
            }
            const newLayer = new TextureLayer(
              {
                name: layer_name || `Layer ${texture.layers.length + 1}`,
              },
              texture
            );
            newLayer.setSize(texture.width, texture.height);
            newLayer.addForEditing();
            result = `Created layer "${newLayer.name}"`;

            texture.updateChangesAfterEdit();
            Undo.finishEdit(`Layer management: ${action}`);
          } catch (error) {
            Undo.cancelEdit(true);
            Canvas.updateAll();
            updateInterfacePanels();
            throw error;
          }

          updateInterfacePanels();
          return result;
        }

        if (action === "delete_layer") {
          let result = "";

          try {
            if (!TextureLayer.selected) {
              throw new Error("No layer selected.");
            }
            const layerToDelete = TextureLayer.selected;
            layerToDelete.remove(false);
            result = `Deleted layer "${layerToDelete.name}"`;

            texture.updateChangesAfterEdit();
            Undo.finishEdit(`Layer management: ${action}`);
          } catch (error) {
            Undo.cancelEdit(true);
            Canvas.updateAll();
            updateInterfacePanels();
            throw error;
          }

          updateInterfacePanels();
          return result;
        }

        if (action === "duplicate_layer") {
          let result = "";

          try {
            if (!TextureLayer.selected) {
              throw new Error("No layer selected.");
            }
            const layerToDuplicate = TextureLayer.selected;
            const layerCopy = layerToDuplicate.getUndoCopy(
              true
            ) as ConstructorParameters<typeof TextureLayer>[0];
            layerCopy.name = `${layerToDuplicate.name} copy`;
            const duplicatedLayer = new TextureLayer(layerCopy, texture);
            duplicatedLayer.addForEditing();
            result = `Duplicated layer "${duplicatedLayer.name}"`;

            texture.updateLayerChanges(true);
            Undo.finishEdit(`Layer management: ${action}`);
          } catch (error) {
            Undo.cancelEdit(true);
            Canvas.updateAll();
            updateInterfacePanels();
            throw error;
          }

          updateInterfacePanels();
          return result;
        }

        if (action === "merge_down") {
          let result = "";

          try {
            if (!TextureLayer.selected) {
              throw new Error("No layer selected.");
            }
            TextureLayer.selected.mergeDown(false);
            result = "Merged layer down";

            texture.updateChangesAfterEdit();
            Undo.finishEdit(`Layer management: ${action}`);
          } catch (error) {
            Undo.cancelEdit(true);
            Canvas.updateAll();
            updateInterfacePanels();
            throw error;
          }

          updateInterfacePanels();
          return result;
        }

        if (action === "set_opacity") {
          let result = "";

          try {
            if (!TextureLayer.selected) {
              throw new Error("No layer selected.");
            }
            if (opacity === undefined) {
              throw new Error("Opacity value required.");
            }
            TextureLayer.selected.opacity = opacity;
            result = `Set layer opacity to ${opacity}%`;

            texture.updateChangesAfterEdit();
            Undo.finishEdit(`Layer management: ${action}`);
          } catch (error) {
            Undo.cancelEdit(true);
            Canvas.updateAll();
            updateInterfacePanels();
            throw error;
          }

          updateInterfacePanels();
          return result;
        }

        if (action === "set_blend_mode") {
          let result = "";

          try {
            if (!TextureLayer.selected) {
              throw new Error("No layer selected.");
            }
            if (!blend_mode) {
              throw new Error("Blend mode required.");
            }
            TextureLayer.selected.blend_mode = blend_mode;
            result = `Set layer blend mode to ${blend_mode}`;

            texture.updateChangesAfterEdit();
            Undo.finishEdit(`Layer management: ${action}`);
          } catch (error) {
            Undo.cancelEdit(true);
            Canvas.updateAll();
            updateInterfacePanels();
            throw error;
          }

          updateInterfacePanels();
          return result;
        }

        if (action === "move_layer") {
          let result = "";

          try {
            if (!TextureLayer.selected) {
              throw new Error("No layer selected.");
            }
            if (target_index === undefined) {
              throw new Error("Target index required.");
            }
            if (target_index >= texture.layers.length) {
              throw new Error(
                `Target index ${target_index} is out of range for ${texture.layers.length} layers.`
              );
            }

            const layerToMove = TextureLayer.selected;
            texture.layers.remove(layerToMove);
            texture.layers.splice(target_index, 0, layerToMove);
            result = `Moved layer to position ${target_index}`;

            texture.updateChangesAfterEdit();
            Undo.finishEdit(`Layer management: ${action}`);
          } catch (error) {
            Undo.cancelEdit(true);
            Canvas.updateAll();
            updateInterfacePanels();
            throw error;
          }

          updateInterfacePanels();
          return result;
        }

        if (action === "rename_layer") {
          let result = "";

          try {
            if (!TextureLayer.selected) {
              throw new Error("No layer selected.");
            }
            if (!layer_name) {
              throw new Error("New layer name required.");
            }
            const oldName = TextureLayer.selected.name;
            TextureLayer.selected.name = layer_name;
            result = `Renamed layer from "${oldName}" to "${layer_name}"`;

            texture.updateChangesAfterEdit();
            Undo.finishEdit(`Layer management: ${action}`);
          } catch (error) {
            Undo.cancelEdit(true);
            Canvas.updateAll();
            updateInterfacePanels();
            throw error;
          }

          updateInterfacePanels();
          return result;
        }

        if (action === "flatten_layers") {
          let result = "";

          try {
            if (!texture.layers_enabled) {
              throw new Error("Texture has no layers to flatten.");
            }
            texture.layers_enabled = false;
            texture.selected_layer = null;
            texture.layers.empty();
            result = "Flattened all layers";

            texture.updateChangesAfterEdit();
            Undo.finishEdit(`Layer management: ${action}`);
          } catch (error) {
            Undo.cancelEdit(true);
            Canvas.updateAll();
            updateInterfacePanels();
            throw error;
          }

          UVEditor.vue.layer = null;
          updateInterfacePanels();
          BARS.updateConditions();
          return result;
        }

        throw new Error(`Unsupported texture layer action: ${action}`);
      },
    },
    paintToolDocs[11].status
  );
}
