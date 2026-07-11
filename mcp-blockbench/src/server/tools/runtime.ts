/// <reference types="three" />
/// <reference types="blockbench-types" />
import { z } from "zod";
import { createTool, type ToolSpec } from "@/lib/factories";
import { STATUS_STABLE, VERSION } from "@/lib/constants";
import { serverState } from "@/lib/serverState";
import { sessionManager } from "@/lib/sessions";
import {
  activateToolProfile,
  getToolProfileIds,
  getToolProfileSnapshot,
} from "@/lib/toolProfiles";
import { getProjectWriteLeaseSnapshot } from "@/lib/writeLease";

export const getRuntimeStatusParameters = z.object({});
export const getToolProfileParameters = z.object({
  include_tools: z.boolean().optional().default(false),
});
export const activateToolProfileParameters = z.object({
  profile_id: z.string().min(1),
});

export const runtimeToolDocs: ToolSpec[] = [
  {
    name: "get_runtime_status",
    description:
      "Returns one compact readiness snapshot for the canonical local server, active project, sessions, write lease, and exact tool profile.",
    annotations: { title: "Get Runtime Status", readOnlyHint: true },
    parameters: getRuntimeStatusParameters,
    status: STATUS_STABLE,
  },
  {
    name: "get_tool_profile",
    description:
      "Returns the active exact MCP tool profile, exposed tool count, profile hash, and optionally the exposed names.",
    annotations: { title: "Get Tool Profile", readOnlyHint: true },
    parameters: getToolProfileParameters,
    status: STATUS_STABLE,
  },
  {
    name: "activate_tool_profile",
    description:
      "Activates one exact stage or repair tool profile. Reconnect once after a change, then reacquire the project write lease.",
    annotations: { title: "Activate Tool Profile", destructiveHint: false },
    parameters: activateToolProfileParameters,
    status: STATUS_STABLE,
  },
];

const CANONICAL_URL = "http://localhost:3000/bb-mcp";
const CANONICAL_SERVER_KEY = "blockbench";
const EFFECTIVE_SESSION_TIMEOUT_MINUTES = 30;
const READINESS_CLIENT_NAMES = new Set([
  "buildit-readiness",
  "buildit-readiness-smoke",
]);

function normalizeLocalUrl(value: string | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    const hostname = url.hostname === "127.0.0.1" ? "localhost" : url.hostname;
    const pathname = url.pathname.length > 1 ? url.pathname.replace(/\/$/, "") : url.pathname;
    return `${url.protocol}//${hostname}${url.port ? `:${url.port}` : ""}${pathname}`;
  } catch {
    return value.replace(/\/$/, "");
  }
}

