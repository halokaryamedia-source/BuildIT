import { VERSION } from "@/lib/constants";
import type { McpRegistrationProfile } from "@/lib/registrationProfile";
import {
  getActiveMcpAuthoringPhase,
  type McpAuthoringPhase,
} from "@/lib/authoringPhase";

export const PRODUCT_ID = "blockit-bedrock-entity-mcp";
export const PRODUCT_NAME = "BlockIT — Bedrock Entity MCP";
export const PRODUCT_DESCRIPTION =
  "AI-assisted Minecraft Bedrock Entity authoring for Blockbench.";
export const PRODUCT_ABOUT =
  "Build Minecraft Bedrock entities with AI directly inside Blockbench.\n\nGeometry & UV · Texturing & Materials · Animation & Controllers\n\nReference-based work uses current model views and explicit visual approval.";
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
