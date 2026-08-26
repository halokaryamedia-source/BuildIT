import { z } from "zod";
import type { IMCPTool, IMCPPrompt, IMCPResource, StatusType } from "@/types";
import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import type {
  GetPromptResult,
  PromptArgument,
  ToolAnnotations,
} from "@modelcontextprotocol/sdk/types.js";

/**
 * Declarative tool spec for documentation and registration.
 * Contains everything except the `execute` implementation.
 */
export interface ToolSpec {
  name: string;
  description: string;
  annotations?: ToolAnnotations;
  parameters: z.ZodType;
  status: StatusType;
}

/**
 * Declarative prompt spec for documentation and registration.
 */
export interface PromptSpec {
  name: string;
  description: string;
  title?: string;
  argsSchema?: z.ZodObject<z.ZodRawShape>;
  status: StatusType;
}

/**
 * Declarative resource spec for documentation and registration.
 */
export interface ResourceSpec {
  name: string;
  description: string;
  uriTemplate: string;
  title?: string;
}

/**
 * User-visible list of tool details.
 */
export const tools: Record<string, IMCPTool> = {};

/**
 * User-visible list of prompt details.
 */
export const prompts: Record<string, IMCPPrompt> = {};

/**
 * User-visible list of resource details.
 */
export const resources: Record<string, IMCPResource> = {};

