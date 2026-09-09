import { describe, expect, test } from "bun:test";
import {
  BlockitRuntimeBackend,
  GatewayBackendError,
} from "@/gateway/backend";
import {
  BLOCKIT_AUTHORING_PHASE_AFFINITY_HEADER,
  BLOCKIT_AUTHORING_PHASES,
  BLOCKIT_PROJECT_AFFINITY_HEADER,
} from "@/gateway/projectAffinity";
import { MCP_AUTHORING_PHASES } from "@/lib/authoringPhase";

const RUNTIME_URL = "http://127.0.0.1:3000/bb-mcp";

function health(
  active: string | null,
  requested: string | null,
  available: boolean | null,
  openProjectCount: number = active ? 1 : 0,
  authoringPhase: "geometry" | "texturing" | "animation" = "geometry"
) {
  return {
    product: { authoring_phase: authoringPhase },
    project_context: {
      active_project_uuid: active,
      requested_project_uuid: requested,
      requested_project_available: available,
      open_project_count: openProjectCount,
    },
  };
}

describe("Gateway project affinity", () => {
  test("transport phase vocabulary stays aligned with Runtime authoring phases", () => {
    expect(BLOCKIT_AUTHORING_PHASES).toEqual(MCP_AUTHORING_PHASES);
  });

  test("affinity adds only passive Runtime headers after binding", () => {
    const backend = new BlockitRuntimeBackend(RUNTIME_URL);
    const initial = (backend as any).runtimeRequestHeaders() as Headers;
    expect(initial.has(BLOCKIT_PROJECT_AFFINITY_HEADER)).toBe(false);
    expect(initial.has(BLOCKIT_AUTHORING_PHASE_AFFINITY_HEADER)).toBe(false);

    (backend as any).projectUuid = "project-a";
    (backend as any).authoringPhase = "animation";
    const bound = (backend as any).runtimeRequestHeaders() as Headers;
    expect(bound.get(BLOCKIT_PROJECT_AFFINITY_HEADER)).toBe("project-a");
    expect(bound.get(BLOCKIT_AUTHORING_PHASE_AFFINITY_HEADER)).toBe("animation");
  });

  test("first invocation can bind automatically when exactly one project is open", () => {
    const backend = new BlockitRuntimeBackend(RUNTIME_URL);

    expect(
      (backend as any).syncProjectAffinityFromHealth(
        health("project-a", null, null, 1),
        true
      )
    ).toBe(true);
    expect((backend as any).projectUuid).toBe("project-a");
  });

  test("unbound multi-tab authoring fails closed instead of adopting the visible tab", () => {
    const backend = new BlockitRuntimeBackend(RUNTIME_URL);

    let error: unknown;
    try {
      (backend as any).syncProjectAffinityFromHealth(
        health("project-b", null, null, 2),
        true
      );
    } catch (caught) {
      error = caught;
    }

    expect(error).toBeInstanceOf(GatewayBackendError);
    expect((error as GatewayBackendError).code).toBe("PROJECT_CONTEXT_LOST");
    expect((error as GatewayBackendError).details.open_project_count).toBe(2);
    expect((error as GatewayBackendError).details.action).toContain(
      "adopt_active_project=true"
    );
    expect((backend as any).projectUuid).toBeNull();
  });

  test("closed or mismatched bound project fails closed before tool execution", () => {
    const backend = new BlockitRuntimeBackend(RUNTIME_URL);
    (backend as any).projectUuid = "project-a";

    let error: unknown;
    try {
      (backend as any).syncProjectAffinityFromHealth(
        health("project-b", "project-a", false, 2),
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
        health("project-b", "project-a", true, 2),
        true
      )
    ).toBe(false);
    expect((backend as any).projectUuid).toBe("project-a");
  });

  test("authoring phase affinity is learned once and then must be honored", () => {
    const backend = new BlockitRuntimeBackend(RUNTIME_URL);

    expect(
      (backend as any).syncAuthoringPhaseFromHealth(
        health("project-a", null, null, 1, "texturing")
      )
    ).toBe(true);
    expect((backend as any).authoringPhase).toBe("texturing");

    expect(
      (backend as any).syncAuthoringPhaseFromHealth(
        health("project-b", null, null, 2, "texturing")
      )
    ).toBe(false);

    let error: unknown;
    try {
      (backend as any).syncAuthoringPhaseFromHealth(
        health("project-b", null, null, 2, "animation")
      );
    } catch (caught) {
      error = caught;
    }
    expect(error).toBeInstanceOf(GatewayBackendError);
    expect((error as GatewayBackendError).code).toBe("BACKEND_UNAVAILABLE");
  });

  test("explicit project creation can recover from a closed prior affinity without rebinding to an unrelated tab", () => {
    const backend = new BlockitRuntimeBackend(RUNTIME_URL);
    (backend as any).projectUuid = "project-a";

    expect(
      (backend as any).syncProjectAffinityFromHealth(
        health("project-b", "project-a", false, 2),
        false,
        true
      )
    ).toBe(true);
    expect((backend as any).projectUuid).toBeNull();
  });
});
