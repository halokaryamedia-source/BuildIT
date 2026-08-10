export {};

const DEFAULT_MCP_URL = "http://127.0.0.1:3000/bb-mcp";
// Match the current Codex legacy Streamable HTTP initialization revision.
const PROTOCOL_VERSION = "2025-06-18";

const REQUIRED_CORE_TOOLS = [
  "place_cube",
  "modify_cube",
  "list_outline",
  "inspect_element",
  "create_texture",
  "create_animation",
] as const;

const FORBIDDEN_DEFAULT_TOOLS = ["risky_eval", "from_geo_json"] as const;

type CheckResult = {
  name: string;
  ok: boolean;
  detail: string;
};

type JsonObject = Record<string, unknown>;

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
  console.log(`BlockIT P1.4 stateless smoke check: ${targetUrl}`);
  console.log(`Codex-compatible protocol fixture: ${PROTOCOL_VERSION}`);
  console.log("This is a transport smoke harness, not a substitute for Blockbench/Codex local acceptance.\n");

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
    | { protocolVersion?: unknown }
    | undefined;
  record(
    "initialize succeeds without a protocol session",
    initializeResponse.status === 200 &&
      initializeResponse.headers.get("mcp-session-id") === null &&
      initializeResult?.protocolVersion === PROTOCOL_VERSION,
    `HTTP ${initializeResponse.status}; protocol=${String(
      initializeResult?.protocolVersion
    )}; session=${String(initializeResponse.headers.get("mcp-session-id"))}`
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
      .filter((name): name is string => typeof name === "string");
    return { response, names };
  };

  const firstList = await listTools(2);
  const missingCore = REQUIRED_CORE_TOOLS.filter(
    (tool) => !firstList.names.includes(tool)
  );
  const exposedForbidden = FORBIDDEN_DEFAULT_TOOLS.filter((tool) =>
    firstList.names.includes(tool)
  );
  record(
    "default tools/list preserves Bedrock core and dangerous defaults",
    firstList.response.status === 200 &&
      firstList.response.headers.get("mcp-session-id") === null &&
      missingCore.length === 0 &&
      exposedForbidden.length === 0,
    `HTTP ${firstList.response.status}; tools=${firstList.names.length}; missing_core=${
      missingCore.join(",") || "none"
    }; exposed_forbidden=${exposedForbidden.join(",") || "none"}`
  );

  const secondList = await listTools(3);
  record(
    "repeated tools/list remains session-independent",
    secondList.response.status === 200 &&
      secondList.response.headers.get("mcp-session-id") === null &&
      secondList.names.length === firstList.names.length,
    `HTTP ${secondList.response.status}; first=${firstList.names.length}; second=${secondList.names.length}; session=${String(
      secondList.response.headers.get("mcp-session-id")
    )}`
  );

  const failed = checks.filter((check) => !check.ok);
  console.log(`\nResult: ${checks.length - failed.length}/${checks.length} checks passed.`);
  console.log(
    "Still requires manual/local acceptance: OS bind address in Blockbench, real Codex connection, Blockbench read-only + bounded mutation, plugin unload/reload, and running UI truthfulness."
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
