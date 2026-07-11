import { z } from "zod";
import type { IMCPTool, IMCPPrompt, IMCPResource, StatusType } from "@/types";
import { getServer } from "@/server/server";
import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { sessionManager } from "@/lib/sessions";

export interface ToolSpec {
  name: string;
  description: string;
  annotations?: {
    title?: string;
    destructiveHint?: boolean;
    idempotentHint?: boolean;
    readOnlyHint?: boolean;
    openWorldHint?: boolean;
  };
  parameters: z.ZodType;
  status: StatusType;
}

export interface PromptSpec {
  name: string;
  description: string;
  title?: string;
  argsSchema?: z.ZodObject<z.ZodRawShape>;
  status: StatusType;
}

export interface ResourceSpec {
  name: string;
  description: string;
  uriTemplate: string;
  title?: string;
}

export const tools: Record<string, IMCPTool> = {};
export const prompts: Record<string, IMCPPrompt> = {};
export const resources: Record<string, IMCPResource> = {};

export interface ToolContext {
  reportProgress: (progress: { progress: number; total: number }) => void;
  sessionId: string | null;
  clientName: string | null;
  requestId: string | number | null;
}

interface RequestHandlerExtraLike {
  sessionId?: unknown;
  requestId?: unknown;
}

interface TextContent {
  type: "text";
  text: string;
}

interface ImageContent {
  type: "image";
  data: string;
  mimeType: string;
}

type ToolContentItem = TextContent | ImageContent;
type ToolResult =
  | string
  | { content: ToolContentItem[]; structuredContent?: unknown };

interface ToolDefinition {
  title: string;
  description: string;
  inputSchema: Record<string, z.ZodType>;
  outputSchema?: Record<string, z.ZodType> | z.ZodType;
  execute: (
    args: Record<string, unknown>,
    context?: ToolContext
  ) => Promise<ToolResult>;
  annotations?: {
    title?: string;
    destructiveHint?: boolean;
    openWorldHint?: boolean;
    readOnlyHint?: boolean;
  };
}

const toolDefinitions: Record<string, ToolDefinition> = {};

function extractShape(schema: z.ZodType): Record<string, z.ZodType> {
  const definition = schema._def as {
    typeName?: string;
    schema?: z.ZodType;
    shape?: () => Record<string, z.ZodType>;
  };
  if (definition.typeName === "ZodObject") {
    return definition.shape?.() ?? {};
  }
  if (definition.typeName === "ZodEffects" && definition.schema) {
    return extractShape(definition.schema);
  }
  return {};
}

function toolContextFromExtra(extra: unknown): ToolContext {
  const value =
    extra && typeof extra === "object"
      ? (extra as RequestHandlerExtraLike)
      : undefined;
  const sessionId =
    typeof value?.sessionId === "string" ? value.sessionId : null;
  const requestId =
    typeof value?.requestId === "string" ||
    typeof value?.requestId === "number"
      ? value.requestId
      : null;
  const session = sessionId ? sessionManager.get(sessionId) : undefined;
  return {
    reportProgress: () => {},
    sessionId,
    clientName: session?.clientName ?? null,
    requestId,
  };
}

function normalizeToolResult(result: ToolResult): {
  content: ToolContentItem[];
  structuredContent?: unknown;
} {
  if (typeof result === "string") {
    return { content: [{ type: "text", text: result }] };
  }
  return result;
}

export function createTool<T extends z.ZodType>(
  name: string,
  tool: {
    description: string;
    annotations?: {
      title?: string;
      destructiveHint?: boolean;
      idempotentHint?: boolean;
      openWorldHint?: boolean;
      readOnlyHint?: boolean;
    };
    parameters: T;
    execute: (
      args: z.infer<T>,
      context?: ToolContext
    ) => Promise<ToolResult>;
  },
  status: IMCPTool["status"] = "stable",
  enabled = true
) {
  if (tools[name]) {
    throw new Error(`Tool with name "${name}" already exists.`);
  }

  const inputSchema = extractShape(tool.parameters);
  const toolDefinition: ToolDefinition = {
    title: tool.annotations?.title ?? tool.description,
    description: tool.description,
    inputSchema,
    execute: tool.execute,
    annotations: tool.annotations,
  };
  toolDefinitions[name] = toolDefinition;

  if (enabled) {
    type ToolArgs = z.infer<T>;
    const server = getServer();
    const registerTool = server.registerTool.bind(server) as unknown as (
      toolName: string,
      definition: {
        title: string;
        description: string;
        inputSchema: Record<string, z.ZodType>;
      },
      callback: (args: unknown, extra: unknown) => Promise<unknown>
    ) => void;

    registerTool(
      name,
      {
        title: toolDefinition.title,
        description: toolDefinition.description,
        inputSchema,
      },
      async (args: unknown, extra: unknown) =>
        normalizeToolResult(
          await tool.execute(
            args as ToolArgs,
            toolContextFromExtra(extra)
          )
        )
    );
  }

  tools[name] = {
    name,
    description: toolDefinition.title,
    enabled,
    status,
  };
  return tools[name];
}

