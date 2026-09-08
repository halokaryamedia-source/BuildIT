import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  BlockitRuntimeBackend,
  GatewayBackendError,
} from "./backend";
import {
  GATEWAY_NAME,
  GATEWAY_TOOLS,
  GATEWAY_VERSION,
  compactGatewayCapabilityStructuredContent,
  type JsonRecord,
} from "./contract";
import { projectCapabilityInputSchema } from "./schemaProjection";

const backend = new BlockitRuntimeBackend();

const server = new McpServer(
  {
    name: GATEWAY_NAME,
    version: GATEWAY_VERSION,
  },
  {
    instructions:
      "Stable BlockIT client boundary. Use a known Runtime capability directly and search only when the capability is unknown or stale. This Gateway exposes tools only; Runtime resources and prompts are not proxied. Normal authoring is approved image + optional 3D Evidence, then Geometry → Texturing → optional Animation. The Gateway binds to the active Blockbench project on first Runtime invocation; intentional target-tab changes use status(adopt_active_project=true) once. Phase handoffs continue the same task; invoke_capability never auto-retries an interrupted backend call.",
  }
);

type GatewayToolDefinition = {
  title: string;
  description: string;
  inputSchema: Record<string, z.ZodTypeAny>;
  annotations?: {
    readOnlyHint?: boolean;
    destructiveHint?: boolean;
    idempotentHint?: boolean;
    openWorldHint?: boolean;
  };
};

type GatewayToolHandler = (
  args: JsonRecord
) => Promise<unknown>;

const registerGatewayTool = server.registerTool.bind(server) as unknown as (
  name: string,
  definition: GatewayToolDefinition,
  handler: GatewayToolHandler
) => void;

function gatewayErrorResult(error: unknown) {
  if (error instanceof GatewayBackendError) {
    return {
      isError: true,
      content: [{ type: "text" as const, text: `${error.code}: ${error.message}` }],
      structuredContent: {
        code: error.code,
        message: error.message,
        safe_to_retry: error.safeToRetry,
        ...error.details,
      },
    };
  }

  const message = error instanceof Error ? error.message : String(error);
  return {
    isError: true,
    content: [{ type: "text" as const, text: `GATEWAY_ERROR: ${message}` }],
    structuredContent: {
      code: "GATEWAY_ERROR",
      message,
      safe_to_retry: false,
    },
  };
}

const statusInput = z.object({
  adopt_active_project: z
    .boolean()
    .default(false)
    .describe(
      "Rare explicit rebind only: after intentionally selecting a different Blockbench project tab, set true once so this Gateway adopts that active project. Leave false for normal status checks."
    ),
});

const searchInput = z.object({
  query: z.string().default(""),
  limit: z.number().int().min(1).max(50).default(4),
});

const describeInput = z.object({
  capability: z.string().min(1),
  branch: z
    .object({
      field: z.string().min(1),
      value: z.string().min(1),
    })
    .strict()
    .optional()
    .describe(
      "Optional consolidated-capability branch projection. Use only when the branch discriminator/value is already known."
    ),
});

const invokeInput = z.object({
  capability: z.string().min(1),
  arguments: z.record(z.unknown()).default({}),
});

registerGatewayTool(
  GATEWAY_TOOLS.status,
  {
    title: "BlockIT Status",
    description:
      "Reports Gateway health and current Blockbench Runtime state. Normal authoring does not poll status. Set adopt_active_project=true only after intentionally changing this Gateway to another open Blockbench project tab.",
    inputSchema: statusInput.shape,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  },
  async (rawArgs) => {
    try {
      const { adopt_active_project } = statusInput.parse(rawArgs);
      const status = adopt_active_project
        ? await backend.adoptActiveProject()
        : await backend.getStatus();
      return {
        content: [
          {
            type: "text" as const,
            text: status.runtime.online
              ? status.affinity.project_uuid
                ? `BlockIT Gateway is ready; Runtime is online and this Gateway is bound to project ${status.affinity.project_uuid}.`
                : "BlockIT Gateway is ready and the Blockbench Runtime is online; project affinity will bind on the first Runtime invocation."
              : "BlockIT Gateway is ready; the Blockbench Runtime is currently offline.",
          },
        ],
        structuredContent: status,
      };
    } catch (error) {
      return gatewayErrorResult(error);
    }
  }
);

