import { describe, expect, test } from "bun:test";
import {
  BlockitRuntimeBackend,
  GatewayBackendError,
} from "@/gateway/backend";

const RUNTIME_URL = "http://127.0.0.1:3000/bb-mcp";

function createBackend(overrides: {
  connectTimeoutMs?: number;
  callTimeoutMs?: number;
  closeTimeoutMs?: number;
  maxQueueDepth?: number;
} = {}) {
  return new BlockitRuntimeBackend(RUNTIME_URL, 1500, {
    connectTimeoutMs: 1000,
    callTimeoutMs: 1000,
    closeTimeoutMs: 100,
    maxQueueDepth: 1,
    ...overrides,
  });
}

describe("Gateway long-running reliability hardening", () => {
  test("serialized backend queue is bounded and recovers after pressure clears", async () => {
    const backend = createBackend({ maxQueueDepth: 1 });
    let releaseFirst: (() => void) | undefined;

    const first = (backend as any).runExclusive(
      () =>
        new Promise<void>((resolve) => {
          releaseFirst = resolve;
        })
    );

    await Promise.resolve();
    expect(releaseFirst).toBeDefined();

    const second = (backend as any).runExclusive(async () => "second");

    let busyError: unknown;
    try {
      await (backend as any).runExclusive(async () => "third");
    } catch (error) {
      busyError = error;
    }

    expect(busyError).toBeInstanceOf(GatewayBackendError);
    expect((busyError as GatewayBackendError).code).toBe("GATEWAY_BUSY");
    expect((busyError as GatewayBackendError).safeToRetry).toBe(true);

    releaseFirst!();
    await first;
    expect(await second).toBe("second");

    const status = (backend as any).operationStatus();
    expect(status.active).toBe(0);
    expect(status.queued).toBe(0);
    expect(status.max_queue_depth).toBe(1);
    expect(status.completed).toBe(2);
    expect(status.rejected_busy).toBe(1);
  });

  test("stalled operations fail on a deadline instead of pinning the queue forever", async () => {
    const backend = createBackend();

    let timeoutError: unknown;
    try {
      await (backend as any).runExclusive(() =>
        (backend as any).withDeadline(
          "fixture operation",
          25,
          () => new Promise<never>(() => undefined)
        )
      );
    } catch (error) {
      timeoutError = error;
    }

    expect(timeoutError).toBeInstanceOf(Error);
    expect((timeoutError as Error).message).toContain("timed out after 25ms");

    const afterTimeout = await (backend as any).runExclusive(async () => "recovered");
    expect(afterTimeout).toBe("recovered");

    const status = (backend as any).operationStatus();
    expect(status.active).toBe(0);
    expect(status.queued).toBe(0);
    expect(status.failed).toBe(1);
    expect(status.timed_out).toBe(1);
    expect(status.completed).toBe(1);
  });
});
