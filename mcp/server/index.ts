export { createServer } from "./server";
export * as tools from "./tools";
// Import resources.ts for side effects (stores resource definitions via createResource).
import "./resources";
export { resources } from "@/lib/factories";
export { default as prompts } from "./prompts";
