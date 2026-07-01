import { createJob } from "./domain/job.js";
import { BlockbenchMcpClient } from "./mcp/blockbench-client.js";
import { OllamaProvider } from "./providers/ollama.js";
import { runCreateModelWorkflow } from "./workflows/create-model.js";

const ollama = new OllamaProvider({
  baseUrl: "http://localhost:11434",
  model: "qwen3:8b"
});

const vision = new OllamaProvider({
  baseUrl: "http://localhost:11434",
  model: "qwen3-vl:4b"
});

const blockbench = new BlockbenchMcpClient({
  endpoint: "http://localhost:3000/bb-mcp"
});

const job = createJob({
  prompt: "simple minecraft voxel crate",
  imagePaths: [],
  referenceImages: [],
  format: "bbmodel",
  autoReview: true
});

runCreateModelWorkflow(job, { ollama, vision, blockbench, outputDir: "outputs" })
  .then((result) => console.log(JSON.stringify(result, null, 2)))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
