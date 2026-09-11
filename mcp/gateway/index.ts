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
  buildControlDelta,
  buildControlPacket,
  decorateCapabilities,
} from "./control";
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
      "Stable LazyDesigner Gateway boundary with LazyDesigner Control. Start/resume with status only when orientation is unknown or materially stale; reuse the compact Control packet and content-addressed context handles. For asset work, pass reference_package_path when a LazyDesigner Reference Package exists; Control projects only the active authoring stage plus exactly one selected modelling profile for Geometry. For product/source work, use task_mode=SYSTEM_DEVELOPMENT with concrete task_intent so Control returns bounded source/specialist/test ownership instead of broad repository scans. Known Runtime capability → invoke directly; search only when unknown/stale and describe only for real schema uncertainty. Geometry/Texturing share AUTHORING; Animation is the only Runtime phase handoff. invoke_capability never auto-retries an interrupted mutation.",
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
      "Optional LazyDesigner Control context handles already loaded in this task. Matching current hashes are omitted from delivery; stale same-family handles are returned as invalidated IDs."
    ),
  workspace_path: z
    .string()
    .min(1)
    .optional()
    .describe(
      "Optional Active Workspace directory or README.md path. Supply when Runtime cannot resolve the asset workspace from the bound project."
    ),
  reference_package_path: z
    .string()
    .min(1)
    .optional()
    .describe(
      "Optional LazyDesigner Reference Package directory or REFERENCE.json path. Control reads only the compact machine-readable package projection and selects active-stage document/image identities."
    ),
  current_user_delta: z
    .string()
    .max(1000)
    .optional()
    .describe(
      "Optional current asset correction/change request. Control includes this delta in the stage-specific context identity without replacing original reference intent."
    ),
  task_mode: z
    .enum(["ASSET_AUTHORING", "SYSTEM_DEVELOPMENT"])
    .default("ASSET_AUTHORING")
    .describe(
      "LazyDesigner Control task class. ASSET_AUTHORING projects the current authoring stage; SYSTEM_DEVELOPMENT routes LazyDesigner source/Gateway/Runtime/build work to bounded owners."
    ),
  task_intent: z
    .string()
    .max(500)
    .optional()
    .describe(
      "Concrete system-development problem to route when task_mode=SYSTEM_DEVELOPMENT, for example 'animation terlalu kaku' or 'dev:sync stale build'."
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
    title: "LazyDesigner Status",
    description:
      "Reports Gateway health plus a compact LazyDesigner Control packet. Asset mode can project a Reference Package + Workspace into GEOMETRY_CONTEXT, TEXTURE_CONTEXT, or ANIMATION_CONTEXT. System-development mode returns bounded source/specialist/test ownership. Pass known_context_ids to avoid retransmitting unchanged Skill/profile handles.",
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
        reference_package_path,
        current_user_delta,
        task_mode,
        task_intent,
      } = statusInput.parse(rawArgs);
      const status = adopt_active_project
        ? await backend.adoptActiveProject()
        : await backend.getStatus();
      const control = await buildControlPacket(status, {
        knownContextIds: known_context_ids,
        workspacePath: workspace_path,
        referencePackagePath: reference_package_path,
        currentUserDelta: current_user_delta,
        taskMode: task_mode,
        taskIntent: task_intent,
      });
      return {
        content: [
          {
            type: "text" as const,
            text: task_mode === "SYSTEM_DEVELOPMENT"
              ? `LazyDesigner Control routed development task ${control.task_context_id} to ${control.development?.domain ?? "UNRESOLVED"}.`
              : status.runtime.online
                ? status.affinity.project_uuid
                  ? `LazyDesigner Gateway is ready; Control task ${control.task_context_id} is bound to project ${status.affinity.project_uuid}.`
                  : "LazyDesigner Gateway is ready and Runtime is online; Control has no project binding yet."
                : "LazyDesigner Gateway is ready; the Blockbench Runtime is currently offline.",
          },
        ],
        structuredContent: {
          ...status,
          control,
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
    title: "Search LazyDesigner Capabilities",
    description:
      "Searches the current exposed capability catalog and decorates results with LazyDesigner Control domain/source ownership. Search is fallback-only; it does not perform an extra status read merely to label results.",
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
      const capabilities = decorateCapabilities(rawCapabilities);
      return {
        content: [
          {
            type: "text" as const,
            text: `Found ${capabilities.length} LazyDesigner capabilities.`,
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
    title: "Describe LazyDesigner Capability",
    description:
      "Returns description, annotations, exact input schema and semantic owner for one exposed capability. It does not perform a second status read merely to repeat current phase metadata.",
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
              ? `Capability ${capability} branch ${branch!.field}=${branch!.value} is available on the current LazyDesigner surface.`
              : `Capability ${capability} is available on the current LazyDesigner surface.`,
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
            control: {
              authoring_domain: authoringDomainForCapability(capability),
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
    title: "Invoke LazyDesigner Capability",
    description:
      "Invokes one exact LazyDesigner capability. Runtime calls use this Gateway's bound Blockbench project and authoring phase; rare read-only local support references do not mutate project state. Runtime calls are serialized and never automatically retried after interruption.",
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
      const controlDelta = buildControlDelta({
        capability,
        phaseBefore,
        phaseAfter,
        projectUuid,
        succeeded,
        result: result.structuredContent,
      });
      if (result.structuredContent === undefined) {
        return { ...result, structuredContent: { control_delta: controlDelta } };
      }
      const compacted = compactGatewayCapabilityStructuredContent(
        capability,
        result.structuredContent
      );
      return {
        ...result,
        structuredContent:
          compacted && typeof compacted === "object" && !Array.isArray(compacted)
            ? { ...(compacted as JsonRecord), control_delta: controlDelta }
            : { runtime_result: compacted, control_delta: controlDelta },
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
  console.error("[LazyDesigner Gateway] fatal:", error);
  void shutdown(1);
});
