import { describe, expect, test } from "bun:test";
import {
  BlockitRuntimeBackend,
  GatewayBackendError,
} from "@/gateway/backend";
import { BLOCKIT_PROJECT_AFFINITY_HEADER } from "@/gateway/projectAffinity";

const RUNTIME_URL = "http://127.0.0.1:3000/bb-mcp";

function health(
  active: string | null,
  requested: string | null,
  available: boolean | null
) {
  return {
    project_context: {
      active_project_uuid: active,
      requested_project_uuid: requested,
      requested_project_available: available,
      open_project_count: active ? 2 : 0,
    },
  };
}

describe("Gateway project affinity", () => {
  test("affinity adds one passive Runtime header and no header before binding", () => {
    const backend = new BlockitRuntimeBackend(RUNTIME_URL);
    const initial = (backend as any).runtimeRequestHeaders() as Headers;
    expect(initial.has(BLOCKIT_PROJECT_AFFINITY_HEADER)).toBe(false);

    (backend as any).projectUuid = "project-a";
    const bound = (backend as any).runtimeRequestHeaders() as Headers;
    expect(bound.get(BLOCKIT_PROJECT_AFFINITY_HEADER)).toBe("project-a");
  });

  test("first invocation can bind to the active project without another Runtime call", () => {
    const backend = new BlockitRuntimeBackend(RUNTIME_URL);

    expect(
      (backend as any).syncProjectAffinityFromHealth(
        health("project-a", null, null),
        true
      )
    ).toBe(true);
    expect((backend as any).projectUuid).toBe("project-a");
  });

  test("closed or mismatched bound project fails closed before tool execution", () => {
    const backend = new BlockitRuntimeBackend(RUNTIME_URL);
    (backend as any).projectUuid = "project-a";

    let error: unknown;
    try {
      (backend as any).syncProjectAffinityFromHealth(
        health("project-b", "project-a", false),
        true
      );
    } catch (caught) {
      error = caught;
    }

    expect(error).toBeInstanceOf(GatewayBackendError);
    expect((error as GatewayBackendError).code).toBe("PROJECT_CONTEXT_LOST");
    expect((error as GatewayBackendError).safeToRetry).toBe(false);
  });

  test("matching bound project stays stable even when another tab is active", () => {
    const backend = new BlockitRuntimeBackend(RUNTIME_URL);
    (backend as any).projectUuid = "project-a";

    expect(
      (backend as any).syncProjectAffinityFromHealth(
        health("project-b", "project-a", true),
        true
      )
    ).toBe(false);
    expect((backend as any).projectUuid).toBe("project-a");
  });

  test("explicit project creation can recover from a closed prior affinity without rebinding to an unrelated tab", () => {
    const backend = new BlockitRuntimeBackend(RUNTIME_URL);
    (backend as any).projectUuid = "project-a";

    expect(
      (backend as any).syncProjectAffinityFromHealth(
        health("project-b", "project-a", false),
        false,
        true
      )
    ).toBe(true);
    expect((backend as any).projectUuid).toBeNull();
  });
});
