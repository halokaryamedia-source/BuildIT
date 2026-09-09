export { createServer } from "./server";
export * as tools from "./tools";
// Import resources for side effects (stores resource definitions via createResource).
import "./resources";
import "./resources/texture-authoring-knowledge";
export { resources } from "@/lib/factories";
export { default as prompts } from "./prompts";
