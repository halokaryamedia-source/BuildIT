export { buildNavigatorSnapshot } from "./snapshot";
export { decorateCapabilities } from "./capabilities";
export { buildNavigatorDelta } from "./delta";
export { contextForOwner, ownerForCapability, NAVIGATOR_CONTEXT_HANDLES } from "./registry";
export type {
  NavigatorCapabilitySummary,
  NavigatorContextHandle,
  NavigatorDelta,
  NavigatorOwner,
  NavigatorSnapshot,
} from "./types";
