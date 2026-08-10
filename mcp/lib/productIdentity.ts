import { VERSION } from "@/lib/constants";
import type { McpRegistrationProfile } from "@/lib/registrationProfile";

declare const __BLOCKIT_BUILD_REVISION__: string;
declare const __BLOCKIT_BUILD_CHANNEL__: string;

export const PRODUCT_ID = "blockit-bedrock-entity-mcp";
export const PRODUCT_NAME = "BlockIT — Bedrock Entity MCP";
export const PRODUCT_DESCRIPTION =
  "Minecraft Bedrock Entity-focused MCP server for Blockbench.";
export const PRODUCT_REPOSITORY =
  "https://github.com/halokaryamedia-source/BuildIT";
export const PRODUCT_BUG_TRACKER = `${PRODUCT_REPOSITORY}/issues`;
export const PRODUCT_VERSION = VERSION;

export const PRODUCT_BUILD_REVISION =
  typeof __BLOCKIT_BUILD_REVISION__ !== "undefined"
    ? __BLOCKIT_BUILD_REVISION__
    : "source";

export const PRODUCT_BUILD_CHANNEL =
  typeof __BLOCKIT_BUILD_CHANNEL__ !== "undefined"
    ? __BLOCKIT_BUILD_CHANNEL__
    : "source";

export function createProductIdentity(profile: McpRegistrationProfile) {
  return {
    id: PRODUCT_ID,
    name: PRODUCT_NAME,
    version: PRODUCT_VERSION,
    build_channel: PRODUCT_BUILD_CHANNEL,
    build_revision: PRODUCT_BUILD_REVISION,
    profile,
    repository: PRODUCT_REPOSITORY,
  } as const;
}
