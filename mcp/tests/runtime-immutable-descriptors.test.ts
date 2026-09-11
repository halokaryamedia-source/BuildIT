import { describe, expect, test } from "bun:test";
import {
  DEFAULT_MCP_REGISTRATION_PROFILE,
} from "@/lib/registrationProfile";
import {
  getMcpSurfaceToolNames,
} from "@/server/tools";
import {
  buildMcpServerInstructions,
} from "@/server/server";

describe("Runtime immutable descriptors", () => {
  test("reuses one frozen surface descriptor for the same profile and phase", () => {
    const first = getMcpSurfaceToolNames(
      DEFAULT_MCP_REGISTRATION_PROFILE,
      "geometry"
    );
    const second = getMcpSurfaceToolNames(
      DEFAULT_MCP_REGISTRATION_PROFILE,
      "geometry"
    );

    expect(second).toBe(first);
    expect(Object.isFrozen(first)).toBe(true);
  });

  test("reuses phase server instructions", () => {
    const first = buildMcpServerInstructions(
      "animation",
      DEFAULT_MCP_REGISTRATION_PROFILE
    );
    const second = buildMcpServerInstructions(
      "animation",
      DEFAULT_MCP_REGISTRATION_PROFILE
    );

    expect(second).toBe(first);
  });
});
