/// <reference types="three" />
/// <reference types="blockbench-types" />

import { tools, prompts } from "@/lib/factories";
import { DEFAULT_MCP_REGISTRATION_PROFILE } from "@/lib/registrationProfile";
import {
  DEFAULT_MCP_AUTHORING_PHASE,
  setActiveMcpAuthoringPhase,
} from "@/lib/authoringPhase";
import { registerMcpProfile } from "./runtime/registration";

export {
  consolidatedAnimationTimelineToolDocs,
  consolidatedInspectionToolDocs,
  consolidatedMaterialInstancesToolDocs,
  consolidatedMaterialToolDocs,
} from "./runtime/consolidatedTools";

export {
  applyMcpRegistrationProfile,
  applyMcpToolSurface,
  describeMcpSurfaceToolNames,
  getActiveMcpRegistrationProfile,
  getMcpSurfaceToolNames,
  getToolCount,
  getToolRegistrationFamily,
  isCatalogToolEnabled,
  registerMcpProfile,
  setMcpProfileSwitchHandler,
} from "./runtime/registration";

export {
  phaseControlToolDocs,
  requestMcpPhaseSwitch,
  setMcpPhaseSwitchHandler,
} from "./runtime/phaseControl";

// Build the canonical normal Bedrock catalog once at module load. Plugin startup
// later narrows exposure to one profile + authoring phase without redefining tools.
registerMcpProfile(DEFAULT_MCP_REGISTRATION_PROFILE);

// Keep a deterministic phase value for helpers/tests before plugin startup,
// without mutating authored enabled flags until applyMcpToolSurface is called.
setActiveMcpAuthoringPhase(DEFAULT_MCP_AUTHORING_PHASE);

// Compatibility facade for existing imports. Runtime ownership lives under
// server/runtime/*; callers should not need to know that internal split.
export { tools, prompts };
