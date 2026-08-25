export {};

import {
  getMcpSurfaceToolNames,
  registerMcpProfile,
} from "@/server/tools";
import {
  isMcpAuthoringPhase,
  type McpAuthoringPhase,
} from "@/lib/authoringPhase";
import type { McpRegistrationProfile } from "@/lib/registrationProfile";

const DEFAULT_MCP_URL = "http://127.0.0.1:3000/bb-mcp";
// Match the current Codex legacy Streamable HTTP initialization revision.
const PROTOCOL_VERSION = "2025-06-18";

const FORBIDDEN_DEFAULT_TOOLS = ["risky_eval", "from_geo_json"] as const;

type CheckResult = {
  name: string;
  ok: boolean;
  detail: string;
};

type JsonObject = Record<string, unknown>;

type HealthProduct = {
  profile?: unknown;
  authoring_phase?: unknown;
};

const targetUrl = (process.argv[2] || process.env.BLOCKIT_MCP_URL || DEFAULT_MCP_URL)
  .replace(/\/+$/, "");
const healthUrl = `${targetUrl}/health`;
const checks: CheckResult[] = [];

function record(name: string, ok: boolean, detail: string): void {
  checks.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name} — ${detail}`);
}

async function readJson(response: Response): Promise<JsonObject> {
  const text = await response.text();
  if (!text) return {};
  return JSON.parse(text) as JsonObject;
}

function isRegistrationProfile(value: unknown): value is McpRegistrationProfile {
  return value === "bedrock_entity" || value === "extended";
}

function mcpHeaders(includeProtocolVersion = false): Headers {
  const headers = new Headers({
    accept: "application/json, text/event-stream",
    "content-type": "application/json",
  });
  if (includeProtocolVersion) {
    headers.set("mcp-protocol-version", PROTOCOL_VERSION);
  }
  return headers;
}

async function postMcp(
  body: unknown,
  options: { includeProtocolVersion?: boolean; origin?: string } = {}
): Promise<Response> {
  const headers = mcpHeaders(options.includeProtocolVersion === true);
  if (options.origin) headers.set("origin", options.origin);

  return fetch(targetUrl, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
}

async function verify(): Promise<void> {
  console.log(`BlockIT stateless phase-aware smoke check: ${targetUrl}`);
  console.log(`Codex-compatible protocol fixture: ${PROTOCOL_VERSION}`);
  console.log("This is a transport/surface smoke harness, not a substitute for Blockbench/Codex visual acceptance.\n");

  const healthResponse = await fetch(healthUrl);
  const health = await readJson(healthResponse);
  const transport = health.transport as
    | { mode?: unknown; response_mode?: unknown }
    | undefined;
  record(
    "health reports stateless JSON transport",
    healthResponse.status === 200 &&
      transport?.mode === "stateless" &&
      transport?.response_mode === "json",
    `HTTP ${healthResponse.status}; ${JSON.stringify(transport ?? {})}`
  );

  const product = health.product as HealthProduct | undefined;
  const profile = product?.profile;
  const phase = product?.authoring_phase;
  const identityValid =
    isRegistrationProfile(profile) && isMcpAuthoringPhase(phase);
  record(
    "health reports active profile and authoring phase",
    identityValid,
    `profile=${String(profile)}; phase=${String(phase)}`
  );
  if (!identityValid) {
    throw new Error(
      "Installed BlockIT health identity is missing a valid profile/authoring_phase. Rebuild and reload the current Local plugin before continuing."
    );
  }

  // Mirror the installed profile in the local source catalog before deriving the
  // exact expected phase surface. This keeps the smoke check source-driven.
  registerMcpProfile(profile);
  const activePhase: McpAuthoringPhase = phase;
  const expectedToolNames = getMcpSurfaceToolNames(profile, activePhase).sort();

  const getResponse = await fetch(targetUrl, {
    method: "GET",
    headers: { accept: "text/event-stream" },
  });
  record(
    "standalone GET/SSE is not offered",
    getResponse.status === 405,
    `HTTP ${getResponse.status}`
  );

  const deleteResponse = await fetch(targetUrl, { method: "DELETE" });
  record(
    "session DELETE is not offered",
    deleteResponse.status === 405,
    `HTTP ${deleteResponse.status}`
  );

  const invalidOriginResponse = await postMcp(
    {
      jsonrpc: "2.0",
      id: 900,
      method: "initialize",
      params: {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: {},
        clientInfo: { name: "blockit-local-smoke", version: "1.0.0" },
      },
    },
    { origin: "https://example.invalid" }
  );
  record(
    "invalid present Origin is rejected before MCP dispatch",
    invalidOriginResponse.status === 403,
    `HTTP ${invalidOriginResponse.status}`
  );

  const initializeResponse = await postMcp({
    jsonrpc: "2.0",
    id: 1,
    method: "initialize",
    params: {
      protocolVersion: PROTOCOL_VERSION,
      capabilities: {},
      clientInfo: { name: "blockit-local-smoke", version: "1.0.0" },
    },
  });
  const initialize = await readJson(initializeResponse);
  const initializeResult = initialize.result as
    | { protocolVersion?: unknown; instructions?: unknown }
    | undefined;
  const instructions =
    typeof initializeResult?.instructions === "string"
      ? initializeResult.instructions
      : "";
  record(
    "initialize succeeds without a protocol session",
    initializeResponse.status === 200 &&
      initializeResponse.headers.get("mcp-session-id") === null &&
      initializeResult?.protocolVersion === PROTOCOL_VERSION,
    `HTTP ${initializeResponse.status}; protocol=${String(
      initializeResult?.protocolVersion
    )}; session=${String(initializeResponse.headers.get("mcp-session-id"))}`
  );
  record(
    "initialize names the same active authoring phase",
    instructions.includes(`ACTIVE PHASE: ${activePhase.toUpperCase()}`),
    `phase=${activePhase}; instructions=${instructions.length} chars`
  );

  const initializedResponse = await postMcp(
    {
      jsonrpc: "2.0",
      method: "notifications/initialized",
      params: {},
    },
    { includeProtocolVersion: true }
  );
  record(
    "initialized notification is accepted as an independent POST",
    initializedResponse.status === 202 &&
      initializedResponse.headers.get("mcp-session-id") === null,
    `HTTP ${initializedResponse.status}; session=${String(
      initializedResponse.headers.get("mcp-session-id")
    )}`
  );

  const listTools = async (id: number): Promise<{
    response: Response;
    names: string[];
  }> => {
    const response = await postMcp(
      {
        jsonrpc: "2.0",
        id,
        method: "tools/list",
        params: {},
      },
      { includeProtocolVersion: true }
    );
    const body = await readJson(response);
    const result = body.result as
      | { tools?: Array<{ name?: unknown }> }
      | undefined;
    const names = (result?.tools ?? [])
      .map((tool) => tool.name)
      .filter((name): name is string => typeof name === "string")
      .sort();
    return { response, names };
  };

  const firstList = await listTools(2);
  const missingExpected = expectedToolNames.filter(
    (tool) => !firstList.names.includes(tool)
  );
  const unexpected = firstList.names.filter(
    (tool) => !expectedToolNames.includes(tool)
  );
  const exposedForbidden = FORBIDDEN_DEFAULT_TOOLS.filter((tool) =>
    firstList.names.includes(tool)
  );
  record(
    "tools/list exactly matches the source-owned active phase surface",
    firstList.response.status === 200 &&
      firstList.response.headers.get("mcp-session-id") === null &&
      missingExpected.length === 0 &&
      unexpected.length === 0 &&
      exposedForbidden.length === 0,
    `HTTP ${firstList.response.status}; profile=${profile}; phase=${activePhase}; tools=${firstList.names.length}; expected=${expectedToolNames.length}; missing=${
      missingExpected.join(",") || "none"
    }; unexpected=${unexpected.join(",") || "none"}; forbidden=${
      exposedForbidden.join(",") || "none"
    }`
  );

  const secondList = await listTools(3);
  record(
    "repeated tools/list remains session-independent",
    secondList.response.status === 200 &&
      secondList.response.headers.get("mcp-session-id") === null &&
      JSON.stringify(secondList.names) === JSON.stringify(firstList.names),
    `HTTP ${secondList.response.status}; first=${firstList.names.length}; second=${secondList.names.length}; session=${String(
      secondList.response.headers.get("mcp-session-id")
    )}`
  );

  const failed = checks.filter((check) => !check.ok);
  console.log(`\nResult: ${checks.length - failed.length}/${checks.length} checks passed.`);
  console.log(
    "Still requires manual/local acceptance: exact installed artifact freshness, real Codex connection, representative Blockbench mutation/Undo, phase handoffs, plugin unload/reload, and visual/model quality."
  );

  if (failed.length > 0) {
    process.exitCode = 1;
  }
}

try {
  await verify();
} catch (error) {
  console.error("FAIL  smoke harness could not complete:", error);
  console.error(
    "Confirm the current Local plugin build is loaded in Blockbench and the configured MCP URL is reachable."
  );
  process.exitCode = 1;
}