export interface ToolContext {
  reportProgress: (progress: { progress: number; total: number }) => void;
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

type ToolResult = string | { content: ToolContentItem[]; structuredContent?: unknown };

interface ToolDefinition {
  title: string;
  description: string;
  inputSchema: Record<string, z.ZodType>;
  parameterSchema: z.ZodType;
  outputSchema?: Record<string, z.ZodType> | z.ZodType;
  execute: (args: Record<string, unknown>, context?: ToolContext) => Promise<ToolResult>;
  annotations?: ToolAnnotations;
}

/**
 * Store tool definitions for request-owned server reconstruction
 */
const toolDefinitions: Record<string, ToolDefinition> = {};
const toolCatalogOrdered: string[] = [];
const toolInvocationCache = new Map<
  string,
  (args: unknown, extra: unknown) => Promise<unknown>
>();
let enabledToolDefinitionsCache: Record<string, ToolDefinition> | null = null;
let enabledToolRegistrationCache:
  | Array<{ name: string; definition: ToolDefinition }>
  | null = null;
let resourceRegistrationCache: Array<[string, ResourceDefinition]> | null = null;
let promptRegistrationCache: Array<[string, PromptDefinition]> | null = null;

function getToolCallbackCacheKey(toolName: string): string {
  return `${toolName}`;
}

/**
 * Invalidation is intentionally explicit so profile and phase mutations can
 * reset the request-owned runtime surface without leaking stale callback state.
 */
export function invalidateToolRegistrationRuntimeCaches(): void {
  enabledToolDefinitionsCache = null;
  enabledToolRegistrationCache = null;
  resourceRegistrationCache = null;
  promptRegistrationCache = null;
  toolInvocationCache.clear();
}

function compactUnknownResult(name: string, result: unknown) {
  if (typeof result === "string") {
    return compactStringResult(name, result);
  }

  if (!result || typeof result !== "object" || !("content" in (result as ToolResult))) {
    return {
      content: [{ type: "text" as const, text: `${name} returned structured data.` }],
      structuredContent: result,
    };
  }

  return result;
}

function compactStringResult(
  name: string,
  result: string
): { content: ToolContentItem[]; structuredContent?: unknown } {
  const text = result.trim();
  if (
    (text.startsWith("{") && text.endsWith("}")) ||
    (text.startsWith("[") && text.endsWith("]"))
  ) {
    try {
      return {
        content: [{ type: "text", text: `${name} returned structured data.` }],
        structuredContent: JSON.parse(text),
      };
    } catch {
      // Preserve ordinary text when a string only resembles JSON.
    }
  }

  return { content: [{ type: "text", text: result }] };
}

function normalizeToolResultForRuntime(
  name: string,
  result: Exclude<ToolResult, string>
): { content: ToolContentItem[]; structuredContent?: unknown } {
  if (result.structuredContent !== undefined && result.content.length === 1) {
    return compactMirroredStructuredContent(name, result);
  }

  if (result.content.length !== 1) {
    return compactMirroredStructuredContent(name, result);
  }

  const [item] = result.content;
  if (item.type !== "text") {
    return compactMirroredStructuredContent(name, result);
  }

  const text = item.text.trim();
  if (
    (text.startsWith("{") && text.endsWith("}")) ||
    (text.startsWith("[") && text.endsWith("]"))
  ) {
    try {
      return {
        content: [{ type: "text", text: `${name} returned structured data.` }],
        structuredContent: JSON.parse(text),
      };
    } catch {
      return compactMirroredStructuredContent(name, result);
    }
  }

  return compactMirroredStructuredContent(name, result);
}

function getToolInvocation(name: string, toolDef: ToolDefinition) {
  const cacheKey = getToolCallbackCacheKey(name);
  const existing = toolInvocationCache.get(cacheKey);
  if (existing) return existing;

  const callback = async (args: unknown, _extra: unknown) => {
    const reportProgress: ToolContext["reportProgress"] = () => {};
    const context: ToolContext = { reportProgress };
    const validatedArgs = await toolDef.parameterSchema.parseAsync(args);
    const result = await toolDef.execute(
      validatedArgs as Record<string, unknown>,
      context
    );

    if (typeof result === "string") {
      return compactStringResult(name, result);
    }

    if (result && typeof result === "object" && "content" in result) {
      return normalizeToolResultForRuntime(name, result);
    }

    return compactUnknownResult(name, result);
  };

  toolInvocationCache.set(cacheKey, callback);
  return callback;
}

/**
 * Extracts the SDK-compatible object shape used for MCP registration/listing.
 * The original complete schema is retained separately for runtime validation.
 */
function extractShape(schema: z.ZodType): Record<string, z.ZodType> {
  const def = schema._def as {
    typeName?: string;
    schema?: z.ZodType;
    shape?: () => Record<string, z.ZodType>;
    options?: z.ZodType[];
  };

  if (def.typeName === "ZodObject") {
    return def.shape?.() ?? {};
  }

  if (def.typeName === "ZodEffects" && def.schema) {
    return extractShape(def.schema);
  }

  if (def.typeName === "ZodDiscriminatedUnion" && def.options) {
    const optionShapes = def.options.map(extractShape);
    const fieldNames = new Set(optionShapes.flatMap((shape) => Object.keys(shape)));

    return Object.fromEntries(
      [...fieldNames].map((fieldName) => {
        const variants = optionShapes
          .map((shape) => shape[fieldName])
          .filter((field): field is z.ZodType => field !== undefined);
        const [first, second, ...rest] = variants;
        if (!first) {
          throw new Error(`Discriminated union field "${fieldName}" has no schema.`);
        }

        const field = second
          ? z.union([first, second, ...rest] as [
              z.ZodTypeAny,
              z.ZodTypeAny,
              ...z.ZodTypeAny[],
            ])
          : first;
        const requiredInEveryOption =
          variants.length === optionShapes.length &&
          variants.every((variant) => !variant.isOptional());

        return [fieldName, requiredInEveryOption ? field : field.optional()];
      })
    );
  }

  return {};
}

/**
 * Avoid sending the same machine-readable payload twice when a tool mirrors
 * structuredContent as a single JSON text content item. Concise human summaries,
 * images, and intentionally different text remain untouched.
 */
function compactMirroredStructuredContent(
  toolName: string,
  result: Exclude<ToolResult, string>
): Exclude<ToolResult, string> {
  if (result.structuredContent === undefined || result.content.length !== 1) {
    return result;
  }

  const [contentItem] = result.content;
  if (contentItem.type !== "text") {
    return result;
  }

  let structuredJson: string | undefined;
  try {
    structuredJson = JSON.stringify(result.structuredContent);
  } catch {
    return result;
  }

  if (structuredJson === undefined || contentItem.text !== structuredJson) {
    return result;
  }

  return {
    ...result,
    content: [
      {
        type: "text",
        text: `${toolName} returned structured data.`,
      },
    ],
  };
}

/**
 * Stores one MCP tool definition for request-owned server registration.
 * @param name - The exact MCP tool name.
 * @param tool - The tool configuration.
 * @param tool.description - The description of the tool.
 * @param tool.annotations - Annotations for the tool (title, hints).
 * @param tool.parameters - Zod schema for input parameters (supports ZodObject or ZodEffects from .refine()).
 * @param tool.execute - The async function to execute when the tool is called.
 * @param status - The status of the tool (stable, experimental, deprecated).
 * @param enabled - Whether the tool is enabled.
 * @returns - The created tool metadata.
 * @throws - If a tool with the same name already exists.
 */
export function createTool<T extends z.ZodType>(
  name: string,
  tool: {
    description: string;
    annotations?: ToolAnnotations;
    parameters: T;
    execute: (args: z.infer<T>, context?: ToolContext) => Promise<ToolResult>;
  },
  status: IMCPTool["status"] = "stable",
  enabled: boolean = true
) {
  if (tools[name]) {
    throw new Error(`Tool with name "${name}" already exists.`);
  }

  const inputSchema = extractShape(tool.parameters);

  const toolDef: ToolDefinition = {
    title: tool.annotations?.title ?? tool.description,
    description: tool.description,
    inputSchema,
    parameterSchema: tool.parameters,
    execute: tool.execute,
    annotations: tool.annotations,
  };

  // Store tool definition
  toolDefinitions[name] = toolDef;
  toolCatalogOrdered.push(name);
  invalidateToolRegistrationRuntimeCaches();

  tools[name] = {
    name,
    description: toolDef.description,
    enabled,
    status,
  };

  return tools[name];
}

/**
 * Gets all tool definitions for server reconstruction
 */
export function getAllToolDefinitions() {
  return toolDefinitions;
}

/**
 * Gets enabled tool definitions for server reconstruction
 */
export function getEnabledToolDefinitions() {
  if (enabledToolDefinitionsCache) {
    return enabledToolDefinitionsCache;
  }

  const enabled = Object.fromEntries(
    toolCatalogOrdered
      .map((name) => [name, toolDefinitions[name]] as const)
      .filter(([name]) => tools[name]?.enabled)
  );

  enabledToolDefinitionsCache = enabled;
  return enabled;
}

export function getEnabledToolRegistrationEntries() {
  if (enabledToolRegistrationCache) {
    return enabledToolRegistrationCache;
  }

  const enabled = getEnabledToolDefinitions();
  const entries = Object.entries(enabled)
    .map(([name, definition]) => ({ name, definition }))
    .sort((left, right) => left.name.localeCompare(right.name));

  enabledToolRegistrationCache = entries;
  return entries;
}

/**
 * Registers all enabled tools on a server instance
 * Used to set up fresh request-owned servers with the same tools
 */
export function registerToolsOnServer(server: unknown) {
  const typedServer = server as {
    registerTool: (
      toolName: string,
      definition: {
        title: string;
        description: string;
        inputSchema: Record<string, z.ZodType>;
        annotations?: ToolAnnotations;
      },
      callback: (args: unknown, extra: unknown) => Promise<unknown>
    ) => void;
  };

  for (const { name, definition: toolDef } of getEnabledToolRegistrationEntries()) {
    typedServer.registerTool(
      name,
      {
        title: toolDef.title,
        description: toolDef.description,
        inputSchema: toolDef.inputSchema,
        annotations: toolDef.annotations,
      },
      getToolInvocation(name, toolDef)
    );
  }
}

/**
 * Resource definition storage for request-owned server reconstruction
 */
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

/**
 * Stores one MCP resource definition for request-owned server registration.
 * @param name - The resource name.
 * @param config - The resource configuration.
 * @param config.uriTemplate - The URI template pattern (e.g., "nodes://{id}").
 * @param config.title - Optional title for the resource.
 * @param config.description - The description of the resource.
 * @param config.listCallback - Optional async function to list available resources.
 * @param config.readCallback - Async function to read the resource.
 * @returns - The created resource metadata.
 */
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

