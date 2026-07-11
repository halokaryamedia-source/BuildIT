import type { z } from "zod";
import type tinycolor from "tinycolor2";

declare global {
  interface PaintInputEvent extends Partial<PointerEvent> {
    ctrlOrCmd?: boolean;
  }

  interface UndoAspects {
    uv_only?: boolean;
    element_aspects?: {
      geometry?: boolean;
      uv?: boolean;
      faces?: boolean;
    };
    texture_groups?: TextureGroup[];
    layers?: TextureLayer[];
  }

  interface TextureGroupMaterialConfigData {
    subsurface_value?: number;
  }

  interface TextureGroupMaterialConfig {
    subsurface_value: number;
  }

  namespace Painter {
    let mirror_painting: boolean;
    let lock_alpha: boolean;
    let erase_mode: boolean;
    let mirror_painting_options: {
      axis: { x: boolean; z: boolean };
      texture?: boolean;
      texture_center?: [number, number];
    };

    function startPaintTool(
      texture: Texture,
      x: number,
      y: number,
      uvTag: number[] | undefined,
      event: PaintInputEvent
    ): void;
    function movePaintTool(
      texture: Texture,
      x: number,
      y: number,
      event: PaintInputEvent
    ): void;
    function stopPaintTool(): void;
    function useShapeTool(
      texture: Texture,
      x: number,
      y: number,
      event: PaintInputEvent,
      uvTag?: number[]
    ): void;
    function useGradientTool(
      texture: Texture,
      x: number,
      y: number,
      event: PaintInputEvent,
      uvTag?: number[]
    ): void;
    function colorPicker(
      texture: Texture,
      x: number,
      y: number,
      event: PaintInputEvent
    ): void;
    function getPixelColor(
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number
    ): tinycolor.Instance;
  }

  namespace ColorPanel {
    function set(color: unknown, secondary?: boolean, no_sync?: boolean): void;
    function get(secondary?: boolean): unknown;
  }

  interface GeneralAnimator {
    createKeyframe(
      value: unknown,
      time: number,
      channel: string,
      undo: boolean,
      select?: boolean
    ): _Keyframe;
    fillValues(
      keyframe: _Keyframe,
      values: unknown,
      allow_expression: boolean,
      round?: boolean
    ): void;
  }
}

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
  arguments: Record<string, z.ZodType>;
  enabled: boolean;
  status: StatusType;
}

export interface IMCPResource {
  name: string;
  description: string;
  uriTemplate: string;
}
