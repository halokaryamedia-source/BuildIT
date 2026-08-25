/// <reference types="three" />
/// <reference types="blockbench-types" />
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { PRODUCT_NAME, PRODUCT_VERSION } from "@/lib/productIdentity";
import {
  DEFAULT_MCP_AUTHORING_PHASE,
  buildMcpPhaseRuntimeContract,
  getActiveMcpAuthoringPhase,
  type McpAuthoringPhase,
} from "@/lib/authoringPhase";

/**
 * Phase-aware server instructions are part of the agent contract: Codex must
 * know why foreign-phase tools are absent before it attempts discovery.
 */
export function buildMcpServerInstructions(
  phase: McpAuthoringPhase
): string {
  return `BlockIT Bedrock Entity authoring. ${buildMcpPhaseRuntimeContract(
    phase
  )} CORE: lifecycle/read/selection/history/capture/export.`;
}

export const MCP_SERVER_INSTRUCTIONS = buildMcpServerInstructions(
  DEFAULT_MCP_AUTHORING_PHASE
);

/** Create one request-owned MCP server instance. */
export function createServer(
  phase: McpAuthoringPhase = getActiveMcpAuthoringPhase()
): McpServer {
  return new McpServer(
    {
      name: PRODUCT_NAME,
      version: PRODUCT_VERSION,
    },
    {
      instructions: buildMcpServerInstructions(phase),
    }
  );
}
