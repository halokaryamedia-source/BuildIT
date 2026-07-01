import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const engineUrl = "http://localhost:3987";
const maxReferenceImageBytes = 10 * 1024 * 1024;

type TargetFormat = "bedrock" | "bedrock_block";

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
  jobId: string;
  generatedAt: string;
  artifactCount: number;
  availableCount: number;
  artifacts: JobArtifactSummary[];
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

async function fetchJob(jobId: string): Promise<ModelJob> {
  const response = await fetch(engineUrl + "/api/jobs/" + jobId);
  const data = (await response.json()) as { job: ModelJob };
  return data.job;
}

async function fetchJobs(): Promise<ModelJob[]> {
  const response = await fetch(engineUrl + "/api/jobs");
  const data = (await response.json()) as { jobs: ModelJob[] };
  return data.jobs ?? [];
}

async function fetchHealth(): Promise<HealthState> {
  const response = await fetch(engineUrl + "/api/health");
  return (await response.json()) as HealthState;
}

async function fetchJobArtifacts(jobId: string): Promise<JobArtifactSummary[]> {
  const response = await fetch(engineUrl + "/api/jobs/" + jobId + "/artifacts");
  const data = (await response.json()) as { artifacts?: JobArtifactSummary[]; artifactIndex?: ArtifactIndex };
  return data.artifactIndex?.artifacts ?? data.artifacts ?? [];
}

async function fetchJobArtifact(jobId: string, artifactName: string): Promise<JobArtifactContent> {
  const response = await fetch(engineUrl + "/api/jobs/" + jobId + "/artifacts/" + artifactName);
  const data = (await response.json()) as { artifact: JobArtifactContent };
  return data.artifact;
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
      return "Completed";
    case "failed":
      return "Failed";
    default:
      return "Not started";
  }
}

function getPreviewDataUrl(artifact: JobArtifactContent | null): string | undefined {
  if (!artifact || artifact.name !== "blockbench_preview") return undefined;
  if (!artifact.content || typeof artifact.content !== "object") return undefined;

  const content = artifact.content as { imageDataUrl?: unknown };
  return typeof content.imageDataUrl === "string" && content.imageDataUrl.startsWith("data:image/")
    ? content.imageDataUrl
    : undefined;
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
  if (!file.type.startsWith("image/")) {
    throw new Error("Please select an image file.");
  }

  if (file.size > maxReferenceImageBytes) {
    throw new Error("Reference image must be 10 MB or smaller.");
  }
}

function App() {
  const [prompt, setPrompt] = useState("");
  const [targetFormat, setTargetFormat] = useState<TargetFormat>("bedrock_block");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeJob, setActiveJob] = useState<ModelJob | null>(null);
  const [recentJobs, setRecentJobs] = useState<ModelJob[]>([]);
  const [artifacts, setArtifacts] = useState<JobArtifactSummary[]>([]);
  const [selectedArtifact, setSelectedArtifact] = useState<JobArtifactContent | null>(null);
  const [health, setHealth] = useState<HealthState | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Choose Bedrock Entity or Bedrock Block, then upload a reference image or write a prompt. Bedrock Block means a placeable Minecraft Bedrock custom block."
    }
  ]);

  const previewDataUrl = getPreviewDataUrl(selectedArtifact);

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
    if (!activeJob) {
      setArtifacts([]);
      setSelectedArtifact(null);
      return;
    }

    let cancelled = false;

    async function refreshArtifacts() {
      const nextArtifacts = await fetchJobArtifacts(activeJob.id);
      if (!cancelled) setArtifacts(nextArtifacts);
    }

    void refreshArtifacts();

    return () => {
      cancelled = true;
    };
  }, [activeJob]);

  useEffect(() => {
    if (!activeJob || ["completed", "failed", "cancelled"].includes(activeJob.status)) return;

    const timer = window.setInterval(async () => {
      const nextJob = await fetchJob(activeJob.id);
      const nextArtifacts = await fetchJobArtifacts(activeJob.id);
      setActiveJob(nextJob);
      setArtifacts(nextArtifacts);
      void refreshRecentJobs();

      if (nextJob.status === "completed") {
        setMessages((current) => [
          ...current,
          { role: "assistant", content: "Model generation completed. Please open Blockbench to review the result." }
        ]);
      }

      if (nextJob.status === "failed") {
        setMessages((current) => [
          ...current,
          { role: "assistant", content: nextJob.error ?? "Model generation failed." }
        ]);
      }
    }, 1500);

    return () => window.clearInterval(timer);
  }, [activeJob]);

  async function createReferenceImageUpload(): Promise<ReferenceImageUpload[]> {
    if (!selectedFile) return [];

    validateSelectedImage(selectedFile);
    const dataUrl = await readFileAsDataUrl(selectedFile);

    return [
      {
        fileName: selectedFile.name,
        mimeType: selectedFile.type,
        dataUrl
      }
    ];
  }

  async function openArtifact(artifact: JobArtifactSummary) {
    if (!activeJob || !artifact.available) return;
    const nextArtifact = await fetchJobArtifact(activeJob.id, artifact.name);
    setSelectedArtifact(nextArtifact);
  }

  async function openJob(jobId: string) {
    try {
      const job = await fetchJob(jobId);
      const nextArtifacts = await fetchJobArtifacts(jobId);
      setActiveJob(job);
      setArtifacts(nextArtifacts);
      setSelectedArtifact(null);
    } catch (error) {
      setMessages((current) => [
        ...current,
        { role: "assistant", content: error instanceof Error ? error.message : "Unable to open job." }
      ]);
    }
  }

  function onSelectFile(file: File | null) {
    try {
      if (file) validateSelectedImage(file);
      setSelectedFile(file);
    } catch (error) {
      setSelectedFile(null);
      setMessages((current) => [
        ...current,
        { role: "assistant", content: error instanceof Error ? error.message : "Invalid reference image." }
      ]);
    }
  }

  async function submitJob() {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) return;

    setMessages((current) => [...current, { role: "user", content: getTargetLabel(targetFormat) + ": " + trimmedPrompt }]);
    setPrompt("");
    setArtifacts([]);
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

      const data = (await response.json()) as { job?: ModelJob; error?: string };

      if (!response.ok || !data.job) {
        throw new Error(data.error ?? "Unable to create job.");
      }

      setActiveJob(data.job);
      setSelectedFile(null);
      await refreshRecentJobs();
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            referenceImages.length > 0
              ? "Job created with a reference image for " + getTargetLabel(targetFormat) + "."
              : "Job created for " + getTargetLabel(targetFormat) + "."
        }
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        { role: "assistant", content: error instanceof Error ? error.message : "Unable to reach the engine API." }
      ]);
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
          <span>MCP tools: {health?.mcpCapabilities?.valid ? "valid" : "not ready"}</span>
        </div>
        <div className="status-card">
          <strong>Active job</strong>
          <span>{activeJob ? activeJob.status : "No active job"}</span>
          <span>Stage: {getStageLabel(activeJob?.stage)}</span>
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
            <p>
              Bedrock Block is a placeable Minecraft Bedrock custom block. Bedrock Entity is an entity model.
            </p>
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
          <button onClick={submitJob}>Generate</button>
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root") as HTMLElement).render(<App />);
