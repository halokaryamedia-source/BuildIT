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
  summarizeCapability,
  type JsonRecord,
} from "./contract";
import { projectCapabilityInputSchema } from "./schemaProjection";
import {
  buildNavigatorDelta,
  buildNavigatorSnapshot,
  decorateCapabilities,
  ownerForCapability,
} from "./navigator";
import {
  VANILLA_ENTITY_REFERENCE_CAPABILITY,
  VANILLA_ENTITY_REFERENCE_TOOL,
  VanillaEntityReferenceError,
  VanillaEntityReferenceProvider,
  shouldProbeVanillaEntityReference,
} from "./vanillaEntityReference";

const backend = new BlockitRuntimeBackend();
const vanillaReferenceProvider = new VanillaEntityReferenceProvider();

const server = new McpServer(
  {
    name: GATEWAY_NAME,
    version: GATEWAY_VERSION,
  },
  {
    instructions:
      "Stable BlockIT client boundary with BlockIT Navigator. Start/resume with status only when orientation is unknown or materially stale; reuse its compact navigation packet. Known Runtime capability → invoke directly; search only when unknown/stale and describe only for real schema uncertainty. Gateway exposes tools only; Runtime resources and prompts are not proxied. Geometry/Texturing share AUTHORING; Animation is the only runtime handoff. Project/phase affinity remain local to this Gateway. invoke_capability never auto-retries an interrupted mutation.",
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

  if (error instanceof VanillaEntityReferenceError) {
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
      "One-time explicit bind/rebind: select the intended Blockbench project tab, then set true so this Gateway adopts it. Required before first authoring when multiple project tabs are open; leave false for normal status checks."
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
      "Reports Gateway health and current Blockbench Runtime state. Normal authoring does not poll status. When multiple project tabs are open, select the intended tab and set adopt_active_project=true once before first authoring; use it again only for an intentional rebind.",
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
                ? `BlockIT Gateway is ready; Runtime is online and this Gateway is bound to project ${status.affinity.project_uuid} in ${status.affinity.authoring_phase ?? "the Runtime startup"} phase.`
                : "BlockIT Gateway is ready and the Blockbench Runtime is online. With one open project affinity can bind on first authoring call; with multiple open projects select the intended tab and bind once with status(adopt_active_project=true)."
              : "BlockIT Gateway is ready; the Blockbench Runtime is currently offline.",
          },
        ],
        structuredContent: {
          ...status,
          navigation: buildNavigatorSnapshot(status),
        },
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
      "Searches the live BlockIT capability catalog. Primary authoring capabilities rank ahead of support, experimental, and maintenance fallbacks when relevance is comparable.",
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
      const runtimeCapabilities = await backend.searchCapabilities(query, limit);
      const includeVanillaReference =
        shouldProbeVanillaEntityReference(query) &&
        (await vanillaReferenceProvider.isAvailable());
      const rawCapabilities = includeVanillaReference
        ? [
            summarizeCapability(VANILLA_ENTITY_REFERENCE_TOOL),
            ...runtimeCapabilities.filter(
              (candidate) =>
                candidate.capability_id !== VANILLA_ENTITY_REFERENCE_CAPABILITY
            ),
          ].slice(0, limit)
        : runtimeCapabilities;
      const navigationStatus = await backend.getStatus();
      const currentOwner = buildNavigatorSnapshot(navigationStatus).authoring.owner;
      const capabilities = decorateCapabilities(rawCapabilities, currentOwner);
      return {
        content: [
          {
            type: "text" as const,
            text: `Found ${capabilities.length} BlockIT capabilities.`,
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
      "Returns description, annotations, and input schema for one exact BlockIT capability. Known consolidated branches can be projected to continuation-relevant fields.",
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
      const tool =
        capability === VANILLA_ENTITY_REFERENCE_CAPABILITY &&
        (await vanillaReferenceProvider.isAvailable())
          ? VANILLA_ENTITY_REFERENCE_TOOL
          : await backend.describeCapability(capability);
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
              ? `Capability ${capability} branch ${branch!.field}=${branch!.value} is available on the current BlockIT surface.`
              : `Capability ${capability} is available on the current BlockIT surface.`,
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
            navigation: {
              owner: ownerForCapability(capability),
              current_phase: (await backend.getStatus()).affinity.authoring_phase,
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
      "Invokes one exact BlockIT capability. Runtime calls use this Gateway's bound Blockbench project and authoring phase; rare read-only local support references do not mutate project state. Runtime calls are serialized and never automatically retried after interruption.",
    inputSchema: invokeInput.shape,
  },
  async (rawArgs) => {
    try {
      const { capability, arguments: args } = invokeInput.parse(rawArgs);
      const result =
        capability === VANILLA_ENTITY_REFERENCE_CAPABILITY
          ? await vanillaReferenceProvider.invoke(args)
          : await backend.invokeCapability(capability, args);
      const structured = result.structuredContent && typeof result.structuredContent === "object" && !Array.isArray(result.structuredContent)
        ? result.structuredContent as JsonRecord
        : null;
      const targetPhase = capability === "switch_authoring_phase" && typeof structured?.phase === "string"
        ? structured.phase as "geometry" | "texturing" | "animation"
        : null;
      const projectUuid = capability === "create_project" && structured?.project && typeof structured.project === "object" && !Array.isArray(structured.project)
        ? typeof (structured.project as JsonRecord).uuid === "string" ? (structured.project as JsonRecord).uuid as string : null
        : null;
      const navigationDelta = buildNavigatorDelta({
        capability,
        phaseBefore: null,
        phaseAfter: targetPhase,
        projectUuid,
        succeeded: result.isError !== true,
      });
      if (result.structuredContent === undefined) {
        return { ...result, structuredContent: { navigation_delta: navigationDelta } };
      }
      const compacted = compactGatewayCapabilityStructuredContent(
        capability,
        result.structuredContent
      );
      return {
        ...result,
        structuredContent:
          compacted && typeof compacted === "object" && !Array.isArray(compacted)
            ? { ...(compacted as JsonRecord), navigation_delta: navigationDelta }
            : { runtime_result: compacted, navigation_delta: navigationDelta },
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