export function registerRuntimeTools(): void {
  createTool(
    runtimeToolDocs[0].name,
    {
      ...runtimeToolDocs[0],
      async execute() {
        serverState.refreshProject();
        const server = serverState.get();
        const sessions = sessionManager.getAll();
        const writeSessions = sessions.filter(
          (session) => !session.clientName || !READINESS_CLIENT_NAMES.has(session.clientName)
        );
        const configuredAutoPort = Settings.get("mcp_auto_port") !== false;
        const configuredPort = Number(Settings.get("mcp_port") ?? 3000);
        const configuredEndpoint = String(Settings.get("mcp_endpoint") ?? "/bb-mcp");
        const configuredTimeout = Number(Settings.get("mcp_session_timeout") ?? 30);
        const heartbeat = Number(Settings.get("mcp_sse_heartbeat") ?? 15);
        const toolProfile = getToolProfileSnapshot(false);
        const writeLease = getProjectWriteLeaseSnapshot();

        const format =
          typeof Format !== "undefined"
            ? (Format as { id?: string; name?: string; display_name?: string })
            : undefined;
        const project =
          typeof Project !== "undefined" && Project
            ? {
                name: Project.name,
                uuid: Project.uuid,
                format: format?.id ?? null,
                format_name: format?.display_name ?? format?.name ?? null,
                uv_mode: Project.box_uv ? "box" : "per_face",
                texture_width: Project.texture_width ?? null,
                texture_height: Project.texture_height ?? null,
                save_path: (Project as unknown as { save_path?: string }).save_path ?? null,
                counts: {
                  cubes: Cube.all.length,
                  meshes: Mesh.all.length,
                  groups: Group.all.length,
                  textures: Texture.all.length,
                  animations:
                    (Project as unknown as { animations?: unknown[] }).animations?.length ?? 0,
                },
              }
            : null;

        const blockers: Array<{ code: string; message: string }> = [];
        const warnings: Array<{ code: string; message: string }> = [];
        if (server.status !== "listening") {
          blockers.push({ code: "MCP_NOT_LISTENING", message: `MCP server status is ${server.status}.` });
        }
        if (normalizeLocalUrl(server.url) !== normalizeLocalUrl(CANONICAL_URL)) {
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
          blockers.push({ code: "NO_ACTIVE_PROJECT", message: "No Blockbench project is open." });
        }
        if (writeSessions.length > 1) {
          blockers.push({
            code: "MULTIPLE_MCP_WRITE_SESSIONS",
            message: `${writeSessions.length} non-readiness MCP sessions are active; one write owner is required.`,
          });
        }
        if (toolProfile.validation_errors.length > 0) {
          blockers.push({ code: "TOOL_PROFILE_INVALID", message: toolProfile.validation_errors[0] });
        }
        if (
          writeLease.status === "ACTIVE" &&
          project &&
          writeLease.project_uuid !== project.uuid
        ) {
          blockers.push({
            code: "WRITE_LEASE_PROJECT_MISMATCH",
            message: `Lease project ${writeLease.project_uuid} differs from active project ${project.uuid}.`,
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
              "Saved legacy MCP settings differ from the Rework contract; canonical runtime values are enforced.",
          });
        }

        const status = blockers.length ? "BLOCKER" : "PASS";
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
                  ? `Blockbench MCP is ready at ${CANONICAL_URL} for project ${project?.name ?? "unknown"} with profile ${toolProfile.profile_id} (${toolProfile.exposed_tool_count} tools) and lease ${writeLease.status}.`
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
              one_active_project: Boolean(project),
              one_or_zero_write_sessions: writeSessions.length <= 1,
            },
            tool_profile: toolProfile,
            write_lease: writeLease,
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
              transient_readiness_session: Boolean(
                session.clientName && READINESS_CLIENT_NAMES.has(session.clientName)
              ),
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

  createTool(
    runtimeToolDocs[1].name,
    {
      ...runtimeToolDocs[1],
      async execute({ include_tools }) {
        const snapshot = getToolProfileSnapshot(include_tools);
        return {
          content: [
            {
              type: "text" as const,
              text: `Active MCP tool profile: ${snapshot.profile_id} (${snapshot.exposed_tool_count}/${snapshot.total_library_tool_count} tools).`,
            },
          ],
          structuredContent: {
            status: snapshot.validation_errors.length ? "BLOCKER" : "PASS",
            available_profiles: getToolProfileIds(),
            ...snapshot,
          },
        };
      },
    },
    runtimeToolDocs[1].status
  );

  createTool(
    runtimeToolDocs[2].name,
    {
      ...runtimeToolDocs[2],
      async execute({ profile_id }) {
        const result = activateToolProfile(profile_id);
        return {
          content: [
            {
              type: "text" as const,
              text: result.changed
                ? `Tool profile changed from ${result.previous_profile} to ${result.snapshot.profile_id}. Reconnect once, then reacquire the project write lease.`
                : `Tool profile ${result.snapshot.profile_id} is already active.`,
            },
          ],
          structuredContent: {
            status: result.snapshot.validation_errors.length ? "BLOCKER" : "PASS",
            changed: result.changed,
            previous_profile: result.previous_profile,
            active_profile: result.snapshot.profile_id,
            exposed_tool_count: result.snapshot.exposed_tool_count,
            total_library_tool_count: result.snapshot.total_library_tool_count,
            tool_profile_hash: result.snapshot.tool_profile_hash,
            reconnect_required: result.changed,
            write_lease_reacquire_required: result.changed,
            next_action: result.changed
              ? "Reconnect the existing canonical blockbench MCP entry once, call get_runtime_status once, then reacquire manage_project_write_lease."
              : "Continue with the active stage.",
          },
        };
      },
    },
    runtimeToolDocs[2].status
  );
}
