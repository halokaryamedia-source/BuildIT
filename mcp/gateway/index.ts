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
  authoringDomainForCapability,
  buildNavigatorDelta,
  buildNavigatorPacket,
  buildNavigatorSnapshot,
  decorateCapabilities,
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
      "Stable BlockIT client boundary with BlockIT Navigator. Start/resume with status only when orientation is unknown or materially stale; reuse its compact navigation packet. For source work, call status with task_mode=MCP_DEVELOPMENT plus the concrete task_intent to receive bounded source/specialist/test ownership instead of scanning the repo. Known Runtime capability → invoke directly; search only when unknown/stale and describe only for real schema uncertainty. Gateway exposes tools only; Runtime resources and prompts are not proxied. Geometry/Texturing share AUTHORING; Animation is the only runtime handoff. Project/phase affinity remain local to this Gateway. invoke_capability never auto-retries an interrupted mutation.",
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
  known_context_ids: z
    .array(z.string().min(1).max(160))
    .max(16)
    .default([])
    .describe(
      "Optional Navigator context handles already loaded in this task. Matching exact hashes are omitted from delivery instead of retransmitted."
    ),
  workspace_path: z
    .string()
    .min(1)
    .optional()
    .describe(
      "Optional Active Workspace directory or README.md path. Supply once when Runtime does not expose a saved project path; Navigator remembers it for this bound project."
    ),
  task_mode: z
    .enum(["ASSET_AUTHORING", "MCP_DEVELOPMENT"])
    .default("ASSET_AUTHORING")
    .describe(
      "Navigator projection mode. Use MCP_DEVELOPMENT only for BlockIT source/tool/Gateway/runtime/build work; normal model creation remains ASSET_AUTHORING."
    ),
  task_intent: z
    .string()
    .max(500)
    .optional()
    .describe(
      "Concrete development problem to route when task_mode=MCP_DEVELOPMENT, for example 'animation terlalu kaku' or 'dev:sync stale build'."
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
      "Reports Gateway health plus a compact BlockIT Navigator packet. For source development, task_mode=MCP_DEVELOPMENT with task_intent returns bounded source/specialist/test ownership without scanning unrelated repo context. Pass known_context_ids to suppress exact Skill handles already loaded in an authoring task.",
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
      const {
        adopt_active_project,
        known_context_ids,
        workspace_path,
        task_mode,
        task_intent,
      } = statusInput.parse(rawArgs);
      const status = adopt_active_project
        ? await backend.adoptActiveProject()
        : await backend.getStatus();
      const navigation = await buildNavigatorPacket(status, {
        knownContextIds: known_context_ids,
        workspacePath: workspace_path,
        taskMode: task_mode,
        taskIntent: task_intent,
      });
      return {
        content: [
          {
            type: "text" as const,
            text: task_mode === "MCP_DEVELOPMENT"
              ? `BlockIT Navigator routed development task ${navigation.task_context_id} to ${navigation.development?.domain ?? "UNRESOLVED"}.`
              : status.runtime.online
                ? status.affinity.project_uuid
                  ? `BlockIT Gateway is ready; Navigator task ${navigation.task_context_id} is bound to project ${status.affinity.project_uuid}.`
                  : "BlockIT Gateway is ready and Runtime is online; Navigator has no project binding yet."
                : "BlockIT Gateway is ready; the Blockbench Runtime is currently offline.",
          },
        ],
        structuredContent: {
          ...status,
          navigation,
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
      "Searches the live BlockIT capability catalog and decorates results with Navigator authoring-domain eligibility plus exact source ownership. Primary authoring capabilities rank ahead of support, experimental, and maintenance fallbacks when relevance is comparable.",
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
      const currentDomain = buildNavigatorSnapshot(navigationStatus).authoring.domain;
      const capabilities = decorateCapabilities(rawCapabilities, currentDomain);
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
      "Returns description, annotations, and exact input schema for one BlockIT capability. Known consolidated branches can be projected to continuation-relevant fields without returning unrelated schema branches.",
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
              authoring_domain: authoringDomainForCapability(capability),
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
      const phaseBefore = capability === "switch_authoring_phase"
        ? (await backend.getStatus()).affinity.authoring_phase
        : null;
      const result =
        capability === VANILLA_ENTITY_REFERENCE_CAPABILITY
          ? await vanillaReferenceProvider.invoke(args)
          : await backend.invokeCapability(capability, args);
      const structured = result.structuredContent && typeof result.structuredContent === "object" && !Array.isArray(result.structuredContent)
        ? result.structuredContent as JsonRecord
        : null;
      const succeeded = result.isError !== true;
      const targetPhase = capability === "switch_authoring_phase" && typeof structured?.phase === "string"
        ? structured.phase as "geometry" | "texturing" | "animation"
        : null;
      const phaseAfter = capability === "switch_authoring_phase" && succeeded
        ? targetPhase
        : phaseBefore;
      const projectUuid = capability === "create_project" && structured?.project && typeof structured.project === "object" && !Array.isArray(structured.project)
        ? typeof (structured.project as JsonRecord).uuid === "string" ? (structured.project as JsonRecord).uuid as string : null
        : null;
      const navigationDelta = buildNavigatorDelta({
        capability,
        phaseBefore,
        phaseAfter,
        projectUuid,
        succeeded,
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
  console.error("[BlockIT Gateway] fatal:", error);
  void shutdown(1);
});
