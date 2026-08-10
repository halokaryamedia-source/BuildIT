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
