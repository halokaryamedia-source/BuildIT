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
}
