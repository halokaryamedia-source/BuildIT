import "@/server/tools";
import { createServer as createTcpServer, type AddressInfo } from "node:net";
import createNetServer from "@/server/net";

const HOST = "127.0.0.1";
const ENDPOINT = "/bb-mcp";
const PROTOCOL_VERSION = "2025-06-18";

// These are regression ceilings with small headroom, not token-usage targets;
// max per-tool payload stays intentionally unchanged so a new capability cannot
// justify a bloated schema by itself.
// 2026-08-24: add_group gained the user-mandated coherent `groups` batch;
// ceilings were raised by its measured delta.
// 2026-09-02: Live phase orchestration adds one Core control tool. Catalog
// count and aggregate input-schema ceiling move by the measured capability delta.
const SURFACE_BUDGET = {
  tool_count: 66,
  initialize_instructions_chars: 700,
  tools_list_response_chars: 82_000,
  input_schema_chars: 58_700,
  description_chars: 11_500,
  max_tool_payload_chars: 3_200,
} as const;

type ListedTool = {
  name?: string;
  description?: string;
  inputSchema?: unknown;
  [key: string]: unknown;
};

type JsonRpcBody = {
  result?: {
    protocolVersion?: string;
    instructions?: string;
    tools?: ListedTool[];
  };
  error?: {
    message?: string;
  };
};

type BranchSchemaSummary = {
  required: string[];
  properties: string[];
  name_description: string | null;
  id_description: string | null;
};

type SurfaceMetrics = {
  protocol_version: string;
  initialize_instructions_chars: number;
  tool_count: number;
  tools_list_response_chars: number;
  tools_array_chars: number;
  input_schema_chars: number;
  description_chars: number;
  per_tool_payload_chars: {
    p50: number;
    p90: number;
    p95: number;
    max: number;
  };
  branch_schema_audit: Record<string, BranchSchemaSummary>;
  largest_tools: Array<{
    name: string;
    payload_chars: number;
    input_schema_chars: number;
    description_chars: number;
  }>;
};

function percentile(values: number[], fraction: number): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.max(0, Math.ceil(fraction * sorted.length) - 1);
  return sorted[index] ?? 0;
}

function summarizeBranchSchema(
  tools: ListedTool[],
  toolName: string
): BranchSchemaSummary {
  const tool = tools.find((candidate) => candidate.name === toolName);
  if (!tool) {
    throw new Error(`Expected ${toolName} on the default MCP surface.`);
  }

  const schema = (tool.inputSchema ?? {}) as {
    required?: string[];
    properties?: Record<string, { description?: string }>;
  };
  const properties = schema.properties ?? {};

  return {
    required: [...(schema.required ?? [])].sort(),
    properties: Object.keys(properties).sort(),
    name_description: properties.name?.description ?? null,
    id_description: properties.id?.description ?? null,
  };
}

function assertAdvertisedBranchGuidance(
  audit: Record<string, BranchSchemaSummary>
): void {
  for (const [toolName, summary] of Object.entries(audit)) {
    if (!summary.required.includes("action")) {
      throw new Error(`${toolName} tools/list schema must require action.`);
    }
    if (!summary.name_description?.includes("Required when action=create")) {
      throw new Error(
        `${toolName} tools/list schema lost create-branch guidance on name.`
      );
    }
    if (!summary.id_description?.includes("Required when action=update")) {
      throw new Error(
        `${toolName} tools/list schema lost update-branch guidance on id.`
      );
    }
  }
}

function assertWithinSurfaceBudget(metrics: SurfaceMetrics): void {
  const failures: string[] = [];

  if (metrics.tool_count !== SURFACE_BUDGET.tool_count) {
    failures.push(
      `tool_count=${metrics.tool_count} expected exactly ${SURFACE_BUDGET.tool_count}`
    );
  }
  if (
    metrics.initialize_instructions_chars >
    SURFACE_BUDGET.initialize_instructions_chars
  ) {
    failures.push(
      `initialize_instructions_chars=${metrics.initialize_instructions_chars} exceeds ${SURFACE_BUDGET.initialize_instructions_chars}`
    );
  }
  if (
    metrics.tools_list_response_chars >
    SURFACE_BUDGET.tools_list_response_chars
  ) {
    failures.push(
      `tools_list_response_chars=${metrics.tools_list_response_chars} exceeds ${SURFACE_BUDGET.tools_list_response_chars}`
    );
  }
  if (metrics.input_schema_chars > SURFACE_BUDGET.input_schema_chars) {
    failures.push(
      `input_schema_chars=${metrics.input_schema_chars} exceeds ${SURFACE_BUDGET.input_schema_chars}`
    );
  }
  if (metrics.description_chars > SURFACE_BUDGET.description_chars) {
    failures.push(
      `description_chars=${metrics.description_chars} exceeds ${SURFACE_BUDGET.description_chars}`
    );
  }
  if (
    metrics.per_tool_payload_chars.max >
    SURFACE_BUDGET.max_tool_payload_chars
  ) {
    failures.push(
      `max_tool_payload_chars=${metrics.per_tool_payload_chars.max} exceeds ${SURFACE_BUDGET.max_tool_payload_chars}`
    );
  }

  if (failures.length > 0) {
    throw new Error(`Default MCP surface regression:\n- ${failures.join("\n- ")}`);
  }
}

