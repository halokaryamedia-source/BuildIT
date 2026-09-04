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
} from "./contract";

const backend = new BlockitRuntimeBackend();

const server = new McpServer(
  {
    name: GATEWAY_NAME,
    version: GATEWAY_VERSION,
  },
  {
    instructions:
      "Stable BlockIT client boundary. Blockbench may reload without changing this MCP tool list. Use search_capabilities and describe_capability when the exact current runtime capability is unknown. invoke_capability never auto-retries an interrupted backend call.",
  }
);

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

server.registerTool(
  GATEWAY_TOOLS.status,
  {
    title: "BlockIT Status",
    description:
      "Reports Gateway health and the current Blockbench runtime state without requiring the runtime to be online at Gateway startup.",
    inputSchema: {},
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  },
  async () => {
    const status = await backend.getStatus();
    return {
      content: [
        {
          type: "text" as const,
          text: status.runtime.online
            ? "BlockIT Gateway is ready and the Blockbench runtime is online."
            : "BlockIT Gateway is ready; the Blockbench runtime is currently offline.",
        },
      ],
      structuredContent: status,
    };
  }
);

server.registerTool(
  GATEWAY_TOOLS.searchCapabilities,
  {
    title: "Search BlockIT Capabilities",
    description:
      "Searches the live Blockbench runtime capability catalog. The Gateway tool surface stays stable even when backend tools are added, removed, renamed, or phase-filtered.",
    inputSchema: {
      query: z.string().default(""),
      limit: z.number().int().min(1).max(50).default(12),
    },
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  },
  async ({ query, limit }) => {
    try {
      const capabilities = await backend.searchCapabilities(query, limit);
      return {
        content: [
          {
            type: "text" as const,
            text: `Found ${capabilities.length} BlockIT runtime capabilities.`,
          },
        ],
        structuredContent: { query, count: capabilities.length, capabilities },
      };
    } catch (error) {
      return gatewayErrorResult(error);
    }
  }
);

server.registerTool(
  GATEWAY_TOOLS.describeCapability,
  {
    title: "Describe BlockIT Capability",
    description:
      "Returns the current backend description, annotations, and input schema for one exact capability before invocation.",
    inputSchema: {
      capability: z.string().min(1),
    },
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  },
  async ({ capability }) => {
    try {
      const tool = await backend.describeCapability(capability);
      return {
        content: [
          {
            type: "text" as const,
            text: `Capability ${capability} is available on the current BlockIT runtime surface.`,
          },
        ],
        structuredContent: { capability: tool },
      };
    } catch (error) {
      return gatewayErrorResult(error);
    }
  }
);

server.registerTool(
  GATEWAY_TOOLS.invokeCapability,
  {
    title: "Invoke BlockIT Capability",
    description:
      "Invokes one exact capability on the current Blockbench runtime. Calls are serialized and are never automatically retried after a transport interruption; uncertain mutations return OUTCOME_UNKNOWN.",
    inputSchema: {
      capability: z.string().min(1),
      arguments: z.record(z.unknown()).default({}),
    },
  },
  async ({ capability, arguments: args }) => {
    try {
      return await backend.invokeCapability(capability, args);
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
