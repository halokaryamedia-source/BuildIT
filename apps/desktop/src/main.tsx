import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const engineUrl = "http://localhost:3987";
const maxReferenceImageBytes = 10 * 1024 * 1024;

type TargetFormat = "bedrock" | "bedrock_block";
type TerminalJobStatus = "completed" | "failed" | "cancelled";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ReferenceImageUpload {
  fileName: string;
  mimeType: string;
  dataUrl: string;
}

interface JobLog {
  at: string;
  message: string;
}

interface ModelJob {
  id: string;
  status: string;
  stage?: string;
  createdAt?: string;
  updatedAt?: string;
  logs: JobLog[];
  error?: string;
}

interface JobArtifactSummary {
  name: string;
  fileName: string;
  available: boolean;
  sizeBytes?: number;
  updatedAt?: string;
}

interface ArtifactIndex {
  artifacts: JobArtifactSummary[];
}

interface StoredDataManifest {
  openTargetPath: string;
  ready: boolean;
  missingRequiredFiles: string[];
}

interface ArtifactResponse {
  artifacts: JobArtifactSummary[];
  storedDataManifest?: StoredDataManifest;
}

interface JobArtifactContent extends JobArtifactSummary {
  content?: unknown;
  error?: string;
}

interface HealthState {
  ollamaConnected: boolean;
  visionConnected: boolean;
  blockbench?: { connected?: boolean };
  mcpCapabilities?: { valid?: boolean; missingTools?: string[] };
}

interface OpenStoredDataResponse {
  opened?: {
    path: string;
  };
  storedDataManifest?: StoredDataManifest;
  error?: string;
}

async function readJsonResponse<T>(response: Response, fallbackError: string): Promise<T> {
  const data = (await response.json()) as T & { error?: string };
  if (!response.ok) throw new Error(data.error ?? fallbackError);
  return data;
}

async function fetchJob(jobId: string): Promise<ModelJob> {
  const response = await fetch(engineUrl + "/api/jobs/" + jobId);
  const data = await readJsonResponse<{ job: ModelJob }>(response, "Unable to fetch job.");
  return data.job;
}

async function fetchJobs(): Promise<ModelJob[]> {
  const response = await fetch(engineUrl + "/api/jobs");
  const data = await readJsonResponse<{ jobs?: ModelJob[] }>(response, "Unable to fetch jobs.");
  return data.jobs ?? [];
}

async function fetchHealth(): Promise<HealthState> {
  const response = await fetch(engineUrl + "/api/health");
  return readJsonResponse<HealthState>(response, "Unable to fetch engine health.");
}

async function fetchJobArtifacts(jobId: string): Promise<ArtifactResponse> {
  const response = await fetch(engineUrl + "/api/jobs/" + jobId + "/artifacts");
  const data = await readJsonResponse<{
    artifacts?: JobArtifactSummary[];
    artifactIndex?: ArtifactIndex;
    storedDataManifest?: StoredDataManifest;
  }>(response, "Unable to fetch job artifacts.");

  return {
    artifacts: data.artifactIndex?.artifacts ?? data.artifacts ?? [],
    storedDataManifest: data.storedDataManifest
  };
}

async function fetchJobArtifact(jobId: string, artifactName: string): Promise<JobArtifactContent> {
  const response = await fetch(engineUrl + "/api/jobs/" + jobId + "/artifacts/" + artifactName);
  const data = await readJsonResponse<{ artifact: JobArtifactContent }>(response, "Unable to fetch artifact.");
  return data.artifact;
}

async function requestOpenStoredData(jobId: string): Promise<OpenStoredDataResponse> {
  const response = await fetch(engineUrl + "/api/jobs/" + jobId + "/open-stored-data", { method: "POST" });
  return readJsonResponse<OpenStoredDataResponse>(response, "Unable to open Stored Data Root.");
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Unable to read selected image."));
    reader.readAsDataURL(file);
  });
}

function getTargetLabel(format: TargetFormat): string {
  return format === "bedrock" ? "Bedrock Entity" : "Bedrock Block";
}

