import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { saveArtifactIndex } from "../artifacts/artifact-index-store.js";
import { saveStoredDataManifest } from "../artifacts/stored-data-manifest-store.js";
import { getJobArtifact, listJobArtifacts } from "../artifacts/job-artifacts.js";
import { listPersistedJobs, mergeJobs } from "../jobs/job-history-store.js";
import type { AppRuntime } from "../runtime/app-runtime.js";
import { createFailedMcpCapabilityReport, evaluateMcpCapabilities } from "../mcp/mcp-capabilities.js";
import type { ReferenceImageUpload } from "../storage/reference-images.js";

const maxJsonBodyBytes = 16 * 1024 * 1024;

class HttpRequestError extends Error {
  constructor(
    readonly statusCode: number,
    message: string
  ) {
    super(message);
  }
}

interface CreateJobBody {
  prompt?: string;
  imagePaths?: string[];
  referenceImages?: ReferenceImageUpload[];
  format?: string;
  autoReview?: boolean;
}

function normalizeFormat(format: string | undefined): "bedrock" | "bedrock_block" {
  return format === "bedrock_block" ? "bedrock_block" : "bedrock";
}

function isSafeJobId(jobId: string): boolean {
  return /^[a-zA-Z0-9_-]+$/.test(jobId);
}

function resolveErrorStatus(error: unknown): number {
  if (error instanceof HttpRequestError) return error.statusCode;

  if (error instanceof Error) {
    if (error.message.includes("Reference image") || error.message.includes("Reference upload")) return 400;
    if (error.message.includes("Invalid image data URL")) return 400;
    if (error.message.includes("MIME type")) return 400;
  }

  return 500;
}

async function readJsonBody<T>(request: IncomingMessage): Promise<T> {
  const chunks: Buffer[] = [];
  let bodyBytes = 0;

  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    bodyBytes += buffer.byteLength;

    if (bodyBytes > maxJsonBodyBytes) {
      throw new HttpRequestError(413, "Request body is too large. Maximum size is 16 MB.");
    }

    chunks.push(buffer);
  }

  const rawBody = Buffer.concat(chunks).toString("utf8");

  try {
    return rawBody ? (JSON.parse(rawBody) as T) : ({} as T);
  } catch {
    throw new HttpRequestError(400, "Request body must be valid JSON.");
  }
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

async function refreshArtifactManifests(outputDir: string, jobId: string) {
  await saveArtifactIndex(outputDir, jobId);
  const storedDataManifest = await saveStoredDataManifest(outputDir, jobId);
  const artifactIndex = await saveArtifactIndex(outputDir, jobId);
  return { artifactIndex, storedDataManifest };
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
        let mcpCapabilities;

        try {
          mcpCapabilities = evaluateMcpCapabilities(await runtime.blockbench.listTools());
        } catch (error) {
          mcpCapabilities = createFailedMcpCapabilityReport(error);
        }

        sendJson(response, 200, {
          status: "ok",
          ollamaConnected,
          visionConnected,
          blockbench,
          mcpCapabilities,
          options: runtime.getOptions()
        });
        return;
      }

      if (request.method === "GET" && url.pathname === "/api/jobs") {
        const persistedJobs = await listPersistedJobs(runtime.getOptions().outputDir);
        const jobs = mergeJobs(runtime.jobs.list(), persistedJobs);
        sendJson(response, 200, { jobs });
        return;
      }

      if (request.method === "POST" && url.pathname === "/api/jobs") {
        const body = await readJsonBody<CreateJobBody>(request);
        const prompt = body.prompt?.trim();

        if (!prompt) {
          sendJson(response, 400, { error: "Prompt is required." });
          return;
        }

        const format = normalizeFormat(body.format);

        const job = await runtime.createModelJob(
          {
            prompt,
            imagePaths: body.imagePaths ?? [],
            referenceImages: [],
            format,
            autoReview: body.autoReview ?? true
          },
          body.referenceImages ?? []
        );

        sendJson(response, 201, { job });
        return;
      }

      const artifactsMatch = url.pathname.match(/^\/api\/jobs\/([^/]+)\/artifacts$/);
      if (request.method === "GET" && artifactsMatch) {
        const jobId = artifactsMatch[1];
        if (!isSafeJobId(jobId)) {
          sendJson(response, 400, { error: "Invalid job id." });
          return;
        }

        const { artifactIndex, storedDataManifest } = await refreshArtifactManifests(runtime.getOptions().outputDir, jobId);
        const artifacts = await listJobArtifacts(runtime.getOptions().outputDir, jobId);
        sendJson(response, 200, { artifacts, artifactIndex, storedDataManifest });
        return;
      }

      const artifactMatch = url.pathname.match(/^\/api\/jobs\/([^/]+)\/artifacts\/([^/]+)$/);
      if (request.method === "GET" && artifactMatch) {
        const jobId = artifactMatch[1];
        if (!isSafeJobId(jobId)) {
          sendJson(response, 400, { error: "Invalid job id." });
          return;
        }

        if (artifactMatch[2] === "artifact_index" || artifactMatch[2] === "stored_data_manifest") {
          await refreshArtifactManifests(runtime.getOptions().outputDir, jobId);
        }

        const artifact = await getJobArtifact(runtime.getOptions().outputDir, jobId, artifactMatch[2]);
        if (!artifact) {
          sendJson(response, 404, { error: "Artifact not found." });
          return;
        }

        sendJson(response, 200, { artifact });
        return;
      }

      const jobMatch = url.pathname.match(/^\/api\/jobs\/([^/]+)$/);
      if (request.method === "GET" && jobMatch) {
        const jobId = jobMatch[1];
        if (!isSafeJobId(jobId)) {
          sendJson(response, 400, { error: "Invalid job id." });
          return;
        }

        const job = runtime.jobs.get(jobId);
        if (!job) {
          const artifact = await getJobArtifact(runtime.getOptions().outputDir, jobId, "job_snapshot");
          if (artifact?.available && artifact.content) {
            sendJson(response, 200, { job: artifact.content });
            return;
          }

          sendJson(response, 404, { error: "Job not found." });
          return;
        }

        sendJson(response, 200, { job });
        return;
      }

      sendNotFound(response);
    } catch (error) {
      sendJson(response, resolveErrorStatus(error), {
        error: error instanceof Error ? error.message : "Internal server error."
      });
    }
  });

  server.listen(port, () => {
    console.log("BuildIT engine API is running on port " + port + ".");
  });
}
