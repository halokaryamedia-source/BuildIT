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
const DEFAULT_BUNDLE_PATH = "dist/blockit_mcp.js";
const EXPECTED_PROFILE: McpRegistrationProfile = "bedrock_entity";
const DEFAULT_PHASE: McpAuthoringPhase = "geometry";
const PROTOCOL_VERSION = "2025-06-18";

const FORBIDDEN_TOOLS = ["risky_eval", "from_geo_json"] as const;
const REQUIRED_GEOMETRY_TOOLS = [
  "create_project",
  "add_group",
  "place_cube",
  "modify_cube",
  "modify_cubes_batch",
  "modify_group",
  "reparent_element",
  "capture_model_views",
  "bone_rigging",
  "export_model",
] as const;
const PLAN_FREE_GEOMETRY_TOOLS = [
  "add_group",
  "place_cube",
  "modify_cube",
  "modify_cubes_batch",
  "modify_group",
  "reparent_element",
] as const;

type JsonObject = Record<string, unknown>;
type ListedTool = { name?: unknown; inputSchema?: unknown };
type Check = { name: string; ok: boolean; detail: string };

const args = process.argv.slice(2);
const firstIsUrl = typeof args[0] === "string" && /^https?:\/\//i.test(args[0]);
const targetUrl = (
  (firstIsUrl ? args[0] : undefined) ||
  process.env.BLOCKIT_MCP_URL ||
  DEFAULT_MCP_URL
).replace(/\/+$/, "");
const phaseArg = firstIsUrl ? args[1] : args[0];
const bundlePath =
  (firstIsUrl ? args[2] : args[1]) ||
  process.env.BLOCKIT_MCP_BUNDLE ||
  DEFAULT_BUNDLE_PATH;
const checks: Check[] = [];

