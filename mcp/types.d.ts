import type { PromptArgument } from "@modelcontextprotocol/sdk/types.js";

export type StatusType = "stable" | "experimental";

export interface IMCPTool {
  name: string;
  description: string;
  enabled: boolean;
  status: StatusType;
}

export interface IMCPPrompt {
  name: string;
  description: string;
  arguments: PromptArgument[];
  enabled: boolean;
  status: StatusType;
}

export interface IMCPResource {
  name: string;
  description: string;
  uriTemplate: string;
}

/**
 * Narrow declaration augmentations for runtime fields that are present in the
 * official Blockbench source but missing from the published declaration files.
 * Keep this list evidence-backed and small; it is not a generic compatibility
 * layer.
 */
declare global {
  interface UndoAspects {
    /** Official texture-group runtime undo aspect. */
    texture_groups?: TextureGroup[];
    /** Official texture-layer runtime undo aspect used by Painter. */
    layers?: TextureLayer[];
  }

  interface TextureGroupMaterialConfigData {
    /** Bedrock MER subsurface channel value, 0-255. */
    subsurface_value?: number;
  }

  interface TextureGroupMaterialConfig {
    /** Bedrock MER subsurface channel value, 0-255. */
    subsurface_value: number;
  }

  /** Event fields read by Blockbench's native Painter stroke lifecycle. */
  interface BlockbenchRuntimePaintEvent {
    button?: number;
    shiftKey?: boolean;
    ctrlOrCmd?: boolean;
    pointerType?: string;
    touches?: Array<{ touchType?: string }>;
    [key: string]: unknown;
  }

  /**
   * Small runtime-only Painter surface proven by Blockbench's official
   * `js/texturing/painter.js` implementation but omitted/read-only in the
   * published declarations. Paint tools cast to this interface locally.
   */
  interface BlockbenchRuntimePainter {
    startPaintTool(
      texture: Texture,
      x: number,
      y: number,
      uvTag: unknown,
      event: BlockbenchRuntimePaintEvent,
      data?: unknown
    ): void;
    movePaintTool(
      texture: Texture,
      x: number,
      y: number,
      event: BlockbenchRuntimePaintEvent,
      newFace?: boolean,
      uv?: unknown
    ): void;
    stopPaintTool(): void;
    useShapeTool(
      texture: Texture,
      x: number,
      y: number,
      event: BlockbenchRuntimePaintEvent,
      uv?: unknown
    ): void;
    useGradientTool(
      texture: Texture,
      x: number,
      y: number,
      event: BlockbenchRuntimePaintEvent,
      uv?: unknown
    ): void;
    colorPicker(
      texture: Texture,
      x: number,
      y: number,
      event: BlockbenchRuntimePaintEvent
    ): void;
    mirror_painting: boolean;
    lock_alpha: boolean;
    erase_mode: boolean;
    mirror_painting_options: {
      x?: boolean;
      y?: boolean;
      z?: boolean;
      texture?: boolean;
      texture_center?: [number, number];
      [key: string]: unknown;
    };
  }
}
