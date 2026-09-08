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
  | "OUTCOME_UNKNOWN"
  | "GATEWAY_BUSY";

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

class GatewayOperationTimeoutError extends Error {
  constructor(
    readonly operation: string,
    readonly timeoutMs: number
  ) {
    super(`${operation} timed out after ${timeoutMs}ms.`);
    this.name = "GatewayOperationTimeoutError";
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
  operations: {
    active: number;
    queued: number;
    max_queue_depth: number;
    completed: number;
    failed: number;
    timed_out: number;
    rejected_busy: number;
  };
  last_error: string | null;
};

export type GatewayRuntimeCallResult = JsonRecord & {
  content: unknown[];
  structuredContent?: unknown;
  isError?: boolean;
};

export type BlockitRuntimeBackendOptions = {
  connectTimeoutMs?: number;
  callTimeoutMs?: number;
  closeTimeoutMs?: number;
  maxQueueDepth?: number;
};

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function isRecord(value: unknown): value is JsonRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizePositiveInteger(
  value: number,
  fallback: number,
  minimum: number
): number {
  return Number.isFinite(value) && value >= minimum ? Math.trunc(value) : fallback;
}

function normalizeNonNegativeInteger(value: number, fallback: number): number {
  return Number.isFinite(value) && value >= 0 ? Math.trunc(value) : fallback;
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
  private readonly connectTimeoutMs: number;
  private readonly callTimeoutMs: number;
  private readonly closeTimeoutMs: number;
  private readonly maxQueueDepth: number;
  private client: Client | null = null;
  private connectedSignature: string | null = null;
  private catalog = new Map<string, BackendTool>();
  private operationTail: Promise<void> = Promise.resolve();
  private pendingOperations = 0;
  private activeOperations = 0;
  private completedOperations = 0;
  private failedOperations = 0;
  private timedOutOperations = 0;
  private rejectedBusyOperations = 0;
  private lastError: string | null = null;

  constructor(
    runtimeUrl: string = process.env.BLOCKIT_RUNTIME_URL ?? DEFAULT_RUNTIME_URL,
    healthTimeoutMs: number = Number(process.env.BLOCKIT_RUNTIME_TIMEOUT_MS ?? 1500),
    options: BlockitRuntimeBackendOptions = {}
  ) {
    this.runtimeUrl = normalizeRuntimeUrl(runtimeUrl);
    this.healthTimeoutMs = normalizePositiveInteger(healthTimeoutMs, 1500, 100);
    this.connectTimeoutMs = normalizePositiveInteger(
      options.connectTimeoutMs ??
        Number(process.env.BLOCKIT_RUNTIME_CONNECT_TIMEOUT_MS ?? 5000),
      5000,
      250
    );
    this.callTimeoutMs = normalizePositiveInteger(
      options.callTimeoutMs ??
        Number(process.env.BLOCKIT_RUNTIME_CALL_TIMEOUT_MS ?? 120000),
      120000,
      1000
    );
    this.closeTimeoutMs = normalizePositiveInteger(
      options.closeTimeoutMs ??
        Number(process.env.BLOCKIT_RUNTIME_CLOSE_TIMEOUT_MS ?? 2000),
      2000,
      100
    );
    this.maxQueueDepth = normalizeNonNegativeInteger(
      options.maxQueueDepth ??
        Number(process.env.BLOCKIT_GATEWAY_MAX_QUEUE_DEPTH ?? 8),
      8
    );
  }

  private operationStatus(): GatewayRuntimeStatus["operations"] {
    return {
      active: this.activeOperations,
      queued: Math.max(0, this.pendingOperations - this.activeOperations),
      max_queue_depth: this.maxQueueDepth,
      completed: this.completedOperations,
      failed: this.failedOperations,
      timed_out: this.timedOutOperations,
      rejected_busy: this.rejectedBusyOperations,
    };
  }

  private runExclusive<T>(operation: () => Promise<T>): Promise<T> {
    if (this.pendingOperations >= this.maxQueueDepth + 1) {
      this.rejectedBusyOperations += 1;
      return Promise.reject(
        new GatewayBackendError(
          "GATEWAY_BUSY",
          `BlockIT Gateway queue is full (${this.maxQueueDepth} waiting operations maximum). Retry after the current authoring operation completes.`,
          true,
          { max_queue_depth: this.maxQueueDepth }
        )
      );
    }

    this.pendingOperations += 1;

    const execute = async (): Promise<T> => {
      this.activeOperations = 1;
      try {
        const result = await operation();
        this.completedOperations += 1;
        return result;
      } catch (error) {
        this.failedOperations += 1;
        if (
          error instanceof GatewayOperationTimeoutError ||
          (error instanceof GatewayBackendError &&
            typeof error.details.timeout_ms === "number")
        ) {
          this.timedOutOperations += 1;
        }
        throw error;
      } finally {
        this.activeOperations = 0;
        this.pendingOperations = Math.max(0, this.pendingOperations - 1);
      }
    };

    const run = this.operationTail.then(execute, execute);
    this.operationTail = run.then(
      () => undefined,
      () => undefined
    );
    return run;
  }

  private async withDeadline<T>(
    operationName: string,
    timeoutMs: number,
    operation: () => Promise<T>
  ): Promise<T> {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(
        () => reject(new GatewayOperationTimeoutError(operationName, timeoutMs)),
        timeoutMs
      );
    });

    try {
      return await Promise.race([operation(), timeout]);
    } finally {
      if (timer !== undefined) clearTimeout(timer);
    }
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

  private async closeClientBestEffort(client: Client): Promise<void> {
    try {
      await this.withDeadline(
        "Runtime MCP close",
        this.closeTimeoutMs,
        () => client.close()
      );
    } catch {
      // Cleanup must never extend an already failed/stalled backend indefinitely.
    }
  }

  private async closeConnectionUnsafe(): Promise<void> {
    const client = this.client;
    this.client = null;
    this.connectedSignature = null;
    this.catalog.clear();

    if (client) {
      await this.closeClientBestEffort(client);
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
      await this.withDeadline(
        "Runtime MCP connect",
        this.connectTimeoutMs,
        () => client.connect(transport)
      );
      const tools = await this.withDeadline(
        "Runtime tools/list",
        this.connectTimeoutMs,
        () => this.listAllTools(client)
      );
      this.client = client;
      this.connectedSignature = signature;
      this.catalog = new Map(tools.map((tool) => [tool.name, tool]));
      this.lastError = null;
    } catch (error) {
      await this.closeClientBestEffort(client);
      const message = errorMessage(error);
      this.lastError = message;
      throw new GatewayBackendError(
        "BACKEND_UNAVAILABLE",
        `BlockIT runtime MCP connection failed: ${message}`,
        true,
        error instanceof GatewayOperationTimeoutError
          ? { timeout_ms: error.timeoutMs }
          : {}
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
        operations: this.operationStatus(),
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
      operations: this.operationStatus(),
      last_error: this.lastError,
    };
  }

  async searchCapabilities(
    query: string,
    limit: number = 4
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
        const result: unknown = await this.withDeadline(
          `Runtime capability "${capability}"`,
          this.callTimeoutMs,
          () =>
            this.client!.callTool({
              name: capability,
              arguments: args,
            })
        );
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
          {
            capability,
            cause: message,
            ...(error instanceof GatewayOperationTimeoutError
              ? { timeout_ms: error.timeoutMs }
              : {}),
          }
        );
      }
    });
  }

  async close(): Promise<void> {
    await this.runExclusive(() => this.closeConnectionUnsafe());
  }
}