export function getAllToolDefinitions() {
  return toolDefinitions;
}

export function getEnabledToolDefinitions() {
  return Object.fromEntries(
    Object.entries(toolDefinitions).filter(([name]) => tools[name]?.enabled)
  );
}

export function registerToolsOnServer(server: unknown) {
  const enabledDefinitions = getEnabledToolDefinitions();
  const typedServer = server as {
    registerTool: (
      toolName: string,
      definition: {
        title: string;
        description: string;
        inputSchema: Record<string, z.ZodType>;
      },
      callback: (args: unknown, extra: unknown) => Promise<unknown>
    ) => void;
  };

  for (const [name, toolDefinition] of Object.entries(enabledDefinitions)) {
    typedServer.registerTool(
      name,
      {
        title: toolDefinition.title,
        description: toolDefinition.description,
        inputSchema: toolDefinition.inputSchema,
      },
      async (args: unknown, extra: unknown) =>
        normalizeToolResult(
          await toolDefinition.execute(
            (args ?? {}) as Record<string, unknown>,
            toolContextFromExtra(extra)
          )
        )
    );
  }
}

interface ResourceDefinition {
  name: string;
  uriTemplate: string;
  metadata: {
    title?: string;
    description?: string;
  };
  listCallback?: () => Promise<{
    resources: Array<{
      uri: string;
      name: string;
      description?: string;
      mimeType?: string;
    }>;
  }>;
  readCallback: (
    uri: URL,
    variables: Record<string, string>
  ) => Promise<{
    contents: Array<
      | { uri: string; text: string; mimeType?: string }
      | { uri: string; blob: string; mimeType?: string }
    >;
  }>;
}

const resourceDefinitions: Record<string, ResourceDefinition> = {};

function normalizeResourceVariables(
  variables: Record<string, string | string[]>
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(variables).map(([key, value]) => [
      key,
      Array.isArray(value) ? value[0] ?? "" : value,
    ])
  );
}

export function createResource(
  name: string,
  config: {
    uriTemplate: string;
    title?: string;
    description: string;
    listCallback?: () => Promise<{
      resources: Array<{
        uri: string;
        name: string;
        description?: string;
        mimeType?: string;
      }>;
    }>;
    readCallback: (
      uri: URL,
      variables: Record<string, string>
    ) => Promise<{
      contents: Array<
        | { uri: string; text: string; mimeType?: string }
        | { uri: string; blob: string; mimeType?: string }
      >;
    }>;
  }
) {
  if (resources[name]) {
    throw new Error(`Resource with name "${name}" already exists.`);
  }

  const resourceDefinition: ResourceDefinition = {
    name,
    uriTemplate: config.uriTemplate,
    metadata: {
      title: config.title,
      description: config.description,
    },
    listCallback: config.listCallback,
    readCallback: config.readCallback,
  };
  resourceDefinitions[name] = resourceDefinition;

  const server = getServer();
  const registerResource = (
    server as unknown as {
      registerResource: (
        resourceName: string,
        uriOrTemplate: ResourceTemplate,
        metadata: { title?: string; description?: string },
        readCallback: (
          uri: URL,
          variables: Record<string, string | string[]>
        ) => Promise<{
          contents: Array<
            | { uri: string; text: string; mimeType?: string }
            | { uri: string; blob: string; mimeType?: string }
          >;
        }>
      ) => void;
    }
  ).registerResource.bind(server);

  registerResource(
    name,
    new ResourceTemplate(config.uriTemplate, { list: config.listCallback }),
    resourceDefinition.metadata,
    async (uri, variables) =>
      config.readCallback(uri, normalizeResourceVariables(variables))
  );

  resources[name] = {
    name,
    description: config.description,
    uriTemplate: config.uriTemplate,
  };
  return resources[name];
}

