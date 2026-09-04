import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import {
  DEFAULT_RUNTIME_URL,
  GATEWAY_VERSION,
  classifyInterruptedCall,
  createRuntimeSignature,
  normalizeRuntimeUrl,
  searchCapabilityCatalog,
  type BackendTool,
  type CapabilitySummary,
  type JsonRecord,
} from "./contract";

export type GatewayBackendErrorCode =
  | "BACKEND_UNAVAILABLE"
  | "CAPABILITY_NOT_FOUND"
  | "BACKEND_CALL_INTERRUPTED"
  | "OUTCOME_UNKNOWN";

export class GatewayBackendError extends Error {
  constructor(
    readonly code: GatewayBackendErrorCode,
    message: string,
    readonly safeToRetry: boolean = false,
    readonly details: JsonRecord = {}
  ) {
    super(message);
    this.name = "GatewayBackendError";
  }
}

type HealthProbe =
  | { online: true; health: JsonRecord; signature: string }
  | { online: false; error: string };

export type GatewayRuntimeStatus = {
  gateway: "ready";
  runtime: {
    online: boolean;
    endpoint: string;
    mcp_client_ready: boolean;
    catalog_stale: boolean;
    runtime_signature: string | null;
    connected_signature: string | null;
    catalog_count: number;
    health: JsonRecord | null;
  };
  last_error: string | null;
};

export type GatewayRuntimeCallResult = JsonRecord & {
  content: unknown[];
  structuredContent?: unknown;
  isError?: boolean;
};

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function isRecord(value: unknown): value is JsonRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeRuntimeCallResult(result: unknown): GatewayRuntimeCallResult {
  if (isRecord(result) && Array.isArray(result.content)) {
    return result as GatewayRuntimeCallResult;
  }

  return {
    content: [
      {
        type: "text",
        text: "BlockIT runtime returned a non-standard deferred tool result.",
      },
    ],
    structuredContent: { runtime_result: result },
  };
}

function normalizeGatewayManagedResult(
  capability: string,
  result: GatewayRuntimeCallResult
): GatewayRuntimeCallResult {
  if (capability !== "switch_authoring_phase" || result.isError === true) {
    return result;
  }

  return {
    ...result,
    content: [
      {
        type: "text",
        text: "BlockIT authoring phase switched. Continue the same task; the Gateway invalidated its Runtime catalog and will refresh automatically on the next capability request.",
      },
    ],
    structuredContent: {
      ...(isRecord(result.structuredContent) ? result.structuredContent : {}),
      gateway_catalog_invalidated: true,
      client_reconnect_required: false,
      new_chat_required: false,
      action: "continue same task through Gateway; Runtime catalog refreshes automatically",
    },
  };
}

export class BlockitRuntimeBackend {
  readonly runtimeUrl: string;
  private readonly healthTimeoutMs: number;
  private client: Client | null = null;
  private connectedSignature: string | null = null;
  private catalog = new Map<string, BackendTool>();
  private operationTail: Promise<void> = Promise.resolve();
  private lastError: string | null = null;

  constructor(
    runtimeUrl: string = process.env.BLOCKIT_RUNTIME_URL ?? DEFAULT_RUNTIME_URL,
    healthTimeoutMs: number = Number(process.env.BLOCKIT_RUNTIME_TIMEOUT_MS ?? 1500)
  ) {
    this.runtimeUrl = normalizeRuntimeUrl(runtimeUrl);
    this.healthTimeoutMs =
      Number.isFinite(healthTimeoutMs) && healthTimeoutMs >= 100
        ? Math.trunc(healthTimeoutMs)
        : 1500;
  }

  private runExclusive<T>(operation: () => Promise<T>): Promise<T> {
    const run = this.operationTail.then(operation, operation);
    this.operationTail = run.then(
      () => undefined,
      () => undefined
    );
    return run;
  }

