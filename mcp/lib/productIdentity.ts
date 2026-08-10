import { VERSION } from "@/lib/constants";
import type { McpRegistrationProfile } from "@/lib/registrationProfile";

export const PRODUCT_ID = "blockit-bedrock-entity-mcp";
export const PRODUCT_NAME = "BlockIT — Bedrock Entity MCP";
export const PRODUCT_DESCRIPTION =
  "Minecraft Bedrock Entity-focused MCP server for Blockbench.";
export const PRODUCT_REPOSITORY =
  "https://github.com/halokaryamedia-source/BuildIT";
export const PRODUCT_BUG_TRACKER = `${PRODUCT_REPOSITORY}/issues`;
export const PRODUCT_VERSION = VERSION;

export function createProductIdentity(profile: McpRegistrationProfile) {
  return {
    id: PRODUCT_ID,
    name: PRODUCT_NAME,
    version: PRODUCT_VERSION,
    profile,
    repository: PRODUCT_REPOSITORY,
  } as const;
}
