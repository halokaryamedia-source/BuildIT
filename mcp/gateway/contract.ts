export const GATEWAY_NAME = "blockit-gateway";
export const GATEWAY_VERSION = "0.1.0";
export const DEFAULT_RUNTIME_URL = "http://127.0.0.1:3000/bb-mcp";

export const GATEWAY_TOOLS = {
  status: "status",
  searchCapabilities: "search_capabilities",
  describeCapability: "describe_capability",
  invokeCapability: "invoke_capability",
} as const;

export const GATEWAY_TOOL_NAMES = Object.values(GATEWAY_TOOLS);

export type JsonRecord = Record<string, unknown>;

export type BackendToolAnnotations = {
  title?: string;
  readOnlyHint?: boolean;
  destructiveHint?: boolean;
  idempotentHint?: boolean;
  openWorldHint?: boolean;
  [key: string]: unknown;
};

export type BackendTool = {
  name: string;
  description?: string;
  inputSchema?: unknown;
  annotations?: BackendToolAnnotations;
  [key: string]: unknown;
};

export type CapabilitySummary = {
  capability_id: string;
  description: string;
  read_only: boolean;
  destructive: boolean;
  idempotent: boolean;
};

function isRecord(value: unknown): value is JsonRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function stringValue(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function numberValue(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export function normalizeRuntimeUrl(
  value: string = DEFAULT_RUNTIME_URL
): string {
  const parsed = new URL(value);
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("BlockIT runtime URL must use http or https.");
  }
  if (parsed.username || parsed.password) {
    throw new Error("BlockIT runtime URL must not contain credentials.");
  }

  const hostname = parsed.hostname.toLowerCase();
  if (
    hostname !== "127.0.0.1" &&
    hostname !== "localhost" &&
    hostname !== "::1" &&
    hostname !== "[::1]"
  ) {
    throw new Error("BlockIT Gateway only connects to a loopback runtime.");
  }

  parsed.search = "";
  parsed.hash = "";
  return parsed.toString().replace(/\/+$/, "");
}

/**
 * Fingerprint only stable runtime identity fields. Health timestamps are
 * deliberately excluded so ordinary probes do not invalidate the catalog.
 */
export function createRuntimeSignature(health: unknown): string {
  const root = isRecord(health) ? health : {};
  const product = isRecord(root.product) ? root.product : {};

  return JSON.stringify({
    build_identity: stringValue(root.build_identity),
    instance_id: stringValue(root.instance_id),
    startup_time: stringValue(root.startup_time),
    product_id: stringValue(product.id),
    product_version: stringValue(product.version),
    profile: stringValue(product.profile),
    authoring_phase: stringValue(product.authoring_phase),
    exposed_tool_count: numberValue(root.exposed_tool_count),
  });
}

export function summarizeCapability(tool: BackendTool): CapabilitySummary {
  return {
    capability_id: tool.name,
    description: tool.description ?? "",
    read_only: tool.annotations?.readOnlyHint === true,
    destructive: tool.annotations?.destructiveHint === true,
    idempotent: tool.annotations?.idempotentHint === true,
  };
}

function capabilityScore(tool: BackendTool, tokens: string[]): number {
  if (tokens.length === 0) return 1;

  const name = tool.name.toLowerCase();
  const searchableName = name.replace(/[_.\/-]+/g, " ");
  const description = (tool.description ?? "").toLowerCase();
  let score = 0;

  for (const token of tokens) {
    if (name === token) score += 100;
    else if (name.startsWith(token)) score += 60;
    else if (name.includes(token)) score += 40;
    else if (searchableName.includes(token)) score += 30;

    if (description.includes(token)) score += 10;
  }

  return score;
}

export function searchCapabilityCatalog(
  tools: readonly BackendTool[],
  query: string,
  limit: number
): CapabilitySummary[] {
  const boundedLimit = Math.max(1, Math.min(50, Math.trunc(limit)));
  const tokens = query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  return tools
    .map((tool) => ({ tool, score: capabilityScore(tool, tokens) }))
    .filter(({ score }) => tokens.length === 0 || score > 0)
    .sort(
      (left, right) =>
        right.score - left.score || left.tool.name.localeCompare(right.tool.name)
    )
    .slice(0, boundedLimit)
    .map(({ tool }) => summarizeCapability(tool));
}

export type InterruptedCallClassification = {
  code: "BACKEND_CALL_INTERRUPTED" | "OUTCOME_UNKNOWN";
  safe_to_retry: boolean;
};

/**
 * A transport failure after tools/call may happen after Blockbench already
 * executed the operation. Mutations therefore never receive an automatic retry.
 */
export function classifyInterruptedCall(
  tool: BackendTool
): InterruptedCallClassification {
  if (tool.annotations?.readOnlyHint === true) {
    return { code: "BACKEND_CALL_INTERRUPTED", safe_to_retry: true };
  }
  return { code: "OUTCOME_UNKNOWN", safe_to_retry: false };
}