  const resourceDef: ResourceDefinition = {
    name,
    uriTemplate: config.uriTemplate,
    metadata: {
      title: config.title,
      description: config.description,
    },
    listCallback: config.listCallback,
    readCallback: config.readCallback,
  };

  // Store resource definition for request-owned server reconstruction
  resourceDefinitions[name] = resourceDef;
  invalidateToolRegistrationRuntimeCaches();

  resources[name] = {
    name,
    description: config.description,
    uriTemplate: config.uriTemplate,
  };

  return resources[name];
}

/**
 * Gets all resource definitions for server reconstruction
 */
export function getAllResourceDefinitions() {
  return resourceDefinitions;
}

/**
 * Registers all resources on a server instance
 * Used to set up fresh request-owned servers with the same resources
 */
export function registerResourcesOnServer(server: unknown) {
  const typedServer = server as {
    registerResource: (
      resourceName: string,
      uriOrTemplate: ResourceTemplate,
      metadata: {
        title?: string;
        description?: string;
      },
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

  if (!resourceRegistrationCache) {
    resourceRegistrationCache = Object.entries(resourceDefinitions);
  }

  for (const [name, resourceDef] of resourceRegistrationCache) {
    typedServer.registerResource(
      name,
      new ResourceTemplate(resourceDef.uriTemplate, {
        list: resourceDef.listCallback,
      }),
      resourceDef.metadata,
      async (uri: URL, variables: Record<string, string | string[]>) => {
        const normalizedVariables = Object.fromEntries(
          Object.entries(variables).map(([key, value]) => {
            if (Array.isArray(value)) {
              return [key, value[0] ?? ""];
            }
            return [key, value];
          })
        ) as Record<string, string>;

        return resourceDef.readCallback(uri, normalizedVariables);
      }
    );
  }
}

/**
 * Prompt definition storage for request-owned server reconstruction
 */
interface PromptDefinition {
  name: string;
  title: string;
  description: string;
  argsSchema?: Record<string, z.ZodType>;
  generate: (args: Record<string, unknown>) => Promise<GetPromptResult>;
}

const promptDefinitions: Record<string, PromptDefinition> = {};

function promptArgumentsFromShape(
  shape: z.ZodRawShape | undefined
): PromptArgument[] {
  if (!shape) return [];

  return Object.entries(shape).map(([name, field]) => ({
    name,
    description: field.description,
    required: !field.isOptional(),
  }));
}

/**
 * Stores one MCP prompt definition for request-owned server registration.
 * @param name - The prompt name
 * @param prompt - The prompt configuration.
 * @param prompt.description - The description of the prompt.
 * @param prompt.arguments - Zod schema for prompt arguments.
 * @param prompt.generate - Function to generate prompt messages from arguments.
 * @param status - The status of the prompt.
 * @param enabled - Whether the prompt is enabled.
 * @returns - The created prompt metadata.
 * @throws - If a prompt with the same name already exists.
 */
export function createPrompt<T extends z.ZodRawShape = Record<string, never>>(
  name: string,
  prompt: {
    title?: string;
    description: string;
    argsSchema?: z.ZodObject<T>;
    generate?: (
      args: z.infer<z.ZodObject<T>>
    ) => GetPromptResult | Promise<GetPromptResult>;
  },
  status: IMCPPrompt["status"] = "stable",
  enabled: boolean = true
) {
  if (prompts[name]) {
    throw new Error(`Prompt with name "${name}" already exists.`);
  }

  const argsShape = prompt.argsSchema?.shape;

  // Store enabled prompt definitions for request-owned server reconstruction.
  if (enabled && prompt.generate && argsShape) {
    const promptDef: PromptDefinition = {
      name,
      title: prompt.title || prompt.description,
      description: prompt.description,
      argsSchema: argsShape,
      generate: async (args: Record<string, unknown>) =>
        prompt.generate!(args as z.infer<z.ZodObject<T>>),
    };

    promptDefinitions[name] = promptDef;
  }

  invalidateToolRegistrationRuntimeCaches();

  prompts[name] = {
    name,
    arguments: promptArgumentsFromShape(argsShape),
    description: prompt.description,
    enabled,
    status,
  };

  return prompts[name];
}

/**
 * Gets all prompt definitions for server reconstruction
 */
export function getAllPromptDefinitions() {
  return promptDefinitions;
}

/**
 * Registers all prompts on a server instance
 * Used to set up fresh request-owned servers with the same prompts
 */
export function registerPromptsOnServer(server: unknown) {
  const typedServer = server as {
    registerPrompt: (
      promptName: string,
      definition: {
        title: string;
        description: string;
        argsSchema?: Record<string, z.ZodType>;
      },
      callback: (
        args: Record<string, unknown>,
        extra: unknown
      ) => Promise<GetPromptResult>
    ) => void;
  };

  if (!promptRegistrationCache) {
    promptRegistrationCache = Object.entries(promptDefinitions);
  }

  for (const [name, promptDef] of promptRegistrationCache) {
    typedServer.registerPrompt(
      name,
      {
        title: promptDef.title,
        description: promptDef.description,
        argsSchema: promptDef.argsSchema,
      },
      async (args: Record<string, unknown>, _extra: unknown) =>
        promptDef.generate(args)
    );
  }
}