function getStageLabel(stage: string | undefined): string {
  switch (stage) {
    case "queued":
      return "Queued";
    case "saving_references":
      return "Saving references";
    case "analyzing_image":
      return "Analyzing image";
    case "planning_model":
      return "Planning model";
    case "validating_plan":
      return "Validating plan";
    case "building_mcp_actions":
      return "Building MCP actions";
    case "checking_mcp_capabilities":
      return "Checking MCP capabilities";
    case "executing_mcp":
      return "Executing in Blockbench";
    case "capturing_preview":
      return "Capturing preview";
    case "exporting_model":
      return "Exporting model";
    case "completed":
      return "Ready in Blockbench";
    case "failed":
      return "Needs attention";
    default:
      return "Not started";
  }
}

function formatJobTime(value: string | undefined): string {
  if (!value) return "Unknown time";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

function formatBytes(value: number | undefined): string {
  if (typeof value !== "number") return "pending";
  if (value < 1024) return value + " B";
  if (value < 1024 * 1024) return Math.round(value / 1024) + " KB";
  return (value / 1024 / 1024).toFixed(1) + " MB";
}

function validateSelectedImage(file: File): void {
  if (!file.type.startsWith("image/")) throw new Error("Please select an image file.");
  if (file.size > maxReferenceImageBytes) throw new Error("Reference image must be 10 MB or smaller.");
}

function isTerminalStatus(status: string): status is TerminalJobStatus {
  return status === "completed" || status === "failed" || status === "cancelled";
}

function getTerminalMessage(job: ModelJob): string {
  if (job.status === "completed") {
    return "Model ready in Blockbench. You can review the preview, Stored Data Root, and MCP execution report from BuildIT.";
  }

  if (job.status === "failed") {
    return job.error
      ? "Generation needs attention: " + job.error
      : "Generation needs attention. Check the MCP report and Stored Data Root for details.";
  }

  return "Job was cancelled.";
}

function findArtifact(artifacts: JobArtifactSummary[], artifactName: string): JobArtifactSummary | undefined {
  return artifacts.find((artifact) => artifact.name === artifactName && artifact.available);
}

function getPreviewDataUrl(artifact: JobArtifactContent | null): string | undefined {
  if (!artifact || artifact.name !== "blockbench_preview") return undefined;
  if (!artifact.content || typeof artifact.content !== "object") return undefined;
  const content = artifact.content as { imageDataUrl?: unknown };
  return typeof content.imageDataUrl === "string" && content.imageDataUrl.startsWith("data:image/")
    ? content.imageDataUrl
    : undefined;
}

function App() {
  const [prompt, setPrompt] = useState("");
  const [targetFormat, setTargetFormat] = useState<TargetFormat>("bedrock_block");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeJob, setActiveJob] = useState<ModelJob | null>(null);
  const [recentJobs, setRecentJobs] = useState<ModelJob[]>([]);
  const [artifacts, setArtifacts] = useState<JobArtifactSummary[]>([]);
  const [storedDataManifest, setStoredDataManifest] = useState<StoredDataManifest | null>(null);
  const [selectedArtifact, setSelectedArtifact] = useState<JobArtifactContent | null>(null);
  const [health, setHealth] = useState<HealthState | null>(null);
  const terminalNotifiedJobIds = useRef<Set<string>>(new Set());
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Choose Bedrock Entity or Bedrock Block, then upload a reference image or write a prompt. Bedrock Block means a placeable Minecraft Bedrock custom block."
    }
  ]);

  const activeJobId = activeJob?.id;
  const activeJobStatus = activeJob?.status;
  const previewDataUrl = getPreviewDataUrl(selectedArtifact);
  const previewArtifact = findArtifact(artifacts, "blockbench_preview");
  const executionReportArtifact = findArtifact(artifacts, "mcp_execution_report");
  const schemaMatchArtifact = findArtifact(artifacts, "mcp_action_schema_match");
  const readyCardVisible = Boolean(activeJob && isTerminalStatus(activeJob.status));

  function pushAssistantMessage(content: string) {
    setMessages((current) => [...current, { role: "assistant", content }]);
  }

  function applyArtifactResponse(response: ArtifactResponse) {
    setArtifacts(response.artifacts);
    setStoredDataManifest(response.storedDataManifest ?? null);
  }

  function notifyTerminalJob(job: ModelJob) {
    if (!isTerminalStatus(job.status) || terminalNotifiedJobIds.current.has(job.id)) return;
    terminalNotifiedJobIds.current.add(job.id);
    pushAssistantMessage(getTerminalMessage(job));
  }

  async function refreshRecentJobs() {
    try {
      const jobs = await fetchJobs();
      setRecentJobs(jobs.slice(0, 8));
    } catch {
      setRecentJobs([]);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function refreshHealth() {
      try {
        const nextHealth = await fetchHealth();
        if (!cancelled) setHealth(nextHealth);
      } catch {
        if (!cancelled) setHealth(null);
      }
    }

    void refreshHealth();
    void refreshRecentJobs();
    const timer = window.setInterval(() => {
      void refreshHealth();
      void refreshRecentJobs();
    }, 5000);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (!activeJobId) {
      setArtifacts([]);
      setStoredDataManifest(null);
      setSelectedArtifact(null);
      return;
    }

    let cancelled = false;
    const jobId = activeJobId;

    async function refreshArtifacts() {
      try {
        const nextArtifacts = await fetchJobArtifacts(jobId);
        if (!cancelled) applyArtifactResponse(nextArtifacts);
      } catch {
        if (!cancelled) setArtifacts([]);
      }
    }

    void refreshArtifacts();

    return () => {
      cancelled = true;
    };
  }, [activeJobId]);

  useEffect(() => {
    if (!activeJobId || !activeJobStatus || isTerminalStatus(activeJobStatus)) return;

    const jobId = activeJobId;
    const timer = window.setInterval(async () => {
      try {
        const nextJob = await fetchJob(jobId);
        const nextArtifacts = await fetchJobArtifacts(jobId);
        setActiveJob(nextJob);
        applyArtifactResponse(nextArtifacts);
        notifyTerminalJob(nextJob);
        void refreshRecentJobs();
      } catch (error) {
        pushAssistantMessage(error instanceof Error ? error.message : "Unable to refresh active job.");
      }
    }, 1500);

    return () => window.clearInterval(timer);
  }, [activeJobId, activeJobStatus]);

  async function createReferenceImageUpload(): Promise<ReferenceImageUpload[]> {
    if (!selectedFile) return [];
    validateSelectedImage(selectedFile);
    const dataUrl = await readFileAsDataUrl(selectedFile);
    return [{ fileName: selectedFile.name, mimeType: selectedFile.type, dataUrl }];
  }

  async function openArtifact(artifact: JobArtifactSummary) {
    if (!activeJobId || !artifact.available) return;

    try {
      const nextArtifact = await fetchJobArtifact(activeJobId, artifact.name);
      setSelectedArtifact(nextArtifact);
    } catch (error) {
      pushAssistantMessage(error instanceof Error ? error.message : "Unable to open artifact.");
    }
  }

  async function openNamedArtifact(artifactName: string) {
    const artifact = findArtifact(artifacts, artifactName);
    if (artifact) await openArtifact(artifact);
  }

  async function openStoredData() {
    if (!activeJobId) return;

    try {
      const result = await requestOpenStoredData(activeJobId);
      if (result.storedDataManifest) setStoredDataManifest(result.storedDataManifest);
      pushAssistantMessage("Opened Stored Data Root: " + (result.opened?.path ?? storedDataManifest?.openTargetPath ?? activeJobId));
    } catch (error) {
      pushAssistantMessage(error instanceof Error ? error.message : "Unable to open Stored Data Root.");
    }
  }

  async function openJob(jobId: string) {
    try {
      const job = await fetchJob(jobId);
      const nextArtifacts = await fetchJobArtifacts(jobId);
      setActiveJob(job);
      applyArtifactResponse(nextArtifacts);
      setSelectedArtifact(null);
      notifyTerminalJob(job);
    } catch (error) {
      pushAssistantMessage(error instanceof Error ? error.message : "Unable to open job.");
    }
  }

  function onSelectFile(file: File | null) {
    try {
      if (file) validateSelectedImage(file);
      setSelectedFile(file);
    } catch (error) {
      setSelectedFile(null);
      pushAssistantMessage(error instanceof Error ? error.message : "Invalid reference image.");
    }
  }

  async function submitJob() {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) return;

    setMessages((current) => [...current, { role: "user", content: getTargetLabel(targetFormat) + ": " + trimmedPrompt }]);
    setPrompt("");
    setArtifacts([]);
    setStoredDataManifest(null);
    setSelectedArtifact(null);

    try {
      const referenceImages = await createReferenceImageUpload();
      const response = await fetch(engineUrl + "/api/jobs", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          prompt: trimmedPrompt,
          referenceImages,
          imagePaths: [],
          format: targetFormat,
          autoReview: true
        })
      });
      const data = await readJsonResponse<{ job?: ModelJob }>(response, "Unable to create job.");
      if (!data.job) throw new Error("Unable to create job.");

      setActiveJob(data.job);
      setSelectedFile(null);
      await refreshRecentJobs();
      pushAssistantMessage(
        referenceImages.length > 0
          ? "Job created with a reference image for " + getTargetLabel(targetFormat) + ". BuildIT will notify you when the model is ready in Blockbench."
          : "Job created for " + getTargetLabel(targetFormat) + ". BuildIT will notify you when the model is ready in Blockbench."
      );
    } catch (error) {
      pushAssistantMessage(error instanceof Error ? error.message : "Unable to reach the engine API.");
    }
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <h1>BuildIT</h1>
        <p>Blockbench Auto Model Studio</p>
        <div className="status-card">
          <strong>Target type</strong>
          <span>{getTargetLabel(targetFormat)}</span>
        </div>
        <div className="status-card">
          <strong>Engine health</strong>
          <span>Main model: {health?.ollamaConnected ? "connected" : "offline"}</span>
          <span>Vision model: {health?.visionConnected ? "connected" : "offline"}</span>
          <span>Blockbench MCP: {health?.blockbench?.connected ? "connected" : "offline"}</span>
          <span>MCP tools: {health?.mcpCapabilities?.valid ? "valid" : "not ready"}</span>
        </div>
        <div className="status-card">
          <strong>Active job</strong>
          <span>{activeJob ? activeJob.status : "No active job"}</span>
          <span>Stage: {getStageLabel(activeJob?.stage)}</span>
        </div>
        <div className="status-card">
          <strong>Stored Data Root</strong>
          <span>{storedDataManifest?.openTargetPath ?? "No stored data yet"}</span>
          <span>{storedDataManifest?.ready ? "Ready to open" : "Waiting for required outputs"}</span>
          <button disabled={!activeJobId || !storedDataManifest} onClick={() => void openStoredData()}>
            Open Stored Data
          </button>
        </div>
        <div className="status-card">
          <strong>Artifacts</strong>
          <span>{artifacts.filter((artifact) => artifact.available).length} available</span>
        </div>
        <div className="recent-jobs">
          <strong>Recent jobs</strong>
          {recentJobs.length === 0 ? <span>No saved jobs</span> : null}
          {recentJobs.map((job) => (
            <button className="recent-job-button" key={job.id} onClick={() => void openJob(job.id)}>
              <span>{job.id}</span>
              <small>
                {job.status} · {getStageLabel(job.stage)}
              </small>
              <small>{formatJobTime(job.updatedAt ?? job.createdAt)}</small>
            </button>
          ))}
        </div>
      </aside>
      <section className="chat-panel">
        <div className="messages">
          {messages.map((message, index) => (
            <article className={`message ${message.role}`} key={index}>
              {message.content}
            </article>
          ))}
          {readyCardVisible && activeJob ? (
            <article className={"ready-card " + (activeJob.status === "completed" ? "success" : "failed")}>
              <strong>{activeJob.status === "completed" ? "Model ready in Blockbench" : "Generation needs attention"}</strong>
              <span>
                {activeJob.status === "completed"
                  ? "The generated model should now be available inside Blockbench. BuildIT has saved the review data below."
                  : activeJob.error ?? "Check the MCP diagnostics below to understand what failed."}
              </span>
              <div className="ready-actions">
                <button disabled={!previewArtifact} onClick={() => void openNamedArtifact("blockbench_preview")}>
                  View Preview
                </button>
                <button disabled={!activeJobId || !storedDataManifest} onClick={() => void openStoredData()}>
                  Open Stored Data
                </button>
                <button disabled={!executionReportArtifact} onClick={() => void openNamedArtifact("mcp_execution_report")}>
                  Check MCP Report
                </button>
                <button disabled={!schemaMatchArtifact} onClick={() => void openNamedArtifact("mcp_action_schema_match")}>
                  Check Schema Match
                </button>
              </div>
            </article>
          ) : null}
          {activeJob ? (
            <article className="job-card">
              <strong>{activeJob.id}</strong>
              <span>Status: {activeJob.status}</span>
              <span>Stage: {getStageLabel(activeJob.stage)}</span>
              <ul>
                {activeJob.logs.slice(-5).map((log) => (
                  <li key={log.at}>{log.message}</li>
                ))}
              </ul>
            </article>
          ) : null}
          {storedDataManifest ? (
            <article className="job-card">
              <strong>Stored Data Root</strong>
              <span>{storedDataManifest.openTargetPath}</span>
              <span>{storedDataManifest.ready ? "Ready to open" : "Missing: " + storedDataManifest.missingRequiredFiles.join(", ")}</span>
              <button onClick={() => void openStoredData()}>Open Stored Data</button>
            </article>
          ) : null}
          {artifacts.length > 0 ? (
            <article className="artifact-card">
              <strong>Job artifacts</strong>
              <ul>
                {artifacts.map((artifact) => (
                  <li key={artifact.name} className={artifact.available ? "available" : "missing"}>
                    <span>
                      <span>{artifact.fileName}</span>
                      <small>
                        {artifact.available
                          ? formatBytes(artifact.sizeBytes) + " · " + formatJobTime(artifact.updatedAt)
                          : "pending"}
                      </small>
                    </span>
                    <button disabled={!artifact.available} onClick={() => void openArtifact(artifact)}>
                      {artifact.available ? "View" : "Pending"}
                    </button>
                  </li>
                ))}
              </ul>
            </article>
          ) : null}
          {selectedArtifact ? (
            <article className="artifact-viewer">
              <strong>{selectedArtifact.fileName}</strong>
              {previewDataUrl ? <img className="preview-image" src={previewDataUrl} alt="Blockbench preview" /> : null}
              <pre>{JSON.stringify(selectedArtifact.content ?? selectedArtifact.error, null, 2)}</pre>
            </article>
          ) : null}
        </div>
        <div className="composer">
          <div className="target-selector">
            <label>
              <span>Project type</span>
              <select value={targetFormat} onChange={(event) => setTargetFormat(event.target.value as TargetFormat)}>
                <option value="bedrock">Bedrock Entity</option>
                <option value="bedrock_block">Bedrock Block</option>
              </select>
            </label>
            <p>Bedrock Block is a placeable Minecraft Bedrock custom block. Bedrock Entity is an entity model.</p>
          </div>
          <label className="file-picker">
            <span>{selectedFile ? selectedFile.name : "Select reference image up to 10 MB"}</span>
            <input type="file" accept="image/*" onChange={(event) => onSelectFile(event.target.files?.[0] ?? null)} />
          </label>
          <textarea
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="Describe the model you want to create..."
          />
          <button onClick={() => void submitJob()}>Generate</button>
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root") as HTMLElement).render(<App />);
