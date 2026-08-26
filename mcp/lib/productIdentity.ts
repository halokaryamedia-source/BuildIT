import { VERSION } from "@/lib/constants";
import type { McpRegistrationProfile } from "@/lib/registrationProfile";
import {
  getActiveMcpAuthoringPhase,
  type McpAuthoringPhase,
} from "@/lib/authoringPhase";

export const PRODUCT_ID = "blockit-bedrock-entity-mcp";
export const PRODUCT_NAME = "BlockIT — Bedrock Entity MCP";
export const PRODUCT_DESCRIPTION =
  "AI-assisted Minecraft Bedrock Entity modelling tools for Blockbench.";
export const PRODUCT_ABOUT =
  "BlockIT provides focused MCP tools for Minecraft Bedrock Entity geometry, texturing, and animation inside desktop Blockbench. Only the active authoring phase is exposed at a time.\n\nUse canonical model views and human review for reference-based modelling; tool success alone does not prove visual fidelity.";
export const PRODUCT_REPOSITORY =
  "https://github.com/halokaryamedia-source/BuildIT";
export const PRODUCT_BUG_TRACKER = `${PRODUCT_REPOSITORY}/issues`;
export const PRODUCT_VERSION = VERSION;

export function createProductIdentity(
  profile: McpRegistrationProfile,
  authoringPhase: McpAuthoringPhase = getActiveMcpAuthoringPhase()
) {
  return {
    id: PRODUCT_ID,
    name: PRODUCT_NAME,
    version: PRODUCT_VERSION,
    profile,
    authoring_phase: authoringPhase,
    repository: PRODUCT_REPOSITORY,
  } as const;
}
