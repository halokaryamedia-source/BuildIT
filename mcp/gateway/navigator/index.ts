export { buildNavigatorSnapshot } from "./snapshot";
export { buildNavigatorPacket } from "./packet";
export { readWorkspaceProjection } from "./workspace";
export { decorateCapabilities } from "./capabilities";
export { buildNavigatorDelta } from "./delta";
export { contextIds, contextSetChanged } from "./contextCache";
export {
  contextForOwner,
  ownerForCapability,
  sourceOwnerForCapability,
  NAVIGATOR_CONTEXT_HANDLES,
} from "./registry";
export type { NavigatorPacket, NavigatorContextDelivery } from "./packet";
export type { NavigatorWorkspaceProjection } from "./workspace";
export type {
  NavigatorCapabilitySummary,
  NavigatorContextHandle,
  NavigatorDelta,
  NavigatorOwner,
  NavigatorSnapshot,
  NavigatorSourceOwner,
} from "./types";