function record(name: string, ok: boolean, detail: string): void {
  checks.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name} — ${detail}`);
}

function expectedPhase(): McpAuthoringPhase {
  const phase = phaseArg || process.env.BLOCKIT_EXPECTED_PHASE || DEFAULT_PHASE;
  if (!isMcpAuthoringPhase(phase)) {
    throw new Error(
      `Invalid expected phase "${String(phase)}". Use geometry, texturing, or animation.`
    );
  }
  return phase;
}

async function json(response: Response): Promise<JsonObject> {
  const text = await response.text();
  return text ? (JSON.parse(text) as JsonObject) : {};
}

async function localBuildIdentity(): Promise<string> {
  const file = Bun.file(bundlePath);
  if (!(await file.exists())) {
    throw new Error(`Missing ${bundlePath}. Run bun run build first.`);
  }
  const match = (await file.text()).match(
    /globalThis\.__BLOCKIT_BUILD_ID__\s*=\s*["'](sha256:[a-f0-9]{64})["']/
  );
  if (!match?.[1]) {
    throw new Error(`${bundlePath} has no valid embedded build identity.`);
  }
  return match[1];
}

function schemaPlanIssues(tools: ListedTool[]): string[] {
  const byName = new Map(
    tools
      .filter((tool): tool is ListedTool & { name: string } =>
        typeof tool.name === "string"
      )
      .map((tool) => [tool.name, tool])
  );
  const issues: string[] = [];

  for (const name of PLAN_FREE_GEOMETRY_TOOLS) {
    const schema = (byName.get(name)?.inputSchema ?? {}) as {
      required?: unknown;
      properties?: unknown;
    };
    const required = Array.isArray(schema.required) ? schema.required : [];
    const properties =
      schema.properties && typeof schema.properties === "object"
        ? (schema.properties as Record<string, unknown>)
        : {};

    if (!byName.has(name)) issues.push(`${name}:missing`);
    if (required.includes("plan_id")) issues.push(`${name}:plan_id_required`);
    if (Object.prototype.hasOwnProperty.call(properties, "plan_id")) {
      issues.push(`${name}:plan_id_exposed`);
    }
  }
  return issues;
}

async function post(body: unknown, protocol = false): Promise<Response> {
  const headers = new Headers({
    accept: "application/json, text/event-stream",
    "content-type": "application/json",
    connection: "close",
  });
  if (protocol) headers.set("mcp-protocol-version", PROTOCOL_VERSION);

  return fetch(targetUrl, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
}

async function verify(): Promise<void> {
  const phase = expectedPhase();
  const buildIdentity = await localBuildIdentity();

  registerMcpProfile(EXPECTED_PROFILE);
  const expectedNames = getMcpSurfaceToolNames(EXPECTED_PROFILE, phase).sort();

  console.log(`BlockIT live smoke gate: ${targetUrl}`);
  console.log(
    `Expected profile=${EXPECTED_PROFILE}; phase=${phase}; tools=${expectedNames.length}`
  );
  console.log(`Expected bundle=${bundlePath}; build_identity=${buildIdentity}\n`);

  const healthResponse = await fetch(`${targetUrl}/health`, {
    headers: { connection: "close" },
  });
  const health = await json(healthResponse);
  const product = health.product as
    | { profile?: unknown; authoring_phase?: unknown }
    | undefined;
  const transport = health.transport as
    | { mode?: unknown; response_mode?: unknown }
    | undefined;

  record(
    "health transport",
    healthResponse.status === 200 &&
      transport?.mode === "stateless" &&
      transport?.response_mode === "json",
    `HTTP ${healthResponse.status}; ${JSON.stringify(transport ?? {})}`
  );
  record(
    "installed profile / phase",
    product?.profile === EXPECTED_PROFILE && product?.authoring_phase === phase,
    `live=${String(product?.profile)}/${String(product?.authoring_phase)}`
  );
  record(
    "installed artifact freshness",
    health.build_identity === buildIdentity,
    `local=${buildIdentity}; live=${String(health.build_identity)}`
  );
  record(
    "health surface count",
    health.exposed_tool_count === expectedNames.length,
    `live=${String(health.exposed_tool_count)}; expected=${expectedNames.length}`
  );

  const initializeResponse = await post({
    jsonrpc: "2.0",
    id: 1,
    method: "initialize",
    params: {
      protocolVersion: PROTOCOL_VERSION,
      capabilities: {},
      clientInfo: { name: "blockit-local-smoke", version: "1.0.0" },
    },
  });
  const initialize = await json(initializeResponse);
  const initializeResult = initialize.result as
    | { protocolVersion?: unknown; instructions?: unknown }
    | undefined;
  const instructions =
    typeof initializeResult?.instructions === "string"
      ? initializeResult.instructions
      : "";

  record(
    "initialize / phase contract",
    initializeResponse.status === 200 &&
      initializeResponse.headers.get("mcp-session-id") === null &&
      initializeResult?.protocolVersion === PROTOCOL_VERSION &&
      instructions.includes(`ACTIVE PHASE: ${phase.toUpperCase()}`),
    `HTTP ${initializeResponse.status}; protocol=${String(
      initializeResult?.protocolVersion
    )}; session=${String(initializeResponse.headers.get("mcp-session-id"))}`
  );

  const listResponse = await post(
    {
      jsonrpc: "2.0",
      id: 2,
      method: "tools/list",
      params: {},
    },
    true
  );
  const listed = await json(listResponse);
  const tools =
    ((listed.result as { tools?: ListedTool[] } | undefined)?.tools ?? []);
  const names = tools
    .map((tool) => tool.name)
    .filter((name): name is string => typeof name === "string")
    .sort();
  const missing = expectedNames.filter((name) => !names.includes(name));
  const unexpected = names.filter((name) => !expectedNames.includes(name));
  const forbidden = FORBIDDEN_TOOLS.filter((name) => names.includes(name));

  record(
    "tools/list exact source surface",
    listResponse.status === 200 &&
      listResponse.headers.get("mcp-session-id") === null &&
      missing.length === 0 &&
      unexpected.length === 0 &&
      forbidden.length === 0,
    `tools=${names.length}; missing=${missing.join(",") || "none"}; unexpected=${
      unexpected.join(",") || "none"
    }; forbidden=${forbidden.join(",") || "none"}`
  );

  if (phase === "geometry") {
    const requiredMissing = REQUIRED_GEOMETRY_TOOLS.filter(
      (name) => !names.includes(name)
    );
    record(
      "required Geometry capability",
      requiredMissing.length === 0,
      `missing=${requiredMissing.join(",") || "none"}`
    );

    const planIssues = schemaPlanIssues(tools);
    record(
      "Direct Geometry plan-free schemas",
      planIssues.length === 0,
      `issues=${planIssues.join(",") || "none"}`
    );
  }

  const failed = checks.filter((check) => !check.ok);
  console.log(`\nResult: ${checks.length - failed.length}/${checks.length} passed.`);
  console.log(
    "Still requires local proof: a fresh Codex registry, representative Blockbench mutation + Undo, required phase handoffs/reloads, and visual/model quality."
  );
  if (failed.length > 0) process.exitCode = 1;
}

try {
  await verify();
} catch (error) {
  console.error("FAIL  smoke gate could not complete:", error);
  process.exitCode = 1;
}
