import { describe, expect, test } from "bun:test";
import {
  MCP_AUTHORING_PHASES,
  classifyMcpToolPhase,
  classifyMcpToolPhaseByName,
} from "@/lib/authoringPhase";
import {
  getMcpSurfaceToolNames,
  getToolRegistrationFamily,
} from "@/server/tools";

describe("Control capability phase name coverage", () => {
  test("every exposed non-Core Bedrock capability has canonical name-only phase ownership", () => {
    for (const phase of MCP_AUTHORING_PHASES) {
      for (const toolName of getMcpSurfaceToolNames("bedrock_entity", phase)) {
        const family = getToolRegistrationFamily(toolName);
        expect(family, `${toolName} registration family`).toBeDefined();

        const runtimePhase = classifyMcpToolPhase(toolName, family!);
        if (runtimePhase === null || runtimePhase === "core") continue;

        expect(
          classifyMcpToolPhaseByName(toolName),
          `${toolName} must keep Gateway/Control name-only classification aligned with Runtime family classification`
        ).toBe(runtimePhase);
      }
    }
  });
});
