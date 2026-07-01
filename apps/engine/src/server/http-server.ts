import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import type { AppRuntime } from "../runtime/app-runtime.js";
import type { ReferenceImageUpload } from "../storage/reference-images.js";

interface CreateJobBody {
  prompt?: string;
  imagePaths?: string[];
  referenceImages?: ReferenceImageUpload[];
  format?: string;
  autoReview?: boolean;
}

async function readJsonBody<T>(request: IncomingMessage): Promise<T> {
  const chunks: Buffer[] = [];

  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  const rawBody = Buffer.concat(chunks).toString("utf8");
  return rawBody ? (JSON.parse(rawBody) as T) : ({} as T);
}

function sendJson(response: ServerResponse, statusCode: number, data: unknown): void {
  response.writeHead(statusCode, {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "access-control-allow-headers": "content-type",
    "content-type": "application/json"
  });
  response.end(JSON.stringify(data));
}

function sendNotFound(response: ServerResponse): void {
  sendJson(response, 404, { error: "Route not found." });
}

export function startHttpServer(runtime: AppRuntime, port: number): void {
  const server = createServer(async (request, response) => {
    try {
      if (request.method === "OPTIONS") {
        sendJson(response, 204, {});
        return;
      }

      const url = new URL(request.url ?? "/", "http://localhost");

      if (request.method === "GET" && url.pathname === "/api/health") {
        const blockbench = await runtime.sync.getState();
        const ollamaConnected = await runtime.ollama.health();
        const visionConnected = await runtime.vision.health();
        sendJson(response, 200, {
          status: "ok",
          ollamaConnected,
          visionConnected,
          blockbench,
          options: runtime.getOptions()
        });
        return;
      }

      if (request.method === "GET" && url.pathname === "/api/jobs") {
        sendJson(response, 200, { jobs: runtime.jobs.list() });
        return;
      }

      if (request.method === "POST" && url.pathname === "/api/jobs") {
        const body = await readJsonBody<CreateJobBody>(request);
        const prompt = body.prompt?.trim();

        if (!prompt) {
          sendJson(response, 400, { error: "Prompt is required." });
          return;
        }

        const job = await runtime.createModelJob(
          {
            prompt,
            imagePaths: body.imagePaths ?? [],
            referenceImages: [],
            format: body.format ?? "bbmodel",
            autoReview: body.autoReview ?? true
          },
          body.referenceImages ?? []
        );

        sendJson(response, 201, { job });
        return;
      }

      const jobMatch = url.pathname.match(/^\/api\/jobs\/([^/]+)$/);
      if (request.method === "GET" && jobMatch) {
        const job = runtime.jobs.get(jobMatch[1]);
        if (!job) {
          sendJson(response, 404, { error: "Job not found." });
          return;
        }

        sendJson(response, 200, { job });
        return;
      }

      sendNotFound(response);
    } catch (error) {
      sendJson(response, 500, {
        error: error instanceof Error ? error.message : "Internal server error."
      });
    }
  });

  server.listen(port, () => {
    console.log("BuildIT engine API is running on port " + port + ".");
  });
}