  private async probeHealth(): Promise<HealthProbe> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.healthTimeoutMs);

    try {
      const response = await fetch(`${this.runtimeUrl}/health`, {
        method: "GET",
        signal: controller.signal,
      });
      if (response.status !== 200) {
        return {
          online: false,
          error: `Runtime health returned HTTP ${response.status}.`,
        };
      }

      const body: unknown = await response.json();
      if (!isRecord(body)) {
        return { online: false, error: "Runtime health returned non-object JSON." };
      }

      return {
        online: true,
        health: body,
        signature: createRuntimeSignature(body),
      };
    } catch (error) {
      return { online: false, error: errorMessage(error) };
    } finally {
      clearTimeout(timer);
    }
  }

  private async closeConnectionUnsafe(): Promise<void> {
    const client = this.client;
    this.client = null;
    this.connectedSignature = null;
    this.catalog.clear();

    if (client) {
      try {
        await client.close();
      } catch {
        // A dead backend is already disconnected; cleanup remains best-effort.
      }
    }
  }

  private async listAllTools(client: Client): Promise<BackendTool[]> {
    const tools: BackendTool[] = [];
    let cursor: string | undefined;
    let pages = 0;

    do {
      const listed = await client.listTools(cursor ? { cursor } : undefined);
      tools.push(...(listed.tools as BackendTool[]));
      cursor = typeof listed.nextCursor === "string" ? listed.nextCursor : undefined;
      pages += 1;
      if (pages > 100) {
        throw new Error("Runtime tools/list exceeded the 100-page safety bound.");
      }
    } while (cursor);

    return tools;
  }

  private async connectFreshUnsafe(signature: string): Promise<void> {
    await this.closeConnectionUnsafe();

    const client = new Client(
      { name: "blockit-gateway-runtime-client", version: GATEWAY_VERSION },
      { capabilities: {} }
    );
    const transport = new StreamableHTTPClientTransport(new URL(this.runtimeUrl));

    try {
      await client.connect(transport);
      const tools = await this.listAllTools(client);
      this.client = client;
      this.connectedSignature = signature;
      this.catalog = new Map(tools.map((tool) => [tool.name, tool]));
      this.lastError = null;
    } catch (error) {
      try {
        await client.close();
      } catch {
        // Preserve the original connection error.
      }
      const message = errorMessage(error);
      this.lastError = message;
      throw new GatewayBackendError(
        "BACKEND_UNAVAILABLE",
        `BlockIT runtime MCP connection failed: ${message}`,
        true
      );
    }
  }

  private async ensureCatalogUnsafe(): Promise<void> {
    const probe = await this.probeHealth();
    if (!probe.online) {
      await this.closeConnectionUnsafe();
      this.lastError = probe.error;
      throw new GatewayBackendError(
        "BACKEND_UNAVAILABLE",
        `BlockIT runtime is unavailable: ${probe.error}`,
        true
      );
    }

    if (
      this.client &&
      this.connectedSignature === probe.signature &&
      this.catalog.size > 0
    ) {
      return;
    }

    await this.connectFreshUnsafe(probe.signature);
  }

  async getStatus(): Promise<GatewayRuntimeStatus> {
    const probe = await this.probeHealth();
    if (!probe.online) {
      return {
        gateway: "ready",
        runtime: {
          online: false,
          endpoint: this.runtimeUrl,
          mcp_client_ready: false,
          catalog_stale: this.catalog.size > 0,
          runtime_signature: null,
          connected_signature: this.connectedSignature,
          catalog_count: this.catalog.size,
          health: null,
        },
        last_error: probe.error,
      };
    }

    const ready =
      Boolean(this.client) && this.connectedSignature === probe.signature;
    return {
      gateway: "ready",
      runtime: {
        online: true,
        endpoint: this.runtimeUrl,
        mcp_client_ready: ready,
        catalog_stale:
          this.connectedSignature !== null && this.connectedSignature !== probe.signature,
        runtime_signature: probe.signature,
        connected_signature: this.connectedSignature,
        catalog_count: this.catalog.size,
        health: probe.health,
      },
      last_error: this.lastError,
    };
  }

  async searchCapabilities(
    query: string,
    limit: number = 12
  ): Promise<CapabilitySummary[]> {
    return this.runExclusive(async () => {
      await this.ensureCatalogUnsafe();
      return searchCapabilityCatalog([...this.catalog.values()], query, limit);
    });
  }

  async describeCapability(capability: string): Promise<BackendTool> {
    return this.runExclusive(async () => {
      await this.ensureCatalogUnsafe();
      const tool = this.catalog.get(capability);
      if (!tool) {
        throw new GatewayBackendError(
          "CAPABILITY_NOT_FOUND",
          `Runtime capability "${capability}" is not exposed by the current BlockIT surface.`,
          true,
          { capability }
        );
      }
      return tool;
    });
  }

  async invokeCapability(
    capability: string,
    args: JsonRecord = {}
  ): Promise<GatewayRuntimeCallResult> {
    return this.runExclusive(async () => {
      await this.ensureCatalogUnsafe();
      const tool = this.catalog.get(capability);
      if (!tool) {
        throw new GatewayBackendError(
          "CAPABILITY_NOT_FOUND",
          `Runtime capability "${capability}" is not exposed by the current BlockIT surface.`,
          true,
          { capability }
        );
      }

      try {
        const result: unknown = await this.client!.callTool({
          name: capability,
          arguments: args,
        });
        const normalized = normalizeRuntimeCallResult(result);
        if (capability === "switch_authoring_phase" && normalized.isError !== true) {
          await this.closeConnectionUnsafe();
        }
        return normalizeGatewayManagedResult(capability, normalized);
      } catch (error) {
        const classification = classifyInterruptedCall(tool);
        const message = errorMessage(error);
        await this.closeConnectionUnsafe();
        this.lastError = message;
        throw new GatewayBackendError(
          classification.code,
          classification.code === "OUTCOME_UNKNOWN"
            ? `BlockIT runtime connection was interrupted while invoking "${capability}". The mutation may already have executed; inspect current model state before retrying.`
            : `BlockIT runtime connection was interrupted while invoking read-only capability "${capability}".`,
          classification.safe_to_retry,
          { capability, cause: message }
        );
      }
    });
  }

  async close(): Promise<void> {
    await this.runExclusive(() => this.closeConnectionUnsafe());
  }
}