async function postMcp(
  baseUrl: string,
  body: unknown,
  protocolVersion = false
): Promise<{ response: Response; text: string; json: JsonRpcBody }> {
  const headers = new Headers({
    accept: "application/json, text/event-stream",
    "content-type": "application/json",
    connection: "close",
  });
  if (protocolVersion) {
    headers.set("mcp-protocol-version", PROTOCOL_VERSION);
  }

  const response = await fetch(`${baseUrl}${ENDPOINT}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  const text = await response.text();
  const json = JSON.parse(text) as JsonRpcBody;
  return { response, text, json };
}

async function main(): Promise<void> {
  const server = createNetServer(
    {
      createServer: (callback) => createTcpServer(callback),
    },
    {
      port: 0,
      endpoint: ENDPOINT,
      host: HOST,
    }
  );

  try {
    if (!server.listening) {
      await new Promise<void>((resolve, reject) => {
        server.once("listening", resolve);
        server.once("error", reject);
      });
    }

    const address = server.address();
    if (!address || typeof address === "string") {
      throw new Error("Expected an IPv4 TCP listener for MCP surface measurement.");
    }
    const tcpAddress = address as AddressInfo;
    const baseUrl = `http://${HOST}:${tcpAddress.port}`;

    const initialized = await postMcp(baseUrl, {
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: {},
        clientInfo: { name: "blockit-surface-measurement", version: "1.0.0" },
      },
    });
    if (initialized.response.status !== 200) {
      throw new Error(
        `MCP initialize failed (${initialized.response.status}): ${initialized.text}`
      );
    }
    if (initialized.json.result?.protocolVersion !== PROTOCOL_VERSION) {
      throw new Error(
        `Unexpected MCP protocol version: ${initialized.json.result?.protocolVersion ?? "missing"}`
      );
    }
    const initializeInstructions = initialized.json.result?.instructions ?? "";
    if (!initializeInstructions.trim()) {
      throw new Error("MCP initialize must expose compact namespace instructions.");
    }

    const listed = await postMcp(
      baseUrl,
      {
        jsonrpc: "2.0",
        id: 2,
        method: "tools/list",
        params: {},
      },
      true
    );
    if (listed.response.status !== 200) {
      throw new Error(
        `MCP tools/list failed (${listed.response.status}): ${listed.text}`
      );
    }
    if (listed.json.error) {
      throw new Error(`MCP tools/list error: ${listed.json.error.message ?? "unknown"}`);
    }

    const tools = listed.json.result?.tools ?? [];
    const rows = tools.map((tool) => {
      const payloadChars = JSON.stringify(tool).length;
      const inputSchemaChars = JSON.stringify(tool.inputSchema ?? {}).length;
      const descriptionChars = tool.description?.length ?? 0;
      return {
        name: tool.name ?? "<unnamed>",
        payload_chars: payloadChars,
        input_schema_chars: inputSchemaChars,
        description_chars: descriptionChars,
      };
    });

    const payloadSizes = rows.map((row) => row.payload_chars);
    const branchSchemaAudit = Object.fromEntries(
      ["manage_locator", "manage_null_object"].map((toolName) => [
        toolName,
        summarizeBranchSchema(tools, toolName),
      ])
    );

    const metrics: SurfaceMetrics = {
      protocol_version: PROTOCOL_VERSION,
      initialize_instructions_chars: initializeInstructions.length,
      tool_count: tools.length,
      tools_list_response_chars: listed.text.length,
      tools_array_chars: JSON.stringify(tools).length,
      input_schema_chars: rows.reduce(
        (total, row) => total + row.input_schema_chars,
        0
      ),
      description_chars: rows.reduce(
        (total, row) => total + row.description_chars,
        0
      ),
      per_tool_payload_chars: {
        p50: percentile(payloadSizes, 0.5),
        p90: percentile(payloadSizes, 0.9),
        p95: percentile(payloadSizes, 0.95),
        max: payloadSizes.length > 0 ? Math.max(...payloadSizes) : 0,
      },
      branch_schema_audit: branchSchemaAudit,
      largest_tools: [...rows]
        .sort((a, b) => b.payload_chars - a.payload_chars || a.name.localeCompare(b.name))
        .slice(0, 10),
    };

    console.log(JSON.stringify(metrics, null, 2));
    assertAdvertisedBranchGuidance(metrics.branch_schema_audit);
    assertWithinSurfaceBudget(metrics);
  } finally {
    if (server.listening) {
      await new Promise<void>((resolve, reject) => {
        server.close((error) => {
          if (error) reject(error);
          else resolve();
        });
      });
    }
  }
}

await main();
