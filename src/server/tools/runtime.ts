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
      "Returns one structured readiness snapshot for the Blockbench MCP plugin, canonical server URL, active project, effective connection settings, and sessions. Use this instead of repeating separate connection-discovery calls.",
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
const EFFECTIVE_SESSION_TIMEOUT_MINUTES = 30;
const READINESS_CLIENT_NAME = "buildit-readiness-smoke";

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
        const writeSessions = sessions.filter(
          (session) => session.clientName !== READINESS_CLIENT_NAME
        );

        const configuredAutoPort = Settings.get("mcp_auto_port") !== false;
        const configuredPort = Number(Settings.get("mcp_port") ?? 3000);
        const configuredEndpoint = String(Settings.get("mcp_endpoint") ?? "/bb-mcp");
        const configuredTimeout = Number(Settings.get("mcp_session_timeout") ?? 30);
        const heartbeat = Number(Settings.get("mcp_sse_heartbeat") ?? 15);

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
        if (server.requestedPort !== 3000 || server.port !== 3000) {
          blockers.push({
            code: "PORT_MISMATCH",
            message: `Effective MCP port is ${server.port ?? server.requestedPort}; expected 3000.`,
          });
        }
        if (server.endpoint.replace(/\/$/, "") !== "/bb-mcp") {
          blockers.push({
            code: "ENDPOINT_MISMATCH",
            message: `Effective endpoint is ${server.endpoint}; expected /bb-mcp.`,
          });
        }
        if (server.autoPort || server.fallbackUsed) {
          blockers.push({
            code: "AUTO_PORT_ENABLED",
            message: "Effective auto-port or fallback-port behavior is enabled.",
          });
        }
        if (!project) {
          blockers.push({
            code: "NO_ACTIVE_PROJECT",
            message: "No Blockbench project is open.",
          });
        }
        if (writeSessions.length > 1) {
          blockers.push({
            code: "MULTIPLE_MCP_WRITE_SESSIONS",
            message: `${writeSessions.length} non-readiness MCP sessions are active; one write owner is required.`,
          });
        }

        if (
          configuredAutoPort ||
          configuredPort !== 3000 ||
          configuredEndpoint.replace(/\/$/, "") !== "/bb-mcp" ||
          configuredTimeout < EFFECTIVE_SESSION_TIMEOUT_MINUTES
        ) {
          warnings.push({
            code: "SAVED_SETTINGS_OVERRIDDEN",
            message:
              "Saved legacy MCP settings differ from the Rework contract; runtime canonical values are enforced until settings are resaved.",
          });
        }

        const status = blockers.length > 0 ? "BLOCKER" : "PASS";
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
                  : `Blockbench MCP readiness: BLOCKER. ${blockers[0]?.message ?? "Review runtime details."}`,
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
              auto_port_disabled: !server.autoPort && !server.fallbackUsed,
              one_active_project: Boolean(project),
              one_or_zero_write_sessions: writeSessions.length <= 1,
            },
            server,
            effective_settings: {
              port: server.port ?? server.requestedPort,
              endpoint: server.endpoint,
              auto_port: server.autoPort,
              fallback_used: server.fallbackUsed,
              session_timeout_minutes: Math.max(
                EFFECTIVE_SESSION_TIMEOUT_MINUTES,
                Number.isFinite(configuredTimeout) ? configuredTimeout : 0
              ),
              sse_heartbeat_seconds: heartbeat,
            },
            configured_settings: {
              port: configuredPort,
              endpoint: configuredEndpoint,
              auto_port: configuredAutoPort,
              session_timeout_minutes: configuredTimeout,
              sse_heartbeat_seconds: heartbeat,
            },
            project,
            session_summary: {
              total: sessions.length,
              readiness: sessions.length - writeSessions.length,
              write_or_other: writeSessions.length,
            },
            sessions: sessions.map((session) => ({
              id: session.id,
              client_name: session.clientName ?? null,
              client_version: session.clientVersion ?? null,
              transient_readiness_session:
                session.clientName === READINESS_CLIENT_NAME,
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
