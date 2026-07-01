import { AppRuntime } from "./runtime/app-runtime.js";
import { startHttpServer } from "./server/http-server.js";

const runtime = new AppRuntime({
  ollamaUrl: process.env.OLLAMA_URL ?? "http://localhost:11434",
  ollamaModel: process.env.OLLAMA_MODEL ?? "qwen3:8b",
  blockbenchMcpUrl: process.env.BLOCKBENCH_MCP_URL ?? "http://localhost:3000/bb-mcp"
});

const port = Number(process.env.BUILDIT_ENGINE_PORT ?? 3987);

startHttpServer(runtime, port);
