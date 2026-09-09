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
import { describeMcpSurfaceToolNames } from "@/server/tools";
import { wireAuthoringQualityIntelligence } from "@/server/tools/quality-intelligence";
import { wireTextureQualityRuntime } from "@/server/tools/texture-quality-runtime";
import { wireTextureAuthoringRuntime } from "@/server/tools/texture-authoring-runtime";
import { wireAnimationNativeIntelligence } from "@/server/tools/animation-native-intelligence";
import { wireAnimationControllerNativeIntelligence } from "@/server/tools/animation-controller-native-intelligence";
import { wireAnimationRuntimeResourceIntelligence } from "@/server/tools/animation-runtime-resource-intelligence";
import { wireAnimationSchemaBudget } from "@/server/tools/animation-schema-budget";
import {
  DEFAULT_MCP_REGISTRATION_PROFILE,
  type McpRegistrationProfile,
} from "@/lib/registrationProfile";

// Existing tools gain bounded intelligence/capability without expanding the MCP
// catalog. server/tools has already registered the default catalog and canonical
// Animation routing before this module body executes.
wireAuthoringQualityIntelligence();
wireTextureQualityRuntime();
wireTextureAuthoringRuntime();
wireAnimationNativeIntelligence();
wireAnimationControllerNativeIntelligence();
wireAnimationRuntimeResourceIntelligence();
wireAnimationSchemaBudget();

/**
 * Phase-aware server instructions are part of the agent contract: Codex must
 * know why foreign-phase tools are absent before it attempts discovery.
 */
export function buildMcpServerInstructions(
  phase: McpAuthoringPhase,
  profile: McpRegistrationProfile = DEFAULT_MCP_REGISTRATION_PROFILE
): string {
  // Keep initialize capability-oriented; detailed routed specs load only after selection.
  describeMcpSurfaceToolNames(profile, phase);
  return `BlockIT Bedrock Entity authoring. ${buildMcpPhaseRuntimeContract(
    phase
  )} Capability nouns: cube, texture/PBR, locator; Animation uses keyframe tooling. Core routes are lifecycle and read operations; selection, history, camera, and export are conditional support routes.`;
}

export const MCP_SERVER_INSTRUCTIONS = buildMcpServerInstructions(
  DEFAULT_MCP_AUTHORING_PHASE
);

/** Create one request-owned MCP server instance. */
export function createServer(
  phase: McpAuthoringPhase = getActiveMcpAuthoringPhase(),
  profile: McpRegistrationProfile = DEFAULT_MCP_REGISTRATION_PROFILE
): McpServer {
  return new McpServer(
    {
      name: PRODUCT_NAME,
      version: PRODUCT_VERSION,
    },
    {
      instructions: buildMcpServerInstructions(phase, profile),
    }
  );
}