export function getAllResourceDefinitions() {
  return resourceDefinitions;
}

export function registerResourcesOnServer(server: unknown) {
  const typedServer = server as {
    registerResource: (
      resourceName: string,
      uriOrTemplate: ResourceTemplate,
      metadata: { title?: string; description?: string },
      readCallback: (
        uri: URL,
        variables: Record<string, string | string[]>
      ) => Promise<{
        contents: Array<
          | { uri: string; text: string; mimeType?: string }
          | { uri: string; blob: string; mimeType?: string }
        >;
      }>
    ) => void;
  };

  for (const [name, definition] of Object.entries(resourceDefinitions)) {
    typedServer.registerResource(
      name,
      new ResourceTemplate(definition.uriTemplate, {
        list: definition.listCallback,
      }),
      definition.metadata,
      async (uri, variables) =>
        definition.readCallback(
          uri,
          normalizeResourceVariables(variables)
        )
    );
  }
}

interface PromptDefinition {
  name: string;
  title: string;
  description: string;
  argsSchema?: Record<string, z.ZodType>;
  generate: (args: Record<string, unknown>) => Promise<{
    messages: Array<{
      role: "user" | "assistant";
      content: { type: "text"; text: string };
    }>;
  }>;
}

const promptDefinitions: Record<string, PromptDefinition> = {};

export function createPrompt<
  T extends z.ZodRawShape = Record<string, never>,
>(
  name: string,
  prompt: {
    title?: string;
    description: string;
    argsSchema?: z.ZodObject<T>;
    generate?: (
      args: z.infer<z.ZodObject<T>>
    ) =>
      | {
          messages: Array<{
            role: "user" | "assistant";
            content: { type: "text"; text: string };
          }>;
        }
      | Promise<{
          messages: Array<{
            role: "user" | "assistant";
            content: { type: "text"; text: string };
          }>;
        }>;
  },
  status: IMCPPrompt["status"] = "stable",
  enabled = true
) {
  if (prompts[name]) {
    throw new Error(`Prompt with name "${name}" already exists.`);
  }

  if (enabled && prompt.generate && prompt.argsSchema) {
    const promptDefinition: PromptDefinition = {
      name,
      title: prompt.title || prompt.description,
      description: prompt.description,
      argsSchema: prompt.argsSchema.shape,
      generate: async (args) =>
        prompt.generate!(args as z.infer<z.ZodObject<T>>),
    };
    promptDefinitions[name] = promptDefinition;
    const server = getServer() as unknown as {
      registerPrompt: (
        promptName: string,
        definition: {
          title: string;
          description: string;
          argsSchema?: Record<string, z.ZodType>;
        },
        callback: PromptDefinition["generate"]
      ) => void;
    };
    server.registerPrompt(
      name,
      {
        title: promptDefinition.title,
        description: promptDefinition.description,
        argsSchema: promptDefinition.argsSchema,
      },
      promptDefinition.generate
    );
  }

  prompts[name] = {
    name,
    arguments: prompt.argsSchema?.shape || {},
    description: prompt.description,
    enabled,
    status,
  };
  return prompts[name];
}

export function getAllPromptDefinitions() {
  return promptDefinitions;
}

export function registerPromptsOnServer(server: unknown) {
  const typedServer = server as {
    registerPrompt: (
      promptName: string,
      definition: {
        title: string;
        description: string;
        argsSchema?: Record<string, z.ZodType>;
      },
      callback: (args: Record<string, unknown>) => Promise<{
        messages: Array<{
          role: "user" | "assistant";
          content: { type: string; text: string };
        }>;
      }>
    ) => void;
  };

  for (const [name, definition] of Object.entries(promptDefinitions)) {
    typedServer.registerPrompt(
      name,
      {
        title: definition.title,
        description: definition.description,
        argsSchema: definition.argsSchema,
      },
      definition.generate
    );
  }
}