registerGatewayTool(
  GATEWAY_TOOLS.searchCapabilities,
  {
    title: "Search BlockIT Capabilities",
    description:
      "Searches the live phase-filtered Runtime catalog. Primary authoring capabilities rank ahead of support, experimental, and maintenance fallbacks when relevance is comparable; exact matching intent can still discover any exposed capability.",
    inputSchema: searchInput.shape,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  },
  async (rawArgs) => {
    try {
      const { query, limit } = searchInput.parse(rawArgs);
      const capabilities = await backend.searchCapabilities(query, limit);
      return {
        content: [
          {
            type: "text" as const,
            text: `Found ${capabilities.length} BlockIT Runtime capabilities.`,
          },
        ],
        structuredContent: { query, count: capabilities.length, capabilities },
      };
    } catch (error) {
      return gatewayErrorResult(error);
    }
  }
);

registerGatewayTool(
  GATEWAY_TOOLS.describeCapability,
  {
    title: "Describe BlockIT Capability",
    description:
      "Returns the current Runtime description, annotations, and input schema for one exact capability. When a consolidated branch is already known, branch projection returns only continuation-relevant fields instead of the full multi-branch schema.",
    inputSchema: describeInput.shape,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  },
  async (rawArgs) => {
    try {
      const { capability, branch } = describeInput.parse(rawArgs);
      const tool = await backend.describeCapability(capability);
      const projection = projectCapabilityInputSchema(
        capability,
        tool.inputSchema ?? {},
        branch
      );
      return {
        content: [
          {
            type: "text" as const,
            text: projection.projected
              ? `Capability ${capability} branch ${branch!.field}=${branch!.value} is available on the current BlockIT Runtime surface.`
              : `Capability ${capability} is available on the current BlockIT Runtime surface.`,
          },
        ],
        structuredContent: {
          capability: {
            name: tool.name,
            description: tool.description ?? "",
            inputSchema: projection.inputSchema,
            annotations: tool.annotations ?? {},
            schema_projection: {
              projected: projection.projected,
              branch: projection.branch,
            },
          },
        },
      };
    } catch (error) {
      return gatewayErrorResult(error);
    }
  }
);

registerGatewayTool(
  GATEWAY_TOOLS.invokeCapability,
  {
    title: "Invoke BlockIT Capability",
    description:
      "Invokes one exact capability on this Gateway's bound Blockbench project. Calls are serialized and never automatically retried after a transport interruption; uncertain mutations return OUTCOME_UNKNOWN. Successful project creation adopts the new project automatically; successful phase switches keep the same Gateway task alive.",
    inputSchema: invokeInput.shape,
  },
  async (rawArgs) => {
    try {
      const { capability, arguments: args } = invokeInput.parse(rawArgs);
      const result = await backend.invokeCapability(capability, args);
      if (result.structuredContent === undefined) return result;
      return {
        ...result,
        structuredContent: compactGatewayCapabilityStructuredContent(
          capability,
          result.structuredContent
        ),
      };
    } catch (error) {
      return gatewayErrorResult(error);
    }
  }
);

let shuttingDown = false;

async function shutdown(exitCode: number): Promise<void> {
  if (shuttingDown) return;
  shuttingDown = true;
  try {
    await backend.close();
    await server.close();
  } finally {
    process.exit(exitCode);
  }
}

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);

  process.on("SIGINT", () => void shutdown(0));
  process.on("SIGTERM", () => void shutdown(0));
  process.stdin.on("close", () => void shutdown(0));
}

main().catch((error) => {
  // stdout is reserved exclusively for the MCP stdio transport.
  console.error("[BlockIT Gateway] fatal:", error);
  void shutdown(1);
});