export interface McpServerListenInfo {
  requestedPort: number;
  port: number;
  endpoint: string;
  url: string;
  autoPort: boolean;
  fallbackUsed: boolean;
  projectName?: string | null;
  projectUuid?: string | null;
}

export type McpServerStatus = "starting" | "listening" | "error" | "stopped";

export interface McpServerState {
  status: McpServerStatus;
  requestedPort: number;
  endpoint: string;
  autoPort: boolean;
  port?: number;
  url?: string;
  fallbackUsed: boolean;
  errorMessage?: string;
  projectName?: string | null;
  projectUuid?: string | null;
}

type Listener = (state: McpServerState) => void;

const DEFAULT_STATE: McpServerState = {
  status: "stopped",
  requestedPort: 3000,
  endpoint: "/bb-mcp",
  autoPort: false,
  fallbackUsed: false,
};

let state: McpServerState = { ...DEFAULT_STATE };
const listeners = new Set<Listener>();

function emit(): void {
  const snapshot = { ...state };
  listeners.forEach((listener) => listener(snapshot));
}

export const serverState = {
  get(): McpServerState {
    return { ...state };
  },

  set(partial: Partial<McpServerState>): void {
    state = { ...state, ...partial };
    emit();
  },

  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    listener({ ...state });
    return () => listeners.delete(listener);
  },

  clear(): void {
    state = { ...DEFAULT_STATE };
    emit();
  },

  /** Refresh project identity from the active Blockbench project. */
  refreshProject(): void {
    if (typeof Project !== "undefined" && Project) {
      state = {
        ...state,
        projectName: Project.name ?? null,
        projectUuid: Project.uuid ?? null,
      };
      emit();
    }
  },
};

/** Slugify a project name for non-Codex integrations. */
export function slugifyProjectName(name: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
  return slug || "project";
}

/** Build a unique integration key. Codex always uses the fixed key `blockbench`. */
export function getMcpServerKey(
  projectName: string | null | undefined,
  port: number
): string {
  if (projectName) {
    return `blockbench_${slugifyProjectName(projectName)}`;
  }
  return `blockbench_${port}`;
}

export function normalizeEndpoint(raw: unknown, fallback = "/bb-mcp"): string {
  let endpoint = String(raw ?? fallback).trim();
  if (!endpoint) endpoint = fallback;
  if (!endpoint.startsWith("/")) endpoint = `/${endpoint}`;
  if (endpoint.length > 1 && endpoint.endsWith("/")) {
    endpoint = endpoint.slice(0, -1);
  }
  return endpoint;
}

export function toValidPort(raw: unknown, fallback = 3000): number {
  const n = Math.floor(Number(raw));
  if (!Number.isFinite(n) || n < 1 || n > 65535) return fallback;
  return n;
}
