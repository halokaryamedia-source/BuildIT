/// <reference types="three" />
/// <reference types="blockbench-types" />
import { z } from "zod";
import { createTool, type ToolSpec } from "@/lib/factories";
import { STATUS_STABLE, VERSION } from "@/lib/constants";
import { serverState } from "@/lib/serverState";
import { sessionManager } from "@/lib/sessions";

export const getRuntimeStatusParameters = z.object({});

export const runtimeToolDocs: ToolSpec[] = [
  {
    name: "get_runtime_status",
    description:
      "Returns one structured readiness snapshot for the Blockbench MCP plugin, canonical server URL, active project, settings, and sessions. Use this instead of repeating separate connection-discovery calls.",
    annotations: {
      title: "Get Runtime Status",
      readOnlyHint: true,
    },
    parameters: getRuntimeStatusParameters,
    status: STATUS_STABLE,
  },
];

const CANONICAL_URL = "http://localhost:3000/bb-mcp";
const CANONICAL_SERVER_KEY = "blockbench";

function normalizeLocalUrl(value: string | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    const hostname = url.hostname === "127.0.0.1" ? "localhost" : url.hostname;
    const pathname = url.pathname.length > 1
      ? url.pathname.replace(/\/$/, "")
      : url.pathname;
    return `${url.protocol}//${hostname}${url.port ? `:${url.port}` : ""}${pathname}`;
  } catch {
    return value.replace(/\/$/, "");
  }
}

export function registerRuntimeTools() {
  createTool(
    runtimeToolDocs[0].name,
    {
      ...runtimeToolDocs[0],
      async execute() {
        serverState.refreshProject();
        const server = serverState.get();
        const sessions = sessionManager.getAll();

        const actualAutoPort = Settings.get("mcp_auto_port") !== false;
        const actualPort = Number(Settings.get("mcp_port") ?? 3000);
        const actualEndpoint = String(Settings.get("mcp_endpoint") ?? "/bb-mcp");
        const actualTimeout = Number(Settings.get("mcp_session_timeout") ?? 30);
        const actualHeartbeat = Number(Settings.get("mcp_sse_heartbeat") ?? 15);

        const format = typeof Format !== "undefined"
          ? (Format as {
              id?: string;
              name?: string;
              display_name?: string;
            })
          : undefined;

        const project = typeof Project !== "undefined" && Project
          ? {
              name: Project.name,
              uuid: Project.uuid,
              format: format?.id ?? null,
              format_name: format?.display_name ?? format?.name ?? null,
              uv_mode: Project.box_uv ? "box" : "per_face",
              texture_width: Project.texture_width ?? null,
              texture_height: Project.texture_height ?? null,
              save_path:
                (Project as unknown as { save_path?: string }).save_path ?? null,
              counts: {
                cubes: Cube.all.length,
                meshes: Mesh.all.length,
                groups: Group.all.length,
                textures: Texture.all.length,
                animations:
                  (Project as unknown as { animations?: unknown[] }).animations
                    ?.length ?? 0,
              },
            }
          : null;

        const normalizedActualUrl = normalizeLocalUrl(server.url);
        const normalizedCanonicalUrl = normalizeLocalUrl(CANONICAL_URL);
        const blockers: Array<{ code: string; message: string }> = [];
        const warnings: Array<{ code: string; message: string }> = [];

        if (server.status !== "listening") {
          blockers.push({
            code: "MCP_NOT_LISTENING",
            message: `MCP server status is ${server.status}.`,
          });
        }
        if (normalizedActualUrl !== normalizedCanonicalUrl) {
          blockers.push({
            code: "CONNECTION_CONTRACT_MISMATCH",
            message: `Actual MCP URL is ${server.url ?? "unset"}; expected ${CANONICAL_URL}.`,
          });
        }
        if (actualPort !== 3000) {
          blockers.push({
            code: "PORT_MISMATCH",
            message: `Configured port is ${actualPort}; expected 3000.`,
          });
        }
        if (actualEndpoint.replace(/\/$/, "") !== "/bb-mcp") {
          blockers.push({
            code: "ENDPOINT_MISMATCH",
            message: `Configured endpoint is ${actualEndpoint}; expected /bb-mcp.`,
          });
        }
        if (actualAutoPort || server.autoPort || server.fallbackUsed) {
          blockers.push({
            code: "AUTO_PORT_ENABLED",
            message:
              "Auto-port or fallback-port behavior is enabled; canonical connection cannot be guaranteed.",
          });
        }
        if (!project) {
          blockers.push({
            code: "NO_ACTIVE_PROJECT",
            message: "No Blockbench project is open.",
          });
        }
        if (sessions.length > 1) {
          blockers.push({
            code: "MULTIPLE_MCP_SESSIONS",
            message: `${sessions.length} MCP sessions are active; one write owner is required.`,
          });
        }
        if (actualTimeout < 30) {
          warnings.push({
            code: "SESSION_TIMEOUT_LOW",
            message: `Session timeout is ${actualTimeout} minute(s); 30 minutes is recommended.`,
          });
        }

        const status = blockers.length > 0
          ? "BLOCKER"
          : warnings.length > 0
            ? "REVISION_REQUIRED"
            : "PASS";

        const blockbenchVersion =
          typeof Blockbench !== "undefined"
            ? (Blockbench as unknown as { version?: string }).version ?? null
            : null;

        return {
          content: [
            {
              type: "text" as const,
              text:
                status === "PASS"
                  ? `Blockbench MCP is ready at ${CANONICAL_URL} for project ${project?.name ?? "unknown"}.`
                  : `Blockbench MCP readiness: ${status}. ${blockers[0]?.message ?? warnings[0]?.message ?? "Review runtime details."}`,
            },
          ],
          structuredContent: {
            status,
            plugin: {
              id: "mcp",
              title: "MCP Server",
              version: VERSION,
              blockbench_version: blockbenchVersion,
            },
            contract: {
              server_key: CANONICAL_SERVER_KEY,
              canonical_url: CANONICAL_URL,
              url_matches: normalizedActualUrl === normalizedCanonicalUrl,
              auto_port_disabled:
                !actualAutoPort && !server.autoPort && !server.fallbackUsed,
              one_active_project: Boolean(project),
              one_or_zero_sessions: sessions.length <= 1,
            },
            server,
            settings: {
              port: actualPort,
              endpoint: actualEndpoint,
              auto_port: actualAutoPort,
              session_timeout_minutes: actualTimeout,
              sse_heartbeat_seconds: actualHeartbeat,
            },
            project,
            sessions: sessions.map((session) => ({
              id: session.id,
              client_name: session.clientName ?? null,
              client_version: session.clientVersion ?? null,
              connected_at: session.connectedAt.toISOString(),
              last_activity: session.lastActivity.toISOString(),
            })),
            blockers,
            warnings,
          },
        };
      },
    },
    runtimeToolDocs[0].status
  );
}
